import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * useSearch — a robust "find on page" engine for the Operator Console.
 *
 * Strategy (non-destructive, tag-safe):
 *  1. Resolve the app content region (`<main>`) and collect text-bearing target
 *     elements (spoken lines, table cells, list items, callouts, cards, tags…).
 *  2. On first touch, snapshot each target's original innerHTML into a
 *     `data-search-orig` attribute. Content is static after mount, so the
 *     snapshot stays valid for the life of the page.
 *  3. To highlight: restore from snapshot, then walk text nodes with a
 *     TreeWalker (SHOW_TEXT) and wrap case-insensitive matches in
 *     `<mark data-hit>`. Walking text nodes never corrupts tags/entities.
 *  4. De-emphasize "beats"/"rows" that contain no match; clearing restores all.
 *  5. Track a "current" match so Enter / Shift+Enter can step through hits.
 *
 * The hook owns all DOM side-effects; the component stays declarative.
 */

/** Marks the active hit so callers can style + scroll to it. */
const CURRENT_ATTR = "data-hit-current";
const HIT_SELECTOR = "mark[data-hit]";
const ORIG_ATTR = "data-search-orig";
const DIM_ATTR = "data-search-dim";

/**
 * Text-bearing selectors within the main content region. `span` / `div` catch
 * tags, callouts and card copy that aren't semantic text elements. Nesting is
 * fine: highlightElement divides text between a parent and its nested targets
 * via the nearest-target rule, so nothing is double-wrapped or lost, and empty
 * layout wrappers are dropped (they hold no non-whitespace text).
 */
const TARGET_SELECTOR = [
  "[data-say]", // spoken lines — the core "what do I say" units
  "td", // table cells
  "th", // table headers
  "li", // list items
  "dt",
  "dd",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p", // paragraphs (cues, callout bodies, card copy)
  "blockquote",
  "figcaption",
  "caption",
  "span", // tags, text bubbles, inline labels
  "div", // callout bodies / card copy that hold text directly
].join(",");

/** Elements whose subtree, when match-free, gets visually de-emphasised. */
const BEAT_SELECTOR = "[data-say], tr";

/**
 * Chrome we must NOT rewrite: the hero <header> is Framer-Motion-managed and
 * the sticky rails strip is `no-print` interactive chrome. Rewriting their
 * innerHTML would fight Motion's animation engine / React reconciliation, so
 * any target inside one of these is skipped. The command bar lives outside
 * <main>, so it is already out of scope.
 */
const EXCLUDED_ANCESTORS = "header, .no-print";

const DEBOUNCE_MS = 90;
const MIN_QUERY = 2;

/** Escape a user string for safe use inside a RegExp. */
function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** True when the active element is a text-entry field we shouldn't hijack. */
export function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Collect text-bearing target elements inside `root`.
 *
 * Returns every selector match that holds non-whitespace text — including
 * nested ones (a callout <div> and the label <span> inside it). Double-wrapping
 * is prevented not by pruning here but in highlightElement, which only wraps a
 * text node when this element is that node's *nearest* collected target. That
 * also preserves mixed content: a callout's raw body text (a direct child of
 * the <div>, sibling to the label <span>) is highlighted by the <div>, while
 * the label text is highlighted by the <span> — neither is lost or duplicated.
 */
function collectTargets(root: HTMLElement): HTMLElement[] {
  const all = Array.from(root.querySelectorAll<HTMLElement>(TARGET_SELECTOR));
  return all.filter(
    (el) =>
      (el.textContent ?? "").trim().length > 0 &&
      el.closest(EXCLUDED_ANCESTORS) === null,
  );
}

/**
 * The outermost members of `targets` (those with no collected ancestor). We
 * snapshot + restore at this level only, so nested targets can't leave stale
 * snapshots after a parent's innerHTML is rewritten.
 */
function outermostOf(targets: HTMLElement[]): HTMLElement[] {
  return targets.filter(
    (el) => !targets.some((other) => other !== el && other.contains(el)),
  );
}

/** Lazily snapshot a target's pristine innerHTML (idempotent). */
function ensureSnapshot(el: HTMLElement): string {
  const existing = el.getAttribute(ORIG_ATTR);
  if (existing !== null) return existing;
  const html = el.innerHTML;
  el.setAttribute(ORIG_ATTR, html);
  return html;
}

/** Restore a target's pristine innerHTML from its snapshot, if present. */
function restore(el: HTMLElement): void {
  const orig = el.getAttribute(ORIG_ATTR);
  if (orig !== null && el.innerHTML !== orig) el.innerHTML = orig;
}

/**
 * The nearest ancestor-or-self of `node` that belongs to `targets`.
 * Used so each text node is highlighted by exactly one element.
 */
function nearestTarget(node: Node, targets: Set<HTMLElement>): HTMLElement | null {
  let cur: Node | null = node.parentNode;
  while (cur) {
    if (cur instanceof HTMLElement && targets.has(cur)) return cur;
    cur = cur.parentNode;
  }
  return null;
}

/**
 * Wrap every case-insensitive occurrence of `regex` within `el`'s *own* text
 * nodes (those whose nearest collected target is `el`) in a <mark data-hit>.
 * Returns the number of hits added. `targetSet` lets nested targets divide the
 * text between them so nothing is wrapped twice or dropped.
 */
function highlightElement(
  el: HTMLElement,
  regex: RegExp,
  targetSet: Set<HTMLElement>,
): number {
  const doc = el.ownerDocument;
  const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node = walker.nextNode();
  while (node) {
    if (
      node.nodeValue &&
      node.nodeValue.length > 0 &&
      nearestTarget(node, targetSet) === el
    ) {
      textNodes.push(node as Text);
    }
    node = walker.nextNode();
  }

  let hits = 0;
  for (const text of textNodes) {
    const value = text.nodeValue ?? "";
    regex.lastIndex = 0;
    if (!regex.test(value)) continue;

    regex.lastIndex = 0;
    const frag = doc.createDocumentFragment();
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(value)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      if (start > lastIndex) {
        frag.appendChild(doc.createTextNode(value.slice(lastIndex, start)));
      }
      const mark = doc.createElement("mark");
      mark.setAttribute("data-hit", "");
      mark.textContent = match[0];
      frag.appendChild(mark);
      hits += 1;
      lastIndex = end;
      // Guard against zero-length matches (shouldn't happen here).
      if (match[0].length === 0) regex.lastIndex += 1;
    }
    if (lastIndex < value.length) {
      frag.appendChild(doc.createTextNode(value.slice(lastIndex)));
    }
    text.parentNode?.replaceChild(frag, text);
  }
  return hits;
}

export interface UseSearchResult {
  /** Current query string. */
  query: string;
  /** Controlled setter for the input. */
  setQuery: (next: string) => void;
  /** Total number of highlighted hits. */
  count: number;
  /** True when the query is active (≥ MIN_QUERY) but produced zero hits. */
  noMatch: boolean;
  /** Whether a query is currently applied. */
  active: boolean;
  /** Clear the query and restore the page. */
  clear: () => void;
  /** Advance to the next match (Enter). */
  next: () => void;
  /** Step to the previous match (Shift+Enter). */
  prev: () => void;
}

export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);
  const trimmed = query.trim();
  const active = trimmed.length >= MIN_QUERY;
  const noMatch = active && count === 0;

  // Index of the "current" hit; -1 means none selected yet.
  const currentRef = useRef(-1);

  const getRoot = useCallback((): HTMLElement | null => {
    if (typeof document === "undefined") return null;
    return document.querySelector("main");
  }, []);

  const getHits = useCallback((): HTMLElement[] => {
    const root = getRoot();
    if (!root) return [];
    return Array.from(root.querySelectorAll<HTMLElement>(HIT_SELECTOR));
  }, [getRoot]);

  /** Remove all highlights + dimming and restore pristine content. */
  const restoreAll = useCallback(() => {
    const root = getRoot();
    if (!root) return;
    for (const el of outermostOf(collectTargets(root))) restore(el);
    root
      .querySelectorAll<HTMLElement>(`[${DIM_ATTR}]`)
      .forEach((el) => el.removeAttribute(DIM_ATTR));
    currentRef.current = -1;
  }, [getRoot]);

  /** Apply / remove the current-hit marker. */
  const markCurrent = useCallback(
    (index: number, scroll: boolean) => {
      const hits = getHits();
      hits.forEach((h) => h.removeAttribute(CURRENT_ATTR));
      if (hits.length === 0) {
        currentRef.current = -1;
        return;
      }
      const safe = ((index % hits.length) + hits.length) % hits.length;
      currentRef.current = safe;
      const target = hits[safe];
      target.setAttribute(CURRENT_ATTR, "");
      if (scroll) {
        target.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    },
    [getHits],
  );

  const next = useCallback(() => {
    if (!active) return;
    markCurrent(currentRef.current + 1, true);
  }, [active, markCurrent]);

  const prev = useCallback(() => {
    if (!active) return;
    markCurrent(currentRef.current - 1, true);
  }, [active, markCurrent]);

  const clear = useCallback(() => {
    setQuery("");
  }, []);

  // Core effect: debounced re-highlight whenever the query changes.
  useEffect(() => {
    const root = getRoot();
    if (!root) return;

    const apply = () => {
      // Snapshot + restore at the outermost block level so nested targets never
      // leave stale snapshots when a parent's innerHTML is rewritten.
      const blocks = outermostOf(collectTargets(root));
      for (const el of blocks) {
        ensureSnapshot(el);
        restore(el);
      }

      if (!active) {
        root
          .querySelectorAll<HTMLElement>(`[${DIM_ATTR}]`)
          .forEach((el) => el.removeAttribute(DIM_ATTR));
        currentRef.current = -1;
        setCount(0);
        return;
      }

      // Re-collect after restore: innerHTML rewrites replaced the prior nodes,
      // so the element identities the nearest-target check relies on must be
      // taken from the freshly-restored DOM.
      const targets = collectTargets(root);
      const targetSet = new Set(targets);
      const regex = new RegExp(escapeRegExp(trimmed), "gi");
      let total = 0;
      for (const el of targets) total += highlightElement(el, regex, targetSet);

      // De-emphasise beats/rows that contain no hit.
      const beats = Array.from(root.querySelectorAll<HTMLElement>(BEAT_SELECTOR));
      for (const beat of beats) {
        if (beat.querySelector(HIT_SELECTOR)) {
          beat.removeAttribute(DIM_ATTR);
        } else {
          beat.setAttribute(DIM_ATTR, "");
        }
      }

      setCount(total);
      // Reset selection to the first hit (no scroll — let Enter drive that).
      currentRef.current = total > 0 ? 0 : -1;
      if (total > 0) markCurrent(0, false);
    };

    const id = window.setTimeout(apply, DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [trimmed, active, getRoot, markCurrent]);

  // On unmount, leave the page pristine.
  useEffect(() => restoreAll, [restoreAll]);

  return useMemo(
    () => ({ query, setQuery, count, noMatch, active, clear, next, prev }),
    [query, count, noMatch, active, clear, next, prev],
  );
}

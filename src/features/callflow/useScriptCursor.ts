import { useCallback, useEffect, useRef, useState } from "react";
import { isTypingTarget } from "./useDrawers";

/**
 * The teleprompter cursor for the center script.
 *
 * One spoken line is "active" (bold + enlarged). The reader advances with the
 * keyboard — ArrowDown/ArrowRight/Space go to the next line, ArrowUp/ArrowLeft/
 * Shift+Space to the previous — clamped at both ends (no wrap). Clicking any line
 * activates it too.
 *
 * The arrow flow walks ONLY the beats' spoken lines (`navIds`): the Gate branches
 * are conditional — you read one path or the other, never both — so they're
 * clickable-to-activate but excluded from the sequence. If the active line is a
 * branch line (she clicked one), the arrows resume from `lastNavIndex`.
 *
 * Keyboard handling lives on its own window listener, guarded by the shared
 * `isTypingTarget` so typing in the objection filter never moves the cursor, and
 * coexisting with useDrawers' own `[`/`]`/`Esc` listener.
 *
 * The active line is scrolled to center on change (smooth unless the user prefers
 * reduced motion). The very first activation on mount is skipped so the page
 * opens at the top showing ① Open rather than re-centred mid-column.
 */
export interface ScriptCursor {
  /** The id of the currently active (spoken) line. */
  activeId: string;
  /** Activate a line by id (mouse affordance). Updates the nav fallback when navigable. */
  setActive: (id: string) => void;
  /** Register a line's DOM node so it can be scrolled into view. */
  registerLine: (id: string) => (el: HTMLElement | null) => void;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

export function useScriptCursor(navIds: string[]): ScriptCursor {
  // Default to the first navigable line so one line is bold on load.
  const [activeId, setActiveId] = useState<string>(() => navIds[0] ?? "");

  // Fallback index for resuming arrow nav after a branch line was clicked.
  const lastNavIndex = useRef(0);
  // Element map id -> node, for scrollIntoView.
  const lineRefs = useRef(new Map<string, HTMLElement>());
  // Skip the auto-scroll on the very first render so the page opens at the top.
  const mounted = useRef(false);

  // Keep navIds + activeId reachable from the stable keydown handler without
  // re-binding the listener on every change.
  const navIdsRef = useRef(navIds);
  navIdsRef.current = navIds;
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const setActive = useCallback((id: string) => {
    setActiveId(id);
    const idx = navIdsRef.current.indexOf(id);
    if (idx !== -1) lastNavIndex.current = idx;
  }, []);

  const registerLine = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) lineRefs.current.set(id, el);
      else lineRefs.current.delete(id);
    },
    [],
  );

  // Arrow / space navigation over the navigable (beat) lines only.
  useEffect(() => {
    function move(delta: 1 | -1) {
      const ids = navIdsRef.current;
      if (ids.length === 0) return;
      const cur = ids.indexOf(activeIdRef.current);
      // If the active line isn't navigable (a branch line), resume from fallback.
      const base = cur === -1 ? lastNavIndex.current : cur;
      const next = Math.min(Math.max(base + delta, 0), ids.length - 1);
      lastNavIndex.current = next;
      setActiveId(ids[next]);
    }

    function onKey(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          move(1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          move(-1);
          break;
        case " ": // Space → next, Shift+Space → previous.
          e.preventDefault();
          move(e.shiftKey ? -1 : 1);
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scroll the active line to center whenever it changes (skip initial mount).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const el = lineRefs.current.get(activeId);
    el?.scrollIntoView({
      block: "center",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [activeId]);

  return { activeId, setActive, registerLine };
}

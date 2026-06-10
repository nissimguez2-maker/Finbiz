import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useSearch, isTypingTarget } from "./useSearch";

/**
 * CommandBar — the live "what do I say" find-on-page bar.
 *
 * The rep is on a call and needs to surface a line instantly. Typing (≥2 chars)
 * highlights every match in the script and de-emphasises non-matching beats and
 * table rows; clearing restores the page. Keyboard: "/" focuses, Esc clears +
 * blurs, Enter / Shift+Enter step through matches.
 *
 * Mirrors the original stub's chrome (sticky `top-0 z-40 h-14`, mono input,
 * Electric-Blue focus ring, `no-print`) so the Shell layout stays intact.
 * All match styling is injected via a scoped <style> below to avoid touching
 * global CSS.
 */

/**
 * Scoped highlight styles. Kept in-component (per task constraints) and on
 * brand with Electric Blue (#0052FF / accent-secondary #4D7CFF). Respects
 * prefers-reduced-motion via a guarded transition.
 */
const MARK_STYLES = `
mark[data-hit] {
  background: linear-gradient(180deg, rgba(0,82,255,0.16), rgba(77,124,255,0.16));
  color: inherit;
  border-radius: 4px;
  padding: 0 1px;
  box-shadow: inset 0 0 0 1px rgba(0,82,255,0.28);
  scroll-margin-block: 40vh;
}
mark[data-hit-current] {
  background: linear-gradient(180deg, #0052ff, #4d7cff);
  color: #ffffff;
  box-shadow: 0 0 0 2px rgba(0,82,255,0.35), 0 4px 14px rgba(0,82,255,0.25);
}
[data-search-dim] {
  opacity: 0.32;
  transition: opacity 160ms ease;
  filter: saturate(0.7);
}
@media (prefers-reduced-motion: reduce) {
  [data-search-dim] { transition: none; }
}
@media print {
  mark[data-hit], mark[data-hit-current] {
    background: transparent !important;
    color: inherit !important;
    box-shadow: none !important;
  }
  [data-search-dim] { opacity: 1 !important; filter: none !important; }
}
`;

export function CommandBar() {
  const { query, setQuery, count, noMatch, active, clear, next, prev } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global "/" to focus the search (unless the rep is already typing somewhere).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isTypingTarget(e.target) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      clear();
      inputRef.current?.blur();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) prev();
      else next();
    }
  };

  const statusLabel = active ? (noMatch ? "no match" : `${count} ${count === 1 ? "hit" : "hits"}`) : "";

  return (
    <div className="no-print sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-6 backdrop-blur sm:px-10">
      <style>{MARK_STYLES}</style>
      <div className="group relative flex flex-1 items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          aria-label="Search the script — what do I say"
          aria-keyshortcuts="Slash Enter Escape"
          aria-describedby="commandbar-status"
          placeholder="What do I say?  Try “rate”, “credit”, “expensive”…   ( / to focus )"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKeyDown}
          autoComplete="off"
          spellCheck={false}
          className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-24 font-mono text-[13px] text-foreground shadow-sm transition-shadow placeholder:text-muted-foreground focus-ring focus-visible:border-accent/40 focus-visible:shadow-accent"
        />

        {/* Match count + clear, right-aligned inside the input. */}
        <div className="pointer-events-none absolute right-2 flex items-center gap-1.5">
          <span
            id="commandbar-status"
            role="status"
            aria-live="polite"
            className={[
              "select-none font-mono text-[11px] tabular-nums",
              noMatch ? "text-clay" : "text-muted-foreground",
              active ? "opacity-100" : "opacity-0",
            ].join(" ")}
          >
            {statusLabel}
          </span>
          {active && (
            <button
              type="button"
              onClick={() => {
                clear();
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="pointer-events-auto inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

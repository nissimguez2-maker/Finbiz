import { Search } from "lucide-react";

/**
 * STUB — replaced by the search specialist agent with a working "what do I say"
 * command palette (live filter/highlight of .say lines + objections, "/" focus,
 * Esc clear, match count). Renders the bar chrome so the shell compiles.
 */
export function CommandBar() {
  return (
    <div className="no-print sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-6 backdrop-blur sm:px-10">
      <div className="relative flex flex-1 items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          aria-label="Search the script"
          placeholder="What do I say?  Try “rate”, “credit”, “expensive”…   ( / to focus )"
          className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 font-mono text-[13px] text-foreground placeholder:text-muted-foreground focus-ring"
        />
      </div>
    </div>
  );
}

import { rails } from "@/content/meta";

/** Always-on compliance rails — a slim inverted strip under the command bar. */
export function RailsStrip() {
  return (
    <div className="no-print sticky top-[57px] z-30 overflow-hidden border-b border-foreground/80 bg-foreground">
      <div className="dot-texture pointer-events-none absolute inset-0" />
      <div className="relative flex flex-wrap items-center gap-x-0 gap-y-1 px-6 py-1.5 sm:px-10">
        <span className="mr-3 flex items-center gap-1.5 border-r border-white/15 pr-3 font-mono text-[9.5px] font-semibold uppercase tracking-label text-accent-secondary">
          <span className="h-1 w-1 rounded-full bg-accent-secondary motion-safe:animate-pulse-dot" />
          Rails
        </span>
        {rails.map((r, i) => (
          <span
            key={i}
            className="border-r border-white/10 px-3 font-mono text-[10.5px] tracking-wide text-white/75 first:pl-0 last:border-r-0"
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

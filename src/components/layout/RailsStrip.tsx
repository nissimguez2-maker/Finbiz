import { rails } from "@/content/meta";

/** Always-on compliance rails — a slim inverted strip under the command bar. */
export function RailsStrip() {
  return (
    <div className="no-print sticky top-[57px] z-30 flex flex-wrap items-center gap-x-0 gap-y-1 border-b border-foreground/80 bg-foreground px-6 py-1.5 sm:px-10">
      <span className="mr-3 border-r border-white/15 pr-3 font-mono text-[9.5px] font-semibold uppercase tracking-label text-accent-secondary">
        Rails
      </span>
      {rails.map((r, i) => (
        <span
          key={i}
          className="border-r border-white/10 px-3 font-mono text-[10.5px] tracking-wide text-white/75 last:border-r-0 first:pl-0"
        >
          {r}
        </span>
      ))}
    </div>
  );
}

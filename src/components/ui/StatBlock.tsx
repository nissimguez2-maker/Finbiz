import { cn } from "@/lib/cn";
import type { StatCell } from "@/types/content";

/** Metric grid. On inverted (dark) sections pass `inverted`. */
export function StatBlock({
  cells,
  inverted,
  className,
}: {
  cells: StatCell[];
  inverted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden rounded-2xl border",
        inverted ? "border-white/10 bg-white/10" : "border-border bg-border",
        "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
        className,
      )}
    >
      {cells.map((c, i) => (
        <div key={i} className={cn("p-4", inverted ? "bg-foreground" : "bg-card")}>
          <div
            className={cn(
              "font-mono text-[9.5px] uppercase tracking-label",
              inverted ? "text-white/55" : "text-muted-foreground",
            )}
          >
            {c.k}
          </div>
          <div
            className={cn(
              "mt-1.5 font-mono text-2xl font-semibold leading-none tnum",
              c.hot ? "text-accent" : inverted ? "text-white" : "text-foreground",
            )}
          >
            {c.v}
          </div>
        </div>
      ))}
    </div>
  );
}

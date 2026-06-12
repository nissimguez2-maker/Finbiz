import { cn } from "@/lib/cn";
import { Callout } from "@/components/ui";
import { routingRule, routingBranches } from "./callScript";

/**
 * A STATIC, indented decision tree for product routing — not an interactive
 * graph. Each branch reads as `when → then`, with the optional note tucked under
 * it, led by the "read first" routing rule. Pure layout over `routingBranches`;
 * arrows + indentation carry the structure so it scans top-to-bottom on a call.
 */
export function RoutingTree() {
  return (
    <div className="flex flex-col gap-3">
      {routingRule && <Callout {...routingRule} />}

      <ol className="flex flex-col">
        {routingBranches.map((b, i) => {
          const last = i === routingBranches.length - 1;
          return (
            <li key={i} className="relative flex gap-3 pb-3 last:pb-0">
              {/* Connector spine: a vertical rule + an elbow into each node. */}
              <div className="relative flex w-4 shrink-0 justify-center" aria-hidden="true">
                <span
                  className={cn(
                    "absolute left-1/2 top-0 w-px -translate-x-1/2 bg-border",
                    last ? "h-[18px]" : "h-full",
                  )}
                />
                <span className="absolute left-1/2 top-[17px] h-px w-2 bg-border" />
                <span className="absolute left-1/2 top-[14px] h-[7px] w-[7px] -translate-x-1/2 rounded-full border border-accent/50 bg-card" />
              </div>

              <div className="min-w-0 flex-1 pt-2">
                <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 leading-snug">
                  <span className="text-sm font-semibold text-foreground">{b.when}</span>
                  <span aria-hidden="true" className="font-mono text-accent">
                    →
                  </span>
                  <span className="font-mono text-[13px] font-semibold text-accent">{b.then}</span>
                </p>
                {b.note && (
                  <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{b.note}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

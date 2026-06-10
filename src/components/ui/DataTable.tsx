import { cn } from "@/lib/cn";
import type { TableRow } from "@/types/content";

/**
 * Clean, scannable table used across Statements / Minimum File / Final QA /
 * Objections / Pipeline. Supports sub-header rows and a leading number badge.
 */
export function DataTable({
  columns,
  rows,
  className,
}: {
  columns: string[];
  rows: TableRow[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th
                key={i}
                className="border-b border-border bg-muted/60 px-4 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            if (r.subhead) {
              return (
                <tr key={i}>
                  <td
                    colSpan={columns.length}
                    className="border-b border-border bg-muted/40 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {r.subhead}
                  </td>
                </tr>
              );
            }
            return (
              <tr key={i} className="last:border-0">
                {r.no !== undefined && (
                  <td className="border-b border-border/70 px-4 py-3 align-top">
                    <span className="font-mono text-xs font-semibold text-accent tnum">{r.no}</span>
                  </td>
                )}
                {r.cells.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      "border-b border-border/70 px-4 py-3 align-top",
                      j === 0 && r.emphasize && "font-semibold text-foreground",
                      j === 0 ? "text-foreground" : "text-muted-foreground",
                    )}
                    dangerouslySetInnerHTML={cellHtml(cell)}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Content data may include lightweight inline emphasis via **bold** markers and
 * <em>…</em> — render them safely (data is first-party, authored in repo/docs).
 */
function cellHtml(s: string): { __html: string } {
  const html = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\[\[([^\]]+)\]\]/g, '<em class="text-muted-foreground/80 not-italic">$1</em>');
  return { __html: html };
}

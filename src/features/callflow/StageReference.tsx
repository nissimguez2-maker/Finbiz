import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  coreFileRows,
  conditionalFileRows,
  fileNote,
  type Step,
  type BranchId,
} from "./callScript";
import type { TableRow } from "@/types/content";

/* Inline **bold** emphasis used in the file rows / note. */
function inlineHtml(s: string): { __html: string } {
  const html = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  return { __html: html };
}

/**
 * The only stage-contextual reference that stays on the LEFT (script) side: the
 * Close collect-list — what to actually ask for. Everything product/threshold
 * related now lives in the right-hand Product Matrix; objections are the toggled
 * view. So this renders for Close only.
 */
export function StageReference({ stage }: { stage: Step; branch: BranchId }) {
  if (stage === "close") return <CloseReference />;
  return null;
}

function FileRow({ row }: { row: TableRow }) {
  return (
    <li className="flex items-start gap-3 border-b border-border/60 py-2 last:border-0">
      <span className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-accent/40" aria-hidden="true" />
      <div className="min-w-0">
        {row.cells.map((cell, i) => (
          <span
            key={i}
            className={cn(
              "block leading-snug",
              i === 0 ? "text-sm font-semibold text-foreground" : "text-[12.5px] text-muted-foreground",
            )}
            dangerouslySetInnerHTML={inlineHtml(cell)}
          />
        ))}
      </div>
    </li>
  );
}

function CloseReference() {
  const [showMore, setShowMore] = useState(false);
  const core = coreFileRows();
  const conditional = conditionalFileRows();
  return (
    <div className="space-y-3">
      {fileNote && <p className="text-base font-semibold leading-snug text-foreground">{fileNote}</p>}
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-label text-muted-foreground">
          Core — non-negotiable
        </p>
        <ul className="mt-2">
          {core.map((row, i) => (
            <FileRow key={i} row={row} />
          ))}
        </ul>
      </div>
      {conditional.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowMore((s) => !s)}
            aria-expanded={showMore}
            className="focus-ring inline-flex items-center gap-1.5 rounded-md font-mono text-[11px] font-semibold uppercase tracking-wider text-accent"
          >
            <span aria-hidden="true">{showMore ? "▾" : "▸"}</span>
            {showMore ? "Hide conditional" : `More — conditional (${conditional.length})`}
          </button>
          {showMore && (
            <ul className="mt-2">
              {conditional.map((row, i) => (
                <FileRow key={i} row={row} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

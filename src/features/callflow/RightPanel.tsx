import { useMemo, useState } from "react";
import type { TableSection } from "@/types/content";
import { inlineMarkup } from "@/lib/inlineBold";
import { NeutralCallout } from "./LeftPanel";
import {
  objectionList,
  dealKillers,
  compliancePairs,
  statementRead,
  minimumFileRead,
  finalQaRead,
  pipelineRead,
} from "./content";

/**
 * Right panel — "Run the call". Objections first (with the small filter input),
 * then Deal killers, the don't-say / say compliance pairs, Statement read,
 * Minimum file, Final QA, and the Pipeline. Plain rows separated by whitespace
 * and hairlines; one neutral callout style; no colour, tags, or boxes.
 */
export function RightPanel() {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return objectionList;
    return objectionList.filter(
      (o) => o.q.toLowerCase().includes(q) || o.reframe.toLowerCase().includes(q),
    );
  }, [filter]);

  return (
    <div className="space-y-12">
      <section>
        <h3 className="section-head">Objections</h3>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter objections…"
          aria-label="Filter objections"
          className="mb-5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="space-y-6">
          {filtered.map((o) => (
            <div key={o.q}>
              <p className="item-head" dangerouslySetInnerHTML={inlineMarkup(o.q)} />
              <p
                className="mt-1.5 text-[15px] leading-relaxed text-foreground"
                dangerouslySetInnerHTML={inlineMarkup(o.reframe)}
              />
              {o.note && <p className="mt-1 text-xs italic text-muted-foreground">{o.note}</p>}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">No objections match “{filter}”.</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="section-head">Deal killers</h3>
        <dl className="space-y-4">
          {dealKillers.map((d) => (
            <div key={d.issue}>
              <dt className="item-head" dangerouslySetInnerHTML={inlineMarkup(d.issue)} />
              <dd
                className="mt-0.5 text-[15px] leading-relaxed text-foreground"
                dangerouslySetInnerHTML={inlineMarkup(d.move)}
              />
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h3 className="section-head">Compliance — don't say / say</h3>
        <dl className="space-y-4">
          {compliancePairs.map((c) => (
            <div key={c.dont}>
              <dt className="flex gap-2 text-[15px] leading-snug text-muted-foreground">
                <span className="eyebrow shrink-0 pt-0.5">Don't</span>
                <span dangerouslySetInnerHTML={inlineMarkup(c.dont)} />
              </dt>
              <dd className="mt-1 flex gap-2 text-[15px] font-medium leading-snug text-foreground">
                <span className="eyebrow shrink-0 pt-0.5 text-accent">Say</span>
                <span dangerouslySetInnerHTML={inlineMarkup(c.say)} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <TableBlock title="Statement read" section={statementRead} />
      <TableBlock title="Minimum file" section={minimumFileRead} />
      <TableBlock title="Final QA" section={finalQaRead} />

      <section>
        <h3 className="section-head">Pipeline</h3>
        <ol className="space-y-3">
          {pipelineRead.steps.map((s) => (
            <li key={s.n} className="flex gap-3">
              <span className="eyebrow shrink-0 pt-1 text-muted-foreground">{s.n}</span>
              <span>
                <span className="text-[15px] font-semibold text-foreground">{s.title}</span>
                <span className="ml-1.5 text-[15px] text-foreground">{s.desc}</span>
              </span>
            </li>
          ))}
        </ol>

        <h4 className="eyebrow mb-3 mt-7 text-muted-foreground">Discovery must surface</h4>
        <dl className="space-y-3">
          {pipelineRead.questions.map((q) => (
            <div key={q.n}>
              <dt className="text-[15px] font-semibold text-foreground">{q.ask}</dt>
              <dd className="mt-0.5 text-[15px] text-foreground">{q.reveals}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4">
          <NeutralCallout callout={pipelineRead.settles} />
        </div>
      </section>
    </div>
  );
}

/** A TableSection (Statements / Minimum file / Final QA) rendered as plain rows. */
function TableBlock({ title, section }: { title: string; section: TableSection }) {
  return (
    <section>
      <h3 className="section-head">{title}</h3>

      <div className="space-y-3">
        {section.rows.map((row, i) =>
          row.subhead ? (
            <p key={i} className="eyebrow pt-2 text-muted-foreground">
              {row.subhead}
            </p>
          ) : (
            <RowBlock key={i} cells={row.cells} columns={section.columns} />
          ),
        )}
      </div>

      {/* note + callouts below */}
      {section.note && (
        <p
          className="mt-4 text-sm leading-relaxed text-muted-foreground"
          dangerouslySetInnerHTML={inlineMarkup(section.note)}
        />
      )}

      {section.callouts && section.callouts.length > 0 && (
        <div className="mt-4 space-y-3">
          {section.callouts.map((co) => (
            <NeutralCallout key={co.label} callout={co} />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * One data row: first cell is the bold lead; the rest carry their column label
 * inline. Tables with a leading "#" column (Statements) have one more column
 * than cells, so we align labels by the trailing offset, never index 0..n.
 */
function RowBlock({ cells, columns }: { cells: string[]; columns: string[] }) {
  // e.g. Statements: 4 columns, 3 cells → offset 1, so cell c uses columns[c+1].
  const offset = Math.max(0, columns.length - cells.length);
  return (
    <div className="border-t border-border pt-3 first:border-t-0">
      {cells.map((cell, c) => {
        const label = columns[c + offset];
        const showLabel = c > 0 && columns.length > 1 && label;
        return (
          <p
            key={c}
            className={
              c === 0
                ? "item-head"
                : "mt-0.5 text-[15px] leading-relaxed text-foreground"
            }
            dangerouslySetInnerHTML={inlineMarkup(showLabel ? `${label}: ${cell}` : cell)}
          />
        );
      })}
    </div>
  );
}

import { Section, DataTable, Card } from "@/components/ui";
import { objections } from "@/content/objections";

/** 08 — Defense: reframes, deal killers, and the compliance language rails. */
export function Objections() {
  const { meta, objections: list, dealKillers, compliance } = objections;
  return (
    <Section meta={meta}>
      <div className="space-y-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((o) => (
            <Card key={o.q} className="p-5">
              <strong className="block font-display text-[15px] text-foreground">{o.q}</strong>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.reframe}</p>
              {o.note && (
                <p className="mt-1.5 font-mono text-[11px] leading-snug text-muted-foreground/80">
                  {o.note}
                </p>
              )}
            </Card>
          ))}
        </div>

        <div>
          <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-label text-muted-foreground">
            Deal killers
          </h3>
          <DataTable
            columns={["Issue", "Your move"]}
            rows={dealKillers.map((d) => ({ emphasize: true, cells: [d.issue, d.move] }))}
          />
        </div>

        <div>
          <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-label text-muted-foreground">
            Compliance — language rails
          </h3>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="grid grid-cols-2 border-b border-border bg-muted/60">
              <span className="px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-clay">
                Do not say
              </span>
              <span className="border-l border-border px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-go">
                Say instead
              </span>
            </div>
            {compliance.map((pair) => (
              <div key={pair.dont} className="grid grid-cols-2 border-b border-border/70 last:border-0">
                <span className="bg-clay/[0.06] px-4 py-3 align-top text-sm text-foreground">
                  {pair.dont}
                </span>
                <span className="border-l border-border/70 bg-go/[0.07] px-4 py-3 align-top text-sm text-foreground">
                  {pair.say}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

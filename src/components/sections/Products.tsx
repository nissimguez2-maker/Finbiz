import { Section, DataTable, Card, Tag, Callout } from "@/components/ui";
import type { TableRow } from "@/types/content";
import { products } from "@/content/products";

/** 02 — Fit: the whole product menu, plus spoken-line pitch cards and the rails. */
export function Products() {
  const { meta, products: catalog, pitches, relationshipNote, rails } = products;

  const rows: TableRow[] = catalog.map((p) => {
    const marker = p.primary
      ? " [[· Primary]]"
      : p.relationshipPlay
        ? " [[· Relationship play]]"
        : "";
    return {
      cells: [`**${p.name}** [[${p.tag}]]${marker}`, p.bestFit, p.terms, p.speed, p.sayIt],
      emphasize: p.primary,
    };
  });

  return (
    <Section meta={meta}>
      <div className="space-y-7">
        <DataTable
          columns={["Product", "Best fit", "Terms", "Speed", "Say it / caveat"]}
          rows={rows}
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pitches.map((pitch) => (
            <Card key={pitch.title} interactive>
              <div className="flex items-start justify-between gap-3">
                <strong className="block font-display text-[15px] leading-snug">{pitch.title}</strong>
                {pitch.tag && <Tag color={pitch.tag}>{pitch.tag}</Tag>}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{pitch.say}</p>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
                {pitch.cue}
              </p>
            </Card>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Callout {...relationshipNote} />
          <Callout {...rails} />
        </div>
      </div>
    </Section>
  );
}

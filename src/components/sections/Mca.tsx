import { Section, StatBlock, Callout, DataTable } from "@/components/ui";
import type { TableRow } from "@/types/content";
import { mca } from "@/content/mca";

/** 03 — Structure: how the MCA math works, for the rep. Never quoted live. */
export function Mca() {
  const { meta, example, factorNote, whenNote, weeklyNote, gatesNote, riskNote, loops } = mca;

  const rows: TableRow[] = loops.map((loop) => ({
    cells: [`**${loop.k}**`, loop.v],
  }));

  return (
    <Section meta={meta}>
      <div className="space-y-6">
        <StatBlock cells={example} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Callout {...factorNote} />
          <Callout {...whenNote} />
          {weeklyNote && <Callout {...weeklyNote} />}
          {gatesNote && <Callout {...gatesNote} className="sm:col-span-2" />}
          {riskNote && <Callout {...riskNote} className="sm:col-span-2" />}
        </div>

        <DataTable columns={["What to read", "Why it matters"]} rows={rows} />
      </div>
    </Section>
  );
}

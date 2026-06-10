import { Section, DataTable, Callout } from "@/components/ui";
import { statements } from "@/content/statements";

/** 05 — Statement Read: the four-step read that lets you lane the file. */
export function Statements() {
  const { meta, columns, rows, callouts } = statements;
  return (
    <Section meta={meta}>
      <div className="space-y-6">
        <DataTable columns={columns} rows={rows} />
        {callouts?.map((c) => (
          <Callout key={c.label} {...c} />
        ))}
      </div>
    </Section>
  );
}

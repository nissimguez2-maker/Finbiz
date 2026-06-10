import { Section, Card, DataTable, Callout } from "@/components/ui";
import { pipeline } from "@/content/pipeline";

/** 07 — Flow: the twelve stages and the discovery questions that settle a call. */
export function Pipeline() {
  const { meta, steps, questions, settles } = pipeline;
  return (
    <Section meta={meta}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.n} interactive className="p-4">
              <span className="font-mono text-xs font-semibold tracking-wider text-accent tnum">
                {step.n}
              </span>
              <strong className="mt-1.5 block font-display text-[15px] text-foreground">
                {step.title}
              </strong>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </Card>
          ))}
        </div>

        <DataTable
          columns={["#", "Ask", "What it reveals"]}
          rows={questions.map((q) => ({ no: q.n, cells: [q.ask, q.reveals] }))}
        />

        <Callout {...settles} />
      </div>
    </Section>
  );
}

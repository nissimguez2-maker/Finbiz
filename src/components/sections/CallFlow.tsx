import { Section, Beat, Say, Cue, TextBubble, Callout, Card } from "@/components/ui";
import { callFlow } from "@/content/callFlow";

/** 01 — Live: the top-to-bottom talk track. */
export function CallFlow() {
  const { meta, rule, beats, branches } = callFlow;
  return (
    <Section meta={meta} pulse>
      <div className="space-y-6">
        {rule && <Callout {...rule} />}

        <div className="space-y-6">
          {beats.map((beat) => (
            <Beat key={beat.label} label={beat.label}>
              {beat.says.map((s, i) => (
                <Say key={i}>{s}</Say>
              ))}
              {beat.texts && beat.texts.length > 0 && (
                <div className="flex flex-col items-start gap-1.5 pt-0.5">
                  {beat.texts.map((t, i) => (
                    <TextBubble key={i}>{t}</TextBubble>
                  ))}
                </div>
              )}
              {beat.cues?.map((c, i) => (
                <Cue key={i}>{c}</Cue>
              ))}
            </Beat>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {branches.map((b) => (
            <Card key={b.title}>
              <strong className="mb-2 block font-display text-[15px]">{b.title}</strong>
              <div className="space-y-2">
                {b.says.map((s, i) => (
                  <Say key={i}>{s}</Say>
                ))}
                {b.cues?.map((c, i) => (
                  <Cue key={i}>{c}</Cue>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

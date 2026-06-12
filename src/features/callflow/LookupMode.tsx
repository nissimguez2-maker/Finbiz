import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import { Callout } from "@/components/ui";
import { RoutingTree } from "./RoutingTree";
import {
  mcaHardGates,
  mcaHardGatesNote,
  verticalAppetite,
  structuringPlays,
  posture,
  writtenRails,
  compliancePairs,
  dealKillers,
} from "./callScript";
import type { Tone } from "@/types/content";

/**
 * Quick Lookup — the reference surface of the 2.0 shell. A dense, scannable,
 * SCROLLABLE page (not a marketing page): everything a rep might need to glance
 * at mid-call without leaving the flow. Five sections, in the approved order:
 *
 *   1. Routing decision tree   2. MCA hard gates   3. Funder appetite
 *   4. Structuring play        5. Compliance & posture
 *
 * All data comes through the callScript facade; layout reuses console primitives
 * (console-card / console-rule / eyebrow) so it reads as one tool, not a site.
 */
export function LookupMode() {
  return (
    // A <main> (one per rendered mode) so the persistent CommandBar's
    // find-on-page works over the reference content in Lookup too.
    <main aria-label="Quick Lookup" className="pane-scroll px-5 py-6 sm:px-7">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <Section no="01" title="Routing decision tree">
          <div className="console-card p-4 sm:p-5">
            <RoutingTree />
          </div>
        </Section>

        <Section no="02" title="MCA hard gates">
          <div className="grid gap-3 sm:grid-cols-3">
            {mcaHardGates.map((gate, i) => (
              <div key={i} className="console-card flex flex-col gap-1.5 p-4">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  <span className="eyebrow text-foreground">{gate.label}</span>
                </div>
                <p className="text-[13px] leading-snug text-muted-foreground">{gate.test}</p>
              </div>
            ))}
          </div>
          {mcaHardGatesNote && <Callout className="mt-3" {...mcaHardGatesNote} />}
        </Section>

        <Section no="03" title="Funder appetite">
          <ul className="console-card divide-y divide-border/60 overflow-hidden">
            {verticalAppetite.map((row, i) => (
              <li key={i} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-4">
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center self-start rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-label sm:w-44",
                    toneChip(row.tone),
                  )}
                >
                  {row.label}
                </span>
                <p className="min-w-0 text-[13px] leading-snug text-foreground">{row.verdict}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section no="04" title="Structuring play">
          <div className="flex flex-col gap-3">
            {structuringPlays.map((play, i) => (
              <Callout key={i} {...play} />
            ))}
          </div>
        </Section>

        <Section no="05" title="Compliance & posture">
          <div className="console-card flex flex-col gap-4 p-4 sm:p-5">
            <Callout {...posture} />

            <div>
              <h3 className="eyebrow mb-2">Written rails — never put in an SMS / email</h3>
              <ul className="flex flex-col gap-2">
                {writtenRails.map((rail, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] leading-snug text-foreground">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-clay"
                    />
                    <span className="min-w-0">{rail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="console-rule pt-4">
              <h3 className="eyebrow mb-2">Verbal — say this, not that</h3>
              <ul className="flex flex-col gap-2">
                {compliancePairs.map((pair, i) => (
                  <li
                    key={i}
                    className="grid gap-1 sm:grid-cols-[1fr_auto_1fr] sm:items-baseline sm:gap-3"
                  >
                    <span className="text-[13px] leading-snug text-muted-foreground line-through decoration-clay/60">
                      {pair.dont}
                    </span>
                    <span aria-hidden="true" className="hidden font-mono text-accent sm:inline">
                      →
                    </span>
                    <span className="text-[13px] font-medium leading-snug text-foreground">
                      {pair.say}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="console-rule pt-4">
              <h3 className="eyebrow mb-2">Deal killers — surface early</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {dealKillers.map((dk, i) => (
                  <li key={i} className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-semibold leading-snug text-foreground">
                      {dk.issue}
                    </span>
                    <span className="text-[12.5px] leading-snug text-muted-foreground">
                      {dk.move}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}

/** A labelled lookup section: a numbered mono eyebrow over its body. */
function Section({ no, title, children }: { no: string; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="tnum font-mono text-[11px] font-semibold text-accent">{no}</span>
        <h2 className="font-display text-lg leading-none text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

/** Tone → chip styling for the funder-appetite verdicts. */
function toneChip(tone: Tone | undefined): string {
  switch (tone) {
    case "go":
      return "border-go/30 bg-go/10 text-go";
    case "amber":
      return "border-amber/30 bg-amber/10 text-amber";
    case "clay":
      return "border-clay/30 bg-clay/10 text-clay";
    case "accent":
      return "border-accent/30 bg-accent/10 text-accent";
    default:
      return "border-surface-2-border bg-surface-2 text-surface-2-foreground";
  }
}

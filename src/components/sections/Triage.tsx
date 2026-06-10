import { Section, Callout } from "@/components/ui";
import { cn } from "@/lib/cn";
import { triage } from "@/content/triage";
import type { Lane } from "@/types/content";

/** 04 — Triage: lane the file (PUSH / REVIEW / WEAK) — not underwriting. */
export function Triage() {
  const { meta, lanes, rule } = triage;
  return (
    <Section meta={meta}>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lanes.map((lane) => (
            <LaneCard key={lane.name} lane={lane} />
          ))}
        </div>
        <Callout {...rule} />
      </div>
    </Section>
  );
}

const toneBorder: Record<Lane["tone"], string> = {
  go: "border-t-go",
  amber: "border-t-amber",
  clay: "border-t-clay",
};

const toneText: Record<Lane["tone"], string> = {
  go: "text-go",
  amber: "text-amber",
  clay: "text-clay",
};

const toneChip: Record<Lane["tone"], string> = {
  go: "border-go/25 bg-go/[0.07] text-go",
  amber: "border-amber/30 bg-amber/[0.08] text-amber",
  clay: "border-clay/25 bg-clay/[0.06] text-clay",
};

const toneDot: Record<Lane["tone"], string> = {
  go: "bg-go",
  amber: "bg-amber",
  clay: "bg-clay",
};

function LaneCard({ lane }: { lane: Lane }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-t-2 border-border bg-card p-6 shadow-md",
        toneBorder[lane.tone],
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className={cn("font-display text-lg", toneText[lane.tone])}>{lane.name}</h3>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-label",
            toneChip[lane.tone],
          )}
        >
          {lane.verdict}
        </span>
      </div>
      <ul className="space-y-2">
        {lane.items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[14px] leading-snug text-muted-foreground">
            <span className={cn("mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full", toneDot[lane.tone])} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

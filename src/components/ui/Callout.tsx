import { cn } from "@/lib/cn";
import type { Callout as CalloutData, Tone } from "@/types/content";

const toneStyles: Record<Exclude<Tone, "neutral">, string> = {
  accent: "border-accent/20 bg-accent/[0.05] text-foreground",
  go: "border-go/20 bg-go/[0.07] text-foreground",
  amber: "border-amber/25 bg-amber/[0.08] text-foreground",
  clay: "border-clay/20 bg-clay/[0.06] text-foreground",
};

const labelTone: Record<Exclude<Tone, "neutral">, string> = {
  accent: "text-accent",
  go: "text-go",
  amber: "text-amber",
  clay: "text-clay",
};

export function Callout({ tone, label, body, className }: CalloutData & { className?: string }) {
  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm", toneStyles[tone], className)}>
      <span
        className={cn(
          "mb-1 block font-mono text-[10px] font-semibold uppercase tracking-label",
          labelTone[tone],
        )}
      >
        {label}
      </span>
      {body}
    </div>
  );
}

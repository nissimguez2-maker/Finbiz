import { cn } from "@/lib/cn";
import type { Callout as CalloutData, Tone } from "@/types/content";

const toneStyles: Record<Tone, string> = {
  accent: "border-accent/20 bg-accent/[0.05] text-foreground",
  go: "border-go/20 bg-go/[0.07] text-foreground",
  amber: "border-amber/25 bg-amber/[0.08] text-foreground",
  clay: "border-clay/20 bg-clay/[0.06] text-foreground",
  // neutral reads as the warm sand surface so it's clearly non-white on the page
  neutral: "border-surface-2-border bg-surface-2 text-foreground",
};

const labelTone: Record<Tone, string> = {
  accent: "text-accent",
  go: "text-go",
  amber: "text-amber",
  clay: "text-clay",
  neutral: "text-surface-2-foreground",
};

const barTone: Record<Tone, string> = {
  accent: "bg-accent-gradient",
  go: "bg-go",
  amber: "bg-amber",
  clay: "bg-clay",
  neutral: "bg-surface-2-border",
};

export function Callout({ tone, label, body, className }: CalloutData & { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border pl-5 pr-4 py-3 text-sm",
        toneStyles[tone],
        className,
      )}
    >
      {/* signature tone bar — quiet accent rail along the leading edge */}
      <span className={cn("absolute inset-y-0 left-0 w-1", barTone[tone])} aria-hidden="true" />
      <span
        className={cn(
          "mb-1 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-label",
          labelTone[tone],
        )}
      >
        {label}
      </span>
      {body}
    </div>
  );
}

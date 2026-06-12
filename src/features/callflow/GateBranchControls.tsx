import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { UseCallFlow } from "./useCallFlow";
import type { BranchId } from "./callScript";

type Branch = Exclude<BranchId, null>;

interface BranchButton {
  branch: Branch;
  hotkey: string;
  label: string;
  /** Lane-semantic tone (GUIDED-FLOW §2 Gate): qualifies→go, light→amber, funded→accent. */
  tone: "go" | "amber" | "accent";
}

const BUTTONS: BranchButton[] = [
  { branch: "qualifies", hotkey: "1", label: "Qualifies →", tone: "go" },
  { branch: "light", hotkey: "2", label: "Numbers light", tone: "amber" },
  { branch: "funded", hotkey: "3", label: "Already funded", tone: "accent" },
];

const toneIdle: Record<BranchButton["tone"], string> = {
  go: "border-go/30 bg-go/[0.06] text-foreground hover:border-go/60 hover:bg-go/10 focus-visible:ring-go",
  amber:
    "border-amber/30 bg-amber/[0.07] text-foreground hover:border-amber/60 hover:bg-amber/12 focus-visible:ring-amber",
  accent:
    "border-accent/30 bg-accent/[0.06] text-foreground hover:border-accent/60 hover:bg-accent/10 focus-visible:ring-accent",
};

const toneSelected: Record<BranchButton["tone"], string> = {
  // go-strong (not go) so the white CTA label clears AA — white on go is only
  // ~3.5:1; on go-strong it is 5.36:1. Label stays text-lg font-bold either way.
  go: "border-go-strong bg-go-strong text-white",
  amber: "border-amber bg-amber text-white",
  accent: "border-accent bg-accent text-accent-foreground",
};

const keyTone: Record<BranchButton["tone"], string> = {
  go: "border-go/40 text-go",
  amber: "border-amber/40 text-amber",
  accent: "border-accent/40 text-accent",
};

/**
 * The three live branch buttons shown at the Gate (GUIDED-FLOW §2). Each carries
 * its hotkey label and lane-coded tone. When the rep reaches the decision point
 * (`awaitingBranch`) the controls take on a solid accent border + tint, bolder
 * labels, and a single one-shot lift so it's clear a choice is owed — no looping
 * motion. If Space/→ is pressed with no lane picked, the controls flash an
 * accent ring (driven by `flow.branchNudge`) instead of silently doing nothing.
 */
export function GateBranchControls({ flow }: { flow: UseCallFlow }) {
  const awaiting = flow.awaitingBranch;

  // Flash a one-shot ring whenever a refused next() bumps branchNudge.
  const [flash, setFlash] = useState(false);
  const firstNudge = useRef(flow.branchNudge);
  useEffect(() => {
    // Ignore the mount-time value; only react to real bumps.
    if (flow.branchNudge === firstNudge.current) return;
    setFlash(true);
    const t = window.setTimeout(() => setFlash(false), 600);
    return () => window.clearTimeout(t);
  }, [flow.branchNudge]);

  return (
    <div
      className={cn(
        "rounded-xl border p-3.5 transition-colors",
        awaiting ? "border-accent bg-accent/[0.05]" : "border-border",
        awaiting && "animate-nudge-up",
        flash && "animate-ring-flash",
      )}
    >
      <div className="mb-2.5 flex items-center justify-between pl-1.5">
        <span className={cn("eyebrow", awaiting && "text-accent")}>
          Where do the two numbers land?
        </span>
        {awaiting && (
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-label text-accent">
            <span className="live-dot bg-accent" aria-hidden="true" />
            Pick a lane
          </span>
        )}
      </div>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {BUTTONS.map((b) => {
          const selected = flow.branch === b.branch;
          return (
            <button
              key={b.branch}
              type="button"
              onClick={() => flow.setBranch(b.branch)}
              aria-pressed={selected}
              className={cn(
                "focus-ring flex min-h-[44px] flex-col gap-1.5 rounded-xl border px-3.5 py-3 text-left transition-colors",
                selected ? toneSelected[b.tone] : toneIdle[b.tone],
                awaiting && !selected && "ring-1 ring-accent/20",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-md border font-mono text-xs font-bold",
                  // Idle: sand chip so the hotkey reads as a distinct badge against
                  // the lane's tinted fill; keeps the tone-coded text/border.
                  selected
                    ? "border-white/40 text-white"
                    : cn("bg-surface-2", keyTone[b.tone]),
                )}
                aria-hidden="true"
              >
                {b.hotkey}
              </span>
              <span className="text-lg font-bold leading-tight">{b.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

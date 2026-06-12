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
 * its hotkey label and lane-coded tone. When the rep has reached the decision
 * point (`awaitingBranch`) the controls lift and pulse-attention so it's clear a
 * choice is owed; once a branch is chosen it stays highlighted.
 */
export function GateBranchControls({ flow }: { flow: UseCallFlow }) {
  const awaiting = flow.awaitingBranch;
  return (
    <div
      className={cn(
        "rounded-xl border p-3.5 transition-colors",
        awaiting ? "border-accent/40 bg-accent/[0.03]" : "border-border",
      )}
    >
      <div className="mb-2.5 flex items-center justify-between pl-1.5">
        <span className="eyebrow">Where do the two numbers land?</span>
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

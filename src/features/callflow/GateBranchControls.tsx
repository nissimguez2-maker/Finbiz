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
  go: "border-go bg-go text-white shadow-md",
  amber: "border-amber bg-amber text-white shadow-md",
  accent: "border-transparent bg-accent-gradient text-accent-foreground shadow-accent",
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
        "relative overflow-hidden rounded-xl border p-3.5 shadow-sm transition-colors",
        awaiting ? "border-accent/40 bg-accent/[0.03]" : "border-border bg-card/50",
      )}
    >
      {/* signature accent rail — lights up when a lane is owed. */}
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-1 transition-opacity",
          awaiting ? "bg-accent-gradient opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      />
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
                "focus-ring group flex min-h-[44px] flex-col gap-1.5 rounded-xl border px-3.5 py-3 text-left transition-all duration-200",
                "hover:-translate-y-0.5",
                selected ? toneSelected[b.tone] : toneIdle[b.tone],
                awaiting && !selected && "ring-1 ring-accent/20",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-md border font-mono text-xs font-bold",
                  selected ? "border-white/40 text-white" : keyTone[b.tone],
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

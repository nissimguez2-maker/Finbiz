import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { STEP_LABELS, type Step } from "./callScript";
import type { UseCallFlow } from "./useCallFlow";

/** The six canonical stages always shown on the stepper, in order. */
const CANONICAL: Step[] = ["open", "story", "gate", "dig", "pitch", "close"];

/** Branch id → the short label shown in the Branch slot once Gate is resolved. */
const BRANCH_SLOT_LABEL: Record<Exclude<UseCallFlow["branch"], null>, string> = {
  qualifies: "Qualifies",
  light: "Light",
  funded: "Funded",
};

/**
 * Horizontal, clickable stage stepper. Renders the six canonical stages with a
 * Branch slot after the Gate, highlights the active step with the signature
 * accent-gradient bar, disables post-gate steps until a branch is chosen, and
 * offers a "New call" reset plus compact hotkey hints. Chrome — not printed.
 */
export function StageStepper({ flow }: { flow: UseCallFlow }) {
  const { stage, branch, goTo, resetCall } = flow;

  // The branch screens (light/funded) live "inside" the Gate→Close gap. While
  // on a branch screen, treat the Gate as still the visually-active anchor's
  // successor: highlight the Branch slot.
  const onBranchScreen = stage === "light" || stage === "funded";
  const postGateLocked = branch === null;

  return (
    <nav
      aria-label="Call stages"
      className="no-print flex h-16 shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-muted/30 px-4 scroll-thin sm:px-6"
    >
      <ol className="flex flex-1 items-center gap-0.5">
        {CANONICAL.map((step, i) => {
          const isActive = step === stage;
          const isGate = step === "gate";
          // Steps after the Gate are unreachable until the rep picks a lane.
          const isPostGate = i > CANONICAL.indexOf("gate");
          const disabled = isPostGate && postGateLocked;

          return (
            <li key={step} className="flex items-center">
              <StepButton
                no={i + 1}
                label={STEP_LABELS[step]}
                active={isActive}
                disabled={disabled}
                onClick={() => goTo(step)}
              />
              {/* Branch slot sits between Gate and Dig. */}
              {isGate && (
                <>
                  <Connector />
                  <BranchSlot
                    active={onBranchScreen}
                    label={branch ? BRANCH_SLOT_LABEL[branch] : null}
                  />
                </>
              )}
              {i < CANONICAL.length - 1 && <Connector />}
            </li>
          );
        })}
      </ol>

      <div className="flex shrink-0 items-center gap-3 pl-2">
        <Hints />
        <button
          type="button"
          onClick={resetCall}
          aria-label="Start a new call"
          className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 font-mono text-[11px] font-semibold uppercase tracking-label text-muted-foreground transition-colors hover:border-accent/30 hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          New call
        </button>
      </div>
    </nav>
  );
}

function StepButton({
  no,
  label,
  active,
  disabled,
  onClick,
}: {
  no: number;
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? "step" : undefined}
      className={cn(
        "focus-ring relative flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] transition-colors",
        active
          ? "font-semibold text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        disabled && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted-foreground",
      )}
    >
      {/* Signature accent bar marks the active stage. */}
      <span
        className={cn(
          "absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-accent-gradient transition-opacity duration-200",
          active ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          "tnum font-mono text-[11px] font-semibold",
          active ? "text-accent" : "text-muted-foreground/70",
        )}
      >
        {String(no).padStart(2, "0")}
      </span>
      {label}
    </button>
  );
}

function BranchSlot({ active, label }: { active: boolean; label: string | null }) {
  return (
    <div
      aria-current={active ? "step" : undefined}
      className={cn(
        "relative flex items-center rounded-lg border border-dashed px-3 py-1.5 font-mono text-[11px] uppercase tracking-label transition-colors",
        label
          ? active
            ? "border-accent/40 bg-accent/[0.07] font-semibold text-accent"
            : "border-border text-muted-foreground"
          : "border-border/60 text-muted-foreground/50",
      )}
    >
      <span
        className={cn(
          "absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-accent-gradient transition-opacity duration-200",
          active ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      />
      {label ?? "Branch"}
    </div>
  );
}

function Connector() {
  return (
    <span
      aria-hidden="true"
      className="mx-0.5 h-px w-4 shrink-0 bg-border sm:w-6"
    />
  );
}

function Hints() {
  return (
    <div
      className="hidden items-center gap-2 font-mono text-[10px] text-muted-foreground/70 xl:flex"
      aria-hidden="true"
    >
      <Hint k="←/→" v="step" />
      <Hint k="1·2·3" v="lane" />
    </div>
  );
}

function Hint({ k, v }: { k: string; v: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
        {k}
      </kbd>
      {v}
    </span>
  );
}

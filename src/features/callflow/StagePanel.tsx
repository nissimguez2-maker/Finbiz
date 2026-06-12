import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { Cue, TextBubble } from "@/components/ui/Beat";
import type { NoteKey } from "@/features/notes/useNotes";
import { StageReference } from "./StageReference";
import { GateBranchControls } from "./GateBranchControls";
import { ObjectionsPanel } from "./ObjectionsPanel";
import { stepLines, stepCues, stepTexts, branchTitle, pitchFramePhrase, type Step } from "./callScript";
import type { UseCallFlow } from "./useCallFlow";

/**
 * One-tap "capture to Notes" affordances per stage (GUIDED-FLOW §2, decision
 * D5 — manual, never auto-filled). Each opens the Notes drawer with the named
 * field focused. The labels are UI chrome, not script copy.
 */
const CAPTURE_FIELDS: Partial<Record<Step, { field: NoteKey; label: string }[]>> = {
  story: [{ field: "ifMoney", label: "His goal" }],
  gate: [
    { field: "revenue", label: "Revenue" },
    { field: "tenure", label: "Time in biz" },
  ],
  dig: [{ field: "pain", label: "The pain" }],
  close: [{ field: "nextStep", label: "Next step" }],
};

/**
 * The left pane — "what I say." The line you're on is the single hero: display
 * size, high-contrast, the only thing wearing an accent bullet. Lines you've
 * already said collapse to a quiet "‹ N said" tick; the next one or two recede
 * to small muted ticks indented under the hero, so the column reads as one
 * dominant line, not a list. The hero NEVER vanishes — opening objections (`o`)
 * keeps it on screen and stacks the comebacks below it, so you never lose your
 * place mid-sentence. The lower area is the Close collect-list, the objections,
 * or (at the Gate) the branch controls. No coaching/compliance chrome.
 */
export function StagePanel({
  flow,
  pitchProduct,
  onCaptureNote,
}: {
  flow: UseCallFlow;
  pitchProduct: string;
  onCaptureNote: (field: NoteKey) => void;
}) {
  const { stage, lineIndex, objectionsOpen } = flow;
  const captures = CAPTURE_FIELDS[stage];

  const raw = stepLines(stage);
  // Resolve the Pitch opener's "[term loan / line / advance]" blank from the
  // product selected on the right matrix.
  const lines =
    stage === "pitch"
      ? raw.map((l, i) => (i === 0 ? l.replace(/a \[[^\]]*\]/i, pitchFramePhrase(pitchProduct)) : l))
      : raw;

  const cues = stepCues(stage);
  const isBranchScreen = stage === "light" || stage === "funded";
  const lineCount = lines.length;
  const showReference = !objectionsOpen && stage === "close";

  // How many lines are already behind us (collapsed to a quiet affordance).
  const saidCount = lineIndex;
  // Upcoming lines: with objections open we drop them entirely so the hero +
  // comebacks own the pane; otherwise we show the next two and tick the rest.
  const upcomingShown = objectionsOpen ? 0 : 2;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      {/* Header: where we are + the one toggle (script ⇄ objections). */}
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className={cn("eyebrow", isBranchScreen && "text-accent")}>
            {isBranchScreen ? branchTitle(stage) : "Script"}
          </h2>
          {lineCount > 1 && (
            // Full muted-foreground (not /70) so "Line 2/4" clears AA at this
            // small size — the receded line treatment carries the "you are here".
            <span className="eyebrow tnum text-muted-foreground">
              Line {lineIndex + 1}/{lineCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={flow.toggleObjections}
          aria-pressed={objectionsOpen}
          className={cn(
            "focus-ring inline-flex h-8 items-center gap-2 rounded-lg border px-3 font-mono text-[11px] font-semibold uppercase tracking-label transition-colors",
            objectionsOpen
              ? "border-accent bg-accent/[0.06] text-accent"
              : "border-surface-2-border bg-surface-2 text-surface-2-foreground hover:border-accent/40 hover:text-foreground",
          )}
        >
          {objectionsOpen ? "Back to script" : "Objections"}
          <kbd className="kbd-hint" aria-hidden="true">o</kbd>
        </button>
      </div>

      {/* The hero block — ALWAYS mounted, even with objections open, so the line
          you're reading never disappears out from under you. When there's no
          lower scroll region (no objections, no Close list), this block itself
          becomes the scroll region so a short laptop can't clip the hero / gate
          controls under the footer (#13). */}
      <div
        className={cn(
          "flex flex-col gap-4",
          objectionsOpen || showReference
            ? "shrink-0"
            : "min-h-0 flex-1 overflow-y-auto scroll-thin",
        )}
      >
        {/* Already-said lines collapse to a single quiet affordance. */}
        {saidCount > 0 && (
          <span className="eyebrow inline-flex items-center gap-1 text-muted-foreground/70">
            <span aria-hidden="true">‹</span>
            {saidCount} said
          </span>
        )}

        {/* The current line is the hero; upcoming lines recede under it. */}
        <ol className="flex flex-col gap-2">
          {lines.map((line, i) => {
            if (i < lineIndex) return null; // collapsed into "‹ N said" above
            const current = i === lineIndex;
            if (!current && i - lineIndex > upcomingShown) return null;
            return (
              <li
                key={i}
                className={cn("flex items-start gap-3", !current && "pl-5")}
              >
                {/* Bullet auto-centers on the first text line: the wrapper is
                    exactly one line-box tall (1lh) and shares the line's
                    font-size + line-height, so `items-center` drops the dot at
                    that line's optical middle. The hero is the ONLY line with an
                    accent bullet + display size; the rest get a thin muted tick. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-[1lh] shrink-0 items-center",
                    current
                      ? "font-display text-[clamp(1.875rem,2vw+1.1rem,3.25rem)] leading-[1.28]"
                      : "font-sans text-[15px] leading-snug",
                  )}
                >
                  <span
                    className={cn(
                      "rounded-full transition-all",
                      current ? "h-2.5 w-2.5 bg-accent" : "h-1 w-1 bg-muted-foreground/30",
                    )}
                  />
                </span>
                <p
                  data-say
                  className={cn(
                    "say-line min-w-0 transition-all",
                    current
                      ? "max-w-[38ch] font-display text-[clamp(1.875rem,2vw+1.1rem,3.25rem)] font-semibold leading-[1.28] tracking-[-0.01em] text-foreground"
                      : "max-w-[44ch] font-sans text-[15px] font-light leading-snug text-muted-foreground/45",
                  )}
                >
                  {line}
                </p>
              </li>
            );
          })}
        </ol>

        {/* Coaching cues + stage actions hide while objections are up, so the
            comebacks below sit directly under the still-visible hero line. */}
        {!objectionsOpen && (
          <>
            {cues.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {cues.map((c, i) => (
                  <Cue key={i}>{c}</Cue>
                ))}
              </div>
            )}

            {captures && captures.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {captures.map((c) => (
                  <CaptureButton
                    key={c.field}
                    label={c.label}
                    onClick={() => onCaptureNote(c.field)}
                  />
                ))}
              </div>
            )}

            {stage === "close" && <CloseTexts texts={stepTexts("close")} />}
            {stage === "gate" && <GateBranchControls flow={flow} />}
          </>
        )}
      </div>

      {/* Lower area: objections (toggled, any stage — stacked UNDER the hero) or
          the Close collect list. */}
      {(objectionsOpen || showReference) && (
        <div className="min-h-0 flex-1 overflow-y-auto scroll-thin border-t border-border/60 pt-4">
          {objectionsOpen ? <ObjectionsPanel /> : <StageReference stage={stage} branch={flow.branch} />}
        </div>
      )}
    </div>
  );
}

/** A one-tap "capture to Notes" affordance — opens Notes with `label`'s field
 *  focused. Manual entry only (no auto-fill); the rep types what she heard. */
function CaptureButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Capture “${label}” to call notes`}
      className="focus-ring inline-flex h-8 items-center gap-1.5 rounded-lg border border-surface-2-border bg-surface-2 px-2.5 font-mono text-[11px] font-semibold uppercase tracking-label text-surface-2-foreground transition-colors hover:border-accent/40 hover:text-foreground"
    >
      <Plus className="h-3 w-3 text-accent-strong" aria-hidden="true" />
      {label}
    </button>
  );
}

/** The Close stage's literal SMS bubbles, each copy-to-clipboard. */
function CloseTexts({ texts }: { texts: string[] }) {
  if (texts.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {texts.map((text, i) => (
        <CopyableText key={i} text={text} />
      ))}
    </div>
  );
}

function CopyableText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      },
      () => undefined,
    );
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy text: ${text}`}
      className={cn("focus-ring rounded-2xl", copied && "opacity-70")}
    >
      <TextBubble>
        {text}
        <span
          aria-hidden="true"
          className="ml-1.5 font-mono text-[10px] uppercase tracking-wider text-accent"
        >
          {copied ? "copied" : "copy"}
        </span>
      </TextBubble>
    </button>
  );
}

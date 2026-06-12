import { useState } from "react";
import { cn } from "@/lib/cn";
import { Cue, TextBubble } from "@/components/ui/Beat";
import { StageReference } from "./StageReference";
import { GateBranchControls } from "./GateBranchControls";
import { RiskCheckPanel } from "./RiskCheckPanel";
import { ObjectionsPanel } from "./ObjectionsPanel";
import { stepLines, stepCues, stepTexts, branchTitle, pitchFramePhrase } from "./callScript";
import type { UseCallFlow } from "./useCallFlow";

/**
 * The left pane — "what I say." Every line of the current beat stays on screen
 * as a bulleted list; the line you're on is large + high-contrast, the others
 * (said or upcoming) shrink back and mute so you always know where you are
 * without anything vanishing. The lower area is the Close collect-list or, when
 * toggled (`o`), the objection comebacks. No coaching/compliance chrome.
 */
export function StagePanel({ flow, pitchProduct }: { flow: UseCallFlow; pitchProduct: string }) {
  const { stage, lineIndex, objectionsOpen } = flow;

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

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      {/* Header: where we are + the one toggle (script ⇄ objections). */}
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className={cn("eyebrow", isBranchScreen && !objectionsOpen && "text-accent")}>
            {objectionsOpen ? "Objections" : isBranchScreen ? branchTitle(stage) : "Script"}
          </h2>
          {lineCount > 1 && !objectionsOpen && (
            <span className="eyebrow tnum text-muted-foreground/70">
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

      {!objectionsOpen && (
        <div className="flex shrink-0 flex-col gap-5">
          {/* Every line stays; the current one is the hero, the rest recede. */}
          <ol className="flex flex-col gap-3.5">
            {lines.map((line, i) => {
              const current = i === lineIndex;
              return (
                <li key={i} className="flex items-start gap-3">
                  {/* Bullet auto-centers on the first text line: the wrapper is
                      exactly one line-box tall (1lh) and shares the line's
                      font-size + line-height, so `items-center` drops the dot at
                      that line's optical middle — no magic mt offsets, scales
                      with the clamped hero line and the small muted lines alike. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-[1lh] shrink-0 items-center",
                      current
                        ? "font-display text-[clamp(1.6rem,1.7vw+1rem,2.7rem)] leading-[1.25]"
                        : "font-sans text-lg leading-snug",
                    )}
                  >
                    <span
                      className={cn(
                        "rounded-full transition-all",
                        current ? "h-2 w-2 bg-accent" : "h-1.5 w-1.5 bg-muted-foreground/30",
                      )}
                    />
                  </span>
                  <p
                    data-say
                    className={cn(
                      "min-w-0 max-w-[42ch] transition-all",
                      current
                        ? "font-display text-[clamp(1.6rem,1.7vw+1rem,2.7rem)] font-semibold leading-[1.25] tracking-[-0.01em] text-foreground"
                        : "font-sans text-lg font-light leading-snug text-muted-foreground/60",
                    )}
                  >
                    {line}
                  </p>
                </li>
              );
            })}
          </ol>

          {cues.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {cues.map((c, i) => (
                <Cue key={i}>{c}</Cue>
              ))}
            </div>
          )}

          {stage === "close" && <CloseTexts texts={stepTexts("close")} />}
          {stage === "gate" && <GateBranchControls flow={flow} />}
          {stage === "risk" && <RiskCheckPanel />}
        </div>
      )}

      {/* Lower area: objections (toggled, any stage) or the Close collect list. */}
      {(objectionsOpen || showReference) && (
        <div className="min-h-0 flex-1 overflow-y-auto scroll-thin border-t border-border/60 pt-4">
          {objectionsOpen ? <ObjectionsPanel /> : <StageReference stage={stage} branch={flow.branch} />}
        </div>
      )}
    </div>
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

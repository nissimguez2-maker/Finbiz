import { useState } from "react";
import { cn } from "@/lib/cn";
import { Cue, TextBubble } from "@/components/ui/Beat";
import { LineHero } from "./LineHero";
import { StageReference } from "./StageReference";
import { GateBranchControls } from "./GateBranchControls";
import { ObjectionsPanel } from "./ObjectionsPanel";
import { flowRule, stepLines, stepCues, stepTexts, branchTitle, pitchFramePhrase } from "./callScript";
import type { UseCallFlow } from "./useCallFlow";

/**
 * The left pane — "what I say." The current line is always the hero at top; the
 * lower area holds either the stage's collect-reference (Close) or, when toggled
 * (`o`), the objection comebacks. Products live on the right matrix; tapping one
 * there fills this stage's pitch line. No decorative motion — calm and legible.
 */
export function StagePanel({ flow, pitchProduct }: { flow: UseCallFlow; pitchProduct: string }) {
  const { stage, lineIndex, objectionsOpen } = flow;

  const lines = stepLines(stage);
  let heroLine = lines[lineIndex] ?? lines[lines.length - 1] ?? "";
  if (stage === "pitch" && lineIndex === 0) {
    heroLine = heroLine.replace(/a \[[^\]]*\]/i, pitchFramePhrase(pitchProduct));
  }
  const upcoming = lines.slice(lineIndex + 1);
  const cues = stepCues(stage);
  const isBranchScreen = stage === "light" || stage === "funded";
  const lineCount = lines.length;
  const showReference = !objectionsOpen && stage === "close";

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
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
              : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground",
          )}
        >
          {objectionsOpen ? "Back to script" : "Objections"}
          <kbd className="kbd-hint" aria-hidden="true">o</kbd>
        </button>
      </div>

      {/* The current line — always on top, the one thing the eye lands on. */}
      <div className="flex shrink-0 flex-col gap-3">
        {flowRule && !objectionsOpen && (
          <p className="text-[12.5px] leading-snug text-muted-foreground">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-label text-muted-foreground/70">
              {flowRule.label}{" · "}
            </span>
            {flowRule.body}
          </p>
        )}

        {!objectionsOpen && (
          <>
            <LineHero text={heroLine} size="hero" />
            {upcoming.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {upcoming.map((line, i) => (
                  <LineHero key={i} text={line} size="secondary" />
                ))}
              </div>
            )}
            {cues.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {cues.map((c, i) => (
                  <Cue key={i}>{c}</Cue>
                ))}
              </div>
            )}
            {stage === "close" && <CloseTexts texts={stepTexts("close")} />}
            {stage === "gate" && <GateBranchControls flow={flow} />}
          </>
        )}
      </div>

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

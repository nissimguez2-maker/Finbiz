import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Callout } from "@/components/ui/Callout";
import { Cue, TextBubble } from "@/components/ui/Beat";
import { isTypingTarget } from "@/features/search/useSearch";
import { LineHero } from "./LineHero";
import { StageReference } from "./StageReference";
import { GateBranchControls } from "./GateBranchControls";
import {
  flowRule,
  stepLines,
  stepCues,
  stepTexts,
  branchTitle,
  pitchProducts,
  primaryProduct,
  pitchFramePhrase,
  type Step,
} from "./callScript";
import type { UseCallFlow } from "./useCallFlow";

/**
 * The left main pane of the live-call console (GUIDED-FLOW §2/§3).
 *
 * Renders, top to bottom:
 *  - the persistent `flowRule` coaching strip (compact Callout),
 *  - on light/funded, the locked `branchTitle` as a heading,
 *  - the current hero line + the still-to-come lines of this step,
 *  - the step's coaching cues,
 *  - on `close`, the literal SMS bubbles with copy-to-clipboard,
 *  - the contextual `StageReference`,
 *  - and at the `gate`, the three branch buttons.
 *
 * A short fade-in-up plays on every stage/line change (skipped under
 * prefers-reduced-motion). All script copy comes through callScript selectors.
 */
export function StagePanel({ flow }: { flow: UseCallFlow }) {
  const reduce = useReducedMotion();
  const { stage, lineIndex } = flow;

  // Which product the rep is pitching (Pitch stage). Default = MCA (primary).
  const pitchList = useMemo(() => pitchProducts(), []);
  const [pitchProduct, setPitchProduct] = useState(
    () => primaryProduct()?.name ?? pitchList[0]?.name ?? "",
  );

  // At Pitch, number keys 1–N set the product (guarded so typing never triggers).
  useEffect(() => {
    if (stage !== "pitch") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= pitchList.length) {
        e.preventDefault();
        setPitchProduct(pitchList[n - 1].name);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stage, pitchList]);

  const lines = stepLines(stage);
  let heroLine = lines[lineIndex] ?? lines[lines.length - 1] ?? "";
  // The Pitch opener is a fill-in-the-blank — the tapped product completes it.
  if (stage === "pitch" && lineIndex === 0) {
    heroLine = heroLine.replace(/a \[[^\]]*\]/i, pitchFramePhrase(pitchProduct));
  }
  const upcoming = lines.slice(lineIndex + 1);
  const cues = stepCues(stage);
  const isBranchScreen = stage === "light" || stage === "funded";

  // Mark where we are within a multi-line beat so the rep can see progress
  // without it competing with the hero.
  const lineCount = lines.length;

  return (
    <div className="flex flex-col gap-4">
      {flowRule && (
        <Callout
          {...flowRule}
          className="shrink-0 border-border/70 bg-muted/40 py-1.5 text-[12.5px] text-muted-foreground"
        />
      )}

      {/* Hero + upcoming lines re-key on stage/line so the entrance replays. */}
      <motion.div
        key={`${stage}-${lineIndex}`}
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-3.5"
      >
        <div className="flex items-center gap-2.5">
          {isBranchScreen && (
            <h2 className="eyebrow text-accent">{branchTitle(stage)}</h2>
          )}
          {lineCount > 1 && (
            <span className="eyebrow tnum tracking-wider text-muted-foreground/70">
              Line {lineIndex + 1} / {lineCount}
            </span>
          )}
        </div>

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
            {cues.map((cue, i) => (
              <Cue key={i}>{cue}</Cue>
            ))}
          </div>
        )}

        {stage === "close" && <CloseTexts texts={stepTexts("close")} />}
      </motion.div>

      {stage === "gate" && <GateBranchControls flow={flow} />}

      <ReferenceSlot
        stage={stage}
        branch={flow.branch}
        pitchProduct={pitchProduct}
        onPitchProduct={setPitchProduct}
      />
    </div>
  );
}

/** The contextual reference, wrapped so it eases in on stage change too. */
function ReferenceSlot({
  stage,
  branch,
  pitchProduct,
  onPitchProduct,
}: {
  stage: Step;
  branch: UseCallFlow["branch"];
  pitchProduct: string;
  onPitchProduct: (name: string) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={`ref-${stage}-${branch}`}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 0.04 }}
      className="console-rule pt-4 empty:hidden empty:border-0 empty:pt-0"
    >
      <StageReference
        stage={stage}
        branch={branch}
        pitchProduct={pitchProduct}
        onPitchProduct={onPitchProduct}
      />
    </motion.div>
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
      className={cn(
        "focus-ring group rounded-2xl transition-opacity",
        copied && "opacity-70",
      )}
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

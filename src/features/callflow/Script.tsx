import type { BranchCard, CallBeat } from "@/types/content";
import { inlineMarkup } from "@/lib/inlineBold";
import { CopyButton } from "@/components/CopyButton";
import { scriptBeats, scriptBranches, scriptRule } from "./content";

/**
 * The center reading column — the whole call script, top to bottom, in one calm
 * measure (~68ch). The `says` lines are the dominant readable text; `cues` are
 * clearly subordinate; the Close `texts` are quiet bordered blocks with a copy
 * affordance. The two Gate branches render inline as subordinate "↪ if…" blocks
 * right after the Gate beat. No stepper, no progress, no sticky chrome.
 */
export function Script() {
  // Branch cards slot in after the Gate beat (index 2), before Dig (index 3).
  const GATE_INDEX = 2;

  return (
    <article className="mx-auto w-full max-w-reading px-6 py-12 sm:py-16">
      {scriptRule && (
        <p className="mb-12 text-sm leading-relaxed text-muted-foreground">
          <span className="eyebrow mr-2 text-accent">{scriptRule.label}</span>
          {scriptRule.body}
        </p>
      )}

      <div className="space-y-14">
        {scriptBeats.map((beat, i) => (
          <div key={beat.label} className="contents">
            <Beat beat={beat} />
            {i === GATE_INDEX &&
              scriptBranches.map((branch) => <Branch key={branch.title} branch={branch} />)}
          </div>
        ))}
      </div>
    </article>
  );
}

/** One beat: quiet label heading, dominant says lines, subordinate cues + texts. */
function Beat({ beat }: { beat: CallBeat }) {
  return (
    <section aria-label={beat.label}>
      <h2 className="eyebrow mb-5 text-accent">{beat.label}</h2>

      <div className="space-y-4">
        {beat.says.map((line, i) => (
          <p
            key={i}
            className="text-lg leading-relaxed text-foreground sm:text-xl"
            dangerouslySetInnerHTML={inlineMarkup(line)}
          />
        ))}
      </div>

      {beat.cues && beat.cues.length > 0 && (
        <div className="mt-5 space-y-2">
          {beat.cues.map((cue, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={inlineMarkup(cue)}
            />
          ))}
        </div>
      )}

      {beat.texts && beat.texts.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="eyebrow text-muted-foreground">Texts</p>
          {beat.texts.map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border border-border bg-muted/50 py-1.5 pl-4 pr-1"
            >
              <span className="flex-1 text-base text-foreground">{text}</span>
              <CopyButton text={text} label={`Copy text: ${text}`} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** A Gate branch, rendered as a visually subordinate "↪ if…" indented block. */
function Branch({ branch }: { branch: BranchCard }) {
  return (
    <section aria-label={branch.title} className="border-l-2 border-border pl-5">
      <h3 className="eyebrow mb-4 text-muted-foreground">↪ if {branch.title.replace(/^↪\s*/, "")}</h3>

      <div className="space-y-3">
        {branch.says.map((line, i) => (
          <p
            key={i}
            className="text-base leading-relaxed text-foreground"
            dangerouslySetInnerHTML={inlineMarkup(line)}
          />
        ))}
      </div>

      {branch.cues && branch.cues.length > 0 && (
        <div className="mt-4 space-y-2">
          {branch.cues.map((cue, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={inlineMarkup(cue)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

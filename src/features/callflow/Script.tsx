import type { BranchCard, CallBeat } from "@/types/content";
import { inlineMarkup } from "@/lib/inlineBold";
import { CopyButton } from "@/components/CopyButton";
import { scriptBeats, scriptBranches } from "./content";

/**
 * The center reading column — the whole call script, top to bottom, in one calm
 * measure (~68ch). ONLY the lines she says out loud (plus the Close `texts`).
 * No posture intro, no coaching cues — just the script. The two Gate branches
 * render inline as subordinate "↪ if…" blocks right after the Gate beat.
 */
export function Script() {
  // Branch cards slot in after the Gate beat (index 2), before Dig (index 3).
  const GATE_INDEX = 2;

  return (
    <article className="mx-auto w-full max-w-reading px-6 py-12 sm:py-16">
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

/** One beat: quiet label heading, then the spoken lines, then any Close texts. */
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
    </section>
  );
}

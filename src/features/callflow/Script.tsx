import { useMemo } from "react";
import type { BranchCard, CallBeat } from "@/types/content";
import { cn } from "@/lib/cn";
import { inlineMarkup } from "@/lib/inlineBold";
import { scriptBeats, scriptBranches } from "./content";
import { useScriptCursor } from "./useScriptCursor";

/**
 * The center reading column — the whole call script, top to bottom, in one calm
 * measure (~68ch). ONLY the lines she says out loud; no postures, no cues, no
 * copy-paste texts. The two Gate branches render inline as subordinate "↪ if…"
 * blocks right after the Gate beat.
 *
 * Teleprompter behaviour
 *  - Every spoken line is a discrete list row with a left marker. ONE line is the
 *    "active" line: bold, enlarged, near-black, with an accent left bar and a
 *    filled accent marker. The other lines stay readable but calmer.
 *  - She advances the active line with the keyboard — ArrowDown/ArrowRight/Space →
 *    next, ArrowUp/ArrowLeft/Shift+Space → previous (clamped, no wrap). Clicking
 *    any line activates it. The arrow flow walks the beats only; the conditional
 *    Gate branches are clickable but skipped by the arrows (see useScriptCursor).
 *  - The active line auto-scrolls to center; the page still opens at the top.
 */

// Stable ids: beat lines b{beat}-{line}; branch lines br{branch}-{line}.
const beatLineId = (b: number, l: number) => `b${b}-${l}`;
const branchLineId = (b: number, l: number) => `br${b}-${l}`;

export function Script() {
  // Branch cards slot in after the Gate beat (index 2), before Dig (index 3).
  const GATE_INDEX = 2;

  // The arrow-navigable sequence is the beats' spoken lines only (branches are
  // conditional and excluded), built once in source order.
  const navIds = useMemo(
    () => scriptBeats.flatMap((beat, bi) => beat.says.map((_, li) => beatLineId(bi, li))),
    [],
  );

  const { activeId, setActive, registerLine } = useScriptCursor(navIds);

  return (
    <article className="mx-auto w-full max-w-reading px-6 py-12 sm:py-16">
      <div className="space-y-14">
        {scriptBeats.map((beat, i) => (
          <div key={beat.label} className="contents">
            <Beat
              beat={beat}
              beatIndex={i}
              activeId={activeId}
              setActive={setActive}
              registerLine={registerLine}
            />
            {i === GATE_INDEX &&
              scriptBranches.map((branch, bi) => (
                <Branch
                  key={branch.title}
                  branch={branch}
                  branchIndex={bi}
                  activeId={activeId}
                  setActive={setActive}
                  registerLine={registerLine}
                />
              ))}
          </div>
        ))}
      </div>
    </article>
  );
}

interface LineProps {
  activeId: string;
  setActive: (id: string) => void;
  registerLine: (id: string) => (el: HTMLElement | null) => void;
}

/** One beat: an accent eyebrow header, then its spoken lines as a marked list. */
function Beat({
  beat,
  beatIndex,
  activeId,
  setActive,
  registerLine,
}: { beat: CallBeat; beatIndex: number } & LineProps) {
  return (
    <section aria-label={beat.label}>
      <h2 className="eyebrow mb-6 border-b border-border pb-2 text-accent">{beat.label}</h2>

      <ol className="space-y-3">
        {beat.says.map((line, i) => {
          const id = beatLineId(beatIndex, i);
          return (
            <Line
              key={id}
              id={id}
              line={line}
              active={activeId === id}
              setActive={setActive}
              registerLine={registerLine}
            />
          );
        })}
      </ol>
    </section>
  );
}

/** A Gate branch: a subordinate, indented "↪ if…" block. Clickable, not in arrow flow. */
function Branch({
  branch,
  branchIndex,
  activeId,
  setActive,
  registerLine,
}: { branch: BranchCard; branchIndex: number } & LineProps) {
  return (
    <section aria-label={branch.title} className="border-l-2 border-border pl-5">
      <h3 className="eyebrow mb-4 text-muted-foreground">
        ↪ if {branch.title.replace(/^↪\s*/, "")}
      </h3>

      <ol className="space-y-3">
        {branch.says.map((line, i) => {
          const id = branchLineId(branchIndex, i);
          return (
            <Line
              key={id}
              id={id}
              line={line}
              active={activeId === id}
              setActive={setActive}
              registerLine={registerLine}
              subordinate
            />
          );
        })}
      </ol>
    </section>
  );
}

/**
 * A single spoken line as a list row: a left marker (filled accent when active,
 * a quiet outline dot otherwise) and the line text. The active line reads bold,
 * larger, full near-black, with an accent left bar; inactive lines stay readable
 * but a touch calmer so the active one clearly wins.
 */
function Line({
  id,
  line,
  active,
  setActive,
  registerLine,
  subordinate,
}: {
  id: string;
  line: string;
  active: boolean;
  subordinate?: boolean;
} & Omit<LineProps, "activeId">) {
  return (
    <li
      ref={registerLine(id)}
      aria-current={active ? "step" : undefined}
      onClick={() => setActive(id)}
      className={cn(
        "group flex cursor-pointer items-start gap-3 rounded-r-md border-l-2 py-1 pl-3 pr-1",
        "transition-[border-color,background-color] duration-150 motion-reduce:transition-none",
        active ? "border-accent" : "border-transparent hover:border-border",
      )}
    >
      {/* Left marker: filled accent when active, quiet outline dot otherwise.
          The marker sits on the first text line; its top offset is `em` so it
          tracks each row's own font-size (the active row is larger), keeping the
          dot aligned to the cap height of line one even when the text wraps. */}
      <span
        aria-hidden
        className={cn(
          "mt-[0.62em] h-2 w-2 shrink-0 rounded-full transition-colors duration-150 motion-reduce:transition-none",
          active
            ? "bg-accent text-2xl sm:text-[1.7rem]"
            : cn(
                "border border-muted-foreground/50 bg-transparent group-hover:border-accent",
                subordinate ? "text-base" : "text-lg",
              ),
        )}
      />

      <span
        dangerouslySetInnerHTML={inlineMarkup(line)}
        className={cn(
          "leading-relaxed transition-colors duration-150 motion-reduce:transition-none",
          active
            ? "text-2xl font-semibold text-foreground sm:text-[1.7rem]"
            : cn(
                "font-normal text-foreground/70",
                subordinate ? "text-base" : "text-lg",
              ),
        )}
      />
    </li>
  );
}

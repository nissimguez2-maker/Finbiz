import { NotesDrawer } from "@/features/notes/NotesDrawer";
import { cn } from "@/lib/cn";
import { TopBar } from "./TopBar";
import { StageStepper } from "./StageStepper";
import { FooterStrip } from "./FooterStrip";
import { StagePanel } from "./StagePanel";
import { ObjectionsPanel } from "./ObjectionsPanel";
import { AfterCallPanel } from "./AfterCallPanel";
import { useCallFlow } from "./useCallFlow";
import { useKeyboardFlow } from "./useKeyboardFlow";

/**
 * The guided live-call console — the new app root (replaces the scrolling Shell).
 *
 * Layout (desktop two-pane, §3): a fixed-height column that fills the viewport
 * and never page-scrolls — TopBar, StageStepper, a main row holding the
 * StagePanel (left, ~64%) and the persistent ObjectionsPanel (right, ~36%),
 * then the FooterStrip. The AfterCallPanel overlays on demand and the existing
 * NotesDrawer mounts its own fixed dock. Only the inner panes scroll.
 *
 * Below `lg`, the two panes stack and the objections pane drops out of the row;
 * it becomes a bottom sheet toggled by `flow.toggleObjections` (footer button /
 * `o`). The StagePanel owns the per-stage fade-in-up entrance.
 */
export function CallConsole() {
  const flow = useCallFlow();
  useKeyboardFlow(flow);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      <TopBar flow={flow} />
      <StageStepper flow={flow} />

      {/* Main row: stage pane (left) + persistent objections pane (right).
          Stacks vertically below lg. min-h-0 lets the children own their own
          overflow so the page itself never scrolls. */}
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section
          aria-label="Current stage"
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:basis-[64%]"
        >
          <StagePanel flow={flow} />
        </section>

        {/* Desktop: persistent right pane. Narrow: rendered as a bottom sheet
            controlled by flow.objectionsOpen (handled inside ObjectionsPanel),
            so it is always mounted but visually repositions. */}
        <aside
          aria-label="Objections"
          className={cn(
            // Narrow: `contents` removes the aside from layout so the panel can
            // position itself as a bottom sheet. lg: a fixed ~36% bordered rail.
            "contents",
            "lg:flex lg:min-h-0 lg:shrink-0 lg:basis-[36%] lg:flex-col lg:border-l lg:border-border",
          )}
        >
          <ObjectionsPanel flow={flow} />
        </aside>
      </main>

      <FooterStrip flow={flow} />

      {/* After-the-call overlay (slides in; dismiss = Esc / close). */}
      <AfterCallPanel flow={flow} />

      {/* Existing live call-notes drawer + timer — self-mounted fixed dock.
          Hidden on print along with the rest of the chrome. */}
      <NotesDrawer />
    </div>
  );
}

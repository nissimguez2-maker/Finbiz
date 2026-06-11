import { useState } from "react";
import { NotesDrawer } from "@/features/notes/NotesDrawer";
import { useCallTimer } from "@/features/notes/useCallTimer";
import { primaryProduct } from "./callScript";
import { TopBar } from "./TopBar";
import { StageStepper } from "./StageStepper";
import { FooterStrip } from "./FooterStrip";
import { StagePanel } from "./StagePanel";
import { ProductMatrixPanel } from "./ProductMatrixPanel";
import { AfterCallPanel } from "./AfterCallPanel";
import { useCallFlow } from "./useCallFlow";
import { useKeyboardFlow } from "./useKeyboardFlow";

/**
 * The guided live-call console.
 *
 *  LEFT  — "what I say": the script (current line + stage context), with the
 *          objection comebacks folded in (toggled by `o` / the header button).
 *  RIGHT — "what I sell": the persistent product matrix (thresholds +
 *          branch-driven recommendation); tapping a product sets the pitch line.
 *
 * Stripped to the essentials — no decorative motion, gradients, or glow. The
 * current line and the matrix are the only things meant to pull the eye.
 */
export function CallConsole() {
  const flow = useCallFlow();
  useKeyboardFlow(flow);
  const timer = useCallTimer();
  const [notesOpen, setNotesOpen] = useState(false);
  const [pitchProduct, setPitchProduct] = useState(() => primaryProduct()?.name ?? "");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
      <TopBar timer={timer} />
      <StageStepper flow={flow} />

      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* LEFT — the script (talk track + objections) */}
        <section
          aria-label="Script"
          className="flex min-w-0 flex-col px-5 py-5 sm:px-7 sm:py-6 lg:basis-[60%]"
        >
          <StagePanel flow={flow} pitchProduct={pitchProduct} />
        </section>

        {/* RIGHT — the product matrix (what I sell) */}
        <aside
          aria-label="Product matrix"
          className="flex min-h-0 shrink-0 flex-col border-t border-border lg:basis-[40%] lg:border-l lg:border-t-0"
        >
          <ProductMatrixPanel branch={flow.branch} selected={pitchProduct} onSelect={setPitchProduct} />
        </aside>
      </main>

      <FooterStrip flow={flow} onOpenNotes={() => setNotesOpen(true)} />

      <AfterCallPanel flow={flow} />
      <NotesDrawer open={notesOpen} onClose={() => setNotesOpen(false)} timer={timer} />
    </div>
  );
}

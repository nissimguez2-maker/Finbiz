import { useState } from "react";
import type { useCallTimer } from "@/features/notes/useCallTimer";
import { primaryProduct } from "./callScript";
import { StageStepper } from "./StageStepper";
import { FooterStrip } from "./FooterStrip";
import { StagePanel } from "./StagePanel";
import { ProductMatrixPanel } from "./ProductMatrixPanel";
import { AfterCallPanel } from "./AfterCallPanel";
import { useCallFlow } from "./useCallFlow";
import { useKeyboardFlow } from "./useKeyboardFlow";

/** Props handed down from ConsoleShell, which owns the shared shell state. */
export interface CallConsoleProps {
  /** The single shared call timer (owned + rendered by the shell's TopBar). */
  timer: ReturnType<typeof useCallTimer>;
  /** Whether the shared Notes drawer is open (owned by the shell). */
  notesOpen: boolean;
  /** Opens the shared Notes drawer (wired to the FooterStrip "Notes" button). */
  onOpenNotes: () => void;
}

/**
 * The LIVE-CALL body (no longer the root — ConsoleShell owns the TopBar, the
 * shared timer, and the Notes drawer). It still drives the guided flow:
 *
 *  LEFT  — "what I say": the script (current line + stage context), with the
 *          objection comebacks folded in (toggled by `o` / the header button)
 *          and the ④.5 Risk-check prompt on the risk stage.
 *  RIGHT — "what I sell": the persistent product matrix (thresholds +
 *          branch-driven recommendation); tapping a product sets the pitch line.
 *
 * Stripped to the essentials — no decorative motion, gradients, or glow. The
 * current line and the matrix are the only things meant to pull the eye.
 */
export function CallConsole({ onOpenNotes }: CallConsoleProps) {
  const flow = useCallFlow();
  useKeyboardFlow(flow);
  const [pitchProduct, setPitchProduct] = useState(() => primaryProduct()?.name ?? "");

  return (
    <>
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

      <FooterStrip flow={flow} onOpenNotes={onOpenNotes} />

      <AfterCallPanel flow={flow} />
    </>
  );
}

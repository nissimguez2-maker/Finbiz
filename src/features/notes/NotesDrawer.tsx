import { NotebookPen } from "lucide-react";

/**
 * STUB — replaced by the notes specialist agent with a working call-notes
 * scratchpad + call timer drawer (localStorage persistence, copy/clear).
 * Renders the dock trigger so the shell compiles.
 */
export function NotesDrawer() {
  return (
    <div className="no-print fixed bottom-5 right-5 z-50">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-3 font-mono text-[12px] font-medium text-background shadow-lg transition-colors hover:bg-foreground/90 focus-ring"
      >
        <NotebookPen className="h-4 w-4" />
        Call notes
        <span className="tnum text-accent-secondary">0:00</span>
      </button>
    </div>
  );
}

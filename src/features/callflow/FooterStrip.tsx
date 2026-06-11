import { ArrowUpRight, MessageSquareWarning, NotebookPen, PanelRightOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import type { UseCallFlow } from "./useCallFlow";

/**
 * Slim footer strip (h-12): the call's chrome controls — a Notes trigger, an
 * "After the call" toggle, and (narrow screens only) an objections toggle.
 * Right-aligned. Chrome — never printed.
 */
export function FooterStrip({
  flow,
  onOpenNotes,
}: {
  flow: UseCallFlow;
  onOpenNotes: () => void;
}) {
  return (
    <footer className="no-print flex h-12 shrink-0 items-center justify-end gap-2 border-t border-border bg-muted/30 px-4 sm:px-6">
      <div className="flex shrink-0 items-center gap-2">
        {/* Objections toggle — only needed on narrow screens where the right
            pane collapses into a bottom sheet. */}
        <FooterButton
          onClick={flow.toggleObjections}
          ariaLabel="Toggle objections"
          ariaPressed={flow.objectionsOpen}
          className="lg:hidden"
        >
          <MessageSquareWarning className="h-3.5 w-3.5" aria-hidden="true" />
          Objections
        </FooterButton>

        <FooterButton onClick={onOpenNotes} ariaLabel="Open call notes">
          <NotebookPen className="h-3.5 w-3.5" aria-hidden="true" />
          Notes
        </FooterButton>

        <FooterButton
          onClick={() => flow.openAfterCall()}
          ariaLabel="Open After the call"
          ariaPressed={flow.afterCallOpen}
          accent
        >
          <PanelRightOpen className="h-3.5 w-3.5" aria-hidden="true" />
          After the call
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </FooterButton>
      </div>
    </footer>
  );
}

function FooterButton({
  children,
  onClick,
  ariaLabel,
  ariaPressed,
  accent,
  className,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  ariaPressed?: boolean;
  accent?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={cn(
        "focus-ring inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 font-mono text-[11px] font-semibold uppercase tracking-label transition-colors",
        accent
          ? "border-accent/30 text-accent hover:bg-accent/[0.07]"
          : "border-border text-muted-foreground hover:border-accent/30 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

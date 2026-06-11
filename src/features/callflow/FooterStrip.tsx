import { ArrowUpRight, MessageSquareWarning, NotebookPen, PanelRightOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import { rails } from "@/content/meta";
import type { UseCallFlow } from "./useCallFlow";

/**
 * Slim footer strip (h-12): a compact always-on compliance rails reminder, a
 * Notes trigger, an "After the call" toggle, and (narrow screens only) an
 * objections toggle. Chrome — never printed.
 *
 * The Notes drawer is the existing NotesDrawer mounted in CallConsole with its
 * own fixed dock button; here the Notes button simply gives the footer a
 * discoverable, keyboard-reachable entry that focuses that dock trigger.
 */
export function FooterStrip({ flow }: { flow: UseCallFlow }) {
  const focusNotesDock = () => {
    // The existing NotesDrawer renders its dock button with this aria-label
    // prefix; focusing it surfaces the drawer affordance without duplicating
    // the drawer's own state.
    const dock = document.querySelector<HTMLButtonElement>(
      'button[aria-label^="Call notes"]',
    );
    dock?.focus();
    dock?.click();
  };

  return (
    <footer className="no-print flex h-12 shrink-0 items-center gap-3 border-t border-border bg-muted/30 px-4 sm:px-6">
      {/* Compliance rails — the lines a rep must always hold. */}
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scroll-thin">
        <span className="eyebrow shrink-0">Rails</span>
        <ul className="flex items-center gap-2 whitespace-nowrap">
          {rails.map((r) => (
            <li
              key={r}
              className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {r}
            </li>
          ))}
        </ul>
      </div>

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

        <FooterButton onClick={focusNotesDock} ariaLabel="Open call notes">
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

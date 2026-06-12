import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A quiet edge panel. On open, focus moves into the panel; on close, focus
 * returns to the toggle that opened it (passed as `returnFocusTo`). Esc is
 * handled globally in useDrawers. The panel is an aria-labelled region with its
 * own scroll. Layout (push at lg+, overlay + scrim below lg) is owned by the
 * shell; this component is the inner chrome + content.
 */
interface PanelProps {
  side: "left" | "right";
  open: boolean;
  title: string;
  /** id used by the toggle's aria-controls. */
  id: string;
  onClose: () => void;
  /** Ref to the toggle button, so focus can return there on close. */
  returnFocusTo: React.RefObject<HTMLElement>;
  children: ReactNode;
}

export function Panel({ side, open, title, id, onClose, returnFocusTo, children }: PanelProps) {
  const regionRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) {
      // Move focus into the panel when it opens.
      regionRef.current?.focus();
    } else if (!open && wasOpen.current) {
      // Return focus to the toggle when it closes.
      returnFocusTo.current?.focus();
    }
    wasOpen.current = open;
  }, [open, returnFocusTo]);

  return (
    <section
      ref={regionRef}
      id={id}
      role="region"
      aria-label={title}
      tabIndex={-1}
      className={cn(
        "flex h-full w-full flex-col bg-background focus:outline-none",
        side === "left" ? "border-r border-border" : "border-l border-border",
      )}
    >
      <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-5">
        <h2 className="eyebrow text-foreground">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title} panel`}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground",
            "transition-colors hover:text-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
      </header>

      <div className="scroll-thin flex-1 overflow-y-auto px-5 py-6">{children}</div>
    </section>
  );
}

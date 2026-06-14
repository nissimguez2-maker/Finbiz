import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A plain disclosure: a quiet header button that expands to reveal its body.
 * No card, no chrome — separation comes from whitespace and a hairline, not a
 * box. The accent appears only on hover/focus, per the monochrome system.
 */
interface DisclosureProps {
  /** The always-visible summary line (left side of the header). */
  summary: ReactNode;
  /** Optional muted one-liner shown under the summary while collapsed. */
  hint?: ReactNode;
  /** Revealed content. */
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ summary, hint, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();

  return (
    <div className="border-t border-border first:border-t-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group flex w-full items-start gap-3 py-3 text-left",
          "rounded-sm transition-colors hover:text-accent",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <ChevronDown
          aria-hidden
          className={cn(
            "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:text-accent",
            open && "rotate-180",
          )}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold leading-snug text-foreground group-hover:text-accent">
            {summary}
          </span>
          {hint != null && (
            <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{hint}</span>
          )}
        </span>
      </button>
      {open && (
        <div id={bodyId} className="pb-4 pl-7 pr-1">
          {children}
        </div>
      )}
    </div>
  );
}

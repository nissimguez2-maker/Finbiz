import { PhoneCall, Search } from "lucide-react";
import { cn } from "@/lib/cn";

/** The two approved top-level modes. This IA is fixed — no third mode. */
export type ConsoleMode = "live" | "lookup";

const MODES: { id: ConsoleMode; label: string; Icon: typeof PhoneCall }[] = [
  { id: "live", label: "Live Call", Icon: PhoneCall },
  { id: "lookup", label: "Quick Lookup", Icon: Search },
];

/**
 * The two-mode switch (Live Call · Quick Lookup) — the spine of the 2.0 shell.
 * Active mode wears the signature accent-gradient pill (the same idiom the
 * After-call tabs use), idle modes stay quiet so this reads as a tool control,
 * not a nav bar. Click to switch — minimal by design, no extra chrome.
 */
export function ModeBar({
  mode,
  onChange,
}: {
  mode: ConsoleMode;
  onChange: (next: ConsoleMode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Console mode"
      className="flex shrink-0 items-center gap-1 rounded-xl border border-border bg-muted/40 p-1"
    >
      {MODES.map(({ id, label, Icon }) => {
        const active = id === mode;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={cn(
              "focus-ring inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
              active
                ? "bg-accent-gradient text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

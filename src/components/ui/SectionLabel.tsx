import { cn } from "@/lib/cn";

interface SectionLabelProps {
  children: React.ReactNode;
  /** Pulse the dot to signal "live". */
  pulse?: boolean;
  /** Light variant for use on dark/inverted backgrounds. */
  inverted?: boolean;
  className?: string;
}

/** The signature pill badge: accent dot + uppercase mono label. */
export function SectionLabel({ children, pulse, inverted, className }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5",
        inverted
          ? "border-white/15 bg-white/5"
          : "border-accent/30 bg-accent/5",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-accent",
          pulse && "motion-safe:animate-pulse-dot",
        )}
      />
      <span
        className={cn(
          "font-mono text-[11px] uppercase tracking-label",
          inverted ? "text-white/70" : "text-accent",
        )}
      >
        {children}
      </span>
    </div>
  );
}

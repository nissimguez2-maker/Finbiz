import { cn } from "@/lib/cn";

/** A spoken line the rep reads aloud — the core unit of the call flow. */
export function Say({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      data-say
      className={cn(
        "say-line text-[15px] leading-relaxed text-foreground sm:text-base",
        "before:font-semibold before:text-accent before:content-['\\201C'] after:font-semibold after:text-accent after:content-['\\201D']",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** A coaching cue — what the line is doing / what to listen for. */
export function Cue({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[13px] leading-snug text-muted-foreground", className)}>
      <span className="font-semibold text-accent">→ </span>
      {children}
    </p>
  );
}

/** A literal text-message bubble, visually distinct from spoken lines. */
export function TextBubble({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-2xl rounded-bl-md bg-accent/[0.07] px-3 py-1.5 font-mono text-[12.5px] text-foreground">
      <span className="text-accent">›</span>
      {children}
    </span>
  );
}

/** A numbered/labelled call beat with an accent rail. */
export function Beat({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative pl-5", className)}>
      <span className="absolute bottom-1 left-0 top-1 w-[3px] rounded-full bg-accent-gradient" />
      <h4 className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

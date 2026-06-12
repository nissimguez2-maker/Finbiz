import { cn } from "@/lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Retained for API compatibility — no longer applies a hover lift/wash.
   * The live console favors a calm, static surface over decorative motion.
   */
  interactive?: boolean;
}

/** Standard elevated surface. */
export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("relative rounded-2xl border border-border bg-card p-6 shadow-md", className)}>
      <div className="relative">{children}</div>
    </div>
  );
}

/** Featured card with the 2px gradient-border treatment + inner accent glow. */
export function FeaturedCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="rounded-2xl bg-accent-gradient-br p-[1.5px] shadow-accent">
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-[calc(1rem-1.5px)] bg-card p-6",
          className,
        )}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/[0.07] blur-2xl" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

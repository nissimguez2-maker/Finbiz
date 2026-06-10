import { cn } from "@/lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Adds a hover lift + gradient wash. */
  interactive?: boolean;
}

/** Standard elevated surface. */
export function Card({ children, className, interactive }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card p-6 shadow-md",
        interactive &&
          "group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
        className,
      )}
    >
      {interactive && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/** Featured card with the 2px gradient-border treatment. */
export function FeaturedCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="rounded-2xl bg-accent-gradient-br p-[1.5px] shadow-accent">
      <div className={cn("h-full w-full rounded-[calc(1rem-1.5px)] bg-card p-6", className)}>
        {children}
      </div>
    </div>
  );
}

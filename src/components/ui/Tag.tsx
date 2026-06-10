import { cn } from "@/lib/cn";
import type { TagColor } from "@/types/content";

const tagStyles: Record<TagColor, string> = {
  gold: "bg-accent/10 text-accent border-accent/25",
  blue: "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/25",
  teal: "bg-go/10 text-go border-go/25",
  slate: "bg-muted text-muted-foreground border-border",
};

export function Tag({
  children,
  color = "slate",
  className,
}: {
  children: React.ReactNode;
  color?: TagColor;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
        tagStyles[color],
        className,
      )}
    >
      {children}
    </span>
  );
}

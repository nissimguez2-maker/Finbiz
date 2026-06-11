import { cn } from "@/lib/cn";

interface HeadlineProps {
  /** Text with the gradient-highlighted word(s) wrapped in {curlies}. */
  children: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * Renders a Calistoga display headline, applying the signature gradient-text
 * treatment to any segment wrapped in {curly braces}.
 *   <Headline>Call {Flow}</Headline>  ->  Call <gradient>Flow</gradient>
 */
export function Headline({ children, as = "h2", className }: HeadlineProps) {
  const Tag = as;
  const parts = children.split(/(\{[^}]+\})/g).filter(Boolean);
  return (
    <Tag
      className={cn(
        "font-display tracking-[-0.02em]",
        as === "h1" && "text-[2.5rem] leading-[1.05] sm:text-5xl lg:text-6xl",
        as === "h2" && "text-[1.9rem] leading-[1.12] sm:text-4xl",
        as === "h3" && "text-2xl leading-tight",
        className,
      )}
    >
      {parts.map((p, i) =>
        p.startsWith("{") && p.endsWith("}") ? (
          <span key={i} className="gradient-text">
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </Tag>
  );
}

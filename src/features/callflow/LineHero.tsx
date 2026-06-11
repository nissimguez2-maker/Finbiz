import { cn } from "@/lib/cn";

/**
 * The LARGE + BOLD current-line renderer for the live-call view (typography
 * contract, GUIDED-FLOW §6). A thin wrapper around the spoken-line treatment so
 * the `Say` primitive stays untouched — we reuse its quote-mark + accent idiom
 * here at a scale a rep can read at a glance.
 *
 *  - `hero`      → font-sans 700, clamp(text-3xl → text-5xl), tight leading,
 *                  ~38ch max width, high-contrast foreground.
 *  - `secondary` → font-sans 600, ~text-xl, muted (the upcoming says).
 */
export function LineHero({
  text,
  size = "hero",
}: {
  text: string;
  size?: "hero" | "secondary";
}) {
  const isHero = size === "hero";
  return (
    <p
      data-say
      className={cn(
        // shared: quote marks in accent, like the Say primitive
        "say-line max-w-[38ch] font-sans",
        "before:font-bold before:text-accent before:content-['\\201C']",
        "after:font-bold after:text-accent after:content-['\\201D']",
        isHero
          ? "text-[clamp(1.875rem,2.2vw+1rem,3rem)] font-bold leading-[1.12] tracking-tight text-foreground"
          : "text-xl font-semibold leading-snug text-muted-foreground",
      )}
    >
      {text}
    </p>
  );
}

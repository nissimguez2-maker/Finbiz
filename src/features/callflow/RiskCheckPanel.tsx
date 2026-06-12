import { Callout } from "@/components/ui";
import { productByName } from "./callScript";

/**
 * Supplementary card for the ④.5 Risk-check stage. The dig surfaces risk; this
 * is the one rescue move worth keeping in view: if the merchant is in a CURRENT
 * DEFAULT but has 650+ FICO and owns real estate, pivot to the HELOC and use it
 * to pay the default off — so he CLOSES the position instead of modifying it
 * (funders treat a modified/restructured position almost as badly as a default).
 *
 * Reference-only framing; the HELOC's own terms live in the product matrix.
 */
export function RiskCheckPanel() {
  const heloc = productByName("HELOC");

  return (
    <section
      aria-label="Risk-check — HELOC default rescue"
      className="console-card-accent flex flex-col gap-3 p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-accent">Risk check · default rescue</span>
        <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground/70">
          if he's in default
        </span>
      </div>

      {/* The conditional, said as a single if→then so it reads at a glance. */}
      <p className="text-[15px] leading-snug text-foreground">
        <span className="font-semibold">Current default + 650+ FICO + owns real estate</span>{" "}
        <span aria-hidden="true" className="text-accent">→</span>{" "}
        pivot to a <span className="font-semibold">HELOC</span> and use it to{" "}
        <span className="font-semibold">pay the default off</span> — so he closes the
        position out instead of modifying it.
      </p>

      <Callout
        tone="clay"
        label="Why it matters"
        body="Funders treat a modified / restructured position almost as badly as a default. Paying it off with the HELOC keeps the position clean — never coach him to modify."
      />

      {heloc && (
        <p className="text-[12.5px] leading-snug text-muted-foreground">
          <span className="font-mono text-[10px] uppercase tracking-label text-accent">
            HELOC
          </span>{" "}
          — {heloc.sayIt} Often funded within a day if he moves with you.
        </p>
      )}
    </section>
  );
}

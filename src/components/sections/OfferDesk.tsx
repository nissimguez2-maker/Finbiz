import { useId, useState } from "react";
import { Section, StatBlock, Callout, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { StatCell } from "@/types/content";
import { offer } from "@/content/offer";

type Frequency = "daily" | "weekly";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Whole dollars unless the value carries cents (e.g. a fractional per-payment). */
function money(n: number): string {
  if (!Number.isFinite(n)) return usd.format(0);
  return Number.isInteger(n) ? usd.format(n) : usdCents.format(n);
}

/** 11 — Post-Approval: the Approved Offer desk. Interactive — plug in the
 *  approved terms AFTER underwriting clears, then walk the merchant through them.
 *  Factor/payback math is never quoted live on a cold call. */
export function OfferDesk() {
  const { meta, gate, loops } = offer;

  const [funded, setFunded] = useState(20_000);
  const [factor, setFactor] = useState(1.4);
  const [term, setTerm] = useState(100);
  const [freq, setFreq] = useState<Frequency>("daily");

  // Guard the divisor/multiplier so a cleared input never yields NaN/Infinity.
  const safeFunded = Number.isFinite(funded) ? Math.max(0, funded) : 0;
  const safeFactor = Number.isFinite(factor) ? Math.max(1, factor) : 1;
  const safeTerm = Number.isFinite(term) && term >= 1 ? term : 1;

  const payback = safeFunded * safeFactor;
  const perPayment = payback / safeTerm;
  const totalCost = payback - safeFunded;

  const freqLabel = freq === "daily" ? "daily" : "weekly";

  const cells: StatCell[] = [
    { k: "Funding amount", v: money(safeFunded) },
    { k: "Total payback", v: money(payback), hot: true },
    { k: `Per pmt · ${freqLabel}`, v: money(perPayment) },
    { k: "Total cost", v: money(totalCost) },
    { k: "Factor", v: safeFactor.toFixed(2) },
  ];

  return (
    <Section meta={meta}>
      <div className="space-y-6">
        {/* Gate first, prominent — this is the whole point: post-approval only. */}
        <Callout {...gate} className="text-[15px]" />

        {/* Calculator: controlled inputs → live StatBlock outputs → factor note. */}
        <Card>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg">Plug in the approved terms</h3>
            <span className="font-mono text-[10px] uppercase tracking-label text-muted-foreground">
              Live · recomputes
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <NumberField
              label="Funded"
              prefix="$"
              value={funded}
              onChange={setFunded}
              step={500}
              min={0}
              hint="What lands in the account"
            />
            <NumberField
              label="Factor rate"
              prefix="×"
              value={factor}
              onChange={setFactor}
              step={0.01}
              min={1}
              hint="Fixed multiplier — not an APR"
            />
            <NumberField
              label="Term"
              suffix="pmts"
              value={term}
              onChange={setTerm}
              step={1}
              min={1}
              hint="Number of payments"
            />
            <FrequencyToggle value={freq} onChange={setFreq} />
          </div>

          <StatBlock cells={cells} className="mt-6" />

          <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-label text-accent">
              Note ·{" "}
            </span>
            Factor rate is a fixed multiplier that sets total payback — not an APR
            or interest rate.
          </p>
        </Card>

        {/* What to walk the merchant through, in order. */}
        <div>
          <h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-label text-muted-foreground">
            Walk him through it — in order
          </h3>
          <ol className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
            {loops.map((loop, i) => (
              <li
                key={loop.k}
                className="flex items-start gap-4 border-b border-border/70 px-4 py-3 last:border-0"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-semibold text-accent tnum">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-foreground">{loop.k}</div>
                  <div className="text-sm text-muted-foreground">{loop.v}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

/* ---- Local controls (token-styled Tailwind utilities) ------------------- */

function NumberField({
  label,
  value,
  onChange,
  step,
  min,
  prefix,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step: number;
  min: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-[10px] font-semibold uppercase tracking-label text-muted-foreground"
      >
        {label}
      </label>
      <div className="group relative flex items-center rounded-xl border border-border bg-card transition-colors focus-within:border-accent/40 focus-within:ring-2 focus-within:ring-ring/30">
        {prefix && (
          <span
            aria-hidden="true"
            className="pl-3 font-mono text-sm text-muted-foreground"
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ""}
          step={step}
          min={min}
          onChange={(e) => onChange(e.currentTarget.valueAsNumber)}
          className={cn(
            "w-full bg-transparent py-2.5 font-mono text-base font-semibold text-foreground tnum outline-none",
            "placeholder:text-muted-foreground/50",
            prefix ? "pl-1.5" : "pl-3",
            suffix ? "pr-1.5" : "pr-3",
          )}
        />
        {suffix && (
          <span
            aria-hidden="true"
            className="pr-3 font-mono text-xs text-muted-foreground"
          >
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </div>
  );
}

function FrequencyToggle({
  value,
  onChange,
}: {
  value: Frequency;
  onChange: (f: Frequency) => void;
}) {
  const options: Frequency[] = ["daily", "weekly"];
  return (
    <div className="flex flex-col gap-1.5">
      <span
        id="freq-label"
        className="font-mono text-[10px] font-semibold uppercase tracking-label text-muted-foreground"
      >
        Pulls
      </span>
      <div
        role="group"
        aria-labelledby="freq-label"
        className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/60 p-1"
      >
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt)}
              className={cn(
                "focus-ring rounded-lg py-2 text-sm font-medium capitalize transition-all",
                active
                  ? "bg-accent-gradient text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <span className="text-[11px] text-muted-foreground">How often it draws</span>
    </div>
  );
}

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { Tag } from "@/components/ui/Tag";
import { inlineBold } from "@/lib/inlineBold";
import { ticker } from "@/content/meta";
import {
  pitchProducts,
  relationshipProducts,
  primaryProduct,
  productByName,
  type BranchId,
} from "./callScript";
import type { Product } from "@/types/content";

/** Which product(s) the call should lead with, given the resolved branch. */
function recommendedNames(branch: BranchId): string[] {
  if (branch === "funded") {
    // ↪ All set: the second swing is a refi/top-up of his position (an MCA
    // underneath); CCP is the hold for an already-funded merchant.
    return [primaryProduct()?.name, productByName("CCP")?.name].filter(
      (n): n is string => !!n,
    );
  }
  if (branch === "light") return relationshipProducts().map((p) => p.name);
  const mca = primaryProduct()?.name; // qualifies / undecided → bread-and-butter
  return mca ? [mca] : [];
}

function recLabel(branch: BranchId): string {
  if (branch === "funded") return "Already funded — push for the second swing (refi / renewal)";
  if (branch === "light") return "Not yet fundable — relationship plays only";
  return "Qualifies — lead with MCA; reach for the rest only if the file earns it";
}

/**
 * The persistent right-hand reference: "what I sell." The full product matrix
 * with qualifying thresholds and a branch-driven recommendation. Tapping a
 * product selects it (fills the pitch line on the left). Reference, not chrome —
 * deliberately information-dense, but flat and calm.
 */
export function ProductMatrixPanel({
  branch,
  selected,
  onSelect,
}: {
  branch: BranchId;
  selected: string;
  onSelect: (name: string) => void;
}) {
  // Branch-derived lists only change when the branch does.
  const rec = useMemo(() => new Set(recommendedNames(branch)), [branch]);
  const funding = useMemo(() => pitchProducts(), []);
  const relationship = useMemo(() => relationshipProducts(), []);
  // The single qualify floor, straight from the locked ticker (first three
  // chips) plus the fourth floor condition (business bank account).
  const floor = ticker
    .slice(0, 3)
    .map((t) => `${t.v}${t.sub ? t.sub.startsWith("/") ? t.sub : ` ${t.sub}` : ""}`)
    .join(" · ");
  const bankAcct = ticker[3];

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const toggle = (name: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 border-b border-border px-5 py-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-label text-foreground">
            Product Matrix
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            what the file can carry
          </span>
        </div>
        {/* Thresholds — always in view. */}
        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-2-border bg-surface-2 px-2.5 py-0.5">
            <span className="font-mono uppercase tracking-wider text-surface-2-foreground">Floor</span>
            <b className="font-semibold tabular-nums text-foreground">{floor}</b>
          </span>
          {bankAcct && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-2-border bg-surface-2 px-2.5 py-0.5">
              <span className="font-mono uppercase tracking-wider text-surface-2-foreground">{bankAcct.k}</span>
              <b className="font-semibold tabular-nums text-foreground">{bankAcct.v}</b>
            </span>
          )}
        </div>
        {/* recLabel: 13px on accent-strong (7.07:1) clears AA for small text;
            the 12px accent it replaced grazed the 4.5:1 line. */}
        <p className="mt-2 text-[13px] font-medium leading-snug text-accent-strong">{recLabel(branch)}</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-thin px-5 py-4">
        <ul className="space-y-1.5">
          {funding.map((p) => (
            <ProductRow
              key={p.name}
              product={p}
              recommended={rec.has(p.name)}
              selected={selected === p.name}
              expanded={expanded.has(p.name)}
              onSelect={() => onSelect(p.name)}
              onToggle={() => toggle(p.name)}
            />
          ))}
        </ul>

        <div className="mt-4 border-t border-border pt-3">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-label text-muted-foreground">
            Relationship plays — never an opener
          </p>
          <ul className="mt-2 space-y-1.5">
            {relationship.map((p) => (
              <ProductRow
                key={p.name}
                product={p}
                recommended={rec.has(p.name)}
                selected={selected === p.name}
                expanded={expanded.has(p.name)}
                onSelect={() => onSelect(p.name)}
                onToggle={() => toggle(p.name)}
                quiet
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  recommended,
  selected,
  expanded,
  onSelect,
  onToggle,
  quiet,
}: {
  product: Product;
  recommended: boolean;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
  onToggle: () => void;
  quiet?: boolean;
}) {
  const details = product.details ?? [];
  return (
    <li
      className={cn(
        "overflow-hidden rounded-lg border transition-colors",
        selected
          ? "border-accent bg-accent/[0.06]"
          : recommended
            ? "border-accent/40 bg-accent/[0.03]"
            : "border-border bg-card",
        quiet && !selected && !recommended && "opacity-80",
      )}
    >
      <div className="flex items-stretch">
        {/* Tap the body to set this as the pitch line on the left. */}
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className="focus-ring min-w-0 flex-1 px-3 py-2 text-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Tag color={product.tag}>{product.name}</Tag>
            {recommended && (
              <span className="font-mono text-[9px] font-semibold uppercase tracking-label text-accent-strong">
                ◆ Lead
              </span>
            )}
            {selected && (
              <span className="ml-auto font-mono text-[9px] font-semibold uppercase tracking-label text-accent-strong">
                Selected
              </span>
            )}
          </div>
          <p className="mt-1 text-[12.5px] leading-snug text-foreground">{product.bestFit}</p>
        </button>

        {/* Chevron expands the detail collapsible (independent of selection). */}
        {details.length > 0 && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={`${expanded ? "Hide" : "Show"} ${product.name} details`}
            className="focus-ring flex w-9 shrink-0 items-center justify-center border-l border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          >
            <span
              aria-hidden="true"
              className={cn("font-mono text-[11px] transition-transform", expanded && "rotate-90")}
            >
              ▸
            </span>
          </button>
        )}
      </div>

      {expanded && details.length > 0 && (
        <dl className="space-y-1.5 border-t border-border/60 bg-background/40 px-3 py-2.5">
          {details.map((d) => (
            <div key={d.label} className="grid grid-cols-[5.25rem_1fr] gap-2">
              <dt className="font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground">
                {d.label}
              </dt>
              <dd
                className="text-[12.5px] leading-snug text-foreground"
                dangerouslySetInnerHTML={inlineBold(d.value)}
              />
            </div>
          ))}
          <div className="grid grid-cols-[5.25rem_1fr] gap-2 border-t border-border/50 pt-1.5">
            <dt className="font-mono text-[9.5px] uppercase tracking-wider text-accent-strong">Say it</dt>
            <dd className="text-[12.5px] italic leading-snug text-muted-foreground">{product.sayIt}</dd>
          </div>
        </dl>
      )}
    </li>
  );
}

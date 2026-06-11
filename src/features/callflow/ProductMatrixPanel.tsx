import { cn } from "@/lib/cn";
import { Tag } from "@/components/ui/Tag";
import { ticker } from "@/content/meta";
import {
  pitchProducts,
  relationshipProducts,
  primaryProduct,
  renewalProduct,
  type BranchId,
} from "./callScript";
import type { Product } from "@/types/content";

/* Inline **bold** emphasis used in product terms (mirrors the rest of the app). */
function bold(s: string): { __html: string } {
  const html = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, '<b class="font-semibold text-foreground">$1</b>');
  return { __html: html };
}

/** Which product(s) the call should lead with, given the resolved branch. */
function recommendedNames(branch: BranchId): string[] {
  if (branch === "funded") {
    const r = renewalProduct()?.name;
    return r ? [r] : [];
  }
  if (branch === "light") return relationshipProducts().map((p) => p.name);
  const mca = primaryProduct()?.name; // qualifies / undecided → bread-and-butter
  return mca ? [mca] : [];
}

function recLabel(branch: BranchId): string {
  if (branch === "funded") return "Already funded — lead with the refi / renewal";
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
  const rec = new Set(recommendedNames(branch));
  const funding = pitchProducts();
  const relationship = relationshipProducts();
  const green = ticker[3]?.v ?? "$20K · 12mo · 570";

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
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
          <span className="text-muted-foreground">
            <span className="font-mono uppercase tracking-wider text-muted-foreground/70">Floor </span>
            <b className="font-semibold tabular-nums text-foreground">$15K/mo · 6+mo · 500+</b>
          </span>
          <span className="text-muted-foreground">
            <span className="font-mono uppercase tracking-wider text-muted-foreground/70">Green </span>
            <b className="font-semibold tabular-nums text-foreground">{green}</b>
          </span>
        </div>
        <p className="mt-2 text-[12px] leading-snug text-accent">{recLabel(branch)}</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-thin px-5 py-4">
        <ul className="space-y-1.5">
          {funding.map((p) => (
            <ProductRow
              key={p.name}
              product={p}
              recommended={rec.has(p.name)}
              selected={selected === p.name}
              onSelect={() => onSelect(p.name)}
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
                onSelect={() => onSelect(p.name)}
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
  onSelect,
  quiet,
}: {
  product: Product;
  recommended: boolean;
  selected: boolean;
  onSelect: () => void;
  quiet?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          "focus-ring block w-full rounded-lg border px-3 py-2 text-left transition-colors",
          selected
            ? "border-accent bg-accent/[0.06]"
            : recommended
              ? "border-accent/40 bg-accent/[0.03] hover:border-accent/60"
              : "border-border bg-card hover:border-accent/30",
          quiet && !selected && !recommended && "opacity-80",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Tag color={product.tag}>{product.name}</Tag>
          {recommended && (
            <span className="font-mono text-[9px] font-semibold uppercase tracking-label text-accent">
              ◆ Lead
            </span>
          )}
          {selected && (
            <span className="ml-auto font-mono text-[9px] font-semibold uppercase tracking-label text-accent">
              Selected
            </span>
          )}
        </div>
        <p className="mt-1 text-[12.5px] leading-snug text-foreground">{product.bestFit}</p>
        <p
          className="mt-0.5 text-[12px] leading-snug text-muted-foreground"
          dangerouslySetInnerHTML={bold(product.terms)}
        />
      </button>
    </li>
  );
}

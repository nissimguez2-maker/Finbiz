import type { Callout, Product } from "@/types/content";
import { inlineMarkup } from "@/lib/inlineBold";
import { Disclosure } from "@/components/Disclosure";
import {
  sellProducts,
  productRouting,
  productStructuring,
  productRelationship,
  mcaStructure,
  offerDesk,
} from "./content";

/**
 * Left panel — "What you sell". Three plain stacked sections behind disclosure
 * headers: the product matrix (each product expands for terms/speed/sayIt/
 * details), the MCA structure (rep education), and the Approved Offer desk
 * (post-approval only). No colour, no tags, no boxes beyond a single neutral
 * callout style.
 */
export function LeftPanel() {
  return (
    <div className="space-y-10">
      <Group title="Product matrix">
        <div>
          {sellProducts.map((p) => (
            <ProductRow key={p.name} product={p} />
          ))}
        </div>
        <div className="mt-5 space-y-3">
          {productRouting && <NeutralCallout callout={productRouting} />}
          {productStructuring && <NeutralCallout callout={productStructuring} />}
          <NeutralCallout callout={productRelationship} />
        </div>
      </Group>

      <Group title="MCA structure">
        <div className="space-y-4">
          {/* Canonical example */}
          <dl className="flex flex-wrap gap-x-6 gap-y-1">
            {mcaStructure.example.map((cell) => (
              <div key={cell.k} className="flex items-baseline gap-2">
                <dt className="text-sm text-muted-foreground">{cell.k}</dt>
                <dd className="font-medium text-foreground">{cell.v}</dd>
              </div>
            ))}
          </dl>

          <NeutralCallout callout={mcaStructure.factorNote} />
          <NeutralCallout callout={mcaStructure.whenNote} />
          {mcaStructure.weeklyNote && <NeutralCallout callout={mcaStructure.weeklyNote} />}
          {mcaStructure.gatesNote && <NeutralCallout callout={mcaStructure.gatesNote} />}
          {mcaStructure.riskNote && <NeutralCallout callout={mcaStructure.riskNote} />}

          <KeyValueList rows={mcaStructure.loops} />
        </div>
      </Group>

      <Group title="Approved Offer desk">
        <div className="space-y-4">
          <NeutralCallout callout={offerDesk.gate} />
          <KeyValueList rows={offerDesk.loops} />
        </div>
      </Group>
    </div>
  );
}

/** A top-level panel section: quiet heading + content separated by whitespace. */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="eyebrow mb-3 text-accent">{title}</h3>
      {children}
    </section>
  );
}

/** One product as a disclosure: name + bestFit one-liner, expands to detail. */
function ProductRow({ product }: { product: Product }) {
  return (
    <Disclosure
      summary={product.name}
      hint={<span dangerouslySetInnerHTML={inlineMarkup(product.bestFit)} />}
    >
      <dl className="space-y-2.5">
        <Field label="Terms" value={product.terms} />
        <Field label="Speed" value={product.speed} />
        <Field label="Say it" value={product.sayIt} />
        {product.details?.map((d) => <Field key={d.label} label={d.label} value={d.value} />)}
      </dl>
    </Disclosure>
  );
}

/** A labelled detail line. */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd
        className="mt-0.5 text-sm leading-relaxed text-foreground"
        dangerouslySetInnerHTML={inlineMarkup(value)}
      />
    </div>
  );
}

/** Key/value loop rows (MCA mechanics / Offer desk steps). */
function KeyValueList({ rows }: { rows: { k: string; v: string }[] }) {
  return (
    <dl className="space-y-2.5 border-t border-border pt-4">
      {rows.map((row) => (
        <div key={row.k}>
          <dt className="text-sm font-medium text-foreground">{row.k}</dt>
          <dd
            className="mt-0.5 text-sm leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={inlineMarkup(row.v)}
          />
        </div>
      ))}
    </dl>
  );
}

/** The single neutral callout style: thin left border + faint tinted fill. */
export function NeutralCallout({ callout }: { callout: Callout }) {
  return (
    <div className="border-l-2 border-border bg-muted/50 py-2.5 pl-4 pr-3">
      <p className="eyebrow mb-1 text-muted-foreground">{callout.label}</p>
      <p
        className="text-sm leading-relaxed text-foreground"
        dangerouslySetInnerHTML={inlineMarkup(callout.body)}
      />
    </div>
  );
}

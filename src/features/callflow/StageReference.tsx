import { useState } from "react";
import { cn } from "@/lib/cn";
import { Callout } from "@/components/ui/Callout";
import { Tag } from "@/components/ui/Tag";
import { Say, Cue } from "@/components/ui/Beat";
import {
  gateLanes,
  gateRule,
  floorChips,
  pitchProducts,
  primaryProduct,
  pitchPitches,
  pitchRails,
  relationshipProducts,
  relationshipNote,
  renewalProduct,
  renewalPitch,
  coreFileRows,
  conditionalFileRows,
  fileNote,
  fileCallouts,
  type Step,
  type BranchId,
} from "./callScript";
import type { Lane, Product, TableRow } from "@/types/content";

/* Inline **bold** emphasis used in product terms / file rows (mirrors DataTable). */
function inlineHtml(s: string): { __html: string } {
  const html = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  return { __html: html };
}

function RefHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="eyebrow">{children}</h3>;
}

/** The ready-to-speak version of a product — one consistent card across Pitch
 *  and Funded so the "here's the exact line" idiom never drifts. */
function SayItBlock({ title, say, cue }: { title: string; say: string; cue: string }) {
  return (
    <div className="console-card space-y-1.5 bg-muted/30 p-3">
      <span className="eyebrow">{title}</span>
      <Say>{say}</Say>
      <Cue>{cue}</Cue>
    </div>
  );
}

/* ---- GATE ------------------------------------------------------------------ */
const laneTint: Record<Lane["tone"], string> = {
  go: "border-go/30 bg-go/[0.05]",
  amber: "border-amber/30 bg-amber/[0.06]",
  clay: "border-clay/30 bg-clay/[0.05]",
};
const laneAccent: Record<Lane["tone"], string> = {
  go: "text-go",
  amber: "text-amber",
  clay: "text-clay",
};

function GateReference() {
  return (
    <div className="space-y-3">
      <RefHeading>Lane read — floor & verdict</RefHeading>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {gateLanes.map((lane) => (
          <div
            key={lane.name}
            className={cn("rounded-xl border p-2.5", laneTint[lane.tone])}
          >
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-bold text-foreground">{lane.name}</span>
              <span
                className={cn(
                  "font-mono text-[10px] font-bold uppercase tracking-label",
                  laneAccent[lane.tone],
                )}
              >
                {lane.verdict}
              </span>
            </div>
            <ul className="space-y-1">
              {lane.items.map((item, i) => (
                <li
                  key={i}
                  className="text-[12.5px] leading-snug text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {floorChips.map((chip) => (
          <span
            key={chip.k}
            className="inline-flex items-baseline gap-1 rounded-full border border-border bg-muted/60 px-3 py-1"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {chip.k}
            </span>
            <span className="text-sm font-bold tabular-nums text-foreground">{chip.v}</span>
            {chip.sub && (
              <span className="text-[11px] text-muted-foreground">{chip.sub}</span>
            )}
          </span>
        ))}
      </div>
      <p className="text-xs italic text-muted-foreground">
        <span className="font-semibold not-italic text-accent">{gateRule.label}: </span>
        {gateRule.body}
      </p>
    </div>
  );
}

/* ---- PITCH ----------------------------------------------------------------- */
function ProductRow({ product }: { product: Product }) {
  const primary = product.primary;
  return (
    <div className={cn("p-2.5", primary ? "console-card-accent" : "console-card")}>
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <Tag color={product.tag}>{product.name}</Tag>
        {primary && (
          <span className="font-mono text-[9px] font-semibold uppercase tracking-label text-accent">
            Primary
          </span>
        )}
      </div>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1 text-[12.5px] sm:grid-cols-[auto_1fr]">
        <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Best fit
        </dt>
        <dd className="text-foreground" dangerouslySetInnerHTML={inlineHtml(product.bestFit)} />
        <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Terms
        </dt>
        <dd className="text-muted-foreground" dangerouslySetInnerHTML={inlineHtml(product.terms)} />
        <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Speed
        </dt>
        <dd className="text-muted-foreground">{product.speed}</dd>
        <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Say it
        </dt>
        <dd className="italic text-muted-foreground">{product.sayIt}</dd>
      </dl>
    </div>
  );
}

function PitchReference() {
  const primary = primaryProduct();
  const rest = pitchProducts().filter((p) => !p.primary);
  const ordered = primary ? [primary, ...rest] : rest;
  // The ready-to-speak version of the primary product, when we have one.
  const leadPitch = pitchPitches.find((p) => /mca/i.test(p.title)) ?? pitchPitches[0];

  return (
    <div className="space-y-3">
      <RefHeading>Point it — what the file can carry</RefHeading>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {ordered.map((p) => (
          <ProductRow key={p.name} product={p} />
        ))}
      </div>
      {leadPitch && <SayItBlock title={leadPitch.title} say={leadPitch.say} cue={leadPitch.cue} />}
      <Callout {...pitchRails} />
    </div>
  );
}

/* ---- CLOSE ----------------------------------------------------------------- */
function FileRow({ row }: { row: TableRow }) {
  return (
    <li className="flex items-start gap-3 border-b border-border/60 py-2 last:border-0">
      <span
        className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-accent/40"
        aria-hidden="true"
      />
      <div className="min-w-0">
        {row.cells.map((cell, i) => (
          <span
            key={i}
            className={cn(
              "block leading-snug",
              i === 0
                ? "text-sm font-semibold text-foreground"
                : "text-[12.5px] text-muted-foreground",
            )}
            dangerouslySetInnerHTML={inlineHtml(cell)}
          />
        ))}
      </div>
    </li>
  );
}

function CloseReference() {
  const [showMore, setShowMore] = useState(false);
  const core = coreFileRows();
  const conditional = conditionalFileRows();
  return (
    <div className="space-y-3">
      {fileNote && (
        <p className="text-lg font-bold leading-snug text-foreground">{fileNote}</p>
      )}
      <div>
        <RefHeading>Core — non-negotiable</RefHeading>
        <ul className="mt-2">
          {core.map((row, i) => (
            <FileRow key={i} row={row} />
          ))}
        </ul>
      </div>
      {conditional.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowMore((s) => !s)}
            aria-expanded={showMore}
            className="focus-ring inline-flex items-center gap-1.5 rounded-md font-mono text-[11px] font-semibold uppercase tracking-wider text-accent"
          >
            <span aria-hidden="true">{showMore ? "▾" : "▸"}</span>
            {showMore ? "Hide conditional" : `More — conditional (${conditional.length})`}
          </button>
          {showMore && (
            <ul className="mt-2">
              {conditional.map((row, i) => (
                <FileRow key={i} row={row} />
              ))}
            </ul>
          )}
        </div>
      )}
      {fileCallouts.map((c, i) => (
        <Callout key={i} {...c} />
      ))}
    </div>
  );
}

/* ---- LIGHT ----------------------------------------------------------------- */
function LightReference() {
  return (
    <div className="space-y-3">
      <RefHeading>Relationship plays — hold the door</RefHeading>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {relationshipProducts().map((p) => (
          <ProductRow key={p.name} product={p} />
        ))}
      </div>
      <Callout {...relationshipNote} />
    </div>
  );
}

/* ---- FUNDED ---------------------------------------------------------------- */
function FundedReference() {
  const product = renewalProduct();
  const pitch = renewalPitch();
  return (
    <div className="space-y-3">
      <RefHeading>Renewal / refi — the second swing</RefHeading>
      {product && <ProductRow product={product} />}
      {pitch && <SayItBlock title={pitch.title} say={pitch.say} cue={pitch.cue} />}
    </div>
  );
}

/**
 * The contextual reference block beneath the hero line (GUIDED-FLOW §2). What it
 * shows depends entirely on the active step + branch; open/story/dig render no
 * reference (the spoken lines + cues carry those stages).
 */
export function StageReference({ stage }: { stage: Step; branch: BranchId }) {
  switch (stage) {
    case "gate":
      return <GateReference />;
    case "pitch":
      return <PitchReference />;
    case "close":
      return <CloseReference />;
    case "light":
      return <LightReference />;
    case "funded":
      return <FundedReference />;
    default:
      return null;
  }
}

/**
 * Content schema — the contract between the data layer (src/content/*) and the
 * section components (src/components/sections/*).
 *
 * Everything an SDR reads on a call lives in src/content as typed data so it can
 * be tweaked, added to, or removed every day WITHOUT touching layout code, and so
 * it can be regenerated from the source-of-truth Google Docs by the sync pipeline.
 */

export type Tone = "accent" | "go" | "amber" | "clay" | "neutral";
export type TagColor = "gold" | "blue" | "teal" | "slate";

/** Per-section header metadata + nav entry. */
export interface SectionMeta {
  /** Stable id, also used as the in-page anchor (#id). */
  id: string;
  /** Two-digit nav index shown in the rail, e.g. "01". */
  navNo: string;
  /** Short nav label. */
  navLabel: string;
  /** Mono eyebrow above the headline, e.g. "Live". */
  eyebrow: string;
  /** Section headline. Wrap the word to gradient-highlight in {curlies}, e.g. "Call {Flow}". */
  title: string;
  /** Supporting lead paragraph. */
  lead: string;
}

/** A reusable callout band. */
export interface Callout {
  tone: Exclude<Tone, "neutral">;
  label: string;
  body: string;
}

/** ---- Call Flow ---------------------------------------------------------- */
export interface CallBeat {
  /** Beat marker + name, e.g. "① Open — own it". */
  label: string;
  /** Lines the rep says aloud. */
  says: string[];
  /** Coaching cues (what the line is doing / what to listen for). */
  cues?: string[];
  /** Literal text-message bubbles, rendered distinct from spoken lines. */
  texts?: string[];
}

export interface BranchCard {
  title: string;
  says: string[];
  cues?: string[];
}

export interface CallFlowContent {
  meta: SectionMeta;
  rule?: Callout;
  beats: CallBeat[];
  branches: BranchCard[];
}

/** ---- Products ----------------------------------------------------------- */
/** One labelled detail row in a product's collapsible (eligibility, amount, …). */
export interface ProductDetailRow {
  label: string;
  value: string;
}

export interface Product {
  name: string;
  tag: TagColor;
  /** Marks the bread-and-butter product. */
  primary?: boolean;
  /** Marks CCP / Credit Repair etc. — never an opener. */
  relationshipPlay?: boolean;
  bestFit: string;
  terms: string;
  speed: string;
  /** How to say it / the main caveat. */
  sayIt: string;
  /** Expanded detail rows shown in the product matrix's collapsible. */
  details?: ProductDetailRow[];
}

export interface ProductPitch {
  title: string;
  say: string;
  cue: string;
  tag?: TagColor;
}

export interface ProductsContent {
  meta: SectionMeta;
  products: Product[];
  pitches: ProductPitch[];
  relationshipNote: Callout;
  rails: Callout;
}

/** ---- MCA structure (rep education — NOT quoted live) -------------------- */
export interface StatCell {
  k: string;
  v: string;
  hot?: boolean;
}

export interface KeyValueRow {
  k: string;
  v: string;
}

export interface McaContent {
  meta: SectionMeta;
  example: StatCell[];
  factorNote: Callout;
  whenNote: Callout;
  loops: KeyValueRow[];
}

/** ---- Triage / Lanes ----------------------------------------------------- */
export interface Lane {
  tone: "go" | "amber" | "clay";
  name: string;
  verdict: string;
  items: string[];
}

export interface TriageContent {
  meta: SectionMeta;
  lanes: Lane[];
  rule: Callout;
}

/** ---- Generic table sections (Statements, Minimum File, Final QA) -------- */
export interface TableRow {
  cells: string[];
  /** Optional emphasis index — render this row's first cell bold (e.g. priority rows). */
  emphasize?: boolean;
  /** Optional sub-header row spanning all columns. */
  subhead?: string;
  /** Optional leading number badge. */
  no?: string;
}

export interface TableSection {
  meta: SectionMeta;
  columns: string[];
  rows: TableRow[];
  callouts?: Callout[];
  /** Optional extra note paragraph rendered under the table. */
  note?: string;
}

/** ---- Pipeline ----------------------------------------------------------- */
export interface PipelineStep {
  n: string;
  title: string;
  desc: string;
}

export interface DiscoveryQ {
  n: string;
  ask: string;
  reveals: string;
}

export interface PipelineContent {
  meta: SectionMeta;
  steps: PipelineStep[];
  questions: DiscoveryQ[];
  settles: Callout;
}

/** ---- Objections --------------------------------------------------------- */
export interface Objection {
  q: string;
  reframe: string;
  note?: string;
}

export interface DealKiller {
  issue: string;
  move: string;
}

export interface CompliancePair {
  dont: string;
  say: string;
}

export interface ObjectionsContent {
  meta: SectionMeta;
  objections: Objection[];
  dealKillers: DealKiller[];
  compliance: CompliancePair[];
}

/** ---- Follow-ups --------------------------------------------------------- */
export interface SmsTemplate {
  label: string;
  text: string;
}

export interface FollowUpScenario {
  scenario: string;
  templates: SmsTemplate[];
}

export interface FollowUpsContent {
  meta: SectionMeta;
  scenarios: FollowUpScenario[];
}

/** ---- Approved-Offer calculator (post-approval only) -------------------- */
export interface OfferContent {
  meta: SectionMeta;
  /** Framing that this is used AFTER underwriting approves, never live. */
  gate: Callout;
  loops: KeyValueRow[];
}

/** ---- A registered, renderable section ---------------------------------- */
export interface RegisteredSection {
  meta: SectionMeta;
  Component: React.ComponentType;
}

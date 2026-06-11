/**
 * callScript — the ONE place the guided-flow feature reaches into the locked
 * content in src/content/*. Panels import their slice from here, never from
 * content/* directly, so the content coupling lives in a single file.
 *
 * It does NOT copy or reword any script text — it references existing fields.
 */
import { callFlow } from "@/content/callFlow";
import { triage } from "@/content/triage";
import { products } from "@/content/products";
import { minimumFile } from "@/content/minimumFile";
import { objections } from "@/content/objections";
import { ticker } from "@/content/meta";
import type {
  CallBeat,
  BranchCard,
  Product,
  ProductPitch,
  Lane,
  TableRow,
  Callout,
  Objection,
  DealKiller,
  CompliancePair,
} from "@/types/content";

/** A step in the call: the 6 canonical stages plus the two branch screens. */
export type Step =
  | "open"
  | "story"
  | "gate"
  | "dig"
  | "pitch"
  | "close"
  | "light"
  | "funded";

/** Branch resolved at the Gate. `null` until the rep picks a lane. */
export type BranchId = "qualifies" | "light" | "funded" | null;

/** Short labels for the stepper. */
export const STEP_LABELS: Record<Step, string> = {
  open: "Open",
  story: "Story",
  gate: "Gate",
  dig: "Dig",
  pitch: "Pitch",
  close: "Close",
  light: "Light",
  funded: "Funded",
};

/** The ordered path of steps for a given branch (derived, never stored). */
export function pathFor(branch: BranchId): Step[] {
  switch (branch) {
    case "light":
      return ["open", "story", "gate", "light", "close"];
    case "funded":
      return ["open", "story", "gate", "funded", "close"];
    case "qualifies":
    case null:
    default:
      return ["open", "story", "gate", "dig", "pitch", "close"];
  }
}

/** Which beat / branch-card backs each step. */
function beatForStep(step: Step): CallBeat | BranchCard {
  switch (step) {
    case "open":
      return callFlow.beats[0];
    case "story":
      return callFlow.beats[1];
    case "gate":
      return callFlow.beats[2];
    case "dig":
      return callFlow.beats[3];
    case "pitch":
      return callFlow.beats[4];
    case "close":
      return callFlow.beats[5];
    case "light":
      return callFlow.branches[1]; // "↪ Light"
    case "funded":
      return callFlow.branches[0]; // "↪ All set / already funded"
  }
}

/** The spoken lines for a step — what the hero line cursor steps through. */
export function stepLines(step: Step): string[] {
  return beatForStep(step).says;
}
/** Coaching cues for a step. */
export function stepCues(step: Step): string[] {
  return beatForStep(step).cues ?? [];
}
/** Literal SMS bubbles for a step (only Close has them today). */
export function stepTexts(step: Step): string[] {
  const b = beatForStep(step);
  return "texts" in b && b.texts ? b.texts : [];
}
/** A human title for a branch screen (from the locked branch card). */
export function branchTitle(step: "light" | "funded"): string {
  return (beatForStep(step) as BranchCard).title;
}

/** Persistent coaching strip shown across every stage. */
export const flowRule: Callout | undefined = callFlow.rule;

/* ---- Gate reference (triage lanes + floor chips) ----------------------- */
export const gateLanes: Lane[] = triage.lanes;
export const gateRule: Callout = triage.rule;
/** The floor numbers as compact chips (qualify floor / time in biz / credit). */
export const floorChips = ticker.slice(0, 3);

/* ---- Pitch reference (woven product matrix) ---------------------------- */
/** Products that can open / be pitched live (excludes relationship plays). */
export function pitchProducts(): Product[] {
  return products.products.filter((p) => !p.relationshipPlay);
}
/** The primary product (MCA). */
export function primaryProduct(): Product | undefined {
  return products.products.find((p) => p.primary);
}
export const pitchPitches: ProductPitch[] = products.pitches;
export const pitchRails: Callout = products.rails;

/* ---- Light branch reference (relationship plays) ----------------------- */
export function relationshipProducts(): Product[] {
  return products.products.filter((p) => p.relationshipPlay);
}
export const relationshipNote: Callout = products.relationshipNote;

/* ---- Funded branch reference (renewal / refi) -------------------------- */
export function renewalProduct(): Product | undefined {
  return products.products.find((p) => /renew|refi|consol/i.test(p.name));
}
export function renewalPitch(): ProductPitch | undefined {
  return products.pitches.find((p) => /renew|refi|consol|second swing/i.test(p.title));
}

/* ---- Close reference (minimum file) ------------------------------------ */
function rowsAfterSubhead(match: RegExp): TableRow[] {
  const out: TableRow[] = [];
  let collecting = false;
  for (const row of minimumFile.rows) {
    if (row.subhead) {
      collecting = match.test(row.subhead);
      continue;
    }
    if (collecting) out.push(row);
  }
  return out;
}
/** Core "must collect" rows (the non-negotiable block). */
export function coreFileRows(): TableRow[] {
  return rowsAfterSubhead(/core/i);
}
/** Conditional rows (only when the situation calls for them). */
export function conditionalFileRows(): TableRow[] {
  return rowsAfterSubhead(/conditional/i);
}
export const fileNote: string | undefined = minimumFile.note;
export const fileCallouts: Callout[] = minimumFile.callouts ?? [];

/* ---- Always-on objections ---------------------------------------------- */
export const objectionList: Objection[] = objections.objections;
export const dealKillers: DealKiller[] = objections.dealKillers;
export const compliancePairs: CompliancePair[] = objections.compliance;

/* ---- After-the-call tabs ----------------------------------------------- */
export type AfterCallTab = "statements" | "qa" | "offer" | "pipeline" | "mca";
export const afterCallTabs: { id: AfterCallTab; label: string }[] = [
  { id: "statements", label: "Statement Read" },
  { id: "qa", label: "Final QA" },
  { id: "offer", label: "Approved Offer" },
  { id: "pipeline", label: "Pipeline" },
  { id: "mca", label: "MCA Structure" },
];

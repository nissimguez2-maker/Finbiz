import type { ComplianceContent } from "@/types/content";

/**
 * Compliance & posture — how you carry the call and the rules for written
 * follow-ups. The verbal "say instead" pairs and deal-killers live in
 * objections.ts; this is the always-on framing that sits in Quick Lookup.
 */
export const compliance: ComplianceContent = {
  meta: {
    id: "compliance",
    navNo: "13",
    navLabel: "Compliance",
    eyebrow: "Rails",
    title: "Posture & {Rails}",
    lead:
      "How you carry it, and what you never say or write. The file wins the argument — you just keep it clean.",
  },
  posture: {
    tone: "accent",
    label: "Posture",
    body:
      "Make him feel like a sharp businessman — respect his time and judgment, never talk down. At the same time be the domain pro: precise, in command of the numbers. A peer who happens to be the expert.",
  },
  writtenRails: [
    "Never write the word “MCA” in an SMS or email — it carries a bad connotation. Call it “funding.” He can call it an MCA; you don't, in writing.",
    "FinBiz / FinBiz Funding only — never name any parent or holding entity.",
    "No “guaranteed” or “approved” — approval depends on underwriting.",
    "No rate before the file — the statements set the rate.",
    "Never claim an offer before you've seen a file. Keep “no obligation” in.",
  ],
};

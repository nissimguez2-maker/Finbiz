import type { TriageContent } from "@/types/content";

/**
 * Eligibility lanes for live triage. The rep is deciding whether the file is
 * worth pursuing — NOT underwriting it. Voice: Ness — plainspoken, no hype.
 * Compliance: triage only; no "approved/guaranteed", no rate before the file.
 */
export const triage: TriageContent = {
  meta: {
    id: "triage",
    navNo: "04",
    navLabel: "Triage & Lanes",
    eyebrow: "Triage",
    title: "Eligibility & {Lanes}",
    lead:
      "You're not underwriting — you're triaging. The only question right now: is this file worth pursuing, and what risk has to be on the table before it ships? Floor to even start: $15K+/mo deposits, 6+ months, 500+ credit. Below that, needing money isn't the same as being fundable.",
  },
  lanes: [
    {
      tone: "go",
      name: "Green",
      verdict: "PUSH",
      items: [
        "$20K+ deposits/mo",
        "12+ months",
        "570+ credit",
        "Consistent pattern, low NSFs",
        "Manageable debt, fast cooperation",
      ],
    },
    {
      tone: "amber",
      name: "Yellow",
      verdict: "REVIEW",
      items: [
        "$10–20K deposits/mo",
        "3–12 months",
        "500–570 credit",
        "Some explainable NSFs",
        "One advance, low avg balance",
      ],
    },
    {
      tone: "clay",
      name: "Red",
      verdict: "WEAK",
      items: [
        "Under $10K/mo · neg. now",
        "Under 3 months",
        "Frequent NSFs",
        "Stacked advances, defaults",
        "Liens/judgments · refuses docs",
      ],
    },
  ],
  rule: {
    tone: "accent",
    label: "The rule",
    body: "Don't pitch what sounds best — pitch what the file can actually support.",
  },
};

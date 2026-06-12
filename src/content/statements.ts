import type { TableSection } from "@/types/content";

/**
 * How to read a merchant's bank statements: pull 3 months and read them against
 * the MCA hard gates, flagging reds as you go. Voice: Ness — plainspoken.
 * Compliance: triage, not underwriting. Source: master doc BASE (Statement
 * review step, MCA hard gates, Risk terms).
 */
export const statements: TableSection = {
  meta: {
    id: "statements",
    navNo: "05",
    navLabel: "Statement Read",
    eyebrow: "Truth",
    title: "Reading the {Bank Statements}",
    lead:
      "What a merchant says matters less than what the statements show — so get 3 months and read them against the three MCA hard gates. The gates decide it; flag the reds as you go.",
  },
  columns: ["#", "Review area", "What good looks like", "Risk signal"],
  rows: [
    {
      no: "1",
      emphasize: true,
      cells: [
        "**Deposits (hard gate)**",
        "Avg ≥ 3 deposits/mo across 3 months",
        "Too few deposits / one-time transfers only",
      ],
    },
    {
      no: "2",
      emphasize: true,
      cells: [
        "**Negative days (hard gate)**",
        "No more than ~4–5/mo on average",
        "Repeated or recent negative days",
      ],
    },
    {
      no: "3",
      emphasize: true,
      cells: [
        "**Ending balance (hard gate)**",
        "Positive each of the last 3 months",
        "Negative ending balance in a month",
      ],
    },
    { no: "", cells: ["NSFs", "Clean, stays above zero", "NSFs — repeated or recent"] },
    { no: "", cells: ["Existing positions", "Single, manageable", "Stacking — multiple funders / pressure"] },
    { no: "", cells: ["Risk history", "No prior default", "Prior default · modified position(s)"] },
    { no: "", cells: ["Business / account name", "Matches the file", "Ownership mismatch — wrong owner or entity"] },
    { no: "", cells: ["Authenticity", "Consistent format & sequence", "Manipulated / inconsistent statements"] },
  ],
  callouts: [
    {
      tone: "clay",
      label: "The three gates, in order",
      body: "Deposits (avg ≥ 3/mo) → negative days (≤ ~4–5/mo avg) → positive ending balance each of the last 3 months. Edge case: two amazing months + one slightly negative is workable to pitch, but funders still often reject it.",
    },
    {
      tone: "amber",
      label: "Risk terms",
      body: "A modified position = the merchant got shaky on his daily/weekly MCA and had the funder restructure the remaining balance. To funders, modifying is almost as bad as defaulting — an outright default is worse still.",
    },
  ],
};

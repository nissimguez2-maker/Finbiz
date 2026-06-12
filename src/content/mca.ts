import type { McaContent } from "@/types/content";

/**
 * MCA structure — rep education, NOT a live quote. This is how Ness understands
 * the mechanics so she can explain them cleanly. Factor + payback numbers are
 * never quoted live in front of a lead; real numbers come only after the file's
 * submitted and underwriting approves. Compliance: a factor rate is NOT an APR or
 * interest — it's a fixed multiplier. Numbers are canonical — preserve exactly.
 * Source of truth: FinBiz Master Doc → PART 1 (MCA) + BASE (hard gates · risk
 * terms). Canonical example: $20,000 funded · factor 1.40 · $28,000 payback ·
 * ~100 payments · $280/day — every dependent number stays consistent.
 */
export const mca: McaContent = {
  meta: {
    id: "mca",
    navNo: "03",
    navLabel: "MCA Structure",
    eyebrow: "Structure",
    title: "MCA {Reality} Check",
    lead:
      "An MCA buys future receivables — money now, paid back from sales daily or weekly. This is how YOU understand the structure so you can explain it cleanly. You do not quote factor or payback live in front of a lead — real numbers come only after the file's submitted and underwriting approves.",
  },
  example: [
    { k: "Funded", v: "$20,000" },
    { k: "Factor", v: "1.40", hot: true },
    { k: "Total payback", v: "$28,000", hot: true },
    { k: "Term", v: "100 pmts" },
    { k: "Daily", v: "$280" },
  ],
  factorNote: {
    tone: "clay",
    label: "Non-negotiable",
    body: "A factor rate is not an APR. Never explain it as an interest rate — it's a fixed multiplier that sets the total payback. $20,000 × 1.40 = $28,000; ÷ 100 = $280/day.",
  },
  whenNote: {
    tone: "accent",
    label: "When MCA's the call",
    body: "Reach for it when he needs speed, has active deposits, and the bank box won't pass — but the daily pull has to fit. Stable cash flow and stronger credit → steer to a Term Loan or Line of Credit. Owns property and wants it fast → HELOC. (The live, fillable version of this math is the Approved Offer desk — used only after approval.)",
  },
  weeklyNote: {
    tone: "accent",
    label: "Daily default · weekly upsell",
    body: "Daily is the default; weekly is the upsell. Weekly is NOT available if either is true: he has an open MCA position paid daily, OR FICO is under 650. The canonical ~100 × $280/day reflects the daily pull.",
  },
  gatesNote: {
    tone: "clay",
    label: "The three MCA hard gates (read the 3 months against these)",
    body: "1) Deposits — average of at least 3 deposits/month across the last 3 months. 2) Negative days — no more than ~4–5 negative days/month on average across the last 3 months. 3) Ending balance — positive ending balance in each of the last 3 months. Edge case: two amazing months + one slightly negative is workable to pitch, but funders still often reject it.",
  },
  riskNote: {
    tone: "clay",
    label: "Modified-position risk",
    body: "A modified position = he got shaky on his daily/weekly MCA and had the funder restructure the remaining balance. To funders, modifying is almost as bad as defaulting — and an outright default is worse still.",
  },
  loops: [
    { k: "Funding amount", v: "Exactly what lands in the account" },
    { k: "Total payback", v: "The real obligation — not the funded figure" },
    { k: "Payment frequency", v: "Daily/weekly draws shape day-to-day cash flow" },
    { k: "Cash-flow fit", v: "An approval still has to be survivable to be a good deal" },
    { k: "No obligation", v: "The merchant reviews the full offer before committing" },
  ],
};

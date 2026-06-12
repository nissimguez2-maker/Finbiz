import type { McaContent } from "@/types/content";

/**
 * MCA structure — rep education, NOT a live quote. This is how Ness understands
 * the mechanics so she can explain them cleanly. Factor + payback numbers are
 * never quoted live in front of a lead; real numbers come only after the file's
 * submitted and underwriting approves. Compliance: a factor rate is NOT an APR or
 * interest — it's a fixed multiplier. Numbers are canonical — preserve exactly.
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
    body: "Reach for it when he needs speed, has active deposits, and the bank box won't pass — but the daily pull has to fit. Stable cash flow and stronger credit → steer to a Term Loan or Line of Credit. Owns property and wants it fast → HELOC.",
  },
  loops: [
    { k: "Funding amount", v: "Exactly what lands in the account" },
    { k: "Total payback", v: "The real obligation — not the funded figure" },
    { k: "Payment frequency", v: "Daily/weekly draws shape day-to-day cash flow" },
    { k: "Cash-flow fit", v: "An approval still has to be survivable to be a good deal" },
    { k: "No obligation", v: "The merchant reviews the full offer before committing" },
    { k: "Weekly vs daily", v: "Daily is the default; weekly is the upsell — but no weekly if he has an open daily MCA or FICO under 650" },
  ],
  hardGates: [
    { label: "Deposits", test: "Avg ≥ 3 deposits/mo across the last 3 months" },
    { label: "Negative days", test: "≤ ~4–5 negative days/mo on average, last 3 months" },
    { label: "Ending balance", test: "Positive ending balance in each of the last 3 months" },
  ],
  hardGatesNote: {
    tone: "amber",
    label: "Edge case",
    body: "Two strong months plus one slightly negative is workable to pitch — but funders still often reject it. Don't promise on a thin third month.",
  },
};

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
    body: "Reach for it when he needs speed, has active deposits, and the bank box won't pass — but the daily pull has to fit. Stable cash flow and stronger credit → steer to a Term Loan or Line of Credit. Owns property and wants it fast → HELOC. (The live, fillable version of this math is the Approved Offer desk — used only after approval.)",
  },
  loops: [
    { k: "Funding amount", v: "Exactly what lands in the account" },
    { k: "Total payback", v: "The real obligation — not the funded figure" },
    { k: "Payment frequency", v: "Daily/weekly draws shape day-to-day cash flow" },
    { k: "Cash-flow fit", v: "An approval still has to be survivable to be a good deal" },
    { k: "No obligation", v: "The merchant reviews the full offer before committing" },
  ],
};

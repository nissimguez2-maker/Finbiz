import type { TableSection } from "@/types/content";

/**
 * Pre-submission checklist. A file is only clean when all four blocks check out.
 * Voice: Ness — plainspoken. Compliance: internal enablement only; final
 * approvals depend on lender underwriting and a complete file review.
 */
export const finalQa: TableSection = {
  meta: {
    id: "qa",
    navNo: "10",
    navLabel: "Final QA",
    eyebrow: "Pre-flight",
    title: "Final {QA} Before Submission",
    lead:
      "A file's only clean when all four blocks check out. If you can't explain it, don't send it.",
  },
  columns: ["Block", "Every box checked"],
  rows: [
    {
      emphasize: true,
      cells: [
        "**Merchant**",
        "Decision-maker identified · ownership matches application · both cell and email captured · responsive · use of funds clear",
      ],
    },
    {
      emphasize: true,
      cells: [
        "**Bank Statements**",
        "Recent & complete · name matches · deposits, NSFs, negative days, ACH pulls reviewed",
      ],
    },
    {
      emphasize: true,
      cells: [
        "**Existing Debt**",
        "Balances disclosed · schedule known · payoff letters if refinancing · Zero Balance Letter if there was a prior default · no hidden advances",
      ],
    },
    {
      emphasize: true,
      cells: [
        "**Next Step**",
        "Underwriting request clear · deadline documented · internal owner assigned · cadence set",
      ],
    },
  ],
  callouts: [
    {
      tone: "clay",
      label: "The final rule",
      body: "Never submit a file you don't understand. If you can't explain it, it's not ready.",
    },
  ],
  note: "Built from the FinBiz Master Doc. Internal enablement only — final approvals depend on lender underwriting and complete file review. Confirm current advertised terms at finbizfunding.com before quoting live.",
};

import type { TableSection } from "@/types/content";

/**
 * Pre-submission checklist. A file is only clean when every block checks out.
 * Voice: Ness — plainspoken. Compliance: internal enablement only; final
 * approvals depend on lender underwriting and a complete file review.
 * Source: master doc BASE (pipeline: Contracts/Closing stips/Funding, minimum
 * file, ZBL, contact rule).
 */
export const finalQa: TableSection = {
  meta: {
    id: "qa",
    navNo: "10",
    navLabel: "Final QA",
    eyebrow: "Pre-flight",
    title: "Final {QA} Before Submission",
    lead:
      "A file's only clean when every block checks out. If you can't explain it, don't send it.",
  },
  columns: ["Block", "Every box checked"],
  rows: [
    {
      emphasize: true,
      cells: [
        "**Merchant**",
        "Authorized signer identified · ownership matches application · cell + email both on file · use of funds clear",
      ],
    },
    {
      emphasize: true,
      cells: [
        "**Bank Statements**",
        "3 months, recent & complete · name matches · deposits, NSFs, negative days, ending balance reviewed vs. the hard gates",
      ],
    },
    {
      emphasize: true,
      cells: [
        "**Existing Debt & Risk**",
        "Balances disclosed · payment schedule known · payoff letters if refinancing · ZBL if past default · no hidden positions",
      ],
    },
    {
      emphasize: true,
      cells: [
        "**Contract & Funding**",
        "Authorized signer signs · total payback reviewed · no obligation to accept · stips cleared · wire confirmed",
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
  note: "Internal enablement only — final approvals depend on lender underwriting and complete file review. No rate before the file; the statements set the rate.",
};

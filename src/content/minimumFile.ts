import type { TableSection } from "@/types/content";

/**
 * The minimum package needed to move a file. Core is non-negotiable; conditional
 * items only apply when the situation calls for them. Voice: Ness — plainspoken.
 * Compliance: triage, not underwriting; don't over-ask and spook the merchant.
 */
export const minimumFile: TableSection = {
  meta: {
    id: "file",
    navNo: "06",
    navLabel: "Minimum File",
    eyebrow: "Collect",
    title: "The {Minimum File}",
    lead:
      "A file moves when the core package is in and the merchant moves fast. The core is non-negotiable. Conditional items only apply when the situation calls for them — don't ask for what you don't need yet.",
  },
  columns: ["Item", "Why it's needed"],
  rows: [
    { subhead: "Core — non-negotiable", cells: [] },
    { cells: ["Completed application", "Opens the formal review"] },
    { cells: ["Owner legal name + ID", "Identity verification"] },
    { cells: ["Business name / DBA", "EIN / Entity & tax verification"] },
    { cells: ["Business address · ownership %", "Verification & signer authority"] },
    { cells: ["**3–4 months bank statements**", "Revenue & cash-flow review"] },
    { cells: ["Voided check", "Verifies funding/payment account"] },
    { cells: ["Current loan / MCA balances", "Existing-obligation review"] },
    { subhead: "Conditional — only when it applies", cells: [] },
    { cells: ["Payoff letters [[if refinancing]]", "Confirms balances to be paid"] },
    {
      cells: [
        "Processing stmts / bank login [[if requested]]",
        "Card-sales / real-time verification",
      ],
    },
    { cells: ["Tax returns [[bank-funded only]]", "Income proof for SBA / bank products"] },
  ],
  callouts: [
    {
      tone: "go",
      label: "Tax returns",
      body: "Only for bank-funded products like SBA — never for an MCA. Confirm bank vs. non-bank before you ask, or you'll spook a merchant over a doc you don't even need.",
    },
  ],
  note: "First text, keep it light: **4 months of bank statements + the application**. That's enough to start and lane the file — chase ID, voided check, and balances once they're moving.",
};

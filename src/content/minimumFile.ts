import type { TableSection } from "@/types/content";

/**
 * The minimum package needed to move a file. Core is always required; conditional
 * items only apply when the situation calls for them. Voice: Ness — plainspoken.
 * Compliance: triage, not underwriting; don't over-ask and spook the merchant.
 * Source: master doc BASE (Minimum file / collection).
 */
export const minimumFile: TableSection = {
  meta: {
    id: "file",
    navNo: "06",
    navLabel: "Minimum File",
    eyebrow: "Collect",
    title: "The {Minimum File}",
    lead:
      "A file moves when the core package is in and the merchant moves fast. The core is always required. Conditional items only apply when the situation calls for them — don't ask for what you don't need yet.",
  },
  columns: ["Item", "Why it's needed"],
  rows: [
    { subhead: "Core — always", cells: [] },
    { cells: ["Completed application", "Opens the formal review"] },
    { cells: ["Owner ID / driver's license", "Identity verification"] },
    { cells: ["EIN & ownership %", "Entity & signer authority"] },
    { cells: ["**3 months bank statements**", "Revenue & cash-flow review"] },
    { cells: ["Voided check & business address", "Verifies funding/payment account"] },
    { cells: ["Merchant cell + email", "Two channels — secure both, the handed-off info can be wrong"] },
    { subhead: "Conditional — only when it applies", cells: [] },
    { cells: ["Payoff letters / bank logins", "Confirm balances to be paid"] },
    { cells: ["Processing statements", "Card-sales verification"] },
    { cells: ["Current loan / advance balances", "Existing-obligation review"] },
    { cells: ["ZBL — Zero Balance Letter [[past default, since paid off]]", "Proves the old position is closed out"] },
    { cells: ["Tax returns [[bank-funded only, e.g. SBA]]", "Income proof — never for MCA"] },
  ],
  callouts: [
    {
      tone: "amber",
      label: "Past default (since paid off)",
      body: "Require a ZBL (Zero Balance Letter) from the merchant, on top of bank statements and the product's docs.",
    },
    {
      tone: "go",
      label: "Tax returns",
      body: "Only for bank-funded products like SBA — never for an MCA. Confirm bank vs. non-bank before you ask, or you'll spook a merchant over a doc you don't even need.",
    },
  ],
  note: "First text, keep it light: **3 months of bank statements + the application**. That's enough to start a file — chase ID, EIN & ownership, voided check, and the rest once they're moving. Always get both **cell and email**.",
};

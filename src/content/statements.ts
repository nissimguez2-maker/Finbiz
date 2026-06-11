import type { TableSection } from "@/types/content";

/**
 * How to read a merchant's bank statements during triage. The numbered four are
 * the priority read — hit them in order and you can lane the file before the
 * fine print. Voice: Ness — plainspoken. Compliance: triage, not underwriting.
 */
export const statements: TableSection = {
  meta: {
    id: "statements",
    navNo: "05",
    navLabel: "Statement Read",
    eyebrow: "Truth",
    title: "Reading the {Bank Statements}",
    lead:
      "What a merchant says matters less than what the statements show — so get 4 months and read them. The numbered four tell most of the story before you touch the detail. Hit them in order, then work the rest.",
  },
  columns: ["#", "Review area", "What good looks like", "Risk signal"],
  rows: [
    {
      no: "1",
      emphasize: true,
      cells: ["**Total monthly deposits**", "Real revenue volume", "One-time transfers only"],
    },
    {
      no: "2",
      emphasize: true,
      cells: ["**Average balance**", "An operating cushion", "Constantly near zero"],
    },
    {
      no: "3",
      emphasize: true,
      cells: ["**NSFs & negative days**", "Clean, stays above zero", "Repeated or recent hits"],
    },
    {
      no: "4",
      emphasize: true,
      cells: ["**Existing ACH pulls**", "Single, manageable", "Multiple funders / pressure"],
    },
    { no: "", cells: ["Statement period", "Recent & complete", "Old, missing, or gapped"] },
    { no: "", cells: ["Business / account name", "Matches the file", "Wrong owner or entity"] },
    { no: "", cells: ["Number of deposits", "Active business flow", "Too few deposits"] },
    { no: "", cells: ["Large withdrawals", "Explained outflows", "Irregular / unsupported"] },
    { no: "", cells: ["Authenticity", "Consistent format & sequence", "Inconsistent / manipulated"] },
  ],
  callouts: [
    {
      tone: "clay",
      label: "First four, in order",
      body: "Deposits → balance behavior → NSFs & negative days → existing funder payments. Read those four and you can lane the file before you ever open the fine print.",
    },
  ],
};

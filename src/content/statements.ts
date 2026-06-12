import type { TableSection } from "@/types/content";

/**
 * How to read a merchant's bank statements during triage — the full 10-point
 * review, healthy vs. red-flag. Voice: Ness — plainspoken. Compliance: triage,
 * not underwriting. Reading deposits → balance behavior → negative days/NSFs →
 * existing ACH pulls lanes the file before you ever open the fine print.
 */
export const statements: TableSection = {
  meta: {
    id: "statements",
    navNo: "05",
    navLabel: "Statement Read",
    eyebrow: "Truth",
    title: "Reading the {Bank Statements}",
    lead:
      "What a merchant says matters less than what the statements show — so get 3 months and read them. Walk all ten points, healthy vs. red flag. Deposits → balance behavior → negative days/NSFs → existing ACH pulls lane the file before you touch the detail.",
  },
  columns: ["#", "Review area", "What good looks like", "Risk signal"],
  rows: [
    {
      no: "1",
      emphasize: true,
      cells: ["**Period**", "Recent & complete", "Old, missing, or gapped"],
    },
    {
      no: "2",
      emphasize: true,
      cells: ["**Name**", "Matches the entity / file", "Wrong owner or entity"],
    },
    {
      no: "3",
      emphasize: true,
      cells: ["**Monthly deposits**", "Real revenue volume", "Transfers, not revenue"],
    },
    {
      no: "4",
      emphasize: true,
      cells: ["**Deposit count**", "Active business flow", "Sparse — too few deposits"],
    },
    {
      no: "5",
      emphasize: true,
      cells: ["**Average balance**", "An operating cushion", "Constantly near zero"],
    },
    {
      no: "6",
      emphasize: true,
      cells: ["**Negative days**", "Stable, stays above zero", "Repeated negatives"],
    },
    {
      no: "7",
      emphasize: true,
      cells: ["**NSFs**", "Clean — no failed payments", "Failed payments / NSF hits"],
    },
    {
      no: "8",
      emphasize: true,
      cells: ["**ACH pulls**", "Single, manageable", "Stacking — multiple funders / pressure"],
    },
    {
      no: "9",
      emphasize: true,
      cells: ["**Withdrawals**", "Clear business purpose", "Irregular / unsupported"],
    },
    {
      no: "10",
      emphasize: true,
      cells: ["**Authenticity**", "Consistent format & sequence", "Inconsistent / manipulated"],
    },
  ],
  callouts: [
    {
      tone: "clay",
      label: "Lane it first, in order",
      body: "Deposits → balance behavior → negative days & NSFs → existing ACH pulls. Read those lanes and you can lane the file before you ever open the fine print.",
    },
  ],
};

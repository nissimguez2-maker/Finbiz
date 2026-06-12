/**
 * Global console metadata: brand, the masthead ticker, and the canonical nav
 * order. The guided console (src/features/callflow/) reads brand, ticker and
 * rails directly; the nav list records the canonical section order for the
 * section components in src/components/sections/* (the post-call ones are
 * mounted by AfterCallPanel).
 */

export interface NavItem {
  id: string;
  navNo: string;
  navLabel: string;
}

export const brand = {
  name: "FinBiz",
  mark: "SDR",
  kicker: "Operator Console · Internal",
  title: "SDR Operator {Console}",
  tagline:
    "One screen, every move — who you are on the phone, what we sell, and the last check before you submit. Lead with conviction; let the file win the argument.",
};

/**
 * Masthead ticker — the numbers a rep should never have to look up.
 * NOTE: the first three entries are the qualify-floor chips (revenue / time in
 * business / credit) — callScript.ts reads `ticker.slice(0, 3)` as the floor.
 * Numbers come straight from the master doc's single qualify floor.
 */
export const ticker: { k: string; v: string; sub?: string }[] = [
  { k: "Qualify floor", v: "$15K+", sub: "/mo" },
  { k: "Time in biz", v: "6+", sub: "mo" },
  { k: "Credit", v: "500+", sub: "FICO" },
  { k: "Business bank acct", v: "Required" },
  { k: "Funding range", v: "$5K–$10M" },
  { k: "Approvals", v: "~1 hr" },
  { k: "To start a file", v: "3", sub: "mo stmts" },
];

/** The always-on compliance rails (also rendered as a sticky strip). */
export const rails: string[] = [
  "No “guaranteed / approved”",
  "No rate before the file",
  "Factor ≠ APR",
  "No invented urgency",
  "In SMS/email, never write “MCA” — say “funding”",
];

/** Canonical nav order. Section ids must match the content metas. */
export const nav: NavItem[] = [
  { id: "call", navNo: "01", navLabel: "Call Flow" },
  { id: "products", navNo: "02", navLabel: "Products" },
  { id: "mca", navNo: "03", navLabel: "MCA Structure" },
  { id: "triage", navNo: "04", navLabel: "Triage & Lanes" },
  { id: "statements", navNo: "05", navLabel: "Statement Read" },
  { id: "file", navNo: "06", navLabel: "Minimum File" },
  { id: "pipeline", navNo: "07", navLabel: "Pipeline" },
  { id: "objections", navNo: "08", navLabel: "Objections" },
  { id: "qa", navNo: "09", navLabel: "Final QA" },
  { id: "offer", navNo: "10", navLabel: "Approved Offer" },
];

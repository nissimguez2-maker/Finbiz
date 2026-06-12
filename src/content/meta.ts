/**
 * Global console metadata: brand, the masthead ticker, and the canonical nav
 * order. The nav list here is the single source of truth for section order and
 * must stay in sync with src/content/registry.tsx.
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

/** Masthead ticker — the numbers a rep should never have to look up. */
export const ticker: { k: string; v: string; sub?: string }[] = [
  { k: "Qualify floor", v: "$15K", sub: "/mo" },
  { k: "Time in biz", v: "6+", sub: "mo" },
  { k: "Credit", v: "500+" },
  { k: "Green lane", v: "$20K · 12mo · 570" },
  { k: "To start a file", v: "3", sub: "mo stmts" },
  { k: "Advertised", v: "$5K–$10M · ~1hr · same-day" },
];

/** The always-on compliance rails (also rendered as a sticky strip). */
export const rails: string[] = [
  "No “guaranteed / approved”",
  "No rate before the file",
  "Factor ≠ APR",
  "No invented urgency",
  "FinBiz only — never name a parent company",
  "In writing, never write “MCA” — say “funding”",
];

/** Canonical nav order. Section ids must match registry + content metas. */
export const nav: NavItem[] = [
  { id: "call", navNo: "01", navLabel: "Call Flow" },
  { id: "products", navNo: "02", navLabel: "Products" },
  { id: "mca", navNo: "03", navLabel: "MCA Structure" },
  { id: "triage", navNo: "04", navLabel: "Triage & Lanes" },
  { id: "statements", navNo: "05", navLabel: "Statement Read" },
  { id: "file", navNo: "06", navLabel: "Minimum File" },
  { id: "pipeline", navNo: "07", navLabel: "Pipeline" },
  { id: "objections", navNo: "08", navLabel: "Objections" },
  { id: "followups", navNo: "09", navLabel: "Follow-Ups" },
  { id: "qa", navNo: "10", navLabel: "Final QA" },
];

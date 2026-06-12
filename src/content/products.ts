import type { ProductsContent } from "@/types/content";

/**
 * Product matrix — the whole menu, eye-scannable. Voice: Ness — plainspoken,
 * contractions, no filler. Pitch what the file can support, not what sounds best.
 * Source of truth: FinBiz Master Doc → PART 1 — PRODUCT MATRIX (+ BASE).
 * Lineup (doc order): MCA (PRIMARY) · Bridge Loan · Term Loan · Line of Credit ·
 * HELOC · Equipment Financing · Asset-Based & Specialty · CCP · Credit Repair.
 * Routing: good cash flow → MCA/LOC · 650+ credit → HELOC/Term/SBA · 650+ AND
 * real-estate equity → HELOC (push it over Term/SBA — faster, less paperwork) ·
 * Term/SBA only if he insists. Compliance: factor rate is NOT an APR/interest
 * (APR language lives ONLY on the Term Loan); no "guaranteed/approved"; no rate
 * before the file; SBA/CRE are bank-funded and need tax returns; CCP + Credit
 * Repair never open a call and CROA means we never promise a score. Every number
 * is canonical — preserve exactly.
 */
export const products: ProductsContent = {
  meta: {
    id: "products",
    navNo: "02",
    navLabel: "Products",
    eyebrow: "Fit",
    title: "Product {Matrix}",
    lead:
      "The whole menu, eye-scannable. But don't read it off — name the one or two products the file can carry. MCA is the bread and butter; everything else is a pivot or a relationship play. Pitch what the file supports, not what sounds best.",
  },
  products: [
    {
      name: "MCA",
      tag: "gold",
      primary: true,
      bestFit: "Urgent working capital · active deposits · credit-flexible · needs speed",
      terms:
        "Factor rate + total payback (e.g. **$20K × 1.40 = $28K**, ~100 × **$280/day**) · daily/weekly · non-bank, no tax returns",
      speed: "Fastest",
      sayIt: "Purchase of future receivables; factor rate + total payback. Never 'interest,' 'APR,' or 'bank loan.'",
      details: [
        { label: "Eligibility", value: "$15K+/mo deposits · 6+ months open · 500+ FICO · active deposits" },
        { label: "Vertical fit", value: "Funders pay for predictable, stable cash flow — a steady butcher beats a higher-earning realtor who swings with the season" },
        { label: "Hard spot · Trucking", value: "Funders dislike it — usually only fund when he already has a position open elsewhere" },
        { label: "Hard spot · Texas", value: "Few funders will touch it" },
        { label: "Cost", value: "Factor rate (e.g. 1.40) — a multiplier, NOT an APR" },
        { label: "Payback", value: "Funded × factor = total payback ($20K × 1.40 = $28K)" },
        { label: "Payments", value: "Daily is the default; ~100 × $280/day. Weekly is the upsell" },
        { label: "Weekly NOT available if", value: "He has an open MCA position paid daily, OR FICO under 650" },
        { label: "Speed", value: "Fastest" },
        { label: "Docs", value: "Non-bank — no tax returns · 3 months bank statements" },
      ],
    },
    {
      name: "Bridge Loan",
      tag: "gold",
      bestFit: "He's set on a slow product (SBA / term loan) but needs capital now",
      terms: "An **MCA with an early-cashout clause** — cash out the day the SBA / term loan funds",
      speed: "Fast",
      sayIt: "It's a 'bridge loan' for what it does here — but it's an MCA underneath. Same factor-rate framing.",
      details: [
        { label: "What it is", value: "Technically an MCA with an early-cashout clause to bridge until the SBA / term loan funds" },
        { label: "When", value: "He's set on a slow product and needs capital now" },
        { label: "Cost", value: "Factor rate + total payback, like any MCA — never 'interest' or 'APR'" },
        { label: "Play", value: "Push to keep the position open once the loan lands — money already in his pocket is money growing the business" },
        { label: "Speed", value: "Fast — funds now, cashes out when the slow product lands" },
      ],
    },
    {
      name: "Term Loan",
      tag: "blue",
      bestFit: "Only when he's stubborn on it specifically and nothing else fits · stronger credit · room for monthly",
      terms: "From **~4.99% APR** · **$10K–$10M** · 1–10 yr monthly · no prepay penalty",
      speed: "Med–slow",
      sayIt: "APR is fine here — it's a real loan. Rate depends on underwriting. Heavy and slow — bridge him meanwhile.",
      details: [
        { label: "Eligibility", value: "Stubborn on it specifically and not a fit for anything else · stronger credit · predictable need · room for a monthly payment" },
        { label: "Amount", value: "$10K – $10M" },
        { label: "Cost", value: "From ~4.99% APR · no prepay penalty" },
        { label: "Term", value: "1–10 years, monthly payments" },
        { label: "Reality", value: "Bureaucratically heavy and slow to fund — bridge him meanwhile (see Bridge Loan)" },
        { label: "SBA", value: "Lives in this family — a term loan, just bank-funded and slower (needs tax returns)" },
        { label: "Speed", value: "Med–slow" },
        { label: "Note", value: "The one product where APR language is fine — rate depends on underwriting" },
      ],
    },
    {
      name: "Line of Credit",
      tag: "blue",
      bestFit: "Flexible, recurring needs · cleaner profile (cash-flow side, like MCA)",
      terms: "**$250K–$500K** revolving · draw and repay as needed",
      speed: "Medium",
      sayIt: "Revolving — you only pay for what you draw.",
      details: [
        { label: "Eligibility", value: "Flexible / recurring needs · cleaner profile" },
        { label: "Amount", value: "$250K – $500K, revolving" },
        { label: "Cost", value: "You only pay for what you draw" },
        { label: "Payments", value: "Draw and repay as needed" },
        { label: "Speed", value: "Medium" },
      ],
    },
    {
      name: "HELOC",
      tag: "teal",
      bestFit: "**650+** FICO AND real-estate equity — that's the whole test",
      terms:
        "In-house indicative quote (amount + rate) in **~5 min** · funding often **within a day** · secured against his real estate",
      speed: "~Same-day",
      sayIt: "A line against your property's equity; quick indicative number up front, final terms confirm against equity & title. Big draw: speed.",
      details: [
        { label: "Eligibility", value: "650+ FICO AND real-estate equity — bank statements and the rest don't matter here" },
        { label: "Quote", value: "In-house indicative number (amount + rate) in ~5 min" },
        { label: "Speed", value: "Funding often within a day" },
        { label: "Power play · rescue a default", value: "Current default + 650+ FICO + equity → sell HELOC to pay the default off, so he closes it out instead of having to modify his position" },
        { label: "Security", value: "Secured against his real estate; final terms confirm against equity & title" },
        { label: "Note", value: "Indicative only — never present it as locked" },
      ],
    },
    {
      name: "Equipment Financing",
      tag: "teal",
      bestFit: "Acquiring machinery, vehicles, technology, or furniture — the equipment is the collateral",
      terms: "Up to **100%** financing · up to **7-yr** terms",
      speed: "Medium",
      sayIt: "Financed against the equipment; possible write-offs — confirm w/ his CPA. Bureaucratically exhausting — steer to an alternative where you can.",
      details: [
        { label: "What it is", value: "A loan or lease to acquire machinery, vehicles, technology, or furniture without paying the full cost upfront" },
        { label: "Security", value: "The equipment is the collateral — easier to qualify for than an unsecured loan" },
        { label: "Reality", value: "Very bureaucratically exhausting for both the SDR and the merchant — steer him to a fitting alternative where you can" },
        { label: "Amount", value: "Up to 100% of the equipment cost" },
        { label: "Term", value: "Up to 7 years" },
        { label: "Speed", value: "Medium" },
        { label: "Note", value: "Possible write-offs — owner confirms with his CPA, not you" },
      ],
    },
    {
      name: "Asset-Based & Specialty",
      tag: "slate",
      bestFit: "A specific asset or elite credit (invoice factoring / SBA / CRE)",
      terms: "Factoring on receivables · SBA/CRE for top profiles",
      speed: "Varies",
      sayIt: "SBA is bank-funded — needs tax returns. SBA only when he insists — heavy and slow; bridge him meanwhile.",
      details: [
        { label: "Eligibility", value: "A specific asset, or elite credit" },
        { label: "Types", value: "Invoice factoring · SBA · CRE" },
        { label: "SBA", value: "Only when he insists — heavy and slow; bridge him meanwhile (see Bridge Loan). Bank-funded — needs tax returns" },
        { label: "Docs", value: "SBA/CRE are bank-funded — need tax returns" },
        { label: "Speed", value: "Varies" },
      ],
    },
    {
      name: "CCP",
      tag: "slate",
      relationshipPlay: true,
      bestFit: "Holding an already-funded or not-yet-eligible merchant",
      terms: "Card processing",
      speed: "—",
      sayIt: "Never an opener. Mid-conversation, to keep the door open.",
      details: [
        { label: "Use", value: "Hold an already-funded or not-yet-eligible merchant" },
        { label: "Timing", value: "Never an opener — mid-conversation only" },
        { label: "Play", value: "Keeps the door open while the relationship builds" },
      ],
    },
    {
      name: "Credit Repair",
      tag: "slate",
      relationshipPlay: true,
      bestFit: "Turning a not-yet-eligible prospect into a future deal",
      terms: "Up to **$6K** (scales with score) · **60–90 days** to take effect",
      speed: "—",
      sayIt: "Never an opener. Never guarantee a specific score or outcome.",
      details: [
        { label: "Eligibility", value: "Not-yet-eligible prospect — clears the credit gate" },
        { label: "Amount", value: "Up to $6K (scales with score)" },
        { label: "Timeline", value: "60–90 days to take effect" },
        { label: "Compliance", value: "Never promise a specific score or outcome" },
        { label: "Timing", value: "Never an opener; sets up a future deal" },
      ],
    },
  ],
  pitches: [
    {
      title: "MCA — the workhorse",
      tag: "gold",
      say: "It's a purchase of your future receivables — money now, paid back from your sales daily or weekly.",
      cue: "Never call it interest, an APR, or a bank loan. Factor rate + total payback only, and only after the file. Daily's the default; weekly's the upsell — and weekly's off if he's got an open daily MCA or FICO under 650.",
    },
    {
      title: "Bridge Loan — capital now, cash out later",
      tag: "gold",
      say: "Set on the SBA or term loan? I can bridge you — money now, and you cash out the day that funds.",
      cue: "It's an MCA with an early-cashout clause; you call it a bridge for what it does. Push to keep the position open once the slow loan lands — money already working beats money handed back.",
    },
    {
      title: "Term Loan vs MCA — the one place APR is fine",
      tag: "blue",
      say: "This is a real loan — from about 4.99% APR, $10K to $10M, one to ten years, no prepay penalty.",
      cue: "Only when he's stubborn on it and nothing else fits. APR language is fine HERE only — it's a true loan. Heavy and slow, so bridge him meanwhile. Rate depends on underwriting; no number before the file.",
    },
    {
      title: "HELOC — the speed hook",
      tag: "teal",
      say: "If you've got 650-plus and equity, I can hand you an indicative number in about five minutes — funding often within a day.",
      cue: "650+ FICO and real-estate equity is the whole test. Indicative only — final terms confirm against equity and title. Power play: a current default with 650+ and equity can clear it with a HELOC instead of modifying.",
    },
    {
      title: "Equipment — collateral does the work",
      tag: "teal",
      say: "Machinery, vehicles, tech, furniture — we can finance up to 100% against the equipment itself, terms out to seven years.",
      cue: "Bureaucratically exhausting for both of you — steer to a fitting alternative where you can. Mention possible write-offs as a maybe — he confirms with his CPA, not you.",
    },
    {
      title: "Asset-Based — factoring / SBA / CRE",
      tag: "slate",
      say: "Got a specific asset or elite credit? We can factor your receivables, or go SBA/CRE for the top profiles.",
      cue: "SBA only when he insists — heavy and slow, so bridge him meanwhile. SBA/CRE are bank-funded — they need tax returns.",
    },
  ],
  routingNote: {
    tone: "accent",
    label: "Routing — point the file at the right product",
    body: "Good cash flow → MCA / LOC. Good credit (650+) → HELOC / Term / SBA. Good credit (650+) AND real-estate equity → HELOC — push it over Term / SBA, it's faster (often same-day) and far less paperwork. Term Loan / SBA only if he insists and nothing else fits — they're heavy and slow, so bridge him meanwhile.",
  },
  structuringNote: {
    tone: "go",
    label: "Structuring play — multi-entity routing",
    body: "When one owner controls two related companies and one can't qualify (or only on bad terms), fund through the commonly-owned entity with the stronger profile. Guardrails: the application names the true borrowing entity, accurate ownership, real revenue. Never inflate deposits via inter-company transfers; never misstate ownership.",
  },
  relationshipNote: {
    tone: "amber",
    label: "Relationship plays — never an opener",
    body: "CCP and Credit Repair don't lead a call. Use them mid-conversation to hold a merchant who's already funded or not yet eligible. Credit Repair runs up to $6K (scales with score) and takes 60–90 days — never guarantee a specific score or outcome.",
  },
  rails: {
    tone: "accent",
    label: "Your rails",
    body: "No 'guaranteed.' No rate before the file. Pitch what the file can support, not what sounds best — the file wins the argument in underwriting, every time.",
  },
};

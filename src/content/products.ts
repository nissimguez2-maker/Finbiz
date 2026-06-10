import type { ProductsContent } from "@/types/content";

/**
 * Product matrix — the whole menu, eye-scannable. Voice: Ness — plainspoken,
 * contractions, no filler. Pitch what the file can support, not what sounds best.
 * Compliance: factor rate is NOT an APR/interest (APR language lives ONLY on the
 * Term Loan); no "guaranteed/approved"; no rate before the file; SBA/CRE are
 * bank-funded and need tax returns; CCP + Credit Repair never open a call and
 * CROA means we never promise a score. Every number is canonical — preserve exactly.
 */
export const products: ProductsContent = {
  meta: {
    id: "products",
    navNo: "02",
    navLabel: "Products",
    eyebrow: "Fit",
    title: "Product {Matrix}",
    lead:
      "The whole menu, eye-scannable. But don't read it off — name the one or two products the file can carry. MCA is the bread and butter; everything else is for a profile that earns it. Pitch what the file supports, not what sounds best.",
  },
  products: [
    {
      name: "MCA",
      tag: "gold",
      primary: true,
      bestFit: "Urgent working capital · active deposits · credit-flexible · needs speed",
      terms:
        "Factor rate + total payback (e.g. **$20K × 1.40 = $28K**) · daily/weekly · non-bank, no tax returns",
      speed: "Fastest",
      sayIt: "Purchase of future receivables. Never 'interest,' 'APR,' or 'bank loan.'",
    },
    {
      name: "Term Loan",
      tag: "blue",
      bestFit: "Stable, stronger-credit owner · predictable need · room for monthly",
      terms: "From **~4.99% APR** · **$10K–$10M** · 1–10 yr monthly · no prepay penalty",
      speed: "Med–slow",
      sayIt: "APR is fine here — it's a real loan. Rate depends on underwriting.",
    },
    {
      name: "Line of Credit",
      tag: "blue",
      bestFit: "Flexible, recurring needs · cleaner profile",
      terms: "**$250K–$500K** revolving · draw and repay as needed",
      speed: "Medium",
      sayIt: "Revolving — you only pay for what you draw.",
    },
    {
      name: "Equipment Financing",
      tag: "teal",
      bestFit: "Buying equipment, new or used",
      terms: "Up to **100%** financing · up to 7-yr terms",
      speed: "Medium",
      sayIt: "Financed against the equipment; possible write-offs — confirm w/ his CPA.",
    },
    {
      name: "HELOC",
      tag: "teal",
      bestFit: "**660+** credit AND real-estate equity · wants it fast",
      terms:
        "In-house indicative quote in **~5 min** · same-day funding if he cooperates · secured against his property",
      speed: "Same-day",
      sayIt: "Indicative number up front; final terms confirm against equity & title.",
    },
    {
      name: "Renewal / Refi / Consol.",
      tag: "blue",
      bestFit: "Existing/prior-funded · wants relief from daily pulls · cleaning up stacks",
      terms: "Eligible **~50%** paid down · fresh capital · consolidate obligations",
      speed: "Fast–med",
      sayIt: "Better terms once paid down — and breathing room from daily payments.",
    },
    {
      name: "Asset-Based & Specialty",
      tag: "slate",
      bestFit: "A specific asset or elite credit (factoring / SBA / CRE)",
      terms: "Factoring on receivables · SBA/CRE for top profiles",
      speed: "Varies",
      sayIt: "SBA is bank-funded — needs tax returns. Confirm bank vs non-bank first.",
    },
    {
      name: "CCP",
      tag: "slate",
      relationshipPlay: true,
      bestFit: "Holding an already-funded or not-yet-eligible merchant",
      terms: "Card processing",
      speed: "—",
      sayIt: "Never an opener. Mid-conversation, to keep the door open.",
    },
    {
      name: "Credit Repair",
      tag: "slate",
      relationshipPlay: true,
      bestFit: "Turning a not-yet-eligible prospect into a future deal",
      terms: "Up to **$6K** (scales with score) · **60–90 days** to take effect",
      speed: "—",
      sayIt: "Never an opener. CROA applies — never promise a score.",
    },
  ],
  pitches: [
    {
      title: "MCA — the workhorse",
      tag: "gold",
      say: "It's a purchase of your future receivables — money now, paid back from your sales daily or weekly.",
      cue: "Never call it interest, an APR, or a bank loan. Factor rate + total payback only, and only after the file.",
    },
    {
      title: "Term Loan vs MCA — the one place APR is fine",
      tag: "blue",
      say: "This is a real loan — from about 4.99% APR, $10K to $10M, one to ten years, no prepay penalty.",
      cue: "APR language is fine HERE only — it's a true loan. Rate depends on underwriting; no number before the file.",
    },
    {
      title: "HELOC — the speed hook",
      tag: "teal",
      say: "If you've got 660-plus and equity, I can hand you an indicative number in about five minutes — same-day funding if you move with me.",
      cue: "Indicative only. Final terms confirm against equity and title — never present it as locked.",
    },
    {
      title: "Equipment — collateral does the work",
      tag: "teal",
      say: "New or used, we can finance up to 100% against the equipment itself, terms out to seven years.",
      cue: "Mention possible write-offs as a maybe — he confirms with his CPA, not you.",
    },
    {
      title: "Renewal — the second swing",
      tag: "blue",
      say: "Once you're about halfway paid down, that's fresh capital at better terms — and relief from the daily pulls.",
      cue: "Roughly 50% paid down to be eligible. Lead with the breathing room, then the top-up.",
    },
    {
      title: "Asset-Based — factoring / SBA / CRE",
      tag: "slate",
      say: "Got a specific asset or elite credit? We can factor your receivables, or go SBA/CRE for the top profiles.",
      cue: "SBA/CRE are bank-funded — they need tax returns. Confirm bank vs non-bank before you promise anything.",
    },
  ],
  relationshipNote: {
    tone: "amber",
    label: "Relationship plays — never an opener",
    body: "CCP and Credit Repair don't lead a call. Use them mid-conversation to hold a merchant who's already funded or not yet eligible. Credit Repair runs up to $6K (scales with score) and takes 60–90 days — and CROA applies, so never guarantee a specific score or outcome.",
  },
  rails: {
    tone: "accent",
    label: "Your rails",
    body: "No 'guaranteed.' No rate before the file. Pitch what the file can support, not what sounds best — the file wins the argument in underwriting, every time.",
  },
};

import type { RoutingContent } from "@/types/content";

/**
 * Routing — the "where does this file go / what do I lead with" decision tree.
 * Reference only (Quick Lookup); never quoted verbatim live. Compliance: no rate
 * before the file; HELOC needs 650+ AND real-estate equity. Never inflate
 * deposits or misstate ownership in the structuring play.
 */
export const routing: RoutingContent = {
  meta: {
    id: "routing",
    navNo: "12",
    navLabel: "Routing",
    eyebrow: "Lookup",
    title: "Where it {Routes}",
    lead:
      "Read this first. Match the merchant to the structure that actually fits — cash flow vs. credit — then lead with the fastest path that funds.",
  },
  rule: {
    tone: "accent",
    label: "Read first",
    body:
      "Good cash flow → MCA / Line of Credit. Good credit (650+) → HELOC / long-term / SBA. When he fits, push HELOC — it's faster and far less paperwork.",
  },
  branches: [
    {
      when: "Good cash flow",
      then: "MCA · Line of Credit",
      note: "Active deposits, credit-flexible, needs speed.",
    },
    {
      when: "Good credit (650+)",
      then: "HELOC · Long-term loan · SBA",
      note: "HELOC also needs real-estate equity.",
    },
    {
      when: "650+ and owns real estate",
      then: "Push HELOC",
      note: "Faster — often same-day — and far less paperwork than Term / SBA.",
    },
    {
      when: "Insists on Term Loan / SBA",
      then: "Bridge loan meanwhile",
      note: "They're heavy and slow; the bridge funds him now and cashes out the day they fund.",
    },
  ],
  appetite: [
    {
      label: "Steady vs. seasonal",
      verdict:
        "Funders pay for predictable cash flow — a steady butcher beats a higher-earning but swingy real-estate agent.",
      tone: "go",
    },
    {
      label: "Trucking",
      verdict: "Funders dislike it — usually only fundable when he already has an open position elsewhere.",
      tone: "clay",
    },
    { label: "Texas", verdict: "Few funders fund there.", tone: "amber" },
  ],
  plays: [
    {
      tone: "accent",
      label: "Structuring — multi-entity routing",
      body:
        "One owner, two related companies, and one can't qualify (or only on bad terms)? Fund through the commonly-owned entity with the stronger profile. Guardrails: name the true borrowing entity, accurate ownership, real revenue — never inflate deposits via inter-company transfers, never misstate ownership.",
    },
  ],
};

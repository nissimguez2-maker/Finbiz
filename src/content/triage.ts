import type { TriageContent } from "@/types/content";

/**
 * Eligibility for live triage. There are no Green/Yellow/Red lanes — there's one
 * qualify floor (all four conditions or you work the LIGHT track) and three MCA
 * hard gates that actually decide the file. The rep is triaging, NOT underwriting.
 * Voice: Ness — plainspoken, no hype. Compliance: triage only; no
 * "approved/guaranteed", no rate before the file. Source: master doc BASE
 * (qualify floor, MCA hard gates) + Scripts (LIGHT track).
 */
export const triage: TriageContent = {
  meta: {
    id: "triage",
    navNo: "04",
    navLabel: "Triage & Lanes",
    eyebrow: "Triage",
    title: "Floor & {Hard Gates}",
    lead:
      "You're not underwriting — you're triaging. First the floor: all four or it's the LIGHT track. Then the three small checks that actually decide an MCA. Below the floor, needing money isn't the same as being fundable.",
  },
  lanes: [
    {
      tone: "go",
      name: "Floor — all four or LIGHT",
      verdict: "QUALIFY",
      items: [
        "$15K+/mo revenue",
        "6+ months in business",
        "500+ FICO",
        "Revenue into a business bank account",
        "Miss any one → not yet eligible · work the LIGHT track",
      ],
    },
    {
      tone: "amber",
      name: "MCA hard gates",
      verdict: "DECIDES IT",
      items: [
        "Deposits: avg ≥ 3 deposits/mo across the last 3 months",
        "Negative days: no more than ~4–5/mo on average across the last 3 months",
        "Ending balance: positive in each of the last 3 months",
        "Edge case: two amazing months + one slightly negative is workable to pitch — funders still often reject it",
      ],
    },
    {
      tone: "clay",
      name: "LIGHT track",
      verdict: "NOT YET",
      items: [
        "Credit repair to get eligible (60–90 days; never promise a score)",
        "CCP to hold the line — never an opener",
        "“Give me two stronger months and a callback.”",
        "Don't write him off — convert him into a future deal",
      ],
    },
  ],
  rule: {
    tone: "accent",
    label: "The rule",
    body: "Don't pitch what sounds best — pitch what the file can actually support.",
  },
};

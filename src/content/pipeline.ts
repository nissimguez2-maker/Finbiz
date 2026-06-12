import type { PipelineContent } from "@/types/content";

/**
 * Pipeline & Discovery. The twelve stages every file rides, and the seven things
 * discovery must surface before you advance. Voice: Ness — plainspoken, no filler.
 * Discovery sets the rate by the statements, never the other way around.
 * Source: master doc BASE (the pipeline) + Scripts ("Discovery must surface").
 */
export const pipeline: PipelineContent = {
  meta: {
    id: "pipeline",
    navNo: "07",
    navLabel: "Pipeline",
    eyebrow: "Flow",
    title: "Pipeline & {Discovery}",
    lead:
      "Every file rides the same twelve stages — the spine of every call. Never let one float: each active file has a next step, an owner, and a date.",
  },
  steps: [
    { n: "01", title: "Prospecting", desc: "Reach the owner / authorized signer" },
    { n: "02", title: "Discovery", desc: "Need + urgency; open with the CTA" },
    { n: "03", title: "Pre-qualify", desc: "Apply the floor" },
    { n: "04", title: "Collection", desc: "Get the statements and/or needed docs" },
    { n: "05", title: "Statement review", desc: "Read 3 months vs. the MCA hard gates; flag reds" },
    { n: "06", title: "Submission", desc: "Package a clean file; confirm owner + deadline" },
    { n: "07", title: "Approval", desc: "Confirm product, factor rate, term, payment" },
    { n: "08", title: "Offer pitch & pivot", desc: "Present the fit; pivot; handle objections" },
    { n: "09", title: "Contracts", desc: "Authorized signer; review total payback; no obligation" },
    { n: "10", title: "Closing stips", desc: "Clear conditions" },
    { n: "11", title: "Funding", desc: "Confirm the wire" },
    { n: "12", title: "Follow-up", desc: "Renewal path, referrals, restructure" },
  ],
  questions: [
    { n: "1", ask: "What's the business doing monthly recently?", reveals: "Monthly revenue" },
    { n: "2", ask: "How long have you been open?", reveals: "Time in business" },
    { n: "3", ask: "Any current business debt or funder balance?", reveals: "Current debt / funder balance" },
    { n: "4", ask: "How are payments structured on existing advances?", reveals: "Payment schedule" },
    { n: "5", ask: "What's the money for?", reveals: "Use of funds" },
    { n: "6", ask: "How urgent is this?", reveals: "Urgency" },
    {
      n: "7",
      ask: "Any NSFs, liens, bankruptcies, defaults, or modified positions?",
      reveals: "Risk history",
    },
  ],
  settles: {
    tone: "accent",
    label: "Then settle five things",
    body:
      "Eligibility · document-speed expectation · funds purpose · debt risk · a defined next step.",
  },
};

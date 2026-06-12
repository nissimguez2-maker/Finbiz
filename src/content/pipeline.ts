import type { PipelineContent } from "@/types/content";

/**
 * Pipeline & Discovery. The twelve stages every file walks, and the nine
 * questions that settle a call. Voice: Ness — plainspoken, no filler. Discovery
 * sets the rate by the statements, never the other way around.
 */
export const pipeline: PipelineContent = {
  meta: {
    id: "pipeline",
    navNo: "07",
    navLabel: "Pipeline",
    eyebrow: "Flow",
    title: "Pipeline & {Discovery}",
    lead:
      "Every file walks the same twelve stages. Never let one float — each active file has a next step, an owner, and a date.",
  },
  steps: [
    {
      n: "01",
      title: "Prospecting",
      desc: "Find the decision-maker",
      killer: "Inactive Secretary of State · wrong EIN/SSN · another broker submits first",
    },
    { n: "02", title: "Discovery", desc: "Understand the need" },
    { n: "03", title: "Pre-Qualify", desc: "Check thresholds", killer: "Below the floor — under $15K/mo, under 6 months, or under 500" },
    { n: "04", title: "Collection", desc: "Build the file", killer: "Won't send statements or refuses bank verification" },
    {
      n: "05",
      title: "Stmt. Review",
      desc: "Spot the risks",
      killer: "Fails an MCA hard gate (deposits, negative days, ending balance)",
    },
    {
      n: "06",
      title: "Submission",
      desc: "Send a clean file",
      killer: "Incomplete or inaccurate package",
    },
    { n: "07", title: "Approval", desc: "Understand terms" },
    { n: "08", title: "Offer Pitch", desc: "Explain it clearly" },
    { n: "09", title: "Contracts", desc: "Get signatures" },
    { n: "10", title: "Closing Stips", desc: "Clear conditions", killer: "Stips left unmet — conditions never cleared" },
    { n: "11", title: "Funding", desc: "Confirm the wire", killer: "Negative balance or new funding taken before the wire" },
    { n: "12", title: "Follow-Up", desc: "Build the renewal" },
  ],
  questions: [
    { n: "1", ask: "Monthly gross?", reveals: "Revenue capacity" },
    { n: "2", ask: "Time in business?", reveals: "Eligibility & stability" },
    { n: "3", ask: "Current business debt or advances?", reveals: "Existing obligations" },
    { n: "4", ask: "Funder, balance, payment schedule?", reveals: "Cash-flow pressure" },
    { n: "5", ask: "Use of funds?", reveals: "Business purpose" },
    { n: "6", ask: "Amount needed?", reveals: "Funding target" },
    { n: "7", ask: "How urgent?", reveals: "Timeline & seriousness" },
    {
      n: "8",
      ask: "Recent NSFs, negatives, liens, judgments, modified or restructured positions?",
      reveals: "Risk profile",
    },
    {
      n: "9",
      ask: "Can you send 3 months of statements today?",
      reveals: "Cooperation & momentum",
    },
  ],
  settles: {
    tone: "accent",
    label: "Discovery settles five things",
    body:
      "Lane (G/Y/R) · doc speed · use of funds · whether debt is a problem · the defined next step.",
  },
};

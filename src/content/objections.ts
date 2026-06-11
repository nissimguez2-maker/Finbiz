import type { ObjectionsContent } from "@/types/content";

/**
 * Objections, deal killers, and compliance. Acknowledge → clarify → reframe.
 * Voice: Ness — confident, plainspoken. Compliance rails are hard: no rate
 * before the file, factor rate is not APR, and none of the banned phrases.
 */
export const objections: ObjectionsContent = {
  meta: {
    id: "objections",
    navNo: "08",
    navLabel: "Objections",
    eyebrow: "Defense",
    title: "Objections, Deal Killers & {Compliance}",
    lead:
      "You don't beat resistance with pressure — you reframe toward what the file can do. Acknowledge → clarify → reframe, every time. Top rows are the ones you'll hear most.",
  },
  objections: [
    {
      q: "What's your rate?",
      reframe:
        "Smart question — and I won't make a number up to keep you on the phone. The statements set the rate. Send them and I'll quote you real, today.",
    },
    {
      q: "Not interested.",
      reframe: "Fair. Real quick — is it timing, or you just don't see the need right now?",
      note: "then reframe whichever he says",
    },
    {
      q: "Too expensive.",
      reframe:
        "Compared to what? If the money makes you more than it costs, the price answers itself. So what would you do with it if you had it?",
    },
    {
      q: "Bad credit.",
      reframe:
        "That's fine, honestly. The revenue does the heavy lifting here, not the score. Let's pull the statements and see what's there.",
    },
    {
      q: "I already have funding.",
      reframe:
        "Who's the funder, what's the balance, how are the payments structured? If the file supports it, we may free up your cash flow.",
    },
    {
      q: "I don't need funding.",
      reframe:
        "Best time to look at options is before cash flow gets tight. If the numbers don't make sense, there's no obligation.",
    },
  ],
  dealKillers: [
    { issue: "Hidden balances", move: "Ask directly and document" },
    { issue: "New funding mid-underwriting", move: "Warn the merchant early" },
    { issue: "Negative balance at funding", move: "Monitor before close" },
    { issue: "Sharp deposit drop", move: "Request MTD transactions" },
    { issue: "Liens / judgments · prior default", move: "Disclose early" },
    { issue: "Refuses bank verification", move: "Set the expectation up front" },
    { issue: "Another broker submits · stops responding", move: "Move fast, set deadlines & cadence" },
  ],
  compliance: [
    { dont: "Guaranteed / definitely approved", say: "Approval depends on underwriting" },
    { dont: "Cheap money", say: "Review the total payback & payment structure" },
    { dont: "Basically a bank loan", say: "This is a different funding structure" },
    { dont: "Factor rate is an interest rate", say: "Factor rate sets total payback; it's not APR" },
    { dont: "No risk / won't affect cash flow", say: "Daily/weekly payments must fit cash flow" },
    { dont: "Funded today", say: "Timing depends on underwriting & closing" },
  ],
};

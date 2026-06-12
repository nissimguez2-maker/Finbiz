import type { ObjectionsContent } from "@/types/content";

/**
 * Objections, deal killers, and compliance. Acknowledge → clarify → reframe.
 * Voice: Ness — confident, plainspoken. Compliance rails are hard: no rate
 * before the file, factor rate is not APR, no "guaranteed/approved", purchase of
 * future receivables (never "interest"/"APR"/"bank loan" on MCA), never write
 * "MCA" in SMS/email (say "funding"), credit repair never promises a score.
 * Source: master doc Scripts (Objections) + BASE (Statement reds, Risk terms).
 */
export const objections: ObjectionsContent = {
  meta: {
    id: "objections",
    navNo: "08",
    navLabel: "Objections",
    eyebrow: "Defense",
    title: "Objections, Deal Killers & {Compliance}",
    lead:
      "You don't beat resistance with pressure — you reframe toward what the file can do. Acknowledge → clarify → reframe, every time. These are the five you'll hear most.",
  },
  objections: [
    {
      q: "What's your rate?",
      reframe:
        "Smart question — and I won't make up a number to keep you on the phone. The statements set the rate. Send them and I'll quote you real, today.",
    },
    {
      q: "Not interested.",
      reframe: "Fair. Quick — is it timing, or you just don't see the need right now?",
      note: "reframe whichever",
    },
    {
      q: "Too expensive.",
      reframe:
        "Compared to what? If the money makes you more than it costs, the price answers itself.",
    },
    {
      q: "Bad credit.",
      reframe:
        "That's fine, honestly. Revenue does the heavy lifting here, not the score. Let's pull the statements and see.",
    },
    {
      q: "I don't want to put my house/equity on the line. (HELOC)",
      reframe:
        "I hear you, and that's exactly why it's smart, not risky. This is the fastest money you can get — funded in about a day — and it's a line, not a lump you owe. You only draw what you need and you stay in control of it. It's there to solve the problem, not to be spent. Used right, it's the cheapest, fastest tool you've got.",
    },
  ],
  dealKillers: [
    { issue: "NSFs — repeated or recent", move: "Read 3 months; flag the pattern before you submit" },
    { issue: "Stacking — multiple open positions", move: "Get funder, balance, payment schedule; document" },
    { issue: "Negative days over the gate (~4–5/mo avg)", move: "Lane it out unless statements explain it" },
    { issue: "Negative ending balance in a month", move: "Two strong + one slightly negative is a pitch, not a lock" },
    { issue: "Prior default", move: "Require a ZBL (Zero Balance Letter) — proves it's closed out" },
    { issue: "Modified position(s)", move: "To funders, almost as bad as default — disclose; HELOC can clear a current default" },
    { issue: "Ownership mismatch", move: "Account/business name must match the file" },
    { issue: "Manipulated statements", move: "Inconsistent format/sequence kills the file — walk" },
  ],
  compliance: [
    { dont: "Interest / APR / bank loan (on MCA)", say: "Purchase of future receivables — factor rate + total payback" },
    { dont: "Write “MCA” in an SMS or email", say: "Call it “funding” in writing — he can say MCA, you don't" },
    { dont: "Guaranteed / approved", say: "Approval depends on underwriting" },
    { dont: "Quote a rate before the file", say: "The statements set the rate — send them first" },
    { dont: "Promise a credit score", say: "Credit repair takes 60–90 days; never promise a number" },
  ],
};

import type { CallFlowContent } from "@/types/content";

/**
 * Live call talk track. The rep reads `says` aloud, uses `cues` as coaching,
 * and `texts` are literal SMS bubbles. Voice: Ness — plainspoken, confident,
 * contractions, no filler. Compliance: no rate before the file, no guarantees.
 */
export const callFlow: CallFlowContent = {
  meta: {
    id: "call",
    navNo: "01",
    navLabel: "Call Flow",
    eyebrow: "Live",
    title: "Call {Flow}",
    lead:
      "Top to bottom, fast. Your eye lands on the next line, you say it, you shut up. The urgency comes from his answers in the Dig — not from anything you push.",
  },
  rule: {
    tone: "accent",
    label: "One rule",
    body:
      "Let him talk ~60%. You're steering, not selling — the file and his own words close this, not your volume.",
  },
  beats: [
    {
      label: "① Open — own it",
      says: [
        "Hi [Name], it's Ness at FinBiz Funding. Good time? I'll be straight and quick.",
        "I work with owners like you on growth capital — and I'm good at it.",
        "Give me five minutes. By the end, either I see a real way to put money to work in your business, or I don't — and I'll tell you flat. Fair?",
      ],
      cues: [
        "Naming the “no” up front disarms him — reads as confidence, not a pitch.",
        "Posture: a peer who happens to be the expert — respect his time and judgment, but stay precise and in command of the numbers.",
      ],
    },
    {
      label: "② Open the story",
      says: ["If money wasn't the bottleneck, what's the first move you'd make in the business?"],
      cues: ["Whatever he says here is what you paint back in ⑤. Write it down word for word."],
    },
    {
      label: "③ Gate — two numbers",
      says: [
        "So I'm not wasting your time — what's the business doing a month lately, and how long you been open?",
      ],
      cues: [
        "Floor ~$15K+/mo · 6+ mo · 500+. Green $20K+ · 12+ mo · 570+.",
        "Clears the floor → ④ · Light → Light card · Already funded → All Set card.",
      ],
    },
    {
      label: "④ Dig — make the gap real",
      says: [
        "Best time to grab capital is before you're desperate for it. Money's cheapest when you don't need it — and you're in a good spot to move now.",
        "What's the one thing holding you back from the next level right now?",
        "How long's that been going on?",
        "If it stays like that another six months — what's it cost you? Jobs you turn down, customers you lose?",
        "And if it were handled tomorrow — what changes for you?",
      ],
      cues: ["He just handed you the pain AND the payoff, in his words. Don't pitch yet — let it sit."],
    },
    {
      label: "④.5 Risk check — defaults & modified positions",
      says: [
        "Real quick so I build this right — are you current on everything, or is anything behind, modified, or restructured?",
        "And where's your credit sitting, ballpark?",
      ],
      cues: [
        "A modified position reads almost as bad as a default to funders. Surface it now, not at submission.",
        "Defaulting + 650+ credit + owns real estate? Pivot to HELOC — pay the default off so he never has to modify a position. That's the rescue.",
      ],
    },
    {
      label: "⑤ Point it + paint it",
      says: [
        "Good. Here's what I'd put in front of you — a [term loan / line / advance].",
        "Picture it: [the thing he said he'd do], funded and moving. That's the play.",
        "Depending on your numbers I'll get you the best terms I can — and I carry the paperwork. You run the business, I run this.",
      ],
      cues: ["“Depending on your numbers” — never name a rate before you've seen the file."],
    },
    {
      label: "⑥ Close — hard, clean",
      says: [
        "Here's what happens next: send me three months of bank statements today, I build your offer tonight, we talk tomorrow with real numbers.",
        "This your cell? Texting you right now so you've got me.",
        "No obligation — you see the full payback and you decide. Let's just get the options on the table.",
      ],
      cues: ["Lock BOTH his cell and email before you hang up — the lead info can be wrong, and two channels means you can still reach him. Daisy-chain: cell → text → email."],
      texts: ["Hey, it's Ness — FinBiz.", "Shoot me your email."],
    },
  ],
  branches: [
    {
      title: "↪ All set / already funded — push for the second swing",
      says: [
        "Glad you're moving. Who'd you go with — and are the payments daily, weekly, monthly?",
        "Here's where I'm worth your time: if those are daily pulls, I can probably refinance you into more breathing room. Want me to take a real look?",
        "And the day you hit about halfway paid, that's a top-up at better terms. I'll be the call you make — costs you nothing to have me in your corner.",
      ],
      cues: ["If he cracks the door, you're back at ⑥. Get the statements."],
    },
    {
      title: "↪ Light — don't waste the call",
      says: [
        "Straight with you — the numbers are a little light today for the best products. But I'm not writing you off.",
      ],
      cues: [
        "Offer one, then book the callback: credit repair to get eligible (60–90 days; never promise a score) · CCP to hold the line · “Give me two stronger months and a callback.”",
      ],
    },
  ],
};

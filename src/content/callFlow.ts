import type { CallFlowContent } from "@/types/content";

/**
 * Live call talk track. The rep reads `says` aloud, uses `cues` as coaching,
 * and `texts` are literal SMS bubbles. Voice: Ness — plainspoken, confident,
 * contractions, no filler. Compliance: no rate before the file, no guarantees,
 * factor ≠ APR, no invented urgency; in writing never the word "MCA" — "funding".
 * Source of truth: master doc Part 2 (Scripts), beats ①–⑥ + ④.5 Risk check.
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
    label: "Posture",
    body:
      "Make him feel like a sharp businessman — respect his time and judgment, never talk down. At the same time be the domain pro: precise, in command of the numbers. Target a peer who happens to be the expert.",
  },
  beats: [
    {
      label: "① Open — set the frame",
      says: [
        "Hi [Name], it's Ness. I work with owners in your line putting money to work in the business. Five minutes — worth it or not, I'll tell you flat.",
        "I work with owners like you on growth capital — and I'm good at it.",
        "Give me five minutes. By the end, either I see a real way to put money to work in your business, or I don't — and I'll tell you flat. Fair?",
      ],
      cues: ["Hold the FinBiz name until he's warmed up — owners hear a financial-company name and assume a Wall-Street outfit out to rip them off."],
    },
    {
      label: "② Open the story",
      says: ["If money wasn't the bottleneck, what's the first move you'd make?"],
      cues: ["Whatever he says here is what you paint back in ⑤. Write it down word for word."],
    },
    {
      label: "③ Gate — qualify against the floor",
      says: [
        "So I'm not wasting your time — what's the business doing monthly recently, and how long have you been open?",
      ],
      cues: [
        "Listen for the floor: $15K+/mo · 6+ months. Credit and the business bank account come with the statements.",
        "All four hold → ④ · miss any one → Light card · already funded → All Set card.",
      ],
    },
    {
      label: "④ Dig — make the gap real",
      says: [
        "Best time to grab capital is before you're desperate — money's cheapest when you don't need it, and you're in a good spot to move now. What's the one thing holding you back from the next level?",
        "How long's that been going on?",
        "If it stays like that another six months — what's it cost you? Jobs turned down, customers lost?",
        "And if it were handled tomorrow — what changes?",
      ],
      cues: ["He just gave you the pain and the payoff, in his words. Don't pitch yet — let it sit."],
    },
    {
      label: "④.5 Risk check — mid / advanced stage",
      says: [
        "Real quick so I build this right — any current defaults, or any position you've had to modify or restructure?",
        "If yes: What's your credit score sitting at?",
      ],
      cues: [
        "Discovery must also surface: monthly revenue · time in business · current debt/funder balance · payment schedule on existing advances · use of funds · urgency · risk history.",
        "If he's HELOC-eligible (650+, owns real estate), pivot to HELOC to clear the default — he closes it out instead of modifying his position.",
      ],
    },
    {
      label: "⑤ Point it + paint it",
      says: [
        "Here's what I'd put in front of you — a [pull the fit from Product Matrix].",
        "Picture it: [the thing he said he'd do], funded and moving. That's the play.",
        "Depending on your numbers I'll get you the best terms I can — and I carry the paperwork. You run your business, I run this.",
      ],
      cues: ["“Depending on your numbers” — never name a rate before you've seen the file."],
    },
    {
      label: "⑥ Close — hard, clean",
      says: [
        "Next: send me your last three months of bank statements today, I build your offer tonight, we talk tomorrow with real numbers.",
        "This your cell? Texting you now.",
        "No obligation — you see the full payback and you decide. Let's get the options on the table.",
      ],
      cues: ["Always secure both cell and email — text now, then ask for the email. Don't hang up until you've got both."],
      texts: ["Hey, it's Ness", "Shoot me your email."],
    },
  ],
  branches: [
    {
      title: "↪ All set — push for the second swing (refi/renewal)",
      says: [
        "Glad you're moving. Who'd you go with — and are payments daily, weekly, monthly?",
        "If those are daily pulls, I can probably refinance you into more breathing room. Want me to take a real look?",
        "And the day you hit about halfway paid, that's a top-up at better terms. I'll be the call you make — costs you nothing to have me in your corner.",
      ],
      cues: ["If he cracks the door, you're back at ⑥. Get the statements."],
    },
    {
      title: "↪ Light — not yet eligible, don't waste the call",
      says: [
        "Straight with you — numbers are a little light today for the best products. But I'm not writing you off.",
      ],
      cues: [
        "Offer one: credit repair to get eligible (60–90 days; never promise a score) · CCP to hold the line · “Give me two stronger months and a callback.”",
      ],
    },
  ],
};

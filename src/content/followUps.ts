import type { FollowUpsContent } from "@/types/content";

/**
 * Follow-up SMS playbook. Each scenario carries two ready-to-send templates the
 * rep can fire after a call. Voice: Ness/Humanizer — these read like real human
 * texts (casual, short, contractions), never marketing spam. Compliance: no
 * offer/approval promised before a file exists, no "guaranteed/funded today",
 * no rate before statements, "no obligation" stays in.
 */
export const followUps: FollowUpsContent = {
  meta: {
    id: "followups",
    navNo: "09",
    navLabel: "Follow-Ups",
    eyebrow: "Chase",
    title: "{Follow-Ups}",
    lead:
      "Get the three months in, or get a callback. Never promise an offer before you've seen a file.",
  },
  scenarios: [
    {
      scenario: "After a strong call",
      templates: [
        {
          label: "Recap + ask · SMS",
          text: "Hey [Name], Ness from FinBiz — good talking just now. Send me 3 months of business bank statements and I'll come back with real numbers. No obligation either way.",
        },
        {
          label: "Same-day nudge · SMS",
          text: "[Name] — still got you on my list for today. Shoot those 3 months over whenever and I'll get into it tonight.",
        },
      ],
    },
    {
      scenario: "Went quiet",
      templates: [
        {
          label: "Soft bump · SMS",
          text: "[Name], haven't heard back — no worries. Just don't want you leaving money on the table. Want me to put a couple options together or nah?",
        },
        {
          label: "Door-open · SMS",
          text: "All good if the timing's off right now. Whenever you wanna look at capital I'm one text away. Cool if I check back end of week?",
        },
      ],
    },
    {
      scenario: "Already funded",
      templates: [
        {
          label: "Back pocket · SMS",
          text: "Glad you're sorted, [Name]. Keep my number though — day the payments start feeling tight, or you want more, I can probably do better.",
        },
        {
          label: "Halfway check-in · SMS",
          text: "Hey [Name] — figure you're getting close to halfway paid down. That's usually the sweet spot for a top-up at better terms. Want me to take a look?",
        },
      ],
    },
    {
      scenario: "Light / not yet",
      templates: [
        {
          label: "Honest hold · SMS",
          text: "[Name], numbers are a touch light for the good stuff today — but I'm not writing you off. Get me a couple stronger months and let's run it back.",
        },
        {
          label: "Circle-back · SMS",
          text: "Circling back like I said I would. How's revenue looking lately? If it's firmed up, let's pull statements and get you funded.",
        },
      ],
    },
    {
      scenario: "Offer on the table",
      templates: [
        {
          label: "Walk-through · SMS",
          text: "[Name], your numbers are ready. Got 5 min to walk the offer and the total payback so you can actually decide? Today or tomorrow work?",
        },
        {
          label: "Decision nudge · SMS",
          text: "Offer's still good, [Name]. No pressure — but sooner we sign, sooner it's in your account. Anything in the way I can clear up?",
        },
      ],
    },
    {
      scenario: "Funded — renewal + referral",
      templates: [
        {
          label: "Renewal watch · SMS",
          text: "Hope that capital did the job, [Name]. Around halfway paid you're eligible for fresh funds at better terms — want me to flag you when you hit it?",
        },
        {
          label: "Referral ask · SMS",
          text: "Glad this one worked out. Know another owner who could use capital? Send 'em my way, I'll take good care of them.",
        },
      ],
    },
  ],
};

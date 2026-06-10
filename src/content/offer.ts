import type { OfferContent } from "@/types/content";

/**
 * Approved-Offer desk content — POST-APPROVAL ONLY. The rep never quotes factor
 * or payback live on a cold call. This section exists for the offer conversation
 * that happens AFTER the file's been submitted and underwriting comes back
 * approved with real numbers — the rep plugs the approved terms in and walks the
 * merchant through them, clean. Compliance: a factor rate is NOT an APR or
 * interest rate — it's a fixed multiplier that sets total payback.
 */
export const offer: OfferContent = {
  meta: {
    id: "offer",
    navNo: "11",
    navLabel: "Approved Offer",
    eyebrow: "Post-Approval",
    title: "Approved {Offer} Desk",
    lead:
      "Use this only after you've submitted the file and underwriting comes back approved with real numbers. You never quote factor or payback live on the first call — you plug the approved terms in here and walk the merchant through them, clean.",
  },
  gate: {
    tone: "clay",
    label: "After approval only",
    body:
      "Don't run these numbers in front of a lead on a cold call. This is for the offer conversation — once the deal's approved and the real factor and term are set.",
  },
  loops: [
    { k: "Funding amount", v: "Exactly what lands in the account" },
    { k: "Total payback", v: "The real obligation — funded × factor, not the funded figure" },
    { k: "Payment", v: "Per-payment amount and how often it pulls" },
    { k: "Cash-flow fit", v: "It has to be survivable to be a good deal" },
    { k: "No obligation", v: "He reviews the full offer before he signs" },
  ],
};

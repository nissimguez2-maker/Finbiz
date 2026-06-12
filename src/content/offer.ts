import type { OfferContent } from "@/types/content";

/**
 * Approved-Offer desk content — POST-APPROVAL ONLY. The rep never quotes factor
 * or payback live on a cold call. This section exists for the offer conversation
 * that happens AFTER the file's been submitted and underwriting comes back
 * approved with real numbers — the rep plugs the approved terms in and walks the
 * merchant through them, clean. Compliance: a factor rate is NOT an APR or
 * interest rate — it's a fixed multiplier that sets total payback.
 * Source of truth: FinBiz Master Doc → pipeline stages 7–11 (approval · offer
 * pitch & pivot · contracts · closing stips · funding).
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
    { k: "Review terms", v: "Confirm the product, factor rate, term, and payment that came back approved" },
    { k: "Present the fit & pivot", v: "Show why this is the fit; pivot via the Product Matrix if his read differs" },
    { k: "Funding amount", v: "Exactly what lands in the account" },
    { k: "Total payback", v: "The real obligation — funded × factor, not the funded figure" },
    { k: "Payment", v: "Per-payment amount and how often it pulls" },
    { k: "Cash-flow fit", v: "It has to be survivable to be a good deal" },
    { k: "Contracts", v: "Signature from an authorized signer — no obligation to accept" },
    { k: "Closing stips", v: "Clear the conditions cleanly before funding" },
    { k: "Confirm the wire", v: "Confirm the wire so the funds land" },
  ],
};

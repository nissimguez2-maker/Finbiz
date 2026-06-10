import type { RegisteredSection } from "@/types/content";

import { CallFlow } from "@/components/sections/CallFlow";
import { Products } from "@/components/sections/Products";
import { Mca } from "@/components/sections/Mca";
import { Triage } from "@/components/sections/Triage";
import { Statements } from "@/components/sections/Statements";
import { MinimumFile } from "@/components/sections/MinimumFile";
import { Pipeline } from "@/components/sections/Pipeline";
import { Objections } from "@/components/sections/Objections";
import { FollowUps } from "@/components/sections/FollowUps";
import { FinalQa } from "@/components/sections/FinalQa";
import { OfferDesk } from "@/components/sections/OfferDesk";

import { callFlow } from "@/content/callFlow";
import { products } from "@/content/products";
import { mca } from "@/content/mca";
import { triage } from "@/content/triage";
import { statements } from "@/content/statements";
import { minimumFile } from "@/content/minimumFile";
import { pipeline } from "@/content/pipeline";
import { objections } from "@/content/objections";
import { followUps } from "@/content/followUps";
import { finalQa } from "@/content/finalQa";
import { offer } from "@/content/offer";

/** Every section, in nav order. Keep aligned with src/content/meta.ts → nav. */
export const sections: RegisteredSection[] = [
  { meta: callFlow.meta, Component: CallFlow },
  { meta: products.meta, Component: Products },
  { meta: mca.meta, Component: Mca },
  { meta: triage.meta, Component: Triage },
  { meta: statements.meta, Component: Statements },
  { meta: minimumFile.meta, Component: MinimumFile },
  { meta: pipeline.meta, Component: Pipeline },
  { meta: objections.meta, Component: Objections },
  { meta: followUps.meta, Component: FollowUps },
  { meta: finalQa.meta, Component: FinalQa },
  { meta: offer.meta, Component: OfferDesk },
];

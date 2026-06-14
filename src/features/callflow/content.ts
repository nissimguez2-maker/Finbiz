/**
 * content — the ONE place the reading console reaches into the locked content in
 * src/content/*. The panels and the script column import their slice from here,
 * never from content/* directly, so the content coupling lives in a single file.
 *
 * It does NOT copy or reword any script text — it only re-exports existing
 * fields. All copy stays in src/content/* (locked).
 */
import { callFlow } from "@/content/callFlow";
import { products } from "@/content/products";
import { mca } from "@/content/mca";
import { offer } from "@/content/offer";
import { objections } from "@/content/objections";
import { statements } from "@/content/statements";
import { minimumFile } from "@/content/minimumFile";
import { finalQa } from "@/content/finalQa";
import { pipeline } from "@/content/pipeline";
import { brand } from "@/content/meta";

/* ---- Center: the call script (spoken lines only) ----------------------- */
export const scriptBeats = callFlow.beats;
export const scriptBranches = callFlow.branches;

/* ---- Left panel: what you sell ----------------------------------------- */
export const sellProducts = products.products;
export const productRouting = products.routingNote;
export const productStructuring = products.structuringNote;
export const productRelationship = products.relationshipNote;
export const mcaStructure = mca;
export const offerDesk = offer;

/* ---- Right panel: run the call ----------------------------------------- */
export const objectionList = objections.objections;
export const dealKillers = objections.dealKillers;
export const compliancePairs = objections.compliance;
export const statementRead = statements;
export const minimumFileRead = minimumFile;
export const finalQaRead = finalQa;
export const pipelineRead = pipeline;

/* ---- Chrome ------------------------------------------------------------- */
export const brandName = brand.name;
export const brandMark = brand.mark;

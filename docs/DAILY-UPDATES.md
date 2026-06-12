# Daily updates

The **FinBiz Master Doc** is the single source of truth and changes a little every day.
**Chosen workflow: manual, via Claude** — no n8n, no build hook, no button.

## Source doc
- **FinBiz Master Doc** — https://docs.google.com/document/d/1D93j3Pjo6HPqdtb6IiAPvb5DIp_cuZl4bU-bsBawexg/edit

  One doc, three parts: a shared **Base** (company facts, qualify floor, contact rule,
  the 12-stage pipeline, minimum file, MCA hard gates, risk terms), **Part 1 — Product
  Matrix**, and **Part 2 — Scripts**.

## The routine (end of each day)
1. Say **"update from the doc"** (Claude can read the Master Doc directly), or
   paste the latest text of it.
2. Claude diffs the doc against the typed content in `src/content/*.ts` and
   updates only what changed — keeping the data shapes, the Ness voice, and the
   compliance rails intact (no "guaranteed/approved", no rate before the file,
   factor ≠ APR, credit-repair never promises a score).
3. Claude commits to **`main`** → Netlify auto-builds and publishes in ~1 minute.
4. Claude confirms the live site.

Nothing else to run.

## Where each part of the Master Doc lives in the code (detail in docs/CONTENT-MAP.md)
- **Base → `src/content/meta.ts`** (ticker + rails), **`triage.ts`**, **`statements.ts`**
  (the MCA hard gates), **`minimumFile.ts`**, **`pipeline.ts`** — company facts, the
  single qualify floor, the 12-stage pipeline, the minimum file.
- **Part 1 — Product Matrix → `src/content/products.ts`** — products, `terms`, the
  per-product `details` (eligibility / amounts / payments / cost / docs), `pitches`,
  relationship plays, `rails` — plus **`mca.ts`** (MCA structure) and **`offer.ts`**
  (the approved-offer math).
- **Part 2 — Scripts → `src/content/callFlow.ts`** — the stage talk track
  (Open→Close, including ④.5 Risk check) + the All-set/Light branch cards; plus
  `objections.ts`, `followUps.ts`, `finalQa.ts`, and the triage **LIGHT** track as the
  script evolves.
- **Qualifying threshold** (the single qualify floor) → `src/content/meta.ts` +
  `src/content/triage.ts`.

## Safety net
Every push runs `npm run build`, which type-checks the content against
`src/types/content.ts`. A malformed edit fails the build *before* it ships and
Netlify keeps the last good deploy live — so a bad edit never reaches a live call.
To roll back instantly: Netlify → Deploys → pick a known-good deploy → Publish.

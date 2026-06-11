# Daily updates

The two Google Docs are the source of truth and change a little every day.
**Chosen workflow: manual, via Claude** — no n8n, no build hook, no button.

## Source docs
- **Product matrix** — https://docs.google.com/document/d/1Jor2uhFHAeMaO4Q9Be9KAHBDfSfoCf7kHgMZRkE0f2M/edit
- **Call sheet / script** — https://docs.google.com/document/d/1TKD2yVT5v4uNtiAcejEacYQLEeHd4wAhDaTa3WM3TkE/edit

## The routine (end of each day)
1. Say **"update from the docs"** (Claude can read both Google Docs directly), or
   paste the latest text of either doc.
2. Claude diffs the docs against the typed content in `src/content/*.ts` and
   updates only what changed — keeping the data shapes, the Ness voice, and the
   compliance rails intact (no "guaranteed/approved", no rate before the file,
   factor ≠ APR, credit-repair never promises a score).
3. Claude commits to **`main`** → Netlify auto-builds and publishes in ~1 minute.
4. Claude confirms the live site.

Nothing else to run.

## Where each doc lives in the code (detail in docs/CONTENT-MAP.md)
- **Product matrix doc → `src/content/products.ts`** — products, `terms`, the
  per-product `details` (eligibility / amounts / payments / cost / docs), `pitches`,
  relationship plays, `rails`.
- **Call sheet / script doc → `src/content/callFlow.ts`** — the stage talk track
  (Open→Close) + the Light/Funded branch cards; plus `objections.ts`, `triage.ts`,
  `minimumFile.ts`, `followUps.ts`, `finalQa.ts` as the script evolves.
- **Qualifying thresholds** (floor / green lane) → `src/content/meta.ts` +
  `src/content/triage.ts`.

## Safety net
Every push runs `npm run build`, which type-checks the content against
`src/types/content.ts`. A malformed edit fails the build *before* it ships and
Netlify keeps the last good deploy live — so a bad edit never reaches a live call.
To roll back instantly: Netlify → Deploys → pick a known-good deploy → Publish.

# Daily updates

There is **one** source of truth: the **FinBiz Master Doc** (Google Drive id
`1D93j3Pjo6HPqdtb6IiAPvb5DIp_cuZl4bU-bsBawexg`). It changes a little most days.
**The workflow is manual, via Claude Code** — no n8n, no build hook, no button.

A clean snapshot of the doc lives at [MASTER-DOC.md](MASTER-DOC.md). That's the
baseline each update diffs against.

## The routine (end of each day)

1. **Update the Master Doc.** The owner edits the Master Doc (in practice, by chatting
   with Claude in the doc) so it reflects the latest reality.
2. **Hand the updated Master Doc to Claude Code.** Say *"update the app from the Master
   Doc"* (Claude Code can read it directly from Drive), or paste the latest text.
3. **Claude Code diffs and edits.** It compares the Master Doc against the typed content
   in `src/content/*.ts` and changes only what moved — keeping the data shapes, the Ness
   voice, and the compliance rails intact (no "guaranteed/approved", no rate before the
   file, factor ≠ APR, credit repair never promises a score, FinBiz only — never a parent
   entity, and in writing never the word "MCA" — say "funding").
4. **Claude Code commits to the deploy branch** → Netlify auto-builds and publishes in
   ~1 minute, then Claude Code confirms the live site.
5. **Refresh the snapshot.** Update [MASTER-DOC.md](MASTER-DOC.md) so the next diff has a
   clean baseline.

Nothing else to run.

## Where the Master Doc lives in the code (detail in [CONTENT-MAP.md](CONTENT-MAP.md))

The Master Doc has three parts; each feeds a set of `src/content/*.ts` files:

- **BASE** (qualify floor, pipeline, minimum file, statement review, MCA hard gates, risk
  signals) → `meta.ts`, `pipeline.ts`, `minimumFile.ts`, `statements.ts`, `triage.ts`,
  `mca.ts` (`hardGates`).
- **PART 1 — Product Matrix** (products, terms, routing tree, funder appetite, structuring
  play, rails) → `products.ts`, `mca.ts`, `routing.ts`, `compliance.ts`.
- **PART 2 — Scripts** (the live talk track + the Light/Funded branches, the risk-check
  step, posture, written-comms rails) → `callFlow.ts`, `objections.ts`, `followUps.ts`,
  `finalQa.ts`, `compliance.ts`.

## Safety net

Every push runs `npm run build`, which type-checks the content against
`src/types/content.ts`. A malformed edit fails the build *before* it ships and
Netlify keeps the last good deploy live — so a bad edit never reaches a live call.
To roll back instantly: Netlify → Deploys → pick a known-good deploy → Publish.

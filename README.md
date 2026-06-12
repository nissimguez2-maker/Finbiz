# FinBiz Operator Console

An internal, single-screen cockpit an SDR ("Ness") keeps open during live funding calls.
Everything she reads — talk track, product matrix, triage lanes, objection reframes,
follow-up SMS, the pre-submission QA — is on one page, organized so her eye lands on the
next line and she says it.

It is a static single-page app (Vite + React + TypeScript + Tailwind) deployed to Netlify.
**All script and product copy is data, not code** — it lives in typed modules under
`src/content/*.ts`, so the wording can change every day without anyone touching layout or
React. Those modules can be edited by hand or regenerated automatically from the single Google
Doc — the **FinBiz Master Doc** — the owner keeps as the source of truth.

> Internal tool. It ships with `X-Robots-Tag: noindex, nofollow` so search engines skip it.

---

## The source-of-truth Google Doc

Everything the app shows comes from **one** Google Doc, the **FinBiz Master Doc**. The owner
edits it 3–4 times a week and it is the canonical wording — the repo only ever *points* to it:

**FinBiz Master Doc** — <https://docs.google.com/document/d/1D93j3Pjo6HPqdtb6IiAPvb5DIp_cuZl4bU-bsBawexg/edit>

It has three parts, and each feeds different content files:

| Part of the Master Doc | What it feeds |
| --- | --- |
| **Base** — company facts, the qualify floor, contact rule, the 12-stage pipeline, minimum file, MCA hard gates, risk terms | The masthead ticker & rails, triage, statement read, minimum file, pipeline |
| **Part 1 — Product Matrix** — routing, MCA (primary), Bridge/Term/LOC/HELOC/Equipment, Asset-Based & Specialty, CCP, Credit Repair, structuring play, rails | The product menu, MCA structure, the approved-offer math |
| **Part 2 — Scripts** — posture, written-follow-up wording rail, discovery list, beats ①–⑥ plus ④.5 Risk check, the All-set and Light branches, objections | The talk track, follow-up SMS, final QA, the triage LIGHT track |

The exact "this doc part → this file" mapping is in **[docs/CONTENT-MAP.md](docs/CONTENT-MAP.md)**.

---

## Quick start (local development)

You need [Node.js 22](https://nodejs.org) (Netlify builds on Node 22 too — see `netlify.toml`).

```bash
npm install     # one-time: install dependencies
npm run dev     # start the dev server at http://localhost:5173 (hot-reloads on save)
npm run build   # type-check + production build into dist/
npm run preview # serve the built dist/ locally to sanity-check the production bundle
```

The scripts (from `package.json`):

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload — edit a `src/content/*.ts` file and the page updates instantly |
| `npm run build` | `tsc -b && vite build` — type-checks the content against `src/types/content.ts`, then bundles to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run typecheck` | Type-check only, no build — fastest way to confirm an edit is valid |

If a daily edit has a typo (a missing comma, a renamed field), `npm run build` fails with a
clear TypeScript error **before** anything ships. That is the safety net — the build is the gate.

---

## Architecture: how content becomes a screen

The app is deliberately split so wording lives apart from layout.

```
  FinBiz Master Doc (source of truth)
        │  (n8n sync — optional, see docs/N8N-SYNC.md)
        ▼
  src/content/*.ts        ← typed data: the words, numbers, SMS templates
        │  referenced by (never copied)
        ▼
  src/features/callflow/callScript.ts   ← the one bridge from content to the console
        │  read by
        ▼
  src/features/callflow/CallConsole.tsx ← the live guided console (App.tsx renders this)
        │  (post-call tabs mount src/components/sections/*.tsx, same data)
        ▼
  npm run build → dist/   ← static site Netlify serves
```

Three layers, each with one job:

1. **The contract — `src/types/content.ts`.** TypeScript interfaces that define the *shape*
   of every section (a `CallBeat` has `says: string[]` and optional `cues`; a `Product` has
   `name`, `bestFit`, `terms`, `speed`, `sayIt`; and so on). This is the single rulebook both
   the data and the components obey.

2. **The data — `src/content/*.ts`.** One file per section, each exporting a typed object
   (e.g. `callFlow.ts` exports `callFlow: CallFlowContent`). **This is where the words live.**
   Every file carries a header comment describing its voice and compliance rails. There are
   eleven content sections plus `meta.ts` (brand, masthead ticker, the always-on compliance
   rails, and the canonical nav order):

   `callFlow` · `products` · `mca` · `triage` · `statements` · `minimumFile` ·
   `pipeline` · `objections` · `followUps` · `finalQa` · `offer` — plus `meta`.

3. **The layout — `src/features/callflow/*` and `src/components/sections/*.tsx`.** The live
   view is the guided **CallConsole** (stage stepper, hero line, objections pane, product
   matrix — see [docs/GUIDED-FLOW.md](docs/GUIDED-FLOW.md)). It reaches into the content
   through exactly one bridge module, `src/features/callflow/callScript.ts`, which references
   fields — it never copies text. The post-call reference tabs (Statements, Final QA, Approved
   Offer, Pipeline, MCA) mount the per-section components in `src/components/sections/*`, which
   render their data objects with shared UI pieces (`Section`, `Beat`, `Say`, `Cue`, `Callout`,
   `Card`, `TextBubble`, …). None of these files contain script copy — only structure.

   Example: `callFlow.ts` holds the beats; the console walks them stage by stage and renders
   each spoken line as the hero. Change a line in `callFlow.ts` and the rendered output
   changes; the components never move.

**Why this matters for a non-technical owner:** to change what Ness says, you edit one
`src/content/*.ts` field. You never read or touch a `.tsx` file. See
**[docs/CONTENT-MAP.md](docs/CONTENT-MAP.md)** for the exact field-by-field map.

### A few formatting conventions in the content files

- **`{curly braces}` in a title** mark the word that gets the gradient highlight, e.g.
  `title: "Call {Flow}"` highlights "Flow".
- **`**double asterisks**`** make text bold inside a cell or terms string (e.g. a canonical number).
- **`[[double brackets]]`** mark a conditional/annotation in a table cell (e.g. `[[if refinancing]]`).
- **`tone`** values (`accent`, `go`, `amber`, `clay`) pick the color band of a callout — they are
  styling labels, not content. Leave them as-is unless you intend a color change.

---

## Deploying on Netlify

The repo is wired for Netlify already (`netlify.toml`):

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `22` (set via `NODE_VERSION` in `netlify.toml`) |
| SPA redirect | every route → `/index.html` (status 200) so deep links work |

### First-time setup

1. In Netlify, **Add new site → Import an existing project** and connect this GitHub repo.
2. Netlify reads `netlify.toml`, so the build command and publish dir are filled in automatically.
   Just confirm and deploy.
3. After the first deploy you get a live URL (e.g. `your-site.netlify.app`).

### Day-to-day deploys (automatic)

Once connected, **every push to the default branch triggers a Netlify build and deploy** — no
manual step. If the build fails (e.g. a bad content edit), Netlify keeps the previous good
version live and emails the failure. Nothing broken reaches Ness mid-call.

### The "Sync now / Redeploy" button (Build Hook)

A **Build Hook** is a secret URL; an HTTP `POST` to it kicks off a fresh build and deploy with
no code change. The owner can bookmark it, put it behind a button, or have the n8n sync call it.

Create one in Netlify: **Site settings → Build & deploy → Build hooks → Add build hook**.
Name it (e.g. `sync-redeploy`), pick the branch, and copy the URL. Store it as
`NETLIFY_BUILD_HOOK_URL` (see `.env.example`) — treat it like a password.

Trigger it:

```bash
curl -X POST -d '{}' "$NETLIFY_BUILD_HOOK_URL"
```

### Rolling back

Netlify keeps every past deploy. **Deploys → pick a known-good one → Publish deploy** restores
it instantly. This is the fastest fix if a bad day's copy somehow lands — restore first, debug after.

---

## The daily-update flow (in one paragraph)

The owner edits the FinBiz Master Doc as usual. Then there are three ways to get those edits live,
covered in full in **[docs/DAILY-UPDATES.md](docs/DAILY-UPDATES.md)**:

- **(a) Doc → n8n sync → auto-deploy** — edit the Doc, run the sync; it regenerates the
  `src/content/*.ts` files, commits them, and triggers a deploy. *(Recommended once set up.)*
- **(b) Edit `src/content/*.ts` directly in GitHub's web editor** — for a one-word tweak;
  committing on the default branch auto-deploys via Netlify.
- **(c) "Sync now / Redeploy" button** — a bookmarked Netlify Build Hook to force a rebuild.

The n8n workflow that powers option (a) is designed in **[docs/N8N-SYNC.md](docs/N8N-SYNC.md)**.

---

## Repo layout

```
Finbiz/
├─ README.md                 ← you are here
├─ docs/
│  ├─ CONTENT-MAP.md          ← "to change X, edit this file/field" cheat sheet
│  ├─ DAILY-UPDATES.md        ← the three ways to push a change live
│  └─ N8N-SYNC.md             ← buildable n8n workflow (Master Doc → Claude → GitHub → Netlify)
├─ .env.example               ← placeholder env vars for the sync/build (no real secrets)
├─ netlify.toml               ← Netlify build config (build cmd, publish dir, Node 22, redirects)
├─ index.html, vite.config.ts, tailwind.config.ts, tsconfig*.json
├─ public/                    ← static assets copied as-is
└─ src/
   ├─ types/content.ts        ← THE CONTRACT: interfaces every content file must satisfy
   ├─ content/                ← THE DATA: one typed module per section (edit these)
   │   ├─ meta.ts             ← brand, ticker, compliance rails, nav order
   │   ├─ callFlow.ts  products.ts  mca.ts  triage.ts  statements.ts
   │   └─ minimumFile.ts  pipeline.ts  objections.ts  followUps.ts  finalQa.ts  offer.ts
   ├─ features/callflow/      ← THE LIVE VIEW: the guided console (callScript.ts is the
   │                            only file that reaches into content/ — see GUIDED-FLOW.md)
   └─ components/sections/    ← post-call reference tabs (don't edit for copy)
```

## Compliance rails (baked into the content)

These are non-negotiable and must survive any edit or regeneration. They are stated in
`src/content/meta.ts` (`rails`) and repeated in the file header comments:

- No "guaranteed" / "approved" language.
- No rate before the file (statements set the rate — never quote a number first).
- A factor rate is **not** an APR or interest. APR language is allowed only on the Term Loan.
- No invented urgency.
- Credit repair never promises a specific score (CROA); it takes 60–90 days.

If you change copy by hand or via the sync, keep these intact. The n8n sync's Claude prompt
(see `docs/N8N-SYNC.md`) enforces them automatically.

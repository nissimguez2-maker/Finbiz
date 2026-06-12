# FinBiz Operator Console

An internal, single-screen cockpit an SDR ("Ness") keeps open during live funding calls.
Everything she reads — the full call script, the product matrix, objection reframes, the
pre-submission QA — is on one page, organized so her eye lands on the next line and she says it.

It is a static single-page app (Vite + React + TypeScript + Tailwind) deployed to Netlify.
**All script and product copy is data, not code** — it lives in typed modules under
`src/content/*.ts`, so the wording can change every day without anyone touching layout or
React. Those modules are regenerated from the single Google Doc — the **FinBiz Master Doc** —
the owner keeps as the source of truth: every few days the owner opens a Claude Code session and
asks it to sync the site to the doc.

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
        │  (a Claude session syncs the site to the doc — see docs/CONTENT-SYNC.md)
        ▼
  src/content/*.ts        ← typed data: the words and numbers
        │  read by
        ▼
  src/ (the reading-console layout)   ← renders the content; never holds script copy
        │
        ▼
  npm run build → dist/   ← static site, deployed to Netlify from the sync session
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
   `pipeline` · `objections` · `finalQa` · `offer` — plus `meta`.

3. **The layout — the reading console under `src/`.** The live view is a single
   **scrolling script column** down the center: the full call script top to bottom, with the
   branches shown inline right after the Gate. A **left panel — "What you sell"** collapses
   open to the product matrix, the MCA structure, and the Approved Offer desk. A **right panel
   — "Run the call"** collapses open to the objections, deal killers, the don't-say / say-instead
   pairs, the statement read, the minimum file, the final QA, and the pipeline. A slim top bar
   holds the two panel toggles. Keyboard: **`[`** toggles the left panel, **`]`** toggles the
   right panel, **`Esc`** closes whichever is open. The palette is a near-monochrome light theme
   with a single blue accent. (No notes, no timer, no search, no stepper, no after-call overlay —
   those were removed.) None of these layout files contain script copy — only structure.

   Example: `callFlow.ts` holds the beats; the center column renders each spoken line in order.
   Change a line in `callFlow.ts` and the rendered output changes; the layout never moves.

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

The live site is **`finbiz-operator-console.netlify.app`** (site ID
`14bd8a31-376a-4941-a3f4-06e8c89015db`). Full details in **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**.

### How deploys actually happen

The Netlify site is **not linked to the GitHub repo.** Pushing or merging the default branch does
**not** deploy anything on its own. The site is published by **upload from the sync session** — at
the end of a "sync the site to the doc" session, the session builds `dist/` and deploys it directly
to Netlify (via the Netlify CLI or MCP), then verifies the live bundle. See
**[docs/CONTENT-SYNC.md](docs/CONTENT-SYNC.md)**.

### Optional improvement: link the repo

If you'd rather have pushes deploy themselves, an account admin can link the repo in the Netlify UI
once (**Site configuration → Build & deploy → Continuous deployment → Link repository**). Netlify
reads `netlify.toml`, so the build command and publish dir fill in automatically. After that, every
push to the production branch would build and publish on its own — and the manual upload step in
the sync session becomes unnecessary. Until someone does this, deploying stays a manual step.

### Rolling back

Netlify keeps every past deploy. **Deploys → pick a known-good one → Publish deploy** restores
it instantly. This is the fastest fix if a bad day's copy somehow lands — restore first, debug after.

---

## The daily-update flow (in one paragraph)

The owner edits the FinBiz Master Doc as usual. Then there are two ways to get those edits live,
covered in full in **[docs/DAILY-UPDATES.md](docs/DAILY-UPDATES.md)**:

- **(a) The recommended path — sync via Claude.** Edit the Master Doc, then every few days open a
  Claude Code session and ask it to **sync the site to the doc.** It regenerates the
  `src/content/*.ts` files from the doc, builds, merges, and deploys to Netlify. The full contract
  the session follows is **[docs/CONTENT-SYNC.md](docs/CONTENT-SYNC.md)**.
- **(b) An emergency one-word tweak** — edit a `src/content/*.ts` file directly in GitHub's web
  editor. Note it **won't deploy by itself** (the site isn't linked to the repo), and the next doc
  sync **overwrites** anything you didn't also put in the doc — the doc is the whitelist. Put the
  change in the doc too.

---

## Repo layout

```
Finbiz/
├─ README.md                 ← you are here
├─ docs/
│  ├─ CONTENT-MAP.md          ← "to change X, edit this file/field" cheat sheet
│  ├─ CONTENT-SYNC.md         ← the contract a Claude session follows to sync the site to the doc
│  ├─ DAILY-UPDATES.md        ← the two ways to push a change live
│  └─ DEPLOYMENT.md           ← Netlify site details, manual deploy, and rollback
├─ .env.example               ← placeholder env vars for the sync/build (no real secrets)
├─ netlify.toml               ← Netlify build config (build cmd, publish dir, Node 22, redirects)
├─ index.html, vite.config.ts, tailwind.config.ts, tsconfig*.json
├─ public/                    ← static assets copied as-is
└─ src/
   ├─ types/content.ts        ← THE CONTRACT: interfaces every content file must satisfy
   ├─ content/                ← THE DATA: one typed module per section (edit these)
   │   ├─ meta.ts             ← brand, ticker, compliance rails, nav order
   │   ├─ callFlow.ts  products.ts  mca.ts  triage.ts  statements.ts
   │   └─ minimumFile.ts  pipeline.ts  objections.ts  finalQa.ts  offer.ts
   └─ (layout)                ← THE LIVE VIEW: the reading console — a center script
                                column with a left "What you sell" panel and a right
                                "Run the call" panel. Renders content/; holds no script copy.
```

## Compliance rails (baked into the content)

These are non-negotiable and must survive any edit or regeneration. They are stated in
`src/content/meta.ts` (`rails`) and repeated in the file header comments:

- No "guaranteed" / "approved" language.
- No rate before the file (statements set the rate — never quote a number first).
- A factor rate is **not** an APR or interest. APR language is allowed only on the Term Loan.
- No invented urgency.
- Credit repair never promises a specific score (CROA); it takes 60–90 days.

If you change copy by hand or via the sync, keep these intact. The sync session follows
**[docs/CONTENT-SYNC.md](docs/CONTENT-SYNC.md)**, which enforces these rails on every regenerated line.

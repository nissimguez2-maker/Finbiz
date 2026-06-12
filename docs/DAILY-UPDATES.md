# Daily updates

The **FinBiz Master Doc** is the single source of truth and changes a little every few days.
There is **no n8n, no automated pipeline, and no build hook** — nothing runs on its own. Getting
your edits live is a thing you (or a Claude session) does on purpose.

## Source doc
- **FinBiz Master Doc** — https://docs.google.com/document/d/1D93j3Pjo6HPqdtb6IiAPvb5DIp_cuZl4bU-bsBawexg/edit

  One doc, three parts: a shared **Base** (company facts, qualify floor, contact rule,
  the 12-stage pipeline, minimum file, MCA hard gates, risk terms), **Part 1 — Product
  Matrix**, and **Part 2 — Scripts**.

---

## Two ways to push a change live

### (a) The recommended path — sync via a Claude session
This is how the site is meant to stay current.

1. Edit the **Master Doc** — that's your only writing surface. Add, change, or delete whatever
   you want the site to say.
2. Every few days, open a **Claude Code session** in this repo and ask it to **"sync the site
   to the doc."**
3. The session reads the Master Doc, rewrites the typed `src/content/*.ts` files to match it
   exactly (adding, changing, **and deleting** to match — the doc is a strict whitelist), runs
   the build, merges, and **deploys to Netlify**, then verifies the live site.

The full contract the session follows — including the compliance rails, the whitelist rule, the
"preserve every number" rule, and the explicit deploy step — is **[CONTENT-SYNC.md](CONTENT-SYNC.md)**.
That's the load-bearing doc; read it (or point the session at it) before any sync.

### (b) An emergency one-word tweak by hand
For a tiny fix you can't wait on (a typo, a single number), you can edit a `src/content/*.ts`
file directly in **GitHub's web editor**. Two things to know:

- **It won't deploy by itself.** The Netlify site is **not** linked to the GitHub repo, so a
  commit doesn't publish anything. The change only goes live when someone deploys (the next sync
  session does this).
- **The next doc sync overwrites it** unless you also put it in the Master Doc. The doc is the
  whitelist — anything in the files that isn't in the doc gets removed on the next sync. So make
  the same edit in the Master Doc too, or it disappears.

In short: by-hand edits are for emergencies. The doc is the real source of truth.

---

## Where each part of the Master Doc lives in the code (detail in [CONTENT-MAP.md](CONTENT-MAP.md))
- **Base → `src/content/meta.ts`** (ticker + rails), **`triage.ts`**, **`statements.ts`**
  (the MCA hard gates), **`minimumFile.ts`**, **`pipeline.ts`** — company facts, the
  single qualify floor, the 12-stage pipeline, the minimum file.
- **Part 1 — Product Matrix → `src/content/products.ts`** — products, `terms`, the
  per-product details (eligibility / amounts / payments / cost / docs), `pitches`,
  relationship plays, `rails` — plus **`mca.ts`** (MCA structure) and **`offer.ts`**
  (the approved-offer math).
- **Part 2 — Scripts → `src/content/callFlow.ts`** — the beat-by-beat talk track
  (Open→Close, including ④.5 Risk check) + the All-set/Light branch cards; plus
  `objections.ts`, `finalQa.ts`, and the triage **LIGHT** track as the script evolves.
- **Qualifying threshold** (the single qualify floor) → `src/content/meta.ts` +
  `src/content/triage.ts`.

---

## Safety net
The sync session runs `npm run typecheck && npm run build` before it merges or deploys. That
type-checks the content against `src/types/content.ts`, so a malformed edit fails the build
**before** anything ships — and because the site is deployed by explicit upload, a failed build
simply never gets deployed; the last good version stays live.

To roll back instantly: Netlify → **Deploys** → pick a known-good deploy → **Publish deploy**.

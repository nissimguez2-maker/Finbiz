# Deployment

## Live site
- **URL:** https://finbiz-operator-console.netlify.app (unlisted · `noindex`)
- **Netlify project:** `finbiz-operator-console` (team `nissimguez2`)
- **Site ID:** `14bd8a31-376a-4941-a3f4-06e8c89015db`
- **Build:** `npm run build` → publishes `dist/` (Node 22, see `netlify.toml`)

## How deploys actually happen (read this first)
The Netlify site is **not linked to the GitHub repo.** Pushing or merging the default branch does
**not** build or publish anything on its own. The site is deployed by **explicit upload from a
Claude sync session**: at the end of a "sync the site to the doc" session, the session builds
`dist/` and deploys it directly to the site above (via the Netlify CLI or MCP), then verifies the
live bundle. The full workflow is in **[CONTENT-SYNC.md](CONTENT-SYNC.md)**.

```bash
npm run build           # type-checks content, produces dist/
# then deploy dist/ to the site, e.g. with the Netlify CLI:
netlify deploy --prod --dir dist --site 14bd8a31-376a-4941-a3f4-06e8c89015db
```

`dist/` is gitignored (not committed); a clean `npm ci && npm run build` is verified green.

## Optional improvement: link the repo for auto-deploys
If you'd rather have pushes deploy themselves, an account admin can link the repo to the Netlify
project once (an OAuth step that can't be done via API):

1. Netlify → **finbiz-operator-console** → **Site configuration → Build & deploy →
   Continuous deployment → Link repository**.
2. Choose **GitHub**, authorize the Netlify app, pick **`nissimguez2-maker/finbiz`**.
3. Set the **production branch** (e.g. `main`).
4. Build command `npm run build`, publish directory `dist` (already in `netlify.toml`,
   so Netlify auto-fills them).
5. Deploy. From then on, every push to the production branch would build and publish on its own,
   and the manual upload step in each sync session becomes unnecessary.

Until someone does this, **deploying is a manual step every sync.**

## Editing content
All script/product copy is typed data under `src/content/*.ts` (see [CONTENT-MAP.md](CONTENT-MAP.md)).
The **FinBiz Master Doc** is the source of truth; a Claude session regenerates the content files
from it, builds, and deploys (see [CONTENT-SYNC.md](CONTENT-SYNC.md)). The repo only ever points
to the doc — it is never copied in.

## Rolling back
Netlify keeps every past deploy. **Deploys → pick a known-good one → Publish deploy** restores it
instantly. This is the fastest fix if a bad day's copy somehow lands — restore first, debug after.

> If a build ever fails, the full log is in Netlify → Deploys → (the deploy) → Deploy log.

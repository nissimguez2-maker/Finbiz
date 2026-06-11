# Deployment

## Live site
- **URL:** https://finbiz-operator-console.netlify.app (unlisted · `noindex`)
- **Netlify project:** `finbiz-operator-console` (team `nissimguez2`)
- **Site ID:** `14bd8a31-376a-4941-a3f4-06e8c89015db`
- **Build:** `npm run build` → publishes `dist/` (Node 22, see `netlify.toml`)

## Auto-deploy from GitHub (one-time setup)
The repo is CI-ready: normal `npm run build`, `dist/` is gitignored (not committed),
and a clean `npm ci && npm run build` is verified green. To turn on auto-deploys,
link the repo to the Netlify project once (this is an OAuth step only an account
admin can click — it can't be done via API):

1. Netlify → **finbiz-operator-console** → **Site configuration → Build & deploy →
   Continuous deployment → Link repository**.
2. Choose **GitHub**, authorize the Netlify app, pick **`nissimguez2-maker/finbiz`**.
3. **Production branch:** `claude/gallant-darwin-8anzw0` (or merge it to `main` and use `main`).
4. Build command `npm run build`, publish directory `dist` (already in `netlify.toml`,
   so Netlify will auto-fill them).
5. Deploy. From then on, **every push to the production branch builds and publishes
   automatically** — no manual step.

> If a build ever fails, the full log is in Netlify → Deploys → (the deploy) → Deploy log.

## Editing content
All script/product copy is typed data under `src/content/*.ts` (see
`docs/CONTENT-MAP.md`). Edit a value → commit/push → auto-deploys. The two Google
Docs remain the source of truth; `docs/N8N-SYNC.md` describes the optional
Docs → repo → deploy sync.

## Manual deploy (fallback, no git connection)
If you ever need to publish without the git connection, build locally and deploy
the output directly:

```bash
npm run build           # produces dist/
# then deploy dist/ to site 14bd8a31-376a-4941-a3f4-06e8c89015db
```

(Earlier we temporarily committed a prebuilt `dist/` with a no-op build command to
bypass a flaky upload path; that's now removed in favor of the standard git build.)

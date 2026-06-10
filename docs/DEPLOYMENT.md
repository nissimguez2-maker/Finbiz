# Deployment

## Live site

- **URL:** https://finbiz-operator-console.netlify.app
- **Netlify project:** `finbiz-operator-console` (team `nissimguez2`)
- **Site ID:** `14bd8a31-376a-4941-a3f4-06e8c89015db`
- **Build:** `npm run build` → publishes `dist/` (see `netlify.toml`, Node 22)
- **Privacy:** unlisted + `noindex, nofollow` (meta tag + `X-Robots-Tag` header). The
  URL is public to anyone who has the link — there is no password. To add one later,
  see "Locking it down" below.

The first deploy was a direct upload of the production build. It is live and verified
(all 11 sections render, the Approved-Offer calculator computes, search works, no
console errors).

## Turning on auto-deploy (recommended, one-time)

Right now a redeploy is a manual step. To make "edit content → it goes live by itself"
work, connect this Netlify project to the GitHub repo once:

1. Netlify → **finbiz-operator-console** → **Site configuration → Build & deploy →
   Continuous deployment → Link repository** → pick `nissimguez2-maker/Finbiz`.
2. Set **Production branch** to the branch that holds this app
   (`claude/gallant-darwin-8anzw0`), or merge it into `main` and use `main`.
3. Build command `npm run build`, publish directory `dist` (already in `netlify.toml`).
4. Create a **Build hook** (Build & deploy → Build hooks). Copy the URL — this is your
   "Sync / Redeploy now" button and what the n8n workflow calls. Put it in `.env` as
   `NETLIFY_BUILD_HOOK_URL` (see `.env.example`).

Once connected, every push to the production branch rebuilds and redeploys automatically.

## The daily update loop

You edit the two Google Docs as the source of truth. Pick one path (full detail in
`docs/DAILY-UPDATES.md` and `docs/N8N-SYNC.md`):

- **n8n sync (recommended):** Docs → Claude transforms them into `src/content/*.ts` →
  commit → auto-deploy. One button or a daily schedule.
- **Direct edit:** change a value in `src/content/*.ts` (GitHub web editor is fine) →
  commit → auto-deploy. See `docs/CONTENT-MAP.md` for which file holds what.
- **Redeploy button:** hit the Netlify Build Hook URL to rebuild the current content.

## Manual redeploy (no git connection)

From the repo directory, rebuild and re-upload:

```bash
npm run build
# then trigger a deploy for site 14bd8a31-376a-4941-a3f4-06e8c89015db
```

## Locking it down (if you change your mind on access)

- **Passcode gate:** a small password screen can be added to the app (works on the
  free plan; "soft" protection since the page source is readable).
- **Netlify password protection:** stronger, server-side — requires upgrading the team
  to Netlify Pro, then Site configuration → Access control → Password protection.

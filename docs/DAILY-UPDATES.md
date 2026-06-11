# Daily Updates — Three Ways to Push a Change Live

You keep two Google Docs current (the **Product matrix** and the **Call sheet**). This page
explains the three ways those edits — or small direct tweaks — become the live console Ness
sees, with the tradeoffs and a recommendation.

All three end the same way: a new build is deployed to Netlify. The site is always built before
it ships, so a broken edit can't take down the live page — Netlify keeps the previous good
version up and emails you the failure.

---

## The recommended daily rhythm

1. **Morning:** edit the Google Docs as you normally do — that's your source of truth.
2. **When you want it live:** run the **n8n sync** (Option A). It reads both Docs, regenerates the
   `src/content/*.ts` files, commits them to GitHub, and triggers a Netlify deploy. ~1–2 minutes
   later the console reflects your Docs.
3. **For a one-word fix you don't want to round-trip through the Docs:** edit the
   `src/content/*.ts` file directly in GitHub (Option B). Faster for a single typo.
4. **If a deploy didn't fire or you just want to force a rebuild:** hit the **Sync now / Redeploy**
   button (Option C).

> **Recommendation:** Use **Option A (the n8n sync)** as your default — it keeps the Google Docs
> as the one source of truth, so the Docs and the live site never drift apart, and the Claude
> step enforces the compliance rails automatically. Keep **Option B** for the occasional
> one-character fix, and **Option C** as the "just rebuild it" button.

---

## Option A — Edit the Docs → run the n8n sync → auto-deploy  ⭐ recommended

**What it is.** A one-click automation (built in n8n) that does the whole pipeline for you:

```
Edit Google Docs  →  [n8n: read both Docs → Claude rewrites the content files →
                      commit to GitHub → trigger Netlify build hook]  →  live in ~1–2 min
```

**How you run it.** Click the workflow's manual trigger in n8n (or the "Sync now" button/URL it
exposes). You can also let it run on a daily schedule so the site refreshes itself.

**Pros**
- The Google Docs stay the single source of truth — no drift between what you edit and what ships.
- You never touch code. You write prose in a Doc; the automation produces valid, type-correct
  TypeScript.
- The Claude step **enforces the compliance rails every time** (no "guaranteed/approved," no rate
  before the file, factor ≠ APR, credit repair never promises a score) and preserves every number.
- Handles all sections at once.

**Cons**
- Requires the one-time n8n setup (see [N8N-SYNC.md](N8N-SYNC.md)) and an Anthropic API key
  (a few cents per run — see the cost note in that doc).
- It's an automated rewrite: review the resulting commit's diff in GitHub the first few times to
  build trust. After that it's routine.

**When to use it:** your normal daily/weekly refresh. This is the default.

Full build instructions and the exact Claude prompt are in **[N8N-SYNC.md](N8N-SYNC.md)**.

---

## Option B — Edit `src/content/*.ts` directly in GitHub → commit → auto-deploy

**What it is.** GitHub has a built-in web editor. You open the content file, change the words
between the quotes, and commit. Netlify is watching the repo and deploys the change automatically.

**How to do it (no tools to install):**
1. Go to the repo on GitHub → `src/content/` → click the file you need
   (use [CONTENT-MAP.md](CONTENT-MAP.md) to find which one).
2. Click the **pencil (Edit)** icon.
3. Change the text **inside the quotes**. Leave the commas, braces, and field names alone.
4. Scroll down, write a short note ("raise qualify floor to $18K"), and click **Commit changes**
   to the default branch.
5. Netlify rebuilds and deploys automatically — done in ~1–2 minutes. If the edit has a typo, the
   build fails, the old version stays live, and you get an email; fix the typo and commit again.

**Pros**
- Instant, no setup, no API cost. Perfect for a single-word change.
- You see exactly what you changed.

**Cons**
- You're editing code-shaped text, so a stray missing `"` or `,` will fail the build (safe — it
  just won't ship — but it's friction).
- **The Google Doc and the file can drift.** If you fix the site but not the Doc, the next n8n
  sync (Option A) will overwrite your hand-edit with what the Doc still says. So either also update
  the Doc, or make the change in the Doc and use Option A instead.

**When to use it:** a quick one-off fix you're confident about — and remember to mirror it back
into the Google Doc so the next sync doesn't undo it.

---

## Option C — The "Sync now / Redeploy" button (Netlify Build Hook)

**What it is.** A Build Hook is a private URL. Sending it an HTTP `POST` tells Netlify "rebuild
and redeploy the current code right now," with no code change required. The owner can bookmark it
or wire it to a literal button.

**How to create it (one time):**
1. In Netlify: **Site settings → Build & deploy → Build hooks → Add build hook**.
2. Name it (e.g. `sync-redeploy`), choose the branch (your default branch), **Save**.
3. Copy the URL it gives you. Store it as `NETLIFY_BUILD_HOOK_URL` (see `.env.example`).
   **Treat it like a password** — anyone with the URL can trigger a deploy.

**How to trigger it:**
- Paste the URL into a tool that can POST, or run:
  ```bash
  curl -X POST -d '{}' "https://api.netlify.com/build_hooks/XXXXXXXXXXXX"
  ```
- Or bookmark a tiny one-button page / shortcut that POSTs to it.
- The n8n sync (Option A) calls this same hook as its final step.

**Pros**
- Dead simple "make it rebuild" button. No code, no API key.
- Useful to recover from a "the deploy didn't fire" situation, or to pick up an environment change.

**Cons**
- **It only rebuilds the current code — it does not pull anything new from the Google Docs.** On
  its own it changes nothing about the content; it just redeploys what's already committed. To
  change content you still need Option A or Option B first.

**When to use it:** to force a fresh deploy of code that's already committed, or as the final
"publish" step of the sync.

---

## Quick comparison

| | A — Docs → n8n sync | B — Edit file in GitHub | C — Redeploy button |
| --- | --- | --- | --- |
| Source of truth stays the Docs | ✅ Yes | ⚠️ Can drift | n/a (no content change) |
| Touches code | ❌ No | ✅ Yes (small) | ❌ No |
| Enforces compliance rails | ✅ Automatically | ⚠️ Up to you | n/a |
| One-time setup | n8n + API key | none | one Build Hook |
| Cost per run | a few cents (Claude) | free | free |
| Best for | the daily/weekly refresh | a single quick fix | forcing a rebuild |
| **Recommended as** | **the default** | the exception | the "publish" button |

---

## Safety net (applies to all three)

- Every push runs `npm run build`, which **type-checks the content against
  `src/types/content.ts`**. A malformed edit fails the build *before* it ships.
- On a failed build, **Netlify keeps the last good deploy live** and emails you.
- To roll back instantly: Netlify → **Deploys → pick a known-good deploy → Publish deploy**.

So the worst case for a bad edit is "the site keeps showing yesterday's good version until you fix
it" — never a broken page in front of Ness on a call.

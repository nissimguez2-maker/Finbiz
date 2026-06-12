# n8n Sync — Google Doc → Claude → GitHub → Netlify

This is a concrete, buildable n8n workflow that keeps the single **FinBiz Master Doc** as the
source of truth and regenerates the typed `src/content/*.ts` modules whenever you ask it to. It
reads the Master Doc, asks Claude to transform the prose into valid TypeScript that matches
`src/types/content.ts` (preserving every number and enforcing the compliance rails), commits the
regenerated files to GitHub, and triggers a Netlify rebuild.

```
┌─────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Trigger    │──▶│ Read the     │──▶│ Anthropic    │──▶│ GitHub       │──▶│ Netlify      │
│ (manual /   │   │ FinBiz       │   │ Claude       │   │ commit the   │   │ Build Hook   │
│  webhook /  │   │ Master Doc   │   │ (transform   │   │ regenerated  │   │ (redeploy)   │
│  schedule)  │   │ (1 node)     │   │  to TS)      │   │ content/*.ts │   │              │
└─────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

> Why Claude does the transform: the Doc is loose prose the owner edits freely; the content
> files are strict, typed TypeScript. Claude bridges the two — turning "raise the qualify floor to
> $18K" in the Doc into the exact `{ k: "Qualify floor", v: "$18K", sub: "/mo" }` edit in `meta.ts`,
> while keeping every other field byte-for-byte and applying the compliance rails.

---

## Model choice

Use the latest, most capable model for the transform — accuracy matters more than a few cents here,
and the whole job is "reproduce strict typed code without dropping a number or breaking a rail."

| | Model id | Price (per 1M tokens) | Use it for |
| --- | --- | --- | --- |
| **Recommended** | `claude-opus-4-8` | $5 in / $25 out | The default. Most capable; best at producing exact, type-correct TS and respecting the rails. |
| Cheaper option | `claude-sonnet-4-6` | $3 in / $15 out | Fine for routine wording-only refreshes; swap in to cut cost. |

**Recommendation:** run on `claude-opus-4-8`. A sync processes roughly the size of the Master Doc
plus the regenerated files — on the order of a few cents per run, so model price is not the
deciding factor; correctness is. Drop to `claude-sonnet-4-6` only if you're doing many runs a day
and the edits are small wording tweaks.

This calls the **Anthropic Messages API** (`POST https://api.anthropic.com/v1/messages`). In n8n
you can use either the built-in **Anthropic** node or a generic **HTTP Request** node; both are
described below. On `claude-opus-4-8`, do **not** send `temperature` or `budget_tokens` (they're
rejected). To control depth/cost, use `output_config.effort` (`low`/`medium`/`high`); adaptive
thinking is set with `thinking: {"type": "adaptive"}`. For this deterministic reproduce-the-code
job, `effort: "low"` or `"medium"` is plenty.

---

## Credentials and environment you need

Set these up once. Store secrets in n8n's credential store / environment — never in the workflow
JSON or the repo. (`.env.example` in the repo lists the same names with comments.)

| Secret / setting | Where it's used | How to get it |
| --- | --- | --- |
| **Google account (OAuth2)** with access to the Master Doc | the Google Docs node | n8n → Credentials → *Google Docs OAuth2 API* (or a Google service account shared on the Master Doc). |
| `ANTHROPIC_API_KEY` | the Claude node | <https://console.anthropic.com> → API keys. |
| `GITHUB_TOKEN` (fine-grained PAT, **Contents: Read and write** on this repo) | the GitHub node | GitHub → Settings → Developer settings → Fine-grained tokens. |
| `NETLIFY_BUILD_HOOK_URL` | the final HTTP node | Netlify → Site settings → Build & deploy → Build hooks → Add build hook. |
| Doc ID (FinBiz Master Doc) | the Google Docs node | the long id in the Doc's URL (already in the README). |

Doc ID for reference:
- FinBiz Master Doc: `1D93j3Pjo6HPqdtb6IiAPvb5DIp_cuZl4bU-bsBawexg`

---

## Node-by-node design

### Node 1 — Trigger

Use one (or both) of:

- **Manual Trigger** — the "Sync now" button you click in n8n. Simplest; recommended to start.
- **Webhook** — gives you a URL you can POST to (bookmark it, or wire it to a button) to run the
  sync without opening n8n.
- **Schedule Trigger** (optional) — e.g. once every morning, so the site self-refreshes from the
  Docs. You can wire all three into the same downstream chain.

### Node 2 — Read the FinBiz Master Doc

One **Google Docs** node (Resource: *Document*, Operation: *Get*):

- **Node 2 — "Read Master Doc":** Document ID = `1D93j3Pjo6HPqdtb6IiAPvb5DIp_cuZl4bU-bsBawexg`.

It returns the Doc's content. Extract the plain text (the node returns the document structure;
use the node's text output, or a small **Set**/**Code** node to flatten it to a single string).
Carry it forward as, say, `masterDocText`.

> If you prefer, replace this with **Google Drive → Download** as `text/plain` — same result,
> sometimes simpler text.

### Node 4 — Anthropic Claude (the transform)

This is the heart of the sync. It receives the Master Doc plus the current type definitions and is
asked to output the full set of regenerated content modules as strict, valid TypeScript.

**Option A — built-in Anthropic node** (easiest):
- Credential: your `ANTHROPIC_API_KEY`.
- Model: `claude-opus-4-8`.
- System prompt: paste the full prompt in the next section.
- User message: the assembled payload (the two Doc texts + the `content.ts` type source + the
  list of files to produce) — see "User message" below.
- Max tokens: `16000` (these files are small; this is ample headroom).
- Leave temperature unset.

**Option B — HTTP Request node** (if you want raw control). `POST https://api.anthropic.com/v1/messages`:
- Headers:
  - `x-api-key: {{ $env.ANTHROPIC_API_KEY }}`
  - `anthropic-version: 2023-06-01`
  - `content-type: application/json`
- Body (JSON):
  ```json
  {
    "model": "claude-opus-4-8",
    "max_tokens": 16000,
    "output_config": { "effort": "low" },
    "system": "<<the full system prompt from the next section>>",
    "messages": [
      { "role": "user", "content": "<<the assembled user message>>" }
    ]
  }
  ```
  The text reply is at `content[0].text`. (Do not add `temperature` or `budget_tokens` — Opus 4.8
  rejects them.)

**Have Claude return structured JSON so the next node can write each file cleanly.** Ask it to
return one JSON object mapping each file path to its full new contents (the system prompt below
specifies this exactly). Then a small **Code** node parses that JSON into one item per file:

```js
// Code node: turn Claude's JSON into one n8n item per file
const text = $json.content?.[0]?.text ?? $json.text;   // depending on node used
const files = JSON.parse(text).files;                  // { "src/content/products.ts": "....", ... }
return Object.entries(files).map(([path, content]) => ({ json: { path, content } }));
```

### Node 5 — GitHub commit

A **GitHub** node (Resource: *File*, Operation: *Edit/Create*), run **once per item** from the
Code node so each regenerated file is committed:

- Credential: `GITHUB_TOKEN`.
- Owner / Repo: this repo.
- Branch: your default branch (or a `sync/<date>` branch + a PR if you want a review gate — see
  "Safer variant" below).
- File Path: `={{ $json.path }}`.
- File Content: `={{ $json.content }}`.
- Commit Message: e.g. `={{ "content sync from Google Docs " + $now.toISO() }}`.

Committing to the default branch is what triggers Netlify's automatic deploy. (If you also keep the
Build Hook step below, you'll redeploy belt-and-suspenders — harmless.)

### Node 6 — Netlify Build Hook (redeploy)

An **HTTP Request** node:
- Method: `POST`
- URL: `{{ $env.NETLIFY_BUILD_HOOK_URL }}`
- Body: `{}` (empty JSON is fine)

This forces a fresh build/deploy. If you committed to the branch Netlify watches in Node 5, this
is redundant but safe; if you committed to a non-watched branch (e.g. for a PR flow), this is how
you publish.

### Optional Node 7 — Notify

A **Slack / Email** node on success or failure ("content sync deployed ✅" / "sync failed ❌, see
run"), so the owner knows it landed.

---

## The full Claude system prompt

Paste this verbatim into the Claude node's **system** field. It pins the output to the type
contract, preserves every number, and bakes in the compliance rails.

```
You are a build step in a content pipeline for the "FinBiz Operator Console," an internal
single-page app that an SDR named Ness reads during live business-funding sales calls. All of
the on-screen copy lives as typed TypeScript data modules under src/content/. Your job is to
regenerate those modules from a single source-of-truth Google Doc — the FinBiz Master Doc —
exactly matching the TypeScript type contract, so the result compiles and deploys unchanged.

The Master Doc has three parts: a shared BASE (company facts, the single qualify floor, contact
rule, the 12-stage pipeline, minimum file, MCA hard gates, risk terms), PART 1 — PRODUCT MATRIX
(routing, MCA primary, Bridge/Term/LOC/HELOC/Equipment, Asset-Based & Specialty, CCP, Credit
Repair, the structuring play, rails), and PART 2 — SCRIPTS (posture, the written-follow-up wording
rail, the discovery list, beats ①–⑥ plus ④.5 Risk check, the All-set and Light branches,
objections).

INPUTS YOU WILL RECEIVE (in the user message):
1. MASTER_DOC — plain text of the FinBiz Master Doc.
2. TYPES_TS — the full current source of src/types/content.ts (the type contract).
3. CURRENT_FILES — the current source of each src/content/*.ts file you must regenerate, keyed
   by path. Use these as the structural template: keep their shape, field names, ordering, header
   comments, and any field not driven by the Doc byte-for-byte unless the Doc clearly changes it.

WHICH PART OF THE MASTER DOC FEEDS WHICH FILE:
- BASE → src/content/meta.ts (the masthead `ticker` numbers + the `rails`), src/content/triage.ts,
  src/content/statements.ts (the MCA hard gates), src/content/minimumFile.ts,
  src/content/pipeline.ts.
- PART 1 — PRODUCT MATRIX → src/content/products.ts, src/content/mca.ts, src/content/offer.ts.
- PART 2 — SCRIPTS → src/content/callFlow.ts (beats ①–⑥ + ④.5 Risk check + All-set/Light
  branches), src/content/objections.ts, src/content/followUps.ts, src/content/finalQa.ts, and the
  triage.ts LIGHT track.
- Global (in meta.ts): only change brand, `ticker`, `rails`, or `nav` fields the Doc clearly
  changes; never reorder `nav` or change any `id`/`navNo` unless the Doc explicitly restructures
  the sections.

HARD REQUIREMENTS — output must be valid TypeScript that satisfies TYPES_TS:
- Each file must keep the SAME default/named export and import the SAME types as its CURRENT_FILES
  version (e.g. callFlow.ts imports CallFlowContent and exports `callFlow`).
- Match every interface in TYPES_TS exactly: field names, required vs optional, array vs object,
  and the allowed string-literal unions (Tone = "accent" | "go" | "amber" | "clay" | "neutral";
  TagColor = "gold" | "blue" | "teal" | "slate"; Lane.tone = "go" | "amber" | "clay"; etc.).
  Never invent a field or a tone/tag value that the types don't allow.
- Preserve the existing formatting conventions used in CURRENT_FILES: {curly braces} in a title
  mark the gradient-highlighted word; **double asterisks** bold inline text; [[double brackets]]
  mark conditional annotations in table cells; `no`/`emphasize`/`subhead` on table rows behave as
  in the current files.
- Keep the file header comments (the /** ... */ block describing voice and compliance) — update
  them only if a Doc changes the underlying policy.

PRESERVE EVERY NUMBER:
- Reproduce all canonical figures exactly as the Doc states them: the single qualify floor
  ($15K+/mo revenue · 6+ months in business · 500+ FICO · business bank account), 3 months of
  bank statements, the MCA hard gates (3+ deposits/month, ≤4–5 negative days/month, positive
  ending balance each of the last 3 months), dollar amounts and ranges, factor rates, payback
  totals, term lengths, percentages, and timeframes (e.g. 60–90 days). The Doc now uses ONE
  qualify floor — there is no tiered Green/Yellow/Red threshold; do not reintroduce one.
- If a Doc changes a number that drives a worked example (e.g. the MCA example funded × factor =
  payback, ÷ term = per-payment), recompute ALL dependent numbers so the math is internally
  consistent (e.g. $20,000 × 1.40 = $28,000; ÷ 100 = $280/day). Never leave a stale dependent
  figure.
- Do not invent, round, or "improve" any number that the Doc doesn't change.

COMPLIANCE RAILS — apply to all generated copy, no exceptions:
- Never use "guaranteed" or "approved" as a promise. Approval always depends on underwriting.
- No rate before the file. Never state or imply a specific rate/price before bank statements are
  reviewed — the statements set the rate.
- A factor rate is NOT an APR or interest. Never describe a factor rate as interest/APR. APR
  language is allowed ONLY on the Term Loan product, which is a real loan.
- Credit repair never promises a specific score (CROA). Keep its 60–90-day timeframe and the
  "scales with score / up to $6K" framing; never guarantee an outcome.
- No invented urgency. Urgency comes from the merchant's own answers, never from manufactured
  pressure.
- Keep "no obligation" language where the current files have it (offer walkthroughs, follow-ups).
  Never promise an offer or approval before a file exists.
- CCP and Credit Repair are relationship plays, never an opener.
If a Doc's wording would violate a rail, keep the meaning but rephrase to comply, and keep the
corresponding `compliance` "say instead" guidance intact in objections.ts.

VOICE:
- Keep Ness's voice as established in CURRENT_FILES: plainspoken, confident, contractions, no
  filler, no marketing fluff. Follow-up SMS should read like real human texts, not spam.

OUTPUT FORMAT — return ONLY a single JSON object, no prose, no markdown fences:
{
  "files": {
    "src/content/meta.ts":        "<full file contents>",
    "src/content/callFlow.ts":    "<full file contents>",
    "src/content/products.ts":    "<full file contents>",
    "src/content/mca.ts":         "<full file contents>",
    "src/content/triage.ts":      "<full file contents>",
    "src/content/statements.ts":  "<full file contents>",
    "src/content/minimumFile.ts": "<full file contents>",
    "src/content/pipeline.ts":    "<full file contents>",
    "src/content/objections.ts":  "<full file contents>",
    "src/content/followUps.ts":   "<full file contents>",
    "src/content/finalQa.ts":     "<full file contents>",
    "src/content/offer.ts":       "<full file contents>"
  }
}
Each value is the complete, ready-to-commit TypeScript source for that file (including imports and
the header comment). Include a file ONLY if its Doc-driven content changed; if a file is unchanged,
omit it from "files" so it isn't needlessly re-committed. Never output .tsx files. Output must
be parseable by JSON.parse — escape newlines and quotes correctly inside the string values.
```

### The user message (what to assemble in n8n)

Build the user message from the upstream nodes. A simple template:

```
MASTER_DOC:
{{ $node["Read Master Doc"].json.text }}

TYPES_TS:
{{ $node["Read types"].json.content }}

CURRENT_FILES:
{{ $node["Read current content files"].json.bundle }}
```

To supply `TYPES_TS` and `CURRENT_FILES`, add two small read steps before the Claude node — e.g.
**GitHub → Get file** for `src/types/content.ts`, and a **GitHub → List/Get** (or a Code node that
fetches each `src/content/*.ts`) that bundles the current files into a single keyed string. Giving
Claude the current files as a template is what keeps unchanged fields byte-for-byte and the output
compiling on the first try.

---

## Node-by-node setup checklist

1. [ ] **Credentials in n8n:** add Google Docs OAuth2 (with access to the Master Doc), `ANTHROPIC_API_KEY`,
   `GITHUB_TOKEN` (Contents: read/write), and set `NETLIFY_BUILD_HOOK_URL` in n8n's environment.
2. [ ] **Trigger node:** add a Manual Trigger (and optionally a Webhook and a daily Schedule).
3. [ ] **Read Master Doc:** Google Docs → Get, Document ID `1D93j3Pjo6HPqdtb6IiAPvb5DIp_cuZl4bU-bsBawexg`.
4. [ ] **Read types + current files:** GitHub → Get `src/types/content.ts`, and fetch/bundle the
   current `src/content/*.ts` files (for Claude to use as a template).
5. [ ] **Claude node:** model `claude-opus-4-8`, paste the system prompt, assemble the user message,
   `max_tokens: 16000`, no temperature. (Or HTTP Request to `/v1/messages` with the headers above.)
6. [ ] **Parse output:** Code node → `JSON.parse(text).files` → one item per `{ path, content }`.
7. [ ] **GitHub commit:** GitHub → Create/Edit File, run once per item, path/content from the item,
   commit to the default branch.
8. [ ] **Netlify redeploy:** HTTP Request → POST `NETLIFY_BUILD_HOOK_URL`, body `{}`.
9. [ ] **(Optional) Notify:** Slack/Email on success and on failure.
10. [ ] **Test:** make a tiny, obvious edit in the Doc (e.g. bump a ticker number), run the workflow,
    confirm the GitHub diff is exactly that change, and watch Netlify deploy.

---

## Safer variant (recommended once you're comfortable)

Instead of committing straight to the default branch, have the GitHub node commit to a
`sync/<date>` branch and **open a Pull Request**. Netlify builds a deploy preview for the PR, so
you can eyeball the rendered change before it's live. Merge to publish. This adds a human review
gate for free while keeping the Master Doc as the source of truth. For day-to-day, committing to
the default branch (the design above) is fine — the type-checked build is already a strong gate.

## Cost and guardrails

- Each run sends the Master Doc + the type file + the current content files, and gets back the
  regenerated files — on the order of a few cents on `claude-opus-4-8`. Negligible for a daily sync.
- The `max_tokens: 16000` cap bounds output. Keep `effort` at `low`/`medium` for this
  reproduce-the-code task.
- If you schedule the sync, give it a sane cadence (e.g. once a day) rather than every few minutes —
  there's no value in re-running when the Master Doc hasn't changed.
- The real safety net is downstream: the Netlify build type-checks every regenerated file against
  `src/types/content.ts`. If Claude ever produced malformed TS, the build fails, the previous good
  version stays live, and you get an email — nothing broken reaches Ness on a call.

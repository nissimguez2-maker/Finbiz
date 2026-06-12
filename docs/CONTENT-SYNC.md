# Content Sync — the recurring Claude session contract

This is the checklist a Claude Code session (or a careful human) follows when the owner says
**"sync the site to the doc."** The owner edits the **FinBiz Master Doc** every few days; then a
session reads the doc, regenerates the typed `src/content/*.ts` files to match it, builds, merges,
and deploys. There is no n8n, no automated pipeline, no build hook — the session does the work.

> **FinBiz Master Doc** — <https://docs.google.com/document/d/1D93j3Pjo6HPqdtb6IiAPvb5DIp_cuZl4bU-bsBawexg/edit>

Work top to bottom. Don't skip a rail because the change "looks small."

---

## 0. The session in one breath

1. Read the Master Doc (link above). Read the current `src/content/*.ts` and `src/types/content.ts`.
2. Rewrite each content file so it matches **only** what the doc says now — adding, changing, and
   **deleting** to match.
3. `npm run typecheck && npm run build` must pass.
4. Merge to the default branch.
5. **Deploy explicitly to Netlify** (it is NOT auto-deployed from GitHub) and verify the live bundle.

---

## 1. The doc is the single source of truth — and a STRICT WHITELIST

- The Master Doc is the **only** source of truth. The repo never holds a copy of it — we only
  *point* to it (the link above). Never paste the doc into the repo.
- Treat the doc as a **whitelist**: the regenerated files may contain **only** what is in the
  current doc. If a product, script line, scenario, threshold, play, number, or fact exists in
  `src/content/*.ts` but is **not** in the doc as it reads today, the owner deleted it — **remove
  it.** Do not keep content because it "doesn't conflict." Do not resurrect anything from an older
  doc or an older version of the files.
- **Never invent speakable copy.** Lines, SMS/text bubbles, and pitches must trace word-for-word to
  the current doc. Site structure may re-present doc facts as checklists or tables, but every spoken
  or written line must come from the doc. If the doc doesn't say it, it doesn't ship.

---

## 2. Which part of the doc feeds which file

The doc has three parts. Map them like this (see also `docs/CONTENT-MAP.md` for the field detail):

| Doc part | Files it feeds |
| --- | --- |
| **Base** — company facts, the single qualify floor, contact rule, the 12-stage pipeline, minimum file, MCA hard gates, risk terms | `meta.ts` (the masthead `ticker` + the `rails`), `triage.ts`, `statements.ts` (the MCA hard gates), `minimumFile.ts`, `pipeline.ts` |
| **Part 1 — Product Matrix** — routing, MCA (primary), Bridge/Term/LOC/HELOC/Equipment, Asset-Based & Specialty, CCP, Credit Repair, the structuring play, rails | `products.ts`, `mca.ts`, `offer.ts` |
| **Part 2 — Scripts** — posture, written-follow-up wording rail, discovery list, beats ①–⑥ + ④.5 Risk check, the All-set and Light branches, objections | `callFlow.ts`, `objections.ts`, `finalQa.ts`, **and the `triage.ts` LIGHT track** |

In `meta.ts`, only change `brand`, `ticker`, `rails`, or `nav` fields the doc clearly changes.
Never reorder `nav` or change any `id`/`navNo` unless the doc explicitly restructures the sections.

---

## 3. Preserve every number — and recompute the dependent math

- Reproduce every canonical figure exactly as the doc states it: the single qualify floor
  (**$15K+/mo revenue · 6+ months in business · 500+ FICO · business bank account**), 3 months of
  bank statements, the MCA hard gates (3+ deposits/month, ≤4–5 negative days/month, positive ending
  balance each of the last 3 months), dollar amounts and ranges, factor rates, payback totals, term
  lengths, percentages, timeframes (e.g. 60–90 days). The doc uses **one** qualify floor — there is
  no tiered Green/Yellow/Red threshold. Do not reintroduce one.
- When the doc changes a number that drives a **worked example**, recompute **all** dependent
  numbers so the math is internally consistent. Example: if the MCA factor moves to 1.40 on a
  $20,000 funded amount over 100 payments, then `$20,000 × 1.40 = $28,000` total payback, and
  `$28,000 ÷ 100 = $280/day`. Update every dependent figure (`products.ts` worked example,
  `mca.ts` `example` grid, `offer.ts`). Never leave a stale dependent figure.
- Do not invent, round, or "improve" any number the doc doesn't change.

---

## 4. The type contract and formatting conventions

- Every file must satisfy **`src/types/content.ts`** and compile against it. Keep each file's
  existing default/named export and the same imported types (e.g. `callFlow.ts` imports
  `CallFlowContent` and exports `callFlow`).
- Match every interface exactly: field names, required vs optional, array vs object, and the
  allowed string-literal unions (e.g. `Tone = "accent" | "go" | "amber" | "clay" | "neutral"`;
  `TagColor = "gold" | "blue" | "teal" | "slate"`). Never invent a field or a tone/tag value the
  types don't allow.
- Use the current files as the structural template: keep their shape, field order, and header
  comments byte-for-byte for anything the doc doesn't change.
- Formatting conventions inside the strings:
  - **`{curly braces}`** in a title mark the gradient-highlighted word, e.g. `"Call {Flow}"`.
  - **`**double asterisks**`** bold inline text (e.g. a canonical number).
  - **`[[double brackets]]`** mark a conditional/annotation in a table cell (e.g. `[[if refinancing]]`).
  - Row flags (`no`, `emphasize`, `subhead`) behave as in the current files.

---

## 5. Compliance rails — apply to all generated copy, no exceptions

- **No "guaranteed" / "approved" as a promise.** Approval always depends on underwriting.
- **No rate before the file.** Never state or imply a specific rate/price before the bank
  statements are reviewed — the statements set the rate.
- **A factor rate is NOT an APR or interest.** Never describe a factor rate as interest/APR.
  APR language is allowed **only** on the Term Loan, which is a real loan.
- **Never write "MCA" in an SMS/email.** In anything written to the merchant, say **"funding"**
  (the doc's written-follow-up wording rail). The acronym is for internal/spoken use only.
- **Credit repair never promises a specific score** (CROA). Keep its 60–90-day timeframe and the
  "scales with score / up to $6K" framing; never guarantee an outcome.
- **No invented urgency** — urgency comes from the merchant's own answers, never manufactured pressure.
- **CCP and Credit Repair are relationship plays, never an opener.**

If the doc's wording would break a rail, keep the meaning but rephrase to comply, and keep the
matching `compliance` "say instead" guidance in `objections.ts` intact.

---

## 6. The gate — the build must pass

From the repo root:

```bash
npm run typecheck && npm run build
```

Both must pass before anything merges or deploys. The type-check verifies every regenerated file
against `src/types/content.ts`; the build bundles it. If either fails, fix the file (usually a
missing comma/quote or a field that doesn't match the type) and re-run. Nothing ships until green.

---

## 7. Deploy — the site is NOT auto-deployed from GitHub

**Important:** the Netlify site is **not linked** to the GitHub repo. Pushing or merging to the
default branch does **not** trigger a deploy. The session must deploy **explicitly** after merging.

- **Site:** `finbiz-operator-console.netlify.app`
- **Site ID:** `14bd8a31-376a-4941-a3f4-06e8c89015db`

Steps:

1. Merge the regenerated files to the default branch.
2. Deploy the freshly built `dist/` to the site above — via the **Netlify MCP** tools or the
   **Netlify CLI** (e.g. `netlify deploy --prod --dir dist --site 14bd8a31-376a-4941-a3f4-06e8c89015db`).
3. **Verify the live bundle:** load `finbiz-operator-console.netlify.app` and confirm the change
   you made from the doc is actually live (e.g. the edited line / number appears). The job isn't
   done until the live site shows it.

> Optional one-time improvement: an account admin can link the repo in the Netlify UI so future
> pushes auto-build. Until that's done, **deploying is a manual step every sync.**

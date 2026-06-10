# Content Map — "To change X, edit this file"

A plain-English cheat sheet. Find the thing you want to change on the left, edit the file and
field on the right. **You only ever touch files in `src/content/`.** You never open a `.tsx` file.

Two ways to make a change (both end up live — see [DAILY-UPDATES.md](DAILY-UPDATES.md)):

- **By hand:** open the `src/content/*.ts` file in GitHub's web editor, change the words inside
  the quotes, commit. Netlify rebuilds and deploys automatically.
- **Via the sync:** edit the Google Doc instead, then run the n8n sync, which rewrites these
  same files for you. See [N8N-SYNC.md](N8N-SYNC.md).

> **Golden rule:** change the words *between the quote marks*. Leave the punctuation around
> them — the commas, braces `{ }`, brackets `[ ]`, and the field names (`says:`, `terms:`) —
> exactly where they are. If you delete a comma or a quote, the build will catch it and refuse
> to ship the broken version (the old one stays live), but it's easier to just not.

---

## At a glance: which Google Doc feeds which file

| Google Doc | Feeds these `src/content/` files |
| --- | --- |
| **Product matrix** | `products.ts`, `mca.ts`, `offer.ts` |
| **Call sheet** | `callFlow.ts`, `triage.ts`, `statements.ts`, `minimumFile.ts`, `pipeline.ts`, `objections.ts`, `followUps.ts`, `finalQa.ts` |
| **Both / global** | `meta.ts` (brand name, the top ticker numbers, the compliance rails, section order) |

---

## The numbers in the top bar (qualify floor, etc.)

**File:** `src/content/meta.ts` → the `ticker` array.
Each entry is one stat chip in the masthead. `k` is the label, `v` is the big value, `sub` is the
small suffix.

```ts
// before
{ k: "Qualify floor", v: "$15K", sub: "/mo" },
// after — raised the floor to $18K
{ k: "Qualify floor", v: "$18K", sub: "/mo" },
```

The four always-on **compliance rail chips** are also in `meta.ts`, in the `rails` array. Change
these only if the actual compliance policy changes.

```ts
rails: [
  "No “guaranteed / approved”",
  "No rate before the file",
  "Factor ≠ APR",
  "No invented urgency",
],
```

The **brand name, tagline, and nav order** are in `meta.ts` too (`brand` object and the `nav`
array). The nav order must match `registry.tsx` — if you only ever edit wording, you won't need
to touch either.

---

## 01 — Call Flow (the live talk track)

**Google Doc:** Call sheet → the call script. **File:** `src/content/callFlow.ts`.

- The numbered beats Ness reads top-to-bottom live in the `beats` array. Each beat has:
  - `label` — the beat name, e.g. `"① Open — own it"`.
  - `says` — the lines she says out loud, one string per line.
  - `cues` — coaching notes (italic, not spoken).
  - `texts` — literal SMS bubbles she sends.
- The two side cards ("All set / already funded", "Light") live in the `branches` array.
- The blue rule band at the top is `rule`.

```ts
// before — a spoken line in the Open beat
says: [
  "Hi [Name], it's Ness at FinBiz Funding. Good time? I'll be straight and quick.",
  ...
]
// after — softened the opener
says: [
  "Hi [Name], Ness here from FinBiz Funding. Catch you at an okay moment?",
  ...
]
```

To **add a line**, add another quoted string to the list (comma after the previous one). To
**remove one**, delete that whole quoted line including its trailing comma.

---

## 02 — Product Matrix

**Google Doc:** Product matrix. **File:** `src/content/products.ts`.

- The big table is the `products` array. Each product has `name`, `bestFit`, `terms`, `speed`,
  and `sayIt` (how to say it / the main caveat).
- The short pitch cards underneath are the `pitches` array (`title`, `say`, `cue`).
- `relationshipNote` and `rails` are the two callout bands at the bottom.

```ts
// before — the MCA row's terms
terms: "Factor rate + total payback (e.g. **$20K × 1.40 = $28K**) · daily/weekly · non-bank, no tax returns",
// after — updated the worked example to 1.35
terms: "Factor rate + total payback (e.g. **$20K × 1.35 = $27K**) · daily/weekly · non-bank, no tax returns",
```

- `tag` (`gold`/`blue`/`teal`/`slate`) is just the row's color label — leave it unless you want a
  recolor.
- `primary: true` marks MCA as the bread-and-butter product; `relationshipPlay: true` marks CCP and
  Credit Repair as "never an opener." Don't flip these without intent.
- **Compliance:** APR language belongs only on the Term Loan row. Keep "factor rate" wording on MCA.

---

## 03 — MCA Structure (rep education, not a live quote)

**Google Doc:** Product matrix → the MCA mechanics. **File:** `src/content/mca.ts`.

- The worked-example stat grid is the `example` array (`k` label, `v` value, `hot: true` to
  highlight the key figures — Factor and Total payback).
- `factorNote` and `whenNote` are the two callouts. `loops` is the "what to keep straight" list.

```ts
// before
example: [
  { k: "Funded", v: "$20,000" },
  { k: "Factor", v: "1.40", hot: true },
  { k: "Total payback", v: "$28,000", hot: true },
  { k: "Term", v: "100 pmts" },
  { k: "Daily", v: "$280" },
],
// after — recomputed example at 1.35 factor
example: [
  { k: "Funded", v: "$20,000" },
  { k: "Factor", v: "1.35", hot: true },
  { k: "Total payback", v: "$27,000", hot: true },
  { k: "Term", v: "100 pmts" },
  { k: "Daily", v: "$270" },
],
```

> If you change one number in the example, **change all the dependent ones** so the math holds
> ($20,000 × 1.35 = $27,000; ÷ 100 = $270/day). The sync's Claude prompt does this automatically;
> by hand, do the arithmetic.

---

## 04 — Triage & Lanes

**Google Doc:** Call sheet → eligibility lanes. **File:** `src/content/triage.ts`.

Three lanes in the `lanes` array — Green/Yellow/Red. Each has `name`, `verdict`, and an `items`
list of bullet criteria. `rule` is the callout at the bottom.

```ts
// before — Green lane bullets
items: ["$20K+ deposits/mo", "12+ months", "570+ credit", ...]
// after — raised Green deposit threshold
items: ["$25K+ deposits/mo", "12+ months", "570+ credit", ...]
```

`tone` (`go`/`amber`/`clay`) is the lane color — leave it.

---

## 05 — Statement Read

**Google Doc:** Call sheet → how to read bank statements. **File:** `src/content/statements.ts`.

A table. `columns` are the headers; `rows` are the lines. Each row's `cells` array fills the
columns left to right. The numbered priority rows have a `no` ("1"–"4") and `emphasize: true`.

```ts
// before
{ no: "1", emphasize: true, cells: ["**Total monthly deposits**", "Real revenue volume", "One-time transfers only"] },
// after — reworded the risk signal
{ no: "1", emphasize: true, cells: ["**Total monthly deposits**", "Real revenue volume", "Mostly one-time transfers"] },
```

`callouts` is the band under the table; `note` (if present) is an extra paragraph.

---

## 06 — Minimum File

**Google Doc:** Call sheet → minimum package to move a file. **File:** `src/content/minimumFile.ts`.

Same table shape as Statement Read. Rows with a `subhead` are section dividers ("Core —
non-negotiable", "Conditional — only when it applies") and have empty `cells: []`.
The `[[double brackets]]` mark a condition inside a cell (e.g. `[[if refinancing]]`).

```ts
// before — a core row
{ cells: ["**3–4 months bank statements**", "Revenue & cash-flow review"] },
// after — asked for 4–6 months
{ cells: ["**4–6 months bank statements**", "Revenue & cash-flow review"] },
```

---

## 07 — Pipeline & Discovery

**Google Doc:** Call sheet → pipeline stages + discovery questions. **File:** `src/content/pipeline.ts`.

- The 12 stages are the `steps` array (`n` number, `title`, `desc`).
- The discovery questions are the `questions` array (`n`, `ask`, `reveals`).
- `settles` is the callout summarizing what discovery settles.

```ts
// before — a discovery question
{ n: "1", ask: "Monthly gross?", reveals: "Revenue capacity" },
// after — made it more specific
{ n: "1", ask: "Average monthly gross deposits?", reveals: "Revenue capacity" },
```

---

## 08 — Objections, Deal Killers & Compliance

**Google Doc:** Call sheet → objections. **File:** `src/content/objections.ts`.

- `objections` — each is a question `q` Ness hears and her `reframe` (optional short `note`).
- `dealKillers` — `issue` + the `move` to make.
- `compliance` — the "don't say / say instead" pairs (`dont`, `say`).

```ts
// before
{ q: "Too expensive.", reframe: "Compared to what? If the money makes you more than it costs, the price answers itself. So what would you do with it if you had it?" },
// after — tightened the reframe
{ q: "Too expensive.", reframe: "Compared to what? If it earns you more than it costs, the price answers itself. What would you do with it?" },
```

> The `compliance` pairs are guardrails. You can reword the "say instead" side, but don't weaken
> it — keep "Approval depends on underwriting," "Factor rate sets total payback; it's not APR," etc.

---

## 09 — Follow-Ups (SMS templates)

**Google Doc:** Call sheet → follow-up texts. **File:** `src/content/followUps.ts`.

The `scenarios` array. Each scenario has a `scenario` name and two `templates`, each with a
`label` and the actual `text` of the SMS.

```ts
// before
{ label: "Recap + ask · SMS", text: "Hey [Name], Ness from FinBiz — good talking just now. Send me 4 months of business bank statements and I'll come back with real numbers. No obligation either way." },
// after — shorter
{ label: "Recap + ask · SMS", text: "Hey [Name], Ness from FinBiz — great talking. Send 4 months of bank statements and I'll come back with real numbers. No obligation." },
```

> Keep "No obligation" in, and never promise an offer or approval before a file exists.
> `[Name]` is a merge placeholder Ness fills in — leave it as literal text.

---

## 10 — Final QA

**Google Doc:** Call sheet → pre-submission checklist. **File:** `src/content/finalQa.ts`.

Same table shape as the other tables. Four emphasized rows (Merchant / Bank Statements /
Existing Debt / Next Step), each a `cells` pair. `callouts` is the rule band; `note` is the
footer paragraph.

```ts
// before — the Bank Statements check
cells: ["**Bank Statements**", "Recent & complete · name matches · deposits, NSFs, negative days, ACH pulls reviewed"],
// after — added "no gaps"
cells: ["**Bank Statements**", "Recent, complete, no gaps · name matches · deposits, NSFs, negative days, ACH pulls reviewed"],
```

---

## 11 — Approved Offer Desk (post-approval only)

**Google Doc:** Product matrix → the approved-offer walkthrough. **File:** `src/content/offer.ts`.

- `gate` is the red "after approval only" warning band — keep its meaning intact.
- `loops` is the list of things to walk the merchant through (`k` label, `v` description).

```ts
// before
{ k: "Total payback", v: "The real obligation — funded × factor, not the funded figure" },
// after
{ k: "Total payback", v: "The real obligation — funded amount times the factor, not the funded figure" },
```

> This desk is used only *after* underwriting approves, with real numbers. Don't turn it into
> something that quotes live on a cold call — that's the whole point of the `gate` band.

---

## Section titles, eyebrows, and intros (any section)

Every file has a `meta` block near the top with the section's header text:

- `eyebrow` — the small mono label above the title (e.g. `"Live"`).
- `title` — the headline. Wrap the word you want highlighted in `{curly braces}`.
- `lead` — the intro paragraph under the title.

```ts
// before
meta: {
  ...
  title: "Call {Flow}",
  lead: "Top to bottom, fast. Your eye lands on the next line, you say it, you shut up. ...",
}
// after — reworded the lead
meta: {
  ...
  title: "Call {Flow}",
  lead: "Top to bottom, fast. Eye lands on the next line, say it, then listen. ...",
}
```

Don't change `id` or `navNo` inside `meta` — those wire the section into the nav and the
registry, and changing them can break the page order.

---

## If something breaks

- The site is built before it ships. A bad edit (missing quote/comma, renamed field) makes
  `npm run build` fail, **Netlify keeps the last good version live**, and you get an email.
- Fastest fix: in Netlify, **Deploys → pick the last good deploy → Publish deploy** to roll back,
  then fix the typo (usually a missing `"` or `,`) and commit again.
- When in doubt, edit the Google Doc and let the sync regenerate the file — it always produces
  valid, type-correct output.

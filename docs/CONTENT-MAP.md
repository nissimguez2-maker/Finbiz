# Content Map — "To change X, edit this file"

A plain-English cheat sheet. Find the thing you want to change on the left, edit the file and
field on the right. **You only ever touch files in `src/content/`.** You never open a `.tsx` file.

How a change reaches the screen (see [DAILY-UPDATES.md](DAILY-UPDATES.md)):

- **The owner updates the FinBiz Master Doc**, then hands it to **Claude Code**, which edits
  the matching `src/content/*.ts` field(s) and commits. Netlify rebuilds and deploys automatically.
- **By hand (small tweak):** open the `src/content/*.ts` file in GitHub's web editor, change the
  words inside the quotes, commit. Same auto-deploy. (Still update the Master Doc so it stays the
  source of truth.)

> **Golden rule:** change the words *between the quote marks*. Leave the punctuation around
> them — the commas, braces `{ }`, brackets `[ ]`, and the field names (`says:`, `terms:`) —
> exactly where they are. If you delete a comma or a quote, the build will catch it and refuse
> to ship the broken version (the old one stays live), but it's easier to just not.

---

## At a glance: which Master Doc part feeds which file

The single **FinBiz Master Doc** has three parts. Each maps to a set of `src/content/` files:

| Master Doc part | Feeds these `src/content/` files |
| --- | --- |
| **BASE** — qualify floor, pipeline, minimum file, statement review, MCA hard gates, risk signals | `meta.ts`, `pipeline.ts` (incl. each stage's `killer`), `minimumFile.ts`, `statements.ts`, `triage.ts`, `mca.ts` (the `hardGates`) |
| **PART 1 — Product Matrix** — products & terms, the routing tree, funder appetite, the multi-entity structuring play, rails | `products.ts`, `mca.ts`, `routing.ts`, `compliance.ts` |
| **PART 2 — Scripts** — the live talk track, Light/Funded branches, the mid-call risk check, posture, written-comms rails | `callFlow.ts`, `objections.ts`, `followUps.ts`, `finalQa.ts`, `compliance.ts` |
| **Global** | `meta.ts` (brand name, the top ticker numbers, the compliance rails, section order) |

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

**Master Doc:** PART 2 — Scripts → the live call script. **File:** `src/content/callFlow.ts`.

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

**Master Doc:** PART 1 — Product Matrix. **File:** `src/content/products.ts`.

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

**Master Doc:** PART 1 → the MCA mechanics + BASE → MCA hard gates. **File:** `src/content/mca.ts`.

- The worked-example stat grid is the `example` array (`k` label, `v` value, `hot: true` to
  highlight the key figures — Factor and Total payback).
- `factorNote` and `whenNote` are the two callouts. `loops` is the "what to keep straight" list.
- **`hardGates`** — the three small checks that actually decide an MCA. Each entry is a `label`
  + `test` (e.g. `{ label: "Deposits", test: "Avg ≥ 3 deposits/mo across the last 3 months" }`).
  `hardGatesNote` is the "two strong months + one thin one" edge-case callout. These mirror the
  Master Doc's BASE → "MCA hard gates" — keep the thresholds (3 deposits, ~4–5 negative days,
  positive ending balance) exact.

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

**Master Doc:** BASE → the qualify floor (and the green-lane numbers). **File:** `src/content/triage.ts`.

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

**Master Doc:** BASE → the 10-point statement review. **File:** `src/content/statements.ts`.

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

**Master Doc:** BASE → the minimum file (collection). **File:** `src/content/minimumFile.ts`.

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

**Master Doc:** BASE → the pipeline (the spine) + Scripts → discovery. **File:** `src/content/pipeline.ts`.

- The 12 stages are the `steps` array (`n` number, `title`, `desc`, and an optional **`killer`**).
- The discovery questions are the `questions` array (`n`, `ask`, `reveals`).
- `settles` is the callout summarizing what discovery settles.

```ts
// before — a discovery question
{ n: "1", ask: "Monthly gross?", reveals: "Revenue capacity" },
// after — made it more specific
{ n: "1", ask: "Average monthly gross deposits?", reveals: "Revenue capacity" },
```

- **`killer`** (optional, per stage) is the thing that ends the deal at that stage — e.g.
  Prospecting's `"Inactive Secretary of State · wrong EIN/SSN · another broker submits first"`.
  Not every stage has one. These come from the Master Doc's per-stage "Killers"; keep them
  verbatim where the doc states them.

---

## 08 — Objections, Deal Killers & Compliance

**Master Doc:** PART 2 — Scripts → Objections (plus BASE → risk signals for the deal-killers). **File:** `src/content/objections.ts`.

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

**Master Doc:** PART 2 — Scripts → the written follow-ups (SMS / email). **File:** `src/content/followUps.ts`.

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

**Master Doc:** BASE → submission (clean, accurate file) + risk signals. **File:** `src/content/finalQa.ts`.

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

## 12 — Routing (the "where does this file go" decision tree)

**Master Doc:** PART 1 → Routing (read this first) + MCA funder appetite + the structuring play.
**File:** `src/content/routing.ts`. *(Reference / Quick Lookup — never quoted verbatim live.)*

- `rule` is the "read first" band (good cash flow → MCA/LOC; good credit 650+ → HELOC/long-term/SBA).
- `branches` — the decision tree. Each entry is `when` (the merchant's situation) → `then` (what to
  lead with), plus a short `note`.
- `appetite` — funder-appetite calls (steady vs. seasonal, Trucking, Texas). Each has a `label`,
  a `verdict`, and a `tone` color.
- `plays` — the multi-entity **structuring** callout. Keep the guardrails intact: name the true
  borrowing entity, accurate ownership, real revenue; never inflate deposits via inter-company
  transfers, never misstate ownership.

```ts
// before — a routing branch
{ when: "Good cash flow", then: "MCA · Line of Credit", note: "Active deposits, credit-flexible, needs speed." },
// after — same shape, reworded note
{ when: "Good cash flow", then: "MCA · Line of Credit", note: "Active deposits, flexible credit, wants speed." },
```

---

## 13 — Compliance (posture + written-comms rails)

**Master Doc:** Scripts → Posture + the written follow-up wording rail; BASE → company facts.
**File:** `src/content/compliance.ts`. *(The always-on framing in Quick Lookup. The verbal
"say instead" pairs and deal-killers live in `objections.ts`, not here.)*

- `posture` is the "how you carry it" band (a peer who happens to be the expert).
- `writtenRails` is the list of hard rails for SMS/email and how you talk about the company.

```ts
// before — a written rail
"No “guaranteed” or “approved” — approval depends on underwriting.",
// after — same rail, tightened
"No “guaranteed/approved” — approval is underwriting's call.",
```

> Two rails are newer and easy to miss — **keep both**: never name a parent/holding entity
> (it's FinBiz / FinBiz Funding only), and **in writing never write the word "MCA" — say
> "funding."** The merchant can call it an MCA; you don't, in text or email.

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
- When in doubt, hand the Master Doc to Claude Code and let it re-edit the file — it preserves
  the data shapes and the compliance rails, and the build still type-checks the result before it ships.

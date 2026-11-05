# Scenario Engine — cybersecu.app

## 1. Purpose

Turns an `Attack` (knowledge) into a playable `Scenario` (pedagogy),
versioned so results stay historically reproducible. See
`DOMAIN_MODEL.md` §2 and §4 for the schema; this document covers the
runtime behavior.

## 2. Publishing workflow

```
draft scenario_version (editable, admin-only, not queryable by the app)
        ↓ admin "publish"
published scenario_version (published_at set; immutable semantics)
        ↓ optional
new draft version N+1 (created by "clone as new version", never by
        editing N in place if the change affects choices/scoring)
```

Enforced by a Postgres trigger/check rather than convention alone: any
`UPDATE` to `choices`, `correct_choice_ids`, `explanations`, or
`difficulty` on a row where `published_at IS NOT NULL` is rejected
(`RAISE EXCEPTION`), forcing the "new version" path from the app layer.
Non-semantic fields (e.g. a typo in `content->>'body'` flavor text) are
allowed to be patched by an explicit admin RPC that writes an
`audit_log` row — not a silent UPDATE.

## 3. Player runtime contract

1. Client requests a scenario to play (`GET /simulations/[slug]` for
   public preview, or the adaptive endpoint for the authenticated
   dashboard flow).
2. Server returns the scenario **without** `correct_choice_ids` or
   `explanations` — the client only ever sees `content` + `choices[].{id,
   label}`. This is a security requirement (SECURITY_MODEL.md §9), not
   just a UX nicety.
3. Client renders the `ScenarioFrame` (message chrome) and
   `DecisionOption` list, always including a "Je ne sais pas" option
   (mandatory per brief §13 — enforced by a non-null check that every
   scenario_version has a `choices` entry with `is_unsure: true`).
4. Client submits `choice_id` to `POST /api/attempts/:id/answer`.
5. Server validates `choice_id` is a real option for that version,
   computes correctness + mistakes, persists, updates the reflex score,
   returns the explanation payload.
6. Client renders `ExplanationPanel` (technique / indicator / why /
   reflex) regardless of correctness — mistakes and correct answers both
   get the full explanation, so the loop teaches even on a correct guess.

## 4. Difficulty model

`difficulty` is an authored integer 1–5 per scenario version, not derived
automatically. Used by the adaptive engine (`LEARNING_ENGINE.md` §3) to
match content to a user's rolling accuracy. No auto-difficulty-tuning
algorithm ships in v1 — that would be exactly the "fake mathematical
sophistication" the brief warns against; difficulty starts as an editorial
judgment, revisited once real attempt-outcome data exists.

## 5. Safety constraint on generated content

Scenario `content` must reference only fictional entities (e.g.
"Banque Fictive", a `.exemple-securise.test`-style non-resolvable domain)
never a real brand, real phone number, or a domain that could resolve to
an actual phishing kit. This is enforced editorially at authoring time
(admin publish checklist) — the schema does not (and cannot) auto-verify
"is this fictional," so this is documented as a required human step in
`docs/decisions/0002-synthetic-content-only.md`.

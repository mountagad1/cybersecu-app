# Learning Engine — cybersecu.app

## 1. Loop

```
scenario → decision → immediate feedback → attack reveal → explanation
→ correct response → micro-lesson → reflex update → adaptive next scenario
```

Implemented as: `POST /api/attempts` creates an `attempts` row
(`scenario_version_id`, `user_id`, `started_at`). `POST
/api/attempts/:id/answer` accepts `choice_id`, looks up the *server-side*
scenario version (never trusts client-claimed correctness), computes
correctness + mistake pattern codes, writes `attempt_decisions` +
`attempt_mistakes`, updates `cyber_reflex_scores` for the attack's primary
dimension, and returns the explanation payload (technique, indicator,
why-dangerous, reflex-for-next-time) that was withheld from the initial
scenario payload.

## 2. Optimization target

The engine optimizes for **behavioral improvement**, not completion count.
Concretely: the dashboard's headline number is the Cyber Reflex score per
dimension (section 6 below), not "scenarios completed." Adaptive selection
(section 3) is weighted toward a user's weak dimensions, not toward
untouched content, so the system keeps serving what a user needs rather
than what maximizes a completion tally.

## 3. Adaptive scenario selection (v1)

```
candidates = published scenario_versions
  where target_profile matches user's profile (or 'general')
  and not attempted in the last N days (freshness)

weight(candidate) = base_weight(difficulty vs user's rolling accuracy)
                   * weakness_boost(user's lowest-scoring dimension match)
                   * variety_penalty(recently seen attack family)

next = weighted_random_choice(candidates, weight)
```

This avoids both failure modes named in the brief: repetitive trapping
(variety penalty) and pure difficulty-matching that ignores known
weaknesses (weakness boost). It is intentionally simple (weighted random,
not a bandit/ML model) for v1 — richer approaches are a documented future
step, not built speculatively now.

**Wiring.** `src/domain/adaptive/selectNext.ts` holds the weighting;
`src/domain/adaptive/learningState.ts` derives the state it consumes from a
caller's graded history (rolling accuracy, dimensions ranked weakest first,
neutral 0.5 accuracy when there is no history at all).
`src/infra/scenarios/nextScenario.ts` assembles both from Supabase and
`GET /api/simulations/next` serves the result to the player, which calls it
once an answer has been graded — so the attempt just recorded is already part
of the history being weighed. It is read-only and uses the read-only session
accessor: asking what to play next must never mint an anonymous session
(`SIMULATION_QUOTA.md` §3).

Selection can legitimately decline: for a `general` profile every scenario
authored for `senior` or `business` weighs zero, and a visitor who has played
everything has no unseen candidate. Declining to *adapt* is not a reason to
leave a dead end, so `suggestNextScenario()` then falls back to the plainest
defensible pick — unattempted first, easiest first — and the player renders
"Toutes les simulations" when even that yields nothing.

## 4. Mistake taxonomy → dimension feedback

Every wrong choice in `scenario_versions.choices[]` is authored with
`mistake_pattern_codes: string[]`. On an incorrect attempt, those codes
are written to `attempt_mistakes`. The dashboard aggregates a user's most
frequent mistake patterns ("vous répondez souvent à l'urgence") — this is
the qualitative, "why" layer the brief requires beyond a bare correct/
incorrect count.

## 5. Cyber Reflex score (implementation of DOMAIN_MODEL.md §6)

`src/domain/scoring/reflexScore.ts` exports a pure function:

```ts
computeDimensionScore(attempts: ScoredAttempt[]): number // 0-100
```

taking the user's attempts for a dimension ordered by recency, applying
the documented weighted/decayed average, with no hidden fudge factors.
Unit-tested with fixtures covering: all-correct, all-wrong, mixed with
recency decay, single-attempt edge case.

## 6. Explanation content model

`scenario_versions.explanations` (JSONB, per choice) holds:
`{ technique, indicator, why_dangerous, reflex }` — matching section 14 of
the brief exactly. Rendered via the shared `ExplanationPanel` component
(never as an intimidating "threat detected" tone — copy guidelines in
section 13 below carry into the actual authored content, e.g. the SMS
smishing scenario shipped in this pass).

## 7. Senior-profile adaptation (data-model support shipped now, UI later)

`scenario_versions.target_profile` and `users.preferred_profile` let the
same attack power both a general-audience scenario version and a
senior-adapted version (simpler vocabulary, same learning objective).
Authoring a senior variant is a content task; the schema already supports
multiple versions of the same scenario differing only in `target_profile`
and `difficulty`. Full senior visual theme is deferred (ARCHITECTURE.md §7).

# Domain Model — cybersecu.app

## 1. Core entities

```
Attack               — a social-engineering / cyber technique (canonical, stable ID)
AttackVector         — how the attack is delivered (SMS, email, phone, web, QR, ...)
Channel               — synonym-narrowed vector used for filtering (kept as attack_vectors.code)
PsychologicalTrigger  — why a victim acts (urgency, authority, fear, ...)
Indicator             — observable evidence of the attack (suspicious domain, ...)
Attack ↔ Trigger      — many-to-many
Attack ↔ Indicator    — many-to-many
Attack ↔ Attack       — related_attacks (many-to-many, self-referential)
Scenario               — pedagogical simulation authored from an Attack
ScenarioVersion        — immutable published snapshot of a Scenario
LearningObjective       — specific behavior/concept a scenario version teaches
ScenarioObjective        — join: which objectives a scenario version covers
UserAttempt              — one user's play-through of one scenario_version
AttemptDecision           — the specific choice made in that attempt
MistakePattern             — catalog of recurring wrong-behavior categories
AttemptMistake              — join: which mistake patterns an attempt exhibited
CyberReflexProfile           — per-user, per-dimension rolling score
CyberReflexDimension           — catalog of trackable skill dimensions
```

Attacks are never a flat table. The graph in section 5 of the master
prompt (`ATTACK → VECTOR/CHANNEL/TARGET/TRIGGER/INDICATOR/OBJECTIVE/
PAYLOAD/MITIGATION/RELATED_ATTACK/SCENARIO`) is modeled as join tables so
new relationship types can be added without breaking existing data.

## 2. Stable ID system

- `attacks.code` — human-stable identifier, immutable once published,
  format `<PREFIX>-000001` (e.g. `SMS-000001`, `PHISH-000002`,
  `PAYMENT-000001`). Prefix chosen from the attack's primary vector/family
  at creation time and **never regenerated from the name** — renaming an
  attack's `name` or `slug` must never change `code`.
- `scenarios.code` — `SCENARIO-000142` (sequence-generated, immutable).
- `scenario_versions` — `(scenario_id, version)` unique; `version` is a
  monotonically increasing integer per scenario, starting at 1. Editing a
  published version's scoring/learning semantics is forbidden by
  application logic (enforced by making `scenario_versions` publish-once:
  once `published_at` is set, only non-semantic fields — e.g. typo fixes
  in flavor text that don't change choices/scoring — may be patched via a
  dedicated admin action that is audit-logged; anything else must create a
  new version).
- `attempts.scenario_version_id` is a hard FK to the exact version played,
  so historical scoring is reproducible even after new versions ship.

## 3. Entity-relationship summary

```
attacks 1—* attack_related (self join)
attacks *—* psychological_triggers  (attack_triggers)
attacks *—* indicators               (attack_indicators)
attacks 1—* scenarios
scenarios 1—* scenario_versions
scenario_versions *—* learning_objectives (scenario_objectives)
scenario_versions 1—* attempts
attempts 1—1 attempt_decision (the choice made, nullable until answered)
attempts *—* mistake_patterns (attempt_mistakes)
users 1—1 cyber_reflex_profile
cyber_reflex_profile 1—* cyber_reflex_scores (one row per dimension)
```

## 4. Scenario genome

A `scenario_versions` row carries the full "genome" as structured columns
+ JSONB for the parts that are inherently variable-shaped (choices,
per-choice explanations), never as a single opaque JSON blob for the
whole scenario — difficulty, channel, attack_id, and target_profile stay
first-class columns because they drive querying (adaptive selection,
analytics) and must be indexable:

```
scenario_versions
  attack_id            fk, not null
  channel               text, not null  (matches attack_vectors.code)
  target_profile         text           (general | senior | business)
  difficulty              int           (1-5)
  impersonated_entity      text
  content                   jsonb        (rendered message: sender, body, UI chrome)
  choices                    jsonb        (array of {id, label, is_recommended})
  correct_choice_ids           text[]
  explanations                   jsonb    (per choice: what/why/technique/reflex)
```

`content`/`choices`/`explanations` are JSONB by necessity (shape varies by
channel — an SMS scenario and a vishing-call scenario render differently)
but every field that participates in filtering, scoring, or adaptive
selection is a real column, not buried in JSON — this is the concrete
rule that keeps this "not a flat table."

## 5. Mistake taxonomy

`mistake_patterns` is a seeded catalog (not user- or admin-free-text), e.g.
`MISSED_SUSPICIOUS_DOMAIN`, `TRUSTED_DISPLAY_NAME`, `RESPONDED_TO_URGENCY`,
`SHARED_MFA_CODE`, etc. (full seed list in the migration). Each attempt
that is answered incorrectly is tagged with 1..n mistake patterns computed
server-side from the scenario version's `choices[].mistake_pattern_codes`
— the mapping between "which wrong choice" and "which mistake pattern(s)"
is authored per-scenario by whoever writes the scenario, not inferred.

## 6. Cyber Reflex scoring (v1, documented formula)

Dimensions (`cyber_reflex_dimensions`, seeded): phishing recognition, SMS
scam recognition, URL verification, identity verification, financial
fraud recognition, social engineering resistance, QR phishing
recognition, deepfake/AI awareness, account security awareness. Each
`attacks` row maps to exactly one primary dimension.

v1 formula (transparent, no fabricated sophistication):

```
score(dimension) = weighted_avg(
  correct ? 1 : 0,
  weight = difficulty_of_attempt,
  decayed by recency: weight *= 0.9 ^ (attempts_since / 10)
)
```

capped to a 0–100 display scale. This is intentionally simple for v1;
section 9 of the master prompt's richer factors (confidence, time-to-
decision, trigger-specific weakness) are deferred and tracked in
`docs/decisions/0003-reflex-scoring-v1.md`.

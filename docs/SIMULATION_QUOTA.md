# Simulation Quota (10 free)

## 1. Rule

Every anonymous session (or, in the future, signed-in user without an
entitlement) gets 10 free **completed** simulations before the paywall
appears. Starting a simulation does not consume a credit — only a
graded, answered attempt does. This matches the brief exactly ("Simply
opening a simulation should not necessarily consume a credit").

## 2. Server-authoritative counting

```
simulation_usage
  id                    uuid primary key
  anonymous_session_id  uuid references anonymous_sessions, nullable
  user_id               uuid references auth.users, nullable
  attempt_id            uuid references attempts, unique
  created_at            timestamptz
  check (anonymous_session_id is not null) != (user_id is not null)
```

One row per **answered** attempt. The count consumed by a session is
`select count(*) from simulation_usage where anonymous_session_id = $1`
— always computed server-side, in the same Route Handler transaction
that grades the attempt, never trusted from a client-sent counter or
localStorage value. `src/domain/quota/checkQuota.ts` is a pure function
(`usedCount, limit) => { remaining, exhausted }`) so the arithmetic is
unit-tested independent of the database.

## 3. Enforcement point

`POST /api/attempts/[id]/answer` (the same endpoint that already grades
every attempt) now:
1. Verifies the caller has either a valid Supabase Auth session or a
   valid anonymous session cookie.
2. If anonymous: checks whether the session already has an active
   entitlement (skip quota entirely — see `PAYMENT_ENTITLEMENT.md`) or,
   if not, whether `used < limit`. Rejects with `402`-style
   application error (not literal HTTP 402, see below) if the quota is
   already exhausted, **before** grading — a user can't "sneak in" an
   11th free answer by racing the request.
3. Grades the attempt (unchanged logic) and inserts the
   `simulation_usage` row in the same server action, so usage count and
   the graded attempt can never drift apart.

`GET /api/quota` returns `{ used, limit, remaining, hasEntitlement }` for
the current caller (anonymous session or signed-in), used by the UI
progress indicator and to decide whether to show the paywall before
even starting a new simulation.

## 4. UI

- `QuotaIndicator` shows "7 / 10 simulations gratuites utilisées" —
  factual, not a countdown timer, no urgency styling (brief: "Avoid
  aggressive countdowns").
- Before the last free simulation there's no special warning beyond the
  indicator itself already reading "9 / 10" — the number communicates it.
- After the 10th completed simulation, the next simulation attempt shows
  the `Paywall` component instead of the scenario (see
  `PAYMENT_ENTITLEMENT.md` §3) rather than a dead end.

## 5. Abuse resistance (v1)

Clearing cookies resets quota by design in v1 — that's an accepted cost
of true no-login (there is no device fingerprinting, which the brief
explicitly discourages as a privacy-invasive pattern). Mitigations kept
proportionate rather than adversarial:
- The anonymous session cookie is httpOnly + signed, so it can't be
  edited client-side to claim a different (already-purchased) session's
  entitlement.
- A soft per-IP rate limit on **session creation** (not on gameplay) is
  documented as a follow-up once real abuse is observed — building it
  speculatively now would be exactly the "fake mathematical
  sophistication" / premature-optimization pattern the broader project
  brief warns against elsewhere.

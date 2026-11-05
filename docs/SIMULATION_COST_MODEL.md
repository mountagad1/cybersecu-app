# Voice simulation cost model

A voice call costs real money per second it runs — LLM tokens, TTS, STT,
and Dograh's own usage-based cloud pricing all accrue continuously,
unlike a text simulation's flat cost per request. This document is the
gate: what has to exist before a real voice session can run against a
live Dograh account, matching the brief's own instruction not to allow
"unlimited unmetered voice sessions before the economic model has been
validated."

## Where this stands today

`getEmbedSession()` returns `null` for every scenario — no
`dograhEmbedToken` exists anywhere (`docs/decisions/0008` §6). There is
no live endpoint to spend money against yet, so nothing below is urgent
in the sense of stopping an active leak. It is a precondition list for
turning voice on, not a response to an incident.

## 1. One voice attempt = one quota unit, same rule as text

The brief is explicit: *"A phone simulation counts as a simulation."*
The existing quota (`docs/SIMULATION_QUOTA.md`) already enforces this for
text: 10 free graded attempts, then the €29 entitlement
(`docs/PAYMENT_ENTITLEMENT.md`), counted server-side from a `simulation_usage`
row written in the same transaction that grades the attempt.

`POST /api/voice-simulations/{slug}/session` already checks
`canConsumeQuota()` before handing out a session — a quota-exhausted,
unentitled visitor is refused today, exactly like a text attempt. What it
does **not** yet do is write a `simulation_usage` row, because
`simulation_usage.attempt_id` is a `not null` foreign key into `attempts`,
and a voice run has no corresponding `attempts` row — voice scenarios
aren't in `src/content/simulations`' catalogue, by design
(`docs/decisions/0008` §3). **This is a real gap**: today, the read-side
gate is enforced (no session past the limit), but a session that *is*
granted is never counted against future limits. Closing it needs a small,
explicit migration — either a nullable `scenario_version_id` plus a new
`voice_scenario_slug` column on `attempts`, or a parallel
`voice_attempts` table mirroring its shape — written and reviewed once
there's a real account to test the whole path against, not speculatively
now.

**Until that migration exists, a `dograhEmbedToken` must not be set in
production.** Turning voice on before usage accounting works would let
every visitor — including ones already past their free quota on text —
take unlimited free voice calls, which are the most expensive thing on
the site.

## 2. Session duration cap

Dograh's `agentNode` supports `wait_for_user_response_timeout` per stage
and the platform enforces its own session limits, but neither has been
tuned for this project's scenarios. Before activation: pick a maximum
call duration (a `faux-conseiller-bancaire` call has no legitimate reason
to run past a few minutes — the `conclusion` stage exists specifically
to end it) and enforce it two ways: the compiled workflow's `endCall`
routing, and a client-side hard stop in `VoicePlayer` that calls
`window.DograhWidget.end()` if a call somehow runs past the cap, as a
backstop against a stuck or looping conversation.

## 3. Cost tracking

`VoiceRunRecord.costUsdCents` is already read from Dograh's `cost_info`
field (`src/infra/voice/dograh/provider.ts`) — the plumbing exists. What
doesn't exist is anywhere that value gets stored or aggregated once a
run is fetched; today it's discarded after computing the pass/fail
verdict. Before real volume: persist it (same migration as §1, one more
column) and add a simple daily-cost check — Dograh's own
`GET /organizations/usage/current-period` and
`GET /organizations/usage/daily-breakdown` (verified in the OpenAPI spec)
are the source of truth if a second opinion independent of our own
counting is ever wanted.

## 4. Abuse protection

Rate limiting and per-visitor concurrency limits for voice specifically
are not implemented — see `docs/VOICE_SECURITY.md` §Abuse surface. The
quota check already limits total attempts per identity; what's missing
is a limit on *concurrent* sessions (nothing stops one visitor from
opening the widget in ten tabs before the first call's usage row would
even be written, once §1 is fixed) and on request rate to
`POST /api/voice-simulations/{slug}/session` itself. Both are ordinary
API rate-limiting, not voice-specific engineering, and can be added at
the route layer whenever this is closer to activation.

## Summary: what must be true before setting a real `dograhEmbedToken`

1. The usage-accounting migration (§1) is written, reviewed, and live.
2. A session duration cap is enforced in the compiled workflow and as a
   client-side backstop (§2).
3. Cost is persisted per run, not just computed and discarded (§3).
4. Basic rate limiting exists on the session-creation route (§4).

None of these are hard problems. None of them are done, because doing
them against a feature with zero live callers would be exactly the kind
of premature investment this project avoids elsewhere
(`docs/decisions/0008` §1).

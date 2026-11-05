# 0008 — Voice simulations, via a provider-abstracted Dograh adapter, browser-only for now

**Status:** Accepted — architecture and abstraction implemented; not yet
activated (no Dograh account exists for this project)
**Date:** 2026-09-03

## Context

The site's text simulations (`src/content/simulations`) work for channels
where the attack itself is text: an SMS, an email, a fake web page. Several
canonical attacks are fundamentally spoken — `faux-conseiller-bancaire`,
`faux-support-technique`, `faux-agent-administratif`, `clonage-vocal` — and a
multiple-choice quiz can describe what a caller said, but can't reproduce
the thing that actually defeats people: interruption, tone, and the
real-time pressure of having to decide while someone keeps talking.

A request came in to add voice-call simulations, using
[Dograh](https://github.com/dograh-hq/dograh) — an open-source,
self-hostable voice-agent platform (BSD-2-Clause) — as the voice engine.
The request came with an explicit instruction not to invent Dograh's API:
inspect the real repository first. That research (against a shallow clone
of `dograh-hq/dograh` at commit `592b4ac`) is what this decision rests on.

## What Dograh actually is

Not a small API to call from a serverless function. It's a full platform:
a Python/FastAPI backend, Postgres, Redis, and MinIO (or S3), a Next.js
dashboard, and media workers (Pipecat) that speak WebRTC to a browser or
SIP/PSTN to a telephony provider (Twilio, Vonage, Telnyx, Plivo, Vobiz,
Cloudonix, Asterisk ARI). Self-hosting it (`DEPLOYMENT_MODE=oss`) means
running that entire Docker Compose stack somewhere that stays up — a VPS
or a container platform, not Vercel, which has no facility to run a
stateful always-on service. The alternative is Dograh's managed cloud
(`app.dograh.com`), authenticated with an org-scoped `X-API-Key`.

A voice agent in Dograh is a **workflow**: a graph of nodes
(`startCall`, `agentNode`, `trigger`, `webhook`, `qa`, `endCall`) connected
by edges whose `condition` field is natural language the LLM evaluates to
decide which edge fires. Each `agentNode` carries an LLM system prompt and,
optionally, `extraction_variables` — typed (`string`/`number`/`boolean`)
values the LLM pulls out of the conversation and returns as structured
data, without an extra call. A workflow can be driven three ways relevant
here:

- **Outbound PSTN call** (`POST /public/agent/{uuid}` or
  `/public/agent/workflow/{workflow_uuid}`) — Dograh calls a real phone
  number.
- **Browser voice, embedded** — `POST /workflow/{id}/embed-token` mints a
  token (server-side, needs the API key) that a `<script>` on any
  whitelisted domain loads to expose `window.DograhWidget`, with a
  **Headless** mode that renders no UI of its own: `start()`, `end()`,
  `onStatusChange()`, `onCallConnected()`, `onError()`. This is exactly
  Vapi/Retell-style browser voice via WebRTC — no phone number, no
  telephony billing, no PSTN compliance surface.
- **Text chat**, over the same workflow definition
  (`POST /workflow/{id}/text-chat/sessions`) — a second modality Dograh
  runs against the identical node graph, which is a plausible accessible
  fallback, though this decision uses the site's own existing text engine
  for that instead (see below).

A finished run exposes `recording_url`, `transcript_url`, `gathered_context`
(the extracted variables), and `cost_info` via
`GET /workflow/{id}/runs/{run_id}`, and can additionally push a webhook on
completion with the same fields, authenticated by a credential you
configure on the `webhook` node (API key, bearer token, or basic auth —
Dograh does not sign payloads with an HMAC, so "verifying" a Dograh
webhook means checking that shared credential, not a cryptographic
signature).

## Decisions

**1. Dograh Cloud, not self-hosted — for now.** Self-hosting commits to a
new always-on stack (Postgres + Redis + MinIO + Python workers) that this
project has no operational home for today; the entire rest of
cybersecu.app is static-first plus Supabase plus Stripe with zero servers
to keep up. Standing that up is a real decision with real ongoing cost and
ops burden, and it shouldn't be made implicitly by an integration PR. If
voice simulations prove worth it, self-hosting is a later, separate
decision — Dograh's BSD license and portable API mean nothing here is
locked into the cloud choice.

**2. Browser voice (the embed widget), not PSTN telephony.** A real phone
number adds telephony provider billing, call routing, and a compliance
surface (recording consent, outbound-calling regulations) that a
`faux-conseiller-bancaire` simulation does not need to teach its lesson.
The embed widget's Headless mode gives a WebRTC call inside our own page,
under our own UI, for the cost of one script tag. This can expand to real
telephony later if the product decision to do so gets made deliberately
— see §23/§33 of the brief that requested this work, which independently
argued the same thing.

**3. Our content stays the source of truth; Dograh is a compile target.**
Every other simulation on this site is a git-reviewed TypeScript object in
`src/content`. A voice scenario authored only in Dograh's dashboard would
break that: the canonical definition would live in a third party's
database, unreviewable in a PR diff. Instead, `src/content/voice-simulations`
holds a `VoiceScenarioDefinition` — our own shape, close to the
`GREETING → CLAIMED_IDENTITY → PROBLEM → URGENCY → REQUEST → ADAPT →
CONCLUSION` state machine the brief asked for — and
`src/infra/voice/dograh/compileWorkflow.ts` translates it into the
`{nodes, edges}` JSON Dograh's `POST /workflow/create/definition` accepts.
Dograh remains the runtime that speaks and listens; it never decides what
the lesson is.

**4. Evaluation stays deterministic, not LLM-judged.** Dograh's `qa` node
runs a free-text LLM judgment over the finished call, which is not what
`docs/VOICE_SECURITY.md`'s prohibition on the LLM "determining the
learning objective" wants. Instead, each `agentNode` in the compiled
workflow declares boolean `extraction_variables` — `revealed_otp`,
`agreed_to_transfer_money`, `verified_caller_independently`, matching the
existing `MistakePatternCode` vocabulary the text engine already scores
against — and our own code in `src/domain/voice/evaluate.ts` computes the
verdict from those booleans exactly the way `src/domain/mistakes/classify.ts`
already does for text answers. The LLM extracts signals; it never grades.

**5. Everything is built provider-first.** `VoiceSimulationProvider`
(`src/domain/voice/provider.ts`) is the interface the rest of the app
depends on; `DograhVoiceProvider` is the only implementation today. Swapping
providers, or adding a second one, touches one file. No component or route
imports `@dograh/*` directly.

**6. This is not yet activated.** No Dograh account exists for this
project, so there is no `DOGRAH_API_KEY`, no workflow has been created in
a real Dograh instance, and no embed token exists. The code added here
follows the same pattern as `STRIPE_SECRET_KEY`
(`src/lib/env/registry.ts`): absent means the feature 503s cleanly and the
page falls back to the text simulation, exactly like `/api/checkout`
already does when Stripe isn't configured. Turning voice on is a config
change — create a Dograh Cloud account, create one workflow per voice
scenario (via `compileWorkflow` + `POST /workflow/create/definition`),
mint its embed token, set the environment variables — not a code change.

## Consequences

- No new always-on infrastructure was introduced. The build, the tests,
  and every existing page are unaffected by Dograh's absence.
- The `faux-conseiller-bancaire` voice scenario in this PR is content, not
  a working feature: `dograhWorkflowUuid: null` until someone with access
  to a Dograh account runs the sync step described in
  `docs/DOGRAH_INTEGRATION.md` and fills it in.
- Voice sessions are meaningfully more expensive than a static page view.
  `docs/SIMULATION_COST_MODEL.md` sets the caps (session duration, one
  simulation-quota unit per attempt, same entitlement gate as text) before
  any real session can run against a live account.
- The family-10 caution already established for text simulations
  (`docs/CONTENT_TAXONOMY_PLAN.md` §12 quater and the `noSimulationReason`
  fiches) applies at least as strongly to voice: nothing in family 10 gets
  a voice scenario in this change, and any future one needs the same
  deliberate, non-batched review `sextorsion` got.

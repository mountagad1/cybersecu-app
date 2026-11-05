# Voice simulation security

This is the voice-specific extension of the rules already established
for the whole site — see `docs/SECURITY_MODEL.md` and the brief's
`ANTI_HALLUCINATION`/fiction requirements that every text fiche already
follows. Nothing here relaxes those; a few points below are strictly
harder for voice, because a live conversation can drift somewhere a
fixed multiple-choice question cannot.

## Never real credentials, never a real target

Every scenario:

- impersonates a **fictional** organization only (`impersonatedEntity`
  never names a real bank, agency, or company — the same rule
  `docs/decisions/0002-synthetic-content-only.md` already sets for text
  content and for `.test`-domain simulations);
- must never obtain, request, or accept a real password, banking
  credential, one-time code, payment credential, or identity document —
  a scenario's `signals` exist to *detect* whether the visitor gave one
  up, never to *collect* it, and nothing downstream stores what a
  visitor said as a persistent credential;
- never initiates a real financial transaction or any action with a
  real-world effect.

`revealed_otp` in the example scenario
(`src/content/voice-simulations/faux-conseiller-bancaire.ts`) is scored
as a **mistake**, not logged as a captured secret — the point is to
notice the moment it would have been given away, not to record it.

## Labeled as a simulation, at every layer

`VoicePlayer` renders "🎙️ Simulation pédagogique — appel synthétique,
aucune donnée réelle n'est collectée" above the call button, always
visible before the call starts — never only in a footnote. The scenario
prompt itself (`stages[].prompt`) never instructs the persona to break
character and say "this is a simulation" *during* the call — that
would defeat the exercise — but the conclusion stage always ends the call
cleanly, and the debrief happens on the page immediately after, the same
place the text engine's `ExplanationPanel` already lives.

## Webhook "verification" is a shared credential, not a signature

Dograh does not cryptographically sign webhook payloads (verified: no
HMAC or signing key is documented anywhere in
`docs/developer/webhooks.mdx`). If a webhook receiver is ever added here,
"verifying" a Dograh webhook means checking the shared `API_KEY`,
`BEARER_TOKEN`, or `BASIC_AUTH` credential configured on that specific
webhook node — the same credential model `docs/developer/webhooks.mdx`
documents, nothing stronger invented on our side. No webhook receiver
exists in this codebase yet; this integration reads run results by
polling `GET /workflow/{id}/runs/{run_id}` instead
(`docs/DOGRAH_INTEGRATION.md` §4 step 6), which sidesteps needing one for
now.

## Family 10 caution applies, at least as strongly

None of family 10 (chantage et harcèlement) gets a voice scenario in this
change. The same reasoning that kept `sextorsion` out of the text-lot
batch (`docs/CONTENT_TAXONOMY_PLAN.md` §12 quater, and the sextorsion
`noSimulationReason` itself) applies harder to voice: a live, adaptive
conversation is a much closer simulation of the actual manipulation than
a fixed multiple-choice question, which is exactly the property that
makes it unsuitable for anything in that family. Any future voice
scenario touching family 10 needs the same deliberate, single-fiche
review sextorsion got — never a batch.

## The embed token is domain-whitelisted, not a secret

`dograhEmbedToken` (once one exists) is safe to expose to the browser by
Dograh's own design — it's scoped to one workflow and restricted to an
**Allowed Domains** list configured in the Dograh dashboard, verified in
`docs/voice-agent/add-to-website.mdx`. Committing it to this public
repository is intentional, not an oversight: it's closer to a public
client id than a secret. `DOGRAH_API_KEY` is the actual secret — it can
mint or revoke that token, and every workflow's run history — and stays
server-only, in the `voice` environment group alongside
`STRIPE_SECRET_KEY`'s equivalent handling
(`src/lib/env/registry.ts`), never `NEXT_PUBLIC_`-prefixed.

## Abuse surface this integration does not yet close

Rate limiting, per-visitor concurrency limits, and anonymous-session
abuse monitoring for voice sessions specifically are not implemented —
they don't need to be yet, because `getEmbedSession()` always returns
`null` until a real token exists (`docs/decisions/0008` §6), so there is
no live endpoint to abuse today. `docs/SIMULATION_COST_MODEL.md` lists
what has to be true before that changes.

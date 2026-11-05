# Voice simulation privacy

## What Dograh retains, by default

A finished run exposes `recording_url` and `transcript_url`
(`GET /workflow/{id}/runs/{run_id}`, verified in
`docs/api-reference/runs/get-run.mdx`) — an audio recording and a text
transcript of the call, stored on Dograh's side (MinIO/S3, self-hosted;
Dograh Cloud's own storage on the managed plan) until deleted. Nothing
in the OSS docs describes a default retention period for cloud-hosted
recordings; that has to be confirmed against Dograh Cloud's own terms
before any real call happens against a live account, not assumed here.

## What this integration reads, and what it doesn't

`evaluateVoiceRun()` (`src/domain/voice/evaluate.ts`) only ever reads
`gathered_context` — the small set of typed signals a scenario declares
(`revealed_otp`, `verified_caller_independently`, ...). It never reads
`recording_url` or `transcript_url`. `DograhVoiceProvider.getRun()`
(`src/infra/voice/dograh/provider.ts`) does pass both fields through in
`VoiceRunRecord`, because a future results page may want to offer a
visitor their own transcript back — that's a UI decision not made yet,
not an automatic behavior. Nothing in this codebase downloads, re-hosts,
or persists a recording or transcript into our own database or logs.

This matches the brief's own preference directly: *"Prefer transcript +
behavioral evaluation over permanent raw audio storage unless audio
storage provides clear product value."* The evaluation this site actually
needs — did the visitor give up a code, did they verify independently —
comes entirely from `gathered_context`. No feature here has needed the
recording or the transcript yet.

## What we store ourselves

Nothing, today. No database table exists for voice attempts or voice
runs (see `docs/SIMULATION_COST_MODEL.md` — this is the same gap that
blocks usage accounting). When one is added, it should hold exactly what
the text `attempts` table holds for a text attempt: which scenario, which
signals came back safe or unsafe, a timestamp — never a copy of the
recording or transcript URL beyond what's needed to let a visitor
re-open their own result once, if that feature is ever built.

## Before any real audio storage decision is made

If a future feature does need to keep recordings or transcripts (e.g. a
"listen back to your call" result screen), define, in an update to this
document, before shipping it:

- **Retention** — how long, and why that long.
- **Encryption** — at rest, and who holds the keys (Dograh's, if using
  their storage; ours, if re-hosted).
- **Deletion** — an actual mechanism a visitor or an operator can trigger,
  not just a stated policy.
- **Notice** — the visitor sees, before the call starts, that a recording
  will be kept and for how long — this is stronger than the existing
  "🎙️ Simulation pédagogique" label, which says the call is synthetic
  but doesn't currently promise anything about what happens to it
  afterward.
- **Access controls** — who inside this project can retrieve a specific
  visitor's recording, and through what audited path.

None of this is needed today because no recording or transcript is ever
requested by any code in this repository. It becomes needed the moment
that stops being true.

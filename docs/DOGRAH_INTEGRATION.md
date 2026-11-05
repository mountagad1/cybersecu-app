# Dograh integration

Everything below is verified against a shallow clone of `dograh-hq/dograh`
at commit `592b4ac` (README, `docs/api-reference`, `docs/voice-agent`,
`docs/developer`, `docs/api-reference/openapi.json`) — not assumed. Where
this document says an endpoint or field exists, it exists in that source.
See `docs/decisions/0008-voice-simulations-via-dograh.md` for why the
choices below were made, not just what they are.

## 1. What Dograh is, concretely

An open-source (BSD-2-Clause), self-hostable voice-agent platform: a
Python/FastAPI backend, Postgres, Redis, MinIO/S3, a Next.js dashboard, and
media workers (Pipecat) that bridge to a browser over WebRTC or to a
telephony provider (Twilio, Vonage, Telnyx, Plivo, Vobiz, Cloudonix,
Asterisk ARI) over SIP/PSTN. Self-hosting (`DEPLOYMENT_MODE=oss`) means
running that whole stack somewhere that stays up — not Vercel. The
alternative, used here, is Dograh's managed cloud at `app.dograh.com`,
authenticated with an org-scoped `X-API-Key`.

A **workflow** is the unit of everything: a graph of nodes
(`startCall`, `agentNode`, `trigger`, `webhook`, `qa`, `endCall`)
connected by edges. Each `agentNode` carries an LLM system prompt in
`data.prompt` and, optionally, `data.extraction_variables` — typed
(`string`/`number`/`boolean`) values the LLM extracts from the
conversation as it goes. An edge's `data.condition` is natural language
the LLM evaluates to decide whether that edge fires.

## 2. Two deployment modes, one choice made here

| | Self-hosted (OSS) | Dograh Cloud |
|---|---|---|
| Infrastructure | Docker Compose: Postgres, Redis, MinIO, backend, workers | None — Dograh's |
| Auth | `OSS_JWT_SECRET`, local email/password | Org `X-API-Key` |
| Cost model | Free (your infra bill) | Usage-based |
| Fits this project's Vercel-only hosting | No | Yes |

**This project uses Dograh Cloud**, once a real account exists — see
§6. Nothing here builds toward the self-hosted mode.

## 3. Two ways to run a workflow, one choice made here

- **Outbound PSTN** — `POST /public/agent/{trigger_uuid}` or
  `POST /public/agent/workflow/{workflow_uuid}`. Dograh dials a real phone
  number. Not used here (docs/decisions/0008 §2).
- **Browser voice, via the embed widget** — the path this project uses.
  See §4.

Both share the same underlying workflow definition; only how a run gets
started differs.

## 4. The embed widget flow, end to end

1. **Author** the scenario in git as a `VoiceScenarioDefinition`
   (`src/content/voice-simulations/*.ts`).
2. **Compile** it: `compileWorkflow()` (`src/infra/voice/dograh/compileWorkflow.ts`)
   turns it into Dograh's `{nodes, edges}` JSON. `validateCompiledWorkflow()`
   checks the same rules Dograh's server enforces (exactly one `startCall`,
   no dangling edge, every non-`endCall`/`webhook`/`qa` node has a prompt)
   before anything is sent anywhere.
3. **Sync** (one-time, manual, needs `DOGRAH_API_KEY`): a person with
   access to the Dograh account runs
   `POST /workflow/create/definition` with the compiled JSON, then
   `POST /workflow/{workflow_id}/embed-token` to mint that workflow's one
   embed token. Both `workflow_id` (the integer Dograh assigns) and the
   token get copied back into the scenario's `dograhWorkflowId` /
   `dograhEmbedToken` fields in git. **No sync script exists in this
   repository yet** — writing one is follow-up work once an account
   exists to test it against; §7 lists exactly what it would do.
4. **Serve.** `/simulations/voix/{slug}` is a static page. On click,
   `VoicePlayer` calls `POST /api/voice-simulations/{slug}/session`
   (our own route — checks quota/entitlement, reads the token straight
   from content, no live Dograh call). It gets back `{embedToken, widgetOrigin}`
   and injects `<script src="{widgetOrigin}/dograh-widget.js?token=...">`
   from inside the click handler (browsers refuse microphone access to a
   script-initiated call otherwise — verified in
   `docs/voice-agent/add-to-website.mdx`).
5. **Talk.** The loaded script exposes `window.DograhWidget` (Headless
   mode: no UI of its own).
   `start()`/`end()`/`onStatusChange()`/`onCallConnected()`/
   `onCallDisconnected()`/`onError()` are the verified surface —
   see `add-to-website.mdx` for the full table.
6. **Grade.** `onCallDisconnected` fires with `{ workflowRunId }`.
   `VoicePlayer` calls `GET /api/voice-simulations/{slug}/runs/{runId}`
   (our route), which calls
   `GET /workflow/{workflow_id}/runs/{run_id}` (needs `DOGRAH_API_KEY`,
   this call IS live), reads `gathered_context`, and runs
   `evaluateVoiceRun()` (`src/domain/voice/evaluate.ts`) — deterministic
   grading against each `VoiceSignalDefinition.safeValue`, never Dograh's
   own `qa` node verdict (docs/decisions/0008 §4).

## 5. Verified field/endpoint reference used by this integration

| What | Verb + path | Notes |
|---|---|---|
| Create a workflow from JSON | `POST /workflow/create/definition` | Body: `{name, workflow_definition: {nodes, edges}}` |
| Mint/refresh a workflow's embed token | `POST /workflow/{workflow_id}/embed-token` | One active token per workflow; needs `X-API-Key` |
| Fetch a run | `GET /workflow/{workflow_id}/runs/{run_id}` | Returns `status`, `gathered_context`, `recording_url`, `transcript_url`, `cost_info` |
| Health check | `GET /health` | Useful for an ops dashboard later — not called by this integration |
| Widget script | `{widgetOrigin}/dograh-widget.js?token=...` | Loaded client-side, exposes `window.DograhWidget` |

`workflow_id` (an integer, internal) and the public workflow UUID used by
the outbound-call routes are **different identifiers** — this integration
only ever needs the integer id, because it never calls the outbound-call
routes.

## 6. Environment variables

| Variable | Required | Used by |
|---|---|---|
| `DOGRAH_API_KEY` | No — voice degrades cleanly without it | The (not-yet-written) sync script, and `GET /workflow/{id}/runs/{run_id}` at runtime |
| `DOGRAH_BASE_URL` | No, defaults to `https://app.dograh.com` | Both of the above, plus the widget script origin handed to the client |

Neither is set anywhere today. **No Dograh account exists for this
project.** Setting them, and filling in a scenario's `dograhWorkflowId` /
`dograhEmbedToken`, is what "activating voice" means — see
`docs/decisions/0008` §6.

## 7. What's not built yet (explicitly, not by omission)

- **The sync script.** `compileWorkflow()` + `validateCompiledWorkflow()`
  exist and are tested; the script that calls
  `POST /workflow/create/definition` and
  `POST /workflow/{id}/embed-token` against a real account does not,
  because there is no account to test it against. Writing it is the
  first thing to do once one exists.
- **Usage accounting.** See `docs/SIMULATION_COST_MODEL.md` — a real
  migration is needed before a voice attempt can count against the same
  quota a text attempt does, and that migration is deliberately not
  written yet either.
- **Text-chat fallback via Dograh.** Dograh's own
  `POST /workflow/{id}/text-chat/sessions` runs the identical workflow as
  text, which could serve as the accessible fallback the brief asked for.
  This integration uses the site's own existing text simulation for that
  instead (when one exists for the same attack) — one fewer moving part,
  and it's already built, tested, and live.
- **Telephony.** Not evaluated beyond confirming it exists in Dograh; see
  `docs/decisions/0008` §2 for why.

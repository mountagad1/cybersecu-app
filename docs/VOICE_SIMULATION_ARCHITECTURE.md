# Voice simulation architecture

How a spoken attack becomes a page, and why the pieces are split the way
they are. Read `docs/SCENARIO_ENGINE.md` first for the text engine this
extends, and `docs/decisions/0008-voice-simulations-via-dograh.md` for the
decisions this document assumes. `docs/DOGRAH_INTEGRATION.md` covers the
Dograh-specific half of this in detail; this document covers the half
that has nothing to do with Dograh and would survive swapping it out.

## Layering

```
src/content/voice-simulations/       ← authored scenarios (git, reviewed)
        │  VoiceScenarioDefinition
        ▼
src/domain/voice/
  types.ts        the shape above, provider-agnostic
  evaluate.ts      pure grading: signals → verdict
  provider.ts      VoiceSimulationProvider interface
        │
        ▼
src/infra/voice/dograh/              ← the ONLY provider today
  client.ts            authenticated fetch wrapper
  compileWorkflow.ts   definition → Dograh {nodes, edges}
  provider.ts           implements VoiceSimulationProvider
        │
        ▼
src/app/api/voice-simulations/...    ← routes, quota/entitlement gate
src/components/voice/voice-player.tsx ← client, drives window.DograhWidget
src/app/(marketing)/simulations/voix/[slug]/page.tsx
```

Nothing outside `src/infra/voice/dograh` imports a Dograh-specific type.
A second provider — or a stub used in tests — implements
`VoiceSimulationProvider` and nothing above it changes.

## The state machine

A scenario is a sequence of `VoiceStage`s: `greeting → claimed_identity →
problem → urgency → request → adapt → conclusion`. Each stage is an LLM
prompt (how the caller behaves at that point) plus a set of
`transitions`: natural-language conditions, evaluated by the LLM at
runtime, that pick the next stage.

This is deliberately **not** free-form generation. The brief that
requested this integration was explicit: *"Do not rely entirely on
free-form LLM generation. The learning objective must remain controlled."*
The LLM's job is phrasing and adapting *within* a stage — never deciding
what stage comes next in a way this file doesn't already describe, and
never deciding whether a response was safe. Those two things are:

- **Which stage is next** — the `transitions` map, authored in git,
  compiled verbatim into Dograh's edge `condition` fields
  (`compileWorkflow.ts`).
- **Was the response safe** — `evaluate.ts`, described below.

## Evaluation is deterministic, not LLM-judged

Each scenario declares `signals`: named, typed values
(`revealed_otp: boolean`, `verified_caller_independently: boolean`, ...)
that map directly onto the brief's own example evaluation questions
("Did the user reveal an OTP? Did the user independently verify the
caller?"). Dograh's LLM extracts these as structured data during the call
(`extraction_variables` on each node) — it notices and reports, the same
way a text simulation's LLM never existed at all because the choices were
already enumerated.

After the call, `evaluateVoiceRun()` compares each signal's observed
value against its `safeValue` and computes `passed` — pure arithmetic, no
model call, testable without any live service
(`src/domain/voice/evaluate.test.ts`). A signal missing from
`gathered_context` fails safe (`safe: false`), never passes by default:
an untyped third-party payload that didn't come back as expected must
never silently read as "everything was fine."

Every `mistakePattern` a voice signal declares reuses the same
`MistakePatternCode` vocabulary the text engine already scores against
(`src/domain/scenario/types.ts`), so a visitor's weakest dimension is
computed the same way regardless of which channel taught it — the
adaptive selector (`docs/LEARNING_ENGINE.md`) doesn't need to know voice
exists.

## Fallback is structural, not a special case

`getEmbedSession()` never throws and never blocks on Dograh being up: it
reads whether `dograhEmbedToken` is set on the content, full stop. A
scenario with no token returns `null`, the API route returns a 503 with a
message telling the visitor to try the text version, and `VoicePlayer`
renders that message plus (when one exists) a link to the equivalent text
simulation. This is the same shape as `/api/checkout`'s 503 when Stripe
isn't configured — one honest error, not a broken page — and it means
"Dograh's cloud is down" and "this scenario was never activated" produce
the identical, correct visitor experience.

The text alternative is not a courtesy hidden behind a toggle: it renders
whenever it exists, unconditionally, next to the call button — see brief
§24 ACCESSIBILITY. A visitor who never wants to use a microphone is never
asked to.

## Content stays authoritative

`compileWorkflow()` runs at **module load** for every voice scenario in
the catalogue (`src/content/voice-simulations/index.ts`), the same
build-time discipline `src/content/attacks/index.ts` and
`src/content/simulations/index.ts` already apply: a scenario with a
dangling transition, a duplicate stage id, or an empty signal list fails
the build immediately, not the first time someone tries to sync it to a
real Dograh account.

import type { AttackerObjective } from "@/content/attacks/types";
import type { MistakePatternCode, PsychologicalTriggerCode, TargetProfile } from "@/domain/scenario/types";

/**
 * A voice scenario, as authored in the repository
 * (`src/content/voice-simulations`). This is the canonical definition
 * (docs/decisions/0008 §3): the shape a person reviews in a PR diff, not
 * Dograh's `{nodes, edges}` graph — that graph is generated FROM this by
 * `src/infra/voice/dograh/compileWorkflow.ts`, never authored directly.
 *
 * The stage sequence intentionally matches the brief that requested voice
 * simulations: greeting, claimed identity, problem, urgency, request,
 * the visitor's response, the caller adapting, and a safe conclusion.
 * Each stage becomes one `agentNode`; the LLM only phrases the stage, it
 * never decides which stage comes next or what the correct answer is —
 * that's `edges` (deterministic conditions) and `signals` (extracted
 * booleans), both authored here.
 */
export interface VoiceScenarioDefinition {
  /** Stable identifier. Never change once a workflow has been created from it. */
  slug: string;
  /** The attack this scenario trains, e.g. "SOCIAL-000001". */
  attackCode: string;
  name: string;
  targetProfile: TargetProfile;
  /** Fictional throughout — never a real institution (docs/VOICE_SECURITY.md). */
  impersonatedEntity: string;
  triggers: PsychologicalTriggerCode[];
  attackerObjective: AttackerObjective;
  /** One line shown on the scenario's landing card before the call starts. */
  teaser: string;
  stages: VoiceStage[];
  /**
   * Behaviours to score after the call, evaluated deterministically against
   * `gathered_context` — see `src/domain/voice/evaluate.ts`. The LLM
   * extracts these as structured data; it never grades them
   * (docs/decisions/0008 §4).
   */
  signals: VoiceSignalDefinition[];
  /**
   * The two identifiers a Dograh workflow gets, once one has been created
   * from this definition (docs/DOGRAH_INTEGRATION.md §4). Both `null`
   * means the scenario is authored but not yet activated — the page
   * offers only the text simulation, if one exists, until someone with
   * access to the Dograh account runs the sync step and fills these in.
   *
   * They are set together or not at all: `dograhWorkflowId` is the
   * internal numeric id, needed server-side to fetch a finished run
   * (`GET /workflow/{id}/runs/{run_id}`); `dograhEmbedToken` is the
   * public, domain-whitelisted token the browser widget uses to start a
   * call. Minting the token is a one-time setup action (the sync script),
   * never a per-request API call — that's what makes the read path (a
   * visitor loading the scenario page) not depend on reaching Dograh at
   * all: the token is either already in this file, or it isn't.
   */
  dograhWorkflowId: number | null;
  dograhEmbedToken: string | null;
}

export type VoiceStageKind =
  | "greeting"
  | "claimed_identity"
  | "problem"
  | "urgency"
  | "request"
  | "adapt"
  | "conclusion";

export interface VoiceStage {
  id: string;
  kind: VoiceStageKind;
  /**
   * LLM system prompt for this stage: what the caller says and how they
   * behave here. Written as instructions to the persona, not as a
   * transcript — the wording varies call to call by design (brief §15).
   */
  prompt: string;
  /** Whether the visitor can interrupt the caller mid-sentence at this stage. */
  allowInterrupt: boolean;
  /**
   * Natural-language conditions the LLM evaluates to choose the next
   * stage, keyed by the target stage id. At least one is required except
   * on the final ("conclusion") stage. Kept as conditions (not free
   * branching) so the flow stays auditable in a diff (brief §14).
   */
  transitions: Record<string, string>;
}

export interface VoiceSignalDefinition {
  /** Becomes a Dograh `extraction_variables` entry; must be a valid identifier. */
  name: string;
  type: "boolean" | "string" | "number";
  /** Guides the LLM's extraction — not the grading. */
  prompt: string;
  /**
   * For boolean signals only: which mistake this signal represents when
   * `true`, reusing the vocabulary the text engine already scores against
   * (`src/domain/scenario/types.ts`) so both channels report on the same
   * dimensions. `null` for signals that are informational only.
   */
  mistakePattern: MistakePatternCode | null;
  /**
   * The value a safe response produces. For a boolean signal this is
   * almost always `false` (e.g. `revealed_otp` should stay false) —
   * `evaluate.ts` flags the run as unsafe wherever the observed value
   * differs from this.
   */
  safeValue: boolean | string | number;
}

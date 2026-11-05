import type {
  AttackVectorCode,
  Difficulty,
  MistakePatternCode,
  ScenarioExplanation,
  TargetProfile,
} from "@/domain/scenario/types";

/**
 * One simulation, as it lives in the repository.
 *
 * SAFETY (docs/decisions/0002-synthetic-content-only.md, brief §14)
 *   * Every entity is fictional. No real company, bank, carrier or
 *     administration is impersonated.
 *   * Every domain is under the reserved `.test` TLD (RFC 6761), which
 *     can never be registered, so no message here can be turned into
 *     working phishing infrastructure.
 *   * Nothing collects a password, a card number or any real credential:
 *     the visitor picks between written choices, and nothing is submitted
 *     anywhere.
 *
 * `correctChoiceIds` and `explanations` are server-only: the public read
 * strips them before the scenario reaches the browser
 * (docs/SECURITY_MODEL.md §9).
 */
export interface SimulationEntry {
  /** Stable identifier used by attempts. Never change it once shipped:
   * existing attempt rows reference it. */
  versionId: string;
  scenarioCode: string;
  slug: string;
  version: number;
  attackCode: string;
  channel: AttackVectorCode;
  targetProfile: TargetProfile;
  difficulty: Difficulty;
  /** Fictional. Checked by the registry audit against a real-brand denylist. */
  impersonatedEntity: string;
  /** One line shown on /simulations, so the card says what the exercise is. */
  teaser: string;
  content: { sender: string; body: string; ui: "sms" | "email" | "call" | "web" | "qr" };
  choices: {
    id: string;
    label: string;
    isUnsure?: boolean;
    isRecommended?: boolean;
    mistakePatternCodes?: MistakePatternCode[];
  }[];
  correctChoiceIds: string[];
  explanations: Record<string, ScenarioExplanation>;
}

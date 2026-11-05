/**
 * Domain types for the attack/scenario graph. These mirror the database
 * schema (supabase/migrations) but are framework- and infra-agnostic:
 * no Supabase types leak in here, so the domain layer stays unit-testable
 * without a database (see docs/ARCHITECTURE.md §4).
 */

export type AttackVectorCode =
  | "sms"
  | "email"
  | "phone"
  | "web"
  | "qr_code"
  | "social_media"
  | "messaging_app"
  | "advertisement"
  | "file_attachment";

export type PsychologicalTriggerCode =
  | "urgency"
  | "fear"
  | "authority"
  | "reward"
  | "curiosity"
  | "scarcity"
  | "social_pressure"
  | "trust"
  | "financial_incentive";

export type MistakePatternCode =
  | "MISSED_SUSPICIOUS_DOMAIN"
  | "TRUSTED_DISPLAY_NAME"
  | "RESPONDED_TO_URGENCY"
  | "TRUSTED_AUTHORITY"
  | "CLICKED_UNKNOWN_LINK"
  | "SHARED_CREDENTIAL"
  | "SHARED_MFA_CODE"
  | "FAILED_TO_VERIFY_INDEPENDENTLY"
  | "TRUSTED_LOGO"
  | "TRUSTED_BRAND_NAME"
  | "MISSED_UNUSUAL_PAYMENT_REQUEST";

export type CyberReflexDimensionCode =
  | "phishing_recognition"
  | "sms_scam_recognition"
  | "url_verification"
  | "identity_verification"
  | "financial_fraud_recognition"
  | "social_engineering_resistance"
  | "qr_phishing_recognition"
  | "deepfake_ai_awareness"
  | "account_security_awareness"
  /* Added in migration 0006: the four families that are not about
     judging an incoming message. See docs/CONTENT_TAXONOMY_PLAN.md §12 bis. */
  | "device_integrity_awareness"
  | "network_trust_awareness"
  | "personal_data_exposure_awareness"
  | "pressure_and_coercion_resistance";

export type TargetProfile = "general" | "senior" | "business";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface ScenarioChoice {
  id: string;
  label: string;
  isUnsure?: boolean;
  isRecommended?: boolean;
  /** Only present server-side before an attempt is answered; never sent
   * to the client for an unanswered scenario (see docs/SECURITY_MODEL.md §9). */
  mistakePatternCodes?: MistakePatternCode[];
}

export interface ScenarioExplanation {
  technique: string;
  indicator: string;
  whyDangerous: string;
  reflex: string;
}

/** Public shape: safe to send to the client before an answer is submitted. */
export interface PublicScenario {
  /** scenario_versions.id — needed by the client to start an attempt. */
  scenarioVersionId: string;
  scenarioCode: string;
  version: number;
  attackCode: string;
  channel: AttackVectorCode;
  targetProfile: TargetProfile;
  difficulty: Difficulty;
  impersonatedEntity: string;
  content: {
    sender: string;
    body: string;
    ui: "sms" | "email" | "call" | "web" | "qr";
  };
  choices: Pick<ScenarioChoice, "id" | "label" | "isUnsure">[];
}

/** Server-only shape used for grading; never returned before an answer. */
export interface GradedScenario extends Omit<PublicScenario, "choices"> {
  choices: ScenarioChoice[];
  correctChoiceIds: string[];
  explanations: Record<string, ScenarioExplanation>;
}

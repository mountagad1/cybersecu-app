/**
 * Hand-written minimal typing for the tables this app currently reads.
 * Once `supabase gen types typescript` can run against a real project
 * (it needs a live database URL, which this environment doesn't have),
 * replace this file with the generated one — do not hand-maintain both.
 *
 * Each table must satisfy postgrest-js's `GenericTable` shape (Row,
 * Insert, Update, Relationships) or the client's Schema generic silently
 * collapses to `never` — see @supabase/postgrest-js `common.ts`.
 *
 * `__InternalSupabase` is required too (postgrest-js's select-string type
 * parser branches on `PostgrestVersion` and otherwise produces `never`
 * results even for a structurally valid schema — see
 * docs/decisions/0004-hand-rolled-database-types.md). Every query in this
 * codebase also appends `.returns<Row[]>()` (or `Row | null`) for the
 * same reason: it's the documented postgrest-js escape hatch that keeps
 * the row type stable regardless of the select-string parser.
 */

import type { MistakePatternCode } from "@/domain/scenario/types";

export interface AttacksRow {
  id: string;
  code: string;
  slug: string;
  name: string;
  primary_vector: string;
  primary_dimension: string;
  definition: string | null;
  how_it_works: string | null;
  warning_signs: string[];
  how_to_verify: string | null;
  what_to_do: string | null;
  what_to_do_if_victim: string | null;
  faq: { question: string; answer: string }[];
  references: { label: string; url: string }[];
  published_at: string | null;
}

export interface AttackTriggersRow {
  attack_id: string;
  trigger_code: string;
}

export interface AttackRelatedRow {
  attack_id: string;
  related_attack_id: string;
}

export interface ScenariosRow {
  id: string;
  code: string;
  attack_id: string;
  slug: string;
}

export interface ScenarioVersionsRow {
  id: string;
  scenario_id: string;
  version: number;
  channel: string;
  target_profile: string;
  difficulty: number;
  impersonated_entity: string;
  content: { sender: string; body: string; ui: "sms" | "email" | "call" | "web" | "qr" };
  choices: {
    id: string;
    label: string;
    isUnsure?: boolean;
    isRecommended?: boolean;
    mistakePatternCodes?: MistakePatternCode[];
  }[];
  correct_choice_ids: string[];
  explanations: Record<string, { technique: string; indicator: string; whyDangerous: string; reflex: string }>;
  published_at: string | null;
}

export interface AttemptsRow {
  id: string;
  user_id: string | null;
  anonymous_session_id: string | null;
  scenario_version_id: string;
  started_at: string;
  answered_at: string | null;
}

export interface AnonymousSessionsRow {
  id: string;
  quota_limit: number;
  created_at: string;
  last_seen_at: string;
}

export interface SimulationUsageRow {
  id: string;
  anonymous_session_id: string | null;
  user_id: string | null;
  attempt_id: string;
  created_at: string;
}

export interface EntitlementsRow {
  id: string;
  anonymous_session_id: string | null;
  user_id: string | null;
  status: "active" | "revoked";
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  product_id: string;
  email_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface PurchasesRow {
  id: string;
  entitlement_id: string;
  stripe_event_id: string;
  amount_cents: number;
  currency: string;
  created_at: string;
}

export interface LicenseEventsRow {
  id: string;
  entitlement_id: string;
  event_type: "created" | "revoked" | "restored";
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface RecoveryTokensRow {
  id: string;
  entitlement_id: string;
  email_hash: string;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface AttemptDecisionsRow {
  attempt_id: string;
  choice_id: string;
  correct: boolean;
  created_at: string;
}

export interface AttemptMistakesRow {
  attempt_id: string;
  mistake_pattern_code: string;
}

export interface CyberReflexScoresRow {
  user_id: string;
  dimension: string;
  score: number | null;
  attempts_count: number;
  updated_at: string;
}

export interface Database {
  __InternalSupabase: { PostgrestVersion: "13.0.4" };
  public: {
    Tables: {
      attacks: { Row: AttacksRow; Insert: Partial<AttacksRow>; Update: Partial<AttacksRow>; Relationships: [] };
      attack_triggers: {
        Row: AttackTriggersRow;
        Insert: AttackTriggersRow;
        Update: Partial<AttackTriggersRow>;
        Relationships: [];
      };
      attack_related: {
        Row: AttackRelatedRow;
        Insert: AttackRelatedRow;
        Update: Partial<AttackRelatedRow>;
        Relationships: [];
      };
      scenarios: {
        Row: ScenariosRow;
        Insert: Omit<ScenariosRow, "id">;
        Update: Partial<ScenariosRow>;
        Relationships: [];
      };
      scenario_versions: {
        Row: ScenarioVersionsRow;
        Insert: Partial<ScenarioVersionsRow>;
        Update: Partial<ScenarioVersionsRow>;
        Relationships: [];
      };
      attempts: {
        Row: AttemptsRow;
        Insert: { user_id?: string; anonymous_session_id?: string; scenario_version_id: string };
        Update: { answered_at?: string };
        Relationships: [];
      };
      anonymous_sessions: {
        Row: AnonymousSessionsRow;
        Insert: Partial<AnonymousSessionsRow>;
        Update: Partial<AnonymousSessionsRow>;
        Relationships: [];
      };
      simulation_usage: {
        Row: SimulationUsageRow;
        Insert: { anonymous_session_id?: string; user_id?: string; attempt_id: string };
        Update: Partial<SimulationUsageRow>;
        Relationships: [];
      };
      entitlements: {
        Row: EntitlementsRow;
        Insert: {
          anonymous_session_id?: string;
          user_id?: string;
          stripe_checkout_session_id?: string;
          stripe_payment_intent_id?: string;
          product_id?: string;
          status?: "active" | "revoked";
          email_hash?: string;
        };
        Update: { status?: "active" | "revoked"; anonymous_session_id?: string };
        Relationships: [];
      };
      purchases: {
        Row: PurchasesRow;
        Insert: { entitlement_id: string; stripe_event_id: string; amount_cents: number; currency: string };
        Update: Partial<PurchasesRow>;
        Relationships: [];
      };
      license_events: {
        Row: LicenseEventsRow;
        Insert: { entitlement_id: string; event_type: "created" | "revoked" | "restored"; metadata?: Record<string, unknown> };
        Update: Partial<LicenseEventsRow>;
        Relationships: [];
      };
      recovery_tokens: {
        Row: RecoveryTokensRow;
        Insert: { entitlement_id: string; email_hash: string; token_hash: string; expires_at: string };
        Update: { used_at?: string };
        Relationships: [];
      };
      attempt_decisions: {
        Row: AttemptDecisionsRow;
        Insert: { attempt_id: string; choice_id: string; correct: boolean };
        Update: Partial<AttemptDecisionsRow>;
        Relationships: [];
      };
      attempt_mistakes: {
        Row: AttemptMistakesRow;
        Insert: AttemptMistakesRow;
        Update: Partial<AttemptMistakesRow>;
        Relationships: [];
      };
      cyber_reflex_scores: {
        Row: CyberReflexScoresRow;
        Insert: { user_id: string; dimension: string; score: number; attempts_count: number };
        Update: { score?: number; attempts_count?: number; updated_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

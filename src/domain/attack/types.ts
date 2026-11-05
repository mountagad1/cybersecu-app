import type {
  AttackVectorCode,
  CyberReflexDimensionCode,
  PsychologicalTriggerCode,
} from "@/domain/scenario/types";

export interface AttackSummary {
  code: string;
  slug: string;
  name: string;
  primaryVector: AttackVectorCode;
  primaryDimension: CyberReflexDimensionCode;
  publishedAt: string | null;
}

export interface AttackDetail extends AttackSummary {
  definition: string;
  howItWorks: string;
  warningSigns: string[];
  triggers: PsychologicalTriggerCode[];
  indicators: string[];
  howToVerify: string;
  whatToDo: string;
  whatToDoIfVictim: string;
  /**
   * Stable domain reference to related attacks. The presentation
   * projection (slug + label for a link) is resolved by
   * `relatedAttacks()` in src/content/attacks, which also guarantees every
   * code here points at a page that exists.
   */
  relatedAttackCodes: string[];
  faq: { question: string; answer: string }[];
  references: { label: string; url: string }[];
}

/**
 * Publish-readiness check mirroring the DB constraint described in
 * docs/SEO_ARCHITECTURE.md §3 — kept here too so admin UI can give
 * immediate feedback without a round trip.
 */
export function isPublishable(attack: Partial<AttackDetail>): string[] {
  const missing: string[] = [];
  if (!attack.definition) missing.push("definition");
  if (!attack.howItWorks) missing.push("howItWorks");
  if (!attack.warningSigns?.length) missing.push("warningSigns");
  if (!attack.triggers?.length && !attack.indicators?.length) {
    missing.push("at least one trigger or indicator");
  }
  return missing;
}

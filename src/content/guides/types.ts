import type { EditorialStatus } from "@/content/attacks/types";

/**
 * A guide answers "how do I do this?", where a fiche answers "what is
 * this?".
 *
 * WHY THE TWO CANNOT CANNIBALISE EACH OTHER
 * A fiche is about an attack and is written for someone who received a
 * message. A guide is about a defensive action and is written for someone
 * who has decided to do something. `/attaques/typosquatting` explains why
 * a lookalike domain works; `/guides/verifier-un-lien-avant-de-cliquer`
 * explains how to read an address. Same subject matter, different
 * question, different reader, different moment.
 *
 * Guides also absorb the umbrella concepts that would have made bad
 * fiches. "Vol de mot de passe" is not an attack — it is the outcome of
 * five of them — so it is a guide, and the five fiches keep their pages
 * (docs/CONTENT_TAXONOMY_PLAN.md §4).
 *
 * Attachment is declared HERE, on the guide, and never on the fiche. A
 * fiche derives its guides by asking which ones name it. One declaration
 * point, so the two lists cannot drift.
 */
export type GuideIntent = "PREVENTION" | "INCIDENT_RESPONSE" | "INFORMATIONAL";

export interface GuideStep {
  title: string;
  body: string;
}

export interface GuideEntry {
  slug: string;
  /** Used as the <h1>. Phrased as the action, not as a topic. */
  title: string;
  intent: GuideIntent;
  /**
   * The question a visitor actually types. One dominant intent per guide
   * (brief SEARCH_INTENT_ARCHITECTURE) — if two questions fit, it is two
   * guides or the wrong split.
   */
  question: string;
  /**
   * The direct answer, given before any explanation. A reader who stops
   * after this paragraph must already have what they came for.
   */
  shortAnswer: string;
  /** Why the method works, so it survives a variant it was not written for. */
  why: string;
  steps: GuideStep[];
  /** What people get wrong — usually more useful than the steps. */
  pitfalls: string[];
  /** Attack codes this guide defends against. Drives the link graph. */
  relatedAttackCodes: string[];
  references: { label: string; url: string }[];
  editorialStatus: EditorialStatus;
  updatedAt: string;
}

/**
 * The English version of a guide: only what a reader reads. Identity,
 * intent, attack links and dates stay on the French entry and are shared.
 * Same number of steps and pitfalls as the French guide (`auditGuides`).
 */
export interface GuideTranslation {
  slug: string;
  title: string;
  question: string;
  shortAnswer: string;
  why: string;
  steps: GuideStep[];
  pitfalls: string[];
  references: { label: string; url: string }[];
}

export const GUIDE_INTENT_LABELS: Record<GuideIntent, string> = {
  PREVENTION: "Se protéger",
  INCIDENT_RESPONSE: "Réagir",
  INFORMATIONAL: "Comprendre",
};

export const GUIDE_INTENT_LABELS_EN: Record<GuideIntent, string> = {
  PREVENTION: "Prevent",
  INCIDENT_RESPONSE: "Respond",
  INFORMATIONAL: "Understand",
};

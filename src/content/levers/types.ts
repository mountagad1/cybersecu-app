import type { PsychologicalTriggerCode } from "@/domain/scenario/types";
import type { EditorialStatus } from "@/content/attacks/types";

/**
 * A psychological lever — the thing an attack exploits, as opposed to the
 * attack itself.
 *
 * WHY THESE ARE PAGES AND NOT FICHES
 * The initial content plan listed « attaque par autorité », « attaque par
 * urgence » and « manipulation émotionnelle » as attacks. They are not:
 * they are what the other attacks use, and the codebase already models
 * them as `PsychologicalTriggerCode` on every fiche. As attack pages they
 * could only repeat the forty-one pages that declare them
 * (docs/CONTENT_TAXONOMY_PLAN.md §2.1).
 *
 * As their own page type they earn their place: they answer a question no
 * fiche answers — "why did this work on me?" — and each one receives an
 * inbound link from every fiche that declares it, which is a large
 * internal-link graph obtained without a single thin page.
 *
 * Membership is NOT declared here. A lever's fiches are derived from the
 * `triggers` each fiche already carries, so the two can never disagree.
 */
export interface LeverEntry {
  /** Matches the code fiches already declare in `triggers`. */
  code: PsychologicalTriggerCode;
  slug: string;
  name: string;
  editorialStatus: EditorialStatus;
  updatedAt: string;

  /** One sentence, no jargon: what this feels like from the inside. */
  plainLanguageDefinition: string;
  /** What the lever is, stated precisely. */
  definition: string;
  /** Why it works on people who are neither naive nor inattentive. */
  whyItWorks: string;
  /** What actually resists it — a behaviour, not an intention. */
  howToResist: string;
  /**
   * One question to ask yourself in the moment. The most portable thing
   * on the page: it is what a reader will still have three months later.
   */
  counterQuestion: string;
}

/** The English version of a lever: only what a reader reads. */
export type LeverTranslation = Pick<
  LeverEntry,
  "slug" | "name" | "plainLanguageDefinition" | "definition" | "whyItWorks" | "howToResist" | "counterQuestion"
>;

/**
 * A lever is published only once enough fiches declare it. Below that it
 * is a page whose list of examples is shorter than its own explanation,
 * and the reader learns more from the fiches themselves.
 */
export const LEVER_PUBLICATION_THRESHOLD = 3;

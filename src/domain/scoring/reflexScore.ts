import type { Difficulty } from "@/domain/scenario/types";

/**
 * One graded attempt contributing to a single Cyber Reflex dimension.
 * `recencyIndex` is 0 for the most recent attempt, 1 for the next most
 * recent, etc. — the caller supplies attempts already ordered by recency
 * so this function stays a pure, order-dependent transform with no
 * knowledge of wall-clock time.
 */
export interface ScoredAttempt {
  correct: boolean;
  difficulty: Difficulty;
  recencyIndex: number;
}

/**
 * v1 Cyber Reflex score for one dimension: a difficulty-weighted,
 * recency-decayed average of correctness, scaled to 0-100.
 *
 * Formula (documented in docs/DOMAIN_MODEL.md §6 and
 * docs/decisions/0003-reflex-scoring-v1.md — do not change without a new
 * decision record, since it affects historical comparability):
 *
 *   weight(attempt) = difficulty * 0.9 ^ floor(recencyIndex / 10)
 *   score = 100 * sum(weight * correct) / sum(weight)
 *
 * Returns `null` when there are no attempts — callers render a "not
 * enough data yet" state rather than a fabricated 0.
 */
export function computeDimensionScore(attempts: ScoredAttempt[]): number | null {
  if (attempts.length === 0) return null;

  let weightedCorrect = 0;
  let totalWeight = 0;

  for (const attempt of attempts) {
    const decay = Math.pow(0.9, Math.floor(attempt.recencyIndex / 10));
    const weight = attempt.difficulty * decay;
    totalWeight += weight;
    if (attempt.correct) weightedCorrect += weight;
  }

  if (totalWeight === 0) return null;
  return Math.round((100 * weightedCorrect) / totalWeight);
}

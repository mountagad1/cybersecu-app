import type { CyberReflexDimensionCode, TargetProfile } from "@/domain/scenario/types";
import type { UserLearningState } from "@/domain/adaptive/selectNext";

/**
 * Derives the `UserLearningState` that adaptive selection consumes
 * (docs/LEARNING_ENGINE.md §3) from a caller's graded history.
 *
 * Kept pure and separate from `selectNext.ts` so the two halves are testable
 * apart: `selectNext` decides *given* a state, this decides *what the state
 * is*. Neither touches Supabase.
 */

export interface GradedHistoryEntry {
  dimension: CyberReflexDimensionCode;
  correct: boolean;
}

/**
 * With no history at all there is nothing to adapt to, and any guess is a
 * claim about the visitor that the data does not support. 0.5 is the neutral
 * choice: `weightCandidate` maps it to a mid target difficulty (3 of 5), so a
 * first-time visitor is offered the middle of the catalogue rather than the
 * easiest or the hardest end of it.
 */
export const NEUTRAL_ROLLING_ACCURACY = 0.5;

export function deriveLearningState(
  history: readonly GradedHistoryEntry[],
  targetProfile: TargetProfile = "general",
): UserLearningState {
  if (history.length === 0) {
    return { targetProfile, rollingAccuracy: NEUTRAL_ROLLING_ACCURACY, weakestDimensions: [] };
  }

  const correctCount = history.filter((entry) => entry.correct).length;

  const perDimension = new Map<CyberReflexDimensionCode, { correct: number; total: number }>();
  for (const entry of history) {
    const tally = perDimension.get(entry.dimension) ?? { correct: 0, total: 0 };
    tally.total += 1;
    if (entry.correct) tally.correct += 1;
    perDimension.set(entry.dimension, tally);
  }

  // Weakest first. Ties break on the dimension code so the ordering is total
  // and the same history always produces the same state — `selectNextScenario`
  // reads the rank as a boost, so an unstable order would silently reweight
  // identical inputs.
  const weakestDimensions = [...perDimension.entries()]
    .sort(([codeA, a], [codeB, b]) => {
      const accuracyA = a.correct / a.total;
      const accuracyB = b.correct / b.total;
      return accuracyA - accuracyB || codeA.localeCompare(codeB);
    })
    .map(([code]) => code);

  return {
    targetProfile,
    rollingAccuracy: correctCount / history.length,
    weakestDimensions,
  };
}

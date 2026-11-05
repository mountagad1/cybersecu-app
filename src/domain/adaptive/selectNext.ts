import type { CyberReflexDimensionCode, Difficulty, TargetProfile } from "@/domain/scenario/types";

export interface ScenarioCandidate {
  scenarioVersionId: string;
  attackCode: string;
  dimension: CyberReflexDimensionCode;
  difficulty: Difficulty;
  targetProfile: TargetProfile;
  /** true if the user attempted this scenario (any version of it) recently */
  recentlySeen: boolean;
}

export interface UserLearningState {
  targetProfile: TargetProfile;
  /** rolling accuracy 0-1 across all dimensions, used to pick difficulty */
  rollingAccuracy: number;
  /** dimension(s) with the lowest Cyber Reflex score, weakest first */
  weakestDimensions: CyberReflexDimensionCode[];
}

/**
 * v1 adaptive weighting (docs/LEARNING_ENGINE.md §3): weighted-random,
 * not a bandit/ML model. Weighs toward difficulty matching the user's
 * rolling accuracy, boosts scenarios in the user's weakest dimensions,
 * and penalizes scenarios recently seen to avoid repetitive trapping.
 */
export function weightCandidate(candidate: ScenarioCandidate, state: UserLearningState): number {
  if (candidate.targetProfile !== state.targetProfile && candidate.targetProfile !== "general") {
    return 0;
  }

  const targetDifficulty = 1 + Math.round(state.rollingAccuracy * 4); // 1..5
  const difficultyFit = 1 / (1 + Math.abs(candidate.difficulty - targetDifficulty));

  const weaknessRank = state.weakestDimensions.indexOf(candidate.dimension);
  const weaknessBoost = weaknessRank === -1 ? 1 : 1 + (state.weakestDimensions.length - weaknessRank) * 0.5;

  const varietyPenalty = candidate.recentlySeen ? 0.1 : 1;

  return difficultyFit * weaknessBoost * varietyPenalty;
}

/** Weighted random selection. Returns null if every candidate has weight 0. */
export function selectNextScenario(
  candidates: ScenarioCandidate[],
  state: UserLearningState,
  random: () => number = Math.random,
): ScenarioCandidate | null {
  const weighted = candidates
    .map((c) => ({ candidate: c, weight: weightCandidate(c, state) }))
    .filter((w) => w.weight > 0);

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  if (totalWeight === 0) return null;

  let roll = random() * totalWeight;
  for (const w of weighted) {
    roll -= w.weight;
    if (roll <= 0) return w.candidate;
  }
  return weighted[weighted.length - 1].candidate;
}

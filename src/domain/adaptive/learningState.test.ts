import { describe, expect, it } from "vitest";
import {
  deriveLearningState,
  NEUTRAL_ROLLING_ACCURACY,
  type GradedHistoryEntry,
} from "@/domain/adaptive/learningState";
import { selectNextScenario, type ScenarioCandidate } from "@/domain/adaptive/selectNext";

const entry = (
  dimension: GradedHistoryEntry["dimension"],
  correct: boolean,
): GradedHistoryEntry => ({ dimension, correct });

describe("deriveLearningState", () => {
  it("starts neutral when the caller has no graded history", () => {
    const state = deriveLearningState([]);

    expect(state.rollingAccuracy).toBe(NEUTRAL_ROLLING_ACCURACY);
    expect(state.weakestDimensions).toEqual([]);
    expect(state.targetProfile).toBe("general");
  });

  it("computes rolling accuracy across every dimension", () => {
    const state = deriveLearningState([
      entry("phishing_recognition", true),
      entry("phishing_recognition", false),
      entry("url_verification", true),
      entry("url_verification", true),
    ]);

    expect(state.rollingAccuracy).toBe(0.75);
  });

  it("ranks dimensions weakest first", () => {
    const state = deriveLearningState([
      entry("url_verification", true),
      entry("url_verification", true),
      entry("phishing_recognition", false),
      entry("phishing_recognition", false),
      entry("sms_scam_recognition", true),
      entry("sms_scam_recognition", false),
    ]);

    expect(state.weakestDimensions).toEqual([
      "phishing_recognition", // 0/2
      "sms_scam_recognition", // 1/2
      "url_verification", // 2/2
    ]);
  });

  it("orders ties deterministically, so identical history weighs identically", () => {
    const history = [entry("url_verification", false), entry("phishing_recognition", false)];

    expect(deriveLearningState(history).weakestDimensions).toEqual(
      deriveLearningState([...history].reverse()).weakestDimensions,
    );
  });

  it("does not count a dimension the caller has never been tested on", () => {
    const state = deriveLearningState([entry("phishing_recognition", false)]);

    expect(state.weakestDimensions).toEqual(["phishing_recognition"]);
  });
});

describe("deriveLearningState + selectNextScenario", () => {
  const candidate = (
    id: string,
    dimension: ScenarioCandidate["dimension"],
    difficulty: ScenarioCandidate["difficulty"],
  ): ScenarioCandidate => ({
    scenarioVersionId: id,
    attackCode: id,
    dimension,
    difficulty,
    targetProfile: "general",
    recentlySeen: false,
  });

  it("feeds a state the selector can act on end to end", () => {
    const state = deriveLearningState([
      entry("phishing_recognition", false),
      entry("phishing_recognition", false),
      entry("url_verification", true),
      entry("url_verification", true),
    ]);

    const candidates = [
      candidate("weak", "phishing_recognition", 3),
      candidate("strong", "url_verification", 3),
    ];

    // Same difficulty, so the weakness boost is the only differentiator: the
    // weak dimension must win the bottom of the weighted range.
    expect(selectNextScenario(candidates, state, () => 0)?.scenarioVersionId).toBe("weak");
  });

  it("returns nothing rather than a mismatched profile", () => {
    const state = deriveLearningState([]);
    const seniorOnly = [{ ...candidate("s", "phishing_recognition", 3), targetProfile: "senior" as const }];

    expect(selectNextScenario(seniorOnly, state)).toBeNull();
  });
});

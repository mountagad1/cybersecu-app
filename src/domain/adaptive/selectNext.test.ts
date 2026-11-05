import { describe, expect, it } from "vitest";
import { selectNextScenario, weightCandidate, type ScenarioCandidate, type UserLearningState } from "./selectNext";

const baseState: UserLearningState = {
  targetProfile: "general",
  rollingAccuracy: 0.5,
  weakestDimensions: ["url_verification", "sms_scam_recognition"],
};

function candidate(overrides: Partial<ScenarioCandidate> = {}): ScenarioCandidate {
  return {
    scenarioVersionId: "v1",
    attackCode: "SMS-000001",
    dimension: "sms_scam_recognition",
    difficulty: 3,
    targetProfile: "general",
    recentlySeen: false,
    ...overrides,
  };
}

describe("weightCandidate", () => {
  it("excludes candidates for a different, non-general target profile", () => {
    const c = candidate({ targetProfile: "senior" });
    expect(weightCandidate(c, baseState)).toBe(0);
  });

  it("boosts candidates in the user's weakest dimension", () => {
    const weak = candidate({ dimension: "sms_scam_recognition" });
    const neutral = candidate({ dimension: "deepfake_ai_awareness" });
    expect(weightCandidate(weak, baseState)).toBeGreaterThan(weightCandidate(neutral, baseState));
  });

  it("penalizes recently seen scenarios (variety)", () => {
    const fresh = candidate({ recentlySeen: false });
    const seen = candidate({ recentlySeen: true });
    expect(weightCandidate(seen, baseState)).toBeLessThan(weightCandidate(fresh, baseState));
  });
});

describe("selectNextScenario", () => {
  it("returns null when no candidate has positive weight", () => {
    const onlyMismatched = [candidate({ targetProfile: "senior" })];
    expect(selectNextScenario(onlyMismatched, baseState)).toBeNull();
  });

  it("deterministically picks the only eligible candidate", () => {
    const only = [candidate()];
    expect(selectNextScenario(only, baseState, () => 0)!.scenarioVersionId).toBe("v1");
  });

  it("respects the weighted distribution across a fixed random draw", () => {
    const candidates = [
      candidate({ scenarioVersionId: "a", recentlySeen: true }),
      candidate({ scenarioVersionId: "b", recentlySeen: false }),
    ];
    // random() = 0.99 should land on the much-larger-weight "b" bucket
    const picked = selectNextScenario(candidates, baseState, () => 0.99);
    expect(picked!.scenarioVersionId).toBe("b");
  });
});

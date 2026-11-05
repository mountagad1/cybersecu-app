import { describe, expect, it } from "vitest";
import { computeDimensionScore, type ScoredAttempt } from "./reflexScore";

describe("computeDimensionScore", () => {
  it("returns null when there are no attempts", () => {
    expect(computeDimensionScore([])).toBeNull();
  });

  it("returns 100 when every attempt is correct", () => {
    const attempts: ScoredAttempt[] = [
      { correct: true, difficulty: 3, recencyIndex: 0 },
      { correct: true, difficulty: 5, recencyIndex: 1 },
    ];
    expect(computeDimensionScore(attempts)).toBe(100);
  });

  it("returns 0 when every attempt is wrong", () => {
    const attempts: ScoredAttempt[] = [
      { correct: false, difficulty: 3, recencyIndex: 0 },
      { correct: false, difficulty: 1, recencyIndex: 1 },
    ];
    expect(computeDimensionScore(attempts)).toBe(0);
  });

  it("weights higher-difficulty attempts more heavily", () => {
    // one easy correct + one hard wrong should score below 50
    const attempts: ScoredAttempt[] = [
      { correct: true, difficulty: 1, recencyIndex: 0 },
      { correct: false, difficulty: 5, recencyIndex: 1 },
    ];
    const score = computeDimensionScore(attempts);
    expect(score).not.toBeNull();
    expect(score as number).toBeLessThan(50);
  });

  it("decays older attempts so recent performance dominates", () => {
    // 9 old wrong attempts (recencyIndex 1-9, same decay bucket as index 0)
    // vs 1 recent correct attempt with a big index gap — decay should
    // make the older bucket count less per-attempt once it crosses a
    // decade boundary.
    const recentGood: ScoredAttempt[] = [{ correct: true, difficulty: 3, recencyIndex: 0 }];
    const oldBad: ScoredAttempt[] = Array.from({ length: 9 }, (_, i) => ({
      correct: false,
      difficulty: 3,
      recencyIndex: i + 11, // recencyIndex 11-19 -> decay bucket 1 (0.9x)
    }));

    const withoutOld = computeDimensionScore(recentGood)!;
    const withOld = computeDimensionScore([...recentGood, ...oldBad])!;

    // adding old wrong attempts still lowers the score, but decay means
    // it's lowered less than it would be if they were undecayed
    expect(withOld).toBeLessThan(withoutOld);
    const undecayedEquivalent = computeDimensionScore([
      ...recentGood,
      ...oldBad.map((a) => ({ ...a, recencyIndex: 0 })),
    ])!;
    expect(withOld).toBeGreaterThan(undecayedEquivalent);
  });

  it("handles a single attempt", () => {
    expect(computeDimensionScore([{ correct: true, difficulty: 2, recencyIndex: 0 }])).toBe(100);
  });
});

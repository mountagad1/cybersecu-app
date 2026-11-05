import { describe, expect, it, vi } from "vitest";

describe("session score", () => {
  it("starts at zero before any answer", async () => {
    vi.resetModules();
    const { readSessionScore } = await import("./sessionScore");
    expect(readSessionScore()).toEqual({ correct: 0, total: 0, streak: 0, bestStreak: 0 });
  });

  it("counts a correct answer in both correct and total, and starts a streak", async () => {
    vi.resetModules();
    const { recordSessionAnswer } = await import("./sessionScore");
    expect(recordSessionAnswer(true)).toEqual({ correct: 1, total: 1, streak: 1, bestStreak: 1 });
  });

  it("counts an incorrect answer in total only, with no streak", async () => {
    vi.resetModules();
    const { recordSessionAnswer } = await import("./sessionScore");
    expect(recordSessionAnswer(false)).toEqual({ correct: 0, total: 1, streak: 0, bestStreak: 0 });
  });

  it("accumulates across several answers", async () => {
    vi.resetModules();
    const { recordSessionAnswer, readSessionScore } = await import("./sessionScore");
    recordSessionAnswer(true);
    recordSessionAnswer(false);
    recordSessionAnswer(true);
    expect(readSessionScore()).toEqual({ correct: 2, total: 3, streak: 1, bestStreak: 1 });
  });

  it("keeps each dynamic import isolated, confirming resetModules gives a fresh store", async () => {
    vi.resetModules();
    const a = await import("./sessionScore");
    a.recordSessionAnswer(true);
    expect(a.readSessionScore()).toEqual({ correct: 1, total: 1, streak: 1, bestStreak: 1 });

    vi.resetModules();
    const b = await import("./sessionScore");
    expect(b.readSessionScore()).toEqual({ correct: 0, total: 0, streak: 0, bestStreak: 0 });
  });

  it("grows the streak on consecutive correct answers", async () => {
    vi.resetModules();
    const { recordSessionAnswer } = await import("./sessionScore");
    recordSessionAnswer(true);
    recordSessionAnswer(true);
    expect(recordSessionAnswer(true)).toEqual({ correct: 3, total: 3, streak: 3, bestStreak: 3 });
  });

  it("resets the streak to zero on a miss, without touching bestStreak", async () => {
    vi.resetModules();
    const { recordSessionAnswer } = await import("./sessionScore");
    recordSessionAnswer(true);
    recordSessionAnswer(true);
    recordSessionAnswer(true);
    expect(recordSessionAnswer(false)).toEqual({ correct: 3, total: 4, streak: 0, bestStreak: 3 });
  });

  it("keeps bestStreak as the historical peak even after a later, shorter streak", async () => {
    vi.resetModules();
    const { recordSessionAnswer } = await import("./sessionScore");
    recordSessionAnswer(true);
    recordSessionAnswer(true);
    recordSessionAnswer(true);
    recordSessionAnswer(false);
    recordSessionAnswer(true);
    expect(recordSessionAnswer(true)).toEqual({ correct: 5, total: 6, streak: 2, bestStreak: 3 });
  });

  it("treats a pre-existing record with no streak fields as valid, defaulting them to zero", async () => {
    vi.resetModules();
    // This test environment is plain Node (no jsdom, no real `sessionStorage`):
    // stub one on `globalThis` so the module's own `storage()` accessor picks
    // it up, the same way it would pick up a real browser's.
    const store = new Map<string, string>();
    const fakeStorage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    } as Storage;
    (globalThis as { sessionStorage?: Storage }).sessionStorage = fakeStorage;
    try {
      fakeStorage.setItem("cybersecu:session-score", JSON.stringify({ correct: 2, total: 3 }));
      const { readSessionScore, recordSessionAnswer } = await import("./sessionScore");
      expect(readSessionScore()).toEqual({ correct: 2, total: 3, streak: 0, bestStreak: 0 });
      expect(recordSessionAnswer(true)).toEqual({ correct: 3, total: 4, streak: 1, bestStreak: 1 });
    } finally {
      delete (globalThis as { sessionStorage?: Storage }).sessionStorage;
    }
  });
});

describe("isStreakMilestone", () => {
  it("flags the declared milestone lengths", async () => {
    vi.resetModules();
    const { isStreakMilestone, STREAK_MILESTONES } = await import("./sessionScore");
    for (const n of STREAK_MILESTONES) {
      expect(isStreakMilestone(n)).toBe(true);
    }
  });

  it("never flags zero or a non-milestone length", async () => {
    vi.resetModules();
    const { isStreakMilestone } = await import("./sessionScore");
    expect(isStreakMilestone(0)).toBe(false);
    expect(isStreakMilestone(1)).toBe(false);
    expect(isStreakMilestone(4)).toBe(false);
  });
});

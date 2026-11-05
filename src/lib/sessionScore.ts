/**
 * A per-tab tally of simulations answered in this visit — "3 sur 4" shown
 * back to the visitor while they play. Deliberately NOT the server-side
 * quota or a persisted account stat: this site has no login
 * (docs/NO_LOGIN_ARCHITECTURE.md), so there is nothing durable to attach a
 * score to, and `sessionStorage` already matches the lifetime a "how am I
 * doing right now" number should have — it clears when the tab closes and
 * never follows the visitor to another device.
 *
 * `streak`/`bestStreak` exist for the same reason and at the same lifetime:
 * a run of consecutive correct answers is a strong, well-evidenced retention
 * hook (spaced-repetition apps live on it), and it costs nothing extra to
 * compute from data this module already tracks. Like the score itself, it
 * is purely a positive-reinforcement display — never a gate, never
 * something the server checks, and never something that punishes a miss
 * beyond resetting the count back to zero. No loss aversion, no fake
 * urgency: brief §14 ("never shame the learner") applies here as much as it
 * does to the explanation copy.
 *
 * Never used for enforcement. The quota that actually gates play lives
 * server-side (docs/SIMULATION_QUOTA.md) and cannot be inflated by writing
 * to this key.
 *
 * Reads `sessionStorage` off `globalThis` rather than importing it, with an
 * in-memory fallback when it is absent. This module is only ever called
 * from a client component's effects and event handlers — never from render,
 * so it never runs during server-side rendering — but writing it this way
 * makes the fallback path exercisable by a plain Node test too, with no
 * jsdom dependency for one small utility.
 */

const STORAGE_KEY = "cybersecu:session-score";

export interface SessionScore {
  correct: number;
  total: number;
  /** Consecutive correct answers ending at the most recent attempt. */
  streak: number;
  /** Highest `streak` reached this session, kept even after a miss resets it. */
  bestStreak: number;
}

/**
 * Streak lengths worth a one-off celebration (`isStreakMilestone` below).
 * Spaced further apart as the run grows so the reward stays meaningful
 * instead of firing on every other answer.
 */
export const STREAK_MILESTONES: readonly number[] = [3, 5, 10, 15, 20, 30, 50];

export function isStreakMilestone(streak: number): boolean {
  return streak > 0 && STREAK_MILESTONES.includes(streak);
}

const EMPTY: SessionScore = { correct: 0, total: 0, streak: 0, bestStreak: 0 };

let memoryFallback: string | null = null;

function storage(): Pick<Storage, "getItem" | "setItem"> {
  const candidate = (globalThis as { sessionStorage?: Storage }).sessionStorage;
  if (candidate) return candidate;
  return {
    getItem: () => memoryFallback,
    setItem: (_key: string, value: string) => {
      memoryFallback = value;
    },
  };
}

/**
 * Accepts a record missing `streak`/`bestStreak` as valid, defaulting both
 * to 0: a tab already mid-session when this field shipped must not have its
 * whole score wiped by a stricter shape check on the very next read.
 */
function normalize(value: unknown): SessionScore | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Partial<SessionScore>;
  if (typeof v.correct !== "number" || typeof v.total !== "number") return null;
  if (v.correct < 0 || v.total < v.correct) return null;
  const streak = typeof v.streak === "number" && v.streak >= 0 ? v.streak : 0;
  const bestStreak = typeof v.bestStreak === "number" && v.bestStreak >= streak ? v.bestStreak : streak;
  return { correct: v.correct, total: v.total, streak, bestStreak };
}

export function readSessionScore(): SessionScore {
  try {
    const raw = storage().getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = normalize(JSON.parse(raw) as unknown);
    return parsed ?? EMPTY;
  } catch {
    // A corrupted or blocked storage (private browsing, quota) must never
    // break the exercise — it only means the tally starts back at zero.
    return EMPTY;
  }
}

export function recordSessionAnswer(correct: boolean): SessionScore {
  const current = readSessionScore();
  const streak = correct ? current.streak + 1 : 0;
  const next: SessionScore = {
    correct: current.correct + (correct ? 1 : 0),
    total: current.total + 1,
    streak,
    bestStreak: Math.max(current.bestStreak, streak),
  };
  try {
    storage().setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Same as above: the in-memory value the caller already has is what
    // renders, so a failed write only costs persistence across a reload.
  }
  return next;
}

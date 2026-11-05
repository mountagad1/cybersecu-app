/**
 * Anti-noise rules (docs/growth/GROWTH_OS.md §5), as code: a change between
 * two windows of Search Console data counts only if it clears these
 * thresholds. Everything else is reported as noise, or as too little data to
 * say anything.
 *
 * The two windows must have the same length (28 days by default) and must
 * not straddle a known confounder (Google update, deploy of the page) — that
 * part is the protocol's job, not this function's.
 */

export interface WindowMetrics {
  clicks: number;
  impressions: number;
  /** Impression-weighted average position, as Search Console reports it. */
  position: number;
}

export type Verdict = "up" | "down" | "noise" | "insufficient";

export interface Thresholds {
  /** Below this many impressions in either window, CTR and position say nothing. */
  minImpressions: number;
  /** Below this many clicks over both windows, a click change says nothing. */
  minClicks: number;
  /** Two-sided z threshold: 1.96 ≈ 95 %. */
  z: number;
  /** A position change smaller than this is noise, whatever the volume. */
  minPositionDelta: number;
}

export const DEFAULT_THRESHOLDS: Thresholds = {
  minImpressions: 200,
  minClicks: 30,
  z: 1.96,
  minPositionDelta: 3,
};

export interface Comparison {
  clicks: Verdict;
  ctr: Verdict;
  position: Verdict;
}

export function ctr(m: WindowMetrics): number {
  return m.impressions > 0 ? m.clicks / m.impressions : 0;
}

/**
 * - Clicks: under « nothing changed », clicks in two equal windows follow
 *   the same Poisson rate, so (a − b) / √(a + b) is approximately normal.
 * - CTR: two-proportion z-test on clicks / impressions.
 * - Position: no variance is available from aggregates, so a fixed minimum
 *   change on enough impressions. Lower is better: a smaller position is « up ».
 */
export function compareWindows(
  before: WindowMetrics,
  after: WindowMetrics,
  t: Thresholds = DEFAULT_THRESHOLDS,
): Comparison {
  return { clicks: clicksVerdict(before, after, t), ctr: ctrVerdict(before, after, t), position: positionVerdict(before, after, t) };
}

function clicksVerdict(before: WindowMetrics, after: WindowMetrics, t: Thresholds): Verdict {
  return countVerdict(before.clicks, after.clicks, t.minClicks, t.z);
}

/**
 * Any count over two windows of the same length (clicks, impressions,
 * indexed pages…): under « nothing changed » both follow the same Poisson
 * rate, so (a − b) / √(a + b) is approximately normal.
 */
export function countVerdict(before: number, after: number, minTotal = DEFAULT_THRESHOLDS.minClicks, z = DEFAULT_THRESHOLDS.z): Verdict {
  const total = before + after;
  if (total < minTotal) return "insufficient";
  const score = (after - before) / Math.sqrt(total);
  return Math.abs(score) < z ? "noise" : score > 0 ? "up" : "down";
}

function ctrVerdict(before: WindowMetrics, after: WindowMetrics, t: Thresholds): Verdict {
  if (before.impressions < t.minImpressions || after.impressions < t.minImpressions) return "insufficient";
  const pooled = (before.clicks + after.clicks) / (before.impressions + after.impressions);
  const se = Math.sqrt(pooled * (1 - pooled) * (1 / before.impressions + 1 / after.impressions));
  if (se === 0) return "noise";
  const z = (ctr(after) - ctr(before)) / se;
  return Math.abs(z) < t.z ? "noise" : z > 0 ? "up" : "down";
}

function positionVerdict(before: WindowMetrics, after: WindowMetrics, t: Thresholds): Verdict {
  if (before.impressions < t.minImpressions || after.impressions < t.minImpressions) return "insufficient";
  const delta = before.position - after.position;
  return Math.abs(delta) < t.minPositionDelta ? "noise" : delta > 0 ? "up" : "down";
}

/** Sum rows into one segment; position is re-weighted by impressions, never averaged. */
export function aggregate(rows: readonly WindowMetrics[]): WindowMetrics {
  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  const impressions = rows.reduce((s, r) => s + r.impressions, 0);
  const weighted = rows.reduce((s, r) => s + r.position * r.impressions, 0);
  return { clicks, impressions, position: impressions > 0 ? weighted / impressions : 0 };
}

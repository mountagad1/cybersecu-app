/**
 * Server-authoritative free-simulation quota (docs/SIMULATION_QUOTA.md).
 * Pure function: the caller supplies the already-computed usage count
 * (a real `count(*)` against simulation_usage) and limit — this module
 * has no database access, so the arithmetic is unit-testable in
 * isolation from Supabase.
 */

export interface QuotaState {
  used: number;
  limit: number;
  remaining: number;
  exhausted: boolean;
}

export function computeQuotaState(used: number, limit: number): QuotaState {
  const remaining = Math.max(0, limit - used);
  return { used, limit, remaining, exhausted: remaining === 0 };
}

/**
 * Whether a new (not-yet-answered) attempt may be graded. An active
 * entitlement bypasses quota entirely — this is the only bypass path,
 * and it's evaluated by the caller (checking `entitlements`), never
 * inferred here.
 */
export function canConsumeQuota(quota: QuotaState, hasEntitlement: boolean): boolean {
  return hasEntitlement || !quota.exhausted;
}

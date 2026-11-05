import "server-only";
import { createSupabaseAdminClient } from "@/infra/supabase/admin";
import { computeQuotaState, type QuotaState } from "@/domain/quota/checkQuota";

/** Fallback quota for a signed-in user without a per-row limit column. */
const DEFAULT_FREE_QUOTA = 10;

export interface CallerIdentity {
  anonymousSessionId: string | null;
  userId: string | null;
}

export async function hasActiveEntitlement(identity: CallerIdentity): Promise<boolean> {
  const admin = createSupabaseAdminClient();
  const query = admin.from("entitlements").select("id").eq("status", "active").limit(1);

  // Exactly one of userId/anonymousSessionId is set by contract
  // (CallerIdentity is always constructed from a resolved auth-or-anon
  // caller) — the `!` reflects that, not an unchecked assumption.
  const { data } = identity.userId
    ? await query.eq("user_id", identity.userId).returns<{ id: string }[]>()
    : await query.eq("anonymous_session_id", identity.anonymousSessionId!).returns<{ id: string }[]>();

  return Boolean(data && data.length > 0);
}

export async function getQuotaState(identity: CallerIdentity): Promise<QuotaState> {
  const admin = createSupabaseAdminClient();

  let limit = DEFAULT_FREE_QUOTA;
  if (identity.anonymousSessionId) {
    const { data: session } = await admin
      .from("anonymous_sessions")
      .select("quota_limit")
      .eq("id", identity.anonymousSessionId)
      .maybeSingle()
      .returns<{ quota_limit: number } | null>();
    if (session) limit = session.quota_limit;
  }

  const usageQuery = admin.from("simulation_usage").select("id", { count: "exact", head: true });
  const { count } = identity.userId
    ? await usageQuery.eq("user_id", identity.userId)
    : await usageQuery.eq("anonymous_session_id", identity.anonymousSessionId!);

  return computeQuotaState(count ?? 0, limit);
}

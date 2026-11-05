import "server-only";
import { computeQuotaState, type QuotaState } from "@/domain/quota/checkQuota";
import { getAnonymousSessionId } from "@/infra/anon-session/session";
import { getQuotaState, hasActiveEntitlement } from "@/infra/entitlements/repository";
import { createSupabaseServerClient } from "@/infra/supabase/server";

const DEFAULT_FREE_QUOTA = 10;

/**
 * Resolves the current caller's quota/entitlement state without ever
 * creating an anonymous session as a side effect (docs/SIMULATION_QUOTA.md
 * §3) — safe to call from a Server Component render, where cookies()
 * cannot be written anyway (only Route Handlers/Server Actions can).
 * Shared by the /api/quota route and the simulation page's initial
 * server-rendered state.
 */
export async function getCurrentQuotaState(): Promise<QuotaState & { hasEntitlement: boolean }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const identity = { anonymousSessionId: null, userId: user.id };
    const [quota, entitled] = await Promise.all([getQuotaState(identity), hasActiveEntitlement(identity)]);
    return { ...quota, hasEntitlement: entitled };
  }

  const anonymousSessionId = await getAnonymousSessionId();
  if (!anonymousSessionId) {
    return { ...computeQuotaState(0, DEFAULT_FREE_QUOTA), hasEntitlement: false };
  }

  const identity = { anonymousSessionId, userId: null };
  const [quota, entitled] = await Promise.all([getQuotaState(identity), hasActiveEntitlement(identity)]);
  return { ...quota, hasEntitlement: entitled };
}

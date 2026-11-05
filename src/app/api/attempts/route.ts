import { NextResponse } from "next/server";
import { serviceUnconfiguredResponse } from "@/app/api/_lib/configurationGuard";
import { z } from "zod";
import { canConsumeQuota } from "@/domain/quota/checkQuota";
import { getOrCreateAnonymousSessionId } from "@/infra/anon-session/session";
import { getQuotaState, hasActiveEntitlement } from "@/infra/entitlements/repository";
import { createSupabaseAdminClient } from "@/infra/supabase/admin";
import { createSupabaseServerClient } from "@/infra/supabase/server";
import { describeDataFailure, log } from "@/infra/observability/log";
import type { Database } from "@/infra/supabase/database.types";

type AttemptsInsert = Database["public"]["Tables"]["attempts"]["Insert"];

const createAttemptSchema = z.object({
  scenarioVersionId: z.string().uuid(),
});

/**
 * Starts an attempt. No login required (docs/NO_LOGIN_ARCHITECTURE.md):
 * a signed-in user's attempt is tied to their account; everyone else
 * gets (or already has) an anonymous session, created here via a
 * signed cookie if this is their first simulation. Writes go through
 * the service-role client because anonymous callers have no Supabase
 * Auth JWT for RLS to key off (docs/NO_LOGIN_ARCHITECTURE.md §4).
 */
async function handlePOST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createAttemptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const identity = user
    ? { anonymousSessionId: null, userId: user.id }
    : { anonymousSessionId: await getOrCreateAnonymousSessionId(), userId: null };

  const [quota, entitled] = await Promise.all([getQuotaState(identity), hasActiveEntitlement(identity)]);
  if (!canConsumeQuota(quota, entitled)) {
    return NextResponse.json({ error: "quota_exhausted", quota }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();

  // .insert() argument typed via `as never` — see
  // docs/decisions/0004-hand-rolled-database-types.md addendum.
  const payload: AttemptsInsert = {
    ...(identity.userId ? { user_id: identity.userId } : { anonymous_session_id: identity.anonymousSessionId! }),
    scenario_version_id: parsed.data.scenarioVersionId,
  };
  // `.single()` after an `as never`-typed insert collapses `.returns()`'s
  // override too (see docs/decisions/0004 addendum) — read back the
  // array form and index [0] instead.
  const { data, error } = await admin
    .from("attempts")
    .insert(payload as never)
    .select("id")
    .returns<{ id: string }[]>();

  if (error || !data?.[0]) {
    log.error("attempts.create_failed", describeDataFailure(error ?? new Error("empty insert result")));
    return NextResponse.json({ error: "Could not start attempt" }, { status: 500 });
  }

  return NextResponse.json({ attemptId: data[0].id }, { status: 201 });
}

/**
 * Une variable d'environnement manquante n'est pas une panne applicative : la
 * renvoyer en 500 opaque poussait le lecteur à afficher « réessayez », ce qui
 * ne pouvait jamais aboutir. 503 dit la vérité — le service n'est pas encore
 * configuré — et la cause part dans les logs, classée.
 */
export async function POST(...args: Parameters<typeof handlePOST>) {
  try {
    return await handlePOST(...args);
  } catch (error) {
    const response = serviceUnconfiguredResponse(error);
    if (response) return response;
    throw error;
  }
}

import { NextResponse } from "next/server";
import { serviceUnconfiguredResponse } from "@/app/api/_lib/configurationGuard";
import { z } from "zod";
import { gradeAttempt } from "@/domain/mistakes/classify";
import { canConsumeQuota } from "@/domain/quota/checkQuota";
import { getAnonymousSessionId } from "@/infra/anon-session/session";
import { getQuotaState, hasActiveEntitlement } from "@/infra/entitlements/repository";
import { getGradedScenarioVersionById } from "@/infra/scenarios/repository";
import { findAttackByCode } from "@/content/attacks";
import { createSupabaseServerClient } from "@/infra/supabase/server";
import { createSupabaseAdminClient } from "@/infra/supabase/admin";
import { recomputeDimensionScore } from "@/infra/scoring/recompute";
import type { AttemptsRow, Database } from "@/infra/supabase/database.types";

type AttemptDecisionsInsert = Database["public"]["Tables"]["attempt_decisions"]["Insert"];
type AttemptMistakesInsert = Database["public"]["Tables"]["attempt_mistakes"]["Insert"];
type SimulationUsageInsert = Database["public"]["Tables"]["simulation_usage"]["Insert"];

const answerSchema = z.object({ choiceId: z.string().min(1) });

/**
 * Grades a submitted choice server-side. The client never supplies (or
 * is trusted for) correctness — see docs/SECURITY_MODEL.md §3 and
 * docs/SCENARIO_ENGINE.md §3 step 5. No login required
 * (docs/NO_LOGIN_ARCHITECTURE.md): ownership is checked manually against
 * either the caller's Supabase Auth user id or their anonymous session
 * id, since anonymous rows have no RLS identity to key off.
 */
async function handlePOST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: attemptId } = await params;

  const body = await request.json().catch(() => null);
  const parsed = answerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const anonymousSessionId = user ? null : await getAnonymousSessionId();

  if (!user && !anonymousSessionId) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  const admin = createSupabaseAdminClient();

  const { data: attempt, error: attemptError } = await admin
    .from("attempts")
    .select("id, user_id, anonymous_session_id, scenario_version_id, answered_at")
    .eq("id", attemptId)
    .maybeSingle()
    .returns<AttemptsRow | null>();

  if (attemptError || !attempt) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  const isOwner = user ? attempt.user_id === user.id : attempt.anonymous_session_id === anonymousSessionId;
  if (!isOwner) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }
  if (attempt.answered_at) {
    return NextResponse.json({ error: "Attempt already answered" }, { status: 409 });
  }

  const identity = { anonymousSessionId, userId: user?.id ?? null };
  const [quota, entitled] = await Promise.all([getQuotaState(identity), hasActiveEntitlement(identity)]);
  if (!canConsumeQuota(quota, entitled)) {
    return NextResponse.json({ error: "quota_exhausted", quota }, { status: 403 });
  }

  const scenario = await getGradedScenarioVersionById(attempt.scenario_version_id);
  if (!scenario) {
    return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
  }

  let result;
  try {
    result = gradeAttempt(scenario, parsed.data.choiceId);
  } catch {
    return NextResponse.json({ error: "Invalid choice for this scenario" }, { status: 400 });
  }

  const now = new Date().toISOString();

  // `as never` on insert/update arguments — see
  // docs/decisions/0004-hand-rolled-database-types.md addendum. The
  // object literals themselves are still checked against our own
  // hand-written row interfaces before the cast.
  const decisionPayload: AttemptDecisionsInsert = {
    attempt_id: attempt.id,
    choice_id: result.choiceId,
    correct: result.correct,
  };
  await admin.from("attempt_decisions").insert(decisionPayload as never);

  if (result.mistakePatternCodes.length > 0) {
    const mistakePayloads: AttemptMistakesInsert[] = result.mistakePatternCodes.map((code) => ({
      attempt_id: attempt.id,
      mistake_pattern_code: code,
    }));
    await admin.from("attempt_mistakes").insert(mistakePayloads as never);
  }

  await admin
    .from("attempts")
    .update({ answered_at: now } as never)
    .eq("id", attempt.id);

  // Records quota usage for this attempt in the same request that grades
  // it, so usage and grading can never drift apart (docs/SIMULATION_QUOTA.md §2).
  const usagePayload: SimulationUsageInsert = identity.userId
    ? { user_id: identity.userId, attempt_id: attempt.id }
    : { anonymous_session_id: identity.anonymousSessionId!, attempt_id: attempt.id };
  await admin.from("simulation_usage").insert(usagePayload as never);

  // Cyber Reflex profile scoring only applies to signed-in users for now
  // (cyber_reflex_scores.user_id references auth.users) — anonymous
  // visitors still get graded and get their explanation, just no
  // persisted reflex dimension score yet (docs/decisions/0005).
  if (identity.userId) {
    // The attack's dimension comes from the content catalogue, not from
    // the database: the encyclopedia moved into the repository
    // (docs/decisions/0007-content-in-repository.md).
    const attack = findAttackByCode(scenario.attackCode);
    if (attack) {
      await recomputeDimensionScore(identity.userId, attack.primaryDimension);
    }
  }

  const updatedQuota = await getQuotaState(identity);

  return NextResponse.json({
    correct: result.correct,
    explanation: result.explanation,
    correctChoiceIds: scenario.correctChoiceIds,
    quota: updatedQuota,
    hasEntitlement: entitled,
  });
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

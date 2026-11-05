import { NextResponse } from "next/server";
import { serviceUnconfiguredResponse } from "@/app/api/_lib/configurationGuard";
import { canConsumeQuota } from "@/domain/quota/checkQuota";
import { getOrCreateAnonymousSessionId } from "@/infra/anon-session/session";
import { getQuotaState, hasActiveEntitlement } from "@/infra/entitlements/repository";
import { createSupabaseServerClient } from "@/infra/supabase/server";
import { dograhVoiceProvider } from "@/infra/voice/dograh/provider";
import { findVoiceSimulationBySlug } from "@/content/voice-simulations";

/**
 * Hands the browser widget an embed session, or explains why it can't
 * have one. No route currently WRITES a usage row for a voice attempt —
 * see docs/SIMULATION_COST_MODEL.md §Usage accounting, which is an
 * explicit precondition for ever setting a real `dograhEmbedToken`: the
 * schema change that makes voice attempts countable (today
 * `simulation_usage.attempt_id` requires a text `attempts` row) hasn't
 * been written, because writing it against a feature with zero live
 * callers would be exactly the kind of speculative migration this
 * project avoids elsewhere. Until that lands, this route still enforces
 * the READ side of the same gate — quota-exhausted and unentitled
 * visitors are refused a session even once a token exists — so the gap
 * is "usage isn't counted", never "the paywall doesn't apply".
 */
async function handlePOST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scenario = findVoiceSimulationBySlug(slug);
  if (!scenario) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
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

  const session = await dograhVoiceProvider.getEmbedSession(slug);
  if (!session) {
    return NextResponse.json(
      {
        error: "voice_not_configured",
        message: "Cette simulation vocale n'est pas encore disponible : essayez la version texte de cette attaque.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json(session);
}

/** Same honest-503 pattern as `/api/checkout` and `/api/attempts` — see configurationGuard.ts. */
export async function POST(...args: Parameters<typeof handlePOST>) {
  try {
    return await handlePOST(...args);
  } catch (error) {
    const response = serviceUnconfiguredResponse(error);
    if (response) return response;
    throw error;
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { serviceUnconfiguredResponse } from "@/app/api/_lib/configurationGuard";
import { getOrCreateAnonymousSessionId } from "@/infra/anon-session/session";
import { hasActiveEntitlement } from "@/infra/entitlements/repository";
import { assertConfigured } from "@/lib/env/read";
import { createSupabaseServerClient } from "@/infra/supabase/server";
import { buildPaymentLinkUrl } from "@/lib/paymentLink";
import { log } from "@/infra/observability/log";
import { SALES_OPEN } from "@/lib/sales";

const checkoutSchema = z.object({
  /**
   * Must be `true`: EU/French consumer law (art. L221-28 13° du Code de
   * la consommation) requires a buyer's explicit, prior consent to
   * immediate execution and express waiver of the 14-day withdrawal
   * right before a digital-content contract can be formed on those
   * terms — see the consent checkbox in `src/components/paywall/paywall.tsx`.
   * Rejecting a request without it means the server, not just the UI,
   * enforces the requirement.
   */
  consentImmediateExecution: z.literal(true),
});

/**
 * Resolves the caller's identity, records their consent, and returns the
 * URL of the Stripe Payment Link for the one-time €29 unlock
 * (docs/PAYMENT_ENTITLEMENT.md §2) — Stripe-Dashboard-managed rather than
 * a session created here. Never grants access itself — only the
 * signature-verified webhook (`/api/webhooks/stripe`) does that, once
 * Stripe reports the payment against the `client_reference_id` this
 * route stamps onto the redirect (src/lib/paymentLink.ts).
 */
async function handlePOST(request: Request) {
  // Sales are suspended (src/lib/sales.ts): refuse before anything else, so
  // no consent is logged and no payment link is ever handed out.
  if (!SALES_OPEN) {
    return NextResponse.json({ error: "sales_closed" }, { status: 503 });
  }

  // A Payment Link has no server-side "is this configured" check the way
  // a dynamically created session does (there is no Stripe API call to
  // fail here) — `STRIPE_WEBHOOK_SECRET` is what actually decides whether
  // a completed payment on it can ever turn into an entitlement, so that
  // is the gate: sending a visitor to pay through a webhook that can't
  // process the result would be worse than a 503.
  assertConfigured("STRIPE_WEBHOOK_SECRET");

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "consent_required" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const identity = user
    ? { anonymousSessionId: null, userId: user.id }
    : { anonymousSessionId: await getOrCreateAnonymousSessionId(), userId: null };

  if (await hasActiveEntitlement(identity)) {
    return NextResponse.json({ error: "already_entitled" }, { status: 409 });
  }

  // Evidentiary record of the withdrawal-right waiver required by art.
  // L221-28 13° du Code de la consommation (see checkoutSchema above).
  // A dynamically created session used to carry this as Stripe-hosted
  // metadata; a Payment Link cannot, so this server logs it itself,
  // server-timestamped, at the moment consent was actually given —
  // before the redirect, not after Stripe reports a completed payment.
  log.info("checkout.consent_recorded", {
    identity: identity.userId ? { userId: identity.userId } : { anonymousSessionId: identity.anonymousSessionId },
    consentImmediateExecution: true,
  });

  const url = buildPaymentLinkUrl(
    identity.userId ? { kind: "user", id: identity.userId } : { kind: "anon", id: identity.anonymousSessionId! },
  );

  return NextResponse.json({ url });
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

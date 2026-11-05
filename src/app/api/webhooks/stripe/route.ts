import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/infra/stripe/client";
import { readEnv } from "@/lib/env/read";
import { createSupabaseAdminClient } from "@/infra/supabase/admin";
import { hashEmail } from "@/infra/entitlements/recovery";
import { decodeClientReferenceId } from "@/lib/paymentLink";
import type { Database } from "@/infra/supabase/database.types";

type EntitlementsInsert = Database["public"]["Tables"]["entitlements"]["Insert"];
type PurchasesInsert = Database["public"]["Tables"]["purchases"]["Insert"];
type LicenseEventsInsert = Database["public"]["Tables"]["license_events"]["Insert"];

const POSTGRES_UNIQUE_VIOLATION = "23505";

/**
 * The only code path that ever grants an entitlement
 * (docs/PAYMENT_ENTITLEMENT.md §2). Rejects anything without a valid
 * Stripe signature before any business logic runs, and is idempotent on
 * `stripe_event_id` so a Stripe retry can never create a duplicate
 * entitlement or double-count a purchase.
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = readEnv("STRIPE_WEBHOOK_SECRET");
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await handleCheckoutCompleted(event);
  } else if (event.type === "charge.refunded") {
    await handleRefund(event);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const admin = createSupabaseAdminClient();

  // Two sources of identity, for the two ways a Checkout Session can be
  // created: `/api/checkout`'s own dynamic session stamps `metadata`
  // directly; the Stripe Payment Link flow (src/lib/paymentLink.ts) has
  // no way to set custom metadata per visitor, so it round-trips the
  // identity through `client_reference_id` instead — Stripe's documented
  // mechanism for exactly this on a Payment Link.
  const refIdentity = session.client_reference_id ? decodeClientReferenceId(session.client_reference_id) : null;

  const userId = session.metadata?.user_id ?? (refIdentity?.kind === "user" ? refIdentity.id : null);
  const anonymousSessionId =
    session.metadata?.anonymous_session_id ?? (refIdentity?.kind === "anon" ? refIdentity.id : null);
  if (!userId && !anonymousSessionId) return; // malformed/unexpected event, nothing to attach to

  // Idempotent entitlement creation: look up by the unique checkout
  // session id first (a retried webhook for the same session must not
  // create a second entitlement).
  const { data: existing } = await admin
    .from("entitlements")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle()
    .returns<{ id: string } | null>();

  let entitlementId = existing?.id;

  if (!entitlementId) {
    const email = session.customer_details?.email;
    const entitlementPayload: EntitlementsInsert = {
      ...(userId ? { user_id: userId } : { anonymous_session_id: anonymousSessionId! }),
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? undefined),
      ...(email ? { email_hash: hashEmail(email) } : {}),
    };
    const { data: created } = await admin
      .from("entitlements")
      .insert(entitlementPayload as never)
      .select("id")
      .returns<{ id: string }[]>();
    entitlementId = created?.[0]?.id;
  }

  if (!entitlementId) return;

  // Idempotency on the webhook event itself: a unique-violation here
  // means this exact event was already processed (Stripe retry).
  const purchasePayload: PurchasesInsert = {
    entitlement_id: entitlementId,
    stripe_event_id: event.id,
    amount_cents: session.amount_total ?? 0,
    currency: session.currency ?? "eur",
  };
  const { error: purchaseError } = await admin.from("purchases").insert(purchasePayload as never);
  if (purchaseError && (purchaseError as { code?: string }).code === POSTGRES_UNIQUE_VIOLATION) {
    return; // already processed
  }

  const eventPayload: LicenseEventsInsert = {
    entitlement_id: entitlementId,
    event_type: "created",
    metadata: { stripe_checkout_session_id: session.id },
  };
  await admin.from("license_events").insert(eventPayload as never);
}

async function handleRefund(event: Stripe.Event) {
  const charge = event.data.object as Stripe.Charge;
  const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) return;

  const admin = createSupabaseAdminClient();
  const { data: entitlement } = await admin
    .from("entitlements")
    .select("id")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle()
    .returns<{ id: string } | null>();

  if (!entitlement) return;

  await admin.from("entitlements").update({ status: "revoked" } as never).eq("id", entitlement.id);

  const eventPayload: LicenseEventsInsert = {
    entitlement_id: entitlement.id,
    event_type: "revoked",
    metadata: { stripe_charge_id: charge.id, reason: "refunded" },
  };
  await admin.from("license_events").insert(eventPayload as never);
}

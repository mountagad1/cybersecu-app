import { readEnv } from "@/lib/env/read";

/**
 * The Stripe Payment Link backing the €29 unlock, in place of a
 * dynamically created Checkout Session. Deliberately NOT `server-only`:
 * the client redirects the browser straight to it, so this constant is
 * read from both `/api/checkout` (to build the redirect URL server-side)
 * and nowhere else — the client only ever receives the finished URL.
 *
 * A raw Payment Link carries no per-visitor metadata on its own, which is
 * exactly what `/api/webhooks/stripe` needs to know who to grant access
 * to. `client_reference_id` is Stripe's documented mechanism for this on
 * Payment Links: passed as a query parameter here, Stripe copies it onto
 * the resulting Checkout Session, where the webhook reads it back
 * (`session.client_reference_id`) as it already does `session.metadata`.
 *
 * Overridable via `STRIPE_PAYMENT_LINK_URL` (src/lib/env/registry.ts),
 * falling back to this hardcoded production link. This constant is a
 * single fixed URL, not derived per deployment the way `STRIPE_SECRET_KEY`
 * is — a preview/staging deployment running Stripe TEST-mode keys would
 * otherwise still redirect every visitor to this LIVE link: the charge
 * would be real, but the resulting live-mode `checkout.session.completed`
 * event can never reach a test-mode `STRIPE_WEBHOOK_SECRET`, so the
 * entitlement is never granted. Any environment using test-mode Stripe
 * keys must set `STRIPE_PAYMENT_LINK_URL` to a matching test-mode Payment
 * Link.
 */
export const STRIPE_PAYMENT_LINK_URL =
  readEnv("STRIPE_PAYMENT_LINK_URL") ?? "https://buy.stripe.com/xxxxxxxxxxxxxxxxxxxxxxx";

export type PaymentLinkIdentity = { kind: "user"; id: string } | { kind: "anon"; id: string };

/** `user:<uuid>` / `anon:<uuid>` — parsed back by the webhook, see repository.ts. */
export function encodeClientReferenceId(identity: PaymentLinkIdentity): string {
  return `${identity.kind}:${identity.id}`;
}

export function decodeClientReferenceId(value: string): PaymentLinkIdentity | null {
  const [kind, id] = value.split(":", 2);
  if ((kind === "user" || kind === "anon") && id) return { kind, id };
  return null;
}

export function buildPaymentLinkUrl(identity: PaymentLinkIdentity): string {
  const url = new URL(STRIPE_PAYMENT_LINK_URL);
  url.searchParams.set("client_reference_id", encodeClientReferenceId(identity));
  return url.toString();
}

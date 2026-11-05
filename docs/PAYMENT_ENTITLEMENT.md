# Payment & Entitlement (one-time €29 unlock)

## 1. Model

One product, one price, no subscription: €29 once, unlocks every
simulation (current and future) for the purchasing anonymous session
(and, if they later sign in, for that account too — not built this
pass, tracked as a follow-up).

```
entitlements
  id                       uuid primary key
  anonymous_session_id     uuid references anonymous_sessions, nullable
  user_id                  uuid references auth.users, nullable
  status                   text ('active' | 'revoked')
  stripe_checkout_session_id  text unique
  stripe_payment_intent_id    text
  product_id               text  -- 'premium-unlock-2026'
  created_at                timestamptz
  updated_at                timestamptz
  check (anonymous_session_id is not null) != (user_id is not null)

purchases
  id                       uuid primary key
  entitlement_id           uuid references entitlements
  stripe_event_id          text unique   -- idempotency
  amount_cents             int
  currency                 text
  created_at                timestamptz

license_events
  id                uuid primary key
  entitlement_id    uuid references entitlements
  event_type        text ('created' | 'revoked' | 'restored')
  metadata          jsonb
  created_at        timestamptz

recovery_tokens
  id                uuid primary key
  entitlement_id    uuid references entitlements
  email_hash        text        -- sha-256, never store raw email at rest longer than needed for delivery
  token_hash        text unique -- sha-256 of the token; raw token only ever exists in the emailed link
  expires_at        timestamptz
  used_at           timestamptz
  created_at        timestamptz
```

## 2. Purchase flow

The €29 unlock is a Stripe **Payment Link** (Dashboard-managed:
`https://buy.stripe.com/xxxxxxxxxxxxxxxxxxxxxxx`, id
`plink_xxxxxxxxxxxxxxxxxxxxxxxx`), not a Checkout Session created per
visitor. `src/lib/paymentLink.ts` holds the URL and the
encode/decode helpers described below.

```
Browser (paywall popup, "Débloquer" button)
  → POST /api/checkout        (records consent, resolves identity — no Stripe API call)
  → redirect to the Stripe Payment Link, with
    ?client_reference_id=<user:UUID | anon:UUID>
  → user pays on Stripe's hosted page
  → Stripe redirects back wherever the Payment Link's own
    "after payment" setting points (configured in the Dashboard on the
    link itself, not by this app)
  → Stripe ALSO sends a webhook: checkout.session.completed,
    carrying that client_reference_id on the resulting session
  → POST /api/webhooks/stripe               (signature-verified)
       → grants the entitlement server-side
```

A Payment Link has no server-side call this app makes when building the
redirect — there is nothing to fail the way a Checkout Session create
call could. So `/api/checkout` instead gates on
`STRIPE_WEBHOOK_SECRET` being configured: a Payment Link that pays out to
a webhook which can't verify (or hasn't been deployed) would silently
strand a paying visitor without an entitlement, which is worse than a
503 up front.

**Identity round-trip.** A dynamically created Checkout Session could
carry `metadata.user_id` / `metadata.anonymous_session_id` directly, set
at creation. A Payment Link is fixed content shared by every visitor —
there is no per-visitor metadata to set on it. Stripe's documented
mechanism for this case is `client_reference_id`, passed as a query
parameter on the Payment Link URL; Stripe copies it onto the resulting
Checkout Session, and the webhook reads it back exactly like it would
`metadata`. `encodeClientReferenceId`/`decodeClientReferenceId` in
`src/lib/paymentLink.ts` format it as `user:<uuid>` or `anon:<uuid>`;
`handleCheckoutCompleted` in the webhook checks `session.metadata` first
(preserved for any future dynamic-session path) and falls back to
`session.client_reference_id`.

**Consent, without Stripe metadata to carry it.** The dynamic-session
flow used to stamp `consent_immediate_execution: "true"` onto the
session's own metadata as the evidentiary record required by art.
L221-28 13° du Code de la consommation. A Payment Link can't carry that
either, so `/api/checkout` now logs the consent itself
(`checkout.consent_recorded`), server-timestamped, at the moment the
visitor actually gave it — before the redirect, not reconstructed after
the fact from a webhook payload.

**Critical rule, unchanged and still enforced in code, not just
documented**: nothing in this flow grants access by itself except the
webhook. `checkout.session.completed` events are verified via
`stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET` — a request
with a missing/invalid signature is rejected with `400` before any
business logic runs. The webhook handler is idempotent on
`stripe_event_id` (unique constraint) so a Stripe retry can't create a
duplicate entitlement. Client-side, the app polls `GET /api/quota`
(which reflects `hasEntitlement`) rather than trusting anything in the
redirect itself.

## 3. Paywall UI

Shown once quota is exhausted (or proactively on `/simulations` once
`used >= limit`). Copy follows the brief's messaging rules exactly:
- "Débloquer toutes les simulations" (not "Subscribe"/"S'abonner").
- "Paiement unique — 29 €" and "Aucun abonnement" stated explicitly.
- "Accès aux simulations actuelles et futures" stated explicitly.
- No fake countdown, no fake "3 people bought this in the last hour"
  social-proof widgets, no pre-checked upsells.

## 4. Access restoration (no password, no account)

```
POST /api/access/restore-request  { email }
  → looks up any active entitlement whose recovery record matches
    sha256(email) (constant-time comparison against stored hashes,
    so the query itself doesn't leak existence via timing)
  → always returns the same 202 response whether or not a match was
    found (no account-enumeration signal, per brief §access_restoration)
  → if a match exists: generates a random 32-byte token, stores only
    its sha-256 hash + a 30-minute expiry, and emails the raw token as
    a link (`/restaurer?token=...`) via the configured email provider

POST /api/access/restore-verify   { token }
  → hashes the submitted token, looks up an unused, unexpired
    recovery_tokens row
  → marks it used_at (single-use)
  → re-issues the anonymous session cookie for that entitlement's
    session (or, if none exists yet for this browser, creates one and
    attaches the entitlement to it)
  → rate-limited per IP and per token to blunt brute-forcing a 32-byte
    token space (already computationally infeasible, this is defense
    in depth, not the primary control)
```

**Known gap, documented rather than faked**: actually sending the
recovery email requires an email provider. `src/infra/email/send.ts`
throws a clear configuration error if `RESEND_API_KEY` is unset rather
than silently pretending to send — this environment has no email
provider credentials, so the restoration flow's token
generation/verification is implemented and unit-testable, but the
end-to-end "receive an email, click it" path cannot be exercised until
a real `RESEND_API_KEY` is configured. Tracked as a follow-up, not
claimed as done.

## 5. Revocation

`entitlements.status = 'revoked'` (e.g. a Stripe refund/chargeback
webhook — `charge.refunded` — flips it) immediately removes premium
access on the next `GET /api/quota` check; a `license_events` row
records why, for support/audit purposes.

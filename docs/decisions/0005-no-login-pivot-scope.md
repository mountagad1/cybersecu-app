# 0005 — No-login + quota + one-time-payment pivot: what ships this pass

**Context**: A new master prompt repositions the product from
"authenticated learner with a Cyber Reflex profile" to "anonymous
visitor gets 10 free simulations, then a €29 one-time Stripe payment
unlocks everything, no account required." It also specifies a much
larger attack taxonomy (40 categories, a richer relationship graph),
guides, admin CMS, GEO/AI-search optimization, and a full audit suite.

**Decision**: This pass ships the architecturally novel, business-model-
critical core — the part every other feature now depends on — and
explicitly defers the rest, following the same discipline as
`0001-scope-vertical-slice-first.md`:

**Shipped this pass**:
- Anonymous session issuance/verification (signed cookie, no Supabase
  Auth requirement for playing simulations).
- Server-authoritative 10-free-simulation quota, enforced against a DB
  row per anonymous session, not a client-trusted counter.
- Database schema for entitlements/purchases/license events/recovery
  tokens.
- Stripe Checkout (one-time payment, not subscription) + webhook route
  with signature verification, granting an entitlement only after a
  verified `checkout.session.completed` event — never from the client.
- Paywall UI shown once the quota is exhausted.
- Access-restoration token mechanism (request + verify), with the email
  *sending* step abstracted behind a function that fails loudly if
  `RESEND_API_KEY` isn't configured — not silently faked.

**Explicitly deferred** (tracked as follow-up phases, matching the
brief's own phase numbering where useful):
- The full 40-category taxonomy, `attack_aliases`,
  `attack_relationships` as a first-class graph beyond the existing
  `related_attacks`/`attack_triggers`/`attack_indicators` tables, and
  `sources`/`mitigations` as separate entities. The existing schema
  already covers a workable subset; expanding it is additive content
  modeling, not something the payment pivot depends on.
- `/guides`, `/arnaques`, `/seniors`, `/entreprises` routes.
- Admin CMS UI.
- GEO-specific structured-data audit beyond what's already documented in
  `SEO_ARCHITECTURE.md`.
- Full E2E test suite, accessibility audit, performance audit,
  `FINAL_PRODUCTION_AUDIT.md`.
- Existing authenticated flow (Supabase Auth signup/login) is **not**
  removed — no page for it exists yet either, so there's nothing to
  rip out. The `attempts` table is migrated to support both an
  authenticated `user_id` and an anonymous `anonymous_session_id`,
  so the underlying scoring/mistake-classification engine keeps
  working unchanged for both paths.

**Why**: Attempting all of the above in one pass would produce exactly
the "placeholder architecture presented as finished" the brief itself
warns against. The payment/entitlement/quota system is the one piece
that changes the security model (who can write what, server-authoritative
checks) and therefore has to be built and verified carefully before
anything else is layered on top of it.

**Tradeoffs**: The site still only has one fully-authored attack/scenario
(smishing). The taxonomy/category list from the new prompt is recorded in
`ATTACK_TAXONOMY.md` as the target shape, not yet reflected in the
database as 40 populated categories.

**Future migration path**: Each deferred item becomes its own follow-up
pass, content-authored or engineered incrementally against the schema
shipped here — no further architecture changes needed to add more
categories, guides, or admin tooling.

# No-Login Architecture

## 1. Principle

There is no mandatory account in this product. A first-time visitor can
immediately play simulations. Supabase Auth (already present in the
codebase from the prior authenticated-profile design) is **not** removed,
but it is no longer required to use the core product — it becomes an
optional path for a future "sync my history across devices" feature, not
built this pass.

## 2. Anonymous session

Every visitor is assigned an anonymous session on first contact:

```
anonymous_sessions
  id                uuid primary key
  created_at        timestamptz
  last_seen_at      timestamptz
  quota_limit       int (default 10 — see SIMULATION_QUOTA.md)
```

The session is represented client-side by a **signed, httpOnly, first-
party cookie** (`csa` — cybersecu session anon) containing the session
`id` plus an HMAC signature computed server-side with a secret
(`ANON_SESSION_SECRET`, server-only). The raw session id is never trusted
alone — every read verifies the signature before touching the database,
so a client cannot forge or guess another visitor's session id and
inherit their quota/entitlement.

```
cookie value = "<uuid>.<base64url(hmac_sha256(secret, uuid))>"
```

This is deliberately **not** a JWT — no need for the complexity, and a
raw HMAC-signed value keeps the implementation auditable in a few lines
(`src/infra/anon-session/token.ts`).

Rules:
- The cookie is issued the first time a visitor hits any route that needs
  a session (simulation play, quota check) — not on every page load.
- `last_seen_at` is bumped on use; sessions are not proactively expired
  in v1 (there is no user-hostile "your free trial expired" clock — the
  10-simulation quota is what limits free usage, not time).
- The session id is never exposed in a URL, only in the cookie — avoids
  it leaking via referrer headers or being trivially shared.
- IP address is never used as identity. It may be used as a secondary,
  soft rate-limiting signal (e.g. capping session-creation rate per IP)
  once abuse is observed, but is never logged as part of a
  session/entitlement record and never sent to the client.

## 3. What anonymous data we do and don't collect

Collected, tied to the anonymous session id only:
- Which scenario versions were attempted, the choice made, correctness,
  mistake pattern codes (same shape as the previously-authenticated
  design — see `DOMAIN_MODEL.md` §5).
- Quota usage count.

Never collected for anonymous users:
- Name, IP address as identity, device fingerprint, contacts, message
  content, precise location.

If a visitor purchases premium access and later requests access
restoration, they voluntarily provide an email address for that specific
purpose (see `PAYMENT_ENTITLEMENT.md` §4) — that email is stored only
against the entitlement/recovery record, not merged into a marketing or
analytics profile.

## 4. Database write path for anonymous users

Anonymous visitors have no Supabase Auth JWT, so Postgres RLS policies
keyed on `auth.uid()` cannot authorize their writes. Two options exist:
(a) give the anon Postgres role broad insert policies gated by
apossibly-forgeable client-supplied session id, or (b) validate the
signed cookie in the Route Handler (trusted server code) and perform the
write with the service-role client. This codebase uses **(b)**: every
anonymous write goes through `createSupabaseAdminClient()` only after the
Route Handler has independently verified the session cookie's HMAC
signature. This keeps the "never trust the client" boundary at the
application layer, where the signature check actually lives, rather than
trying to encode signature verification into a Postgres RLS policy
(which cannot execute HMAC verification against a server secret).

RLS on `anonymous_sessions`, `simulation_usage`, `entitlements`, and
`purchases` therefore denies `anon`/`authenticated` role access entirely
(service-role only) — see `supabase/migrations/0003_no_login_pivot.sql`.

## 5. Interaction with the existing authenticated design

The previously-built authenticated flow (`attempts.user_id` →
`auth.users`, RLS `user_id = auth.uid()`) is preserved unchanged for a
signed-in user. `attempts.user_id` is now nullable and a new
`attempts.anonymous_session_id` column is added (also nullable); exactly
one of the two must be set (`docs/decisions/0005`, enforced by a CHECK
constraint). `gradeAttempt`/`recomputeDimensionScore` in
`src/domain`/`src/infra` are unchanged — they operate on a
scenario/attempt regardless of who owns it.

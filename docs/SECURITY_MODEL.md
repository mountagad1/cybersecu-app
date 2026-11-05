# Security Model — cybersecu.app

## 1. Authentication

Supabase Auth (email/password to start; MFA support left available via
Supabase's built-in TOTP enrollment, exposed once auth ships). Sessions
are cookie-based (`@supabase/ssr`), httpOnly, secure, `sameSite=lax`.
Never store the service-role key or any secret in a `NEXT_PUBLIC_*`
variable. `.env.example` documents every required variable with no values.

## 2. Authorization — never client-only

- Every table holding user data has **Row Level Security enabled**, with
  policies scoped to `auth.uid()`. The application never relies on
  `if (user.role === 'admin')` in a Client Component as the *only* gate —
  admin routes re-check role server-side (Route Handler / Server
  Component) against a `profiles.role` column protected by its own RLS
  (users cannot self-promote: `UPDATE` on `role` is restricted to the
  service role / a dedicated admin RPC, not exposed to the `authenticated`
  policy).
- Public read tables (`attacks`, `scenario_versions` where
  `published_at is not null`, `indicators`, `psychological_triggers`,
  `learning_objectives`) get permissive `SELECT` policies for `anon` +
  `authenticated` — this is intentionally public knowledge, not gated.
- `attempts`, `attempt_decisions`, `attempt_mistakes`,
  `cyber_reflex_profile`, `cyber_reflex_scores`: `SELECT`/`INSERT` policies
  scoped to `user_id = auth.uid()`. No `UPDATE`/`DELETE` policy is granted
  to `authenticated` — attempts are immutable once submitted (score
  integrity); only the owning user can create their own, only the service
  role can bulk-manage them (e.g. GDPR deletion).

## 3. Input handling

- All API route handlers validate request bodies with `zod` schemas
  before touching the database — untrusted input is never passed to a
  query builder unvalidated.
- Scenario "choice" submission validates the submitted `choice_id`
  against the actual `scenario_versions.choices` for that version
  server-side; the client's claimed correctness is never trusted for
  scoring — scoring/mistake classification is recomputed server-side from
  the stored scenario version.
- All Postgres access goes through the Supabase client (parameterized
  queries) — no raw string-interpolated SQL, eliminating SQL injection by
  construction.
- Output rendered from user-controlled or admin-authored rich text (guide
  content) is rendered through a sanitized markdown/MDX pipeline, never
  `dangerouslySetInnerHTML` on raw stored HTML.

## 4. SSRF

The platform must never fetch a user-supplied URL server-side (e.g. "link
preview" features are explicitly not built, precisely because the product
teaches "don't click unknown links" — building a URL-fetching feature
would be both a security liability and thematically wrong for the
product). If any future feature needs to validate a URL's reachability, it
goes through an allow-listed proxy with private-IP-range blocking — tracked
as a decision record if/when it's actually needed, not built speculatively
now.

## 5. Rate limiting & abuse

Write endpoints (`/api/attempts`, auth endpoints) get per-IP + per-user
rate limiting once deployed behind Cloudflare (edge rate limiting rules)
plus an application-level check via a `rate_limit_events` table or
Upstash-style token bucket — deferred to the API-hardening pass (section 7
of ARCHITECTURE.md), not fabricated as "done" in this pass.

## 6. Uploads

Not implemented yet (no upload feature ships in this pass). When built:
validate MIME type by content sniffing (not just extension), enforce size
limits, store in Supabase Storage with a private bucket + signed URLs,
never execute or serve uploaded content as HTML/script.

## 7. Secrets

`.env.example` lists: `SUPABASE_URL`,
`SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only),
`SUPABASE_DB_URL` (migrations). No `.env` file is committed. No secret
value appears anywhere in this repository.

None of the Supabase variables carries a `NEXT_PUBLIC_` prefix, so none is
inlined into the client bundle. The anon key is RLS-bound rather than
secret, but keeping it server-side removes it from the browser's reach
entirely; the trade-off is that a Client Component cannot construct its own
Supabase client — a Server Component must pass the URL and anon key down
(`src/infra/supabase/client.ts`). The pre-rename `NEXT_PUBLIC_SUPABASE_URL`
/ `NEXT_PUBLIC_SUPABASE_ANON_KEY` names are still read as a fallback by
`src/infra/supabase/env.ts`, for environments not yet renamed.

## 8. Privacy by design

No private message/SMS/email content is ever collected from real users —
simulations are entirely synthetic fictional content authored by the
platform. User attempts store only: which scenario version, which choice,
timestamp, derived mistake pattern codes — never free text the user
typed, unless a future free-text reflection feature is explicitly
consent-gated and documented. Account deletion cascades attempts (or
anonymizes aggregate counters — decision left open, tracked in
`docs/decisions/0004-data-retention.md` to resolve before shipping
account deletion).

## 9. Threats explicitly modeled for this domain

- **IDOR** on `attempts`/`profile` — closed by RLS `user_id = auth.uid()`,
  verified by a unit/integration test asserting a second user cannot read
  another's attempt via the API.
- **Privilege escalation via role self-update** — closed by not exposing
  `role` in any `authenticated`-writable policy.
- **Scenario answer leakage** — `correct_choice_ids` and
  `explanations` must not be present in the payload sent to the client
  before the user answers; the public API returns the unanswered
  scenario shape, and correctness/explanation is only included in the
  response to a submitted attempt.

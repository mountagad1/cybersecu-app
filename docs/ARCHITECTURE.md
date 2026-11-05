# Architecture — cybersecu.app

## 1. Stack (as mandated, no deviation without a documented reason)

Next.js (App Router) + TypeScript + React + Tailwind + shadcn/ui + Lucide,
deployed on Vercel. Supabase Postgres for data, Supabase Auth for
authentication, Supabase Storage for uploads. Stripe (deferred until
billing is built), Resend (transactional email, deferred), PostHog
(analytics, deferred), Sentry (errors, deferred), Cloudflare in front for
DNS/WAF (operated outside this repo). Package manager: pnpm. Single
repository, no monorepo — the project does not yet need one.

## 2. Route structure

```
app/
  (marketing)/                 # public, SEO-critical, mostly static/SSG
    page.tsx                   # homepage
    attaques/page.tsx
    attaques/[slug]/page.tsx
    guides/page.tsx
    guides/[slug]/page.tsx
    simulations/page.tsx
    simulations/[slug]/page.tsx
    seniors/page.tsx
    layout.tsx
  (app)/                       # authenticated product
    dashboard/page.tsx
    simulations/[slug]/page.tsx  # interactive play route
    profil/page.tsx
    layout.tsx                 # enforces session, senior-mode toggle
  admin/                       # private CMS, admin-only
    attaques/...
    scenarios/...
    layout.tsx                 # server-side admin check, not just UI hiding
  api/
    attempts/route.ts
    scenarios/[id]/route.ts
    admin/...
  layout.tsx                   # root: fonts, theme, metadata defaults
  sitemap.ts
  robots.ts
```

Route groups isolate rendering strategy: `(marketing)` is Server
Components + `generateStaticParams`/ISR, `(app)` is Server Components with
Client Component islands only where interaction is required (the
simulation player, the decision buttons), `admin` is server-rendered and
gated by a server-side role check on every request (never a client-only
check).

## 3. Rendering strategy

- `(marketing)/attaques/[slug]` and `/guides/[slug]`: `generateStaticParams`
  + `export const revalidate = 3600` (ISR). Content comes from Postgres via
  a server-side fetch at build/revalidate time — never from client-side
  data fetching, so the page is fully crawlable with JS disabled.
- `/simulations/[slug]` (public preview): SSG the article shell (attack
  context, explanation, SEO copy); the interactive preview widget is a
  Client Component boundary that hydrates independently — it must not
  block or gate the surrounding text content from being indexed.
- `(app)/*`: SSR per-request (session-dependent), or client-fetched via
  a typed API layer for interaction-heavy views (attempt submission).
- `admin/*`: SSR, `noindex`, session + role required server-side before
  any query runs.

## 4. Domain layer (framework-agnostic)

```
src/domain/
  attack/           # attack graph read models, related-attack traversal
  scenario/         # scenario genome types, version publishing rules
  scoring/          # cyber reflex scoring formula (pure functions, unit-tested)
  mistakes/         # mistake pattern derivation from a submitted choice
  adaptive/         # next-scenario selection (v1: weakness-weighted random)
```

These modules take/return plain TypeScript types and a repository
interface (implemented against Supabase in `src/infra/`), so scoring and
mistake classification are unit-testable without a database.

## 5. Data access

`src/infra/supabase/{server,client,admin}.ts` — three distinct clients:
- `server.ts`: request-scoped, cookie-based session client used in Server
  Components/Route Handlers. RLS applies.
- `client.ts`: browser client for the few places that need it (auth forms,
  the simulation player's optimistic UI). RLS applies; anon key only.
- `admin.ts`: service-role client, **server-only**, imported only inside
  `admin/` route handlers and background jobs, never reachable from a
  Client Component bundle. Guarded by an explicit role check before any
  query, not relied upon as the sole boundary — RLS still applies to the
  tables it's used against where feasible, service role is reserved for
  the few operations that legitimately need to bypass RLS (e.g. publishing
  a scenario version, computing aggregate analytics).

## 6. AI layer (deferred, documented placement)

Per section 25 of the brief, AI is an adaptation layer, not a source of
truth. When implemented it sits at `src/domain/ai/` and only ever:
(a) reads structured attack/scenario data as input, (b) produces
personalization output (simplified language, audio script) that is stored
and reviewed like any other content, never rendered live/unreviewed to
users. Not implemented in this pass — no AI provider is wired up yet.

## 7. What is deferred (explicitly out of scope this pass)

> **Repositioning note (2026-08-24)**: the product pivoted to a no-login,
> quota-then-one-time-payment model — see `docs/decisions/0005`,
> `docs/NO_LOGIN_ARCHITECTURE.md`, `docs/SIMULATION_QUOTA.md`,
> `docs/PAYMENT_ENTITLEMENT.md`. Item 6 below ("Auth ... user dashboard")
> is superseded: signing in is no longer the primary path — Supabase Auth
> stays available underneath (an authenticated `attempts.user_id` row
> still works) but no login page exists yet and none is required for the
> core product. Stripe billing (previously listed as deferred) has since
> shipped as a one-time payment, not a subscription.

- Organizations/business tier, family accounts.
- Admin CMS UI (schema + repository layer ships now; UI is next).
- PostHog/Sentry wiring (event taxonomy documented, SDKs not installed
  yet — avoids an unused dependency per principle 1.2).
- Senior-mode full visual theme (the data model supports
  `target_profile`, the dedicated UI is a follow-up).
- Full 30–50 scenario content library (one real scenario ships as the
  vertical-slice proof; content authoring is a content-ops task, not
  purely an engineering one, and is tracked as its own workstream).
- The full 40-category encyclopedia taxonomy (`docs/ATTACK_TAXONOMY.md` §0).
- `/guides`, `/arnaques`, `/seniors`, `/entreprises` routes.
- E2E test suite (unit tests ship for the domain/quota layer this pass;
  E2E needs a deployed environment to be meaningful — and, for the
  payment flow specifically, real Stripe test-mode keys and a live
  webhook endpoint, neither available in this sandbox).
- Actual delivery of the access-restoration email (RESEND_API_KEY not
  configured in this environment — the token issue/verify logic is
  implemented and could be unit-tested, sending itself cannot be
  exercised end-to-end yet; see `docs/PAYMENT_ENTITLEMENT.md` §4).
- Rate limiting on quota/restoration endpoints beyond what's structurally
  in place (signed cookie, single-use/expiring tokens) — needs
  infrastructure (e.g. Upstash) not yet provisioned.

## 8. MVP implementation sequence (proposed)

1. ✅ Docs (this pass).
2. ✅ Next.js scaffold + tooling (this pass).
3. ✅ Database schema + RLS + seed data (this pass).
4. ✅ Domain engine (attack graph read, scoring, mistake classification) +
   unit tests (this pass).
5. ✅ One vertical slice: `/attaques/smishing-banque` SEO page +
   `/simulations/sms-banque` playable simulation, wired to real DB data
   (this pass).
6. ✅ No-login pivot: anonymous sessions, server-authoritative 10-free
   quota, Stripe one-time-payment entitlements, access restoration
   (later pass — see `docs/decisions/0005`).
7. ✅ One published simulation per published attack, and the adaptive
   next-scenario step of the learning loop wired end to end
   (`seed/0003`, `GET /api/simulations/next` — see `LEARNING_ENGINE.md` §3).
8. Admin CMS UI for attack/scenario CRUD + versioning + publish workflow.
9. Expand content library toward the 30–50 scenario MVP target, and
   toward the full encyclopedia taxonomy.
10. SEO polish: sitemap/robots wiring to real content, JSON-LD, OpenGraph
    images.
11. Observability (Sentry, PostHog) + rate limiting on write endpoints.
12. Senior mode dedicated theme + accessibility audit pass.
13. E2E tests against a deployed preview, including a real Stripe
    test-mode checkout → webhook → entitlement round trip.

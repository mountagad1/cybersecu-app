# Project Audit — cybersecu.app

Date: 2026-08-23
Author: Principal architect session (Claude Code)

## 1. Repository state

The `mountagad1/cybersecu` repository is **empty**: no commits, no branches
other than the working branch (`claude/cybersecu-app-architecture-pza80u`),
no `package.json`, no source files, no CI configuration, no `.env.example`.
This is a greenfield project. There is nothing to preserve or migrate, and
no existing conventions to respect.

Consequence: Phase 0 (recon) surfaces no risks from legacy code. The risks
for this project are entirely forward-looking — scope size, and the
temptation to over-build before validating the core learning loop.

## 2. Constraints observed

- No deployment target configured yet (no Vercel project linked visible
  from the repo).
- No Supabase project reference committed (expected — secrets must never
  be committed; `.env.example` will document required variables without
  values).
- No design assets in-repo. The provided logo (shield + padlock, navy/blue/
  teal gradient, "cybersecu.app" wordmark, tagline "Développez vos
  réflexes. Évitez les pièges. Restez en sécurité.") defines the palette:
  navy (`#0B1220`-ish dark), blue (`#2563EB`-ish), teal (`#0FB5AE`-ish) —
  encoded as design tokens rather than the raster image itself, since
  Tailwind/shadcn need CSS values, not a PNG. The image will be added as
  `/public/logo.png` and used to derive `/public/favicon` assets.

## 3. Decision: scope this session

The master prompt specifies a full production platform (30–50 simulations,
full SEO architecture, admin CMS, adaptive learning engine, Stripe billing,
multi-persona UX, etc.). That is multiple weeks of staff-engineer work, not
a single implementation pass. Building it all at once, unvalidated, would
directly violate the stated engineering principles (no placeholder
architecture presented as finished, no giant unreviewable diffs, ship
production-grade increments).

This session therefore:

1. Produces the architecture documents required by Phase 1.
2. Scaffolds the Next.js app skeleton (route groups, config, tooling)
   with production-grade conventions — no business logic yet.
3. Implements the database schema (Phase 2) as reviewable migrations with
   RLS, for the core domain (attacks, vectors, channels, triggers,
   indicators, scenarios, scenario versions, attempts, mistake patterns,
   reflex profile).
4. Implements one vertical slice end-to-end (Phase 3–4): the attack
   knowledge domain engine + one real, fully-worked simulation
   (SMS bank-impersonation smishing) with scoring and mistake
   classification, both as a public SEO page and as an authenticated
   simulation — proving the architecture works before it is replicated
   30–50 times.
5. Documents what is deliberately deferred and the concrete next steps.

Everything else in the master prompt (Stripe billing, admin CMS UI,
PostHog/Sentry wiring, senior-mode full theming, family accounts,
enterprise reporting, 30–50 scenario content library) is **explicitly out
of scope for this pass** and listed in the roadmap section of
`ARCHITECTURE.md`. Claiming otherwise would be exactly the kind of
placeholder-presented-as-finished output principle 1.2 forbids.

## 4. Risks identified

- **Scope creep risk**: the spec is large enough that a well-meaning
  attempt to "just do it all" produces unreviewable, untested code. Mitigated
  by the phased vertical-slice approach above.
- **AI-content risk**: the moat is explicitly *not* AI-generated content
  (section 0). The domain engine must treat attacks/scenarios as
  structured, versioned data — not LLM output at request time. This shapes
  the schema (Phase 2) more than the UI.
- **RLS correctness**: since Supabase Postgres + RLS is the auth boundary
  for user attempts and profiles, every table holding user data needs a
  reviewed policy before any UI reads/writes it. Treated as a blocking
  dependency for Phase 4.
- **SEO/interactivity split**: attack encyclopedia pages must render
  server-side without client JS for the content, while the simulation
  embedded on the same page is inherently interactive. Solved via Server
  Components for the article shell + an isolated Client Component island
  for the simulation widget.

## 5. Repositioning audit (2026-08-24) — no-login + one-time payment

**State at repositioning time**: the app was live on Vercel (draft PR
#1) with a Supabase-Auth-gated authenticated simulation flow (RLS keyed
to `auth.uid()`), one fully-authored attack/scenario, PWA install
support, and privacy/terms pages. No Stripe integration, no anonymous
session mechanism, no quota system existed.

**New requirement**: remove the login requirement entirely for the core
product; gate access via a server-authoritative 10-free-simulation quota
tied to an anonymous session instead of an account; monetize via a single
€29 Stripe one-time payment (not a subscription) that grants a durable
entitlement recoverable without a password.

**Preserved, not rebuilt**: the scoring/mistake-classification domain
engine (`src/domain/`), the scenario data model and its immutability/
publish-gate triggers, the SEO page architecture, and the PWA/privacy
pages are all reused unchanged — only the identity/access layer around
them changes. The existing Supabase Auth code path is left in place
(nothing currently depends on removing it) rather than deleted, per the
"never delete existing functionality without documenting why" rule —
there is no login *page* built yet for a user to lose access to.

**New docs**: `docs/NO_LOGIN_ARCHITECTURE.md`,
`docs/SIMULATION_QUOTA.md`, `docs/PAYMENT_ENTITLEMENT.md`,
`docs/decisions/0005-no-login-pivot-scope.md` — the latter records
exactly what ships in this pass versus what's deferred (full 40-category
taxonomy, guides/admin/GEO audit, email delivery for access recovery
pending real `RESEND_API_KEY`).

**New risk**: the payment/entitlement system is the first place this
codebase handles money and durable access grants outside a database the
user can just delete their own row from. It is treated with the same
"server is the only authority" discipline as attempt grading
(`SECURITY_MODEL.md` §3) — webhook signature verification, idempotent
event handling, and no client-trusted "payment succeeded" signal ever
grants access.

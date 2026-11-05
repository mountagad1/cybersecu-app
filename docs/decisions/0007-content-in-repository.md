# 0007 — The encyclopedia and the simulations live in the repository

**Status:** Accepted
**Date:** 2026-08-31
**Supersedes in part:** the content half of `0001` (Supabase as the single
store). User data is unaffected.

## Context

`/attaques` and `/simulations` were blank in production for days. The
investigation (`docs/BLANK_PAGES_ROOT_CAUSE.md`) found three compounding
defects and fixed them: missing observability, an unpublishable seed, and
incomplete setup instructions. Each fix was correct. The pages stayed
empty anyway.

The reason is structural rather than a bug:

- Every attack page and every simulation existed **only** as rows in
  Postgres, created by `supabase/seed/*.sql`.
- **A Vercel deploy never runs SQL.** There is no migration runner in
  `package.json`, no CI, no Supabase CLI config.
- So every deploy shipped the application and none of its content, and no
  number of deploys could change that.

On top of that, request-time database reads meant nothing pre-rendered:
`generateStaticParams` swallowed its own failure and returned `[]`, so
even a healthy deployment produced pages that a crawler had to wait on,
and a database fault produced a 500 on the site's most important URLs.

## Decision

**Editorial content moves into the repository. The database keeps user
data.**

- `src/content/attacks/` — the encyclopedia, typed as `AttackEntry`. Each
  entry names its own family; `src/domain/attack/categories.ts` defines
  the four families but no longer lists their members, so a category
  cannot claim an attack that does not exist or miss one that does.
- `src/content/simulations/` — the scenarios, their choices, their
  correct answers and their explanations.
- `src/domain/seo/indexability.ts` — the existing URL registry, now fed
  from the catalogue instead of from database reads. The sitemap, the
  hubs and the internal links are all projections of it.
- The database keeps `attempts`, `attempt_decisions`, `simulation_usage`,
  `anonymous_sessions`, `entitlements`, `purchases` — everything that is
  genuinely per-visitor and changes at runtime.

`src/infra/attacks/repository.ts` and `src/infra/scenarios/repository.ts`
keep their names and their `async` signatures, and now read the
catalogue. Callers did not change.

Migration `0004` drops the foreign key from `attempts.scenario_version_id`
to `scenario_versions`, since that table is no longer the source of truth.
The identifiers themselves are now declared in the content files and are
stable. The old content tables are **not** dropped: existing attempt rows
stay interpretable, and dropping tables is not reversible.

## Consequences

**What this buys**

- A deploy publishes the content. There is no second step to forget, and
  no configuration in which `/attaques` renders empty.
- Every content page is statically generated (`force-static` +
  `generateStaticParams`, `dynamicParams: false`). A crawler gets HTML
  from the CDN. This closes audit finding **C-3** — nothing pre-rendered.
- The content is reviewed in pull requests, versioned in git, and
  diffable. A wrong statement in a security explanation is a code review
  comment rather than an untracked `UPDATE`.
- Structural faults fail the build: the registry audits run at module
  load, so a duplicate slug, a dangling internal link, an entry too thin
  to publish, an empty category hub, or a scenario URL outside the
  reserved `.test` TLD stops `next build` rather than reaching
  production.
- Sitemap, routes and internal links are one source of truth, so they
  cannot drift apart.

**What it costs**

- Publishing an attack now needs a deploy. That is acceptable at this
  cadence — the encyclopedia changes rarely, and the trade buys the
  guarantee that what is in the repository is what is online.
- There is no admin UI for content. There was none before either.
- The catalogue is bundled into the build. At 20 attacks and 18
  simulations this is small; if it grows past a few hundred entries, the
  right move is per-entry dynamic imports, not a return to request-time
  database reads.

**Explicitly not changed**

- Grading stays server-side. `correctChoiceIds`, `explanations` and each
  choice's `mistakePatternCodes` are stripped by `toPublicScenario` and
  never reach the browser before an answer is submitted
  (`docs/SECURITY_MODEL.md` §9). A test asserts this for every scenario.
- The quota stays server-authoritative. The simulation page is static and
  its player reads `/api/quota` on mount for display only; the attempt
  routes re-check the quota before consuming one, so a stale or failed
  read cannot grant a free attempt.
- The content rules of `0002-synthetic-content-only.md` still hold: no
  fabricated statistics, incidents, dates or organisations; every
  reference points at a page verified to exist; every simulated entity is
  fictional and every simulated domain sits under `.test`.

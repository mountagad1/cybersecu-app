# SEO Changelog

Records SEO-affecting changes and the audit finding each one closes. Findings
are identified by their ID in `docs/SEO_CURRENT_STATE_AUDIT.md`.

---

## 2026-08-24 — Audit + first remediation slice

**Audit:** `docs/SEO_CURRENT_STATE_AUDIT.md` — 3 CRITICAL, 5 HIGH, 5 MEDIUM,
3 LOW findings against commit `b550e8f`, evidenced by a local production
build and served-HTML inspection.

### Closed

| ID | Finding | Change |
| --- | --- | --- |
| C-1 | Canonical missing on 7 of 8 indexable routes | Explicit self-referencing canonical on every indexable route |
| C-2 | Sitemap silently dropped all content on any DB error | Removed the swallowing `try/catch`; the request now fails loudly |
| H-1 | `BreadcrumbList` used relative `item` URLs and omitted "Accueil" | New `<Breadcrumbs>` renders visible trail + JSON-LD from one array, absolute URLs |
| H-2 | FAQ `Question` nodes hung off `TechArticle.mainEntity` | Split into a distinct `FAQPage` node in an `@graph` |
| H-3 | Every attack page linked to the same hardcoded simulation | Resolves real simulations via `scenarios.attack_id` |
| H-4 | `/restaurer` (token-consuming) was indexable | `noindex, follow`, left crawlable in robots.txt |
| H-5 | No `Organization` / `WebSite` JSON-LD | Added site-level `@graph` in the root layout |
| M-1 | `robots.txt` `Allow` list was redundant and read as a whitelist | Simplified to `Allow: /` + real disallows |
| M-2 | Sitemap had no `lastmod` | Emits `lastModified` from `attacks.published_at` |
| M-4 | Raw taxonomy enums rendered as body copy | Centralised French labels in `domain/attack/labels.ts` |
| M-5 | Site origin re-derived in three files | Single source of truth in `src/lib/site.ts` |
| L-3 | Related attacks fetched but never rendered | Renders internal links to published related attacks |

### Design note — canonical inheritance

The first attempt set a default `alternates.canonical` on the root layout.
That was **reverted before shipping**: a layout-level default silently gives
every route that forgets its own canonical a canonical pointing at the
homepage, declaring it a duplicate. That is a worse failure than no canonical
at all, and it was observable on `/restaurer`. Each route now declares its
own, and `src/app/seo.test.ts` fails if a new `(marketing)` page ships
without one.

### Tests

`src/app/seo.test.ts` (12 assertions) and `src/lib/site.test.ts` (5). The two
highest-value guards were verified to actually fail when their bug is
reintroduced, rather than being assumed correct:

- restoring the sitemap `try/catch` → *"propagates a data-layer failure"* fails
- adding `/restaurer` to robots `disallow` → *"does not block a route that relies on a noindex directive"* fails

### Not addressed in that slice

- **C-3** (every SEO page depends on a request-time DB call; nothing
  pre-renders because `generateStaticParams` swallows its error).
- **M-3** trust pages — *closed by the next entry below.*
- **L-1** `/simulations/[slug]` is `force-dynamic`; **L-2** no redirect
  registry in `next.config.ts`.

---

## 2026-08-24 — Trust pages (M-3)

Adds `/a-propos`, `/methodologie`, `/sources` (brief §13 E-EA-T, §41), linked
from a new footer nav so none is an orphan, and added to the sitemap.

Written to be **honest rather than flattering**, per the brief's ban on
inventing qualifications:

- `/methodologie` states plainly, in its own callout, that content is **not
  reviewed by an external certified expert**, and that no "validé par un
  expert" badge is displayed because no such validation happened.
- It also states coverage is **not exhaustive** and that an official body's
  information takes precedence over ours — rather than claiming to cover
  "all cyberattacks".
- `/sources` lists only real organisations with accurate remits, and leads
  with **where a victim should actually go** (their bank first, then
  Cybermalveillance.gouv.fr, 33700, PHAROS, CNIL) before listing the
  institutional bodies our content draws on.
- `/a-propos` is explicit about what the site does *not* do: no personalised
  legal/banking advice, no intervention on a compromised account, no
  reporting on the user's behalf.

New guard: `src/app/seo.test.ts` → *"gives every static sitemap route an
incoming internal link"* (brief §22 ORPHAN_POLICY). Verified to fail when a
footer link is removed while the route stays in the sitemap.

### Still outstanding after this slice

- **C-3** — every SEO page depends on a request-time DB call; nothing
  pre-renders because `generateStaticParams` swallows its error. Needs a
  provisioned Supabase to fix meaningfully: a build-time content strategy
  cannot be validated against an environment with no database.
- **L-1** `/simulations/[slug]` is `force-dynamic`.
- **L-2** no redirect registry in `next.config.ts`.
- The brief's wider IA (`/arnaques`, `/guides`, audience pages, category
  hubs) and taxonomy expansion. These are **content and editorial** work
  gated by `docs/SEO_ARCHITECTURE.md` §3's publish rules — deliberately not
  bulk-generated, per the brief's own prohibition on thin programmatic pages
  and fabricated entities.

---

## 2026-08-24 — Category hubs + URL registry (brief §23, §44, §45)

Addresses the brief's central warning — signal drift between database, routes,
sitemap, internal links and canonicals — by making them all projections of one
registry.

### Added

- **`src/domain/attack/categories.ts`** — the 4-family taxonomy from the brief
  (ingénierie sociale, sites et navigateurs, fraudes financières, vol de
  comptes). Each hub carries a definition and a "what unites these techniques"
  section, so it is a reference page rather than a filtered list.
- **`src/domain/seo/indexability.ts`** — the indexability gate (§44) and URL
  registry (§45), as pure functions with no DB or Next.js imports.
- **`/attaques/[slug]` now resolves hubs *and* attacks.** Both share the
  namespace, per the brief's URLs; a collision would silently orphan one
  entity, so `auditRegistry()` detects it and a test asserts it.
- **`sitemap.ts` is now a projection of the registry**, not a parallel list.
- **`scripts/seo-audit.ts`** (`pnpm seo:audit`) — internal QC report (§43,
  §46): inventory by type, taxonomy coverage, noindex pages with reasons,
  and drift warnings. Exits non-zero on a violation.
- Attack pages now link to their **parent category** (§20) and carry the
  category level in breadcrumbs (§19).
- The duplicated trigger-label map on the attack page was removed in favour of
  the shared `domain/attack/labels.ts`.

### A hub must earn its page

`isCategoryPublishable()` excludes a category with no published attacks from
routing, the sitemap and the index links; the route 404s rather than rendering
an empty hub. `pnpm seo:audit` therefore reports **1 publishable hub of 4** —
only one attack is published, the other eight are unpublished stubs. That is
the quality gate working, and the honest number.

### On FAQ

The brief notes Google withdrew FAQ rich results from ordinary search in 2026.
Our implementation never depended on them: `FAQPage` is emitted only where
authored FAQ content exists, and the accordion is a plain accessible
disclosure that works with or without any rich result. No change needed.

### Tests

59 passing (was 45). New coverage: registry coherence, hub/attack slug
collision, empty-hub exclusion, one-category-per-attack, canonical path shape
(lowercase, no trailing slash), and hub linkage from the attack index.

### Still outstanding

- **C-3** — nothing pre-renders; every SEO page still depends on a
  request-time DB call. Needs a provisioned Supabase.
- The category hubs are **verified by unit tests and a successful build, but
  not visually rendered**, because rendering one requires published attacks
  from a database this environment does not have.
- `/guides`, `/arnaques` and audience pages remain unbuilt — editorial work,
  deliberately not bulk-generated.


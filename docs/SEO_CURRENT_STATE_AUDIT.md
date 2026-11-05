# SEO Current State Audit — cybersecu.app

**Audit date:** 2026-08-24
**Commit audited:** `b550e8f` (origin/main)
**Method:** static inspection of the repository + a local production build
(`pnpm build && pnpm start`) with HTTP responses and served HTML inspected
directly. Every finding below cites the file or the observed response that
evidences it. Where a symptom is an artifact of this sandbox rather than a
product defect, that is stated explicitly.

---

## 0. Scope correction (read this first)

The build brief describes an information architecture that **does not exist
in this repository yet**:

| Brief assumes | Reality (`find src/app`) |
| --- | --- |
| `/arnaques`, `/arnaques/[slug]` | absent |
| `/guides`, `/guides/[slug]` | absent |
| `/seniors`, `/famille`, `/entreprises` | absent |
| `/a-propos`, `/methodologie`, `/sources`, `/redaction`, `/securite` | absent |
| Category hubs (`/attaques/ingenierie-sociale`, …) | absent |
| Hundreds of attack entities | **1 published**, 8 unpublished stubs |

`docs/SEO_ARCHITECTURE.md` §2 already documents the full target URL map, so
the *design* exists; the *implementation* is a vertical slice. This audit
therefore reports on what is built, and treats the rest as planned work
rather than as defects.

**Actual route inventory** (from `pnpm build` output): 8 public HTML routes,
7 API routes, 6 asset/metadata routes.

| Route | Render mode | Indexable today |
| --- | --- | --- |
| `/` | Static | yes |
| `/attaques` | Dynamic (ISR 3600) | yes |
| `/attaques/[slug]` | SSG + ISR 3600 | yes |
| `/simulations` | Dynamic (ISR 3600) | yes |
| `/simulations/[slug]` | `force-dynamic` | yes |
| `/simulations/merci` | Static | **no** (`robots: index:false`) — correct |
| `/restaurer` | Static | yes — **questionable, see H-4** |
| `/confidentialite`, `/conditions-utilisation` | Static | yes |

**Content inventory** (`supabase/seed/0001_taxonomy_and_content.sql`):
1 published attack (`SMS-000001`, `smishing-faux-sms-bancaire`),
8 unpublished stubs, 1 scenario. The publish gate is real, not advisory —
`isPublishable()` in `src/domain/attack/types.ts` plus the DB constraint
described in `docs/SEO_ARCHITECTURE.md` §3.

---

## CRITICAL

### C-1 — No canonical URL on 7 of 8 indexable routes

**Evidence:** `grep -rn "canonical" src/` returns exactly one hit:

```
src/app/(marketing)/attaques/[slug]/page.tsx:48:  alternates: { canonical: `/attaques/${attack.slug}` },
```

Confirmed against served HTML — `/`, `/confidentialite`,
`/conditions-utilisation`, `/restaurer` all return **no** `<link rel="canonical">`.

**Why it matters.** Without a self-referencing canonical, any URL variant that
reaches the origin — `?utm_source=…`, `?fbclid=…`, a trailing slash, a
protocol/host variant, or the raw `*.vercel.app` preview host — is a
candidate duplicate. The site is served on at least two hostnames today
(`cybersecu.app` and `www.cybersecu.app`) plus Vercel preview domains, so
this is an active duplication surface, not a theoretical one.

**Fix:** self-referencing canonical on every indexable route, derived from
one shared site-URL helper.

---

### C-2 — Sitemap silently drops the entire encyclopedia on any data-layer error

**Evidence:** `src/app/sitemap.ts` wraps the content queries in
`try { … } catch { return staticRoutes; }`. Observed locally:

```
$ curl -s localhost:3440/sitemap.xml | grep -c "<loc>"
5
```

Five static URLs, zero attack or simulation URLs — returned as **HTTP 200
with a well-formed sitemap**. Nothing signals that the content half is
missing.

**Why it matters.** The failure mode is indistinguishable from "the site
genuinely has 5 pages". A transient Supabase error during an ISR
regeneration in production would publish a sitemap that silently de-lists
every attack page, and no alert would fire. Silent degradation of a
discovery surface is worse than a loud failure.

*(The empty result **here** is a sandbox artifact — no Supabase env is
configured locally. The unsafe `catch` is real regardless.)*

---

### C-3 — Every SEO page is coupled to a live request-time database call

**Evidence:** observed HTTP status on a local production build with no
Supabase env configured:

```
200  /
500  /attaques
500  /simulations
500  /attaques/smishing-faux-sms-bancaire
500  /attaques/does-not-exist
```

Server log: `Error: Missing SUPABASE_URL`.

**Important qualification:** these 500s are an **environment artifact of this
sandbox**, not proof that production is broken — production has the env vars
set. Do **not** read this as "the live site is down".

The genuine finding is architectural: `generateStaticParams` in
`attaques/[slug]/page.tsx` catches its error and returns `[]`, so **nothing
is pre-rendered at build time**. Every encyclopedia page — the entire organic
search surface — is therefore produced by a live database round-trip on a
cache miss. If Supabase is slow, rate-limited, or briefly unavailable, those
pages serve `500` to Googlebot rather than degrading to stale-but-valid HTML.

**Fix direction:** treat published attack content as build-time content
(pre-rendered, revalidated) rather than request-time data, so a data-layer
outage costs freshness instead of availability.

---

## HIGH

### H-1 — `BreadcrumbList` JSON-LD uses relative URLs (invalid)

**Evidence:** `src/app/(marketing)/attaques/[slug]/page.tsx`:

```js
{ "@type": "ListItem", position: 1, name: "Attaques", item: "/attaques" },
{ "@type": "ListItem", position: 2, name: attack.name, item: `/attaques/${attack.slug}` },
```

schema.org `item` must be an absolute URL (or an object with an absolute
`@id`). Relative values are not resolvable by consumers that read the JSON-LD
outside its page context, which is the normal case for a knowledge-graph
consumer.

Also: the visible breadcrumb (`Accueil` is missing) does not match the
structured data, which starts at `Attaques`. The brief requires the
`BreadcrumbList` to mirror the visible hierarchy.

---

### H-2 — `TechArticle` carries `mainEntity: [Question…]`, conflating two schema types

**Evidence:** same file — the FAQ entries are attached to the `TechArticle`
node's `mainEntity` rather than emitted as a `FAQPage`.

`TechArticle.mainEntity` does not mean "the FAQ on this page"; a list of
`Question` nodes hung off an article node misrepresents the page. The
homepage does this correctly (a real `FAQPage` node — see
`src/components/home/faq-section.tsx`), so the two templates disagree with
each other.

Per brief §18, structured data must accurately represent visible content.

---

### H-3 — Every attack page links to the same hardcoded simulation

**Evidence:** `src/app/(marketing)/attaques/[slug]/page.tsx`:

```jsx
<Link href="/simulations/sms-banque" …>Lancer la simulation</Link>
```

with surrounding copy interpolating the *current* attack's name:
`"…à quoi ressemble une vraie tentative de {attack.name.toLowerCase()}"`.

So the page for *Typosquatting* invites the reader to see a typosquatting
attempt and then sends them to a bank-SMS simulation. This is both a
user-facing mismatch and exactly the "non-semantic internal link" the brief
forbids (§20). It also means the attack→simulation edge of the knowledge
graph is not actually modelled — it is a constant.

---

### H-4 — `/restaurer` is indexable but is an account-utility page

**Evidence:** no `robots` metadata in
`src/app/(marketing)/restaurer/page.tsx`; served HTML has no robots meta, so
it defaults to `index, follow`. It is also **absent from the sitemap**
(`src/app/sitemap.ts` static list), so it is simultaneously indexable and
un-declared.

This page exists to consume an emailed `?token=…` recovery link. It has no
informational value for a searcher, and indexing a token-consuming endpoint
is an unnecessary exposure surface.

**Fix:** `noindex, follow`.

---

### H-5 — No `Organization` or `WebSite` JSON-LD anywhere

**Evidence:** the only JSON-LD served on `/` is the homepage `FAQPage`:

```
$ curl -s localhost:3440/ | grep -o '"@type":"[A-Za-z]*"' | sort | uniq -c
      6 "@type":"Answer"
      1 "@type":"FAQPage"
      6 "@type":"Question"
```

`docs/SEO_ARCHITECTURE.md` §4 already specifies `WebSite` on the homepage. It
is not implemented. For an E-E-A-T-sensitive safety topic (brief §13), the
absence of any publisher entity is a meaningful trust gap.

---

## MEDIUM

### M-1 — `robots.txt` `Allow` list is redundant and misleading

**Evidence:** served output —

```
Allow: /
Allow: /attaques
Allow: /simulations
Allow: /confidentialite
Allow: /conditions-utilisation
Disallow: /admin …
```

`Allow: /` already permits everything; the four subsequent `Allow` lines are
no-ops. The risk is not current behaviour but future maintenance: the list
reads like a whitelist, so a maintainer adding `/guides` may reasonably
believe it must be listed to be crawlable, and may conversely believe an
unlisted path is blocked. Neither is true.

### M-2 — Sitemap has no `lastModified`

`src/app/sitemap.ts` emits `changeFrequency` and `priority` but never
`lastModified`, despite `attacks.published_at` being available and the
freshness fields being specified in brief §32. `changeFrequency`/`priority`
are broadly ignored by Google; `lastmod` is the field it actually uses.

### M-3 — No `/a-propos`, `/methodologie`, `/sources` trust pages

Required by brief §13 and §41; currently absent. Relevant because the site
publishes safety guidance where provenance is load-bearing.

### M-4 — Attack index cards expose an internal taxonomy code as body copy

`src/app/(marketing)/attaques/page.tsx` renders `Vecteur : {attack.primaryVector}`
— the raw enum (`sms`, `email`, `phone`, `web`, `qr_code`), unlabelled. The
detail page maps trigger codes to French labels via `TRIGGER_LABELS`; the
index has no equivalent mapping for vectors. Thin, machine-facing text on a
hub page.

### M-5 — Two independent site-URL definitions

`siteUrl` is re-derived from `process.env.SITE_URL || "https://cybersecu.app"`
in three places: `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`.
Brief §45 requires one source of truth; canonical/sitemap/robots drift is a
classic consequence of not having one.

> **Update (post-audit):** resolved. `src/lib/site.ts` is now the single
> source of truth, and the last two re-derivations — in
> `src/app/api/checkout/route.ts` and
> `src/app/api/access/restore-request/route.ts` — were removed when the
> variable was renamed to `SITE_URL`. This entry is kept as the record of
> why that module exists.

---

## LOW

### L-1 — `/simulations/[slug]` is `force-dynamic`
Documented and justified in-file (per-viewer quota state), but it means the
public simulation copy is never cached. The static article shell could be
split from the quota-dependent player island.

### L-2 — `next.config.ts` is empty
No redirect registry, no trailing-slash policy, no image config. Fine today;
brief §29 will need a redirect surface once slugs can change.

### L-3 — Attack detail page never renders `relatedAttackCodes`
The repository fetches related attacks (`attack_related` join) and the domain
type carries `relatedAttackCodes`, but the template never renders them — so
the one knowledge-graph edge that *is* modelled produces no internal links.

---

## OPPORTUNITY

- **O-1** — `AttackDetail` already models `triggers`, `indicators`,
  `relatedAttackCodes` and `references`. The scoring inputs for a real
  related-content engine (brief §21) mostly exist in the schema already.
- **O-2** — The homepage FAQ component (`faq-section.tsx`) is an accessible,
  correctly-schema'd accordion. It is reusable as the per-attack FAQ
  component, replacing the current `<dl>` and fixing H-2 in the same change.
- **O-3** — `slug` is deliberately separate from the stable `code`
  (`docs/SEO_ARCHITECTURE.md` §2), and a `slug_redirects` table is already
  planned. Renaming URLs later is cheap if the redirect surface is built
  before the content volume grows.

---

## Summary

| Severity | Count |
| --- | --- |
| CRITICAL | 3 |
| HIGH | 5 |
| MEDIUM | 5 |
| LOW | 3 |
| OPPORTUNITY | 3 |

**Not found (checked, no issue):** duplicate/missing `H1` (every audited page
has exactly one), keyword-stuffed titles, thin programmatic pages (the
publish gate prevents them), hidden text, fabricated schema, client-side-only
main content (all article copy is server-rendered), missing alt text on
meaningful images, faceted-navigation index bloat (no facets exist yet).

**Explicitly not claimed:** that the production site is returning errors. The
500s observed in this audit are caused by absent Supabase credentials in the
audit sandbox and are called out as such in C-3.

## Recommended order of work

1. C-1 canonical everywhere + M-5 single site-URL source *(one change)*
2. H-4 `noindex` on `/restaurer`
3. H-1 / H-2 / H-5 structured-data correctness
4. H-3 + L-3 real attack→simulation and attack→attack internal links
5. C-2 fail loudly on sitemap data errors + M-2 `lastmod`
6. M-1 robots simplification, M-4 vector labels
7. SEO regression tests covering the above
8. C-3 pre-rendering strategy *(largest; needs a provisioned Supabase)*

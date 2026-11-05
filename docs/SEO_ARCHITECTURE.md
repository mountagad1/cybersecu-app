# SEO Architecture — cybersecu.app

## 1. Principle

Public knowledge pages are crawlable with JavaScript disabled. All
canonical copy (definition, how it works, examples, indicators, guidance)
is rendered server-side into the initial HTML via Server Components with
`generateStaticParams` + ISR (`revalidate = 3600`). The embedded
simulation preview is a separately-hydrated Client Component island that
never gates the surrounding article content.

## 2. URL structure

```
/                              homepage
/attaques                      attack encyclopedia index
/attaques/[slug]                canonical attack page (1 per attacks.slug)
/arnaques                       consumer-facing scam index (curated view over attacks)
/arnaques/[slug]
/guides                         how-to index
/guides/[slug]
/simulations                    simulation catalog (public previews)
/simulations/[slug]
/seniors
/famille
/entreprises
```

`slug` is a separate, mutable, unique column from `code` (the stable ID) —
renaming a page's URL never breaks the domain model's stable references,
and a redirect table (`slug_redirects`) is created up front so a future
slug rename doesn't 404 old inbound links.

## 3. Per-attack page content contract

Every `/attaques/[slug]` page is required to contain (own H2 sections):
Definition, How it works, Realistic example, Warning signs, Psychological
techniques used, How to verify, What to do, What to do if you already
fell for it, embedded simulation preview, Related attacks (internal
links, driven by the `related_attacks` graph), FAQ (only rendered — and
only gets FAQ JSON-LD — when the attack actually has authored FAQ
entries; never fabricated to hit a schema checklist), Authoritative
references (external links to e.g. cybermalveillance.gouv.fr, CNIL).
Enforced at the data layer: an attack cannot be published without
non-empty `definition`, `how_it_works`, `warning_signs`, and at least one
`indicator`/`trigger` relation — publishing is blocked, not just
guideline text.

## 4. Structured data

- `WebSite` JSON-LD on the homepage (sitelinks search box only if/when
  search is built).
- `Article`/`TechArticle` JSON-LD on `/attaques/[slug]` and
  `/guides/[slug]`.
- `BreadcrumbList` JSON-LD on every content page.
- `FAQPage` JSON-LD only where genuine authored FAQ content exists.
- No `Course`/`Quiz` schema fabricated speculatively — added later if the
  simulation catalog page benefits from it, decided against real search
  console data, not guessed now.

## 5. Sitemap & robots

`app/sitemap.ts` queries published attacks/guides/scenarios at build/ISR
time (no manual sitemap maintenance). `app/robots.ts` allows `/`,
`/attaques`, `/arnaques`, `/guides`, `/simulations`, `/seniors`,
`/famille`, `/entreprises`; disallows `/admin`, `/api`, `/(app)` authenticated
routes (`/dashboard`, `/profil`), and any account-scoped URL. `admin/*`
also sets `robots: noindex, nofollow` at the page-metadata level as a
second layer, not relying on `robots.txt` alone.

## 6. Content → product loop

Each attack/guide page's simulation preview links to the full
authenticated simulation (`/simulations/[slug]` → sign-up gated only at
the *result/explanation* step, not before the user can try). The free
experience must let an anonymous visitor play at least one full decision
and see a real (if slightly truncated) explanation — full history,
scoring, and adaptive follow-up scenarios require an account. This mirrors
section 17 of the brief: gate progressively, not aggressively.

## 7. Internal linking

Attack pages link to: their `related_attacks`, the guides that reference
them (`guides.related_attack_ids`), and their simulation. Guides link back
to the attacks they explain. This is modeled as real FK-backed
relationships, not hand-maintained link lists, so the site graph stays
consistent as content grows.

# 0006 — Category taxonomy in code, and one URL registry as source of truth

**Date:** 2026-08-24
**Status:** Accepted

## Context

The build brief specifies category hubs (`/attaques/ingenierie-sociale`) and
attack pages (`/attaques/homoglyphes`) — and, separately, warns against the
failure mode where each SEO signal is derived independently and they drift:

```
Database = 1,000   Routes = 1,000   Sitemap = 1,400
Links    =   800   Canonical = 950
```

Two decisions follow from that.

## Decision 1 — Hubs and attacks share `/attaques/[slug]`, arbitrated by one registry

The brief's URL scheme puts both entity types in a single namespace. That is
good for users and for URL stability, but it means a slug collision would make
one entity **permanently unreachable, silently** — routing would simply pick a
winner.

We keep the brief's URL shape and make the collision impossible to ship
unnoticed instead of routing around it:

- `src/domain/seo/indexability.ts` builds one registry of every public URL.
- `findDuplicatePaths()` / `auditRegistry()` detect a collision.
- A unit test constructs a colliding slug and asserts it is reported.
- The route resolves categories first (a fixed, code-owned set), then attacks.

**Rejected:** namespacing hubs under `/attaques/categorie/[slug]`. It removes
the collision by construction, but diverges from the specified URLs and buys
safety we can get from a test.

## Decision 2 — The taxonomy lives in code, for now, with loud drift detection

Category assignment ideally belongs in the database beside the attack row. The
`attacks` table has no category column, and adding one would mean writing a
migration we cannot run or verify against a real Supabase project from this
environment. Shipping an unverified migration to satisfy a diagram would create
exactly the silent drift the taxonomy exists to prevent.

So `ATTACK_CATEGORIES` in `src/domain/attack/categories.ts` holds the mapping,
and drift is made **loud**:

- `auditCategoryCoverage()` reports published attacks no category claims
  (they'd be unreachable via hubs), codes claimed by two categories (two
  breadcrumb parents), and references to attacks that are not published.
- Unit tests and `pnpm seo:audit` both call it.

**Migrate to the database** when a Supabase project is provisioned: add a
category column, backfill from this constant, and reduce this file to labels
and copy.

## Decision 3 — A hub must earn its page

`isCategoryPublishable()` returns false for a category with no *published*
attacks, and such a hub is excluded from routing, the sitemap, and the index
page's links; the route 404s rather than rendering "aucun résultat".

This applies to hubs the same quality gate attacks already have. It is why
`pnpm seo:audit` currently reports **1 publishable hub out of 4** — only one
attack is published; the rest are unpublished stubs. That number is a true
statement about the encyclopedia's size, and it should rise by publishing
content, never by relaxing the gate.

## Consequences

- Sitemap, routing, canonicals and hub links all derive from one registry, so
  they cannot disagree; a mismatch fails tests rather than search results.
- Three of four hubs are currently unpublished. This is correct behaviour, not
  a bug, and the audit script states it plainly.
- The taxonomy constant must be kept in step with the database until Decision 2
  is migrated — which the coverage audit enforces.

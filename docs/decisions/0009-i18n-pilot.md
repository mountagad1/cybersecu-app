# 0009 — English pilot: overlay translations, a separate simulation catalogue, `/en/` subpath

**Status:** Accepted — architecture piloted on one family, then extended to
the full attack encyclopedia (100 fiches, all 10 category hubs). Simulations
beyond the original pilot family, guides, levers, and the static
informational pages remain French-only for now — see "Known limitations"
below.
**Date:** 2026-09-18

## Context

The site is French-only. A request came in to add English, scoped
initially as a pilot rather than a full localization: site chrome (nav,
footer, homepage sections) plus one attack family — Ingénierie sociale, 11
fiches, 10 simulations — fully translated at `/en/`. That pilot validated
the architecture below, and the encyclopedia coverage was then extended to
all remaining families (89 more fiches across 9 categories) in the same
pass. Everything not yet translated stays French-only, with a real 404
rather than a French-language page served under an English URL.

Two content types needed different answers, because they have different
identity requirements.

## Attacks: an overlay, not a duplicate entry

`AttackEntry.code`, `categorySlug`, `attackerObjective`, `triggers`,
`primaryDimension`/`primaryVector` and `relatedAttackCodes` are structural:
they drive scoring, the mistake taxonomy, the related-attacks graph and the
near-duplicate audit (`src/content/attacks/index.ts`). Forking a translated
attack into a second `AttackEntry` with its own `code` would fork that
identity too — mistake-pattern scoring keyed on `code`, `relatedAttackCodes`
edges, the category audit — for content that is the same attack in a
different language.

Instead `AttackEntry` gained an optional `translations?: { en?:
AttackTranslation }` (`src/content/attacks/types.ts`). `AttackTranslation`
carries only what a reader actually reads — name, definitions, warning
signs, FAQ, references, its own `slug` (an English slug reusing the French
one is a coincidence, not a guarantee) — and nothing structural. The same
overlay shape exists on `AttackCategory.translations.en`
(`src/domain/attack/categories.ts`).

`src/content/attacks/localize.ts` projects an `AttackEntry` + `Locale` into
a `LocalizedAttack` (or `LocalizedCategory`). For `"en"`,
`getLocalizedAttack` returns `null` when `translations.en` is absent —
callers must treat that as a real 404, never a silent fallback to French.
`localizedRelatedAttacks` resolves `relatedAttackCodes` through the locale
projection and drops anything untranslated, so an English page can never
link to a French-only fiche.

## Simulations: independent content, not a translation of the same version

`scenario_version_id` is the fixed-language unit the DB actually grades
against — `attempts`, `attempt_decisions`, quota and the adaptive selector
all key off it, with no locale column anywhere in that path. Threading a
locale through the grading engine to let one `scenario_version_id` carry
two languages would touch every one of those tables and every read of
them, for a decision that is really "which fixed piece of authored content
did this attempt play."

So English simulations are separate, independently authored
`SimulationEntry` objects in `src/content/simulations-en`, each with its
own stable `versionId` in a disjoint UUID range
(`10000000-0000-4000-8000-…`, French is `00000000-0000-4000-8000-…`) and
its own English slug. `attackCode` stays the same locale-invariant code as
the French attack it trains, so `findAttackByCode()` resolves the correct
cyber-reflex dimension regardless of which language was played — and a
visitor's attempt history is scored coherently even if they play both
catalogues in the same session (`src/infra/scenarios/nextScenario.ts`
resolves a `scenario_version_id`'s dimension against either catalogue,
history is never partitioned by locale).

`toPublicScenario`, `toGradedScenario` and `auditSimulations`
(`src/content/simulations/index.ts`) are generic over `SimulationEntry`
with nothing French-specific in them, so `src/content/simulations-en`
reuses them unchanged rather than forking the grading logic.
`src/infra/scenarios/repository.ts` checks the French catalogue then the
English one for both slug and `versionId` lookups — safe because slugs and
`versionId`s are disjoint by construction across the two.

## URL structure: `/en/` subpath, same domain

French stays unprefixed — no route in `src/app/(marketing)` changes.
English lives under `src/app/en/`, mirroring the French route shape
(`/en`, `/en/attaques`, `/en/attaques/[slug]`, `/en/simulations`,
`/en/simulations/[slug]`) but `generateStaticParams` only for slugs that
actually have a translation, `dynamicParams: false` everywhere so an
untranslated slug 404s rather than falling through to anything.
`src/domain/seo/indexability.ts`'s registry gets English entries the same
way: gated on `getLocalizedAttack`/`getLocalizedCategory` returning
non-null, never on every French entity blindly prefixed. `hreflang`
alternates are wired both directions on the attack/category pages where a
translation exists.

## UI chrome: a shared string dictionary, not forked components

Nav, footer, the scenario player, the paywall, breadcrumbs, quota
indicator, streak chip/toast and the difficulty badge are the same
components for both locales, given an optional `locale?: Locale` prop
defaulting to `"fr"` — so every existing French call site is unchanged.
Strings live in `src/domain/i18n/dictionary.ts` (`getUiStrings(locale)`);
homepage sections with heavier authored content (audience section, why
section, FAQ) keep parallel `_FR`/`_EN` content arrays alongside their
component rather than moving into the dictionary, since that content is
specific to one component rather than shared UI copy.

## Known limitations, accepted for the pilot — and still open after the encyclopedia extension

- ~~Root `<html lang="fr">` is hardcoded.~~ Resolved: there is no
  `app/layout.tsx` any more. `(marketing)/layout.tsx` and `en/layout.tsx` are
  two root layouts sharing `src/components/root-document.tsx`, so English
  pages are `<html lang="en">` with English metadata defaults, and every
  page stays statically rendered. Switching language is a full page load;
  unmatched URLs use `app/global-not-found.tsx`
  (`experimental.globalNotFound`).
- The English attack page does not render the levers/guides cross-link
  sections the French page has — that content isn't translated, and a
  section with nothing to show is worse than an absent one.
- Footer links to `/a-propos`, `/méthodologie`, `/sources`, `/restaurer`,
  `/confidentialite` and `/conditions-utilisation` stay French-only from
  both locales' footers — only the link *labels* are translated.
- **Simulations only exist in English for the original pilot family**
  (Ingénierie sociale, 10 simulations in `src/content/simulations-en`).
  The 89 fiches translated in the encyclopedia extension deliberately have
  no `simulationSlug` set on their `translations.en` block, even where the
  French entry has one — there is no English simulation catalogue for
  those families yet, so setting it would produce a broken "Test yourself"
  link. Their English pages therefore show no simulation CTA at all,
  which is a correct rendering of "not translated yet," not a bug. Writing
  the remaining ~54 English simulations (new realistic scenarios, not a
  translation of the French ones — see `src/content/simulations-en`'s own
  independent-content rationale above) is the largest remaining piece of
  work, and deliberately wasn't rushed alongside 89 fiche translations in
  one pass.
- Guides (`/guides`) and levers (`/leviers`) have no English routes or
  translations yet. Both are cross-link content off attack pages, not
  distinct learning content — lower priority than the fiches themselves.
- The static informational pages (`/a-propos`, `/méthodologie`,
  `/sources`, `/confidentialite`, `/conditions-utilisation`, `/restaurer`,
  `/simulations/merci`) remain French-only.

import { findAttackByCode } from "@/content/attacks";
import { BOUNDARIES } from "@/content/attacks/boundaries";
import { getLocalizedAttack } from "@/content/attacks/localize";
import type { Locale } from "@/domain/i18n/locale";

/**
 * The « X ou Y ? » comparator (A5, docs/growth/ENGINEERING_AS_MARKETING_ROADMAP.md
 * étape 6): the pairs of `src/content/attacks/boundaries.ts`, all on one
 * page, side by side.
 *
 * ONE page, not one per pair: the matrix rejected `/comparer/<x>-ou-<y>`
 * (docs/seo/PROGRAMMATIC_SEO_MATRIX.csv) because each pair is already
 * answered on both fiches. What only this page offers is the crossing:
 * every confusion the site documents, filterable by attack. Nothing is
 * written for it — sides and difference are the boundary's own text, the
 * « en clair » lines are the fiches'.
 */

export const COMPARATOR_SLUG = "x-ou-y";
export const COMPARATOR_PATH: Record<Locale, string> = {
  fr: "/outils/x-ou-y",
  en: "/en/tools/x-or-y",
};

export interface ComparisonSide {
  code: string;
  name: string;
  href: string;
  /** This attack, as the boundary describes it against the other one. */
  side: string;
  plainLanguageDefinition: string;
  simulationHref?: string;
}

export interface Comparison {
  /** Stable fragment id: the two French slugs, so FR and EN pages share it. */
  id: string;
  a: ComparisonSide;
  b: ComparisonSide;
  difference: string;
}

function side(
  code: string,
  text: string,
  locale: Locale,
): ComparisonSide | null {
  const attack = findAttackByCode(code);
  const localized = attack ? getLocalizedAttack(attack, locale) : null;
  if (!attack || !localized) return null;
  const prefix = locale === "en" ? "/en" : "";
  const sim =
    locale === "en" ? localized.simulationSlug : attack.simulationSlug;
  return {
    code,
    name: localized.name,
    href: `${prefix}/attaques/${localized.slug}`,
    side: text,
    plainLanguageDefinition: localized.plainLanguageDefinition,
    ...(sim && { simulationHref: `${prefix}/simulations/${sim}` }),
  };
}

export function listComparisons(locale: Locale): Comparison[] {
  return BOUNDARIES.flatMap((b) => {
    const [ca, cb] = b.pair;
    const a = side(ca, b.sides[ca][locale], locale);
    const z = side(cb, b.sides[cb][locale], locale);
    if (!a || !z) return [];
    const id = `${findAttackByCode(ca)!.slug}-ou-${findAttackByCode(cb)!.slug}`;
    return [{ id, a, b: z, difference: b.difference[locale] }];
  });
}

/** The comparator section where a fiche's first pair is shown. */
export function comparatorHrefFor(code: string, locale: Locale): string | null {
  const pair = listComparisons(locale).find(
    (c) => c.a.code === code || c.b.code === code,
  );
  return pair ? `${COMPARATOR_PATH[locale]}#${pair.id}` : null;
}

/** Every fiche that belongs to at least one pair. */
export function comparedAttackCodes(): string[] {
  return [...new Set(BOUNDARIES.flatMap((b) => [...b.pair]))];
}

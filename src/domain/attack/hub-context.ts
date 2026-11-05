import { listAttacksInCategory } from "@/content/attacks";
import { getLocalizedAttack } from "@/content/attacks/localize";
import { BOUNDARIES } from "@/content/attacks/boundaries";
import type { AttackerObjective } from "@/content/attacks/types";
import { ATTACKER_OBJECTIVE_LABELS } from "@/content/attacks/types";
import {
  englishGuideSlug,
  getLocalizedGuide,
  listGuides,
} from "@/content/guides";
import { findLeverByCode, getLocalizedLever } from "@/content/levers";
import type { Locale } from "@/domain/i18n/locale";
import type { PsychologicalTriggerCode } from "@/domain/scenario/types";

/**
 * What a family hub shows beyond its list: everything here is derived from
 * the fiches, levers, boundaries and guides already published — no new
 * sentence is written for a hub. What makes it the hub's own content is
 * the aggregation: which levers this family relies on, what its attacks are
 * after, how its close members differ, which guides apply when one of them
 * has already happened (docs/seo/PROGRAMMATIC_SEO_MATRIX.csv, ENRICH).
 */

export const ATTACKER_OBJECTIVE_LABELS_EN: Record<AttackerObjective, string> = {
  argent: "Get a payment",
  identifiants: "Steal credentials",
  acces_a_un_compte: "Take over an account",
  controle_d_un_appareil: "Take control of a device",
  donnees_personnelles: "Collect personal data",
  emprise_sur_une_personne: "Gain a hold over a person",
};

export interface HubCard {
  code: string;
  slug: string;
  name: string;
  /** « En clair » — the index shows the formal definition instead. */
  plainLanguageDefinition: string;
  objective: string;
}

export interface HubBoundary {
  a: { name: string; slug: string; side: string };
  b: { name: string; slug: string; side: string };
  difference: string;
}

export interface HubCount {
  label: string;
  /** Link target, already localized; absent for objectives. */
  href?: string;
  count: number;
}

export interface HubGuide {
  href: string;
  title: string;
}

export interface HubContext {
  cards: HubCard[];
  boundaries: HubBoundary[];
  levers: HubCount[];
  objectives: HubCount[];
  guides: HubGuide[];
  total: number;
}

function countBy<T extends string>(values: T[]): [T, number][] {
  const counts = new Map<T, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  // Most frequent first; ties keep first-seen order (stable sort).
  return [...counts.entries()].sort((x, y) => y[1] - x[1]);
}

export function buildHubContext(
  categorySlug: string,
  locale: Locale,
): HubContext {
  const attacks = listAttacksInCategory(categorySlug)
    .map((attack) => ({
      attack,
      localized: getLocalizedAttack(attack, locale),
    }))
    .filter(
      (
        x,
      ): x is {
        attack: typeof x.attack;
        localized: NonNullable<typeof x.localized>;
      } => x.localized !== null,
    );
  const codes = new Set(attacks.map((x) => x.attack.code));
  const objectiveLabels =
    locale === "en" ? ATTACKER_OBJECTIVE_LABELS_EN : ATTACKER_OBJECTIVE_LABELS;

  const cards: HubCard[] = attacks.map(({ attack, localized }) => ({
    code: attack.code,
    slug: localized.slug,
    name: localized.name,
    plainLanguageDefinition: localized.plainLanguageDefinition,
    objective: objectiveLabels[attack.attackerObjective],
  }));

  const byCode = new Map(cards.map((c) => [c.code, c]));
  const boundaries: HubBoundary[] = BOUNDARIES.filter((b) =>
    b.pair.every((c) => codes.has(c)),
  ).map((b) => {
    const [ca, cb] = b.pair;
    const a = byCode.get(ca)!;
    const z = byCode.get(cb)!;
    return {
      a: { name: a.name, slug: a.slug, side: b.sides[ca][locale] },
      b: { name: z.name, slug: z.slug, side: b.sides[cb][locale] },
      difference: b.difference[locale],
    };
  });

  const levers: HubCount[] = countBy(
    attacks.flatMap(
      ({ attack }) => attack.triggers as PsychologicalTriggerCode[],
    ),
  ).flatMap(([code, count]) => {
    const lever = findLeverByCode(code);
    if (!lever) return [];
    if (locale === "fr")
      return [{ label: lever.name, href: `/leviers/${lever.slug}`, count }];
    const en = getLocalizedLever(lever);
    return en ? [{ label: en.name, href: `/en/levers/${en.slug}`, count }] : [];
  });

  const objectives: HubCount[] = countBy(
    attacks.map(({ attack }) => attack.attackerObjective),
  ).map(([objective, count]) => ({
    label: objectiveLabels[objective],
    count,
  }));

  const guides: HubGuide[] = listGuides()
    .filter((g) => g.relatedAttackCodes.some((c) => codes.has(c)))
    .flatMap((g) => {
      if (locale === "fr")
        return [{ href: `/guides/${g.slug}`, title: g.title }];
      const en = getLocalizedGuide(g);
      const slug = englishGuideSlug(g.slug);
      return en && slug
        ? [{ href: `/en/guides/${slug}`, title: en.title }]
        : [];
    });

  return { cards, boundaries, levers, objectives, guides, total: cards.length };
}

import {
  ATTACK_CATEGORIES,
  CATEGORY_PUBLICATION_THRESHOLD,
  type AttackCategory,
} from "@/domain/attack/categories";
import { isPublishable } from "@/domain/attack/types";
import { INGENIERIE_SOCIALE } from "./ingenierie-sociale";
import { SITES_ET_NAVIGATEURS } from "./sites-et-navigateurs";
import { FRAUDES_FINANCIERES } from "./fraudes-financieres";
import { IDENTIFIANTS_ET_COMPTES } from "./identifiants-et-comptes";
import { CHANTAGE_ET_HARCELEMENT } from "./chantage-et-harcelement";
import { TELEPHONES_ET_OBJETS_CONNECTES } from "./telephones-et-objets-connectes";
import { IA_ET_CONTENUS_SYNTHETIQUES } from "./ia-et-contenus-synthetiques";
import { LOGICIELS_MALVEILLANTS } from "./logiciels-malveillants";
import { DONNEES_ET_IDENTITE_NUMERIQUE } from "./donnees-et-identite-numerique";
import { RESEAUX_ET_WIFI } from "./reseaux-et-wifi";
import type { AttackDepth, AttackEntry } from "./types";

export type { AttackEntry } from "./types";

/**
 * The encyclopedia registry: the single source of truth for which attack
 * pages exist. The routes, the sitemap, the category hubs and the
 * internal-link graph are all derived from this array, so a URL can never
 * be listed in one place and missing from another
 * (docs/decisions/0007-content-in-repository.md).
 */
const ALL_ATTACKS: readonly AttackEntry[] = [
  ...INGENIERIE_SOCIALE,
  ...SITES_ET_NAVIGATEURS,
  ...FRAUDES_FINANCIERES,
  ...IDENTIFIANTS_ET_COMPTES,
  ...CHANTAGE_ET_HARCELEMENT,
  ...TELEPHONES_ET_OBJETS_CONNECTES,
  ...IA_ET_CONTENUS_SYNTHETIQUES,
  ...LOGICIELS_MALVEILLANTS,
  ...DONNEES_ET_IDENTITE_NUMERIQUE,
  ...RESEAUX_ET_WIFI,
];

/**
 * Structural problems that must fail the build rather than ship: a
 * duplicate slug means two pages compete for one URL, a dangling related
 * code means a broken internal link, and an unpublishable entry means a
 * thin page.
 *
 * `assertCatalogueIsSound` runs at module load, so `next build` stops
 * before such a catalogue can be deployed. It is exported separately so
 * the unit tests can assert the checks actually fire.
 */
export function auditCatalogue(attacks: readonly AttackEntry[]): string[] {
  const problems: string[] = [];
  const seenCodes = new Set<string>();
  const seenSlugs = new Set<string>();
  const codes = new Set(attacks.map((a) => a.code));
  const categorySlugs = new Set(ATTACK_CATEGORIES.map((c) => c.slug));

  for (const attack of attacks) {
    if (seenCodes.has(attack.code))
      problems.push(`code dupliqué : ${attack.code}`);
    seenCodes.add(attack.code);

    if (seenSlugs.has(attack.slug))
      problems.push(`slug dupliqué : ${attack.slug}`);
    seenSlugs.add(attack.slug);

    if (!categorySlugs.has(attack.categorySlug)) {
      problems.push(
        `${attack.code} : catégorie inconnue « ${attack.categorySlug} »`,
      );
    }

    const missing = isPublishable(attack);
    if (missing.length > 0) {
      problems.push(
        `${attack.code} : champs manquants (${missing.join(", ")})`,
      );
    }

    // Simulation coverage is a decision, not an oversight. A fiche either
    // trains through a simulation or records why it cannot; declaring both
    // means the two contradict each other, and a one-word reason is not a
    // reason anyone can review later.
    if (attack.simulationSlug && attack.noSimulationReason) {
      problems.push(
        `${attack.code} : déclare à la fois une simulation et une raison de ne pas en avoir`,
      );
    }
    if (
      attack.noSimulationReason !== undefined &&
      attack.noSimulationReason.trim().length < 40
    ) {
      problems.push(
        `${attack.code} : noSimulationReason trop court pour être relisible`,
      );
    }

    for (const related of attack.relatedAttackCodes) {
      if (!codes.has(related)) {
        problems.push(
          `${attack.code} : lien interne vers un code inexistant « ${related} »`,
        );
      }
      if (related === attack.code) {
        problems.push(`${attack.code} : se référence lui-même`);
      }
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(attack.updatedAt)) {
      problems.push(
        `${attack.code} : updatedAt doit être au format YYYY-MM-DD`,
      );
    }

    if (!attack.plainLanguageDefinition) {
      problems.push(`${attack.code} : plainLanguageDefinition manquante`);
    }

    // The « En clair » level exists to say something the definition does
    // not. If it is a trimmed copy, the reader gains nothing from the
    // extra section and we have added a heading for its own sake.
    if (
      attack.plainLanguageDefinition &&
      attack.definition.includes(attack.plainLanguageDefinition.slice(0, 60))
    ) {
      problems.push(
        `${attack.code} : plainLanguageDefinition n'est qu'un extrait de definition`,
      );
    }
  }

  problems.push(...auditDepthFields(attacks));

  // Category hubs and attack pages share the /attaques namespace, as the
  // brief specifies. One namespace with two entity types means a slug
  // collision would make one of them permanently unreachable, silently.
  for (const attack of attacks) {
    if (categorySlugs.has(attack.slug)) {
      problems.push(
        `${attack.code} : le slug « ${attack.slug} » entre en collision avec une catégorie`,
      );
    }
  }

  // A family below the publication threshold is NOT a build failure any
  // more: declaring the ten families before their fiches exist is how the
  // content plan proceeds. `isCategoryPublishable` keeps such a hub out of
  // routing, the sitemap and the internal links, which is the actual
  // protection against a thin page.

  problems.push(...findNearDuplicates(attacks));

  return problems;
}

const URL_IN_TEXT = /\b(?:https?:\/\/)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s"»)]*)?/gi;
/** A number followed by « % » — a statistic, which these fields must never assert. */
const PERCENT = /\d\s*%/;

/**
 * Rules for the depth fields (docs/content/CONTENT_QUALITY_STANDARD.md):
 * the fictional example stays fictional (every domain under `.test`, the
 * same rule as simulations), the factual fields assert no statistic, and
 * the lists stay short enough to be read in a hurry.
 *
 * The English overlay is held to the same rules, and to parity with the
 * French entry: same fields, same number of items. A translation that drops
 * a checklist question or a giveaway is a different page, not a translation.
 */
export function auditDepthFields(attacks: readonly AttackEntry[]): string[] {
  const problems: string[] = [];
  for (const attack of attacks) {
    problems.push(...auditDepth(attack.code, attack, attack.howItWorks));
    const en = attack.translations?.en;
    if (!en) continue;
    problems.push(...auditDepth(`${attack.code} (en)`, en, en.howItWorks));
    problems.push(...auditDepthParity(attack.code, attack, en));
  }
  return problems;
}

function auditDepth(id: string, depth: AttackDepth, howItWorks: string): string[] {
  const problems: string[] = [];
  if (depth.example) {
    const text = `${depth.example.setting} ${depth.example.message}`;
    for (const match of text.match(URL_IN_TEXT) ?? []) {
      const host = match.replace(/^https?:\/\//, "").split(/[/?#]/)[0].toLowerCase();
      // Only things shaped like domains: « 1 870 » or « 07:42 » are not.
      if (/[a-z]/.test(host) && host.includes(".") && !host.endsWith(".test")) {
        problems.push(`${id} : domaine hors .test dans l'exemple — « ${host} »`);
      }
    }
    if (depth.example.giveaways.length < 2) problems.push(`${id} : l'exemple doit lister au moins deux indices`);
  }
  const factual = [depth.whyItWorks ?? "", ...(depth.prevention ?? []), ...(depth.decisionChecklist ?? []).flatMap((c) => [c.check, c.then])];
  if (factual.some((t) => PERCENT.test(t))) problems.push(`${id} : pourcentage dans un champ factuel (aucune statistique sans source)`);
  if (depth.decisionChecklist && (depth.decisionChecklist.length < 2 || depth.decisionChecklist.length > 5)) {
    problems.push(`${id} : decisionChecklist doit compter 2 à 5 questions`);
  }
  if (depth.decisionChecklist?.some((c) => !c.check.trim().endsWith("?"))) {
    problems.push(`${id} : chaque point de decisionChecklist est une question`);
  }
  if (depth.prevention && (depth.prevention.length < 2 || depth.prevention.length > 4)) {
    problems.push(`${id} : prevention doit compter 2 à 4 habitudes`);
  }
  if (depth.whyItWorks && howItWorks.includes(depth.whyItWorks.slice(0, 50))) {
    problems.push(`${id} : whyItWorks recopie howItWorks`);
  }
  return problems;
}

function auditDepthParity(id: string, fr: AttackDepth, en: AttackDepth): string[] {
  const shape = (d: AttackDepth) => ({
    whyItWorks: Boolean(d.whyItWorks),
    giveaways: d.example?.giveaways.length ?? 0,
    checklist: d.decisionChecklist?.length ?? 0,
    prevention: d.prevention?.length ?? 0,
  });
  const a = shape(fr);
  const b = shape(en);
  return (Object.keys(a) as (keyof typeof a)[])
    .filter((k) => a[k] !== b[k])
    .map((k) => `${id} : la traduction anglaise ne suit pas le français sur ${k} (${a[k]} ≠ ${b[k]})`);
}

/**
 * Two fiches whose prose has converged.
 *
 * This is the check that matters most once entries are written in batches:
 * the failure mode of writing twenty fiches in a sitting is not a duplicate
 * slug, it is twenty interchangeable introductions. Compared on word sets
 * rather than characters, because French boilerplate differs in punctuation
 * long before it differs in substance.
 *
 * The threshold is deliberately high (85%): below that, overlap between two
 * genuinely related attacks is expected and healthy.
 */
const NEAR_DUPLICATE_RATIO = 0.85;

/**
 * Short imperatives legitimately converge — « ne saisissez aucune
 * coordonnée bancaire » is the correct advice in a dozen fiches and
 * rewording it for novelty would make the site worse. Only passages long
 * enough to carry their own reasoning are compared.
 */
const MIN_WORDS_FOR_COMPARISON = 25;

function words(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3),
  );
}

function similarity(a: string, b: string): number {
  const wa = words(a);
  const wb = words(b);
  if (wa.size < MIN_WORDS_FOR_COMPARISON || wb.size < MIN_WORDS_FOR_COMPARISON)
    return 0;
  let shared = 0;
  for (const w of wa) if (wb.has(w)) shared += 1;
  return shared / Math.min(wa.size, wb.size);
}

export function findNearDuplicates(attacks: readonly AttackEntry[]): string[] {
  const problems: string[] = [];
  // The action fields were missing from this list, and two fiches reached
  // 88% on `whatToDo` without the build noticing. They are the fields a
  // reader acts on, so convergence matters there more than anywhere.
  const fields = [
    "definition",
    "howItWorks",
    "plainLanguageDefinition",
    "howToVerify",
    "whatToDo",
    "whatToDoIfVictim",
  ] as const;

  for (let i = 0; i < attacks.length; i += 1) {
    for (let j = i + 1; j < attacks.length; j += 1) {
      for (const field of fields) {
        const ratio = similarity(attacks[i][field], attacks[j][field]);
        if (ratio >= NEAR_DUPLICATE_RATIO) {
          problems.push(
            `${attacks[i].code} et ${attacks[j].code} : « ${field} » identique à ${Math.round(ratio * 100)} %`,
          );
        }
      }
    }
  }
  return problems;
}

function assertCatalogueIsSound(): void {
  const problems = auditCatalogue(ALL_ATTACKS);
  if (problems.length > 0) {
    throw new Error(
      `Catalogue d'attaques invalide :\n  - ${problems.join("\n  - ")}`,
    );
  }
}

assertCatalogueIsSound();

/**
 * Every published fiche. `draft` and `review` entries exist in the
 * catalogue — so they can be written and reviewed in the open — but have
 * no route, no sitemap entry and no internal link until they are promoted.
 */
export function listAttacks(): AttackEntry[] {
  return [...ALL_ATTACKS]
    .filter((a) => a.editorialStatus === "published")
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

/** Including drafts. For the audits and the editorial tooling only. */
export function listAllAttacksIncludingDrafts(): AttackEntry[] {
  return [...ALL_ATTACKS];
}

export function findAttackBySlug(slug: string): AttackEntry | undefined {
  return ALL_ATTACKS.find((a) => a.slug === slug);
}

export function findAttackByCode(code: string): AttackEntry | undefined {
  return ALL_ATTACKS.find((a) => a.code === code);
}

export function listAttacksInCategory(categorySlug: string): AttackEntry[] {
  return listAttacks().filter((a) => a.categorySlug === categorySlug);
}

export interface CategoryWithAttacks {
  category: AttackCategory;
  attacks: AttackEntry[];
}

/**
 * Families that actually have a page.
 *
 * This used to return all ten, including those below the publication
 * threshold — so /attaques rendered a heading and two links for each,
 * pointing at hubs that 404. Five broken links on the site's main page,
 * found by crawling the built output rather than by any audit.
 *
 * Filtering here rather than at each call site is deliberate: the next
 * page that lists families would otherwise reintroduce the same bug.
 */
export function listCategoriesWithAttacks(): CategoryWithAttacks[] {
  return ATTACK_CATEGORIES.filter(isCategoryPublishable).map((category) => ({
    category,
    attacks: listAttacksInCategory(category.slug),
  }));
}

/** Resolves `relatedAttackCodes` to entries, dropping nothing silently:
 * the registry audit already guarantees every code resolves. */
export function relatedAttacks(attack: AttackEntry): AttackEntry[] {
  return attack.relatedAttackCodes
    .map((code) => findAttackByCode(code))
    .filter((a): a is AttackEntry => a !== undefined);
}

/**
 * Membership helpers. These live here rather than in
 * `@/domain/attack/categories` because membership is declared on each
 * attack entry: deriving the mapping from the entries is what makes it
 * impossible for a category to claim an attack that does not exist, or to
 * miss one that does.
 */
export function getCategoryForAttackCode(
  code: string,
): AttackCategory | undefined {
  const attack = findAttackByCode(code);
  return attack
    ? ATTACK_CATEGORIES.find((c) => c.slug === attack.categorySlug)
    : undefined;
}

/**
 * A hub is publishable only once it actually has attacks to organise.
 * Applying to hubs the same quality gate attacks already have prevents the
 * classic category-page failure: an indexable URL whose entire body is
 * "no results".
 */
export function isCategoryPublishable(category: AttackCategory): boolean {
  return (
    listAttacksInCategory(category.slug).length >=
    CATEGORY_PUBLICATION_THRESHOLD
  );
}

/** Families declared but not yet publishable, with what they are waiting for. */
export function pendingCategories(): {
  slug: string;
  published: number;
  needed: number;
}[] {
  return ATTACK_CATEGORIES.filter((c) => !isCategoryPublishable(c)).map(
    (c) => ({
      slug: c.slug,
      published: listAttacksInCategory(c.slug).length,
      needed:
        CATEGORY_PUBLICATION_THRESHOLD - listAttacksInCategory(c.slug).length,
    }),
  );
}

export interface CategoryCoverageReport {
  /** Attacks no category claims — they would be unreachable via the hubs. */
  uncategorised: string[];
  /**
   * Families with zero published fiches. Not an error while the content
   * plan fills them in — `isCategoryPublishable` keeps them unrouted — but
   * worth reporting, because a family that stays empty for long is a
   * taxonomy decision that never happened.
   */
  emptyCategories: string[];
}

export function auditCategoryCoverage(): CategoryCoverageReport {
  const slugs = new Set(ATTACK_CATEGORIES.map((c) => c.slug));
  return {
    uncategorised: ALL_ATTACKS.filter((a) => !slugs.has(a.categorySlug)).map(
      (a) => a.code,
    ),
    emptyCategories: ATTACK_CATEGORIES.filter(
      (c) => listAttacksInCategory(c.slug).length === 0,
    ).map((c) => c.slug),
  };
}

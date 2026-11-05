/**
 * Indexability gate (brief §44) and canonical URL registry (§45).
 *
 * THE PROBLEM THIS SOLVES
 * -----------------------
 * The brief's central warning is signal drift:
 *
 *     Database = 1,000 pages
 *     Routes   = 1,000
 *     Sitemap  = 1,400
 *     Links    =   800
 *     Canonical=   950
 *
 * That happens when routing, the sitemap, internal links and canonicals are
 * each derived independently. Here they are all derived from
 * `buildUrlRegistry()`, so they cannot disagree: a URL absent from the
 * registry has no route, no sitemap entry and no canonical.
 *
 * Pure functions with no database or Next.js imports, so the rules are unit
 * testable without a running app.
 */

import { listAudiences } from "@/content/audiences";
import { ATTACK_CATEGORIES } from "@/domain/attack/categories";
import {
  isCategoryPublishable,
  listAttacks,
  listAttacksInCategory,
  listCategoriesWithAttacks,
} from "@/content/attacks";
import { getLocalizedAttack, getLocalizedCategory } from "@/content/attacks/localize";
import { findSimulationBySlug, listSimulations } from "@/content/simulations";
import { listSimulationsEn } from "@/content/simulations-en";
import { listVoiceSimulations } from "@/content/voice-simulations";
import { attacksUsingLever, listAllLevers, listLevers, listLeversEn } from "@/content/levers";
import { listGuides, listGuidesEn } from "@/content/guides";

export type UrlType = "static" | "category" | "attack" | "simulation" | "voice-simulation" | "lever" | "guide";

export interface RegistryEntry {
  /** Site-rooted path. The canonical path for this entity — one per entity. */
  path: string;
  type: UrlType;
  indexable: boolean;
  /** Present only for indexable entries; a noindex URL must never be listed. */
  inSitemap: boolean;
  /** Why a page is excluded, for the audit report. */
  excludedReason?: string;
  lastModified?: string | null;
}

/**
 * Routes that exist as authored pages rather than content entities.
 *
 * `indexable: false` entries are deliberately still listed: the registry is
 * the inventory of every public URL, and the audit needs to know a noindex
 * page exists in order to assert it is absent from the sitemap.
 */
const STATIC_ROUTES: readonly Omit<RegistryEntry, "inSitemap">[] = [
  { path: "/", type: "static", indexable: true },
  { path: "/attaques", type: "static", indexable: true },
  { path: "/simulations", type: "static", indexable: true },
  { path: "/leviers", type: "static", indexable: true },
  { path: "/guides", type: "static", indexable: true },
  { path: "/outils", type: "static", indexable: true },
  { path: "/outils/checklist-urgence", type: "static", indexable: true },
  { path: "/outils/j-ai-clique", type: "static", indexable: true },
  { path: "/outils/analyseur-de-message", type: "static", indexable: true },
  { path: "/outils/decodeur-de-lien", type: "static", indexable: true },
  { path: "/exemples", type: "static", indexable: true },
  { path: "/outils/x-ou-y", type: "static", indexable: true },
  { path: "/outils/generateur-mot-de-passe", type: "static", indexable: true },
  ...listAudiences().map((a) => ({ path: `/outils/${a.slug}`, type: "static" as const, indexable: true })),
  { path: "/a-propos", type: "static", indexable: true },
  { path: "/methodologie", type: "static", indexable: true },
  { path: "/sources", type: "static", indexable: true },
  { path: "/confidentialite", type: "static", indexable: true },
  { path: "/conditions-utilisation", type: "static", indexable: true },
  {
    path: "/restaurer",
    type: "static",
    indexable: false,
    excludedReason: "Consomme un jeton de récupération envoyé par email — sans valeur pour un visiteur venu de la recherche.",
  },
  {
    path: "/simulations/merci",
    type: "static",
    indexable: false,
    excludedReason: "Page de confirmation de paiement, propre à une transaction.",
  },
  // English pilot — docs/decisions/0009-i18n-pilot.md. Only the shell
  // routes: per-entity English entries are appended below, gated on an
  // actual translation existing, the same way the French entries are
  // gated on publication.
  { path: "/en", type: "static", indexable: true },
  { path: "/en/attaques", type: "static", indexable: true },
  { path: "/en/simulations", type: "static", indexable: true },
  { path: "/en/guides", type: "static", indexable: true },
  { path: "/en/tools", type: "static", indexable: true },
  { path: "/en/levers", type: "static", indexable: true },
  { path: "/en/tools/emergency-checklist", type: "static", indexable: true },
  { path: "/en/tools/i-clicked", type: "static", indexable: true },
  { path: "/en/tools/message-analyzer", type: "static", indexable: true },
  { path: "/en/tools/link-decoder", type: "static", indexable: true },
  { path: "/en/examples", type: "static", indexable: true },
  { path: "/en/tools/x-or-y", type: "static", indexable: true },
  { path: "/en/tools/password-generator", type: "static", indexable: true },
  ...listAudiences().map((a) => ({ path: `/en/tools/${a.enSlug}`, type: "static" as const, indexable: true })),
  { path: "/en/about", type: "static", indexable: true },
  { path: "/en/methodology", type: "static", indexable: true },
  { path: "/en/sources", type: "static", indexable: true },
  { path: "/en/privacy", type: "static", indexable: true },
  { path: "/en/terms", type: "static", indexable: true },
];

/**
 * The registry is derived from the content catalogue in `src/content`,
 * which is also what `generateStaticParams` renders from. Routing, the
 * sitemap, internal links and canonicals therefore cannot disagree: they
 * all read the same array (docs/decisions/0007-content-in-repository.md).
 */
export function buildUrlRegistry(): RegistryEntry[] {
  const attacks = listAttacks();
  const latest = (dates: readonly string[]) => dates.reduce((max, d) => (d > max ? d : max), "1970-01-01");
  const newestAttack = latest(attacks.map((a) => a.updatedAt));

  // `lastmod` is only worth sending when it is true: search engines stop
  // trusting a site's dates once they see them move without the page
  // changing. An index takes the date of the catalogue it lists. Pages with
  // no editorial date of their own — the homepage, simulations, tools,
  // legal pages — send none rather than borrow the newest fiche's date,
  // which is what every one of them used to claim.
  const STATIC_LASTMOD: Record<string, string> = {
    "/attaques": newestAttack,
    "/en/attaques": newestAttack,
    // The gallery shows the fiches' examples: it changes when they do.
    "/exemples": newestAttack,
    "/en/examples": newestAttack,
    "/guides": latest(listGuides().map((g) => g.updatedAt)),
    "/en/guides": latest(listGuidesEn().map((g) => g.updatedAt)),
    "/en/levers": latest(listLeversEn().map((l) => l.updatedAt)),
    "/leviers": latest(listLevers().map((l) => l.updatedAt)),
  };

  const entries: RegistryEntry[] = STATIC_ROUTES.map((route) => ({
    ...route,
    inSitemap: route.indexable,
    lastModified: route.indexable ? (STATIC_LASTMOD[route.path] ?? null) : null,
  }));

  for (const category of ATTACK_CATEGORIES) {
    const publishable = isCategoryPublishable(category);
    entries.push({
      path: `/attaques/${category.slug}`,
      type: "category",
      indexable: publishable,
      inSitemap: publishable,
      lastModified: listAttacksInCategory(category.slug).reduce(
        (max, a) => (a.updatedAt > max ? a.updatedAt : max),
        "1970-01-01",
      ),
      ...(publishable
        ? {}
        : {
            excludedReason:
              "Aucune attaque publiée dans cette catégorie — une page de hub vide serait une page creuse.",
          }),
    });
  }

  for (const attack of attacks) {
    entries.push({
      path: `/attaques/${attack.slug}`,
      type: "attack",
      indexable: true,
      inSitemap: true,
      lastModified: attack.updatedAt,
    });
  }

  for (const sim of listSimulations()) {
    entries.push({
      path: `/simulations/${sim.slug}`,
      type: "simulation",
      indexable: true,
      inSitemap: true,
      lastModified: null,
    });
  }

  // A voice scenario is authored before it is activated
  // (docs/decisions/0008 §6): the page exists and explains a real attack
  // as soon as it's in `src/content/voice-simulations`, but stays
  // `noindex` until a Dograh workflow and embed token exist for it — the
  // same activation flag `VoiceSimulationPage`'s own `generateMetadata`
  // reads.
  for (const voiceSim of listVoiceSimulations()) {
    const activated = voiceSim.dograhEmbedToken !== null;
    entries.push({
      path: `/simulations/voix/${voiceSim.slug}`,
      type: "voice-simulation",
      indexable: activated,
      inSitemap: activated,
      lastModified: null,
      ...(activated
        ? {}
        : {
            excludedReason:
              "Scénario vocal rédigé mais pas encore activé : aucun compte Dograh n'existe pour ce projet (docs/decisions/0008).",
          }),
    });
  }

  // Levers below the publication threshold are inventoried and withheld,
  // for the same reason as an under-populated category hub: a page whose
  // list of examples is shorter than its own explanation.
  const publishedLevers = new Set(listLevers().map((l) => l.slug));
  for (const lever of listAllLevers()) {
    const publishable = publishedLevers.has(lever.slug);
    entries.push({
      path: `/leviers/${lever.slug}`,
      type: "lever",
      indexable: publishable,
      inSitemap: publishable,
      lastModified: lever.updatedAt,
      ...(publishable
        ? {}
        : {
            excludedReason: `Seulement ${attacksUsingLever(lever.code).length} fiche(s) déclarent ce levier — la page aurait moins d'exemples que d'explication.`,
          }),
    });
  }

  for (const guide of listGuides()) {
    entries.push({
      path: `/guides/${guide.slug}`,
      type: "guide",
      indexable: true,
      inSitemap: true,
      lastModified: guide.updatedAt,
    });
  }

  // English pilot (docs/decisions/0009-i18n-pilot.md §1). Only entities
  // with an actual `translations.en` — never every French entity under an
  // `/en/` prefix, which would ship untranslated pages as if reviewed.
  for (const category of ATTACK_CATEGORIES) {
    if (!isCategoryPublishable(category)) continue;
    const localized = getLocalizedCategory(category, "en");
    if (!localized) continue;
    entries.push({
      path: `/en/attaques/${localized.slug}`,
      type: "category",
      indexable: true,
      inSitemap: true,
      lastModified: listAttacksInCategory(category.slug).reduce(
        (max, a) => (a.updatedAt > max ? a.updatedAt : max),
        "1970-01-01",
      ),
    });
  }

  for (const attack of attacks) {
    const localized = getLocalizedAttack(attack, "en");
    if (!localized) continue;
    entries.push({
      path: `/en/attaques/${localized.slug}`,
      type: "attack",
      indexable: true,
      inSitemap: true,
      lastModified: attack.updatedAt,
    });
  }

  for (const lever of listLeversEn()) {
    entries.push({
      path: `/en/levers/${lever.slug}`,
      type: "lever",
      indexable: true,
      inSitemap: true,
      lastModified: lever.updatedAt,
    });
  }

  for (const guide of listGuidesEn()) {
    entries.push({
      path: `/en/guides/${guide.slug}`,
      type: "guide",
      indexable: true,
      inSitemap: true,
      lastModified: guide.updatedAt,
    });
  }

  for (const sim of listSimulationsEn()) {
    entries.push({
      path: `/en/simulations/${sim.slug}`,
      type: "simulation",
      indexable: true,
      inSitemap: true,
      lastModified: null,
    });
  }

  return entries;
}

/**
 * Cross-catalogue checks neither registry can make alone: an attack
 * pointing at a simulation that does not exist would ship a broken
 * "Testez-vous" link, and a simulation attached to a removed attack would
 * be an orphan reachable from nowhere.
 */
export function auditContentGraph(): string[] {
  const problems: string[] = [];
  const attacks = listAttacks();
  const codes = new Set(attacks.map((a) => a.code));

  for (const attack of attacks) {
    if (attack.simulationSlug && !findSimulationBySlug(attack.simulationSlug)) {
      problems.push(`${attack.code} : simulation « ${attack.simulationSlug} » introuvable`);
    }
  }
  for (const sim of listSimulations()) {
    if (!codes.has(sim.attackCode)) {
      problems.push(`${sim.slug} : rattachée à un code d'attaque inexistant « ${sim.attackCode} »`);
    }
  }

  // Reciprocity. A one-way "attaques liées" edge is a navigation dead end:
  // the reader arrives from A expecting to be able to go back, and B never
  // mentions A. Declaring the relation on both sides is also what keeps
  // the graph usable as a graph rather than as a pile of hints.
  for (const attack of attacks) {
    for (const relatedCode of attack.relatedAttackCodes) {
      const other = attacks.find((a) => a.code === relatedCode);
      if (other && !other.relatedAttackCodes.includes(attack.code)) {
        problems.push(
          `relation à sens unique : ${attack.code} → ${relatedCode} (${relatedCode} ne renvoie pas vers ${attack.code})`,
        );
      }
    }
  }

  // Orphans. An indexable URL must be reachable by following real anchors,
  // not only by reading the sitemap — a page a crawler can only find in an
  // XML file is a page no human ever reaches either
  // (brief ORPHAN_POLICY §22).
  problems.push(...findOrphanPaths());

  return problems;
}

/**
 * The cross-catalogue audit runs at module load, like the four catalogue
 * audits do.
 *
 * It did not, until now: reciprocity, orphans and dangling simulation
 * references were only checked by the test suite, so a push that skipped
 * the tests could ship a one-way edge or an unreachable page. The
 * commit messages claiming these "fail the build" were wrong about
 * where the check ran; this makes them true.
 *
 * Safe against import cycles: this module imports from src/content, and
 * nothing under src/content imports it back.
 */
const graphProblems = auditContentGraph();
if (graphProblems.length > 0) {
  throw new Error(`Graphe de contenu invalide :\n  - ${graphProblems.join("\n  - ")}`);
}

/**
 * Indexable paths with no incoming internal link.
 *
 * Only content routes are computed here: an attack fiche is linked from
 * its hub, a hub from /attaques, a simulation from /simulations. The
 * standalone routes (/a-propos, /methodologie…) are covered by the
 * existing anchor test in src/app/seo.test.ts, which reads the real JSX.
 */
export function findOrphanPaths(): string[] {
  const problems: string[] = [];
  const attacks = listAttacks();

  for (const attack of attacks) {
    const category = ATTACK_CATEGORIES.find((c) => c.slug === attack.categorySlug);
    // A fiche in a family below the publication threshold has no hub to be
    // linked from: the hub is not routed. It would be reachable only from
    // the flat /attaques index, which is a weak single point of entry.
    if (category && !isCategoryPublishable(category)) {
      problems.push(
        `${attack.code} : sa famille « ${attack.categorySlug} » n'est pas publiée, la fiche n'a pas de hub parent`,
      );
    }
  }

  for (const sim of listSimulations()) {
    const linked = attacks.some((a) => a.simulationSlug === sim.slug);
    if (!linked) {
      problems.push(
        `simulation orpheline : ${sim.slug} n'est liée depuis aucune fiche publiée`,
      );
    }
  }

  // A published lever is linked from every fiche declaring it, so the
  // threshold check IS the orphan check — but state it, so removing the
  // threshold cannot silently orphan a lever page.
  for (const lever of listLevers()) {
    const count = attacksUsingLever(lever.code).length;
    if (count === 0) {
      problems.push(`levier orphelin : ${lever.slug} n'est déclaré par aucune fiche publiée`);
    }
  }

  // Outbound side of the same rule: a fiche whose family is routed is
  // fine, but a page must never LINK to a family that is not. That is the
  // defect the crawl found — /attaques listed all ten families and five of
  // them 404ed — and it is invisible to a check that only looks at
  // incoming links.
  for (const category of ATTACK_CATEGORIES) {
    const routed = isCategoryPublishable(category);
    const listed = listCategoriesWithAttacks().some((c) => c.category.slug === category.slug);
    if (listed && !routed) {
      problems.push(
        `lien sortant vers un hub non routé : /attaques/${category.slug} est listé mais renvoie un 404`,
      );
    }
  }

  // English side of the same rules. An English fiche is linked from its
  // English hub, which exists only when the family itself is translated;
  // an English simulation is linked only from the translated fiche that
  // names it in `translations.en.simulationSlug`.
  for (const attack of attacks) {
    if (!getLocalizedAttack(attack, "en")) continue;
    const category = ATTACK_CATEGORIES.find((c) => c.slug === attack.categorySlug);
    if (category && isCategoryPublishable(category) && !getLocalizedCategory(category, "en")) {
      problems.push(
        `${attack.code} (en) : sa famille « ${attack.categorySlug} » n'a pas de hub anglais, la fiche n'a pas de parent`,
      );
    }
  }
  for (const sim of listSimulationsEn()) {
    const linked = attacks.some((a) => getLocalizedAttack(a, "en")?.simulationSlug === sim.slug);
    if (!linked) {
      problems.push(`simulation anglaise orpheline : ${sim.slug} n'est liée depuis aucune fiche traduite`);
    }
  }

  // A guide is linked from the fiches it names. One that names none is
  // reachable only from /guides, which is a single point of entry.
  for (const guide of listGuides()) {
    const linked = attacks.some((a) => guide.relatedAttackCodes.includes(a.code));
    if (!linked) {
      problems.push(`guide orphelin : ${guide.slug} ne cite aucune fiche publiée`);
    }
  }

  return problems;
}

/**
 * Category hubs and attack pages share the `/attaques/[slug]` namespace, as
 * the brief specifies (`/attaques/ingenierie-sociale` alongside
 * `/attaques/homoglyphes`). One namespace with two entity types means a slug
 * collision would make one entity permanently unreachable — silently.
 *
 * This finds such collisions so a test can fail on them.
 */
export function findDuplicatePaths(entries: readonly RegistryEntry[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.path)) duplicates.add(entry.path);
    seen.add(entry.path);
  }
  return [...duplicates];
}

export function indexableEntries(entries: readonly RegistryEntry[]): RegistryEntry[] {
  return entries.filter((entry) => entry.indexable);
}

/**
 * Invariants that must hold for the signals to tell one consistent story
 * (the brief's canonicalisation requirement). Returns human-readable
 * violations; an empty array means the registry is coherent.
 */
export function auditRegistry(entries: readonly RegistryEntry[]): string[] {
  const violations: string[] = [];

  for (const path of findDuplicatePaths(entries)) {
    violations.push(`URL en double dans le registre : ${path}`);
  }

  for (const entry of entries) {
    if (!entry.indexable && entry.inSitemap) {
      violations.push(`URL noindex présente dans le sitemap : ${entry.path}`);
    }
    if (entry.indexable && !entry.inSitemap) {
      violations.push(`URL indexable absente du sitemap : ${entry.path}`);
    }
    if (!entry.path.startsWith("/")) {
      violations.push(`Chemin non enraciné : ${entry.path}`);
    }
    if (entry.path !== "/" && entry.path.endsWith("/")) {
      violations.push(`Slash final incohérent : ${entry.path}`);
    }
    if (entry.path !== entry.path.toLowerCase()) {
      violations.push(`Chemin non minuscule : ${entry.path}`);
    }
  }

  return violations;
}

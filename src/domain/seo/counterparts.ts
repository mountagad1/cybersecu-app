import { listAttacks } from "@/content/attacks";
import { getLocalizedAttack, getLocalizedCategory } from "@/content/attacks/localize";
import { audiencePath, listAudiences } from "@/content/audiences";
import { englishGuideSlug, listGuides } from "@/content/guides";
import { englishLeverSlug, listLevers } from "@/content/levers";
import { englishToolSlug, listTools } from "@/content/tools";
import { ATTACK_CATEGORIES } from "@/domain/attack/categories";
import { GALLERY_PATH } from "@/domain/attack/gallery";
import { buildUrlRegistry } from "@/domain/seo/indexability";

/**
 * The other-language version of a page, as a visible link target.
 *
 * Search Console (docs/growth/EXPERIMENT_LOG.md, cycle 6): Google crawled the
 * English pages first, and 97 French pages were still « discovered, not
 * crawled » a month later. Hreflang names the pair in `<head>`, but no
 * `<a href>` led from an English page to its French one (or back): from a
 * crawled page, the counterpart had no followable link.
 *
 * Built from the same content helpers the routes use for `alternates`, and
 * kept only when both ends are indexable registry entries. `pnpm test`
 * checks it is a symmetric pairing over the registry; the SEO crawl checks
 * it matches the hreflang every page emits.
 */

type Pair = readonly [fr: string, en: string];

const STATIC_PAIRS: readonly Pair[] = [
  ["/", "/en"],
  ["/attaques", "/en/attaques"],
  ["/simulations", "/en/simulations"],
  ["/guides", "/en/guides"],
  ["/leviers", "/en/levers"],
  ["/outils", "/en/tools"],
  ["/a-propos", "/en/about"],
  ["/methodologie", "/en/methodology"],
  ["/sources", "/en/sources"],
  ["/confidentialite", "/en/privacy"],
  ["/conditions-utilisation", "/en/terms"],
  [GALLERY_PATH.fr, GALLERY_PATH.en],
];

function* contentPairs(): Generator<Pair> {
  for (const attack of listAttacks()) {
    const en = getLocalizedAttack(attack, "en");
    if (!en) continue;
    yield [`/attaques/${attack.slug}`, `/en/attaques/${en.slug}`];
    // An attack's own simulation pairs with the simulation of its English overlay.
    if (attack.simulationSlug && en.simulationSlug) {
      yield [`/simulations/${attack.simulationSlug}`, `/en/simulations/${en.simulationSlug}`];
    }
  }
  for (const category of ATTACK_CATEGORIES) {
    const en = getLocalizedCategory(category, "en");
    if (en) yield [`/attaques/${category.slug}`, `/en/attaques/${en.slug}`];
  }
  for (const guide of listGuides()) {
    const en = englishGuideSlug(guide.slug);
    if (en) yield [`/guides/${guide.slug}`, `/en/guides/${en}`];
  }
  for (const lever of listLevers()) {
    const en = englishLeverSlug(lever.slug);
    if (en) yield [`/leviers/${lever.slug}`, `/en/levers/${en}`];
  }
  for (const tool of listTools()) {
    const en = englishToolSlug(tool.slug);
    if (en) yield [`/outils/${tool.slug}`, `/en/tools/${en}`];
  }
  for (const audience of listAudiences()) {
    yield [audiencePath(audience, "fr"), audiencePath(audience, "en")];
  }
}

let cached: Map<string, string> | null = null;

/** Every pair, both directions, restricted to indexable registry paths. */
export function counterpartMap(): ReadonlyMap<string, string> {
  if (cached) return cached;
  const indexable = new Set(buildUrlRegistry().filter((e) => e.indexable).map((e) => e.path));
  const map = new Map<string, string>();
  for (const [fr, en] of [...STATIC_PAIRS, ...contentPairs()]) {
    if (!indexable.has(fr) || !indexable.has(en)) continue;
    map.set(fr, en);
    map.set(en, fr);
  }
  cached = map;
  return map;
}

export function counterpartOf(path: string): string | null {
  return counterpartMap().get(path) ?? null;
}

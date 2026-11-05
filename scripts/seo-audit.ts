/**
 * Internal SEO QC report (brief §43 CRAWL_AUDIT, §46 SEO_QC).
 *
 * Run: `pnpm seo:audit`
 *
 * Reports the invariants that are cheap to break and expensive to notice.
 * Exits non-zero on a violation so it can gate CI.
 *
 * Scope note: this audits the *registry* — the source of truth that routing,
 * the sitemap and canonicals all derive from. It deliberately does not crawl
 * the deployed site; that needs a provisioned database and a running server,
 * and a script that silently skips its checks when those are missing would be
 * worse than no script.
 */

import { ATTACK_CATEGORIES } from "../src/domain/attack/categories";
import {
  auditCategoryCoverage,
  isCategoryPublishable,
  listAttacks,
  listAttacksInCategory,
  pendingCategories,
} from "../src/content/attacks";
import { auditSimulations, listSimulations } from "../src/content/simulations";
import {
  auditContentGraph,
  auditRegistry,
  buildUrlRegistry,
  indexableEntries,
} from "../src/domain/seo/indexability";

function main(): void {
  const registry = buildUrlRegistry();
  const indexable = indexableEntries(registry);
  const noindex = registry.filter((e) => !e.indexable);

  const registryViolations = auditRegistry(registry);
  const coverage = auditCategoryCoverage();

  console.log("cybersecu.app — rapport SEO interne");
  console.log("===================================");
  console.log("Source des données : le catalogue versionné dans src/content.\n");

  console.log("INVENTAIRE");
  console.log(`  URLs au registre       : ${registry.length}`);
  console.log(`  Indexables             : ${indexable.length}`);
  console.log(`  Noindex                : ${noindex.length}`);
  // Derived from the entries, not a hard-coded list: adding a page type
  // to the registry must not silently drop it out of this report.
  for (const type of [...new Set(indexable.map((e) => e.type))].sort()) {
    const count = indexable.filter((e) => e.type === type).length;
    console.log(`    ${type.padEnd(21)}: ${count}`);
  }

  console.log("\nCOUVERTURE DES SIMULATIONS");
  const allAttacks = listAttacks();
  const withSim = allAttacks.filter((a) => a.simulationSlug);
  const deliberate = allAttacks.filter((a) => a.noSimulationReason);
  const pendingSimulations = allAttacks.filter((a) => !a.simulationSlug && !a.noSimulationReason);
  console.log(`  Fiches avec simulation : ${withSim.length}`);
  console.log(`  Sans, délibérément     : ${deliberate.length}`);
  console.log(`  À écrire               : ${pendingSimulations.length}`);
  if (pendingSimulations.length > 0) {
    console.log("  (une fiche sans simulation et sans raison déclarée est une décision");
    console.log("   qui n'a pas encore été prise, pas une fiche qui s'en passe)");
    for (const attack of pendingSimulations) console.log(`    · ${attack.slug}`);
  }

  console.log("\nTAXONOMIE");
  console.log(`  Catégories définies    : ${ATTACK_CATEGORIES.length}`);
  const publishedHubs = ATTACK_CATEGORIES.filter((c) => isCategoryPublishable(c));
  console.log(`  Hubs publiables        : ${publishedHubs.length}`);
  for (const category of ATTACK_CATEGORIES) {
    const live = isCategoryPublishable(category);
    console.log(
      `    ${live ? "✓" : "·"} ${category.slug.padEnd(32)} ${listAttacksInCategory(category.slug).length} technique(s)${
        live ? "" : " — en attente"
      }`,
    );
  }

  const pending = pendingCategories();
  if (pending.length > 0) {
    console.log("\nFAMILLES DÉCLARÉES, PAS ENCORE PUBLIÉES");
    console.log("  (un hub à moins de trois fiches dupliquerait ce qu'il liste)");
    for (const p of pending) {
      console.log(
        `  · ${p.slug.padEnd(32)} ${p.published} fiche(s) — encore ${p.needed} avant publication`,
      );
    }
  }

  console.log("\nPAGES NOINDEX (attendu, exclues du sitemap)");
  for (const entry of noindex) {
    console.log(`  · ${entry.path} — ${entry.excludedReason ?? "raison non renseignée"}`);
  }

  const problems: string[] = [
    ...registryViolations,
    ...coverage.uncategorised.map(
      (code) => `Attaque publiée sans catégorie (inatteignable via les hubs) : ${code}`,
    ),
    // A declared-but-empty family is NOT a violation: the taxonomy is
    // published ahead of the content it will hold, and
    // `isCategoryPublishable` already keeps such a hub out of routing and
    // the sitemap. It is reported above as pending, not as a fault.
    ...auditContentGraph(),
    ...auditSimulations(listSimulations()),
  ];

  console.log("\nRÉSULTAT");
  if (problems.length === 0) {
    console.log("  ✓ Aucune incohérence détectée.");
    return;
  }

  for (const problem of problems) console.log(`  ✗ ${problem}`);
  process.exitCode = 1;
}

main();

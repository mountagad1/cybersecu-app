/**
 * Ranked SEO opportunities from Search Console exports
 * (docs/growth/WEEKLY_SEO_GEO_PROTOCOL.md §4, `src/domain/growth/opportunities.ts`).
 *
 *   pnpm growth:opportunities --after exports/2026-10-26 [--before exports/2026-09-28] [--today 2026-10-26]
 *
 * Output: Markdown — opportunities by priority (actionable first, then
 * those deferred by an experiment freeze), and query clusters with the
 * fiches they may belong to. A Performance export has no query × page
 * table, so the cluster → page link is a lead to check, never a fact.
 *
 * Nothing is sent anywhere; the exports stay on disk, out of the repository.
 */

import { load } from "./gsc-csv";
import { clusterQueries, findOpportunities, type Opportunity } from "../src/domain/growth/opportunities";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const LABEL: Record<Opportunity["type"], string> = {
  high_impressions_low_ctr: "1ʳᵉ page, CTR faible",
  positions_4_to_10: "positions 4–10",
  positions_11_to_20: "positions 11–20",
  declining_page: "en baisse",
};

function row(o: Opportunity): string {
  const m = o.observed;
  const s = o.scores;
  const ctr = m.impressions ? `${((100 * m.clicks) / m.impressions).toFixed(1)} %` : "—";
  const before = o.before ? ` (avant : ${o.before.clicks} clics, ${o.before.impressions} impr.)` : "";
  return `| ${o.deferredBy ? o.deferredBy.priorityAfter : s.priority} | ${o.page.path} | ${o.page.pageType} | ${LABEL[o.type]} | ${m.clicks} | ${m.impressions} | ${ctr} | ${m.position.toFixed(1)}${before} | ${s.impact}·${s.confidence}·${s.leverage} / ${s.effort}·${o.deferredBy ? "2 (5 pendant le gel)" : s.risk} |`;
}

function main() {
  const afterDir = arg("after");
  if (!afterDir) {
    console.error("usage : pnpm growth:opportunities --after <dossier> [--before <dossier>] [--today AAAA-MM-JJ]");
    process.exit(1);
  }
  const today = arg("today") ?? new Date().toISOString().slice(0, 10);
  const beforeDir = arg("before");
  const opportunities = findOpportunities(load(afterDir, "pages"), today, beforeDir ? load(beforeDir, "pages") : undefined);

  console.log("# Opportunités SEO\n");
  console.log(`Date de décision : ${today}. Fenêtre : ${afterDir}${beforeDir ? ` (comparée à ${beforeDir})` : ""}.`);
  console.log("Score = (Impact × Confidence × Leverage) / (Effort × Risk), notes 1–5 de GROWTH_OS.md §4 (G-003). Risk 5 bloque. Il classe ; il ne prédit rien.\n");
  const head = "| Score | Page | Type | Opportunité | Clics | Impr. | CTR | Position | I·C·L / E·R |\n| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | --- |";

  const actionable = opportunities.filter((o) => o.status === "actionable");
  const deferred = opportunities.filter((o) => o.status === "deferred");
  console.log(`## Actionnables maintenant : ${actionable.length}\n`);
  if (actionable.length) console.log(`${head}\n${actionable.map(row).join("\n")}`);
  const freezes = [...new Set(deferred.map((o) => `${o.deferredBy!.id} (jusqu'au ${o.deferredBy!.until})`))];
  console.log(`\n## Différées par un gel d'expérience : ${deferred.length} — ${freezes.join(", ") || "aucun"}\n`);
  if (deferred.length) {
    console.log("Bloquées (Risk 5) jusqu'à la fin du gel. Score affiché : celui qu'elles auront ensuite, avec Risk 2.\n");
    console.log(`${head}\n${deferred.map(row).join("\n")}`);
  }

  const clusters = clusterQueries(load(afterDir, "queries")).filter((c) => c.metrics.impressions >= 10);
  console.log(`\n## Clusters de requêtes (≥ 10 impressions) : ${clusters.length}\n`);
  console.log("| Cluster | Variantes | Clics | Impr. | Position | Fiches candidates (heuristique) |\n| --- | ---: | ---: | ---: | ---: | --- |");
  for (const c of clusters) {
    console.log(
      `| ${c.key} | ${c.queries.length} | ${c.metrics.clicks} | ${c.metrics.impressions} | ${c.metrics.position.toFixed(1)} | ${c.candidateAttacks.join(", ") || "—"} |`,
    );
  }
}

main();

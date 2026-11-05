/**
 * Weekly segmentation of Search Console exports
 * (docs/growth/WEEKLY_SEO_GEO_PROTOCOL.md §3).
 *
 * Input: the zip Search Console produces from Performance → Export → CSV,
 * unzipped into a folder (Pages.csv, Queries.csv, Countries.csv,
 * Devices.csv — French names « Requêtes », « Pays », « Appareils » are read
 * too). Two folders, two windows of the same length:
 *
 *   pnpm growth:segment --before exports/2026-11-02 --after exports/2026-11-30
 *   pnpm growth:segment --after exports/2026-11-30          # one window, no verdicts
 *
 * Output: Markdown tables by page type, language, family, entity, intent,
 * country and device, each change marked up / down / noise / insufficient
 * by the anti-noise rules (src/domain/growth/noise.ts). Also: URLs Google
 * reports that the registry does not list, and indexable pages with no
 * impression at all.
 *
 * Nothing is sent anywhere; the exports stay on disk, out of the repository.
 */

import { load, type Row } from "./gsc-csv";
import { buildUrlRegistry } from "../src/domain/seo/indexability";
import { classifyPage, classifyQuery } from "../src/domain/growth/segment";
import { aggregate, compareWindows, ctr, type Verdict, type WindowMetrics } from "../src/domain/growth/noise";


function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function group(rows: Row[], by: (r: Row) => string | null): Map<string, WindowMetrics> {
  const buckets = new Map<string, Row[]>();
  for (const r of rows) {
    const k = by(r) ?? "—";
    buckets.set(k, [...(buckets.get(k) ?? []), r]);
  }
  return new Map([...buckets].map(([k, rs]) => [k, aggregate(rs)]));
}

const MARK: Record<Verdict, string> = { up: "▲", down: "▼", noise: "·", insufficient: "?" };
const pct = (m: WindowMetrics) => `${(ctr(m) * 100).toFixed(1)} %`;
const pos = (m: WindowMetrics) => (m.impressions ? m.position.toFixed(1) : "—");

function table(title: string, before: Map<string, WindowMetrics> | null, after: Map<string, WindowMetrics>, limit = 40) {
  console.log(`\n## ${title}\n`);
  const keys = [...new Set([...after.keys(), ...(before?.keys() ?? [])])]
    .sort((a, b) => (after.get(b)?.impressions ?? 0) - (after.get(a)?.impressions ?? 0))
    .slice(0, limit);
  const empty: WindowMetrics = { clicks: 0, impressions: 0, position: 0 };
  if (!before) {
    console.log("| Segment | Clics | Impressions | CTR | Position |\n| --- | ---: | ---: | ---: | ---: |");
    for (const k of keys) {
      const a = after.get(k)!;
      console.log(`| ${k} | ${a.clicks} | ${a.impressions} | ${pct(a)} | ${pos(a)} |`);
    }
    return;
  }
  console.log("| Segment | Clics | Impressions | CTR | Position | Clics | CTR | Pos. |\n| --- | ---: | ---: | ---: | ---: | :---: | :---: | :---: |");
  for (const k of keys) {
    const b = before.get(k) ?? empty;
    const a = after.get(k) ?? empty;
    const v = compareWindows(b, a);
    console.log(
      `| ${k} | ${b.clicks} → ${a.clicks} | ${b.impressions} → ${a.impressions} | ${pct(b)} → ${pct(a)} | ${pos(b)} → ${pos(a)} | ${MARK[v.clicks]} | ${MARK[v.ctr]} | ${MARK[v.position]} |`,
    );
  }
}

function main() {
  const beforeDir = arg("before");
  const afterDir = arg("after");
  if (!afterDir) {
    console.error("usage : pnpm growth:segment [--before <dossier>] --after <dossier>");
    process.exit(2);
  }
  const has = Boolean(beforeDir);
  const pages = { before: load(beforeDir, "pages"), after: load(afterDir, "pages") };
  const queries = { before: load(beforeDir, "queries"), after: load(afterDir, "queries") };

  console.log("# Segmentation Search Console");
  console.log(`\nFenêtres : ${has ? `avant = ${beforeDir}, ` : ""}après = ${afterDir}.`);
  console.log("Verdicts : ▲ hausse, ▼ baisse, · bruit, ? données insuffisantes (src/domain/growth/noise.ts).");

  const page = (r: Row) => classifyPage(r.key);
  const dims: [string, (r: Row) => string | null][] = [
    ["Par type de page", (r) => page(r).pageType],
    ["Par langue", (r) => page(r).locale],
    ["Par famille (fiches, hubs, simulations) ou intention de guide", (r) => page(r).category],
    ["Par entité (fiche, guide, levier — FR et EN réunis)", (r) => page(r).entity],
  ];
  for (const [title, by] of dims) {
    table(title, has ? group(pages.before, by) : null, group(pages.after, by));
  }
  if (queries.after.length) {
    // Query rows are capped by Search Console and anonymized queries are
    // missing: these totals are smaller than the page totals, by design.
    table("Requêtes par intention", has ? group(queries.before, (r) => classifyQuery(r.key).intent) : null, group(queries.after, (r) => classifyQuery(r.key).intent));
    table("Requêtes par langue", has ? group(queries.before, (r) => classifyQuery(r.key).language) : null, group(queries.after, (r) => classifyQuery(r.key).language));
  }
  for (const kind of ["countries", "devices"] as const) {
    const after = load(afterDir, kind);
    if (!after.length) continue;
    table(kind === "countries" ? "Par pays" : "Par appareil", has ? group(load(beforeDir, kind), (r) => r.key) : null, group(after, (r) => r.key), 15);
  }

  // Daily rows (Dates.csv / Graphique.csv): the last two weeks of the « after »
  // window against each other, so a trend inside one export gets a verdict too.
  const days = load(afterDir, "dates").filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.key));
  if (days.length >= 14) {
    const w1 = aggregate(days.slice(-14, -7));
    const w2 = aggregate(days.slice(-7));
    const v = compareWindows(w1, w2);
    console.log("\n## Tendance : avant-dernière semaine → dernière semaine\n");
    console.log(`${days.at(-14)!.key} → ${days.at(-1)!.key}`);
    console.log(`Clics ${w1.clicks} → ${w2.clicks} ${MARK[v.clicks]} · impressions ${w1.impressions} → ${w2.impressions} · CTR ${pct(w1)} → ${pct(w2)} ${MARK[v.ctr]} · position ${pos(w1)} → ${pos(w2)} ${MARK[v.position]}`);
  }

  const unknown = pages.after.filter((r) => !classifyPage(r.key).inRegistry);
  console.log(`\n## URL vues par Google, absentes du registre indexable : ${unknown.length}\n`);
  for (const r of unknown.slice(0, 50)) console.log(`- ${r.key} (${r.impressions} impressions)`);

  const seen = new Set(pages.after.map((r) => classifyPage(r.key).path));
  const silent = buildUrlRegistry().filter((e) => e.indexable && !seen.has(e.path));
  console.log(`\n## Pages indexables sans aucune impression : ${silent.length}\n`);
  const byType = group(
    silent.map((e) => ({ key: e.path, clicks: 0, impressions: 0, position: 0 })),
    (r) => classifyPage(r.key).pageType,
  );
  for (const k of byType.keys()) console.log(`- ${k} : ${silent.filter((e) => classifyPage(e.path).pageType === k).length}`);
}

main();

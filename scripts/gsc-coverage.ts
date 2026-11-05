/**
 * Reads the Search Console « Pages » (indexing) export
 * (docs/growth/WEEKLY_SEO_GEO_PROTOCOL.md §1.2).
 *
 * Input: the zip from Indexation → Pages → Exporter, unzipped into a folder
 * (Graphique.csv / Chart.csv, Problèmes critiques.csv / Critical issues.csv).
 *
 *   pnpm growth:coverage exports/coverage-2026-10-12
 *
 * Output: indexed vs declared pages (registry), the reasons pages are not
 * indexed, and the daily impressions trend split into two equal halves and
 * into the last two weeks, each with a verdict from the anti-noise rules
 * (src/domain/growth/noise.ts). Nothing leaves the machine.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildUrlRegistry } from "../src/domain/seo/indexability";
import { countVerdict, type Verdict } from "../src/domain/growth/noise";

const MARK: Record<Verdict, string> = { up: "▲ hausse", down: "▼ baisse", noise: "· bruit", insufficient: "? insuffisant" };

function rows(dir: string, name: RegExp): string[][] {
  const file = readdirSync(dir).find((f) => name.test(f.normalize("NFC")));
  if (!file) return [];
  // These exports carry no quoted commas except in reason labels.
  const text = readFileSync(join(dir, file), "utf8").replace(/^﻿/, "");
  return text
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .slice(1)
    .map((l) => (l.match(/("([^"]|"")*"|[^,]*)(,|$)/g) ?? []).map((f) => f.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"')));
}

const num = (s: string | undefined) => (s && s.trim() ? Number(s.replace(/[\s ]/g, "")) : null);

function main() {
  const dir = process.argv[2];
  if (!dir || !existsSync(dir)) {
    console.error("usage : pnpm growth:coverage <dossier de l'export « Pages »>");
    process.exit(2);
  }
  const chart = rows(dir, /^(graphique|chart)\.csv$/i).map(([date, notIndexed, indexed, impressions]) => ({
    date,
    notIndexed: num(notIndexed),
    indexed: num(indexed),
    impressions: num(impressions) ?? 0,
  }));
  const issues = rows(dir, /^(probl[eè]mes critiques|critical issues)\.csv$/i);
  const declared = buildUrlRegistry().filter((e) => e.indexable).length;

  console.log("# Couverture Search Console\n");
  const last = [...chart].reverse().find((r) => r.indexed !== null);
  if (last) {
    const known = (last.indexed ?? 0) + (last.notIndexed ?? 0);
    console.log(`Au ${last.date} : ${last.indexed} indexées, ${last.notIndexed} non indexées (${known} connues de Google).`);
    console.log(`Registre : ${declared} URL indexables déclarées → ${declared - known} pas encore connues de Google.`);
    console.log(`Taux d'indexation des déclarées : ${(((last.indexed ?? 0) / declared) * 100).toFixed(0)} %.\n`);
  }

  if (issues.length) {
    console.log("## Raisons de non-indexation\n\n| Raison | Source | Validation | Pages |\n| --- | --- | --- | ---: |");
    for (const [reason, source, validation, pages] of issues) console.log(`| ${reason} | ${source} | ${validation} | ${pages} |`);
  }

  const days = chart.filter((r) => r.date);
  if (days.length >= 4) {
    const sum = (rs: typeof days) => rs.reduce((s, r) => s + r.impressions, 0);
    const half = Math.floor(days.length / 2);
    const first = days.slice(days.length - 2 * half, days.length - half);
    const second = days.slice(days.length - half);
    console.log("\n## Impressions (toutes pages, par jour)\n");
    const peak = days.reduce((m, r) => (r.impressions > m.impressions ? r : m));
    console.log(`Pic : ${peak.impressions} le ${peak.date}. Dernier jour : ${days.at(-1)!.impressions} le ${days.at(-1)!.date} (souvent incomplet).`);
    const a = sum(first);
    const b = sum(second);
    console.log(`Moitiés de ${half} jours : ${first[0].date}→${first.at(-1)!.date} = ${a} ; ${second[0].date}→${second.at(-1)!.date} = ${b} → ${MARK[countVerdict(a, b)]}`);
    if (days.length >= 14) {
      const w1 = days.slice(-14, -7);
      const w2 = days.slice(-7);
      console.log(`Deux dernières semaines : ${sum(w1)} → ${sum(w2)} → ${MARK[countVerdict(sum(w1), sum(w2))]}`);
    }
    console.log("\nAvant d'interpréter : annoter les mises à jour Google et les déploiements de la période (GROWTH_OS.md §5).");
  }
}

main();

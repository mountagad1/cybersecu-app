/**
 * Build output budget (docs/finops/vercel/STORAGE_REGRESSION_POLICY.md).
 *
 *   pnpm build && pnpm size:check
 *
 * Every retained Vercel deployment stores its static output and its function
 * bundles (Deployment Storage, Functions Storage). This measures the local
 * proxies of both and fails when one exceeds its budget, so an accidental
 * large asset or a heavy dependency traced into every page is caught in CI
 * before it is multiplied by the number of retained deployments.
 *
 * Local measurements only: Vercel's own accounting is read in the dashboard.
 * Exit 1 on a budget overrun, 2 when there is no build.
 */

import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const NEXT = join(process.cwd(), ".next");

/**
 * Baseline of 2026-10-30 (commit 719f9eb, PR #96) and the budget above it.
 * Raise a budget only with a written reason in the PR.
 */
const BUDGETS = {
  staticBytes: { baseline: 1_707_905, max: 2_200_000, label: "Assets statiques (.next/static)" },
  prerenderBytes: { baseline: 71_650_668, max: 90_000_000, label: "HTML, RSC et images prérendus" },
  traceUnionBytes: { baseline: 34_590_366, max: 45_000_000, label: "Fichiers tracés des fonctions (union)" },
  imageEngineTraces: { baseline: 5, max: 5, label: "Routes qui tracent sharp/libvips" },
} as const;

type Metric = keyof typeof BUDGETS;

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (path !== join(NEXT, "cache")) yield* walk(path);
    } else if (entry.isFile()) {
      yield path;
    }
  }
}

function measure(): Record<Metric, number> {
  let staticBytes = 0;
  let prerenderBytes = 0;
  const traced = new Map<string, number>();
  let imageEngineTraces = 0;

  for (const file of walk(NEXT)) {
    if (file.startsWith(join(NEXT, "static") + "/")) staticBytes += statSync(file).size;
    else if (/\.(html|rsc|body|meta)$/.test(file)) prerenderBytes += statSync(file).size;
    else if (file.endsWith(".nft.json") && file.includes("/server/app/")) {
      const { files } = JSON.parse(readFileSync(file, "utf8")) as { files: string[] };
      if (files.some((f) => f.includes("libvips-cpp"))) imageEngineTraces += 1;
      for (const f of files) {
        const path = resolve(dirname(file), f);
        if (!existsSync(path) || !statSync(path).isFile()) continue;
        traced.set(realpathSync(path), statSync(path).size);
      }
    }
  }

  const traceUnionBytes = [...traced.values()].reduce((a, b) => a + b, 0);
  return { staticBytes, prerenderBytes, traceUnionBytes, imageEngineTraces };
}

function main() {
  if (!existsSync(join(NEXT, "BUILD_ID"))) {
    console.error("Pas de build : lancez `pnpm build` avant `pnpm size:check`.");
    process.exit(2);
  }
  const measured = measure();
  let over = 0;
  for (const metric of Object.keys(BUDGETS) as Metric[]) {
    const { baseline, max, label } = BUDGETS[metric];
    const value = measured[metric];
    const change = baseline ? `${(((value - baseline) / baseline) * 100).toFixed(1)} %` : "—";
    const status = value > max ? "DÉPASSÉ" : "ok";
    if (value > max) over += 1;
    console.log(`${status.padEnd(8)} ${label} : ${value.toLocaleString("fr-FR")} (référence ${baseline.toLocaleString("fr-FR")}, écart ${change}, budget ${max.toLocaleString("fr-FR")})`);
  }
  if (over) {
    console.error(`\n${over} budget(s) dépassé(s). Voir docs/finops/vercel/STORAGE_REGRESSION_POLICY.md.`);
    process.exit(1);
  }
}

main();

/**
 * Image check over the HTML the build produced (docs/seo/IMAGE_SEO_STRATEGY.md §4).
 *
 *   pnpm build && pnpm seo:images
 *
 * For every registry page: the rules of `src/domain/seo/image-rules.ts`
 * (alt present, empty only on registered decorative sources, no file-name or
 * title alt, dimensions, at most one prioritised image, inline SVG hidden or
 * named), then every same-site image the page points to — `<img>`, share
 * images, icons, image preloads, and the web manifest's icons — must exist
 * in the build: a file in `public/`, a prerendered route body, a route
 * handler, or a static asset. Exit 1 on any finding.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildUrlRegistry } from "../src/domain/seo/indexability";
import { auditImages, findHeadImageUrls, findImages, sitePath } from "../src/domain/seo/image-rules";

const APP = join(process.cwd(), ".next/server/app");
const fileFor = (path: string) => join(APP, path === "/" ? "index.html" : `${path}.html`);

/** Does the build serve this path? */
function served(path: string): boolean {
  if (path.startsWith("/_next/static/")) return existsSync(join(process.cwd(), ".next/static", path.slice("/_next/static/".length)));
  return (
    existsSync(join(process.cwd(), "public", path)) ||
    existsSync(join(APP, `${path}.body`)) ||
    existsSync(join(APP, path, "route.js"))
  );
}

function main() {
  if (!existsSync(APP)) {
    console.error("Pas de build : lancez `pnpm build` avant `pnpm seo:images`.");
    process.exit(2);
  }
  const findings: string[] = [];
  const resources = new Map<string, string>(); // path → first page that uses it
  let pages = 0;
  let images = 0;

  for (const entry of buildUrlRegistry()) {
    const file = fileFor(entry.path);
    if (!existsSync(file)) {
      findings.push(`${entry.path} : absente de la sortie du build`);
      continue;
    }
    const html = readFileSync(file, "utf8");
    pages++;
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    for (const issue of auditImages(html, { pageTitle: title })) findings.push(`${entry.path} : ${issue.code} — ${issue.detail}`);
    const found = findImages(html);
    images += found.length;
    for (const url of [...found.map((i) => i.src), ...findHeadImageUrls(html)]) {
      const path = sitePath(url);
      if (path && !resources.has(path)) resources.set(path, entry.path);
    }
  }

  // The web manifest's icons are image resources too.
  const manifest = join(APP, "manifest.webmanifest.body");
  if (existsSync(manifest)) {
    for (const icon of JSON.parse(readFileSync(manifest, "utf8")).icons ?? []) {
      const path = sitePath(icon.src);
      if (path && !resources.has(path)) resources.set(path, "/manifest.webmanifest");
    }
  }
  for (const [path, page] of resources) if (!served(path)) findings.push(`${page} : ressource introuvable ${path}`);

  console.log(`# Contrôle des images — ${pages} pages, ${images} <img>, ${resources.size} ressources distinctes`);
  console.log(`\nAnomalies : ${findings.length}`);
  for (const f of findings) console.log(`  ✗ ${f}`);
  console.log(`\nRessources vérifiées : ${[...resources.keys()].sort().join(", ")}`);
  if (findings.length) process.exit(1);
}

main();

/**
 * Internal-linking metrics, measured on the rendered site
 * (docs/seo/INTERNAL_LINKING_IMPLEMENTATION.md §2).
 *
 * Run against a production build:
 *   pnpm build && pnpm start -p 3000
 *   pnpm seo:links                       # or BASE_URL=http://localhost:4000 pnpm seo:links
 *
 * Unlike `seo:audit`, this one crawls: crawl depth and the links a page
 * really carries can only be read from the HTML. It starts at `/`, follows
 * every internal link (navigation included, as a crawler would), and then
 * reports on the indexable pages of the URL registry.
 *
 * « Contextual » links are the ones inside `<main>`, minus the breadcrumb
 * trail: header, footer and breadcrumbs are on every page and say nothing
 * about how two pages relate.
 *
 * Writes the full result as JSON when `OUT` is set, so two runs (before /
 * after) can be compared.
 */

import { writeFileSync } from "node:fs";
import {
  buildUrlRegistry,
  indexableEntries,
} from "../src/domain/seo/indexability";

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
const IMPORTANT =
  /^\/(en\/)?(attaques|guides|outils|tools|exemples|examples|leviers|levers)(\/|$)/;

interface Link {
  to: string;
  anchor: string;
}

function decode(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;|&#xa0;/gi, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalize(href: string): string | null {
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  const path = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  if (/^\/(_next|api|og|icons?)\b|\.[a-z0-9]{2,4}$/i.test(path)) return null;
  return path;
}

function extractLinks(html: string): Link[] {
  const links: Link[] = [];
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const href = /\shref="([^"]*)"/.exec(m[1])?.[1];
    const to = href ? normalize(decode(href)) : null;
    if (!to) continue;
    const anchor = decode(m[2].replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    links.push({ to, anchor });
  }
  return links;
}

/** `<main>` without the breadcrumb `<nav>` (its aria-label varies by locale). */
function contextualPart(html: string): string {
  const main = /<main\b[\s\S]*?<\/main>/.exec(html)?.[0] ?? "";
  return main.replace(
    /<nav[^>]*aria-label="(Fil d'Ariane|Fil d&#x27;Ariane|Breadcrumb)"[\s\S]*?<\/nav>/g,
    "",
  );
}

async function main(): Promise<void> {
  const indexable = indexableEntries(buildUrlRegistry()).map((e) => e.path);
  const indexableSet = new Set(indexable);

  const depth = new Map<string, number>([["/", 0]]);
  const contextual = new Map<string, Link[]>();
  const queue = ["/"];
  while (queue.length > 0) {
    const batch = queue.splice(0, 8);
    await Promise.all(
      batch.map(async (path) => {
        const res = await fetch(BASE + path, { redirect: "manual" });
        if (res.status !== 200) return;
        const html = await res.text();
        contextual.set(
          path,
          extractLinks(contextualPart(html)).filter((l) => l.to !== path),
        );
        for (const link of extractLinks(html)) {
          if (depth.has(link.to)) continue;
          depth.set(link.to, depth.get(path)! + 1);
          queue.push(link.to);
        }
      }),
    );
  }

  // Inbound contextual links, by distinct source page.
  const inbound = new Map<string, Set<string>>(
    indexable.map((p) => [p, new Set()]),
  );
  const anchorsByTarget = new Map<string, string[]>();
  for (const [from, links] of contextual) {
    for (const link of links) {
      inbound.get(link.to)?.add(from);
      if (indexableSet.has(link.to)) {
        anchorsByTarget.set(link.to, [
          ...(anchorsByTarget.get(link.to) ?? []),
          link.anchor.toLowerCase(),
        ]);
      }
    }
  }

  const pages = indexable.filter((p) => contextual.has(p));
  const unreachable = indexable.filter((p) => !contextual.has(p));
  const orphans = indexable.filter((p) => (inbound.get(p)?.size ?? 0) === 0);
  const outbound = pages.map(
    (p) => new Set(contextual.get(p)!.map((l) => l.to)).size,
  );
  const inboundCounts = indexable.map((p) => inbound.get(p)?.size ?? 0);
  const depths = indexable
    .map((p) => depth.get(p))
    .filter((d): d is number => d !== undefined);
  const deep = indexable.filter(
    (p) => IMPORTANT.test(p) && (depth.get(p) ?? Infinity) > 3,
  );

  // Anchor diversity: for a page linked from several places, how many
  // different texts point at it (1 = the same words everywhere).
  const diversity = [...anchorsByTarget.values()]
    .filter((a) => a.length >= 2)
    .map((a) => new Set(a).size / a.length);
  const allAnchors = [...anchorsByTarget.values()].flat();
  const generic = allAnchors.filter((a) =>
    /^(cliquez ici|ici|en savoir plus|lire la suite|voir plus|click here|here|read more|learn more|lancer la simulation|start the simulation)$/.test(
      a,
    ),
  );

  const avg = (xs: number[]) =>
    xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;
  const hist = (xs: number[]) =>
    Object.fromEntries(
      [...new Set(xs)]
        .sort((a, b) => a - b)
        .map((d) => [d, xs.filter((x) => x === d).length]),
    );

  const result = {
    base: BASE,
    indexablePages: indexable.length,
    crawledPages: contextual.size,
    unreachable,
    orphans,
    averageInboundContextual: Number(avg(inboundCounts).toFixed(2)),
    minInboundContextual: Math.min(...inboundCounts),
    averageOutboundContextual: Number(avg(outbound).toFixed(2)),
    crawlDepth: {
      max: Math.max(...depths),
      average: Number(avg(depths).toFixed(2)),
      histogram: hist(depths),
    },
    importantPagesDeeperThan3: deep,
    anchors: {
      contextualLinksToIndexablePages: allAnchors.length,
      distinctAnchorTexts: new Set(allAnchors).size,
      averageDiversityPerTarget: Number(avg(diversity).toFixed(3)),
      genericAnchors: generic.length,
    },
  };

  console.log("cybersecu.app — maillage interne mesuré sur le site rendu");
  console.log(`  Base                                   : ${BASE}`);
  console.log(
    `  Pages indexables / explorées           : ${result.indexablePages} / ${result.crawledPages}`,
  );
  console.log(
    `  Inaccessibles depuis /                 : ${unreachable.length}`,
  );
  console.log(`  Pages orphelines (0 lien contextuel)   : ${orphans.length}`);
  console.log(
    `  Liens contextuels entrants (moyenne)   : ${result.averageInboundContextual} (min ${result.minInboundContextual})`,
  );
  console.log(
    `  Liens contextuels sortants (moyenne)   : ${result.averageOutboundContextual}`,
  );
  console.log(
    `  Profondeur de clic (max / moyenne)     : ${result.crawlDepth.max} / ${result.crawlDepth.average}`,
  );
  console.log(
    `  Répartition des profondeurs            : ${JSON.stringify(result.crawlDepth.histogram)}`,
  );
  console.log(`  Pages importantes à plus de 3 clics    : ${deep.length}`);
  console.log(
    `  Ancres : textes distincts / liens      : ${result.anchors.distinctAnchorTexts} / ${result.anchors.contextualLinksToIndexablePages}`,
  );
  console.log(
    `  Diversité moyenne des ancres par cible : ${result.anchors.averageDiversityPerTarget}`,
  );
  console.log(
    `  Ancres génériques                      : ${result.anchors.genericAnchors}`,
  );
  for (const p of [...orphans, ...deep, ...unreachable].slice(0, 20))
    console.log(`    · ${p}`);

  if (process.env.OUT)
    writeFileSync(process.env.OUT, JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

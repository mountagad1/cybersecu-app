/**
 * Metadata check over the HTML the build actually produced
 * (docs/seo/METADATA_IMPLEMENTATION_REPORT.md).
 *
 *   pnpm build && pnpm seo:metadata
 *
 * Reads `.next/server/app/<path>.html` for every registry path — what a
 * crawler receives, not what a component meant to emit — and checks the
 * rules below. Errors exit 1; warnings are printed and do not fail, because
 * they are judgement calls (a 70-character title can be the right one).
 *
 * Errors
 *   - page missing from the build output
 *   - title or description missing; title or description shared by two
 *     indexable pages; title or description inherited from the home page
 *   - indexable page: not exactly one canonical, or canonical not the page's
 *     own absolute URL; any `noindex`
 *   - non-indexable registry page without `noindex`
 *   - Open Graph: title, description, image or site name missing; `og:url`
 *     not the canonical; `og:locale` or `<html lang>` not the route's language
 *   - Twitter card missing, or its title not the Open Graph title
 *   - hreflang not exactly {self, counterpart, x-default → French} where a
 *     translation exists (`counterpartOf`), or present where none does
 * Warnings
 *   - title over 65 characters, description outside 70–160, or ending « … »
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildUrlRegistry } from "../src/domain/seo/indexability";
import { counterpartOf } from "../src/domain/seo/counterparts";
import { absoluteUrl } from "../src/lib/site";
import { TITLE_MAX } from "../src/lib/page-title";

const ROOT = join(process.cwd(), ".next/server/app");

interface Head {
  lang: string | null;
  title: string | null;
  meta: Map<string, string>;
  canonicals: string[];
  hreflang: Map<string, string>;
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#x27": "'", "#39": "'", nbsp: " " };
const decode = (s: string) => s.replace(/&(amp|lt|gt|quot|#x27|#39|nbsp);/g, (_, e: string) => ENTITIES[e]);

function attrs(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) out[m[1].toLowerCase()] = decode(m[2]);
  return out;
}

function parseHead(html: string): Head {
  const head = html.slice(0, html.indexOf("</head>") + 7);
  const meta = new Map<string, string>();
  for (const m of head.matchAll(/<meta\s[^>]*>/g)) {
    const a = attrs(m[0]);
    const key = a.name ?? a.property;
    if (key && a.content !== undefined && !meta.has(key)) meta.set(key, a.content);
  }
  const canonicals: string[] = [];
  const hreflang = new Map<string, string>();
  for (const m of head.matchAll(/<link\s[^>]*>/g)) {
    const a = attrs(m[0]);
    if (a.rel === "canonical") canonicals.push(a.href);
    if (a.rel === "alternate" && a.hreflang) hreflang.set(a.hreflang, a.href);
  }
  const title = head.match(/<title>([^<]*)<\/title>/)?.[1];
  return { lang: html.match(/<html[^>]*\slang="([^"]+)"/)?.[1] ?? null, title: title ? decode(title) : null, meta, canonicals, hreflang };
}

/** The origin with or without its trailing slash is one URL: Next.js writes it without. */
const url = (path: string) => absoluteUrl(path).replace(/^(https:\/\/[^/]+)\/$/, "$1");

const fileFor = (path: string) => join(ROOT, path === "/" ? "index.html" : `${path}.html`);
const localeOf = (path: string) => (path === "/en" || path.startsWith("/en/") ? "en" : "fr");

function main() {
  if (!existsSync(ROOT)) {
    console.error("Pas de build : lancez `pnpm build` avant `pnpm seo:metadata`.");
    process.exit(2);
  }
  const registry = buildUrlRegistry();
  const errors: string[] = [];
  const warnings: string[] = [];
  const heads = new Map<string, Head>();

  for (const entry of registry) {
    const file = fileFor(entry.path);
    if (!existsSync(file)) {
      errors.push(`${entry.path} : absente de la sortie du build`);
      continue;
    }
    heads.set(entry.path, parseHead(readFileSync(file, "utf8")));
  }

  const home = heads.get("/");
  const seenTitle = new Map<string, string>();
  const seenDescription = new Map<string, string>();

  for (const entry of registry) {
    const h = heads.get(entry.path);
    if (!h) continue;
    const p = entry.path;
    const err = (m: string) => errors.push(`${p} : ${m}`);
    const description = h.meta.get("description") ?? null;
    const robots = (h.meta.get("robots") ?? "").toLowerCase();
    const locale = localeOf(p);
    const own = url(p);

    if (!h.title) err("title manquant");
    if (!description) err("description manquante");
    if (p !== "/" && home) {
      if (h.title === home.title) err("title hérité de l'accueil");
      if (description && description === home.meta.get("description")) err("description héritée de l'accueil");
    }
    if (h.lang !== locale) err(`<html lang="${h.lang}"> pour une route ${locale}`);

    if (!entry.indexable) {
      if (!robots.includes("noindex")) err("page non indexable sans noindex");
      continue;
    }
    if (robots.includes("noindex")) err("page indexable marquée noindex");

    if (h.title) {
      const other = seenTitle.get(h.title);
      if (other) err(`title identique à ${other}`);
      else seenTitle.set(h.title, p);
      if (h.title.length > TITLE_MAX) warnings.push(`${p} : title de ${h.title.length} caractères`);
    }
    if (description) {
      const other = seenDescription.get(description);
      if (other) err(`description identique à ${other}`);
      else seenDescription.set(description, p);
      if (description.length > 160 || description.length < 70) warnings.push(`${p} : description de ${description.length} caractères`);
      if (description.trimEnd().endsWith("…")) warnings.push(`${p} : description coupée par « … »`);
    }

    if (h.canonicals.length !== 1) err(`${h.canonicals.length} canonical`);
    else if (h.canonicals[0] !== own) err(`canonical ${h.canonicals[0]} au lieu de ${own}`);

    const og = (k: string) => h.meta.get(k);
    for (const k of ["og:title", "og:description", "og:image", "og:site_name"]) if (!og(k)) err(`${k} manquant`);
    if (og("og:url") !== own) err(`og:url ${og("og:url")} au lieu de ${own}`);
    if (og("og:image") && !og("og:image")!.startsWith("https://")) err("og:image relative");
    if (og("og:locale") !== (locale === "en" ? "en_US" : "fr_FR")) err(`og:locale ${og("og:locale")}`);
    if (!og("twitter:card")) err("twitter:card manquant");
    if (og("twitter:title") !== og("og:title")) err("twitter:title différent de og:title");

    const counterpart = counterpartOf(p);
    if (counterpart) {
      const fr = locale === "fr" ? p : counterpart;
      const en = locale === "en" ? p : counterpart;
      const want = new Map([
        ["fr", url(fr)],
        ["en", url(en)],
        ["x-default", url(fr)],
      ]);
      const same = h.hreflang.size === want.size && [...want].every(([k, v]) => h.hreflang.get(k) === v);
      if (!same) err(`hreflang ${JSON.stringify(Object.fromEntries(h.hreflang))} au lieu de ${JSON.stringify(Object.fromEntries(want))}`);
    } else if (h.hreflang.size > 0) {
      err("hreflang sans traduction réelle");
    }
  }

  const indexable = registry.filter((e) => e.indexable).length;
  console.log(`# Contrôle des métadonnées — ${heads.size} pages lues (${indexable} indexables)`);
  console.log(`\nErreurs : ${errors.length}`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  console.log(`\nAvertissements : ${warnings.length}`);
  for (const w of warnings) console.log(`  · ${w}`);
  if (errors.length) process.exit(1);
}

main();

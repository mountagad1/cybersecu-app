import { describe, expect, it, vi } from "vitest";
import { SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * SEO regression tests (brief §49).
 *
 * These assert the *rules* that are cheap to break silently and expensive to
 * notice: a noindex URL leaking into the sitemap, robots.txt blocking a path
 * whose noindex then becomes unreachable, sitemap/canonical origin drift.
 *
 * They run without a database — and since the content moved into the
 * repository (docs/decisions/0007-content-in-repository.md) that is no
 * longer a stubbing trick: the sitemap has no data layer left to stub.
 */

vi.mock("server-only", () => ({}));

vi.mock("@/infra/attacks/repository", () => ({
  listPublishedAttacks: vi.fn(async () => [
    { code: "SMS-000001", slug: "smishing-faux-sms-bancaire", name: "Smishing", primaryVector: "sms", primaryDimension: "sms_scam_recognition", publishedAt: "2026-01-15T00:00:00.000Z" },
    { code: "IDN-000002", slug: "homoglyphes", name: "Homoglyphes", primaryVector: "web", primaryDimension: "url_verification", publishedAt: null },
  ]),
}));

vi.mock("@/infra/scenarios/repository", () => ({
  listPublishedScenarios: vi.fn(async () => [
    { slug: "sms-banque", impersonatedEntity: "Banque", channel: "sms", difficulty: "easy" },
  ]),
}));

const NOINDEX_ROUTES = ["/restaurer", "/simulations/merci"];

describe("robots.txt", () => {
  it("does not block a route that relies on a noindex directive", async () => {
    const robots = (await import("./robots")).default;
    const { disallow } = robots().rules as { disallow: string[] };

    // Blocking these in robots.txt would stop a crawler ever fetching the
    // page — and therefore ever seeing its noindex.
    for (const route of NOINDEX_ROUTES) {
      for (const rule of disallow) {
        expect(route.startsWith(rule)).toBe(false);
      }
    }
  });

  it("keeps crawlable every path the sitemap advertises", async () => {
    const robots = (await import("./robots")).default;
    const sitemapFn = (await import("./sitemap")).default;
    const { disallow } = robots().rules as { disallow: string[] };

    for (const entry of await sitemapFn()) {
      const path = new URL(entry.url).pathname;
      for (const rule of disallow) {
        expect(path.startsWith(rule)).toBe(false);
      }
    }
  });

  it("points at an absolute sitemap URL on the canonical origin", async () => {
    const robots = (await import("./robots")).default;
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});

describe("sitemap.xml", () => {
  it("excludes noindex routes", async () => {
    const sitemapFn = (await import("./sitemap")).default;
    const paths = (await sitemapFn()).map((e) => new URL(e.url).pathname);

    for (const route of NOINDEX_ROUTES) {
      expect(paths).not.toContain(route);
    }
  });

  it("emits absolute URLs on the canonical origin only", async () => {
    const sitemapFn = (await import("./sitemap")).default;
    for (const entry of await sitemapFn()) {
      expect(entry.url.startsWith(`${SITE_URL}/`)).toBe(true);
    }
  });

  it("contains no duplicate URLs", async () => {
    const sitemapFn = (await import("./sitemap")).default;
    const urls = (await sitemapFn()).map((e) => e.url);
    expect(urls.length).toBe(new Set(urls).size);
  });

  it("includes published content URLs", async () => {
    const sitemapFn = (await import("./sitemap")).default;
    const paths = (await sitemapFn()).map((e) => new URL(e.url).pathname);

    const { listAttacks } = await import("@/content/attacks");
    for (const attack of listAttacks()) expect(paths).toContain(`/attaques/${attack.slug}`);
    expect(paths).toContain("/simulations/sms-banque");
  });

  it("lists category hubs that have published attacks, and omits empty ones", async () => {
    const sitemapFn = (await import("./sitemap")).default;
    const paths = (await sitemapFn()).map((e) => new URL(e.url).pathname);

    const { ATTACK_CATEGORIES } = await import("@/domain/attack/categories");
    const { isCategoryPublishable } = await import("@/content/attacks");

    // Families are declared ahead of their content, so the sitemap must
    // carry exactly those that cleared the publication threshold — and no
    // hub that would render a list of one.
    for (const category of ATTACK_CATEGORIES) {
      if (isCategoryPublishable(category)) {
        expect(paths, category.slug).toContain(`/attaques/${category.slug}`);
      } else {
        expect(paths, category.slug).not.toContain(`/attaques/${category.slug}`);
      }
    }
  });

  it("derives lastModified from each entry's own review date, never from now()", async () => {
    const { listAttacks } = await import("@/content/attacks");
    const [first] = listAttacks();

    const sitemapFn = (await import("./sitemap")).default;
    const entry = (await sitemapFn()).find(
      (e) => new URL(e.url).pathname === `/attaques/${first.slug}`,
    );

    expect(entry?.lastModified).toBe(first.updatedAt);
  });

  it("never borrows another page's date for lastmod", async () => {
    // Simulations, tools and the homepage have no editorial date: they send
    // none. Indexes take the date of the catalogue they list.
    const sitemapFn = (await import("./sitemap")).default;
    const entries = await sitemapFn();
    const at = (path: string) => entries.find((e) => new URL(e.url).pathname === path);

    for (const e of entries) {
      const path = new URL(e.url).pathname;
      if (/^(\/en)?\/simulations(\/|$)|^\/outils|^\/$/.test(path)) {
        expect(e.lastModified, path).toBeUndefined();
      }
    }

    const { listGuides } = await import("@/content/guides");
    const newestGuide = listGuides().reduce((m, g) => (g.updatedAt > m ? g.updatedAt : m), "");
    expect(at("/guides")?.lastModified).toBe(newestGuide);
  });

  it("is complete even when the database layer is broken", async () => {
    // This is the regression test for the incident itself
    // (docs/BLANK_PAGES_ROOT_CAUSE.md): the sitemap used to be built from
    // database reads, so an unreachable Supabase silently produced a
    // sitemap containing only the static routes. It now has no data layer
    // at all — a repository that throws on every call changes nothing.
    const repo = await import("@/infra/attacks/repository");
    vi.mocked(repo.listPublishedAttacks).mockRejectedValue(new Error("supabase down"));

    const { listAttacks } = await import("@/content/attacks");
    const sitemapFn = (await import("./sitemap")).default;
    const paths = (await sitemapFn()).map((e) => new URL(e.url).pathname);

    for (const attack of listAttacks()) {
      expect(paths).toContain(`/attaques/${attack.slug}`);
    }
    vi.mocked(repo.listPublishedAttacks).mockReset();
  });
});

describe("orphan pages", () => {
  it("links every published category hub from the attack index", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const index = readFileSync(
      join(process.cwd(), "src/app/(marketing)/attaques/page.tsx"),
      "utf8",
    );

    const sitemapFn = (await import("./sitemap")).default;
    const hubs = (await sitemapFn())
      .map((e) => new URL(e.url).pathname)
      .filter((p) => p.startsWith("/attaques/") && p !== "/attaques");

    // The index builds hub hrefs from the taxonomy, so assert the mechanism
    // exists rather than each literal URL.
    if (hubs.length > 0) {
      expect(index).toContain("/attaques/${category.slug}");
    }
  });

  it("gives every static sitemap route an incoming internal link", async () => {
    // Brief §22 / ORPHAN_POLICY: an indexable URL must be reachable by
    // crawling real anchors, not only by reading the sitemap. Content routes
    // (/attaques/*, /simulations/*) are linked from their index pages; this
    // covers the standalone routes, which are the ones that actually get
    // forgotten when a page is added.
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");

    const layouts = [
      "src/app/(marketing)/layout.tsx",
      "src/app/(marketing)/page.tsx",
      "src/app/(marketing)/attaques/page.tsx",
    ]
      .map((f) => readFileSync(join(process.cwd(), f), "utf8"))
      .join("\n");

    const sitemapFn = (await import("./sitemap")).default;
    const staticPaths = (await sitemapFn())
      .map((e) => new URL(e.url).pathname)
      .filter((p) => p !== "/" && p.split("/").length === 2);

    const unlinked = staticPaths.filter((p) => !layouts.includes(`href="${p}"`));
    expect(unlinked).toEqual([]);
  });
});

describe("registry ↔ routes", () => {
  it("serves every dynamic URL the registry declares", async () => {
    // The sitemap, hreflang, breadcrumbs and links all read the registry;
    // the routes generate their own params. When the two disagreed, every
    // English hub was advertised under its English slug and served under its
    // French one — ten sitemap URLs returning 404. This compares the two
    // directly, for every dynamic route.
    const { buildUrlRegistry } = await import("@/domain/seo/indexability");

    const routes: { prefix: string; load: () => Promise<{ generateStaticParams: () => { slug: string }[] }> }[] = [
      { prefix: "/en/attaques/", load: () => import("./en/attaques/[slug]/page") },
      { prefix: "/en/simulations/", load: () => import("./en/simulations/[slug]/page") },
      { prefix: "/attaques/", load: () => import("./(marketing)/attaques/[slug]/page") },
      { prefix: "/simulations/voix/", load: () => import("./(marketing)/simulations/voix/[slug]/page") },
      { prefix: "/simulations/", load: () => import("./(marketing)/simulations/[slug]/page") },
      { prefix: "/guides/", load: () => import("./(marketing)/guides/[slug]/page") },
      { prefix: "/leviers/", load: () => import("./(marketing)/leviers/[slug]/page") },
    ];

    const served = new Set<string>();
    for (const route of routes) {
      const { generateStaticParams } = await route.load();
      for (const { slug } of generateStaticParams()) served.add(`${route.prefix}${slug}`);
    }

    const STATIC_PAGES = new Set(["/simulations/merci"]);
    const declared = buildUrlRegistry()
      .filter((e) => e.indexable)
      .map((e) => e.path)
      .filter((p) => !STATIC_PAGES.has(p) && routes.some((r) => p.startsWith(r.prefix)));

    expect(declared.length).toBeGreaterThan(0);
    expect(declared.filter((p) => !served.has(p))).toEqual([]);
  });

  it("registers every tool page, and only those", async () => {
    const { buildUrlRegistry } = await import("@/domain/seo/indexability");
    const { listTools } = await import("@/content/tools");
    const registered = buildUrlRegistry()
      .map((e) => e.path)
      .filter((p) => p.startsWith("/outils/"))
      .sort();
    expect(registered).toEqual(listTools().map((t) => `/outils/${t.slug}`).sort());
  });
});

describe("hreflang", () => {
  it("annotates both language versions identically, self-reference and x-default included", async () => {
    const fr = (await import("./(marketing)/attaques/[slug]/page")).generateMetadata;
    const en = (await import("./en/attaques/[slug]/page")).generateMetadata;
    const { listAttacks } = await import("@/content/attacks");
    const { ATTACK_CATEGORIES } = await import("@/domain/attack/categories");

    const pairs = [
      ...listAttacks().map((a) => [a.slug, a.translations?.en?.slug] as const),
      ...ATTACK_CATEGORIES.map((c) => [c.slug, c.translations?.en?.slug] as const),
    ].filter((p): p is readonly [string, string] => Boolean(p[1]));
    expect(pairs.length).toBeGreaterThan(0);

    for (const [frSlug, enSlug] of pairs) {
      const expected = {
        fr: `/attaques/${frSlug}`,
        en: `/en/attaques/${enSlug}`,
        "x-default": `/attaques/${frSlug}`,
      };
      const frMeta = await fr({ params: Promise.resolve({ slug: frSlug }) });
      const enMeta = await en({ params: Promise.resolve({ slug: enSlug }) });
      expect(frMeta.alternates?.languages, frSlug).toEqual(expected);
      expect(enMeta.alternates?.languages, enSlug).toEqual(expected);
    }
  });
});

describe("canonical coverage", () => {
  it("declares an explicit canonical on every indexable public route", async () => {
    // The root layout intentionally sets no canonical default: inheriting one
    // would make a route that forgets it declare itself a duplicate of the
    // homepage. That safety only holds if every indexable route sets its own,
    // which is what this asserts.
    const { readdirSync, readFileSync, statSync } = await import("node:fs");
    const { join } = await import("node:path");

    const NOINDEX = new Set(["restaurer", "merci"]);
    const root = join(process.cwd(), "src/app/(marketing)");
    const missing: string[] = [];

    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) {
          walk(full);
          continue;
        }
        if (name !== "page.tsx") continue;
        const segment = dir.split("/").pop() ?? "";
        if (NOINDEX.has(segment)) continue;

        const source = readFileSync(full, "utf8");
        if (!source.includes("canonical")) {
          missing.push(full.replace(process.cwd() + "/", ""));
        }
      }
    };
    walk(root);

    expect(missing).toEqual([]);
  });
});

describe("canonical URLs", () => {
  it("uses one origin across canonical, sitemap and robots", async () => {
    const robots = (await import("./robots")).default;
    const sitemapFn = (await import("./sitemap")).default;

    const origins = new Set<string>([
      new URL(absoluteUrl("/attaques")).origin,
      new URL(robots().sitemap as string).origin,
      ...(await sitemapFn()).map((e) => new URL(e.url).origin),
    ]);

    expect(origins.size).toBe(1);
  });
});

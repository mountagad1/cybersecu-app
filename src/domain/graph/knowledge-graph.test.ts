import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { attackEntityJsonLd, buildKnowledgeGraph, inboundEdges } = await import("./knowledge-graph");
const { buildUrlRegistry } = await import("@/domain/seo/indexability");

const graph = buildKnowledgeGraph();
const indexable = new Set(buildUrlRegistry().filter((e) => e.indexable).map((e) => e.path));

/**
 * Minimum contextual links each page type must receive (navigation chrome
 * excluded). Below these, a page depends on an index or the sitemap to be
 * found, which is what « orphan » means in practice.
 */
const MIN_INBOUND: Record<string, number> = {
  "attack:fr": 3,
  "attack:en": 2,
  "category:fr": 2,
  "category:en": 2,
  "simulation:fr": 2,
  "simulation:en": 2,
  "guide:fr": 2,
  "lever:fr": 2,
  "tool:fr": 2,
  "tool:en": 2,
  // Audience checklists: the fiches they cite, their simulations, the
  // guides and the homepage all point to them.
  "audience:fr": 5,
  "audience:en": 5,
};

const GENERIC_ANCHORS = /^(cliquez ici|ici|en savoir plus|lire la suite|voir plus|click here|here|read more|learn more)$/i;

describe("knowledge graph", () => {
  it("covers every indexable entity page, and only those", () => {
    const entityTypes = new Set(["attack", "category", "simulation", "lever", "guide"]);
    const expected = buildUrlRegistry()
      .filter((e) => e.indexable && entityTypes.has(e.type))
      .map((e) => e.path);
    const nodes = new Set(graph.nodes.map((n) => n.url));
    expect(expected.filter((p) => !nodes.has(p))).toEqual([]);
    for (const node of graph.nodes) expect(indexable.has(node.url), node.url).toBe(true);
  });

  it("only links between pages that exist", () => {
    const broken = graph.edges.filter((e) => !indexable.has(e.from) || !indexable.has(e.to));
    expect(broken.map((e) => `${e.from} → ${e.to}`)).toEqual([]);
  });

  it("never links a page to itself, and never twice for the same reason", () => {
    expect(graph.edges.filter((e) => e.from === e.to)).toEqual([]);
    const keys = graph.edges.map((e) => `${e.from}|${e.to}|${e.relation}`);
    expect(keys.length).toBe(new Set(keys).size);
  });

  it("gives every entity page several contextual inbound links", () => {
    const short = graph.nodes
      .map((n) => ({ n, count: new Set(inboundEdges(graph, n.url).map((e) => e.from)).size }))
      .filter(({ n, count }) => count < (MIN_INBOUND[`${n.type}:${n.locale}`] ?? 2))
      .map(({ n, count }) => `${n.url} (${count})`);
    expect(short).toEqual([]);
  });

  it("keeps declared relations reciprocal", () => {
    const has = (from: string, to: string, relation: string) =>
      graph.edges.some((e) => e.from === from && e.to === to && e.relation === relation);
    const pairs: [string, string][] = [
      ["attack→attack", "attack→attack"],
      ["category→attack", "attack→category"],
      ["attack→simulation", "simulation→attack"],
      ["attack→guide", "guide→attack"],
      ["attack→tool", "tool→attack"],
      ["attack→lever", "lever→attack"],
      ["attack→audience", "audience→attack"],
      ["audience→attack", "attack→audience"],
      ["simulation→audience", "audience→simulation"],
      ["audience→simulation", "simulation→audience"],
    ];
    const missing: string[] = [];
    for (const [forward, backward] of pairs) {
      for (const e of graph.edges.filter((x) => x.relation === forward)) {
        if (!has(e.to, e.from, backward)) missing.push(`${e.from} → ${e.to} sans ${backward}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("uses descriptive anchors, and one anchor text per target on a page", () => {
    const generic = graph.edges.filter((e) => !e.anchor.trim() || GENERIC_ANCHORS.test(e.anchor.trim()));
    expect(generic).toEqual([]);

    // The same visible text pointing at two different URLs on one page is
    // ambiguous for a reader and for a crawler alike.
    const ambiguous: string[] = [];
    const bySource = new Map<string, Map<string, Set<string>>>();
    for (const e of graph.edges) {
      const anchors = bySource.get(e.from) ?? new Map<string, Set<string>>();
      anchors.set(e.anchor, (anchors.get(e.anchor) ?? new Set()).add(e.to));
      bySource.set(e.from, anchors);
    }
    for (const [from, anchors] of bySource) {
      for (const [anchor, targets] of anchors) {
        if (targets.size > 1) ambiguous.push(`${from} : « ${anchor} » → ${[...targets].join(", ")}`);
      }
    }
    expect(ambiguous).toEqual([]);
  });

  it("does not link French pages to English ones or the reverse", () => {
    const isEn = (u: string) => u === "/en" || u.startsWith("/en/");
    expect(graph.edges.filter((e) => isEn(e.from) !== isEn(e.to))).toEqual([]);
  });
});

describe("attackEntityJsonLd", () => {
  it("describes the attack as a defined term and mentions only what is linked", () => {
    const ld = attackEntityJsonLd({
      name: "Smishing",
      aliases: ["faux SMS bancaire"],
      familyUrl: "https://www.cybersecu.app/attaques/ingenierie-sociale",
      related: [{ name: "Phishing", url: "https://www.cybersecu.app/attaques/phishing" }],
    });
    expect(ld.about).toEqual({
      "@type": "DefinedTerm",
      name: "Smishing",
      alternateName: ["faux SMS bancaire"],
      inDefinedTermSet: "https://www.cybersecu.app/attaques/ingenierie-sociale",
    });
    expect(ld.mentions).toEqual([
      { "@type": "DefinedTerm", name: "Phishing", url: "https://www.cybersecu.app/attaques/phishing" },
    ]);
  });

  it("omits mentions when nothing is linked", () => {
    expect("mentions" in attackEntityJsonLd({ name: "X", related: [] })).toBe(false);
  });
});

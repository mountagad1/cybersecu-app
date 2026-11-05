import { describe, expect, it } from "vitest";
import { clusterKey, clusterQueries, findOpportunities, score } from "./opportunities";

const row = (key: string, clicks: number, impressions: number, position: number) => ({ key, clicks, impressions, position });

describe("findOpportunities", () => {
  it("sorts pages into the position buckets, and ignores pages under 10 impressions", () => {
    const out = findOpportunities(
      [
        row("https://www.cybersecu.app/guides/verifier-un-lien-avant-de-cliquer", 1, 30, 6), // 4–10, CTR 3.3 %
        row("https://www.cybersecu.app/guides/mon-compte-a-ete-pirate", 0, 40, 15), // 11–20
        row("https://www.cybersecu.app/guides/comment-un-mot-de-passe-est-vole", 0, 25, 2), // 1st page, 0 clicks
        row("https://www.cybersecu.app/guides/activer-la-double-authentification", 0, 9, 5), // too few
        row("https://www.cybersecu.app/a-propos", 0, 50, 35), // beyond page 2
      ],
      "2026-12-01",
    );
    expect(out.map((o) => [o.page.path, o.type])).toEqual(
      expect.arrayContaining([
        ["/guides/verifier-un-lien-avant-de-cliquer", "positions_4_to_10"],
        ["/guides/mon-compte-a-ete-pirate", "positions_11_to_20"],
        ["/guides/comment-un-mot-de-passe-est-vole", "high_impressions_low_ctr"],
      ]),
    );
    expect(out).toHaveLength(3);
  });

  it("defers fiches, simulations and /simulations until the EXP-020 freeze ends, and only those", () => {
    const rows = [
      row("https://www.cybersecu.app/en/attaques/computer-worm", 0, 177, 15),
      row("https://www.cybersecu.app/simulations/email-banque", 0, 77, 20),
      row("https://www.cybersecu.app/simulations", 0, 40, 12),
      row("https://www.cybersecu.app/guides/j-ai-donne-mes-coordonnees-bancaires-ou-un-code", 0, 19, 19.8),
    ];
    const during = findOpportunities(rows, "2026-10-26");
    expect(during.filter((o) => o.status === "deferred").map((o) => o.page.path).sort()).toEqual([
      "/en/attaques/computer-worm",
      "/simulations",
      "/simulations/email-banque",
    ]);
    expect(during.find((o) => o.page.pageType === "guide")?.status).toBe("actionable");
    const worm = during.find((o) => o.page.path === "/en/attaques/computer-worm")!;
    expect(worm.deferredBy).toEqual({ id: "EXP-020", until: "2026-11-24", priorityAfter: 0.5 });
    expect(worm.scores.blocked).toBe(true);
    // Actionable first, then the post-freeze backlog.
    expect(during[0].status).toBe("actionable");
    // The freeze end date is exclusive: actionable from 2026-11-24 on.
    expect(findOpportunities(rows, "2026-11-24").every((o) => o.status === "actionable")).toBe(true);
  });

  it("reports a decline only when the noise rules call it one", () => {
    const page = "https://www.cybersecu.app/guides/mon-compte-a-ete-pirate";
    const big = findOpportunities([row(page, 2, 300, 9)], "2026-12-01", [row(page, 40, 900, 8)]);
    expect(big.some((o) => o.type === "declining_page")).toBe(true);
    const small = findOpportunities([row(page, 1, 30, 9)], "2026-12-01", [row(page, 4, 60, 8)]);
    expect(small.some((o) => o.type === "declining_page")).toBe(false);
  });

  it("merges rows of one page reported with and without a trailing slash, re-weighting the position", () => {
    const out = findOpportunities(
      [row("https://www.cybersecu.app/guides/mon-compte-a-ete-pirate", 0, 10, 10), row("https://www.cybersecu.app/guides/mon-compte-a-ete-pirate/", 0, 30, 20)],
      "2026-12-01",
    );
    expect(out).toHaveLength(1);
    expect(out[0].observed.impressions).toBe(40);
    expect(out[0].observed.position).toBeCloseTo(17.5, 9);
  });
});

describe("score", () => {
  it("follows GROWTH_OS §4: (I × C × L) / (E × R) on 1–5 anchors", () => {
    // Own data past 200 impressions: C 4. Title and snippet: L 2, E 1. Reversible, visible: R 2.
    const s = score("high_impressions_low_ctr", { clicks: 0, impressions: 250, position: 6 }, false);
    expect([s.impact, s.confidence, s.leverage, s.effort, s.risk]).toEqual([1, 4, 2, 1, 2]);
    expect(s.priority).toBe(4);
    expect(score("positions_11_to_20", { clicks: 0, impressions: 50, position: 15 }, false).confidence).toBe(3);
  });

  it("blocks a frozen page with Risk 5, whatever the score", () => {
    const s = score("high_impressions_low_ctr", { clicks: 0, impressions: 900, position: 4 }, true);
    expect(s.risk).toBe(5);
    expect(s.blocked).toBe(true);
  });
});

describe("query clusters", () => {
  it("treats word order, quotes, stop words and plurals as one search", () => {
    const key = clusterKey("computer worm definition");
    for (const q of ["worm definition in computer", '"worm definition in computer', "definition of computer worm", "worm definition computer"]) {
      expect(clusterKey(q), q).toBe(key);
    }
    expect(clusterKey("scarewares")).toBe(clusterKey("scareware"));
  });

  it("does not read « j'ai » as « AI », and drops French elisions", () => {
    expect(clusterKey("j'ai donné mes coordonnées bancaires que faire")).not.toMatch(/\bai\b/);
    expect(clusterKey("l'attaque par baiting")).toBe(clusterKey("attaque baiting"));
    expect(clusterKey("fake ai app")).toMatch(/\bai\b/);
  });

  it("sums a cluster and points to the fiche whose name carries its subject", () => {
    const [worm] = clusterQueries([row("computer worm definition", 0, 40, 20), row("worm definition in computer", 0, 60, 10)]);
    expect(worm.metrics.impressions).toBe(100);
    expect(worm.metrics.position).toBeCloseTo(14, 9);
    expect(worm.candidateAttacks).toContain("MAL-000006");
  });
});

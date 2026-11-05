import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { classifyPage, classifyQuery, normalizePath } = await import("./segment");
const { aggregate, compareWindows, countVerdict } = await import("./noise");
const { buildUrlRegistry } = await import("@/domain/seo/indexability");

describe("classifyPage", () => {
  it("classifies every indexable URL of the registry, and knows it", () => {
    for (const entry of buildUrlRegistry().filter((e) => e.indexable)) {
      const page = classifyPage(`https://www.cybersecu.app${entry.path}`);
      expect(page.inRegistry, entry.path).toBe(true);
      // Registry types that are entities must be read back as the same type.
      if (entry.type !== "static") expect(page.pageType, entry.path).toBe(entry.type);
      if (page.pageType === "attack" || page.pageType === "simulation") {
        expect(page.entity, entry.path).toMatch(/^[A-Z]+-\d{6}$/);
        expect(page.category, entry.path).toBeTruthy();
      }
    }
  });

  it("gives the French and English page of one fiche the same entity and family", () => {
    const fr = classifyPage("https://www.cybersecu.app/attaques/smishing");
    const en = classifyPage("https://www.cybersecu.app/en/attaques/smishing");
    expect(fr).toMatchObject({ pageType: "attack", locale: "fr" });
    expect(en.locale).toBe("en");
    expect(en.entity).toBe(fr.entity);
    expect(en.category).toBe(fr.category);
  });

  it("tells hubs, tools, checklists and the comparator apart", () => {
    expect(classifyPage("/attaques/fraudes-financieres").pageType).toBe("category");
    expect(classifyPage("/outils/checklist-seniors").pageType).toBe("audience");
    expect(classifyPage("/en/tools/family-checklist").pageType).toBe("audience");
    expect(classifyPage("/outils/analyseur-de-message").pageType).toBe("tool");
    expect(classifyPage("/en/tools/x-or-y").pageType).toBe("comparator");
    expect(classifyPage("/exemples").pageType).toBe("gallery");
    expect(classifyPage("/en").pageType).toBe("home");
  });

  it("flags a URL Google reports but the registry does not list", () => {
    expect(classifyPage("https://www.cybersecu.app/attaques/ancien-slug")).toMatchObject({ inRegistry: false, pageType: "other" });
    expect(classifyPage("https://www.cybersecu.app/simulations/merci").inRegistry).toBe(false);
  });

  it("normalizes what Search Console reports", () => {
    expect(normalizePath("https://www.cybersecu.app/attaques/smishing/?utm=x#warning-signs")).toBe("/attaques/smishing");
    expect(normalizePath("https://www.cybersecu.app/")).toBe("/");
  });
});

describe("classifyQuery", () => {
  it.each([
    ["j'ai cliqué sur un lien dans un sms que faire", "incident-response", "fr"],
    ["signaler un sms frauduleux", "report", "fr"],
    ["différence phishing smishing", "comparison", "fr"],
    ["test phishing en ligne", "simulation", "unknown"],
    ["how to recognize a scam text", "detection", "en"],
    ["c'est quoi le quishing", "informational", "fr"],
    ["what is smishing", "informational", "en"],
    ["cybersecu", "navigational", "unknown"],
    ["quishing", "unclassified", "unknown"],
    // From the Search Console export of 2026-10-12.
    ["scareware definition", "informational", "en"],
    ["tests de smishing", "simulation", "fr"],
    ["simulateur de phishing", "simulation", "fr"],
    ["what is the purpose of a rootkit?", "informational", "en"],
  ] as const)("%s → %s", (query, intent, language) => {
    expect(classifyQuery(query)).toEqual({ intent, language });
  });
});

describe("countVerdict", () => {
  it("reads the coverage export of 2026-10-12: impressions fell between the two halves", () => {
    // Graphique.csv, 2026-09-16..27 vs 2026-09-28..10-09 (12 days each).
    expect(countVerdict(786, 606)).toBe("down");
  });

  it("calls a small wobble noise, and a tiny total insufficient", () => {
    expect(countVerdict(100, 110)).toBe("noise");
    expect(countVerdict(10, 5)).toBe("insufficient");
  });
});

describe("compareWindows", () => {
  it("calls a ranking move from 12 to 14 noise", () => {
    const v = compareWindows({ clicks: 40, impressions: 2000, position: 12 }, { clicks: 38, impressions: 1900, position: 14 });
    expect(v).toEqual({ clicks: "noise", ctr: "noise", position: "noise" });
  });

  it("says nothing on too little data", () => {
    const v = compareWindows({ clicks: 3, impressions: 90, position: 8 }, { clicks: 9, impressions: 120, position: 4 });
    expect(v).toEqual({ clicks: "insufficient", ctr: "insufficient", position: "insufficient" });
  });

  it("detects a real CTR gain at constant impressions", () => {
    const v = compareWindows({ clicks: 60, impressions: 3000, position: 6 }, { clicks: 120, impressions: 3000, position: 6.2 });
    expect(v).toEqual({ clicks: "up", ctr: "up", position: "noise" });
  });

  it("reads a lower position as an improvement", () => {
    expect(compareWindows({ clicks: 50, impressions: 1000, position: 15 }, { clicks: 50, impressions: 1000, position: 9 }).position).toBe("up");
  });

  it("re-weights position by impressions when aggregating", () => {
    expect(aggregate([
      { clicks: 10, impressions: 900, position: 2 },
      { clicks: 0, impressions: 100, position: 50 },
    ])).toEqual({ clicks: 10, impressions: 1000, position: 6.8 });
  });
});

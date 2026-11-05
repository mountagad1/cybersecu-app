import { describe, expect, it } from "vitest";
import {
  auditContentGraph,
  auditRegistry,
  buildUrlRegistry,
  findDuplicatePaths,
  indexableEntries,
} from "./indexability";
import { ATTACK_CATEGORIES, CATEGORY_PUBLICATION_THRESHOLD } from "@/domain/attack/categories";
import {
  auditCategoryCoverage,
  getCategoryForAttackCode,
  isCategoryPublishable,
  listAttacks,
  listAttacksInCategory,
  pendingCategories,
} from "@/content/attacks";

describe("URL registry", () => {
  it("is internally coherent: no duplicates, no noindex-in-sitemap, no indexable-missing", () => {
    expect(auditRegistry(buildUrlRegistry())).toEqual([]);
  });

  it("has no cross-catalogue faults (broken 'Testez-vous' links, orphan simulations)", () => {
    expect(auditContentGraph()).toEqual([]);
  });

  it("keeps noindex routes out of the sitemap while still inventorying them", () => {
    const restaurer = buildUrlRegistry().find((e) => e.path === "/restaurer");

    expect(restaurer).toBeDefined();
    expect(restaurer?.indexable).toBe(false);
    expect(restaurer?.inSitemap).toBe(false);
    expect(restaurer?.excludedReason).toBeTruthy();
  });

  it("detects a collision between a category hub and an attack sharing /attaques/[slug]", () => {
    // Both entity types live in one namespace by design (brief §5 and §23).
    // A colliding slug would make one of them permanently unreachable, so
    // the registry has to surface it rather than let routing pick a winner.
    // The catalogue audit blocks this at build time; this asserts the
    // registry would still catch it if that gate were ever removed.
    const colliding = [
      ...buildUrlRegistry(),
      { path: "/attaques/ingenierie-sociale", type: "attack" as const, indexable: true, inSitemap: true },
    ];

    expect(findDuplicatePaths(colliding)).toContain("/attaques/ingenierie-sociale");
    expect(auditRegistry(colliding)).not.toEqual([]);
  });

  it("carries lastModified from each entry's own review date", () => {
    const [first] = listAttacks();
    const entry = buildUrlRegistry().find((e) => e.path === `/attaques/${first.slug}`);
    expect(entry?.lastModified).toBe(first.updatedAt);
  });

  it("rejects a non-canonical path shape", () => {
    const violations = auditRegistry([
      { path: "/Attaques/Phishing", type: "attack", indexable: true, inSitemap: true },
      { path: "/attaques/phishing/", type: "attack", indexable: true, inSitemap: true },
    ]);
    expect(violations.some((v) => v.includes("minuscule"))).toBe(true);
    expect(violations.some((v) => v.includes("Slash final"))).toBe(true);
  });
});

describe("category hub gate", () => {
  it("publishes a hub only once it has enough fiches to be worth a page", () => {
    for (const category of ATTACK_CATEGORIES) {
      const count = listAttacksInCategory(category.slug).length;
      expect(isCategoryPublishable(category), `${category.slug} (${count})`).toBe(
        count >= CATEGORY_PUBLICATION_THRESHOLD,
      );
    }
  });

  it("lists the published hubs in the sitemap, and only those", () => {
    const paths = indexableEntries(buildUrlRegistry()).map((e) => e.path);
    for (const category of ATTACK_CATEGORIES) {
      const expected = isCategoryPublishable(category);
      expect(paths.includes(`/attaques/${category.slug}`), category.slug).toBe(expected);
    }
  });

  it("gives a reason for every hub it withholds", () => {
    for (const entry of buildUrlRegistry().filter((e) => e.type === "category" && !e.indexable)) {
      expect(entry.excludedReason, entry.path).toBeTruthy();
      expect(entry.inSitemap, entry.path).toBe(false);
    }
  });

  it("assigns every category slug uniquely", () => {
    const slugs = ATTACK_CATEGORIES.map((c) => c.slug);
    expect(slugs.length).toBe(new Set(slugs).size);
  });

  it("leaves no attack uncategorised", () => {
    expect(auditCategoryCoverage().uncategorised).toEqual([]);
  });

  it("reports the families still waiting for content, without failing on them", () => {
    const pending = pendingCategories();
    for (const p of pending) {
      expect(p.published).toBeLessThan(CATEGORY_PUBLICATION_THRESHOLD);
      expect(p.needed).toBeGreaterThan(0);
    }
    // Regression guard: the four families that are populated must never
    // slip back into this list.
    const slugs = pending.map((p) => p.slug);
    for (const live of [
      "ingenierie-sociale",
      "sites-et-navigateurs",
      "fraudes-financieres",
      "identifiants-et-comptes",
    ]) {
      expect(slugs).not.toContain(live);
    }
  });

  it("resolves an attack to exactly one category", () => {
    expect(getCategoryForAttackCode("IDN-000002")?.slug).toBe("sites-et-navigateurs");
    expect(getCategoryForAttackCode("SMS-000001")?.slug).toBe("ingenierie-sociale");
    expect(getCategoryForAttackCode("ACCT-000001")?.slug).toBe("identifiants-et-comptes");
    expect(getCategoryForAttackCode("NOPE")).toBeUndefined();
  });

  it("gives every category a definition that stands on its own", () => {
    for (const category of ATTACK_CATEGORIES) {
      expect(category.definition.length).toBeGreaterThan(80);
      expect(category.whatUnitesThem.length).toBeGreaterThan(80);
    }
  });
});

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const {
  listComparisons,
  comparatorHrefFor,
  comparedAttackCodes,
  COMPARATOR_PATH,
} = await import("./comparisons");
const { BOUNDARIES } = await import("@/content/attacks/boundaries");
const { linksForAttack } = await import("@/domain/linking/engine");
const { findAttackByCode } = await import("@/content/attacks");
const { buildUrlRegistry } = await import("@/domain/seo/indexability");

const indexable = new Set(
  buildUrlRegistry()
    .filter((e) => e.indexable)
    .map((e) => e.path),
);

describe.each(["fr", "en"] as const)(
  "« X ou Y ? » comparator (%s)",
  (locale) => {
    const comparisons = listComparisons(locale);

    it("shows every documented pair once, on a registered page", () => {
      expect(comparisons).toHaveLength(BOUNDARIES.length);
      const ids = comparisons.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(indexable.has(COMPARATOR_PATH[locale])).toBe(true);
    });

    it("reuses the boundary's own text, in the page's language", () => {
      for (const [i, c] of comparisons.entries()) {
        const b = BOUNDARIES[i];
        expect([c.a.code, c.b.code]).toEqual([...b.pair]);
        expect(c.a.side).toBe(b.sides[c.a.code][locale]);
        expect(c.b.side).toBe(b.sides[c.b.code][locale]);
        expect(c.difference).toBe(b.difference[locale]);
        for (const side of [c.a, c.b]) {
          expect(indexable.has(side.href), side.href).toBe(true);
          if (side.simulationHref)
            expect(
              indexable.has(side.simulationHref),
              side.simulationHref,
            ).toBe(true);
          expect(side.href.startsWith("/en/")).toBe(locale === "en");
        }
      }
    });

    it("is reached from each paired fiche, on that fiche's pair", () => {
      for (const code of comparedAttackCodes()) {
        const attack = findAttackByCode(code)!;
        const [link] = linksForAttack(attack, locale).comparison;
        expect(link?.href, code).toBe(comparatorHrefFor(code, locale));
        const id = link!.href.split("#")[1];
        const pair = comparisons.find((c) => c.id === id)!;
        expect([pair.a.code, pair.b.code]).toContain(code);
        // Offered under « À ne pas confondre », never again among the tools.
        expect(
          linksForAttack(attack, locale).tools.map((t) => t.href.split("#")[0]),
        ).not.toContain(COMPARATOR_PATH[locale]);
      }
    });

    it("is not offered to a fiche without a pair", () => {
      const paired = new Set(comparedAttackCodes());
      const unpaired = ["SOCIAL-000002", "PAYMENT-000001"].filter(
        (c) => !paired.has(c),
      );
      for (const code of unpaired) {
        expect(
          linksForAttack(findAttackByCode(code)!, locale).comparison,
        ).toEqual([]);
      }
    });
  },
);

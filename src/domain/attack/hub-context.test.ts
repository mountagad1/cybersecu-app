import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { buildHubContext } = await import("./hub-context");
const { ATTACK_CATEGORIES } = await import("./categories");
const { listAttacksInCategory } = await import("@/content/attacks");

describe.each(["fr", "en"] as const)("family hub context (%s)", (locale) => {
  it.each(ATTACK_CATEGORIES.map((c) => [c.slug] as const))("%s", (slug) => {
    const context = buildHubContext(slug, locale);
    const family = listAttacksInCategory(slug);

    // One card per fiche of the family, each with its own « in plain terms ».
    expect(context.cards.map((c) => c.code)).toEqual(family.map((a) => a.code));
    for (const card of context.cards)
      expect(card.plainLanguageDefinition.length, card.slug).toBeGreaterThan(
        40,
      );

    // Counts are counts of this family's fiches, nothing else.
    expect(context.total).toBe(family.length);
    expect(context.objectives.reduce((sum, o) => sum + o.count, 0)).toBe(
      family.length,
    );
    for (const lever of context.levers) {
      expect(lever.count).toBeGreaterThan(0);
      expect(lever.count).toBeLessThanOrEqual(family.length);
      expect(lever.href, lever.label).toMatch(
        locale === "en" ? /^\/en\/levers\// : /^\/leviers\//,
      );
    }

    // Comparisons only between two members of the family, links in the page's language.
    const slugs = new Set(context.cards.map((c) => c.slug));
    for (const b of context.boundaries) {
      expect(slugs.has(b.a.slug) && slugs.has(b.b.slug)).toBe(true);
      expect(b.difference.length).toBeGreaterThan(10);
    }
    for (const guide of context.guides)
      expect(guide.href).toMatch(
        locale === "en" ? /^\/en\/guides\// : /^\/guides\//,
      );
  });
});

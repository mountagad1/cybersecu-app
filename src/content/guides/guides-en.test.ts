import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { auditGuideTranslations, listGuides, listGuidesEn } =
  await import("@/content/guides");
const { GUIDES_EN } = await import("./en");

describe("English guides", () => {
  it("translates every published guide", () => {
    expect(listGuidesEn().map((g) => g.frSlug)).toEqual(
      listGuides().map((g) => g.slug),
    );
  });

  it("follows the French guide item for item", () => {
    expect(auditGuideTranslations(listGuides(), GUIDES_EN)).toEqual([]);
  });

  it("rejects a translation that drops a step or turns the question into a statement", () => {
    const [guide] = listGuides();
    const en = GUIDES_EN[guide.slug];
    const broken = {
      [guide.slug]: {
        ...en,
        steps: en.steps.slice(1),
        question: "How to check a link.",
      },
    };
    const problems = auditGuideTranslations(listGuides(), broken);
    expect(problems.some((p) => p.includes("étapes"))).toBe(true);
    expect(problems.some((p) => p.includes("question"))).toBe(true);
  });

  it.each(listGuidesEn().map((g) => [g.slug, g] as const))(
    "%s answers its own question",
    (_, guide) => {
      expect(guide.question.trim().endsWith("?")).toBe(true);
      expect(guide.shortAnswer.length).toBeGreaterThanOrEqual(120);
      expect(guide.steps.length).toBeGreaterThanOrEqual(3);
    },
  );
});

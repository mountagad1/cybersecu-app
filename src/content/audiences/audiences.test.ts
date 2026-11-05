import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { auditAudiences, audienceItemText, listAudiences } = await import(".");
const { findAttackByCode } = await import("@/content/attacks");

describe("audience checklists", () => {
  it("pass their own audit: every item resolves, no item on two checklists", () => {
    expect(auditAudiences(listAudiences())).toEqual([]);
  });

  it("detects an item shared between two checklists", () => {
    const [a, b] = listAudiences();
    const shared = {
      ...b,
      sections: [{ ...b.sections[0], items: [a.sections[0].items[0]] }],
    };
    expect(auditAudiences([a, shared]).join()).toMatch(
      /figure sur deux checklists/,
    );
  });

  it("reuse the fiche's own prevention sentence, in both languages", () => {
    for (const audience of listAudiences()) {
      for (const item of audience.sections.flatMap((s) => s.items)) {
        const attack = findAttackByCode(item.attackCode)!;
        expect(audienceItemText(item, "fr")).toBe(
          attack.prevention![item.prevention],
        );
        expect(audienceItemText(item, "en")).toBe(
          attack.translations!.en!.prevention![item.prevention],
        );
      }
    }
  });

  it("have content of their own: at least ten items each, and distinct titles", () => {
    for (const audience of listAudiences()) {
      expect(
        audience.sections.flatMap((s) => s.items).length,
        audience.code,
      ).toBeGreaterThanOrEqual(10);
    }
    for (const locale of ["fr", "en"] as const) {
      const titles = listAudiences().map((a) => a.title[locale]);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });
});

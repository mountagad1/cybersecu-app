import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { listSimulations } = await import("@/content/simulations");
const { listSimulationsEn } = await import("@/content/simulations-en");
const { findAttackByCode } = await import("@/content/attacks");
const { getLocalizedAttack } = await import("@/content/attacks/localize");

const byAttack = <T extends { attackCode: string }>(list: T[]) =>
  new Map(list.map((s) => [s.attackCode, s]));

describe("English simulations", () => {
  it("covers every attack that has a French simulation, one for one", () => {
    const fr = listSimulations()
      .map((s) => s.attackCode)
      .sort();
    const en = listSimulationsEn()
      .map((s) => s.attackCode)
      .sort();
    expect(en).toEqual(fr);
  });

  it("keeps the French exercise: same choices, same answer, same mistake patterns", () => {
    const en = byAttack(listSimulationsEn());
    for (const fr of listSimulations()) {
      const sim = en.get(fr.attackCode)!;
      // Compared position by position rather than by id: a choice id is
      // an internal key, and one pilot scenario names its right answer
      // "bookmark" where the French one says "favorite".
      const shape = (s: typeof fr) => ({
        channel: s.channel,
        difficulty: s.difficulty,
        ui: s.content.ui,
        choices: s.choices.map((c) => ({
          isUnsure: c.isUnsure,
          isRecommended: c.isRecommended,
          correct: s.correctChoiceIds.includes(c.id),
          explained: Boolean(s.explanations[c.id]),
          mistakePatternCodes: c.mistakePatternCodes,
        })),
      });
      expect(shape(sim), fr.slug).toEqual(shape(fr));
    }
  });

  it("is the simulation each English attack page links to", () => {
    for (const sim of listSimulationsEn()) {
      const attack = findAttackByCode(sim.attackCode)!;
      expect(getLocalizedAttack(attack, "en")?.simulationSlug, sim.slug).toBe(
        sim.slug,
      );
    }
  });

  it("uses slugs and version ids disjoint from the French catalogue", () => {
    const fr = listSimulations();
    const frSlugs = new Set(fr.map((s) => s.slug));
    const frIds = new Set(fr.map((s) => s.versionId));
    for (const sim of listSimulationsEn()) {
      expect(frSlugs.has(sim.slug), sim.slug).toBe(false);
      expect(frIds.has(sim.versionId), sim.versionId).toBe(false);
      expect(sim.versionId.startsWith("10000000-"), sim.versionId).toBe(true);
    }
  });
});

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { CHANNEL_FICHES, channelOf, channelScenarios } =
  await import("./channel-scenarios");
const { findAttackByCode, listAttacks } = await import("@/content/attacks");
const { findSimulationBySlug } = await import("@/content/simulations");
const { findSimulationEnBySlug } = await import("@/content/simulations-en");

describe.each(["fr", "en"] as const)("channel scenarios (%s)", (locale) => {
  it.each(Object.entries(CHANNEL_FICHES))("%s → %s", (code, channel) => {
    const fiche = findAttackByCode(code);
    expect(fiche?.primaryVector).toBe(channel);

    const scenarios = channelScenarios(code, locale);
    expect(scenarios.map((s) => s.code)).not.toContain(code);
    expect(new Set(scenarios.map((s) => s.code)).size).toBe(scenarios.length);

    for (const s of scenarios) {
      const attack = findAttackByCode(s.code)!;
      if (s.simulation) {
        // The text is the simulation's own teaser, and it is played here.
        const sim =
          locale === "fr"
            ? findSimulationBySlug(s.simulation.slug)
            : findSimulationEnBySlug(s.simulation.slug);
        expect(sim?.channel).toBe(channel);
        expect(sim?.attackCode).toBe(s.code);
        expect(s.text).toBe(sim?.teaser);
      } else {
        expect(attack.primaryVector).toBe(channel);
      }
    }
  });

  it("lists every fiche whose primary vector is the channel", () => {
    for (const [code, channel] of Object.entries(CHANNEL_FICHES)) {
      const listed = new Set(channelScenarios(code, locale).map((s) => s.code));
      const expected = listAttacks()
        .filter((a) => a.primaryVector === channel && a.code !== code)
        .map((a) => a.code);
      expect(
        expected.filter((c) => !listed.has(c)),
        code,
      ).toEqual([]);
    }
  });

  it("lists the same fiches in both languages", () => {
    for (const code of Object.keys(CHANNEL_FICHES))
      expect(channelScenarios(code, locale).map((s) => s.code)).toEqual(
        channelScenarios(code, "fr").map((s) => s.code),
      );
  });
});

describe("channel fiches", () => {
  it("covers SMS, email and phone with real lists", () => {
    expect(channelScenarios("SMS-000001", "fr").length).toBeGreaterThan(2);
    expect(channelScenarios("PHISH-000001", "fr").length).toBeGreaterThan(2);
    expect(channelScenarios("SOCIAL-000006", "fr").length).toBeGreaterThan(2);
  });

  it("is empty for a fiche that is not a channel fiche", () => {
    expect(channelOf("SOCIAL-000002")).toBeUndefined();
    expect(channelScenarios("SOCIAL-000002", "fr")).toEqual([]);
  });
});

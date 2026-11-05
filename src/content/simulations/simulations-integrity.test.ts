import { describe, expect, it } from "vitest";
import { listSimulations } from "@/content/simulations";
import { listSimulationsEn } from "@/content/simulations-en";

/**
 * Every simulation, both languages, as a learner meets it
 * (docs/audit/SIMULATION_AUDIT.md): a real choice, a correct answer that is
 * one of the choices, an explanation for every choice — the feedback is the
 * lesson — and only fictional, non-resolvable domains (decision 0002).
 */

const ALL = [
  ...listSimulations().map((s) => ({ lang: "fr", s })),
  ...listSimulationsEn().map((s) => ({ lang: "en", s })),
];

/** Domain-like tokens in the scenario text that are not on a reserved test TLD. */
function realLookingDomains(content: unknown): string[] {
  const text = JSON.stringify(content);
  const out: string[] = [];
  for (const m of text.matchAll(/(?:https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,})(?![a-z0-9@-])/gi)) {
    const host = m[1].toLowerCase();
    // The local part of an address is not a domain: « ceo.office@x.test ».
    if (text[(m.index ?? 0) + m[0].length] === "@") continue;
    if (/\.(test|example|invalid|localhost)$/.test(host)) continue;
    // File names shown in a scenario (« mise-a-jour.exe ») are not domains.
    if (/\.(exe|zip|pdf|docx?|xlsx?|apk|scr|js|iso|msi|dmg)$/.test(host)) continue;
    out.push(host);
  }
  return out;
}

describe("simulations — integrity", () => {
  it("covers both languages", () => {
    expect(listSimulations().length).toBeGreaterThan(0);
    expect(listSimulationsEn().length).toBe(listSimulations().length);
  });

  it("offer a real choice, with a correct answer among the choices", () => {
    for (const { lang, s } of ALL) {
      const ids = s.choices.map((c) => c.id);
      expect(ids.length, `${lang}:${s.slug}`).toBeGreaterThanOrEqual(2);
      expect(new Set(ids).size, `${lang}:${s.slug}`).toBe(ids.length);
      expect(s.correctChoiceIds.length, `${lang}:${s.slug}`).toBeGreaterThan(0);
      for (const c of s.correctChoiceIds) expect(ids, `${lang}:${s.slug}`).toContain(c);
    }
  });

  it("explain every choice, right or wrong: the technique, the clue, the danger, the reflex", () => {
    for (const { lang, s } of ALL) {
      for (const c of s.choices) {
        const e = s.explanations[c.id];
        expect(e, `${lang}:${s.slug}:${c.id}`).toBeDefined();
        for (const field of ["technique", "indicator", "whyDangerous", "reflex"] as const) {
          expect(e[field]?.trim().length ?? 0, `${lang}:${s.slug}:${c.id}.${field}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("only use fictional, non-resolvable domains (decision 0002)", () => {
    const offenders = ALL.flatMap(({ lang, s }) => realLookingDomains(s.content).map((d) => `${lang}:${s.slug}: ${d}`));
    expect(offenders).toEqual([]);
  });
});

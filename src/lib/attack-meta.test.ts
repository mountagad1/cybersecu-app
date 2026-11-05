import { describe, expect, it } from "vitest";
import { listAttacks } from "@/content/attacks";
import { ATTACK_META_DESCRIPTIONS } from "@/content/attacks/meta-descriptions";
import { ATTACK_TITLE_MAX, attackDescription, attackTitle } from "./attack-meta";
import { META_DESCRIPTION_MAX } from "./meta";

describe("attackTitle", () => {
  it("names what the page answers", () => {
    expect(attackTitle("Scareware", "en")).toBe("Scareware: Definition, Signs and What to Do");
    expect(attackTitle("Ver informatique", "fr")).toBe("Ver informatique : définition, signes et que faire");
  });

  it("drops the gloss in parentheses before dropping the suffix", () => {
    expect(attackTitle("Pretexting (fabricated scenario)", "en")).toBe("Pretexting: Definition, Signs and What to Do");
  });

  it("keeps every fiche title within the limit", () => {
    for (const a of listAttacks()) {
      for (const [name, locale] of [[a.name, "fr"], [a.translations?.en?.name, "en"]] as const) {
        if (!name) continue;
        const title = attackTitle(name, locale);
        expect(title === name || title.length <= ATTACK_TITLE_MAX, title).toBe(true);
      }
    }
  });
});

describe("hand-written descriptions", () => {
  const slugs = {
    fr: new Set(listAttacks().map((a) => a.slug)),
    en: new Set(listAttacks().flatMap((a) => (a.translations?.en ? [a.translations.en.slug] : []))),
  };

  it("point at fiches that exist and fit the results page", () => {
    for (const locale of ["fr", "en"] as const) {
      for (const [slug, text] of Object.entries(ATTACK_META_DESCRIPTIONS[locale])) {
        expect(slugs[locale].has(slug), `${locale}:${slug}`).toBe(true);
        expect(text.length, `${locale}:${slug}`).toBeLessThanOrEqual(META_DESCRIPTION_MAX);
        expect(text.endsWith("…"), `${locale}:${slug}`).toBe(false);
      }
    }
  });

  it("win over the cut definition", () => {
    expect(attackDescription("A long definition.", "Written.")).toBe("Written.");
    expect(attackDescription("A long definition.")).toBe("A long definition.");
  });
});

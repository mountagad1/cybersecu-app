import { describe, expect, it } from "vitest";
import { listAttacks } from "@/content/attacks";
import { englishGuideSlug, listGuides } from "@/content/guides";
import { findTool, findToolEn, listTools, toolsForAttack } from "@/content/tools";
import { PASSWORD_ATTACK_CODES, PASSWORD_GENERATOR_CONTENT } from "@/content/tools/password-generator";
import { counterpartOf } from "@/domain/seo/counterparts";
import { buildUrlRegistry } from "@/domain/seo/indexability";
import { META_DESCRIPTION_MAX } from "@/lib/meta";

const FR = "/outils/generateur-mot-de-passe";
const EN = "/en/tools/password-generator";

describe("password generator — SEO", () => {
  it("has one indexable registry entry per language, paired both ways", () => {
    const registry = buildUrlRegistry();
    expect(registry.filter((e) => e.path === FR && e.indexable)).toHaveLength(1);
    expect(registry.filter((e) => e.path === EN && e.indexable)).toHaveLength(1);
    expect(counterpartOf(FR)).toBe(EN);
    expect(counterpartOf(EN)).toBe(FR);
  });

  it("gives no result or setting an address of its own", () => {
    const paths = buildUrlRegistry().map((e) => e.path);
    expect(paths.filter((p) => p.startsWith(`${FR}/`) || p.startsWith(`${EN}/`) || /[?#]/.test(p))).toEqual([]);
  });

  it("has a description that fits the results page, and a title no other tool uses", () => {
    const fr = findTool("generateur-mot-de-passe");
    const en = findToolEn("generateur-mot-de-passe");
    for (const d of [fr.description, en.description]) expect(d.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX);
    const others = listTools().filter((t) => t.slug !== fr.slug);
    expect(others.some((t) => t.title === fr.title || t.translations?.en?.title === en.title)).toBe(false);
  });

  it("links only to fiches and guides that exist", () => {
    const codes = new Set(listAttacks().map((a) => a.code));
    for (const code of PASSWORD_ATTACK_CODES) expect(codes.has(code), code).toBe(true);
    const guides = new Set(listGuides().map((g) => g.slug));
    for (const slug of findTool("generateur-mot-de-passe").relatedGuideSlugs) expect(guides.has(slug), slug).toBe(true);
  });

  it("does not appear on the fiches while they are frozen (EXP-020, until 2026-11-24)", () => {
    for (const attack of listAttacks()) {
      expect(toolsForAttack(attack).some((t) => t.slug === "generateur-mot-de-passe")).toBe(false);
    }
  });

  it("explains the same sections in both languages", () => {
    expect(PASSWORD_GENERATOR_CONTENT.fr.sections).toHaveLength(PASSWORD_GENERATOR_CONTENT.en.sections.length);
    for (const locale of ["fr", "en"] as const) {
      const ids = PASSWORD_GENERATOR_CONTENT[locale].sections.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
      // No section may promise what the tool cannot (docs/security/PASSWORD_GENERATOR_THREAT_MODEL.md §7).
      const text = JSON.stringify(PASSWORD_GENERATOR_CONTENT[locale]).toLowerCase();
      for (const claim of ["incassable", "inviolable", "unbreakable", "uncrackable", "100 %", "100%", "garanti", "guaranteed", "certifi"]) {
        expect(text.includes(claim), claim).toBe(false);
      }
    }
  });

  it("sends every next step to an indexable page in both languages", () => {
    const indexable = new Set(buildUrlRegistry().filter((e) => e.indexable).map((e) => e.path));
    const fr = PASSWORD_GENERATOR_CONTENT.fr.nextSteps;
    const en = PASSWORD_GENERATOR_CONTENT.en.nextSteps;
    expect(en).toHaveLength(fr.length);
    fr.forEach((step, i) => {
      expect(en[i].guideSlug).toBe(step.guideSlug);
      expect(en[i].toolSlug).toBe(step.toolSlug);
      expect(Boolean(step.linkLabel)).toBe(Boolean(step.guideSlug || step.toolSlug));
      if (step.guideSlug) {
        expect(indexable.has(`/guides/${step.guideSlug}`), step.guideSlug).toBe(true);
        expect(indexable.has(`/en/guides/${englishGuideSlug(step.guideSlug)}`), step.guideSlug).toBe(true);
      }
      if (step.toolSlug) {
        expect(indexable.has(`/outils/${step.toolSlug}`), step.toolSlug).toBe(true);
        expect(indexable.has(`/en/tools/${findToolEn(step.toolSlug).slug}`), step.toolSlug).toBe(true);
      }
    });
  });

  it("asks the same questions in both languages, each answered on its own", () => {
    const fr = PASSWORD_GENERATOR_CONTENT.fr.faq;
    const en = PASSWORD_GENERATOR_CONTENT.en.faq;
    expect(en).toHaveLength(fr.length);
    for (const f of [...fr, ...en]) {
      expect(f.question.endsWith("?"), f.question).toBe(true);
      // An answer that stands without the page around it (for search and answer engines).
      expect(f.answer.length).toBeGreaterThan(80);
    }
  });
});

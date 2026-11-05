import { describe, expect, it } from "vitest";
import { listGuides, listGuidesEn } from "@/content/guides";
import { listLevers, listLeversEn } from "@/content/levers";
import { META_DESCRIPTION_MAX } from "@/lib/meta";
import { WRITTEN_DESCRIPTIONS } from "./meta-descriptions";

describe("written guide and lever descriptions", () => {
  const slugs = {
    guide: { fr: new Set(listGuides().map((g) => g.slug)), en: new Set(listGuidesEn().map((g) => g.slug)) },
    lever: { fr: new Set(listLevers().map((l) => l.slug)), en: new Set(listLeversEn().map((l) => l.slug)) },
  };

  it("point at pages that exist and fit the results page", () => {
    for (const kind of ["guide", "lever"] as const) {
      for (const locale of ["fr", "en"] as const) {
        for (const [slug, text] of Object.entries(WRITTEN_DESCRIPTIONS[kind][locale])) {
          expect(slugs[kind][locale].has(slug), `${kind}/${locale}/${slug}`).toBe(true);
          expect(text.length, slug).toBeLessThanOrEqual(META_DESCRIPTION_MAX);
          expect(text.endsWith("…"), slug).toBe(false);
        }
      }
    }
  });
});

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The fiche illustrations (docs/seo/visuals/illustrations, IMAGE_MANIFEST.csv
 * ILL-01 to ILL-10) are text-free by request, self-contained and light. These
 * checks keep them so when one is edited.
 */
const DIR = join(process.cwd(), "docs/seo/visuals/illustrations");
const files = readdirSync(DIR).filter((f) => f.endsWith(".svg"));

describe("fiche illustrations", () => {
  it("are all there", () => {
    expect(files).toHaveLength(10);
  });

  for (const file of files) {
    const svg = readFileSync(join(DIR, file), "utf8");
    it(`${file}: no text, self-contained, 16:9, under 10 kB`, () => {
      expect(svg).not.toMatch(/<(text|tspan|textPath|foreignObject)\b/);
      expect(svg).not.toMatch(/\b(href|xlink:href)="(https?:)?\/\//);
      expect(svg).toMatch(/viewBox="0 0 1200 675"/);
      expect(Buffer.byteLength(svg)).toBeLessThan(10_000);
    });
  }
});

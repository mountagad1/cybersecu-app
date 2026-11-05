import { describe, expect, it } from "vitest";
import { TITLE_MAX, TITLE_SUFFIX, pageTitle } from "./page-title";
import { categoryTitle } from "./attack-meta";

describe("pageTitle", () => {
  it("keeps the site suffix when the whole title fits", () => {
    expect(pageTitle("Outils gratuits")).toBe("Outils gratuits");
  });

  it("drops the suffix rather than letting the page's own words be cut", () => {
    const long = "J'ai laissé quelqu'un prendre la main sur mon appareil : que faire";
    expect(long.length + TITLE_SUFFIX.length).toBeGreaterThan(TITLE_MAX);
    expect(pageTitle(long)).toEqual({ absolute: long });
  });
});

describe("categoryTitle", () => {
  it("names the family and how many fiches it explains", () => {
    expect(categoryTitle("Ingénierie sociale", 11, "fr")).toBe("Ingénierie sociale : 11 attaques expliquées");
    expect(categoryTitle("Social engineering", 11, "en")).toBe("Social engineering: 11 attacks explained");
  });
});

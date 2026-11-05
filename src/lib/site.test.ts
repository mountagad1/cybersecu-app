import { describe, expect, it } from "vitest";
import { absoluteUrl, SITE_URL } from "./site";

describe("absoluteUrl", () => {
  it("builds an absolute URL from a rooted path", () => {
    expect(absoluteUrl("/attaques")).toBe(`${SITE_URL}/attaques`);
  });

  it("keeps the root path's single trailing slash", () => {
    expect(absoluteUrl("/")).toBe(`${SITE_URL}/`);
  });

  it("normalises a trailing slash so canonical and sitemap cannot disagree", () => {
    expect(absoluteUrl("/attaques/phishing/")).toBe(absoluteUrl("/attaques/phishing"));
  });

  it("rejects a non-rooted path rather than silently producing a broken URL", () => {
    expect(() => absoluteUrl("attaques")).toThrow();
  });

  it("never produces a double slash after the origin", () => {
    expect(absoluteUrl("/attaques")).not.toMatch(/[^:]\/\//);
  });
});

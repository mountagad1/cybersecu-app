import { describe, expect, it } from "vitest";
import { buildUrlRegistry } from "./indexability";
import { counterpartMap, counterpartOf } from "./counterparts";

describe("counterpartOf", () => {
  const indexable = new Set(buildUrlRegistry().filter((e) => e.indexable).map((e) => e.path));
  const isEn = (p: string) => p === "/en" || p.startsWith("/en/");

  it("pairs every page with one page of the other language, both ways", () => {
    for (const [from, to] of counterpartMap()) {
      expect(indexable.has(to), `${from} → ${to}`).toBe(true);
      expect(isEn(from), from).not.toBe(isEn(to));
      expect(counterpartOf(to), `${to} ↩`).toBe(from);
    }
  });

  it("covers the translated entities", () => {
    expect(counterpartOf("/attaques/phishing")).toBe("/en/attaques/phishing");
    expect(counterpartOf("/en/attaques/computer-worm")).toBe("/attaques/ver-informatique");
    expect(counterpartOf("/a-propos")).toBe("/en/about");
    expect(counterpartOf("/conditions-utilisation")).toBe("/en/terms");
  });
});

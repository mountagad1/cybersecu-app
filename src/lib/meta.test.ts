import { describe, expect, it } from "vitest";
import { META_DESCRIPTION_MAX, metaDescription } from "./meta";

describe("metaDescription", () => {
  it("keeps short copy unchanged", () => {
    expect(metaDescription("Une phrase courte.")).toBe("Une phrase courte.");
  });

  it("cuts at the last full sentence that fits", () => {
    const first = "Le smishing est une arnaque par SMS qui imite un organisme de confiance, souvent une banque.";
    const text = `${first} Le message contient un lien vers un faux site qui imite l'interface bancaire et récupère vos identifiants.`;
    expect(metaDescription(text)).toBe(first);
  });

  it("falls back to a word boundary with an ellipsis, never mid-word", () => {
    const text = "mot ".repeat(80).trim();
    const result = metaDescription(text);
    expect(result.length).toBeLessThanOrEqual(META_DESCRIPTION_MAX);
    expect(result.endsWith("mot…")).toBe(true);
  });

  it("does not leave dangling punctuation before the ellipsis", () => {
    const text = `${"a".repeat(150)} — ${"b".repeat(40)}`;
    expect(metaDescription(text)).toBe(`${"a".repeat(150)}…`);
  });

  it("always fits the limit", () => {
    const text = `Première phrase très courte. ${"suite ".repeat(60)}`;
    expect(metaDescription(text).length).toBeLessThanOrEqual(META_DESCRIPTION_MAX);
  });
});

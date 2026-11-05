import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { BOUNDARIES, auditBoundaries, boundariesFor } =
  await import("./boundaries");
const { findAttackByCode } = await import("./index");

describe("« À ne pas confondre avec » (docs/CONTENT_TAXONOMY_PLAN.md §4.1)", () => {
  it("passes the audit", () => {
    expect(auditBoundaries(BOUNDARIES)).toEqual([]);
  });

  it("covers the boundaries the taxonomy and the programmatic SEO matrix require", () => {
    const pairs = BOUNDARIES.map((b) => [...b.pair].sort().join("|"));
    for (const [a, b] of [
      ["SOCIAL-000006", "SOCIAL-000001"], // vishing / faux conseiller bancaire
      ["SOCIAL-000009", "DATA-000002"], // usurpation / vol d'identité
      ["PHISH-000001", "SMS-000001"], // phishing / smishing
      ["PHISH-000001", "SOCIAL-000006"], // phishing / vishing
      ["PHISH-000001", "QR-000001"], // phishing / quishing
      ["SOCIAL-000003", "MAL-000010"], // faux support / scareware
      ["MAL-000003", "PERS-000005"], // logiciel espion / stalkerware
      ["PERS-000001", "PERS-000002"], // sextorsion / chantage au faux piratage
      ["MAL-000005", "MAL-000006"], // virus / ver
      ["MAL-000005", "MAL-000002"], // virus / cheval de Troie
      ["MAL-000006", "MAL-000002"], // ver / cheval de Troie
      ["MOB-000009", "MOB-000005"], // caméra / objet connecté
      ["MOB-000010", "MOB-000005"], // box / objet connecté
      ["AI-000009", "PERS-000003"], // photos détournées par IA / diffusion non consentie
      ["PERS-000001", "PERS-000003"], // sextorsion / diffusion non consentie
      ["NET-000008", "NET-000002"], // déauthentification / faux point d'accès
      ["NET-000003", "NET-000002"], // usurpation ARP / faux point d'accès
    ]) {
      expect(pairs).toContain([a, b].sort().join("|"));
    }
  });

  it("shows every comparison on both fiches, in both languages", () => {
    for (const b of BOUNDARIES) {
      for (const locale of ["fr", "en"] as const) {
        const [a, c] = b.pair;
        expect(boundariesFor(a, locale).map((x) => x.other.code)).toContain(c);
        expect(boundariesFor(c, locale).map((x) => x.other.code)).toContain(a);
      }
    }
  });

  it("links to the other fiche under its own slug and name in each language", () => {
    const [x] = boundariesFor("SOCIAL-000006", "en");
    const other = findAttackByCode(x.other.code)!;
    expect(x.other.slug).toBe(other.translations!.en!.slug);
    expect(x.other.name).toBe(other.translations!.en!.name);
  });
});

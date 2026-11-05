import { describe, expect, it } from "vitest";
import { analyzeLink } from "./decode";

function ok(input: string) {
  const result = analyzeLink(input);
  if (!result.ok) throw new Error(`expected ok for ${input}: ${result.error}`);
  return result;
}

const kinds = (input: string) => ok(input).observations.map((o) => o.kind);

describe("analyzeLink", () => {
  it("names the registered domain, not the decorative subdomain", () => {
    const r = ok("https://connexion.mabanque.fr.exemple-douteux.test/login");
    expect(r.registrableDomain).toBe("exemple-douteux.test");
    expect(r.subdomain).toBe("connexion.mabanque.fr");
    expect(kinds("https://connexion.mabanque.fr.exemple-douteux.test/login")).toContain("subdomain");
  });

  it("treats compound suffixes as suffixes (gouv.fr)", () => {
    const r = ok("https://www.impots.gouv.fr/accueil");
    expect(r.registrableDomain).toBe("impots.gouv.fr");
    expect(r.publicSuffix).toBe("gouv.fr");
  });

  it("explains the @ trick and reads the real destination", () => {
    const r = ok("https://mabanque.fr@exemple-douteux.test/");
    expect(r.registrableDomain).toBe("exemple-douteux.test");
    expect(r.observations.map((o) => o.kind)).toContain("userinfo");
  });

  it("flags non-Latin lookalikes and mixed scripts, with code points", () => {
    // Cyrillic « а » (U+0430) in place of Latin « a ».
    const r = ok("https://аpple.com/");
    expect(r.hostname.startsWith("xn--")).toBe(true);
    expect(r.suspiciousChars).toEqual([{ char: "а", codePoint: "U+0430", script: "cyrillique" }]);
    expect(r.observations.map((o) => o.kind)).toEqual(expect.arrayContaining(["non-ascii", "mixed-script"]));
  });

  it("flags an already-encoded xn-- host", () => {
    expect(kinds("https://xn--pple-43d.com/")).toContain("punycode");
  });

  it("reveals a capital I standing in for a lowercase l", () => {
    const r = ok("https://portal-cIient.fictional-mutual.example-not-real.test/login");
    expect(r.hostname).toBe("portal-ciient.fictional-mutual.example-not-real.test");
    expect(r.observations.map((o) => o.kind)).toContain("uppercase");
  });

  it("flags shorteners, IP hosts and plain http", () => {
    expect(kinds("https://bit.ly/abc")).toContain("shortener");
    expect(kinds("http://192.168.1.1/login")).toEqual(expect.arrayContaining(["ip", "http"]));
  });

  it("accepts an address typed without scheme, and says so", () => {
    const r = ok("exemple-douteux.test/page");
    expect(r.registrableDomain).toBe("exemple-douteux.test");
    expect(r.observations.map((o) => o.kind)).toContain("no-scheme");
  });

  it("refuses what is not a web address", () => {
    expect(analyzeLink("").ok).toBe(false);
    expect(analyzeLink("bonjour tout le monde").ok).toBe(false);
    expect(analyzeLink("javascript:alert(1)").ok).toBe(false);
    expect(analyzeLink("ftp://exemple.test/").ok).toBe(false);
  });

  it("never emits a verdict", () => {
    // The tool's contract: observations only. A « sûr » / « safe » wording
    // would be read as a guarantee by exactly the people it exists for.
    for (const input of ["https://www.impots.gouv.fr/", "https://bit.ly/x", "https://аpple.com/"]) {
      for (const o of ok(input).observations) {
        expect(o.text).not.toMatch(/\b(sûr|sans danger|fiable|légitime|safe)\b/i);
      }
    }
  });

  it("says the same thing in English, with no verdict either", () => {
    for (const input of [
      "https://connexion.mabanque.fr.exemple-douteux.test/login",
      "https://www.impots.gouv.fr@exemple.test/",
      "https://xn--pple-43d.com/",
      "https://bit.ly/x",
      "https://аpple.com/",
      "http://192.168.0.1/",
      "PayPaI.com",
    ]) {
      const fr = analyzeLink(input, "fr");
      const en = analyzeLink(input, "en");
      expect(en.ok).toBe(fr.ok);
      if (!fr.ok || !en.ok) continue;
      expect(en.observations.map((o) => o.kind)).toEqual(fr.observations.map((o) => o.kind));
      expect(en.registrableDomain).toBe(fr.registrableDomain);
      for (const o of en.observations) {
        expect(o.text).not.toMatch(/\b(safe|trustworthy|legitimate|genuine)\b/i);
        expect(o.text).not.toMatch(/[«»]/);
      }
    }
    const error = analyzeLink("", "en");
    expect(error.ok || error.error).toBe("Paste an address to analyze.");
  });
});

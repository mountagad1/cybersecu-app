import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { EFF_LARGE_WORDLIST, EFF_LARGE_WORDLIST_SHA256 } from "./eff-large-wordlist";
import { generatePassphrase } from "./passphrase";
import { DEFAULT_OPTIONS, SEPARATORS, WORDS, validateOptions } from "./options";

/** Dice code of the i-th word: five base-6 digits written 1–6, as in the EFF file. */
function diceCode(i: number): string {
  return [4, 3, 2, 1, 0].map((k) => (Math.floor(i / 6 ** k) % 6) + 1).join("");
}

describe("EFF wordlist", () => {
  it("is the published file, word for word (SHA-256 of the rebuilt file)", () => {
    const rebuilt = EFF_LARGE_WORDLIST.map((w, i) => `${diceCode(i)}\t${w}\n`).join("");
    expect(createHash("sha256").update(rebuilt).digest("hex")).toBe(EFF_LARGE_WORDLIST_SHA256);
  });

  it("has 7,776 unique lower-case words", () => {
    expect(EFF_LARGE_WORDLIST).toHaveLength(7776);
    expect(new Set(EFF_LARGE_WORDLIST).size).toBe(7776);
    for (const w of EFF_LARGE_WORDLIST) expect(w).toMatch(/^[a-z-]+$/);
  });

  it("contains no allowed separator, so a phrase splits back one way only", () => {
    for (const sep of SEPARATORS) expect(EFF_LARGE_WORDLIST.some((w) => w.includes(sep))).toBe(false);
  });
});

describe("generatePassphrase", () => {
  it("joins the requested number of list words with the separator", () => {
    for (const sep of SEPARATORS) {
      const p = generatePassphrase({ words: 6, separator: sep, capitalize: false }, EFF_LARGE_WORDLIST);
      expect(p.words).toHaveLength(6);
      expect(p.value.split(sep)).toEqual(p.words);
      for (const w of p.words) expect(EFF_LARGE_WORDLIST).toContain(w);
      expect(p.entropyBits).toBeCloseTo(6 * Math.log2(7776), 9);
    }
  });

  it("capitalises without changing the entropy", () => {
    const p = generatePassphrase({ words: 5, separator: ".", capitalize: true }, EFF_LARGE_WORDLIST);
    for (const w of p.words) expect(w[0]).toBe(w[0].toUpperCase());
    expect(p.entropyBits).toBeCloseTo(5 * Math.log2(7776), 9);
  });

  it("refuses a separator found inside a word (the entropy would be overstated)", () => {
    expect(() =>
      generatePassphrase({ words: 4, separator: "." , capitalize: false }, ["a.b", "c", "d"]),
    ).toThrow();
  });
});

describe("validateOptions", () => {
  it("accepts the defaults in both modes", () => {
    expect(validateOptions(DEFAULT_OPTIONS)).toEqual([]);
    expect(validateOptions({ ...DEFAULT_OPTIONS, mode: "passphrase" })).toEqual([]);
  });

  it("names each out-of-range or impossible setting", () => {
    const pw = (p: Partial<typeof DEFAULT_OPTIONS.password>) => ({ ...DEFAULT_OPTIONS, password: { ...DEFAULT_OPTIONS.password, ...p } });
    expect(validateOptions(pw({ length: 7 }))).toEqual(["length_range"]);
    expect(validateOptions(pw({ length: 129 }))).toEqual(["length_range"]);
    expect(validateOptions(pw({ length: Number.NaN }))).toEqual(["length_range"]);
    expect(validateOptions(pw({ classes: [] }))).toEqual(["no_class"]);
    expect(validateOptions({ ...DEFAULT_OPTIONS, candidates: 6 })).toEqual(["candidates_range"]);
    const words = (n: number) => ({ ...DEFAULT_OPTIONS, mode: "passphrase" as const, passphrase: { ...DEFAULT_OPTIONS.passphrase, words: n } });
    expect(validateOptions(words(WORDS.min - 1))).toEqual(["words_range"]);
    expect(validateOptions(words(WORDS.max + 1))).toEqual(["words_range"]);
  });
});

describe("generateCandidates", () => {
  it("draws independent candidates and discounts the choice among them", async () => {
    const { generateCandidates } = await import("./generate");
    const r = generateCandidates({ ...DEFAULT_OPTIONS, candidates: 4 }, null);
    if (r.kind !== "ok") throw new Error(r.kind);
    expect(r.values).toHaveLength(4);
    expect(new Set(r.values).size).toBe(4);
    expect(r.conservativeBits).toBeCloseTo(r.entropyBits - 2, 9);
  });

  it("returns the problems instead of a password when the options are invalid", async () => {
    const { generateCandidates } = await import("./generate");
    const r = generateCandidates({ ...DEFAULT_OPTIONS, password: { ...DEFAULT_OPTIONS.password, classes: [] } }, null);
    expect(r).toEqual({ kind: "invalid", problems: ["no_class"] });
  });

  it("needs the wordlist for a passphrase", async () => {
    const { generateCandidates } = await import("./generate");
    expect(() => generateCandidates({ ...DEFAULT_OPTIONS, mode: "passphrase" }, null)).toThrow();
    const r = generateCandidates({ ...DEFAULT_OPTIONS, mode: "passphrase" }, EFF_LARGE_WORDLIST);
    expect(r.kind === "ok" && r.alphabet === null).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { AMBIGUOUS, buildAlphabet, CHARACTER_CLASSES, classCharacters, validateAlphabet, type CharacterClass } from "./alphabet";
import { acceptanceRate, countPasswords, log2Big, passphraseEntropy, passwordEntropy } from "./entropy";
import { generatePassword } from "./generate-password";
import { LENGTH } from "./options";
import { randomIndices, type RandomSource } from "./random";

const ALL = [...CHARACTER_CLASSES];

/** Every subset of the classes, the empty one excluded. */
function subsets(): CharacterClass[][] {
  const out: CharacterClass[][] = [];
  for (let mask = 1; mask < 1 << ALL.length; mask++) out.push(ALL.filter((_, i) => mask & (1 << i)));
  return out;
}

describe("alphabet", () => {
  it("is printable ASCII, without duplicates, for every combination", () => {
    for (const classes of subsets()) {
      for (const excludeAmbiguous of [false, true]) {
        const a = buildAlphabet({ classes, excludeAmbiguous });
        expect(validateAlphabet(a)).toBeNull();
        expect(a.chars).toBe(a.groups.map((g) => g.chars).join(""));
      }
    }
  });

  it("covers the 94 printable ASCII characters except space", () => {
    expect(buildAlphabet({ classes: ALL, excludeAmbiguous: false }).chars.length).toBe(94);
  });

  it("drops every ambiguous character, and only those", () => {
    const a = buildAlphabet({ classes: ALL, excludeAmbiguous: true });
    for (const c of AMBIGUOUS) expect(a.chars).not.toContain(c);
    expect(a.chars.length).toBe(94 - AMBIGUOUS.length);
  });

  it("refuses an empty selection", () => {
    expect(() => buildAlphabet({ classes: [], excludeAmbiguous: false })).toThrow();
  });
});

describe("entropy", () => {
  it("is L·log2(A) without the class requirement", () => {
    expect(passwordEntropy([26, 26, 10, 32], 20, false)).toBeCloseTo(20 * Math.log2(94), 9);
  });

  it("counts valid passwords exactly (checked by brute force on small cases)", () => {
    // Groups {a,b} and {1}: strings of length 3 with at least one of each.
    const chars = "ab1";
    let brute = 0;
    for (let i = 0; i < 27; i++) {
      const s = [Math.floor(i / 9), Math.floor(i / 3) % 3, i % 3].map((d) => chars[d]).join("");
      if (/[ab]/.test(s) && /1/.test(s)) brute++;
    }
    expect(countPasswords([2, 1], 3, true)).toBe(BigInt(brute));
    // Three groups of 2, length 4, enumerated.
    let brute3 = 0;
    for (let i = 0; i < 6 ** 4; i++) {
      const digits = [0, 1, 2, 3].map((k) => Math.floor(i / 6 ** k) % 6);
      if ([0, 1, 2].every((g) => digits.some((d) => Math.floor(d / 2) === g))) brute3++;
    }
    expect(countPasswords([2, 2, 2], 4, true)).toBe(BigInt(brute3));
  });

  it("is lower with the class requirement than without, never higher", () => {
    for (const L of [8, 12, 20, 128]) {
      expect(passwordEntropy([26, 26, 10, 32], L, true)).toBeLessThan(passwordEntropy([26, 26, 10, 32], L, false));
    }
  });

  it("stays accurate for 128 characters (BigInt beyond double precision)", () => {
    expect(log2Big(BigInt(2) ** BigInt(900))).toBe(900);
    expect(log2Big(BigInt(94) ** BigInt(128))).toBeCloseTo(128 * Math.log2(94), 9);
  });

  it("is n·log2(7776) for a passphrase", () => {
    expect(passphraseEntropy(7776, 6)).toBeCloseTo(77.55, 2);
  });

  it("keeps the class-requirement rejection cheap for every allowed combination", () => {
    let lowest = 1;
    for (const classes of subsets()) {
      for (const ex of [false, true]) {
        const sizes = classes.map((c) => classCharacters(c, ex).length);
        lowest = Math.min(lowest, acceptanceRate(sizes, LENGTH.min));
      }
    }
    // The bound MAX_ATTEMPTS relies on; see generate-password.ts.
    expect(lowest).toBeGreaterThan(0.4);
  });
});

describe("generatePassword", () => {
  it("has the requested length and only alphabet characters", () => {
    for (const length of [LENGTH.min, 20, LENGTH.max]) {
      const p = generatePassword({ length, classes: ALL, excludeAmbiguous: true, requireEachClass: true });
      expect(p.value).toHaveLength(length);
      for (const c of p.value) expect(p.alphabet.chars).toContain(c);
      for (const c of AMBIGUOUS) expect(p.value).not.toContain(c);
    }
  });

  it("contains every selected class when required", () => {
    for (let i = 0; i < 300; i++) {
      const p = generatePassword({ length: 8, classes: ALL, excludeAmbiguous: false, requireEachClass: true });
      for (const g of p.alphabet.groups) expect([...p.value].some((c) => g.chars.includes(c))).toBe(true);
    }
  });

  it("rejects a whole draw that misses a class instead of patching it", () => {
    // First draw: 8 × index 1 (« b », lower only) → rejected. Second: « b » and « B » alternate → accepted.
    const draws = [new Array(8).fill(1), [1, 27, 1, 27, 1, 27, 1, 27]];
    let call = 0;
    const source: RandomSource = (buffer) => {
      const d = draws[Math.min(call++, 1)];
      for (let j = 0; j < buffer.length; j++) buffer[j] = d[j];
    };
    const p = generatePassword({ length: 8, classes: ["lower", "upper"], excludeAmbiguous: false, requireEachClass: true }, source);
    expect(p.value).toBe("bBbBbBbB");
    expect(call).toBe(2);
  });

  it("is uniform over valid passwords (tiny alphabet, exhaustive check)", () => {
    // Lower + digits, 8 characters, both required. Among valid passwords, those
    // starting with a digit are 10 × (36⁷ − 10⁷): a digit first, then at least
    // one lower letter among the other seven.
    const valid = Number(countPasswords([26, 10], 8, true));
    const expected = (10 * (36 ** 7 - 10 ** 7)) / valid;
    const L = 8;
    const n = 40_000;
    let digits = 0;
    for (let i = 0; i < n; i++) {
      const p = generatePassword({ length: L, classes: ["lower", "digits"], excludeAmbiguous: false, requireEachClass: true });
      if (/[0-9]/.test(p.value[0])) digits++;
    }
    const sd = Math.sqrt((expected * (1 - expected)) / n);
    // 6 standard deviations: false alarm below 10⁻⁸. Forcing a digit into a random
    // position would push this up by several points and fail.
    expect(Math.abs(digits / n - expected)).toBeLessThan(6 * sd);
  });

  it("never uses the source for anything but indices", () => {
    // Same source, same output: the generator adds no hidden input (time, counter, state).
    const fixed: RandomSource = (buffer) => {
      for (let j = 0; j < buffer.length; j++) buffer[j] = (j * 2654435761) >>> 0 || 1;
    };
    const opts = { length: 16, classes: ALL, excludeAmbiguous: false, requireEachClass: false };
    expect(generatePassword(opts, fixed).value).toBe(generatePassword(opts, fixed).value);
    expect(randomIndices(94, 3, fixed)).toEqual(randomIndices(94, 3, fixed));
  });
});

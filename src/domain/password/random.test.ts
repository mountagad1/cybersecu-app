import { describe, expect, it } from "vitest";
import { randomIndices, RandomUnavailableError, systemRandom, type RandomSource } from "./random";

/** A source that replays fixed words, so the rejection step can be observed. */
function scripted(words: number[]): RandomSource {
  let i = 0;
  return (buffer) => {
    for (let j = 0; j < buffer.length; j++) buffer[j] = words[i++ % words.length];
  };
}

describe("randomIndices", () => {
  it("rejects the words that would bias x mod n, instead of folding them", () => {
    // n = 3: 2³² mod 3 = 1, so the limit is 2³² − 1 and 0xFFFFFFFF must be rejected.
    const out = randomIndices(3, 3, scripted([0xffffffff, 4, 0xffffffff, 5, 6]));
    expect(out).toEqual([4 % 3, 5 % 3, 6 % 3]);
  });

  it("keeps every word when n divides 2³²", () => {
    expect(randomIndices(256, 2, scripted([0xffffffff, 0x101]))).toEqual([255, 1]);
  });

  it("refuses a source that writes nothing or only rejected words", () => {
    expect(() => randomIndices(10, 4, () => {})).toThrow(RandomUnavailableError);
    expect(() => randomIndices(3, 4, scripted([0xffffffff]))).toThrow(RandomUnavailableError);
  });

  it("refuses invalid ranges", () => {
    expect(() => randomIndices(0, 1)).toThrow(RangeError);
    expect(() => randomIndices(1.5, 1)).toThrow(RangeError);
    expect(() => randomIndices(10, -1)).toThrow(RangeError);
  });

  it("shows no gross non-uniformity with the real CSPRNG (chi-square, 10 bins)", () => {
    // Catches a broken mapping (an off-by-one, a wrong range). The modulo
    // bias itself (~2⁻³² here) is far too small to measure; the scripted
    // tests above are what prove it is removed.
    const n = 10;
    const draws = 200_000;
    const counts = new Array(n).fill(0);
    for (const x of randomIndices(n, draws)) counts[x]++;
    const expected = draws / n;
    const chi2 = counts.reduce((s, c) => s + (c - expected) ** 2 / expected, 0);
    // 9 degrees of freedom: P(χ² > 45) < 10⁻⁶ for a uniform source.
    expect(chi2).toBeLessThan(45);
  });
});

describe("systemRandom", () => {
  it("uses crypto.getRandomValues and fails closed without it", () => {
    expect(typeof systemRandom()).toBe("function");
    const original = globalThis.crypto;
    Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });
    try {
      expect(() => systemRandom()).toThrow(RandomUnavailableError);
    } finally {
      Object.defineProperty(globalThis, "crypto", { value: original, configurable: true });
    }
  });
});

/**
 * Uniform random integers for the password generator.
 *
 * The only entropy source is the platform CSPRNG, `crypto.getRandomValues`
 * (Web Crypto in the browser, the same API in Node for tests). There is no
 * fallback: if the API is missing the generator refuses to run rather than
 * produce something guessable. Never `Math.random`, a timestamp, a counter
 * or anything the visitor typed (docs/security/PASSWORD_GENERATOR_THREAT_MODEL.md).
 */

/** Fills a buffer with random 32-bit words. Injected only by tests. */
export type RandomSource = (buffer: Uint32Array) => void;

export class RandomUnavailableError extends Error {
  constructor() {
    super("crypto.getRandomValues is not available");
    this.name = "RandomUnavailableError";
  }
}

const RANGE = 2 ** 32;

/** The platform CSPRNG, or an error — checked at call time, not at import. */
export function systemRandom(): RandomSource {
  const crypto = globalThis.crypto;
  if (!crypto || typeof crypto.getRandomValues !== "function") throw new RandomUnavailableError();
  return (buffer) => {
    crypto.getRandomValues(buffer);
  };
}

/**
 * `count` integers, each uniform in [0, n).
 *
 * Rejection sampling: a 32-bit word `x` is kept only below the largest
 * multiple of `n` that fits in 2³², so `x mod n` hits every value equally
 * often. A plain `x mod n` would favour the low values whenever n does not
 * divide 2³². Rejected words are redrawn, in batches.
 */
export function randomIndices(n: number, count: number, source: RandomSource = systemRandom()): number[] {
  if (!Number.isInteger(n) || n < 1 || n > RANGE) throw new RangeError(`invalid range: ${n}`);
  if (!Number.isInteger(count) || count < 0) throw new RangeError(`invalid count: ${count}`);
  const limit = RANGE - (RANGE % n);
  const out: number[] = [];
  // At least 8 words, so the all-zero check below has a 2⁻²⁵⁶ false-alarm
  // rate; at most 16,384, the 64 KiB a single getRandomValues call accepts.
  const buffer = new Uint32Array(Math.min(Math.max(count, 8), 16_384));
  // A word is rejected with probability below 1/2, so a buffer of 8 or more
  // yields nothing with probability below 2⁻⁸; 64 such rounds in a row
  // (below 2⁻⁵¹²) means the source is broken, not unlucky.
  let emptyRounds = 0;
  while (out.length < count) {
    buffer.fill(0);
    source(buffer);
    // A source that silently wrote nothing would otherwise yield all zeros.
    if (buffer.every((x) => x === 0)) throw new RandomUnavailableError();
    const before = out.length;
    for (const x of buffer) {
      if (x < limit) out.push(x % n);
      if (out.length === count) break;
    }
    emptyRounds = out.length === before ? emptyRounds + 1 : 0;
    if (emptyRounds === 64) throw new RandomUnavailableError();
  }
  return out;
}

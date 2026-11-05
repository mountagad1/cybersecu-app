/**
 * Entropy of what the generator draws from, in bits: log2 of the number of
 * equally likely outputs. It describes the generator, not a password: it
 * holds only if the output is used exactly as generated, and says nothing
 * about a password that leaked or is reused (the risks the site's guides
 * put first). The interface shows it with that caveat and never as a
 * « strength » gauge or a time to crack.
 */

/** log2 of a positive BigInt, accurate to double precision. */
export function log2Big(n: bigint): number {
  if (n <= BigInt(0)) throw new RangeError("log2 of a non-positive number");
  const bits = n.toString(2).length;
  if (bits <= 53) return Math.log2(Number(n));
  const shift = bits - 53;
  return Math.log2(Number(n >> BigInt(shift))) + shift;
}

/**
 * Number of strings of `length` characters over disjoint groups of the
 * given sizes that contain at least one character of every group, by
 * inclusion–exclusion: Σ over subsets S of (−1)^|S| · (A − |S's chars|)^L.
 * With a single group, or no requirement, this is simply A^L.
 */
export function countPasswords(groupSizes: readonly number[], length: number, requireEach: boolean): bigint {
  const total = groupSizes.reduce((a, b) => a + b, 0);
  if (!requireEach) return BigInt(total) ** BigInt(length);
  let count = BigInt(0);
  for (let mask = 0; mask < 1 << groupSizes.length; mask++) {
    let removed = 0;
    let size = 0;
    groupSizes.forEach((g, i) => {
      if (mask & (1 << i)) {
        removed += g;
        size++;
      }
    });
    const term = BigInt(total - removed) ** BigInt(length);
    count += size % 2 === 0 ? term : -term;
  }
  return count;
}

/** Bits of a password drawn uniformly from all valid strings. */
export function passwordEntropy(groupSizes: readonly number[], length: number, requireEach: boolean): number {
  return log2Big(countPasswords(groupSizes, length, requireEach));
}

/** Bits of `words` words drawn uniformly and independently from a list of `listSize`. */
export function passphraseEntropy(listSize: number, words: number): number {
  return words * Math.log2(listSize);
}

/**
 * Probability that a uniform string over the whole alphabet already
 * contains every group: the acceptance rate of the rejection step in
 * `generatePassword`, used to bound its retries.
 */
export function acceptanceRate(groupSizes: readonly number[], length: number): number {
  const total = groupSizes.reduce((a, b) => a + b, 0);
  return 2 ** (passwordEntropy(groupSizes, length, true) - length * Math.log2(total));
}

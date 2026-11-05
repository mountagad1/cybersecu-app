import { buildAlphabet, type Alphabet } from "./alphabet";
import { passwordEntropy } from "./entropy";
import type { PasswordOptions } from "./options";
import { randomIndices, systemRandom, type RandomSource } from "./random";

/**
 * A random password, each character drawn uniformly from the alphabet.
 *
 * « At least one character of each class » is met by rejecting the whole
 * draw and drawing again, never by forcing characters in: rejection keeps
 * every valid password equally likely, so the entropy reported (exact, by
 * inclusion–exclusion) is the real one. Forcing one character per class
 * and shuffling would make some passwords likelier than others.
 */

/**
 * Upper bound on redraws. The lowest acceptance rate the options allow is
 * about 43 % (8 characters, 4 classes, ambiguous characters excluded;
 * the tests check every combination), so 10,000 failed draws has a
 * probability far below 10⁻¹⁰⁰. Reaching it means a broken source, and it
 * is an error — never a password that skipped the requirement.
 */
export const MAX_ATTEMPTS = 10_000;

export interface GeneratedPassword {
  value: string;
  alphabet: Alphabet;
  /** Bits, exact under the assumptions in `./entropy`. */
  entropyBits: number;
}

function hasEveryClass(value: string, alphabet: Alphabet): boolean {
  return alphabet.groups.every((g) => [...value].some((c) => g.chars.includes(c)));
}

export function generatePassword(options: PasswordOptions, source: RandomSource = systemRandom()): GeneratedPassword {
  const alphabet = buildAlphabet(options);
  const { length, requireEachClass } = options;
  if (requireEachClass && length < alphabet.groups.length) throw new RangeError("length below the number of classes");
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const value = randomIndices(alphabet.chars.length, length, source)
      .map((i) => alphabet.chars[i])
      .join("");
    if (!requireEachClass || hasEveryClass(value, alphabet)) {
      return {
        value,
        alphabet,
        entropyBits: passwordEntropy(
          alphabet.groups.map((g) => g.chars.length),
          length,
          requireEachClass,
        ),
      };
    }
  }
  throw new Error("password generation did not converge");
}

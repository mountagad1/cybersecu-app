import type { Alphabet } from "./alphabet";
import { generatePassword } from "./generate-password";
import { validateOptions, type GeneratorOptions, type OptionsProblem } from "./options";
import { generatePassphrase } from "./passphrase";
import { systemRandom, type RandomSource } from "./random";

/**
 * One call from the interface: options in, candidates or the reason there
 * are none out. Errors from the random source (no Web Crypto) are thrown,
 * not folded into a result, so the interface cannot mistake them for an
 * empty state — and their message never contains a password.
 */

export type GenerationResult =
  | {
      kind: "ok";
      values: string[];
      /** Bits of each candidate, as drawn. */
      entropyBits: number;
      /**
       * What is left once the visitor picks one of n candidates by taste:
       * at worst, the choice is predictable and costs log2(n) bits. Equal
       * to `entropyBits` with a single candidate. This is the figure shown.
       */
      conservativeBits: number;
      alphabet: Alphabet | null;
    }
  | { kind: "invalid"; problems: OptionsProblem[] };

export function generateCandidates(
  options: GeneratorOptions,
  wordlist: readonly string[] | null,
  source: RandomSource = systemRandom(),
): GenerationResult {
  const problems = validateOptions(options);
  if (problems.length > 0) return { kind: "invalid", problems };
  const values: string[] = [];
  let entropyBits = 0;
  let alphabet: Alphabet | null = null;
  for (let i = 0; i < options.candidates; i++) {
    if (options.mode === "passphrase") {
      if (!wordlist) throw new Error("wordlist not loaded");
      const p = generatePassphrase(options.passphrase, wordlist, source);
      values.push(p.value);
      entropyBits = p.entropyBits;
    } else {
      const p = generatePassword(options.password, source);
      values.push(p.value);
      entropyBits = p.entropyBits;
      alphabet = p.alphabet;
    }
  }
  return {
    kind: "ok",
    values,
    entropyBits,
    conservativeBits: entropyBits - Math.log2(options.candidates),
    alphabet,
  };
}

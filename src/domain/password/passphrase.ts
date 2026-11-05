import { passphraseEntropy } from "./entropy";
import type { PassphraseOptions } from "./options";
import { randomIndices, systemRandom, type RandomSource } from "./random";

/**
 * A passphrase: words drawn uniformly and independently (with replacement)
 * from a fixed list. Its entropy is words × log2(list size) — about 12.9
 * bits per word for the EFF list — because the separator is never empty
 * and never a character found inside a word (`SEPARATORS`), so the phrase
 * reads back as one sequence only. Capitalising each word is a fixed
 * transformation: it changes nothing an attacker who knows the settings
 * has to guess, and adds no entropy.
 */

export interface GeneratedPassphrase {
  value: string;
  words: string[];
  entropyBits: number;
}

export function generatePassphrase(
  options: PassphraseOptions,
  wordlist: readonly string[],
  source: RandomSource = systemRandom(),
): GeneratedPassphrase {
  if (wordlist.length < 2) throw new Error("wordlist too small");
  if (wordlist.some((w) => w.includes(options.separator))) throw new Error("separator occurs inside a word");
  const words = randomIndices(wordlist.length, options.words, source).map((i) => {
    const word = wordlist[i];
    return options.capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  });
  return {
    value: words.join(options.separator),
    words,
    entropyBits: passphraseEntropy(wordlist.length, options.words),
  };
}

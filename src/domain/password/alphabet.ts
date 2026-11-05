/**
 * Character classes and the alphabet a password is drawn from.
 *
 * Printable ASCII only: every site accepts it and every keyboard can type
 * it, which matters when a password has to be entered by hand on a TV or a
 * phone. The alphabet is shown to the visitor as-is, so what the entropy
 * figure assumes is visible.
 */

export const CHARACTER_CLASSES = ["lower", "upper", "digits", "symbols"] as const;
export type CharacterClass = (typeof CHARACTER_CLASSES)[number];

const FULL: Record<CharacterClass, string> = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
};

/**
 * Characters easily confused when read or retyped: zero and capital O,
 * one, small L, capital i and the vertical bar, and the quotes and
 * backtick that some fonts and keyboards render alike.
 */
export const AMBIGUOUS = "0Oo1lI|'\"`";

export interface AlphabetOptions {
  classes: readonly CharacterClass[];
  excludeAmbiguous: boolean;
}

/** The characters of one class under the options, in a fixed order. */
export function classCharacters(cls: CharacterClass, excludeAmbiguous: boolean): string {
  const chars = FULL[cls];
  return excludeAmbiguous ? [...chars].filter((c) => !AMBIGUOUS.includes(c)).join("") : chars;
}

export interface Alphabet {
  /** Every allowed character, each once. */
  chars: string;
  /** The characters of each selected class, disjoint, in `CHARACTER_CLASSES` order. */
  groups: { cls: CharacterClass; chars: string }[];
}

export function buildAlphabet({ classes, excludeAmbiguous }: AlphabetOptions): Alphabet {
  const groups = CHARACTER_CLASSES.filter((cls) => classes.includes(cls)).map((cls) => ({
    cls,
    chars: classCharacters(cls, excludeAmbiguous),
  }));
  const alphabet = { chars: groups.map((g) => g.chars).join(""), groups };
  const problem = validateAlphabet(alphabet);
  if (problem) throw new Error(problem);
  return alphabet;
}

/** Null when the alphabet is usable, otherwise why not. */
export function validateAlphabet({ chars, groups }: Alphabet): string | null {
  if (groups.length === 0) return "no character class selected";
  if (chars.length < 2) return "alphabet too small";
  if (new Set(chars).size !== chars.length) return "alphabet has duplicate characters";
  if (!/^[\x21-\x7e]+$/.test(chars)) return "alphabet has non-printable or non-ASCII characters";
  if (groups.some((g) => g.chars.length === 0)) return "a selected class is empty";
  return null;
}

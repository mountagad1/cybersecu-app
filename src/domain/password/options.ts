import { CHARACTER_CLASSES, type CharacterClass } from "./alphabet";

/**
 * What the visitor can set, its bounds and defaults, and the validation
 * that turns a bad combination into an explicit « invalid » state instead
 * of a silently adjusted password.
 */

export const LENGTH = { min: 8, max: 128, default: 20 } as const;
export const WORDS = { min: 4, max: 12, default: 6 } as const;
export const CANDIDATES = { min: 1, max: 5, default: 1 } as const;

/**
 * Word separators. Never empty, so a passphrase splits back into its words
 * in exactly one way and n·log2(7776) stays exact. Never « - » either: four
 * EFF words contain one (« t-shirt », « yo-yo »…), so « felt-tip » could be
 * one word or two.
 */
export const SEPARATORS = [".", "_", " ", ","] as const;
export type Separator = (typeof SEPARATORS)[number];

export type Mode = "password" | "passphrase";

export interface PasswordOptions {
  length: number;
  classes: CharacterClass[];
  excludeAmbiguous: boolean;
  requireEachClass: boolean;
}

export interface PassphraseOptions {
  words: number;
  separator: Separator;
  capitalize: boolean;
}

export interface GeneratorOptions {
  mode: Mode;
  password: PasswordOptions;
  passphrase: PassphraseOptions;
  candidates: number;
}

export const DEFAULT_OPTIONS: GeneratorOptions = {
  mode: "password",
  password: { length: LENGTH.default, classes: [...CHARACTER_CLASSES], excludeAmbiguous: false, requireEachClass: true },
  passphrase: { words: WORDS.default, separator: ".", capitalize: false },
  candidates: CANDIDATES.default,
};

export type OptionsProblem = "length_range" | "words_range" | "candidates_range" | "no_class" | "length_below_classes";

function inRange(value: number, { min, max }: { min: number; max: number }): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

/** Every problem with the options, empty when they can be generated. */
export function validateOptions(options: GeneratorOptions): OptionsProblem[] {
  const problems: OptionsProblem[] = [];
  if (!inRange(options.candidates, CANDIDATES)) problems.push("candidates_range");
  if (options.mode === "passphrase") {
    if (!inRange(options.passphrase.words, WORDS)) problems.push("words_range");
    if (!SEPARATORS.includes(options.passphrase.separator)) throw new Error("unknown separator");
    return problems;
  }
  const { length, classes, requireEachClass } = options.password;
  if (!inRange(length, LENGTH)) problems.push("length_range");
  if (classes.length === 0) problems.push("no_class");
  else if (requireEachClass && inRange(length, LENGTH) && length < classes.length) problems.push("length_below_classes");
  return problems;
}

/**
 * Meta description from a longer piece of copy.
 *
 * Templates used to take `definition.slice(0, 300)`: every description ran
 * past what results pages display (~160 characters) and one in five ended
 * mid-word. This keeps whole sentences when it can, and otherwise cuts at a
 * word boundary with an ellipsis — never inside a word.
 */
export const META_DESCRIPTION_MAX = 160;

/** Below this, a sentence-boundary cut drops too much to stand on its own. */
const MIN_SENTENCE_CUT = 70;

export function metaDescription(text: string, max = META_DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const window = clean.slice(0, max);
  const sentenceEnd = Math.max(window.lastIndexOf(". "), window.lastIndexOf("! "), window.lastIndexOf("? "));
  if (sentenceEnd + 1 >= MIN_SENTENCE_CUT) return window.slice(0, sentenceEnd + 1);

  const wordEnd = clean.slice(0, max - 1).lastIndexOf(" ");
  return `${clean.slice(0, wordEnd).replace(/[\s,;:—–-]+$/, "")}…`;
}

/**
 * `alternates.languages` for a page that exists in both French and English.
 *
 * Every language version must list every version *including itself*, and
 * both sides must agree — otherwise search engines discard the pair. Next.js
 * does not add the self-reference, so both routes call this with the same
 * two paths and emit the identical set. `x-default` points at French, the
 * site's primary language.
 *
 * A page with no translation gets no hreflang at all: an annotation listing
 * a single language says nothing.
 */
export function languageAlternates(paths: { fr: string; en: string | null | undefined }) {
  if (!paths.en) return undefined;
  return { fr: paths.fr, en: paths.en, "x-default": paths.fr };
}

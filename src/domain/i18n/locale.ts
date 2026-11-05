/**
 * Locale support, added incrementally (docs/decisions/0009-i18n-pilot.md).
 *
 * French is the site's only complete language; English exists wherever a
 * `translations.en` field has actually been authored on a piece of content,
 * never as a machine-translated fallback. A missing translation means the
 * English route for that content does not exist — the visitor gets a real
 * 404 or a link back to French, never a French page silently relabelled.
 */
export type Locale = "fr" | "en";

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALES: readonly Locale[] = ["fr", "en"];

/** URL path prefix for a locale. French is unprefixed — it is what every
 * existing URL on the site already is, and changing that would be its own
 * large, unrelated migration. */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

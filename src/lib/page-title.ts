import type { Metadata } from "next";

/** What the root layouts append to every title (`template: "%s | cybersecu.app"`). */
export const TITLE_SUFFIX = " | cybersecu.app";

/** Above this, results pages usually cut the title (docs/seo/COMPLETE_SEO_AUDIT.md CA-10). */
export const TITLE_MAX = 65;

/**
 * A page title that keeps the site suffix when it fits and drops it when it
 * would push the page's own words past the cut: the words that say what the
 * page answers matter more than the brand repeated on every result.
 */
export function pageTitle(text: string): NonNullable<Metadata["title"]> {
  return text.length + TITLE_SUFFIX.length > TITLE_MAX ? { absolute: text } : text;
}

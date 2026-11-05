import type { Metadata } from "next";
import type { Locale } from "@/domain/i18n/locale";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

export const OG_LOCALE: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export const OG_IMAGE_ALT: Record<Locale, string> = {
  fr: "cybersecu.app — Apprendre, détecter, se protéger",
  en: "cybersecu.app — Learn, detect, protect yourself",
};

/** The share image served by `src/app/og/[locale]/route.tsx`. */
export function ogImage(locale: Locale) {
  return { url: `/og/${locale}`, ...OG_IMAGE_SIZE, alt: OG_IMAGE_ALT[locale], type: "image/png" };
}

/**
 * A page's `openGraph`, completed with the site-wide fields.
 *
 * Next.js merges metadata shallowly: a page that sets `openGraph` replaces
 * the root layout's object entirely, so `siteName` and `locale` silently
 * disappeared from every page that set its own title or URL — and so did
 * the share image.
 */
export function openGraph(locale: Locale, og: OpenGraph): OpenGraph {
  return { siteName: "cybersecu.app", locale: OG_LOCALE[locale], images: [ogImage(locale)], ...og };
}

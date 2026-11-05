import Image from "next/image";
import Link from "next/link";
import { getUiStrings } from "@/domain/i18n/dictionary";
import { RootDocument, rootMetadata, rootViewport } from "@/components/root-document";

export const metadata = rootMetadata("en");
export const viewport = rootViewport;

/**
 * English mirror of `(marketing)/layout.tsx` — docs/decisions/0009-i18n-pilot.md.
 * French stays unprefixed; this shell serves everything under `/en/`. Kept
 * as a straight structural copy with strings pulled from the shared
 * dictionary, so the two never drift in layout, only in language.
 *
 * A root layout in its own right (there is no `app/layout.tsx`), so English
 * pages are served as `<html lang="en">` with English metadata defaults.
 */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  const t = getUiStrings("en").nav;
  return (
    <RootDocument locale="en">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t.skipToContent}
      </a>
      <header className="border-b border-border">
        <nav
          aria-label={t.navLabel}
          className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-3 py-3 sm:flex-nowrap sm:gap-x-6 sm:px-6 sm:py-4"
        >
          <Link href="/en" className="flex shrink-0 items-center gap-1.5 text-sm font-bold whitespace-nowrap sm:gap-2 sm:text-lg">
            <Image src="/logo.svg" alt="" width={28} height={28} loading="eager" className="size-5 shrink-0 sm:size-7" />
            <span>
              cybersecu<span className="text-secondary-strong">.app</span>
            </span>
          </Link>
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium sm:flex-nowrap sm:gap-x-6 sm:text-sm">
            <Link href="/en/attaques">{t.attacks}</Link>
            <Link href="/en/guides">{t.guides}</Link>
            <Link href="/en/tools">{t.tools}</Link>
            <Link href="/en/simulations">{t.simulations}</Link>
          </div>
        </nav>
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 text-sm text-muted-foreground">
          <nav aria-label={t.aboutNavLabel} className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/en/about" className="hover:text-foreground">
              {t.about}
            </Link>
            <Link href="/en/methodology" className="hover:text-foreground">
              {t.methodology}
            </Link>
            <Link href="/en/sources" className="hover:text-foreground">
              {t.sources}
            </Link>
            <Link href="/" className="hover:text-foreground" hrefLang="fr">
              Français
            </Link>
          </nav>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>{t.tagline}</p>
            <nav aria-label={t.legalNavLabel} className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <Link href="/restaurer" className="hover:text-foreground">
                {t.restore}
              </Link>
              <Link href="/en/privacy" className="hover:text-foreground">
                {t.privacy}
              </Link>
              <Link href="/en/terms" className="hover:text-foreground">
                {t.terms}
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </RootDocument>
  );
}

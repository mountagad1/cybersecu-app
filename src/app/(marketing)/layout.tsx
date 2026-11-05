import Image from "next/image";
import Link from "next/link";
import { RootDocument, rootMetadata, rootViewport } from "@/components/root-document";

/** Root layout for every French page — see `@/components/root-document`. */
export const metadata = rootMetadata("fr");
export const viewport = rootViewport;

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootDocument locale="fr">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Aller au contenu
      </a>
      <header className="border-b border-border print:hidden">
        <nav
          aria-label="Navigation principale"
          /* flex-wrap rather than a measured fit: the header now carries a
             third link, and at 320px the row was within a few pixels of the
             viewport. Wrapping makes horizontal overflow impossible whatever
             the font stack renders, instead of correct for the one I could
             have measured. */
          className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-3 py-3 sm:flex-nowrap sm:gap-x-6 sm:px-6 sm:py-4"
        >
          <Link href="/" className="flex shrink-0 items-center gap-1.5 text-sm font-bold whitespace-nowrap sm:gap-2 sm:text-lg">
            <Image src="/logo.svg" alt="" width={28} height={28} loading="eager" className="size-5 shrink-0 sm:size-7" />
            <span>
              cybersecu<span className="text-secondary-strong">.app</span>
            </span>
          </Link>
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium sm:flex-nowrap sm:gap-x-6 sm:text-sm">
            <Link href="/attaques">Attaques</Link>
            <Link href="/guides">Guides</Link>
            <Link href="/outils">Outils</Link>
            <Link href="/simulations">Simulations</Link>
          </div>
        </nav>
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-8 print:hidden">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 text-sm text-muted-foreground">
          <nav aria-label="À propos du site" className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/a-propos" className="hover:text-foreground">
              À propos
            </Link>
            <Link href="/methodologie" className="hover:text-foreground">
              Méthodologie
            </Link>
            <Link href="/sources" className="hover:text-foreground">
              Sources et références
            </Link>
            <Link href="/en" className="hover:text-foreground" hrefLang="en">
              English
            </Link>
          </nav>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>cybersecu.app — Développez vos réflexes. Évitez les pièges. Restez en sécurité.</p>
          <nav aria-label="Liens légaux" className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Link href="/restaurer" className="hover:text-foreground">
              Restaurer mon accès
            </Link>
            <Link href="/confidentialite" className="hover:text-foreground">
              Confidentialité
            </Link>
            <Link href="/conditions-utilisation" className="hover:text-foreground">
              Conditions d&apos;utilisation
            </Link>
          </nav>
          </div>
        </div>
      </footer>
    </RootDocument>
  );
}

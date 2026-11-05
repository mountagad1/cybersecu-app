import Link from "next/link";
import type { Metadata } from "next";
import { RootDocument, rootViewport } from "@/components/root-document";

/**
 * 404 for URLs that match no route. Required because the app has two root
 * layouts (French and English) and no single one to compose a 404 from —
 * see `@/components/root-document`. `notFound()` inside a route still
 * renders within that route's own root layout.
 *
 * Unmatched URLs carry no reliable language signal, so the page is French
 * (the site's primary language) followed by the same message in English,
 * marked `lang="en"`. A per-locale `app/en/not-found.tsx` was tried and
 * fails under two root layouts in Next.js 16 (`NoFallbackError`, empty
 * body), so the bilingual page is the fix for English 404s
 * (docs/seo/COMPLETE_SEO_AUDIT.md CA-08).
 */
export const metadata: Metadata = {
  // No `robots` here: Next.js already marks every 404 `noindex`.
  title: "Page introuvable · Page not found | cybersecu.app",
};

export const viewport = rootViewport;

const LINKS = [
  { href: "/attaques", label: "L'encyclopédie des attaques" },
  { href: "/guides", label: "Les guides pratiques" },
  { href: "/simulations", label: "Les simulations" },
] as const;

const LINKS_EN = [
  { href: "/en/attaques", label: "The attack encyclopedia" },
  { href: "/en/guides", label: "Practical guides" },
  { href: "/en/simulations", label: "Simulations" },
  { href: "/en", label: "Home" },
] as const;

export default function GlobalNotFound() {
  return (
    <RootDocument locale="fr">
      <main id="main-content" className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-24">
        <p className="text-sm font-semibold text-muted-foreground">Erreur 404</p>
        <h1 className="text-3xl font-bold">Cette page n&apos;existe pas</h1>
        <p className="text-muted-foreground">
          L&apos;adresse est peut-être mal tapée, ou la page a été déplacée. Vous pouvez repartir
          d&apos;ici :
        </p>
        <ul className="space-y-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-primary hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/" className="text-primary hover:underline">
              L&apos;accueil
            </Link>
          </li>
        </ul>
        <section lang="en" aria-labelledby="not-found-en" className="mt-6 flex flex-col gap-4 border-t border-border pt-8">
          <h2 id="not-found-en" className="text-xl font-semibold">
            This page doesn&apos;t exist
          </h2>
          <p className="text-muted-foreground">
            The address may be mistyped, or the page may have moved. You can start again from here:
          </p>
          <ul className="space-y-2">
            {LINKS_EN.map((link) => (
              <li key={link.href}>
                <Link href={link.href} hrefLang="en" className="text-primary hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </RootDocument>
  );
}

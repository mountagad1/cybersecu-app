import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import type { Locale } from "@/domain/i18n/locale";
import { getUiStrings } from "@/domain/i18n/dictionary";
import { counterpartOf } from "@/domain/seo/counterparts";

export interface Crumb {
  /** Visible label. */
  name: string;
  /** Site-rooted path, e.g. `/attaques`. */
  href: string;
}

/**
 * Renders the visible breadcrumb trail *and* the matching `BreadcrumbList`
 * JSON-LD from one array, so the two cannot drift apart.
 *
 * Fixes docs/SEO_CURRENT_STATE_AUDIT.md H-1, which had two defects: the
 * structured data used relative `item` values (schema.org requires absolute
 * URLs), and it omitted the "Accueil" level that the brief's hierarchy
 * starts from — so the markup and the JSON-LD described different trails.
 *
 * The final crumb is the current page: it is present in the JSON-LD (a
 * BreadcrumbList must terminate at the page itself) but rendered as plain
 * text rather than a self-link.
 *
 * The same final crumb is the page's path, so the trail also carries a link
 * to the page's other-language version when one exists — the visible,
 * followable counterpart of its hreflang pair (`counterpartOf`), labelled in
 * the language it leads to.
 */
export function Breadcrumbs({ trail, locale = "fr" }: { trail: readonly Crumb[]; locale?: Locale }) {
  const t = getUiStrings(locale);
  const current = trail.at(-1)?.href;
  const counterpart = current ? counterpartOf(current) : null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.href),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label={t.breadcrumbs.ariaLabel}
        className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-muted-foreground"
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {trail.map((crumb, index) => {
            const isCurrent = index === trail.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden>/</span>}
                {isCurrent ? (
                  <span aria-current="page">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
        {counterpart && (
          <Link
            href={counterpart}
            hrefLang={locale === "fr" ? "en" : "fr"}
            lang={locale === "fr" ? "en" : "fr"}
            className="hover:text-foreground hover:underline"
          >
            {locale === "fr" ? "English version" : "Version française"}
          </Link>
        )}
      </nav>
    </>
  );
}

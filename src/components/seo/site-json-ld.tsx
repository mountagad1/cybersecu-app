import { SITE_URL, absoluteUrl } from "@/lib/site";
import type { Locale } from "@/domain/i18n/locale";
import { PUBLISHER } from "@/lib/publisher";

/**
 * Site-level `Organization` + `WebSite` JSON-LD, emitted once from the root
 * layout (docs/SEO_CURRENT_STATE_AUDIT.md H-5, docs/SEO_ARCHITECTURE.md §4).
 *
 * Deliberately minimal. Every property here is something the site can
 * actually evidence: a name, a URL, a logo, and a one-line description that
 * matches the visible homepage copy. No `sameAs` social profiles, no
 * `foundingDate`, no `contactPoint`, no `SearchAction` — the brief forbids
 * fabricating entities, and a `SearchAction` in particular must not be
 * declared until a real `/recherche` endpoint exists.
 */
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Ties a page-level node (article, how-to, collection) to the site-level
 * entities above by reference, so every page names its publisher without
 * repeating — and risking contradicting — the Organization node.
 */
export const SITE_REFERENCES = {
  publisher: { "@id": ORGANIZATION_ID },
  isPartOf: { "@id": WEBSITE_ID },
} as const;

/** Same organisation, described in the language of the page it is on. */
const ORGANIZATION_DESCRIPTION: Record<Locale, string> = {
  fr: "Plateforme de sensibilisation à la cybersécurité : encyclopédie des attaques et arnaques en ligne, et simulations d'entraînement.",
  en: "Cybersecurity awareness platform: an encyclopedia of online attacks and scams, and training simulations.",
};

export function SiteJsonLd({ locale = "fr" }: { locale?: Locale }) {
  const graph = [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "cybersecu.app",
      url: absoluteUrl("/"),
      logo: absoluteUrl("/logo.svg"),
      description: ORGANIZATION_DESCRIPTION[locale],
      // The person who publishes the site, as named on the legal pages (src/lib/publisher.ts).
      founder: { "@type": "Person", name: PUBLISHER.name },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: "cybersecu.app",
      url: absoluteUrl("/"),
      // French throughout, English under /en/ — both are served from this one site.
      inLanguage: ["fr-FR", "en-US"],
      publisher: { "@id": ORGANIZATION_ID },
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}

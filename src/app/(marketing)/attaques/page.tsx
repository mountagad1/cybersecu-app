import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { languageAlternates } from "@/lib/hreflang";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { listAttacks, listCategoriesWithAttacks } from "@/content/attacks";
import { absoluteUrl } from "@/lib/site";

/**
 * Fully static: the encyclopedia lives in the repository, so there is
 * nothing to fetch at request time and every visitor — search crawlers
 * included — gets HTML straight from the CDN.
 */
export const dynamic = "force-static";

const familyCountForMetadata = listCategoriesWithAttacks().length;
const totalForMetadata = listAttacks().length;

export const metadata: Metadata = {
  title: "Encyclopédie des attaques et arnaques en ligne",
  description:
    "Hameçonnage, faux conseillers bancaires, fraudes au virement, piratage de comptes : comment ces attaques fonctionnent et comment les reconnaître.",
  alternates: {
    canonical: "/attaques",
    languages: languageAlternates({ fr: "/attaques", en: "/en/attaques" }),
  },
  openGraph: openGraph("fr", {
    title: "Encyclopédie des attaques et arnaques en ligne",
    description: `${totalForMetadata} techniques d'attaque expliquées, classées en ${familyCountForMetadata} familles : comment elles fonctionnent, à quoi les reconnaître, et quoi faire.`,
    type: "website",
    url: absoluteUrl("/attaques"),
  }),
};

export default function AttaquesIndexPage() {
  const families = listCategoriesWithAttacks();
  const total = listAttacks().length;
  const familyCount = families.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Encyclopédie des attaques",
    description: `Les ${total} techniques d'arnaque et d'attaque expliquées, classées en ${familyCount} familles.`,
    url: absoluteUrl("/attaques"),
    inLanguage: "fr-FR",
    ...SITE_REFERENCES,
    hasPart: families.map((family) => ({
      "@type": "CollectionPage",
      name: family.category.name,
      url: absoluteUrl(`/attaques/${family.category.slug}`),
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="index" locale="fr" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs trail={[{ name: "Accueil", href: "/" }, { name: "Attaques", href: "/attaques" }]} />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Encyclopédie des attaques</h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        {total} techniques expliquées, classées en {familyCount} familles. Chaque fiche décrit le mécanisme,
        les signaux d&apos;alerte, la façon de vérifier, et ce qu&apos;il faut faire — y compris si
        c&apos;est déjà arrivé.
      </p>

      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
        Les familles ci-dessous ne sont pas un classement mais un regroupement par{" "}
        <strong className="font-medium text-foreground">réflexe de défense</strong> : les attaques
        d&apos;une même famille se déjouent de la même manière, ce qui fait moins de choses à retenir.
      </p>

      <nav
        aria-label="Pour aller plus loin"
        className="mt-8 grid gap-3 sm:grid-cols-2"
      >
        <Link
          href="/leviers"
          className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
        >
          <span className="font-semibold group-hover:text-primary">Pourquoi ça marche sur nous</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Les neuf ressorts psychologiques que toutes ces attaques exploitent. Les comprendre vaut
            mieux que retenir cent fiches.
          </span>
        </Link>
        <Link
          href="/guides"
          className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
        >
          <span className="font-semibold group-hover:text-primary">Les gestes qui protègent</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Vérifier un lien, s&apos;assurer de l&apos;identité d&apos;un interlocuteur, réagir après
            un paiement : pas à pas.
          </span>
        </Link>
        <Link
          href="/exemples"
          className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary sm:col-span-2"
        >
          <span className="font-semibold group-hover:text-primary">Des exemples à regarder</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            La galerie d&apos;arnaques : l&apos;exemple fictif de chaque fiche, classé par canal, avec ce
            qui le trahit.
          </span>
        </Link>
      </nav>

      <div className="mt-10 space-y-10">
        {families.map(({ category, attacks }) => (
          <section key={category.slug} aria-labelledby={`famille-${category.slug}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 id={`famille-${category.slug}`} className="text-xl font-semibold sm:text-2xl">
                <Link
                  href={`/attaques/${category.slug}`}
                  className="hover:text-primary hover:underline"
                >
                  {category.name}
                </Link>
              </h2>
              <span className="text-sm text-muted-foreground">
                {attacks.length} fiche{attacks.length > 1 ? "s" : ""}
              </span>
            </div>

            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{category.definition}</p>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {attacks.map((attack) => (
                <li key={attack.code}>
                  <Link
                    href={`/attaques/${attack.slug}`}
                    className="group flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
                  >
                    <span className="font-semibold group-hover:text-primary">{attack.name}</span>
                    <span className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                      {attack.definition}
                    </span>
                    {attack.simulationSlug && (
                      <Badge variant="secondary" className="mt-3 w-fit">
                        Simulation disponible
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={`/attaques/${category.slug}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Tout comprendre sur « {category.name} »
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </section>
        ))}
      </div>
    </div>
  );
}

import { PageTracker } from "@/components/analytics/page-tracker";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { ComparisonExplorer } from "@/components/tools/comparison-explorer";
import { RelatedTools } from "@/components/tools/related-tools";
import {
  COMPARATOR_PATH,
  COMPARATOR_SLUG,
  listComparisons,
} from "@/domain/attack/comparisons";
import type { Locale } from "@/domain/i18n/locale";
import { absoluteUrl } from "@/lib/site";

const STRINGS = {
  fr: {
    home: { name: "Accueil", href: "/" },
    tools: { name: "Outils", href: "/outils" },
    crumb: "X ou Y ?",
    h1: "X ou Y ? Les attaques qu'on confond",
    intro: (n: number) =>
      `${n} paires d'attaques qui se ressemblent assez pour être confondues, côte à côte. Pour chacune : ce que fait chaque attaque en clair, ce qui la caractérise face à l'autre, et le critère qui les distingue. Le texte est celui des fiches, où chaque paire figure aussi dans « À ne pas confondre avec ».`,
    why: "Pourquoi distinguer",
    whyText:
      "Deux attaques proches ne se déjouent pas toujours de la même façon : le bon réflexe, et les démarches si c'est déjà arrivé, dépendent de celle qui est en cours. Chaque nom ci-dessous mène à sa fiche.",
  },
  en: {
    home: { name: "Home", href: "/en" },
    tools: { name: "Tools", href: "/en/tools" },
    crumb: "X or Y?",
    h1: "X or Y? The attacks people mix up",
    intro: (n: number) =>
      `${n} pairs of attacks that look alike enough to be confused, side by side. For each: what each attack does in plain terms, what sets it apart from the other, and the criterion that tells them apart. The text is the articles' own, where each pair also appears under “Not to be confused with”.`,
    why: "Why tell them apart",
    whyText:
      "Two similar attacks are not always defeated the same way: the right reflex, and the steps if it already happened, depend on which one is under way. Each name below leads to its article.",
  },
} as const;

/** `/outils/x-ou-y` and `/en/tools/x-or-y` (src/domain/attack/comparisons.ts). */
export function ComparatorPage({ locale }: { locale: Locale }) {
  const t = STRINGS[locale];
  const comparisons = listComparisons(locale);
  const path = COMPARATOR_PATH[locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t.h1,
    description: t.intro(comparisons.length),
    url: absoluteUrl(path),
    inLanguage: locale === "en" ? "en-US" : "fr-FR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: comparisons.length,
      itemListElement: comparisons.map((c, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${c.a.name} / ${c.b.name}`,
        url: absoluteUrl(`${path}#${c.id}`),
      })),
    },
    ...SITE_REFERENCES,
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="comparator" locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        locale={locale}
        trail={[t.home, t.tools, { name: t.crumb, href: path }]}
      />
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{t.h1}</h1>
      <p className="mt-3 max-w-3xl text-base text-muted-foreground">
        {t.intro(comparisons.length)}
      </p>
      <section
        aria-labelledby="why"
        className="mt-6 max-w-3xl rounded-lg border border-border bg-muted p-5"
      >
        <h2 id="why" className="text-lg font-semibold">
          {t.why}
        </h2>
        <p className="mt-2 text-sm">{t.whyText}</p>
      </section>

      <ComparisonExplorer comparisons={comparisons} locale={locale} />

      <RelatedTools toolSlug={COMPARATOR_SLUG} locale={locale} />
    </article>
  );
}

import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { languageAlternates } from "@/lib/hreflang";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { listCategoriesWithAttacks } from "@/content/attacks";
import { getLocalizedAttack, getLocalizedCategory } from "@/content/attacks/localize";
import { absoluteUrl } from "@/lib/site";

/**
 * English mirror of `(marketing)/attaques/page.tsx`, scoped to the pilot
 * family only (docs/decisions/0009-i18n-pilot.md): a category or attack
 * with no `translations.en` simply does not appear here, rather than
 * showing untranslated French copy under an English URL.
 */
export const dynamic = "force-static";

function translatedFamilies() {
  return listCategoriesWithAttacks().flatMap(({ category, attacks }) => {
    const localizedCategory = getLocalizedCategory(category, "en");
    if (!localizedCategory) return [];
    const localizedAttacks = attacks
      .map((a) => getLocalizedAttack(a, "en"))
      .filter((a): a is NonNullable<typeof a> => a !== null);
    if (localizedAttacks.length === 0) return [];
    return [{ category: localizedCategory, attacks: localizedAttacks }];
  });
}

export const metadata: Metadata = {
  title: "Attack encyclopedia",
  description:
    "Understand how phishing, fake bank advisors, wire-transfer fraud and account takeovers work — warning signs, verification and reflexes, explained simply.",
  alternates: {
    canonical: "/en/attaques",
    languages: languageAlternates({ fr: "/attaques", en: "/en/attaques" }),
  },
  openGraph: openGraph("en", {
    title: "Attack encyclopedia",
    type: "website",
    url: absoluteUrl("/en/attaques"),
  }),
};

export default function EnglishAttacksIndexPage() {
  const families = translatedFamilies();
  const total = families.reduce((sum, f) => sum + f.attacks.length, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Attack encyclopedia",
    description: `${total} attack and scam techniques explained, grouped into ${families.length} famil${families.length > 1 ? "ies" : "y"}.`,
    url: absoluteUrl("/en/attaques"),
    inLanguage: "en-US",
    ...SITE_REFERENCES,
    hasPart: families.map((family) => ({
      "@type": "CollectionPage",
      name: family.category.name,
      url: absoluteUrl(`/en/attaques/${family.category.slug}`),
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="index" locale="en" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        trail={[
          { name: "Home", href: "/en" },
          { name: "Attacks", href: "/en/attaques" },
        ]}
        locale="en"
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Attack encyclopedia</h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        {total} technique{total !== 1 ? "s" : ""} explained, grouped into {families.length} famil
        {families.length > 1 ? "ies" : "y"}. Each article describes the mechanism, the warning signs, how to
        verify, and what to do — including if it already happened.
      </p>

      <nav aria-label="Going further" className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/en/levers"
          className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
        >
          <span className="font-semibold group-hover:text-primary">Why it works on us</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            The psychological levers all these attacks exploit. Understanding them is worth more than
            memorizing a hundred articles.
          </span>
        </Link>
        <Link
          href="/en/guides"
          className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
        >
          <span className="font-semibold group-hover:text-primary">The gestures that protect</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Checking a link, confirming who you are talking to, reacting after a payment: step by step.
          </span>
        </Link>
        <Link
          href="/en/examples"
          className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary sm:col-span-2"
        >
          <span className="font-semibold group-hover:text-primary">Examples to look at</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            The scam gallery: each article&apos;s fictional example, sorted by channel, with what gives
            it away.
          </span>
        </Link>
      </nav>

      <div className="mt-10 space-y-10">
        {families.map(({ category, attacks }) => (
          <section key={category.slug} aria-labelledby={`family-${category.slug}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 id={`family-${category.slug}`} className="text-xl font-semibold sm:text-2xl">
                <Link href={`/en/attaques/${category.slug}`} className="hover:text-primary hover:underline">
                  {category.name}
                </Link>
              </h2>
              <span className="text-sm text-muted-foreground">
                {attacks.length} article{attacks.length > 1 ? "s" : ""}
              </span>
            </div>

            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{category.definition}</p>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {attacks.map((attack) => (
                <li key={attack.code}>
                  <Link
                    href={`/en/attaques/${attack.slug}`}
                    className="group flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
                  >
                    <span className="font-semibold group-hover:text-primary">{attack.name}</span>
                    <span className="mt-1 line-clamp-3 text-sm text-muted-foreground">{attack.definition}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

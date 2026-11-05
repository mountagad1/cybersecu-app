import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { metaDescription } from "@/lib/meta";
import { WRITTEN_DESCRIPTIONS } from "@/content/meta-descriptions";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { attacksUsingLever, englishLeverSlug, findLeverBySlug, listLevers } from "@/content/levers";
import { languageAlternates } from "@/lib/hreflang";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return listLevers().map((lever) => ({ slug: lever.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lever = findLeverBySlug(slug);
  if (!lever) return {};

  return {
    title: lever.name,
    description: WRITTEN_DESCRIPTIONS.lever.fr[lever.slug] ?? metaDescription(lever.plainLanguageDefinition),
    alternates: {
      canonical: `/leviers/${lever.slug}`,
      languages: languageAlternates({
        fr: `/leviers/${lever.slug}`,
        en: englishLeverSlug(lever.slug) && `/en/levers/${englishLeverSlug(lever.slug)}`,
      }),
    },
    openGraph: openGraph("fr", {
      title: lever.name,
      description: WRITTEN_DESCRIPTIONS.lever.fr[lever.slug] ?? metaDescription(lever.plainLanguageDefinition),
      type: "article",
      url: absoluteUrl(`/leviers/${lever.slug}`),
      modifiedTime: lever.updatedAt,
    }),
  };
}

export default async function LeverPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lever = findLeverBySlug(slug);
  if (!lever) notFound();

  const attacks = attacksUsingLever(lever.code);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: lever.name,
    description: lever.definition,
    url: absoluteUrl(`/leviers/${lever.slug}`),
    dateModified: lever.updatedAt,
    inLanguage: "fr-FR",
    ...SITE_REFERENCES,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="lever" locale="fr" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        trail={[
          { name: "Accueil", href: "/" },
          { name: "Leviers", href: "/leviers" },
          { name: lever.name, href: `/leviers/${lever.slug}` },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{lever.name}</h1>

      <section aria-labelledby="en-clair" className="mt-6 rounded-lg border border-border bg-muted p-5">
        <h2 id="en-clair" className="text-lg font-semibold">
          En clair
        </h2>
        <p className="mt-2 text-base">{lever.plainLanguageDefinition}</p>
      </section>

      <section aria-labelledby="definition" className="mt-8">
        <h2 id="definition" className="text-xl font-semibold">
          Définition
        </h2>
        <p className="mt-2 text-muted-foreground">{lever.definition}</p>
      </section>

      <section aria-labelledby="why" className="mt-8">
        <h2 id="why" className="text-xl font-semibold">
          Pourquoi ça marche
        </h2>
        <p className="mt-2 text-muted-foreground">{lever.whyItWorks}</p>
      </section>

      <section aria-labelledby="resist" className="mt-8">
        <h2 id="resist" className="text-xl font-semibold">
          Ce qui y résiste
        </h2>
        <p className="mt-2 text-muted-foreground">{lever.howToResist}</p>
      </section>

      <section
        aria-labelledby="question"
        className="mt-8 rounded-lg border-l-4 border-primary bg-muted p-5"
      >
        <h2 id="question" className="text-lg font-semibold">
          La question à se poser
        </h2>
        <p className="mt-2 text-lg italic">« {lever.counterQuestion} »</p>
      </section>

      <section aria-labelledby="attacks" className="mt-10">
        <h2 id="attacks" className="text-xl font-semibold">
          Les {attacks.length} attaques qui l&apos;exploitent
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {attacks.map((attack) => (
            <li key={attack.code}>
              <Link
                href={`/attaques/${attack.slug}`}
                className="block rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {attack.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm text-muted-foreground">
        <Link href="/leviers" className="text-primary hover:underline">
          Les autres leviers
        </Link>{" "}
        · <span className="whitespace-nowrap">Mise à jour : {lever.updatedAt}.</span>
      </p>
    </article>
  );
}

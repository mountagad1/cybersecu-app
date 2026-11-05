import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { metaDescription } from "@/lib/meta";
import { WRITTEN_DESCRIPTIONS } from "@/content/meta-descriptions";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import {
  attacksUsingLever,
  findLeverByEnSlug,
  listLeversEn,
} from "@/content/levers";
import {
  getLocalizedAttack,
  type LocalizedAttack,
} from "@/content/attacks/localize";
import { languageAlternates } from "@/lib/hreflang";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return listLeversEn().map((lever) => ({ slug: lever.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lever = findLeverByEnSlug(slug);
  if (!lever) return {};

  return {
    title: lever.name,
    description: WRITTEN_DESCRIPTIONS.lever.en[lever.slug] ?? metaDescription(lever.plainLanguageDefinition),
    alternates: {
      canonical: `/en/levers/${lever.slug}`,
      languages: languageAlternates({
        fr: `/leviers/${lever.frSlug}`,
        en: `/en/levers/${lever.slug}`,
      }),
    },
    openGraph: openGraph("en", {
      title: lever.name,
      description: WRITTEN_DESCRIPTIONS.lever.en[lever.slug] ?? metaDescription(lever.plainLanguageDefinition),
      type: "article",
      url: absoluteUrl(`/en/levers/${lever.slug}`),
      modifiedTime: lever.updatedAt,
    }),
  };
}

/** English mirror of `(marketing)/leviers/[slug]/page.tsx`, same sections in the same order. */
export default async function EnglishLeverPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lever = findLeverByEnSlug(slug);
  if (!lever) notFound();

  const attacks = attacksUsingLever(lever.code)
    .map((a) => getLocalizedAttack(a, "en"))
    .filter((a): a is LocalizedAttack => a !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: lever.name,
    description: lever.definition,
    url: absoluteUrl(`/en/levers/${lever.slug}`),
    dateModified: lever.updatedAt,
    inLanguage: "en-US",
    ...SITE_REFERENCES,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="lever" locale="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        locale="en"
        trail={[
          { name: "Home", href: "/en" },
          { name: "Levers", href: "/en/levers" },
          { name: lever.name, href: `/en/levers/${lever.slug}` },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{lever.name}</h1>

      <section
        aria-labelledby="in-plain-terms"
        className="mt-6 rounded-lg border border-border bg-muted p-5"
      >
        <h2 id="in-plain-terms" className="text-lg font-semibold">
          In plain terms
        </h2>
        <p className="mt-2 text-base">{lever.plainLanguageDefinition}</p>
      </section>

      <section aria-labelledby="definition" className="mt-8">
        <h2 id="definition" className="text-xl font-semibold">
          Definition
        </h2>
        <p className="mt-2 text-muted-foreground">{lever.definition}</p>
      </section>

      <section aria-labelledby="why" className="mt-8">
        <h2 id="why" className="text-xl font-semibold">
          Why it works
        </h2>
        <p className="mt-2 text-muted-foreground">{lever.whyItWorks}</p>
      </section>

      <section aria-labelledby="resist" className="mt-8">
        <h2 id="resist" className="text-xl font-semibold">
          What resists it
        </h2>
        <p className="mt-2 text-muted-foreground">{lever.howToResist}</p>
      </section>

      <section
        aria-labelledby="question"
        className="mt-8 rounded-lg border-l-4 border-primary bg-muted p-5"
      >
        <h2 id="question" className="text-lg font-semibold">
          The question to ask yourself
        </h2>
        <p className="mt-2 text-lg italic">
          &ldquo;{lever.counterQuestion}&rdquo;
        </p>
      </section>

      <section aria-labelledby="attacks" className="mt-10">
        <h2 id="attacks" className="text-xl font-semibold">
          The {attacks.length} attacks that exploit it
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {attacks.map((attack) => (
            <li key={attack.code}>
              <Link
                href={`/en/attaques/${attack.slug}`}
                className="block rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {attack.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm text-muted-foreground">
        <Link href="/en/levers" className="text-primary hover:underline">
          Other levers
        </Link>{" "}
        ·{" "}
        <span className="whitespace-nowrap">
          Last updated: {lever.updatedAt}.
        </span>
      </p>
    </article>
  );
}

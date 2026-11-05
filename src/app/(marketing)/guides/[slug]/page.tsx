import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { linksForGuide } from "@/domain/linking/engine";
import { trackAttrs } from "@/lib/analytics";
import { buttonVariants } from "@/components/ui/button";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { openGraph } from "@/lib/open-graph";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { metaDescription } from "@/lib/meta";
import { WRITTEN_DESCRIPTIONS } from "@/content/meta-descriptions";
import { AlertTriangle } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { attacksForGuide, englishGuideSlug, findGuideBySlug, listGuides } from "@/content/guides";
import { languageAlternates } from "@/lib/hreflang";
import { toolsForGuide } from "@/content/tools";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return listGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: pageTitle(guide.title),
    description: WRITTEN_DESCRIPTIONS.guide.fr[guide.slug] ?? metaDescription(guide.shortAnswer),
    alternates: {
      canonical: `/guides/${guide.slug}`,
      languages: languageAlternates({ fr: `/guides/${guide.slug}`, en: englishGuideSlug(guide.slug) && `/en/guides/${englishGuideSlug(guide.slug)}` }),
    },
    openGraph: openGraph("fr", {
      title: guide.title,
      description: WRITTEN_DESCRIPTIONS.guide.fr[guide.slug] ?? metaDescription(guide.shortAnswer),
      type: "article",
      url: absoluteUrl(`/guides/${guide.slug}`),
      modifiedTime: guide.updatedAt,
    }),
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = findGuideBySlug(slug);
  if (!guide) notFound();

  const attacks = attacksForGuide(guide);
  const tools = toolsForGuide(guide);
  const guideLinks = linksForGuide(guide, "fr");
  const audiences = guideLinks.audiences;
  const practice = guideLinks.practice[0];

  // HowTo describes a procedure, which is what this page is. It mirrors
  // the visible steps exactly — the schema is a description of the page,
  // never an addition to it.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.shortAnswer,
    url: absoluteUrl(`/guides/${guide.slug}`),
    dateModified: guide.updatedAt,
    inLanguage: "fr-FR",
    ...SITE_REFERENCES,
    step: guide.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
    })),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="guide" locale="fr" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        trail={[
          { name: "Accueil", href: "/" },
          { name: "Guides", href: "/guides" },
          { name: guide.title, href: `/guides/${guide.slug}` },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{guide.title}</h1>

      {/* The answer before the explanation: a reader who stops here must
          already have what they came for. */}
      <section aria-labelledby="reponse" className="mt-6 rounded-lg border border-border bg-muted p-5">
        <h2 id="reponse" className="text-lg font-semibold">
          En bref
        </h2>
        <p className="mt-2 text-base">{guide.shortAnswer}</p>
      </section>

      <section aria-labelledby="pourquoi" className="mt-8">
        <h2 id="pourquoi" className="text-xl font-semibold">
          Pourquoi cette méthode fonctionne
        </h2>
        <p className="mt-2 text-muted-foreground">{guide.why}</p>
      </section>

      <section aria-labelledby="etapes" className="mt-8">
        <h2 id="etapes" className="text-xl font-semibold">
          Pas à pas
        </h2>
        <ol className="mt-4 space-y-5">
          {guide.steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden
                className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="pieges" className="mt-10">
        <h2 id="pieges" className="flex items-center gap-2 text-xl font-semibold">
          <AlertTriangle className="size-5 shrink-0 text-warning" aria-hidden />
          Les erreurs les plus fréquentes
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          {guide.pitfalls.map((pitfall) => (
            <li key={pitfall}>{pitfall}</li>
          ))}
        </ul>
      </section>

      {practice && (
        <section
          aria-labelledby="practice"
          className="mt-10 rounded-lg border border-border bg-muted p-5 text-center sm:p-6"
        >
          <h2 id="practice" className="text-xl font-semibold">
            Voyez si vous reconnaissez ces signaux
          </h2>
          <p className="mx-auto mt-2 max-w-prose text-sm text-muted-foreground">
            Un message fictif, pour vous entraîner à décider sans risque : {practice.description}
          </p>
          <Link
            href={practice.href}
            className={`${buttonVariants({ size: "lg" })} mt-4 w-full sm:w-auto`}
            {...trackAttrs({
              name: "funnel_cta_click",
              props: { from: "guide", cta: "recognize_signals", attack_code: practice.code },
            })}
          >
            {practice.anchor}
          </Link>
        </section>
      )}

      {(tools.length > 0 || audiences.length > 0) && (
        <section aria-labelledby="outils" className="mt-10">
          <h2 id="outils" className="text-xl font-semibold">
            Un outil pour le faire
          </h2>
          <ul className="mt-4 space-y-2">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/outils/${tool.slug}`}
                  className="block rounded-md border border-border px-4 py-3 transition-colors hover:border-primary"
                >
                  <span className="font-medium">{tool.title}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{tool.description}</span>
                </Link>
              </li>
            ))}
            {audiences.map((audience) => (
              <li key={audience.href}>
                <Link
                  href={audience.href}
                  className="block rounded-md border border-border px-4 py-3 transition-colors hover:border-primary"
                >
                  <span className="font-medium">{audience.anchor}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{audience.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {attacks.length > 0 && (
        <section aria-labelledby="attaques" className="mt-10">
          <h2 id="attaques" className="text-xl font-semibold">
            Les attaques que ce geste déjoue
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {attacks.map((attack) => (
              <li key={attack.code}>
                <Link
                  href={`/attaques/${attack.slug}`}
                  {...trackAttrs({
                    name: "related_attack_click",
                    props: { from: "guide", to_attack: attack.code, section: "guide" },
                  })}
                  className="block rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                >
                  {attack.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {guide.references.length > 0 && (
        <section aria-labelledby="sources" className="mt-10">
          <h2 id="sources" className="text-xl font-semibold">
            Sources officielles
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1">
            {guide.references.map((ref) => (
              <li key={ref.url}>
                <a href={ref.url} className="text-primary underline" rel="noopener noreferrer" target="_blank">
                  {ref.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-sm text-muted-foreground">
        <Link href="/guides" className="text-primary hover:underline">
          Les autres guides
        </Link>{" "}
        · <span className="whitespace-nowrap">Mise à jour : {guide.updatedAt}.</span>
      </p>
    </article>
  );
}

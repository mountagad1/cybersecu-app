import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { linksForGuide } from "@/domain/linking/engine";
import { trackAttrs } from "@/lib/analytics";
import { buttonVariants } from "@/components/ui/button";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { AlertTriangle } from "lucide-react";
import { openGraph } from "@/lib/open-graph";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { metaDescription } from "@/lib/meta";
import { WRITTEN_DESCRIPTIONS } from "@/content/meta-descriptions";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import {
  attacksForGuideEn,
  findGuideByEnSlug,
  listGuidesEn,
} from "@/content/guides";
import { languageAlternates } from "@/lib/hreflang";
import { toolsForGuideEn } from "@/content/tools";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return listGuidesEn().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuideByEnSlug(slug);
  if (!guide) return {};

  return {
    title: pageTitle(guide.title),
    description: WRITTEN_DESCRIPTIONS.guide.en[guide.slug] ?? metaDescription(guide.shortAnswer),
    alternates: {
      canonical: `/en/guides/${guide.slug}`,
      languages: languageAlternates({
        fr: `/guides/${guide.frSlug}`,
        en: `/en/guides/${guide.slug}`,
      }),
    },
    openGraph: openGraph("en", {
      title: guide.title,
      description: WRITTEN_DESCRIPTIONS.guide.en[guide.slug] ?? metaDescription(guide.shortAnswer),
      type: "article",
      url: absoluteUrl(`/en/guides/${guide.slug}`),
      modifiedTime: guide.updatedAt,
    }),
  };
}

/**
 * English mirror of `(marketing)/guides/[slug]/page.tsx`, same sections in
 * the same order.
 */
export default async function EnglishGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = findGuideByEnSlug(slug);
  if (!guide) notFound();

  const attacks = attacksForGuideEn(guide);
  const tools = toolsForGuideEn(guide);
  const guideLinks = linksForGuide(guide, "en");
  const audiences = guideLinks.audiences;
  const practice = guideLinks.practice[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.shortAnswer,
    url: absoluteUrl(`/en/guides/${guide.slug}`),
    dateModified: guide.updatedAt,
    inLanguage: "en-US",
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
      <PageTracker pageType="guide" locale="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        locale="en"
        trail={[
          { name: "Home", href: "/en" },
          { name: "Guides", href: "/en/guides" },
          { name: guide.title, href: `/en/guides/${guide.slug}` },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{guide.title}</h1>

      <section
        aria-labelledby="answer"
        className="mt-6 rounded-lg border border-border bg-muted p-5"
      >
        <h2 id="answer" className="text-lg font-semibold">
          In short
        </h2>
        <p className="mt-2 text-base">{guide.shortAnswer}</p>
      </section>

      <section aria-labelledby="why" className="mt-8">
        <h2 id="why" className="text-xl font-semibold">
          Why this works
        </h2>
        <p className="mt-2 text-muted-foreground">{guide.why}</p>
      </section>

      <section aria-labelledby="steps" className="mt-8">
        <h2 id="steps" className="text-xl font-semibold">
          Step by step
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

      <section aria-labelledby="pitfalls" className="mt-10">
        <h2
          id="pitfalls"
          className="flex items-center gap-2 text-xl font-semibold"
        >
          <AlertTriangle className="size-5 shrink-0 text-warning" aria-hidden />
          The most common mistakes
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
            See whether you recognize these signs
          </h2>
          <p className="mx-auto mt-2 max-w-prose text-sm text-muted-foreground">
            A fictional message, to practice deciding without risk: {practice.description}
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
        <section aria-labelledby="tools" className="mt-10">
          <h2 id="tools" className="text-xl font-semibold">
            A tool to do it
          </h2>
          <ul className="mt-4 space-y-2">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/en/tools/${tool.slug}`}
                  className="block rounded-md border border-border px-4 py-3 transition-colors hover:border-primary"
                >
                  <span className="font-medium">{tool.title}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {tool.description}
                  </span>
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
        <section aria-labelledby="attacks" className="mt-10">
          <h2 id="attacks" className="text-xl font-semibold">
            The attacks this defeats
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {attacks.map((attack) => (
              <li key={attack.code}>
                <Link
                  href={`/en/attaques/${attack.slug}`}
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
            Official sources
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1">
            {guide.references.map((ref) => (
              <li key={ref.url}>
                <a
                  href={ref.url}
                  className="text-primary underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {ref.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-sm text-muted-foreground">
        <Link href="/en/guides" className="text-primary hover:underline">
          Other guides
        </Link>{" "}
        ·{" "}
        <span className="whitespace-nowrap">
          Last updated: {guide.updatedAt}.
        </span>
      </p>
    </article>
  );
}

import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { metaDescription } from "@/lib/meta";
import { attackDescription, attackTitle, categoryTitle } from "@/lib/attack-meta";
import { pageTitle } from "@/lib/page-title";
import { ATTACK_META_DESCRIPTIONS } from "@/content/attacks/meta-descriptions";
import { languageAlternates } from "@/lib/hreflang";
import { AlertTriangle, CheckCircle2, LifeBuoy, ShieldQuestion } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { CategoryHub } from "@/components/attack/category-hub";
import { buildHubContext } from "@/domain/attack/hub-context";
import { isCategoryPublishable, listAttacksInCategory, listCategoriesWithAttacks } from "@/content/attacks";
import { getLocalizedAttack, getLocalizedCategory } from "@/content/attacks/localize";
import { ATTACK_CATEGORIES, findCategory } from "@/domain/attack/categories";
import { findSimulationEnBySlug } from "@/content/simulations-en";
import {
  attackEntityJsonLd,
  siblingCategories,
  simulationsForCategory,
} from "@/domain/graph/knowledge-graph";
import { absoluteUrl } from "@/lib/site";
import { PUBLISHER, PUBLISHER_PAGE } from "@/lib/publisher";
import { BoundariesSection } from "@/components/attack/boundaries-section";
import { linksForAttack } from "@/domain/linking/engine";
import { trackAttrs } from "@/lib/analytics";
import { galleryHrefForChannel } from "@/domain/attack/gallery";
import { ATTACK_VECTOR_LABELS_EN } from "@/domain/attack/labels";
import { ChannelScenariosSection } from "@/components/attack/channel-scenarios-section";
import { channelOf, channelScenarios } from "@/domain/attack/channel-scenarios";
import { boundariesFor } from "@/content/attacks/boundaries";
import { englishLeverName, leversForAttackEn } from "@/content/levers";
import { Badge } from "@/components/ui/badge";

/**
 * English mirror of `(marketing)/attaques/[slug]/page.tsx`, restricted to
 * the pilot family (docs/decisions/0009-i18n-pilot.md). Deliberately
 * the same sections as the French page; every cross-link (levers, guides,
 * tools) goes to an English page, never to a French one.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

/**
 * Hubs are addressed by their English slug — the one the URL registry, the
 * sitemap, the breadcrumbs and the French page's hreflang all use. Looking
 * them up (and generating them) by the French slug served every English hub
 * under a URL nothing linked to, while the advertised URL returned 404.
 */
function translatedCategoryBySlug(slug: string) {
  return ATTACK_CATEGORIES.find(
    (c) => isCategoryPublishable(c) && getLocalizedCategory(c, "en")?.slug === slug,
  );
}

export function generateStaticParams() {
  const categorySlugs = ATTACK_CATEGORIES.filter(isCategoryPublishable).flatMap((c) => {
    const localized = getLocalizedCategory(c, "en");
    return localized ? [{ slug: localized.slug }] : [];
  });

  const attackSlugs = listCategoriesWithAttacks().flatMap(({ attacks }) =>
    attacks.flatMap((a) => {
      const localized = getLocalizedAttack(a, "en");
      return localized ? [{ slug: localized.slug }] : [];
    }),
  );

  return [...categorySlugs, ...attackSlugs];
}

function findTranslatedAttackBySlug(slug: string) {
  for (const { attacks } of listCategoriesWithAttacks()) {
    for (const attack of attacks) {
      const localized = getLocalizedAttack(attack, "en");
      if (localized && localized.slug === slug) return { attack, localized };
    }
  }
  return undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const category = translatedCategoryBySlug(slug);
  if (category) {
    const localized = getLocalizedCategory(category, "en")!;
    const translatedCount = listAttacksInCategory(category.slug).filter((a) => getLocalizedAttack(a, "en")).length;
    const hubTitle = categoryTitle(localized.name, translatedCount, "en");
    return {
      title: pageTitle(hubTitle),
      description: metaDescription(localized.definition),
      alternates: {
        canonical: `/en/attaques/${localized.slug}`,
        languages: languageAlternates({ fr: `/attaques/${category.slug}`, en: `/en/attaques/${localized.slug}` }),
      },
      openGraph: openGraph("en", {
        title: hubTitle,
        description: metaDescription(localized.definition),
        type: "website",
        url: absoluteUrl(`/en/attaques/${localized.slug}`),
      }),
    };
  }

  const found = findTranslatedAttackBySlug(slug);
  if (!found) return {};

  const title = attackTitle(found.localized.name, "en");
  const description = attackDescription(found.localized.definition, ATTACK_META_DESCRIPTIONS.en[found.localized.slug]);
  return {
    title,
    description,
    alternates: {
      canonical: `/en/attaques/${found.localized.slug}`,
      languages: languageAlternates({
        fr: `/attaques/${found.attack.slug}`,
        en: `/en/attaques/${found.localized.slug}`,
      }),
    },
    openGraph: openGraph("en", {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/en/attaques/${found.localized.slug}`),
      modifiedTime: found.attack.updatedAt,
    }),
  };
}

export default async function EnglishAttackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const hubCategory = translatedCategoryBySlug(slug);
  if (hubCategory) {
    const localizedCategory = getLocalizedCategory(hubCategory, "en")!;
    const attacks = listAttacksInCategory(hubCategory.slug)
      .map((a) => getLocalizedAttack(a, "en"))
      .filter((a): a is NonNullable<typeof a> => a !== null);
    return (
      <CategoryHub
        category={localizedCategory}
        attacks={attacks}
        otherCategories={siblingCategories(hubCategory.slug, "en")}
        simulations={simulationsForCategory(hubCategory.slug, "en")}
        context={buildHubContext(hubCategory.slug, "en")}
        locale="en"
      />
    );
  }

  const found = findTranslatedAttackBySlug(slug);
  if (!found) notFound();
  const { attack, localized } = found;

  const category = findCategory(attack.categorySlug);
  const localizedCategoryForCrumb = category ? getLocalizedCategory(category, "en") : undefined;
  const links = linksForAttack(attack, "en");
  const related = links.attacks;
  const guides = links.guides;
  const tools = links.tools;
  const levers = leversForAttackEn(attack);
  const simulation = localized.simulationSlug ? findSimulationEnBySlug(localized.simulationSlug) : undefined;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: localized.name,
    description: localized.definition,
    url: absoluteUrl(`/en/attaques/${localized.slug}`),
    ...(attack.publishedAt ? { datePublished: attack.publishedAt } : {}),
    dateModified: attack.updatedAt,
    inLanguage: "en-US",
    ...SITE_REFERENCES,
    // Who answers for the page (src/lib/publisher.ts). « editor », not « author »:
    // the publisher takes responsibility for the fiche, which is what is true.
    editor: { "@type": "Person", name: PUBLISHER.name, url: absoluteUrl(PUBLISHER_PAGE.en) },
    articleSection: localizedCategoryForCrumb?.name,
    ...(localized.aliases?.length ? { alternativeHeadline: localized.aliases.join(", ") } : {}),
    ...(localized.references.length > 0 && {
      citation: localized.references.map((ref) => ({ "@type": "CreativeWork", name: ref.label, url: ref.url })),
    }),
    ...attackEntityJsonLd({
      name: localized.name,
      aliases: localized.aliases,
      familyUrl: localizedCategoryForCrumb ? absoluteUrl(`/en/attaques/${localizedCategoryForCrumb.slug}`) : undefined,
      related: related.map((other) => ({ name: other.anchor, url: absoluteUrl(other.href) })),
    }),
  };

  const faqLd =
    localized.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: localized.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="attack" locale="en" attackCode={attack.code} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <Breadcrumbs
        trail={[
          { name: "Home", href: "/en" },
          { name: "Attacks", href: "/en/attaques" },
          ...(localizedCategoryForCrumb
            ? [{ name: localizedCategoryForCrumb.name, href: `/en/attaques/${localizedCategoryForCrumb.slug}` }]
            : []),
          { name: localized.name, href: `/en/attaques/${localized.slug}` },
        ]}
        locale="en"
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{localized.name}</h1>

      <section aria-labelledby="plain-language" className="mt-6 rounded-lg border border-border bg-muted p-5">
        <h2 id="plain-language" className="text-lg font-semibold">
          In plain terms
        </h2>
        <p className="mt-2 text-base">{localized.plainLanguageDefinition}</p>
      </section>

      <section aria-labelledby="definition" className="mt-6">
        <h2 id="definition" className="text-xl font-semibold">
          Definition
        </h2>
        <p className="mt-2 text-muted-foreground">{localized.definition}</p>
      </section>

      <BoundariesSection
        name={localized.name}
        boundaries={boundariesFor(attack.code, "en")}
        locale="en"
        comparator={links.comparison[0]}
        fromCode={attack.code}
      />

      <section aria-labelledby="how-it-works" className="mt-8">
        <h2 id="how-it-works" className="text-xl font-semibold">
          How it works
        </h2>
        <p className="mt-2 text-muted-foreground">{localized.howItWorks}</p>
      </section>

      {localized.whyItWorks && (
        <section aria-labelledby="why-it-works" className="mt-8">
          <h2 id="why-it-works" className="text-xl font-semibold">
            Why it works
          </h2>
          <p className="mt-2 text-muted-foreground">{localized.whyItWorks}</p>
        </section>
      )}

      {attack.triggers.length > 0 && (
        <section aria-labelledby="triggers" className="mt-8">
          <h2 id="triggers" className="text-xl font-semibold">
            What this attack relies on
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {attack.triggers.map((t) => {
              const lever = levers.find((l) => l.code === t);
              // A lever below the publication threshold has no page yet:
              // it stays visible as a plain badge rather than a dead link.
              return lever ? (
                <Link
                  key={t}
                  href={`/en/levers/${lever.slug}`}
                  className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  {lever.name}
                </Link>
              ) : (
                <Badge key={t} variant="secondary">
                  {englishLeverName(t)}
                </Badge>
              );
            })}
          </div>
          {levers.length > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Understanding these levers is worth more than memorizing a hundred pages: it is what lets
              you recognize a scam no one has described yet.
            </p>
          )}
        </section>
      )}

      <section aria-labelledby="warning-signs" className="mt-8">
        <h2 id="warning-signs" className="flex items-center gap-2 text-xl font-semibold">
          <AlertTriangle className="size-5 shrink-0 text-warning" aria-hidden />
          Warning signs
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          {localized.warningSigns.map((sign) => (
            <li key={sign}>{sign}</li>
          ))}
        </ul>
      </section>

      {localized.example && (
        <section aria-labelledby="example" className="mt-8 rounded-lg border border-dashed border-border p-5">
          <h2 id="example" className="text-xl font-semibold">
            Example
          </h2>
          {/* Labelled as fictional in the page itself, as on the French page
              (docs/decisions/0002). */}
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Fictional example — no real organization or address
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{localized.example.setting}</p>
          <blockquote className="mt-3 whitespace-pre-line break-words rounded-md bg-muted p-4 text-sm">
            {localized.example.message}
          </blockquote>
          <h3 className="mt-4 text-sm font-semibold">What gives it away</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {localized.example.giveaways.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <Link
            href={galleryHrefForChannel(attack.primaryVector, "en")}
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            More fictional examples: {ATTACK_VECTOR_LABELS_EN[attack.primaryVector]}
          </Link>
        </section>
      )}

      <section aria-labelledby="how-to-verify" className="mt-8">
        <h2 id="how-to-verify" className="flex items-center gap-2 text-xl font-semibold">
          <ShieldQuestion className="size-5 shrink-0 text-primary" aria-hidden />
          How to verify
        </h2>
        <p className="mt-2 text-muted-foreground">{localized.howToVerify}</p>
        {localized.decisionChecklist && (
          <>
            <h3 className="mt-5 font-semibold">The questions to ask, in order</h3>
            <ol className="mt-3 space-y-3">
              {localized.decisionChecklist.map((item, index) => (
                <li key={item.check} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{item.check}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">If yes: </span>
                      {item.then}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
      </section>

      <section aria-labelledby="what-to-do" className="mt-8">
        <h2 id="what-to-do" className="flex items-center gap-2 text-xl font-semibold">
          <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden />
          What to do
        </h2>
        <p className="mt-2 text-muted-foreground">{localized.whatToDo}</p>
      </section>

      <section aria-labelledby="victim" className="mt-8">
        <h2 id="victim" className="flex items-center gap-2 text-xl font-semibold">
          <LifeBuoy className="size-5 shrink-0 text-primary" aria-hidden />
          If it already happened
        </h2>
        <p className="mt-2 text-muted-foreground">{localized.whatToDoIfVictim}</p>
        <ul className="mt-3 space-y-1 text-sm">
          {links.protection.map((action) => (
            <li key={action.href}>
              <Link href={action.href} className="text-primary hover:underline">
                {action.anchor}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {localized.prevention && (
        <section aria-labelledby="prevention" className="mt-8">
          <h2 id="prevention" className="text-xl font-semibold">
            So it doesn&apos;t happen again
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
            {localized.prevention.map((habit) => (
              <li key={habit}>{habit}</li>
            ))}
          </ul>
        </section>
      )}

      {channelOf(attack.code) && (
        <ChannelScenariosSection
          channel={channelOf(attack.code)!}
          scenarios={channelScenarios(attack.code, "en")}
          fromCode={attack.code}
          locale="en"
        />
      )}

      {(guides.length > 0 || tools.length > 0 || links.audiences.length > 0) && (
        <section aria-labelledby="guides" className="mt-10">
          <h2 id="guides" className="text-xl font-semibold">
            The steps that defeat this attack
          </h2>
          <ul className="mt-4 space-y-2">
            {tools.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="block rounded-md border border-border px-4 py-3 transition-colors hover:border-primary"
                >
                  <span className="font-medium">{tool.anchor}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{tool.description}</span>
                </Link>
              </li>
            ))}
            {guides.map((guide) => (
              <li key={guide.href}>
                <Link
                  href={guide.href}
                  {...trackAttrs({
                    name: "guide_click",
                    props: { from: "attack", from_code: attack.code, guide: guide.code ?? "" },
                  })}
                  className="block rounded-md border border-border px-4 py-3 transition-colors hover:border-primary"
                >
                  <span className="font-medium">{guide.anchor}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{guide.description}</span>
                </Link>
              </li>
            ))}
            {links.audiences.map((audience) => (
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

      {simulation && (
        <section aria-labelledby="test-yourself" className="mt-10 rounded-lg border border-border bg-muted p-5 text-center sm:p-6">
          <h2 id="test-yourself" className="text-xl font-semibold">
            Test yourself
          </h2>
          <p className="mx-auto mt-2 max-w-prose text-sm text-muted-foreground">{simulation.teaser}</p>
          {links.simulations[0] && (
            <Link
              href={links.simulations[0].href}
              {...trackAttrs({
                name: "funnel_cta_click",
                props: { from: "attack", cta: "test_yourself", attack_code: attack.code },
              })}
              className={`${buttonVariants({ size: "lg" })} mt-4 w-full sm:w-auto`}
            >
              Start the simulation
              {/* Short on screen; the full anchor names the scenario for
                  assistive tech and crawlers (same text as the engine's). */}
              <span className="sr-only">: {localized.name}</span>
            </Link>
          )}
        </section>
      )}

      {!simulation && links.nearbySimulation[0] && (
        <section
          aria-labelledby="test-yourself"
          className="mt-10 rounded-lg border border-border bg-muted p-5 text-center sm:p-6"
        >
          <h2 id="test-yourself" className="text-xl font-semibold">
            Test yourself on a neighboring attack
          </h2>
          <p className="mx-auto mt-2 max-w-prose text-sm text-muted-foreground">
            There is no simulation for this attack itself. This one is close to it: {links.nearbySimulation[0].description}
          </p>
          <Link
            href={links.nearbySimulation[0].href}
            className={`${buttonVariants({ size: "lg" })} mt-4 w-full sm:w-auto`}
            {...trackAttrs({
              name: "funnel_cta_click",
              props: { from: "attack", cta: "nearby_simulation", attack_code: attack.code },
            })}
          >
            {links.nearbySimulation[0].anchor}
          </Link>
        </section>
      )}

      {localized.faq.length > 0 && (
        <section aria-labelledby="faq" className="mt-10">
          <h2 id="faq" className="text-xl font-semibold">
            Frequently asked questions
          </h2>
          <dl className="mt-4 space-y-5">
            {localized.faq.map((f) => (
              <div key={f.question}>
                <dt className="font-semibold">{f.question}</dt>
                <dd className="mt-1 text-muted-foreground">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-10">
          <h2 id="related" className="text-xl font-semibold">
            Related attacks
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {related.map((other) => (
              <li key={other.href}>
                <Link
                  href={other.href}
                  {...trackAttrs({
                    name: "related_attack_click",
                    props: { from: "attack", from_code: attack.code, to_attack: other.code ?? "", section: "related" },
                  })}
                  className="block rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                >
                  {other.anchor}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {localized.references.length > 0 && (
        <section aria-labelledby="references" className="mt-10">
          <h2 id="references" className="text-xl font-semibold">
            Official sources
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1">
            {localized.references.map((ref) => (
              <li key={ref.url}>
                <a href={ref.url} className="text-primary underline" rel="noopener noreferrer" target="_blank">
                  {ref.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {localized.aliases && localized.aliases.length > 0 && (
        <p className="mt-10 text-sm text-muted-foreground">Also known as: {localized.aliases.join(", ")}.</p>
      )}

      {localizedCategoryForCrumb && (
        <p className="mt-4 text-sm text-muted-foreground">
          This article is part of the{" "}
          <Link href={`/en/attaques/${localizedCategoryForCrumb.slug}`} className="text-primary hover:underline">
            {localizedCategoryForCrumb.name}
          </Link>{" "}
          family. <span className="whitespace-nowrap">Last updated: {attack.updatedAt}.</span>
        </p>
      )}
      <p className="mt-2 text-sm text-muted-foreground">
        Published under the responsibility of{" "}
        <Link href={PUBLISHER_PAGE.en} className="text-primary hover:underline">
          {PUBLISHER.name}
        </Link>{" "}
        ·{" "}
        <Link href="/en/methodology" className="text-primary hover:underline">
          methodology
        </Link>
        .
      </p>
    </article>
  );
}

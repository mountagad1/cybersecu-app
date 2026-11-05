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
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CategoryHub } from "@/components/attack/category-hub";
import { buildHubContext } from "@/domain/attack/hub-context";
import {
  findAttackBySlug,
  isCategoryPublishable,
  listAttacks,
  listAttacksInCategory,
} from "@/content/attacks";
import { getLocalizedCategory } from "@/content/attacks/localize";
import { ATTACKER_OBJECTIVE_LABELS } from "@/content/attacks/types";
import { ATTACK_VECTOR_LABELS, PSYCHOLOGICAL_TRIGGER_LABELS } from "@/domain/attack/labels";
import {
  attackEntityJsonLd,
  siblingCategories,
  simulationsForCategory,
} from "@/domain/graph/knowledge-graph";
import { leversForAttack } from "@/content/levers";
import { ATTACK_CATEGORIES, findCategory, getCategoryBySlug } from "@/domain/attack/categories";
import { findSimulationBySlug } from "@/content/simulations";
import { absoluteUrl } from "@/lib/site";
import { PUBLISHER, PUBLISHER_PAGE } from "@/lib/publisher";
import { BoundariesSection } from "@/components/attack/boundaries-section";
import { linksForAttack } from "@/domain/linking/engine";
import { trackAttrs } from "@/lib/analytics";
import { galleryHrefForChannel } from "@/domain/attack/gallery";
import { ChannelScenariosSection } from "@/components/attack/channel-scenarios-section";
import { channelOf, channelScenarios } from "@/domain/attack/channel-scenarios";
import { boundariesFor } from "@/content/attacks/boundaries";

export const dynamic = "force-static";
/** The catalogue is complete at build time, so an unknown slug is a real
 * 404 rather than a page waiting to be generated. */
export const dynamicParams = false;

/**
 * Category hubs and attack pages share this namespace, as the brief
 * specifies (`/attaques/ingenierie-sociale` alongside
 * `/attaques/homoglyphes`). The catalogue audit fails the build if an
 * attack slug ever collides with a category slug, so the two can never
 * shadow one another silently.
 */
export function generateStaticParams() {
  return [
    // Only routed families. A hub below the publication threshold is
    // declared in the taxonomy so content can name it, but it has no page:
    // an unknown slug must 404 rather than serve a list of one fiche.
    ...ATTACK_CATEGORIES.filter(isCategoryPublishable).map((category) => ({ slug: category.slug })),
    ...listAttacks().map((attack) => ({ slug: attack.slug })),
  ];
}

/** A category slug is a hub only once its family is publishable. */
function publishedCategory(slug: string) {
  const category = getCategoryBySlug(slug);
  return category && isCategoryPublishable(category) ? category : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const category = publishedCategory(slug);
  if (category) {
    const enTranslation = getLocalizedCategory(category, "en");
    const hubTitle = categoryTitle(category.name, listAttacksInCategory(category.slug).length, "fr");
    return {
      title: pageTitle(hubTitle),
      description: metaDescription(category.definition),
      alternates: {
        canonical: `/attaques/${category.slug}`,
        languages: languageAlternates({
          fr: `/attaques/${category.slug}`,
          en: enTranslation && `/en/attaques/${enTranslation.slug}`,
        }),
      },
      openGraph: openGraph("fr", {
        title: hubTitle,
        description: metaDescription(category.definition),
        type: "website",
        url: absoluteUrl(`/attaques/${category.slug}`),
      }),
    };
  }

  const attack = findAttackBySlug(slug);
  if (!attack) return {};

  const enTranslation = attack.translations?.en;
  const title = attackTitle(attack.name, "fr");
  const description = attackDescription(attack.definition, ATTACK_META_DESCRIPTIONS.fr[attack.slug]);
  return {
    title,
    description,
    alternates: {
      canonical: `/attaques/${attack.slug}`,
      languages: languageAlternates({
        fr: `/attaques/${attack.slug}`,
        en: enTranslation && `/en/attaques/${enTranslation.slug}`,
      }),
    },
    openGraph: openGraph("fr", {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/attaques/${attack.slug}`),
      modifiedTime: attack.updatedAt,
    }),
  };
}

export default async function AttackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // A category slug renders the hub; anything else is an attack page.
  const hubCategory = publishedCategory(slug);
  if (hubCategory) {
    const hubAttacks = listAttacksInCategory(hubCategory.slug);
    return (
      <CategoryHub
        category={hubCategory}
        attacks={hubAttacks}
        otherCategories={siblingCategories(hubCategory.slug, "fr")}
        simulations={simulationsForCategory(hubCategory.slug, "fr")}
        context={buildHubContext(hubCategory.slug, "fr")}
      />
    );
  }

  const attack = findAttackBySlug(slug);
  if (!attack) notFound();

  const category = findCategory(attack.categorySlug);
  const links = linksForAttack(attack, "fr");
  const related = links.attacks;
  const levers = leversForAttack(attack);
  const guides = links.guides;
  const tools = links.tools;
  const simulation = attack.simulationSlug ? findSimulationBySlug(attack.simulationSlug) : undefined;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: attack.name,
    description: attack.definition,
    url: absoluteUrl(`/attaques/${attack.slug}`),
    ...(attack.publishedAt ? { datePublished: attack.publishedAt } : {}),
    dateModified: attack.updatedAt,
    inLanguage: "fr-FR",
    ...SITE_REFERENCES,
    // Who answers for the page (src/lib/publisher.ts). « editor », not « author »:
    // the publisher takes responsibility for the fiche, which is what is true.
    editor: { "@type": "Person", name: PUBLISHER.name, url: absoluteUrl(PUBLISHER_PAGE.fr) },
    articleSection: category?.name,
    ...(attack.aliases?.length ? { alternativeHeadline: attack.aliases.join(", ") } : {}),
    ...(attack.references.length > 0 && {
      citation: attack.references.map((ref) => ({ "@type": "CreativeWork", name: ref.label, url: ref.url })),
    }),
    ...attackEntityJsonLd({
      name: attack.name,
      aliases: attack.aliases,
      familyUrl: category ? absoluteUrl(`/attaques/${category.slug}`) : undefined,
      related: related.map((other) => ({ name: other.anchor, url: absoluteUrl(other.href) })),
    }),
  };

  // FAQPage stays in the markup even though Google withdrew the FAQ rich
  // result: it still describes the page's structure for other consumers,
  // and the questions themselves exist for semantic coverage, not for a
  // snippet. They are real questions people ask about this attack.
  const faqLd =
    attack.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: attack.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="attack" locale="fr" attackCode={attack.code} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      <Breadcrumbs
        trail={[
          { name: "Accueil", href: "/" },
          { name: "Attaques", href: "/attaques" },
          ...(category
            ? [{ name: category.name, href: `/attaques/${category.slug}` }]
            : []),
          { name: attack.name, href: `/attaques/${attack.slug}` },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{attack.name}</h1>

      {/* « En clair » first, before any terminology. A reader who has just
          received the message needs to know what is happening to them
          before they need a definition (brief SENIOR_AND_BEGINNER_
          ACCESSIBILITY, niveau 1). */}
      <section
        aria-labelledby="en-clair"
        className="mt-6 rounded-lg border border-border bg-muted p-5"
      >
        <h2 id="en-clair" className="text-lg font-semibold">
          En clair
        </h2>
        <p className="mt-2 text-base">{attack.plainLanguageDefinition}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Ce que cherche l&apos;attaquant :{" "}
          <span className="text-foreground">
            {ATTACKER_OBJECTIVE_LABELS[attack.attackerObjective].toLowerCase()}
          </span>
          .
        </p>
      </section>

      <section aria-labelledby="definition" className="mt-6">
        <h2 id="definition" className="text-xl font-semibold">
          Définition
        </h2>
        <p className="mt-2 text-muted-foreground">{attack.definition}</p>
      </section>

      <BoundariesSection
        name={attack.name}
        boundaries={boundariesFor(attack.code, "fr")}
        locale="fr"
        comparator={links.comparison[0]}
        fromCode={attack.code}
      />

      <section aria-labelledby="how-it-works" className="mt-8">
        <h2 id="how-it-works" className="text-xl font-semibold">
          Comment ça fonctionne
        </h2>
        <p className="mt-2 text-muted-foreground">{attack.howItWorks}</p>
      </section>

      {attack.whyItWorks && (
        <section aria-labelledby="why-it-works" className="mt-8">
          <h2 id="why-it-works" className="text-xl font-semibold">
            Pourquoi ça marche
          </h2>
          <p className="mt-2 text-muted-foreground">{attack.whyItWorks}</p>
        </section>
      )}

      {attack.triggers.length > 0 && (
        <section aria-labelledby="triggers" className="mt-8">
          <h2 id="triggers" className="text-xl font-semibold">
            Sur quoi cette attaque s&apos;appuie
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {attack.triggers.map((t) => {
              const lever = levers.find((l) => l.code === t);
              // A lever below the publication threshold has no page yet:
              // it stays visible as a plain badge rather than a dead link.
              return lever ? (
                <Link
                  key={t}
                  href={`/leviers/${lever.slug}`}
                  className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  {lever.name}
                </Link>
              ) : (
                <Badge key={t} variant="secondary">
                  {PSYCHOLOGICAL_TRIGGER_LABELS[t]}
                </Badge>
              );
            })}
          </div>
          {levers.length > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Comprendre ces ressorts vaut mieux que retenir cent fiches : c&apos;est ce qui permet
              de reconnaître une arnaque que personne n&apos;a encore décrite.
            </p>
          )}
        </section>
      )}

      <section aria-labelledby="warning-signs" className="mt-8">
        <h2 id="warning-signs" className="flex items-center gap-2 text-xl font-semibold">
          <AlertTriangle className="size-5 shrink-0 text-warning" aria-hidden />
          Signaux d&apos;alerte
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          {attack.warningSigns.map((sign) => (
            <li key={sign}>{sign}</li>
          ))}
        </ul>
      </section>

      {attack.example && (
        <section aria-labelledby="example" className="mt-8 rounded-lg border border-dashed border-border p-5">
          <h2 id="example" className="text-xl font-semibold">
            Exemple
          </h2>
          {/* Labelled as fictional in the page itself, not only in a
              comment: a reader must never take it for a real message from
              a real organisation (docs/decisions/0002). */}
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Exemple fictif — aucune organisation ni adresse réelle
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{attack.example.setting}</p>
          <blockquote className="mt-3 whitespace-pre-line break-words rounded-md bg-muted p-4 text-sm">
            {attack.example.message}
          </blockquote>
          <h3 className="mt-4 text-sm font-semibold">Ce qui le trahit</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {attack.example.giveaways.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <Link
            href={galleryHrefForChannel(attack.primaryVector, "fr")}
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            D&apos;autres exemples fictifs, canal « {ATTACK_VECTOR_LABELS[attack.primaryVector]} »
          </Link>
        </section>
      )}

      <section aria-labelledby="how-to-verify" className="mt-8">
        <h2 id="how-to-verify" className="flex items-center gap-2 text-xl font-semibold">
          <ShieldQuestion className="size-5 shrink-0 text-primary" aria-hidden />
          Comment vérifier
        </h2>
        <p className="mt-2 text-muted-foreground">{attack.howToVerify}</p>
        {attack.decisionChecklist && (
          <>
            <h3 className="mt-5 font-semibold">Les questions à se poser, dans l&apos;ordre</h3>
            <ol className="mt-3 space-y-3">
              {attack.decisionChecklist.map((item, index) => (
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
                      <span className="font-medium text-foreground">Si oui : </span>
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
          Que faire
        </h2>
        <p className="mt-2 text-muted-foreground">{attack.whatToDo}</p>
      </section>

      <section aria-labelledby="victim" className="mt-8">
        <h2 id="victim" className="flex items-center gap-2 text-xl font-semibold">
          <LifeBuoy className="size-5 shrink-0 text-primary" aria-hidden />
          Si c&apos;est déjà arrivé
        </h2>
        <p className="mt-2 text-muted-foreground">{attack.whatToDoIfVictim}</p>
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

      {attack.prevention && (
        <section aria-labelledby="prevention" className="mt-8">
          <h2 id="prevention" className="text-xl font-semibold">
            Pour que ça ne se reproduise pas
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
            {attack.prevention.map((habit) => (
              <li key={habit}>{habit}</li>
            ))}
          </ul>
        </section>
      )}

      {channelOf(attack.code) && (
        <ChannelScenariosSection
          channel={channelOf(attack.code)!}
          scenarios={channelScenarios(attack.code, "fr")}
          fromCode={attack.code}
          locale="fr"
        />
      )}

      {(guides.length > 0 || tools.length > 0 || links.audiences.length > 0) && (
        <section aria-labelledby="guides" className="mt-10">
          <h2 id="guides" className="text-xl font-semibold">
            Les gestes qui déjouent cette attaque
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
        <section
          aria-labelledby="test-yourself"
          className="mt-10 rounded-lg border border-border bg-muted p-5 text-center sm:p-6"
        >
          <h2 id="test-yourself" className="text-xl font-semibold">
            Testez-vous
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
              Lancer la simulation
              {/* Short on screen; the full anchor names the scenario for
                  assistive tech and crawlers (same text as the engine's). */}
              <span className="sr-only"> « {attack.name} »</span>
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
            Testez-vous sur une attaque voisine
          </h2>
          <p className="mx-auto mt-2 max-w-prose text-sm text-muted-foreground">
            Pas de simulation pour cette attaque-ci. Celle-ci en est proche : {links.nearbySimulation[0].description}
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

      {attack.faq.length > 0 && (
        <section aria-labelledby="faq" className="mt-10">
          <h2 id="faq" className="text-xl font-semibold">
            Questions fréquentes
          </h2>
          <dl className="mt-4 space-y-5">
            {attack.faq.map((f) => (
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
            Attaques liées
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

      {attack.references.length > 0 && (
        <section aria-labelledby="references" className="mt-10">
          <h2 id="references" className="text-xl font-semibold">
            Sources officielles
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1">
            {attack.references.map((ref) => (
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

      {attack.aliases && attack.aliases.length > 0 && (
        <p className="mt-10 text-sm text-muted-foreground">
          Aussi appelée : {attack.aliases.join(", ")}.
        </p>
      )}

      {category && (
        <p className="mt-4 text-sm text-muted-foreground">
          Cette fiche fait partie de la famille{" "}
          <Link href={`/attaques/${category.slug}`} className="text-primary hover:underline">
            {category.name}
          </Link>
          . <span className="whitespace-nowrap">Mise à jour : {attack.updatedAt}.</span>
        </p>
      )}
      <p className="mt-2 text-sm text-muted-foreground">
        Publiée sous la responsabilité de{" "}
        <Link href={PUBLISHER_PAGE.fr} className="text-primary hover:underline">
          {PUBLISHER.name}
        </Link>{" "}
        ·{" "}
        <Link href="/methodologie" className="text-primary hover:underline">
          méthodologie
        </Link>
        .
      </p>
    </article>
  );
}

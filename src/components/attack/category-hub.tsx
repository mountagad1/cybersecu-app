import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { ATTACK_VECTOR_LABELS, ATTACK_VECTOR_LABELS_EN } from "@/domain/attack/labels";
import type { AttackVectorCode } from "@/domain/scenario/types";
import { absoluteUrl } from "@/lib/site";
import type { Locale } from "@/domain/i18n/locale";
import { localePrefix } from "@/domain/i18n/locale";
import type { HubContext } from "@/domain/attack/hub-context";

interface HubAttack {
  code: string;
  slug: string;
  name: string;
  primaryVector: AttackVectorCode;
}

interface HubCategory {
  slug: string;
  name: string;
  definition: string;
  whatUnitesThem: string;
}

interface HubLink {
  slug: string;
  name: string;
}

interface HubSimulation {
  slug: string;
  /** Name of the attack it trains. */
  name: string;
  teaser: string;
}

const STRINGS = {
  fr: {
    home: "Accueil",
    attacks: "Attaques",
    inCommon: "Ce que ces attaques ont en commun",
    techniques: "Techniques de cette catégorie",
    mainChannel: "Canal principal :",
    objective: "Ce que cherche l'attaquant :",
    distinguish: "Comment les distinguer",
    distinguishIntro: "Ces attaques de la famille sont souvent confondues. Le critère qui les sépare :",
    levers: "Les ressorts qu'elles exploitent",
    leversIntro: (n: number) => `Nombre d'attaques de la famille, sur ${n}, qui s'appuient sur chaque levier psychologique.`,
    objectives: "Ce qu'elles cherchent à obtenir",
    of: (count: number, total: number) => `${count} sur ${total}`,
    happened: "Si c'est déjà arrivé",
    happenedIntro: "Les gestes dépendent de ce que vous avez fait ou donné.",
    assistant: "L'assistant « J'ai cliqué » : les gestes dans l'ordre, selon votre situation",
    assistantPath: "/outils/j-ai-clique",
    checklist: "La checklist d'urgence, à imprimer",
    checklistPath: "/outils/checklist-urgence",
    otherCategories: "Autres catégories",
    train: "S'entraîner sur ces attaques",
    simulationPrefix: "Simulation : ",
    otherCategoriesBodyPrefix: "Retrouvez l'ensemble des techniques documentées dans ",
    encyclopediaLink: "l'encyclopédie des attaques",
    otherCategoriesBodyMiddle: ", ou entraînez-vous directement avec les ",
    simulationsLink: "simulations disponibles",
    otherCategoriesBodySuffix: ".",
    inLanguage: "fr-FR",
  },
  en: {
    home: "Home",
    attacks: "Attacks",
    inCommon: "What these attacks have in common",
    techniques: "Techniques in this category",
    mainChannel: "Main channel:",
    objective: "What the attacker is after:",
    distinguish: "How to tell them apart",
    distinguishIntro: "These attacks in the family are often confused. The criterion that separates them:",
    levers: "The levers they exploit",
    leversIntro: (n: number) => `Number of attacks in the family, out of ${n}, that rely on each psychological lever.`,
    objectives: "What they are after",
    of: (count: number, total: number) => `${count} of ${total}`,
    happened: "If it already happened",
    happenedIntro: "The steps depend on what you did or gave away.",
    assistant: "The “I clicked” assistant: the steps in order, for your situation",
    assistantPath: "/en/tools/i-clicked",
    checklist: "The emergency checklist, to print",
    checklistPath: "/en/tools/emergency-checklist",
    otherCategories: "Other categories",
    train: "Practise on these attacks",
    simulationPrefix: "Simulation: ",
    otherCategoriesBodyPrefix: "Find every documented technique in the ",
    encyclopediaLink: "attack encyclopedia",
    otherCategoriesBodyMiddle: ", or train directly with the ",
    simulationsLink: "available simulations",
    otherCategoriesBodySuffix: ".",
    inLanguage: "en-US",
  },
} as const;

/**
 * A category hub. Deliberately not "a filtered list with a heading":
 * the brief (§23) only permits a hub that carries genuine independent value,
 * so the page leads with what the category *means* and what unites its
 * techniques before listing anything.
 *
 * Only rendered for categories that pass `isCategoryPublishable()`, so the
 * "no attacks" state is unreachable by design rather than handled here.
 */
export function CategoryHub({
  category,
  attacks,
  otherCategories,
  simulations,
  context,
  locale = "fr",
}: {
  category: HubCategory;
  attacks: readonly HubAttack[];
  /** Every other routed family, in the same locale — hubs link to each other. */
  otherCategories: readonly HubLink[];
  /** Simulations attached to this family's fiches, in the same locale. */
  simulations: readonly HubSimulation[];
  /** Aggregates drawn from the family's fiches (`@/domain/attack/hub-context`). */
  context: HubContext;
  locale?: Locale;
}) {
  const t = STRINGS[locale];
  const vectorLabels = locale === "en" ? ATTACK_VECTOR_LABELS_EN : ATTACK_VECTOR_LABELS;
  const prefix = localePrefix(locale);
  const pageUrl = absoluteUrl(`${prefix}/attaques/${category.slug}`);
  const cardByCode = new Map(context.cards.map((c) => [c.code, c]));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    name: category.name,
    description: category.definition,
    url: pageUrl,
    inLanguage: t.inLanguage,
    ...SITE_REFERENCES,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: attacks.map((attack, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: attack.name,
        url: absoluteUrl(`${prefix}/attaques/${attack.slug}`),
      })),
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <PageTracker pageType="category" locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        trail={[
          { name: t.home, href: `${prefix}/` },
          { name: t.attacks, href: `${prefix}/attaques` },
          { name: category.name, href: `${prefix}/attaques/${category.slug}` },
        ]}
        locale={locale}
      />

      <h1 className="text-3xl font-bold tracking-tight text-balance">{category.name}</h1>

      {/* Opening answer first, then depth — the title→H1→intro coherence the
          brief asks for, so the first paragraph already answers "what is this?" */}
      <p className="mt-6 text-lg text-muted-foreground">{category.definition}</p>

      <section aria-labelledby="point-commun" className="mt-8">
        <h2 id="point-commun" className="text-xl font-semibold">
          {t.inCommon}
        </h2>
        <p className="mt-2 text-muted-foreground">{category.whatUnitesThem}</p>
      </section>

      <section aria-labelledby="techniques" className="mt-10">
        <h2 id="techniques" className="text-xl font-semibold">
          {t.techniques}
        </h2>
        <ul className="mt-4 space-y-3">
          {attacks.map((attack) => (
            <li key={attack.code}>
              <Link
                href={`${prefix}/attaques/${attack.slug}`}
                className="block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
              >
                <span className="font-semibold text-foreground">{attack.name}</span>
                {cardByCode.get(attack.code) && (
                  <span className="mt-1 block text-sm text-foreground/80">
                    {cardByCode.get(attack.code)!.plainLanguageDefinition}
                  </span>
                )}
                <span className="mt-2 block text-xs text-muted-foreground">
                  {cardByCode.get(attack.code) && (
                    <>
                      {t.objective} {cardByCode.get(attack.code)!.objective.toLowerCase()} ·{" "}
                    </>
                  )}
                  {t.mainChannel} {vectorLabels[attack.primaryVector] ?? attack.primaryVector}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {context.boundaries.length > 0 && (
        <section aria-labelledby="distinguer" className="mt-10">
          <h2 id="distinguer" className="text-xl font-semibold">
            {t.distinguish}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t.distinguishIntro}</p>
          <ul className="mt-4 space-y-4">
            {context.boundaries.map((b) => (
              <li key={`${b.a.slug}-${b.b.slug}`} className="rounded-lg border border-border p-4">
                <p className="font-semibold">{b.difference}</p>
                <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                  {[b.a, b.b].map((side) => (
                    <div key={side.slug}>
                      <dt>
                        <Link href={`${prefix}/attaques/${side.slug}`} className="font-medium text-primary hover:underline">
                          {side.name}
                        </Link>
                      </dt>
                      <dd className="mt-0.5 text-muted-foreground">{side.side}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {context.levers.length > 0 && (
          <section aria-labelledby="leviers">
            <h2 id="leviers" className="text-xl font-semibold">
              {t.levers}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.leversIntro(context.total)}</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {context.levers.map((lever) => (
                <li key={lever.label} className="flex items-baseline justify-between gap-3">
                  {lever.href ? (
                    <Link href={lever.href} className="text-primary hover:underline">
                      {lever.label}
                    </Link>
                  ) : (
                    <span>{lever.label}</span>
                  )}
                  <span className="shrink-0 text-muted-foreground">{t.of(lever.count, context.total)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section aria-labelledby="objectifs">
          <h2 id="objectifs" className="text-xl font-semibold">
            {t.objectives}
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {context.objectives.map((o) => (
              <li key={o.label} className="flex items-baseline justify-between gap-3">
                <span>{o.label}</span>
                <span className="shrink-0 text-muted-foreground">{t.of(o.count, context.total)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="deja-arrive" className="mt-10">
        <h2 id="deja-arrive" className="text-xl font-semibold">
          {t.happened}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.happenedIntro}</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href={t.assistantPath} className="text-primary hover:underline">
              {t.assistant}
            </Link>
          </li>
          {context.guides.map((g) => (
            <li key={g.href}>
              <Link href={g.href} className="text-primary hover:underline">
                {g.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href={t.checklistPath} className="text-primary hover:underline">
              {t.checklist}
            </Link>
          </li>
        </ul>
      </section>

      {simulations.length > 0 && (
        <section aria-labelledby="entrainement" className="mt-10">
          <h2 id="entrainement" className="text-xl font-semibold">
            {t.train}
          </h2>
          <ul className="mt-4 space-y-2">
            {simulations.map((sim) => (
              <li key={sim.slug}>
                <Link
                  href={`${prefix}/simulations/${sim.slug}`}
                  className="block rounded-md border border-border px-4 py-3 transition-colors hover:border-primary"
                >
                  {/* Prefixed so the anchor never repeats the fiche's own anchor
                      text for a different URL. */}
                  <span className="font-medium">
                    {t.simulationPrefix}
                    {sim.name}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{sim.teaser}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="autres" className="mt-10">
        <h2 id="autres" className="text-xl font-semibold">
          {t.otherCategories}
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {otherCategories.map((other) => (
            <li key={other.slug}>
              <Link
                href={`${prefix}/attaques/${other.slug}`}
                className="inline-block rounded-full border border-border px-3 py-1 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {other.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-muted-foreground">
          {t.otherCategoriesBodyPrefix}
          <Link href={`${prefix}/attaques`} className="text-primary underline">
            {t.encyclopediaLink}
          </Link>
          {t.otherCategoriesBodyMiddle}
          <Link href={`${prefix}/simulations`} className="text-primary underline">
            {t.simulationsLink}
          </Link>
          {t.otherCategoriesBodySuffix}
        </p>
      </section>
    </div>
  );
}

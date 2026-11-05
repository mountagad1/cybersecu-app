import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { RelatedTools } from "@/components/tools/related-tools";
import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import {
  IncidentAssistant,
  type AssistantAttack,
  type AssistantSituation,
  type IncidentChannel,
} from "@/components/tools/incident-assistant";
import {
  attacksForTool,
  englishToolSlug,
  findTool,
  guidesForTool,
} from "@/content/tools";
import { findAttackByCode } from "@/content/attacks";
import { INCIDENT_ALWAYS, INCIDENT_SITUATIONS } from "@/content/incident";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { languageAlternates } from "@/lib/hreflang";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const tool = findTool("j-ai-clique");
const PATH = `/outils/${tool.slug}`;
const englishSlug = englishToolSlug(tool.slug);
const NAME = "Assistant « J'ai cliqué »";

export const metadata: Metadata = {
  title: pageTitle("Assistant « J'ai cliqué » : que faire après un lien frauduleux ?"),
  description: tool.description,
  alternates: {
    canonical: PATH,
    languages: languageAlternates({
      fr: PATH,
      en: englishSlug && `/en/tools/${englishSlug}`,
    }),
  },
  openGraph: openGraph("fr", {
    title: NAME,
    description:
      "Ce que vous avez fait, par où c'est arrivé : le plan des gestes à faire, dans l'ordre.",
    type: "website",
    url: absoluteUrl(PATH),
  }),
};

/** The fiche shown under « pour reconnaître la prochaine fois », by channel. */
const ATTACK_BY_CHANNEL: Partial<Record<IncidentChannel, string>> = {
  sms: "SMS-000001",
  email: "PHISH-000001",
  call: "SOCIAL-000006",
  web: "WEB-000003",
  qr: "QR-000001",
};

/**
 * Real questions, answered with what the fiches and the checklist already
 * publish (phishing FAQ, « Dans tous les cas, ensuite »).
 */
const FAQ: { question: string; answer: string }[] = [
  {
    question: "J'ai cliqué sur le lien mais rien saisi, que faire ?",
    answer:
      "Le risque principal reste limité si aucune information n'a été saisie et aucun fichier téléchargé. Par précaution, vérifiez l'activité récente du compte concerné et changez son mot de passe, depuis le vrai service ouvert par vous-même.",
  },
  {
    question: "Est-ce dangereux d'avoir simplement ouvert l'email ?",
    answer:
      "Ouvrir un email est rarement suffisant pour compromettre un appareil. Le risque vient de ce que l'on fait ensuite : cliquer sur le lien, saisir des informations, ou ouvrir une pièce jointe.",
  },
  {
    question: "J'ai donné ma carte ou un code : par quoi commencer ?",
    answer:
      "Par votre banque, tout de suite, au numéro au dos de votre carte : faites opposition, même si rien n'a encore été débité, et ne validez plus aucune notification. C'est la seule démarche où chaque minute compte.",
  },
  {
    question: "Faut-il porter plainte ?",
    answer:
      "La checklist d'urgence le recommande : la plainte sert aussi de base aux démarches auprès de votre banque. Conservez d'abord les traces — messages, numéros, adresses, captures d'écran, références de paiement — et signalez les faits sur cybermalveillance.gouv.fr.",
  },
  {
    question:
      "Quelqu'un me propose de récupérer mon argent contre paiement : est-ce fiable ?",
    answer:
      "Non. Ne payez rien à quelqu'un qui propose ensuite de vous aider à récupérer votre argent : ces sollicitations viennent généralement des mêmes acteurs, sous une autre identité.",
  },
];

export default function IClickedPage() {
  const situations: AssistantSituation[] = INCIDENT_SITUATIONS.map((s) => ({
    code: s.code,
    choice: s.fr.choice,
    title: s.fr.title,
    note: s.fr.note,
    actions: s.fr.actions,
    guideHref: s.guideSlug ? `/guides/${s.guideSlug}` : undefined,
    tool: s.tool ? { href: `/outils/${s.tool.slug}`, label: s.tool.label.fr } : undefined,
  }));

  const attacksByChannel: Partial<Record<IncidentChannel, AssistantAttack>> =
    {};
  for (const [channel, code] of Object.entries(ATTACK_BY_CHANNEL) as [
    IncidentChannel,
    string,
  ][]) {
    const attack = findAttackByCode(code);
    if (!attack) continue;
    attacksByChannel[channel] = {
      name: attack.name,
      href: `/attaques/${attack.slug}`,
      simulationHref: attack.simulationSlug
        ? `/simulations/${attack.simulationSlug}`
        : undefined,
    };
  }

  const relatedAttacks = attacksForTool(tool);
  const guides = guidesForTool(tool);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: NAME,
      url: absoluteUrl(PATH),
      description: tool.description,
      applicationCategory: "SecurityApplication",
      operatingSystem: "Tous (navigateur web)",
      isAccessibleForFree: true,
      inLanguage: "fr-FR",
      ...SITE_REFERENCES,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 print:py-0">
      <PageTracker pageType="tool" locale="fr" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="print:hidden">
        <Breadcrumbs
          trail={[
            { name: "Accueil", href: "/" },
            { name: "Outils", href: "/outils" },
            { name: NAME, href: PATH },
          ]}
        />
      </div>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary print:hidden">
        {NAME}
      </p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
        J&apos;ai cliqué sur un lien frauduleux : que faire ?
      </h1>

      <section
        aria-labelledby="en-bref"
        className="mt-6 rounded-lg border border-border bg-muted p-5 print:hidden"
      >
        <h2 id="en-bref" className="text-lg font-semibold">
          En bref
        </h2>
        <p className="mt-2">
          Tout dépend de ce que vous avez fait après le clic. Si vous avez
          seulement cliqué, sans rien saisir ni télécharger, le risque principal
          reste limité : par précaution, vérifiez l&apos;activité du compte
          concerné et changez son mot de passe. Si vous avez donné votre carte,
          un code ou de l&apos;argent, appelez d&apos;abord votre banque, au
          numéro au dos de votre carte. Répondez aux deux questions ci-dessous
          pour obtenir les gestes qui vous concernent, dans l&apos;ordre.
        </p>
      </section>

      <div className="mt-8">
        <IncidentAssistant
          situations={situations}
          always={INCIDENT_ALWAYS.fr}
          attacksByChannel={attacksByChannel}
        />
      </div>

      <section aria-labelledby="ordre" className="mt-14 print:hidden">
        <h2 id="ordre" className="text-2xl font-semibold">
          Pourquoi l&apos;ordre compte
        </h2>
        <p className="mt-3 text-muted-foreground">
          Après une arnaque, toutes les démarches n&apos;ont pas la même
          urgence. Celles qui touchent à votre argent viennent d&apos;abord :
          appeler votre banque est la seule démarche où chaque minute compte.
          Viennent ensuite les gestes qui empêchent la suite — couper un
          appareil d&apos;internet, changer un mot de passe là où il servait
          aussi —, puis la récupération des comptes, et enfin la plainte et le
          signalement, qui demandent de garder les traces : ne supprimez rien.
        </p>
        <p className="mt-3 text-muted-foreground">
          L&apos;assistant reprend les consignes de la{" "}
          <Link
            href="/outils/checklist-urgence"
            className="text-primary hover:underline"
          >
            checklist d&apos;urgence
          </Link>{" "}
          et des fiches de l&apos;encyclopédie, et les remet dans cet ordre
          selon ce que vous avez coché. Plusieurs situations peuvent
          s&apos;appliquer en même temps : un faux site peut avoir obtenu à la
          fois un mot de passe et une carte.
        </p>
      </section>

      <section aria-labelledby="situations" className="mt-12 print:hidden">
        <h2 id="situations" className="text-2xl font-semibold">
          Les situations que l&apos;assistant couvre
        </h2>
        <ul className="mt-4 space-y-2">
          {INCIDENT_SITUATIONS.map((s) => (
            <li
              key={s.code}
              className="rounded-md border border-border px-4 py-3 text-sm"
            >
              {s.inChecklist ? (
                <Link
                  href={`/outils/checklist-urgence#${s.fr.id}`}
                  className="font-medium hover:text-primary"
                >
                  {s.fr.title}
                </Link>
              ) : (
                <span className="font-medium">{s.fr.title}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq" className="mt-12 print:hidden">
        <h2 id="faq" className="text-2xl font-semibold">
          Questions fréquentes
        </h2>
        <div className="mt-4 space-y-3">
          {FAQ.map((f) => (
            <details
              key={f.question}
              className="rounded-lg border border-border p-4"
            >
              <summary className="cursor-pointer font-semibold">
                {f.question}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="guides" className="mt-12 print:hidden">
        <h2 id="guides" className="text-2xl font-semibold">
          Pour aller plus loin
        </h2>
        <ul className="mt-3 space-y-2">
          <li>
            <Link
              href="/outils/analyseur-de-message"
              className="text-primary hover:underline"
            >
              Analyseur de message suspect : ce SMS ou cet email est-il une
              arnaque ?
            </Link>
          </li>
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="text-primary hover:underline"
              >
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="attaques" className="mt-12 print:hidden">
        <h2 id="attaques" className="text-2xl font-semibold">
          Les arnaques qui commencent par un clic ou un appel
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {relatedAttacks.map((attack) => (
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
        Ces consignes reprennent celles des fiches de l&apos;encyclopédie. Elles
        ne remplacent pas les indications de votre banque ou des services
        officiels, qui priment. Source : cybermalveillance.gouv.fr.
      </p>
      <RelatedTools toolSlug="j-ai-clique" locale="fr" />
    </article>
  );
}

import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { RelatedTools } from "@/components/tools/related-tools";
import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import {
  MessageAnalyzer,
  type AnalyzerAttack,
  type AnalyzerExample,
} from "@/components/tools/message-analyzer";
import { attacksForTool, englishToolSlug, findTool, guidesForTool } from "@/content/tools";
import { languageAlternates } from "@/lib/hreflang";
import { findAttackByCode } from "@/content/attacks";
import { findSimulationBySlug } from "@/content/simulations";
import { listLevers } from "@/content/levers";
import { listSignals } from "@/domain/message/signals";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const tool = findTool("analyseur-de-message");
const PATH = `/outils/${tool.slug}`;
const englishSlug = englishToolSlug(tool.slug);

export const metadata: Metadata = {
  title: pageTitle("Analyseur de message suspect : ce SMS ou cet email est-il une arnaque ?"),
  description: tool.description,
  alternates: {
    canonical: PATH,
    languages: languageAlternates({ fr: PATH, en: englishSlug && `/en/tools/${englishSlug}` }),
  },
  openGraph: openGraph("fr", {
    title: "Analyseur de message suspect",
    description:
      "Collez un SMS ou un email suspect : l'outil montre les procédés d'arnaque qu'il contient. Rien n'est envoyé.",
    type: "website",
    url: absoluteUrl(PATH),
  }),
};

/**
 * Fictional messages the site already uses to teach these scams
 * (docs/decisions/0002): no real organisation, `.test` domains only.
 */
const EXAMPLES: {
  slug: string;
  label: string;
  channel: AnalyzerExample["channel"];
}[] = [
  { slug: "sms-colis", label: "Un colis bloqué (SMS)", channel: "sms" },
  {
    slug: "sms-amende-stationnement-impayee",
    label: "Une amende impayée (SMS)",
    channel: "sms",
  },
  {
    slug: "message-proche-nouveau-numero",
    label: "Un proche au nouveau numéro",
    channel: "messaging",
  },
  { slug: "email-banque", label: "Votre banque (email)", channel: "email" },
  {
    slug: "email-virement-urgent-direction",
    label: "Un virement urgent de la direction",
    channel: "email",
  },
];

const FAQ: { question: string; answer: string }[] = [
  {
    question: "L'outil peut-il me dire qu'un message est sûr ?",
    answer:
      "Non, et il ne le dira jamais. Il repère des procédés que les arnaques utilisent ; un message qui n'en contient aucun peut quand même être frauduleux, surtout s'il est bien rédigé. La seule vérification fiable reste de contacter l'organisme vous-même, par un numéro ou un site que vous connaissez déjà.",
  },
  {
    question: "Le message que je colle est-il envoyé ou enregistré ?",
    answer:
      "Non. L'analyse se fait entièrement dans votre navigateur : le texte n'est envoyé à aucun serveur ni à aucune intelligence artificielle, il n'est pas enregistré, et les liens qu'il contient ne sont jamais ouverts. Quand vous partagez un résultat, le lien ne contient que la liste des procédés repérés.",
  },
  {
    question: "Que faire d'un SMS frauduleux ?",
    answer:
      "Ne cliquez pas et ne répondez pas. En France, vous pouvez le transférer gratuitement au 33700, le numéro de signalement des SMS indésirables, puis le supprimer. Si le message parle de votre banque ou d'un compte, vérifiez en ouvrant vous-même l'application officielle.",
  },
  {
    question: "J'ai déjà cliqué sur le lien ou répondu : que faire ?",
    answer:
      "Tout dépend de ce que vous avez donné. Si vous avez saisi un mot de passe, changez-le depuis le site officiel ; si vous avez donné des coordonnées bancaires ou validé un paiement, appelez votre banque pour faire opposition. La checklist d'urgence donne les premiers gestes, dans l'ordre.",
  },
  {
    question:
      "Pourquoi l'outil ne trouve rien alors que je suis sûr que c'est une arnaque ?",
    answer:
      "Parce qu'il cherche des procédés précis — un délai, une demande de code, un lien, des frais — et qu'une arnaque peut s'en passer, notamment au début d'une conversation. Fiez-vous à votre doute : ne donnez rien et vérifiez par un autre canal.",
  },
];

export default function MessageAnalyzerPage() {
  const relatedAttacks = attacksForTool(tool);
  const guides = guidesForTool(tool);

  const attacks: Record<string, AnalyzerAttack> = {};
  for (const attack of relatedAttacks) {
    attacks[attack.code] = {
      name: attack.name,
      slug: attack.slug,
      simulationSlug: attack.simulationSlug,
    };
  }

  const levers = Object.fromEntries(
    listLevers().map((l) => [l.code, { name: l.name, slug: l.slug }]),
  );

  const examples: AnalyzerExample[] = EXAMPLES.flatMap((e) => {
    const sim = findSimulationBySlug(e.slug);
    return sim
      ? [
          {
            slug: e.slug,
            label: e.label,
            channel: e.channel,
            text: sim.content.body,
          },
        ]
      : [];
  });

  const signals = listSignals("fr");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Analyseur de message suspect",
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
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="tool" locale="fr" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        trail={[
          { name: "Accueil", href: "/" },
          { name: "Outils", href: "/outils" },
          { name: "Analyseur de message suspect", href: PATH },
        ]}
      />

      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">
        Analyseur de message suspect
      </p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
        Ce message est-il une arnaque ?
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Collez un SMS, un email ou un message reçu. L&apos;outil montre les
        procédés d&apos;arnaque qu&apos;il contient — un délai, une demande de
        code, de petits frais, un lien —, lit chaque lien comme le navigateur le
        lit, et nomme les attaques qui y ressemblent.{" "}
        <strong className="text-foreground">
          Tout se passe dans votre navigateur : le message n&apos;est envoyé
          nulle part.
        </strong>
      </p>

      <div className="mt-8">
        <MessageAnalyzer
          attacks={attacks}
          levers={levers}
          examples={examples}
        />
      </div>

      <section aria-labelledby="comment" className="mt-14">
        <h2 id="comment" className="text-2xl font-semibold">
          Comment l&apos;outil lit un message
        </h2>
        <p className="mt-3 text-muted-foreground">
          Les arnaques par message se ressemblent moins par leurs mots que par
          leurs procédés : vous presser, vous faire peur ou vous promettre
          quelque chose, puis vous faire agir vous-même — payer, donner un code,
          vous connecter par un lien. L&apos;outil cherche ces procédés un par
          un, avec des règles écrites à partir des fiches du site. Pour chaque
          procédé trouvé, il cite les mots du message qui l&apos;ont déclenché
          et explique pourquoi les fraudeurs l&apos;utilisent. Les liens sont
          lus avec la liste publique des extensions qu&apos;utilisent les
          navigateurs, pour isoler le vrai propriétaire de l&apos;adresse.
        </p>
        <p className="mt-3 text-muted-foreground">
          Il ne rend pas de verdict. Un message honnête peut contenir un délai ;
          une arnaque soignée peut n&apos;en contenir aucun. Le résultat sert à
          savoir quoi vérifier, et comment.
        </p>
      </section>

      <section aria-labelledby="procedes" className="mt-12">
        <h2 id="procedes" className="text-2xl font-semibold">
          Les {signals.length} procédés que l&apos;outil repère
        </h2>
        <dl className="mt-4 space-y-4">
          {signals.map((signal) => (
            <div
              key={signal.code}
              className="rounded-lg border border-border p-4"
            >
              <dt className="font-semibold">{signal.label}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {signal.explanation}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="limites" className="mt-12">
        <h2 id="limites" className="text-2xl font-semibold">
          Ce que l&apos;outil ne fait pas
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            Il ne dit jamais qu&apos;un message est « sûr » : il n&apos;a aucun
            moyen de le savoir.
          </li>
          <li>
            Il n&apos;ouvre pas les liens et ne suit pas les redirections : la
            destination d&apos;un lien raccourci reste inconnue.
          </li>
          <li>
            Il ne connaît pas l&apos;expéditeur réel : un nom ou un numéro
            affiché peut être imité.
          </li>
          <li>
            Il n&apos;utilise aucune intelligence artificielle et ne compare pas
            le message à une base d&apos;arnaques connues.
          </li>
        </ul>
      </section>

      <section aria-labelledby="exemples" className="mt-12">
        <h2 id="exemples" className="text-2xl font-semibold">
          Exemples fictifs
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ces messages sont inventés pour l&apos;entraînement : aucune
          organisation ni adresse réelle. Chacun correspond à une simulation, où
          vous décidez quoi faire avant de voir l&apos;explication.
        </p>
        <ul className="mt-4 space-y-3">
          {examples.map((example) => {
            const sim = findSimulationBySlug(example.slug)!;
            const attack = findAttackByCode(sim.attackCode);
            return (
              <li
                key={example.slug}
                className="rounded-lg border border-border p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Exemple fictif — {example.label}
                </p>
                <p className="mt-2 whitespace-pre-line break-words text-sm">
                  {example.text}
                </p>
                <p className="mt-3 text-sm">
                  {attack && (
                    <>
                      <Link
                        href={`/attaques/${attack.slug}`}
                        className="text-primary hover:underline"
                      >
                        {attack.name}
                      </Link>
                      {" · "}
                    </>
                  )}
                  <Link
                    href={`/simulations/${sim.slug}`}
                    className="text-primary hover:underline"
                  >
                    S&apos;entraîner sur ce message
                  </Link>
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="faq" className="mt-12">
        <h2 id="faq" className="text-2xl font-semibold">
          Questions fréquentes
        </h2>
        <div className="mt-4 space-y-3">
          {FAQ.map((f) => (
            <details
              key={f.question}
              className="group rounded-lg border border-border p-4"
            >
              <summary className="cursor-pointer font-semibold">
                {f.question}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {guides.length > 0 && (
        <section aria-labelledby="guides" className="mt-12">
          <h2 id="guides" className="text-2xl font-semibold">
            Pour aller plus loin
          </h2>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href="/outils/checklist-urgence"
                className="text-primary hover:underline"
              >
                Checklist d&apos;urgence : vous venez de vous faire piéger
              </Link>
            </li>
            <li>
              <Link
                href="/outils/decodeur-de-lien"
                className="text-primary hover:underline"
              >
                Décodeur de lien : à qui appartient vraiment cette adresse ?
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
      )}

      <section aria-labelledby="attaques" className="mt-12">
        <h2 id="attaques" className="text-2xl font-semibold">
          Les arnaques que l&apos;outil reconnaît
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
      <RelatedTools toolSlug="analyseur-de-message" locale="fr" />
    </article>
  );
}

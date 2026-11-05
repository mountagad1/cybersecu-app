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
import { attacksForToolEn, findToolEn, guidesForToolEn } from "@/content/tools";
import { findAttackByCode } from "@/content/attacks";
import { getLocalizedAttack } from "@/content/attacks/localize";
import { findSimulationEnBySlug } from "@/content/simulations-en";
import { listLeversEn } from "@/content/levers";
import { listSignals } from "@/domain/message/signals";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { languageAlternates } from "@/lib/hreflang";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const tool = findToolEn("analyseur-de-message");
const PATH = `/en/tools/${tool.slug}`;

export const metadata: Metadata = {
  title: pageTitle("Suspicious message analyzer: is this text or email a scam?"),
  description: tool.description,
  alternates: {
    canonical: PATH,
    languages: languageAlternates({ fr: `/outils/${tool.frSlug}`, en: PATH }),
  },
  openGraph: openGraph("en", {
    title: "Suspicious message analyzer",
    description:
      "Paste a suspicious text or email: the tool shows the scam techniques it contains. Nothing is sent.",
    type: "website",
    url: absoluteUrl(PATH),
  }),
};

/**
 * Fictional messages the English simulations already use
 * (docs/decisions/0002): no real organization, `.test` domains only.
 */
const EXAMPLES: {
  slug: string;
  label: string;
  channel: AnalyzerExample["channel"];
}[] = [
  {
    slug: "parcel-text-message",
    label: "A parcel on hold (text)",
    channel: "sms",
  },
  {
    slug: "unpaid-parking-fine-text",
    label: "An unpaid fine (text)",
    channel: "sms",
  },
  {
    slug: "relative-new-number-message",
    label: "A relative with a new number",
    channel: "messaging",
  },
  { slug: "bank-email", label: "Your bank (email)", channel: "email" },
  {
    slug: "urgent-transfer-from-management",
    label: "An urgent transfer from management",
    channel: "email",
  },
];

const FAQ: { question: string; answer: string }[] = [
  {
    question: "Can the tool tell me a message is safe?",
    answer:
      "No, and it never will. It spots techniques that scams use; a message with none of them can still be fraudulent, especially if it's well written. The only reliable check is to contact the organization yourself, on a number or website you already know.",
  },
  {
    question: "Is the message I paste sent or stored?",
    answer:
      "No. The analysis happens entirely in your browser: the text isn't sent to any server or any artificial intelligence, it isn't stored, and the links it contains are never opened. When you share a result, the link only contains the list of techniques found.",
  },
  {
    question: "What should I do with a scam text message?",
    answer:
      "Don't click and don't reply. Forward it to your carrier's spam-reporting number (33700 in France, free of charge), then delete it. If the message is about your bank or an account, check by opening the official app yourself.",
  },
  {
    question: "I already clicked the link or replied: what now?",
    answer:
      "It depends on what you gave away. If you entered a password, change it from the official website; if you gave card details or approved a payment, call your bank to block the card. The emergency checklist gives the first steps, in order.",
  },
  {
    question: "Why does the tool find nothing when I'm sure it's a scam?",
    answer:
      "Because it looks for specific techniques — a deadline, a request for a code, a link, fees — and a scam can do without them, especially at the start of a conversation. Trust your doubt: give nothing away and check through another channel.",
  },
];

/** English mirror of `(marketing)/outils/analyseur-de-message/page.tsx`. */
export default function EnglishMessageAnalyzerPage() {
  const relatedAttacks = attacksForToolEn(tool.frSlug);
  const guides = guidesForToolEn(tool.frSlug);

  const attacks: Record<string, AnalyzerAttack> = {};
  for (const attack of relatedAttacks) {
    attacks[attack.code] = {
      name: attack.name,
      slug: attack.slug,
      simulationSlug: attack.simulationSlug,
    };
  }

  const levers = Object.fromEntries(
    listLeversEn().map((l) => [l.code, { name: l.name, slug: l.slug }]),
  );

  const examples: AnalyzerExample[] = EXAMPLES.flatMap((e) => {
    const sim = findSimulationEnBySlug(e.slug);
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

  const signals = listSignals("en");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Suspicious message analyzer",
      url: absoluteUrl(PATH),
      description: tool.description,
      applicationCategory: "SecurityApplication",
      operatingSystem: "Any (web browser)",
      isAccessibleForFree: true,
      inLanguage: "en-US",
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
      <PageTracker pageType="tool" locale="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        locale="en"
        trail={[
          { name: "Home", href: "/en" },
          { name: "Tools", href: "/en/tools" },
          { name: "Suspicious message analyzer", href: PATH },
        ]}
      />

      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">
        Suspicious message analyzer
      </p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
        Is this message a scam?
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Paste a text message, an email or a message you received. The tool shows
        the scam techniques it contains — a deadline, a request for a code,
        small fees, a link —, reads every link the way the browser reads it, and
        names the attacks it looks like.{" "}
        <strong className="text-foreground">
          Everything happens in your browser: the message is not sent anywhere.
        </strong>
      </p>

      <div className="mt-8">
        <MessageAnalyzer
          attacks={attacks}
          levers={levers}
          examples={examples}
          locale="en"
        />
      </div>

      <section aria-labelledby="how" className="mt-14">
        <h2 id="how" className="text-2xl font-semibold">
          How the tool reads a message
        </h2>
        <p className="mt-3 text-muted-foreground">
          Scam messages resemble each other less in their words than in their
          techniques: rushing you, scaring you or promising you something, then
          getting you to act yourself — pay, give a code, sign in through a
          link. The tool looks for these techniques one by one, with rules
          written from the site&apos;s attack articles and tested on its
          fictional messages. For each technique found, it quotes the words of
          the message that triggered it and explains why fraudsters use it.
          Links are read with the public list of domain suffixes browsers use,
          to isolate the real owner of the address.
        </p>
        <p className="mt-3 text-muted-foreground">
          It doesn&apos;t give a verdict. An honest message can contain a
          deadline; a careful scam can contain none. The result is there to tell
          you what to check, and how.
        </p>
      </section>

      <section aria-labelledby="techniques" className="mt-12">
        <h2 id="techniques" className="text-2xl font-semibold">
          The {signals.length} techniques the tool recognizes
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

      <section aria-labelledby="limits" className="mt-12">
        <h2 id="limits" className="text-2xl font-semibold">
          What the tool doesn&apos;t do
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
          <li>It never says a message is “safe”: it has no way of knowing.</li>
          <li>
            It doesn&apos;t open links or follow redirects: the destination of a
            shortened link stays unknown.
          </li>
          <li>
            It doesn&apos;t know the real sender: a displayed name or number can
            be imitated.
          </li>
          <li>
            It uses no artificial intelligence and doesn&apos;t compare the
            message with a database of known scams.
          </li>
        </ul>
      </section>

      <section aria-labelledby="examples" className="mt-12">
        <h2 id="examples" className="text-2xl font-semibold">
          Fictional examples
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These messages are made up for training: no real organization or
          address. Each one matches a simulation, where you decide what to do
          before seeing the explanation.
        </p>
        <ul className="mt-4 space-y-3">
          {examples.map((example) => {
            const sim = findSimulationEnBySlug(example.slug)!;
            const attack = findAttackByCode(sim.attackCode);
            const localized = attack ? getLocalizedAttack(attack, "en") : null;
            return (
              <li
                key={example.slug}
                className="rounded-lg border border-border p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Fictional example — {example.label}
                </p>
                <p className="mt-2 whitespace-pre-line break-words text-sm">
                  {example.text}
                </p>
                <p className="mt-3 text-sm">
                  {localized && (
                    <>
                      <Link
                        href={`/en/attaques/${localized.slug}`}
                        className="text-primary hover:underline"
                      >
                        {localized.name}
                      </Link>
                      {" · "}
                    </>
                  )}
                  <Link
                    href={`/en/simulations/${sim.slug}`}
                    className="text-primary hover:underline"
                  >
                    Practise on this message
                  </Link>
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="faq" className="mt-12">
        <h2 id="faq" className="text-2xl font-semibold">
          Frequently asked questions
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

      <section aria-labelledby="further" className="mt-12">
        <h2 id="further" className="text-2xl font-semibold">
          Going further
        </h2>
        <ul className="mt-3 space-y-2">
          <li>
            <Link
              href="/en/tools/emergency-checklist"
              className="text-primary hover:underline"
            >
              Emergency checklist: you&apos;ve just been scammed
            </Link>
          </li>
          <li>
            <Link
              href="/en/tools/link-decoder"
              className="text-primary hover:underline"
            >
              Link decoder: who really owns this address?
            </Link>
          </li>
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/en/guides/${guide.slug}`}
                className="text-primary hover:underline"
              >
                {guide.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="attacks" className="mt-12">
        <h2 id="attacks" className="text-2xl font-semibold">
          The scams the tool recognizes
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {relatedAttacks.map((attack) => (
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
      <RelatedTools toolSlug="analyseur-de-message" locale="en" />
    </article>
  );
}

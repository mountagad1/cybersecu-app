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
import { attacksForToolEn, findToolEn, guidesForToolEn } from "@/content/tools";
import { englishGuideSlug } from "@/content/guides";
import { findAttackByCode } from "@/content/attacks";
import { getLocalizedAttack } from "@/content/attacks/localize";
import { INCIDENT_ALWAYS, INCIDENT_SITUATIONS } from "@/content/incident";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { languageAlternates } from "@/lib/hreflang";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const tool = findToolEn("j-ai-clique");
const PATH = `/en/tools/${tool.slug}`;
const NAME = "“I clicked” assistant";

export const metadata: Metadata = {
  title: pageTitle("“I clicked” assistant: what to do after a scam link?"),
  description: tool.description,
  alternates: {
    canonical: PATH,
    languages: languageAlternates({ fr: `/outils/${tool.frSlug}`, en: PATH }),
  },
  openGraph: openGraph("en", {
    title: NAME,
    description:
      "What you did, how it reached you: the plan of steps to take, in order.",
    type: "website",
    url: absoluteUrl(PATH),
  }),
};

/** The fiche shown under « to recognize it next time », by channel. */
const ATTACK_BY_CHANNEL: Partial<Record<IncidentChannel, string>> = {
  sms: "SMS-000001",
  email: "PHISH-000001",
  call: "SOCIAL-000006",
  web: "WEB-000003",
  qr: "QR-000001",
};

/** The English guide page for a French guide slug; a missing one fails the build. */
function guideHref(frSlug: string): string {
  const slug = englishGuideSlug(frSlug);
  if (!slug) throw new Error(`guide sans traduction anglaise : ${frSlug}`);
  return `/en/guides/${slug}`;
}

/** Real questions, answered with what the English fiches and checklist already publish. */
const FAQ: { question: string; answer: string }[] = [
  {
    question: "I clicked the link but didn't type anything — what should I do?",
    answer:
      "The main risk stays limited if no information was entered and no file was downloaded. As a precaution, check the account's recent activity and change its password, from the real service opened by yourself.",
  },
  {
    question: "Is it dangerous to have simply opened the email?",
    answer:
      "Opening an email is rarely enough to compromise a device on its own. The risk comes from what happens next: clicking the link, entering information, or opening an attachment.",
  },
  {
    question: "I gave my card or a code: where do I start?",
    answer:
      "With your bank, straight away, on the number on the back of your card: block your card, even if nothing has been charged yet, and don't approve any further notification. It's the only step where every minute counts.",
  },
  {
    question: "Should I file a police report?",
    answer:
      "The emergency checklist recommends it: the report is also the basis for your dealings with your bank. Keep the evidence first — messages, numbers, addresses, screenshots, payment references — and report what happened to Cybermalveillance.gouv.fr (in France).",
  },
  {
    question:
      "Someone offers to get my money back for a fee: can I trust them?",
    answer:
      "No. Don't pay anything to someone who then offers to help you get your money back: such offers usually come from the same people, under another identity.",
  },
];

/** English mirror of `(marketing)/outils/j-ai-clique/page.tsx`. */
export default function EnglishIClickedPage() {
  const situations: AssistantSituation[] = INCIDENT_SITUATIONS.map((s) => ({
    code: s.code,
    choice: s.en.choice,
    title: s.en.title,
    note: s.en.note,
    actions: s.en.actions,
    guideHref: s.guideSlug ? guideHref(s.guideSlug) : undefined,
    tool: s.tool ? { href: `/en/tools/${findToolEn(s.tool.slug).slug}`, label: s.tool.label.en } : undefined,
  }));

  const attacksByChannel: Partial<Record<IncidentChannel, AssistantAttack>> =
    {};
  for (const [channel, code] of Object.entries(ATTACK_BY_CHANNEL) as [
    IncidentChannel,
    string,
  ][]) {
    const attack = findAttackByCode(code);
    const localized = attack ? getLocalizedAttack(attack, "en") : null;
    if (!localized) continue;
    attacksByChannel[channel] = {
      name: localized.name,
      href: `/en/attaques/${localized.slug}`,
      simulationHref: localized.simulationSlug
        ? `/en/simulations/${localized.simulationSlug}`
        : undefined,
    };
  }

  const relatedAttacks = attacksForToolEn(tool.frSlug);
  const guides = guidesForToolEn(tool.frSlug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: NAME,
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
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 print:py-0">
      <PageTracker pageType="tool" locale="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="print:hidden">
        <Breadcrumbs
          locale="en"
          trail={[
            { name: "Home", href: "/en" },
            { name: "Tools", href: "/en/tools" },
            { name: NAME, href: PATH },
          ]}
        />
      </div>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary print:hidden">
        {NAME}
      </p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
        I clicked a scam link: what should I do?
      </h1>

      <section
        aria-labelledby="in-short"
        className="mt-6 rounded-lg border border-border bg-muted p-5 print:hidden"
      >
        <h2 id="in-short" className="text-lg font-semibold">
          In short
        </h2>
        <p className="mt-2">
          It all depends on what you did after the click. If you only clicked,
          without entering or downloading anything, the main risk stays limited:
          as a precaution, check the account&apos;s activity and change its
          password. If you gave your card, a code or money, call your bank
          first, on the number on the back of your card. Answer the two
          questions below to get the steps that apply to you, in order.
        </p>
      </section>

      <div className="mt-8">
        <IncidentAssistant
          situations={situations}
          always={INCIDENT_ALWAYS.en}
          attacksByChannel={attacksByChannel}
          locale="en"
        />
      </div>

      <section aria-labelledby="order" className="mt-14 print:hidden">
        <h2 id="order" className="text-2xl font-semibold">
          Why the order matters
        </h2>
        <p className="mt-3 text-muted-foreground">
          After a scam, not every step has the same urgency. Those involving
          your money come first: calling your bank is the only step where every
          minute counts. Next come the steps that stop what follows —
          disconnecting a device from the internet, changing a password wherever
          else it was used —, then recovering accounts, and finally the police
          report and the report to the authorities, which require keeping the
          evidence: don&apos;t delete anything.
        </p>
        <p className="mt-3 text-muted-foreground">
          The assistant uses the instructions of the{" "}
          <Link
            href="/en/tools/emergency-checklist"
            className="text-primary hover:underline"
          >
            emergency checklist
          </Link>{" "}
          and of the encyclopedia&apos;s articles, and puts them in this order
          based on what you ticked. Several situations can apply at once: a fake
          site may have obtained both a password and a card.
        </p>
      </section>

      <section aria-labelledby="situations" className="mt-12 print:hidden">
        <h2 id="situations" className="text-2xl font-semibold">
          The situations the assistant covers
        </h2>
        <ul className="mt-4 space-y-2">
          {INCIDENT_SITUATIONS.map((s) => (
            <li
              key={s.code}
              className="rounded-md border border-border px-4 py-3 text-sm"
            >
              {s.inChecklist ? (
                <Link
                  href={`/en/tools/emergency-checklist#${s.en.id}`}
                  className="font-medium hover:text-primary"
                >
                  {s.en.title}
                </Link>
              ) : (
                <span className="font-medium">{s.en.title}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq" className="mt-12 print:hidden">
        <h2 id="faq" className="text-2xl font-semibold">
          Frequently asked questions
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

      <section aria-labelledby="further" className="mt-12 print:hidden">
        <h2 id="further" className="text-2xl font-semibold">
          Going further
        </h2>
        <ul className="mt-3 space-y-2">
          <li>
            <Link
              href="/en/tools/message-analyzer"
              className="text-primary hover:underline"
            >
              Suspicious message analyzer: is this text or email a scam?
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

      <section aria-labelledby="attacks" className="mt-12 print:hidden">
        <h2 id="attacks" className="text-2xl font-semibold">
          Scams that start with a click or a call
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

      <p className="mt-10 text-sm text-muted-foreground">
        These instructions are those of the encyclopedia&apos;s articles. They
        don&apos;t replace the guidance of your bank or of official services,
        which takes precedence. Source: Cybermalveillance.gouv.fr (France).
      </p>
      <RelatedTools toolSlug="j-ai-clique" locale="en" />
    </article>
  );
}

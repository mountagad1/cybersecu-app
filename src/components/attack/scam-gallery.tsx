import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import type { GalleryChannel } from "@/domain/attack/gallery";
import { GALLERY_PATH } from "@/domain/attack/gallery";
import type { Locale } from "@/domain/i18n/locale";
import { absoluteUrl } from "@/lib/site";

interface Strings {
  home: { name: string; href: string };
  crumb: string;
  title: (n: number) => string;
  intro: string;
  fictional: string;
  howToRead: string;
  steps: { title: string; text: string }[];
  byChannel: string;
  examples: (n: number) => string;
  giveaways: string;
  levers: (n: number) => string;
  colon: string;
  simulation: string;
  decision: string;
  protection: string;
  forAttack: (name: string) => string;
  toolsHeading: string;
  tools: { href: string; title: string; text: string }[];
}

const STRINGS: Record<Locale, Strings> = {
  fr: {
    home: { name: "Accueil", href: "/" },
    crumb: "Exemples",
    title: (n) => `Galerie d'arnaques : ${n} exemples fictifs annotés`,
    intro:
      "Les exemples de messages, d'appels et d'écrans rédigés pour chaque fiche de l'encyclopédie, réunis sur une page et classés par canal. Chacun est suivi de ce qui le trahit et du levier psychologique qu'il exploite ; l'explication complète reste sur la fiche.",
    fictional:
      "Exemples fictifs — aucune organisation, aucune personne ni aucune adresse réelle.",
    howToRead: "Comment lire un exemple",
    steps: [
      {
        title: "Le message",
        text: "tel qu'il arrive, et dans quelles circonstances.",
      },
      {
        title: "Ce qui le trahit",
        text: "les indices observables, sans rien ouvrir.",
      },
      {
        title: "Le levier",
        text: "le ressort psychologique qui pousse à agir vite.",
      },
      {
        title: "La simulation",
        text: "le même type de message, pour vous entraîner à décider.",
      },
      {
        title: "Décider",
        text: "les questions à se poser, dans l'ordre, sur la fiche.",
      },
      {
        title: "Se protéger",
        text: "les habitudes qui évitent que ça se reproduise, sur la fiche.",
      },
    ],
    byChannel: "Par canal",
    examples: (n) => (n > 1 ? `${n} exemples` : "1 exemple"),
    giveaways: "Ce qui le trahit",
    levers: (n) => (n > 1 ? "Leviers" : "Levier"),
    colon: "\u00a0:",
    simulation: "S'entraîner",
    decision: "Questions à se poser",
    protection: "Se protéger",
    forAttack: (name) => ` — ${name}`,
    toolsHeading: "Un vrai message sous les yeux ?",
    tools: [
      {
        href: "/outils/analyseur-de-message",
        title: "Analyseur de message suspect",
        text: "Collez le message : les procédés reconnus et les attaques qui lui ressemblent. Rien n'est envoyé.",
      },
      {
        href: "/outils/decodeur-de-lien",
        title: "Décodeur de lien",
        text: "Où mène vraiment une adresse, lue comme le navigateur la lit.",
      },
      {
        href: "/outils/j-ai-clique",
        title: "Assistant « J'ai cliqué »",
        text: "Déjà cliqué, répondu ou payé : les gestes à faire, dans l'ordre.",
      },
    ],
  },
  en: {
    home: { name: "Home", href: "/en" },
    crumb: "Examples",
    title: (n) => `Scam gallery: ${n} annotated fictional examples`,
    intro:
      "The example messages, calls and screens written for each attack in the encyclopedia, gathered on one page and sorted by channel. Each one is followed by what gives it away and the psychological lever it pulls; the full explanation stays on the attack's page.",
    fictional: "Fictional examples — no real organization, person or address.",
    howToRead: "How to read an example",
    steps: [
      {
        title: "The message",
        text: "as it arrives, and in what circumstances.",
      },
      {
        title: "What gives it away",
        text: "the observable clues, without opening anything.",
      },
      {
        title: "The lever",
        text: "the psychological trigger that pushes you to act fast.",
      },
      {
        title: "The simulation",
        text: "the same kind of message, to practice deciding.",
      },
      {
        title: "Deciding",
        text: "the questions to ask, in order, on the attack's page.",
      },
      {
        title: "Protecting yourself",
        text: "the habits that keep it from happening again, on the attack's page.",
      },
    ],
    byChannel: "By channel",
    examples: (n) => (n > 1 ? `${n} examples` : "1 example"),
    giveaways: "What gives it away",
    levers: (n) => (n > 1 ? "Levers" : "Lever"),
    colon: ":",
    simulation: "Practice",
    decision: "Questions to ask",
    protection: "Protect yourself",
    forAttack: (name) => ` — ${name}`,
    toolsHeading: "A real message in front of you?",
    tools: [
      {
        href: "/en/tools/message-analyzer",
        title: "Suspicious message analyzer",
        text: "Paste the message: the techniques it uses and the attacks it resembles. Nothing is sent.",
      },
      {
        href: "/en/tools/link-decoder",
        title: "Link decoder",
        text: "Where an address really leads, read the way the browser reads it.",
      },
      {
        href: "/en/tools/i-clicked",
        title: "“I clicked” assistant",
        text: "Already clicked, replied or paid: the steps to take, in order.",
      },
    ],
  },
};

/**
 * The scam gallery page body (src/domain/attack/gallery.ts), shared by
 * `/exemples` and `/en/examples`.
 */
export function ScamGallery({
  channels,
  locale,
}: {
  channels: GalleryChannel[];
  locale: Locale;
}) {
  const t = STRINGS[locale];
  const total = channels.reduce((sum, c) => sum + c.items.length, 0);
  const path = GALLERY_PATH[locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t.title(total),
    description: t.intro,
    url: absoluteUrl(path),
    inLanguage: locale === "en" ? "en-US" : "fr-FR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: channels
        .flatMap((c) => c.items)
        .map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: absoluteUrl(item.href),
        })),
    },
    ...SITE_REFERENCES,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="gallery" locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        locale={locale}
        trail={[t.home, { name: t.crumb, href: path }]}
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{t.title(total)}</h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        {t.intro}
      </p>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t.fictional}
      </p>

      <section aria-labelledby="how-to-read" className="mt-8">
        <h2 id="how-to-read" className="text-xl font-semibold">
          {t.howToRead}
        </h2>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {t.steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-3 rounded-md border border-border p-3 text-sm"
            >
              <span
                aria-hidden
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
              >
                {index + 1}
              </span>
              <span>
                <span className="font-semibold">
                  {step.title}
                  {t.colon}
                </span>{" "}
                <span className="text-muted-foreground">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <nav aria-labelledby="by-channel" className="mt-8">
        <h2 id="by-channel" className="text-xl font-semibold">
          {t.byChannel}
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {channels.map((c) => (
            <li key={c.channel}>
              <a
                href={`#${c.anchor}`}
                className="inline-block rounded-full border border-border px-3 py-1 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {c.label}{" "}
                <span className="text-muted-foreground">
                  ({c.items.length})
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {channels.map((c) => (
        <section
          key={c.channel}
          aria-labelledby={c.anchor}
          className="mt-12 scroll-mt-20"
        >
          <h2 id={c.anchor} className="text-2xl font-semibold">
            {c.label}{" "}
            <span className="text-base font-normal text-muted-foreground">
              — {t.examples(c.items.length)}
            </span>
          </h2>
          <ul className="mt-4 grid gap-4 lg:grid-cols-2">
            {c.items.map((item) => (
              <li
                key={item.code}
                className="flex flex-col rounded-lg border border-dashed border-border p-4"
              >
                <h3 className="font-semibold">
                  <Link
                    href={item.href}
                    className="text-primary hover:underline"
                  >
                    {item.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.setting}
                </p>
                <blockquote className="mt-3 whitespace-pre-line break-words rounded-md bg-muted p-3 text-sm">
                  {item.message}
                </blockquote>
                <h4 className="mt-3 text-sm font-semibold">{t.giveaways}</h4>
                <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {item.giveaways.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                {item.levers.length > 0 && (
                  <p className="mt-3 flex flex-wrap items-center gap-1.5 text-sm">
                    <span className="font-semibold">
                      {t.levers(item.levers.length)}
                      {t.colon}
                    </span>
                    {item.levers.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="rounded-full bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary hover:underline"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </p>
                )}
                <p className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3 text-sm">
                  {item.simulationHref && (
                    <Link
                      href={item.simulationHref}
                      className="font-medium text-primary hover:underline"
                    >
                      {t.simulation}
                      <span className="sr-only">{t.forAttack(item.name)}</span>
                    </Link>
                  )}
                  {item.decisionHref && (
                    <Link
                      href={item.decisionHref}
                      className="text-primary hover:underline"
                    >
                      {t.decision}
                      <span className="sr-only">{t.forAttack(item.name)}</span>
                    </Link>
                  )}
                  {item.protectionHref && (
                    <Link
                      href={item.protectionHref}
                      className="text-primary hover:underline"
                    >
                      {t.protection}
                      <span className="sr-only">{t.forAttack(item.name)}</span>
                    </Link>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section aria-labelledby="tools" className="mt-14">
        <h2 id="tools" className="text-xl font-semibold">
          {t.toolsHeading}
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {t.tools.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="block h-full rounded-md border border-border px-4 py-3 transition-colors hover:border-primary"
              >
                <span className="font-medium">{tool.title}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {tool.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

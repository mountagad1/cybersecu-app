"use client";

import { ShieldQuestion } from "lucide-react";
import { AnimatedNumber } from "@/components/home/animated-number";
import { Reveal } from "@/components/home/reveal";
import type { Locale } from "@/domain/i18n/locale";

const STATS_FR = [
  {
    value: 500000,
    suffix: "+",
    label: "victimes assistées en 2025 en France",
    detail: "+20 % par rapport à 2024",
    source: {
      label: "Cybermalveillance.gouv.fr, rapport d'activité 2025",
      url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/rapport-activite-2025",
    },
  },
  {
    value: 108000,
    suffix: "",
    label: "demandes liées à l'hameçonnage (phishing)",
    detail: "+70 % en un an — 1 sollicitation sur 3",
    source: {
      label: "Cybermalveillance.gouv.fr, l'hameçonnage en 2025",
      url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/hameconnage-phishing-ra26",
    },
  },
  {
    value: 16,
    suffix: " %",
    label: "seulement savent quoi faire en cas de fraude en ligne",
    detail: "Campagne Cybermalveillance / Microsoft / Parquet de Paris, 2025",
    source: {
      label: "Cybermalveillance.gouv.fr — campagne faux support technique",
      url: "https://www.cybermalveillance.gouv.fr/",
    },
  },
] as const;

const STATS_EN = [
  {
    value: 500000,
    suffix: "+",
    label: "victims assisted in 2025 in France",
    detail: "+20% versus 2024",
    source: {
      label: "Cybermalveillance.gouv.fr (French government cybersecurity assistance), 2025 activity report",
      url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/rapport-activite-2025",
    },
  },
  {
    value: 108000,
    suffix: "",
    label: "requests related to phishing",
    detail: "+70% in one year — 1 request in 3",
    source: {
      label: "Cybermalveillance.gouv.fr, phishing in 2025",
      url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/hameconnage-phishing-ra26",
    },
  },
  {
    value: 16,
    suffix: "%",
    label: "only know what to do in case of online fraud",
    detail: "Cybermalveillance / Microsoft / Paris Public Prosecutor's Office campaign, 2025",
    source: {
      label: "Cybermalveillance.gouv.fr — fake tech support campaign",
      url: "https://www.cybermalveillance.gouv.fr/",
    },
  },
] as const;

const STRINGS = {
  fr: {
    heading: "Pourquoi cybersecu.app ?",
    subtitle:
      "La cybercriminalité ne cible pas que les entreprises. Elle repose sur des arnaques répétées, toujours plus crédibles, qui exploitent un moment d'inattention — pas un manque d'intelligence.",
    calloutTitle: "Le doute est le meilleur réflexe",
    calloutBody:
      "Ces arnaques fonctionnent parce qu'elles créent l'urgence pour empêcher de réfléchir. cybersecu.app entraîne le réflexe inverse : marquer une pause et vérifier avant chaque action en ligne sensible — cliquer sur un lien, communiquer un code, effectuer un virement. Ce n'est pas de la méfiance excessive, c'est une habitude qui s'apprend, comme regarder à gauche puis à droite avant de traverser.",
    stats: STATS_FR,
  },
  en: {
    heading: "Why cybersecu.app?",
    subtitle:
      "Cybercrime doesn't only target businesses. It runs on repeated, increasingly credible scams that exploit a moment of inattention — not a lack of intelligence.",
    calloutTitle: "Doubt is the best reflex",
    calloutBody:
      "These scams work because they create urgency to stop you from thinking. cybersecu.app trains the opposite reflex: pause and verify before every sensitive online action — clicking a link, sharing a code, making a transfer. This isn't excessive suspicion, it's a habit you learn, like looking left then right before crossing the street.",
    stats: STATS_EN,
  },
} as const;

export function WhySection({ locale = "fr" }: { locale?: Locale }) {
  const t = STRINGS[locale];
  return (
    <section aria-labelledby="why-heading" className="border-t border-border bg-muted/40 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="text-center">
            <h2 id="why-heading" className="text-3xl font-bold tracking-tight text-balance">
              {t.heading}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-balance">{t.subtitle}</p>
          </div>
        </Reveal>

        {/* md, not sm — see the same note on the card grid in (marketing)/page.tsx. */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {t.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.1}>
              <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6 text-center">
                <p className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">{stat.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
                <a
                  href={stat.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto pt-3 text-xs text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-foreground"
                >
                  {stat.source.label}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-4 rounded-lg border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-start">
            <ShieldQuestion className="size-8 shrink-0 text-primary" aria-hidden />
            <div>
              <h3 className="text-base font-semibold">{t.calloutTitle}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.calloutBody}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

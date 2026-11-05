import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { languageAlternates } from "@/lib/hreflang";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { DifficultyBadge } from "@/components/scenario/difficulty-badge";
import { listSimulationsEn } from "@/content/simulations-en";
import { findAttackByCode } from "@/content/attacks";
import { getLocalizedAttack } from "@/content/attacks/localize";
import { getUiStrings } from "@/domain/i18n/dictionary";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Realistic scam simulations",
  description:
    "Would you spot a fake bank text or a call from the \"fraud department\"? Train on realistic scam messages, with zero risk and no sign-up.",
  alternates: {
    canonical: "/en/simulations",
    languages: languageAlternates({ fr: "/simulations", en: "/en/simulations" }),
  },
  openGraph: openGraph("en", {
    title: "Realistic scam simulations",
    description: "Make a decision, then find out why it was (or wasn't) a trap.",
    type: "website",
    url: absoluteUrl("/en/simulations"),
  }),
};

export default function EnglishSimulationsIndexPage() {
  const simulations = listSimulationsEn();
  const t = getUiStrings("en").simulationsIndex;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Simulations",
    url: absoluteUrl("/en/simulations"),
    inLanguage: "en-US",
    ...SITE_REFERENCES,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: simulations.map((sim, index) => {
        const attack = findAttackByCode(sim.attackCode);
        const localized = attack ? getLocalizedAttack(attack, "en") : null;
        return {
          "@type": "ListItem",
          position: index + 1,
          name: localized?.name ?? sim.impersonatedEntity,
          url: absoluteUrl(`/en/simulations/${sim.slug}`),
        };
      }),
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="index" locale="en" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        trail={[
          { name: "Home", href: "/en" },
          { name: "Simulations", href: "/en/simulations" },
        ]}
        locale="en"
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{t.title}</h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">{t.description}</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {simulations.map((sim) => {
          const attack = findAttackByCode(sim.attackCode);
          const localized = attack ? getLocalizedAttack(attack, "en") : null;
          return (
            <li key={sim.slug}>
              <Link
                href={`/en/simulations/${sim.slug}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold group-hover:text-primary">
                    {localized?.name ?? sim.impersonatedEntity}
                  </span>
                  <DifficultyBadge difficulty={sim.difficulty} locale="en" />
                </div>
                <span className="mt-2 text-sm text-muted-foreground">{sim.teaser}</span>
                <span className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                  {t.channels[sim.channel] ?? sim.channel}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

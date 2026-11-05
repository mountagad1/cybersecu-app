import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { languageAlternates } from "@/lib/hreflang";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { DifficultyBadge } from "@/components/scenario/difficulty-badge";
import { listSimulations } from "@/content/simulations";
import { findAttackByCode } from "@/content/attacks";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const CHANNEL_LABELS: Record<string, string> = {
  sms: "SMS",
  email: "Email",
  phone: "Téléphone",
  web: "Site web",
  qr_code: "QR code",
  social_media: "Réseau social",
  messaging_app: "Messagerie",
  advertisement: "Publicité",
  file_attachment: "Pièce jointe",
};

// Search Console (EXP-019, cycle 5): this page is searched as « simulation /
// simulateur de phishing », at positions 6 to 27. Title, H1 and introduction
// now use those words; « gratuit » is the quota the home page already states.
const TITLE = "Simulateur de phishing et d'arnaques gratuit";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Simulateur de phishing gratuit : faux SMS bancaire, e-mail piégé, appel du « service anti-fraude ». 10 simulations gratuites, sans inscription.",
  alternates: {
    canonical: "/simulations",
    languages: languageAlternates({ fr: "/simulations", en: "/en/simulations" }),
  },
  openGraph: openGraph("fr", {
    title: TITLE,
    description: "Prenez une décision, puis découvrez pourquoi c'était (ou non) un piège.",
    type: "website",
    url: absoluteUrl("/simulations"),
  }),
};

export default function SimulationsIndexPage() {
  const simulations = listSimulations();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Simulateur de phishing et d'arnaques",
    url: absoluteUrl("/simulations"),
    inLanguage: "fr-FR",
    ...SITE_REFERENCES,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: simulations.map((sim, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: findAttackByCode(sim.attackCode)?.name ?? sim.impersonatedEntity,
        url: absoluteUrl(`/simulations/${sim.slug}`),
      })),
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="index" locale="fr" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs trail={[{ name: "Accueil", href: "/" }, { name: "Simulations", href: "/simulations" }]} />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Simulateur de phishing et d&apos;arnaques</h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        Entraînez-vous à repérer le phishing (hameçonnage) par SMS, e-mail ou téléphone : 10
        simulations gratuites, sans inscription ni carte bancaire. Chaque simulation reproduit un message que vous pourriez réellement recevoir. Prenez une
        décision, puis découvrez pourquoi c&apos;était — ou non — un piège. Tous les organismes cités
        sont fictifs et rien ne vous est jamais demandé.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {simulations.map((sim) => {
          const attack = findAttackByCode(sim.attackCode);
          return (
            <li key={sim.slug}>
              <Link
                href={`/simulations/${sim.slug}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-semibold group-hover:text-primary">
                    {attack?.name ?? sim.impersonatedEntity}
                  </span>
                  <DifficultyBadge difficulty={sim.difficulty} />
                </div>
                <span className="mt-2 text-sm text-muted-foreground">{sim.teaser}</span>
                <span className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                  {CHANNEL_LABELS[sim.channel] ?? sim.channel}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { GUIDE_INTENT_LABELS, listGuides } from "@/content/guides";
import { absoluteUrl } from "@/lib/site";
import { languageAlternates } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Guides pratiques",
  description:
    "Vérifier un lien, activer la double authentification, réagir après un paiement frauduleux ou un compte piraté : les gestes concrets, pas à pas.",
  alternates: { canonical: "/guides", languages: languageAlternates({ fr: "/guides", en: "/en/guides" }) },
  openGraph: openGraph("fr", {
    title: "Guides pratiques",
    description: "Les gestes concrets qui déjouent la plupart des arnaques.",
    type: "website",
    url: absoluteUrl("/guides"),
  }),
};

export default function GuidesIndexPage() {
  const guides = listGuides();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="index" locale="fr" />
      <Breadcrumbs trail={[{ name: "Accueil", href: "/" }, { name: "Guides", href: "/guides" }]} />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Guides pratiques</h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        Les fiches d&apos;attaques expliquent <em>ce qui</em> vous arrive. Ces guides expliquent{" "}
        <em>quoi faire</em> — le geste, dans l&apos;ordre, avec ce que les gens ratent le plus
        souvent.
      </p>

      <ul className="mt-10 space-y-4">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-semibold group-hover:text-primary">{guide.title}</span>
                <Badge variant="secondary">{GUIDE_INTENT_LABELS[guide.intent]}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{guide.question}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

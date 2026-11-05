import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { listTools } from "@/content/tools";
import { absoluteUrl } from "@/lib/site";
import { languageAlternates } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Outils gratuits",
  description:
    "Des outils simples et gratuits pour le moment du doute ou juste après une arnaque : analyser un message suspect, lire un lien, savoir quoi faire en premier.",
  alternates: { canonical: "/outils", languages: languageAlternates({ fr: "/outils", en: "/en/tools" }) },
  openGraph: openGraph("fr", {
    title: "Outils gratuits",
    description: "Analyser un message suspect, lire un lien, savoir quoi faire en premier après une arnaque.",
    type: "website",
    url: absoluteUrl("/outils"),
  }),
};

export default function ToolsIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="index" locale="fr" />
      <Breadcrumbs trail={[{ name: "Accueil", href: "/" }, { name: "Outils", href: "/outils" }]} />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Outils gratuits</h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        Pour le moment précis où vous en avez besoin : un message ou un lien qui vous fait hésiter, ou une
        arnaque qui vient d&apos;aboutir. Sans compte, et rien de ce que vous saisissez n&apos;est
        envoyé.
      </p>

      <ul className="mt-10 space-y-4">
        {listTools().map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/outils/${tool.slug}`}
              className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <span className="text-lg font-semibold group-hover:text-primary">{tool.title}</span>
              <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

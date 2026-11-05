import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { attacksUsingLever, listLevers } from "@/content/levers";
import { absoluteUrl } from "@/lib/site";
import { languageAlternates } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: pageTitle("Pourquoi les arnaques fonctionnent : les neuf leviers"),
  description:
    "Urgence, peur, autorité, confiance : les ressorts psychologiques que toutes les arnaques exploitent, et la question à se poser pour y résister.",
  alternates: { canonical: "/leviers", languages: languageAlternates({ fr: "/leviers", en: "/en/levers" }) },
  openGraph: openGraph("fr", {
    title: "Pourquoi les arnaques fonctionnent : les neuf leviers",
    description: "Les ressorts que toutes les arnaques exploitent, et comment y résister.",
    type: "website",
    url: absoluteUrl("/leviers"),
  }),
};

export default function LeversIndexPage() {
  const levers = listLevers();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="index" locale="fr" />
      <Breadcrumbs trail={[{ name: "Accueil", href: "/" }, { name: "Leviers", href: "/leviers" }]} />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Pourquoi ça marche sur nous</h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        Aucune des attaques décrites sur ce site n&apos;exploite une faille informatique chez la
        victime. Elles exploitent des réactions humaines ordinaires — et il n&apos;y en a que
        quelques-unes. Les comprendre vaut mieux que retenir cent fiches : c&apos;est ce qui permet
        de reconnaître une arnaque que personne n&apos;a encore décrite.
      </p>

      <ul className="mt-10 space-y-4">
        {levers.map((lever) => (
          <li key={lever.slug}>
            <Link
              href={`/leviers/${lever.slug}`}
              className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-lg font-semibold group-hover:text-primary">{lever.name}</span>
                <span className="text-sm text-muted-foreground">
                  {attacksUsingLever(lever.code).length} attaques l&apos;utilisent
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{lever.plainLanguageDefinition}</p>
              <p className="mt-3 text-sm italic text-foreground">« {lever.counterQuestion} »</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { RelatedTools } from "@/components/tools/related-tools";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PrintButton } from "@/components/tools/print-button";
import { englishToolSlug, findTool } from "@/content/tools";
import { absoluteUrl } from "@/lib/site";
import { INCIDENT_ALWAYS, checklistSituations } from "@/content/incident";
import { languageAlternates } from "@/lib/hreflang";

export const dynamic = "force-static";

const tool = findTool("checklist-urgence");
const englishSlug = englishToolSlug(tool.slug);

export const metadata: Metadata = {
  title: "Je me suis fait arnaquer : la checklist d'urgence",
  description: tool.description,
  alternates: {
    canonical: `/outils/${tool.slug}`,
    languages: languageAlternates({ fr: `/outils/${tool.slug}`, en: englishSlug && `/en/tools/${englishSlug}` }),
  },
  openGraph: openGraph("fr", {
    title: "Je me suis fait arnaquer : la checklist d'urgence",
    description: tool.description,
    type: "website",
    url: absoluteUrl(`/outils/${tool.slug}`),
  }),
};

/**
 * Every action comes from `@/content/incident`, which restates what the
 * fiches' « Si c'est déjà arrivé » sections already publish, reordered by
 * what the visitor gave away — and which the « J'ai cliqué » assistant
 * reads too.
 */
const SITUATIONS = checklistSituations().map((s) => ({
  id: s.fr.id,
  title: s.fr.title,
  actions: s.fr.actions,
  guide: s.guideSlug ? { href: `/guides/${s.guideSlug}`, label: "Le guide détaillé" } : undefined,
  tool: s.tool ? { href: `/outils/${s.tool.slug}`, label: s.tool.label.fr } : undefined,
}));

const ALWAYS = INCIDENT_ALWAYS.fr;

export default function EmergencyChecklistPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 print:py-0">
      <PageTracker pageType="tool" locale="fr" />
      <div className="print:hidden">
        <Breadcrumbs
          trail={[
            { name: "Accueil", href: "/" },
            { name: "Outils", href: "/outils" },
            { name: "Checklist d'urgence", href: `/outils/${tool.slug}` },
          ]}
        />
      </div>

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Je me suis fait arnaquer : par où commencer</h1>

      <section aria-labelledby="en-bref" className="mt-6 rounded-lg border border-border bg-muted p-5">
        <h2 id="en-bref" className="text-lg font-semibold">
          En bref
        </h2>
        <p className="mt-2 text-base">
          Si de l&apos;argent, une carte ou un code sont en jeu, appelez d&apos;abord votre banque, au
          numéro au dos de votre carte : c&apos;est la seule démarche où chaque minute compte. Pour
          le reste, trouvez ci-dessous la situation qui correspond à ce que vous avez donné, et
          suivez les gestes dans l&apos;ordre. Plusieurs situations peuvent s&apos;appliquer en même
          temps.
        </p>
      </section>

      <nav aria-label="Situations" className="mt-6 print:hidden">
        <ul className="flex flex-wrap gap-2 text-sm">
          {SITUATIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-block rounded-full border border-border px-3 py-1 transition-colors hover:border-primary hover:text-primary"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {SITUATIONS.map((situation) => (
        <section
          key={situation.id}
          id={situation.id}
          aria-labelledby={`${situation.id}-titre`}
          className="mt-8 scroll-mt-6 break-inside-avoid"
        >
          <h2 id={`${situation.id}-titre`} className="text-xl font-semibold">
            {situation.title}
          </h2>
          <ol className="mt-3 list-inside list-decimal space-y-1.5 text-muted-foreground print:text-foreground">
            {situation.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
          {situation.guide && (
            <p className="mt-2 text-sm print:hidden">
              <Link href={situation.guide.href} className="text-primary hover:underline">
                {situation.guide.label} →
              </Link>
            </p>
          )}
          {situation.tool && (
            <p className="mt-2 text-sm print:hidden">
              <Link href={situation.tool.href} className="text-primary hover:underline">
                {situation.tool.label} →
              </Link>
            </p>
          )}
        </section>
      ))}

      <section aria-labelledby="toujours" className="mt-10 break-inside-avoid rounded-lg border border-border p-5">
        <h2 id="toujours" className="text-xl font-semibold">
          Dans tous les cas, ensuite
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted-foreground print:text-foreground">
          {ALWAYS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <PrintButton label="Imprimer cette checklist" tool="checklist-urgence" locale="fr" />
        <p className="text-sm text-muted-foreground print:hidden">
          À garder près de l&apos;ordinateur d&apos;un proche, ou à lui envoyer.
        </p>
      </div>

      <p className="mt-10 text-sm text-muted-foreground print:mt-6">
        Cette checklist reprend les consignes des fiches de{" "}
        <Link href="/attaques" className="text-primary hover:underline print:text-foreground print:no-underline">
          l&apos;encyclopédie des attaques
        </Link>
        . Elle ne remplace pas les indications de votre banque ou des services officiels, qui
        priment. Source : cybermalveillance.gouv.fr.
      </p>
      <RelatedTools toolSlug="checklist-urgence" locale="fr" />
    </article>
  );
}

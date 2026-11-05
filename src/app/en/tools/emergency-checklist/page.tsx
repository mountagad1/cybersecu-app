import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { RelatedTools } from "@/components/tools/related-tools";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PrintButton } from "@/components/tools/print-button";
import { findToolEn } from "@/content/tools";
import { englishGuideSlug } from "@/content/guides";
import { languageAlternates } from "@/lib/hreflang";
import { absoluteUrl } from "@/lib/site";
import { INCIDENT_ALWAYS, checklistSituations } from "@/content/incident";

export const dynamic = "force-static";

const tool = findToolEn("checklist-urgence");
const TITLE = "I've been scammed: the emergency checklist";

export const metadata: Metadata = {
  title: TITLE,
  description: tool.description,
  alternates: {
    canonical: `/en/tools/${tool.slug}`,
    languages: languageAlternates({
      fr: `/outils/${tool.frSlug}`,
      en: `/en/tools/${tool.slug}`,
    }),
  },
  openGraph: openGraph("en", {
    title: TITLE,
    description: tool.description,
    type: "website",
    url: absoluteUrl(`/en/tools/${tool.slug}`),
  }),
};

/** The English guide page for a French guide slug. Throws if it is missing, so a broken link fails the build. */
function guideHref(frSlug: string): string {
  const slug = englishGuideSlug(frSlug);
  if (!slug) throw new Error(`guide sans traduction anglaise : ${frSlug}`);
  return `/en/guides/${slug}`;
}

/**
 * English version of the French checklist, situation for situation, from
 * the same source (`@/content/incident`). The help services stay the
 * French ones, placed in context, as on the English attack pages and
 * guides.
 */
const SITUATIONS = checklistSituations().map((s) => ({
  id: s.en.id,
  title: s.en.title,
  actions: s.en.actions,
  guide: s.guideSlug ? { href: guideHref(s.guideSlug), label: "The detailed guide" } : undefined,
  tool: s.tool ? { href: `/en/tools/${findToolEn(s.tool.slug).slug}`, label: s.tool.label.en } : undefined,
}));

const ALWAYS = INCIDENT_ALWAYS.en;

export default function EnglishEmergencyChecklistPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 print:py-0">
      <PageTracker pageType="tool" locale="en" />
      <div className="print:hidden">
        <Breadcrumbs
          locale="en"
          trail={[
            { name: "Home", href: "/en" },
            { name: "Tools", href: "/en/tools" },
            { name: "Emergency checklist", href: `/en/tools/${tool.slug}` },
          ]}
        />
      </div>

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
        I&apos;ve been scammed: where to start
      </h1>

      <section
        aria-labelledby="in-short"
        className="mt-6 rounded-lg border border-border bg-muted p-5"
      >
        <h2 id="in-short" className="text-lg font-semibold">
          In short
        </h2>
        <p className="mt-2 text-base">
          If money, a card or a code is at stake, call your bank first, on the
          number on the back of your card: it is the only step where every
          minute counts. For the rest, find below the situation that matches
          what you gave away, and follow the steps in order. Several situations
          can apply at the same time.
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
          aria-labelledby={`${situation.id}-title`}
          className="mt-8 scroll-mt-6 break-inside-avoid"
        >
          <h2 id={`${situation.id}-title`} className="text-xl font-semibold">
            {situation.title}
          </h2>
          <ol className="mt-3 list-inside list-decimal space-y-1.5 text-muted-foreground print:text-foreground">
            {situation.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
          {situation.guide && (
            <p className="mt-2 text-sm print:hidden">
              <Link
                href={situation.guide.href}
                className="text-primary hover:underline"
              >
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

      <section
        aria-labelledby="always"
        className="mt-10 break-inside-avoid rounded-lg border border-border p-5"
      >
        <h2 id="always" className="text-xl font-semibold">
          In every case, afterwards
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted-foreground print:text-foreground">
          {ALWAYS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <PrintButton label="Print this checklist" tool="checklist-urgence" locale="en" />
        <p className="text-sm text-muted-foreground print:hidden">
          Keep it next to a relative&apos;s computer, or send it to them.
        </p>
      </div>

      <p className="mt-10 text-sm text-muted-foreground print:mt-6">
        This checklist restates the advice on the pages of the{" "}
        <Link
          href="/en/attaques"
          className="text-primary hover:underline print:text-foreground print:no-underline"
        >
          attack encyclopedia
        </Link>
        . It does not replace instructions from your bank or official services,
        which take precedence. Source: Cybermalveillance.gouv.fr.
      </p>
      <RelatedTools toolSlug="checklist-urgence" locale="en" />
    </article>
  );
}

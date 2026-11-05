import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { GUIDE_INTENT_LABELS_EN, listGuidesEn } from "@/content/guides";
import { languageAlternates } from "@/lib/hreflang";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const TITLE = "Practical guides";
const DESCRIPTION =
  "Check a link, turn on two-factor authentication, react after a fraudulent payment or a hacked account: the concrete steps, one by one.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/guides",
    languages: languageAlternates({ fr: "/guides", en: "/en/guides" }),
  },
  openGraph: openGraph("en", {
    title: TITLE,
    description: "The concrete steps that defeat most scams.",
    type: "website",
    url: absoluteUrl("/en/guides"),
  }),
};

/** English mirror of `(marketing)/guides/page.tsx`. */
export default function EnglishGuidesIndexPage() {
  const guides = listGuidesEn();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="index" locale="en" />
      <Breadcrumbs
        locale="en"
        trail={[
          { name: "Home", href: "/en" },
          { name: "Guides", href: "/en/guides" },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Practical guides</h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        The attack pages explain <em>what</em> is happening to you. These guides
        explain <em>what to do</em> — the steps, in order, with what people most
        often get wrong.
      </p>

      <ul className="mt-10 space-y-4">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/en/guides/${guide.slug}`}
              className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-semibold group-hover:text-primary">
                  {guide.title}
                </span>
                <Badge variant="secondary">
                  {GUIDE_INTENT_LABELS_EN[guide.intent]}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {guide.question}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { attacksUsingLever, listLeversEn } from "@/content/levers";
import { languageAlternates } from "@/lib/hreflang";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const TITLE = "Why scams work: the nine levers";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Urgency, fear, authority, trust: the psychological levers every scam exploits, and the question to ask yourself to resist them.",
  alternates: {
    canonical: "/en/levers",
    languages: languageAlternates({ fr: "/leviers", en: "/en/levers" }),
  },
  openGraph: openGraph("en", {
    title: TITLE,
    description: "The levers every scam exploits, and how to resist them.",
    type: "website",
    url: absoluteUrl("/en/levers"),
  }),
};

/** English mirror of `(marketing)/leviers/page.tsx`. */
export default function EnglishLeversIndexPage() {
  const levers = listLeversEn();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="index" locale="en" />
      <Breadcrumbs
        locale="en"
        trail={[
          { name: "Home", href: "/en" },
          { name: "Levers", href: "/en/levers" },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
        Why it works on us
      </h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        None of the attacks described on this site exploits a technical flaw on
        the victim&apos;s side. They exploit ordinary human reactions — and
        there are only a handful of them. Understanding them is worth more than
        memorizing a hundred pages: it is what lets you recognize a scam no one
        has described yet.
      </p>

      <ul className="mt-10 space-y-4">
        {levers.map((lever) => (
          <li key={lever.slug}>
            <Link
              href={`/en/levers/${lever.slug}`}
              className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-lg font-semibold group-hover:text-primary">
                  {lever.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  Used by {attacksUsingLever(lever.code).length} attacks
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {lever.plainLanguageDefinition}
              </p>
              <p className="mt-3 text-sm italic text-foreground">
                &ldquo;{lever.counterQuestion}&rdquo;
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

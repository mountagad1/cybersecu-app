import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { listToolsEn } from "@/content/tools";
import { languageAlternates } from "@/lib/hreflang";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const TITLE = "Free tools";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Simple, free tools for the moment you have a doubt or have just been scammed: analyze a suspicious message, read a link, know what to do first.",
  alternates: {
    canonical: "/en/tools",
    languages: languageAlternates({ fr: "/outils", en: "/en/tools" }),
  },
  openGraph: openGraph("en", {
    title: TITLE,
    description: "Analyze a suspicious message, read a link, know what to do first after a scam.",
    type: "website",
    url: absoluteUrl("/en/tools"),
  }),
};

/** English mirror of `(marketing)/outils/page.tsx`. */
export default function EnglishToolsIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="index" locale="en" />
      <Breadcrumbs
        locale="en"
        trail={[
          { name: "Home", href: "/en" },
          { name: "Tools", href: "/en/tools" },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Free tools</h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        For the exact moment you need them: a message or a link that makes you hesitate, or a
        scam that has just worked. No account needed, and nothing you type is
        sent anywhere.
      </p>

      <ul className="mt-10 space-y-4">
        {listToolsEn().map((tool) => (
          <li key={tool.slug}>
            <Link
              href={`/en/tools/${tool.slug}`}
              className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <span className="text-lg font-semibold group-hover:text-primary">
                {tool.title}
              </span>
              <p className="mt-2 text-sm text-muted-foreground">
                {tool.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

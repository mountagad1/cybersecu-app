import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { RelatedTools } from "@/components/tools/related-tools";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { LinkDecoder } from "@/components/tools/link-decoder";
import { attacksForToolEn, findToolEn, guidesForToolEn } from "@/content/tools";
import { languageAlternates } from "@/lib/hreflang";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const tool = findToolEn("decodeur-de-lien");

export const metadata: Metadata = {
  title: "Link decoder: who owns this address?",
  description: tool.description,
  alternates: {
    canonical: `/en/tools/${tool.slug}`,
    languages: languageAlternates({
      fr: `/outils/${tool.frSlug}`,
      en: `/en/tools/${tool.slug}`,
    }),
  },
  openGraph: openGraph("en", {
    title: "Link decoder",
    description: tool.description,
    type: "website",
    url: absoluteUrl(`/en/tools/${tool.slug}`),
  }),
};

/** English mirror of `(marketing)/outils/decodeur-de-lien/page.tsx`. */
export default function EnglishLinkDecoderPage() {
  const attacks = attacksForToolEn(tool.frSlug);
  const guides = guidesForToolEn(tool.frSlug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="tool" locale="en" />
      <Breadcrumbs
        locale="en"
        trail={[
          { name: "Home", href: "/en" },
          { name: "Tools", href: "/en/tools" },
          { name: "Link decoder", href: `/en/tools/${tool.slug}` },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Link decoder</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Paste an address you received by text, email or message. The tool shows
        who really owns the site, what in the address is only decoration, and
        characters that imitate other letters.{" "}
        <strong className="text-foreground">
          The analysis runs in your browser: the address is sent nowhere, and
          the link is never opened.
        </strong>
      </p>

      <div className="mt-8">
        <LinkDecoder locale="en" />
      </div>

      <section aria-labelledby="how" className="mt-12">
        <h2 id="how" className="text-xl font-semibold">
          How the tool reads an address
        </h2>
        <p className="mt-2 text-muted-foreground">
          In a web address, only one part identifies the site&apos;s owner: the
          registered domain name, just before the extension (“.com”, “.fr”, or a
          compound extension such as “.co.uk”). Everything before it is a
          subdomain, which that owner writes however they like — including the
          name of a bank. Everything after it (the path, the parameters) is just
          as free. The tool uses the public list of extensions that browsers use
          to isolate that name, then flags the known tricks for hiding it: an
          “@” in the address, a link shortener, letters from another alphabet, a
          capital letter imitating another letter.
        </p>
      </section>

      <section aria-labelledby="limits" className="mt-8">
        <h2 id="limits" className="text-xl font-semibold">
          What the tool does not do
        </h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>It never says a link is “safe”: it has no way of knowing.</li>
          <li>
            It does not follow redirects: for a shortened link, the destination
            remains unknown.
          </li>
          <li>
            It does not replace the basic rule: to sign in or pay, use a
            bookmark or the official app.
          </li>
        </ul>
      </section>

      {guides.length > 0 && (
        <section aria-labelledby="guides" className="mt-10">
          <h2 id="guides" className="text-xl font-semibold">
            Going further
          </h2>
          <ul className="mt-3 space-y-2">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/en/guides/${guide.slug}`}
                  className="text-primary hover:underline"
                >
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {attacks.length > 0 && (
        <section aria-labelledby="attacks" className="mt-10">
          <h2 id="attacks" className="text-xl font-semibold">
            Attacks that rely on a misleading address
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {attacks.map((attack) => (
              <li key={attack.code}>
                <Link
                  href={`/en/attaques/${attack.slug}`}
                  className="block rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                >
                  {attack.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <RelatedTools toolSlug="decodeur-de-lien" locale="en" />
    </article>
  );
}

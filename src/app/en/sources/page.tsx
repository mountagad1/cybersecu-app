import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { languageAlternates } from "@/lib/hreflang";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Sources and references";
const DESCRIPTION =
  "The public bodies and institutions cybersecu.app's content relies on, and where to report a scam or get help in France.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/sources",
    languages: languageAlternates({ fr: "/sources", en: "/en/sources" }),
  },
  openGraph: openGraph("en", {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: absoluteUrl("/en/sources"),
  }),
};

/**
 * Where a victim should actually go. Ordered by usefulness in an emergency.
 * The same French services as `(marketing)/sources/page.tsx`, each placed in
 * context (« in France ») — the convention of the English attack pages. No
 * foreign service is named: none has been verified for this site.
 */
const HELP = [
  {
    name: "Your bank",
    what: "In a banking fraud, it is the first call to make, before anything else: blocking your card limits the damage. Use the number on the back of your card, never a number received in a message.",
  },
  {
    name: "Cybermalveillance.gouv.fr",
    what: "France's national assistance service for victims of cybercrime: diagnosis, advice, and referral to service providers.",
    url: "https://www.cybermalveillance.gouv.fr",
  },
  {
    name: "33700",
    what: "The French number for reporting fraudulent text messages and calls: forward the suspicious text to 33700.",
  },
  {
    name: "PHAROS — internet-signalement.gouv.fr",
    what: "France's official platform for reporting illegal content and behavior published online. A report is neither a police complaint nor an emergency call: in immediate danger, call emergency services (17 in France).",
    url: "https://www.internet-signalement.gouv.fr",
  },
  {
    name: "CNIL",
    what: "The French data protection authority: where to turn if your personal data is misused.",
    url: "https://www.cnil.fr",
  },
] as const;

/** Institutional bodies whose public work informs our content. */
const REFERENCE_BODIES = [
  {
    name: "ANSSI",
    scope: "France's national cybersecurity agency.",
    url: "https://cyber.gouv.fr",
  },
  {
    name: "Cybermalveillance.gouv.fr",
    scope:
      "Publishes threat guides and an annual activity report documenting the requests it receives in France.",
    url: "https://www.cybermalveillance.gouv.fr",
  },
  {
    name: "ENISA",
    scope:
      "The European Union Agency for Cybersecurity; annual threat landscape reports.",
    url: "https://www.enisa.europa.eu",
  },
  {
    name: "Europol",
    scope:
      "The European Union's law enforcement cooperation agency; analyses of organized online crime.",
    url: "https://www.europol.europa.eu",
  },
  {
    name: "CISA",
    scope:
      "The US Cybersecurity and Infrastructure Security Agency; alerts and practical guides.",
    url: "https://www.cisa.gov",
  },
  {
    name: "FBI IC3",
    scope:
      "The US Internet Crime Complaint Center; annual report on reported fraud.",
    url: "https://www.ic3.gov",
  },
  {
    name: "OWASP",
    scope: "The reference foundation for web application security.",
    url: "https://owasp.org",
  },
  {
    name: "Unicode Consortium",
    scope:
      "Publishes the specifications on visually confusable characters that underpin homoglyph attacks.",
    url: "https://www.unicode.org",
  },
] as const;

/** English translation of `(marketing)/sources/page.tsx`. Same sections, same order. */
export default function SourcesPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Breadcrumbs
        locale="en"
        trail={[
          { name: "Home", href: "/en" },
          { name: "Sources and references", href: "/en/sources" },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight">
        Sources and references
      </h1>

      <p className="mt-6 text-lg text-muted-foreground">
        Our content relies on publications from public bodies and recognized
        institutions. This page says which ones, and above all where to turn if
        you are affected right now.
      </p>

      <section
        aria-labelledby="help"
        className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-6"
      >
        <h2 id="help" className="text-xl font-semibold">
          Are you the victim of a scam?
        </h2>
        <p className="mt-2 text-muted-foreground">
          cybersecu.app is a training site: we don&apos;t intervene on a
          compromised account and don&apos;t report anything on your behalf.
          Contact the competent bodies directly.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          The services below are French. Outside France, start with your bank,
          then your country&apos;s police and its consumer or data protection
          authorities.
        </p>
        <dl className="mt-5 space-y-4">
          {HELP.map((item) => (
            <div key={item.name}>
              <dt className="font-semibold">
                {"url" in item && item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    {item.name}
                  </a>
                ) : (
                  item.name
                )}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {item.what}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="bodies" className="mt-10">
        <h2 id="bodies" className="text-xl font-semibold">
          Reference bodies
        </h2>
        <p className="mt-2 text-muted-foreground">
          The public work of these bodies informs our pages. We cite them page
          by page, with a link to the publication concerned, rather than
          pointing to this list as a whole.
        </p>
        <dl className="mt-5 space-y-4">
          {REFERENCE_BODIES.map((body) => (
            <div
              key={body.name}
              className="rounded-lg border border-border bg-card p-4"
            >
              <dt className="font-semibold">
                <a
                  href={body.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  {body.name}
                </a>
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {body.scope}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="rules" className="mt-10">
        <h2 id="rules" className="text-xl font-semibold">
          Our citation rules
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            A figure published on this site comes with a link to its source.
          </li>
          <li>
            We don&apos;t cite a source to support a statement it does not
            actually support.
          </li>
          <li>
            When information from an official body contradicts ours, theirs
            prevails.
          </li>
        </ul>
        <p className="mt-4 text-muted-foreground">
          The details of how content is produced and published are on the{" "}
          <Link href="/en/methodology" className="text-primary underline">
            editorial methodology
          </Link>{" "}
          page.
        </p>
      </section>
    </article>
  );
}

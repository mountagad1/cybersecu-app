import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { languageAlternates } from "@/lib/hreflang";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Editorial methodology";
const DESCRIPTION =
  "How an attack page is produced, checked and published on cybersecu.app: publication criteria, how sources are handled, and the limits we acknowledge.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/methodology",
    languages: languageAlternates({
      fr: "/methodologie",
      en: "/en/methodology",
    }),
  },
  openGraph: openGraph("en", {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: absoluteUrl("/en/methodology"),
  }),
};

const PUBLISH_REQUIREMENTS = [
  {
    field: "Definition",
    detail:
      "What the technique is, in one sentence anyone can understand without a technical background.",
  },
  {
    field: "How it works",
    detail:
      "The concrete course of the attack, from first contact to the attacker's goal.",
  },
  {
    field: "Warning signs",
    detail:
      "At least one clue the targeted person can observe — not a trait that only becomes visible afterwards.",
  },
  {
    field: "Psychological lever or indicator",
    detail:
      "At least one identified manipulation mechanism (urgency, authority, fear…) or one attached technical indicator.",
  },
] as const;

/** English translation of `(marketing)/methodologie/page.tsx`. Same sections, same order. */
export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Breadcrumbs
        locale="en"
        trail={[
          { name: "Home", href: "/en" },
          { name: "Methodology", href: "/en/methodology" },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight">
        Editorial methodology
      </h1>

      <p className="mt-6 text-lg text-muted-foreground">
        Inaccurate security information can lead someone to lower their guard at
        the wrong moment. This page describes how our content is produced, and
        exactly what our verification notes mean — including what they
        don&apos;t.
      </p>

      <section aria-labelledby="gate" className="mt-10">
        <h2 id="gate" className="text-xl font-semibold">
          A page is not published while it is incomplete
        </h2>
        <p className="mt-2 text-muted-foreground">
          We maintain a database of attack techniques that is larger than what
          is published. A technique can be listed there without a public page:
          as long as the items below are missing, the page stays in preparation
          and does not go online.
        </p>
        <dl className="mt-4 space-y-3">
          {PUBLISH_REQUIREMENTS.map(({ field, detail }) => (
            <div
              key={field}
              className="rounded-lg border border-border bg-card p-4"
            >
              <dt className="font-semibold">{field}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{detail}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-muted-foreground">
          This rule is enforced by the software, not just by editorial
          discipline: publishing an incomplete page is technically refused. It
          is a deliberate choice — a small, reliable encyclopedia is better than
          a large catalog of empty pages.
        </p>
      </section>

      <section aria-labelledby="sources" className="mt-10">
        <h2 id="sources" className="text-xl font-semibold">
          How we handle sources
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            Figures we quote come from public bodies or recognized institutions,
            with a link to the original publication.
          </li>
          <li>
            We never cite a source that does not actually support the statement
            it accompanies.
          </li>
          <li>
            We don&apos;t copy the text of our sources: we explain the mechanism
            in our own words, for a non-specialist audience.
          </li>
          <li>
            A figure without an identifiable source is not published, however
            widely it circulates.
          </li>
        </ul>
        <p className="mt-3 text-muted-foreground">
          The bodies we rely on are listed on the{" "}
          <Link href="/en/sources" className="text-primary underline">
            sources and references
          </Link>{" "}
          page.
        </p>
      </section>

      <section aria-labelledby="simulations" className="mt-10">
        <h2 id="simulations" className="text-xl font-semibold">
          How the simulations are written
        </h2>
        <p className="mt-2 text-muted-foreground">
          Each simulation is original content, written to illustrate a specific
          mechanism. We never use a message actually received by an identifiable
          person, and the organizations being imitated are generic (&ldquo;your
          bank&rdquo;) or fictional, never used to harm a real brand.
        </p>
        <p className="mt-3 text-muted-foreground">
          After each answer, the explanation shows the technique used and the
          right reflex. A mistake in a simulation is never presented as a
          failure: it is exactly the moment when learning happens.
        </p>
      </section>

      <section aria-labelledby="limits" className="mt-10">
        <h2 id="limits" className="text-xl font-semibold">
          Limits we acknowledge
        </h2>
        <div className="mt-3 rounded-lg border border-warning/30 bg-warning/5 p-5">
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>
              <strong className="font-semibold text-foreground">
                Our content is not reviewed by a certified external expert.
              </strong>{" "}
              It is written from the public publications of competent bodies,
              but we don&apos;t display any &ldquo;expert-validated&rdquo;
              label, because no such validation has taken place. If that
              changes, this page will say so.
            </li>
            <li>
              Our coverage is not exhaustive. We don&apos;t claim to list
              &ldquo;every cyberattack&rdquo;: we cover the techniques aimed at
              the general public and small organizations, and that coverage
              grows over time.
            </li>
            <li>
              Scam techniques evolve. A page that is accurate today can become
              partly outdated; when in doubt, information from an official body
              takes precedence over ours.
            </li>
            <li>
              This site replaces neither professional advice nor a report to the
              competent authorities.
            </li>
            <li>
              Our help lines and reporting services are French: the English
              pages translate content written for France, and say so where it
              matters.
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="correction" className="mt-10">
        <h2 id="correction" className="text-xl font-semibold">
          Report an error
        </h2>
        <p className="mt-2 text-muted-foreground">
          If a piece of information seems inaccurate or out of date to you, we
          would rather know. A factual correction takes priority over any other
          change to the site.
        </p>
      </section>
      <p className="mt-10 text-sm text-muted-foreground">
        Who publishes this site, and for what purpose:{" "}
        <Link href="/en/about" className="text-primary underline">
          about cybersecu.app
        </Link>
        .
      </p>
    </article>
  );
}

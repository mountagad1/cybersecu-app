import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { languageAlternates } from "@/lib/hreflang";
import { PUBLISHER } from "@/lib/publisher";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";

const TITLE = "About";
const DESCRIPTION =
  "What cybersecu.app is, who it is for, what it does and what it does not do: a training tool for your reflexes against online scams.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/about",
    languages: languageAlternates({ fr: "/a-propos", en: "/en/about" }),
  },
  openGraph: openGraph("en", {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: absoluteUrl("/en/about"),
  }),
};

/** English translation of `(marketing)/a-propos/page.tsx`. Same sections, same order. */
export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Breadcrumbs
        locale="en"
        trail={[
          { name: "Home", href: "/en" },
          { name: "About", href: "/en/about" },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight">About cybersecu.app</h1>

      <p className="mt-6 text-lg text-muted-foreground">
        cybersecu.app is a training tool. Its goal is not to make you memorize
        definitions, but to help you build a reflex: pause and check before
        acting when a message puts you under pressure.
      </p>

      <section aria-labelledby="why" className="mt-10">
        <h2 id="why" className="text-xl font-semibold">
          Why this site exists
        </h2>
        <p className="mt-2 text-muted-foreground">
          Online scams don&apos;t rely on victims being naive, but on a moment
          of inattention exploited by a believable, urgent message. Reading an
          explanation is usually not enough to change behavior: the day the text
          message arrives, it&apos;s your automatic reaction that decides, not
          what you know in theory.
        </p>
        <p className="mt-3 text-muted-foreground">
          That is why each attack page is paired, where one exists, with a{" "}
          <Link href="/en/simulations" className="text-primary underline">
            playable simulation
          </Link>
          : seeing the trap and getting it wrong with no consequences teaches
          more than reading about it.
        </p>
      </section>

      <section aria-labelledby="who" className="mt-10">
        <h2 id="who" className="text-xl font-semibold">
          Who it is for
        </h2>
        <p className="mt-2 text-muted-foreground">
          Anyone who uses a phone, a messaging app or a bank card every day:
          individuals, older adults, office staff, shopkeepers, small
          organizations. No technical knowledge is assumed. Technical terms are
          explained when they are needed, and avoided when they aren&apos;t.
        </p>
      </section>

      <section aria-labelledby="what-we-do" className="mt-10">
        <h2 id="what-we-do" className="text-xl font-semibold">
          What this site does — and doesn&apos;t do
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-base font-semibold">What we do</h3>
            <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>Explain how common scam techniques work</li>
              <li>Offer risk-free training simulations</li>
              <li>Point out concrete, checkable warning signs</li>
              <li>Refer you to the relevant official bodies</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-base font-semibold">What we don&apos;t do</h3>
            <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>No personalized legal, banking or insurance advice</li>
              <li>
                No intervention on a compromised account, and no one-to-one
                support
              </li>
              <li>No reporting on your behalf</li>
              <li>No resale of personal data</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          If you are being scammed right now, this site is not the right place
          to turn to: contact your bank and the bodies listed on our{" "}
          <Link href="/en/sources" className="text-primary underline">
            sources and references
          </Link>{" "}
          page.
        </p>
      </section>

      <section aria-labelledby="content" className="mt-10">
        <h2 id="content" className="text-xl font-semibold">
          Our content is fictional, our sources are real
        </h2>
        <p className="mt-2 text-muted-foreground">
          Every simulation (text messages, emails, calls, websites) is an
          educational reconstruction that we write ourselves. None reproduces a
          message actually sent to an identifiable person, and nothing on this
          site can be used to build a real phishing attempt.
        </p>
        <p className="mt-3 text-muted-foreground">
          The mechanisms we describe and the figures we quote, on the other
          hand, come from verifiable public sources. Our{" "}
          <Link href="/en/methodology" className="text-primary underline">
            methodology
          </Link>{" "}
          explains how a page is produced and on what conditions it is
          published.
        </p>
      </section>

      <section aria-labelledby="publisher" className="mt-10">
        <h2 id="publisher" className="text-xl font-semibold">
          Who publishes this site
        </h2>
        <p className="mt-2 text-muted-foreground">
          cybersecu.app is published by {PUBLISHER.name}, as a private
          individual: there is no company behind the site. {PUBLISHER.name} is
          its editor and publication director, and answers for every page
          published. To report
          an error or ask a question:{" "}
          <a href={`mailto:${PUBLISHER.email}`} className="text-primary underline">
            {PUBLISHER.email}
          </a>
          .
        </p>
      </section>
    </article>
  );
}

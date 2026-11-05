import Link from "next/link";
import type { Metadata } from "next";
import { languageAlternates } from "@/lib/hreflang";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";
import { PUBLISHER } from "@/lib/publisher";

const TITLE = "Privacy policy";
const DESCRIPTION =
  "How cybersecu.app collects, uses and protects your personal data, and how to exercise your rights.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/privacy",
    languages: languageAlternates({ fr: "/confidentialite", en: "/en/privacy" }),
  },
  openGraph: openGraph("en", { title: TITLE, description: DESCRIPTION, type: "website", url: absoluteUrl("/en/privacy") }),
};

const LAST_UPDATED = "26 October 2026";

/**
 * English translation of `(marketing)/confidentialite/page.tsx`, section for
 * section. The French text is the one that applies; keep both in step when
 * either changes (docs/seo/COMPLETE_SEO_AUDIT.md CA-14).
 */
export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Privacy policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      <p className="mt-4 rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
        This is a translation provided for convenience. The{" "}
        <Link href="/confidentialite" hrefLang="fr" lang="fr" className="text-primary underline">
          French version
        </Link>{" "}
        is the one that applies.
      </p>

      <section aria-labelledby="controller" className="mt-8">
        <h2 id="controller" className="text-xl font-semibold">
          1. Data controller
        </h2>
        <p className="mt-2 text-muted-foreground">
          cybersecu.app is published in a personal capacity by {PUBLISHER.name}, a private
          individual, who is the controller of your data. For any question about this policy or
          your personal data, write to{" "}
          <a href={`mailto:${PUBLISHER.email}`} className="text-primary underline">
            {PUBLISHER.email}
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="data" className="mt-8">
        <h2 id="data" className="text-xl font-semibold">
          2. Data we collect
        </h2>
        <p className="mt-2 text-muted-foreground">
          We apply a data-minimisation principle: we only collect what the service needs to work.
        </p>
        <p className="mt-3 text-muted-foreground">
          <strong className="text-foreground">No account is needed</strong> to use the service. An
          anonymous session identifier, random and not linked to your identity, is stored in a
          technical cookie to count your free simulations and keep your progress on this device.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Anonymous session</strong>: a randomly generated
            identifier, stored in a signed technical cookie. It contains no name, no email and no
            IP address.
          </li>
          <li>
            <strong className="text-foreground">Training history</strong>: for each simulation
            played, the simulation, the choice selected, whether it was correct, and the related
            error categories (for example « responded to urgency »). We never store free text you
            may have typed.
          </li>
          <li>
            <strong className="text-foreground">Payment</strong>: if you unlock full access (€29,
            one-off payment), the payment is handled entirely by Stripe — we neither receive nor
            store your card details. Stripe collects your email address at checkout; we only keep
            a cryptographic fingerprint (hash) of it, which cannot be reversed and is used solely
            to restore your access if you change device (see « Restore my access »).
          </li>
          <li>
            <strong className="text-foreground">Technical cookies</strong>: only cookies the
            service needs to work (anonymous session). No advertising or third-party tracking
            cookie is set at this time.
          </li>
        </ul>
        <p className="mt-3 text-muted-foreground">
          The simulations themselves (reconstructed text messages, emails and fraudulent sites) are
          entirely fictional educational content that we create — never real messages you received.
        </p>
      </section>

      <section aria-labelledby="purposes" className="mt-8">
        <h2 id="purposes" className="text-xl font-semibold">
          3. Why we use this data
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          <li>To run the simulations and count your 10 free simulations.</li>
          <li>To process your payment and give you access to the unlocked simulations.</li>
          <li>To let you restore your access on another device, without a password, through a link sent by email.</li>
          <li>To keep the service secure (abuse detection, administrator audit log).</li>
          <li>To improve the educational content from aggregated, anonymised statistics.</li>
        </ul>
      </section>

      <section aria-labelledby="legal-basis" className="mt-8">
        <h2 id="legal-basis" className="text-xl font-semibold">
          4. Legal basis
        </h2>
        <p className="mt-2 text-muted-foreground">
          Processing of your session and training data is based on the performance of the contract
          between us (the terms of use you accepted) and, for payment, on the performance of the
          sale. Aggregated statistics are based on our legitimate interest in improving the
          service.
        </p>
      </section>

      <section aria-labelledby="hosting" className="mt-8">
        <h2 id="hosting" className="text-xl font-semibold">
          5. Hosting and processors
        </h2>
        <p className="mt-2 text-muted-foreground">
          Your data is hosted by Supabase (database), the application is served by Vercel, payments
          are processed by Stripe, and the access-restore email is sent through Resend. These
          providers act as processors within the meaning of the GDPR and do not use your data for
          any purpose of their own.
        </p>
      </section>

      <section aria-labelledby="retention" className="mt-8">
        <h2 id="retention" className="text-xl font-semibold">
          6. Retention
        </h2>
        <p className="mt-2 text-muted-foreground">
          Your anonymous session and training history are kept for as long as they are useful to
          the service. The fingerprint (hash) of your email is kept only while an active access is
          linked to it. Restore links expire automatically after 30 minutes and can be deleted on
          request.
        </p>
      </section>

      <section aria-labelledby="rights" className="mt-8">
        <h2 id="rights" className="text-xl font-semibold">
          7. Your rights
        </h2>
        <p className="mt-2 text-muted-foreground">
          Under the GDPR, you have the right to access, rectify, erase, restrict, port and object
          to the processing of your personal data. You can:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          <li>Clear your browser cookies to end your anonymous session.</li>
          <li>
            Write to{" "}
            <a href={`mailto:${PUBLISHER.email}`} className="text-primary underline">
              {PUBLISHER.email}
            </a>{" "}
            for any request about your data.
          </li>
          <li>
            Lodge a complaint with the CNIL, the French data protection authority (
            <a href="https://www.cnil.fr" className="text-primary underline" rel="noopener noreferrer" target="_blank">
              www.cnil.fr
            </a>
            ), if you believe your rights are not respected.
          </li>
        </ul>
      </section>

      <section aria-labelledby="minors" className="mt-8">
        <h2 id="minors" className="text-xl font-semibold">
          8. Minors
        </h2>
        <p className="mt-2 text-muted-foreground">
          The service is intended for the general public, including older people and families. A
          purchase (€29) by a minor under 15 requires the consent of a holder of parental
          authority, in accordance with French law.
        </p>
      </section>

      <section aria-labelledby="changes" className="mt-8">
        <h2 id="changes" className="text-xl font-semibold">
          9. Changes to this policy
        </h2>
        <p className="mt-2 text-muted-foreground">
          We may update this policy to reflect changes to the service or to the regulations. The
          date of the last update appears at the top of this page.
        </p>
      </section>
    </article>
  );
}

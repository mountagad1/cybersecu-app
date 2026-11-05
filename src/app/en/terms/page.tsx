import Link from "next/link";
import type { Metadata } from "next";
import { languageAlternates } from "@/lib/hreflang";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";
import { PUBLISHER } from "@/lib/publisher";
import { SALES_OPEN } from "@/lib/sales";

const TITLE = "Terms of use";
const DESCRIPTION =
  "The rules for using cybersecu.app: what the service offers, your commitments, and the limits of liability.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/terms",
    languages: languageAlternates({ fr: "/conditions-utilisation", en: "/en/terms" }),
  },
  openGraph: openGraph("en", { title: TITLE, description: DESCRIPTION, type: "website", url: absoluteUrl("/en/terms") }),
};

const LAST_UPDATED = "26 October 2026";

/**
 * English translation of `(marketing)/conditions-utilisation/page.tsx`,
 * section for section. The French text is the one that applies; keep both
 * in step when either changes (docs/seo/COMPLETE_SEO_AUDIT.md CA-14).
 */
export default function TermsOfUsePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Terms of use</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      <p className="mt-4 rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
        This is a translation provided for convenience. The{" "}
        <Link href="/conditions-utilisation" hrefLang="fr" lang="fr" className="text-primary underline">
          French version
        </Link>{" "}
        is the one that applies.
      </p>

      <section aria-labelledby="purpose" className="mt-8">
        <h2 id="purpose" className="text-xl font-semibold">
          1. Purpose
        </h2>
        <p className="mt-2 text-muted-foreground">
          These terms of use (the « Terms ») govern access to and use of the cybersecu.app service,
          published in a personal capacity by {PUBLISHER.name}, a private individual (« we »). No
          account is required to use the service: by using the service, including anonymously, you
          accept these Terms.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          <li>Publisher and publication director: {PUBLISHER.name}.</li>
          <li>
            Contact:{" "}
            <a href={`mailto:${PUBLISHER.email}`} className="text-primary underline">
              {PUBLISHER.email}
            </a>
            .
          </li>
          <li>
            Host: {PUBLISHER.host.name}, San Francisco, California, United States (
            <a href={PUBLISHER.host.url} className="text-primary underline" rel="noopener noreferrer" target="_blank">
              vercel.com
            </a>
            ).
          </li>
        </ul>
      </section>

      <section aria-labelledby="service" className="mt-8">
        <h2 id="service" className="text-xl font-semibold">
          2. Description of the service
        </h2>
        <p className="mt-2 text-muted-foreground">
          cybersecu.app is an educational cybersecurity-awareness service. It offers realistic but
          entirely fictional simulations of phishing, smishing and other manipulation attempts,
          along with explanatory content about these threats. No simulation comes from a real
          source, and no feature of the service can be used to create or send a real phishing
          attempt.
        </p>
        <p className="mt-2 text-muted-foreground">
          The service is provided for information and awareness. It is neither a security audit
          nor professional cybersecurity advice, and it does not guarantee that a trained user will
          always avoid a real attack.
        </p>
      </section>

      <section aria-labelledby="access" className="mt-8">
        <h2 id="access" className="text-xl font-semibold">
          3. Use without an account, free offer and payment
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          <li>
            The service can be used without creating an account: an anonymous session, stored in a
            technical cookie in your browser, keeps track of your use.
          </li>
          <li>You get 10 free simulations per anonymous session.</li>
          <li>
            Beyond that, full access to the simulations (current and future) is offered for €29, as
            a one-off payment, with no subscription, through Stripe.
            {!SALES_OPEN && <> This offer is currently suspended: no purchase is possible for now.</>}
          </li>
          <li>
            Purchased access is linked to your anonymous session. If you delete your browser cookies
            or change device, you can restore your access through the link sent by email at
            purchase (see « Restore my access »).
          </li>
          <li>Payment is handled entirely by Stripe; we never have access to your card details.</li>
        </ul>
      </section>

      <section aria-labelledby="withdrawal" className="mt-8">
        <h2 id="withdrawal" className="text-xl font-semibold">
          4. Right of withdrawal
        </h2>
        <p className="mt-2 text-muted-foreground">
          Under article L221-28 13° of the French Consumer Code, the 14-day right of withdrawal for
          distance purchases does not apply to digital content not supplied on a tangible medium
          whose performance has begun after the consumer&apos;s prior express consent and express
          waiver of the right of withdrawal.
        </p>
        <p className="mt-2 text-muted-foreground">
          Full access to the simulations is unlocked immediately after the payment is confirmed.
          Before paying, you must therefore tick a box stating explicitly that you accept this
          immediate performance and waive your right of withdrawal for this purchase. Without this
          box ticked, the payment cannot start.
        </p>
        <p className="mt-2 text-muted-foreground">
          This waiver does not deprive you of any other right under the French Consumer Code, in
          particular in case of non-conformity of the service (section 8, Limitation of liability)
          or of a refund decided by us or by Stripe.
        </p>
      </section>

      <section aria-labelledby="acceptable-use" className="mt-8">
        <h2 id="acceptable-use" className="text-xl font-semibold">
          5. Acceptable use
        </h2>
        <p className="mt-2 text-muted-foreground">You agree not to:</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          <li>
            Use the techniques, content or methods presented on the service for real malicious
            purposes, including to create or spread real phishing, smishing or social-engineering
            attempts;
          </li>
          <li>Attempt to bypass the service&apos;s security measures or to access other users&apos; data;</li>
          <li>Extract, copy or republish the service&apos;s educational content without permission;</li>
          <li>Use automated means (bots, scraping) to access the service without prior permission.</li>
        </ul>
        <p className="mt-2 text-muted-foreground">
          Any breach of these commitments may lead to the suspension of your access to the service.
        </p>
      </section>

      <section aria-labelledby="ip" className="mt-8">
        <h2 id="ip" className="text-xl font-semibold">
          6. Intellectual property
        </h2>
        <p className="mt-2 text-muted-foreground">
          The simulations, explanatory texts, attack taxonomy, graphic elements and the name
          « cybersecu.app » belong to us or to our licensors. Nothing in these Terms grants you any
          right to this content beyond personal, non-commercial use as part of your training.
        </p>
      </section>

      <section aria-labelledby="availability" className="mt-8">
        <h2 id="availability" className="text-xl font-semibold">
          7. Availability and changes to the service
        </h2>
        <p className="mt-2 text-muted-foreground">
          The service is under active development, and its content, features and appearance may
          change. We strive to keep it continuously available but do not guarantee it will never be
          interrupted.
        </p>
      </section>

      <section aria-labelledby="liability" className="mt-8">
        <h2 id="liability" className="text-xl font-semibold">
          8. Limitation of liability
        </h2>
        <p className="mt-2 text-muted-foreground">
          The service is provided for educational purposes, « as is ». To the extent permitted by
          applicable law, we cannot be held liable for the consequences of a real attack suffered
          by a user, as the service aims to raise awareness and does not guarantee protection.
        </p>
      </section>

      <section aria-labelledby="termination" className="mt-8">
        <h2 id="termination" className="text-xl font-semibold">
          9. Termination
        </h2>
        <p className="mt-2 text-muted-foreground">
          You can stop using the service at any time by deleting your browser cookies. We may
          suspend or revoke access in case of a breach of these Terms, in particular of section 5
          (Acceptable use), or if the corresponding payment is refunded.
        </p>
      </section>

      <section aria-labelledby="law" className="mt-8">
        <h2 id="law" className="text-xl font-semibold">
          10. Governing law
        </h2>
        <p className="mt-2 text-muted-foreground">
          These Terms are governed by French law. Any dispute will be brought before the competent
          French courts, unless a mandatory rule applicable to consumers provides otherwise.
        </p>
      </section>

      <section aria-labelledby="contact" className="mt-8">
        <h2 id="contact" className="text-xl font-semibold">
          11. Contact
        </h2>
        <p className="mt-2 text-muted-foreground">
          For any question about these Terms, write to{" "}
          <a href={`mailto:${PUBLISHER.email}`} className="text-primary underline">
            {PUBLISHER.email}
          </a>
          .
        </p>
      </section>
    </article>
  );
}

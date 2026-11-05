import Link from "next/link";
import { PageTracker } from "@/components/analytics/page-tracker";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { PasswordGenerator } from "@/components/tools/password-generator";
import { RelatedTools } from "@/components/tools/related-tools";
import { findAttackByCode } from "@/content/attacks";
import { getLocalizedAttack } from "@/content/attacks/localize";
import { englishGuideSlug, findGuideBySlug } from "@/content/guides";
import { findTool, findToolEn, guidesForTool, guidesForToolEn } from "@/content/tools";
import { PASSWORD_ATTACK_CODES, PASSWORD_GENERATOR_CONTENT } from "@/content/tools/password-generator";
import type { Locale } from "@/domain/i18n/locale";
import { trackAttrs } from "@/lib/analytics";
import { absoluteUrl } from "@/lib/site";

export const PASSWORD_TOOL_SLUG = "generateur-mot-de-passe";

/** Path of the page in each language. */
export function passwordGeneratorPath(locale: Locale): string {
  return locale === "fr" ? `/outils/${PASSWORD_TOOL_SLUG}` : `/en/tools/${findToolEn(PASSWORD_TOOL_SLUG).slug}`;
}

const CRUMBS = {
  fr: { home: "Accueil", tools: "Outils", toolsHref: "/outils", homeHref: "/" },
  en: { home: "Home", tools: "Tools", toolsHref: "/en/tools", homeHref: "/en" },
} as const;

/**
 * Body of the password generator page, both languages. The explanations,
 * links and structured data are rendered on the server; only the
 * generator itself (`PasswordGenerator`) runs in the browser, and it is
 * the only place a password ever exists.
 */
export function PasswordGeneratorPage({ locale }: { locale: Locale }) {
  const c = PASSWORD_GENERATOR_CONTENT[locale];
  const path = passwordGeneratorPath(locale);
  const crumbs = CRUMBS[locale];
  const tool = locale === "fr" ? findTool(PASSWORD_TOOL_SLUG) : findToolEn(PASSWORD_TOOL_SLUG);

  const guides =
    locale === "fr"
      ? guidesForTool(findTool(PASSWORD_TOOL_SLUG)).map((g) => ({ href: `/guides/${g.slug}`, title: g.title }))
      : guidesForToolEn(PASSWORD_TOOL_SLUG).map((g) => ({ href: `/en/guides/${g.slug}`, title: g.title }));

  const attacks = PASSWORD_ATTACK_CODES.flatMap((code) => {
    const attack = findAttackByCode(code);
    if (!attack) return [];
    if (locale === "fr") return [{ href: `/attaques/${attack.slug}`, name: attack.name }];
    const en = getLocalizedAttack(attack, "en");
    return en ? [{ href: `/en/attaques/${en.slug}`, name: en.name }] : [];
  });

  // Next steps resolve their guide or tool in the page's language; a link
  // whose target has no page in this language is dropped, not left dangling.
  const nextSteps = c.nextSteps.map((step) => {
    if (step.guideSlug) {
      const guide = findGuideBySlug(step.guideSlug);
      const href =
        locale === "fr"
          ? guide && `/guides/${guide.slug}`
          : (() => {
              const en = guide && englishGuideSlug(guide.slug);
              return en ? `/en/guides/${en}` : undefined;
            })();
      return { ...step, href, track: href ? trackAttrs({ name: "guide_click", props: { from: "tool", guide: step.guideSlug } }) : undefined };
    }
    if (step.toolSlug) {
      const href = locale === "fr" ? `/outils/${findTool(step.toolSlug).slug}` : `/en/tools/${findToolEn(step.toolSlug).slug}`;
      return { ...step, href, track: undefined };
    }
    return { ...step, href: undefined, track: undefined };
  });

  // The tool is a web application used on the page, like the other tools.
  // The FAQ markup repeats the visible « Questions fréquentes » word for
  // word; it describes the page, it does not promise a rich result.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: c.h1,
      url: absoluteUrl(path),
      description: tool.description,
      applicationCategory: "SecurityApplication",
      operatingSystem: locale === "fr" ? "Tous (navigateur web)" : "Any (web browser)",
      isAccessibleForFree: true,
      inLanguage: locale === "fr" ? "fr-FR" : "en-US",
      ...SITE_REFERENCES,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="tool" locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        trail={[
          { name: crumbs.home, href: crumbs.homeHref },
          { name: crumbs.tools, href: crumbs.toolsHref },
          { name: c.h1, href: path },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{c.h1}</h1>
      <p className="mt-3 text-base text-muted-foreground">{c.intro}</p>
      <p className="mt-3 text-base font-semibold text-foreground">{c.privacy}</p>

      <section aria-labelledby="pg-summary" className="mt-6 rounded-lg border border-border bg-muted p-5">
        <h2 id="pg-summary" className="text-lg font-semibold">
          {c.summaryHeading}
        </h2>
        <p className="mt-2 text-base">{c.summary}</p>
      </section>

      <div className="mt-8">
        <PasswordGenerator locale={locale} />
      </div>

      <section aria-labelledby="pg-next" className="mt-10">
        <h2 id="pg-next" className="text-xl font-semibold sm:text-2xl">
          {c.nextHeading}
        </h2>
        <ol className="mt-3 list-inside list-decimal space-y-3 text-muted-foreground">
          {nextSteps.map((step) => (
            <li key={step.text}>
              {step.text}
              {step.href && step.linkLabel && (
                <>
                  {" "}
                  <Link href={step.href} className="text-primary underline underline-offset-2" {...step.track}>
                    {step.linkLabel} →
                  </Link>
                </>
              )}
            </li>
          ))}
        </ol>
      </section>

      {c.sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="mt-12">
          <h2 id={section.id} className="text-xl font-semibold sm:text-2xl">
            {section.heading}
          </h2>
          {section.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="mt-3 text-muted-foreground">
              {p}
            </p>
          ))}
        </section>
      ))}

      <section aria-labelledby="pg-faq" className="mt-12">
        <h2 id="pg-faq" className="text-xl font-semibold sm:text-2xl">
          {c.faqHeading}
        </h2>
        <dl className="mt-4 space-y-5">
          {c.faq.map((f) => (
            <div key={f.question}>
              <dt className="font-semibold">{f.question}</dt>
              <dd className="mt-1 text-muted-foreground">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="pg-limits" className="mt-12">
        <h2 id="pg-limits" className="text-xl font-semibold sm:text-2xl">
          {c.limitsHeading}
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          {c.limits.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>

      {guides.length > 0 && (
        <section aria-labelledby="pg-guides" className="mt-10">
          <h2 id="pg-guides" className="text-xl font-semibold">
            {c.guidesHeading}
          </h2>
          <ul className="mt-3 space-y-2">
            {guides.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="text-primary hover:underline">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {attacks.length > 0 && (
        <section aria-labelledby="pg-attacks" className="mt-10">
          <h2 id="pg-attacks" className="text-xl font-semibold">
            {c.attacksHeading}
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {attacks.map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  className="block rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                >
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <RelatedTools toolSlug={PASSWORD_TOOL_SLUG} locale={locale} />
    </article>
  );
}

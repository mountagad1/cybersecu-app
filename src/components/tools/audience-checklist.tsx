import { trackAttrs } from "@/lib/analytics";
import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SITE_REFERENCES } from "@/components/seo/site-json-ld";
import { PrintButton } from "@/components/tools/print-button";
import {
  audienceItemText,
  audiencePath,
  type AudienceEntry,
} from "@/content/audiences";
import { findAttackByCode } from "@/content/attacks";
import { getLocalizedAttack } from "@/content/attacks/localize";
import type { Locale } from "@/domain/i18n/locale";
import { linksForAudience, type ContextLink } from "@/domain/linking/engine";
import { absoluteUrl } from "@/lib/site";

const STRINGS = {
  fr: {
    home: { name: "Accueil", href: "/" },
    tools: { name: "Outils", href: "/outils" },
    attackPrefix: "/attaques",
    print: "Imprimer cette checklist",
    source: "Fiche :",
    attacks: "Les arnaques que cette checklist déjoue",
    simulations: "S'entraîner sur ces arnaques",
    simulationsNote: "Des messages fictifs, pour décider sans risque.",
    guides: "Les guides pas à pas",
    protection: "Si c'est déjà arrivé",
    audiences: "Les autres checklists",
    otherTools: "Les autres outils",
  },
  en: {
    home: { name: "Home", href: "/en" },
    tools: { name: "Tools", href: "/en/tools" },
    attackPrefix: "/en/attaques",
    print: "Print this checklist",
    source: "Article:",
    attacks: "The scams this checklist defeats",
    simulations: "Practice on these scams",
    simulationsNote: "Fictional messages, to decide without risk.",
    guides: "Step-by-step guides",
    protection: "If it already happened",
    audiences: "The other checklists",
    otherTools: "The other tools",
  },
} as const;

/** Fiche and guide links report their click; the others are not funnel steps. */
function linkTracking(link: ContextLink) {
  if (link.kind === "attack" && link.code)
    return trackAttrs({
      name: "related_attack_click",
      props: { from: "audience", to_attack: link.code, section: "audience" },
    });
  if (link.kind === "guide" && link.code)
    return trackAttrs({ name: "guide_click", props: { from: "audience", guide: link.code } });
  return {};
}

function LinkList({
  links,
  compact = false,
}: {
  links: ContextLink[];
  compact?: boolean;
}) {
  return (
    <ul
      className={compact ? "mt-3 grid gap-2 sm:grid-cols-2" : "mt-3 space-y-2"}
    >
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="block rounded-md border border-border px-4 py-3 transition-colors hover:border-primary"
            {...linkTracking(link)}
          >
            <span className="font-medium">{link.anchor}</span>
            {link.description && !compact && (
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {link.description}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * A printable checklist for one audience (src/content/audiences). Every item
 * is a fiche's own prevention sentence, with a link back to it; everything
 * around the checklist comes from the linking engine.
 */
export function AudienceChecklist({
  audience,
  locale,
}: {
  audience: AudienceEntry;
  locale: Locale;
}) {
  const t = STRINGS[locale];
  const path = audiencePath(audience, locale);
  const links = linksForAudience(audience, locale);

  const sections = audience.sections.map((section) => ({
    id: section.id,
    title: section.title[locale],
    items: section.items.map((item) => {
      const attack = findAttackByCode(item.attackCode)!;
      const localized = getLocalizedAttack(attack, locale)!;
      return {
        key: `${item.attackCode}-${item.prevention}`,
        text: audienceItemText(item, locale)!,
        source: {
          name: localized.name,
          href: `${t.attackPrefix}/${localized.slug}#prevention`,
        },
      };
    }),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: audience.h1[locale],
    description: audience.description[locale],
    url: absoluteUrl(path),
    inLanguage: locale === "en" ? "en-US" : "fr-FR",
    about: links.attacks.map((l) => ({
      "@type": "Thing",
      name: l.anchor,
      url: absoluteUrl(l.href),
    })),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: sections.reduce((n, s) => n + s.items.length, 0),
      itemListElement: sections
        .flatMap((s) => s.items)
        .map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.text,
        })),
    },
    ...SITE_REFERENCES,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 print:py-0">
      <PageTracker pageType="audience" locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="print:hidden">
        <Breadcrumbs
          locale={locale}
          trail={[t.home, t.tools, { name: audience.h1[locale], href: path }]}
        />
      </div>

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
        {audience.h1[locale]}
      </h1>
      <p className="mt-3 text-base text-muted-foreground print:text-foreground">
        {audience.intro[locale]}
      </p>
      <div className="mt-5">
        <PrintButton label={t.print} tool={audience.slug} locale={locale} />
      </div>

      {sections.map((section) => (
        <section
          key={section.id}
          aria-labelledby={section.id}
          className="mt-8 break-inside-avoid"
        >
          <h2 id={section.id} className="text-xl font-semibold">
            {section.title}
          </h2>
          <ul className="mt-3 space-y-3">
            {section.items.map((item) => (
              <li key={item.key} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 inline-block size-5 shrink-0 rounded border-2 border-muted-foreground/60"
                />
                <div>
                  <p>{item.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground print:hidden">
                    {t.source}{" "}
                    <Link
                      href={item.source.href}
                      className="text-primary hover:underline"
                    >
                      {item.source.name}
                    </Link>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="print:hidden">
        <section aria-labelledby="attacks" className="mt-12">
          <h2 id="attacks" className="text-xl font-semibold">
            {t.attacks}
          </h2>
          <LinkList links={links.attacks} compact />
        </section>

        {links.simulations.length > 0 && (
          <section aria-labelledby="simulations" className="mt-10">
            <h2 id="simulations" className="text-xl font-semibold">
              {t.simulations}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.simulationsNote}
            </p>
            <LinkList links={links.simulations} />
          </section>
        )}

        {links.guides.length > 0 && (
          <section aria-labelledby="guides" className="mt-10">
            <h2 id="guides" className="text-xl font-semibold">
              {t.guides}
            </h2>
            <LinkList links={links.guides} />
          </section>
        )}

        <section aria-labelledby="protection" className="mt-10">
          <h2 id="protection" className="text-xl font-semibold">
            {t.protection}
          </h2>
          <LinkList links={links.protection} />
        </section>

        <section aria-labelledby="audiences" className="mt-10">
          <h2 id="audiences" className="text-xl font-semibold">
            {t.audiences}
          </h2>
          <LinkList links={links.audiences} />
        </section>

        <section aria-labelledby="other-tools" className="mt-10">
          <h2 id="other-tools" className="text-xl font-semibold">
            {t.otherTools}
          </h2>
          <LinkList links={links.tools} compact />
        </section>
      </div>
    </article>
  );
}

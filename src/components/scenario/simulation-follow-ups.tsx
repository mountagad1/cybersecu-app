import { trackAttrs } from "@/lib/analytics";
import Link from "next/link";
import type { Locale } from "@/domain/i18n/locale";
import type { SimulationLinks } from "@/domain/linking/engine";

const STRINGS = {
  fr: {
    guides: "Le geste qui protège",
    levers: "Les ressorts de ce piège",
    audiences: "La checklist à imprimer",
  },
  en: {
    guides: "The gesture that protects",
    levers: "The levers behind this trap",
    audiences: "The checklist to print",
  },
} as const;

/**
 * Below the player on purpose: these pages explain the attack and its
 * defence, never which answer was right in this scenario. The links come
 * from the linking engine (`linksForSimulation`).
 */
export function SimulationFollowUps({
  links,
  locale,
}: {
  links: SimulationLinks;
  locale: Locale;
}) {
  const t = STRINGS[locale];
  return (
    <>
      {links.guides.length > 0 && (
        <section aria-labelledby="se-proteger" className="mt-8">
          <h2 id="se-proteger" className="text-lg font-semibold">
            {t.guides}
          </h2>
          <ul className="mt-2 space-y-1 text-sm">
            {links.guides.map((guide) => (
              <li key={guide.href}>
                <Link
                  href={guide.href}
                  {...trackAttrs({
                    name: "guide_click",
                    props: { from: "simulation", from_code: links.attack[0]?.code, guide: guide.code ?? "" },
                  })}
                  className="text-primary hover:underline"
                >
                  {guide.anchor}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {links.levers.length > 0 && (
        <section aria-labelledby="leviers" className="mt-6">
          <h2 id="leviers" className="text-lg font-semibold">
            {t.levers}
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {links.levers.map((lever) => (
              <li key={lever.href}>
                <Link
                  href={lever.href}
                  className="inline-block rounded-full border border-border px-3 py-1 transition-colors hover:border-primary hover:text-primary"
                >
                  {lever.anchor}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {links.audiences.length > 0 && (
        <section aria-labelledby="checklist" className="mt-6">
          <h2 id="checklist" className="text-lg font-semibold">
            {t.audiences}
          </h2>
          <ul className="mt-2 space-y-1 text-sm">
            {links.audiences.map((audience) => (
              <li key={audience.href}>
                <Link
                  href={audience.href}
                  className="text-primary hover:underline"
                >
                  {audience.anchor}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

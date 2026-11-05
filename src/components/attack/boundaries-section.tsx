import { trackAttrs } from "@/lib/analytics";
import Link from "next/link";
import type { LocalizedBoundary } from "@/content/attacks/boundaries";
import type { Locale } from "@/domain/i18n/locale";

const STRINGS: Record<
  Locale,
  { heading: string; difference: string; prefix: string }
> = {
  fr: {
    heading: "À ne pas confondre avec",
    difference: "Ce qui les distingue :",
    prefix: "/attaques",
  },
  en: {
    heading: "Not to be confused with",
    difference: "What tells them apart:",
    prefix: "/en/attaques",
  },
};

/**
 * « À ne pas confondre avec » on a fiche: for each neighbouring fiche, a
 * two-column comparison and the criterion that separates them
 * (src/content/attacks/boundaries.ts). A real table, so the comparison
 * reads the same to a screen reader as it does on screen.
 */
export function BoundariesSection({
  name,
  boundaries,
  locale,
  comparator,
  fromCode,
}: {
  name: string;
  boundaries: LocalizedBoundary[];
  locale: Locale;
  /** The comparator page, opened on this fiche's pair (linking engine). */
  comparator?: { href: string; anchor: string };
  /** The fiche this section sits on, for click measurement. */
  fromCode?: string;
}) {
  if (boundaries.length === 0) return null;
  const t = STRINGS[locale];
  return (
    <section aria-labelledby="not-to-confuse" className="mt-8">
      <h2 id="not-to-confuse" className="text-xl font-semibold">
        {t.heading}
      </h2>
      <div className="mt-3 space-y-6">
        {boundaries.map((b) => (
          <div key={b.other.code}>
            <table className="w-full table-fixed border-collapse text-sm">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border border-border bg-muted px-3 py-2 text-left font-semibold"
                  >
                    {name}
                  </th>
                  <th
                    scope="col"
                    className="border border-border bg-muted px-3 py-2 text-left font-semibold"
                  >
                    <Link
                      href={`${t.prefix}/${b.other.slug}`}
                      {...trackAttrs({
                        name: "related_attack_click",
                        props: { from: "attack", from_code: fromCode, to_attack: b.other.code, section: "boundary" },
                      })}
                      className="text-primary hover:underline"
                    >
                      {b.other.name}
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-2 align-top text-muted-foreground">
                    {b.self}
                  </td>
                  <td className="border border-border px-3 py-2 align-top text-muted-foreground">
                    {b.that}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-sm">
              <span className="font-semibold">{t.difference}</span>{" "}
              {b.difference}
            </p>
          </div>
        ))}
      </div>
      {comparator && (
        <p className="mt-4 text-sm">
          <Link
            href={comparator.href}
            className="font-medium text-primary hover:underline"
          >
            {comparator.anchor}
          </Link>
        </p>
      )}
    </section>
  );
}

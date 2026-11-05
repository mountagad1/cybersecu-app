"use client";

import { useToolTracking } from "@/lib/use-tool-tracking";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import type { Comparison } from "@/domain/attack/comparisons";
import type { Locale } from "@/domain/i18n/locale";

const STRINGS = {
  fr: {
    filter: "Je doute à propos de…",
    all: "Toutes les attaques",
    count: (n: number) => (n > 1 ? `${n} paires` : "1 paire"),
    question: (a: string, b: string) => `${a} ou ${b} ?`,
    plain: "En clair",
    here: "Face à l'autre",
    difference: "Ce qui les distingue :",
    simulation: "S'entraîner\u00a0:",
  },
  en: {
    filter: "I'm unsure about…",
    all: "All attacks",
    count: (n: number) => (n > 1 ? `${n} pairs` : "1 pair"),
    question: (a: string, b: string) => `${a} or ${b}?`,
    plain: "In plain terms",
    here: "Compared with the other",
    difference: "What tells them apart:",
    simulation: "Practice:",
  },
} as const;

/**
 * The comparator's interactive part: a filter by attack over the pairs.
 * Every pair is rendered on the server (the filter only narrows what is
 * shown), so the page reads in full without JavaScript and a link to
 * `#<pair>` lands on its section.
 */
export function ComparisonExplorer({
  comparisons,
  locale,
}: {
  comparisons: Comparison[];
  locale: Locale;
}) {
  const t = STRINGS[locale];
  const selectId = useId();
  const [code, setCode] = useState("");
  const tracking = useToolTracking("x-ou-y", locale);

  const attacks = useMemo(() => {
    const byCode = new Map<string, string>();
    for (const c of comparisons) {
      byCode.set(c.a.code, c.a.name);
      byCode.set(c.b.code, c.b.name);
    }
    return [...byCode.entries()].sort((x, y) =>
      x[1].localeCompare(y[1], locale),
    );
  }, [comparisons, locale]);

  const shown = code
    ? comparisons.filter((c) => c.a.code === code || c.b.code === code)
    : comparisons;

  return (
    <div>
      <div className="mt-8 flex flex-wrap items-end gap-3 print:hidden">
        <label htmlFor={selectId} className="text-sm font-semibold">
          {t.filter}
        </label>
        <select
          id={selectId}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            tracking.complete();
          }}
          className="min-h-11 w-full max-w-full rounded-md border border-border bg-background px-3 text-sm sm:w-auto"
        >
          <option value="">{t.all}</option>
          {attacks.map(([c, name]) => (
            <option key={c} value={c}>
              {name}
            </option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground" aria-live="polite">
          {t.count(shown.length)}
        </span>
      </div>

      <nav aria-label={t.count(shown.length)} className="mt-6">
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          {shown.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className="text-primary hover:underline">
                {t.question(c.a.name, c.b.name)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {shown.map((c) => (
        <section
          key={c.id}
          id={c.id}
          aria-labelledby={`${c.id}-title`}
          className="mt-10 scroll-mt-6 break-inside-avoid"
        >
          <h2 id={`${c.id}-title`} className="text-xl font-semibold">
            {t.question(c.a.name, c.b.name)}
          </h2>
          <table className="mt-3 w-full table-fixed border-collapse text-sm">
            <thead>
              <tr>
                {[c.a, c.b].map((side) => (
                  <th
                    key={side.code}
                    scope="col"
                    className="border border-border bg-muted px-3 py-2 text-left font-semibold"
                  >
                    <Link
                      href={side.href}
                      className="text-primary hover:underline"
                    >
                      {side.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  [t.plain, "plainLanguageDefinition"],
                  [t.here, "side"],
                ] as const
              ).map(([label, key]) => (
                <tr key={key}>
                  {[c.a, c.b].map((side) => (
                    <td
                      key={side.code}
                      className="border border-border px-3 py-2 align-top text-muted-foreground"
                    >
                      <span className="block text-xs font-semibold uppercase tracking-wide text-foreground/70">
                        {label}
                      </span>
                      {side[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm">
            <span className="font-semibold">{t.difference}</span> {c.difference}
          </p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm print:hidden">
            {[c.a, c.b].map((side) =>
              side.simulationHref ? (
                <Link
                  key={side.code}
                  href={side.simulationHref}
                  className="text-primary hover:underline"
                >
                  {t.simulation} {side.name}
                </Link>
              ) : null,
            )}
          </p>
        </section>
      ))}
    </div>
  );
}

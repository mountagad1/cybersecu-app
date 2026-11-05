import Link from "next/link";
import type { Locale } from "@/domain/i18n/locale";
import { linksForTool } from "@/domain/linking/engine";

const HEADING = { fr: "Les autres outils", en: "The other tools" } as const;

/**
 * « Les autres outils » at the end of a tool page: the tools that serve the
 * most fiches in common with this one, then the index of all tools
 * (`linksForTool`). Hidden when printing.
 */
export function RelatedTools({
  toolSlug,
  locale,
}: {
  toolSlug: string;
  locale: Locale;
}) {
  const { tools } = linksForTool(toolSlug, locale);
  if (tools.length === 0) return null;
  return (
    <section aria-labelledby="other-tools" className="mt-12 print:hidden">
      <h2 id="other-tools" className="text-xl font-semibold">
        {HEADING[locale]}
      </h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="block h-full rounded-md border border-border px-4 py-3 text-sm transition-colors hover:border-primary"
            >
              <span className="font-medium">{tool.anchor}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

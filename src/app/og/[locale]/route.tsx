import { notFound } from "next/navigation";
import { LOCALES, type Locale } from "@/domain/i18n/locale";
import { renderOgImage } from "@/lib/ogImage";

/**
 * Share image at a stable URL (`/og/fr`, `/og/en`), generated at build time.
 *
 * Not the `opengraph-image` file convention: metadata merges shallowly, so
 * any page that sets its own `openGraph` (nearly all of them) dropped the
 * inherited image. Pages reference this URL explicitly instead, through
 * `openGraph()` in `@/lib/open-graph`.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  return renderOgImage(locale as Locale);
}

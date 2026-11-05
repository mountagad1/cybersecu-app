import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";

/**
 * `/restaurer` consumes an emailed `?token=…` recovery link. It has no
 * informational value for a searcher, and a token-consuming endpoint should
 * not be an index entry point (docs/SEO_CURRENT_STATE_AUDIT.md H-4).
 *
 * `follow` is kept so the footer link's crawl path stays intact, and the
 * route is intentionally left crawlable in robots.txt — blocking it there
 * would stop crawlers ever seeing this noindex.
 */
export const metadata: Metadata = {
  title: "Restaurer mon accès",
  // Its own description and share URL: without them the page inherited the
  // home page's (docs/seo/METADATA_IMPLEMENTATION_REPORT.md). Still noindex.
  description: "Rouvrir sur cet appareil l'accès complet acheté, grâce au lien reçu par email.",
  openGraph: openGraph("fr", { title: "Restaurer mon accès", description: "Rouvrir sur cet appareil l'accès complet acheté, grâce au lien reçu par email.", type: "website", url: absoluteUrl("/restaurer") }),
  robots: { index: false, follow: true },
};

export default function RestaurerLayout({ children }: { children: React.ReactNode }) {
  return children;
}

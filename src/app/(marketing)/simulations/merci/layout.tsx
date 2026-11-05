import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Confirmation de paiement",
  // Its own description and share URL: without them the page inherited the
  // home page's (docs/seo/METADATA_IMPLEMENTATION_REPORT.md). Still noindex.
  description: "Confirmation de votre paiement et de l'ouverture de l'accès complet aux simulations.",
  openGraph: openGraph("fr", { title: "Confirmation de paiement", description: "Confirmation de votre paiement et de l'ouverture de l'accès complet aux simulations.", type: "website", url: absoluteUrl("/simulations/merci") }),
  robots: { index: false, follow: false },
};

export default function MerciLayout({ children }: { children: React.ReactNode }) {
  return children;
}

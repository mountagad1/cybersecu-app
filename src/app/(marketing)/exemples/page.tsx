import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { ScamGallery } from "@/components/attack/scam-gallery";
import { buildGallery, GALLERY_PATH } from "@/domain/attack/gallery";
import { languageAlternates } from "@/lib/hreflang";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const channels = buildGallery("fr");
const total = channels.reduce((sum, c) => sum + c.items.length, 0);

export const metadata: Metadata = {
  title: pageTitle(`Exemples d'arnaques : ${total} messages fictifs annotés, par canal`),
  description:
    "Emails, SMS, appels, QR codes, faux sites : des messages d'arnaque fictifs, avec ce qui les trahit et le levier exploité, reliés à leur fiche et simulation.",
  alternates: {
    canonical: GALLERY_PATH.fr,
    languages: languageAlternates({ fr: GALLERY_PATH.fr, en: GALLERY_PATH.en }),
  },
  openGraph: openGraph("fr", {
    title: "Galerie d'arnaques",
    description:
      "Des exemples fictifs annotés, classés par canal : ce qui les trahit, le levier exploité, la simulation pour s'entraîner.",
    type: "website",
    url: absoluteUrl(GALLERY_PATH.fr),
  }),
};

export default function ScamGalleryPage() {
  return <ScamGallery channels={channels} locale="fr" />;
}

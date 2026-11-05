import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { ScamGallery } from "@/components/attack/scam-gallery";
import { buildGallery, GALLERY_PATH } from "@/domain/attack/gallery";
import { languageAlternates } from "@/lib/hreflang";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const channels = buildGallery("en");
const total = channels.reduce((sum, c) => sum + c.items.length, 0);

export const metadata: Metadata = {
  title: pageTitle(`Scam examples: ${total} annotated fictional messages, by channel`),
  description:
    "Emails, texts, calls, QR codes, fake websites: fictional scam messages, with what gives them away and the lever they pull, each linked to its attack page.",
  alternates: {
    canonical: GALLERY_PATH.en,
    languages: languageAlternates({ fr: GALLERY_PATH.fr, en: GALLERY_PATH.en }),
  },
  openGraph: openGraph("en", {
    title: "Scam gallery",
    description:
      "Annotated fictional examples, sorted by channel: what gives them away, the lever they pull, the simulation to practice on.",
    type: "website",
    url: absoluteUrl(GALLERY_PATH.en),
  }),
};

export default function ScamGalleryPageEn() {
  return <ScamGallery channels={channels} locale="en" />;
}

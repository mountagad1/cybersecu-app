import type { Metadata } from "next";
import { ComparatorPage } from "@/components/tools/comparator-page";
import { findTool } from "@/content/tools";
import { COMPARATOR_PATH, COMPARATOR_SLUG } from "@/domain/attack/comparisons";
import { languageAlternates } from "@/lib/hreflang";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const tool = findTool(COMPARATOR_SLUG);
const title = tool.title;
const description = tool.description;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: COMPARATOR_PATH.fr,
    languages: languageAlternates({
      fr: COMPARATOR_PATH.fr,
      en: COMPARATOR_PATH.en,
    }),
  },
  openGraph: openGraph("fr", {
    title,
    description,
    type: "website",
    url: absoluteUrl(COMPARATOR_PATH.fr),
  }),
};

export default function ComparatorRoute() {
  return <ComparatorPage locale="fr" />;
}

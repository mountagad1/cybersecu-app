import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { notFound } from "next/navigation";
import { AudienceChecklist } from "@/components/tools/audience-checklist";
import {
  audiencePath,
  findAudienceBySlug,
  listAudiences,
} from "@/content/audiences";
import { languageAlternates } from "@/lib/hreflang";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";
/** Only the audience checklists live here; the other tools have their own folders. */
export const dynamicParams = false;

export function generateStaticParams() {
  return listAudiences().map((a) => ({ slug: a.enSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const audience = findAudienceBySlug((await params).slug, "en");
  if (!audience) return {};
  const path = audiencePath(audience, "en");
  return {
    title: pageTitle(audience.title.en),
    description: audience.description.en,
    alternates: {
      canonical: path,
      languages: languageAlternates({
        fr: audiencePath(audience, "fr"),
        en: path,
      }),
    },
    openGraph: openGraph("en", {
      title: audience.h1.en,
      description: audience.description.en,
      type: "website",
      url: absoluteUrl(path),
    }),
  };
}

export default async function AudienceChecklistPageEn({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const audience = findAudienceBySlug((await params).slug, "en");
  if (!audience) notFound();
  return <AudienceChecklist audience={audience} locale="en" />;
}

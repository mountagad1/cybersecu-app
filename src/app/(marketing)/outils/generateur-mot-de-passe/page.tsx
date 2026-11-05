import type { Metadata } from "next";
import { PASSWORD_TOOL_SLUG, PasswordGeneratorPage, passwordGeneratorPath } from "@/components/tools/password-generator-page";
import { findTool } from "@/content/tools";
import { languageAlternates } from "@/lib/hreflang";
import { openGraph } from "@/lib/open-graph";
import { pageTitle } from "@/lib/page-title";
import { absoluteUrl } from "@/lib/site";

// Static, and nothing about the visitor's settings or result is ever read
// from the URL: no password, option or result has an address of its own.
export const dynamic = "force-static";

const tool = findTool(PASSWORD_TOOL_SLUG);
const PATH = passwordGeneratorPath("fr");

export const metadata: Metadata = {
  title: pageTitle(tool.title),
  description: tool.description,
  alternates: {
    canonical: PATH,
    languages: languageAlternates({ fr: PATH, en: passwordGeneratorPath("en") }),
  },
  openGraph: openGraph("fr", {
    title: "Générateur de mot de passe",
    description: tool.description,
    type: "website",
    url: absoluteUrl(PATH),
  }),
};

export default function PasswordGeneratorFrPage() {
  return <PasswordGeneratorPage locale="fr" />;
}

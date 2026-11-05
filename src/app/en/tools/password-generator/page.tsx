import type { Metadata } from "next";
import { PASSWORD_TOOL_SLUG, PasswordGeneratorPage, passwordGeneratorPath } from "@/components/tools/password-generator-page";
import { findToolEn } from "@/content/tools";
import { languageAlternates } from "@/lib/hreflang";
import { openGraph } from "@/lib/open-graph";
import { pageTitle } from "@/lib/page-title";
import { absoluteUrl } from "@/lib/site";

/** English mirror of `(marketing)/outils/generateur-mot-de-passe/page.tsx`. */
export const dynamic = "force-static";

const tool = findToolEn(PASSWORD_TOOL_SLUG);
const PATH = passwordGeneratorPath("en");

export const metadata: Metadata = {
  title: pageTitle(tool.title),
  description: tool.description,
  alternates: {
    canonical: PATH,
    languages: languageAlternates({ fr: passwordGeneratorPath("fr"), en: PATH }),
  },
  openGraph: openGraph("en", {
    title: "Password generator",
    description: tool.description,
    type: "website",
    url: absoluteUrl(PATH),
  }),
};

export default function PasswordGeneratorEnPage() {
  return <PasswordGeneratorPage locale="en" />;
}

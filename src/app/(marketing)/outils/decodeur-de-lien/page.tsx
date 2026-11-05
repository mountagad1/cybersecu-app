import { PageTracker } from "@/components/analytics/page-tracker";
import Link from "next/link";
import { RelatedTools } from "@/components/tools/related-tools";
import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { openGraph } from "@/lib/open-graph";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { LinkDecoder } from "@/components/tools/link-decoder";
import { attacksForTool, englishToolSlug, findTool, guidesForTool } from "@/content/tools";
import { absoluteUrl } from "@/lib/site";
import { languageAlternates } from "@/lib/hreflang";

export const dynamic = "force-static";

const tool = findTool("decodeur-de-lien");
const englishSlug = englishToolSlug(tool.slug);

export const metadata: Metadata = {
  title: pageTitle("Décodeur de lien : à qui appartient cette adresse ?"),
  description: tool.description,
  alternates: {
    canonical: `/outils/${tool.slug}`,
    languages: languageAlternates({ fr: `/outils/${tool.slug}`, en: englishSlug && `/en/tools/${englishSlug}` }),
  },
  openGraph: openGraph("fr", {
    title: "Décodeur de lien",
    description: tool.description,
    type: "website",
    url: absoluteUrl(`/outils/${tool.slug}`),
  }),
};

export default function LinkDecoderPage() {
  const attacks = attacksForTool(tool);
  const guides = guidesForTool(tool);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageTracker pageType="tool" locale="fr" />
      <Breadcrumbs
        trail={[
          { name: "Accueil", href: "/" },
          { name: "Outils", href: "/outils" },
          { name: "Décodeur de lien", href: `/outils/${tool.slug}` },
        ]}
      />

      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Décodeur de lien</h1>
      <p className="mt-3 text-base text-muted-foreground">
        Collez une adresse reçue par SMS, email ou message. L&apos;outil montre qui possède réellement
        le site, ce qui n&apos;est que décor dans l&apos;adresse, et les caractères qui imitent
        d&apos;autres lettres. <strong className="text-foreground">L&apos;analyse se fait dans votre
        navigateur : l&apos;adresse n&apos;est envoyée nulle part, et le lien n&apos;est jamais
        ouvert.</strong>
      </p>

      <div className="mt-8">
        <LinkDecoder />
      </div>

      <section aria-labelledby="comment" className="mt-12">
        <h2 id="comment" className="text-xl font-semibold">
          Comment l&apos;outil lit une adresse
        </h2>
        <p className="mt-2 text-muted-foreground">
          Dans une adresse web, une seule partie désigne le propriétaire du site : le nom de domaine
          enregistré, juste avant l&apos;extension (« .fr », « .com », ou une extension composée comme
          « .gouv.fr »). Tout ce qui le précède est un sous-domaine, que ce propriétaire écrit comme il
          veut — y compris le nom d&apos;une banque. Tout ce qui le suit (le chemin, les paramètres)
          est également libre. L&apos;outil applique la liste publique des extensions utilisée par les
          navigateurs pour isoler ce nom, puis signale les procédés connus pour le masquer : un « @ »
          dans l&apos;adresse, un raccourcisseur de lien, des lettres d&apos;un autre alphabet, une
          majuscule qui imite une autre lettre.
        </p>
      </section>

      <section aria-labelledby="limites" className="mt-8">
        <h2 id="limites" className="text-xl font-semibold">
          Ce que l&apos;outil ne fait pas
        </h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>Il ne dit jamais qu&apos;un lien est « sûr » : il n&apos;a aucun moyen de le savoir.</li>
          <li>Il ne suit pas les redirections : pour un lien raccourci, la destination reste inconnue.</li>
          <li>
            Il ne remplace pas la règle de base : pour vous connecter ou payer, passez par un favori ou
            l&apos;application officielle.
          </li>
        </ul>
      </section>

      {guides.length > 0 && (
        <section aria-labelledby="guides" className="mt-10">
          <h2 id="guides" className="text-xl font-semibold">
            Pour aller plus loin
          </h2>
          <ul className="mt-3 space-y-2">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/guides/${guide.slug}`} className="text-primary hover:underline">
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {attacks.length > 0 && (
        <section aria-labelledby="attaques" className="mt-10">
          <h2 id="attaques" className="text-xl font-semibold">
            Les attaques qui reposent sur une adresse trompeuse
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {attacks.map((attack) => (
              <li key={attack.code}>
                <Link
                  href={`/attaques/${attack.slug}`}
                  className="block rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
                >
                  {attack.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <RelatedTools toolSlug="decodeur-de-lien" locale="fr" />
    </article>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { languageAlternates } from "@/lib/hreflang";
import { PUBLISHER } from "@/lib/publisher";

const TITLE = "À propos";
const DESCRIPTION =
  "Ce qu'est cybersecu.app, à qui il s'adresse, ce qu'il fait et ce qu'il ne fait pas : un outil d'entraînement aux réflexes face aux arnaques en ligne.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/a-propos", languages: languageAlternates({ fr: "/a-propos", en: "/en/about" }) },
  // Without its own `openGraph`, the page inherits the root one, whose URL is
  // the home page (docs/seo/COMPLETE_SEO_AUDIT.md CA-05).
  openGraph: openGraph("fr", { title: TITLE, description: DESCRIPTION, type: "website", url: absoluteUrl("/a-propos") }),
};

export default function AProposPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Breadcrumbs
        trail={[
          { name: "Accueil", href: "/" },
          { name: "À propos", href: "/a-propos" },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight">À propos de cybersecu.app</h1>

      <p className="mt-6 text-lg text-muted-foreground">
        cybersecu.app est un outil d&apos;entraînement. Son objectif n&apos;est pas de vous faire
        retenir des définitions, mais de vous faire acquérir un réflexe : marquer une pause et
        vérifier avant d&apos;agir, face à un message qui vous met sous pression.
      </p>

      <section aria-labelledby="pourquoi" className="mt-10">
        <h2 id="pourquoi" className="text-xl font-semibold">
          Pourquoi ce site existe
        </h2>
        <p className="mt-2 text-muted-foreground">
          Les arnaques en ligne ne reposent pas sur la naïveté des victimes, mais sur un moment
          d&apos;inattention exploité par un message crédible et urgent. Lire une explication ne
          suffit généralement pas à changer un comportement : le jour où le SMS arrive, c&apos;est
          la réaction automatique qui décide, pas la connaissance théorique.
        </p>
        <p className="mt-3 text-muted-foreground">
          C&apos;est la raison pour laquelle chaque fiche d&apos;attaque est associée, quand elle
          existe, à une <Link href="/simulations" className="text-primary underline">simulation
          jouable</Link> : voir le piège et se tromper sans conséquence est plus formateur que le
          lire.
        </p>
      </section>

      <section aria-labelledby="a-qui" className="mt-10">
        <h2 id="a-qui" className="text-xl font-semibold">
          À qui il s&apos;adresse
        </h2>
        <p className="mt-2 text-muted-foreground">
          À toute personne qui utilise un téléphone, une messagerie ou une carte bancaire au
          quotidien : particuliers, seniors, employés administratifs, commerçants, petites
          structures. Aucune connaissance technique n&apos;est supposée. Le vocabulaire technique
          est expliqué quand il est nécessaire, et évité quand il ne l&apos;est pas.
        </p>
      </section>

      <section aria-labelledby="ce-que-nous-faisons" className="mt-10">
        <h2 id="ce-que-nous-faisons" className="text-xl font-semibold">
          Ce que fait — et ne fait pas — ce site
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-base font-semibold">Ce que nous faisons</h3>
            <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>Expliquer le fonctionnement des techniques d&apos;arnaque courantes</li>
              <li>Proposer des simulations d&apos;entraînement sans risque</li>
              <li>Indiquer les signaux d&apos;alerte concrets et vérifiables</li>
              <li>Renvoyer vers les organismes officiels compétents</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-base font-semibold">Ce que nous ne faisons pas</h3>
            <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>
                Aucun conseil juridique, bancaire ou d&apos;assurance personnalisé
              </li>
              <li>Aucune intervention sur un compte compromis, ni assistance individuelle</li>
              <li>Aucun signalement à votre place</li>
              <li>Aucune revente de données personnelles</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Si vous êtes actuellement victime d&apos;une arnaque, ce site n&apos;est pas le bon
          interlocuteur : contactez votre banque et les organismes listés sur notre page{" "}
          <Link href="/sources" className="text-primary underline">
            sources et références
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="contenus" className="mt-10">
        <h2 id="contenus" className="text-xl font-semibold">
          Nos contenus sont fictifs, nos sources sont réelles
        </h2>
        <p className="mt-2 text-muted-foreground">
          Toutes les simulations (SMS, emails, appels, sites) sont des reconstitutions
          pédagogiques que nous écrivons nous-mêmes. Aucune ne reproduit un message réellement
          envoyé à une personne identifiable, et rien sur ce site ne permet de fabriquer une
          véritable tentative d&apos;hameçonnage.
        </p>
        <p className="mt-3 text-muted-foreground">
          En revanche, les mécanismes décrits et les chiffres cités proviennent de sources
          publiques vérifiables. Notre{" "}
          <Link href="/methodologie" className="text-primary underline">
            méthodologie
          </Link>{" "}
          détaille comment une fiche est produite et à quelles conditions elle est publiée.
        </p>
      </section>

      <section aria-labelledby="editeur" className="mt-10">
        <h2 id="editeur" className="text-xl font-semibold">
          Qui publie ce site
        </h2>
        <p className="mt-2 text-muted-foreground">
          cybersecu.app est publié par {PUBLISHER.name}, à titre personnel : il n&apos;existe pas
          de société derrière le site. {PUBLISHER.name} en assure l&apos;édition et la direction de
          la publication, et répond de chaque fiche publiée. Pour signaler une erreur ou poser une question :{" "}
          <a href={`mailto:${PUBLISHER.email}`} className="text-primary underline">
            {PUBLISHER.email}
          </a>
          .
        </p>
      </section>
    </article>
  );
}

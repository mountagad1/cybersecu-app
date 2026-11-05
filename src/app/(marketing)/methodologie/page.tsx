import Link from "next/link";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { languageAlternates } from "@/lib/hreflang";

const TITLE = "Méthodologie éditoriale";
const DESCRIPTION =
  "Comment une fiche d'attaque est produite, vérifiée et publiée sur cybersecu.app : critères de publication, traitement des sources, et limites assumées.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/methodologie", languages: languageAlternates({ fr: "/methodologie", en: "/en/methodology" }) },
  // Without its own `openGraph`, the page inherits the root one, whose URL is
  // the home page (docs/seo/COMPLETE_SEO_AUDIT.md CA-05).
  openGraph: openGraph("fr", { title: TITLE, description: DESCRIPTION, type: "website", url: absoluteUrl("/methodologie") }),
};

const PUBLISH_REQUIREMENTS = [
  {
    field: "Définition",
    detail: "Ce qu'est la technique, en une phrase compréhensible sans bagage technique.",
  },
  {
    field: "Fonctionnement",
    detail: "Le déroulé concret de l'attaque, du premier contact à l'objectif de l'attaquant.",
  },
  {
    field: "Signaux d'alerte",
    detail:
      "Au moins un indice observable par la personne ciblée — pas une caractéristique visible seulement après coup.",
  },
  {
    field: "Levier psychologique ou indicateur",
    detail:
      "Au moins un mécanisme de manipulation identifié (urgence, autorité, peur…) ou un indicateur technique rattaché.",
  },
] as const;

export default function MethodologiePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Breadcrumbs
        trail={[
          { name: "Accueil", href: "/" },
          { name: "Méthodologie", href: "/methodologie" },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight">Méthodologie éditoriale</h1>

      <p className="mt-6 text-lg text-muted-foreground">
        Une information de sécurité inexacte peut conduire quelqu&apos;un à baisser sa garde au
        mauvais moment. Cette page décrit comment nos contenus sont produits, et ce que nos
        mentions de vérification signifient exactement — y compris ce qu&apos;elles ne signifient
        pas.
      </p>

      <section aria-labelledby="gate" className="mt-10">
        <h2 id="gate" className="text-xl font-semibold">
          Une fiche n&apos;est pas publiée tant qu&apos;elle est incomplète
        </h2>
        <p className="mt-2 text-muted-foreground">
          Nous maintenons une base de techniques d&apos;attaque plus large que ce qui est
          publié. Une technique peut y être répertoriée sans page publique : tant que les éléments
          ci-dessous manquent, la fiche reste en préparation et n&apos;est pas mise en ligne.
        </p>
        <dl className="mt-4 space-y-3">
          {PUBLISH_REQUIREMENTS.map(({ field, detail }) => (
            <div key={field} className="rounded-lg border border-border bg-card p-4">
              <dt className="font-semibold">{field}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{detail}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-muted-foreground">
          Cette règle est appliquée par le logiciel, pas seulement par discipline éditoriale : la
          publication d&apos;une fiche incomplète est refusée techniquement. C&apos;est un choix
          délibéré — il vaut mieux une encyclopédie petite et fiable qu&apos;un catalogue
          volumineux de pages creuses.
        </p>
      </section>

      <section aria-labelledby="sources" className="mt-10">
        <h2 id="sources" className="text-xl font-semibold">
          Traitement des sources
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            Les chiffres cités proviennent d&apos;organismes publics ou d&apos;institutions
            reconnues, et sont accompagnés d&apos;un lien vers la publication d&apos;origine.
          </li>
          <li>
            Nous ne citons jamais une source qui n&apos;étaye pas réellement l&apos;affirmation
            qu&apos;elle accompagne.
          </li>
          <li>
            Nous ne recopions pas le texte des sources : nous expliquons le mécanisme avec nos
            propres mots, pour un public non spécialiste.
          </li>
          <li>
            Un chiffre sans source identifiable n&apos;est pas publié, même s&apos;il circule
            largement.
          </li>
        </ul>
        <p className="mt-3 text-muted-foreground">
          La liste des organismes sur lesquels nous nous appuyons figure sur la page{" "}
          <Link href="/sources" className="text-primary underline">
            sources et références
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="simulations" className="mt-10">
        <h2 id="simulations" className="text-xl font-semibold">
          Comment les simulations sont écrites
        </h2>
        <p className="mt-2 text-muted-foreground">
          Chaque simulation est un contenu original, écrit pour illustrer un mécanisme précis.
          Nous n&apos;utilisons jamais de message réellement reçu par une personne identifiable,
          et les entités imitées le sont de façon générique (« votre banque ») ou fictive, jamais
          pour nuire à une marque réelle.
        </p>
        <p className="mt-3 text-muted-foreground">
          Après chaque réponse, l&apos;explication indique la technique employée et le réflexe
          correct. Une erreur dans une simulation n&apos;est jamais présentée comme une faute :
          c&apos;est précisément le moment où l&apos;apprentissage a lieu.
        </p>
      </section>

      <section aria-labelledby="limites" className="mt-10">
        <h2 id="limites" className="text-xl font-semibold">
          Limites que nous assumons
        </h2>
        <div className="mt-3 rounded-lg border border-warning/30 bg-warning/5 p-5">
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>
              <strong className="font-semibold text-foreground">
                Nos contenus ne sont pas relus par un expert externe certifié.
              </strong>{" "}
              Ils sont rédigés à partir de sources publiques d&apos;organismes compétents, mais
              nous n&apos;affichons pas de mention « validé par un expert », car aucune
              validation de ce type n&apos;a eu lieu. Si cela change, cette page le dira.
            </li>
            <li>
              Notre couverture n&apos;est pas exhaustive. Nous ne prétendons pas recenser
              « toutes les cyberattaques » : nous couvrons les techniques qui visent le grand
              public et les petites structures, et cette couverture s&apos;étend progressivement.
            </li>
            <li>
              Les techniques d&apos;arnaque évoluent. Une fiche exacte aujourd&apos;hui peut
              devenir partiellement obsolète ; en cas de doute, l&apos;information d&apos;un
              organisme officiel prime sur la nôtre.
            </li>
            <li>
              Ce site ne remplace ni un conseil professionnel, ni un signalement auprès des
              autorités compétentes.
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="correction" className="mt-10">
        <h2 id="correction" className="text-xl font-semibold">
          Signaler une erreur
        </h2>
        <p className="mt-2 text-muted-foreground">
          Si une information vous paraît inexacte ou dépassée, nous préférons le savoir. Une
          correction factuelle est prioritaire sur toute autre évolution du site.
        </p>
      </section>
      <p className="mt-10 text-sm text-muted-foreground">
        Qui publie ce site, et dans quel but :{" "}
        <Link href="/a-propos" className="text-primary underline">
          à propos de cybersecu.app
        </Link>
        .
      </p>
    </article>
  );
}

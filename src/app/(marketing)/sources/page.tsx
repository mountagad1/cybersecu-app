import Link from "next/link";
import type { Metadata } from "next";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { languageAlternates } from "@/lib/hreflang";

const TITLE = "Sources et références";
const DESCRIPTION =
  "Les organismes publics et institutions sur lesquels s'appuient les contenus de cybersecu.app, et où signaler une arnaque ou obtenir de l'aide en France.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/sources", languages: languageAlternates({ fr: "/sources", en: "/en/sources" }) },
  // Without its own `openGraph`, the page inherits the root one, whose URL is
  // the home page (docs/seo/COMPLETE_SEO_AUDIT.md CA-05).
  openGraph: openGraph("fr", { title: TITLE, description: DESCRIPTION, type: "website", url: absoluteUrl("/sources") }),
};

/** Where a victim should actually go. Ordered by usefulness in an emergency. */
const HELP_FR = [
  {
    name: "Votre banque",
    what: "En cas de fraude bancaire, c'est le premier appel à passer, avant toute autre démarche : faire opposition limite le préjudice. Utilisez le numéro figurant au dos de votre carte, jamais un numéro reçu par message.",
  },
  {
    name: "Cybermalveillance.gouv.fr",
    what: "Dispositif national d'assistance aux victimes d'actes de cybermalveillance : diagnostic, conseils, mise en relation avec des prestataires.",
    url: "https://www.cybermalveillance.gouv.fr",
  },
  {
    name: "33700",
    what: "Numéro français de signalement des SMS et appels frauduleux : transférez le SMS suspect au 33700.",
  },
  {
    name: "PHAROS — internet-signalement.gouv.fr",
    what: "Plateforme officielle de signalement des contenus et comportements illicites publiés en ligne. Un signalement n'est ni un dépôt de plainte ni un appel d'urgence : en cas de danger immédiat, appelez le 17.",
    url: "https://www.internet-signalement.gouv.fr",
  },
  {
    name: "CNIL",
    what: "Autorité française de protection des données personnelles : recours en cas d'usage abusif de vos données.",
    url: "https://www.cnil.fr",
  },
] as const;

/** Institutional bodies whose public work informs our content. */
const REFERENCE_BODIES = [
  {
    name: "ANSSI",
    scope: "Agence nationale française de la sécurité des systèmes d'information.",
    url: "https://cyber.gouv.fr",
  },
  {
    name: "Cybermalveillance.gouv.fr",
    scope:
      "Publie des fiches de menaces et un rapport d'activité annuel documentant les sollicitations reçues en France.",
    url: "https://www.cybermalveillance.gouv.fr",
  },
  {
    name: "ENISA",
    scope: "Agence de l'Union européenne pour la cybersécurité ; rapports annuels sur le paysage des menaces.",
    url: "https://www.enisa.europa.eu",
  },
  {
    name: "Europol",
    scope: "Agence européenne de coopération policière ; analyses sur la criminalité organisée en ligne.",
    url: "https://www.europol.europa.eu",
  },
  {
    name: "CISA",
    scope: "Agence américaine de cybersécurité et de sécurité des infrastructures ; alertes et guides pratiques.",
    url: "https://www.cisa.gov",
  },
  {
    name: "FBI IC3",
    scope: "Centre américain de signalement de la criminalité en ligne ; rapport annuel sur les fraudes signalées.",
    url: "https://www.ic3.gov",
  },
  {
    name: "OWASP",
    scope: "Fondation de référence sur la sécurité applicative web.",
    url: "https://owasp.org",
  },
  {
    name: "Consortium Unicode",
    scope:
      "Publie les spécifications sur les caractères visuellement confusables, qui sous-tendent les attaques par homoglyphes.",
    url: "https://www.unicode.org",
  },
] as const;

export default function SourcesPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Breadcrumbs
        trail={[
          { name: "Accueil", href: "/" },
          { name: "Sources et références", href: "/sources" },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight">Sources et références</h1>

      <p className="mt-6 text-lg text-muted-foreground">
        Nos contenus s&apos;appuient sur des publications d&apos;organismes publics et
        d&apos;institutions reconnues. Cette page indique lesquels, et surtout où vous adresser
        si vous êtes concerné maintenant.
      </p>

      <section
        aria-labelledby="aide"
        className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-6"
      >
        <h2 id="aide" className="text-xl font-semibold">
          Vous êtes victime d&apos;une arnaque ?
        </h2>
        <p className="mt-2 text-muted-foreground">
          cybersecu.app est un site d&apos;entraînement : nous n&apos;intervenons pas sur un
          compte compromis et ne faisons aucun signalement à votre place. Adressez-vous
          directement aux organismes compétents.
        </p>
        <dl className="mt-5 space-y-4">
          {HELP_FR.map((item) => (
            <div key={item.name}>
              <dt className="font-semibold">
                {"url" in item && item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    {item.name}
                  </a>
                ) : (
                  item.name
                )}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">{item.what}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="organismes" className="mt-10">
        <h2 id="organismes" className="text-xl font-semibold">
          Organismes de référence
        </h2>
        <p className="mt-2 text-muted-foreground">
          Les travaux publics de ces organismes informent nos fiches. Nous les citons page par
          page, avec un lien vers la publication concernée, plutôt que de renvoyer globalement
          vers cette liste.
        </p>
        <dl className="mt-5 space-y-4">
          {REFERENCE_BODIES.map((body) => (
            <div key={body.name} className="rounded-lg border border-border bg-card p-4">
              <dt className="font-semibold">
                <a
                  href={body.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  {body.name}
                </a>
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">{body.scope}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="regles" className="mt-10">
        <h2 id="regles" className="text-xl font-semibold">
          Nos règles de citation
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
          <li>Un chiffre publié sur ce site est accompagné d&apos;un lien vers sa source.</li>
          <li>
            Nous ne citons pas une source pour étayer une affirmation qu&apos;elle ne soutient
            pas réellement.
          </li>
          <li>
            Lorsqu&apos;une information d&apos;un organisme officiel contredit la nôtre, c&apos;est
            la sienne qui fait foi.
          </li>
        </ul>
        <p className="mt-4 text-muted-foreground">
          Le détail du processus de production et de publication figure sur la page{" "}
          <Link href="/methodologie" className="text-primary underline">
            méthodologie éditoriale
          </Link>
          .
        </p>
      </section>
    </article>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { languageAlternates } from "@/lib/hreflang";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";
import { PUBLISHER } from "@/lib/publisher";

const TITLE = "Politique de confidentialité";
const DESCRIPTION =
  "Comment cybersecu.app collecte, utilise et protège vos données personnelles, et comment exercer vos droits.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/confidentialite", languages: languageAlternates({ fr: "/confidentialite", en: "/en/privacy" }) },
  // Without its own `openGraph`, the page inherits the root one, whose URL is
  // the home page (docs/seo/COMPLETE_SEO_AUDIT.md CA-05).
  openGraph: openGraph("fr", { title: TITLE, description: DESCRIPTION, type: "website", url: absoluteUrl("/confidentialite") }),
};

const LAST_UPDATED = "26 octobre 2026";

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dernière mise à jour : {LAST_UPDATED} ·{" "}
        <Link href="/en/privacy" hrefLang="en" lang="en" className="hover:text-foreground hover:underline">
          English translation
        </Link>
      </p>


      <section aria-labelledby="responsable" className="mt-8">
        <h2 id="responsable" className="text-xl font-semibold">
          1. Responsable du traitement
        </h2>
        <p className="mt-2 text-muted-foreground">
          cybersecu.app est édité à titre personnel par {PUBLISHER.name}, personne physique,
          responsable du traitement de vos données. Pour toute question relative à cette politique
          ou à vos données personnelles, écrivez à{" "}
          <a href={`mailto:${PUBLISHER.email}`} className="text-primary underline">
            {PUBLISHER.email}
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="donnees" className="mt-8">
        <h2 id="donnees" className="text-xl font-semibold">
          2. Données que nous collectons
        </h2>
        <p className="mt-2 text-muted-foreground">
          Nous appliquons un principe de minimisation des données : nous ne collectons que ce qui
          est nécessaire au fonctionnement du service.
        </p>
        <p className="mt-3 text-muted-foreground">
          <strong className="text-foreground">Aucun compte n&apos;est nécessaire</strong> pour
          utiliser le service. Un identifiant de session anonyme, aléatoire et non rattaché à
          votre identité, est stocké dans un cookie technique pour compter vos simulations
          gratuites et retrouver votre progression sur cet appareil.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Session anonyme</strong> : un identifiant généré
            aléatoirement, stocké dans un cookie technique signé. Il ne contient ni nom, ni email,
            ni adresse IP.
          </li>
          <li>
            <strong className="text-foreground">Historique d&apos;entraînement</strong> : pour
            chaque simulation jouée, la simulation concernée, le choix sélectionné, s&apos;il était
            correct, et les catégories d&apos;erreur associées (par ex. « a répondu à
            l&apos;urgence »). Nous ne stockons jamais de texte libre que vous auriez saisi.
          </li>
          <li>
            <strong className="text-foreground">Paiement</strong> : si vous débloquez
            l&apos;accès complet (29 €, paiement unique), le paiement est traité entièrement par
            Stripe — nous ne recevons ni ne stockons vos coordonnées bancaires. Stripe collecte
            votre adresse email lors du paiement ; nous n&apos;en conservons qu&apos;une empreinte
            cryptographique (hash), non réversible, utilisée uniquement pour retrouver votre accès
            si vous changez d&apos;appareil (voir « Restaurer mon accès »).
          </li>
          <li>
            <strong className="text-foreground">Cookies techniques</strong> : uniquement des
            cookies nécessaires au fonctionnement du service (session anonyme). Aucun cookie
            publicitaire ou de suivi tiers n&apos;est déposé à ce jour.
          </li>
        </ul>
        <p className="mt-3 text-muted-foreground">
          Les simulations elles-mêmes (SMS, emails, sites frauduleux reconstitués) sont des
          contenus pédagogiques entièrement fictifs que nous créons — ce ne sont jamais de vrais
          messages que vous auriez reçus.
        </p>
      </section>

      <section aria-labelledby="finalites" className="mt-8">
        <h2 id="finalites" className="text-xl font-semibold">
          3. Pourquoi nous utilisons ces données
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          <li>Faire fonctionner les simulations et compter vos 10 simulations gratuites.</li>
          <li>Traiter votre paiement et vous donner accès aux simulations débloquées.</li>
          <li>
            Vous permettre de restaurer votre accès sur un autre appareil, sans mot de passe, via
            un lien envoyé par email.
          </li>
          <li>Assurer la sécurité du service (détection d&apos;abus, journal d&apos;audit administrateur).</li>
          <li>Améliorer le contenu pédagogique à partir de statistiques agrégées et anonymisées.</li>
        </ul>
      </section>

      <section aria-labelledby="base-legale" className="mt-8">
        <h2 id="base-legale" className="text-xl font-semibold">
          4. Base légale
        </h2>
        <p className="mt-2 text-muted-foreground">
          Le traitement de vos données de session et d&apos;entraînement repose sur
          l&apos;exécution du contrat qui nous lie (les conditions d&apos;utilisation du service
          que vous avez acceptées) et, pour le paiement, sur l&apos;exécution de la vente. Les
          statistiques agrégées reposent sur notre intérêt légitime à améliorer le service.
        </p>
      </section>

      <section aria-labelledby="hebergement" className="mt-8">
        <h2 id="hebergement" className="text-xl font-semibold">
          5. Hébergement et sous-traitants
        </h2>
        <p className="mt-2 text-muted-foreground">
          Vos données sont hébergées chez Supabase (base de données), l&apos;application est
          servie par Vercel, les paiements sont traités par Stripe, et l&apos;email de restauration
          d&apos;accès est envoyé via Resend. Ces prestataires agissent en tant que sous-traitants
          au sens du RGPD et n&apos;utilisent vos données à aucune fin qui leur serait propre.
        </p>
      </section>

      <section aria-labelledby="conservation" className="mt-8">
        <h2 id="conservation" className="text-xl font-semibold">
          6. Durée de conservation
        </h2>
        <p className="mt-2 text-muted-foreground">
          Votre session anonyme et votre historique d&apos;entraînement sont conservés tant qu&apos;ils
          sont utiles au fonctionnement du service. L&apos;empreinte (hash) de votre email
          n&apos;est conservée que tant qu&apos;un accès actif y est associé. Les liens de
          restauration expirent automatiquement après 30 minutes et sont supprimables sur demande.
        </p>
      </section>

      <section aria-labelledby="droits" className="mt-8">
        <h2 id="droits" className="text-xl font-semibold">
          7. Vos droits
        </h2>
        <p className="mt-2 text-muted-foreground">
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
          d&apos;effacement, de limitation, de portabilité et d&apos;opposition sur vos données
          personnelles. Vous pouvez :
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          <li>Effacer les cookies de votre navigateur pour mettre fin à votre session anonyme.</li>
          <li>
            Nous écrire à{" "}
            <a href={`mailto:${PUBLISHER.email}`} className="text-primary underline">
              {PUBLISHER.email}
            </a>{" "}
            pour toute demande relative à vos données.
          </li>
          <li>
            Introduire une réclamation auprès de la CNIL (
            <a href="https://www.cnil.fr" className="text-primary underline" rel="noopener noreferrer" target="_blank">
              www.cnil.fr
            </a>
            ) si vous estimez que vos droits ne sont pas respectés.
          </li>
        </ul>
      </section>

      <section aria-labelledby="mineurs" className="mt-8">
        <h2 id="mineurs" className="text-xl font-semibold">
          8. Mineurs
        </h2>
        <p className="mt-2 text-muted-foreground">
          Le service s&apos;adresse au grand public, y compris aux seniors et aux familles. Un
          achat (29 €) par un mineur de moins de 15 ans nécessite le consentement d&apos;un
          titulaire de l&apos;autorité parentale, conformément à la loi française.
        </p>
      </section>

      <section aria-labelledby="modifications" className="mt-8">
        <h2 id="modifications" className="text-xl font-semibold">
          9. Modifications de cette politique
        </h2>
        <p className="mt-2 text-muted-foreground">
          Nous pouvons mettre à jour cette politique pour refléter des évolutions du service ou de
          la réglementation. La date de dernière mise à jour figure en haut de cette page.
        </p>
      </section>
    </article>
  );
}

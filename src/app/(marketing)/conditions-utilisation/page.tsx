import Link from "next/link";
import type { Metadata } from "next";
import { languageAlternates } from "@/lib/hreflang";
import { openGraph } from "@/lib/open-graph";
import { absoluteUrl } from "@/lib/site";
import { PUBLISHER } from "@/lib/publisher";
import { SALES_OPEN } from "@/lib/sales";

const TITLE = "Conditions générales d'utilisation";
const DESCRIPTION =
  "Les règles d'utilisation de cybersecu.app : ce que le service propose, vos engagements, et les limites de responsabilité.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/conditions-utilisation", languages: languageAlternates({ fr: "/conditions-utilisation", en: "/en/terms" }) },
  // Without its own `openGraph`, the page inherits the root one, whose URL is
  // the home page (docs/seo/COMPLETE_SEO_AUDIT.md CA-05).
  openGraph: openGraph("fr", { title: TITLE, description: DESCRIPTION, type: "website", url: absoluteUrl("/conditions-utilisation") }),
};

const LAST_UPDATED = "26 octobre 2026";

export default function TermsOfUsePage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Conditions générales d&apos;utilisation</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dernière mise à jour : {LAST_UPDATED} ·{" "}
        <Link href="/en/terms" hrefLang="en" lang="en" className="hover:text-foreground hover:underline">
          English translation
        </Link>
      </p>


      <section aria-labelledby="objet" className="mt-8">
        <h2 id="objet" className="text-xl font-semibold">
          1. Objet
        </h2>
        <p className="mt-2 text-muted-foreground">
          Les présentes conditions générales d&apos;utilisation (« CGU ») régissent
          l&apos;accès et l&apos;utilisation du service cybersecu.app, édité à titre personnel
          par {PUBLISHER.name}, personne physique (« nous »). Aucun compte n&apos;est requis pour
          utiliser le service : en utilisant le service, y compris de façon anonyme, vous acceptez
          ces CGU.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          <li>Éditeur et directeur de la publication : {PUBLISHER.name}.</li>
          <li>
            Contact :{" "}
            <a href={`mailto:${PUBLISHER.email}`} className="text-primary underline">
              {PUBLISHER.email}
            </a>
            .
          </li>
          <li>
            Hébergeur : {PUBLISHER.host.name}, {PUBLISHER.host.location} (
            <a href={PUBLISHER.host.url} className="text-primary underline" rel="noopener noreferrer" target="_blank">
              vercel.com
            </a>
            ).
          </li>
        </ul>
      </section>

      <section aria-labelledby="description" className="mt-8">
        <h2 id="description" className="text-xl font-semibold">
          2. Description du service
        </h2>
        <p className="mt-2 text-muted-foreground">
          cybersecu.app est un service pédagogique de sensibilisation à la cybersécurité. Il
          propose des simulations réalistes mais entièrement fictives de tentatives de phishing,
          smishing et autres techniques de manipulation, ainsi que des contenus explicatifs sur ces
          menaces. Aucune simulation ne provient d&apos;une source réelle et aucune fonctionnalité
          du service ne permet de créer ou d&apos;envoyer une véritable tentative de phishing.
        </p>
        <p className="mt-2 text-muted-foreground">
          Le service est fourni à titre d&apos;information et de sensibilisation. Il ne constitue
          ni un audit de sécurité, ni un conseil professionnel en cybersécurité, et ne garantit pas
          qu&apos;un utilisateur formé évitera systématiquement une attaque réelle.
        </p>
      </section>

      <section aria-labelledby="compte" className="mt-8">
        <h2 id="compte" className="text-xl font-semibold">
          3. Utilisation sans compte, offre gratuite et paiement
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          <li>
            Le service est utilisable sans création de compte : une session anonyme, stockée dans
            un cookie technique sur votre navigateur, permet de suivre votre utilisation.
          </li>
          <li>Vous disposez de 10 simulations gratuites par session anonyme.</li>
          <li>
            Au-delà, l&apos;accès complet aux simulations (actuelles et futures) est proposé pour
            29 €, en paiement unique, sans abonnement, via Stripe.
            {!SALES_OPEN && (
              <> Cette offre est actuellement suspendue : aucun achat n&apos;est possible pour le moment.</>
            )}
          </li>
          <li>
            L&apos;accès acheté est associé à votre session anonyme. Si vous supprimez les cookies
            de votre navigateur ou changez d&apos;appareil, vous pouvez restaurer votre accès via
            le lien envoyé par email lors de l&apos;achat (voir « Restaurer mon accès »).
          </li>
          <li>
            Le paiement est traité intégralement par Stripe ; nous n&apos;avons jamais accès à vos
            coordonnées bancaires.
          </li>
        </ul>
      </section>

      <section aria-labelledby="retractation" className="mt-8">
        <h2 id="retractation" className="text-xl font-semibold">
          4. Droit de rétractation
        </h2>
        <p className="mt-2 text-muted-foreground">
          Conformément à l&apos;article L221-28 13° du Code de la consommation, le droit de
          rétractation de 14 jours prévu pour les achats à distance ne s&apos;applique pas aux
          contenus numériques fournis sur un support immatériel dont l&apos;exécution a commencé
          après accord préalable exprès du consommateur et renoncement exprès à son droit de
          rétractation.
        </p>
        <p className="mt-2 text-muted-foreground">
          L&apos;accès complet aux simulations est débloqué immédiatement après confirmation du
          paiement. Avant de payer, vous devez donc cocher une case indiquant explicitement que
          vous acceptez cette exécution immédiate et que vous renoncez à votre droit de
          rétractation pour cet achat. Sans cette case cochée, le paiement ne peut pas être
          initié.
        </p>
        <p className="mt-2 text-muted-foreground">
          Cette renonciation ne vous prive d&apos;aucun autre droit prévu par le Code de la
          consommation, notamment en cas de non-conformité du service (section 8, Limitation de
          responsabilité) ou de remboursement décidé par nos soins ou par Stripe.
        </p>
      </section>

      <section aria-labelledby="usage" className="mt-8">
        <h2 id="usage" className="text-xl font-semibold">
          5. Usage autorisé
        </h2>
        <p className="mt-2 text-muted-foreground">Vous vous engagez à ne pas :</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted-foreground">
          <li>
            Utiliser les techniques, contenus ou méthodes présentés sur le service à des fins
            malveillantes réelles, y compris pour créer ou diffuser de véritables tentatives de
            phishing, smishing ou d&apos;ingénierie sociale ;
          </li>
          <li>Tenter de contourner les mesures de sécurité du service ou d&apos;accéder à des données d&apos;autres utilisateurs ;</li>
          <li>Extraire, copier ou republier le contenu pédagogique du service sans autorisation ;</li>
          <li>Utiliser des moyens automatisés (bots, scraping) pour accéder au service sans autorisation préalable.</li>
        </ul>
        <p className="mt-2 text-muted-foreground">
          Tout manquement à ces engagements peut entraîner la suspension de votre accès au
          service.
        </p>
      </section>

      <section aria-labelledby="propriete" className="mt-8">
        <h2 id="propriete" className="text-xl font-semibold">
          6. Propriété intellectuelle
        </h2>
        <p className="mt-2 text-muted-foreground">
          Les simulations, textes explicatifs, taxonomie des attaques, éléments graphiques et le
          nom « cybersecu.app » sont notre propriété ou celle de nos concédants. Aucune disposition
          des présentes CGU ne vous accorde de droit sur ce contenu au-delà d&apos;un usage
          personnel et non commercial dans le cadre de votre formation.
        </p>
      </section>

      <section aria-labelledby="disponibilite" className="mt-8">
        <h2 id="disponibilite" className="text-xl font-semibold">
          7. Disponibilité et évolution du service
        </h2>
        <p className="mt-2 text-muted-foreground">
          Le service est en développement actif et son contenu, ses fonctionnalités et son
          apparence peuvent évoluer. Nous nous efforçons d&apos;assurer une disponibilité continue
          mais ne garantissons pas une absence totale d&apos;interruption.
        </p>
      </section>

      <section aria-labelledby="responsabilite" className="mt-8">
        <h2 id="responsabilite" className="text-xl font-semibold">
          8. Limitation de responsabilité
        </h2>
        <p className="mt-2 text-muted-foreground">
          Le service est fourni à titre pédagogique, « en l&apos;état ». Dans la limite permise
          par la loi applicable, nous ne pouvons être tenus responsables des conséquences d&apos;une
          attaque réelle subie par un utilisateur, le service ayant une vocation de sensibilisation
          et non de garantie de protection.
        </p>
      </section>

      <section aria-labelledby="resiliation" className="mt-8">
        <h2 id="resiliation" className="text-xl font-semibold">
          9. Résiliation
        </h2>
        <p className="mt-2 text-muted-foreground">
          Vous pouvez cesser d&apos;utiliser le service à tout moment en supprimant les cookies de
          votre navigateur. Nous pouvons suspendre ou révoquer un accès en cas de violation de ces
          CGU, notamment de la section 5 (Usage autorisé), ou en cas de remboursement du paiement
          correspondant.
        </p>
      </section>

      <section aria-labelledby="droit-applicable" className="mt-8">
        <h2 id="droit-applicable" className="text-xl font-semibold">
          10. Droit applicable
        </h2>
        <p className="mt-2 text-muted-foreground">
          Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux
          tribunaux français compétents, sauf disposition impérative contraire applicable aux
          consommateurs.
        </p>
      </section>

      <section aria-labelledby="contact" className="mt-8">
        <h2 id="contact" className="text-xl font-semibold">
          11. Contact
        </h2>
        <p className="mt-2 text-muted-foreground">
          Pour toute question relative à ces CGU, écrivez à{" "}
          <a href={`mailto:${PUBLISHER.email}`} className="text-primary underline">
            {PUBLISHER.email}
          </a>
          .
        </p>
      </section>
    </article>
  );
}

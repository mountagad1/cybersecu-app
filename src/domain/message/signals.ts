import type { PsychologicalTriggerCode } from "@/domain/scenario/types";
import type { Locale } from "@/domain/i18n/locale";
import { LINK_SIGNAL_EN, SIGNALS_EN } from "./signals-en";

/**
 * The procedures the message analyzer recognises.
 *
 * Each signal is a technique documented elsewhere on the site, not a
 * keyword list: its explanation says why the procedure is used, and it
 * points to the fiches (and, where one fits, the psychological lever) that
 * describe it. Patterns run on a normalised copy of the text — lowercase,
 * accents removed, typographic apostrophes straightened — so they are
 * written without accents.
 *
 * Adding a signal: it must describe a procedure scams actually rely on,
 * be explainable in two sentences, and point to at least one published
 * fiche or lever. « Sounds suspicious » is not enough.
 */

export type SignalCode =
  | "urgence"
  | "menace"
  | "frais"
  | "paiement"
  | "carte-cadeau"
  | "changement-rib"
  | "code"
  | "identifiants"
  | "gain"
  | "autorite"
  | "proche"
  | "secret"
  | "rappel"
  | "colis"
  | "amende"
  | "logement"
  | "carte-sim"
  | "adresse-secours"
  | "deblocage"
  | "facture"
  | "compte"
  | "placement"
  | "emploi"
  | "acces-distance"
  | "chantage"
  | "lien";

export interface SignalDefinition {
  code: SignalCode;
  /** Short label shown as the result heading. */
  label: string;
  /** Why scams use this procedure, and what to do about it. */
  explanation: string;
  /** Run on the normalised text. Link detection has its own logic. */
  patterns: RegExp[];
  /** Fiches that rely on this procedure, used to rank similar attacks. */
  attackCodes: string[];
  lever?: PsychologicalTriggerCode;
}

export const SIGNALS: readonly SignalDefinition[] = [
  {
    code: "urgence",
    label: "Un délai très court",
    explanation:
      "Un délai de quelques minutes ou de quelques heures n'a qu'une fonction : vous faire agir avant d'avoir vérifié. Une demande légitime survit toujours à une heure de réflexion.",
    patterns: [
      /\burgent\w*/,
      /\bimmediatement\b/,
      /\bsans delai\b/,
      /\bau plus vite\b/,
      /\bdes maintenant\b/,
      /\bdernier (rappel|avertissement|avis|delai)\b/,
      /\b(sous|dans les|d'ici|avant) \d+ ?(h|heures?|minutes?|mn|min|jours?)\b/,
      /\bavant (ce soir|minuit|demain)\b/,
      /\b(expire|expirera|expireront|expiree?s?)\b/,
    ],
    attackCodes: [],
    lever: "urgency",
  },
  {
    code: "menace",
    label: "Une menace ou une sanction",
    explanation:
      "Compte bloqué, poursuites, majoration : la peur d'une conséquence pousse à chercher la solution proposée plutôt qu'à vérifier qui l'annonce. Un organisme réel vous laisse le temps et un moyen de vérifier par vous-même.",
    patterns: [
      /\b(suspendu|suspension|bloque|blocage|desactive|desactivation|resilie|resiliation|cloture)\w*/,
      /\b(poursuites?|huissier|plainte|majoration|majoree?|penalites?)\b/,
      /\b(sera|seront|serait) (supprime|perdu|detruit|annule|transmis)\w*/,
    ],
    attackCodes: [],
    lever: "fear",
  },
  {
    code: "frais",
    label: "De petits frais pour débloquer quelque chose",
    explanation:
      "Un montant de quelques euros pour libérer un colis, un gain ou un paiement sert rarement à encaisser ces euros : il sert à obtenir votre numéro de carte complet. Recevoir quelque chose ne demande jamais de payer d'abord.",
    patterns: [
      /\b[0-4](?:[,.]\d{1,2})? ?(?:€|eur\b|euros?\b)/,
      /\bfrais (de |d')(livraison|reexpedition|douane|dossier|traitement|deblocage|port|envoi|gestion)\b/,
    ],
    attackCodes: ["PAYMENT-000006", "PAYMENT-000009", "SOCIAL-000011"],
  },
  {
    code: "paiement",
    label: "Une demande de paiement ou de coordonnées bancaires",
    explanation:
      "Un message qui vous demande de payer, de virer ou de saisir votre carte vous fait faire vous-même l'opération : c'est ce qui la rend difficile à contester ensuite. Payez uniquement depuis votre espace officiel, que vous ouvrez vous-même.",
    patterns: [
      /\b(payer|paiement|regler|reglement|virement|virer|debit)\b/,
      /\b(carte bancaire|numero de carte|cryptogramme|date d'expiration|cvv|coordonnees bancaires)\b/,
      /\b(bitcoins?|crypto(-?monnaies?|-?actifs?)?|usdt)\b/,
    ],
    attackCodes: [],
  },
  {
    code: "carte-cadeau",
    label: "Un paiement par carte cadeau ou coupon",
    explanation:
      "Aucun organisme, aucun service client et aucune administration ne se fait payer en cartes cadeaux ou en coupons prépayés. Ce moyen est demandé parce qu'il est impossible à annuler et difficile à tracer.",
    patterns: [
      /\b(cartes?|coupons?|codes?) (cadeaux?|prepayes?|prepayees?)\b/,
      /\b(pcs|transcash|neosurf|paysafecard)\b/,
    ],
    attackCodes: ["SOCIAL-000003", "SOCIAL-000005"],
  },
  {
    code: "changement-rib",
    label: "Un changement de coordonnées bancaires",
    explanation:
      "Une nouvelle banque, un nouvel IBAN annoncé par message : c'est le procédé qui détourne un paiement attendu. Un changement de coordonnées se confirme toujours par téléphone, sur un numéro que vous aviez déjà.",
    patterns: [
      /\b(nouveaux? (rib|iban|coordonnees bancaires)|nouvelles? coordonnees bancaires)\b/,
      /\bchang\w* (de|d') ?(banque|rib|iban|etablissement bancaire|coordonnees bancaires)\b/,
    ],
    attackCodes: ["PAYMENT-000004", "PAYMENT-000002"],
  },
  {
    code: "code",
    label: "Une demande de code",
    explanation:
      "Un code reçu par SMS ou dans une application sert à prouver que c'est vous. Quiconque vous le demande — banque, support, proche — cherche à se faire passer pour vous. Aucun service ne demande jamais ce code.",
    patterns: [
      /\b(communiqu|transmet|donn|envoy|lis|lisez|indiqu|dict|confirm)\w*[^.\n]{0,40}\bcode\b/,
      /\bcode\b[^.\n]{0,40}\b(que vous (allez recevoir|venez de recevoir|avez recu)|recu par sms)\b/,
      /\bcode (de |d')?(validation|confirmation|verification|securite|activation|a usage unique)\b/,
    ],
    attackCodes: ["ACCT-000002", "AI-000006", "SOCIAL-000001"],
  },
  {
    code: "identifiants",
    label: "Une demande de connexion ou d'informations personnelles",
    explanation:
      "« Confirmez vos informations », « connectez-vous » : le lien mène à une copie de la page de connexion, et ce que vous y tapez part chez l'expéditeur. Pour vous connecter, passez par l'application ou un favori, jamais par le lien d'un message.",
    patterns: [
      /\bmots? de passe\b/,
      /\bidentifiants?\b/,
      /\b(connectez|reconnectez|identifiez|authentifiez)[- ]vous\b/,
      /\b(confirm|verifi|mett\w* a jour|actualis|complet)\w* (vos|votre) (informations|donnees|coordonnees|identite|compte|identifiants|dossier|profil)\b/,
    ],
    attackCodes: ["PHISH-000001", "SMS-000001", "AI-000004"],
  },
  {
    code: "gain",
    label: "Une bonne nouvelle inattendue",
    explanation:
      "Remboursement, gain, cadeau : une bonne nouvelle ne déclenche pas de méfiance, et c'est ce qui la rend utile. Un remboursement réel apparaît dans votre espace officiel, et un gain pour un jeu auquel vous n'avez pas joué n'existe pas.",
    patterns: [
      /\bfelicitations?\b/,
      /\b(vous avez|avez ete) (gagne|selectionne|tire au sort)\w*/,
      /\bgagn(ant|ante|ez)\b/,
      /\b(remboursement|trop[- ]percu|indemnisation)s?\b/,
      /\b(cadeau|recompense|prime) (offert|exceptionnel|a recuperer|vous attend)\w*/,
    ],
    attackCodes: ["PAYMENT-000001", "PAYMENT-000006"],
    lever: "reward",
  },
  {
    code: "autorite",
    label: "Un organisme ou une autorité",
    explanation:
      "Le nom d'une banque, d'une administration ou de la police coupe court aux questions : on n'ose pas vérifier. Ce nom peut être copié par n'importe qui. Vérifiez en contactant l'organisme vous-même, par un numéro ou un site que vous connaissez déjà.",
    patterns: [
      /\b(impots?|tresor public|finances publiques|assurance maladie|ameli|caf|urssaf|pole emploi|france travail|antai|police|gendarmerie|ministere|prefecture|tribunal|douanes?|administration)\b/,
      /\bservice (anti-?fraude|securite|des fraudes|contentieux|client)\b/,
      /\b(votre (banque|conseiller|agence)|conseiller bancaire)\b/,
    ],
    attackCodes: ["SOCIAL-000010", "SOCIAL-000001", "PAYMENT-000007"],
    lever: "authority",
  },
  {
    code: "proche",
    label: "Un proche qui a changé de numéro",
    explanation:
      "« C'est moi, j'ai un nouveau numéro » suivi d'une demande d'argent est le scénario de l'usurpation d'un proche. Appelez la personne sur son ancien numéro avant toute chose : c'est la vérification qui tranche.",
    patterns: [
      /\b(nouveau numero|change de numero|changer de numero)\b/,
      /\bmon (telephone|portable|tel) (est|s'est) (casse|tombe|perdu|en panne|mort)\b/,
      /\b(casse|perdu|noye) mon (telephone|portable|tel)\b/,
      /\bc'est moi\b/,
      /\b(maman|papa|mamie|papi|mamy|papy)\b/,
    ],
    attackCodes: ["SOCIAL-000005"],
    lever: "trust",
  },
  {
    code: "secret",
    label: "Une demande de discrétion",
    explanation:
      "« N'en parlez à personne » isole : la personne qui pourrait vous dire en dix secondes que c'est une arnaque est exactement celle qu'on vous demande de ne pas prévenir. Une demande d'argent confidentielle se vérifie toujours.",
    patterns: [
      /\bconfidenti\w*/,
      /\bdiscretion\b/,
      /\bn'en parle\w*/,
      /\bne (le )?(dites|dis|dit) (rien|a personne)\b/,
      /\bne prevenez personne\b/,
      /\bentre nous\b/,
    ],
    attackCodes: ["PAYMENT-000002", "SOCIAL-000005"],
    lever: "social_pressure",
  },
  {
    code: "rappel",
    label: "Un numéro à appeler",
    explanation:
      "Le numéro donné dans le message mène à l'expéditeur, pas à l'organisme. S'il est surtaxé, l'appel lui-même vous coûte. Pour joindre un organisme, utilisez le numéro inscrit sur votre carte, votre contrat ou son site officiel.",
    patterns: [
      /\b(appelez|rappelez|composez|contactez|joignez|telephonez)[^.\n]{0,40}(\+?\d[\d .-]{3,})/,
      /\b(appel|numero)[^.\n]{0,20}\b0 ?8 ?9\d/,
    ],
    attackCodes: ["SOCIAL-000003", "MAL-000010", "SOCIAL-000006", "MOB-000006"],
  },
  {
    code: "colis",
    label: "Un colis ou une livraison",
    explanation:
      "Ces messages sont envoyés en masse : une partie des destinataires attend forcément un colis. Rattachez toujours le message à un numéro de suivi que vous avez déjà, sur le site du transporteur ouvert par vous-même.",
    patterns: [
      /\b(colis|livraison|livreur|reexpedition|point relais|avis de passage|numero de suivi)\b/,
    ],
    attackCodes: ["SOCIAL-000002"],
  },
  {
    code: "amende",
    label: "Une amende ou une contravention",
    explanation:
      "Un avis de contravention arrive par courrier, pas par SMS avec un lien. Un montant à régler vite, sous peine de majoration, est le scénario de la fausse amende : vérifiez sur le site officiel de paiement des amendes, ouvert par vous-même, avec le numéro de l'avis.",
    patterns: [
      /\b(amende|contravention|proces-verbal|exces de vitesse|stationnement impaye|peage impaye)\w*/,
    ],
    attackCodes: ["PAYMENT-000007"],
  },
  {
    code: "logement",
    label: "Un logement à réserver à distance",
    explanation:
      "Un loyer bas, un propriétaire à l'étranger, des clés envoyées après virement : un logement réel se visite avant de payer quoi que ce soit, et son propriétaire se rencontre ou se joint par téléphone.",
    patterns: [
      /\b(loyer|caution|depot de garantie|appartement|logement|location)\b[^.\n]{0,80}\b(virement|payer|verser|reserver|cles)\b/,
    ],
    attackCodes: ["PAYMENT-000008"],
  },
  {
    code: "carte-sim",
    label: "Un changement de carte SIM",
    explanation:
      "Si vous n'avez rien demandé, quelqu'un fait transférer votre numéro sur sa carte pour recevoir vos codes de sécurité. Appelez immédiatement votre opérateur, sur le numéro de votre contrat ou de son site, pour bloquer la ligne.",
    patterns: [/\b(carte sim|nouvelle sim|esim|e-sim)\b/],
    attackCodes: ["ACCT-000004"],
  },
  {
    code: "adresse-secours",
    label: "Un changement d'adresse ou de numéro de récupération",
    explanation:
      "L'adresse de secours sert à reprendre un compte. Si elle change sans vous, quelqu'un prépare la réinitialisation de votre mot de passe. Connectez-vous vous-même tout de suite et annulez le changement dans les paramètres de sécurité.",
    patterns: [
      /\b(adresse|e-?mail|numero) (e-?mail |electronique )?de (recuperation|secours)\b/,
    ],
    attackCodes: ["ACCT-000009"],
  },
  {
    code: "deblocage",
    label: "Un paiement à « débloquer »",
    explanation:
      "Recevoir de l'argent ne demande jamais de « débloquer » quoi que ce soit, ni de se connecter à sa banque depuis un lien. Un paiement reçu se constate dans votre espace bancaire, ouvert par vous-même.",
    patterns: [
      /\b(debloquer|deblocage|liberer|recuperer) (les fonds|le paiement|votre paiement|l'argent|vos gains|votre argent)\b/,
    ],
    attackCodes: ["PAYMENT-000009", "PAYMENT-000003"],
  },
  {
    code: "facture",
    label: "Une facture à régler",
    explanation:
      "Une facture inattendue, au montant modeste, avec un lien de paiement, compte sur le fait que personne ne vérifie les petites sommes. Rapprochez-la d'une commande réelle et vérifiez auprès du prestataire, depuis votre propre compte.",
    patterns: [
      /\b(facture|renouvellement|abonnement) [^.\n]{0,40}\b(regler|payer|paiement|echeance|due?)\b/,
      /\bfacture n\W?\s?\w+/,
    ],
    attackCodes: ["PAYMENT-000005"],
  },
  {
    code: "compte",
    label: "Une alerte sur votre compte",
    explanation:
      "Une alerte de connexion ou d'activité suspecte peut être authentique, ou imitée pour vous faire cliquer. Dans les deux cas, la réponse est la même : ouvrez l'application ou le site du service vous-même et regardez l'historique de connexion.",
    patterns: [
      /\b(connexion|activite|tentatives?|acces) (inhabituel|suspect|non autorise|frauduleu)\w*/,
      /\btentatives? de connexion\b/,
      /\b(nouvel appareil|appareil (inconnu|non reconnu))\b/,
      /\bcompte (a ete )?(compromis|pirate|verrouille)\b/,
    ],
    attackCodes: ["ACCT-000001", "ACCT-000006", "ACCT-000003"],
  },
  {
    code: "placement",
    label: "Un placement ou un rendement",
    explanation:
      "Rendement élevé et risque nul ne vont jamais ensemble. Avant tout versement, vérifiez que la société est autorisée auprès du régulateur financier, et ne payez jamais pour récupérer de l'argent.",
    patterns: [
      /\b(rendement|placement|investi\w*|trading|plus-values?)\b/,
      /\b(gains?|benefices?) (garantis?|assures?|rapides?)\b/,
      /\b\d+ ?% (garantis?|par (jour|semaine|mois|an))\b/,
      /\bportefeuille\b/,
    ],
    attackCodes: ["PAYMENT-000003", "AI-000001"],
    lever: "financial_incentive",
  },
  {
    code: "emploi",
    label: "Une offre d'emploi ou de mission",
    explanation:
      "Un emploi facile et bien payé, proposé sans entretien, cache souvent des frais à avancer, une demande de documents d'identité ou l'usage de votre compte bancaire. Un employeur réel ne vous fait jamais payer.",
    patterns: [
      /\b(offre d'emploi|recrut\w+|poste (a pourvoir|disponible)|travail a domicile|missions? (simples?|remunerees?)|remuneration)\b/,
    ],
    attackCodes: ["SOCIAL-000011"],
  },
  {
    code: "acces-distance",
    label: "Une demande d'installer une application ou de prendre la main",
    explanation:
      "Installer une application de prise en main à distance donne à l'interlocuteur le contrôle de votre appareil, et de ce que vous y ouvrez — y compris votre banque. Aucun support ne vous contacte pour vous la faire installer.",
    patterns: [
      /\b(anydesk|teamviewer|quicksupport|prise en main a distance|controle a distance|acces a distance)\b/,
      /\b(installe|telecharge)\w* (l'application|le logiciel|l'appli|ce logiciel|cette application)\b/,
    ],
    attackCodes: ["SOCIAL-000003"],
  },
  {
    code: "chantage",
    label: "Un chantage à des images ou à des données",
    explanation:
      "« J'ai des vidéos de vous », « je publierai vos données » : ces messages sont souvent envoyés en masse, sans rien de réel derrière. Ne payez pas, ne répondez pas, gardez des captures et changez le mot de passe s'il est cité.",
    patterns: [
      /\b(webcam|filme|video de vous|videos de vous|images de vous|photos de vous|vos photos|vos videos)\b/,
      /\b(publi|diffus|envoi|envoy)\w*[^.\n]{0,30}\b(a (tous )?vos contacts|vos donnees|vos photos|la video|les videos)\b/,
    ],
    attackCodes: ["PERS-000002", "PERS-000010"],
  },
];

/** Shown for every link, whatever its address says. */
export const LINK_SIGNAL: Omit<SignalDefinition, "patterns"> = {
  code: "lien",
  label: "Un lien à ouvrir",
  explanation:
    "Le lien est le chemin que l'expéditeur a choisi pour vous. Même si l'adresse paraît correcte, pour vous connecter ou payer, passez par l'application officielle ou un favori. L'analyse de l'adresse ci-dessous dit à qui elle appartient, pas si le site est honnête.",
  attackCodes: ["PHISH-000001", "SMS-000001"],
};

export type SignalText = Omit<SignalDefinition, "patterns">;

/** A signal as a reader sees it, in their language. */
export function findSignal(
  code: string,
  locale: Locale = "fr",
): SignalText | undefined {
  const base: SignalText | undefined =
    code === LINK_SIGNAL.code
      ? LINK_SIGNAL
      : SIGNALS.find((s) => s.code === code);
  if (!base || locale === "fr") return base;
  const en = base.code === "lien" ? LINK_SIGNAL_EN : SIGNALS_EN[base.code];
  return { ...base, label: en.label, explanation: en.explanation };
}

/** Every signal, link included, in display order. */
export function listSignals(locale: Locale = "fr"): SignalText[] {
  return [...SIGNALS.map((s) => s.code), LINK_SIGNAL.code].map((code) =>
    findSignal(code, locale)!,
  );
}

/** The patterns a message is read with, in its language. */
export function signalPatterns(
  signal: SignalDefinition,
  locale: Locale,
): RegExp[] {
  return locale === "en" && signal.code !== "lien"
    ? SIGNALS_EN[signal.code].patterns
    : signal.patterns;
}

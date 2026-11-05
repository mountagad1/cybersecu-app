import type { SimulationEntry } from "./types";

/**
 * Simulations — fraudes financières, suite (lot 10).
 *
 * Mêmes règles de sûreté que les autres fichiers : toute entité est
 * fictive, tout domaine sous le TLD réservé `.test`, rien n'est jamais
 * saisi ni transmis. Même règle de rédaction : le mauvais choix est
 * celui qu'une personne raisonnable ferait.
 */
export const SIMULATIONS_FRAUDES_FINANCIERES_SUITE: SimulationEntry[] = [
  {
    versionId: "00000000-0000-4000-8000-000000000022",
    scenarioCode: "SCENARIO-000034",
    slug: "facture-renouvellement-nom-de-domaine",
    version: 1,
    attackCode: "PAYMENT-000005",
    channel: "email",
    targetProfile: "business",
    difficulty: 3,
    impersonatedEntity: "Registre fictif de noms de domaine",
    teaser: "Une facture de 89 € pour le renouvellement d'un nom de domaine que personne ne reconnaît vraiment.",
    content: {
      sender: "Service Facturation <facturation@registre-noms-domaines-fictif.example-not-real.test>",
      body: "FACTURE N° RF-2026-88431\n\nRenouvellement annuel de votre nom de domaine : 89,00 €\n\nÀ régler sous 8 jours pour éviter la suspension du service.\n\nRégler maintenant : https://registre-noms-domaines-fictif.example-not-real.test/paiement",
      ui: "email",
    },
    choices: [
      {
        id: "pay",
        label: "Je paie, le montant est raisonnable et le sujet plausible",
        mistakePatternCodes: ["MISSED_UNUSUAL_PAYMENT_REQUEST", "TRUSTED_DISPLAY_NAME", "RESPONDED_TO_URGENCY"],
      },
      {
        id: "forward",
        label: "Je transfère la facture au service comptable pour qu'il règle si c'est légitime",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check-registrar",
        label: "Je vérifie chez mon vrai registraire si un renouvellement est réellement dû",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["check-registrar"],
    explanations: {
      pay: {
        technique: "Fausse facture",
        indicator: "Montant modeste, délai de huit jours, menace de suspension",
        whyDangerous:
          "Le montant est choisi précisément pour rester sous le seuil auquel une facture attire l'attention, et l'expéditeur n'est pas votre registraire réel. Payer confirme surtout que l'adresse fonctionne et encourage l'envoi d'autres fausses factures.",
        reflex: "Un montant plausible n'est pas une preuve de légitimité ; c'est souvent le contraire, choisi pour ne pas éveiller de doute.",
      },
      forward: {
        technique: "Fausse facture",
        indicator: "Facture reçue sans bon de commande associé",
        whyDangerous:
          "Transférer sans vérifier reporte la décision plutôt que de la prendre : si personne dans l'organisation n'a passé la commande, le service comptable n'a aucun moyen de le savoir de son côté et pourrait payer sur la seule apparence de la facture.",
        reflex: "Une facture doit être rapprochée d'un bon de commande avant transfert, pas après.",
      },
      "check-registrar": {
        technique: "Fausse facture",
        indicator: "Expéditeur qui n'est pas le registraire chez qui le domaine a réellement été enregistré",
        whyDangerous:
          "C'est la bonne réponse. L'information exacte sur l'échéance et le prestataire réel du renouvellement se trouve dans votre propre compte chez le registraire, jamais dans un email reçu.",
        reflex: "Pour tout renouvellement, vérifiez auprès du prestataire réel, identifié depuis votre propre compte, jamais depuis l'email reçu.",
      },
      unsure: {
        technique: "Fausse facture",
        indicator: "Facture d'apparence professionnelle pour un service technique",
        whyDangerous: "Ne pas payer ne fait courir aucun risque de suspension réelle.",
        reflex: "Dans le doute, vérifiez auprès du prestataire réel avant tout règlement.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000023",
    scenarioCode: "SCENARIO-000035",
    slug: "gain-loterie-frais-de-dossier",
    version: 1,
    attackCode: "PAYMENT-000006",
    channel: "email",
    targetProfile: "senior",
    difficulty: 2,
    impersonatedEntity: "Loterie internationale fictive",
    teaser: "Un email annonce un gain de 850 000 €. Des frais de dossier sont à régler avant le versement.",
    content: {
      sender: "Loterie Internationale Fictive <gains@loterie-internationale-fictive.example-not-real.test>",
      body: "FÉLICITATIONS !\n\nVotre adresse email a été tirée au sort et vous avez gagné 850 000 € à la Loterie Internationale.\n\nPour recevoir votre gain, un frais de dossier de 450 € doit être réglé (déduit ensuite du montant total).\n\nContactez notre agent : M. Robert Fontaine, disponible 24h/24.",
      ui: "email",
    },
    choices: [
      {
        id: "pay-fee",
        label: "Je paie les frais, ils seront de toute façon déduits du gain",
        mistakePatternCodes: ["MISSED_UNUSUAL_PAYMENT_REQUEST", "TRUSTED_AUTHORITY"],
      },
      {
        id: "ask-details",
        label: "Je demande d'abord plus de détails sur la loterie avant de décider",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "delete",
        label: "Je supprime le message : je n'ai participé à aucune loterie",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["delete"],
    explanations: {
      "pay-fee": {
        technique: "Fausse loterie",
        indicator: "Frais de dossier demandé avant le versement d'un gain",
        whyDangerous:
          "Un gain réel ne demande jamais d'avance de fonds : les frais éventuels, s'il y en a, se prélèvent sur la somme due, ils ne se paient jamais avant. Cette règle suffit à trancher sans avoir besoin d'enquêter davantage sur la loterie elle-même.",
        reflex: "Aucun gain légitime n'exige un paiement préalable, quel que soit le nom donné à ce paiement.",
      },
      "ask-details": {
        technique: "Fausse loterie",
        indicator: "Interlocuteur disponible en continu, prêt à fournir des détails supplémentaires",
        whyDangerous:
          "Demander des détails engage une conversation avec quelqu'un dont c'est précisément le métier de la rendre convaincante. Le point qui tranche n'est pas le niveau de détail fourni, mais le fait qu'aucune loterie à laquelle vous n'avez pas joué ne peut vous avoir désigné.",
        reflex: "Le manque de détails n'est pas le problème ; l'absence de participation à un jeu quelconque l'est.",
      },
      delete: {
        technique: "Fausse loterie",
        indicator: "Gain annoncé pour un jeu auquel vous n'avez jamais participé",
        whyDangerous:
          "C'est la bonne réponse. Un jeu auquel vous n'avez pas joué ne peut matériellement pas vous avoir désigné gagnant ; il n'y a rien d'autre à vérifier.",
        reflex: "Un gain pour un jeu auquel vous n'avez pas participé se supprime sans autre examen.",
      },
      unsure: {
        technique: "Fausse loterie",
        indicator: "Montant très élevé annoncé sans participation préalable",
        whyDangerous: "Ne rien faire ne fait perdre aucun gain réel.",
        reflex: "Dans le doute face à un gain inattendu, la règle est simple : aucun gain légitime ne demande de paiement avant versement.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000024",
    scenarioCode: "SCENARIO-000036",
    slug: "sms-amende-stationnement-impayee",
    version: 1,
    attackCode: "PAYMENT-000007",
    channel: "sms",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Service fictif de paiement des amendes",
    teaser: "Un SMS annonce une amende de stationnement impayée, à régler sous 48 heures.",
    content: {
      sender: "AmendeService",
      body: "Avis de contravention n°FR88231 non réglé. Majoration sous 48h. Réglez sur : amende-service-fictif.example-not-real.test/payer",
      ui: "sms",
    },
    choices: [
      {
        id: "pay-link",
        label: "Je paie via le lien avant la majoration",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "RESPONDED_TO_URGENCY", "CLICKED_UNKNOWN_LINK"],
      },
      {
        id: "call-back",
        label: "Je réponds au SMS pour demander plus d'informations sur cette amende",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "official-site",
        label: "Je me rends sur le site officiel de paiement des amendes et recherche l'avis avec son numéro",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["official-site"],
    explanations: {
      "pay-link": {
        technique: "Fausse amende",
        indicator: "Avis de contravention reçu par SMS et domaine qui n'est pas celui du service officiel",
        whyDangerous:
          "Les avis de contravention réels sont notifiés par courrier, pas par SMS. Le domaine du lien n'est pas celui du service officiel de paiement, et la majoration sous 48 heures sert uniquement à empêcher la vérification.",
        reflex: "Un avis de contravention par SMS n'est déjà pas le canal habituel ; c'est un premier signal suffisant pour ne pas suivre le lien.",
      },
      "call-back": {
        technique: "Fausse amende",
        indicator: "Numéro d'avis précis, destiné à paraître vérifiable",
        whyDangerous:
          "Répondre au SMS engage une conversation avec l'expéditeur du message suspect lui-même, qui confirmera ce qu'il veut bien confirmer. Le numéro d'avis fourni ne prouve rien tant qu'il n'a pas été recherché sur le service officiel.",
        reflex: "Ne demandez jamais confirmation à l'expéditeur d'un message que vous mettez en doute.",
      },
      "official-site": {
        technique: "Fausse amende",
        indicator: "Numéro d'avis vérifiable indépendamment du message reçu",
        whyDangerous:
          "C'est la bonne réponse. Le service officiel de paiement des amendes permet de rechercher un avis par son numéro : une amende réelle y figure, une amende absente n'existe pas.",
        reflex: "Ne suivez jamais le lien reçu : rejoignez le service officiel par vos propres moyens et recherchez l'avis avec son numéro.",
      },
      unsure: {
        technique: "Fausse amende",
        indicator: "Délai de 48 heures et menace de majoration",
        whyDangerous: "Ne rien faire dans l'immédiat ne fait courir aucun risque : une amende réelle reste due et se règle sans précipitation.",
        reflex: "Dans le doute, vérifiez sur le service officiel avant tout paiement.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000025",
    scenarioCode: "SCENARIO-000037",
    slug: "location-appartement-sans-visite",
    version: 1,
    attackCode: "PAYMENT-000008",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Propriétaire fictif d'un appartement",
    teaser: "Un appartement très bien situé, loué en dessous du prix du marché. Le propriétaire est à l'étranger.",
    content: {
      sender: "« Propriétaire » — messagerie d'une plateforme d'annonces",
      body: "Bonjour, je suis actuellement à l'étranger pour mon travail, c'est pourquoi le loyer est un peu plus bas — je veux louer rapidement. L'appartement est disponible tout de suite.\n\nJe ne peux pas vous faire visiter moi-même, mais je peux vous envoyer plus de photos. Pour réserver, il faut un virement du premier mois et de la caution ; je vous envoie les clés par un service de messagerie une fois le paiement reçu.",
      ui: "web",
    },
    choices: [
      {
        id: "transfer",
        label: "Je transfère le premier mois et la caution pour réserver le logement",
        mistakePatternCodes: ["MISSED_UNUSUAL_PAYMENT_REQUEST", "RESPONDED_TO_URGENCY"],
      },
      {
        id: "partial",
        label: "Je transfère juste la caution, en gardant le loyer pour plus tard",
        mistakePatternCodes: ["MISSED_UNUSUAL_PAYMENT_REQUEST"],
      },
      {
        id: "refuse-visit",
        label: "Je refuse tout versement avant d'avoir visité le logement et rencontré la personne",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["refuse-visit"],
    explanations: {
      transfer: {
        technique: "Arnaque à la location",
        indicator: "Impossibilité de visiter, prix sous le marché, propriétaire injoignable par téléphone",
        whyDangerous:
          "Réunis, ces éléments sont le scénario classique : un logement qui n'appartient pas à l'expéditeur, ou qui n'existe pas, loué en urgence à distance pour que le versement précède toute vérification possible. Une fois le virement fait, il n'y a ni logement ni recours simple.",
        reflex: "Aucun logement réel ne se réserve par virement avant une visite, quelle que soit la raison invoquée pour l'absence du propriétaire.",
      },
      partial: {
        technique: "Arnaque à la location",
        indicator: "Paiement demandé avant toute visite",
        whyDangerous:
          "Réduire le montant versé limite la perte mais ne change rien au problème : aucune somme ne doit être versée avant d'avoir vu le logement, qu'il s'agisse de la caution seule ou du loyer complet.",
        reflex: "Ce n'est pas le montant qui doit être réduit, c'est la demande de paiement avant visite qui doit être refusée.",
      },
      "refuse-visit": {
        technique: "Arnaque à la location",
        indicator: "Aucune visite possible, aucun contact téléphonique",
        whyDangerous:
          "C'est la bonne réponse. Un logement réel se visite, et son propriétaire ou son mandataire peut être rencontré ou au moins joint par téléphone. L'absence des deux est disqualifiante en soi.",
        reflex: "Ne versez jamais d'argent pour un logement avant de l'avoir visité et d'avoir rencontré une personne réelle.",
      },
      unsure: {
        technique: "Arnaque à la location",
        indicator: "Prix attractif et disponibilité immédiate",
        whyDangerous: "Ne rien verser ne fait perdre qu'un logement dont l'existence n'est de toute façon pas vérifiée.",
        reflex: "Dans le doute, exigez une visite avant tout versement — c'est le critère qui prime sur tous les autres.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000026",
    scenarioCode: "SCENARIO-000038",
    slug: "annonce-lien-deblocage-paiement",
    version: 1,
    attackCode: "PAYMENT-000009",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Acheteur fictif sur une plateforme de petites annonces",
    teaser: "Un acheteur accepte votre prix sans négocier, puis envoie un lien pour « débloquer » le paiement.",
    content: {
      sender: "« Acheteur intéressé » — messagerie d'une plateforme de petites annonces",
      body: "Bonjour, je le prends au prix indiqué, pas de souci ! J'ai déjà envoyé le paiement via le service sécurisé de la plateforme.\n\nPour débloquer les fonds sur votre compte, cliquez sur ce lien et connectez-vous avec vos identifiants bancaires : plateforme-annonces-paiement.example-not-real.test/deblocage",
      ui: "web",
    },
    choices: [
      {
        id: "unlock",
        label: "Je clique sur le lien et me connecte pour débloquer le paiement",
        mistakePatternCodes: ["MISSED_UNUSUAL_PAYMENT_REQUEST", "CLICKED_UNKNOWN_LINK", "SHARED_CREDENTIAL"],
      },
      {
        id: "ask-code",
        label: "Je demande à l'acheteur de m'envoyer un code de confirmation à la place",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check-account",
        label: "Je vérifie mon compte bancaire directement, sans passer par le lien envoyé",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["check-account"],
    explanations: {
      unlock: {
        technique: "Arnaque à la petite annonce",
        indicator: "Lien envoyé pour « débloquer » un paiement, demandant des identifiants bancaires",
        whyDangerous:
          "Recevoir de l'argent ne demande jamais de se connecter à son espace bancaire depuis un lien reçu par message. Ce lien mène à une copie de la page de connexion de votre banque, et les identifiants saisis partent directement chez l'attaquant.",
        reflex: "Aucun paiement reçu ne nécessite de « débloquer » quoi que ce soit via un lien. C'est le signal à lui seul.",
      },
      "ask-code": {
        technique: "Arnaque à la petite annonce",
        indicator: "Prétexte de déblocage qui n'existe dans aucun système de paiement réel",
        whyDangerous:
          "Demander un code différent reste dans le cadre fixé par l'attaquant, qui adaptera sa demande. Le problème n'est pas la nature de la preuve demandée, c'est qu'aucun encaissement légitime ne passe par une étape de « déblocage » externe à votre banque.",
        reflex: "Le prétexte du déblocage est la faille du scénario, quelle que soit la forme qu'il prend ensuite.",
      },
      "check-account": {
        technique: "Arnaque à la petite annonce",
        indicator: "Encaissement qui se constate directement sur le compte, sans intermédiaire",
        whyDangerous:
          "C'est la bonne réponse. Un virement ou un paiement reçu apparaît sur votre compte quand vous vous y connectez par vos propres moyens ; aucune étape supplémentaire n'est nécessaire pour en disposer.",
        reflex: "Vérifiez toujours la réception d'un paiement directement sur votre compte, jamais via un lien fourni par l'autre partie.",
      },
      unsure: {
        technique: "Arnaque à la petite annonce",
        indicator: "Acceptation immédiate du prix, sans négociation",
        whyDangerous: "Ne pas cliquer sur le lien ne fait perdre aucune vente réelle : un vrai acheteur paiera par les moyens habituels de la plateforme.",
        reflex: "Dans le doute, ignorez tout lien de « déblocage » et vérifiez votre compte directement.",
      },
    },
  },
];

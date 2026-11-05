import type { SimulationEntry } from "./types";

/**
 * Simulations — sites et navigateurs, fiches restantes (lot 10 + suite).
 *
 * Mêmes règles de sûreté que les autres fichiers. Voir
 * `noSimulationReason` sur `clickjacking` et `detournement-de-navigateur`
 * (src/content/attacks/sites-et-navigateurs.ts) pour pourquoi ces deux-là
 * n'ont pas de simulation.
 *
 * `adresse-mal-tapee-service-streaming` (IDN-000001, typosquatting)
 * comble un vrai manque : la seule autre fiche « adresse presque
 * correcte » du fichier voisin (sites-et-navigateurs.ts) était en
 * réalité un exemple d'homoglyphe — un caractère différent mais
 * visuellement identique, jamais repérable même à la relecture — et
 * avait été mal reliée à IDN-000001 au lieu de IDN-000002. Le
 * typosquatting, lui, est une vraie faute de frappe : visible pour qui
 * relit l'adresse, ce qui distingue pédagogiquement les deux scénarios.
 */
export const SIMULATIONS_SITES_ET_NAVIGATEURS_SUITE2: SimulationEntry[] = [
  {
    versionId: "00000000-0000-4000-8000-000000000034",
    scenarioCode: "SCENARIO-000052",
    slug: "onglet-demande-reconnexion-inattendue",
    version: 1,
    attackCode: "WEB-000008",
    channel: "web",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Service de messagerie fictif, dans un onglet resté ouvert",
    teaser: "Vous revenez sur un onglet resté ouvert en arrière-plan : il demande de vous reconnecter.",
    content: {
      sender: "Onglet resté ouvert pendant que vous consultiez un autre site",
      body: "Votre session a expiré.\nVeuillez vous reconnecter pour continuer.\n\nAdresse email : ____\nMot de passe : ____\n\n[ Se reconnecter ]",
      ui: "web",
    },
    choices: [
      {
        id: "reconnect",
        label: "Je me reconnecte : c'est l'onglet de ma messagerie, ouvert depuis un moment",
        mistakePatternCodes: ["TRUSTED_DISPLAY_NAME", "SHARED_CREDENTIAL"],
      },
      {
        id: "check-url-only",
        label: "Je regarde vite l'adresse affichée, elle semble correcte, et je me reconnecte",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN"],
      },
      {
        id: "close-reopen",
        label: "Je ferme cet onglet et rouvre le service depuis un favori",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["close-reopen"],
    explanations: {
      reconnect: {
        technique: "Tabnabbing",
        indicator: "Demande de reconnexion sur un onglet resté ouvert en arrière-plan",
        whyDangerous:
          "Un onglet laissé ouvert peut voir son contenu modifié pendant que vous étiez ailleurs, sans que rien ne vous alerte : vous lui accordez la confiance qu'il avait à son ouverture, pas celle qu'il mérite maintenant. Une session qui expire réellement ne le fait pas systématiquement de cette façon.",
        reflex: "Un onglet ancien n'a pas plus de légitimité qu'un lien reçu : ce qu'il affiche a pu changer pendant qu'il était en arrière-plan.",
      },
      "check-url-only": {
        technique: "Tabnabbing",
        indicator: "Adresse observée rapidement plutôt que relue en entier",
        whyDangerous:
          "Un coup d'œil rapide sur une adresse manque souvent la différence qui compte, surtout sur un onglet dont on suppose déjà la légitimité. Relire une adresse suppose de la lire comme si l'onglet venait d'être ouvert, pas de confirmer une impression déjà formée.",
        reflex: "Vérifier une adresse en confirmant une impression n'est pas la même chose que la relire réellement.",
      },
      "close-reopen": {
        technique: "Tabnabbing",
        indicator: "Reconnexion demandée sans navigation explicite de votre part",
        whyDangerous:
          "C'est la bonne réponse. Fermer l'onglet et rouvrir le service depuis un favori revient à ignorer entièrement ce que l'onglet affichait, ce qui neutralise l'attaque quelle que soit son apparence.",
        reflex: "Devant une demande de reconnexion inattendue sur un onglet ancien, fermez-le et rouvrez le service par vos propres moyens.",
      },
      unsure: {
        technique: "Tabnabbing",
        indicator: "Apparence familière du service habituel",
        whyDangerous: "Fermer l'onglet et en rouvrir un nouveau ne fait perdre aucune session légitime, qui redemandera une connexion de la même façon.",
        reflex: "Dans le doute face à une reconnexion inattendue, fermez l'onglet et repartez d'un favori.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000040",
    scenarioCode: "SCENARIO-000064",
    slug: "adresse-mal-tapee-service-streaming",
    version: 1,
    attackCode: "IDN-000001",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Service de streaming fictif",
    teaser: "Tapée de mémoire, l'adresse comporte une lettre en trop. La page qui s'affiche semble pourtant identique.",
    content: {
      sender: "Barre d'adresse du navigateur",
      body: "Adresse tapée de mémoire : https://streamplixx.example-not-real.test/connexion\n\n(l'adresse habituelle du service est « streamplix », sans le second x)\n\nLa page affiche le même logo, un champ identifiant / mot de passe, et un message : « Votre abonnement a expiré, reconnectez-vous pour continuer. »",
      ui: "web",
    },
    choices: [
      {
        id: "login",
        label: "Je me connecte : l'adresse est presque exacte et la page est identique",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "SHARED_CREDENTIAL"],
      },
      {
        id: "retype",
        label: "Je retape l'adresse plus lentement dans le même onglet, lettre par lettre",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "favorite",
        label: "Je ferme l'onglet et je rejoins le service par mon favori enregistré",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["favorite"],
    explanations: {
      login: {
        technique: "Typosquatting",
        indicator: "Domaine avec une lettre doublée par rapport à celui attendu (« streamplixx » au lieu de « streamplix »)",
        whyDangerous:
          "Contrairement à un homoglyphe, cette différence est une vraie faute de frappe, visible pour qui relit l'adresse — mais une lecture rapide la manque tout autant. Le site est une copie hébergée sur un domaine appartenant à l'attaquant ; tout identifiant saisi lui est transmis directement.",
        reflex: "Une adresse tapée de mémoire se relit lettre par lettre avant de saisir un mot de passe, surtout après une faute possible.",
      },
      retype: {
        technique: "Typosquatting",
        indicator: "Adresse déjà chargée dans le même onglet, retapée dans la même barre",
        whyDangerous:
          "Retaper dans le même onglet ne change rien à la vigilance apportée : la même faute peut se reproduire, et l'autocomplétion du navigateur peut même reproposer l'adresse fautive en premier, puisqu'elle a été visitée à l'instant.",
        reflex: "Ralentir en retapant ne suffit pas si c'est la même autocomplétion, au même endroit, qui reprend la main.",
      },
      favorite: {
        technique: "Typosquatting",
        indicator: "Adresse à un caractère près de celle enregistrée en favori",
        whyDangerous:
          "C'est la bonne réponse. Un favori enregistré lors d'une visite de confiance pointe toujours vers le domaine exact, sans jamais dépendre de la frappe du moment.",
        reflex: "Pour un service que vous utilisez souvent, un favori élimine le risque d'une faute de frappe sur l'adresse.",
      },
      unsure: {
        technique: "Typosquatting",
        indicator: "Différence d'une seule lettre, facile à manquer en lisant vite",
        whyDangerous: "Fermer l'onglet et repartir d'un favori ne fait perdre aucun accès réel au service.",
        reflex: "Dans le doute face à une adresse tapée de mémoire, repartez toujours d'un favori plutôt que de retaper.",
      },
    },
  },
];

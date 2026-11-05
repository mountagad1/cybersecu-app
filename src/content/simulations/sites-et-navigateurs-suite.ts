import type { SimulationEntry } from "./types";

/**
 * Simulations — sites et navigateurs, réseaux (lot 10).
 *
 * Mêmes règles de sûreté que les autres fichiers : toute entité est
 * fictive, tout domaine est sous le TLD réservé `.test`, rien n'est
 * jamais saisi ni transmis. Même règle de rédaction : le mauvais choix
 * est celui qu'une personne raisonnable ferait, jamais un piège grossier.
 */
export const SIMULATIONS_SITES_ET_NAVIGATEURS_SUITE: SimulationEntry[] = [
  {
    versionId: "00000000-0000-4000-8000-000000000018",
    scenarioCode: "SCENARIO-000024",
    slug: "resultat-sponsorise-logiciel-comptable",
    version: 1,
    attackCode: "WEB-000003",
    channel: "web",
    targetProfile: "business",
    difficulty: 3,
    impersonatedEntity: "Éditeur fictif d'un logiciel de comptabilité",
    teaser: "Une recherche pour retrouver votre logiciel de comptabilité. Le premier résultat n'est pas le bon site.",
    content: {
      sender: "Résultats de recherche — « connexion comptalogic »",
      body: "Résultat sponsorisé\ncomptalogic-connexion.example-not-real.test\nComptaLogic — Accédez à votre espace client en un clic. Support 24/7.\n\nRésultat\ncomptalogic.test\nComptaLogic — Espace client\n\nRésultat\ncomptalogic.test/actualites\nComptaLogic annonce une nouvelle fonctionnalité...",
      ui: "web",
    },
    choices: [
      {
        id: "sponsored",
        label: "Je clique sur le premier résultat, celui tout en haut",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_BRAND_NAME"],
      },
      {
        id: "compare",
        label: "Les deux domaines se ressemblent, je clique sur celui qui a le plus d'avis positifs",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "favorite",
        label: "J'ignore les résultats et j'utilise mon favori enregistré vers comptalogic.test",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["favorite"],
    explanations: {
      sponsored: {
        technique: "Faux site web",
        indicator: "Résultat sponsorisé avec un domaine légèrement différent du domaine officiel",
        whyDangerous:
          "Le premier résultat n'est pas le mieux classé par pertinence : c'est celui qui a payé pour apparaître là. Le domaine « comptalogic-connexion » n'est pas celui de l'éditeur, et une page de connexion qui y ressemble à l'identique récupère vos identifiants dès la première saisie.",
        reflex: "La position dans les résultats ne dit rien sur la légitimité. Le domaine, lui, le dit.",
      },
      compare: {
        technique: "Faux site web",
        indicator: "Deux domaines proches, l'un légitime et l'autre non",
        whyDangerous:
          "Le nombre d'avis ou l'apparence d'un site ne sont pas des critères de sécurité : une copie soignée les reproduit aussi bien. Le seul élément qui distingue de façon fiable les deux domaines est le domaine lui-même, comparé au nom exact de l'éditeur.",
        reflex: "Comparez des domaines, pas des mises en page.",
      },
      favorite: {
        technique: "Faux site web",
        indicator: "Un favori enregistré au préalable élimine la question",
        whyDangerous:
          "C'est la bonne réponse. Un favori créé lors d'une visite de confiance pointe toujours vers le même domaine, quel que soit ce qu'affiche un moteur de recherche ensuite — ce qui retire tout pouvoir à un résultat sponsorisé ou à un domaine imité.",
        reflex: "Pour les services que vous utilisez souvent, un favori évite d'avoir à juger un résultat de recherche à chaque fois.",
      },
      unsure: {
        technique: "Faux site web",
        indicator: "Deux résultats qui semblent tous les deux légitimes",
        whyDangerous: "Ne rien faire ne fait courir aucun risque ici.",
        reflex: "Dans le doute, rejoignez le service par un favori ou en tapant l'adresse vous-même.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000019",
    scenarioCode: "SCENARIO-000025",
    slug: "alerte-securite-sur-site-quelconque",
    version: 1,
    attackCode: "WEB-000004",
    channel: "advertisement",
    targetProfile: "senior",
    difficulty: 2,
    impersonatedEntity: "Aucune — publicité affichée sur un site tiers",
    teaser: "En lisant un article, une alerte plein écran annonce 3 virus détectés.",
    content: {
      sender: "Publicité affichée sur un site d'actualités",
      body: "⚠ ALERTE SÉCURITÉ ⚠\n3 VIRUS DÉTECTÉS sur votre appareil !\n\nVotre système est en danger. Cliquez ici pour lancer le nettoyage immédiat et protéger vos données.\n\n[Nettoyer maintenant]",
      ui: "web",
    },
    choices: [
      {
        id: "clean",
        label: "Je clique sur « Nettoyer maintenant », mieux vaut être prudent",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY", "CLICKED_UNKNOWN_LINK"],
      },
      {
        id: "close-tab",
        label: "Je ferme l'onglet, l'alerte disparaîtra avec",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "ignore",
        label: "J'ignore l'alerte : mon appareil ne peut pas être examiné par une page web que je lis",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["ignore"],
    explanations: {
      clean: {
        technique: "Malvertising",
        indicator: "Alerte de sécurité affichée par une publicité, sur un site sans rapport",
        whyDangerous:
          "Une page web lue dans un article n'a techniquement aucun moyen d'examiner votre appareil : ce chiffre de « 3 virus » est fabriqué pour être crédible, pas mesuré. Cliquer installe ce que l'alerte prétendait retirer.",
        reflex: "Un site que vous consultez ne peut pas analyser votre appareil. Une alerte qui prétend le contraire est fausse par construction.",
      },
      "close-tab": {
        technique: "Malvertising",
        indicator: "Fenêtre ou bandeau publicitaire imitant une alerte système",
        whyDangerous:
          "Fermer l'onglet est un bon réflexe et suffit presque toujours ici, mais ce n'est pas parce que l'alerte « disparaît » qu'il n'y a rien à comprendre : si un clic involontaire a eu lieu avant la fermeture, un téléchargement a pu démarrer en arrière-plan.",
        reflex: "Fermer suffit dans la grande majorité des cas ; vérifiez simplement qu'aucun fichier n'a été téléchargé entre-temps.",
      },
      ignore: {
        technique: "Malvertising",
        indicator: "Alerte plein écran chargée par un encart publicitaire",
        whyDangerous:
          "C'est la bonne réponse. Une véritable détection vient toujours du logiciel de sécurité installé sur votre appareil, jamais d'une page consultée dans un navigateur.",
        reflex: "Aucun site ne peut analyser votre appareil depuis une page web. Le seul examen valable vient d'un logiciel que vous avez vous-même installé.",
      },
      unsure: {
        technique: "Malvertising",
        indicator: "Chiffre précis affiché pour paraître mesuré",
        whyDangerous: "Ne cliquer sur rien ne fait courir aucun risque.",
        reflex: "Dans le doute, fermez l'onglet sans cliquer sur aucun bouton de l'alerte.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000001a",
    scenarioCode: "SCENARIO-000026",
    slug: "installeur-avec-cases-precochees",
    version: 1,
    attackCode: "WEB-000005",
    channel: "web",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "Site de téléchargement fictif",
    teaser: "Le logiciel gratuit que vous cherchiez est enfin trouvé. L'installation propose plusieurs options.",
    content: {
      sender: "Assistant d'installation — LecteurGratuit v4.2",
      body: "Bienvenue dans l'installation de LecteurGratuit.\n\n☑ Installer la barre d'outils SuperRecherche (recommandé)\n☑ Faire de RechercheRapide mon moteur par défaut\n☑ Recevoir des offres partenaires par email\n☐ Créer un raccourci sur le bureau\n\n[ Suivant > ]",
      ui: "web",
    },
    choices: [
      {
        id: "next",
        label: "Je clique sur « Suivant » sans changer les cases, elles sont recommandées",
        mistakePatternCodes: ["TRUSTED_DISPLAY_NAME", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "cancel",
        label: "J'annule complètement l'installation, ce logiciel a l'air trop compliqué",
        mistakePatternCodes: [],
      },
      {
        id: "uncheck",
        label: "Je décoche tout ce qui n'est pas le logiciel que je suis venu installer",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["uncheck"],
    explanations: {
      next: {
        technique: "Faux téléchargement",
        indicator: "Cases cochées d'avance pour des logiciels sans rapport avec celui demandé",
        whyDangerous:
          "« Recommandé » est écrit par l'installeur, pas par vous. Chaque case cochée ajoute un programme que vous n'êtes pas venu chercher — une barre d'outils, un moteur de recherche modifié, une inscription commerciale — et c'est précisément le modèle économique de ce type de site de téléchargement.",
        reflex: "Une case déjà cochée par défaut n'est jamais dans votre intérêt à vous, elle est dans celui de qui l'a cochée.",
      },
      cancel: {
        technique: "Faux téléchargement",
        indicator: "Options multiples ajoutées à une installation simple",
        whyDangerous:
          "Ce n'est pas dangereux, mais ce n'est pas nécessaire non plus : lire et décocher prend le même temps qu'annuler, et vous obtenez le logiciel que vous vouliez au lieu de rien du tout.",
        reflex: "Décocher n'est pas plus difficile qu'annuler, et ça aboutit.",
      },
      uncheck: {
        technique: "Faux téléchargement",
        indicator: "Trois cases sur quatre proposent autre chose que le logiciel demandé",
        whyDangerous:
          "C'est la bonne réponse. Lire chaque écran d'installation et ne garder que ce que vous êtes venu chercher évite l'essentiel de ce que ce procédé installe.",
        reflex: "Lisez chaque écran d'une installation, et décochez ce que vous n'avez pas demandé.",
      },
      unsure: {
        technique: "Faux téléchargement",
        indicator: "Présentation qui ressemble à un assistant d'installation légitime",
        whyDangerous: "Ne rien valider ne fait courir aucun risque.",
        reflex: "Dans le doute, décochez tout ce qui n'est pas le logiciel recherché avant de continuer.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000001b",
    scenarioCode: "SCENARIO-000027",
    slug: "extension-convertisseur-de-fichiers",
    version: 1,
    attackCode: "WEB-000006",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Extension fictive de navigateur",
    teaser: "Une extension pour convertir des fichiers PDF demande un accès à tous les sites visités.",
    content: {
      sender: "Boutique d'extensions — fiche « ConvertPDF Facile »",
      body: "ConvertPDF Facile — 4,6 ★ (2 340 avis)\nConvertit vos documents PDF en un clic.\n\nCette extension demande l'autorisation de :\n— Lire et modifier toutes vos données sur tous les sites web que vous visitez\n— Afficher des notifications\n\n[ Ajouter à mon navigateur ]",
      ui: "web",
    },
    choices: [
      {
        id: "install",
        label: "J'installe : la note est bonne et je n'ai rien à cacher",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "trust-rating",
        label: "Je vérifie juste que la note est au-dessus de 4 étoiles avant d'installer",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "question",
        label: "Je remarque que l'autorisation dépasse largement la fonction annoncée et je n'installe pas",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["question"],
    explanations: {
      install: {
        technique: "Extension de navigateur malveillante",
        indicator: "Autorisation de lire et modifier toutes les données sur tous les sites, pour un simple convertisseur",
        whyDangerous:
          "« Rien à cacher » n'est pas le sujet : cette autorisation permet de lire vos identifiants saisis, vos messages, votre historique bancaire — sur tous les sites, en continu. Un convertisseur de fichiers n'a besoin d'aucun de ces accès pour fonctionner.",
        reflex: "L'autorisation demandée doit correspondre à la fonction annoncée. Un large écart entre les deux est le signal, pas la réputation de l'extension.",
      },
      "trust-rating": {
        technique: "Extension de navigateur malveillante",
        indicator: "Note élevée qui ne dit rien de la portée des autorisations",
        whyDangerous:
          "Une bonne note évalue si l'extension fait ce qu'elle annonce, pas ce qu'elle fait en plus. Un nombre élevé d'avis positifs coexiste très bien avec une collecte de données large et non annoncée dans les avis.",
        reflex: "La note mesure la satisfaction sur la fonction visible, pas ce que l'extension peut faire par ailleurs.",
      },
      question: {
        technique: "Extension de navigateur malveillante",
        indicator: "Écart entre la fonction annoncée et l'étendue de l'autorisation demandée",
        whyDangerous:
          "C'est la bonne réponse. Comparer l'autorisation à la fonction est le seul critère qui tienne pour ce type de décision, indépendamment de la note ou du nombre d'avis.",
        reflex: "Avant d'installer une extension, comparez ce qu'elle demande à ce qu'elle fait. Un large écart doit suffire à refuser.",
      },
      unsure: {
        technique: "Extension de navigateur malveillante",
        indicator: "Fonction simple, autorisation large",
        whyDangerous: "Ne pas installer ne fait perdre aucune fonctionnalité indispensable.",
        reflex: "Dans le doute, n'installez pas et cherchez une alternative aux autorisations plus limitées.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000001c",
    scenarioCode: "SCENARIO-000028",
    slug: "wifi-aeroport-deux-reseaux",
    version: 1,
    attackCode: "NET-000002",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Aucune — réseaux Wi-Fi affichés dans un aéroport fictif",
    teaser: "Dans un aéroport, deux réseaux Wi-Fi portent presque le même nom.",
    content: {
      sender: "Réseaux Wi-Fi disponibles",
      body: "Réseaux détectés :\n\n📶 Aeroport-Fictif-FREE   (ouvert)\n📶 Aeroport-Fictif_FREE  (ouvert)\n📶 Aeroport-Fictif-STAFF (protégé)\n📶 iPhone de Julie       (protégé)",
      ui: "web",
    },
    choices: [
      {
        id: "either",
        label: "Je me connecte au premier de la liste, ils ont presque le même nom donc ça n'a pas d'importance",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_DISPLAY_NAME"],
      },
      {
        id: "strongest",
        label: "Je me connecte à celui qui a le signal le plus fort",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN"],
      },
      {
        id: "ask",
        label: "Je demande au personnel de l'aéroport le nom exact du réseau officiel",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["ask"],
    explanations: {
      either: {
        technique: "Faux point d'accès Wi-Fi",
        indicator: "Deux réseaux au nom quasi identique, un tiret contre un tiret bas",
        whyDangerous:
          "Le nom d'un réseau est choisi librement par celui qui le publie : rien n'empêche un tiers de créer un second réseau à un caractère près du vrai. « Ça se ressemble » est exactement l'effet recherché, pas une preuve d'équivalence.",
        reflex: "Deux réseaux presque identiques ne sont jamais équivalents. L'un des deux appartient à quelqu'un d'autre.",
      },
      strongest: {
        technique: "Faux point d'accès Wi-Fi",
        indicator: "Force du signal utilisée comme critère de confiance",
        whyDangerous:
          "La force du signal dépend de la proximité de l'antenne, pas de la légitimité du réseau. Un faux point d'accès placé à proximité de vous affiche même souvent un signal plus fort que le vrai, plus éloigné.",
        reflex: "La force du signal ne renseigne en rien sur qui contrôle le réseau.",
      },
      ask: {
        technique: "Faux point d'accès Wi-Fi",
        indicator: "Aucun moyen de trancher depuis la seule liste affichée",
        whyDangerous:
          "C'est la bonne réponse. Le personnel de l'établissement est la seule source qui connaît le nom exact du réseau qu'il exploite réellement ; c'est une vérification qui prend dix secondes.",
        reflex: "Face à deux réseaux similaires, demandez au personnel plutôt que de choisir au hasard.",
      },
      unsure: {
        technique: "Faux point d'accès Wi-Fi",
        indicator: "Noms très proches, aucun signe distinctif fiable",
        whyDangerous: "Ne pas se connecter ne fait courir aucun risque.",
        reflex: "Dans le doute, utilisez votre connexion mobile plutôt que de choisir au hasard entre deux réseaux similaires.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000001d",
    scenarioCode: "SCENARIO-000029",
    slug: "portail-wifi-hotel-carte-bancaire",
    version: 1,
    attackCode: "NET-000007",
    channel: "web",
    targetProfile: "senior",
    difficulty: 3,
    impersonatedEntity: "Hôtel fictif",
    teaser: "La page de connexion au Wi-Fi de l'hôtel demande une carte bancaire pour une « caution » d'un euro.",
    content: {
      sender: "Portail de connexion — Wi-Fi Hôtel Fictif",
      body: "Bienvenue à l'Hôtel Fictif !\n\nPour activer votre accès Wi-Fi gratuit, une caution de 1,00 € vous sera débitée puis intégralement remboursée à votre départ.\n\nNuméro de carte : ____\nDate d'expiration : __/__\nCryptogramme : ___\n\n[ Activer mon accès ]",
      ui: "web",
    },
    choices: [
      {
        id: "pay",
        label: "Je renseigne ma carte, ce n'est qu'un euro et il sera remboursé",
        mistakePatternCodes: ["MISSED_UNUSUAL_PAYMENT_REQUEST", "TRUSTED_BRAND_NAME"],
      },
      {
        id: "different-card",
        label: "Je renseigne une carte prépayée à faible solde, par précaution",
        mistakePatternCodes: ["MISSED_UNUSUAL_PAYMENT_REQUEST"],
      },
      {
        id: "reception",
        label: "Je descends demander à la réception si le Wi-Fi demande vraiment une carte bancaire",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["reception"],
    explanations: {
      pay: {
        technique: "Portail captif malveillant",
        indicator: "Carte bancaire demandée pour un accès Wi-Fi annoncé comme gratuit",
        whyDangerous:
          "Un accès Wi-Fi n'a besoin d'aucun moyen de paiement pour fonctionner techniquement. Le montant faible et le remboursement promis servent à rendre la demande acceptable ; ce qui est réellement recherché est un numéro de carte valide, réutilisable pour des montants bien supérieurs.",
        reflex: "Un euro « remboursé » n'est pas une garantie : ce qui compte est que le numéro de carte a été communiqué.",
      },
      "different-card": {
        technique: "Portail captif malveillant",
        indicator: "Demande de paiement pour un service qui n'en nécessite pas",
        whyDangerous:
          "Utiliser une carte à faible solde réduit la perte possible mais ne traite pas le problème : le numéro reste valide et exploitable, et le geste confirme surtout que la demande a été acceptée sans être questionnée.",
        reflex: "Réduire le montant exposé n'est pas la même chose que refuser une demande anormale.",
      },
      reception: {
        technique: "Portail captif malveillant",
        indicator: "Aucun accès Wi-Fi légitime n'exige de carte bancaire pour une simple connexion",
        whyDangerous:
          "C'est la bonne réponse. La réception peut confirmer en quelques secondes si l'hôtel demande réellement un paiement pour son Wi-Fi — et la réponse, dans l'immense majorité des hôtels, est non.",
        reflex: "Un accès Wi-Fi qui réclame une carte bancaire doit être vérifié sur place avant toute saisie.",
      },
      unsure: {
        technique: "Portail captif malveillant",
        indicator: "Présentation professionnelle imitant un vrai portail d'hôtel",
        whyDangerous: "Ne rien saisir ne fait courir aucun risque : vous pouvez toujours utiliser votre connexion mobile.",
        reflex: "Dans le doute, ne communiquez pas de carte bancaire pour un accès Wi-Fi et vérifiez sur place.",
      },
    },
  },
];

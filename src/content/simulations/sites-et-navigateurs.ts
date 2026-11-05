import type { SimulationEntry } from "./types";

/** Simulations for the sites et navigateurs family. All domains under `.test`. */
export const SIMULATIONS_SITES_ET_NAVIGATEURS: SimulationEntry[] = [
  {
    // Homoglyph, not typosquatting: "cIient" swaps a capital I for the
    // lowercase l — invisible on a careful reread, unlike an ordinary
    // typo. attackCode was fixed to point at IDN-000002 (homoglyphes)
    // instead of IDN-000001 (typosquatting), matching that attack's own
    // simulationSlug field and this scenario's actual content.
    versionId: "00000000-0000-4000-8000-000000000008",
    scenarioCode: "SCENARIO-000008",
    slug: "adresse-presque-correcte",
    version: 1,
    attackCode: "IDN-000002",
    channel: "web",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Espace client fictif",
    teaser: "La page de connexion est parfaite. L'adresse aussi, à un caractère près.",
    content: {
      sender: "Barre d'adresse du navigateur",
      body: "https://espace-cIient.mutuelle-fictive.example-not-real.test/connexion\n\nLa page affiche le logo habituel, un formulaire identifiant / mot de passe, et le cadenas est présent. Votre gestionnaire de mots de passe, lui, ne propose rien.",
      ui: "web",
    },
    choices: [
      {
        id: "login",
        label: "Le cadenas est affiché et la page est identique, je me connecte",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_LOGO", "SHARED_CREDENTIAL"],
      },
      {
        id: "type",
        label: "Je saisis mon mot de passe à la main puisque le gestionnaire ne le propose pas",
        mistakePatternCodes: ["SHARED_CREDENTIAL", "MISSED_SUSPICIOUS_DOMAIN"],
      },
      {
        id: "bookmark",
        label: "Je ferme l'onglet et je rejoins le service par mon favori enregistré",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["bookmark"],
    explanations: {
      login: {
        technique: "Domaine imitant un site légitime",
        indicator: "« espace-cIient » s'écrit ici avec un i majuscule à la place du l minuscule",
        whyDangerous: "Le site est une copie hébergée sur un domaine appartenant à l'attaquant ; tout ce qui y est saisi lui est transmis directement.",
        reflex: "Le cadenas ne dit rien de la légitimité d'un site : il n'indique que le chiffrement de la connexion.",
      },
      type: {
        technique: "Domaine imitant un site légitime",
        indicator: "Le gestionnaire de mots de passe ne propose pas de remplir le formulaire",
        whyDangerous: "Saisir à la main contourne précisément la seule protection qui avait détecté l'anomalie : le gestionnaire associe vos identifiants au domaine réel, pas à son apparence.",
        reflex: "Un gestionnaire silencieux sur un site habituel est un avertissement, pas un dysfonctionnement.",
      },
      bookmark: {
        technique: "Domaine imitant un site légitime",
        indicator: "Page atteinte par un lien plutôt que par un chemin choisi par vous",
        whyDangerous: "C'est la bonne réponse : un favori pointe vers le domaine réel, quelle que soit la ressemblance de la page visitée.",
        reflex: "Enregistrez un favori pour chaque service sensible et n'utilisez que celui-ci.",
      },
      unsure: {
        technique: "Domaine imitant un site légitime",
        indicator: "Adresse presque identique à celle attendue",
        whyDangerous: "L'hésitation est justifiée : ces adresses sont conçues pour résister à la lecture attentive.",
        reflex: "Dans le doute, ne vous connectez pas depuis cette page : passez par votre favori.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000009",
    scenarioCode: "SCENARIO-000009",
    slug: "qr-code-borne-de-paiement",
    version: 1,
    attackCode: "QR-000001",
    channel: "qr_code",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Borne de stationnement fictive",
    teaser: "Un autocollant QR sur l'horodateur promet un paiement « plus rapide ».",
    content: {
      sender: "Autocollant collé sur un horodateur",
      body: "« Paiement rapide sans espèces — scannez ce code. »\n\nAprès le scan, votre téléphone affiche en aperçu : https://paiement-stationnement-rapide.example-not-real.test/regler?ville=…",
      ui: "qr",
    },
    choices: [
      {
        id: "pay",
        label: "J'ouvre la page et je règle mon stationnement par carte",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "MISSED_UNUSUAL_PAYMENT_REQUEST"],
      },
      {
        id: "official",
        label: "Le QR code est collé sur un équipement public, il est donc officiel",
        mistakePatternCodes: ["TRUSTED_AUTHORITY", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "app",
        label: "Je paie à l'horodateur lui-même ou via l'application officielle que j'ouvre moi-même",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["app"],
    explanations: {
      pay: {
        technique: "QR code masquant sa destination",
        indicator: "Domaine sans rapport avec la commune ou l'exploitant du stationnement",
        whyDangerous: "La page de paiement collecte la carte complète ; le stationnement, lui, n'est jamais réglé.",
        reflex: "Lisez toujours l'aperçu de l'adresse avant d'ouvrir une page issue d'un QR code.",
      },
      official: {
        technique: "QR code masquant sa destination",
        indicator: "Autocollant rapporté sur l'équipement",
        whyDangerous: "Un autocollant se pose en une seconde et n'importe qui peut en coller un : l'emplacement ne dit rien de l'origine du code.",
        reflex: "Passez le doigt sur le code : un autocollant superposé se sent au toucher.",
      },
      app: {
        technique: "QR code masquant sa destination",
        indicator: "Un QR code proposé comme moyen de paiement principal",
        whyDangerous: "C'est la bonne réponse : un QR code n'est jamais le seul chemin possible pour une démarche officielle.",
        reflex: "Pour tout paiement, choisissez vous-même le chemin plutôt que celui qu'on vous propose.",
      },
      unsure: {
        technique: "QR code masquant sa destination",
        indicator: "Destination invisible avant le scan",
        whyDangerous: "Scanner n'expose pas en soi : le risque commence à l'ouverture de la page et à la saisie de la carte.",
        reflex: "Dans le doute, réglez par un autre moyen.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000000a",
    scenarioCode: "SCENARIO-000010",
    slug: "boutique-promotion-exceptionnelle",
    version: 1,
    attackCode: "WEB-000001",
    channel: "advertisement",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "Boutique en ligne fictive",
    teaser: "−70 % sur un produit rarement remisé, et un compte à rebours de neuf minutes.",
    content: {
      sender: "Publicité affichée sur un réseau social",
      body: "Déstockage exceptionnel −70 % — il reste 3 articles !\nFin de l'offre dans 09:41\n\nBoutique-Fictive-Deals.example-not-real.test\nPaiement par virement bancaire uniquement. Mentions légales : aucune raison sociale, aucun numéro d'entreprise. Contact : formulaire.",
      ui: "web",
    },
    choices: [
      {
        id: "buy",
        label: "Je commande tout de suite avant la fin du compte à rebours",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY", "MISSED_UNUSUAL_PAYMENT_REQUEST"],
      },
      {
        id: "reviews",
        label: "La page affiche des centaines d'avis cinq étoiles, je considère la boutique comme fiable",
        mistakePatternCodes: ["TRUSTED_BRAND_NAME", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check",
        label: "Je cherche la boutique en dehors de son propre site et je vérifie ses mentions légales avant toute commande",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["check"],
    explanations: {
      buy: {
        technique: "Rareté et compte à rebours fabriqués",
        indicator: "Paiement accepté uniquement par virement",
        whyDangerous: "Un virement n'offre pratiquement aucune procédure de contestation : une fois exécuté, l'argent est perdu même si rien n'est livré.",
        reflex: "Un vendeur qui refuse tout moyen de paiement contestable choisit un moyen que vous ne pourrez pas annuler.",
      },
      reviews: {
        technique: "Preuve sociale fabriquée",
        indicator: "Avis hébergés sur le site du vendeur lui-même",
        whyDangerous: "Les avis affichés sur un site sont choisis par ce site ; ils ne constituent aucune preuve indépendante.",
        reflex: "Ne tenez compte que d'avis publiés ailleurs, sur une plateforme que le vendeur ne contrôle pas.",
      },
      check: {
        technique: "Rareté et compte à rebours fabriqués",
        indicator: "Mentions légales sans raison sociale ni numéro d'entreprise",
        whyDangerous: "C'est la bonne réponse : un vendeur non identifiable ne peut être ni contacté, ni poursuivi, ni remboursé.",
        reflex: "Avant de payer, vérifiez que le vendeur existe ailleurs que sur sa propre vitrine.",
      },
      unsure: {
        technique: "Rareté et compte à rebours fabriqués",
        indicator: "Prix très inférieur au marché",
        whyDangerous: "Le compte à rebours est là pour empêcher exactement cette hésitation ; il ne coûte rien de le laisser expirer.",
        reflex: "Dans le doute, laissez passer l'offre : une vraie promotion réapparaît.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000000b",
    scenarioCode: "SCENARIO-000011",
    slug: "fausse-mise-a-jour-navigateur",
    version: 1,
    attackCode: "WEB-000002",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fausse notification de navigateur",
    teaser: "Une bannière annonce que votre navigateur est obsolète et propose un fichier à exécuter.",
    content: {
      sender: "Bannière affichée dans une page web",
      body: "Votre navigateur est obsolète (version 3 mises à jour de retard). Une faille critique a été corrigée.\n[ Mettre à jour maintenant ]\n\nLe bouton propose le téléchargement de : mise-a-jour-navigateur.exe",
      ui: "web",
    },
    choices: [
      {
        id: "run",
        label: "Je télécharge et j'exécute le fichier proposé",
        mistakePatternCodes: ["CLICKED_UNKNOWN_LINK", "TRUSTED_BRAND_NAME", "RESPONDED_TO_URGENCY"],
      },
      {
        id: "command",
        label: "La page propose sinon de copier une commande à coller dans une fenêtre du système, je le fais",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY", "TRUSTED_AUTHORITY"],
      },
      {
        id: "menu",
        label: "Je ferme l'onglet et je vérifie la version dans le menu du navigateur lui-même",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["menu"],
    explanations: {
      run: {
        technique: "Fausse notification de mise à jour",
        indicator: "Une mise à jour de navigateur proposée sous forme de fichier exécutable téléchargé depuis une page",
        whyDangerous: "Le fichier est un programme choisi par l'attaquant. Comme c'est vous qui l'exécutez, les protections du navigateur ne sont pas franchies : elles sont contournées.",
        reflex: "Un navigateur se met à jour seul et ne fait jamais télécharger un exécutable depuis une page web.",
      },
      command: {
        technique: "Exécution déléguée à l'utilisateur",
        indicator: "Demande de copier une commande et de la coller dans le système",
        whyDangerous: "La commande exécute le même programme sans qu'aucun fichier suspect n'apparaisse dans les téléchargements, ce qui la rend plus discrète encore.",
        reflex: "Ne collez jamais dans votre système une commande fournie par une page web, quelle que soit la justification.",
      },
      menu: {
        technique: "Fausse notification de mise à jour",
        indicator: "Notification affichée dans la page, et non par le navigateur",
        whyDangerous: "C'est la bonne réponse : le menu du navigateur est le seul endroit qui indique réellement sa version.",
        reflex: "Toute information sur votre logiciel se vérifie dans le logiciel, jamais dans une page.",
      },
      unsure: {
        technique: "Fausse notification de mise à jour",
        indicator: "Urgence justifiée par une « faille critique »",
        whyDangerous: "Fermer l'onglet ne fait courir aucun risque, y compris si une vraie mise à jour est en attente.",
        reflex: "Dans le doute, fermez la page et vérifiez depuis le menu du navigateur.",
      },
    },
  },
];

import type { SimulationEntry } from "./types";

/**
 * Simulations — téléphones et objets connectés (lot 10).
 *
 * Mêmes règles de sûreté que les autres fichiers : toute entité est
 * fictive, tout domaine sous le TLD réservé `.test`, rien n'est jamais
 * saisi ni transmis. Même règle de rédaction : le mauvais choix est
 * celui qu'une personne raisonnable ferait.
 */
export const SIMULATIONS_TELEPHONES_ET_OBJETS_CONNECTES: SimulationEntry[] = [
  {
    versionId: "00000000-0000-4000-8000-00000000001e",
    scenarioCode: "SCENARIO-000030",
    slug: "fiche-application-lampe-torche",
    version: 1,
    attackCode: "MOB-000001",
    channel: "web",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "Application fictive « Lampe Torche Ultra »",
    teaser: "Une lampe torche gratuite, très bien notée, demande l'accès à vos contacts et vos SMS.",
    content: {
      sender: "Magasin d'applications — fiche « Lampe Torche Ultra »",
      body: "Lampe Torche Ultra — Gratuit\n4,7 ★ (18 200 avis) — Développeur : AppStudio92\n\nAutorisations demandées :\n— Contacts\n— SMS\n— Position\n— Micro\n\n[ Installer ]",
      ui: "web",
    },
    choices: [
      {
        id: "install",
        label: "J'installe : la note est excellente et l'application est gratuite",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check-dev",
        label: "Je regarde juste le nombre d'avis avant d'installer",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "refuse",
        label: "Je remarque que rien ne justifie ces autorisations pour une lampe torche et je n'installe pas",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["refuse"],
    explanations: {
      install: {
        technique: "Application malveillante",
        indicator: "Autorisations sans rapport avec la fonction annoncée",
        whyDangerous:
          "Une lampe torche n'a besoin d'aucune de ces quatre autorisations pour allumer le flash : ni vos contacts, ni vos SMS, ni votre position, ni votre micro. Une bonne note mesure si l'application allume bien la lumière, pas ce qu'elle fait par ailleurs avec ces accès.",
        reflex: "Comparez toujours l'autorisation demandée à la fonction annoncée, quelle que soit la note.",
      },
      "check-dev": {
        technique: "Application malveillante",
        indicator: "Nombre d'avis élevé qui ne renseigne pas sur les autorisations",
        whyDangerous:
          "Un grand nombre d'avis positifs porte sur la fonction visible — la lumière s'allume — et ne dit rien de la collecte de données faite en arrière-plan, que la plupart des personnes qui laissent un avis n'examinent pas.",
        reflex: "Le nombre d'avis n'est pas un contrôle de sécurité.",
      },
      refuse: {
        technique: "Application malveillante",
        indicator: "Contacts, SMS, position et micro demandés pour allumer une lumière",
        whyDangerous:
          "C'est la bonne réponse. Une lampe torche a un besoin technique nul de ces quatre autorisations ; les demander est le signe le plus net que l'application sert un autre usage que celui annoncé.",
        reflex: "Refusez une application dont les autorisations dépassent nettement sa fonction, quelle que soit sa popularité.",
      },
      unsure: {
        technique: "Application malveillante",
        indicator: "Fonction simple, autorisations larges",
        whyDangerous: "Ne pas installer ne fait perdre aucune fonctionnalité : la lampe torche existe déjà nativement sur la plupart des téléphones.",
        reflex: "Dans le doute, préférez la fonction native de votre téléphone à une application tierce.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000001f",
    scenarioCode: "SCENARIO-000031",
    slug: "autorisation-affichage-par-dessus",
    version: 1,
    attackCode: "MOB-000002",
    channel: "web",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Application fictive « Économiseur de Batterie Pro »",
    teaser: "Une application demande la permission de s'afficher par-dessus les autres applications.",
    content: {
      sender: "Demande d'autorisation système",
      body: "« Économiseur de Batterie Pro » souhaite s'afficher par-dessus d'autres applications.\n\nCette autorisation permet à l'application d'apparaître au-dessus des applications que vous utilisez, y compris pour afficher des alertes d'optimisation.\n\n[ Refuser ]     [ Autoriser ]",
      ui: "web",
    },
    choices: [
      {
        id: "allow",
        label: "J'autorise, ça semble nécessaire pour afficher les alertes d'optimisation",
        mistakePatternCodes: ["TRUSTED_DISPLAY_NAME", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "allow-once",
        label: "J'autorise mais je désinstallerai l'application si je remarque un problème",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "deny",
        label: "Je refuse : un économiseur de batterie n'a aucun besoin de s'afficher par-dessus mes autres applications",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["deny"],
    explanations: {
      allow: {
        technique: "Attaque par superposition",
        indicator: "Autorisation d'affichage par-dessus demandée pour une fonction qui ne la justifie pas",
        whyDangerous:
          "Cette autorisation est précisément celle qui permet de dessiner un faux écran de connexion par-dessus une application bancaire ou de messagerie réelle : ce que vous saisissez ensuite part à l'application malveillante, pas à celle que vous croyez utiliser. Un économiseur de batterie n'a aucun besoin technique de s'afficher par-dessus autre chose.",
        reflex: "L'autorisation d'affichage par-dessus les autres applications est parmi les plus sensibles du téléphone ; elle ne se donne jamais par réflexe.",
      },
      "allow-once": {
        technique: "Attaque par superposition",
        indicator: "Autorisation accordée en misant sur une correction ultérieure",
        whyDangerous:
          "Le problème avec une superposition malveillante est qu'elle ne « se remarque » pas forcément : un écran de connexion imité ressemble au vrai. Le moment de décider est celui de l'autorisation, pas après coup quand un symptôme visible apparaîtrait — qui pourrait ne jamais apparaître.",
        reflex: "Ne comptez pas sur un signe visible après coup : la décision se prend au moment de l'autorisation.",
      },
      deny: {
        technique: "Attaque par superposition",
        indicator: "Fonction annoncée (optimisation de batterie) sans rapport avec l'autorisation demandée",
        whyDangerous:
          "C'est la bonne réponse. Très peu d'applications légitimes ont un besoin réel de s'afficher par-dessus les autres ; un économiseur de batterie n'en fait pas partie.",
        reflex: "Refusez l'affichage par-dessus les autres applications sauf besoin clairement justifié, et vérifiez périodiquement la liste de ce qui l'a obtenu.",
      },
      unsure: {
        technique: "Attaque par superposition",
        indicator: "Autorisation technique peu familière",
        whyDangerous: "Refuser ne fait perdre aucune fonction essentielle d'un économiseur de batterie.",
        reflex: "Dans le doute face à une autorisation sensible, refusez : elle reste modifiable plus tard si un besoin réel apparaît.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000020",
    scenarioCode: "SCENARIO-000032",
    slug: "recharge-borne-aeroport",
    version: 1,
    attackCode: "MOB-000003",
    channel: "web",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "Aucune — borne de recharge publique fictive",
    teaser: "La batterie est presque vide. Une borne de recharge USB publique est disponible dans le hall.",
    content: {
      sender: "Écran du téléphone, une fois le câble de la borne branché",
      body: "Autoriser cet ordinateur à accéder aux données de l'appareil ?\n\nSi vous ne faites pas confiance à cet ordinateur, refusez l'accès. Vous pouvez toujours recharger sans autoriser l'accès aux données.\n\n[ Ne pas autoriser ]     [ Autoriser ]",
      ui: "web",
    },
    choices: [
      {
        id: "allow",
        label: "J'autorise, je veux juste que ça charge",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "unplug",
        label: "Je débranche immédiatement, sans répondre à la question",
        mistakePatternCodes: [],
      },
      {
        id: "deny",
        label: "Je refuse l'accès aux données et je laisse le téléphone charger",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["deny"],
    explanations: {
      allow: {
        technique: "Juice jacking",
        indicator: "Demande d'accès aux données apparaissant pour une simple recharge",
        whyDangerous:
          "Une recharge n'a besoin d'aucun accès aux données de l'appareil : c'est uniquement de l'électricité qui doit transiter par le câble. Autoriser l'accès permet à l'équipement branché de lire ou de copier le contenu du téléphone.",
        reflex: "Une recharge ne demande jamais d'autoriser un accès aux données. Si la question apparaît, la réponse est non.",
      },
      unplug: {
        technique: "Juice jacking",
        indicator: "Câble d'origine inconnue sur une borne publique",
        whyDangerous:
          "Débrancher est prudent mais pas nécessaire ici, et prive inutilement de la recharge : le téléphone lui-même propose la bonne option, refuser l'accès aux données, ce qui permet de charger normalement et sans risque.",
        reflex: "Refuser l'accès aux données suffit ; il n'est pas nécessaire de renoncer à la recharge par précaution.",
      },
      deny: {
        technique: "Juice jacking",
        indicator: "Le téléphone propose lui-même l'option qui sépare charge et données",
        whyDangerous:
          "C'est la bonne réponse. Refuser l'accès aux données bloque tout ce que ce procédé cherche à obtenir, tout en laissant l'électricité circuler normalement.",
        reflex: "Sur une borne publique, refusez systématiquement toute demande d'accès aux données : la recharge continue sans elle.",
      },
      unsure: {
        technique: "Juice jacking",
        indicator: "Question technique posée au moment de brancher",
        whyDangerous: "Refuser l'accès ne fait perdre aucune recharge.",
        reflex: "Dans le doute face à cette question, refusez toujours : c'est l'option sans risque et elle n'empêche pas de charger.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000021",
    scenarioCode: "SCENARIO-000033",
    slug: "demande-appairage-bluetooth-inconnue",
    version: 1,
    attackCode: "MOB-000004",
    channel: "web",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "Aucune — appareil Bluetooth inconnu",
    teaser: "Une demande d'appairage Bluetooth apparaît alors que vous êtes dans un lieu public.",
    content: {
      sender: "Notification Bluetooth",
      body: "Demande d'appairage\n\nUn appareil « Casque-Audio-27F3 » souhaite s'appairer avec votre téléphone.\n\nCode : 4471\n\n[ Refuser ]     [ Appairer ]",
      ui: "web",
    },
    choices: [
      {
        id: "pair",
        label: "J'appaire, ce n'est probablement qu'un casque à proximité",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "ignore-notification",
        label: "J'ignore la notification sans y toucher, elle finira par disparaître",
        mistakePatternCodes: [],
      },
      {
        id: "refuse",
        label: "Je refuse : je n'ai lancé aucun appairage moi-même",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["refuse"],
    explanations: {
      pair: {
        technique: "Attaque Bluetooth",
        indicator: "Demande d'appairage non sollicitée, nom d'appareil générique",
        whyDangerous:
          "Le nom d'un appareil Bluetooth est choisi librement par celui qui le diffuse : « Casque-Audio-27F3 » ne prouve pas qu'il s'agit d'un casque. Un appairage accordé peut permettre l'accès à des fichiers ou notifications selon les autorisations qu'il obtient ensuite.",
        reflex: "Une demande d'appairage que vous n'avez pas lancée vous-même n'a aucune raison d'être acceptée.",
      },
      "ignore-notification": {
        technique: "Attaque Bluetooth",
        indicator: "Notification laissée sans réponse explicite",
        whyDangerous:
          "Laisser une notification sans y répondre n'est pas dangereux en soi, mais ce n'est pas non plus la meilleure réponse : la refuser explicitement empêche toute nouvelle tentative de considérer le silence comme une hésitation à retenter.",
        reflex: "Un refus explicite vaut mieux qu'une notification ignorée.",
      },
      refuse: {
        technique: "Attaque Bluetooth",
        indicator: "Appairage non sollicité, aucune action de votre part ne l'a déclenché",
        whyDangerous:
          "C'est la bonne réponse. Vous n'avez lancé aucune recherche d'appareil : une demande d'appairage qui apparaît d'elle-même n'a pas de raison légitime d'exister.",
        reflex: "N'acceptez un appairage que si vous l'avez vous-même initié, pour un appareil que vous reconnaissez.",
      },
      unsure: {
        technique: "Attaque Bluetooth",
        indicator: "Code d'appairage affiché, ce qui paraît rassurant",
        whyDangerous: "Le code d'appairage confirme seulement la proximité, pas l'identité ou l'intention de l'appareil.",
        reflex: "Dans le doute, refusez : un appareil que vous connaissez peut toujours relancer sa demande.",
      },
    },
  },
];

import type { SimulationEntry } from "./types";

/**
 * Simulations — identifiants et comptes, suite (lot 10).
 *
 * Mêmes règles de sûreté que les autres fichiers : toute entité est
 * fictive, tout domaine sous le TLD réservé `.test`, rien n'est jamais
 * saisi ni transmis. Même règle de rédaction : le mauvais choix est
 * celui qu'une personne raisonnable ferait.
 *
 * Note de sélection : plusieurs fiches de cette famille
 * (pulvérisation de mots de passe, détournement de session, infostealer)
 * décrivent un diagnostic à mener dans les réglages du compte, pas un
 * message à juger — elles restent hors de ce lot plutôt que de forcer
 * un scénario qui ne leur correspond pas.
 */
export const SIMULATIONS_IDENTIFIANTS_ET_COMPTES_SUITE: SimulationEntry[] = [
  {
    versionId: "00000000-0000-4000-8000-000000000027",
    scenarioCode: "SCENARIO-000039",
    slug: "sms-confirmation-changement-carte-sim",
    version: 1,
    attackCode: "ACCT-000004",
    channel: "sms",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Opérateur mobile fictif",
    teaser: "Un SMS de votre opérateur confirme un changement de carte SIM que vous n'avez pas demandé.",
    content: {
      sender: "OpérateurFictif",
      body: "Votre carte SIM a été activée sur un nouvel appareil. Si vous n'êtes pas à l'origine de cette opération, contactez-nous immédiatement au 3179 (appel gratuit).",
      ui: "sms",
    },
    choices: [
      {
        id: "wait",
        label: "J'attends de voir si mon téléphone perd vraiment le réseau avant d'agir",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "ignore",
        label: "C'est sûrement une erreur ou un SMS automatique sans importance, je l'ignore",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "call-now",
        label: "J'appelle immédiatement le numéro officiel de mon opérateur pour faire bloquer la ligne",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["call-now"],
    explanations: {
      wait: {
        technique: "Échange de carte SIM",
        indicator: "Confirmation d'activation sur un nouvel appareil que vous n'avez pas demandée",
        whyDangerous:
          "Attendre la perte du réseau laisse un délai pendant lequel votre numéro reçoit déjà les SMS de sécurité de vos comptes — c'est justement ce que l'opération vise. Le moment d'agir est la réception de ce message, pas la confirmation du symptôme.",
        reflex: "Ce message est déjà la confirmation : il n'y a rien d'autre à attendre pour agir.",
      },
      ignore: {
        technique: "Échange de carte SIM",
        indicator: "Message émis par l'opérateur lui-même, sur une opération réelle",
        whyDangerous:
          "Ce n'est pas un message à trier parmi du spam : c'est une notification légitime de votre propre opérateur, décrivant une opération réelle sur votre ligne. L'ignorer laisse le temps à celui qui a activé la carte de recevoir vos codes de sécurité par SMS.",
        reflex: "Une notification de votre opérateur sur une opération que vous n'avez pas faite se traite comme une urgence, pas comme un bruit de fond.",
      },
      "call-now": {
        technique: "Échange de carte SIM",
        indicator: "Chaque minute compte, le numéro est déjà entre d'autres mains",
        whyDangerous:
          "C'est la bonne réponse. Le numéro qui vous a été communiqué par l'opérateur lui-même permet de bloquer la ligne immédiatement, avant que les codes de sécurité envoyés par SMS à vos autres comptes ne soient interceptés.",
        reflex: "Un changement de carte SIM non demandé se traite dans la minute : chaque code de sécurité qui suit part sur la carte de quelqu'un d'autre.",
      },
      unsure: {
        technique: "Échange de carte SIM",
        indicator: "Message correspondant exactement à ce que décrit la fiche",
        whyDangerous: "Le doute ici coûte du temps, ce qui est précisément ce dont l'attaquant a besoin.",
        reflex: "Face à ce message précis, la vitesse de réaction est elle-même la protection.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000028",
    scenarioCode: "SCENARIO-000040",
    slug: "email-tentatives-de-connexion-echouees",
    version: 1,
    attackCode: "ACCT-000006",
    channel: "email",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Service en ligne fictif",
    teaser: "Un email signale plusieurs tentatives de connexion échouées sur votre compte, avec un lien pour « sécuriser » l'accès.",
    content: {
      sender: "Sécurité du compte <securite@service-fictif-connexion.example-not-real.test>",
      body: "Nous avons détecté 7 tentatives de connexion échouées sur votre compte au cours des dernières 24 heures.\n\nSi ce n'était pas vous, sécurisez votre compte immédiatement : https://service-fictif-connexion.example-not-real.test/securiser\n\nSi c'était vous, aucune action n'est nécessaire.",
      ui: "email",
    },
    choices: [
      {
        id: "click-secure",
        label: "Je clique sur le lien pour sécuriser mon compte, au cas où",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY", "CLICKED_UNKNOWN_LINK", "MISSED_SUSPICIOUS_DOMAIN"],
      },
      {
        id: "nothing",
        label: "C'était peut-être moi, je ne fais rien",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "own-app",
        label: "J'ouvre l'application ou le site du service par mes propres moyens pour vérifier l'historique de connexion",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["own-app"],
    explanations: {
      "click-secure": {
        technique: "Attaque par force brute",
        indicator: "Domaine qui n'est pas celui du service, lien de « sécurisation » fourni dans le message",
        whyDangerous:
          "Un vrai service ne vous envoie jamais un lien pour « sécuriser » un compte après une alerte de sécurité : il vous renvoie vers votre espace habituel. Ce message imite une alerte légitime précisément pour faire cliquer sur un faux lien de connexion.",
        reflex: "Une alerte de sécurité authentique ne s'accompagne jamais d'un lien à suivre depuis le message lui-même.",
      },
      nothing: {
        technique: "Attaque par force brute",
        indicator: "Nombre précis de tentatives, présenté pour paraître mesuré et crédible",
        whyDangerous:
          "Ne rien faire laisse la question sans réponse dans les deux sens : si l'alerte était réelle, une intrusion en cours reste sans suite ; si elle était fausse, rien ne l'indique non plus. La vérification, elle, tranche dans tous les cas.",
        reflex: "« Ça pourrait être moi » n'est jamais une raison de ne pas vérifier.",
      },
      "own-app": {
        technique: "Attaque par force brute",
        indicator: "Vérification indépendante du message reçu",
        whyDangerous:
          "C'est la bonne réponse. L'historique de connexion consulté depuis l'application ou le site du service, rejoint par vos propres moyens, montre la réalité des tentatives — que le message reçu soit authentique ou non.",
        reflex: "Contre une base ou un compte, l'historique de connexion consulté indépendamment du message reçu est la seule vérification qui tranche.",
      },
      unsure: {
        technique: "Attaque par force brute",
        indicator: "Alerte plausible, lien fourni pour agir vite",
        whyDangerous: "Ne pas cliquer ne fait courir aucun risque : l'historique reste consultable par vos propres moyens à tout moment.",
        reflex: "Dans le doute face à une alerte de sécurité, vérifiez toujours par vos propres moyens plutôt que par le lien reçu.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000029",
    scenarioCode: "SCENARIO-000041",
    slug: "notification-changement-adresse-de-secours",
    version: 1,
    attackCode: "ACCT-000009",
    channel: "email",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Service en ligne fictif",
    teaser: "Un email confirme le changement de votre adresse de secours, que vous n'avez pas modifiée.",
    content: {
      sender: "Notifications <notifications@service-fictif-compte.example-not-real.test>",
      body: "L'adresse email de récupération de votre compte a été modifiée avec succès.\n\nNouvelle adresse de secours : r.dubois-pro@example-not-real.test\n\nSi vous n'êtes pas à l'origine de ce changement, vous disposez de 24 heures pour l'annuler depuis les paramètres de sécurité de votre compte.",
      ui: "email",
    },
    choices: [
      {
        id: "wait-24h",
        label: "J'ai 24 heures d'après le message, je le ferai plus tard dans la journée",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY"],
      },
      {
        id: "reply",
        label: "Je réponds à cet email pour signaler que ce n'était pas moi",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "act-now",
        label: "Je me connecte immédiatement à mon compte par mes propres moyens pour vérifier et annuler ce changement",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["act-now"],
    explanations: {
      "wait-24h": {
        technique: "Détournement de la récupération de compte",
        indicator: "Adresse de secours modifiée sans action de votre part",
        whyDangerous:
          "Le délai annoncé par le message n'est pas une garantie sur laquelle compter : une fois l'adresse de secours changée, celui qui contrôle cette nouvelle adresse peut initier une réinitialisation de mot de passe avant que vous n'agissiez, ce qui rend l'accès au compte encore plus difficile à reprendre.",
        reflex: "Un changement d'adresse de secours non demandé se traite tout de suite, pas dans le créneau qui reste le plus pratique.",
      },
      reply: {
        technique: "Détournement de la récupération de compte",
        indicator: "Adresse d'expéditeur qui n'est pas celle du service, changement déjà effectué",
        whyDangerous:
          "Répondre à cet email ne modifie rien sur le compte : le changement est déjà fait, et cette réponse ne s'adresse ni au bon service ni à personne en mesure d'agir. Ce n'est pas le canal qui permet de reprendre le contrôle.",
        reflex: "Un email de notification ne se répond pas : l'action se fait dans les paramètres du compte lui-même.",
      },
      "act-now": {
        technique: "Détournement de la récupération de compte",
        indicator: "Adresse de secours étrangère, fenêtre de correction limitée",
        whyDangerous:
          "C'est la bonne réponse. Se connecter immédiatement par ses propres moyens et annuler le changement dans les paramètres de sécurité est la seule action qui reprend effectivement le contrôle de la chaîne de récupération avant qu'elle ne soit utilisée.",
        reflex: "Un changement d'adresse de secours non demandé s'annule immédiatement, en se connectant soi-même au compte — jamais en répondant au message.",
      },
      unsure: {
        technique: "Détournement de la récupération de compte",
        indicator: "Nouvelle adresse affichée, ce qui paraît transparent et rassurant",
        whyDangerous: "Le fait que le message affiche la nouvelle adresse ne change rien à l'urgence d'agir : cette adresse ne vous appartient pas.",
        reflex: "Dans le doute, connectez-vous immédiatement à votre compte pour vérifier vos paramètres de sécurité.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000002a",
    scenarioCode: "SCENARIO-000042",
    slug: "ami-signale-message-etrange",
    version: 1,
    attackCode: "ACCT-000010",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Aucune — message d'un ami réel sur votre propre compte",
    teaser: "Un ami vous écrit : « tu m'as envoyé un lien bizarre, tout va bien ? »",
    content: {
      sender: "Message d'un ami, sur un réseau social",
      body: "Salut, tu viens de m'envoyer un lien vers un site de gains gratuits, c'est bien toi qui l'as envoyé ? Ça m'a paru bizarre venant de toi.",
      ui: "web",
    },
    choices: [
      {
        id: "deny",
        label: "Je réponds que ce n'est pas moi et je n'y pense plus",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "change-password-only",
        label: "Je change mon mot de passe et je considère le problème réglé",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "full-check",
        label: "Je change mon mot de passe, vérifie les sessions actives et l'adresse email associée au compte, puis préviens mes autres contacts",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["full-check"],
    explanations: {
      deny: {
        technique: "Piratage de compte de réseau social",
        indicator: "Message envoyé depuis votre compte sans que vous l'ayez écrit",
        whyDangerous:
          "Répondre que ce n'est pas vous laisse le compte dans l'état où il a permis l'envoi du message : toujours accessible à qui l'a pris, qui continuera d'écrire à vos autres contacts au nom de la même relation de confiance.",
        reflex: "Un message envoyé sans vous est un signal d'action, pas une anecdote à corriger auprès d'une seule personne.",
      },
      "change-password-only": {
        technique: "Piratage de compte de réseau social",
        indicator: "Signalement d'un seul contact, l'ampleur réelle reste inconnue",
        whyDangerous:
          "Changer le mot de passe est nécessaire mais ne suffit pas : si une session reste active ailleurs, elle continue de fonctionner malgré le changement, et si l'adresse email associée a été modifiée, vous risquez de ne plus pouvoir reprendre le compte du tout.",
        reflex: "Le mot de passe est une étape parmi trois : sessions, adresse associée, et alerte des contacts.",
      },
      "full-check": {
        technique: "Piratage de compte de réseau social",
        indicator: "Premier signal externe d'une prise de contrôle en cours",
        whyDangerous:
          "C'est la bonne réponse. Changer le mot de passe ferme l'accès par identifiants, vérifier les sessions ferme les accès déjà ouverts, vérifier l'adresse email confirme que vous gardez la main sur la récupération, et prévenir vos contacts limite les dégâts déjà en cours pendant que vous agissez.",
        reflex: "Un signalement d'un contact est le premier indice extérieur d'un compte compromis : mot de passe, sessions, adresse associée, puis alerte des autres contacts, dans cet ordre.",
      },
      unsure: {
        technique: "Piratage de compte de réseau social",
        indicator: "Un seul message reçu d'un ami, situation qui semble mineure",
        whyDangerous: "Vérifier ne coûte que quelques minutes, et le signal, même isolé, est suffisant pour agir.",
        reflex: "Dans le doute face à ce signalement, vérifiez votre compte plutôt que d'attendre d'autres signes.",
      },
    },
  },
];

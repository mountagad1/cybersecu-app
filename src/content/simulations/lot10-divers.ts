import type { SimulationEntry } from "./types";

/**
 * Simulations diverses — téléphones, logiciels malveillants, données,
 * réseaux, et deux fiches de chantage sans matériel réel (lot 10).
 *
 * Mêmes règles de sûreté que les autres fichiers. Les deux scénarios de
 * chantage (chantage-au-faux-piratage, chantage-apres-fuite-de-donnees)
 * ne mettent en scène aucun matériel réel de la victime — c'est
 * précisément ce que la première fiche explique, et la seconde porte sur
 * des identifiants, pas des images. `sextorsion`, qui implique une
 * menace sur du matériel réel, reste hors de ce lot pour une revue
 * séparée et plus lente.
 */
export const SIMULATIONS_LOT10_DIVERS: SimulationEntry[] = [
  {
    versionId: "00000000-0000-4000-8000-000000000035",
    scenarioCode: "SCENARIO-000053",
    slug: "sms-jeu-concours-numero-surtaxe",
    version: 1,
    attackCode: "MOB-000006",
    channel: "sms",
    targetProfile: "senior",
    difficulty: 2,
    impersonatedEntity: "Jeu-concours fictif",
    teaser: "Un SMS annonce un lot à réclamer en appelant un numéro à quatre chiffres.",
    content: {
      sender: "JeuConcours",
      body: "Vous avez été sélectionné(e) pour recevoir un lot d'une valeur de 200 €. Appelez le 81 XX pour le réclamer avant expiration.",
      ui: "sms",
    },
    choices: [
      {
        id: "call",
        label: "J'appelle le numéro pour réclamer mon lot avant qu'il n'expire",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY", "MISSED_UNUSUAL_PAYMENT_REQUEST"],
      },
      {
        id: "text-stop",
        label: "Je réponds STOP au SMS pour ne plus en recevoir",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "delete",
        label: "Je supprime le SMS sans appeler ni répondre",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["delete"],
    explanations: {
      call: {
        technique: "SMS surtaxé",
        indicator: "Numéro à quatre chiffres, lot annoncé sans participation préalable à un jeu",
        whyDangerous:
          "Le numéro à quatre chiffres est un numéro surtaxé : l'appel lui-même est facturé, parfois à la minute, et c'est ce préjudice qui passe par la facture opérateur plutôt que par la banque. Il n'y a généralement aucun lot à la clé.",
        reflex: "Un numéro court à quatre chiffres dans un SMS non sollicité est en lui-même le signal, avant même le contenu du message.",
      },
      "text-stop": {
        technique: "SMS surtaxé",
        indicator: "SMS non sollicité annonçant un gain",
        whyDangerous:
          "Répondre STOP à un SMS frauduleux confirme surtout que le numéro est actif et surveillé, ce qui peut attirer d'autres envois du même type. Cette option existe pour du démarchage commercial légitime, pas pour un message de ce genre.",
        reflex: "Un SMS frauduleux ne se désactive pas en y répondant ; il se supprime.",
      },
      delete: {
        technique: "SMS surtaxé",
        indicator: "Lot annoncé sans participation, numéro à composer facturé",
        whyDangerous:
          "C'est la bonne réponse. Aucun jeu auquel vous n'avez pas participé ne peut vous avoir désigné gagnant, et le numéro à composer est ce qui génère le préjudice.",
        reflex: "Un gain annoncé par SMS pour un jeu auquel vous n'avez pas joué se supprime sans appeler ni répondre.",
      },
      unsure: {
        technique: "SMS surtaxé",
        indicator: "Message court, urgence d'agir avant expiration",
        whyDangerous: "Ne rien faire ne fait perdre aucun gain réel.",
        reflex: "Dans le doute face à un gain annoncé par SMS, ne composez jamais le numéro donné.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000036",
    scenarioCode: "SCENARIO-000054",
    slug: "connexion-avec-compte-google-jeu-mobile",
    version: 1,
    attackCode: "DATA-000006",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Jeu mobile fictif",
    teaser: "Un petit jeu mobile propose de se connecter avec un compte existant plutôt que d'en créer un nouveau.",
    content: {
      sender: "Écran de connexion — jeu mobile « Puzzle Quotidien »",
      body: "Se connecter avec votre compte pour sauvegarder votre progression.\n\nCette application demande l'autorisation de :\n— Lire et envoyer des emails en votre nom\n— Accéder à votre liste de contacts\n— Voir votre agenda\n\n[ Continuer avec ce compte ]",
      ui: "web",
    },
    choices: [
      {
        id: "connect",
        label: "Je me connecte avec mon compte principal, c'est plus rapide qu'un nouveau compte",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "connect-secondary",
        label: "Je me connecte avec un compte secondaire que j'utilise peu, par précaution",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "create-account",
        label: "Je crée un compte dédié au jeu plutôt que d'accorder ces autorisations à mon compte existant",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["create-account"],
    explanations: {
      connect: {
        technique: "Abus d'autorisation « Se connecter avec »",
        indicator: "Autorisations d'envoyer des emails et de lire l'agenda pour un simple jeu",
        whyDangerous:
          "Un jeu de puzzle n'a aucun besoin de lire ou d'envoyer des emails en votre nom, ni de consulter votre agenda. Ces autorisations, une fois accordées, restent actives indépendamment de votre mot de passe et bien après que vous ayez cessé de jouer.",
        reflex: "L'autorisation doit correspondre à la fonction. Un jeu qui demande l'accès à vos emails dépasse largement ce dont il a besoin.",
      },
      "connect-secondary": {
        technique: "Abus d'autorisation « Se connecter avec »",
        indicator: "Étendue de l'autorisation qui ne change pas selon le compte utilisé",
        whyDangerous:
          "Utiliser un compte secondaire réduit ce qui est exposé mais n'évite pas le problème : ce compte accorde quand même un accès large et durable à un service qui n'en a pas besoin, et vous devrez y penser pour le révoquer plus tard.",
        reflex: "Réduire l'exposition n'est pas la même chose que refuser une autorisation disproportionnée.",
      },
      "create-account": {
        technique: "Abus d'autorisation « Se connecter avec »",
        indicator: "Fonction simple, autorisation large et durable proposée par commodité",
        whyDangerous:
          "C'est la bonne réponse. Un compte dédié, sans lien avec votre messagerie principale, limite ce qui peut être affecté si le service est un jour compromis ou revendu — sans qu'aucune autorisation excessive ne soit jamais accordée.",
        reflex: "Pour un service qui n'a pas besoin de vos données, préférez un compte dédié à la connexion par un compte existant.",
      },
      unsure: {
        technique: "Abus d'autorisation « Se connecter avec »",
        indicator: "Connexion rapide proposée comme la voie la plus simple",
        whyDangerous: "Créer un compte séparé prend quelques secondes de plus et ne fait perdre aucune fonctionnalité du jeu.",
        reflex: "Dans le doute, préférez toujours un compte dédié à l'octroi d'autorisations larges sur votre compte principal.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000037",
    scenarioCode: "SCENARIO-000055",
    slug: "notification-connexion-application-camera",
    version: 1,
    attackCode: "MOB-000009",
    channel: "web",
    targetProfile: "senior",
    difficulty: 3,
    impersonatedEntity: "Application fictive de caméra de surveillance",
    teaser: "L'application de votre caméra de surveillance signale une connexion depuis un appareil inconnu.",
    content: {
      sender: "Notification — application de la caméra de surveillance",
      body: "Nouvelle connexion détectée depuis un appareil non reconnu.\nLieu approximatif : ville différente de la vôtre.\n\nSi ce n'est pas vous, changez votre mot de passe dès que possible.",
      ui: "web",
    },
    choices: [
      {
        id: "dismiss",
        label: "Je ferme la notification, c'est probablement une erreur de géolocalisation",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check-later",
        label: "Je m'en occuperai plus tard si je remarque quelque chose d'anormal sur les images",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY", "RESPONDED_TO_URGENCY"],
      },
      {
        id: "change-now",
        label: "Je change immédiatement le mot de passe et vérifie l'historique des connexions dans l'application",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["change-now"],
    explanations: {
      dismiss: {
        technique: "Caméra de surveillance piratée",
        indicator: "Lieu de connexion différent du vôtre, appareil non reconnu",
        whyDangerous:
          "Cette notification vient de l'application elle-même, pas d'un message externe à vérifier : elle décrit une connexion réelle qui a eu lieu. L'écarter comme une erreur laisse un accès étranger actif sur un flux qui montre l'intérieur de votre domicile.",
        reflex: "Une notification de connexion inconnue émise par l'application elle-même décrit un fait, pas une hypothèse à écarter.",
      },
      "check-later": {
        technique: "Caméra de surveillance piratée",
        indicator: "Accès déjà actif au moment de la notification",
        whyDangerous:
          "Attendre un signe visible sur les images laisse l'accès ouvert entre-temps, et un accès discret peut ne jamais produire de signe visible tout en durant longtemps. Le moment d'agir est la notification elle-même, pas une confirmation ultérieure.",
        reflex: "N'attendez pas un symptôme visible : la notification de connexion est déjà la confirmation.",
      },
      "change-now": {
        technique: "Caméra de surveillance piratée",
        indicator: "Connexion réelle depuis un lieu et un appareil non reconnus",
        whyDangerous:
          "C'est la bonne réponse. Changer le mot de passe ferme l'accès par identifiants, et l'historique des connexions dans l'application confirme l'étendue de ce qui s'est passé — les deux gestes que la fiche recommande.",
        reflex: "Face à une connexion inconnue signalée par l'application, changez le mot de passe sans attendre et vérifiez l'historique.",
      },
      unsure: {
        technique: "Caméra de surveillance piratée",
        indicator: "Notification technique, ton neutre",
        whyDangerous: "Changer le mot de passe ne fait perdre aucun accès légitime, qu'il suffit de ressaisir.",
        reflex: "Dans le doute face à cette notification, changez le mot de passe : ce geste ne coûte rien et ferme l'accès signalé.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000038",
    scenarioCode: "SCENARIO-000056",
    slug: "email-chantage-mot-de-passe-ancien",
    version: 1,
    attackCode: "PERS-000002",
    channel: "email",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Aucune — message d'extorsion générique",
    teaser: "Un email affirme avoir pris le contrôle de votre webcam et cite un ancien mot de passe comme preuve.",
    content: {
      sender: "Adresse email aléatoire, différente à chaque envoi",
      body: "J'ai installé un logiciel espion sur votre appareil il y a plusieurs mois. Je vous ai filmé(e) à votre insu. Pour preuve, votre mot de passe est : [ancien mot de passe, effectivement déjà utilisé par vous]\n\nPayez sous 48 heures ou j'envoie la vidéo à tous vos contacts.",
      ui: "email",
    },
    choices: [
      {
        id: "pay",
        label: "Je paie : le mot de passe cité est bien le mien, ça prouve qu'il dit vrai",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY"],
      },
      {
        id: "reply-negotiate",
        label: "Je réponds pour demander une preuve supplémentaire avant de décider",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "ignore-and-change",
        label: "Je ne réponds pas, je supprime le message et je change ce mot de passe partout où il était utilisé",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["ignore-and-change"],
    explanations: {
      pay: {
        technique: "Chantage au faux piratage",
        indicator: "Mot de passe ancien cité comme preuve, aucune image jointe",
        whyDangerous:
          "Le mot de passe cité provient presque toujours d'une fuite de données ancienne et déjà largement diffusée, pas d'un logiciel espion installé sur votre appareil. C'est un message envoyé en masse, sans support réel derrière la menace, et payer ne fait qu'encourager son auteur.",
        reflex: "Un mot de passe exact ne prouve pas qu'un appareil est surveillé ; il prouve seulement qu'il a fuité un jour, quelque part.",
      },
      "reply-negotiate": {
        technique: "Chantage au faux piratage",
        indicator: "Adresse d'expéditeur aléatoire, message envoyé en masse",
        whyDangerous:
          "Répondre confirme que l'adresse est surveillée et peut déclencher davantage de sollicitations, y compris d'autres tentatives. Il n'existe aucun matériel réel dont demander la preuve : la menace elle-même est vide.",
        reflex: "Il n'y a rien à négocier avec un message qui n'a aucun support réel derrière lui.",
      },
      "ignore-and-change": {
        technique: "Chantage au faux piratage",
        indicator: "Menace sans support réel, s'appuyant uniquement sur un mot de passe déjà fuité",
        whyDangerous:
          "C'est la bonne réponse. Le seul élément réel de ce message est le mot de passe divulgué ; le changer, ainsi que partout où il était réutilisé, traite le problème effectif sans jamais engager d'échange avec l'auteur.",
        reflex: "Ne payez pas, ne répondez pas. Changez le mot de passe cité et partout où il était réutilisé, et activez la double authentification.",
      },
      unsure: {
        technique: "Chantage au faux piratage",
        indicator: "Délai de 48 heures, menace de diffusion",
        whyDangerous: "Ne rien payer ne fait courir aucun risque supplémentaire : il n'existe aucun matériel réel à diffuser.",
        reflex: "Dans le doute face à ce type de message, ne payez jamais et changez le mot de passe cité.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000039",
    scenarioCode: "SCENARIO-000057",
    slug: "menace-publication-donnees-apres-fuite",
    version: 1,
    attackCode: "PERS-000010",
    channel: "email",
    targetProfile: "business",
    difficulty: 4,
    impersonatedEntity: "Aucune — auteur d'une menace liée à une fuite réelle",
    teaser: "Après une fuite de données confirmée chez un prestataire, un message menace de publier les informations si rien n'est payé.",
    content: {
      sender: "Adresse email anonyme",
      body: "Nous détenons les données extraites lors de la fuite récemment confirmée par votre prestataire. Ces informations seront publiées ou revendues sous 72 heures si le paiement demandé n'est pas effectué à l'adresse ci-jointe.",
      ui: "email",
    },
    choices: [
      {
        id: "pay-for-deletion",
        label: "Je paie pour obtenir la suppression garantie des données avant la publication",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY"],
      },
      {
        id: "negotiate-amount",
        label: "J'engage une négociation sur le montant pour gagner du temps",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "act-on-controllable",
        label: "Je ne paie pas, je change les mots de passe concernés et je me prépare à une vague d'hameçonnage",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["act-on-controllable"],
    explanations: {
      "pay-for-deletion": {
        technique: "Chantage après fuite de données",
        indicator: "Promesse de suppression en échange d'un paiement",
        whyDangerous:
          "Aucune suppression ne peut être vérifiée après paiement, et les données d'une fuite sont fréquemment détenues par plusieurs acteurs différents : payer l'un n'empêche en rien les autres de les détenir toujours.",
        reflex: "Une promesse de suppression contre paiement ne peut jamais être vérifiée ; elle ne doit donc jamais être crue.",
      },
      "negotiate-amount": {
        technique: "Chantage après fuite de données",
        indicator: "Délai de 72 heures utilisé pour pousser à une décision rapide",
        whyDangerous:
          "Négocier engage un échange avec l'auteur de la menace et confirme qu'un contact peut aboutir à un paiement, ce qui encourage la poursuite de la démarche plutôt que d'y mettre fin. Le montant n'est pas le problème central.",
        reflex: "Négocier une demande de ce type revient à la valider, quel que soit le montant obtenu.",
      },
      "act-on-controllable": {
        technique: "Chantage après fuite de données",
        indicator: "Fuite réelle confirmée, mais dont la diffusion ultérieure échappe à tout contrôle",
        whyDangerous:
          "C'est la bonne réponse. Ce que vous pouvez réellement contrôler, ce sont les mots de passe concernés et la double authentification ; la fiche prévient aussi que ces données serviront d'abord à rendre crédible une vague d'hameçonnage à venir.",
        reflex: "Ne payez pas : agissez sur ce que vous contrôlez encore — mots de passe, double authentification — et anticipez l'hameçonnage qui suit généralement.",
      },
      unsure: {
        technique: "Chantage après fuite de données",
        indicator: "Fuite confirmée par ailleurs, ce qui rend la menace plus crédible",
        whyDangerous: "Ne pas payer ne change rien à ce qui a déjà fuité, et payer ne le change pas non plus.",
        reflex: "Dans le doute, ne payez jamais une demande liée à une fuite : agissez uniquement sur ce que vous contrôlez encore.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000003a",
    scenarioCode: "SCENARIO-000058",
    slug: "logiciel-professionnel-pirate-en-telechargement",
    version: 1,
    attackCode: "MAL-000002",
    channel: "web",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "Site fictif de partage de logiciels",
    teaser: "Un logiciel de retouche habituellement payant est proposé gratuitement, avec un fichier pour contourner l'activation.",
    content: {
      sender: "Forum fictif de partage de logiciels",
      body: "PhotoStudio Pro 2026 — Version complète GRATUITE\n\nTéléchargez le logiciel + le fichier d'activation. Suivez les instructions : lancez l'installeur, puis exécutez le fichier « activation.exe » et désactivez temporairement votre antivirus s'il bloque l'opération.",
      ui: "web",
    },
    choices: [
      {
        id: "download",
        label: "Je télécharge et désactive l'antivirus comme indiqué, pour que ça fonctionne",
        mistakePatternCodes: ["CLICKED_UNKNOWN_LINK", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "download-keep-av",
        label: "Je télécharge mais je garde l'antivirus activé, il bloquera ce qui est vraiment dangereux",
        mistakePatternCodes: ["CLICKED_UNKNOWN_LINK"],
      },
      {
        id: "refuse",
        label: "Je n'installe rien : un logiciel payant proposé gratuitement avec un contournement n'est pas fiable",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["refuse"],
    explanations: {
      download: {
        technique: "Cheval de Troie",
        indicator: "Instruction de désactiver l'antivirus pour terminer l'installation",
        whyDangerous:
          "Demander de désactiver la protection est le signal le plus net possible : un logiciel légitime n'en a jamais besoin. Le fichier « d'activation » est le moyen le plus courant de faire exécuter volontairement un programme piégé.",
        reflex: "Une instruction de désactiver son antivirus pour continuer une installation est en elle-même une raison suffisante de tout arrêter.",
      },
      "download-keep-av": {
        technique: "Cheval de Troie",
        indicator: "Fichier d'activation d'origine inconnue, exécuté volontairement",
        whyDangerous:
          "Garder l'antivirus actif aide, mais l'installeur peut demander sa désactivation à un moment de l'installation, et un programme piégé récent peut aussi ne pas être détecté immédiatement. Ce n'est pas une garantie suffisante face à un téléchargement dont la source n'est pas l'éditeur.",
        reflex: "L'antivirus est une protection parmi d'autres, pas une raison de télécharger depuis une source non fiable.",
      },
      refuse: {
        technique: "Cheval de Troie",
        indicator: "Logiciel payant proposé gratuitement, avec un moyen de contourner l'activation",
        whyDangerous:
          "C'est la bonne réponse. Un logiciel normalement payant, proposé gratuitement avec un fichier de contournement, réunit à lui seul les deux signaux les plus fiables de cette famille d'attaques.",
        reflex: "Un logiciel payant proposé gratuitement, avec un moyen de contourner son activation, ne s'installe jamais.",
      },
      unsure: {
        technique: "Cheval de Troie",
        indicator: "Logiciel utile, présenté comme gratuit",
        whyDangerous: "Ne pas installer ne fait perdre qu'un logiciel dont la version gratuite était de toute façon suspecte.",
        reflex: "Dans le doute face à un logiciel payant proposé gratuitement, n'installez pas.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000003b",
    scenarioCode: "SCENARIO-000059",
    slug: "avertissement-certificat-site-habituel",
    version: 1,
    attackCode: "NET-000004",
    channel: "web",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Aucune — avertissement du navigateur sur un site habituel",
    teaser: "En ouvrant un site que vous consultez sans problème d'habitude, le navigateur affiche un avertissement de sécurité.",
    content: {
      sender: "Avertissement du navigateur",
      body: "Votre connexion n'est pas privée\n\nDes pirates informatiques pourraient essayer de voler vos informations depuis ce site. Ce problème peut être lié à une configuration incorrecte du serveur, ou à quelqu'un qui usurpe ce site.\n\n[ Retour, par sécurité ]     [ Paramètres avancés ]",
      ui: "web",
    },
    choices: [
      {
        id: "proceed",
        label: "Je passe outre l'avertissement, ce site fonctionne toujours normalement d'habitude",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_DISPLAY_NAME"],
      },
      {
        id: "retry-later",
        label: "Je réessaie plus tard, c'est probablement temporaire",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "go-back",
        label: "Je reviens en arrière sans continuer, et je réessaie depuis un autre réseau",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["go-back"],
    explanations: {
      proceed: {
        technique: "Empoisonnement DNS",
        indicator: "Avertissement de certificat sur un site habituellement sans problème",
        whyDangerous:
          "Le fait que le site fonctionne d'habitude sans problème est justement ce qui rend l'avertissement significatif : quelque chose a changé, précisément sur cette connexion. Passer outre revient à transmettre vos données à un serveur qui n'a pas pu prouver son identité.",
        reflex: "Ne passez jamais outre un avertissement de certificat, quelle que soit votre habitude avec le site concerné.",
      },
      "retry-later": {
        technique: "Empoisonnement DNS",
        indicator: "Avertissement qui peut provenir d'une altération locale, pas d'un incident temporaire du site",
        whyDangerous:
          "Si l'altération vient de votre réseau ou de votre appareil plutôt que du site lui-même, réessayer plus tard depuis le même point ne change rien : le problème persistera tant que sa cause n'a pas été identifiée.",
        reflex: "Un avertissement de certificat ne se résout pas en attendant ; il se résout en changeant de réseau ou en identifiant la cause.",
      },
      "go-back": {
        technique: "Empoisonnement DNS",
        indicator: "Avertissement isolé à ce réseau, sur un site par ailleurs fiable",
        whyDangerous:
          "C'est la bonne réponse. Revenir en arrière évite toute transmission de données au serveur non vérifié, et tester depuis un autre réseau permet de savoir si le problème vient de votre connexion actuelle plutôt que du site.",
        reflex: "Face à un avertissement de certificat, reculez et testez depuis un autre réseau plutôt que de forcer le passage.",
      },
      unsure: {
        technique: "Empoisonnement DNS",
        indicator: "Message technique, site par ailleurs connu",
        whyDangerous: "Revenir en arrière ne fait perdre aucun accès légitime, accessible autrement une fois la cause identifiée.",
        reflex: "Dans le doute face à un avertissement de certificat, ne continuez jamais.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000003c",
    scenarioCode: "SCENARIO-000060",
    slug: "verification-identite-avant-annonce-vehicule",
    version: 1,
    attackCode: "DATA-000009",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Acheteur fictif intéressé par un véhicule en vente",
    teaser: "Un acheteur intéressé demande une photo de votre pièce d'identité « pour vérification » avant toute rencontre.",
    content: {
      sender: "« Acheteur intéressé » — messagerie d'une plateforme de petites annonces",
      body: "Bonjour, votre véhicule m'intéresse beaucoup. Avant de convenir d'un rendez-vous, la plateforme m'impose de vérifier l'identité des vendeurs pour ce type de montant : pouvez-vous m'envoyer une photo recto-verso de votre carte d'identité ?",
      ui: "web",
    },
    choices: [
      {
        id: "send-id",
        label: "J'envoie la photo, c'est une demande logique pour un montant important",
        mistakePatternCodes: ["MISSED_UNUSUAL_PAYMENT_REQUEST", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "send-marked",
        label: "J'envoie une copie avec une mention manuscrite indiquant l'usage et la date",
        mistakePatternCodes: [],
      },
      {
        id: "refuse-and-verify",
        label: "Je refuse et je vérifie moi-même auprès de la plateforme si cette exigence existe réellement",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["refuse-and-verify"],
    explanations: {
      "send-id": {
        technique: "Fraude aux documents d'identité",
        indicator: "Pièce d'identité demandée par un particulier, avant toute rencontre",
        whyDangerous:
          "Une plateforme de petites annonces ne demande jamais à un acheteur de vérifier l'identité d'un vendeur par ce moyen : c'est le prétexte, pas une procédure réelle. Une pièce d'identité transmise ainsi peut ensuite servir à constituer un dossier en votre nom, bien après cette conversation.",
        reflex: "Aucune plateforme de petites annonces n'exige la vérification d'identité d'un vendeur par un acheteur.",
      },
      "send-marked": {
        technique: "Fraude aux documents d'identité",
        indicator: "Demande présentée comme une exigence de la plateforme, invérifiée",
        whyDangerous:
          "Une mention manuscrite limite la réutilisation sans l'empêcher, et surtout ne traite pas la question de fond : cette exigence n'existe pas réellement sur la plateforme, donc aucune version de ce document ne devrait être envoyée à ce stade.",
        reflex: "Marquer un document réduit le risque d'une demande légitime ; ce n'est pas une réponse à une demande qui n'aurait jamais dû être faite.",
      },
      "refuse-and-verify": {
        technique: "Fraude aux documents d'identité",
        indicator: "Prétexte attribué à la plateforme, jamais vérifié à sa source",
        whyDangerous:
          "C'est la bonne réponse. Vérifier directement auprès de la plateforme confirme en général qu'aucune telle exigence n'existe, ce qui clôt la démarche sans jamais transmettre le document.",
        reflex: "Une exigence attribuée à un tiers — plateforme, organisme — se vérifie à sa source avant d'être suivie.",
      },
      unsure: {
        technique: "Fraude aux documents d'identité",
        indicator: "Montant important, justification plausible",
        whyDangerous: "Ne rien envoyer ne fait perdre aucune vente réelle, qui peut se conclure sans ce document.",
        reflex: "Dans le doute, vérifiez toute exigence attribuée à une plateforme directement auprès d'elle.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000003d",
    scenarioCode: "SCENARIO-000061",
    slug: "message-rancongiciel-fichiers-verrouilles",
    version: 1,
    attackCode: "MAL-000001",
    channel: "web",
    targetProfile: "business",
    difficulty: 3,
    impersonatedEntity: "Aucune — message affiché après le chiffrement des fichiers",
    teaser: "Tous les fichiers de l'ordinateur sont devenus illisibles. Un message réclame une rançon en cryptomonnaie.",
    content: {
      sender: "Message affiché en plein écran sur l'ordinateur touché",
      body: "TOUS VOS FICHIERS ONT ÉTÉ CHIFFRÉS.\n\nPour les récupérer, envoyez l'équivalent de 900 € en cryptomonnaie à l'adresse indiquée dans les 72 heures. Passé ce délai, la clé sera détruite et vos fichiers perdus définitivement.",
      ui: "web",
    },
    choices: [
      {
        id: "pay-fast",
        label: "Je paie rapidement pour récupérer les fichiers avant l'expiration du délai",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY"],
      },
      {
        id: "reformat-now",
        label: "Je reformate immédiatement la machine pour tout effacer et repartir de zéro",
        mistakePatternCodes: [],
      },
      {
        id: "disconnect-and-report",
        label: "Je débranche l'appareil du réseau, je conserve les fichiers chiffrés et je signale les faits",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["disconnect-and-report"],
    explanations: {
      "pay-fast": {
        technique: "Rançongiciel",
        indicator: "Délai de 72 heures, menace de destruction définitive",
        whyDangerous:
          "Le paiement ne garantit pas le rétablissement des fichiers : vous dépendez entièrement de la volonté de l'attaquant, sans aucun recours si l'outil promis ne fonctionne pas. Payer finance en outre l'activité et vous désigne comme payeur pour la suite.",
        reflex: "Aucun délai affiché par un rançongiciel n'a de fonction technique réelle ; il sert uniquement à empêcher de réfléchir.",
      },
      "reformat-now": {
        technique: "Rançongiciel",
        indicator: "Fichiers chiffrés, dont un moyen de déchiffrement peut exister ou apparaître plus tard",
        whyDangerous:
          "Reformater tout de suite efface aussi les fichiers chiffrés eux-mêmes, alors qu'un outil de déchiffrement peut exister ou être publié après coup pour cette variante précise. Les conserver ne coûte rien et garde une chance de récupération.",
        reflex: "Ne reformatez pas avant d'avoir conservé une copie des fichiers chiffrés : un outil de déchiffrement peut apparaître plus tard.",
      },
      "disconnect-and-report": {
        technique: "Rançongiciel",
        indicator: "Propagation possible à tout appareil ou dossier partagé encore accessible",
        whyDangerous:
          "C'est la bonne réponse. Débrancher stoppe une propagation en cours vers d'autres appareils ou dossiers partagés, conserver les fichiers chiffrés préserve une chance de récupération future, et le signalement oriente vers les outils de déchiffrement disponibles.",
        reflex: "Débranchez du réseau, ne payez pas, conservez les fichiers chiffrés, et signalez les faits sur cybermalveillance.gouv.fr.",
      },
      unsure: {
        technique: "Rançongiciel",
        indicator: "Situation impressionnante, décision qui semble devoir être prise vite",
        whyDangerous: "Prendre le temps de débrancher et de signaler ne fait perdre aucune chance de récupération, contrairement au paiement.",
        reflex: "Dans le doute face à un rançongiciel, débranchez, ne payez pas, et signalez la situation.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000003e",
    scenarioCode: "SCENARIO-000062",
    slug: "alerte-antivirus-numero-a-appeler",
    version: 1,
    attackCode: "MAL-000010",
    channel: "web",
    targetProfile: "senior",
    difficulty: 2,
    impersonatedEntity: "Aucune — alerte affichée par une page web",
    teaser: "Une alerte plein écran affirme que l'ordinateur est infecté et donne un numéro à appeler pour de l'aide.",
    content: {
      sender: "Page web consultée",
      body: "⚠ VOTRE ORDINATEUR EST INFECTÉ ⚠\n\nDes données personnelles sont en danger. N'éteignez pas votre ordinateur.\n\nAppelez immédiatement notre support technique : 08 XX XX XX XX",
      ui: "web",
    },
    choices: [
      {
        id: "call-support",
        label: "J'appelle le numéro indiqué avant d'éteindre, comme demandé",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY", "TRUSTED_AUTHORITY"],
      },
      {
        id: "restart-computer",
        label: "Je redémarre complètement l'ordinateur pour voir si l'alerte disparaît",
        mistakePatternCodes: [],
      },
      {
        id: "close-browser",
        label: "Je ferme le navigateur par le gestionnaire des tâches, sans appeler ni cliquer sur rien",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["close-browser"],
    explanations: {
      "call-support": {
        technique: "Scareware",
        indicator: "Alerte affichée dans une page web, numéro de téléphone à appeler",
        whyDangerous:
          "Une page web consultée n'a techniquement aucun moyen d'examiner votre ordinateur : cette alerte est fabriquée pour être crédible. Appeler le numéro mène généralement vers un faux support technique, qui cherchera ensuite à obtenir un accès à distance à votre machine.",
        reflex: "Aucune page web ne peut analyser votre ordinateur. Un numéro à appeler affiché dans une alerte de ce type ne mène jamais à un vrai support.",
      },
      "restart-computer": {
        technique: "Scareware",
        indicator: "Consigne de ne pas éteindre l'appareil",
        whyDangerous:
          "Redémarrer est sans danger ici, mais la consigne « n'éteignez pas » cherche justement à empêcher ce geste simple qui fait disparaître l'alerte. Ce n'est pas la solution la plus directe : fermer le navigateur suffit et évite un redémarrage complet.",
        reflex: "La consigne de ne pas éteindre l'appareil est elle-même un signal ; l'alerte n'a aucun pouvoir sur votre matériel.",
      },
      "close-browser": {
        technique: "Scareware",
        indicator: "Alerte plein écran chargée dans une page consultée",
        whyDangerous:
          "C'est la bonne réponse. Fermer le navigateur par le gestionnaire des tâches, sans cliquer sur aucun bouton de l'alerte ni appeler le numéro, fait disparaître une page qui n'avait de toute façon aucun pouvoir sur l'appareil.",
        reflex: "Fermez le navigateur sans cliquer sur rien dans l'alerte et sans appeler le numéro affiché.",
      },
      unsure: {
        technique: "Scareware",
        indicator: "Présentation alarmante, urgence affichée",
        whyDangerous: "Fermer le navigateur ne fait perdre aucune protection réelle : le logiciel de sécurité installé continue de fonctionner normalement.",
        reflex: "Dans le doute face à une alerte de ce type, fermez le navigateur sans rien faire d'autre.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000003f",
    scenarioCode: "SCENARIO-000063",
    slug: "amie-signale-faux-profil-a-votre-nom",
    version: 1,
    attackCode: "PERS-000007",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Faux profil créé au nom de la victime",
    teaser: "Une amie vous signale un second profil à votre nom, avec vos photos, qui lui demande de l'argent.",
    content: {
      sender: "Message d'une amie, sur votre compte authentique",
      body: "Salut, il y a un autre profil à ton nom, avec tes photos, qui vient de me demander de l'argent en urgence en se faisant passer pour toi. C'est bien toi qui as un problème ou c'est un faux compte ?",
      ui: "web",
    },
    choices: [
      {
        id: "wait",
        label: "J'attends d'avoir plus de signalements avant de faire quoi que ce soit",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "report-only",
        label: "Je signale le faux compte à la plateforme et j'attends son traitement",
        mistakePatternCodes: [],
      },
      {
        id: "post-warning",
        label: "Je publie immédiatement depuis mon compte authentique pour prévenir tous mes contacts, puis je signale le faux compte",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["post-warning"],
    explanations: {
      wait: {
        technique: "Usurpation de profil sur les réseaux sociaux",
        indicator: "Faux profil actif, sollicitant déjà de l'argent auprès de vos contacts",
        whyDangerous:
          "Le faux profil continue de solliciter vos contacts pendant l'attente, et chaque nouvelle sollicitation aggrave ce qu'il faudra ensuite corriger. Un seul signalement de confiance suffit à agir, il n'est pas nécessaire d'en accumuler d'autres.",
        reflex: "Un signalement fiable d'un proche suffit à agir ; il n'y a pas besoin d'en attendre davantage.",
      },
      "report-only": {
        technique: "Usurpation de profil sur les réseaux sociaux",
        indicator: "Sollicitation en cours auprès de vos contacts pendant le traitement du signalement",
        whyDangerous:
          "Le signalement à la plateforme est nécessaire mais prend du temps à être traité, pendant lequel le faux profil continue de solliciter vos contacts. La publication depuis votre compte authentique agit immédiatement, sans attendre ce délai.",
        reflex: "Le signalement à la plateforme est une étape parmi deux ; la publication immédiate protège vos contacts en attendant.",
      },
      "post-warning": {
        technique: "Usurpation de profil sur les réseaux sociaux",
        indicator: "Faux profil sollicitant activement l'entourage au nom de la victime",
        whyDangerous:
          "C'est la bonne réponse. Publier depuis votre compte authentique est l'action la plus rapide et la plus efficace : elle neutralise le faux compte avant tout retrait en avertissant directement l'entourage, avant même que la plateforme n'ait traité le signalement qui suit.",
        reflex: "Prévenez vos contacts par une publication depuis votre compte authentique en premier, puis signalez le faux compte à la plateforme.",
      },
      unsure: {
        technique: "Usurpation de profil sur les réseaux sociaux",
        indicator: "Signalement d'une seule personne, situation qui semble limitée",
        whyDangerous: "Agir tout de suite ne coûte qu'une publication, et un faux profil actif ne s'arrête pas de lui-même.",
        reflex: "Dans le doute face à ce signalement, publiez un avertissement depuis votre compte authentique sans attendre.",
      },
    },
  },
];

import type { SimulationEntry } from "./types";

/**
 * Simulations — IA et contenus synthétiques (lot 10).
 *
 * Mêmes règles de sûreté que les autres fichiers : toute entité est
 * fictive, tout domaine sous le TLD réservé `.test`, rien n'est jamais
 * saisi ni transmis. Même règle de rédaction : le mauvais choix est
 * celui qu'une personne raisonnable ferait.
 *
 * RÈGLE PROPRE À CETTE FAMILLE, héritée du fichier de contenu
 * correspondant : aucune statistique, aucune capacité chiffrée, aucun nom
 * d'outil ou de marque d'IA réel. Chaque scénario nomme la vérification
 * qui résiste — rappel sur un numéro connu, double validation, recherche
 * indépendante — jamais un indice visuel présenté comme fiable.
 *
 * `detournement-de-photos-par-ia` (AI-000009) touche à une extorsion liée
 * à des images : le scénario décrit la réception du message et sa
 * structure, sans jamais rien décrire des images elles-mêmes.
 */
export const SIMULATIONS_IA_ET_CONTENUS_SYNTHETIQUES: SimulationEntry[] = [
  {
    versionId: "00000000-0000-4000-8000-00000000002b",
    scenarioCode: "SCENARIO-000043",
    slug: "video-virale-personnalite-investissement",
    version: 1,
    attackCode: "AI-000001",
    channel: "social_media",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Personnalité publique fictive",
    teaser: "Une vidéo qui circule montre une personnalité connue recommander un placement financier.",
    content: {
      sender: "Vidéo partagée par un compte créé la semaine dernière",
      body: "« Ce placement m'a permis de multiplier mon capital en quelques mois. Je recommande cette plateforme à tous ceux qui veulent sécuriser leur avenir. »\n— Extrait vidéo, relayé sans lien vers une source d'origine identifiable.\n\nLien vers la plateforme en commentaire épinglé.",
      ui: "web",
    },
    choices: [
      {
        id: "invest",
        label: "Je clique sur le lien : si c'est cette personne qui le dit, ça inspire confiance",
        mistakePatternCodes: ["TRUSTED_AUTHORITY", "CLICKED_UNKNOWN_LINK"],
      },
      {
        id: "watch-again",
        label: "Je regarde la vidéo une seconde fois pour vérifier si le visage et la voix sont convaincants",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "search-source",
        label: "Je cherche si cette déclaration est reprise par une source identifiable avant d'y toucher",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["search-source"],
    explanations: {
      invest: {
        technique: "Deepfake vidéo",
        indicator: "Compte récent, recadrage empêchant de remonter à une source d'origine",
        whyDangerous:
          "L'usage d'une personnalité connue pour recommander un placement est un scénario récurrent, et l'apparence de la vidéo ne garantit plus rien : un visage et une voix reconnaissables peuvent être reproduits. Le doute doit se déplacer de l'image vers sa provenance.",
        reflex: "Aucun placement légitime ne se propose par une vidéo relayée sans source, quelle que soit la personne qui semble y parler.",
      },
      "watch-again": {
        technique: "Deepfake vidéo",
        indicator: "Vidéo courte, recadrée, sans mouvement de tête ample",
        whyDangerous:
          "L'examen visuel n'est pas concluant à lui seul : une vidéo bien fabriquée résiste à un second visionnage, et une vidéo authentique de mauvaise qualité peut au contraire éveiller un doute infondé. Ce n'est pas là que se trouve la réponse fiable.",
        reflex: "L'analyse de l'image vient en dernier ; elle ne tranche jamais seule.",
      },
      "search-source": {
        technique: "Deepfake vidéo",
        indicator: "Déclaration importante qu'aucune source identifiable ne reprend",
        whyDangerous:
          "C'est la bonne réponse. Une prise de parole réelle d'une personne connue laisse des traces multiples et concordantes ; l'absence de toute reprise par une source identifiable est le signal qui compte, indépendamment de la qualité de la vidéo.",
        reflex: "Cherchez la déclaration ailleurs avant de juger l'image : une parole publique réelle se retrouve toujours à plusieurs endroits.",
      },
      unsure: {
        technique: "Deepfake vidéo",
        indicator: "Vidéo bien produite, personnalité reconnaissable",
        whyDangerous: "Ne rien faire ne fait perdre aucune opportunité réelle : un placement légitime reste accessible par ses canaux habituels.",
        reflex: "Dans le doute, ne relayez pas et ne cliquez sur rien avant d'avoir trouvé une source indépendante.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000002c",
    scenarioCode: "SCENARIO-000044",
    slug: "appel-urgent-voix-dun-proche",
    version: 1,
    attackCode: "AI-000002",
    channel: "phone",
    targetProfile: "senior",
    difficulty: 4,
    impersonatedEntity: "Voix d'un proche fictif",
    teaser: "Un appel affole : la voix, reconnaissable, demande un virement immédiat pour une urgence.",
    content: {
      sender: "Appel entrant — numéro inconnu",
      body: "« C'est moi, j'ai eu un accident, j'ai besoin que tu m'envoies de l'argent tout de suite, je ne peux pas t'expliquer maintenant, fais-le vite s'il te plaît. »\n\nLa voix ressemble beaucoup à celle de votre proche. L'appel coupe avant que vous ayez pu poser beaucoup de questions.",
      ui: "call",
    },
    choices: [
      {
        id: "transfer",
        label: "J'envoie l'argent immédiatement, c'est sa voix, je ne veux pas perdre de temps",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY", "TRUSTED_AUTHORITY"],
      },
      {
        id: "ask-question",
        label: "Je pose une question personnelle pendant l'appel pour vérifier que c'est bien lui",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "callback",
        label: "Je raccroche et je rappelle mon proche sur son numéro habituel",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["callback"],
    explanations: {
      transfer: {
        technique: "Clonage vocal",
        indicator: "Urgence empêchant toute vérification, appel qui coupe rapidement",
        whyDangerous:
          "Une voix reconnaissable ne suffit plus à confirmer une identité : quelques secondes d'un enregistrement public peuvent suffire à la reproduire. L'urgence et la coupure rapide de l'appel sont ce qui empêche justement la vérification qui trancherait.",
        reflex: "Une voix reconnue, seule, ne prouve plus rien. L'urgence de l'appel est un signal, pas une raison d'agir plus vite.",
      },
      "ask-question": {
        technique: "Clonage vocal",
        indicator: "Réponses courtes, contexte flou entretenu volontairement",
        whyDangerous:
          "Poser une question pendant l'appel peut sembler prudent, mais l'interlocuteur peut éviter d'y répondre précisément, prétexter une mauvaise connexion, ou vous pousser à continuer sans y répondre vraiment. Ce n'est pas une vérification qui résiste, contrairement au rappel indépendant.",
        reflex: "Une question posée dans l'appel reste soumise au contrôle de celui qui vous parle ; un rappel sur un numéro que vous possédiez avant ne l'est pas.",
      },
      callback: {
        technique: "Clonage vocal",
        indicator: "Aucune vérification indépendante n'a encore eu lieu",
        whyDangerous:
          "C'est la bonne réponse. Raccrocher et rappeler sur le numéro habituel de votre proche est la seule vérification qui ne dépend pas de ce que vous entendez pendant l'appel initial.",
        reflex: "Raccrochez et rappelez sur un numéro que vous possédiez avant l'appel. C'est la vérification qui résiste, quelle que soit la qualité de la voix entendue.",
      },
      unsure: {
        technique: "Clonage vocal",
        indicator: "Détresse apparente, demande d'argent immédiate",
        whyDangerous: "Ne rien envoyer dans l'immédiat ne fait courir aucun risque à un proche réellement en difficulté, qui reste joignable par ailleurs.",
        reflex: "Dans le doute, raccrochez et vérifiez par un canal que vous maîtrisez avant tout envoi d'argent.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000002d",
    scenarioCode: "SCENARIO-000045",
    slug: "profil-rencontre-photos-parfaites",
    version: 1,
    attackCode: "AI-000003",
    channel: "social_media",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Profil fictif sur une application de rencontre",
    teaser: "Un profil très séduisant engage la conversation. Une seule photo, parfaitement cadrée.",
    content: {
      sender: "Profil « Camille, 34 ans » — application de rencontre",
      body: "Photo de profil unique : portrait net, regard centré, arrière-plan flou sans détail identifiable.\n\nBio : « Toujours partante pour de nouvelles aventures. » Aucune autre photo, aucune mention de lieu, aucun ami en commun visible.\n\nMessage reçu : « Salut ! Ton profil m'a tout de suite plu, on discute ? »",
      ui: "web",
    },
    choices: [
      {
        id: "chat",
        label: "Je discute normalement, la photo est belle et le message est sympathique",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "reverse-image",
        label: "Je fais une recherche d'image inversée sur la photo pour voir si elle apparaît ailleurs",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "look-for-depth",
        label: "Je regarde s'il existe d'autres photos, prises à des moments et des endroits différents, avant d'échanger davantage",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["look-for-depth"],
    explanations: {
      chat: {
        technique: "Faux profil généré par IA",
        indicator: "Photo unique parfaitement cadrée, aucun élément de vie identifiable",
        whyDangerous:
          "Une photo de profil trop parfaite, seule, sans contexte, est exactement la forme que prend un visage fabriqué : rien à identifier en arrière-plan, aucune trace d'une vie réelle. Poursuivre la conversation sans y prêter attention ouvre la voie à ce que ce type de profil vise ensuite.",
        reflex: "Une seule photo parfaite n'est pas un compliment fait au profil, c'est un signal à vérifier.",
      },
      "reverse-image": {
        technique: "Faux profil généré par IA",
        indicator: "Photo qui pourrait ne provenir d'aucune source antérieure",
        whyDangerous:
          "La recherche d'image inversée reste utile mais n'est plus suffisante : un visage entièrement fabriqué peut ne jamais avoir existé ailleurs, donc ne rien donner comme résultat — et l'absence de résultat ne prouve plus rien dans un sens ou dans l'autre.",
        reflex: "Un résultat vide en recherche d'image inversée n'écarte plus rien ; ce n'est qu'un élément parmi d'autres.",
      },
      "look-for-depth": {
        technique: "Faux profil généré par IA",
        indicator: "Absence de profondeur : ni lieu, ni date, ni relation vérifiable",
        whyDangerous:
          "C'est la bonne réponse. Un compte réel a un passé : des photos à des moments et des endroits différents, des relations qui se recoupent. C'est cette profondeur qui manque à un profil fabriqué, bien plus fiable que l'apparence d'une seule image.",
        reflex: "Cherchez la profondeur d'un profil — plusieurs photos, des lieux, des relations qui se recoupent — plutôt que la qualité d'une seule image.",
      },
      unsure: {
        technique: "Faux profil généré par IA",
        indicator: "Message avenant, profil séduisant",
        whyDangerous: "Prendre le temps de vérifier ne fait perdre aucune rencontre réelle, qui résistera à ce délai.",
        reflex: "Dans le doute, cherchez la profondeur du profil avant d'investir la conversation.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000002e",
    scenarioCode: "SCENARIO-000046",
    slug: "email-parfaitement-redige-banque",
    version: 1,
    attackCode: "AI-000004",
    channel: "email",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Banque fictive",
    teaser: "Un email sans aucune faute, parfaitement rédigé, personnalisé avec votre prénom et votre agence.",
    content: {
      sender: "Banque Fictive <conseiller@banque-fictive-secure.example-not-real.test>",
      body: "Bonjour [Prénom],\n\nSuite à un contrôle de routine sur les comptes de l'agence de [Ville], nous devons confirmer votre identité avant le traitement d'une opération en attente sur votre compte.\n\nCette démarche, sécurisée et rapide, prend moins de deux minutes.\n\nConfirmer mon identité : https://banque-fictive-secure.example-not-real.test/confirmation\n\nCordialement,\nVotre conseiller Banque Fictive",
      ui: "email",
    },
    choices: [
      {
        id: "trust-writing",
        label: "Je clique : c'est écrit de façon très professionnelle, sans aucune faute",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_DISPLAY_NAME"],
      },
      {
        id: "check-personalization",
        label: "Le message connaît mon prénom et mon agence, ça me rassure, je continue",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN", "TRUSTED_AUTHORITY"],
      },
      {
        id: "check-domain",
        label: "Je regarde le domaine de l'expéditeur et rejoins mon espace bancaire par mes propres moyens",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["check-domain"],
    explanations: {
      "trust-writing": {
        technique: "Hameçonnage généré par IA",
        indicator: "Rédaction sans défaut, domaine d'expéditeur qui n'est pas celui de la banque",
        whyDangerous:
          "La qualité de la rédaction a cessé d'être un indice fiable : elle ne coûte plus rien à obtenir. Le domaine d'expéditeur, lui, n'a pas changé de nature et reste le premier élément qui trahit le message.",
        reflex: "Une rédaction parfaite ne prouve plus rien. Basculez votre vérification vers ce qui n'a pas changé : le domaine.",
      },
      "check-personalization": {
        technique: "Hameçonnage généré par IA",
        indicator: "Personnalisation reposant sur des informations publiques ou déjà connues",
        whyDangerous:
          "Un prénom et une ville d'agence peuvent provenir de sources publiques ou d'une fuite antérieure ; leur exactitude ne garantit pas l'origine du message. La personnalisation rend le message plus convaincant, elle ne le rend pas plus légitime.",
        reflex: "Une personnalisation exacte peut venir d'ailleurs que de votre banque ; elle ne remplace pas la vérification du domaine.",
      },
      "check-domain": {
        technique: "Hameçonnage généré par IA",
        indicator: "Structure du message inchangée malgré la qualité de la rédaction",
        whyDangerous:
          "C'est la bonne réponse. Le domaine et le fait de rejoindre le service par vos propres moyens sont indifférents à la qualité de la rédaction — c'est exactement pour cela qu'ils restent fiables quand le reste ne l'est plus.",
        reflex: "Lisez le domaine, et rejoignez toujours le service par un chemin que vous choisissez vous-même, jamais par le lien du message.",
      },
      unsure: {
        technique: "Hameçonnage généré par IA",
        indicator: "Message très soigné, demande d'identité présentée comme une formalité",
        whyDangerous: "Ne pas cliquer ne fait courir aucun risque : une vraie opération en attente reste visible dans votre espace bancaire.",
        reflex: "Dans le doute, ignorez le lien et connectez-vous à votre espace bancaire par vos propres moyens.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-00000000002f",
    scenarioCode: "SCENARIO-000047",
    slug: "article-choc-site-actualite-inconnu",
    version: 1,
    attackCode: "AI-000005",
    channel: "social_media",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Site d'actualité fictif",
    teaser: "Un article choc, bien écrit, partagé massivement, provient d'un site que vous ne connaissiez pas.",
    content: {
      sender: "Article partagé — actualites-directes-info.example-not-real.test",
      body: "« Révélation exclusive » — un article long, détaillé, sans source citée, signé par un auteur dont vous ne trouvez aucune trace ailleurs. Le site ne mentionne ni adresse, ni directeur de publication, ni date de création visible.",
      ui: "web",
    },
    choices: [
      {
        id: "share",
        label: "Je le partage : l'article est bien écrit et l'information semble importante",
        mistakePatternCodes: ["TRUSTED_BRAND_NAME", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "read-more",
        label: "Je lis d'autres articles du même site pour juger de sa fiabilité globale",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check-outlet",
        label: "Je vérifie l'existence légale du média et cherche si un média identifiable a traité le même sujet",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["check-outlet"],
    explanations: {
      share: {
        technique: "Faux site d'information généré par IA",
        indicator: "Aucune source citée, auteur sans existence vérifiable ailleurs",
        whyDangerous:
          "La qualité de l'écriture ne dit rien de la véracité du contenu ni de l'existence réelle du média. Partager amplifie une information dont ni la source ni l'auteur ne peuvent être vérifiés, ce qui est précisément ce que ce type de site recherche.",
        reflex: "Une belle écriture n'est pas une source. Vérifiez le média avant de partager, pas après.",
      },
      "read-more": {
        technique: "Faux site d'information généré par IA",
        indicator: "Nombreux articles longs, cohérents entre eux mais sans ancrage vérifiable",
        whyDangerous:
          "Un site entièrement fabriqué peut produire un grand nombre d'articles cohérents entre eux sans qu'aucun ne soit vérifiable : la cohérence interne du site ne remplace pas une vérification externe de son existence légale.",
        reflex: "La quantité et la cohérence des articles d'un site ne garantissent pas son existence réelle.",
      },
      "check-outlet": {
        technique: "Faux site d'information généré par IA",
        indicator: "Aucune mention légale, aucun contact identifiable",
        whyDangerous:
          "C'est la bonne réponse. Un média réel a une existence légale vérifiable — mentions légales, directeur de publication, adresse — et une information importante est presque toujours reprise par au moins un autre média identifiable.",
        reflex: "Vérifiez le média avant l'article : existence légale d'abord, reprise par d'autres sources ensuite.",
      },
      unsure: {
        technique: "Faux site d'information généré par IA",
        indicator: "Sujet présenté comme important, largement partagé",
        whyDangerous: "Ne pas partager ne fait perdre aucune information réelle, qui restera accessible via des médias vérifiables.",
        reflex: "Dans le doute, ne partagez pas avant d'avoir vérifié l'existence du média et trouvé une autre source.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000030",
    scenarioCode: "SCENARIO-000048",
    slug: "assistance-en-ligne-code-sms",
    version: 1,
    attackCode: "AI-000006",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Service d'assistance fictif",
    teaser: "Un assistant de conversation en ligne, atteint depuis une publicité, demande un code reçu par SMS.",
    content: {
      sender: "Fenêtre de conversation — « Assistance en direct »",
      body: "Bonjour, je suis votre assistant virtuel. Pour vérifier votre compte et résoudre votre problème, pouvez-vous me communiquer le code à 6 chiffres que vous venez de recevoir par SMS ?",
      ui: "web",
    },
    choices: [
      {
        id: "give-code",
        label: "Je donne le code, l'assistant en a besoin pour m'aider",
        mistakePatternCodes: ["SHARED_MFA_CODE", "TRUSTED_AUTHORITY"],
      },
      {
        id: "ask-why",
        label: "Je demande pourquoi ce code est nécessaire avant de le donner",
        mistakePatternCodes: ["SHARED_MFA_CODE"],
      },
      {
        id: "refuse-and-leave",
        label: "Je refuse de communiquer le code et quitte cette conversation pour rejoindre le site officiel du service",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["refuse-and-leave"],
    explanations: {
      "give-code": {
        technique: "Chatbot malveillant",
        indicator: "Assistance atteinte par une publicité, demande d'un code reçu par SMS",
        whyDangerous:
          "Un code à usage unique reçu par SMS sert à valider une action sur votre compte — souvent une connexion ou une réinitialisation initiée ailleurs. Le communiquer permet à qui vous l'a demandé de finaliser cette action à votre place.",
        reflex: "Aucun support, humain ou automatisé, ne demande jamais un code reçu par SMS, quel qu'en soit le prétexte.",
      },
      "ask-why": {
        technique: "Chatbot malveillant",
        indicator: "Question progressive glissant vers une information d'authentification",
        whyDangerous:
          "Demander une explication engage encore la conversation, et un chatbot conçu pour cela dispose d'une réponse plausible toute prête. Le critère qui tranche n'est pas la qualité de la justification donnée, c'est la nature de ce qui est demandé.",
        reflex: "La raison invoquée pour demander un code SMS ne compte pas : la demande elle-même est le signal.",
      },
      "refuse-and-leave": {
        technique: "Chatbot malveillant",
        indicator: "Support atteint par un lien plutôt que par le site officiel",
        whyDangerous:
          "C'est la bonne réponse. Rejoindre le support par le site officiel, choisi par vous-même, retire tout pouvoir à un assistant conçu pour obtenir ce code, et un support authentique reste accessible par ce chemin sans difficulté.",
        reflex: "Rejoignez toujours le support par le site officiel du service. Aucun support légitime ne demande de code reçu par SMS.",
      },
      unsure: {
        technique: "Chatbot malveillant",
        indicator: "Ton professionnel, demande présentée comme une vérification de routine",
        whyDangerous: "Refuser le code ne bloque aucune assistance réelle, accessible par le site officiel.",
        reflex: "Dans le doute, ne communiquez jamais un code reçu par SMS, quel que soit l'interlocuteur.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000031",
    scenarioCode: "SCENARIO-000049",
    slug: "application-generation-images-gratuite",
    version: 1,
    attackCode: "AI-000007",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Application fictive de génération d'images",
    teaser: "Une application promet un accès gratuit et illimité à un outil habituellement payant.",
    content: {
      sender: "Résultat de recherche — « Application Créateur d'Images Gratuit »",
      body: "Créateur d'Images Gratuit — Accès illimité à toutes les fonctions premium, sans abonnement.\n\nÉditeur : StudioAppsFictif (différent de l'éditeur officiel de l'outil imité)\n\n[ Se connecter avec mon compte existant ]  [ Installer ]",
      ui: "web",
    },
    choices: [
      {
        id: "connect",
        label: "Je me connecte avec mon compte existant, ce sera plus rapide",
        mistakePatternCodes: ["TRUSTED_BRAND_NAME", "SHARED_CREDENTIAL"],
      },
      {
        id: "install-first",
        label: "J'installe d'abord pour voir si ça fonctionne avant de me connecter avec quoi que ce soit",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "official-site",
        label: "Je pars du site de l'éditeur officiel plutôt que de ce résultat de recherche",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["official-site"],
    explanations: {
      connect: {
        technique: "Fausse application d'IA",
        indicator: "Éditeur différent de celui de l'outil annoncé, gratuité présentée comme exceptionnelle",
        whyDangerous:
          "Se connecter avec un compte existant sur une application d'un éditeur différent transmet potentiellement vos identifiants à cet éditeur, pas au service que vous croyez utiliser. La gratuité totale d'un outil habituellement payant est le signal qui aurait dû arrêter la démarche avant cette étape.",
        reflex: "Ne connectez jamais un compte existant à une application dont l'éditeur diffère de celui du service d'origine.",
      },
      "install-first": {
        technique: "Fausse application d'IA",
        indicator: "Application promettant un accès gratuit à des fonctions habituellement payantes",
        whyDangerous:
          "Le fait que l'installation « fonctionne » ne renseigne pas sur ce qu'elle fait par ailleurs — une application peut afficher exactement ce qui est attendu tout en collectant des données en arrière-plan. Ce test ne remplace pas la vérification de l'éditeur.",
        reflex: "Le bon fonctionnement apparent d'une application ne dit rien de ce qu'elle fait par ailleurs.",
      },
      "official-site": {
        technique: "Fausse application d'IA",
        indicator: "Résultat de recherche pour le nom de l'outil, plutôt que le site de son éditeur",
        whyDangerous:
          "C'est la bonne réponse. Partir du site de l'éditeur officiel et suivre le lien qu'il donne vers son application évite la recherche elle-même, qui est le terrain sur lequel se joue cette attaque.",
        reflex: "Partez toujours de l'éditeur officiel plutôt que du nom de l'outil recherché.",
      },
      unsure: {
        technique: "Fausse application d'IA",
        indicator: "Promesse d'accès illimité et gratuit",
        whyDangerous: "Ne rien installer ne fait perdre aucun accès réel à l'outil authentique, disponible via son éditeur.",
        reflex: "Dans le doute, cherchez l'éditeur officiel avant d'installer quoi que ce soit.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000032",
    scenarioCode: "SCENARIO-000050",
    slug: "visio-direction-virement-urgent",
    version: 1,
    attackCode: "AI-000008",
    channel: "web",
    targetProfile: "business",
    difficulty: 5,
    impersonatedEntity: "Direction fictive d'une entreprise, en visioconférence",
    teaser: "Une visioconférence courte avec la direction demande un virement urgent et confidentiel.",
    content: {
      sender: "Visioconférence — « Direction Générale »",
      body: "Caméra fixe, cadrage serré. « Je suis en déplacement, la connexion n'est pas très bonne. J'ai besoin d'un virement confidentiel aujourd'hui pour une acquisition en cours, je vous envoie les coordonnées par écrit tout de suite. Je dois vous laisser, rappelez-moi seulement en cas de problème. »\n\nL'appel se termine après moins de deux minutes.",
      ui: "web",
    },
    choices: [
      {
        id: "transfer",
        label: "Je fais le virement : je l'ai vu et entendu en visio, c'est suffisant",
        mistakePatternCodes: ["TRUSTED_AUTHORITY", "MISSED_UNUSUAL_PAYMENT_REQUEST"],
      },
      {
        id: "ask-video-question",
        label: "Je rappelle en visio et pose une question personnelle pour vérifier avant de virer",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "callback-known-number",
        label: "Je rappelle sur un numéro que je possédais avant cet appel et applique la double validation habituelle",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["callback-known-number"],
    explanations: {
      transfer: {
        technique: "Deepfake en visioconférence",
        indicator: "Visio courte, cadrage serré, confidentialité et urgence combinées",
        whyDangerous:
          "La visioconférence, longtemps considérée comme la vérification qui tranchait, ne l'est plus seule : un visage et une voix peuvent être synthétisés en direct. La combinaison confidentialité et urgence sert précisément à empêcher la double validation qui aurait révélé l'anomalie.",
        reflex: "Voir et entendre en visio ne suffit plus à confirmer une identité pour une décision financière.",
      },
      "ask-video-question": {
        technique: "Deepfake en visioconférence",
        indicator: "Appel court, prétexte technique pour écourter l'échange",
        whyDangerous:
          "Reposer la vérification sur un nouvel échange en visio garde la faiblesse du premier : l'image et le son restent ce qui est justement manipulable. Ce n'est pas la répétition de la visio qui manque, c'est un canal indépendant d'elle.",
        reflex: "Une seconde visio n'ajoute rien si elle reste soumise à la même faiblesse que la première.",
      },
      "callback-known-number": {
        technique: "Deepfake en visioconférence",
        indicator: "Aucune vérification indépendante de l'image et du son n'a eu lieu",
        whyDangerous:
          "C'est la bonne réponse. Le rappel sur un numéro possédé avant l'appel et la double validation d'un virement ne dépendent d'aucune image : ce sont les deux vérifications qui résistent, quelle que soit la qualité de la visio initiale.",
        reflex: "Pour toute décision financière, rappelez sur un numéro connu avant l'appel et appliquez la double validation — jamais sur la seule base d'une visio.",
      },
      unsure: {
        technique: "Deepfake en visioconférence",
        indicator: "Contexte professionnel plausible, urgence invoquée",
        whyDangerous: "Retarder un virement le temps de vérifier ne compromet aucune opération légitime.",
        reflex: "Dans le doute face à une demande de virement, la double validation et le rappel sur un numéro connu priment toujours sur l'image.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000033",
    scenarioCode: "SCENARIO-000051",
    slug: "message-detient-images-de-vous",
    version: 1,
    attackCode: "AI-000009",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Compte inconnu",
    teaser: "Un message d'un compte inconnu affirme détenir des images de vous et demande un paiement.",
    content: {
      sender: "Compte inconnu, créé récemment",
      body: "J'ai récupéré des photos de vous et je les ai transformées. Si vous ne voulez pas que je les diffuse à vos contacts, vous avez 24 heures pour payer. N'essayez pas de me bloquer.",
      ui: "web",
    },
    choices: [
      {
        id: "pay",
        label: "Je paie pour éviter que ça se diffuse",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY"],
      },
      {
        id: "negotiate",
        label: "Je réponds pour essayer de négocier ou de comprendre ce qu'il détient exactement",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "document-and-report",
        label: "Je ne réponds pas, je conserve des captures horodatées et je signale la situation",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["document-and-report"],
    explanations: {
      pay: {
        technique: "Détournement de photos par IA",
        indicator: "Délai de 24 heures, menace de diffusion",
        whyDangerous:
          "Le paiement n'arrête rien : il confirme qu'un interlocuteur paie et que la pression fonctionne, ce qui appelle en général de nouvelles demandes plutôt que d'y mettre fin. Le délai n'a aucune fonction technique : il sert uniquement à empêcher de réfléchir et d'en parler.",
        reflex: "Payer ne fait jamais cesser ce type de demande ; cela confirme au contraire qu'elle fonctionne.",
      },
      negotiate: {
        technique: "Détournement de photos par IA",
        indicator: "Consigne explicite de ne pas bloquer, qui cherche à maintenir le contact",
        whyDangerous:
          "Répondre, même pour négocier ou comprendre, fournit des informations supplémentaires et maintient un canal que l'auteur cherche justement à préserver. Il n'y a rien à obtenir de cet échange qui améliore la situation.",
        reflex: "Il n'y a rien à vérifier ni à négocier auprès de l'auteur d'un tel message ; engager l'échange ne fait qu'y répondre.",
      },
      "document-and-report": {
        technique: "Détournement de photos par IA",
        indicator: "Aucune preuve conservée, situation qui pourrait s'aggraver sans trace",
        whyDangerous:
          "C'est la bonne réponse. Conserver des captures horodatées, les adresses des pages et les identifiants des comptes constitue ce dont vous aurez besoin pour signaler les faits, sans jamais engager d'échange avec l'auteur du message.",
        reflex: "Ne répondez pas, conservez toute preuve horodatée, et signalez la situation plutôt que d'y répondre seul.",
      },
      unsure: {
        technique: "Détournement de photos par IA",
        indicator: "Menace précise, délai court",
        whyDangerous: "Ne pas répondre ne fait rien empirer : c'est répondre qui maintient le contact recherché par l'auteur du message.",
        reflex: "Dans le doute, ne répondez pas et conservez toutes les preuves avant de signaler la situation.",
      },
    },
  },
];

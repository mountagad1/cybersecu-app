import type { SimulationEntry } from "./types";

/**
 * Simulations — ingénierie sociale, seconde série (lot 10).
 *
 * Mêmes règles de sûreté que les autres fichiers de ce dossier : toute
 * entité est fictive, tout domaine est sous le TLD réservé `.test`, et
 * rien n'est jamais saisi ni transmis — le visiteur choisit entre des
 * réponses écrites.
 *
 * RÈGLE DE RÉDACTION PROPRE AUX SCÉNARIOS
 * Le mauvais choix doit être celui qu'une personne raisonnable ferait.
 * Un scénario dont la bonne réponse est évidente à la lecture ne mesure
 * rien et n'apprend rien : il flatte. Chaque distracteur ci-dessous est
 * donc un raisonnement défendable — vérifier plus tard, faire confiance à
 * un numéro affiché, accepter une demande qui paraît procédurale — et son
 * explication dit pourquoi il échoue, sans reprocher au lecteur de l'avoir
 * envisagé.
 */
export const SIMULATIONS_INGENIERIE_SOCIALE_SUITE: SimulationEntry[] = [
  {
    versionId: "00000000-0000-4000-8000-000000000013",
    scenarioCode: "SCENARIO-000019",
    slug: "appel-service-fraude",
    version: 1,
    attackCode: "SOCIAL-000006",
    channel: "phone",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Service fraude d'une banque fictive",
    teaser:
      "Un conseiller du service fraude vous appelle. Il ne demande aucun mot de passe.",
    content: {
      sender: "Appel entrant — « Banque Fictive, service fraude »",
      body: "Bonjour, service fraude de la Banque Fictive. Nous bloquons en ce moment une tentative de paiement de 890 € chez un marchand à l'étranger sur votre carte.\n\nJe ne vous demanderai évidemment jamais votre mot de passe — vous pouvez le vérifier, aucun conseiller ne le fait. J'ai juste besoin de confirmer votre identité pour annuler l'opération : pouvez-vous me donner votre date de naissance et les quatre derniers chiffres de votre carte ?\n\nEnsuite je vous fais parvenir une notification dans votre application, que vous validerez pour bloquer le paiement.",
      ui: "call",
    },
    choices: [
      {
        id: "confirm",
        label: "Je confirme mon identité, il ne demande rien de confidentiel",
        mistakePatternCodes: ["TRUSTED_AUTHORITY", "SHARED_CREDENTIAL"],
      },
      {
        id: "validate",
        label:
          "Je valide la notification qui arrive dans mon application pour bloquer le paiement",
        mistakePatternCodes: [
          "RESPONDED_TO_URGENCY",
          "SHARED_MFA_CODE",
          "TRUSTED_AUTHORITY",
        ],
      },
      {
        id: "hangup",
        label:
          "Je raccroche et je rappelle le numéro figurant au dos de ma carte",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["hangup"],
    explanations: {
      confirm: {
        technique: "Vishing",
        indicator:
          "Interlocuteur qui se prévaut de ne rien demander de confidentiel",
        whyDangerous:
          "Annoncer qu'on ne demandera pas le mot de passe est un argument de crédibilité, pas une garantie. Ces éléments d'identité servent ensuite à se faire passer pour vous auprès du vrai service, ou à rendre l'échange suivant plus crédible.",
        reflex:
          "Ce n'est pas ce qu'on vous demande qui décide, c'est qui appelle : un appel entrant ne prouve jamais l'identité de son auteur.",
      },
      validate: {
        technique: "Vishing",
        indicator: "Validation demandée dans l'application pendant l'appel",
        whyDangerous:
          "C'est le piège central de ce scénario : la notification est réelle, mais elle valide l'opération de l'attaquant, pas son blocage. Vous confirmez vous-même ce que vous croyez empêcher, et l'opération devient difficile à contester puisqu'elle est authentifiée.",
        reflex:
          "Ne validez jamais une notification pendant qu'on vous parle. Raccrochez, lisez ce qu'elle dit vraiment, décidez ensuite.",
      },
      hangup: {
        technique: "Vishing",
        indicator: "Urgence et prise de décision pendant l'appel",
        whyDangerous:
          "C'est la bonne réponse. Raccrocher ne fait rien perdre : si la fraude est réelle, elle sera visible en rappelant. Le numéro au dos de la carte est le seul dont vous connaissez l'origine.",
        reflex:
          "Raccrochez et rappelez vous-même. Un vrai service fraude ne s'oppose jamais à cela.",
      },
      unsure: {
        technique: "Vishing",
        indicator: "Numéro affiché qui semble être celui de la banque",
        whyDangerous:
          "Le numéro affiché n'est pas une preuve : il peut être choisi par l'appelant. Ne rien décider pendant l'appel est toujours sans risque.",
        reflex:
          "Dans le doute, raccrochez et rappelez le numéro que vous connaissez.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000014",
    scenarioCode: "SCENARIO-000020",
    slug: "audit-interne-annuaire",
    version: 1,
    attackCode: "SOCIAL-000007",
    channel: "email",
    targetProfile: "business",
    difficulty: 4,
    impersonatedEntity: "Prestataire fictif d'un audit interne",
    teaser:
      "Troisième échange courtois avec un auditeur. Cette fois il demande l'annuaire.",
    content: {
      sender:
        "C. Mercier <c.mercier@audit-conformite-fictif.example-not-real.test>",
      body: "Bonjour,\n\nMerci encore pour vos réponses de mardi, elles nous ont bien aidés à cadrer le périmètre.\n\nComme convenu avec la direction dans le cadre de la revue de conformité annuelle, je finalise la cartographie des interlocuteurs. Pourriez-vous m'adresser l'annuaire interne du service (noms, fonctions, lignes directes) ainsi que le nom de votre prestataire de sauvegarde ?\n\nRien d'urgent, d'ici vendredi c'est parfait.\n\nBien cordialement,\nC. Mercier — Cabinet fictif de conformité",
      ui: "email",
    },
    choices: [
      {
        id: "send",
        label:
          "J'envoie l'annuaire : ce ne sont pas des informations confidentielles",
        mistakePatternCodes: [
          "TRUSTED_DISPLAY_NAME",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "partial",
        label:
          "J'envoie seulement les noms et fonctions, sans les lignes directes",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check",
        label:
          "Je demande à ma direction si cet audit et ce prestataire existent, avant de répondre",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["check"],
    explanations: {
      send: {
        technique: "Prétexting",
        indicator:
          "Demande qui s'appuie sur des échanges antérieurs et sur un accord de la direction jamais vérifié",
        whyDangerous:
          "L'annuaire et le nom du prestataire de sauvegarde ne sont pas confidentiels pris isolément — c'est exactement pourquoi ils sont demandés. Ils fournissent les noms, les fonctions et le vocabulaire interne qui rendront crédible l'appel ou le message suivant.",
        reflex:
          "Une information anodine devient utile en s'ajoutant aux autres. Ce qui se vérifie n'est pas la sensibilité de la demande, c'est la légitimité du demandeur.",
      },
      partial: {
        technique: "Prétexting",
        indicator:
          "Absence d'urgence, ton courtois, référence à un échange précédent",
        whyDangerous:
          "Réduire ce que l'on transmet est un réflexe sain, mais il ne traite pas le problème : les noms et les fonctions suffisent à construire un scénario crédible, et répondre confirme surtout que l'interlocuteur est accepté. Le prochain message demandera davantage.",
        reflex:
          "Doser la réponse ne remplace pas la vérification de l'interlocuteur.",
      },
      check: {
        technique: "Prétexting",
        indicator: "Autorité invoquée mais jamais confirmée à sa source",
        whyDangerous:
          "C'est la bonne réponse. Le prétexting ne survit pas à une vérification interne, parce qu'il n'existe qu'entre vous et lui. L'absence d'urgence est précisément ce qui doit rendre la vérification facile à faire.",
        reflex:
          "Vérifiez auprès de la personne censée avoir donné son accord, par un canal que vous choisissez.",
      },
      unsure: {
        technique: "Prétexting",
        indicator: "Relation construite sur plusieurs échanges",
        whyDangerous:
          "Ne pas répondre ne coûte rien : un auditeur légitime relancera, et sa relance passera par votre direction.",
        reflex:
          "Dans le doute, vérifiez en interne. Le silence n'a jamais fait échouer un audit réel.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000015",
    scenarioCode: "SCENARIO-000021",
    slug: "cle-usb-trouvee",
    version: 1,
    attackCode: "SOCIAL-000008",
    channel: "file_attachment",
    targetProfile: "business",
    difficulty: 2,
    impersonatedEntity: "Aucune — support physique anonyme",
    teaser: "Une clé USB traîne dans le hall, étiquetée « Salaires 2026 ».",
    content: {
      sender: "Objet trouvé — clé USB, hall d'accueil",
      body: "Une clé USB a été laissée sur la table basse du hall. Une étiquette manuscrite indique « Salaires 2026 — confidentiel ».\n\nPersonne à l'accueil ne sait à qui elle appartient.",
      ui: "web",
    },
    choices: [
      {
        id: "open",
        label: "Je la branche sur mon poste pour voir à qui elle appartient",
        mistakePatternCodes: ["CLICKED_UNKNOWN_LINK"],
      },
      {
        id: "isolated",
        label:
          "Je la branche sur un vieil ordinateur qui ne contient rien d'important",
        mistakePatternCodes: [
          "CLICKED_UNKNOWN_LINK",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "handover",
        label:
          "Je la remets telle quelle à l'accueil ou au service informatique, sans la brancher",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["handover"],
    explanations: {
      open: {
        technique: "Baiting",
        indicator: "Étiquette conçue pour rendre le contenu irrésistible",
        whyDangerous:
          "L'étiquette est l'appât : « confidentiel » et « salaires » sont choisis pour que la curiosité l'emporte sur la prudence. Brancher un support inconnu revient à exécuter du code d'origine inconnue sur un poste connecté au réseau de l'entreprise.",
        reflex:
          "Un support trouvé ne se branche pas. C'est aussi simple, et c'est tout l'exercice.",
      },
      isolated: {
        technique: "Baiting",
        indicator: "Support anonyme laissé dans un lieu de passage",
        whyDangerous:
          "L'intention est bonne mais l'hypothèse est fausse : « un vieil ordinateur » est presque toujours sur le même réseau, et souvent le moins à jour du parc. C'est un raisonnement qui rassure sans réduire le risque.",
        reflex:
          "L'isolement d'une machine se décide et se vérifie ; il ne se déduit pas de son âge ou de son contenu.",
      },
      handover: {
        technique: "Baiting",
        indicator: "Aucun propriétaire identifiable",
        whyDangerous:
          "C'est la bonne réponse. Ne rien brancher ne fait rien perdre : si la clé appartient à un collègue, elle lui reviendra par l'accueil. Si elle a été déposée, le service informatique doit le savoir.",
        reflex:
          "Remettez le support, signalez-le, et n'essayez pas de l'identifier vous-même.",
      },
      unsure: {
        technique: "Baiting",
        indicator: "Contrepartie désirable exigeant une action de votre part",
        whyDangerous:
          "L'hésitation est déjà la bonne posture : le doute face à un objet trouvé se résout toujours en ne le branchant pas.",
        reflex: "Dans le doute, remettez la clé sans la lire.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000016",
    scenarioCode: "SCENARIO-000022",
    slug: "avis-regularisation-administrative",
    version: 1,
    attackCode: "SOCIAL-000010",
    channel: "email",
    targetProfile: "senior",
    difficulty: 3,
    impersonatedEntity: "Service public fictif",
    teaser:
      "Un avis de régularisation, avec un numéro de dossier et un délai de 48 heures.",
    content: {
      sender:
        "Service Fictif de Recouvrement <notification@service-fictif-recouvrement.example-not-real.test>",
      body: "AVIS DE RÉGULARISATION — Dossier n° 2026-FR-884213\n\nMadame, Monsieur,\n\nUn reliquat de 128,40 € demeure impayé au titre de l'exercice écoulé. À défaut de règlement sous 48 heures, une majoration sera appliquée et le dossier transmis au service contentieux.\n\nRégler en ligne : https://service-fictif-recouvrement.example-not-real.test/reglement\n\nPour toute contestation, contactez le 09 XX XX XX XX (service ouvert 7j/7).",
      ui: "email",
    },
    choices: [
      {
        id: "pay",
        label:
          "Je règle en ligne pour éviter la majoration, le montant est faible",
        mistakePatternCodes: [
          "TRUSTED_AUTHORITY",
          "RESPONDED_TO_URGENCY",
          "CLICKED_UNKNOWN_LINK",
        ],
      },
      {
        id: "call",
        label: "J'appelle le numéro indiqué pour contester le dossier",
        mistakePatternCodes: [
          "TRUSTED_AUTHORITY",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "official",
        label:
          "Je me connecte à mon espace officiel par mes propres moyens pour voir si ce dossier existe",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["official"],
    explanations: {
      pay: {
        technique: "Faux agent administratif",
        indicator: "Délai de 48 heures et menace de majoration",
        whyDangerous:
          "Le montant est faible délibérément : il rend le paiement moins coûteux que la vérification, ce qui est tout le calcul. Une administration n'impose pas un règlement sous 48 heures par email, et le paiement livre en outre vos coordonnées bancaires.",
        reflex:
          "Un montant faible n'est pas une raison de ne pas vérifier — c'est la raison pour laquelle il a été choisi.",
      },
      call: {
        technique: "Faux agent administratif",
        indicator: "Numéro de contact fourni par le message lui-même",
        whyDangerous:
          "Contester est un bon réflexe, mais le numéro figure dans le message suspect : il mène à la même organisation. L'appel sert alors à obtenir de vive voix ce que l'email n'a pas obtenu, et l'intention de contester devient un point de départ commode.",
        reflex:
          "Ne composez jamais un numéro fourni par le message que vous mettez en doute. Cherchez-le vous-même.",
      },
      official: {
        technique: "Faux agent administratif",
        indicator:
          "Domaine d'expéditeur qui n'est pas celui d'une administration",
        whyDangerous:
          "C'est la bonne réponse. Une créance réelle apparaît dans votre espace officiel, et une administration ne dépend pas d'un email pour vous la notifier. Vérifier ne fait courir aucun risque de majoration.",
        reflex:
          "Rejoignez l'organisme par un chemin que vous maîtrisez : espace en ligne, courrier, guichet.",
      },
      unsure: {
        technique: "Faux agent administratif",
        indicator: "Numéro de dossier précis, destiné à rendre l'avis crédible",
        whyDangerous:
          "Un numéro de dossier ne prouve rien : il est inventé. Ne rien faire n'aggrave aucune situation réelle en 48 heures.",
        reflex:
          "Dans le doute, vérifiez dans votre espace officiel avant de payer quoi que ce soit.",
      },
    },
  },
  {
    versionId: "00000000-0000-4000-8000-000000000017",
    scenarioCode: "SCENARIO-000023",
    slug: "recrutement-frais-de-dossier",
    version: 1,
    attackCode: "SOCIAL-000011",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Recruteur d'une entreprise fictive",
    teaser:
      "Poste accepté sans entretien. Il ne reste qu'un dossier à compléter.",
    content: {
      sender: "Recrutement — Groupe Fictif Logistique (messagerie instantanée)",
      body: "Bonjour ! Excellente nouvelle : votre profil a été retenu pour le poste d'assistant logistique en télétravail. 2 400 € net, démarrage lundi.\n\nPour finaliser avant ce soir, merci de nous transmettre :\n— une photo recto/verso de votre pièce d'identité\n— un justificatif de domicile\n— votre RIB\n\nIl reste des frais de dossier de 49 € (visite médicale d'embauche), remboursés sur votre première paie.\n\nUn autre candidat est en attente, je vous garde la place jusqu'à ce soir.",
      ui: "email",
    },
    choices: [
      {
        id: "all",
        label:
          "J'envoie les documents et je règle les 49 € pour ne pas perdre le poste",
        mistakePatternCodes: [
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
          "RESPONDED_TO_URGENCY",
          "SHARED_CREDENTIAL",
        ],
      },
      {
        id: "docs",
        label:
          "J'envoie les documents mais je ne paie rien tant que ce n'est pas signé",
        mistakePatternCodes: [
          "FAILED_TO_VERIFY_INDEPENDENTLY",
          "SHARED_CREDENTIAL",
        ],
      },
      {
        id: "verify",
        label:
          "Je cherche l'entreprise moi-même et je demande un entretien avant tout envoi",
        isRecommended: true,
      },
      { id: "unsure", label: "Je ne sais pas", isUnsure: true },
    ],
    correctChoiceIds: ["verify"],
    explanations: {
      all: {
        technique: "Offre d'emploi frauduleuse",
        indicator: "Frais préalables réclamés au candidat",
        whyDangerous:
          "Aucun employeur ne fait payer une embauche, et une visite médicale d'embauche n'est jamais à la charge du candidat. Les 49 € sont le préjudice visible ; les documents transmis sont le préjudice durable, puisqu'ils composent le dossier nécessaire pour agir en votre nom.",
        reflex:
          "Des frais demandés au candidat suffisent à écarter une offre, sans autre examen.",
      },
      docs: {
        technique: "Offre d'emploi frauduleuse",
        indicator:
          "Pièce d'identité, domicile et RIB demandés avant tout entretien",
        whyDangerous:
          "Refuser le paiement écarte la perte la plus petite et laisse passer la plus grave. Ces trois pièces réunies sont exactement ce qu'exige la constitution d'un dossier à distance, et un RIB communiqué peut aussi servir à faire transiter des fonds d'origine frauduleuse — ce qui vous met en cause.",
        reflex:
          "Une pièce d'identité ne s'envoie pas avant un entretien. C'est le moment, pas la nature du document, qui distingue une demande légitime.",
      },
      verify: {
        technique: "Offre d'emploi frauduleuse",
        indicator:
          "Embauche annoncée sans entretien, avec un délai imposé le soir même",
        whyDangerous:
          "C'est la bonne réponse. Un recrutement réel supporte une vérification et un entretien ; il ne se conclut pas par messagerie instantanée avant la fin de la journée.",
        reflex:
          "Vérifiez l'entreprise ailleurs que dans l'annonce, et exigez un entretien avant d'envoyer le moindre document.",
      },
      unsure: {
        technique: "Offre d'emploi frauduleuse",
        indicator: "Rareté invoquée — « un autre candidat est en attente »",
        whyDangerous:
          "Le candidat concurrent est une pression, pas une information. Ne rien envoyer ce soir ne fait perdre aucune offre réelle.",
        reflex: "Dans le doute, ne transmettez rien et demandez un entretien.",
      },
    },
  },
];

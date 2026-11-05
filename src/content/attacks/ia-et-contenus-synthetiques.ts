import type { AttackEntry } from "./types";
import { VERIFIED_REFERENCES as REF } from "./types";

/**
 * IA et contenus synthétiques.
 *
 * RÈGLE PROPRE À CETTE FAMILLE, en plus de celles de ingenierie-sociale.ts :
 * aucune fiche ne cite de statistique, de capacité chiffrée, ni de nom
 * d'outil. C'est le domaine où la tentation d'inventer un chiffre est la
 * plus forte et où les sources d'autorité sont les plus rares ; le
 * mécanisme et les signaux d'alerte suffisent à rendre une fiche utile.
 *
 * Ces fiches disent aussi ce que l'IA NE change PAS. Elle ne crée pas de
 * nouvelles attaques : elle retire des indices sur lesquels nous nous
 * appuyions pour reconnaître les anciennes. Chaque fiche nomme donc la
 * vérification qui résiste encore, et non seulement celle qui a cessé de
 * fonctionner — sans quoi elle ne ferait qu'inquiéter.
 */
export const IA_ET_CONTENUS_SYNTHETIQUES: AttackEntry[] = [
  {
    code: "AI-000001",
    slug: "deepfake-video",
    simulationSlug: "video-virale-personnalite-investissement",
    name: "Deepfake vidéo",
    categorySlug: "ia-et-contenus-synthetiques",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une vidéo où quelqu'un dit ou fait ce qu'il n'a jamais dit ni fait. Le visage et la voix sont ceux d'une personne réelle ; la scène, non.",
    attackerObjective: "emprise_sur_une_personne",
    aliases: [
      "hypertrucage",
      "vidéo truquée",
      "deepfake",
      "usurpation par image générée",
    ],
    primaryVector: "social_media",
    primaryDimension: "deepfake_ai_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un deepfake vidéo est une séquence fabriquée ou modifiée par apprentissage automatique, dans laquelle l'apparence et la voix d'une personne réelle sont reproduites pour lui faire tenir des propos ou accomplir des actions qui n'ont pas eu lieu.",
    howItWorks:
      "La fabrication demande de la matière : des images et du son de la personne visée, que fournissent les vidéos publiques, les interviews, les réseaux sociaux. Les personnalités publiques sont donc les cibles les plus faciles, et leur notoriété est précisément ce qui donne de la valeur au faux — une recommandation d'investissement attribuée à une figure connue, un propos politique, une déclaration commerciale. Ce qui change pour le spectateur n'est pas qu'il devienne impossible de douter, mais que les indices habituels disparaissent : le visage ressemble, la voix ressemble, le décor est plausible. Le doute doit donc se déplacer de l'image vers sa provenance — qui publie, depuis quel compte, et cette déclaration existe-t-elle ailleurs.",
    warningSigns: [
      "Déclaration importante circulant sans être reprise par une source identifiable",
      "Vidéo diffusée par un compte récent, ou recadrée pour masquer son origine",
      "Incohérences aux zones de raccord : contour du visage, cheveux, dents, reflets dans les yeux",
      "Synchronisation imparfaite entre les lèvres et le son, surtout sur les consonnes",
      "Séquence courte, coupée avant qu'un mouvement de tête ample ne se produise",
      "Propos servant un intérêt évident : placement financier, discrédit, appel aux dons",
    ],
    triggers: ["trust", "authority", "urgency"],
    indicators: [],
    howToVerify:
      "Cherchez la même déclaration ailleurs plutôt que d'examiner l'image : une prise de parole réelle d'une personne connue laisse des traces multiples et concordantes. Remontez au compte d'origine et regardez sa date de création. L'analyse visuelle vient en dernier, et n'est pas concluante à elle seule.",
    whatToDo:
      "Ne relayez pas avant d'avoir trouvé une seconde source indépendante — le partage est ce qui donne sa portée au faux. Traitez toute vidéo appelant à un placement financier ou à un versement comme suspecte par défaut, quelle que soit la personne qui semble y parler.",
    whatToDoIfVictim:
      "Si vous êtes la personne représentée : conservez les liens et des captures horodatées, signalez le contenu à chaque plateforme au titre de l'usurpation d'identité, et déposez plainte. Prévenez publiquement votre entourage professionnel, ce qui limite la portée plus vite que n'importe quel retrait. Si vous avez versé de l'argent après une telle vidéo, contactez votre banque immédiatement.",
    whyItWorks:
      "On croit ce que l'on voit et entend, surtout quand le visage est connu et inspire confiance. La vidéo arrive souvent dans un fil social, entre deux contenus authentiques, sans que personne en cherche la source.",
    example: {
      setting: "Vidéo publicitaire dans un fil de réseau social, où un animateur de télévision connu parle face caméra.",
      message:
        "J'ai doublé mon épargne en trois mois grâce à cette plateforme. Les places sont limitées, inscrivez-vous aujourd'hui sur placement-rapide.example-not-real.test",
      giveaways: [
        "Aucun média identifiable ne rapporte cette déclaration.",
        "Le compte qui diffuse la vidéo a été créé récemment.",
        "Une promesse de gain rapide renvoie vers une plateforme inconnue.",
      ],
    },
    decisionChecklist: [
      {
        check: "La vidéo vous pousse-t-elle à investir, payer ou donner ?",
        then: "Ne suivez pas le lien : considérez-la comme suspecte par défaut.",
      },
      {
        check: "La déclaration est-elle introuvable dans une source indépendante ?",
        then: "Ne la partagez pas et signalez-la à la plateforme.",
      },
      {
        check: "Avez-vous versé de l'argent après l'avoir vue ?",
        then: "Contactez votre banque immédiatement, puis déposez plainte.",
      },
    ],
    prevention: [
      "Vérifiez la source d'une vidéo avant son contenu : qui la publie, et depuis quand.",
      "Considérez une personnalité qui recommande un placement comme un signal d'arnaque.",
      "Ne relayez qu'après avoir trouvé une seconde source indépendante.",
    ],
    relatedAttackCodes: [
      "AI-000002",
      "AI-000008",
      "AI-000003",
      "PAYMENT-000003",
      "AI-000009",
    ],
    faq: [
      {
        question:
          "Existe-t-il un moyen sûr de reconnaître un deepfake à l'œil ?",
        answer:
          "Non, et se fier à un indice visuel est risqué dans les deux sens : on croit détecter un faux sur une vidéo authentique, et l'inverse. La provenance est un critère plus solide que l'image, parce qu'elle ne dépend pas de la qualité de la fabrication.",
      },
      {
        question:
          "Une personnalité connue recommande un placement dans une vidéo. Que faire ?",
        answer:
          "Ne rien faire de ce qu'elle demande. C'est un usage récurrent du procédé, et le point décisif n'est pas la vidéo mais le fait qu'aucun placement légitime ne se propose ainsi. Vérifiez l'acteur financier auprès du registre du régulateur avant toute chose.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "deepfake-video",
        simulationSlug: "viral-celebrity-investment-video",
        name: "Deepfake video",
        aliases: [
          "synthetic video",
          "video deepfake",
          "AI-generated impersonation video",
        ],
        plainLanguageDefinition:
          "A video where someone says or does something they never said or did. The face and voice are a real person's; the scene is not.",
        definition:
          "A deepfake video is a sequence fabricated or altered using machine learning, in which a real person's appearance and voice are reproduced to make them appear to say or do things that never happened.",
        howItWorks:
          "Making one takes material: images and audio of the target, supplied by public videos, interviews, social media. Public figures are therefore the easiest targets, and their fame is exactly what gives the fake its value — an investment tip attributed to a well-known figure, a political statement, a business announcement. What changes for the viewer isn't that doubt becomes impossible, but that the usual clues disappear: the face matches, the voice matches, the setting is plausible. Doubt has to shift from the image itself to its provenance — who is posting it, from what account, and does this statement exist anywhere else.",
        warningSigns: [
          "An important statement circulating without being picked up by any identifiable source",
          "Video posted by a recent account, or cropped to hide its origin",
          "Inconsistencies at the seams: face outline, hair, teeth, reflections in the eyes",
          "Imperfect lip-sync, especially on consonants",
          "Short clip, cut before any large head movement happens",
          "Content that serves an obvious interest: a financial pitch, discrediting someone, a call for donations",
        ],
        howToVerify:
          "Look for the same statement elsewhere rather than examining the image: a genuine public statement from a well-known person leaves multiple, consistent traces. Trace the video back to its originating account and check its creation date. Visual analysis comes last, and isn't conclusive on its own.",
        whatToDo:
          "Don't share before finding a second, independent source — sharing is what gives the fake its reach. Treat any video urging a financial investment or a payment as suspicious by default, no matter who appears to be speaking.",
        whatToDoIfVictim:
          "If you are the person depicted: keep the links and time-stamped screenshots, report the content to each platform as impersonation, and file a police report. Publicly alert your professional contacts — that limits the reach faster than any takedown. If you sent money after seeing such a video, contact your bank immediately.",
        faq: [
          {
            question: "Is there a reliable way to spot a deepfake by eye?",
            answer:
              "No, and relying on a visual clue is risky both ways: you can think you've spotted a fake in a genuine video, and the reverse. Provenance is a sturdier criterion than the image, because it doesn't depend on how good the fabrication is.",
          },
          {
            question:
              "A well-known figure recommends an investment in a video. What should I do?",
            answer:
              "Do none of what it asks. This is a recurring use of the technique, and the decisive point isn't the video but the fact that no legitimate investment is ever offered this way. Check the financial actor against the regulator's register before anything else.",
          },
        ],
        whyItWorks:
          "We believe what we see and hear, especially when the face is familiar and trusted. The video often appears in a social feed, between two genuine posts, without anyone looking for its source.",
        example: {
          setting: "Promotional video in a social media feed, where a well-known TV host speaks to the camera.",
          message:
            "I doubled my savings in three months thanks to this platform. Spots are limited, sign up today at placement-rapide.example-not-real.test",
          giveaways: [
            "No identifiable media outlet reports this statement.",
            "The account spreading the video was created recently.",
            "A promise of quick gains points to an unknown platform.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the video push you to invest, pay or donate?",
            then: "Don't follow the link: treat it as suspicious by default.",
          },
          {
            check: "Is the statement impossible to find in an independent source?",
            then: "Don't share it, and report it to the platform.",
          },
          {
            check: "Did you send money after watching it?",
            then: "Contact your bank immediately, then file a police report.",
          },
        ],
        prevention: [
          "Check a video's source before its content: who is posting it, and since when.",
          "Treat a public figure recommending an investment as a sign of a scam.",
          "Share only after finding a second, independent source.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "AI-000002",
    slug: "clonage-vocal",
    simulationSlug: "appel-urgent-voix-dun-proche",
    name: "Clonage vocal",
    categorySlug: "ia-et-contenus-synthetiques",
    editorialStatus: "published",
    plainLanguageDefinition:
      "La voix d'un proche au téléphone, qui demande de l'aide en urgence. C'est bien sa voix — reconstituée à partir de quelques secondes d'un enregistrement public.",
    attackerObjective: "argent",
    aliases: [
      "voix clonée",
      "fraude à la voix",
      "imitation vocale par IA",
      "vishing par IA",
    ],
    primaryVector: "phone",
    primaryDimension: "deepfake_ai_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Le clonage vocal est la reproduction synthétique de la voix d'une personne à partir d'échantillons enregistrés, utilisée pour crédibiliser un appel ou un message vocal frauduleux.",
    howItWorks:
      "La matière première est courte et facile à obtenir : une story, une vidéo de famille, un message vocal, un extrait professionnel. La voix produite est ensuite employée dans un scénario qui existait déjà — l'appel du proche en détresse, la consigne du dirigeant — dont elle supprime la principale faiblesse. Jusqu'ici, ces fraudes tenaient au fait que l'on n'entendait pas vraiment la personne ; maintenant, on l'entend. Le scénario est construit pour couvrir les imperfections restantes : bruit ambiant, ligne de mauvaise qualité, urgence qui interdit les longues phrases, émotion qui explique une intonation étrange. La conséquence pratique est nette : reconnaître une voix ne prouve plus une identité, et la vérification doit reposer sur autre chose.",
    warningSigns: [
      "Appel en urgence demandant de l'argent, depuis un numéro inconnu",
      "Voix reconnaissable mais phrases courtes, répétitives ou étrangement neutres",
      "Bruit de fond, mauvaise qualité ou coupures justifiant les anomalies",
      "Refus ou impossibilité de passer en visio, ou de rappeler plus tard",
      "Consigne de ne pas prévenir un autre membre de la famille",
      "Interlocuteur qui évite les questions ouvertes et ramène à l'urgence",
    ],
    triggers: ["fear", "urgency", "trust", "social_pressure"],
    indicators: [],
    howToVerify:
      "Raccrochez et rappelez la personne sur son numéro habituel : c'est la vérification qui résiste, parce qu'elle ne dépend pas de ce que vous entendez. Si c'est impossible, posez une question dont la réponse ne se trouve nulle part en ligne et qui exige un souvenir partagé — pas une date de naissance, mais un détail vécu à deux. Convenez d'un mot de passe familial : c'est la parade la plus simple et la plus robuste.",
    whatToDo:
      "N'envoyez jamais d'argent sur la foi d'une voix seule, quelle que soit l'urgence invoquée. Prenez le temps de rappeler : un proche réellement en difficulté ne vous en tiendra pas rigueur, et la personne au bout du fil, si elle refuse ce délai, vient de se désigner.",
    whatToDoIfVictim:
      "Contactez votre banque sans attendre — un virement récent peut parfois faire l'objet d'une demande de rappel. Conservez le numéro appelant, l'heure et la teneur de l'appel, puis déposez plainte. Prévenez le proche dont la voix a été reproduite : ses autres contacts sont susceptibles de recevoir le même appel.",
    whyItWorks:
      "On tient la voix d'un proche pour une preuve d'identité, et c'est cette évidence que la technique exploite. L'urgence et l'émotion ne laissent pas le temps de remarquer une intonation inhabituelle.",
    example: {
      setting: "Appel d'un numéro inconnu, un soir ; vous reconnaissez la voix de votre neveu.",
      message:
        "« Tonton, c'est moi… J'ai eu un accident, j'ai besoin de 2 000 € tout de suite pour l'avocat. S'il te plaît, n'appelle pas maman, elle va paniquer. »",
      giveaways: [
        "Un numéro inconnu pour un proche dont vous avez le numéro.",
        "Une demande d'argent immédiate.",
        "La consigne de ne prévenir personne.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'appel vient-il d'un numéro inconnu et demande-t-il de l'argent ?",
        then: "Raccrochez et rappelez la personne sur son numéro habituel.",
      },
      {
        check: "Pouvez-vous poser une question dont seule la vraie personne connaît la réponse ?",
        then: "Posez-la, ou demandez votre mot de passe familial.",
      },
      {
        check: "On vous demande de ne prévenir personne ?",
        then: "Prévenez un autre membre de la famille avant tout paiement.",
      },
    ],
    prevention: [
      "Convenez d'un mot de passe familial à utiliser en cas d'appel d'urgence.",
      "Limitez la diffusion publique d'enregistrements où l'on entend votre voix.",
      "Partagez cette règle avec vos proches : une voix ne suffit plus à prouver une identité.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000005",
      "AI-000001",
      "AI-000008",
      "SOCIAL-000006",
    ],
    faq: [
      {
        question:
          "Combien de temps d'enregistrement faut-il pour cloner une voix ?",
        answer:
          "Peu, et la quantité exacte dépend des outils, qui évoluent. Retenez plutôt le principe : une voix publiquement disponible doit être considérée comme reproductible, ce qui suffit à changer la conduite à tenir sans qu'il soit besoin d'un chiffre.",
      },
      {
        question: "Un mot de passe familial, est-ce vraiment utile ?",
        answer:
          "C'est la parade la plus efficace, parce qu'elle ne dépend d'aucune technologie et qu'un système ne peut pas deviner ce qui n'a jamais été écrit. Choisissez-le hors ligne, ne l'écrivez nulle part, et expliquez à quoi il sert plutôt que de simplement le fixer.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "voice-cloning",
        simulationSlug: "urgent-call-relative-voice",
        name: "Voice cloning",
        aliases: [
          "cloned voice",
          "voice fraud",
          "AI voice impersonation",
          "AI-powered vishing",
        ],
        plainLanguageDefinition:
          "A relative's voice on the phone, asking urgently for help. It really is their voice — reconstructed from a few seconds of a public recording.",
        definition:
          "Voice cloning is the synthetic reproduction of a person's voice from recorded samples, used to lend credibility to a fraudulent call or voice message.",
        howItWorks:
          "The raw material is short and easy to obtain: a story post, a family video, a voicemail, a work clip. The resulting voice is then used in a scenario that already existed — the distressed relative's call, the executive's instruction — and it removes its main weakness. Until now, these frauds relied on the fact that you didn't actually hear the person; now you do. The scenario is built to cover the remaining flaws: background noise, a bad line, urgency that rules out long sentences, emotion that explains an odd tone of voice. The practical consequence is clear: recognizing a voice no longer proves an identity, and verification has to rest on something else.",
        warningSigns: [
          "Urgent call asking for money, from an unknown number",
          "Voice that sounds familiar but with short, repetitive, or oddly flat sentences",
          "Background noise, poor call quality, or dropouts explaining the anomalies",
          "Refusal or inability to switch to video, or to call back later",
          "Instruction not to tell another family member",
          "The caller avoids open-ended questions and steers back to the urgency",
        ],
        howToVerify:
          "Hang up and call the person back on their usual number: this verification holds up because it doesn't depend on what you hear. If that's not possible, ask a question whose answer can't be found online and that requires a shared memory — not a date of birth, but a detail you lived through together. Agree on a family password: it's the simplest and most robust safeguard.",
        whatToDo:
          "Never send money based on a voice alone, no matter how urgent it sounds. Take the time to call back: a relative genuinely in trouble won't hold that against you, and if the person on the line refuses that delay, they've just given themselves away.",
        whatToDoIfVictim:
          "Contact your bank right away — a recent transfer can sometimes be recalled. Keep the caller's number, the time, and the content of the call, then file a police report. Warn the relative whose voice was reproduced: their other contacts are likely to receive the same call.",
        faq: [
          {
            question: "How much recorded audio does it take to clone a voice?",
            answer:
              "Not much, and the exact amount depends on the tools involved, which keep changing. Focus on the principle instead: any publicly available voice should be treated as reproducible, which is enough to change how you act without needing a number.",
          },
          {
            question: "Is a family password really useful?",
            answer:
              "It's the most effective safeguard, because it doesn't depend on any technology and a system can't guess what was never written down. Choose it offline, never write it down, and explain what it's for rather than just setting it.",
          },
        ],
        whyItWorks:
          "We take a loved one's voice as proof of identity, and that's the certainty the technique exploits. Urgency and emotion leave no time to notice an unusual intonation.",
        example: {
          setting: "Call from an unknown number one evening; you recognize your nephew's voice.",
          message:
            "\"It's me… I had an accident, I need €2,000 right now for the lawyer. Please don't call Mom, she'll panic.\"",
          giveaways: [
            "An unknown number for a relative whose number you have.",
            "An immediate request for money.",
            "The instruction to tell no one.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the call come from an unknown number and ask for money?",
            then: "Hang up and call the person back on their usual number.",
          },
          {
            check: "Can you ask a question only the real person could answer?",
            then: "Ask it, or ask for your family password.",
          },
          {
            check: "Are you asked not to tell anyone?",
            then: "Tell another family member before any payment.",
          },
        ],
        prevention: [
          "Agree on a family password to use for emergency calls.",
          "Limit the public sharing of recordings where your voice can be heard.",
          "Share this rule with people close to you: a voice is no longer enough to prove identity.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "AI-000003",
    slug: "faux-profil-genere-par-ia",
    simulationSlug: "profil-rencontre-photos-parfaites",
    name: "Faux profil généré par IA",
    categorySlug: "ia-et-contenus-synthetiques",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un profil dont la photo ne correspond à personne : le visage n'existe pas. La recherche d'image inversée ne donne rien, non pas parce que la personne est discrète, mais parce qu'elle n'a jamais existé.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "profil synthétique",
      "visage généré",
      "faux compte IA",
      "persona fabriquée",
    ],
    primaryVector: "social_media",
    primaryDimension: "deepfake_ai_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un faux profil généré par IA est un compte dont la photographie, et parfois la biographie et les publications, sont produites synthétiquement, afin de présenter une identité crédible et invérifiable.",
    howItWorks:
      "Le contrôle qui fonctionnait consistait à retrouver la photo ailleurs : un profil frauduleux réutilisait l'image d'une personne réelle, et la recherche inversée la retrouvait sous un autre nom. Un visage synthétique casse ce contrôle par le bas — il n'est nulle part, ce qui produit un résultat vide indistinguable de celui d'une personne discrète. Le profil peut de surcroît être étoffé : biographie cohérente, publications régulières, historique étalé dans le temps. Il sert ensuite de support à ce qui existait déjà : approche sentimentale, faux recrutement, faux conseil en investissement. L'IA ne change pas la fraude qui suit, elle rend sa façade moins réfutable.",
    warningSigns: [
      "Photo de profil parfaitement cadrée, regard centré, arrière-plan flou et sans détail",
      "Anomalies aux zones difficiles : oreilles asymétriques, lunettes déformées, bijoux incohérents, arrière-plan qui se brouille",
      "Une seule photo, ou plusieurs photos sans lieu, sans date et sans autre personne",
      "Compte récent affichant peu de relations communes vérifiables",
      "Recherche d'image inversée ne renvoyant strictement aucun résultat",
      "Historique de publications commençant brutalement, sans passé",
    ],
    triggers: ["trust", "reward"],
    indicators: [],
    howToVerify:
      "Cherchez la profondeur plutôt que l'apparence : un compte réel a un passé, des relations qui se recoupent, des photos prises à des endroits et des moments différents, avec d'autres personnes. Un résultat vide en recherche d'image n'écarte plus rien — c'est même devenu un signal en soi lorsqu'il s'accompagne d'un compte récent. Un appel vidéo non planifié reste utile, avec la réserve indiquée dans la fiche sur les deepfakes en visioconférence.",
    whatToDo:
      "N'accordez pas votre confiance à un profil sur la foi de sa photo. Refusez les échanges qui migrent vite hors de la plateforme, et n'envoyez ni argent ni documents personnels à une identité que vous n'avez pas pu recouper.",
    whatToDoIfVictim:
      "Conservez le profil et les échanges en captures, signalez le compte, et déposez plainte si une somme a été versée ou des documents transmis. Prévenez la plateforme : ces comptes fonctionnent en série, et un signalement documenté sert aux personnes suivantes.",
    whyItWorks:
      "Une belle photo et un profil soigné inspirent confiance, et la recherche d'image ne trouve rien, ce qui paraît rassurant. Le contrôle que l'on croyait fiable devient ainsi un argument en faveur du faux.",
    example: {
      setting: "Demande de contact sur un réseau professionnel, de la part d'une recruteuse.",
      message:
        "Bonjour, votre profil correspond parfaitement à un poste à pourvoir chez l'un de nos clients. Pouvons-nous poursuivre sur une messagerie, pour aller plus vite ? Je vous enverrai le dossier de candidature.",
      giveaways: [
        "Une seule photo, très nette, sur un fond flou.",
        "Le compte a quelques semaines et aucune relation commune vérifiable.",
        "La conversation est vite déplacée hors de la plateforme.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le profil a-t-il une seule photo, un compte récent et aucune relation que vous puissiez recouper ?",
        then: "Ne lui accordez aucune confiance particulière, et ne sortez pas de la plateforme.",
      },
      {
        check: "La personne vous demande-t-elle de l'argent, des documents ou de changer de messagerie ?",
        then: "Refusez et vérifiez son existence par un autre moyen : l'entreprise, un appel, une relation commune.",
      },
      {
        check: "Avez-vous déjà envoyé de l'argent ou des documents ?",
        then: "Conservez les échanges, signalez le compte et déposez plainte.",
      },
    ],
    prevention: [
      "Jugez un profil à son passé et à ses relations, pas à sa photo.",
      "Gardez les échanges sur la plateforme tant que l'identité n'est pas recoupée.",
      "N'envoyez ni argent ni documents à une personne jamais rencontrée.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000004",
      "AI-000001",
      "SOCIAL-000011",
      "AI-000006",
      "AI-000005",
      "DATA-000003",
    ],
    faq: [
      {
        question: "La recherche d'image inversée ne sert donc plus à rien ?",
        answer:
          "Elle sert encore, mais son sens a changé. Un résultat qui retrouve la photo sous une autre identité reste une preuve d'usurpation. Un résultat vide, en revanche, ne prouve plus rien — et sur un compte récent, il devient lui-même un signal.",
      },
      {
        question: "Comment repérer un visage synthétique ?",
        answer:
          "Regardez les zones que ces procédés rendent mal : oreilles, dents, montures de lunettes, bijoux, textes en arrière-plan, et la cohérence entre deux photos censées représenter la même personne. Ce sont des indices, pas des preuves, et la profondeur du compte reste un meilleur critère.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "ai-generated-fake-profile",
        simulationSlug: "dating-profile-perfect-photo",
        name: "AI-generated fake profile",
        aliases: [
          "synthetic profile",
          "AI-generated face",
          "fake AI account",
          "fabricated persona",
        ],
        plainLanguageDefinition:
          "A profile whose photo doesn't match anyone: the face doesn't exist. A reverse image search turns up nothing — not because the person is private, but because they never existed.",
        definition:
          "An AI-generated fake profile is an account whose photograph, and sometimes its biography and posts, are synthetically produced, in order to present a credible, unverifiable identity.",
        howItWorks:
          "The check that used to work was finding the photo elsewhere: a fraudulent profile reused a real person's image, and a reverse search would surface it under another name. A synthetic face breaks that check from below — it exists nowhere, which produces an empty result indistinguishable from that of a genuinely private person. The profile can also be fleshed out further: a coherent biography, regular posts, a history spread out over time. It then serves as the backdrop for something that already existed: a romance approach, a fake job offer, fake investment advice. AI doesn't change the fraud that follows — it makes its front harder to disprove.",
        warningSigns: [
          "Profile photo perfectly framed, gaze centered, background blurred with no detail",
          "Anomalies in hard-to-render areas: asymmetric ears, distorted glasses, inconsistent jewelry, background that blurs oddly",
          "A single photo, or several photos with no location, no date, and no other people",
          "Recent account showing few verifiable mutual connections",
          "Reverse image search returning strictly no results",
          "Post history that starts abruptly, with no past",
        ],
        howToVerify:
          "Look for depth rather than appearance: a real account has a past, connections that cross-check, photos taken in different places and at different times, with other people. An empty reverse-image result no longer rules anything out — it has even become a signal in itself when paired with a recent account. An unplanned video call is still useful, with the caveat noted in the fiche on video-call deepfakes.",
        whatToDo:
          "Don't extend trust to a profile on the strength of its photo. Decline exchanges that quickly move off the platform, and never send money or personal documents to an identity you haven't been able to cross-check.",
        whatToDoIfVictim:
          "Keep screenshots of the profile and the exchanges, report the account, and file a police report if money was sent or documents shared. Notify the platform: these accounts operate in batches, and a documented report helps the next person.",
        faq: [
          {
            question: "So reverse image search is now useless?",
            answer:
              "It's still useful, but its meaning has changed. A result that finds the photo under another identity is still proof of impersonation. An empty result, on the other hand, no longer proves anything — and on a recent account, it has itself become a signal.",
          },
          {
            question: "How can you spot a synthetic face?",
            answer:
              "Look at the areas these techniques render poorly: ears, teeth, glasses frames, jewelry, background text, and consistency between two photos supposedly showing the same person. These are clues, not proof, and the depth of the account remains a better criterion.",
          },
        ],
        whyItWorks:
          "A good photo and a polished profile inspire trust, and the image search finds nothing, which seems reassuring. The check people relied on thus becomes an argument in the fake's favor.",
        example: {
          setting: "Connection request on a professional network, from a recruiter.",
          message:
            "Hello, your profile is a perfect match for an open position at one of our clients. Can we continue on a messaging app, to move faster? I'll send you the application file.",
          giveaways: [
            "A single, very sharp photo on a blurred background.",
            "The account is a few weeks old, with no verifiable mutual connections.",
            "The conversation is quickly moved off the platform.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the profile have a single photo, a recent account and no connection you can cross-check?",
            then: "Give it no particular trust, and don't leave the platform.",
          },
          {
            check: "Is the person asking you for money, documents or to switch messaging apps?",
            then: "Refuse and verify they exist some other way: the company, a call, a mutual connection.",
          },
          {
            check: "Have you already sent money or documents?",
            then: "Keep the messages, report the account and file a police report.",
          },
        ],
        prevention: [
          "Judge a profile by its history and connections, not its photo.",
          "Keep conversations on the platform until the identity has been cross-checked.",
          "Send neither money nor documents to someone you've never met.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "AI-000004",
    slug: "hameconnage-genere-par-ia",
    simulationSlug: "email-parfaitement-redige-banque",
    name: "Hameçonnage généré par IA",
    categorySlug: "ia-et-contenus-synthetiques",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Le même hameçonnage qu'avant, mais sans les fautes. Le repère sur lequel beaucoup de gens s'appuyaient — « c'est mal écrit, donc c'est faux » — ne fonctionne plus.",
    attackerObjective: "identifiants",
    aliases: [
      "phishing par IA",
      "hameçonnage rédigé par IA",
      "spear phishing automatisé",
    ],
    primaryVector: "email",
    primaryDimension: "deepfake_ai_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "L'hameçonnage généré par IA désigne des messages frauduleux dont la rédaction, la personnalisation et l'adaptation au destinataire sont produites automatiquement, sans que le mécanisme de l'attaque en soit modifié.",
    howItWorks:
      "Le mécanisme est celui de l'hameçonnage, inchangé : imiter un expéditeur, fabriquer une raison d'agir, fournir un chemin qui court-circuite la vérification. Ce qui change tient à trois choses. La langue d'abord : les fautes d'orthographe et les tournures maladroites disparaissent, alors qu'elles servaient de filtre à beaucoup de lecteurs. La personnalisation ensuite : ce qui demandait un travail manuel — reprendre le nom d'un collègue, le vocabulaire d'un secteur, un projet en cours mentionné publiquement — devient automatisable à grande échelle. L'interaction enfin : un échange peut être poursuivi en répondant de façon cohérente aux objections. Aucun de ces points ne crée un nouveau danger ; ils suppriment des indices, ce qui rend les vérifications structurelles — le domaine, le canal — plus importantes qu'avant.",
    warningSigns: [
      "Message parfaitement rédigé mais dont le domaine d'expéditeur ne correspond pas",
      "Personnalisation exacte reposant sur des informations publiques",
      "Demande d'identifiants, de paiement ou de code, quelle que soit la qualité de la langue",
      "Réponse rapide et cohérente à vos objections, sans jamais accepter un autre canal",
      "Urgence maintenue à travers plusieurs échanges",
    ],
    triggers: ["urgency", "authority", "trust"],
    indicators: [],
    howToVerify:
      "Basculez la vérification de la forme vers la structure, qui n'a pas changé : lisez le nom de domaine, et rejoignez le service concerné par un chemin que vous choisissez. Ces deux gestes sont indifférents à la qualité de la rédaction, et c'est exactement pourquoi ils restent valables.",
    whatToDo:
      "Cessez d'utiliser la qualité de la langue comme critère, et dites-le autour de vous : c'est le conseil le plus répandu et il est devenu trompeur. Ne vous identifiez jamais depuis un lien reçu, aussi crédible que soit le message.",
    whatToDoIfVictim:
      "Comme pour tout hameçonnage : changez immédiatement le mot de passe concerné depuis une session ouverte par vos propres moyens, révoquez les sessions actives, et faites opposition si des données bancaires ont été saisies. Signalez le message dans votre messagerie.",
    whyItWorks:
      "Beaucoup de gens ont appris à reconnaître l'arnaque à ses fautes : un message impeccable passe ce filtre et paraît sérieux. La personnalisation donne l'impression d'un expéditeur qui vous connaît.",
    example: {
      setting: "Email reçu un lundi au nom de votre banque, sans une seule faute.",
      message:
        "Bonjour Claire, à la suite de la mise à jour de nos conditions générales du 1er octobre, nous vous invitons à confirmer vos informations de connexion afin de conserver l'accès à votre espace. Cette démarche ne prend que deux minutes : espace-clients.example-not-real.test",
      giveaways: [
        "La qualité du texte ne dit rien de l'expéditeur.",
        "Le domaine du lien n'est pas celui de votre banque.",
        "Une banque ne fait pas confirmer des identifiants par un lien.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le message vous demande-t-il de vous connecter, de payer ou de donner un code ?",
        then: "Ignorez le lien, si bien écrit soit-il, et ouvrez le service par votre favori ou l'application.",
      },
      {
        check: "Le domaine de l'expéditeur ou du lien diffère-t-il de celui du service ?",
        then: "Le message est faux : signalez-le comme hameçonnage dans votre messagerie.",
      },
      {
        check: "Avez-vous saisi vos identifiants ?",
        then: "Changez le mot de passe depuis le vrai site et déconnectez toutes les sessions.",
      },
    ],
    prevention: [
      "Abandonnez le critère de l'orthographe, et dites-le autour de vous.",
      "Rejoignez toujours un service par un chemin que vous choisissez.",
      "Activez la double authentification sur les comptes importants.",
    ],
    relatedAttackCodes: [
      "PHISH-000001",
      "AI-000006",
      "PAYMENT-000002",
      "WEB-000003",
    ],
    faq: [
      {
        question: "Comment reconnaître un message écrit par une IA ?",
        answer:
          "C'est la mauvaise question, et vouloir y répondre conduit à des erreurs dans les deux sens. Un message légitime peut être écrit avec une IA, un message frauduleux peut être écrit à la main. Ce qui distingue reste le domaine, le canal et la nature de la demande.",
      },
      {
        question: "Faut-il donc se méfier de tous les messages bien écrits ?",
        answer:
          "Non : la qualité de la rédaction ne dit rien, ni dans un sens ni dans l'autre. Elle est simplement sortie de la liste des critères. Ce qui reste : le domaine de l'expéditeur, et le fait qu'une demande d'identifiants ou de paiement ne se traite jamais depuis un lien.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "ai-generated-phishing",
        simulationSlug: "perfectly-written-bank-email",
        name: "AI-generated phishing",
        aliases: [
          "AI phishing",
          "AI-written phishing",
          "automated spear phishing",
        ],
        plainLanguageDefinition:
          "The same phishing as before, just without the typos. The tell many people relied on — \"it's badly written, so it's fake\" — no longer works.",
        definition:
          "AI-generated phishing refers to fraudulent messages whose wording, personalization, and adaptation to the recipient are produced automatically, without the underlying mechanism of the attack changing.",
        howItWorks:
          "The mechanism is that of phishing, unchanged: imitate a sender, fabricate a reason to act, provide a path that bypasses verification. What changes comes down to three things. Language, first: spelling mistakes and awkward phrasing disappear, even though they used to act as a filter for many readers. Personalization, next: what used to require manual work — using a colleague's name, industry-specific vocabulary, a current project mentioned publicly — becomes automatable at scale. Interaction, last: an exchange can be sustained by replying coherently to objections. None of this creates a new danger; it removes clues, which makes structural checks — the domain, the channel — more important than before.",
        warningSigns: [
          "Perfectly written message whose sender domain doesn't match",
          "Exact personalization built from publicly available information",
          "Request for credentials, payment, or a code, regardless of how polished the language is",
          "Fast, coherent replies to your objections, while never accepting another channel",
          "Urgency maintained across several exchanges",
        ],
        howToVerify:
          "Shift the check from wording to structure, which hasn't changed: read the domain name, and reach the service concerned through a path you choose. Both are indifferent to how well the message is written, and that's exactly why they still hold.",
        whatToDo:
          "Stop using writing quality as a criterion, and say so around you: it's the most common advice, and it has become misleading. Never log in from a link you received, however credible the message looks.",
        whatToDoIfVictim:
          "As with any phishing: change the affected password immediately from a session you opened yourself, revoke active sessions, and contact your bank if banking details were entered. Report the message in your mail client.",
        faq: [
          {
            question: "How can you recognize a message written by an AI?",
            answer:
              "That's the wrong question, and trying to answer it leads to mistakes both ways. A legitimate message can be written with AI, a fraudulent one can be written by hand. What still distinguishes them: the domain, the channel, and the nature of the request.",
          },
          {
            question: "So should I be suspicious of every well-written message?",
            answer:
              "No: writing quality tells you nothing either way. It has simply dropped off the list of criteria. What remains: the sender's domain, and the fact that a request for credentials or payment is never handled through a link.",
          },
        ],
        whyItWorks:
          "Many people learned to recognize scams by their mistakes: a flawless message gets past that filter and seems serious. Personalization gives the impression of a sender who knows you.",
        example: {
          setting: "Email received on a Monday in your bank's name, without a single mistake.",
          message:
            "Hello Claire, following the update to our terms and conditions on October 1, we invite you to confirm your login information in order to keep access to your account. This only takes two minutes: espace-clients.example-not-real.test",
          giveaways: [
            "The quality of the writing says nothing about the sender.",
            "The link's domain isn't your bank's.",
            "A bank doesn't have you confirm credentials through a link.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the message ask you to log in, pay or give a code?",
            then: "Ignore the link, however well written, and open the service from your bookmark or the app.",
          },
          {
            check: "Does the sender's or the link's domain differ from the service's?",
            then: "The message is fake: report it as phishing in your email.",
          },
          {
            check: "Did you enter your credentials?",
            then: "Change the password on the real site and sign out of all sessions.",
          },
        ],
        prevention: [
          "Drop spelling as a criterion, and tell the people around you.",
          "Always reach a service through a path you choose.",
          "Turn on two-factor authentication on important accounts.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Phishing (French government cybersecurity assistance service)",
            url: REF.phishing.url,
          },
        ],
      },
    },
  },
  {
    code: "AI-000005",
    slug: "faux-site-d-information-genere-par-ia",
    simulationSlug: "article-choc-site-actualite-inconnu",
    name: "Faux site d'information généré par IA",
    categorySlug: "ia-et-contenus-synthetiques",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un site qui ressemble à un journal en ligne, avec des dizaines d'articles et des noms de journalistes. Rien n'a été écrit par un humain, et il existe pour donner l'air sérieux à une seule chose.",
    attackerObjective: "argent",
    aliases: [
      "faux média",
      "site d'actualité synthétique",
      "faux article de presse",
    ],
    primaryVector: "web",
    primaryDimension: "deepfake_ai_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un faux site d'information généré par IA est un site imitant la forme d'un média en ligne, dont les articles sont produits automatiquement, et qui sert à donner une caution apparente à une offre, un produit ou un discours.",
    howItWorks:
      "Produire une centaine d'articles plausibles coûte désormais peu, ce qui permet de fabriquer l'ensemble du décor d'un média : rubriques, archives, portraits de rédaction, mentions légales. Le site n'existe pas pour être lu : il existe pour être trouvé au moment où quelqu'un vérifie. La cible typique est la personne prudente — celle qui, avant d'investir ou d'acheter, cherche le nom de la société et tombe sur un article élogieux qui a l'air journalistique. Le procédé se combine avec les publicités et les faux avis, de sorte que plusieurs sources apparemment indépendantes racontent la même chose. C'est la vérification elle-même qui est piégée, et c'est ce qui le distingue d'un simple site frauduleux.",
    warningSigns: [
      "Articles nombreux, longs, sans angle ni source citée",
      "Auteurs sans existence vérifiable ailleurs, portraits sans historique",
      "Aucun contact identifiable : ni adresse, ni raison sociale, ni directeur de publication",
      "Nom de domaine récent pour un média qui prétend exister depuis des années",
      "Tous les articles convergent vers une même offre ou un même acteur",
      "Absence de reprise du site par des médias identifiables",
    ],
    triggers: ["trust", "authority"],
    indicators: [],
    howToVerify:
      "Vérifiez le média avant l'article : mentions légales, directeur de publication, adresse, ancienneté du domaine. Cherchez ensuite si un média identifiable a traité le même sujet — un site isolé sur une information importante est un signal. Pour une offre financière, la seule vérification qui compte reste le registre du régulateur, jamais un article.",
    whatToDo:
      "Ne traitez pas un article comme une source. Croisez avec au moins un média que vous connaissiez avant, et méfiez-vous d'une convergence trop parfaite entre plusieurs sites que vous ne connaissiez pas.",
    whatToDoIfVictim:
      "Si le site a servi de caution à un placement ou à un achat, contactez votre banque et déposez plainte. Conservez les captures des articles : leur disparition rapide est fréquente, et elles rattachent l'offre à son dispositif de mise en confiance.",
    whyItWorks:
      "Ce piège vise les personnes prudentes : celles qui vérifient avant d'acheter ou d'investir. Un article au ton journalistique ressemble à une source indépendante, et plusieurs sites qui disent la même chose donnent l'impression d'un consensus.",
    example: {
      setting: "Recherche du nom d'une plateforme de placement avant d'y verser de l'argent.",
      message:
        "Info Épargne Hebdo — Enquête : comment cette plateforme française bouscule la gestion de patrimoine. Par notre rédaction économie.\ninfo-epargne-hebdo.test",
      giveaways: [
        "Le média n'a ni directeur de publication ni adresse identifiables.",
        "Le domaine est récent pour un journal qui se dit établi.",
        "Tous les articles du site mènent à la même offre.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le site est-il impossible à identifier : pas de mentions légales, pas de directeur de publication, pas d'adresse ?",
        then: "Ne le considérez pas comme une source.",
      },
      {
        check: "L'information est-elle absente des médias que vous connaissiez déjà ?",
        then: "Considérez-la comme non vérifiée, et ne prenez aucune décision sur cette base.",
      },
      {
        check: "Avez-vous investi ou acheté sur la foi de cet article ?",
        then: "Contactez votre banque, conservez des captures des articles et déposez plainte.",
      },
    ],
    prevention: [
      "Vérifiez le média avant l'article.",
      "Pour un placement, consultez le registre du régulateur plutôt qu'un article.",
      "Croisez toujours avec au moins un média que vous connaissiez avant.",
    ],
    relatedAttackCodes: [
      "PAYMENT-000003",
      "WEB-000001",
      "AI-000003",
      "WEB-000004",
    ],
    faq: [
      {
        question:
          "Le site citait des médias connus, cela ne prouve-t-il rien ?",
        answer:
          "Non : citer un média est gratuit et invérifiable pour le lecteur pressé. Ce qui compte est que le média cité ait effectivement publié cette information, ce qui se vérifie sur son propre site, pas sur celui qui le cite.",
      },
      {
        question: "Comment savoir si un auteur existe ?",
        answer:
          "Cherchez son nom en dehors du site : un journaliste réel a des publications ailleurs, un parcours, des mentions par des tiers. Un auteur qui n'existe que sur un seul site, avec un portrait sans autre trace, est un élément de décor.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "ai-generated-fake-news-site",
        simulationSlug: "shock-article-unknown-news-site",
        name: "AI-generated fake news site",
        aliases: [
          "fake media outlet",
          "synthetic news site",
          "fake press article",
        ],
        plainLanguageDefinition:
          "A site that looks like an online newspaper, with dozens of articles and journalist bylines. None of it was written by a human, and it exists to lend a serious appearance to a single thing.",
        definition:
          "An AI-generated fake news site is a site imitating the form of an online news outlet, whose articles are produced automatically, and which is used to give an apparent stamp of approval to an offer, a product, or a narrative.",
        howItWorks:
          "Producing a hundred plausible articles is now cheap, which makes it possible to fabricate the entire backdrop of a news outlet: sections, archives, staff portraits, legal notices. The site doesn't exist to be read: it exists to be found at the moment someone checks. The typical target is the careful person — the one who, before investing or buying, searches for the company's name and lands on a glowing article that looks journalistic. The technique combines with ads and fake reviews, so several seemingly independent sources tell the same story. It is the verification step itself that gets trapped, and that's what sets it apart from an ordinary fraudulent site.",
        warningSigns: [
          "Numerous, long articles with no angle and no cited sources",
          "Authors with no verifiable existence elsewhere, portraits with no history",
          "No identifiable contact: no address, no company name, no publication director",
          "Recently registered domain for an outlet claiming to have existed for years",
          "All articles converge on the same offer or the same actor",
          "No coverage of the site by identifiable media outlets",
        ],
        howToVerify:
          "Check the outlet before the article: legal notices, publication director, address, domain age. Then look for whether an identifiable outlet has covered the same topic — a single site covering an important story on its own is a signal. For a financial offer, the only check that matters remains the regulator's register, never an article.",
        whatToDo:
          "Don't treat an article as a source. Cross-check against at least one outlet you already knew before, and be wary of too-perfect agreement between several sites you'd never heard of.",
        whatToDoIfVictim:
          "If the site was used to lend credibility to an investment or a purchase, contact your bank and file a police report. Keep screenshots of the articles: they often disappear quickly, and they tie the offer back to the setup used to build trust.",
        faq: [
          {
            question: "The site cited well-known media outlets — doesn't that prove something?",
            answer:
              "No: citing an outlet is free and unverifiable for a rushed reader. What matters is whether the cited outlet actually published that information, which is checked on its own site, not on the one citing it.",
          },
          {
            question: "How can you tell if an author actually exists?",
            answer:
              "Search their name outside the site: a real journalist has publications elsewhere, a track record, mentions by others. An author who only exists on a single site, with a portrait and no other trace, is a piece of set dressing.",
          },
        ],
        whyItWorks:
          "This trap targets careful people: those who check before buying or investing. An article with a journalistic tone looks like an independent source, and several sites saying the same thing create an impression of consensus.",
        example: {
          setting: "Searching for an investment platform's name before putting money into it.",
          message:
            "Info Épargne Hebdo — Investigation: how this French platform is shaking up wealth management. By our business desk.\ninfo-epargne-hebdo.test",
          giveaways: [
            "The outlet has no identifiable editor or address.",
            "The domain is recent for a paper that claims to be established.",
            "Every article on the site leads to the same offer.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the site impossible to identify: no legal notice, no editor, no address?",
            then: "Don't treat it as a source.",
          },
          {
            check: "Is the information missing from the media you already knew?",
            then: "Treat it as unverified, and make no decision based on it.",
          },
          {
            check: "Did you invest or buy on the strength of this article?",
            then: "Contact your bank, keep screenshots of the articles and file a police report.",
          },
        ],
        prevention: [
          "Check the outlet before the article.",
          "For an investment, consult the regulator's register rather than an article.",
          "Always cross-check with at least one outlet you knew beforehand.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "AI-000006",
    slug: "chatbot-malveillant",
    simulationSlug: "assistance-en-ligne-code-sms",
    name: "Agent conversationnel malveillant",
    categorySlug: "ia-et-contenus-synthetiques",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une fenêtre de discussion qui répond comme un conseiller — patiemment, sans jamais s'énerver — et qui vous fait donner, question après question, ce que vous n'auriez pas mis dans un formulaire.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "faux assistant",
      "chatbot frauduleux",
      "faux service client automatisé",
    ],
    primaryVector: "web",
    primaryDimension: "deepfake_ai_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un agent conversationnel malveillant est une interface de discussion automatisée, présentée comme un support ou un assistant, qui collecte des informations ou oriente vers une action frauduleuse au fil de l'échange.",
    howItWorks:
      "Un formulaire annonce ce qu'il veut, ce qui laisse le temps d'évaluer l'ensemble de la demande. Une conversation, non : elle fractionne. Chaque question paraît anodine et justifiée par la précédente, et la somme n'apparaît jamais à l'écran. L'échange installe aussi une relation — patience, formules d'excuse, apparente compétence — qui rend le refus socialement coûteux, comme face à une personne. Ces agents apparaissent sur de faux sites de support, dans des publicités pour un service d'assistance, ou intégrés à des applications se présentant comme des assistants. La demande décisive arrive tard, quand l'échange a déjà duré : un code de vérification, un accès à distance, un paiement pour « finaliser ».",
    warningSigns: [
      "Assistance obtenue par un lien reçu ou une publicité plutôt que depuis le site officiel",
      "Questions progressives glissant vers des informations d'authentification",
      "Demande d'un code reçu par SMS, quel qu'en soit le prétexte",
      "Proposition d'installer un outil de prise en main à distance",
      "Impossibilité d'obtenir un interlocuteur humain ou un canal officiel",
      "Pression douce mais continue pour terminer maintenant",
    ],
    triggers: ["trust", "authority", "urgency"],
    indicators: [],
    howToVerify:
      "Rejoignez le support par le site officiel du service, saisi par vous-même ou ouvert depuis un favori : un support authentique est accessible sans qu'on vous y conduise. Le critère qui tranche est indépendant du ton de l'échange : aucun support ne demande de code de vérification, de mot de passe, ni de prise en main à distance non sollicitée.",
    whatToDo:
      "Traitez une conversation comme un formulaire dont vous ne voyez pas la fin : demandez-vous, avant chaque réponse, si vous l'auriez écrite dans un champ. N'accordez ni code ni accès distant, quelle que soit la qualité de l'échange.",
    whatToDoIfVictim:
      "Changez les mots de passe concernés depuis un autre appareil et révoquez les sessions actives. Si un outil de prise en main a été installé, déconnectez l'appareil et faites-le analyser. Faites opposition si un paiement a eu lieu, puis déposez plainte.",
    whyItWorks:
      "La conversation découpe la demande en petites questions, dont aucune ne paraît grave. La patience et la politesse de l'agent créent une relation, et refuser devient aussi gênant que face à une personne.",
    example: {
      setting: "Fenêtre d'assistance sur un site atteint par une publicité, après un problème de livraison.",
      message:
        "Je comprends tout à fait votre situation. Pour retrouver votre commande, pourriez-vous me confirmer votre adresse email ? Merci. Je viens de vous envoyer un code de vérification par SMS : pouvez-vous me l'indiquer pour valider votre identité ?",
      giveaways: [
        "Le support a été atteint par une publicité, pas depuis le site officiel.",
        "Un code reçu par SMS est demandé dans la conversation.",
        "Chaque question prépare la suivante.",
      ],
    },
    decisionChecklist: [
      {
        check: "Êtes-vous arrivé sur ce support par un lien ou une publicité plutôt que par le site officiel ?",
        then: "Fermez la conversation et rejoignez le support depuis le site du service, ouvert par vous-même.",
      },
      {
        check: "L'agent vous demande-t-il un code, un mot de passe ou un accès à distance ?",
        then: "Refusez et quittez la conversation : aucun support ne le demande.",
      },
      {
        check: "Avez-vous donné un code ou installé un outil ?",
        then: "Changez les mots de passe concernés depuis un autre appareil et déconnectez toutes les sessions.",
      },
    ],
    prevention: [
      "Rejoignez toujours un support depuis le site officiel du service.",
      "Avant chaque réponse, demandez-vous si vous l'auriez écrite dans un formulaire.",
      "Retenez qu'un code de vérification ne se donne à personne, ni humain ni robot.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000003",
      "AI-000004",
      "AI-000007",
      "SOCIAL-000007",
      "AI-000003",
    ],
    faq: [
      {
        question:
          "Comment distinguer un agent légitime d'un agent frauduleux ?",
        answer:
          "Pas au fil de la conversation, où les deux se ressemblent. Par le chemin : un support légitime s'atteint depuis le site officiel que vous ouvrez vous-même. Un agent atteint par un lien ou une publicité n'a aucune légitimité établie, quelle que soit sa qualité.",
      },
      {
        question:
          "Il connaissait mon numéro de dossier, n'est-ce pas une preuve ?",
        answer:
          "Non. Ce type d'information provient d'une fuite de données antérieure ou d'un message que vous avez reçu. Elle rend l'échange crédible sans rien prouver — c'est même l'usage principal qui en est fait.",
      },
    ],
    references: [REF.fakeSupport],
    translations: {
      en: {
        slug: "malicious-chatbot",
        simulationSlug: "online-support-text-code",
        name: "Malicious chatbot",
        aliases: [
          "fake assistant",
          "fraudulent chatbot",
          "fake automated customer service",
        ],
        plainLanguageDefinition:
          "A chat window that replies like an advisor — patiently, never losing its temper — and that gets you to hand over, question by question, what you'd never have put in a form.",
        definition:
          "A malicious chatbot is an automated chat interface, presented as support or an assistant, that collects information or steers the user toward a fraudulent action over the course of the conversation.",
        howItWorks:
          "A form announces what it wants, which leaves time to weigh the request as a whole. A conversation doesn't: it breaks the request into pieces. Each question seems harmless and justified by the last one, and the sum never appears on screen at once. The exchange also builds a relationship — patience, apologetic phrasing, apparent competence — which makes refusing socially costly, as it would with a person. These agents show up on fake support sites, in ads for an assistance service, or built into apps presenting themselves as assistants. The decisive request comes late, once the exchange has already gone on for a while: a verification code, remote access, a payment to \"finalize\" something.",
        warningSigns: [
          "Support reached through a received link or an ad rather than the official site",
          "Progressive questions sliding toward authentication information",
          "Request for a code received by SMS, whatever the pretext",
          "Offer to install a remote-access tool",
          "Impossible to reach a human agent or an official channel",
          "Gentle but constant pressure to finish now",
        ],
        howToVerify:
          "Reach support through the service's official site, typed in yourself or opened from a bookmark: genuine support is reachable without being steered there. The decisive test doesn't depend on the tone of the exchange: no support service ever asks for a verification code, a password, or unsolicited remote access.",
        whatToDo:
          "Treat a conversation like a form whose end you can't see: before each reply, ask whether you'd have written it in a form field. Never hand over a code or remote access, no matter how good the exchange feels.",
        whatToDoIfVictim:
          "Change the affected passwords from another device and revoke active sessions. If a remote-access tool was installed, disconnect the device and have it checked. Contact your bank if a payment went through, then file a police report.",
        faq: [
          {
            question: "How do you tell a genuine agent from a fraudulent one?",
            answer:
              "Not from the conversation itself, where the two look alike. By the path taken: genuine support is reached from the official site you open yourself. An agent reached through a link or an ad has no established legitimacy, however good it sounds.",
          },
          {
            question: "It knew my case number — isn't that proof?",
            answer:
              "No. That kind of information comes from an earlier data breach or a message you received. It makes the exchange credible without proving anything — that's even its main use.",
          },
        ],
        whyItWorks:
          "The conversation breaks the request into small questions, none of which seems serious. The agent's patience and politeness create a relationship, and refusing becomes as awkward as with a person.",
        example: {
          setting: "Support chat window on a site reached through an ad, after a delivery problem.",
          message:
            "I completely understand your situation. To find your order, could you confirm your email address? Thank you. I've just sent you a verification code by text: could you give it to me to confirm your identity?",
          giveaways: [
            "The support was reached through an ad, not from the official site.",
            "A code received by text is requested in the chat.",
            "Each question sets up the next one.",
          ],
        },
        decisionChecklist: [
          {
            check: "Did you reach this support through a link or an ad rather than the official site?",
            then: "Close the chat and reach support from the service's site, opened on your own.",
          },
          {
            check: "Is the agent asking for a code, a password or remote access?",
            then: "Refuse and leave the chat: no support service asks for that.",
          },
          {
            check: "Did you give a code or install a tool?",
            then: "Change the passwords concerned from another device and sign out of all sessions.",
          },
        ],
        prevention: [
          "Always reach support from the service's official website.",
          "Before each answer, ask yourself whether you'd have written it in a form.",
          "Remember that a verification code is given to no one, human or bot.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Fake tech support (French government cybersecurity assistance service)",
            url: REF.fakeSupport.url,
          },
        ],
      },
    },
  },
  {
    code: "AI-000007",
    slug: "fausse-application-d-ia",
    simulationSlug: "application-generation-images-gratuite",
    name: "Fausse application d'IA",
    categorySlug: "ia-et-contenus-synthetiques",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une application qui promet les capacités d'un outil d'IA connu, en version gratuite ou améliorée. Ce qu'elle collecte réellement, ce sont vos comptes et ce que vous lui confiez.",
    attackerObjective: "identifiants",
    aliases: [
      "fausse appli IA",
      "faux ChatGPT",
      "générateur frauduleux",
      "extension IA piégée",
    ],
    primaryVector: "web",
    primaryDimension: "deepfake_ai_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Une fausse application d'IA est un logiciel, une extension de navigateur ou une application mobile qui se présente comme un outil d'intelligence artificielle connu, ou comme un accès privilégié à celui-ci, afin de collecter des identifiants ou des données.",
    howItWorks:
      "La notoriété rapide de ces outils crée un écart durable entre ce que les gens ont entendu nommer et ce qu'ils savent situer : peu de personnes connaissent l'adresse officielle d'un service dont elles ont entendu parler la semaine précédente. Le faux exploite cet écart, en proposant une version gratuite, sans attente, avec des fonctions supplémentaires, ou disponible dans un pays où l'officielle ne l'est pas. Deux récoltes suivent. La première est classique : identifiants demandés à l'inscription, souvent via une connexion avec un compte existant, et les autorisations larges d'une extension de navigateur. La seconde est propre à ces outils : ce que l'utilisateur y saisit — documents professionnels, données personnelles, textes confidentiels — parce que l'usage même consiste à confier du contenu.",
    warningSigns: [
      "Application promettant l'accès gratuit à un outil habituellement payant",
      "Éditeur différent de celui de l'outil annoncé",
      "Extension de navigateur demandant l'accès à tous les sites pour une fonction de rédaction",
      "Connexion proposée avec un compte existant sur un site que vous n'avez pas atteint vous-même",
      "Application relayée par une publicité ou un résultat sponsorisé",
      "Absence de politique de confidentialité, ou politique se réservant tout usage du contenu soumis",
    ],
    triggers: ["reward", "curiosity", "trust"],
    indicators: [],
    howToVerify:
      "Partez de l'éditeur officiel plutôt que du nom de l'outil : ouvrez son site, et suivez le lien qu'il donne vers son application. C'est le seul chemin qui ne passe pas par une recherche, laquelle est précisément le terrain de cette attaque. Vérifiez le nom du développeur dans le magasin d'applications, et les autorisations demandées.",
    whatToDo:
      "N'utilisez que les applications de l'éditeur, et refusez les extensions réclamant l'accès à tous les sites pour une fonction accessoire. Indépendamment de la fraude, ne confiez à aucun outil de ce type des documents que vous ne publieriez pas : le contenu soumis quitte votre machine.",
    whatToDoIfVictim:
      "Retirez l'application ou l'extension, changez les mots de passe des comptes utilisés pour vous y connecter et révoquez les sessions ainsi que les autorisations d'applications tierces. Faites l'inventaire de ce qui a été soumis à l'outil : si des documents professionnels ou des données personnelles y figurent, prévenez qui de droit.",
    whyItWorks:
      "On a entendu parler de l'outil, mais on ne sait pas où le trouver : la première application qui porte un nom approchant paraît être la bonne. L'usage même de ces outils consiste à confier du contenu, ce qui rend la saisie naturelle.",
    example: {
      setting: "Publicité vue sur un réseau social, menant à une fiche d'application.",
      message:
        "Générateur d'images IA Pro — accès illimité gratuit, sans liste d'attente. Connectez-vous avec votre compte en un clic.",
      giveaways: [
        "Gratuit et illimité pour un outil habituellement payant.",
        "L'éditeur n'est pas celui de l'outil annoncé.",
        "La connexion avec votre compte est la première chose demandée.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'application promet-elle gratuitement ce que l'outil officiel fait payer ?",
        then: "Rejoignez le site de l'éditeur officiel et suivez son lien vers l'application.",
      },
      {
        check: "Le développeur affiché diffère-t-il de l'éditeur de l'outil ?",
        then: "Ne l'installez pas.",
      },
      {
        check: "Avez-vous connecté un compte ou confié des documents à cette application ?",
        then: "Retirez l'application, révoquez son autorisation dans les réglages du compte et faites l'inventaire de ce que vous lui avez confié.",
      },
    ],
    prevention: [
      "Partez toujours du site de l'éditeur, jamais d'une publicité ou d'une recherche.",
      "Ne confiez à aucun outil en ligne un document que vous ne publieriez pas.",
      "Relisez les applications autorisées sur vos comptes principaux.",
    ],
    relatedAttackCodes: ["MOB-000001", "WEB-000006", "AI-000006", "WEB-000005"],
    faq: [
      {
        question: "L'application fonctionne et me donne bien des réponses.",
        answer:
          "C'est attendu : elle peut relayer les requêtes vers un service réel tout en conservant une copie de ce qui transite et des identifiants saisis. Le fonctionnement apparent ne dit rien de ce qui se passe autour.",
      },
      {
        question: "Que risque-t-on avec ce que l'on a écrit dedans ?",
        answer:
          "Tout ce qui a été soumis doit être considéré comme sorti de votre contrôle : documents, coordonnées, textes internes. Faites-en la liste, et signalez-le si des informations professionnelles ou des données concernant des tiers sont en jeu.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "fake-ai-app",
        simulationSlug: "free-image-generator-app",
        name: "Fake AI app",
        aliases: [
          "fake AI app",
          "fake ChatGPT",
          "fraudulent generator",
          "malicious AI extension",
        ],
        plainLanguageDefinition:
          "An app that promises the capabilities of a well-known AI tool, for free or with extra features. What it actually collects is your accounts and whatever you entrust to it.",
        definition:
          "A fake AI app is a piece of software, browser extension, or mobile app that presents itself as a well-known artificial intelligence tool, or as privileged access to one, in order to collect credentials or data.",
        howItWorks:
          "The fast rise to fame of these tools creates a lasting gap between what people have heard named and what they actually know how to locate: few people know the official address of a service they only heard about last week. The fake exploits that gap, offering a free version, no waitlist, extra features, or availability in a country where the official one isn't offered. Two kinds of harvesting follow. The first is classic: credentials requested at sign-up, often via login with an existing account, and the broad permissions of a browser extension. The second is specific to these tools: what the user types into them — professional documents, personal data, confidential text — because the very use of the tool consists of handing over content.",
        warningSigns: [
          "App promising free access to a tool that's normally paid",
          "Publisher different from the one behind the announced tool",
          "Browser extension requesting access to every site for a writing feature",
          "Login offered via an existing account on a site you didn't reach yourself",
          "App promoted through an ad or a sponsored result",
          "No privacy policy, or a policy claiming unrestricted use of submitted content",
        ],
        howToVerify:
          "Start from the official publisher rather than the tool's name: open its site, and follow the link it gives to its app. It's the only path that doesn't go through a search, which is exactly the terrain this attack exploits. Check the developer's name in the app store, and the permissions requested.",
        whatToDo:
          "Only use the publisher's own apps, and decline extensions asking for access to every site for a minor feature. Regardless of fraud, never hand this kind of tool documents you wouldn't publish: submitted content leaves your machine.",
        whatToDoIfVictim:
          "Remove the app or extension, change the passwords of the accounts used to sign in to it, and revoke sessions and third-party app permissions. Take stock of what was submitted to the tool: if professional documents or personal data are involved, notify the appropriate party.",
        faq: [
          {
            question: "The app works and does give me answers.",
            answer:
              "That's expected: it can relay requests to a real service while keeping a copy of what passes through and of entered credentials. The app appearing to work says nothing about what happens around it.",
          },
          {
            question: "What's at risk with what I typed into it?",
            answer:
              "Everything submitted should be considered out of your control: documents, contact details, internal text. Make a list of it, and report it if professional information or data about other people is involved.",
          },
        ],
        whyItWorks:
          "You've heard of the tool but don't know where to find it: the first app with a similar name looks like the right one. Using these tools means handing over content, which makes entering it feel natural.",
        example: {
          setting: "Ad seen on a social network, leading to an app listing.",
          message:
            "AI Image Generator Pro — free unlimited access, no waiting list. Sign in with your account in one click.",
          giveaways: [
            "Free and unlimited for a tool that's usually paid.",
            "The publisher isn't the one behind the advertised tool.",
            "Signing in with your account is the first thing requested.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the app promise for free what the official tool charges for?",
            then: "Go to the official publisher's site and follow its link to the app.",
          },
          {
            check: "Does the developer shown differ from the tool's publisher?",
            then: "Don't install it.",
          },
          {
            check: "Did you connect an account or hand documents to this app?",
            then: "Remove the app, revoke its authorization in the account settings and list what you gave it.",
          },
        ],
        prevention: [
          "Always start from the publisher's site, never from an ad or a search.",
          "Never give an online tool a document you wouldn't publish.",
          "Review the apps authorized on your main accounts.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "AI-000008",
    slug: "deepfake-en-visioconference",
    simulationSlug: "visio-direction-virement-urgent",
    name: "Deepfake en visioconférence",
    categorySlug: "ia-et-contenus-synthetiques",
    editorialStatus: "published",
    plainLanguageDefinition:
      "L'appel vidéo était la vérification qui marchait : on voyait la personne. Un visage et une voix peuvent désormais être reproduits en direct, ce qui oblige à vérifier autrement.",
    attackerObjective: "argent",
    aliases: [
      "visio truquée",
      "deepfake temps réel",
      "fraude au président en visio",
    ],
    primaryVector: "web",
    primaryDimension: "deepfake_ai_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un deepfake en visioconférence est l'usage d'un visage et d'une voix synthétiques en temps réel au cours d'un appel vidéo, afin de faire valider une demande — le plus souvent un virement — par un interlocuteur qui croit voir la personne qu'il connaît.",
    howItWorks:
      "L'appel vidéo servait de vérification finale dans plusieurs fraudes décrites sur ce site : voir la personne suffisait à trancher. Ce raccourci n'est plus sûr. La qualité de l'image en visioconférence joue en faveur du procédé — compression, latence, cadrage serré, éclairage médiocre — car ces défauts, habituels, masquent ceux de la synthèse. Le scénario reprend celui du faux ordre de virement, en ajoutant l'étape qui le rendait réfutable : une visio courte, où un dirigeant confirme la consigne avant de devoir raccrocher. La demande d'agir vite et de ne pas en parler reste au cœur du dispositif, parce que la synthèse temps réel supporte mal la durée et l'imprévu.",
    warningSigns: [
      "Visio inhabituellement courte, avec un motif pour raccrocher rapidement",
      "Caméra fixe, cadrage serré, peu de mouvements de tête et de mains",
      "Anomalies lors des mouvements amples : contours du visage, occlusions quand la main passe devant",
      "Décalage entre le son et l'image, ou intonation étrangement neutre",
      "Refus de passer sur un autre outil ou de rappeler sur un numéro connu",
      "Demande financière urgente et confidentielle formulée pendant l'appel",
    ],
    triggers: ["authority", "urgency", "trust", "social_pressure"],
    indicators: [],
    howToVerify:
      "Ne faites pas de la visio votre preuve : faites-en une étape. La vérification qui résiste est le rappel sur un numéro que vous possédiez avant l'appel, et la double validation d'un virement, qui ne dépend d'aucune image. Pendant l'échange, demander un geste imprévu — se tourner de profil, passer la main devant le visage, prendre un objet — met la synthèse temps réel en difficulté, mais reste un indice, pas une preuve.",
    whatToDo:
      "Maintenez la double validation des virements même après un appel vidéo : c'est précisément la procédure que ce procédé vise à faire sauter. Convenez, dans les équipes financières comme en famille, d'un canal de confirmation distinct de celui par lequel la demande arrive.",
    whatToDoIfVictim:
      "Contactez la banque immédiatement pour tenter un rappel des fonds — le délai est le facteur déterminant. Conservez l'enregistrement s'il existe, les journaux de connexion de l'outil de visioconférence et les invitations, puis déposez plainte. Prévenez la personne dont l'apparence a été utilisée.",
    whyItWorks:
      "Voir quelqu'un en vidéo était la preuve ultime, et beaucoup de procédures de vérification s'arrêtent là. L'autorité d'un dirigeant et la confidentialité demandée découragent d'appeler qui que ce soit pour confirmer.",
    example: {
      setting: "Visio de quelques minutes avec la directrice générale, programmée à la dernière minute.",
      message:
        "Je suis entre deux réunions, je ne peux pas rester. L'acquisition dont je t'ai parlé se signe aujourd'hui, j'ai besoin que le virement parte avant 16 h. C'est confidentiel, n'en parle pas au reste de l'équipe. Je t'envoie l'IBAN par message.",
      giveaways: [
        "L'appel est court et la caméra reste fixe.",
        "Confidentialité et urgence empêchent la double validation.",
        "L'IBAN arrive par un autre canal, juste après l'appel.",
      ],
    },
    decisionChecklist: [
      {
        check: "La visio se termine-t-elle sur une demande de paiement urgente ou confidentielle ?",
        then: "N'exécutez rien : rappelez la personne sur le numéro que vous aviez déjà.",
      },
      {
        check: "La personne refuse-t-elle un rappel ou un autre outil ?",
        then: "Considérez la demande comme frauduleuse et prévenez votre responsable ou votre banque.",
      },
      {
        check: "Avez-vous déjà fait le virement ?",
        then: "Appelez la banque immédiatement pour demander un rappel des fonds, puis déposez plainte.",
      },
    ],
    prevention: [
      "Gardez la double validation des virements, même après une visio.",
      "Convenez avec votre équipe et vos proches d'un canal de confirmation distinct de celui de la demande.",
      "Ne traitez jamais une image comme une preuve d'identité suffisante pour un paiement.",
    ],
    relatedAttackCodes: [
      "PAYMENT-000002",
      "AI-000001",
      "AI-000002",
      "SOCIAL-000004",
    ],
    faq: [
      {
        question: "L'appel vidéo ne sert donc plus à vérifier une identité ?",
        answer:
          "Il garde de la valeur — un refus persistant reste révélateur — mais il ne suffit plus seul. Les fiches de ce site qui le recommandent le disent désormais : la vérification qui tranche est le rappel sur un numéro antérieur à la demande, et pour un virement, la double validation.",
      },
      {
        question: "Comment mettre en difficulté une synthèse en direct ?",
        answer:
          "En demandant l'imprévu : un profil complet, une main passée devant le visage, un objet pris et montré. Ces gestes sont coûteux pour une synthèse temps réel. Considérez-les comme un indice qui invite à vérifier autrement, jamais comme un test décisif.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "deepfake-video-call",
        simulationSlug: "video-call-urgent-transfer",
        name: "Deepfake video call",
        aliases: [
          "faked video call",
          "real-time deepfake",
          "CEO fraud by video call",
        ],
        plainLanguageDefinition:
          "The video call used to be the check that worked: you could see the person. A face and voice can now be reproduced live, which means verifying has to happen some other way.",
        definition:
          "A deepfake video call is the use of a synthetic face and voice in real time during a video call, to get a request — most often a wire transfer — approved by someone who believes they're seeing the person they know.",
        howItWorks:
          "The video call used to serve as the final check in several frauds described on this site: seeing the person was enough to settle the matter. That shortcut is no longer safe. Video-call image quality actually works in the technique's favor — compression, latency, tight framing, poor lighting — because these familiar flaws mask the ones of the synthesis. The scenario reuses the fake wire-transfer instruction, adding the step that used to make it refutable: a short video call, where an executive confirms the instruction before having to hang up. The demand to act fast and keep it quiet remains central, because real-time synthesis doesn't hold up well to duration or the unexpected.",
        warningSigns: [
          "Unusually short video call, with a pretext for hanging up quickly",
          "Fixed camera, tight framing, little head or hand movement",
          "Anomalies during large movements: face outline, occlusion when a hand passes in front",
          "Mismatch between sound and image, or oddly flat intonation",
          "Refusal to switch to another tool or to call back on a known number",
          "Urgent, confidential financial request made during the call",
        ],
        howToVerify:
          "Don't treat the video call as your proof: treat it as one step. The check that holds is calling back on a number you had before the call, and dual approval for a wire transfer, which doesn't depend on any image. During the call, asking for an unplanned gesture — turning to show a profile, passing a hand in front of the face, picking up an object — puts real-time synthesis under strain, but remains a clue, not proof.",
        whatToDo:
          "Keep dual approval for wire transfers even after a video call: that is precisely the procedure this technique aims to bypass. Agree, in finance teams as well as in families, on a confirmation channel separate from the one the request arrives through.",
        whatToDoIfVictim:
          "Contact the bank immediately to try to recall the funds — timing is the decisive factor. Keep the recording if one exists, the video tool's connection logs, and the meeting invitations, then file a police report. Warn the person whose likeness was used.",
        faq: [
          {
            question: "So does a video call no longer verify an identity?",
            answer:
              "It still has value — persistent refusal remains revealing — but it's no longer enough on its own. The fiches on this site that recommend it now say so: the check that decides is calling back on a number that predates the request, and for a wire transfer, dual approval.",
          },
          {
            question: "How can you put a live synthesis under strain?",
            answer:
              "By asking for the unexpected: a full profile turn, a hand passed in front of the face, an object picked up and shown. These are costly for a real-time synthesis. Treat them as a clue that invites you to verify some other way, never as a decisive test.",
          },
        ],
        whyItWorks:
          "Seeing someone on video used to be the ultimate proof, and many verification procedures stop there. An executive's authority and the confidentiality requested discourage calling anyone to confirm.",
        example: {
          setting: "Video call of a few minutes with the CEO, scheduled at the last minute.",
          message:
            "I'm between two meetings, I can't stay. The acquisition I told you about is being signed today, I need the transfer to go out before 4 pm. It's confidential, don't mention it to the rest of the team. I'll send you the IBAN by message.",
          giveaways: [
            "The call is short and the camera stays fixed.",
            "Confidentiality and urgency prevent dual approval.",
            "The IBAN arrives through another channel, right after the call.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the video call end with an urgent or confidential payment request?",
            then: "Execute nothing: call the person back on the number you already had.",
          },
          {
            check: "Does the person refuse a callback or a different tool?",
            then: "Treat the request as fraudulent and alert your manager or your bank.",
          },
          {
            check: "Have you already made the transfer?",
            then: "Call the bank immediately to request a recall of the funds, then file a police report.",
          },
        ],
        prevention: [
          "Keep dual approval for transfers, even after a video call.",
          "Agree with your team and family on a confirmation channel separate from the one the request came through.",
          "Never treat an image as sufficient proof of identity for a payment.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "AI-000009",
    slug: "detournement-de-photos-par-ia",
    simulationSlug: "message-detient-images-de-vous",
    name: "Détournement de photos par IA",
    categorySlug: "ia-et-contenus-synthetiques",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Des photos ordinaires que vous avez publiées — un portrait, une photo de vacances — transformées sans votre accord en images intimes ou compromettantes. Vous n'avez rien envoyé : elles étaient publiques.",
    attackerObjective: "emprise_sur_une_personne",
    aliases: [
      "images générées non consenties",
      "photos truquées",
      "deepfake intime",
    ],
    primaryVector: "social_media",
    primaryDimension: "deepfake_ai_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Le détournement de photos par IA est la transformation d'images existantes d'une personne, publiquement accessibles, en contenus à caractère intime ou compromettant produits synthétiquement, sans son consentement.",
    howItWorks:
      "La matière première est ce que chacun publie : un portrait de profil suffit. La transformation, elle, ne demande plus de compétence particulière. Ce point est le seul qui compte pour comprendre le changement : la sextorsion supposait auparavant que la victime ait envoyé quelque chose, et la prévention reposait sur cette idée — ne rien envoyer. Ce n'est plus le cas, et il faut le dire clairement, car beaucoup de victimes se croient responsables d'une imprudence qu'elles n'ont pas commise. Les images servent ensuite soit au chantage, soit à la diffusion, avec les mêmes effets qu'un contenu authentique : ce qui atteint la personne n'est pas la véracité de l'image, c'est sa circulation.",
    warningSigns: [
      "Message annonçant détenir des images de vous, accompagné d'un extrait qui vous surprend",
      "Contenus vous représentant signalés par des proches",
      "Compte inconnu ayant récemment récupéré vos photographies publiques",
      "Demande de paiement ou d'images supplémentaires pour empêcher une diffusion",
      "Profils reprenant vos photos dans un contexte que vous n'avez pas choisi",
    ],
    triggers: ["fear", "social_pressure", "urgency"],
    indicators: [],
    howToVerify:
      "Il n'y a rien à vérifier auprès de l'auteur, et engager l'échange fournit des informations supplémentaires. Constatez et conservez : captures horodatées, adresses des pages, identifiants des comptes. Une recherche d'image inversée sur vos propres photos permet de repérer d'autres emplacements de diffusion.",
    whatToDo:
      "Ne payez pas et n'envoyez rien de plus. Signalez aux plateformes en utilisant la procédure dédiée aux contenus intimes non consentis, qui couvre également les contenus fabriqués. Restreignez la visibilité de vos photographies publiques, tout en sachant que cela réduit l'exposition sans l'annuler.",
    whatToDoIfVictim:
      "Déposez plainte : la diffusion de contenus intimes sans consentement est réprimée, y compris lorsque l'image est fabriquée, et vous en êtes la victime. Le 3018 accompagne les victimes de harcèlement en ligne et dispose de contacts directs avec les plateformes pour obtenir des retraits. Vous n'avez commis aucune imprudence : ces images ont été produites à partir de photographies ordinaires, sans que rien ne vous soit demandé.",
    whyItWorks:
      "Voir une image de soi, même fausse, provoque un choc et de la honte, et l'on se croit responsable alors qu'on n'a rien envoyé. Le délai imposé empêche d'en parler à quelqu'un.",
    example: {
      setting: "Message privé reçu d'un compte inconnu, sur un réseau social où votre photo de profil est publique.",
      message:
        "J'ai des photos de toi que tu n'aimerais pas voir circuler. Regarde (aperçu flouté). Envoie 200 € avant demain, sinon je les envoie à tous tes contacts.",
      giveaways: [
        "Vous n'avez jamais envoyé ces images : elles sont fabriquées à partir de vos photos publiques.",
        "Le délai sert à vous empêcher d'en parler.",
        "Payer n'arrêterait pas la demande.",
      ],
    },
    decisionChecklist: [
      {
        check: "Quelqu'un menace-t-il de diffuser des images de vous si vous ne payez pas ?",
        then: "Ne payez pas, n'envoyez rien et ne répondez plus. Gardez la conversation.",
      },
      {
        check: "Avez-vous conservé captures, adresses des pages et identifiants des comptes ?",
        then: "Signalez les contenus aux plateformes avec la procédure dédiée aux contenus intimes non consentis.",
      },
      {
        check: "Les images circulent-elles déjà ?",
        then: "Déposez plainte, et contactez le 3018, qui aide à obtenir des retraits auprès des plateformes.",
      },
    ],
    prevention: [
      "Restreignez la visibilité de vos photos à vos contacts, en sachant que cela réduit le risque sans l'annuler.",
      "Retenez que vous n'avez commis aucune imprudence : la faute est celle de l'auteur.",
      "Convenez avec un proche que vous lui en parleriez tout de suite.",
    ],
    relatedAttackCodes: [
      "PERS-000001",
      "PERS-000003",
      "AI-000001",
      "PERS-000004",
      "DATA-000005",
    ],
    faq: [
      {
        question:
          "Comment est-ce possible si je n'ai jamais envoyé ce genre de photo ?",
        answer:
          "Parce qu'aucun envoi n'est nécessaire : une photographie ordinaire, publique, suffit comme point de départ. C'est le changement essentiel par rapport à la sextorsion classique, et la raison pour laquelle rien de ce qui arrive ici ne relève d'une imprudence de votre part.",
      },
      {
        question:
          "Le fait que l'image soit fausse change-t-il quelque chose au recours ?",
        answer:
          "Le préjudice est réel et la diffusion reste répréhensible : la loi française vise ces contenus, y compris fabriqués. Précisez-le lors du dépôt de plainte et dans les signalements aux plateformes, dont les procédures couvrent explicitement les contenus synthétiques.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "ai-photo-misuse",
        simulationSlug: "message-claiming-images-of-you",
        name: "AI misuse of photos",
        aliases: [
          "non-consensual generated imagery",
          "faked photos",
          "intimate deepfake",
        ],
        plainLanguageDefinition:
          "Ordinary photos you posted — a portrait, a vacation picture — turned without your consent into intimate or compromising images. You never sent anything: they were public.",
        definition:
          "AI misuse of photos is the transformation of existing, publicly accessible images of a person into synthetically produced intimate or compromising content, without their consent.",
        howItWorks:
          "The raw material is what everyone posts: a profile portrait is enough. The transformation itself no longer requires any particular skill. This is the one point that matters for understanding the change: sextortion used to assume the victim had sent something, and prevention rested on that idea — send nothing. That is no longer the case, and it needs to be said plainly, because many victims believe themselves responsible for a carelessness they never committed. The images are then used either for blackmail or for distribution, with the same effects as authentic content: what harms the person isn't whether the image is real, it's its circulation.",
        warningSigns: [
          "Message claiming to hold images of you, accompanied by an excerpt that catches you off guard",
          "Content depicting you flagged by people close to you",
          "Unknown account that has recently gathered your public photos",
          "Demand for payment or more images to prevent distribution",
          "Profiles reusing your photos in a context you didn't choose",
        ],
        howToVerify:
          "There is nothing to verify with the sender, and engaging with them only supplies more information. Document and preserve: time-stamped screenshots, page addresses, account identifiers. A reverse image search on your own photos can help spot other places they've been distributed.",
        whatToDo:
          "Don't pay, and don't send anything more. Report it to the platforms using the procedure dedicated to non-consensual intimate content, which also covers fabricated content. Restrict the visibility of your public photos, while knowing this reduces exposure without eliminating it.",
        whatToDoIfVictim:
          "File a police report: distributing intimate content without consent is a criminal offense, including when the image is fabricated, and you are the victim. A dedicated hotline supports victims of online harassment and has direct contacts with platforms to get content taken down. You did nothing careless: these images were produced from ordinary photographs, without anything being asked of you.",
        faq: [
          {
            question:
              "How is this possible if I never sent that kind of photo?",
            answer:
              "Because no such image needs to be sent: an ordinary, public photograph is enough as a starting point. That is the essential change compared with classic sextortion, and the reason nothing that happens here reflects any carelessness on your part.",
          },
          {
            question:
              "Does the fact that the image is fake change anything about the recourse available?",
            answer:
              "The harm is real and the distribution remains an offense: French law covers this kind of content, including when fabricated. Make this clear when filing a police report and in reports to platforms, whose procedures explicitly cover synthetic content.",
          },
        ],
        whyItWorks:
          "Seeing an image of yourself, even a fake one, causes shock and shame, and you feel responsible although you sent nothing. The deadline imposed keeps you from talking to anyone.",
        example: {
          setting: "Private message from an unknown account, on a social network where your profile photo is public.",
          message:
            "I have photos of you that you wouldn't want going around. Look (blurred preview). Send €200 before tomorrow, or I send them to all your contacts.",
          giveaways: [
            "You never sent these images: they're fabricated from your public photos.",
            "The deadline is there to keep you from talking about it.",
            "Paying wouldn't stop the demand.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is someone threatening to share images of you if you don't pay?",
            then: "Don't pay, send nothing and stop replying. Keep the conversation.",
          },
          {
            check: "Have you saved screenshots, page addresses and account usernames?",
            then: "Report the content to the platforms using the dedicated procedure for non-consensual intimate content.",
          },
          {
            check: "Are the images already circulating?",
            then: "File a police report, and contact the dedicated online harassment helpline (3018 in France), which helps get content taken down by platforms.",
          },
        ],
        prevention: [
          "Limit your photos' visibility to your contacts, knowing this reduces the risk without removing it.",
          "Remember that you did nothing careless: the fault lies with the perpetrator.",
          "Agree with someone close that you would tell them right away.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
];

import type { AttackEntry } from "./types";
import { VERIFIED_REFERENCES as REF } from "./types";

/**
 * Chantage, harcèlement et atteintes à la personne.
 *
 * WRITING RULES SPECIFIC TO THIS FAMILY, beyond the ones in
 * ingenierie-sociale.ts:
 *
 *   * The reader arrives DURING the incident, not before it. Every fiche
 *     leads with what to do now; prevention comes second, and never in a
 *     form that reads as "you should have".
 *   * Nothing here implies the person brought it on themselves. Sending
 *     an image to someone you trusted, accepting a video call, publishing
 *     under your own name — none of that is a mistake, and the fiches say
 *     so where it matters.
 *   * Safety before cleanup. `stalkerware` in particular does NOT open
 *     with "remove it": removal is visible to whoever installed it, and
 *     in a domestic-violence context that can escalate. The fiche says to
 *     get help first.
 *   * Support routes are named because generic advice is useless in an
 *     emergency: 17 (police), 112 (urgences), 3018 (harcèlement en
 *     ligne), 3919 (violences faites aux femmes). Only URLs verified to
 *     exist appear in `references`.
 *
 * These ten should be read by someone who works with victims before they
 * are treated as final. A wrong "what to do next" here can make a
 * situation less safe, which is not true of the other ninety.
 */
export const CHANTAGE_ET_HARCELEMENT: AttackEntry[] = [
  {
    code: "PERS-000001",
    slug: "sextorsion",
    noSimulationReason:
      "La fiche le dit elle-même : la question n'est pas de savoir si les images existent, la réponse est la même dans les deux cas. Mais mettre en scène le moment de décision suppose de représenter une relation qui bascule vers l'intimité avant la menace, ce qu'aucun exercice ne devrait gamifier — surtout sur un site accessible à des mineurs, pour qui la fiche prévoit une marche à suivre spécifique. Réduire le scénario au seul message de menace reçu le rendrait indiscernable de chantage-au-faux-piratage, alors que la gravité et la marche à suivre diffèrent. Même raison que cyberharcèlement et raid de harcèlement : la reconnaissance n'est pas le point difficile ici, et la mise en scène ferait courir un risque sans contrepartie pédagogique.",
    name: "Sextorsion",
    categorySlug: "chantage-et-harcelement",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Quelqu'un affirme détenir des images intimes de vous et menace de les envoyer à vos proches si vous ne payez pas. La menace est réelle dans certains cas, inventée dans beaucoup d'autres — et dans les deux, payer ne met pas fin à la demande.",
    attackerObjective: "argent",
    aliases: [
      "chantage à la webcam",
      "extorsion sexuelle",
      "chantage aux images intimes",
    ],
    primaryVector: "messaging_app",
    primaryDimension: "pressure_and_coercion_resistance",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "La sextorsion est une extorsion fondée sur des contenus à caractère intime : l'auteur menace de les diffuser à l'entourage de la victime — famille, collègues, abonnés — pour obtenir de l'argent, d'autres images, ou la poursuite d'une relation.",
    howItWorks:
      "Le contact s'établit sur un réseau social, une application de rencontre ou un jeu en ligne, avec un profil attrayant et un échange qui devient rapidement intime. L'auteur propose un appel vidéo, l'enregistre, ou obtient des images par la conversation. La bascule est brutale et fait partie du procédé : le ton change en quelques minutes, une liste de contacts extraite du profil public est affichée comme preuve de ce qui peut être fait, et un délai très court est imposé. La rapidité empêche d'en parler à quiconque, et c'est l'isolement qui fait céder, pas la menace elle-même. Le paiement n'arrête rien : il établit que la victime paie, et les demandes reprennent.",
    warningSigns: [
      "Relation en ligne qui devient intime en quelques échanges seulement",
      "Insistance pour passer rapidement à un appel vidéo",
      "Changement de ton immédiat après l'obtention d'images",
      "Liste de vos contacts affichée pour prouver qu'ils peuvent être joints",
      "Délai très court imposé, souvent quelques heures",
      "Demande de paiement en cryptomonnaie ou par cartes prépayées",
    ],
    triggers: ["fear", "urgency", "social_pressure"],
    indicators: [],
    howToVerify:
      "La question n'est pas de savoir si les images existent : la réponse est la même dans les deux cas. Ne cherchez pas à négocier pour le découvrir, car chaque échange fournit des informations supplémentaires. Un compte créé récemment, sans historique et sans relations communes vérifiables, indique un profil fabriqué pour cet usage.",
    whatToDo:
      "Ne payez pas et n'envoyez rien de plus. Cessez de répondre, mais ne supprimez pas la conversation : elle est votre preuve. Faites des captures d'écran du profil, des messages et de l'identifiant du compte, puis bloquez et signalez le compte à la plateforme. Prévenez une personne de confiance — l'isolement est la condition de réussite de ce chantage.",
    whatToDoIfVictim:
      "Déposez plainte : la sextorsion est une infraction pénale, et vous en êtes la victime, pas l'auteur. Les plateformes disposent de procédures de retrait accélérées pour les contenus intimes non consentis ; signalez-y le compte et les contenus. Si la personne visée a moins de 18 ans, la situation est différente et plus grave : les images d'un mineur relèvent d'une infraction spécifique, l'urgence est réelle, et il faut en parler à un adulte immédiatement — un parent, un professeur, un éducateur, n'importe lequel. Le 3018 est joignable pour cela et accompagne aussi bien le jeune que l'adulte qui l'aide. Ne pas oser en parler est ce sur quoi l'auteur compte, et c'est la seule chose qui lui donne du pouvoir. Rien de ce qui s'est passé ne justifie la honte : avoir fait confiance n'est pas une faute.",
    whyItWorks:
      "La bascule est brutale, et la honte isole : l'auteur impose quelques heures pour que la personne n'en parle à personne. Payer paraît être le moyen d'en finir, alors que cela ne fait que relancer la demande.",
    example: {
      setting: "Message reçu juste après un appel vidéo avec une personne rencontrée en ligne quelques jours plus tôt.",
      message:
        "J'ai enregistré notre appel. Voici la liste de tes amis (captures de votre liste de contacts). Envoie 500 € avant ce soir, sinon je leur envoie tout.",
      giveaways: [
        "Le ton change d'un coup, juste après l'appel.",
        "La liste de vos contacts vient de votre profil public.",
        "Le délai très court sert à vous empêcher d'en parler.",
      ],
    },
    decisionChecklist: [
      {
        check: "Avez-vous moins de 18 ans ?",
        then: "Parlez-en tout de suite à un adulte de confiance : un parent, un professeur, un éducateur. Le 3018 vous accompagne, vous et cet adulte.",
      },
      {
        check: "Quelqu'un vous menace-t-il de diffuser des images si vous ne payez pas ?",
        then: "Ne payez pas, n'envoyez rien, ne répondez plus, mais gardez la conversation et faites des captures.",
      },
      {
        check: "Les preuves sont-elles conservées ?",
        then: "Bloquez et signalez le compte, prévenez une personne de confiance et déposez plainte.",
      },
    ],
    prevention: [
      "Méfiez-vous d'une relation en ligne qui devient intime en quelques échanges.",
      "Masquez votre liste de contacts au public.",
      "Retenez que vous n'êtes pas l'auteur : en parler retire son pouvoir au chantage.",
    ],
    relatedAttackCodes: [
      "PERS-000002",
      "PERS-000003",
      "SOCIAL-000004",
      "AI-000009",
    ],
    faq: [
      {
        question: "Faut-il payer pour gagner du temps ?",
        answer:
          "Non. Un paiement démontre que la menace fonctionne et déclenche systématiquement de nouvelles demandes, souvent plus élevées. Le seul geste qui interrompt la mécanique est l'arrêt complet de la communication.",
      },
      {
        question: "J'ai honte d'en parler à la police ou à mes proches.",
        answer:
          "C'est la réaction que l'auteur recherche, et elle est produite délibérément. Les services qui reçoivent ces plaintes y sont formés et en traitent régulièrement. En parler à une seule personne de confiance suffit à briser l'isolement sur lequel repose tout le chantage.",
      },
      {
        question: "Comment savoir si les images existent vraiment ?",
        answer:
          "Vous ne pouvez généralement pas le savoir, et chercher à le vérifier vous engage dans un échange que l'auteur contrôle. La conduite à tenir est identique dans les deux cas : ne pas payer, conserver les preuves, signaler, déposer plainte.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "sextortion",
        name: "Sextortion",
        plainLanguageDefinition:
          "Someone claims to have intimate images of you and threatens to send them to people you know unless you pay. The threat is real in some cases, invented in many others — and in both, paying doesn't end the demand.",
        definition:
          "Sextortion is extortion based on intimate content: the perpetrator threatens to distribute it to the victim's circle — family, colleagues, followers — to obtain money, more images, or a continued relationship.",
        howItWorks:
          "Contact is made on a social network, a dating app, or an online game, with an attractive profile and an exchange that quickly turns intimate. The perpetrator proposes a video call, records it, or obtains images through the conversation. The shift is abrupt and is part of the method: the tone changes within minutes, a contact list pulled from the public profile is shown as proof of what can be done, and a very short deadline is imposed. The speed prevents the victim from telling anyone, and it's the isolation that breaks resistance, not the threat itself. Payment stops nothing: it establishes that the victim pays, and demands resume.",
        warningSigns: [
          "An online relationship that turns intimate after only a few exchanges",
          "Pressure to move quickly to a video call",
          "Immediate change in tone right after images are obtained",
          "A list of your contacts shown as proof they can be reached",
          "A very short deadline imposed, often just a few hours",
          "Payment requested in cryptocurrency or prepaid cards",
        ],
        howToVerify:
          "The question isn't whether the images exist: the answer is the same either way. Don't try to negotiate to find out, because every exchange gives the perpetrator more to work with. An account created recently, with no history and no verifiable mutual connections, indicates a profile built for this purpose.",
        whatToDo:
          "Don't pay and don't send anything more. Stop replying, but don't delete the conversation: it's your evidence. Take screenshots of the profile, the messages, and the account identifier, then block and report the account to the platform. Tell someone you trust — isolation is what makes this blackmail work.",
        whatToDoIfVictim:
          "File a police report: sextortion is a criminal offense, and you are the victim, not the offender. Platforms have accelerated takedown procedures for non-consensual intimate content; report the account and the content there. If the person targeted is under 18, the situation is different and more serious: images of a minor fall under a specific offense, the urgency is real, and it needs to be reported to an adult immediately — a parent, a teacher, an educator, anyone. The dedicated helpline (3018 in France) can be reached for this and supports both the young person and the adult helping them. Not daring to talk about it is exactly what the perpetrator is counting on, and it's the only thing that gives them power. Nothing that happened justifies shame: having trusted someone is not a mistake.",
        faq: [
          {
            question: "Should I pay to buy time?",
            answer:
              "No. A payment proves the threat works and reliably triggers new demands, often larger ones. The only thing that stops the mechanism is a complete halt to communication.",
          },
          {
            question:
              "I'm ashamed to talk about it to the police or to people close to me.",
            answer:
              "That's the exact reaction the perpetrator is aiming for, and it's produced deliberately. The services that receive these reports are trained for this and handle it regularly. Telling just one trusted person is enough to break the isolation the whole scheme depends on.",
          },
          {
            question: "How can I know if the images really exist?",
            answer:
              "You usually can't know, and trying to find out draws you into an exchange the perpetrator controls. The right response is the same either way: don't pay, keep the evidence, report it, file a police report.",
          },
        ],
        whyItWorks:
          "The switch is sudden, and shame isolates: the perpetrator sets a few hours so the person tells no one. Paying seems like the way to end it, but it only restarts the demand.",
        example: {
          setting: "Message received right after a video call with someone met online a few days earlier.",
          message:
            "I recorded our call. Here's your list of friends (screenshots of your contact list). Send €500 before tonight, or I send them everything.",
          giveaways: [
            "The tone changes all at once, right after the call.",
            "Your contact list comes from your public profile.",
            "The very short deadline is there to keep you from talking about it.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are you under 18?",
            then: "Tell a trusted adult right away: a parent, a teacher, a youth worker. The dedicated helpline (3018 in France) supports both you and that adult.",
          },
          {
            check: "Is someone threatening to share images if you don't pay?",
            then: "Don't pay, send nothing, stop replying, but keep the conversation and take screenshots.",
          },
          {
            check: "Is the evidence saved?",
            then: "Block and report the account, tell someone you trust and file a police report.",
          },
        ],
        prevention: [
          "Be wary of an online relationship that becomes intimate within a few messages.",
          "Hide your contact list from the public.",
          "Remember that you are not the one at fault: talking about it takes the blackmail's power away.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "webcam blackmail",
          "sexual extortion",
          "intimate image blackmail",
        ],
      },
    },
  },
  {
    code: "PERS-000002",
    slug: "chantage-au-faux-piratage",
    simulationSlug: "email-chantage-mot-de-passe-ancien",
    name: "Chantage au faux piratage",
    categorySlug: "chantage-et-harcelement",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un email affirme que votre webcam a été piratée et que vous avez été filmé. Il cite parfois un de vos anciens mots de passe pour paraître crédible. Le message ne contient pourtant aucun élément qui vous concerne vraiment : il est envoyé à l'identique à des milliers de destinataires.",
    attackerObjective: "argent",
    aliases: [
      "arnaque au chantage à la webcam",
      "faux chantage",
      "email de chantage",
      "arnaque « j'ai piraté votre ordinateur »",
    ],
    primaryVector: "email",
    primaryDimension: "pressure_and_coercion_resistance",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le chantage au faux piratage est un message d'extorsion envoyé en masse, affirmant qu'un logiciel espion a filmé la victime, et exigeant un paiement pour empêcher une diffusion qui n'a aucun support réel.",
    howItWorks:
      "Le message est identique pour des milliers de destinataires : il ne contient aucun élément qui vous concerne, seulement des affirmations formulées pour paraître personnelles. Sa crédibilité repose sur un seul procédé : citer un mot de passe que vous reconnaissez. Ce mot de passe provient d'une fuite de données d'un service tiers, achetée par lots — il prouve qu'un site a été compromis un jour, pas que votre appareil l'est aujourd'hui. Le reste du message est calibré pour empêcher la vérification : délai court, interdiction d'en parler, affirmation que répondre déclencherait l'envoi. Le paiement est demandé en cryptomonnaie, ce qui permet d'encaisser sans jamais avoir à prouver quoi que ce soit.",
    warningSigns: [
      "Message affirmant détenir un enregistrement, sans jamais en montrer d'extrait",
      "Ancien mot de passe cité comme preuve de compromission",
      "Aucun élément réellement personnel : ni nom d'un proche, ni détail vérifiable",
      "Paiement exigé en cryptomonnaie sous 24 ou 48 heures",
      "Affirmation que le message est indétectable ou que répondre serait détecté",
      "Message reçu depuis votre propre adresse, présenté comme la preuve d'un piratage",
    ],
    triggers: ["fear", "urgency"],
    indicators: [],
    howToVerify:
      "Un maître chanteur qui détient réellement un enregistrement en montre un extrait : c'est ce qui donne du poids à la menace. Un message qui affirme sans jamais montrer n'a rien. Si un mot de passe est cité, notez lequel : c'est une information utile — il faut le changer partout où il sert encore — mais ce n'est pas une preuve d'accès à votre appareil.",
    whatToDo:
      "Ne payez pas, ne répondez pas. Changez le mot de passe cité, ainsi que celui de tout compte où il était réutilisé, et activez la double authentification. Marquez le message comme indésirable et supprimez-le.",
    whatToDoIfVictim:
      "Si un paiement a été effectué, conservez la référence de la transaction et déposez plainte : elle constitue une trace exploitable. Lorsque le message ne contient aucun élément réellement personnel, il n'y a rien à diffuser et un refus de payer reste sans suite. Si en revanche un contenu vous a été montré, ou si vous avez eu un échange intime avec l'expéditeur, la situation relève de la sextorsion et c'est la marche à suivre de cette fiche qui s'applique. Si le doute persiste, faites analyser l'appareil : cela lèvera une inquiétude qui, elle, est bien réelle.",
    whyItWorks:
      "La honte et la peur d'être exposé empêchent d'en parler, donc de vérifier. Un ancien mot de passe exact donne l'illusion que le reste du message est vrai aussi.",
    example: {
      setting: "Email reçu d'une adresse inconnue, avec un ancien mot de passe dans l'objet.",
      message:
        "Je connais ton mot de passe : soleil2016. J'ai piraté ta caméra et enregistré ce que tu faisais. Envoie l'équivalent de 1 200 € en cryptomonnaie sous 48 heures, ou j'envoie la vidéo à tous tes contacts. Ne réponds pas à ce message.",
      giveaways: [
        "Aucun extrait, aucune preuve : seulement des affirmations.",
        "Le mot de passe cité vient d'une ancienne fuite de données.",
        "Rien dans le texte ne vous concerne personnellement.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le message affirme-t-il détenir une vidéo sans en montrer le moindre extrait ?",
        then: "C'est un chantage envoyé en série : ne payez pas, ne répondez pas.",
      },
      {
        check: "Le mot de passe cité sert-il encore quelque part ?",
        then: "Changez-le partout où il sert et activez la double authentification.",
      },
      {
        check: "Vous a-t-on montré un vrai contenu, ou avez-vous eu un échange intime avec l'expéditeur ?",
        then: "La situation relève de la sextorsion : suivez la marche à suivre de cette fiche.",
      },
    ],
    prevention: [
      "Donnez à chaque compte un mot de passe unique : un ancien mot de passe cité ne vous inquiétera plus.",
      "Changez les mots de passe des services dont vous apprenez qu'ils ont subi une fuite.",
      "Parlez de ce type de message autour de vous : en parler lui retire son pouvoir.",
    ],
    relatedAttackCodes: ["PERS-000001", "ACCT-000001", "PERS-000010"],
    faq: [
      {
        question:
          "Le message cite un mot de passe que j'ai réellement utilisé.",
        answer:
          "Il provient d'une fuite de données chez un service que vous utilisiez, revendue par lots. Cela signifie qu'il faut le changer partout où il sert encore — c'est la seule action utile — mais pas que votre webcam ou votre ordinateur ont été compromis.",
      },
      {
        question: "Le message semble venir de ma propre adresse email.",
        answer:
          "L'adresse affichée comme expéditeur est un champ que l'émetteur remplit lui-même : y écrire la vôtre ne demande aucun accès à votre compte. Regardez votre dossier d'envois — le message ne s'y trouve pas, parce qu'il n'en est jamais parti. Ce n'est pas une preuve de piratage, seulement une mise en scène.",
      },
      {
        question: "Faut-il masquer sa webcam ?",
        answer:
          "C'est une précaution simple et sans inconvénient, qui répond à un risque réel mais distinct de celui-ci. Elle ne change rien à ce message précis, qui ne repose sur aucun enregistrement.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "fake-hacking-blackmail",
        simulationSlug: "old-password-blackmail-email",
        name: "Fake hacking blackmail",
        plainLanguageDefinition:
          "An email claims your webcam was hacked and that you were filmed. It sometimes quotes one of your old passwords to seem credible. Yet the message contains nothing that actually identifies you: it's sent unchanged to thousands of recipients.",
        definition:
          "Fake hacking blackmail is a mass-sent extortion message claiming that spyware filmed the victim, demanding payment to prevent a distribution that has no real basis.",
        howItWorks:
          "The message is identical for thousands of recipients: it contains nothing specific to you, only claims worded to sound personal. Its credibility rests on a single trick: quoting a password you recognize. That password comes from a data breach at some other service, bought in bulk — it proves a site was compromised at some point, not that your device is compromised today. The rest of the message is designed to prevent verification: a short deadline, an instruction not to tell anyone, a claim that replying would trigger the send. Payment is demanded in cryptocurrency, letting the sender collect without ever having to prove anything.",
        warningSigns: [
          "A message claiming to hold a recording, without ever showing an excerpt",
          "An old password quoted as proof of compromise",
          "Nothing genuinely personal: no name of someone close to you, no verifiable detail",
          "Payment demanded in cryptocurrency within 24 or 48 hours",
          "A claim that the message is undetectable or that replying would be detected",
          "A message that appears to come from your own address, presented as proof of a hack",
        ],
        howToVerify:
          "A blackmailer who genuinely holds a recording shows an excerpt of it: that's what gives the threat weight. A message that claims without ever showing has nothing. If a password is quoted, note which one: that's useful information — it should be changed everywhere it's still used — but it isn't proof of access to your device.",
        whatToDo:
          "Don't pay, don't reply. Change the quoted password, along with any account where it was reused, and enable two-factor authentication. Mark the message as spam and delete it.",
        whatToDoIfVictim:
          "If a payment was made, keep the transaction reference and file a police report: it's usable evidence. When the message contains nothing genuinely personal, there is nothing to distribute, and refusing to pay carries no consequence. If, on the other hand, content was actually shown to you, or you had an intimate exchange with the sender, the situation is sextortion and that fiche's guidance applies instead. If doubt remains, have the device checked: that will settle a concern that is, this time, real.",
        faq: [
          {
            question: "The message quotes a password I actually used.",
            answer:
              "It comes from a data breach at a service you used, resold in bulk. That means it should be changed everywhere it's still used — that's the only useful action — but it doesn't mean your webcam or computer were compromised.",
          },
          {
            question: "The message appears to come from my own email address.",
            answer:
              "The displayed sender address is a field the sender fills in themselves: writing yours there requires no access to your account. Check your sent folder — the message isn't there, because it never left from it. That isn't proof of hacking, only staging.",
          },
          {
            question: "Should I cover my webcam?",
            answer:
              "It's a simple precaution with no downside, addressing a real but separate risk. It changes nothing about this particular message, which is based on no actual recording.",
          },
        ],
        whyItWorks:
          "Shame and fear of exposure keep people from talking about it, and so from checking. An accurate old password creates the illusion that the rest of the message is true as well.",
        example: {
          setting: "Email from an unknown address, with an old password in the subject line.",
          message:
            "I know your password: soleil2016. I hacked your camera and recorded what you were doing. Send the equivalent of €1,200 in cryptocurrency within 48 hours, or I'll send the video to all your contacts. Don't reply to this message.",
          giveaways: [
            "No excerpt, no proof: only claims.",
            "The password quoted comes from an old data breach.",
            "Nothing in the text is actually about you personally.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the message claim to hold a video without showing the slightest excerpt?",
            then: "It's blackmail sent in bulk: don't pay, don't reply.",
          },
          {
            check: "Is the quoted password still used anywhere?",
            then: "Change it wherever it's used and turn on two-factor authentication.",
          },
          {
            check: "Were you shown real content, or did you have an intimate exchange with the sender?",
            then: "This is sextortion: follow the steps on that page.",
          },
        ],
        prevention: [
          "Give each account a unique password: an old password quoted at you will no longer worry you.",
          "Change the passwords of services you learn have suffered a breach.",
          "Talk about this kind of message with people around you: talking about it takes away its power.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "webcam blackmail scam",
          "fake blackmail",
          "blackmail email",
          "\"I hacked your computer\" scam",
        ],
      },
    },
  },
  {
    code: "PERS-000003",
    slug: "diffusion-non-consentie-d-images",
    noSimulationReason:
      "Rien à reconnaître : la victime sait ce qui se passe. Un scénario n'apporterait rien et exposerait un lecteur concerné à une reconstitution inutile.",
    name: "Diffusion non consentie d'images intimes",
    categorySlug: "chantage-et-harcelement",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Des images intimes que vous aviez confiées à quelqu'un sont publiées ou envoyées sans votre accord. Il n'y a pas de demande d'argent : l'objectif est de nuire. C'est une infraction pénale, et vous en êtes la victime.",
    attackerObjective: "emprise_sur_une_personne",
    aliases: [
      "revenge porn",
      "vengeance pornographique",
      "publication d'images intimes sans consentement",
    ],
    primaryVector: "social_media",
    primaryDimension: "pressure_and_coercion_resistance",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "La diffusion non consentie d'images intimes est la publication ou la transmission, sans l'accord de la personne concernée, de contenus à caractère sexuel la représentant, généralement obtenus dans le cadre d'une relation de confiance.",
    howItWorks:
      "Ce qui distingue cette atteinte des autres pages de ce site est qu'elle ne suppose aucune compromission technique : les images ont été partagées volontairement, dans une relation, et c'est cette confiance qui est retournée. La diffusion intervient le plus souvent après une rupture, et vise l'entourage réel — famille, employeur, cercle amical — parce que c'est là que le préjudice est maximal. La rapidité de propagation en fait une urgence : chaque heure augmente le nombre de copies, et le retrait devient d'autant plus difficile. Une variante consiste à diffuser des images fabriquées à partir de photographies publiques, avec le même effet sur la personne visée.",
    warningSigns: [
      "Menaces de diffusion formulées pendant ou après une rupture",
      "Demandes répétées de nouvelles images sous prétexte de preuve d'amour",
      "Découverte de contenus vous concernant sur un site, un forum ou un groupe",
      "Contacts inhabituels de proches évoquant des contenus vous représentant",
      "Création de comptes reprenant votre nom pour diffuser ces contenus",
    ],
    triggers: ["social_pressure", "fear"],
    indicators: [],
    howToVerify:
      "Avant toute suppression, constatez et conservez : captures d'écran horodatées, adresses des pages, identifiants des comptes diffuseurs. Supprimer sans conserver prive la plainte de ses éléments les plus utiles. Une recherche de vos photographies sur un moteur de recherche d'images permet d'identifier les autres emplacements de diffusion.",
    whatToDo:
      "Agissez vite et sur deux fronts en parallèle : signalez à chaque plateforme en utilisant la procédure dédiée aux contenus intimes non consentis, qui est traitée en priorité, et déposez plainte. Ne contactez pas la personne à l'origine de la diffusion : cela n'obtient pas le retrait et nuit à la procédure.",
    whatToDoIfVictim:
      "Déposez plainte : la diffusion d'images intimes sans consentement est pénalement réprimée en France, y compris entre anciens partenaires. Le 3018 accompagne les victimes de harcèlement en ligne, y compris pour obtenir des retraits accélérés auprès des plateformes. Faites-vous accompagner — par un proche, une association, un avocat : les démarches sont longues et il n'y a aucune raison de les mener seul. Avoir fait confiance à un partenaire n'est pas une faute, et aucune procédure ne vous le reprochera.",
    whyItWorks:
      "Les images avaient été confiées dans une relation, et c'est cette confiance que l'auteur retourne. La honte pousse à se taire, alors que chaque heure compte pour limiter les copies.",
    example: {
      setting: "Message d'une amie, tard le soir.",
      message:
        "Je préfère te prévenir : quelqu'un a partagé des photos de toi dans un groupe de discussion. Je n'ai rien relayé. Tu veux que je t'envoie le nom du groupe pour que tu puisses le signaler ?",
      giveaways: [
        "La diffusion vise votre entourage réel : c'est là que l'auteur veut nuire.",
        "Le temps joue : plus tôt le signalement, moins de copies.",
        "Vous êtes la victime, pas l'auteur.",
      ],
    },
    decisionChecklist: [
      {
        check: "Des images intimes de vous circulent-elles sans votre accord ?",
        then: "Faites des captures horodatées et notez les adresses avant toute demande de suppression.",
      },
      {
        check: "Les preuves sont-elles conservées ?",
        then: "Signalez à chaque plateforme avec la procédure dédiée aux contenus intimes non consentis, et déposez plainte en parallèle.",
      },
      {
        check: "Êtes-vous tenté de contacter la personne à l'origine de la diffusion ?",
        then: "Ne le faites pas : cela n'obtient pas le retrait. Appuyez-vous sur le 3018 et sur un proche.",
      },
    ],
    prevention: [
      "Retenez qu'avoir fait confiance n'est pas une faute.",
      "Si des menaces de diffusion apparaissent pendant ou après une rupture, conservez-les dès maintenant.",
      "Désignez à l'avance une personne de confiance à qui en parler.",
    ],
    relatedAttackCodes: [
      "PERS-000001",
      "PERS-000006",
      "PERS-000004",
      "AI-000009",
    ],
    faq: [
      {
        question:
          "J'ai envoyé ces images volontairement. Cela m'est-il opposable ?",
        answer:
          "Non. Le consentement à partager une image avec une personne n'est pas un consentement à sa diffusion. C'est précisément ce que la loi distingue, et l'infraction porte sur la diffusion, pas sur l'existence de l'image.",
      },
      {
        question: "Le contenu réapparaît après chaque suppression.",
        answer:
          "C'est fréquent et cela n'annule pas l'intérêt des signalements : chaque retrait réduit la diffusion, et les plateformes disposent d'empreintes numériques permettant de bloquer les remises en ligne d'un même fichier. Continuez à signaler, et documentez chaque réapparition pour la procédure en cours.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "non-consensual-intimate-image-sharing",
        name: "Non-consensual sharing of intimate images",
        plainLanguageDefinition:
          "Intimate images you had entrusted to someone are published or sent without your consent. There's no demand for money: the goal is to harm. It's a criminal offense, and you are the victim.",
        definition:
          "Non-consensual sharing of intimate images is the publication or transmission, without the consent of the person concerned, of sexual content depicting them, generally obtained within a relationship of trust.",
        howItWorks:
          "What sets this apart from other pages on this site is that it involves no technical compromise: the images were shared willingly, within a relationship, and it's that trust that gets turned against the person. The sharing most often happens after a breakup, and targets the person's real circle — family, employer, friends — because that's where the harm is greatest. The speed of spread makes it an emergency: every hour increases the number of copies, and removal becomes harder as a result. One variant distributes images fabricated from public photographs, with the same effect on the person targeted.",
        warningSigns: [
          "Threats of distribution made during or after a breakup",
          "Repeated requests for new images under the guise of proving love",
          "Discovering content about you on a site, a forum, or a group",
          "Unusual contact from people you know mentioning content depicting you",
          "Creation of accounts using your name to distribute this content",
        ],
        howToVerify:
          "Before deleting anything, record and preserve: timestamped screenshots, page addresses, the identifiers of the accounts distributing the content. Deleting without preserving deprives a police report of its most useful evidence. A reverse image search of your photographs can help identify other places the content has spread to.",
        whatToDo:
          "Act quickly on two fronts in parallel: report to each platform using the dedicated procedure for non-consensual intimate content, which is handled as a priority, and file a police report. Don't contact the person behind the distribution: it doesn't get the content removed and it can harm the case.",
        whatToDoIfVictim:
          "File a police report: distributing intimate images without consent is a criminal offense in France, including between former partners. The dedicated helpline (3018 in France) supports victims of online harassment, including in obtaining accelerated removal from platforms. Get support — from someone close to you, an association, a lawyer: the process is long and there's no reason to go through it alone. Having trusted a partner is not a mistake, and no procedure will hold it against you.",
        faq: [
          {
            question:
              "I sent these images willingly. Does that count against me?",
            answer:
              "No. Consenting to share an image with a person is not consent to its distribution. That is exactly the distinction the law draws, and the offense concerns the distribution, not the existence of the image.",
          },
          {
            question: "The content keeps coming back after every removal.",
            answer:
              "This is common and it doesn't make reporting pointless: each takedown reduces the spread, and platforms use digital fingerprints to block a given file from being reuploaded. Keep reporting, and document each reappearance for the ongoing case.",
          },
        ],
        whyItWorks:
          "The images were shared within a relationship, and that trust is what the perpetrator turns around. Shame pushes people into silence, while every hour counts to limit the copies.",
        example: {
          setting: "Message from a friend, late in the evening.",
          message:
            "I'd rather tell you: someone shared photos of you in a group chat. I didn't pass anything on. Do you want me to send you the group's name so you can report it?",
          giveaways: [
            "The sharing targets the people in your real life: that's where the perpetrator wants to cause harm.",
            "Time matters: the sooner it's reported, the fewer copies.",
            "You are the victim, not the one at fault.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are intimate images of you circulating without your consent?",
            then: "Take time-stamped screenshots and note the addresses before any removal request.",
          },
          {
            check: "Is the evidence saved?",
            then: "Report to each platform using the dedicated procedure for non-consensual intimate content, and file a police report at the same time.",
          },
          {
            check: "Are you tempted to contact the person who shared them?",
            then: "Don't: it won't get them taken down. Lean on the dedicated online harassment helpline (3018 in France) and on someone close.",
          },
        ],
        prevention: [
          "Remember that having trusted someone is not a fault.",
          "If threats to share images appear during or after a breakup, save them now.",
          "Choose in advance someone you trust to talk to.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "revenge porn",
          "non-consensual pornography",
          "non-consensual publication of intimate images",
        ],
      },
    },
  },
  {
    code: "PERS-000004",
    slug: "doxxing",
    noSimulationReason:
      "Le rassemblement d'informations publiques ne produit aucun signal préalable. Ce qui se prépare en amont est la réduction de ce qui est exposé, traitée par le guide correspondant.",
    name: "Doxxing",
    categorySlug: "chantage-et-harcelement",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Quelqu'un rassemble et publie vos informations personnelles — adresse, employeur, téléphone, école des enfants — pour que d'autres s'en servent contre vous. Chaque élément était accessible ; c'est leur réunion qui est l'attaque.",
    attackerObjective: "emprise_sur_une_personne",
    aliases: [
      "divulgation de données personnelles",
      "doxing",
      "mise à nu numérique",
    ],
    primaryVector: "social_media",
    primaryDimension: "pressure_and_coercion_resistance",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le doxxing est la collecte puis la publication d'informations permettant d'identifier ou de localiser une personne dans le monde réel, dans le but de l'exposer à des représailles, du harcèlement ou une intrusion physique.",
    howItWorks:
      "Aucune information n'est volée : elles sont recoupées. Un pseudonyme réutilisé sur deux sites, une photographie dont l'arrière-plan situe un quartier, un avis laissé sur un commerce, un profil professionnel, un registre public d'entreprise, une ancienne annonce — pris isolément, ces éléments ne disent rien. Assemblés, ils donnent un nom, une adresse et des habitudes. La publication de cet ensemble est le point de bascule : elle transforme une exposition dispersée en cible, et délègue l'action à d'autres, ce qui rend l'auteur initial difficile à mettre en cause. Le doxxing précède fréquemment un raid de harcèlement ou un signalement malveillant aux secours.",
    warningSigns: [
      "Questions insistantes sur votre lieu de vie, votre employeur ou vos horaires",
      "Apparition de vos informations personnelles dans un fil de discussion ou un forum",
      "Appels, courriers ou livraisons non sollicités à votre domicile",
      "Contacts de personnes inconnues évoquant des détails privés exacts",
      "Anciens pseudonymes ou comptes oubliés cités publiquement",
    ],
    triggers: ["fear", "social_pressure"],
    indicators: [],
    howToVerify:
      "Recherchez votre nom, vos pseudonymes et votre numéro de téléphone comme le ferait un tiers, y compris en recherche d'images. Ce que vous trouvez est ce dont dispose l'attaquant. Vérifiez en particulier les comptes anciens, les registres publics liés à une activité professionnelle, et les photographies dont l'arrière-plan est identifiable.",
    whatToDo:
      "Conservez les preuves avant tout signalement, puis demandez le retrait auprès de chaque plateforme et, le cas échéant, le déréférencement auprès des moteurs de recherche. Prévenez les personnes citées avec vous, en particulier si des enfants sont concernés. Si une menace physique est formulée, le dépôt de plainte devient prioritaire sur le retrait.",
    whatToDoIfVictim:
      "Déposez plainte, en apportant l'ensemble des captures : la loi française réprime la diffusion d'informations permettant d'identifier ou de localiser une personne dans le but de l'exposer à un danger. Prévenez votre employeur ou votre établissement si l'adresse professionnelle a été diffusée. Renforcez la double authentification sur vos comptes, car les informations publiées servent souvent à répondre aux questions de récupération. En cas de menace directe, composez le 17.",
    whyItWorks:
      "Chaque information était publique et paraissait sans risque : c'est leur réunion qui crée le danger. L'auteur publie puis laisse d'autres agir, ce qui le rend difficile à mettre en cause.",
    example: {
      setting: "Publication repérée par un ami sur un forum où vous êtes critiqué.",
      message:
        "Pour ceux qui veulent lui dire ce qu'ils pensent en face : il travaille chez [employeur], quartier [quartier], et voici sa photo devant chez lui.",
      giveaways: [
        "Vos informations sont rassemblées pour que d'autres s'en servent.",
        "L'appel à agir vient d'ailleurs que de l'auteur.",
        "Une photo publique a permis de situer votre domicile.",
      ],
    },
    decisionChecklist: [
      {
        check: "Vos informations personnelles sont-elles publiées dans un contexte hostile ?",
        then: "Faites des captures de chaque publication, puis demandez leur retrait aux plateformes.",
      },
      {
        check: "Une menace physique est-elle formulée ?",
        then: "Déposez plainte en priorité. En cas de menace directe, composez le 17.",
      },
      {
        check: "D'autres personnes sont-elles citées avec vous, en particulier des enfants ?",
        then: "Prévenez-les, ainsi que votre employeur ou l'établissement concerné.",
      },
    ],
    prevention: [
      "Cherchez votre nom, vos pseudonymes et votre numéro comme le ferait un inconnu.",
      "Évitez de réutiliser le même pseudonyme partout.",
      "Regardez ce que montrent vos photos en arrière-plan avant de les publier.",
    ],
    relatedAttackCodes: [
      "PERS-000003",
      "PERS-000006",
      "PERS-000008",
      "PERS-000009",
      "AI-000009",
      "DATA-000003",
      "DATA-000005",
    ],
    faq: [
      {
        question:
          "Ces informations étaient publiques. S'agit-il vraiment d'une infraction ?",
        answer:
          "Oui. Ce qui est en cause n'est pas l'accessibilité de chaque élément mais leur rassemblement et leur publication dans le but d'exposer une personne. Le droit français vise cette mise à disposition malveillante, indépendamment de l'origine des données.",
      },
      {
        question: "Comment limiter ce qui est trouvable sur moi ?",
        answer:
          "Séparez les pseudonymes entre les usages, retirez les anciens comptes inutilisés, vérifiez les métadonnées et l'arrière-plan des photographies publiées, et exercez votre droit d'opposition auprès des annuaires et agrégateurs. Cela réduit la surface sans jamais l'annuler : l'absence totale n'est pas un objectif atteignable.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "doxxing",
        name: "Doxxing",
        plainLanguageDefinition:
          "Someone gathers and publishes your personal information — address, employer, phone number, your children's school — so that others can use it against you. Each piece was accessible on its own; it's their being brought together that is the attack.",
        definition:
          "Doxxing is the collection and publication of information that identifies or locates a person in the real world, aimed at exposing them to retaliation, harassment, or physical intrusion.",
        howItWorks:
          "No information is stolen: it's cross-referenced. A username reused across two sites, a photograph whose background places a neighborhood, a review left on a business, a professional profile, a public business registry, an old listing — taken individually, these elements say nothing. Put together, they give a name, an address, and habits. Publishing that combination is the turning point: it turns scattered exposure into a target, and hands off the action to others, which makes the original author hard to hold accountable. Doxxing frequently precedes a harassment raid or a malicious report to emergency services.",
        warningSigns: [
          "Persistent questions about where you live, your employer, or your schedule",
          "Your personal information appearing in a discussion thread or a forum",
          "Unsolicited calls, mail, or deliveries at your home",
          "Contact from strangers mentioning accurate private details",
          "Old usernames or forgotten accounts named publicly",
        ],
        howToVerify:
          "Search your name, your usernames, and your phone number the way a third party would, including a reverse image search. What you find is what the attacker has. Check in particular old accounts, public registries tied to a professional activity, and photographs with an identifiable background.",
        whatToDo:
          "Preserve the evidence before reporting anything, then request removal from each platform and, where relevant, delisting from search engines. Warn anyone named alongside you, especially if children are involved. If a physical threat is made, filing a police report takes priority over removal.",
        whatToDoIfVictim:
          "File a police report, bringing all the screenshots: French law punishes sharing information that identifies or locates a person in order to expose them to danger. Notify your employer or institution if a work address was published. Strengthen two-factor authentication on your accounts, since published information is often used to answer account-recovery security questions. In case of a direct threat, call emergency services (17 in France).",
        faq: [
          {
            question:
              "This information was already public. Is this really an offense?",
            answer:
              "Yes. What's at issue is not the accessibility of each individual piece but their being gathered and published with the intent to expose a person. French law targets this malicious compilation, regardless of where the data came from.",
          },
          {
            question: "How can I limit what can be found about me?",
            answer:
              "Keep usernames separate between uses, remove old unused accounts, check the metadata and background of published photographs, and exercise your right to object with directories and data aggregators. This reduces the exposure without ever eliminating it: total absence isn't an achievable goal.",
          },
        ],
        whyItWorks:
          "Each piece of information was public and seemed harmless: it's putting them together that creates the danger. The perpetrator publishes and then lets others act, which makes them hard to hold responsible.",
        example: {
          setting: "Post spotted by a friend on a forum where you're being criticized.",
          message:
            "For anyone who wants to tell him what they think to his face: he works at [employer], in [neighborhood], and here's a photo of him outside his home.",
          giveaways: [
            "Your information is gathered so that others can use it.",
            "The call to action comes from someone other than the author.",
            "A public photo made it possible to locate your home.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is your personal information published in a hostile context?",
            then: "Take screenshots of each post, then ask the platforms to remove them.",
          },
          {
            check: "Is a physical threat being made?",
            then: "File a police report as a priority. In case of a direct threat, call emergency services (17 in France).",
          },
          {
            check: "Are other people named alongside you, especially children?",
            then: "Warn them, as well as your employer or the school concerned.",
          },
        ],
        prevention: [
          "Search for your name, usernames and phone number the way a stranger would.",
          "Avoid reusing the same username everywhere.",
          "Check what your photos show in the background before posting them.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "disclosure of personal data",
          "doxing",
          "digital exposure",
        ],
      },
    },
  },
  {
    code: "PERS-000005",
    slug: "stalkerware",
    noSimulationReason:
      "La fiche demande de ne rien manipuler sur l'appareil surveillé avant d'avoir lu la marche à suivre. Un exercice interactif entrerait en contradiction directe avec cette consigne.",
    name: "Stalkerware (logiciel de surveillance par un proche)",
    categorySlug: "chantage-et-harcelement",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une application installée sur votre téléphone par quelqu'un de votre entourage, qui transmet vos messages, votre position et vos appels. Si vous êtes dans une situation de violence, ne la supprimez pas tout de suite : sa disparition se voit, et cherchez d'abord de l'aide.",
    attackerObjective: "emprise_sur_une_personne",
    aliases: [
      "logiciel de surveillance conjugale",
      "application espionne",
      "spouseware",
      "surveillance par un proche",
    ],
    primaryVector: "web",
    primaryDimension: "account_security_awareness",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le stalkerware désigne les applications de surveillance installées sur l'appareil d'une personne par un proche disposant d'un accès physique — conjoint, ex-conjoint, parent — afin de suivre ses communications, sa position et son activité à son insu.",
    howItWorks:
      "Techniquement, ces applications font ce que font d'autres logiciels espions ; ce qui les distingue est le contexte. L'installation ne suppose ni faille ni piège : elle suppose quelques minutes seules avec l'appareil déverrouillé, ce dont dispose une personne vivant avec la victime. Le code d'accès est souvent connu, et l'installation peut être présentée comme un service — une application de localisation familiale, une sauvegarde. L'application se dissimule ensuite sous un nom anodin ou disparaît de l'écran d'accueil. La surveillance porte sur les messages, la position, l'historique d'appels, parfois le micro. Un second dispositif, plus simple et plus courant, produit le même effet sans aucune installation : le partage de position resté actif, ou un compte connecté sur un appareil que la personne conserve.",
    warningSigns: [
      "Batterie qui se décharge nettement plus vite sans changement d'usage",
      "Appareil tiède ou actif alors qu'il n'est pas utilisé",
      "Un proche connaît des déplacements ou des échanges que vous ne lui avez pas rapportés",
      "Application inconnue dans la liste complète des applications installées",
      "Autorisations d'accessibilité, de localisation ou d'administrateur accordées à une application que vous ne reconnaissez pas",
      "Partage de position actif vers un compte que vous n'avez pas choisi",
    ],
    triggers: ["trust", "fear"],
    indicators: [],
    howToVerify:
      "Avant tout : ne faites pas ces recherches depuis l'appareil que vous soupçonnez. Consulter cette page, chercher « stalkerware » ou ouvrir les paramètres de sécurité y est visible par la personne qui surveille, au même titre que le reste. Utilisez un autre appareil — celui d'une personne de confiance, un poste en bibliothèque. Depuis cet appareil sûr, vous pourrez ensuite examiner la liste complète des applications installées et non le seul écran d'accueil, les autorisations d'accessibilité, de localisation et d'administration, les partages de position actifs, et les appareils connectés à vos comptes.",
    whatToDo:
      "Si vous vous sentez en danger, ne supprimez rien immédiatement. La disparition d'une surveillance est visible par la personne qui l'a mise en place, et cette découverte est un moment où le risque augmente. Cherchez d'abord un appui : le 3919 pour les violences faites aux femmes, une association d'aide aux victimes, ou un professionnel de confiance — et si possible depuis un autre appareil que celui que vous soupçonnez. Le retrait vient ensuite, dans un cadre préparé.",
    whatToDoIfVictim:
      "Utilisez un appareil sûr — celui d'une personne de confiance, ou un poste public — pour changer les mots de passe de vos comptes essentiels et retirer les appareils connectés. Conservez les traces avant tout nettoyage : elles servent à la procédure. La surveillance d'un conjoint sans son consentement est une infraction pénale ; un dépôt de plainte est possible et l'accompagnement par une association facilite les démarches. En cas de danger immédiat, composez le 17, ou envoyez un SMS au 114 si vous ne pouvez pas parler.",
    whyItWorks:
      "L'installation demande seulement quelques minutes avec le téléphone déverrouillé, ce dont dispose une personne proche. Elle est parfois présentée comme un service, et la surveillance se fond ensuite dans la relation.",
    example: {
      setting: "Remarque de votre conjoint, un soir.",
      message:
        "Alors, c'était bien ce café avec Sarah, cet après-midi ? Tu ne m'en avais pas parlé.",
      giveaways: [
        "Vous n'aviez parlé de ce rendez-vous à personne.",
        "La personne connaît vos déplacements ou vos échanges sans que vous les ayez rapportés.",
        "Elle a eu accès à votre téléphone déverrouillé.",
      ],
    },
    decisionChecklist: [
      {
        check: "Vous sentez-vous en danger ?",
        then: "Ne supprimez rien et ne cherchez rien depuis ce téléphone. Depuis un autre appareil, contactez le 3919 ou une association. En cas de danger immédiat : le 17, ou un SMS au 114 si vous ne pouvez pas parler.",
      },
      {
        check: "Disposez-vous d'un appareil sûr, celui d'une personne de confiance ou un poste public ?",
        then: "Depuis cet appareil, vérifiez les appareils connectés à vos comptes et les partages de position.",
      },
      {
        check: "Le retrait de la surveillance a-t-il été préparé avec un appui ?",
        then: "Conservez d'abord les traces, puis changez les mots de passe depuis l'appareil sûr.",
      },
    ],
    prevention: [
      "Gardez pour vous le code de déverrouillage de votre téléphone, si vous pouvez le faire sans risque.",
      "Relisez de temps en temps les partages de position et les appareils connectés à vos comptes.",
      "Notez quelque part, hors du téléphone, les numéros d'aide : le 3919, le 17, le 114.",
    ],
    relatedAttackCodes: [
      "PERS-000006",
      "ACCT-000003",
      "ACCT-000002",
      "MOB-000008",
      "MAL-000003",
      "MAL-000004",
    ],
    faq: [
      {
        question: "Pourquoi ne pas désinstaller l'application tout de suite ?",
        answer:
          "Parce que la personne qui l'a installée verra la surveillance s'interrompre, et que ce moment est celui où les situations de violence s'aggravent le plus souvent. Ce n'est pas une raison de ne rien faire : c'est une raison de faire les choses dans l'ordre, en cherchant un appui d'abord.",
      },
      {
        question: "Une réinitialisation de l'appareil suffit-elle ?",
        answer:
          "Elle retire l'application, mais pas nécessairement l'accès : si vos comptes sont connectés sur un autre appareil, ou si vos mots de passe sont connus, la surveillance reprend autrement. Changez les mots de passe depuis un appareil sûr et retirez les appareils connectés à chaque compte.",
      },
      {
        question:
          "Est-ce légal d'installer cela sur le téléphone de son conjoint ?",
        answer:
          "Non. Surveiller les communications d'une personne majeure sans son consentement est pénalement réprimé, y compris au sein d'un couple, et le fait de vivre ensemble n'y change rien.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "stalkerware",
        name: "Stalkerware (surveillance by someone close to you)",
        plainLanguageDefinition:
          "An app installed on your phone by someone close to you, which forwards your messages, your location, and your calls. If you're in a situation involving abuse, don't remove it right away: its disappearance is noticeable, and get help first.",
        definition:
          "Stalkerware refers to surveillance apps installed on a person's device by someone close to them with physical access — a spouse, ex-spouse, or parent — to track their communications, location, and activity without their knowledge.",
        howItWorks:
          "Technically, these apps do what other spyware does; what sets them apart is the context. Installing them requires no vulnerability and no trick: it requires a few minutes alone with the unlocked device, which someone living with the victim has. The passcode is often known, and the install can be presented as a service — a family locator app, a backup. The app then hides under an innocuous name or disappears from the home screen. Surveillance covers messages, location, call history, sometimes the microphone. A second, simpler and more common setup produces the same effect with no installation at all: location sharing left switched on, or an account still signed in on a device the person keeps.",
        warningSigns: [
          "Battery draining noticeably faster with no change in use",
          "Device warm or active while not being used",
          "Someone close to you knows about trips or conversations you never told them about",
          "An unfamiliar app in the full list of installed apps",
          "Accessibility, location, or device-administrator permissions granted to an app you don't recognize",
          "Location sharing active to an account you didn't choose",
        ],
        howToVerify:
          "First and foremost: don't do this research from the device you suspect. Viewing this page, searching \"stalkerware\", or opening security settings is visible to the person doing the surveillance, just like everything else. Use a different device — one belonging to someone you trust, a library computer. From that safe device, you can then check the full list of installed apps, not just the home screen, the accessibility, location, and administrator permissions, active location sharing, and the devices connected to your accounts.",
        whatToDo:
          "If you feel unsafe, don't remove anything immediately. A surveillance tool disappearing is noticeable to the person who set it up, and that discovery is a moment when risk increases. Look for support first: the dedicated helpline for violence against women (3919 in France), a victim support association, or a trusted professional — and if possible from a device other than the one you suspect. Removal comes next, within a prepared plan.",
        whatToDoIfVictim:
          "Use a safe device — one belonging to someone you trust, or a public computer — to change the passwords of your essential accounts and remove connected devices. Preserve evidence before any cleanup: it's useful for a case. Surveilling a spouse without their consent is a criminal offense; filing a police report is possible, and support from an association makes the process easier. In case of immediate danger, call emergency services (17 in France), or text 114 if you can't speak.",
        faq: [
          {
            question: "Why not uninstall the app right away?",
            answer:
              "Because the person who installed it will see the surveillance stop, and that moment is when situations of abuse most often escalate. This isn't a reason to do nothing: it's a reason to do things in order, seeking support first.",
          },
          {
            question: "Is resetting the device enough?",
            answer:
              "It removes the app, but not necessarily the access: if your accounts are signed in on another device, or if your passwords are known, surveillance can resume another way. Change passwords from a safe device and remove connected devices from each account.",
          },
          {
            question:
              "Is it legal to install this on a spouse's phone?",
            answer:
              "No. Surveilling an adult's communications without their consent is a criminal offense, including within a couple, and living together doesn't change that.",
          },
        ],
        whyItWorks:
          "Installing it takes only a few minutes with the phone unlocked, which someone close to you has. It's sometimes presented as a service, and the surveillance then blends into the relationship.",
        example: {
          setting: "A remark from your partner, one evening.",
          message:
            "So, was it nice, that coffee with Sarah this afternoon? You didn't mention it to me.",
          giveaways: [
            "You hadn't told anyone about that meeting.",
            "The person knows your movements or conversations without your having told them.",
            "They've had access to your unlocked phone.",
          ],
        },
        decisionChecklist: [
          {
            check: "Do you feel in danger?",
            then: "Don't delete or search for anything from this phone. From another device, contact the helpline for violence against women (3919 in France) or a support association. In immediate danger: emergency services (17 in France), or text 114 if you can't speak.",
          },
          {
            check: "Do you have access to a safe device, belonging to someone you trust or a public computer?",
            then: "From that device, check the devices connected to your accounts and any location sharing.",
          },
          {
            check: "Has removing the surveillance been planned with support?",
            then: "Preserve the evidence first, then change your passwords from the safe device.",
          },
        ],
        prevention: [
          "Keep your phone's unlock code to yourself, if you can do so safely.",
          "Review location sharing and the devices connected to your accounts from time to time.",
          "Write down the help numbers somewhere other than the phone: in France, 3919, 17 and 114.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "spousal surveillance software",
          "spy app",
          "spouseware",
          "surveillance by a partner",
        ],
      },
    },
  },
  {
    code: "PERS-000006",
    slug: "cyberharcelement",
    noSimulationReason:
      "Mettre un visiteur en situation de harcèlement simulé peut réactiver un vécu, pour un bénéfice pédagogique nul : la difficulté n'est pas de reconnaître les faits, elle est de savoir quoi faire ensuite.",
    name: "Cyberharcèlement",
    categorySlug: "chantage-et-harcelement",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Des messages, commentaires ou publications hostiles répétés, venant d'une ou plusieurs personnes, qui finissent par occuper votre quotidien. Ce n'est pas une question de sensibilité : la répétition est précisément ce qui constitue l'infraction.",
    attackerObjective: "emprise_sur_une_personne",
    aliases: [
      "harcèlement en ligne",
      "harcèlement numérique",
      "harcèlement moral en ligne",
    ],
    primaryVector: "social_media",
    primaryDimension: "pressure_and_coercion_resistance",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le cyberharcèlement est la répétition de propos ou de comportements hostiles à l'encontre d'une personne au moyen de communications électroniques, ayant pour effet une dégradation de ses conditions de vie.",
    howItWorks:
      "Ce qui caractérise le cyberharcèlement n'est pas la gravité d'un message isolé mais l'accumulation : chaque élément, pris seul, peut paraître mineur, ce qui rend la situation difficile à faire reconnaître au début. Trois traits l'aggravent par rapport au harcèlement hors ligne. Il n'a pas d'horaire : le téléphone suit la personne, y compris chez elle. Il laisse des traces publiques et durables, consultables par l'entourage et les futurs employeurs. Et il peut être mené par plusieurs personnes agissant séparément, chacune estimant n'avoir écrit qu'un message. En droit français, la répétition constitue l'infraction, y compris lorsqu'elle résulte de propos tenus par des auteurs différents.",
    warningSigns: [
      "Messages ou commentaires hostiles répétés, y compris de faible intensité",
      "Création de comptes dédiés à vous contacter après un blocage",
      "Diffusion de contenus vous concernant hors de leur contexte d'origine",
      "Sollicitation de tiers pour relayer ou amplifier",
      "Évitement des espaces en ligne où vous étiez présent auparavant",
      "Retentissement sur le sommeil, le travail ou la scolarité",
    ],
    triggers: ["social_pressure", "fear"],
    indicators: [],
    howToVerify:
      "Constituez un relevé chronologique : captures horodatées, identifiants des comptes, adresses des publications. C'est ce qui transforme un ressenti en dossier. Ne répondez pas pour obtenir des aveux : cela alimente le fil et fournit des éléments réutilisables contre vous.",
    whatToDo:
      "Conservez les preuves avant de bloquer, puis bloquez et signalez sur chaque plateforme. Restreignez temporairement la visibilité de vos comptes plutôt que de les supprimer : la suppression fait disparaître les preuves. Parlez-en — à un proche, à l'établissement scolaire, à l'employeur, au 3018 pour le harcèlement en ligne.",
    whatToDoIfVictim:
      "Déposez plainte avec le relevé constitué : le cyberharcèlement est une infraction pénale et la plainte peut viser des auteurs multiples. Faites-vous accompagner par une association d'aide aux victimes, qui connaît les démarches et les délais. Si des contenus doivent être retirés, la voie du signalement à la plateforme est plus rapide que la voie judiciaire, et les deux peuvent être menées en parallèle.",
    whyItWorks:
      "Chaque message, pris seul, paraît trop petit pour être signalé, et c'est l'accumulation qui blesse. Le téléphone suit la personne partout, y compris chez elle : il n'y a plus d'endroit où souffler.",
    example: {
      setting: "Commentaires reçus en une semaine sous vos publications, dont plusieurs après un blocage.",
      message:
        "« Encore toi ? Personne ne t'a demandé ton avis. »\n« Tout le monde rigole de toi, tu sais. »\nNouveau compte, créé hier : « Tu croyais vraiment pouvoir me bloquer ? »",
      giveaways: [
        "Les messages se répètent : c'est la répétition qui fait l'infraction.",
        "Un nouveau compte apparaît après chaque blocage.",
        "Le ton cherche à vous isoler.",
      ],
    },
    decisionChecklist: [
      {
        check: "Recevez-vous des messages hostiles répétés, même s'ils paraissent mineurs un par un ?",
        then: "Faites des captures horodatées avec les identifiants des comptes, avant de bloquer.",
      },
      {
        check: "Avez-vous conservé les preuves ?",
        then: "Bloquez, signalez sur chaque plateforme, et restreignez la visibilité de vos comptes sans les supprimer.",
      },
      {
        check: "La situation pèse-t-elle sur votre sommeil, votre travail ou votre scolarité ?",
        then: "Parlez-en à un proche ou au 3018, et déposez plainte avec le relevé constitué.",
      },
    ],
    prevention: [
      "Réglez la visibilité de vos comptes sur vos contacts plutôt que sur le public.",
      "Gardez l'habitude de conserver les preuves avant de bloquer.",
      "Ne restez pas seul : le dire à quelqu'un est déjà une protection.",
    ],
    relatedAttackCodes: [
      "PERS-000003",
      "PERS-000004",
      "PERS-000005",
      "PERS-000008",
      "PERS-000007",
    ],
    faq: [
      {
        question:
          "Chaque message pris isolément semble anodin. Est-ce suffisant ?",
        answer:
          "Oui, et c'est même la définition de l'infraction : elle repose sur la répétition, pas sur la gravité d'un message unique. C'est pourquoi le relevé chronologique complet vaut mieux que la capture du pire message.",
      },
      {
        question:
          "Les auteurs sont nombreux et anonymes. Une plainte a-t-elle un sens ?",
        answer:
          "Oui. Le droit français prévoit le cas où la répétition résulte de plusieurs auteurs agissant séparément, et l'anonymat en ligne n'est pas un anonymat réel : les plateformes peuvent être requises d'identifier un compte dans le cadre d'une procédure.",
      },
      {
        question: "Faut-il supprimer ses comptes ?",
        answer:
          "Restreindre la visibilité est préférable à la suppression, qui fait disparaître les preuves et donne à la personne le sentiment d'avoir été chassée de ses propres espaces. La mise en retrait, si elle est choisie, doit être temporaire et décidée par vous.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "cyberstalking-harassment",
        name: "Cyberharassment",
        plainLanguageDefinition:
          "Hostile messages, comments, or posts, repeated, coming from one or several people, that end up taking over your daily life. It isn't a matter of sensitivity: repetition is precisely what constitutes the offense.",
        definition:
          "Cyberharassment is the repetition of hostile remarks or behavior directed at a person through electronic communications, resulting in a deterioration of their living conditions.",
        howItWorks:
          "What characterizes cyberharassment isn't the severity of any single message but the accumulation: each element, taken alone, can seem minor, which makes the situation hard to get recognized at first. Three traits make it worse than offline harassment. It has no hours: the phone follows the person everywhere, including at home. It leaves public, lasting traces, visible to friends, family, and future employers. And it can be carried out by several people acting separately, each of them thinking they only wrote one message. Under French law, the repetition constitutes the offense, including when it results from statements made by different individuals.",
        warningSigns: [
          "Repeated hostile messages or comments, even low-intensity ones",
          "Creation of dedicated accounts to contact you after being blocked",
          "Content about you shared out of its original context",
          "Recruiting others to relay or amplify the harassment",
          "Avoiding online spaces where you used to be present",
          "Effects on sleep, work, or schooling",
        ],
        howToVerify:
          "Build a chronological record: timestamped screenshots, account identifiers, post addresses. That's what turns a feeling into a case file. Don't reply to try to get an admission: it feeds the thread and provides material that can be used against you.",
        whatToDo:
          "Preserve the evidence before blocking, then block and report on each platform. Temporarily restrict the visibility of your accounts rather than deleting them: deletion makes the evidence disappear too. Talk about it — to someone close to you, to your school, to your employer, to the dedicated online harassment helpline (3018 in France).",
        whatToDoIfVictim:
          "File a police report with the record you've built: cyberharassment is a criminal offense and the report can target multiple perpetrators. Get support from a victim support association, which knows the process and the timelines. If content needs to be taken down, reporting to the platform is faster than the judicial route, and both can be pursued in parallel.",
        faq: [
          {
            question:
              "Each message on its own seems harmless. Is that enough?",
            answer:
              "Yes, and that is in fact the definition of the offense: it rests on repetition, not on the severity of any one message. That's why a complete chronological record is more valuable than a screenshot of the worst message.",
          },
          {
            question:
              "The perpetrators are numerous and anonymous. Is a police report worth it?",
            answer:
              "Yes. French law covers the case where repetition results from several people acting separately, and online anonymity isn't truly anonymous: platforms can be legally required to identify an account as part of a case.",
          },
          {
            question: "Should I delete my accounts?",
            answer:
              "Restricting visibility is preferable to deletion, which erases the evidence and can make the person feel driven out of their own spaces. Stepping back, if chosen, should be temporary and your own decision.",
          },
        ],
        whyItWorks:
          "Each message, taken alone, seems too small to report, and it's the accumulation that hurts. The phone follows the person everywhere, including at home: there's no place left to breathe.",
        example: {
          setting: "Comments received over one week under your posts, several of them after you blocked someone.",
          message:
            "\"You again? Nobody asked for your opinion.\"\n\"Everyone's laughing at you, you know.\"\nNew account, created yesterday: \"Did you really think you could block me?\"",
          giveaways: [
            "The messages keep coming: repetition is what makes it an offense.",
            "A new account appears after each block.",
            "The tone aims to isolate you.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are you receiving repeated hostile messages, even if each one seems minor?",
            then: "Take time-stamped screenshots with the accounts' usernames, before blocking.",
          },
          {
            check: "Have you kept the evidence?",
            then: "Block, report on each platform, and restrict your accounts' visibility without deleting them.",
          },
          {
            check: "Is the situation affecting your sleep, your work or your studies?",
            then: "Talk to someone close or to the dedicated online harassment helpline (3018 in France), and file a police report with your record.",
          },
        ],
        prevention: [
          "Set your accounts' visibility to your contacts rather than the public.",
          "Keep the habit of saving evidence before blocking.",
          "Don't stay alone with it: telling someone is already a protection.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "online harassment",
          "digital harassment",
          "online bullying",
        ],
      },
    },
  },
  {
    code: "PERS-000007",
    slug: "usurpation-de-profil-sur-les-reseaux-sociaux",
    simulationSlug: "amie-signale-faux-profil-a-votre-nom",
    name: "Usurpation de profil sur les réseaux sociaux",
    categorySlug: "chantage-et-harcelement",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un compte reprend votre nom et vos photographies pour écrire à vos proches en se faisant passer pour vous. Votre compte n'est pas piraté : il est copié, ce qui explique que vous n'ayez rien remarqué.",
    attackerObjective: "emprise_sur_une_personne",
    aliases: ["faux profil", "clonage de compte", "faux compte à mon nom"],
    primaryVector: "social_media",
    primaryDimension: "identity_verification",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "L'usurpation de profil consiste à créer un compte reprenant le nom, la photographie et les éléments publics d'une personne réelle, afin de tromper son entourage ou de lui nuire en publiant en son nom.",
    howItWorks:
      "Rien n'est compromis : le nom, la photographie de profil et la liste des abonnés publics suffisent à fabriquer une copie convaincante en quelques minutes. Le faux compte demande ensuite en relation les contacts de l'original, qui acceptent parce qu'ils reconnaissent le visage et supposent un second compte ou un changement de plateforme. Vient alors le message ciblé — une demande d'argent urgente, un lien, une conversation destinée à obtenir des informations. Une variante ne cherche pas à escroquer mais à nuire : le faux compte publie des propos attribués à la personne, ce qui produit un préjudice de réputation que la victime découvre par ses proches. La personne usurpée n'a aucun signal sur son propre compte, ce qui explique le délai avant la découverte.",
    warningSigns: [
      "Des proches vous signalent une demande de relation alors que vous ne l'avez pas envoyée",
      "Compte portant votre nom, créé récemment, avec peu de publications",
      "Photographies reprises des vôtres, souvent en qualité dégradée",
      "Messages envoyés en votre nom que vous ne retrouvez pas dans votre messagerie",
      "Variation minime dans l'identifiant : lettre doublée, point ajouté, chiffre final",
    ],
    triggers: ["trust", "social_pressure"],
    indicators: [],
    howToVerify:
      "Vérifiez d'abord l'historique de connexion de votre propre compte : s'il est normal, votre compte n'est pas compromis, il est copié — la réponse n'est pas la même. Comparez ensuite les identifiants caractère par caractère et la date de création du faux compte.",
    whatToDo:
      "Prévenez vos contacts par une publication depuis votre compte authentique : c'est l'action la plus efficace et la plus rapide, car elle neutralise le faux compte avant tout retrait. Signalez ensuite le compte à la plateforme au titre de l'usurpation d'identité, procédure généralement traitée en priorité lorsque la personne usurpée la déclenche elle-même.",
    whatToDoIfVictim:
      "Conservez les captures du faux compte et des messages envoyés en votre nom, puis déposez plainte : l'usurpation d'identité numérique est une infraction pénale. Si des proches ont versé de l'argent, ils doivent contacter leur banque sans attendre et déposer plainte de leur côté. Renforcez la confidentialité de votre liste de contacts, qui est le matériau de départ de ce procédé.",
    whyItWorks:
      "Vos proches reconnaissent votre visage et votre nom, et supposent un second compte : ils acceptent sans vérifier. Vous ne voyez rien sur votre propre compte, puisqu'il n'est pas touché.",
    example: {
      setting: "Message d'une amie, qui vous envoie une capture d'écran.",
      message:
        "C'est bien toi ? Je viens de recevoir une demande d'ajout d'un compte à ton nom, avec ta photo. Il m'a déjà écrit pour me demander de lui prêter de l'argent, il dit qu'il a perdu sa carte.",
      giveaways: [
        "Vous n'avez créé aucun autre compte.",
        "Le faux compte est récent et reprend vos photos.",
        "La demande d'argent arrive juste après l'ajout.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'historique de connexion de votre propre compte est-il normal ?",
        then: "Votre compte est copié, pas piraté : prévenez vos contacts par une publication depuis votre vrai compte.",
      },
      {
        check: "Des proches ont-ils reçu une demande d'argent ou un lien de la part du faux compte ?",
        then: "Dites-leur de ne rien envoyer et, s'ils ont payé, de contacter leur banque.",
      },
      {
        check: "Le faux compte est-il encore en ligne ?",
        then: "Faites des captures, signalez-le à la plateforme pour usurpation d'identité, puis déposez plainte.",
      },
    ],
    prevention: [
      "Masquez votre liste de contacts au public.",
      "Convenez avec vos proches de vérifier par téléphone toute demande d'argent reçue en ligne.",
      "Recherchez votre nom sur les réseaux de temps en temps.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000009",
      "SOCIAL-000005",
      "PERS-000006",
      "ACCT-000010",
      "DATA-000002",
    ],
    faq: [
      {
        question: "Mon compte a-t-il été piraté ?",
        answer:
          "Le plus souvent non. Une usurpation de profil ne nécessite aucun accès à votre compte : elle recopie ce qui est public. Vérifiez malgré tout votre historique de connexion, car les deux situations peuvent coexister.",
      },
      {
        question: "La plateforme refuse de supprimer le faux compte.",
        answer:
          "Insistez en signalant depuis un compte vérifié et en utilisant le motif « usurpation d'identité », qui suit un circuit distinct du signalement générique. Un dépôt de plainte, transmis à la plateforme, appuie la demande. Entre-temps, prévenir vos contacts reste la mesure la plus efficace.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "social-media-impersonation",
        simulationSlug: "friend-reports-fake-profile-in-your-name",
        name: "Social media profile impersonation",
        plainLanguageDefinition:
          "An account uses your name and your photos to message people you know while pretending to be you. Your account isn't hacked: it's copied, which is why you never noticed anything.",
        definition:
          "Profile impersonation is the creation of an account reusing a real person's name, photograph, and public information, to deceive their circle or harm them by posting under their name.",
        howItWorks:
          "Nothing is compromised: the name, profile photo, and list of public followers are enough to build a convincing copy within minutes. The fake account then sends a connection request to the original's contacts, who accept because they recognize the face and assume it's a second account or a switch of platform. Then comes the targeted message — an urgent request for money, a link, a conversation designed to extract information. One variant isn't aimed at defrauding but at causing harm: the fake account posts remarks attributed to the person, producing reputational harm that the victim discovers through people close to them. The impersonated person has no signal on their own account, which explains the delay before discovery.",
        warningSigns: [
          "People close to you report a connection request you never sent",
          "An account bearing your name, recently created, with few posts",
          "Photos copied from yours, often at reduced quality",
          "Messages sent in your name that you can't find in your own messaging",
          "A slight variation in the username: a doubled letter, an added dot, a trailing digit",
        ],
        howToVerify:
          "First check your own account's login history: if it's normal, your account isn't compromised, it's copied — and the response isn't the same. Then compare the usernames character by character and check the fake account's creation date.",
        whatToDo:
          "Warn your contacts with a post from your genuine account: this is the fastest and most effective action, since it neutralizes the fake account before any takedown happens. Then report the account to the platform as impersonation, a procedure generally handled as a priority when the impersonated person triggers it themselves.",
        whatToDoIfVictim:
          "Preserve screenshots of the fake account and of messages sent in your name, then file a police report: digital identity theft is a criminal offense. If people close to you sent money, they should contact their bank without delay and file their own police report. Strengthen the privacy of your contact list, which is the starting material for this technique.",
        faq: [
          {
            question: "Has my account been hacked?",
            answer:
              "Usually not. Impersonating a profile requires no access to your account at all: it simply copies what's public. Still check your login history, since both situations can coexist.",
          },
          {
            question: "The platform refuses to remove the fake account.",
            answer:
              "Insist by reporting from a verified account and using the \"identity theft\" reason, which follows a different track than a generic report. A police report, forwarded to the platform, strengthens the request. In the meantime, warning your contacts remains the most effective step.",
          },
        ],
        whyItWorks:
          "The people close to you recognize your face and name and assume it's a second account: they accept without checking. You see nothing on your own account, since it isn't affected.",
        example: {
          setting: "Message from a friend, who sends you a screenshot.",
          message:
            "Is this you? I just got a friend request from an account in your name, with your photo. It already wrote to ask me to lend it money, saying you lost your card.",
          giveaways: [
            "You didn't create any other account.",
            "The fake account is recent and reuses your photos.",
            "The request for money comes right after the friend request.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is your own account's login history normal?",
            then: "Your account has been copied, not hacked: warn your contacts with a post from your real account.",
          },
          {
            check: "Have people close to you received a request for money or a link from the fake account?",
            then: "Tell them not to send anything and, if they paid, to contact their bank.",
          },
          {
            check: "Is the fake account still online?",
            then: "Take screenshots, report it to the platform for impersonation, then file a police report.",
          },
        ],
        prevention: [
          "Hide your contact list from the public.",
          "Agree with people close to you to check by phone any request for money received online.",
          "Search for your name on social networks from time to time.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: ["fake profile", "account cloning", "fake account in my name"],
      },
    },
  },
  {
    code: "PERS-000008",
    slug: "raid-de-harcelement",
    noSimulationReason:
      "Même raison que le cyberharcèlement : la reconnaissance n'est pas le point difficile, et la mise en scène ferait courir un risque sans contrepartie.",
    name: "Raid de harcèlement",
    categorySlug: "chantage-et-harcelement",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Des centaines de comptes vous prennent pour cible en quelques heures, à la suite d'un appel lancé ailleurs. Chacun estime n'avoir écrit qu'un message ; vous en recevez des milliers.",
    attackerObjective: "emprise_sur_une_personne",
    aliases: [
      "harcèlement en meute",
      "raid numérique",
      "brigading",
      "harcèlement coordonné",
    ],
    primaryVector: "social_media",
    primaryDimension: "pressure_and_coercion_resistance",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le raid de harcèlement est une attaque coordonnée au cours de laquelle un grand nombre de comptes ciblent simultanément une même personne, à la suite d'une désignation publique faite sur un autre espace.",
    howItWorks:
      "Le raid commence ailleurs que là où il frappe : une publication désigne une cible sur un forum, un serveur de discussion ou une chaîne, souvent en la présentant comme méritant une réponse. L'afflux qui suit est massif et concentré sur quelques heures, ce qui sature les moyens de modération et de signalement — les outils sont conçus pour traiter des messages isolés, pas des milliers. La dispersion des auteurs est le cœur du procédé : chacun peut soutenir n'avoir écrit qu'un seul message, alors que l'effet subi est celui d'un harcèlement continu. Le raid s'accompagne fréquemment d'un doxxing préalable, qui fournit les informations personnelles, et parfois de signalements massifs destinés à faire suspendre le compte de la victime.",
    warningSigns: [
      "Augmentation soudaine et massive des notifications en quelques minutes",
      "Messages hostiles reprenant une même formulation ou une même référence",
      "Comptes récemment créés, sans historique, agissant de façon synchronisée",
      "Apparition de vos informations personnelles dans les messages reçus",
      "Signalements massifs conduisant à une restriction de votre propre compte",
    ],
    triggers: ["social_pressure", "fear"],
    indicators: [],
    howToVerify:
      "Cherchez la publication d'origine : elle se trouve rarement sur la plateforme où vous êtes visé, et l'identifier est ce qui permet de qualifier la coordination. Archivez-la ainsi qu'un échantillon représentatif des messages, avec les identifiants et les horodatages.",
    whatToDo:
      "Basculez immédiatement le compte en mode restreint et coupez les notifications : lire n'apporte rien et aggrave le retentissement. Confiez la collecte des preuves à une personne de confiance plutôt que de la faire vous-même — c'est plus soutenable, et tout aussi valable. Ne répondez à aucun message : toute réponse est reprise et relancée.",
    whatToDoIfVictim:
      "Déposez plainte en visant à la fois la publication d'origine et un échantillon documenté des messages : le droit français prévoit le cas d'une répétition résultant d'auteurs multiples agissant de façon concertée. Signalez la publication d'origine à la plateforme qui l'héberge, car c'est elle qui alimente le flux. Le 3018 accompagne les victimes de harcèlement en ligne et dispose de contacts directs avec les plateformes.",
    whyItWorks:
      "L'afflux est si massif que les outils de signalement sont débordés, et lire les messages devient impossible à arrêter. Chaque auteur pense n'avoir écrit qu'un message, ce qui dilue la responsabilité.",
    example: {
      setting: "Votre téléphone affiche des notifications en continu depuis vingt minutes.",
      message:
        "312 nouvelles notifications\n« Lis le fil d'origine et tu comprendras. »\n« Lis le fil d'origine et tu comprendras. »\n« On sait où tu habites. »",
      giveaways: [
        "Des centaines de comptes écrivent la même chose en même temps.",
        "Beaucoup de comptes ont été créés récemment.",
        "L'appel d'origine se trouve sur une autre plateforme.",
      ],
    },
    decisionChecklist: [
      {
        check: "Recevez-vous un afflux soudain de messages hostiles ?",
        then: "Passez le compte en mode restreint et coupez les notifications tout de suite.",
      },
      {
        check: "Une personne de confiance peut-elle collecter les preuves à votre place ?",
        then: "Confiez-lui la publication d'origine et un échantillon de messages, avec identifiants et horodatages.",
      },
      {
        check: "Vos informations personnelles apparaissent-elles dans les messages ?",
        then: "Déposez plainte, signalez la publication d'origine et appelez le 3018.",
      },
    ],
    prevention: [
      "Sachez où se trouve le mode restreint de vos comptes avant d'en avoir besoin.",
      "Limitez les informations personnelles publiques, qui alimentent les raids.",
      "Ne répondez jamais pendant un raid : toute réponse est reprise.",
    ],
    relatedAttackCodes: ["PERS-000004", "PERS-000006", "PERS-000009"],
    faq: [
      {
        question: "Faut-il répondre pour rétablir les faits ?",
        answer:
          "Non. Chaque réponse est extraite, recadrée et relancée, ce qui prolonge le raid au lieu d'y mettre fin. Le silence pendant l'épisode n'est pas un aveu : c'est la seule façon de ne pas fournir de matière nouvelle.",
      },
      {
        question:
          "Mon compte a été suspendu à la suite de signalements massifs.",
        answer:
          "C'est un usage détourné du signalement, et il se conteste. Utilisez la procédure de recours de la plateforme en expliquant le contexte de raid, et joignez les éléments montrant la coordination : ces recours aboutissent régulièrement.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "harassment-raid",
        name: "Harassment raid",
        plainLanguageDefinition:
          "Hundreds of accounts target you within a few hours, following a call put out somewhere else. Each one thinks they only sent one message; you receive thousands.",
        definition:
          "A harassment raid is a coordinated attack in which a large number of accounts target the same person simultaneously, following a public call-out made on another platform.",
        howItWorks:
          "The raid starts somewhere other than where it hits: a post names a target on a forum, a chat server, or a channel, often presenting them as deserving a response. The influx that follows is massive and concentrated over a few hours, which overwhelms moderation and reporting tools — they're built to handle isolated messages, not thousands at once. The dispersal of the participants is the core of the method: each one can claim to have written only a single message, while the effect on the target is that of continuous harassment. A raid is frequently preceded by doxxing, which supplies the personal information, and sometimes by mass reporting intended to get the victim's own account suspended.",
        warningSigns: [
          "A sudden, massive surge of notifications within minutes",
          "Hostile messages repeating the same wording or the same reference",
          "Recently created accounts, with no history, acting in a synchronized way",
          "Your personal information appearing in the messages received",
          "Mass reporting leading to a restriction on your own account",
        ],
        howToVerify:
          "Look for the original post: it's rarely on the platform where you're being targeted, and identifying it is what allows the coordination to be established. Archive it along with a representative sample of the messages, with identifiers and timestamps.",
        whatToDo:
          "Immediately switch the account to restricted mode and turn off notifications: reading them adds nothing and worsens the impact. Hand off the evidence collection to someone you trust rather than doing it yourself — it's more sustainable, and just as valid. Don't reply to any message: any reply gets picked up and recirculated.",
        whatToDoIfVictim:
          "File a police report covering both the original post and a documented sample of the messages: French law covers the case of repetition resulting from multiple people acting in a coordinated way. Report the original post to the platform hosting it, since that's what feeds the flow. The dedicated online harassment helpline (3018 in France) supports victims and has direct contacts with platforms.",
        faq: [
          {
            question: "Should I respond to set the record straight?",
            answer:
              "No. Every reply gets extracted, reframed, and recirculated, which prolongs the raid instead of ending it. Staying silent during the episode isn't an admission of anything: it's the only way to avoid supplying new material.",
          },
          {
            question: "My account was suspended following mass reporting.",
            answer:
              "That's a misuse of the reporting system, and it can be contested. Use the platform's appeal procedure to explain the raid context, and attach evidence showing the coordination: these appeals regularly succeed.",
          },
        ],
        whyItWorks:
          "The flood is so massive that reporting tools are overwhelmed, and reading the messages becomes impossible to stop. Each author thinks they only wrote one message, which dilutes responsibility.",
        example: {
          setting: "Your phone has been showing notifications nonstop for twenty minutes.",
          message:
            "312 new notifications\n\"Read the original thread and you'll understand.\"\n\"Read the original thread and you'll understand.\"\n\"We know where you live.\"",
          giveaways: [
            "Hundreds of accounts write the same thing at the same time.",
            "Many of the accounts were created recently.",
            "The original call is on another platform.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are you receiving a sudden flood of hostile messages?",
            then: "Switch the account to restricted mode and turn off notifications right away.",
          },
          {
            check: "Can someone you trust collect the evidence for you?",
            then: "Give them the original post and a sample of messages, with usernames and timestamps.",
          },
          {
            check: "Does your personal information appear in the messages?",
            then: "File a police report, report the original post and call the dedicated online harassment helpline (3018 in France).",
          },
        ],
        prevention: [
          "Know where your accounts' restricted mode is before you need it.",
          "Limit public personal information, which feeds raids.",
          "Never reply during a raid: every reply gets picked up.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "pile-on harassment",
          "digital raid",
          "brigading",
          "coordinated harassment",
        ],
      },
    },
  },
  {
    code: "PERS-000009",
    slug: "swatting",
    noSimulationReason:
      "Les faits se découvrent par l'intervention elle-même. Il n'existe aucun moment antérieur où une décision de la personne visée aurait changé l'issue.",
    name: "Swatting (faux signalement aux secours)",
    categorySlug: "chantage-et-harcelement",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Quelqu'un appelle les secours en inventant une urgence grave à votre adresse. Une intervention réelle se déclenche chez vous, avec des forces de l'ordre qui n'ont aucune raison de douter de l'appel.",
    attackerObjective: "emprise_sur_une_personne",
    aliases: [
      "faux signalement",
      "fausse alerte aux secours",
      "canular d'intervention",
    ],
    primaryVector: "phone",
    primaryDimension: "pressure_and_coercion_resistance",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le swatting consiste à provoquer l'intervention de forces de l'ordre au domicile d'une personne en signalant faussement une situation grave — prise d'otages, menace armée, alerte à la bombe — afin de lui nuire.",
    howItWorks:
      "L'auteur a besoin d'une seule chose que la victime ne contrôle pas : son adresse, obtenue par un doxxing préalable ou par recoupement. Il appelle ensuite les secours en décrivant une situation qui impose une réponse immédiate et prioritaire. Les services d'urgence ne peuvent pas traiter un tel appel comme suspect : leur devoir est d'intervenir, et cette obligation est précisément ce que l'auteur détourne. L'intervention est donc réelle, et son danger l'est aussi — la personne visée ignore pourquoi on entre chez elle, et une réaction de surprise peut être interprétée comme une menace. Le swatting suit fréquemment un raid de harcèlement, dont il constitue l'escalade vers le monde physique.",
    warningSigns: [
      "Publication de votre adresse dans un contexte hostile",
      "Menaces explicites annonçant une intervention ou « une visite »",
      "Raid de harcèlement en cours, avec recherche de votre localisation",
      "Appels destinés à faire confirmer votre adresse ou votre présence chez vous",
      "Commandes ou livraisons non sollicitées à votre domicile, souvent en préparation",
    ],
    triggers: ["fear", "social_pressure"],
    indicators: [],
    howToVerify:
      "Il n'y a rien à vérifier pendant l'intervention, et tenter de le faire est dangereux. La prévention se joue en amont : savoir si votre adresse est trouvable, et l'avoir signalé si des menaces l'annoncent.",
    whatToDo:
      "Pendant une intervention : gardez les mains visibles, obéissez aux instructions sans geste brusque, et n'expliquez rien avant qu'on vous le demande. Les explications viennent après, quand la situation est sécurisée. C'est la seule conduite qui protège tout le monde, y compris vous.",
    whatToDoIfVictim:
      "Déposez plainte : le faux signalement provoquant l'intervention des secours est une infraction pénale, et l'appel laisse des traces techniques exploitables. Si des menaces annoncent un swatting, signalez-le aux forces de l'ordre avant qu'il ne survienne : un signalement préalable est consigné et peut modifier la façon dont un appel ultérieur est traité. Faites retirer votre adresse des espaces où elle a été publiée, et documentez le raid ou le doxxing qui a précédé.",
    whyItWorks:
      "Les secours ne peuvent pas traiter comme suspect un appel qui décrit une urgence grave : leur devoir est d'intervenir, et c'est ce devoir que l'auteur détourne. La personne visée ne sait pas pourquoi on entre chez elle.",
    example: {
      setting: "Message repéré sur un forum où votre adresse a été publiée la veille.",
      message:
        "Ce soir, on lui envoie une petite visite. Il va comprendre.",
      giveaways: [
        "Votre adresse a été publiée dans un contexte hostile.",
        "Une « visite » est annoncée.",
        "Un raid de harcèlement a précédé.",
      ],
    },
    decisionChecklist: [
      {
        check: "Votre adresse a-t-elle été publiée, ou une intervention vous est-elle annoncée ?",
        then: "Signalez-le aux forces de l'ordre dès maintenant : un signalement préalable est consigné.",
      },
      {
        check: "Une intervention a-t-elle lieu chez vous ?",
        then: "Gardez les mains visibles, obéissez sans geste brusque, et n'expliquez rien avant qu'on vous le demande.",
      },
      {
        check: "L'intervention est-elle terminée ?",
        then: "Déposez plainte, et faites retirer votre adresse des espaces où elle a été publiée.",
      },
    ],
    prevention: [
      "Cherchez si votre adresse est trouvable en ligne, et faites-la retirer.",
      "Signalez toute menace d'intervention avant qu'elle ne survienne.",
      "Documentez le doxxing ou le raid qui précède.",
    ],
    relatedAttackCodes: ["PERS-000004", "PERS-000008"],
    faq: [
      {
        question: "Peut-on prévenir la police à l'avance ?",
        answer:
          "Oui, et c'est utile lorsque des menaces l'annoncent explicitement. Un signalement préalable, déposé avec les captures des menaces, est consigné et peut être pris en compte si un appel survient. Il ne garantit rien, mais il est la seule mesure préventive réellement disponible.",
      },
      {
        question: "Pourquoi les secours ne détectent-ils pas l'appel ?",
        answer:
          "Parce qu'un service d'urgence doit répondre au risque décrit, sans pouvoir le vérifier au préalable. Traiter un appel comme faux serait bien plus dangereux que d'intervenir pour rien. C'est cette obligation que le procédé exploite, et non une défaillance.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "swatting",
        name: "Swatting (fake emergency report)",
        plainLanguageDefinition:
          "Someone calls emergency services and invents a serious emergency at your address. A real intervention gets launched at your home, with police officers who have no reason to doubt the call.",
        definition:
          "Swatting is causing law enforcement to intervene at a person's home by falsely reporting a serious situation — a hostage-taking, an armed threat, a bomb threat — in order to harm them.",
        howItWorks:
          "The perpetrator needs only one thing the victim doesn't control: their address, obtained through prior doxxing or by cross-referencing information. They then call emergency services describing a situation that demands an immediate, top-priority response. Emergency services cannot treat such a call as suspect: their duty is to intervene, and that obligation is exactly what the perpetrator is exploiting. The intervention is therefore real, and its danger is too — the person targeted doesn't know why officers are entering their home, and a startled reaction can be interpreted as a threat. Swatting frequently follows a harassment raid, of which it represents the escalation into the physical world.",
        warningSigns: [
          "Your address published in a hostile context",
          "Explicit threats announcing an intervention or a \"visit\"",
          "An ongoing harassment raid, with attempts to find your location",
          "Calls designed to confirm your address or that you're home",
          "Unsolicited orders or deliveries at your home, often as preparation",
        ],
        howToVerify:
          "There's nothing to verify during an intervention, and trying to is dangerous. Prevention happens beforehand: knowing whether your address can be found, and having reported it if threats announce one.",
        whatToDo:
          "During an intervention: keep your hands visible, follow instructions without sudden movements, and don't explain anything until asked to. Explanations come afterward, once the situation is secured. This is the only conduct that protects everyone, including you.",
        whatToDoIfVictim:
          "File a police report: a false report causing an emergency-services intervention is a criminal offense, and the call leaves technical traces that can be used. If threats announce a swatting attempt, report it to law enforcement before it happens: a prior report is logged and can change how a later call is handled. Have your address removed from the places where it was published, and document the raid or doxxing that preceded it.",
        faq: [
          {
            question: "Can the police be warned in advance?",
            answer:
              "Yes, and it's useful when threats announce it explicitly. A prior report, filed with screenshots of the threats, is logged and can be taken into account if a call comes in later. It guarantees nothing, but it's the only real preventive measure available.",
          },
          {
            question: "Why don't emergency services detect the call is fake?",
            answer:
              "Because an emergency service must respond to the risk described, without being able to verify it beforehand. Treating a call as fake would be far more dangerous than intervening for nothing. It's this obligation that the technique exploits, not a failure on their part.",
          },
        ],
        whyItWorks:
          "Emergency services can't treat a call describing a serious emergency as suspicious: their duty is to respond, and that duty is what the perpetrator hijacks. The targeted person doesn't know why officers are entering their home.",
        example: {
          setting: "Message spotted on a forum where your address was published the day before.",
          message:
            "Tonight, we're sending him a little visit. He'll get the message.",
          giveaways: [
            "Your address was published in a hostile context.",
            "A \"visit\" is announced.",
            "A harassment raid came first.",
          ],
        },
        decisionChecklist: [
          {
            check: "Has your address been published, or has an intervention been announced?",
            then: "Report it to the police now: an advance report is recorded.",
          },
          {
            check: "Is an intervention taking place at your home?",
            then: "Keep your hands visible, comply without sudden movements, and don't explain anything until you're asked.",
          },
          {
            check: "Is the intervention over?",
            then: "File a police report, and have your address removed from wherever it was published.",
          },
        ],
        prevention: [
          "Check whether your address can be found online, and have it removed.",
          "Report any threatened intervention before it happens.",
          "Document the doxxing or raid that came before.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "fake report",
          "false emergency alert",
          "hoax intervention call",
        ],
      },
    },
  },
  {
    code: "PERS-000010",
    slug: "chantage-apres-fuite-de-donnees",
    simulationSlug: "menace-publication-donnees-apres-fuite",
    name: "Chantage après une fuite de données",
    categorySlug: "chantage-et-harcelement",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un message annonce que vos données ont été volées chez un service que vous utilisez vraiment, et réclame un paiement pour ne pas les publier. La fuite, elle, a bien eu lieu — c'est ce qui rend la menace crédible.",
    attackerObjective: "argent",
    aliases: [
      "extorsion après fuite",
      "chantage aux données",
      "rançon sans chiffrement",
    ],
    primaryVector: "email",
    primaryDimension: "account_security_awareness",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le chantage après fuite de données exploite une compromission réelle survenue chez un tiers : l'auteur menace de publier ou de revendre les informations concernant une personne ou une organisation si un paiement n'est pas effectué.",
    howItWorks:
      "Ce chantage se distingue du chantage au faux piratage par un point décisif : quelque chose existe réellement. Une base a été compromise chez un prestataire, un commerçant, un établissement, et les données circulent. L'auteur en extrait des éléments authentiques — un numéro de dossier, une adresse, un historique d'achat — et les cite pour établir sa crédibilité en quelques lignes. La menace n'est donc pas invérifiable, ce qui la rend plus efficace. Elle reste pourtant sans issue : les données sont déjà hors de contrôle, souvent détenues par plusieurs acteurs, et un paiement n'obtient aucune suppression vérifiable. Visant une organisation, ce chantage s'accompagne d'un délai public et de la menace de prévenir les personnes concernées, afin d'ajouter une pression réputationnelle.",
    warningSigns: [
      "Message citant des informations exactes issues d'un service que vous utilisez",
      "Référence à une fuite de données réelle, parfois déjà rendue publique",
      "Délai court assorti d'une menace de publication ou de revente",
      "Paiement exigé en cryptomonnaie, sans engagement vérifiable en retour",
      "Menace de contacter vos clients, vos proches ou votre employeur",
    ],
    triggers: ["fear", "urgency", "authority"],
    indicators: [],
    howToVerify:
      "Vérifiez l'existence de la fuite auprès du service concerné : les organisations sont tenues de notifier les personnes affectées, et un incident réel a généralement laissé une trace. Cela permet de savoir ce qui a réellement circulé — une information utile pour se protéger — sans donner le moindre crédit à la demande de paiement.",
    whatToDo:
      "Ne payez pas : aucune suppression ne peut être vérifiée, et les données sont fréquemment détenues par plusieurs acteurs. Agissez sur ce que vous contrôlez encore : changez les mots de passe concernés, activez la double authentification, et surveillez les tentatives d'hameçonnage qui suivront, car les données volées servent d'abord à les rendre crédibles.",
    whatToDoIfVictim:
      "Déposez plainte et conservez le message ainsi que les éléments cités. Signalez l'incident au service à l'origine de la fuite : il a des obligations de notification, et votre signalement peut concerner d'autres personnes. Pour une organisation, l'incident relève d'une procédure de notification à l'autorité de protection des données, et le chantage n'exonère de rien. Si des données de santé ou d'identité sont concernées, restez attentif aux démarches ouvertes en votre nom.",
    whyItWorks:
      "Les informations citées sont exactes, puisque la fuite a bien eu lieu : la menace paraît donc sérieuse. La peur de voir ses données publiées pousse à payer, alors que le paiement n'efface rien.",
    example: {
      setting: "Email reçu quelques jours après qu'une boutique en ligne a annoncé une fuite de données.",
      message:
        "Nous détenons vos données issues de la base de la boutique : nom, adresse, historique de commandes, numéro de client 48213. Versez l'équivalent de 300 € en cryptomonnaie sous 72 heures, ou elles seront publiées.",
      giveaways: [
        "Les données citées sont réelles, mais déjà hors de contrôle.",
        "Rien ne garantit leur suppression en cas de paiement.",
        "Le paiement en cryptomonnaie ne laisse aucun recours.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le message cite-t-il des informations exactes provenant d'un service que vous utilisez ?",
        then: "Vérifiez auprès de ce service, par son site officiel, ce qui a fuité. Ne payez pas.",
      },
      {
        check: "Le mot de passe de ce service sert-il ailleurs ?",
        then: "Changez-le partout et activez la double authentification.",
      },
      {
        check: "Avez-vous déjà payé ?",
        then: "Conservez la référence de la transaction et le message, puis déposez plainte.",
      },
    ],
    prevention: [
      "Un mot de passe unique par service, pour qu'une fuite reste limitée à un seul compte.",
      "Méfiez-vous des messages qui citeront ces données dans les semaines suivantes : elles servent à crédibiliser de l'hameçonnage.",
      "Ne donnez à un service en ligne que les informations dont il a vraiment besoin.",
    ],
    relatedAttackCodes: ["PERS-000002", "ACCT-000001", "DATA-000001"],
    faq: [
      {
        question: "Payer empêcherait-il la publication ?",
        answer:
          "Rien ne permet de le vérifier, et c'est le point central : une donnée copiée ne se restitue pas. Les mêmes lots circulent souvent entre plusieurs acteurs, et un paiement identifie surtout un interlocuteur disposé à payer.",
      },
      {
        question: "Comment savoir ce qui a réellement fuité ?",
        answer:
          "Interrogez le service concerné, qui doit informer les personnes affectées de la nature des données touchées. C'est la seule source fiable — pas le message de chantage, dont la description est destinée à effrayer, pas à informer.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "data-breach-extortion",
        simulationSlug: "leaked-data-publication-threat",
        name: "Extortion following a data breach",
        plainLanguageDefinition:
          "A message announces that your data was stolen from a service you genuinely use, and demands payment to avoid publishing it. The breach itself did happen — that's what makes the threat credible.",
        definition:
          "Extortion following a data breach exploits a real compromise that happened at a third party: the perpetrator threatens to publish or resell information about a person or organization unless a payment is made.",
        howItWorks:
          "This form of blackmail differs from fake hacking blackmail in one decisive way: something actually exists. A database was compromised at a provider, a retailer, an institution, and the data is circulating. The perpetrator pulls genuine details from it — a case number, an address, a purchase history — and cites them to establish credibility within a few lines. The threat is therefore not unverifiable, which makes it more effective. It remains without a real resolution: the data is already out of anyone's control, often held by several parties, and paying doesn't get any verifiable deletion. When aimed at an organization, this form of blackmail comes with a public deadline and the threat of notifying the people affected, to add reputational pressure.",
        warningSigns: [
          "A message citing accurate information from a service you use",
          "A reference to a real data breach, sometimes already made public",
          "A short deadline paired with a threat of publication or resale",
          "Payment demanded in cryptocurrency, with no verifiable commitment in return",
          "A threat to contact your customers, people close to you, or your employer",
        ],
        howToVerify:
          "Check whether the breach actually happened with the service concerned: organizations are required to notify affected individuals, and a real incident usually leaves a trace. This tells you what genuinely leaked — useful information for protecting yourself — without giving any credibility to the payment demand.",
        whatToDo:
          "Don't pay: no deletion can be verified, and the data is frequently held by several parties. Act on what you still control: change the affected passwords, enable two-factor authentication, and watch for the phishing attempts that will follow, since stolen data is first used to make them credible.",
        whatToDoIfVictim:
          "File a police report and preserve the message along with the details cited. Report the incident to the service where the breach originated: it has notification obligations, and your report may concern other people too. For an organization, the incident falls under a data-protection-authority notification procedure, and the blackmail attempt doesn't exempt anyone from it. If health or identity data is involved, stay alert to any procedures opened under your name.",
        faq: [
          {
            question: "Would paying prevent the publication?",
            answer:
              "There's no way to verify that, and that's the central issue: a copied piece of data can't be un-copied. The same batches often circulate among several parties, and a payment mainly identifies someone willing to pay.",
          },
          {
            question: "How can I know what actually leaked?",
            answer:
              "Ask the service concerned, which is required to inform affected people about the nature of the data involved. That's the only reliable source — not the blackmail message, whose description is meant to frighten, not to inform.",
          },
        ],
        whyItWorks:
          "The details quoted are accurate, since the breach really happened: so the threat seems serious. Fear of seeing your data published pushes you to pay, although paying erases nothing.",
        example: {
          setting: "Email received a few days after an online store announced a data breach.",
          message:
            "We hold your data from the store's database: name, address, order history, customer number 48213. Send the equivalent of €300 in cryptocurrency within 72 hours, or it will be published.",
          giveaways: [
            "The data quoted is real, but already out of anyone's control.",
            "Nothing guarantees it will be deleted if you pay.",
            "Payment in cryptocurrency leaves no recourse.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the message quote accurate information from a service you use?",
            then: "Check with that service, through its official website, what was leaked. Don't pay.",
          },
          {
            check: "Is that service's password used anywhere else?",
            then: "Change it everywhere and turn on two-factor authentication.",
          },
          {
            check: "Have you already paid?",
            then: "Keep the transaction reference and the message, then file a police report.",
          },
        ],
        prevention: [
          "One unique password per service, so a breach stays limited to one account.",
          "Be wary of messages quoting this data in the following weeks: it's used to make phishing believable.",
          "Give an online service only the information it really needs.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "post-breach extortion",
          "data blackmail",
          "ransom without encryption",
        ],
      },
    },
  },
];

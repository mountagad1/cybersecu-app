import type { AttackEntry } from "./types";
import { VERIFIED_REFERENCES as REF } from "./types";

/**
 * Ingénierie sociale — attacks that target the person, not the machine.
 *
 * Content rules (docs/decisions/0002-synthetic-content-only.md):
 *   * No fabricated statistics, incidents, victims, dates or organisations.
 *   * Mechanisms described generically — nothing here is operational
 *     guidance for conducting an attack.
 *   * Every `references` entry is a link verified to exist (see
 *     VERIFIED_REFERENCES).
 */
export const INGENIERIE_SOCIALE: AttackEntry[] = [
  {
    code: "PHISH-000001",
    slug: "phishing",
    name: "Phishing (hameçonnage)",
    categorySlug: "ingenierie-sociale",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un email qui a l'air de venir de votre banque, des impôts ou d'un service que vous utilisez vous demande de vous connecter. Le lien mène à une copie du site, et ce que vous y tapez part chez l'escroc.",
    attackerObjective: "identifiants",
    aliases: [
      "hameçonnage",
      "hameçonnage par email",
      "phishing par email",
      "hameçonnage par courriel",
    ],
    primaryVector: "email",
    primaryDimension: "phishing_recognition",
    simulationSlug: "email-banque",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "L'hameçonnage est un message frauduleux qui imite un expéditeur légitime — banque, administration, service en ligne, employeur — pour obtenir des identifiants, des données bancaires, ou faire ouvrir une pièce jointe malveillante. L'email en est le canal le plus courant ; le SMS, l'appel téléphonique et le QR code en sont des variantes traitées séparément.",
    howItWorks:
      "Le mécanisme est le même quel que soit le canal : imiter un expéditeur de confiance, fabriquer une raison d'agir vite, et fournir un chemin — un lien, un numéro, une pièce jointe — qui court-circuite la vérification. Par email, la forme la plus répandue, cela donne ceci. L'attaquant envoie un message reprenant l'identité visuelle d'un organisme connu : logo, mise en page, ton habituel. Le message annonce un problème à régler rapidement (compte suspendu, facture impayée, colis bloqué) et propose un lien. Ce lien mène à une page de connexion imitant le site officiel. Tout ce qui y est saisi part directement chez l'attaquant, qui s'en sert immédiatement pour se connecter au vrai service.",
    warningSigns: [
      "Adresse d'expéditeur qui ne correspond pas au domaine officiel de l'organisme",
      "Demande de « confirmer » ou « vérifier » des identifiants via un lien",
      "Urgence ou menace de conséquence immédiate (suspension, pénalité)",
      "Formulation impersonnelle (« Cher client ») alors que l'organisme connaît votre nom",
      "Pièce jointe inattendue, en particulier un fichier à activer ou à autoriser",
    ],
    triggers: ["urgency", "authority", "fear"],
    indicators: [],
    howToVerify:
      "N'utilisez pas le lien du message. Ouvrez votre navigateur et rejoignez le service par un chemin que vous maîtrisez : un favori enregistré, l'application officielle, ou l'adresse saisie à la main. Si le message était authentique, l'information s'y retrouvera.",
    whatToDo:
      "Ne cliquez pas, ne répondez pas, ne téléchargez pas la pièce jointe. Signalez le message comme hameçonnage dans votre messagerie, puis supprimez-le.",
    whatToDoIfVictim:
      "Changez immédiatement le mot de passe du compte concerné, puis celui de tout autre compte réutilisant le même mot de passe. Activez la double authentification. Si des données bancaires ont été saisies, contactez votre banque sans attendre. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Il ne parie pas sur votre naïveté mais sur votre routine : vous recevez chaque semaine de vrais emails de vos services, et celui-ci a la même forme. L'urgence fait le reste, en remplaçant la question « est-ce bien eux ? » par « comment régler ça vite ? ».",
    example: {
      setting: "Email reçu un lundi matin, en apparence de votre fournisseur d'énergie.",
      message:
        "Objet : Votre espace client sera désactivé\n\nBonjour,\nNous n'avons pas pu confirmer vos coordonnées. Sans action de votre part sous 24 heures, votre espace client sera désactivé.\n\nConfirmer mes informations : https://espace-client.energie-verif.example-not-real.test\n\nLe service clients",
      giveaways: [
        "Le lien mène à un domaine qui n'est pas celui de votre fournisseur.",
        "Un délai de 24 heures, sans motif précis.",
        "« Bonjour » sans votre nom, alors que le fournisseur le connaît.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le message vous demande-t-il d'agir depuis un lien ou une pièce jointe qu'il fournit ?",
        then: "N'utilisez ni l'un ni l'autre : ouvrez le service par votre favori ou son application.",
      },
      {
        check: "Une fois connecté par vos propres moyens, l'alerte annoncée est-elle absente ?",
        then: "Le message est faux : signalez-le comme hameçonnage dans votre messagerie, puis supprimez-le.",
      },
      {
        check: "Avez-vous déjà cliqué et saisi un mot de passe ?",
        then: "Changez ce mot de passe depuis le vrai service et fermez les sessions ouvertes, sans attendre.",
      },
    ],
    prevention: [
      "Enregistrez un favori pour chaque service sensible et n'utilisez que lui pour vous connecter.",
      "Utilisez un gestionnaire de mots de passe : il ne propose rien sur un faux domaine.",
      "Activez la double authentification sur votre messagerie et votre banque.",
    ],
    relatedAttackCodes: [
      "SMS-000001",
      "IDN-000001",
      "ACCT-000001",
      "IDN-000002",
      "PAYMENT-000001",
      "PAYMENT-000002",
      "PAYMENT-000004",
      "QR-000001",
      "PAYMENT-000005",
      "SOCIAL-000006",
      "SOCIAL-000008",
      "WEB-000003",
      "AI-000004",
      "DATA-000001",
      "MAL-000001",
      "MAL-000005",
      "NET-000007",
    ],
    faq: [
      {
        question: "Comment distinguer un vrai email de ma banque d'un faux ?",
        answer:
          "Une banque ne demande jamais vos identifiants complets, votre code secret ou un code reçu par SMS, quel que soit le canal. En cas de doute, n'utilisez pas le lien : passez par l'application officielle ou le numéro figurant au dos de votre carte.",
      },
      {
        question: "Est-ce dangereux d'avoir simplement ouvert l'email ?",
        answer:
          "Ouvrir un email est rarement suffisant pour compromettre un appareil. Le risque vient de ce que l'on fait ensuite : cliquer sur le lien, saisir des informations, ou ouvrir une pièce jointe.",
      },
      {
        question: "J'ai cliqué sur le lien mais rien saisi, que faire ?",
        answer:
          "Le risque principal reste limité si aucune information n'a été saisie et aucun fichier téléchargé. Par précaution, vérifiez l'activité récente du compte concerné et changez son mot de passe.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "phishing",
        name: "Phishing",
        plainLanguageDefinition:
          "An email that looks like it's from your bank, the tax office, or a service you use asks you to log in. The link leads to a copy of the site, and whatever you type there goes straight to the scammer.",
        definition:
          "Phishing is a fraudulent message that imitates a legitimate sender — a bank, government agency, online service, or employer — to obtain credentials, banking details, or get a malicious attachment opened. Email is its most common channel; SMS, phone calls, and QR codes are variants covered separately.",
        howItWorks:
          "The mechanism is the same regardless of the channel: imitate a trusted sender, manufacture a reason to act fast, and provide a path — a link, a number, an attachment — that bypasses verification. By email, the most common form, this looks like the following. The attacker sends a message reusing a known organization's visual identity: logo, layout, familiar tone. The message announces a problem to fix urgently (suspended account, unpaid invoice, held package) and offers a link. That link leads to a login page imitating the official site. Everything entered there goes straight to the attacker, who uses it immediately to log into the real service.",
        warningSigns: [
          "Sender address that doesn't match the organization's official domain",
          "Request to \"confirm\" or \"verify\" credentials via a link",
          "Urgency or threat of immediate consequences (suspension, penalty)",
          "Impersonal wording (\"Dear customer\") when the organization knows your name",
          "Unexpected attachment, especially a file to enable or authorize",
        ],
        howToVerify:
          "Don't use the link in the message. Open your browser and reach the service through a path you control: a saved bookmark, the official app, or an address you type yourself. If the message was genuine, the information will be there too.",
        whatToDo:
          "Don't click, don't reply, don't download the attachment. Report the message as phishing in your mail client, then delete it.",
        whatToDoIfVictim:
          "Immediately change the password of the affected account, then any other account reusing the same password. Enable two-factor authentication. If banking details were entered, contact your bank without delay. Report the incident to the relevant authority.",
        faq: [
          {
            question: "How can I tell a real email from my bank from a fake one?",
            answer:
              "A bank never asks for your full credentials, your PIN, or a code received by SMS, regardless of the channel. If in doubt, don't use the link: go through the official app or the number on the back of your card.",
          },
          {
            question: "Is it dangerous to have simply opened the email?",
            answer:
              "Opening an email is rarely enough to compromise a device on its own. The risk comes from what happens next: clicking the link, entering information, or opening an attachment.",
          },
          {
            question: "I clicked the link but didn't type anything — what should I do?",
            answer:
              "The main risk stays limited if no information was entered and no file was downloaded. As a precaution, check the account's recent activity and change its password.",
          },
        ],
        whyItWorks:
          "It doesn't bet on your naivety but on your routine: every week you get real emails from your services, and this one looks the same. Urgency does the rest, replacing the question \"is this really them?\" with \"how do I fix this quickly?\".",
        example: {
          setting: "Email received on a Monday morning, apparently from your energy supplier.",
          message:
            "Subject: Your customer account will be deactivated\n\nHello,\nWe were unable to confirm your details. Without action on your part within 24 hours, your customer account will be deactivated.\n\nConfirm my information: https://espace-client.energie-verif.example-not-real.test\n\nCustomer service",
          giveaways: [
            "The link goes to a domain that isn't your supplier's.",
            "A 24-hour deadline with no specific reason.",
            "\"Hello\" without your name, although the supplier knows it.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the message ask you to act through a link or attachment it provides?",
            then: "Use neither: open the service from your bookmark or its app.",
          },
          {
            check: "Once logged in on your own, is the announced alert missing?",
            then: "The message is fake: report it as phishing in your email, then delete it.",
          },
          {
            check: "Have you already clicked and entered a password?",
            then: "Change that password on the real service and sign out of open sessions, right away.",
          },
        ],
        prevention: [
          "Save a bookmark for each sensitive service and only log in through it.",
          "Use a password manager: it suggests nothing on a fake domain.",
          "Turn on two-factor authentication for your email and your bank.",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Phishing (French government cybersecurity assistance service)",
            url: REF.phishing.url,
          },
        ],
        simulationSlug: "bank-email",
      },
    },
  },
  {
    code: "SMS-000001",
    slug: "smishing",
    name: "Smishing (hameçonnage par SMS)",
    categorySlug: "ingenierie-sociale",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Le même piège que l'hameçonnage, mais par SMS. Le message paraît venir de votre banque et le lien mène à une fausse page. Sur un téléphone, l'adresse est tronquée : c'est ce qui rend le SMS plus efficace qu'un email.",
    attackerObjective: "identifiants",
    aliases: ["hameçonnage par SMS", "faux SMS bancaire", "SMS frauduleux"],
    primaryVector: "sms",
    primaryDimension: "sms_scam_recognition",
    simulationSlug: "sms-banque",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "Le smishing est une arnaque par SMS qui imite un organisme de confiance (souvent une banque) pour pousser la victime à cliquer sur un lien frauduleux ou à communiquer des informations sensibles.",
    howItWorks:
      "L'attaquant envoie un SMS qui semble provenir de votre banque, annonçant un problème urgent (carte bloquée, virement suspect). Le message contient un lien vers un faux site qui imite l'interface bancaire, où la victime saisit ses identifiants ou son code de carte, immédiatement récupérés par l'attaquant. Le SMS est un support particulièrement favorable à l'attaquant : l'adresse du lien y est tronquée, l'expéditeur est un simple libellé modifiable, et les messages légitimes et frauduleux se rangent parfois dans le même fil de discussion.",
    warningSigns: [
      "Message non sollicité annonçant un problème urgent",
      "Lien raccourci ou domaine qui ne correspond pas au site officiel de la banque",
      "Demande de saisir un mot de passe ou un code depuis un lien SMS",
      "Délai très court imposé (« sous 30 minutes »)",
      "Message qui apparaît dans le même fil que de vrais SMS de la banque",
    ],
    triggers: ["urgency", "authority", "fear"],
    indicators: [
      "Lien raccourci",
      "Délai imposé",
      "Expéditeur inattendu",
      "Demande d'identifiants",
      "Domaine suspect",
    ],
    howToVerify:
      "Ne cliquez jamais sur le lien reçu. Ouvrez l'application officielle de votre banque ou appelez le numéro figurant au dos de votre carte pour vérifier.",
    whatToDo:
      "Supprimez le SMS. Si vous avez un doute sur votre compte, contactez votre banque via un canal officiel, jamais via le lien reçu. En France, un SMS frauduleux peut être transféré au 33700.",
    whatToDoIfVictim:
      "Contactez immédiatement votre banque pour bloquer votre carte ou votre compte, changez vos mots de passe, et signalez l'arnaque sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Le téléphone est l'endroit où l'on vérifie le moins : petit écran, adresse tronquée, lecture entre deux choses. Le SMS frauduleux se range parfois dans le même fil que les vrais messages de la banque, et il emprunte leur crédibilité.",
    example: {
      setting: "SMS reçu en fin de journée, affiché sous le nom de votre banque.",
      message:
        "Votre carte a été suspendue suite à une opération inhabituelle. Pour la réactiver : bq-securite.example-not-real.test/c/8KQ2",
      giveaways: [
        "Une banque ne fait pas réactiver une carte depuis un lien SMS.",
        "Le domaine n'est pas celui de votre banque.",
        "Aucun détail vérifiable : ni montant, ni commerçant.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le SMS vous envoie-t-il vers un lien pour régler le problème ?",
        then: "Ne l'ouvrez pas. Ouvrez l'application de votre banque ou appelez le numéro au dos de votre carte.",
      },
      {
        check: "Votre banque, jointe par vos propres moyens, ignore-t-elle ce problème ?",
        then: "Le SMS est faux : transférez-le au 33700, puis supprimez-le.",
      },
      {
        check: "Avez-vous saisi votre carte ou un code sur la page ?",
        then: "Appelez votre banque immédiatement pour faire opposition.",
      },
    ],
    prevention: [
      "Considérez qu'un lien reçu par SMS n'est jamais le chemin vers votre banque.",
      "Passez par l'application officielle pour toute question sur votre compte.",
      "Transférez les SMS frauduleux au 33700 pour les signaler.",
    ],
    relatedAttackCodes: [
      "PHISH-000001",
      "SOCIAL-000002",
      "SOCIAL-000001",
      "PAYMENT-000007",
      "MOB-000006",
    ],
    faq: [
      {
        question:
          "Le SMS est apparu dans la même conversation que ceux de ma banque, est-ce possible ?",
        answer:
          "Oui. Le nom d'expéditeur affiché pour un SMS est un simple libellé, qui peut être choisi par l'émetteur. Deux messages portant le même libellé sont regroupés par le téléphone, ce qui place le message frauduleux au milieu des vrais. La place d'un message dans un fil ne prouve donc rien.",
      },
      {
        question: "Faut-il répondre STOP pour ne plus être contacté ?",
        answer:
          "Non. Répondre confirme que le numéro est actif et lu, ce qui augmente le nombre de messages reçus ensuite. Supprimez le message, et transférez-le au 33700 si vous souhaitez le signaler.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "smishing",
        name: "Smishing (SMS phishing)",
        plainLanguageDefinition:
          "The same trap as phishing, but by text message. The message looks like it's from your bank, and the link leads to a fake page. On a phone, the address is truncated — which is what makes SMS more effective than email for this.",
        definition:
          "Smishing is a text-message scam that imitates a trusted organization (often a bank) to push the victim into clicking a fraudulent link or sharing sensitive information.",
        howItWorks:
          "The attacker sends a text message that appears to come from your bank, announcing an urgent problem (blocked card, suspicious transfer). The message contains a link to a fake site imitating the bank's interface, where the victim enters their credentials or card code, immediately captured by the attacker. SMS is a particularly favorable medium for the attacker: the link's address is truncated, the sender is just an editable label, and legitimate and fraudulent messages sometimes land in the same conversation thread.",
        warningSigns: [
          "Unsolicited message announcing an urgent problem",
          "Shortened link or domain that doesn't match the bank's official site",
          "Request to enter a password or code from an SMS link",
          "Very short deadline imposed (\"within 30 minutes\")",
          "Message appearing in the same thread as real texts from the bank",
        ],
        indicators: ["Shortened link", "Imposed deadline", "Unexpected sender", "Request for credentials", "Suspicious domain"],
        howToVerify:
          "Never click the link you received. Open your bank's official app or call the number on the back of your card to verify.",
        whatToDo:
          "Delete the text. If you have doubts about your account, contact your bank through an official channel, never through the received link.",
        whatToDoIfVictim:
          "Immediately contact your bank to block your card or account, change your passwords, and report the scam to the relevant authority.",
        faq: [
          {
            question: "The text appeared in the same conversation as my bank's real messages — how is that possible?",
            answer:
              "Yes, it's possible. The sender name shown for a text message is just a label, which can be chosen by the sender. Two messages carrying the same label get grouped by the phone, placing the fraudulent message right among the real ones. A message's position in a thread proves nothing.",
          },
          {
            question: "Should I reply STOP to avoid being contacted again?",
            answer:
              "No. Replying confirms the number is active and being read, which increases the number of messages received afterward. Delete the message and report it through your carrier's fraud-reporting channel if you want to flag it.",
          },
        ],
        whyItWorks:
          "The phone is where we check least: small screen, truncated address, reading between two other things. The fraudulent text sometimes lands in the same thread as the bank's real messages, and borrows their credibility.",
        example: {
          setting: "Text message received at the end of the day, shown under your bank's name.",
          message:
            "Your card has been suspended following unusual activity. To reactivate it: bq-securite.example-not-real.test/c/8KQ2",
          giveaways: [
            "A bank doesn't have you reactivate a card from a text link.",
            "The domain isn't your bank's.",
            "No verifiable detail: no amount, no merchant.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the text send you to a link to fix the problem?",
            then: "Don't open it. Open your bank's app or call the number on the back of your card.",
          },
          {
            check: "Does your bank, reached on your own, know nothing about this problem?",
            then: "The text is fake: forward it to your carrier's spam-reporting number (33700 in France), then delete it.",
          },
          {
            check: "Did you enter your card or a code on the page?",
            then: "Call your bank immediately to block the card.",
          },
        ],
        prevention: [
          "Assume a link received by text is never the way to your bank.",
          "Use the official app for any question about your account.",
          "Forward fraudulent texts to your carrier's spam-reporting number (33700 in France).",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Phishing (French government cybersecurity assistance service)",
            url: REF.phishing.url,
          },
        ],
        simulationSlug: "bank-sms",
      },
    },
  },
  {
    code: "SOCIAL-000003",
    slug: "faux-support-technique",
    name: "Faux support technique",
    categorySlug: "ingenierie-sociale",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une alerte plein écran annonce que votre ordinateur est infecté et affiche un numéro à appeler. Au bout du fil, un faux technicien vous fait installer un logiciel qui lui donne la main sur votre machine.",
    attackerObjective: "controle_d_un_appareil",
    aliases: [
      "arnaque au support technique",
      "faux technicien",
      "arnaque au dépannage informatique",
    ],
    primaryVector: "phone",
    primaryDimension: "social_engineering_resistance",
    simulationSlug: "alerte-support-technique",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "L'arnaque au faux support technique fait croire que votre ordinateur est infecté ou bloqué, afin d'obtenir un accès à distance à la machine ou le paiement d'une assistance inutile.",
    howItWorks:
      "Le point de départ est souvent une page web affichant une alerte alarmante, parfois accompagnée d'un son et d'un message empêchant de fermer la fenêtre, avec un numéro à appeler. Au téléphone, un interlocuteur se présentant comme technicien demande d'installer un logiciel de prise en main à distance — outil légitime, détourné de son usage. Une fois connecté, il montre des éléments anodins du système présentés comme des preuves d'infection, puis facture une intervention, souscrit un abonnement, ou installe un logiciel malveillant.",
    warningSigns: [
      "Page web ou fenêtre affichant une alerte de sécurité avec un numéro de téléphone à appeler",
      "Impossibilité apparente de fermer la fenêtre d'alerte",
      "Demande d'installer un outil de prise de contrôle à distance",
      "Éditeur légitime invoqué (système d'exploitation, antivirus) alors qu'aucun éditeur n'appelle spontanément",
      "Paiement demandé par carte, virement ou cartes prépayées",
    ],
    triggers: ["fear", "authority"],
    indicators: [],
    howToVerify:
      "Aucun éditeur de logiciel ni fournisseur d'accès ne détecte une infection sur votre machine à distance pour vous appeler ensuite. Une alerte affichée dans un navigateur est une page web, pas un diagnostic de votre appareil : fermez l'onglet, au besoin en fermant le navigateur.",
    whatToDo:
      "N'appelez pas le numéro affiché, n'installez aucun logiciel de prise en main. Fermez le navigateur et, si nécessaire, redémarrez l'appareil.",
    whatToDoIfVictim:
      "Déconnectez l'appareil d'internet, désinstallez tout outil de prise à distance installé pendant l'appel et faites analyser la machine. Changez vos mots de passe depuis un autre appareil sain, en commençant par la messagerie et la banque. Faites opposition si un paiement a été effectué, et signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "L'alerte provoque une peur immédiate — données perdues, ordinateur piraté — et propose aussitôt la solution : un numéro. Au téléphone, un interlocuteur assuré et technique paraît compétent, et montrer des éléments réels du système donne l'apparence d'une preuve à un diagnostic inventé.",
    example: {
      setting: "Pendant une recherche sur internet, le navigateur passe en plein écran avec un signal sonore.",
      message:
        "ALERTE DE SÉCURITÉ — Votre ordinateur est bloqué. Des logiciels espions ont été détectés. Ne fermez pas cette page.\nContactez immédiatement le support technique au [numéro affiché] pour éviter la perte de vos données.",
      giveaways: [
        "Une page web ne peut pas analyser votre ordinateur.",
        "Aucun éditeur n'affiche un numéro à appeler dans une alerte.",
        "L'injonction de ne pas fermer la page vise à vous empêcher de le faire.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'alerte vous demande-t-elle d'appeler un numéro ?",
        then: "N'appelez pas : fermez l'onglet, ou le navigateur entier s'il ne se ferme pas.",
      },
      {
        check: "L'alerte réapparaît-elle à la réouverture du navigateur ?",
        then: "Ne restaurez pas les onglets précédents ; si elle persiste, faites vérifier l'appareil par une personne de confiance.",
      },
      {
        check: "Avez-vous installé un logiciel ou laissé quelqu'un prendre la main ?",
        then: "Déconnectez l'appareil d'internet et suivez la checklist d'urgence.",
      },
    ],
    prevention: [
      "Retenez qu'aucun éditeur ne vous contacte pour une infection qu'il aurait détectée.",
      "N'installez jamais un logiciel de prise en main à distance à la demande de quelqu'un que vous n'avez pas contacté vous-même.",
      "Notez le contact d'une personne de confiance à appeler en cas de doute.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000001",
      "WEB-000002",
      "ACCT-000003",
      "SOCIAL-000006",
      "WEB-000004",
      "AI-000006",
      "MAL-000010",
    ],
    faq: [
      {
        question:
          "Le technicien m'a montré des erreurs dans le système, ce n'était pas réel ?",
        answer:
          "Les éléments affichés sont généralement des journaux d'événements normaux, présents sur toute machine en bon état, présentés comme des preuves d'infection. C'est un procédé de mise en scène, pas un diagnostic.",
      },
      {
        question:
          "J'ai laissé quelqu'un prendre la main sur mon ordinateur, que risque-t-il d'avoir vu ?",
        answer:
          "Tout ce qui était accessible sur la session : fichiers, messagerie, mots de passe enregistrés dans le navigateur, sessions ouvertes. Changez vos mots de passe depuis un autre appareil et faites vérifier la machine.",
      },
    ],
    references: [REF.fakeSupport],
    translations: {
      en: {
        slug: "fake-tech-support",
        name: "Fake tech support",
        plainLanguageDefinition:
          "A full-screen alert claims your computer is infected and displays a number to call. On the phone, a fake technician talks you into installing software that hands them control of your machine.",
        definition:
          "The fake tech support scam makes you believe your computer is infected or locked, in order to gain remote access to the machine or get you to pay for unnecessary assistance.",
        howItWorks:
          "The starting point is often a webpage showing an alarming alert, sometimes with sound and a message preventing you from closing the window, along with a number to call. On the phone, someone presenting themselves as a technician asks you to install remote-access software — a legitimate tool, misused. Once connected, they point to harmless system elements presented as proof of infection, then charge for an intervention, sign you up for a subscription, or install malware.",
        warningSigns: [
          "Webpage or window displaying a security alert with a phone number to call",
          "Apparent inability to close the alert window",
          "Request to install a remote-control tool",
          "A legitimate vendor invoked (operating system, antivirus) when no vendor ever calls spontaneously",
          "Payment requested by card, transfer, or prepaid cards",
        ],
        howToVerify:
          "No software publisher or internet provider remotely detects an infection on your machine and then calls you about it. An alert shown in a browser is a webpage, not a diagnosis of your device: close the tab, closing the browser entirely if needed.",
        whatToDo:
          "Don't call the number shown, don't install any remote-access software. Close the browser and, if necessary, restart the device.",
        whatToDoIfVictim:
          "Disconnect the device from the internet, uninstall any remote-access tool installed during the call, and have the machine scanned. From another, clean device, change your passwords, starting with email and banking. Dispute any payment made, and report the incident to the relevant authority.",
        faq: [
          {
            question: "The technician showed me errors in the system — wasn't that real?",
            answer:
              "The items shown are usually normal event logs, present on any healthy machine, presented as proof of infection. It's a staging technique, not a diagnosis.",
          },
          {
            question: "I let someone take control of my computer — what might they have seen?",
            answer:
              "Everything accessible in that session: files, email, passwords saved in the browser, open sessions. Change your passwords from another device and have the machine checked.",
          },
        ],
        whyItWorks:
          "The alert triggers instant fear — lost data, a hacked computer — and immediately offers the solution: a phone number. On the phone, a confident, technical voice sounds competent, and showing real parts of the system makes an invented diagnosis look proven.",
        example: {
          setting: "While searching online, the browser goes full screen with a warning sound.",
          message:
            "SECURITY ALERT — Your computer has been blocked. Spyware has been detected. Do not close this page.\nCall technical support immediately at [number shown] to avoid losing your data.",
          giveaways: [
            "A web page can't scan your computer.",
            "No software company puts a phone number to call in an alert.",
            "The order not to close the page is there to stop you from closing it.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the alert ask you to call a number?",
            then: "Don't call: close the tab, or the whole browser if the tab won't close.",
          },
          {
            check: "Does the alert come back when you reopen the browser?",
            then: "Don't restore the previous tabs; if it persists, have someone you trust check the device.",
          },
          {
            check: "Did you install software or let someone take control?",
            then: "Disconnect the device from the internet and follow the emergency checklist.",
          },
        ],
        prevention: [
          "Remember that no software company contacts you about an infection it supposedly detected.",
          "Never install remote-access software at the request of someone you didn't contact yourself.",
          "Write down the contact details of someone you trust to call when in doubt.",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Fake tech support (French government cybersecurity assistance service)",
            url: REF.fakeSupport.url,
          },
        ],
        simulationSlug: "tech-support-alert",
      },
    },
  },
  {
    code: "SOCIAL-000004",
    slug: "arnaque-sentimentale",
    name: "Arnaque sentimentale",
    categorySlug: "ingenierie-sociale",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une relation qui se construit pendant des semaines en ligne, puis une première demande d'argent présentée comme exceptionnelle. La rencontre est toujours repoussée, et les demandes se répètent.",
    attackerObjective: "argent",
    aliases: [
      "escroquerie sentimentale",
      "arnaque à l'amour",
      "romance scam",
      "brouteur",
    ],
    primaryVector: "social_media",
    primaryDimension: "social_engineering_resistance",
    simulationSlug: "message-relation-en-ligne",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "L'arnaque sentimentale consiste à construire une relation affective à distance, sur plusieurs semaines ou plusieurs mois, avant de demander de l'argent sous un prétexte présenté comme exceptionnel et temporaire.",
    howItWorks:
      "Le contact commence sur un site de rencontre ou un réseau social, avec un profil soigné mais impossible à recouper ailleurs. L'échange est intense et quotidien, et la relation devient rapidement le sujet principal de la conversation. La rencontre physique est toujours reportée, avec une raison plausible : mission à l'étranger, profession qui interdit les appels vidéo, situation familiale. La demande d'argent n'arrive qu'ensuite, présentée comme un imprévu — frais médicaux, douane, blocage bancaire — et accompagnée d'une promesse de remboursement. Elle se répète ensuite, chaque nouvelle somme étant justifiée par la précédente. Le levier n'est pas la crédulité : c'est l'engagement affectif construit avant toute demande.",
    warningSigns: [
      "Refus systématique de l'appel vidéo ou de la rencontre, avec une justification différente à chaque fois",
      "Relation qui progresse très vite vers des déclarations fortes",
      "Photos et profil que l'on ne retrouve nulle part ailleurs, ou retrouvés sous une autre identité",
      "Première demande d'argent présentée comme unique, urgente et remboursable",
      "Demande de discrétion vis-à-vis de l'entourage",
    ],
    triggers: ["trust", "urgency", "social_pressure"],
    indicators: [],
    howToVerify:
      "Proposez un appel vidéo non planifié : un refus répété est en soi une réponse. L'inverse n'est pas vrai — un appel accepté ne prouve plus l'identité, un visage et une voix pouvant être synthétisés en direct. Recherchez les photos du profil sur un moteur de recherche d'images, et parlez de la relation à une personne de confiance avant tout envoi d'argent — l'isolement est une condition de réussite de cette fraude. La vérification qui tranche reste l'argent : une personne réelle ne fait pas dépendre la relation d'un virement.",
    whatToDo:
      "N'envoyez pas d'argent, quelle que soit la raison invoquée et quel que soit le lien construit. Ne transmettez ni documents d'identité, ni photos intimes, ni coordonnées bancaires.",
    whatToDoIfVictim:
      "Cessez tout envoi et conservez l'intégralité des échanges, y compris les coordonnées bancaires utilisées. Contactez votre banque pour tenter un rappel des fonds si le virement est récent, et déposez plainte. Signalez les faits sur cybermalveillance.gouv.fr. Le fait d'avoir été manipulé affectivement n'est pas une faute et ne retire aucun droit.",
    whyItWorks:
      "La fraude ne commence pas par une demande mais par des semaines d'attention, jusqu'à ce que la relation compte. Au moment de la première demande, refuser revient à douter de quelqu'un à qui l'on tient, et chaque somme versée rend la suivante plus difficile à refuser.",
    example: {
      setting: "Échanges quotidiens depuis deux mois avec une personne rencontrée sur un réseau social, qui dit travailler sur une plateforme en mer.",
      message:
        "« Je n'ai jamais rencontré quelqu'un comme toi. Mon salaire est bloqué jusqu'à la fin de la mission et je dois payer 1 400 € de frais pour mon visa, sinon je ne pourrai pas venir te voir. Je te rembourse dès mon arrivée, promis. N'en parle à personne, ils ne comprendraient pas. »",
      giveaways: [
        "La rencontre dépend d'un paiement.",
        "La discrétion est demandée envers l'entourage.",
        "Le métier invoqué explique d'avance l'absence d'appel vidéo.",
      ],
    },
    decisionChecklist: [
      {
        check: "La personne a-t-elle déjà refusé ou reporté un appel vidéo ?",
        then: "Proposez-en un sans prévenir ; un refus répété est une réponse.",
      },
      {
        check: "Retrouvez-vous ses photos ailleurs, sous un autre nom ?",
        then: "Le profil est usurpé : cessez l'échange.",
      },
      {
        check: "Une somme vous est-elle demandée, même présentée comme remboursable ?",
        then: "N'envoyez rien, et parlez-en à une personne de confiance avant toute décision.",
      },
    ],
    prevention: [
      "Parlez de toute relation en ligne à un proche dès qu'elle devient importante : l'isolement est la condition de cette fraude.",
      "Fixez-vous une règle : pas d'argent à une personne jamais rencontrée.",
      "Ne transmettez ni photos intimes ni documents d'identité à un contact en ligne.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000005",
      "PAYMENT-000003",
      "ACCT-000003",
      "SOCIAL-000011",
      "PERS-000001",
      "AI-000003",
      "AI-000008",
    ],
    faq: [
      {
        question:
          "Nous nous parlons depuis des mois, est-ce vraiment une arnaque ?",
        answer:
          "La durée fait partie du procédé, elle ne l'exclut pas : l'investissement affectif rend la demande crédible au moment où elle arrive. Le critère utile n'est pas l'ancienneté de la relation, mais le fait qu'aucune vérification indépendante — rencontre, tiers de confiance mis dans la boucle — n'ait jamais pu aboutir, et qu'une demande d'argent finisse par arriver.",
      },
      {
        question:
          "On me demande de recevoir puis de renvoyer de l'argent, est-ce risqué ?",
        answer:
          "Oui, doublement. Ces fonds proviennent souvent d'une autre fraude, et le compte qui les reçoit sert à brouiller leur trace. Au-delà de la perte, cela expose à des poursuites pour blanchiment. Refusez, et n'ouvrez jamais un compte pour un tiers.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "romance-scam",
        name: "Romance scam",
        plainLanguageDefinition:
          "A relationship built up over weeks online, then a first request for money presented as exceptional. Meeting in person is always postponed, and the requests keep repeating.",
        definition:
          "The romance scam consists of building an emotional, long-distance relationship over several weeks or months, before asking for money under a pretext presented as exceptional and temporary.",
        howItWorks:
          "Contact begins on a dating site or social network, with a polished profile that can't be cross-checked anywhere else. The exchange is intense and daily, and the relationship quickly becomes the main topic of conversation. Meeting in person is always postponed, with a plausible reason: an overseas assignment, a job that forbids video calls, a family situation. The request for money only comes afterward, presented as an unexpected event — medical costs, customs fees, a frozen bank account — accompanied by a promise of repayment. It then repeats, each new sum justified by the previous one. The lever isn't gullibility: it's the emotional commitment built before any request.",
        warningSigns: [
          "Systematic refusal of video calls or meeting in person, with a different excuse each time",
          "Relationship that progresses very fast toward strong declarations",
          "Photos and profile that can't be found anywhere else, or found under a different identity",
          "First request for money presented as unique, urgent, and repayable",
          "Request for discretion toward friends and family",
        ],
        howToVerify:
          "Suggest an unplanned video call: a repeated refusal is itself an answer. The reverse isn't true — an accepted call no longer proves identity, since a face and voice can be synthesized live. Search for the profile's photos on a reverse image search, and talk about the relationship with someone you trust before sending any money — isolation is a condition for this fraud to succeed. The verification that settles it is money: a real person doesn't make the relationship depend on a transfer.",
        whatToDo:
          "Don't send money, whatever the reason given and whatever bond has been built. Don't share identity documents, intimate photos, or banking details.",
        whatToDoIfVictim:
          "Stop all payments and keep every exchange, including the banking details used. Contact your bank to attempt a recall of funds if the transfer is recent, and file a police report. Report the incident to the relevant authority. Having been emotionally manipulated is not a fault and takes away none of your rights.",
        faq: [
          {
            question: "We've been talking for months — is this really a scam?",
            answer:
              "The duration is part of the method, it doesn't rule it out: the emotional investment is what makes the request credible when it arrives. The useful criterion isn't how long the relationship has lasted, but the fact that no independent verification — a meeting, a trusted third party brought into the loop — has ever succeeded, and that a request for money eventually arrives.",
          },
          {
            question: "I'm being asked to receive money and then forward it — is that risky?",
            answer:
              "Yes, doubly so. These funds often come from another fraud, and the account that receives them helps obscure their trail. Beyond the loss, this exposes you to money-laundering prosecution. Refuse, and never open an account for someone else.",
          },
        ],
        whyItWorks:
          "The fraud doesn't begin with a request but with weeks of attention, until the relationship matters. By the time the first request comes, refusing means doubting someone you care about, and every sum sent makes the next one harder to refuse.",
        example: {
          setting: "Daily conversations for two months with someone met on a social network, who says they work on an offshore platform.",
          message:
            "\"I've never met anyone like you. My salary is frozen until the end of the assignment and I have to pay €1,400 in visa fees, otherwise I can't come and see you. I'll pay you back as soon as I arrive, I promise. Don't tell anyone, they wouldn't understand.\"",
          giveaways: [
            "Meeting in person depends on a payment.",
            "You're asked to keep it from the people around you.",
            "The job described explains in advance why there's never a video call.",
          ],
        },
        decisionChecklist: [
          {
            check: "Has the person already refused or postponed a video call?",
            then: "Suggest one without warning; a repeated refusal is an answer.",
          },
          {
            check: "Do their photos appear elsewhere, under another name?",
            then: "The profile is stolen: stop the conversation.",
          },
          {
            check: "Are you being asked for money, even presented as a loan?",
            then: "Send nothing, and talk to someone you trust before deciding anything.",
          },
        ],
        prevention: [
          "Tell someone close to you about any online relationship as soon as it becomes important: isolation is what this fraud needs.",
          "Set yourself a rule: no money to someone you've never met.",
          "Never send intimate photos or identity documents to an online contact.",
        ],
        references: [
          { label: "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)", url: REF.cybermalveillance.url },
        ],
        simulationSlug: "online-relationship-message",
      },
    },
  },
  {
    code: "SOCIAL-000005",
    slug: "usurpation-d-un-proche",
    name: "Usurpation d'un proche par messagerie",
    categorySlug: "ingenierie-sociale",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un message d'un numéro inconnu : « c'est moi, j'ai changé de numéro ». Suit une facture urgente à régler à sa place. La personne refuse toujours d'appeler, et pour cause : ce n'est pas votre proche.",
    attackerObjective: "argent",
    aliases: [
      "arnaque au faux proche",
      "arnaque « bonjour maman »",
      "faux message d'un proche",
    ],
    primaryVector: "messaging_app",
    primaryDimension: "identity_verification",
    simulationSlug: "message-proche-nouveau-numero",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "L'usurpation d'un proche est un message reçu sur une application de messagerie, présenté comme venant d'un membre de la famille qui aurait changé de numéro, et demandant de régler une somme à sa place.",
    howItWorks:
      "Le message arrive d'un numéro inconnu et s'ouvre sur une explication qui justifie à la fois l'inconnu et l'urgence : « c'est maman, j'ai cassé mon téléphone, voici mon nouveau numéro ». Suit une demande concrète — une facture à payer avant ce soir, un virement à faire car le nouveau téléphone n'a pas encore accès à l'application bancaire. Le scénario est construit pour que chaque question trouve d'avance une réponse, et pour rendre l'appel téléphonique impossible : l'attaquant explique que le micro est cassé, ou qu'il est en réunion. C'est exactement cet élément qui identifie l'attaque, car appeler est la seule vérification qui fonctionne.",
    warningSigns: [
      "Message d'un numéro inconnu se présentant comme un proche ayant changé de numéro",
      "Demande d'argent dans les premiers échanges",
      "Refus ou impossibilité de passer un appel vocal, sous un prétexte technique",
      "Coordonnées bancaires transmises dans la conversation, au nom d'un tiers",
      "Insistance sur le caractère urgent et sur la discrétion",
    ],
    triggers: ["trust", "urgency", "social_pressure"],
    indicators: [],
    howToVerify:
      "Appelez la personne sur son ancien numéro, celui que vous avez déjà dans vos contacts. S'il ne répond pas, appelez un autre membre de la famille. Ne validez jamais un changement de numéro depuis le nouveau numéro lui-même : cela revient à demander à l'inconnu de confirmer qu'il est bien votre proche.",
    whatToDo:
      "N'effectuez aucun paiement avant d'avoir eu la personne de vive voix. Une demande réelle survivra à dix minutes de vérification.",
    whatToDoIfVictim:
      "Contactez votre banque immédiatement : un virement récent peut parfois faire l'objet d'une demande de rappel. Conservez la conversation et l'IBAN communiqué, puis déposez plainte. Prévenez le proche usurpé, car les mêmes messages sont souvent envoyés à plusieurs personnes de son entourage.",
    whyItWorks:
      "Le message s'adresse à votre affection, pas à votre crédulité : on veut aider un proche en difficulté, et vite. Le changement de numéro explique à lui seul l'expéditeur inconnu, et chaque prétexte pour ne pas appeler est préparé à l'avance.",
    example: {
      setting: "Message reçu sur une messagerie, d'un numéro inconnu.",
      message:
        "Coucou c'est moi, j'ai fait tomber mon téléphone, voici mon nouveau numéro. Tu peux m'aider ? J'ai une facture de 980 € à régler aujourd'hui et ma banque ne marche pas sur ce téléphone. Je te rembourse demain. Je ne peux pas appeler, le micro est cassé.",
      giveaways: [
        "Le message ne dit jamais qui écrit : il laisse votre esprit compléter.",
        "Une demande d'argent dès les premiers messages.",
        "Une raison toute prête pour ne pas appeler.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le message vient-il d'un numéro qui n'est pas dans vos contacts ?",
        then: "Appelez la personne sur son ancien numéro, celui que vous connaissez.",
      },
      {
        check: "La personne refuse-t-elle un appel vocal ?",
        then: "Ne payez rien : c'est la signature de cette fraude.",
      },
      {
        check: "Avez-vous déjà fait le virement ?",
        then: "Appelez votre banque immédiatement : un virement très récent peut parfois faire l'objet d'une demande de rappel.",
      },
    ],
    prevention: [
      "Convenez en famille d'un réflexe : un nouveau numéro se confirme par un appel à l'ancien.",
      "Choisissez une question ou un mot de passe familial connu de vous seuls.",
      "Prévenez les membres de la famille qui pourraient recevoir le même message.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000004",
      "ACCT-000003",
      "PAYMENT-000004",
      "SOCIAL-000009",
      "PERS-000007",
      "ACCT-000010",
      "AI-000002",
    ],
    faq: [
      {
        question: "Le message connaissait mon prénom et des détails familiaux.",
        answer:
          "Ces éléments sont fréquemment publics : réseaux sociaux, faire-part, annuaires, ou messagerie d'un proche déjà compromise. Un détail exact n'est pas une preuve d'identité — seule la voix, sur un numéro que vous connaissiez déjà, en est une.",
      },
      {
        question: "Que faire du numéro utilisé par l'attaquant ?",
        answer:
          "Bloquez-le et signalez la conversation dans l'application, qui dispose d'une fonction dédiée. Conservez-en une capture avant de bloquer : elle est utile au dépôt de plainte.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "impersonating-a-relative",
        name: "Impersonating a relative by message",
        plainLanguageDefinition:
          "A message from an unknown number: \"it's me, I got a new number.\" Followed by an urgent bill to pay on their behalf. The person always refuses to call — for good reason: it isn't your relative.",
        definition:
          "Impersonating a relative is a message received on a messaging app, presented as coming from a family member who supposedly changed their number, asking you to pay an amount on their behalf.",
        howItWorks:
          "The message arrives from an unknown number and opens with an explanation that justifies both the unknown number and the urgency: \"it's mom, I broke my phone, here's my new number.\" A concrete request follows — a bill to pay before tonight, a transfer to make because the new phone doesn't have banking-app access yet. The scenario is built so every question already has an answer ready, and to make a phone call impossible: the attacker explains the microphone is broken, or that they're in a meeting. That's exactly the element that identifies the attack, because calling is the only verification that works.",
        warningSigns: [
          "Message from an unknown number claiming to be a relative who changed numbers",
          "Request for money within the first exchanges",
          "Refusal or inability to take a voice call, under a technical pretext",
          "Banking details shared in the conversation, in a third party's name",
          "Insistence on urgency and discretion",
        ],
        howToVerify:
          "Call the person on their old number, the one already in your contacts. If they don't answer, call another family member. Never confirm a number change from the new number itself — that amounts to asking the stranger to confirm they really are your relative.",
        whatToDo:
          "Don't make any payment before hearing the person's voice directly. A genuine request will survive ten minutes of verification.",
        whatToDoIfVictim:
          "Contact your bank immediately: a recent transfer can sometimes be recalled. Keep the conversation and the IBAN shared, then file a police report. Warn the impersonated relative, since the same messages are often sent to several people around them.",
        faq: [
          {
            question: "The message knew my first name and family details.",
            answer:
              "These details are often public: social media, announcements, directories, or a relative's already-compromised messaging account. An accurate detail is not proof of identity — only a voice, on a number you already knew, is.",
          },
          {
            question: "What should I do with the number the attacker used?",
            answer:
              "Block it and report the conversation in the app, which has a dedicated feature for this. Take a screenshot before blocking: it's useful for a police report.",
          },
        ],
        whyItWorks:
          "The message speaks to your affection, not your gullibility: you want to help someone close who's in trouble, and fast. The new number alone explains the unknown sender, and every excuse not to call is prepared in advance.",
        example: {
          setting: "Message received on a messaging app, from an unknown number.",
          message:
            "Hi it's me, I dropped my phone, this is my new number. Can you help? I have a €980 bill to pay today and my bank doesn't work on this phone. I'll pay you back tomorrow. I can't call, the mic is broken.",
          giveaways: [
            "The message never says who's writing: it lets your mind fill in the name.",
            "A request for money within the first messages.",
            "A ready-made reason not to call.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the message come from a number that isn't in your contacts?",
            then: "Call the person on their old number, the one you know.",
          },
          {
            check: "Does the person refuse a voice call?",
            then: "Pay nothing: that's the signature of this fraud.",
          },
          {
            check: "Have you already made the transfer?",
            then: "Call your bank immediately: a very recent transfer can sometimes be recalled.",
          },
        ],
        prevention: [
          "Agree on a family reflex: a new number is confirmed by calling the old one.",
          "Choose a question or family password that only you know.",
          "Warn family members who could receive the same message.",
        ],
        references: [
          { label: "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)", url: REF.cybermalveillance.url },
        ],
        simulationSlug: "relative-new-number-message",
      },
    },
  },
  {
    code: "SOCIAL-000006",
    slug: "vishing",
    simulationSlug: "appel-service-fraude",
    name: "Vishing (hameçonnage par téléphone)",
    categorySlug: "ingenierie-sociale",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Le hameçonnage par la voix. Rien n'est écrit, rien ne peut être relu, et l'interlocuteur avance à son rythme pendant que vous devez répondre au vôtre. C'est ce déséquilibre qui fait tout.",
    attackerObjective: "identifiants",
    aliases: [
      "hameçonnage vocal",
      "hameçonnage téléphonique",
      "voice phishing",
      "arnaque par appel téléphonique",
    ],
    primaryVector: "phone",
    primaryDimension: "social_engineering_resistance",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le vishing désigne l'hameçonnage mené par appel téléphonique : un interlocuteur se présente comme un organisme de confiance et obtient, au cours de la conversation, des informations ou des actions qu'un message écrit n'aurait pas obtenues.",
    howItWorks:
      "Le téléphone retire à la victime tout ce sur quoi elle s'appuie ailleurs. Il n'y a pas d'adresse d'expéditeur à examiner, pas de lien à survoler, pas de texte à relire à tête reposée : la décision doit être prise pendant que l'autre parle. L'appelant contrôle le rythme, et le silence qu'il laisse après une demande pèse plus qu'un argument. Le numéro affiché ne prouve rien, car il peut être falsifié, mais il est perçu comme une preuve. La conversation elle-même produit de la confiance : un interlocuteur poli qui connaît votre nom et deux détails exacts paraît légitime, alors que ces détails proviennent souvent d'une fuite de données antérieure. Les scénarios varient — banque, administration, support informatique, opérateur — mais le levier est constant : obtenir une action tant que la ligne est ouverte.",
    warningSigns: [
      "Appel non sollicité demandant de communiquer, saisir ou valider quelque chose immédiatement",
      "Insistance pour rester en ligne pendant l'action demandée",
      "Refus ou dissuasion lorsque vous proposez de rappeler vous-même",
      "Numéro affiché correspondant à un organisme connu, présenté comme une preuve d'identité",
      "Interlocuteur qui connaît quelques informations exactes vous concernant et s'en sert comme caution",
      "Motif construit pour justifier le secret : enquête en cours, procédure confidentielle",
    ],
    triggers: ["authority", "urgency", "trust"],
    indicators: [],
    howToVerify:
      "Reprendre l'initiative de l'appel est la seule vérification qui fonctionne au téléphone, et elle fonctionne toujours. Raccrochez, puis composez vous-même un numéro que vous possédiez déjà — au dos d'une carte, dans une application officielle, sur un courrier reçu. Attendez quelques minutes ou utilisez une autre ligne : une ligne peut rester ouverte si vous ne raccrochez pas franchement.",
    whatToDo:
      "Ne communiquez aucun code, aucun mot de passe, aucune information bancaire pendant un appel entrant. N'installez rien et ne validez aucune notification à la demande de quelqu'un qui vous appelle. Aucun interlocuteur légitime ne vous reprochera de rappeler.",
    whatToDoIfVictim:
      "Selon ce qui a été communiqué : contactez votre banque pour faire opposition, changez immédiatement les mots de passe concernés depuis un autre appareil, révoquez les sessions actives. Notez l'heure de l'appel et le numéro affiché, puis déposez plainte. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Au téléphone, on ne peut ni relire, ni comparer, ni prendre son temps : la politesse pousse à répondre au rythme de l'autre. Le numéro affiché et quelques informations exactes suffisent à installer une confiance que rien, dans l'appel lui-même, ne permet de contrôler.",
    example: {
      setting: "Appel reçu en semaine ; le numéro affiché est celui de votre opérateur.",
      message:
        "« Bonjour, service sécurité de votre opérateur. Nous détectons une demande de transfert de votre ligne. Pour l'annuler, je vous envoie un code : pouvez-vous me le lire dès réception ? Surtout, ne raccrochez pas, la procédure serait perdue. »",
      giveaways: [
        "On vous demande de lire un code reçu : c'est précisément ce que l'appelant cherche à obtenir.",
        "L'interdiction de raccrocher empêche la seule vérification qui fonctionne.",
        "Le numéro affiché peut être falsifié.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'appel vous demande-t-il un code, un mot de passe, une validation ou une installation ?",
        then: "Refusez et raccrochez : aucun service ne le demande lors d'un appel qu'il a lui-même passé.",
      },
      {
        check: "L'interlocuteur insiste-t-il pour que vous restiez en ligne ?",
        then: "C'est un signal en soi : raccrochez franchement.",
      },
      {
        check: "Un doute subsiste-t-il après avoir raccroché ?",
        then: "Rappelez l'organisme vous-même, sur un numéro que vous possédiez déjà : seule sa réponse fait foi.",
      },
    ],
    prevention: [
      "Fixez-vous une règle simple : on ne valide rien pendant un appel entrant.",
      "Enregistrez dans vos contacts les numéros de votre banque et de votre opérateur, recopiés depuis vos documents.",
      "Expliquez cette règle aux proches qui reçoivent beaucoup d'appels : elle tient en une phrase.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000001",
      "SOCIAL-000003",
      "SOCIAL-000010",
      "PHISH-000001",
      "SOCIAL-000007",
      "AI-000002",
      "DATA-000008",
    ],
    faq: [
      {
        question:
          "Quelle différence avec la fiche « faux conseiller bancaire » ?",
        answer:
          "Cette page décrit la technique — pourquoi le téléphone est un terrain favorable à l'attaquant, quel que soit le prétexte. La fiche « faux conseiller bancaire » décrit un scénario précis, celui de l'appel du prétendu service anti-fraude, avec ses signaux et sa marche à suivre propres.",
      },
      {
        question: "Comment savoir si un appel de ma banque est authentique ?",
        answer:
          "Vous ne pouvez pas le savoir pendant l'appel, et c'est pour cela que la question ne se pose pas ainsi. Raccrochez et rappelez le numéro figurant au dos de votre carte : si la demande était réelle, elle sera confirmée ; si elle ne l'était pas, vous n'aurez rien perdu.",
      },
      {
        question: "L'appelant connaissait mon nom et mes dernières opérations.",
        answer:
          "Des informations exactes peuvent provenir d'une fuite de données antérieure, d'un compte compromis ou d'un courrier intercepté. Elles rendent l'appel crédible sans rien prouver : la connaissance d'un détail n'est pas une preuve d'identité.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "vishing",
        name: "Vishing (voice phishing)",
        plainLanguageDefinition:
          "Phishing by voice. Nothing is written, nothing can be reread, and the caller moves at their own pace while you have to respond at yours. That imbalance is what makes it work.",
        definition:
          "Vishing refers to phishing carried out by phone call: a caller presents themselves as a trusted organization and obtains, during the conversation, information or actions a written message wouldn't have obtained.",
        howItWorks:
          "The phone strips the victim of everything they'd rely on elsewhere. There's no sender address to examine, no link to hover over, no text to reread with a clear head: the decision has to be made while the other person is talking. The caller controls the pace, and the silence they leave after a request weighs more than an argument. The number shown proves nothing, since it can be spoofed, but it's perceived as proof. The conversation itself builds trust: a polite caller who knows your name and two accurate details seems legitimate, though those details often come from an earlier data leak. Scenarios vary — bank, government agency, tech support, carrier — but the lever stays constant: get an action while the line is still open.",
        warningSigns: [
          "Unsolicited call asking you to share, enter, or validate something immediately",
          "Insistence on staying on the line while the requested action happens",
          "Refusal or discouragement when you offer to call back yourself",
          "Number displayed matching a known organization, presented as proof of identity",
          "Caller who knows a few accurate details about you and uses them as credibility",
          "A pretext built to justify secrecy: an ongoing investigation, a confidential procedure",
        ],
        howToVerify:
          "Taking back the initiative of the call is the only verification that works on the phone, and it always works. Hang up, then dial a number you already had — on the back of a card, in an official app, on a letter you received. Wait a few minutes or use another line: a line can stay open if you don't hang up firmly.",
        whatToDo:
          "Don't share any code, password, or banking information during an incoming call. Don't install anything and don't approve any notification at the request of someone calling you. No legitimate caller will hold it against you for calling back.",
        whatToDoIfVictim:
          "Depending on what was shared: contact your bank to block the card, immediately change the affected passwords from another device, revoke active sessions. Note the time of the call and the number displayed, then file a police report. Report the incident to the relevant authority.",
        faq: [
          {
            question: "What's the difference with the \"fake bank advisor\" fiche?",
            answer:
              "This page describes the technique — why the phone is favorable ground for the attacker, whatever the pretext. The \"fake bank advisor\" fiche describes a specific scenario, the call from a supposed anti-fraud department, with its own signals and steps to follow.",
          },
          {
            question: "How can I tell if a call from my bank is genuine?",
            answer:
              "You can't tell during the call, which is exactly why the question shouldn't be framed that way. Hang up and call the number on the back of your card: if the request was real, it will be confirmed; if it wasn't, you'll have lost nothing.",
          },
          {
            question: "The caller knew my name and my recent transactions.",
            answer:
              "Accurate information can come from an earlier data leak, a compromised account, or intercepted mail. It makes the call credible without proving anything: knowing a detail is not proof of identity.",
          },
        ],
        whyItWorks:
          "On the phone you can't reread, compare or take your time: politeness pushes you to answer at the other person's pace. The displayed number and a few accurate details are enough to build a trust that nothing in the call itself lets you check.",
        example: {
          setting: "Call received on a weekday; the number shown is your phone carrier's.",
          message:
            "\"Hello, this is your carrier's security department. We're seeing a request to transfer your line. To cancel it, I'm sending you a code: can you read it to me as soon as it arrives? Above all, don't hang up, or the procedure will be lost.\"",
          giveaways: [
            "You're asked to read out a code you receive: that's exactly what the caller is after.",
            "The order not to hang up blocks the only check that works.",
            "The number displayed can be faked.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the call ask you for a code, a password, an approval or an installation?",
            then: "Refuse and hang up: no service asks for that during a call it placed itself.",
          },
          {
            check: "Does the caller insist that you stay on the line?",
            then: "That's a signal in itself: hang up firmly.",
          },
          {
            check: "Is there still a doubt after hanging up?",
            then: "Call the organization yourself, on a number you already had: only its answer counts.",
          },
        ],
        prevention: [
          "Set yourself a simple rule: never approve anything during an incoming call.",
          "Save your bank's and carrier's numbers in your contacts, copied from your documents.",
          "Explain this rule to relatives who get a lot of calls: it fits in one sentence.",
        ],
        references: [
          { label: "Cybermalveillance.gouv.fr — Phishing (French government cybersecurity assistance service)", url: REF.phishing.url },
        ],
        simulationSlug: "fraud-department-call",
      },
    },
  },
  {
    code: "SOCIAL-000007",
    slug: "pretexting",
    simulationSlug: "audit-interne-annuaire",
    name: "Prétexting (scénario fabriqué)",
    categorySlug: "ingenierie-sociale",
    editorialStatus: "published",
    plainLanguageDefinition:
      "L'attaquant se construit d'abord un rôle crédible — nouveau prestataire, stagiaire, technicien, collègue d'un autre service — et ne demande rien avant que ce rôle soit accepté. La demande, quand elle vient, paraît alors normale.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "prétexte",
      "scénario d'approche",
      "ingénierie sociale par prétexte",
      "collecte d'informations par prétexte",
    ],
    primaryVector: "phone",
    primaryDimension: "identity_verification",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le prétexting est la construction d'une identité et d'une situation plausibles, entretenues sur plusieurs échanges, dans le but d'obtenir des informations ou un accès sans jamais formuler de demande qui paraisse anormale.",
    howItWorks:
      "Contrairement aux techniques qui reposent sur un choc — une menace, une urgence, une bonne nouvelle — le prétexting mise sur la banalité. L'attaquant rassemble d'abord des éléments publics : organigramme, noms de prestataires, vocabulaire interne, calendrier d'un projet. Il s'en sert pour occuper un rôle que personne ne songe à contester, puis procède par petites demandes anodines : confirmer un nom, obtenir un numéro de poste, faire préciser une procédure. Chaque réponse enrichit le scénario suivant et le rend plus crédible, jusqu'à ce que la demande décisive s'inscrive dans une relation déjà établie. C'est le socle de plusieurs fraudes de ce site : le faux ordre de virement et l'usurpation de conseiller bancaire commencent presque toujours par une phase de prétexte réussie.",
    warningSigns: [
      "Interlocuteur nouveau dont personne ne peut confirmer le rôle en interne",
      "Demandes anodines mais répétées, portant sur l'organisation plutôt que sur un sujet précis",
      "Familiarité avec le vocabulaire interne, obtenue sans que vous sachiez comment",
      "Refus de passer par le canal habituel, justifié par une raison pratique",
      "Sollicitation d'une personne récemment arrivée ou d'un service périphérique",
      "Demande de contourner une étape « juste cette fois », pour ne pas retarder un projet",
    ],
    triggers: ["trust", "authority", "social_pressure"],
    indicators: [],
    howToVerify:
      "Vérifiez le rôle, pas le récit : un scénario bien construit résiste aux questions, une identité résiste mal à un rappel sur un numéro interne connu. Demandez à qui l'interlocuteur se rattache dans l'organisation, puis confirmez auprès de cette personne par un canal que vous choisissez.",
    whatToDo:
      "Traitez toute information sur l'organisation — noms, rôles, procédures, prestataires, agendas — comme une donnée, et non comme une politesse. Appliquer la procédure habituelle est une réponse suffisante et n'a jamais besoin d'être justifiée.",
    whatToDoIfVictim:
      "Notez précisément ce qui a été communiqué et à qui, puis prévenez le responsable concerné : la valeur du prétexte est de préparer une autre attaque, donc l'alerte est utile même si rien ne semble avoir été perdu. Faites vérifier les accès et les procédures évoqués pendant les échanges.",
    whyItWorks:
      "Aider, répondre à une question simple, ne pas ralentir un collègue : ce sont des réflexes de bonne collaboration. Chaque demande est trop petite pour paraître dangereuse, et un rôle bien tenu rend suspect celui qui poserait des questions.",
    example: {
      setting: "Appel au standard d'une entreprise, un mardi matin.",
      message:
        "Bonjour, je suis du cabinet qui mène l'audit interne pour la direction financière. Je mets à jour la liste des personnes habilitées : pouvez-vous me confirmer qui valide les virements en ce moment, et son numéro direct ? Je ne veux pas déranger la direction pour si peu.",
      giveaways: [
        "Personne ne vous a annoncé cet audit.",
        "La question porte sur l'organisation, pas sur un dossier précis.",
        "L'appelant évite justement la personne qui pourrait confirmer son rôle.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'interlocuteur demande-t-il des informations sur l'organisation, les personnes ou les procédures ?",
        then: "Ne répondez pas encore : demandez-lui à qui il se rattache.",
      },
      {
        check: "Son rôle est-il impossible à confirmer auprès d'une personne que vous connaissez ?",
        then: "Ne communiquez rien et signalez l'échange à votre responsable.",
      },
      {
        check: "Avez-vous déjà donné des noms, des numéros ou des procédures ?",
        then: "Notez précisément quoi et à qui, et prévenez les personnes concernées.",
      },
    ],
    prevention: [
      "Considérez noms, rôles, procédures et agendas comme des données, pas comme des politesses.",
      "Rappelez sur un numéro interne connu avant de répondre à un interlocuteur nouveau.",
      "Dites-le aux nouveaux arrivants : appliquer la procédure n'a jamais besoin d'être justifié.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000009",
      "SOCIAL-000006",
      "SOCIAL-000011",
      "PAYMENT-000002",
      "SOCIAL-000008",
      "AI-000006",
      "DATA-000003",
      "DATA-000005",
    ],
    faq: [
      {
        question: "Rien n'a été volé, faut-il vraiment le signaler ?",
        answer:
          "Oui. Le prétexting est rarement une fin en soi : les informations recueillies servent à rendre crédible une demande ultérieure, souvent adressée à quelqu'un d'autre. Un signalement précoce permet de reconnaître cette demande quand elle arrive.",
      },
      {
        question: "Comment refuser sans se montrer désobligeant ?",
        answer:
          "En rendant la vérification impersonnelle : « je vous rappelle sur le numéro interne » ou « je transmets la demande au service concerné » ne met personne en cause. Un interlocuteur légitime accepte cette réponse ; l'insistance qui suit un refus poli est en soi un signal.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "pretexting",
        name: "Pretexting (fabricated scenario)",
        plainLanguageDefinition:
          "The attacker first builds a credible role — new vendor, intern, technician, colleague from another department — and asks for nothing until that role is accepted. The request, when it comes, then seems normal.",
        definition:
          "Pretexting is the construction of a plausible identity and situation, sustained across several exchanges, in order to obtain information or access without ever making a request that seems abnormal.",
        howItWorks:
          "Unlike techniques that rely on a shock — a threat, an urgency, good news — pretexting bets on ordinariness. The attacker first gathers public elements: an org chart, vendor names, internal vocabulary, a project's timeline. They use these to occupy a role no one thinks to question, then proceed with small, harmless requests: confirming a name, getting an extension number, asking for a procedure to be clarified. Each answer enriches the next scenario and makes it more credible, until the decisive request fits into a relationship that's already established. This is the foundation of several frauds on this site: the fake wire-transfer order and the fake bank advisor almost always start with a successful pretexting phase.",
        warningSigns: [
          "A new contact whose role no one internally can confirm",
          "Harmless but repeated requests, about the organization rather than a specific subject",
          "Familiarity with internal vocabulary, gained without your knowing how",
          "Refusal to go through the usual channel, justified by a practical reason",
          "Targeting a recently arrived employee or a peripheral department",
          "Request to skip a step \"just this once,\" so as not to delay a project",
        ],
        howToVerify:
          "Verify the role, not the story: a well-built scenario withstands questions, but an identity doesn't withstand a callback to a known internal number. Ask who the caller reports to within the organization, then confirm with that person through a channel you choose.",
        whatToDo:
          "Treat any information about the organization — names, roles, procedures, vendors, schedules — as data, not as a courtesy. Following the usual procedure is a sufficient answer and never needs to be justified.",
        whatToDoIfVictim:
          "Note precisely what was shared and with whom, then alert the person responsible: the value of pretexting is to prepare another attack, so the alert is useful even if nothing appears to have been lost. Have the access and procedures mentioned during the exchanges checked.",
        faq: [
          {
            question: "Nothing was stolen — is it really worth reporting?",
            answer:
              "Yes. Pretexting is rarely an end in itself: the information gathered is used to make a later request credible, often addressed to someone else. An early report makes it possible to recognize that request when it arrives.",
          },
          {
            question: "How do I refuse without seeming rude?",
            answer:
              "By making the verification impersonal: \"I'll call you back on the internal line\" or \"I'll forward the request to the relevant department\" doesn't accuse anyone. A legitimate contact accepts this answer; insistence following a polite refusal is itself a signal.",
          },
        ],
        whyItWorks:
          "Helping out, answering a simple question, not slowing a colleague down: these are good teamwork reflexes. Each request is too small to seem dangerous, and a well-played role makes whoever asks questions look like the suspicious one.",
        example: {
          setting: "Call to a company's switchboard, on a Tuesday morning.",
          message:
            "Hello, I'm with the firm running the internal audit for the finance department. I'm updating the list of authorized people: could you confirm who currently approves wire transfers, and their direct number? I don't want to bother management over something this small.",
          giveaways: [
            "Nobody told you about this audit.",
            "The question is about the organization, not a specific case.",
            "The caller avoids exactly the person who could confirm their role.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the caller asking about the organization, its people or its procedures?",
            then: "Don't answer yet: ask who they report to.",
          },
          {
            check: "Is their role impossible to confirm with someone you know?",
            then: "Share nothing and report the exchange to your manager.",
          },
          {
            check: "Have you already given out names, numbers or procedures?",
            then: "Write down exactly what and to whom, and warn the people concerned.",
          },
        ],
        prevention: [
          "Treat names, roles, procedures and calendars as data, not small talk.",
          "Call back on a known internal number before answering someone new.",
          "Tell newcomers: following the procedure never needs justifying.",
        ],
        references: [
          { label: "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)", url: REF.cybermalveillance.url },
        ],
        simulationSlug: "internal-audit-directory",
      },
    },
  },
  {
    code: "SOCIAL-000008",
    slug: "baiting",
    simulationSlug: "cle-usb-trouvee",
    name: "Baiting (appât)",
    categorySlug: "ingenierie-sociale",
    editorialStatus: "published",
    plainLanguageDefinition:
      "On vous offre quelque chose que vous voulez — un fichier, un logiciel payant devenu gratuit, une clé USB trouvée, un cadeau contre un questionnaire. C'est vous qui allez le chercher, et c'est ce qui rend l'attaque efficace.",
    attackerObjective: "controle_d_un_appareil",
    aliases: [
      "appât",
      "hameçonnage par appât",
      "quid pro quo",
      "clé USB piégée",
    ],
    primaryVector: "file_attachment",
    primaryDimension: "social_engineering_resistance",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le baiting propose une contrepartie désirable — un contenu, un logiciel, un objet ou un avantage — dont l'obtention exige une action de la victime : ouvrir un fichier, installer un programme, brancher un support, ou fournir une information en échange.",
    howItWorks:
      "L'appât inverse la relation habituelle : la victime n'est pas sollicitée, elle est à l'initiative. Un support de stockage abandonné dans un lieu de passage sera branché par curiosité, et cette curiosité est prévisible. Un logiciel payant proposé gratuitement sera téléchargé et installé volontairement, avec les autorisations que cela suppose. Un contenu convoité — un document, un enregistrement, une série — justifie de désactiver un avertissement de sécurité. Comme l'action vient de la personne, les protections ne sont pas contournées techniquement : elles sont autorisées. La variante dite du quid pro quo échange l'appât contre un service : une assistance informatique offerte, un cadeau contre un questionnaire, un accès contre un renseignement.",
    warningSigns: [
      "Contenu payant ou rare proposé gratuitement, sans explication de la gratuité",
      "Support de stockage trouvé, reçu par courrier ou remis sans provenance claire",
      "Installation qui demande de désactiver une protection ou d'ignorer un avertissement",
      "Contrepartie offerte en échange d'une information ou d'un accès",
      "Fichier dont l'extension ne correspond pas à ce qu'il prétend être",
      "Sentiment d'avoir trouvé une bonne affaire, avant toute vérification",
    ],
    triggers: ["curiosity", "reward", "financial_incentive"],
    indicators: [],
    howToVerify:
      "Posez la question qui manque : pourquoi est-ce gratuit, et qui paie ? Un logiciel a un éditeur et un site officiel, un contenu a un diffuseur, et un support de stockage a un propriétaire identifiable. En l'absence de réponse, l'appât est le produit et vous êtes ce qui est acheté.",
    whatToDo:
      "Ne branchez jamais un support de stockage dont vous ne connaissez pas l'origine — remettez-le au service concerné plutôt que de l'examiner vous-même. N'installez de logiciel que depuis le site de son éditeur, et ne désactivez jamais une protection pour faire aboutir une installation.",
    whatToDoIfVictim:
      "Déconnectez l'appareil du réseau et faites-le analyser par un outil de sécurité à jour. Depuis un autre appareil sain, changez les mots de passe des comptes sensibles en commençant par la messagerie. Si l'appareil appartient à une organisation, prévenez le service informatique avant toute manipulation : les traces sont utiles.",
    whyItWorks:
      "On se méfie de ce qui nous sollicite, beaucoup moins de ce que l'on a trouvé ou choisi soi-même. La curiosité et l'envie d'une bonne affaire font le reste : la personne agit avant de se demander d'où vient l'objet.",
    example: {
      setting: "Clé USB trouvée sur le parking de l'entreprise, avec une étiquette manuscrite.",
      message:
        "Étiquette : Salaires 2026 — confidentiel",
      giveaways: [
        "Personne n'égare un fichier de salaires sur un parking.",
        "L'étiquette est faite pour donner envie de regarder.",
        "Le propriétaire n'est pas identifiable.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'objet ou le fichier vient-il d'une source que vous ne pouvez pas identifier ?",
        then: "Ne le branchez pas et ne l'ouvrez pas : remettez-le au service informatique ou à l'accueil.",
      },
      {
        check: "Un logiciel ou un contenu payant vous est-il proposé gratuitement ?",
        then: "Passez par le site de l'éditeur, ou renoncez.",
      },
      {
        check: "Avez-vous branché le support ou lancé le fichier ?",
        then: "Déconnectez l'appareil du réseau et prévenez le service informatique avant toute autre manipulation.",
      },
    ],
    prevention: [
      "Ne branchez aucun support de stockage dont vous ne connaissez pas le propriétaire.",
      "Téléchargez les logiciels uniquement depuis le site de leur éditeur.",
      "Ne désactivez jamais une protection pour faire aboutir une installation.",
    ],
    relatedAttackCodes: [
      "PHISH-000001",
      "SOCIAL-000007",
      "PAYMENT-000006",
      "ACCT-000007",
      "WEB-000005",
      "MOB-000003",
      "MAL-000002",
    ],
    faq: [
      {
        question:
          "Brancher une clé USB pour voir ce qu'elle contient est-il risqué ?",
        answer:
          "Oui, et davantage qu'il n'y paraît : un support peut se présenter au système comme un clavier et saisir des commandes sans que vous ouvriez le moindre fichier. Regarder le contenu n'est donc pas une précaution suffisante.",
      },
      {
        question:
          "J'ai installé un logiciel gratuit trouvé en ligne, que vérifier ?",
        answer:
          "Désinstallez-le, lancez une analyse complète, puis vérifiez ce qui est le plus souvent modifié : extensions du navigateur, programmes lancés au démarrage, et règles de transfert de votre messagerie. Changez ensuite vos mots de passe depuis un autre appareil.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "baiting",
        name: "Baiting",
        plainLanguageDefinition:
          "You're offered something you want — a file, paid software made free, a found USB drive, a gift in exchange for a survey. You go looking for it yourself, and that's what makes the attack effective.",
        definition:
          "Baiting offers a desirable trade — content, software, an object, or a benefit — whose acquisition requires an action from the victim: opening a file, installing a program, plugging in a device, or providing information in exchange.",
        howItWorks:
          "Bait reverses the usual relationship: the victim isn't approached, they take the initiative. A storage device abandoned in a busy area will get plugged in out of curiosity, and that curiosity is predictable. Paid software offered for free will be downloaded and installed voluntarily, with the permissions that implies. Coveted content — a document, a recording, a series — justifies disabling a security warning. Since the action comes from the person, protections aren't bypassed technically: they're authorized. The so-called quid pro quo variant trades the bait for a service: free tech support, a gift in exchange for a questionnaire, access in exchange for information.",
        warningSigns: [
          "Paid or rare content offered for free, with no explanation for why",
          "A found storage device, received by mail, or handed over with no clear origin",
          "An install that asks you to disable a protection or ignore a warning",
          "A reward offered in exchange for information or access",
          "A file whose extension doesn't match what it claims to be",
          "A feeling of having found a great deal, before any verification",
        ],
        howToVerify:
          "Ask the missing question: why is this free, and who's paying? Software has a publisher and an official site, content has a distributor, and a storage device has an identifiable owner. In the absence of an answer, the bait is the product, and you're what's being acquired.",
        whatToDo:
          "Never plug in a storage device whose origin you don't know — hand it to the relevant department instead of examining it yourself. Only install software from its publisher's site, and never disable a protection to get an install to complete.",
        whatToDoIfVictim:
          "Disconnect the device from the network and have it scanned with an up-to-date security tool. From another, clean device, change the passwords of sensitive accounts, starting with email. If the device belongs to an organization, notify IT before any manipulation: the traces are useful.",
        faq: [
          {
            question: "Is it risky to plug in a USB drive just to see what's on it?",
            answer:
              "Yes, and more than it seems: a device can present itself to the system as a keyboard and type commands without you opening a single file. So looking at the contents isn't a sufficient precaution.",
          },
          {
            question: "I installed free software found online — what should I check?",
            answer:
              "Uninstall it, run a full scan, then check what's most often modified: browser extensions, startup programs, and your email's forwarding rules. Then change your passwords from another device.",
          },
        ],
        whyItWorks:
          "We're wary of what comes looking for us, much less of what we found or chose ourselves. Curiosity and the lure of a bargain do the rest: people act before asking where the thing came from.",
        example: {
          setting: "USB stick found in the company parking lot, with a handwritten label.",
          message:
            "Label: Salaries 2026 — confidential",
          giveaways: [
            "Nobody loses a salary file in a parking lot.",
            "The label is designed to make you want to look.",
            "The owner can't be identified.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the object or file come from a source you can't identify?",
            then: "Don't plug it in or open it: hand it to IT or the front desk.",
          },
          {
            check: "Is paid software or content being offered to you for free?",
            then: "Go through the publisher's website, or do without.",
          },
          {
            check: "Did you plug in the device or open the file?",
            then: "Disconnect the device from the network and alert IT before doing anything else.",
          },
        ],
        prevention: [
          "Never plug in a storage device whose owner you don't know.",
          "Download software only from its publisher's website.",
          "Never turn off a protection to get an installation to finish.",
        ],
        references: [
          { label: "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)", url: REF.cybermalveillance.url },
        ],
        simulationSlug: "found-usb-drive",
      },
    },
  },
  {
    code: "SOCIAL-000009",
    slug: "usurpation-d-identite",
    noSimulationReason:
      "Entité générale de la famille : elle décrit le moyen — emprunter une identité le temps d'un échange — dont les formes concrètes (faux conseiller bancaire, faux agent administratif, hameçonnage) ont chacune leur propre simulation.",
    name: "Usurpation d'identité",
    categorySlug: "ingenierie-sociale",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Quelqu'un se fait passer pour une personne ou un organisme que vous connaissez, le temps d'un échange, afin d'obtenir de vous quelque chose que vous n'accorderiez pas à un inconnu.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "usurpation",
      "impersonation",
      "usurpation d'identité en ligne",
      "se faire passer pour quelqu'un",
    ],
    primaryVector: "email",
    primaryDimension: "identity_verification",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "L'usurpation d'identité, au sens de cette famille, est le fait d'emprunter l'identité d'une personne ou d'une organisation existante pendant un échange, afin de bénéficier de la confiance qui lui est accordée.",
    howItWorks:
      "L'usurpation joue sur la façon dont nous accordons notre confiance : à un nom affiché, à un logo, à un numéro, à un ton — c'est-à-dire à des éléments qui se copient tous. Le nom d'expéditeur d'un email est un champ libre, l'expéditeur d'un SMS est un simple libellé, le numéro appelant peut être falsifié, et une photographie de profil se recopie en une seconde. L'attaquant n'a donc pas besoin de compromettre un compte pour paraître en être le titulaire, même si une messagerie réellement piratée rend l'usurpation indétectable. Elle est rarement l'objectif final : elle sert de couche de confiance à autre chose, un virement, un identifiant, un accès. C'est pourquoi elle apparaît en amont de nombreuses fiches de ce site.",
    warningSigns: [
      "Nom affiché correct mais adresse ou domaine différent de celui attendu",
      "Demande inhabituelle venant d'un contact habituel, sans explication de ce changement",
      "Ton, formule de politesse ou horaire d'envoi qui détonne par rapport aux échanges précédents",
      "Adresse de réponse différente de l'adresse d'expédition",
      "Compte récemment créé reprenant le nom et la photographie d'une personne que vous connaissez",
      "Demande de ne pas utiliser le canal habituel pour répondre",
    ],
    triggers: ["trust", "authority"],
    indicators: [],
    howToVerify:
      "Vérifiez sur un canal que la personne usurpée maîtrise et que l'attaquant ne contrôle pas : un numéro que vous possédiez déjà, une rencontre, un compte auquel vous accédez par vos propres moyens. Vérifier sur le canal de la demande revient à demander à l'inconnu de confirmer qu'il est bien votre interlocuteur.",
    whatToDo:
      "Traitez le nom affiché comme une information, jamais comme une preuve. Face à une demande inhabituelle venant d'un contact connu, la vérification par un autre canal doit devenir un réflexe plutôt qu'une marque de méfiance.",
    whatToDoIfVictim:
      "Prévenez la personne ou l'organisme usurpé : d'autres personnes de son entourage reçoivent généralement les mêmes messages. Conservez les échanges et signalez le compte à la plateforme concernée. Si des informations ou des fonds ont été transmis, contactez votre banque et déposez plainte.",
    whyItWorks:
      "On accorde sa confiance à ce que l'on reconnaît : un nom, un logo, une photo, un ton familier. Tous ces éléments se copient sans effort, et vérifier un proche paraît impoli.",
    example: {
      setting: "Email reçu au travail, affiché sous le nom d'un collègue que vous connaissez bien.",
      message:
        "De : Julien Martin <julienmartin-bureau@messagerie-exemple.test>\nSalut, je suis en déplacement et mon téléphone est déchargé. Peux-tu m'acheter quatre cartes cadeaux pour un client et m'envoyer les codes ? Je te rembourse demain. Réponds-moi ici plutôt.",
      giveaways: [
        "Le nom est le bon, mais l'adresse n'est pas celle de l'entreprise.",
        "La demande ne ressemble pas à ce que ce collègue demande d'habitude.",
        "Il demande de ne pas utiliser le canal habituel.",
      ],
    },
    decisionChecklist: [
      {
        check: "Un contact connu vous fait-il une demande inhabituelle d'argent, de codes ou d'accès ?",
        then: "Vérifiez avec lui par un autre canal que vous possédiez déjà : son numéro habituel, en personne.",
      },
      {
        check: "L'adresse, le numéro ou le compte diffère-t-il de celui que vous connaissez ?",
        then: "Ne répondez pas à ce message, et prévenez la personne dont le nom est utilisé.",
      },
      {
        check: "Avez-vous déjà envoyé de l'argent, des codes ou des informations ?",
        then: "Contactez votre banque, conservez les échanges et déposez plainte.",
      },
    ],
    prevention: [
      "Traitez le nom affiché comme une information, jamais comme une preuve.",
      "Faites de la vérification par un autre canal un réflexe, pas une marque de méfiance.",
      "Convenez avec vos proches et collègues qu'une demande d'argent se confirme toujours de vive voix.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000007",
      "SOCIAL-000005",
      "SOCIAL-000001",
      "SOCIAL-000010",
      "PERS-000007",
      "DATA-000002",
      "DATA-000009",
    ],
    faq: [
      {
        question: "Quelle différence avec le vol d'identité ?",
        answer:
          "L'usurpation décrite ici est un moyen employé pendant un échange : quelqu'un se fait passer pour un autre le temps d'obtenir quelque chose. Le vol d'identité désigne un préjudice durable, où un tiers agit en votre nom auprès d'organismes — crédits, abonnements, démarches. Le second suit parfois le premier, mais ce sont deux situations distinctes.",
      },
      {
        question:
          "Mon nom a été utilisé pour écrire à mes contacts. Mon compte est-il piraté ?",
        answer:
          "Pas nécessairement. Un compte peut être imité sans être compromis : nom, photographie et description se recopient. Vérifiez malgré tout l'historique de connexion de votre compte, et prévenez vos contacts, qui distingueront ainsi le faux compte du vrai.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "identity-impersonation",
        name: "Identity impersonation",
        plainLanguageDefinition:
          "Someone pretends to be a person or organization you know, for the length of one exchange, in order to obtain from you something you wouldn't grant to a stranger.",
        definition:
          "Identity impersonation, in the sense used by this family, is the act of borrowing an existing person's or organization's identity during an exchange, in order to benefit from the trust placed in them.",
        howItWorks:
          "Impersonation plays on how we place our trust: in a displayed name, a logo, a number, a tone — that is, in elements that can all be copied. An email's display name is a free-text field, a text message's sender is just a label, the calling number can be spoofed, and a profile photo can be copied in a second. The attacker therefore doesn't need to compromise an account to appear to own it, though a genuinely hacked account makes the impersonation undetectable. It's rarely the final goal: it serves as a layer of trust for something else — a transfer, a credential, an access. That's why it appears upstream of many fiches on this site.",
        warningSigns: [
          "Correct display name but an address or domain different from the expected one",
          "Unusual request from a usual contact, with no explanation for the change",
          "Tone, sign-off, or sending time that clashes with previous exchanges",
          "Reply address different from the sending address",
          "Recently created account reusing the name and photo of someone you know",
          "Request not to use the usual channel to reply",
        ],
        howToVerify:
          "Verify through a channel the impersonated person controls and the attacker doesn't: a number you already had, a meeting, an account you access on your own. Verifying through the channel of the request itself amounts to asking the stranger to confirm they really are your contact.",
        whatToDo:
          "Treat the displayed name as information, never as proof. Faced with an unusual request from a known contact, verifying through another channel should become a reflex rather than a sign of distrust.",
        whatToDoIfVictim:
          "Warn the impersonated person or organization: others around them are usually receiving the same messages. Keep the exchanges and report the account to the relevant platform. If information or funds were shared, contact your bank and file a police report.",
        faq: [
          {
            question: "What's the difference with identity theft?",
            answer:
              "The impersonation described here is a means used during one exchange: someone pretends to be another person for as long as it takes to obtain something. Identity theft refers to a lasting harm, where a third party acts in your name with institutions — loans, subscriptions, official procedures. The second sometimes follows the first, but they are two distinct situations.",
          },
          {
            question: "My name was used to write to my contacts. Is my account hacked?",
            answer:
              "Not necessarily. An account can be imitated without being compromised: a name, photo, and description can all be copied. Still, check your account's login history, and warn your contacts, so they can tell the fake account from the real one.",
          },
        ],
        whyItWorks:
          "We trust what we recognize: a name, a logo, a photo, a familiar tone. All of these can be copied effortlessly, and checking up on someone close feels rude.",
        example: {
          setting: "Email received at work, shown under the name of a colleague you know well.",
          message:
            "From: Julien Martin <julienmartin-bureau@messagerie-exemple.test>\nHi, I'm traveling and my phone is dead. Could you buy four gift cards for a client and send me the codes? I'll pay you back tomorrow. Reply to me here instead.",
          giveaways: [
            "The name is right, but the address isn't the company's.",
            "The request isn't like anything this colleague usually asks.",
            "He asks you not to use the usual channel.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is a known contact making an unusual request for money, codes or access?",
            then: "Check with them through another channel you already had: their usual number, in person.",
          },
          {
            check: "Is the address, number or account different from the one you know?",
            then: "Don't reply to this message, and warn the person whose name is being used.",
          },
          {
            check: "Have you already sent money, codes or information?",
            then: "Contact your bank, keep the messages and file a police report.",
          },
        ],
        prevention: [
          "Treat a displayed name as information, never as proof.",
          "Make checking through another channel a habit, not a sign of mistrust.",
          "Agree with family and colleagues that a request for money is always confirmed by voice.",
        ],
        references: [
          { label: "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)", url: REF.cybermalveillance.url },
        ],
        noSimulationReason:
          "General entity for the family: it describes the means — borrowing an identity for the length of one exchange — whose concrete forms (fake bank advisor, fake government official, phishing) each have their own simulation.",
      },
    },
  },
  {
    code: "SOCIAL-000010",
    slug: "faux-agent-administratif",
    simulationSlug: "avis-regularisation-administrative",
    name: "Faux agent administratif",
    categorySlug: "ingenierie-sociale",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un appel ou un message se présentant comme les impôts, la sécurité sociale, la police ou un service public. L'autorité invoquée pousse à répondre vite, et à ne pas demander de vérification.",
    attackerObjective: "argent",
    aliases: [
      "faux agent des impôts",
      "faux policier",
      "faux gendarme",
      "usurpation d'administration",
    ],
    primaryVector: "phone",
    primaryDimension: "social_engineering_resistance",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le faux agent administratif est l'usurpation d'un service public — administration fiscale, organisme social, service de police, fournisseur d'énergie sous délégation — afin d'obtenir un paiement, des informations personnelles ou un accès, en s'appuyant sur l'autorité de l'institution.",
    howItWorks:
      "L'autorité publique produit un réflexe d'obéissance que peu d'autres identités permettent : on ne discute pas une convocation, on ne fait pas attendre une administration. L'attaquant s'appuie sur ce réflexe et y ajoute une conséquence redoutée — redressement, poursuite, coupure, procédure judiciaire — en laissant peu de place à la discussion. Certaines variantes retournent le procédé en accusant la victime d'une infraction grave, ce qui produit un effet de sidération : la personne cherche alors à se disculper plutôt qu'à vérifier. D'autres se présentent au contraire comme bienveillantes, proposant une régularisation ou une aide, ce qui obtient les mêmes informations sans conflit. Les deux ont en commun de réclamer une action immédiate et de décourager tout recoupement.",
    warningSigns: [
      "Appel ou message annonçant une procédure administrative que rien n'a précédée par courrier",
      "Menace de sanction, de poursuite ou de coupure en cas de non-réponse immédiate",
      "Demande de paiement par un moyen inhabituel pour une administration",
      "Accusation grave formulée d'emblée, avec proposition de régler la situation par téléphone",
      "Demande de vos identifiants d'accès à un espace public en ligne",
      "Refus de vous laisser rappeler le service par le numéro officiel",
    ],
    triggers: ["authority", "fear", "urgency"],
    indicators: [],
    howToVerify:
      "Une administration accepte toujours d'être rappelée, et une procédure réelle laisse une trace écrite dans votre espace personnel officiel. Raccrochez, connectez-vous à cet espace par vos propres moyens, ou appelez le numéro figurant sur un courrier que vous avez déjà reçu. Un service public ne demande jamais vos identifiants ni un paiement par carte prépayée.",
    whatToDo:
      "Ne réglez rien et ne communiquez aucune information pendant l'échange. Prendre le temps de vérifier n'expose à aucune sanction : aucune procédure administrative ne se joue à quelques minutes.",
    whatToDoIfVictim:
      "Faites opposition si un paiement a été effectué, et changez les mots de passe des espaces publics concernés. Signalez les faits au service réellement usurpé, qui peut alerter d'autres usagers, puis déposez plainte. Si des documents d'identité ont été transmis, surveillez les courriers d'organismes que vous n'avez pas sollicités.",
    whyItWorks:
      "Personne ne veut d'ennuis avec une administration, et peu de gens savent comment elle procède réellement : le doute joue contre la personne visée. Le vocabulaire officiel et un ton assuré remplacent les preuves, et l'urgence empêche d'aller les chercher.",
    example: {
      setting: "SMS reçu un vendredi en fin d'après-midi.",
      message:
        "Avis de régularisation : un trop-perçu de prestations a été constaté sur votre dossier. Sans régularisation sous 48 h, une procédure de recouvrement sera engagée. Accédez à votre dossier : regularisation-dossier.example-not-real.test",
      giveaways: [
        "Une procédure réelle laisse une trace dans votre espace officiel ou par courrier.",
        "Le lien ne mène pas au site de l'administration.",
        "Le délai de 48 h, posé un vendredi soir, sert à empêcher toute vérification.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le message ou l'appel vous presse-t-il de payer ou de vous connecter tout de suite ?",
        then: "N'en faites rien. Raccrochez ou fermez le message.",
      },
      {
        check: "Votre espace personnel officiel, ouvert par vous-même, est-il vide de toute trace de cette procédure ?",
        then: "La demande est fausse : signalez-la au service usurpé.",
      },
      {
        check: "Avez-vous payé ou donné vos identifiants ?",
        then: "Faites opposition auprès de votre banque, changez le mot de passe de l'espace concerné, puis déposez plainte.",
      },
    ],
    prevention: [
      "Accédez aux services publics en ligne uniquement en tapant leur adresse ou par un favori.",
      "Retenez qu'une administration accepte toujours d'être rappelée au numéro officiel.",
      "Conservez les courriers officiels reçus : ils portent les vrais numéros et références.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000006",
      "PAYMENT-000007",
      "PAYMENT-000001",
      "SOCIAL-000009",
      "DATA-000009",
    ],
    faq: [
      {
        question: "Le numéro affiché était celui de l'administration.",
        answer:
          "L'affichage du numéro appelant peut être falsifié, y compris pour un numéro officiel. Un numéro correct ne prouve donc jamais l'identité de l'interlocuteur : seul un appel que vous passez vous-même permet de trancher.",
      },
      {
        question:
          "On m'accuse d'une infraction grave et on me propose de régulariser par téléphone.",
        answer:
          "Aucune procédure judiciaire ne se règle par un paiement téléphonique, et aucun service n'annonce une accusation de cette nature par un appel. La gravité de l'accusation fait partie du procédé : elle sert à empêcher la vérification. Raccrochez et rappelez le service concerné.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "fake-government-official",
        name: "Fake government official",
        plainLanguageDefinition:
          "A call or message presenting itself as the tax office, social security, police, or a public service. The authority invoked pushes you to respond quickly, and not to ask for verification.",
        definition:
          "The fake government official scam is the impersonation of a public service — tax authority, social security agency, police, or an energy provider acting under delegation — to obtain a payment, personal information, or access, relying on the institution's authority.",
        howItWorks:
          "Public authority produces a reflex of obedience that few other identities allow: you don't argue with a summons, you don't keep a government agency waiting. The attacker relies on this reflex and adds a feared consequence — back taxes, prosecution, service cutoff, legal proceedings — leaving little room for discussion. Some variants flip the approach by accusing the victim of a serious offense, producing a shock effect: the person then seeks to clear themselves rather than verify. Others instead present themselves as helpful, offering to sort out a situation or provide assistance, obtaining the same information without conflict. Both share the trait of demanding immediate action and discouraging any cross-checking.",
        warningSigns: [
          "Call or message announcing an administrative procedure with no prior letter",
          "Threat of a penalty, prosecution, or cutoff for not responding immediately",
          "Request for payment through an unusual method for a government agency",
          "A serious accusation made upfront, with an offer to settle it by phone",
          "Request for your login credentials to a public online account",
          "Refusal to let you call back the service at its official number",
        ],
        howToVerify:
          "A government agency always accepts being called back, and a real procedure leaves a written trace in your official online account. Hang up, log into that account yourself, or call the number on a letter you've already received. A public service never asks for your credentials or payment by prepaid card.",
        whatToDo:
          "Don't pay anything and don't share any information during the exchange. Taking time to verify carries no penalty: no administrative procedure is decided in a few minutes.",
        whatToDoIfVictim:
          "Dispute any payment made, and change the passwords of the affected public accounts. Report the incident to the actually impersonated service, which can alert other users, then file a police report. If identity documents were shared, watch for mail from organizations you didn't contact.",
        faq: [
          {
            question: "The number displayed was the government agency's.",
            answer:
              "The calling number displayed can be spoofed, even for an official number. A correct number therefore never proves the caller's identity: only a call you place yourself can settle it.",
          },
          {
            question: "I'm being accused of a serious offense and offered to settle it by phone.",
            answer:
              "No legal proceeding is settled by a phone payment, and no service announces an accusation of this kind by call. The severity of the accusation is part of the method: it's meant to prevent verification. Hang up and call the relevant service back.",
          },
        ],
        whyItWorks:
          "Nobody wants trouble with a government agency, and few people know how agencies actually work: doubt works against the target. Official vocabulary and a confident tone stand in for proof, and urgency keeps you from looking for it.",
        example: {
          setting: "Text message received on a Friday late afternoon.",
          message:
            "Adjustment notice: an overpayment of benefits has been found on your file. Without settlement within 48 hours, collection proceedings will begin. Access your file: regularisation-dossier.example-not-real.test",
          giveaways: [
            "A real procedure leaves a trace in your official online account or by mail.",
            "The link doesn't lead to the agency's website.",
            "A 48-hour deadline set on a Friday evening is there to prevent any checking.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the message or call pushing you to pay or log in right away?",
            then: "Do neither. Hang up or close the message.",
          },
          {
            check: "Does your official online account, opened yourself, show no trace of this procedure?",
            then: "The request is fake: report it to the agency being impersonated.",
          },
          {
            check: "Did you pay or give your login details?",
            then: "Ask your bank to block the payment, change the password of the account concerned, then file a police report.",
          },
        ],
        prevention: [
          "Reach government online services only by typing their address or using a bookmark.",
          "Remember that a government agency always accepts being called back on its official number.",
          "Keep the official letters you receive: they carry the real numbers and references.",
        ],
        references: [
          { label: "Cybermalveillance.gouv.fr — Phishing (French government cybersecurity assistance service)", url: REF.phishing.url },
        ],
        simulationSlug: "administrative-notice",
      },
    },
  },
  {
    code: "SOCIAL-000011",
    slug: "offre-d-emploi-frauduleuse",
    simulationSlug: "recrutement-frais-de-dossier",
    name: "Offre d'emploi frauduleuse",
    categorySlug: "ingenierie-sociale",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une offre de travail bien payée, à distance, avec un recrutement anormalement rapide et sans entretien vidéo. Ce qui est recruté n'est pas votre travail : ce sont vos documents d'identité, votre compte bancaire, ou votre argent.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "faux recrutement",
      "arnaque à l'emploi",
      "fausse offre de job",
      "recrutement de mule financière",
    ],
    primaryVector: "social_media",
    primaryDimension: "social_engineering_resistance",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "L'offre d'emploi frauduleuse utilise un processus de recrutement fictif pour obtenir des documents personnels, un paiement présenté comme un frais préalable, ou l'usage du compte bancaire du candidat pour faire transiter des fonds d'origine frauduleuse.",
    howItWorks:
      "Le recrutement offre un cadre où réclamer des documents sensibles est parfaitement normal : pièce d'identité, justificatif de domicile, relevé d'identité bancaire, parfois carte vitale. Un candidat qui les transmet ne fait rien d'anormal, et c'est ce qui rend le procédé efficace. Le déroulé est accéléré — offre non sollicitée, échanges par messagerie uniquement, embauche annoncée après une conversation écrite — parce que chaque étape supplémentaire augmente le risque d'être démasqué. Selon la variante, la suite consiste à réclamer une avance pour du matériel ou une formation, à utiliser les documents pour ouvrir des comptes au nom du candidat, ou à lui demander de recevoir des virements puis de les réexpédier. Cette dernière est la plus grave : elle expose à des poursuites pour blanchiment, la personne recrutée devenant juridiquement responsable du compte qu'elle a mis à disposition.",
    warningSigns: [
      "Offre non sollicitée, reçue par messagerie, pour un poste très rémunérateur sans qualification exigée",
      "Recrutement conclu sans entretien vidéo ni rencontre",
      "Demande de documents d'identité avant tout contrat signé",
      "Frais à avancer pour du matériel, une formation ou un dossier",
      "Mission consistant à recevoir des fonds sur votre compte puis à les transférer ailleurs",
      "Entreprise dont l'existence n'est pas vérifiable en dehors de l'annonce",
    ],
    triggers: ["reward", "financial_incentive", "urgency"],
    indicators: [],
    howToVerify:
      "Vérifiez l'entreprise ailleurs que dans l'annonce : son existence légale, son adresse, son site officiel, et le fait que le poste y soit publié. Exigez un entretien en visioconférence — un recrutement réel ne s'y oppose jamais, même si l'entretien obtenu ne prouve à lui seul ni l'employeur ni le poste. Aucun employeur légitime ne demande d'avance de frais, et aucun ne demande de faire transiter des fonds par un compte personnel.",
    whatToDo:
      "Ne transmettez aucun document d'identité avant qu'un contrat identifie clairement l'employeur, et n'avancez jamais de frais. Refusez catégoriquement toute mission consistant à recevoir puis renvoyer de l'argent, quelle que soit la justification.",
    whatToDoIfVictim:
      "Si votre compte a servi à faire transiter des fonds, contactez immédiatement votre banque et déposez plainte de votre propre initiative : votre bonne foi se démontre bien mieux avant qu'après un signalement. Si des documents d'identité ont été transmis, déposez plainte et surveillez les courriers d'organismes de crédit non sollicités.",
    whyItWorks:
      "Le recrutement rend normales des demandes qui ne le sont nulle part ailleurs : pièce d'identité, RIB, justificatif de domicile. L'offre généreuse et rapide arrive souvent quand on en a besoin, ce qui fait passer les incohérences au second plan.",
    example: {
      setting: "Message reçu sur une messagerie, sans candidature de votre part.",
      message:
        "Bonjour, votre profil a retenu notre attention pour un poste d'assistant administratif en télétravail, 2 h par jour, 1 800 € par mois. Pour finaliser votre embauche, envoyez une photo de votre pièce d'identité recto verso et votre RIB. Démarrage lundi.",
      giveaways: [
        "Une offre que vous n'avez pas sollicitée.",
        "Une embauche sans entretien.",
        "Des documents demandés avant tout contrat.",
      ],
    },
    decisionChecklist: [
      {
        check: "Manque-t-il un entretien ou un contrat qui identifie clairement l'employeur ?",
        then: "Ne transmettez aucun document.",
      },
      {
        check: "L'entreprise ou l'offre sont-elles introuvables sur son site officiel ?",
        then: "Cessez l'échange.",
      },
      {
        check: "On vous demande d'avancer des frais, ou de recevoir puis renvoyer de l'argent ?",
        then: "Refusez : c'est une fraude, et la seconde demande vous exposerait à des poursuites.",
      },
    ],
    prevention: [
      "Répondez aux offres en passant par le site officiel de l'employeur ou une plateforme d'emploi reconnue.",
      "N'envoyez vos documents d'identité qu'une fois le contrat signé et l'employeur vérifié.",
      "Si vous avez transmis une pièce d'identité, surveillez les courriers d'organismes de crédit que vous n'avez pas sollicités.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000007",
      "PAYMENT-000009",
      "SOCIAL-000004",
      "AI-000003",
      "DATA-000009",
    ],
    faq: [
      {
        question:
          "On me demande de recevoir de l'argent puis de le renvoyer. Quel est le risque réel ?",
        answer:
          "Ces fonds proviennent en général d'une autre fraude, et le compte qui les reçoit sert à brouiller leur trace. Au-delà de la perte, cela expose à des poursuites pour blanchiment : c'est vous qui êtes identifiable, pas l'organisateur. Refusez, et n'ouvrez jamais un compte pour un tiers.",
      },
      {
        question: "L'entreprise citée existe vraiment, j'ai vérifié son site.",
        answer:
          "Une entreprise réelle peut être usurpée : le nom et le logo sont publics. Ce qu'il faut vérifier n'est pas l'existence de l'entreprise mais le lien entre elle et votre interlocuteur — en la contactant par les coordonnées de son site officiel, jamais par celles de l'annonce.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "fake-job-offer",
        name: "Fake job offer",
        plainLanguageDefinition:
          "A well-paid, remote job offer, with an abnormally fast hiring process and no video interview. What's being recruited isn't your work — it's your identity documents, your bank account, or your money.",
        definition:
          "The fake job offer uses a fictitious hiring process to obtain personal documents, a payment presented as an upfront fee, or the use of the candidate's bank account to move funds of fraudulent origin.",
        howItWorks:
          "The hiring process provides a setting where asking for sensitive documents is perfectly normal: ID, proof of address, bank details, sometimes a health-insurance card. A candidate who provides them does nothing unusual, which is exactly what makes the method effective. The process is accelerated — an unsolicited offer, exchanges by messaging only, hiring announced after a written conversation — because every extra step increases the risk of being exposed. Depending on the variant, what follows is a request for an advance for equipment or training, using the documents to open accounts in the candidate's name, or asking them to receive transfers and then forward them. The last is the most serious: it exposes the candidate to money-laundering prosecution, since they become legally responsible for the account they made available.",
        warningSigns: [
          "Unsolicited offer, received by messaging, for a highly paid position with no required qualifications",
          "Hiring concluded with no video interview or meeting",
          "Request for identity documents before any signed contract",
          "Upfront fees for equipment, training, or a processing file",
          "A task consisting of receiving funds into your account and then transferring them elsewhere",
          "A company whose existence can't be verified outside the ad itself",
        ],
        howToVerify:
          "Verify the company somewhere other than the ad itself: its legal existence, its address, its official site, and whether the position is actually posted there. Insist on a video interview — a genuine hiring process never refuses one, even though the interview alone doesn't prove the employer or the position. No legitimate employer ever asks for an upfront fee, and none asks you to move funds through a personal account.",
        whatToDo:
          "Don't share any identity document before a contract clearly identifies the employer, and never pay upfront fees. Firmly refuse any task consisting of receiving and then forwarding money, whatever justification is given.",
        whatToDoIfVictim:
          "If your account was used to move funds, contact your bank immediately and file a police report on your own initiative: your good faith is far easier to demonstrate before a report than after. If identity documents were shared, file a police report and watch for mail from credit organizations you didn't contact.",
        faq: [
          {
            question: "I'm asked to receive money and then send it back. What's the actual risk?",
            answer:
              "These funds generally come from another fraud, and the account that receives them helps obscure their trail. Beyond the loss, this exposes you to money-laundering prosecution: you're the identifiable one, not the organizer. Refuse, and never open an account for someone else.",
          },
          {
            question: "The company mentioned really exists — I checked its website.",
            answer:
              "A real company can be impersonated: its name and logo are public. What needs checking isn't whether the company exists, but the link between it and your contact — by reaching out through the contact details on its official site, never through those in the ad.",
          },
        ],
        whyItWorks:
          "Hiring makes requests seem normal that would be strange anywhere else: an ID, bank details, proof of address. A generous, fast offer often arrives when it's needed, which pushes the inconsistencies into the background.",
        example: {
          setting: "Message received on a messaging app, without your having applied.",
          message:
            "Hello, your profile caught our attention for a remote administrative assistant position, 2 hours a day, €1,800 a month. To finalize your hiring, send a photo of both sides of your ID and your bank details. Start date Monday.",
          giveaways: [
            "An offer you didn't ask for.",
            "A hire without an interview.",
            "Documents requested before any contract.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is there no interview or contract that clearly identifies the employer?",
            then: "Don't send any document.",
          },
          {
            check: "Are the company or the job impossible to find on its official website?",
            then: "Stop the conversation.",
          },
          {
            check: "Are you asked to pay fees upfront, or to receive money and send it on?",
            then: "Refuse: it's fraud, and the second request could expose you to prosecution.",
          },
        ],
        prevention: [
          "Apply through the employer's official website or a recognized job platform.",
          "Send identity documents only once the contract is signed and the employer verified.",
          "If you sent an ID, watch for letters from lenders you never contacted.",
        ],
        references: [
          { label: "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)", url: REF.cybermalveillance.url },
        ],
        simulationSlug: "recruitment-processing-fee",
      },
    },
  },
];

import type { AttackEntry } from "./types";
import { VERIFIED_REFERENCES as REF } from "./types";

/** Fraudes financières — see ingenierie-sociale.ts for the content rules. */
export const FRAUDES_FINANCIERES: AttackEntry[] = [
  {
    code: "SOCIAL-000001",
    slug: "faux-conseiller-bancaire",
    name: "Faux conseiller bancaire",
    categorySlug: "fraudes-financieres",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Quelqu'un vous appelle en se présentant comme le service anti-fraude de votre banque et vous demande de valider une opération pour « la bloquer ». En validant, c'est vous qui autorisez le virement de l'escroc.",
    attackerObjective: "argent",
    aliases: [
      "faux banquier",
      "usurpation de conseiller bancaire",
      "faux service anti-fraude",
      "vishing bancaire",
    ],
    primaryVector: "phone",
    primaryDimension: "social_engineering_resistance",
    simulationSlug: "appel-conseiller-bancaire",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "L'usurpation de conseiller bancaire est un appel téléphonique dans lequel l'attaquant se fait passer pour le service anti-fraude de votre banque afin de vous faire valider vous-même une opération frauduleuse.",
    howItWorks:
      "L'attaquant appelle en affichant parfois le numéro réel de la banque, technique connue sous le nom d'usurpation de numéro. Il annonce détecter une opération suspecte et propose de la « bloquer ». Pour cela, il demande de confirmer un code reçu par SMS, de valider une notification dans l'application bancaire, ou d'effectuer un virement vers un « compte sécurisé ». Chacune de ces actions autorise en réalité l'opération frauduleuse : c'est la victime elle-même qui valide, ce qui rend la contestation ultérieure plus difficile.",
    warningSigns: [
      "Appel non sollicité annonçant une fraude en cours sur votre compte",
      "Demande de communiquer ou de valider un code reçu par SMS",
      "Demande de virement vers un prétendu « compte sécurisé » ou « compte tampon »",
      "Insistance pour rester en ligne et ne raccrocher sous aucun prétexte",
      "Pression pour agir avant de vérifier auprès de quelqu'un d'autre",
    ],
    triggers: ["authority", "urgency", "fear"],
    indicators: [],
    howToVerify:
      "Raccrochez, sans exception. Rappelez ensuite votre banque au numéro figurant au dos de votre carte ou dans l'application officielle. Un conseiller légitime ne vous reprochera jamais d'avoir raccroché pour vérifier.",
    whatToDo:
      "Ne communiquez aucun code, ne validez aucune notification, n'effectuez aucun virement pendant l'appel. Une banque ne demande jamais de déplacer de l'argent pour le protéger.",
    whatToDoIfVictim:
      "Contactez immédiatement votre banque pour faire opposition et signaler l'opération. Déposez plainte. Conservez les traces disponibles : heure de l'appel, numéro affiché, montants. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Il retourne votre prudence contre vous : on vous appelle pour vous protéger d'une fraude, et chaque action demandée ressemble à une mesure de sécurité. La peur de perdre de l'argent fait agir avant de vérifier — et c'est vous qui validez l'opération.",
    example: {
      setting: "Appel un vendredi soir, d'un « conseiller » qui connaît votre nom et celui de votre agence.",
      message:
        "« Un virement de 1 870 € vers l'étranger est en attente sur votre compte. Je vais le bloquer, mais vous allez recevoir une notification dans votre application : acceptez-la pour que l'annulation soit prise en compte. »",
      giveaways: [
        "Accepter une notification ne bloque jamais une opération : cela l'autorise.",
        "L'appel tombe quand l'agence est fermée.",
        "Connaître votre nom et votre agence ne prouve rien : ces informations circulent après des fuites de données.",
      ],
    },
    decisionChecklist: [
      {
        check: "On vous demande de valider une notification, de lire un code ou de faire un virement ?",
        then: "Refusez : c'est l'opération de l'escroc que vous autoriseriez.",
      },
      {
        check: "On vous parle d'un « compte sécurisé » où mettre votre argent à l'abri ?",
        then: "Raccrochez : une banque ne déplace jamais votre argent pour le protéger.",
      },
      {
        check: "Avez-vous déjà validé quelque chose pendant l'appel ?",
        then: "Rappelez votre banque au numéro au dos de votre carte et demandez immédiatement une opposition.",
      },
    ],
    prevention: [
      "Retenez une phrase : votre banque ne vous demandera jamais de valider une opération pour l'annuler.",
      "Lisez le texte d'une notification avant de l'accepter : il décrit l'opération que vous autorisez, pas celle qu'on vous annonce.",
      "Enregistrez le numéro de votre banque depuis votre carte, jamais depuis un appel reçu.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000003",
      "SMS-000001",
      "PAYMENT-000004",
      "ACCT-000002",
      "ACCT-000004",
      "SOCIAL-000006",
      "SOCIAL-000009",
      "DATA-000008",
    ],
    faq: [
      {
        question:
          "Le numéro affiché était bien celui de ma banque, est-ce possible ?",
        answer:
          "Oui. L'affichage du numéro appelant peut être falsifié. Un numéro correct ne prouve donc jamais l'identité de l'interlocuteur, et ne doit pas servir de critère de confiance.",
      },
      {
        question:
          "Pourquoi ma banque ne me rembourse-t-elle pas automatiquement ?",
        answer:
          "Parce que les opérations ont été validées depuis vos propres dispositifs d'authentification. C'est précisément l'objectif de l'attaque. Cela ne vous prive pas de recours : contestez par écrit auprès de votre banque, et déposez plainte.",
      },
      {
        question: "Un vrai conseiller peut-il me demander un code SMS ?",
        answer:
          "Non. Aucun code d'authentification ne doit être communiqué à qui que ce soit, y compris à une personne se présentant comme votre banque ou comme la police.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "fake-bank-advisor",
        simulationSlug: "bank-advisor-call",
        name: "Fake bank advisor",
        plainLanguageDefinition:
          "Someone calls you claiming to be your bank's anti-fraud department and asks you to validate an operation to \"block it.\" By validating, you are the one authorizing the scammer's transfer.",
        definition:
          "Fake bank advisor fraud is a phone call in which the attacker poses as your bank's anti-fraud department to get you to validate a fraudulent operation yourself.",
        howItWorks:
          "The attacker calls, sometimes displaying the bank's real number, a technique known as caller ID spoofing. They announce a suspicious operation and offer to \"block\" it. To do so, they ask you to confirm a code received by text, validate a notification in the banking app, or make a transfer to a \"secure account.\" Each of these actions actually authorizes the fraudulent operation: the victim validates it themselves, which makes disputing it afterward harder.",
        warningSigns: [
          "Unsolicited call announcing fraud currently in progress on your account",
          "Request to share or validate a code received by text message",
          "Request to transfer money to a supposed \"secure account\" or \"holding account\"",
          "Insistence on staying on the line and not hanging up under any circumstances",
          "Pressure to act before checking with anyone else",
        ],
        howToVerify:
          "Hang up, without exception. Then call your bank back at the number on the back of your card or in the official app. A legitimate advisor will never hold it against you for hanging up to verify.",
        whatToDo:
          "Don't share any code, don't validate any notification, don't make any transfer during the call. A bank never asks you to move money to protect it.",
        whatToDoIfVictim:
          "Contact your bank immediately to block the card and report the operation. File a police report. Keep whatever evidence is available: time of the call, number displayed, amounts. Report the incident to the relevant authority.",
        faq: [
          {
            question: "The number displayed really was my bank's — is that possible?",
            answer:
              "Yes. Caller ID can be spoofed. A correct number therefore never proves the caller's identity, and shouldn't be used as a basis for trust.",
          },
          {
            question: "Why doesn't my bank automatically refund me?",
            answer:
              "Because the operations were validated from your own authentication devices. That's precisely the attack's goal. It doesn't remove your recourse: dispute it in writing with your bank, and file a police report.",
          },
          {
            question: "Can a real advisor ask me for a text-message code?",
            answer:
              "No. No authentication code should ever be shared with anyone, including someone presenting themselves as your bank or the police.",
          },
        ],
        whyItWorks:
          "It turns your caution against you: you're called to be protected from fraud, and every action requested looks like a security measure. The fear of losing money makes you act before checking — and you are the one who approves the transaction.",
        example: {
          setting: "Call on a Friday evening from an \"advisor\" who knows your name and your branch.",
          message:
            "\"A transfer of €1,870 abroad is pending on your account. I'm going to block it, but you'll receive a notification in your app: accept it so that the cancellation goes through.\"",
          giveaways: [
            "Accepting a notification never blocks a transaction: it authorizes it.",
            "The call comes when the branch is closed.",
            "Knowing your name and branch proves nothing: that information circulates after data breaches.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are you asked to approve a notification, read out a code or make a transfer?",
            then: "Refuse: you'd be authorizing the scammer's transaction.",
          },
          {
            check: "Are you told about a \"safe account\" to put your money out of reach?",
            then: "Hang up: a bank never moves your money to protect it.",
          },
          {
            check: "Did you already approve something during the call?",
            then: "Call your bank on the number on the back of your card and ask to block the account immediately.",
          },
        ],
        prevention: [
          "Remember one sentence: your bank will never ask you to approve a transaction in order to cancel it.",
          "Read a notification's text before accepting it: it describes the transaction you're authorizing, not the one you're being told about.",
          "Save your bank's number from your card, never from a call you received.",
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
    code: "PAYMENT-000001",
    slug: "faux-remboursement",
    name: "Faux remboursement",
    categorySlug: "fraudes-financieres",
    editorialStatus: "published",
    plainLanguageDefinition:
      "On vous annonce qu'une somme vous est due et on vous demande votre carte bancaire pour vous la verser. Un remboursement ne demande jamais de numéro de carte : c'est le signal.",
    attackerObjective: "argent",
    aliases: [
      "arnaque au remboursement",
      "faux trop-perçu",
      "faux remboursement des impôts",
    ],
    primaryVector: "email",
    primaryDimension: "financial_fraud_recognition",
    simulationSlug: "email-remboursement-impots",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "L'arnaque au faux remboursement annonce qu'une somme vous est due — impôts, mutuelle, énergie, abonnement — et demande vos coordonnées bancaires pour « procéder au versement ».",
    howItWorks:
      "Le message reprend l'identité d'un organisme public ou d'un fournisseur et annonce un trop-perçu à restituer. La perspective de recevoir de l'argent réduit la vigilance : contrairement à une menace, une bonne nouvelle n'éveille pas la méfiance. Le formulaire demande les coordonnées bancaires complètes, souvent le numéro de carte plutôt qu'un simple IBAN — détail révélateur, car un remboursement ne nécessite jamais un numéro de carte complet avec date d'expiration et cryptogramme.",
    warningSigns: [
      "Remboursement annoncé sans démarche préalable de votre part",
      "Demande du numéro de carte bancaire complet, avec cryptogramme, pour recevoir de l'argent",
      "Délai imposé pour « réclamer » la somme sous peine de la perdre",
      "Montant précis destiné à rendre le message crédible",
      "Domaine du lien différent du site officiel de l'organisme",
    ],
    triggers: ["reward", "financial_incentive"],
    indicators: [],
    howToVerify:
      "Connectez-vous à votre espace personnel officiel par vos propres moyens. Un remboursement réel y figure. Un organisme public ne réclame jamais un numéro de carte pour verser de l'argent : un versement se fait sur un IBAN déjà connu.",
    whatToDo:
      "Ne saisissez aucune coordonnée bancaire. Supprimez le message et signalez-le comme frauduleux.",
    whatToDoIfVictim:
      "Faites opposition sur votre carte, surveillez les prélèvements suivants et contestez les débits non autorisés auprès de votre banque. Déposez plainte et signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Une bonne nouvelle n'éveille pas la méfiance qu'éveille une menace. L'envie de récupérer une somme due fait accepter une étape absurde : donner sa carte pour recevoir de l'argent.",
    example: {
      setting: "Email reçu, en apparence de votre fournisseur d'accès à internet.",
      message:
        "Objet : Remboursement de 63,40 € en attente\n\nSuite à une double facturation, un remboursement vous est dû. Pour le recevoir, renseignez votre carte bancaire avant le 30/04 : rembourse-client.example-not-real.test",
      giveaways: [
        "On vous demande une carte pour recevoir de l'argent.",
        "Une date limite pour « réclamer » un remboursement.",
        "Un remboursement que vous n'avez jamais demandé.",
      ],
    },
    decisionChecklist: [
      {
        check: "La page demande-t-elle un numéro de carte, une date d'expiration ou un cryptogramme ?",
        then: "C'est une fraude : un remboursement n'en a jamais besoin.",
      },
      {
        check: "Le remboursement est-il absent de votre espace client, ouvert par vos propres moyens ?",
        then: "Supprimez le message et signalez-le comme frauduleux.",
      },
      {
        check: "Avez-vous saisi votre carte ?",
        then: "Faites opposition immédiatement.",
      },
    ],
    prevention: [
      "Retenez la règle : on vous verse de l'argent sur un IBAN, jamais en échange d'un numéro de carte.",
      "Consultez vos remboursements uniquement dans votre espace client officiel.",
      "Méfiez-vous d'un message d'autant plus qu'il annonce une bonne nouvelle inattendue.",
    ],
    relatedAttackCodes: [
      "PHISH-000001",
      "SOCIAL-000002",
      "WEB-000001",
      "PAYMENT-000003",
      "QR-000001",
      "PAYMENT-000006",
      "PAYMENT-000007",
      "SOCIAL-000010",
    ],
    faq: [
      {
        question:
          "Pourquoi demander une carte bancaire pour un remboursement ?",
        answer:
          "C'est précisément le signal d'alerte. Un versement ne nécessite qu'un IBAN. La demande d'un numéro de carte complet, avec date d'expiration et cryptogramme, ne sert qu'à débiter, jamais à créditer.",
      },
      {
        question:
          "Le message reprenait exactement le logo de l'administration.",
        answer:
          "Un logo se copie en quelques secondes. L'apparence d'un message ne constitue jamais une preuve d'authenticité : seul l'accès à votre espace officiel, par vos propres moyens, permet de vérifier.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "fake-refund",
        simulationSlug: "tax-refund-email",
        name: "Fake refund",
        plainLanguageDefinition:
          "You're told a sum of money is owed to you and asked for your bank card to pay it out. A refund never asks for a card number — that's the tell.",
        definition:
          "The fake refund scam announces that a sum is owed to you — taxes, health insurance, energy, a subscription — and asks for your full banking details to \"process the payment.\"",
        howItWorks:
          "The message impersonates a government agency or a supplier and announces an overpayment to be returned. The prospect of receiving money lowers your guard: unlike a threat, good news doesn't raise suspicion. The form asks for full banking details, often the card number rather than a simple account number (IBAN) — a telling detail, since a refund never requires a full card number with expiry date and security code.",
        warningSigns: [
          "Refund announced without any prior action on your part",
          "Request for the full card number, including the security code, to receive money",
          "Deadline imposed to \"claim\" the sum or lose it",
          "Precise amount meant to make the message credible",
          "Link domain different from the organization's official site",
        ],
        howToVerify:
          "Log into your official personal account yourself. A real refund will appear there. A government agency never asks for a card number to pay out money: a payment is made to an account number (IBAN) already on file.",
        whatToDo:
          "Don't enter any banking details. Delete the message and report it as fraudulent.",
        whatToDoIfVictim:
          "Block your card, watch for the following charges, and dispute any unauthorized debits with your bank. File a police report and report the incident to the relevant authority.",
        faq: [
          {
            question: "Why would they ask for a card for a refund?",
            answer:
              "That's precisely the warning sign. A payment only needs an account number (IBAN). Asking for a full card number, with expiry date and security code, is only ever used to charge, never to pay out.",
          },
          {
            question:
              "The message reproduced the agency's logo exactly.",
            answer:
              "A logo can be copied in seconds. The appearance of a message is never proof of authenticity: only accessing your official account, by your own means, lets you verify.",
          },
        ],
        whyItWorks:
          "Good news doesn't raise the suspicion a threat does. Wanting to recover money you're owed makes you accept an absurd step: giving your card to receive money.",
        example: {
          setting: "Email received, apparently from your internet provider.",
          message:
            "Subject: €63.40 refund pending\n\nFollowing a double billing, you are owed a refund. To receive it, enter your bank card before 04/30: rembourse-client.example-not-real.test",
          giveaways: [
            "You're asked for a card to receive money.",
            "A deadline to \"claim\" a refund.",
            "A refund you never asked for.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the page ask for a card number, expiration date or security code?",
            then: "It's fraud: a refund never needs them.",
          },
          {
            check: "Is the refund missing from your customer account, opened on your own?",
            then: "Delete the message and report it as fraudulent.",
          },
          {
            check: "Did you enter your card?",
            then: "Block the card immediately.",
          },
        ],
        prevention: [
          "Remember the rule: money is paid to you through your bank account details, never in exchange for a card number.",
          "Check your refunds only in your official customer account.",
          "Be all the more wary of a message when it announces unexpected good news.",
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
    code: "SOCIAL-000002",
    slug: "faux-livreur-colis",
    name: "Faux livreur / colis en attente",
    categorySlug: "fraudes-financieres",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un SMS annonce un colis bloqué et réclame quelques euros de frais. Le petit montant n'est pas le but : c'est votre numéro de carte complet qui est visé, et il servira ensuite à des prélèvements bien plus gros.",
    attackerObjective: "argent",
    aliases: [
      "arnaque au colis",
      "faux SMS de livraison",
      "colis en attente",
      "faux transporteur",
    ],
    primaryVector: "sms",
    primaryDimension: "sms_scam_recognition",
    simulationSlug: "sms-colis",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "L'arnaque au colis est un SMS ou un email prétendant qu'une livraison est bloquée et qu'un petit paiement — frais de douane, de réexpédition, d'ajustement — est nécessaire pour la débloquer.",
    howItWorks:
      "Le message imite un transporteur connu et annonce un colis en attente. Le montant réclamé est volontairement faible, souvent quelques euros, car une petite somme déclenche moins de méfiance qu'un montant important. La page de paiement collecte les coordonnées bancaires complètes. Celles-ci servent ensuite à des débits nettement supérieurs, ou à souscrire un abonnement récurrent. L'attaque fonctionne parce qu'elle arrive à un moment plausible : beaucoup de gens attendent effectivement une livraison.",
    warningSigns: [
      "Frais réclamés pour un colis que vous n'avez pas commandé, ou dont le transporteur ne correspond pas",
      "Montant faible mais paiement par carte demandé en ligne",
      "Lien menant à un domaine qui n'est pas le site officiel du transporteur",
      "Message reçu alors qu'aucune livraison n'est en cours",
      "Absence de numéro de suivi vérifiable sur le site officiel",
    ],
    triggers: ["urgency", "curiosity"],
    indicators: [],
    howToVerify:
      "Retrouvez le numéro de suivi dans la confirmation de commande d'origine, puis saisissez-le vous-même sur le site officiel du transporteur. Ne suivez jamais le lien du message pour vérifier le message lui-même.",
    whatToDo:
      "Ne payez pas, ne saisissez pas votre carte. Supprimez le message. En France, un SMS frauduleux peut être transféré au 33700.",
    whatToDoIfVictim:
      "Faites opposition sur votre carte immédiatement et surveillez les prélèvements des semaines suivantes, notamment les abonnements récurrents. Contestez les débits auprès de votre banque et déposez plainte.",
    whyItWorks:
      "Il arrive au moment où il est le plus crédible : presque tout le monde attend un colis à un moment ou à un autre. Le petit montant rend la dépense anodine, et l'on ne se demande pas pourquoi une page réclame la carte complète pour quelques euros.",
    example: {
      setting: "SMS reçu un mardi, alors que vous attendez effectivement une commande.",
      message:
        "Votre colis n° FR38261 est en attente au centre de tri. Des frais de réexpédition de 2,49 € sont nécessaires : livraison-relais.example-not-real.test/r",
      giveaways: [
        "Aucun transporteur n'est nommé, seulement un « centre de tri ».",
        "Le numéro de suivi ne figure pas dans votre confirmation de commande.",
        "Des frais à payer par lien pour un colis déjà réglé.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le numéro de suivi est-il absent de votre confirmation de commande ?",
        then: "Le message ne concerne pas votre colis : supprimez-le.",
      },
      {
        check: "Le site du transporteur, ouvert par vos propres moyens, est-il muet sur ces frais ?",
        then: "Le SMS est faux : transférez-le au 33700, puis supprimez-le.",
      },
      {
        check: "Avez-vous déjà saisi votre carte sur la page ?",
        then: "Faites opposition sans attendre, même pour quelques euros : la carte peut servir à d'autres débits.",
      },
    ],
    prevention: [
      "Suivez vos colis uniquement depuis le site du vendeur ou du transporteur, à partir de votre confirmation de commande.",
      "Ne payez jamais un supplément de livraison depuis un lien reçu.",
      "Activez les notifications de paiement de votre banque pour repérer un débit inattendu.",
    ],
    relatedAttackCodes: [
      "SMS-000001",
      "PAYMENT-000001",
      "QR-000001",
      "MOB-000006",
    ],
    faq: [
      {
        question: "Le montant demandé était minuscule, où est le risque ?",
        answer:
          "Le paiement n'est pas l'objectif : la collecte de vos coordonnées bancaires l'est. Le faible montant sert uniquement à obtenir la saisie complète de la carte.",
      },
      {
        question: "J'attends vraiment un colis, comment savoir ?",
        answer:
          "Un transporteur légitime rattache toujours la démarche à un numéro de suivi que vous pouvez vérifier vous-même sur son site officiel. Vérifiez ce numéro par vos propres moyens, jamais via le lien reçu.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "fake-delivery-scam",
        simulationSlug: "parcel-text-message",
        name: "Fake courier / package on hold",
        plainLanguageDefinition:
          "A text message announces a held package and asks for a few euros in fees. The small amount isn't the goal: it's your full card number they're after, to be used later for much bigger charges.",
        definition:
          "The package scam is a text message or email claiming that a delivery is on hold and that a small payment — customs fees, reshipping fees, an adjustment — is needed to release it.",
        howItWorks:
          "The message imitates a well-known carrier and announces a package on hold. The amount requested is deliberately low, often just a few euros, since a small sum raises less suspicion than a large one. The payment page collects full banking details. These are then used for much larger charges, or to sign up for a recurring subscription. The attack works because it arrives at a plausible moment: many people really are waiting for a delivery.",
        warningSigns: [
          "Fees requested for a package you didn't order, or whose carrier doesn't match",
          "Small amount but card payment requested online",
          "Link leading to a domain that isn't the carrier's official site",
          "Message received while no delivery is actually pending",
          "No tracking number verifiable on the official site",
        ],
        howToVerify:
          "Find the tracking number in your original order confirmation, then enter it yourself on the carrier's official site. Never follow the link in the message to verify the message itself.",
        whatToDo:
          "Don't pay, don't enter your card details. Delete the message. In France, a fraudulent text message can be forwarded to 33700; check your own country's equivalent reporting number.",
        whatToDoIfVictim:
          "Block your card immediately and watch the following weeks' charges, especially recurring subscriptions. Dispute the charges with your bank and file a police report.",
        faq: [
          {
            question: "The amount asked for was tiny — where's the risk?",
            answer:
              "The payment isn't the goal: collecting your banking details is. The small amount is only there to get you to enter your full card details.",
          },
          {
            question: "I really am waiting for a package — how do I know?",
            answer:
              "A legitimate carrier always ties the process to a tracking number you can verify yourself on its official site. Verify that number by your own means, never through the received link.",
          },
        ],
        whyItWorks:
          "It arrives when it's most believable: almost everyone is expecting a package at some point. The small amount makes the expense seem trivial, and nobody wonders why a page wants the full card details for a few euros.",
        example: {
          setting: "Text received on a Tuesday, while you are in fact expecting an order.",
          message:
            "Your package no. FR38261 is on hold at the sorting center. A redelivery fee of €2.49 is required: livraison-relais.example-not-real.test/r",
          giveaways: [
            "No carrier is named, just a \"sorting center\".",
            "The tracking number isn't in your order confirmation.",
            "Fees to pay through a link for a package that's already paid for.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the tracking number missing from your order confirmation?",
            then: "The message isn't about your package: delete it.",
          },
          {
            check: "Does the carrier's site, opened on your own, say nothing about these fees?",
            then: "The text is fake: forward it to your carrier's spam-reporting number (33700 in France), then delete it.",
          },
          {
            check: "Have you already entered your card on the page?",
            then: "Block the card right away, even for a few euros: it can be used for other charges.",
          },
        ],
        prevention: [
          "Track packages only from the seller's or carrier's site, starting from your order confirmation.",
          "Never pay a delivery surcharge from a link you received.",
          "Turn on your bank's payment notifications to spot an unexpected charge.",
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
    code: "PAYMENT-000003",
    slug: "arnaque-a-l-investissement",
    name: "Arnaque à l'investissement",
    categorySlug: "fraudes-financieres",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un placement présenté comme sûr et très rentable, avec un « conseiller » très disponible. Un premier petit retrait fonctionne pour vous mettre en confiance ; ensuite, récupérer l'argent devient impossible.",
    attackerObjective: "argent",
    aliases: [
      "faux placement",
      "arnaque au trading",
      "faux investissement en cryptomonnaie",
      "arnaque au placement financier",
    ],
    primaryVector: "advertisement",
    primaryDimension: "financial_fraud_recognition",
    simulationSlug: "placement-rendement-garanti",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "L'arnaque à l'investissement propose un placement présenté comme sûr et très rentable — cryptoactifs, énergies, produits financiers — pour obtenir des versements successifs qui ne seront jamais restitués.",
    howItWorks:
      "L'entrée se fait par une publicité, un article sponsorisé ou un message direct. Un « conseiller » rappelle et accompagne pas à pas un premier versement modeste. Une interface affiche ensuite des gains, et un premier retrait de faible montant est parfois autorisé : cette preuve apparente est le cœur du dispositif, car elle transforme le doute en confiance et justifie des versements bien plus importants. Quand la victime demande à récupérer l'ensemble, des frais, des taxes ou une régularisation sont exigés d'abord — nouvelles sommes à verser, jamais suffisantes. Les gains affichés n'ont jamais existé : ils ne sont qu'un affichage.",
    warningSigns: [
      "Rendement élevé présenté comme garanti ou sans risque",
      "Sollicitation à l'initiative du vendeur, par publicité, appel ou message direct",
      "Accompagnement insistant d'un « conseiller » personnel",
      "Retrait initial de faible montant proposé spontanément",
      "Frais, taxes ou commission réclamés avant de pouvoir récupérer les fonds",
      "Société non identifiable, ou non inscrite auprès du régulateur du pays où elle prétend opérer",
    ],
    triggers: ["reward", "financial_incentive", "trust", "scarcity"],
    indicators: [],
    howToVerify:
      "Vérifiez que la société figure dans les registres officiels des acteurs autorisés à proposer des placements, tenus par les autorités financières. Un rendement garanti et élevé n'existe pas : rendement et risque sont indissociables, et toute présentation contraire suffit à conclure. Demandez conseil à votre banque avant tout versement.",
    whatToDo:
      "Ne versez rien et cessez le contact. Ne partagez ni pièce d'identité, ni relevé bancaire, ni accès à distance à votre ordinateur — ces éléments sont fréquemment réclamés pour « ouvrir le dossier ».",
    whatToDoIfVictim:
      "Cessez immédiatement tout nouveau versement, en particulier ceux présentés comme nécessaires pour récupérer les fonds. Rassemblez les preuves, contactez votre banque et déposez plainte. Méfiez-vous des sollicitations qui suivront pour « récupérer votre argent » : ce sont généralement les mêmes acteurs, sous une autre identité.",
    whyItWorks:
      "Elle s'appuie sur une preuve apparente : des gains affichés et un premier retrait qui fonctionne. Le « conseiller » disponible et chaleureux installe une relation de confiance, et chaque nouveau versement est présenté comme le moyen de récupérer les précédents.",
    example: {
      setting: "Après avoir cliqué sur une publicité, un « conseiller patrimonial » vous rappelle.",
      message:
        "« Avec notre portefeuille sécurisé, vous gagnez 2 % par mois, garantis. Commencez avec 250 € pour tester : vous suivez vos gains en temps réel et vous retirez quand vous voulez. »",
      giveaways: [
        "Un rendement à la fois élevé et garanti.",
        "Une sollicitation venue d'eux, pas de vous.",
        "« Tester » avec une petite somme : c'est l'étape qui prépare les suivantes.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le rendement est-il présenté comme garanti ou sans risque ?",
        then: "Arrêtez là : un rendement élevé ne s'accompagne jamais d'une garantie.",
      },
      {
        check: "La société est-elle absente des registres officiels des acteurs autorisés ?",
        then: "Ne versez rien.",
      },
      {
        check: "On vous réclame des frais ou des taxes avant de pouvoir retirer vos gains ?",
        then: "Ne payez pas : les gains affichés n'existent pas. Coupez le contact et parlez-en à votre banque.",
      },
    ],
    prevention: [
      "Ne placez jamais d'argent à la suite d'une sollicitation que vous n'avez pas demandée.",
      "Vérifiez toute société dans les registres officiels avant le premier euro.",
      "Demandez l'avis de votre banque ou d'un proche avant tout placement nouveau.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000004",
      "WEB-000001",
      "PAYMENT-000001",
      "PAYMENT-000006",
      "AI-000001",
      "AI-000005",
    ],
    faq: [
      {
        question:
          "J'ai pu retirer une petite somme au début, ce n'est donc pas une arnaque ?",
        answer:
          "Ce premier retrait fait partie du procédé. Il coûte peu à l'attaquant et sert précisément à obtenir des versements bien supérieurs ensuite. Un retrait réussi ne prouve rien sur les fonds affichés.",
      },
      {
        question: "On me demande de payer des frais pour débloquer mes gains.",
        answer:
          "C'est le signal final. Des frais réels sont prélevés sur la somme versée, jamais réclamés en supplément. Toute demande de paiement supplémentaire pour récupérer de l'argent est une nouvelle étape de la même fraude.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "investment-scam",
        simulationSlug: "guaranteed-return-investment",
        name: "Investment scam",
        plainLanguageDefinition:
          "An investment presented as safe and highly profitable, with a very available \"advisor.\" A first small withdrawal works to build trust; after that, getting the money back becomes impossible.",
        definition:
          "The investment scam offers an investment presented as safe and highly profitable — crypto assets, energy, financial products — to obtain successive payments that will never be returned.",
        howItWorks:
          "Entry comes through an advertisement, a sponsored article, or a direct message. An \"advisor\" calls back and guides a first modest payment step by step. An interface then shows gains, and a small initial withdrawal is sometimes allowed: this apparent proof is the core of the scheme, since it turns doubt into trust and justifies much larger payments. When the victim asks to withdraw everything, fees, taxes, or a regularization are demanded first — new sums to pay, never enough. The displayed gains never existed: they are just a display.",
        warningSigns: [
          "High return presented as guaranteed or risk-free",
          "Solicitation initiated by the seller, through advertising, a call, or a direct message",
          "Insistent guidance from a personal \"advisor\"",
          "Small initial withdrawal offered spontaneously",
          "Fees, taxes, or a commission demanded before funds can be withdrawn",
          "Company that cannot be identified, or not registered with the financial regulator of the country where it claims to operate",
        ],
        howToVerify:
          "Check that the company appears in the official registers of entities authorized to offer investments, kept by financial regulators. A guaranteed high return doesn't exist: return and risk are inseparable, and any claim to the contrary is enough to conclude it's a scam. Ask your bank for advice before making any payment.",
        whatToDo:
          "Don't pay anything and stop all contact. Don't share an ID document, a bank statement, or remote access to your computer — these are frequently requested to \"open the file.\"",
        whatToDoIfVictim:
          "Stop all further payments immediately, especially those presented as necessary to get the funds back. Gather the evidence, contact your bank, and file a police report. Be wary of any later contact offering to \"help recover your money\": it's usually the same people, under another identity.",
        faq: [
          {
            question:
              "I was able to withdraw a small sum at the start, so it isn't a scam?",
            answer:
              "That first withdrawal is part of the method. It costs the attacker little and serves precisely to obtain much larger payments afterward. A successful withdrawal proves nothing about the displayed funds.",
          },
          {
            question: "I'm being asked to pay fees to unlock my gains.",
            answer:
              "That's the final signal. Real fees are deducted from the amount paid out, never demanded on top of it. Any request for an additional payment to get money back is a new step in the same fraud.",
          },
        ],
        whyItWorks:
          "It relies on apparent proof: gains displayed on screen and a first withdrawal that works. The friendly, always-available \"advisor\" builds trust, and each new deposit is presented as the way to recover the previous ones.",
        example: {
          setting: "After you click on an ad, a \"wealth advisor\" calls you back.",
          message:
            "\"With our secure portfolio, you earn 2% a month, guaranteed. Start with €250 to try it out: you follow your gains in real time and withdraw whenever you like.\"",
          giveaways: [
            "A return that is both high and guaranteed.",
            "They reached out to you, not the other way around.",
            "\"Trying it out\" with a small amount: that's the step that sets up the next ones.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the return presented as guaranteed or risk-free?",
            then: "Stop there: a high return never comes with a guarantee.",
          },
          {
            check: "Is the company missing from the official registers of authorized firms?",
            then: "Don't invest anything.",
          },
          {
            check: "Are you asked for fees or taxes before you can withdraw your gains?",
            then: "Don't pay: the gains on screen don't exist. Cut off contact and talk to your bank.",
          },
        ],
        prevention: [
          "Never invest money following a solicitation you didn't ask for.",
          "Check any company in the official registers before the first euro.",
          "Ask your bank or someone close for an opinion before any new investment.",
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
    code: "PAYMENT-000002",
    slug: "faux-ordre-de-virement",
    name: "Faux ordre de virement (fraude au président)",
    categorySlug: "fraudes-financieres",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un message qui semble venir de la direction demande un virement urgent et confidentiel, en dehors des procédures habituelles. La confidentialité demandée sert à empêcher qu'un collègue vérifie.",
    attackerObjective: "argent",
    aliases: [
      "fraude au président",
      "FOVI",
      "faux ordre de virement international",
      "arnaque au faux dirigeant",
    ],
    primaryVector: "email",
    primaryDimension: "financial_fraud_recognition",
    simulationSlug: "email-virement-urgent-direction",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "Le faux ordre de virement est une fraude visant les entreprises et les associations : un message se présentant comme la direction ou un dirigeant demande un virement urgent, confidentiel et sortant des procédures habituelles.",
    howItWorks:
      "L'attaquant se documente d'abord sur l'organisation à partir d'informations publiques : organigramme, nom du dirigeant, service comptable, opérations en cours. Le message arrive ensuite au bon moment — veille de congés, période de clôture — et combine trois leviers : l'autorité de l'expéditeur supposé, la confidentialité invoquée (opération sensible, rachat en cours) qui interdit d'en parler autour de soi, et un délai qui empêche la vérification. L'adresse d'expédition imite celle de l'organisation, ou la réponse est redirigée vers une autre boîte. Ce qui rend la fraude efficace n'est pas la crédulité du comptable, mais la difficulté sociale à contredire une consigne présentée comme venant du dirigeant.",
    warningSigns: [
      "Demande de virement présentée comme urgente et confidentielle",
      "Consigne explicite de ne pas en parler aux collègues ou au supérieur habituel",
      "Procédure de validation habituelle contournée « exceptionnellement »",
      "Adresse d'expéditeur légèrement différente de l'adresse interne, ou adresse de réponse distincte",
      "Coordonnées bancaires nouvelles, souvent à l'étranger",
      "Message envoyé juste avant une période de congés ou une fin de journée",
    ],
    triggers: ["authority", "urgency", "social_pressure"],
    indicators: [],
    howToVerify:
      "Rappelez le demandeur sur le numéro interne déjà connu, jamais sur un numéro indiqué dans le message. Appliquez la procédure de double validation prévue pour tout virement, sans exception : une demande légitime n'est jamais empêchée par une vérification, et un dirigeant réel ne reprochera pas de l'avoir appliquée.",
    whatToDo:
      "N'exécutez pas le virement. Signalez le message au responsable financier et au service informatique, et prévenez les autres personnes habilitées à payer : la même demande leur est souvent envoyée en parallèle.",
    whatToDoIfVictim:
      "Contactez la banque immédiatement : un virement très récent peut parfois être bloqué ou rappelé, et chaque heure compte. Déposez plainte, conservez les messages et les journaux de connexion, et prévenez les partenaires concernés si leurs coordonnées ont pu être utilisées.",
    whyItWorks:
      "Contredire une consigne qui semble venir de la direction est socialement difficile, surtout quand la confidentialité est exigée. L'urgence et le moment choisi — veille de congés, fin de journée — suppriment la possibilité de vérifier auprès de quelqu'un.",
    example: {
      setting: "Email reçu par la comptable d'une petite entreprise, un vendredi à 17 h 40.",
      message:
        "Objet : Opération confidentielle\n\nBonjour,\nNous finalisons une acquisition et j'ai besoin que vous effectuiez aujourd'hui un virement de 48 500 € sur le compte ci-joint. Merci de traiter cela en toute discrétion, sans en parler pour le moment. Je suis en réunion : répondez uniquement par email.\n\nLe directeur général",
      giveaways: [
        "La confidentialité est exigée envers les collègues.",
        "La procédure habituelle est contournée.",
        "Le demandeur est injoignable par téléphone.",
      ],
    },
    decisionChecklist: [
      {
        check: "La demande contourne-t-elle la procédure de validation habituelle ?",
        then: "Appliquez la procédure quand même, sans exception.",
      },
      {
        check: "Le demandeur est-il injoignable sur son numéro interne habituel ?",
        then: "N'exécutez rien : une demande qui ne peut pas être confirmée ne s'exécute pas.",
      },
      {
        check: "Les coordonnées bancaires sont-elles nouvelles ?",
        then: "Vérifiez-les par un canal indépendant avant tout paiement.",
      },
    ],
    prevention: [
      "Mettez par écrit une procédure de double validation pour tout virement inhabituel, connue de toutes les personnes habilitées.",
      "Convenez qu'aucune consigne de confidentialité ne dispense d'une vérification.",
      "Quand une tentative est détectée, prévenez les autres personnes habilitées à payer : elles reçoivent souvent la même.",
    ],
    relatedAttackCodes: [
      "PAYMENT-000004",
      "PHISH-000001",
      "ACCT-000003",
      "PAYMENT-000005",
      "SOCIAL-000007",
      "AI-000004",
      "AI-000008",
    ],
    faq: [
      {
        question: "Le message venait bien de l'adresse interne du dirigeant.",
        answer:
          "Cela arrive lorsque sa messagerie a été compromise en amont : la fraude est alors précédée d'une attaque de compte. C'est une raison de plus pour que la vérification passe par un canal différent du message lui-même — un appel sur un numéro connu.",
      },
      {
        question:
          "Comment protéger une petite structure sans service financier dédié ?",
        answer:
          "Une règle écrite suffit et ne coûte rien : tout virement au-delà d'un seuil, ou vers un nouveau bénéficiaire, exige une validation orale par une seconde personne sur un numéro déjà enregistré. La règle protège autant l'organisation que la personne qui exécute le paiement.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "ceo-fraud",
        simulationSlug: "urgent-transfer-from-management",
        name: "Fake wire transfer order (CEO fraud)",
        plainLanguageDefinition:
          "A message that appears to come from management asks for an urgent, confidential transfer, outside the usual procedures. The confidentiality requested is meant to stop a colleague from checking.",
        definition:
          "CEO fraud targets businesses and associations: a message presenting itself as coming from management or an executive asks for an urgent, confidential transfer that bypasses the usual procedures.",
        howItWorks:
          "The attacker first researches the organization from public information: org chart, executive's name, accounting department, ongoing deals. The message then arrives at the right moment — the eve of a holiday, closing period — and combines three levers: the authority of the supposed sender, the confidentiality invoked (a sensitive deal, an acquisition in progress) that forbids talking about it, and a deadline that prevents verification. The sending address imitates the organization's, or replies are redirected to another mailbox. What makes the fraud effective isn't the accountant's gullibility, but the social difficulty of contradicting an instruction presented as coming from the CEO.",
        warningSigns: [
          "Transfer request presented as urgent and confidential",
          "Explicit instruction not to mention it to colleagues or your usual supervisor",
          "Usual validation procedure bypassed \"exceptionally\"",
          "Sender address slightly different from the internal address, or a separate reply address",
          "New banking details, often abroad",
          "Message sent just before a holiday period or at the end of the day",
        ],
        howToVerify:
          "Call the requester back on the already-known internal number, never on a number given in the message. Apply the two-person validation procedure required for every transfer, without exception: a legitimate request is never held back by a verification, and a real executive will never hold applying it against you.",
        whatToDo:
          "Don't execute the transfer. Report the message to the finance manager and IT department, and warn other people authorized to make payments: the same request is often sent to them in parallel.",
        whatToDoIfVictim:
          "Contact the bank immediately: a very recent transfer can sometimes be blocked or recalled, and every hour matters. File a police report, keep the messages and connection logs, and notify the partners concerned if their details may have been used.",
        faq: [
          {
            question: "The message really did come from the executive's internal address.",
            answer:
              "This happens when their mailbox has been compromised beforehand: the fraud is then preceded by an account takeover. That's one more reason for verification to go through a channel different from the message itself — a call to a known number.",
          },
          {
            question:
              "How can a small organization without a dedicated finance department protect itself?",
            answer:
              "A written rule is enough and costs nothing: any transfer above a threshold, or to a new payee, requires verbal validation by a second person on an already-registered number. The rule protects the organization as much as the person executing the payment.",
          },
        ],
        whyItWorks:
          "Contradicting an instruction that seems to come from management is socially difficult, especially when confidentiality is demanded. Urgency and the chosen moment — the eve of a holiday, the end of the day — remove any chance to check with someone.",
        example: {
          setting: "Email received by a small company's accountant, on a Friday at 5:40 pm.",
          message:
            "Subject: Confidential transaction\n\nHello,\nWe're finalizing an acquisition and I need you to make a €48,500 transfer today to the attached account. Please handle this with complete discretion, without mentioning it for now. I'm in a meeting: reply by email only.\n\nThe CEO",
          giveaways: [
            "Confidentiality toward colleagues is demanded.",
            "The usual procedure is bypassed.",
            "The requester can't be reached by phone.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the request bypass the usual approval procedure?",
            then: "Follow the procedure anyway, without exception.",
          },
          {
            check: "Is the requester unreachable on their usual internal number?",
            then: "Execute nothing: a request that can't be confirmed isn't carried out.",
          },
          {
            check: "Are the bank details new?",
            then: "Verify them through an independent channel before any payment.",
          },
        ],
        prevention: [
          "Write down a dual-approval procedure for any unusual transfer, known to everyone authorized to pay.",
          "Agree that no confidentiality instruction exempts anyone from verification.",
          "When an attempt is detected, warn the other people authorized to pay: they often receive the same one.",
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
    code: "PAYMENT-000004",
    slug: "fraude-au-changement-de-rib",
    name: "Fraude au changement de RIB",
    categorySlug: "fraudes-financieres",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un fournisseur habituel annonce par email qu'il a changé de banque. La facture est la même, seul l'IBAN change. Le paiement part chez l'escroc, et on ne s'en aperçoit qu'à la relance.",
    attackerObjective: "argent",
    aliases: [
      "fraude au faux RIB",
      "fraude au changement d'IBAN",
      "fraude au fournisseur",
      "arnaque au faux virement",
    ],
    primaryVector: "email",
    primaryDimension: "financial_fraud_recognition",
    simulationSlug: "email-changement-de-rib",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "La fraude au changement de RIB consiste à faire modifier les coordonnées bancaires d'un bénéficiaire habituel — fournisseur, artisan, bailleur, employeur — pour détourner un paiement attendu.",
    howItWorks:
      "L'attaquant s'insère dans une relation de paiement existante, souvent après avoir accédé à la messagerie de l'une des deux parties. Il envoie un message annonçant un changement de banque, accompagné d'un nouvel IBAN et parfois d'une facture reprenant la mise en forme habituelle. Rien n'est urgent ni inhabituel dans l'apparence : la force de cette fraude est justement sa banalité, car le paiement était de toute façon prévu. Elle n'est découverte qu'à la relance du vrai créancier, souvent plusieurs semaines plus tard, lorsque les fonds ne sont plus récupérables.",
    warningSigns: [
      "Notification de changement de coordonnées bancaires reçue par email",
      "Nouvelle facture identique aux précédentes, à l'exception de l'IBAN",
      "Banque du bénéficiaire différente de celle utilisée jusqu'ici, ou établie dans un autre pays",
      "Demande formulée dans un fil de discussion existant, sans autre changement",
      "Impossibilité de joindre l'interlocuteur habituel au moment de la demande",
    ],
    triggers: ["trust", "authority"],
    indicators: [],
    howToVerify:
      "Appelez le bénéficiaire sur le numéro que vous utilisiez déjà avant ce message, jamais sur celui indiqué dans le message ou dans la nouvelle facture. Faites confirmer oralement le changement, et procédez d'abord à un virement de test de faible montant que le bénéficiaire confirmera avoir reçu.",
    whatToDo:
      "Suspendez le paiement jusqu'à confirmation orale. Signalez la demande à votre service comptable, et prévenez le bénéficiaire réel : sa messagerie est peut-être compromise.",
    whatToDoIfVictim:
      "Contactez votre banque sans délai pour demander un rappel du virement, puis prévenez le bénéficiaire légitime et déposez plainte. Faites analyser les messageries concernées, car la fraude implique presque toujours un accès à l'une des deux.",
    whyItWorks:
      "Le paiement était prévu, le fournisseur est connu, la facture ressemble aux précédentes : rien n'appelle la méfiance. Le message arrive souvent dans le vrai fil de discussion, ce qui lui prête la confiance accumulée avec ce fournisseur.",
    example: {
      setting: "Email reçu dans le fil habituel avec un fournisseur, la veille d'une échéance.",
      message:
        "Bonjour, suite à un changement d'établissement bancaire, merci de régler la facture jointe sur nos nouvelles coordonnées (IBAN ci-dessous). Les anciennes ne seront plus créditées à compter de ce jour.\nService comptabilité, fournisseur-exemple.test",
      giveaways: [
        "Le seul changement est l'IBAN, annoncé par simple email.",
        "La nouvelle banque est différente, parfois dans un autre pays.",
        "Le message ne laisse aucune autre façon de confirmer que de répondre.",
      ],
    },
    decisionChecklist: [
      {
        check: "Un email vous demande-t-il de payer sur un IBAN différent de d'habitude ?",
        then: "Suspendez le paiement et appelez le fournisseur sur le numéro que vous aviez avant ce message.",
      },
      {
        check: "Le fournisseur, joint par ce numéro, ignore-t-il ce changement ?",
        then: "Ne payez pas et prévenez-le : sa messagerie ou la vôtre est peut-être compromise.",
      },
      {
        check: "Avez-vous déjà payé sur le nouvel IBAN ?",
        then: "Appelez votre banque sans attendre pour demander un rappel du virement, puis déposez plainte.",
      },
    ],
    prevention: [
      "Fixez une règle écrite : tout changement d'IBAN se confirme par téléphone, au numéro déjà connu.",
      "Faites valider les changements de coordonnées bancaires par une seconde personne.",
      "Activez la double authentification sur les messageries qui reçoivent des factures.",
    ],
    relatedAttackCodes: [
      "PAYMENT-000002",
      "ACCT-000003",
      "PHISH-000001",
      "SOCIAL-000001",
      "SOCIAL-000005",
      "PAYMENT-000005",
    ],
    faq: [
      {
        question:
          "Le message venait de l'adresse habituelle de mon fournisseur.",
        answer:
          "C'est le cas le plus fréquent : la fraude suit une compromission de la messagerie du fournisseur, ce qui rend le message authentique du point de vue technique. Seule une vérification orale sur un numéro déjà connu permet de trancher.",
      },
      {
        question: "Le virement est parti, puis-je le récupérer ?",
        answer:
          "C'est possible si l'alerte est donnée très tôt : la banque peut tenter un rappel de fonds tant que le compte destinataire n'a pas été vidé. Le délai est le facteur déterminant — appelez avant toute autre démarche.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "fake-bank-details-change",
        simulationSlug: "supplier-bank-details-change",
        name: "Fake bank details change",
        plainLanguageDefinition:
          "A regular supplier announces by email that it changed banks. The invoice is the same, only the account number changes. The payment goes to the scammer, and it's only noticed when the real supplier follows up.",
        definition:
          "The fake bank details change fraud consists of getting a regular payee's — supplier, contractor, landlord, employer — banking details changed, in order to divert an expected payment.",
        howItWorks:
          "The attacker inserts themselves into an existing payment relationship, often after gaining access to one party's mailbox. They send a message announcing a change of bank, with a new account number and sometimes an invoice matching the usual formatting. Nothing looks urgent or unusual: the fraud's strength is precisely its ordinariness, since the payment was expected anyway. It's only discovered when the real creditor follows up, often several weeks later, once the funds can no longer be recovered.",
        warningSigns: [
          "Notification of a change in banking details received by email",
          "New invoice identical to previous ones, except for the account number",
          "Payee's bank different from the one used so far, or based in another country",
          "Request made within an existing conversation thread, with no other change",
          "Impossible to reach the usual contact at the time of the request",
        ],
        howToVerify:
          "Call the payee on the number you were already using before this message, never on the one shown in the message or on the new invoice. Get the change confirmed verbally, and first make a small test transfer that the payee confirms receiving.",
        whatToDo:
          "Suspend the payment until verbal confirmation. Report the request to your accounting department, and warn the real payee: their mailbox may be compromised.",
        whatToDoIfVictim:
          "Contact your bank without delay to request a recall of the transfer, then notify the real payee and file a police report. Have the mailboxes involved analyzed, since the fraud almost always involves access to one of them.",
        faq: [
          {
            question: "The message came from my supplier's usual address.",
            answer:
              "That's the most common case: the fraud follows a compromise of the supplier's mailbox, which makes the message technically authentic. Only a verbal verification on an already-known number can settle it.",
          },
          {
            question: "The transfer has gone out — can I recover it?",
            answer:
              "It's possible if the alert is raised very early: the bank can attempt a fund recall as long as the destination account hasn't been emptied. Time is the deciding factor — call before doing anything else.",
          },
        ],
        whyItWorks:
          "The payment was planned, the supplier is known, the invoice looks like the previous ones: nothing calls for suspicion. The message often arrives in the real email thread, borrowing the trust built up with that supplier.",
        example: {
          setting: "Email received in the usual thread with a supplier, the day before a due date.",
          message:
            "Hello, following a change of bank, please pay the attached invoice to our new details (IBAN below). The old account will no longer be credited from today.\nAccounts department, fournisseur-exemple.test",
          giveaways: [
            "The only change is the IBAN, announced by a simple email.",
            "The new bank is different, sometimes in another country.",
            "The message leaves no way to confirm other than replying.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does an email ask you to pay to a different IBAN than usual?",
            then: "Hold the payment and call the supplier on the number you had before this message.",
          },
          {
            check: "Does the supplier, reached on that number, know nothing about this change?",
            then: "Don't pay and warn them: their email or yours may be compromised.",
          },
          {
            check: "Have you already paid to the new IBAN?",
            then: "Call your bank right away to request a recall of the transfer, then file a police report.",
          },
        ],
        prevention: [
          "Set a written rule: any IBAN change is confirmed by phone, on the number already known.",
          "Have changes to bank details approved by a second person.",
          "Turn on two-factor authentication for the email accounts that receive invoices.",
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
    code: "WEB-000001",
    slug: "fausse-boutique-en-ligne",
    name: "Fausse boutique en ligne",
    categorySlug: "fraudes-financieres",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une boutique qui a l'air normale, avec des prix très bas et un compte à rebours. Vous payez, et rien n'arrive jamais — ni le colis, ni de réponse au formulaire de contact.",
    attackerObjective: "argent",
    aliases: [
      "faux site marchand",
      "arnaque à la boutique en ligne",
      "faux e-commerce",
    ],
    primaryVector: "advertisement",
    primaryDimension: "financial_fraud_recognition",
    simulationSlug: "boutique-promotion-exceptionnelle",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "Une fausse boutique en ligne est un site marchand créé pour encaisser des paiements sans jamais livrer, ou pour collecter des coordonnées bancaires sous couvert d'une commande.",
    howItWorks:
      "Le site est monté à partir d'un modèle de boutique standard, ce qui lui donne immédiatement une apparence professionnelle. Il est mis en avant par des publicités sur les réseaux sociaux ou les moteurs de recherche, ciblant un produit recherché ou une promotion. Les prix sont nettement inférieurs au marché, et un compte à rebours entretient la précipitation. Après le paiement, soit rien n'est livré, soit un article sans rapport arrive — ce qui suffit parfois à faire clore une contestation. Les mentions légales, quand elles existent, sont copiées d'un autre site, et le seul moyen de contact est un formulaire qui ne reçoit pas de réponse.",
    warningSigns: [
      "Prix très inférieur au marché sur un produit habituellement peu remisé",
      "Compte à rebours ou stock affiché comme presque épuisé",
      "Aucune adresse postale ni numéro d'entreprise vérifiable dans les mentions légales",
      "Contact limité à un formulaire ou à une adresse générique",
      "Paiement proposé uniquement par virement, par carte prépayée ou hors des moyens habituels",
      "Nom de domaine récent, sans historique et sans avis externes au site lui-même",
    ],
    triggers: ["reward", "scarcity", "urgency"],
    indicators: [],
    howToVerify:
      "Cherchez le nom de la boutique en dehors de son propre site : les avis hébergés sur la page sont écrits par le vendeur. Vérifiez que les mentions légales comportent une raison sociale et un numéro d'identification d'entreprise, et que ces informations correspondent au site. Enfin, privilégiez un moyen de paiement offrant une procédure de contestation : un virement n'en offre pratiquement aucune.",
    whatToDo:
      "Ne finalisez pas la commande si le vendeur n'est pas identifiable. Aucun prix ne justifie de payer un inconnu par virement.",
    whatToDoIfVictim:
      "Contestez le paiement auprès de votre banque en invoquant l'absence de livraison, et conservez toutes les traces : page produit, confirmation de commande, échanges. Déposez plainte. Surveillez ensuite votre relevé, car les coordonnées transmises peuvent être réutilisées.",
    whyItWorks:
      "Le site ressemble à n'importe quelle boutique parce qu'il en utilise le modèle, et la publicité qui y mène lui prête une légitimité. Le prix très bas et le compte à rebours font passer la décision avant la vérification.",
    example: {
      setting: "Publicité sur un réseau social pour une paire de baskets introuvable ailleurs.",
      message:
        "UrbanStep Outlet — Fin de stock ! −68 % sur le modèle Runner X, plus que 3 paires.\nOffre valable encore 07:42.\nurbanstep-outlet.example-not-real.test",
      giveaways: [
        "Une forte remise sur un produit rarement soldé.",
        "Un compte à rebours qui pousse à payer vite.",
        "Une boutique introuvable en dehors de sa propre publicité.",
      ],
    },
    decisionChecklist: [
      {
        check: "Les avis sur la boutique sont-ils introuvables ailleurs que sur son propre site ?",
        then: "Ne commandez pas.",
      },
      {
        check: "Les mentions légales omettent-elles une société identifiable, avec un numéro d'entreprise vérifiable ?",
        then: "Le vendeur n'est pas identifiable : renoncez.",
      },
      {
        check: "Le paiement passe-t-il seulement par virement ou carte prépayée ?",
        then: "Renoncez : ces moyens n'offrent presque aucun recours.",
      },
    ],
    prevention: [
      "Sur un site inconnu, payez par carte : la contestation reste possible.",
      "Méfiez-vous d'abord des remises sur les produits les plus demandés.",
      "Cherchez « nom de la boutique + avis » avant de commander.",
    ],
    relatedAttackCodes: [
      "PAYMENT-000001",
      "IDN-000001",
      "PAYMENT-000003",
      "PAYMENT-000008",
      "PAYMENT-000009",
      "AI-000005",
    ],
    faq: [
      {
        question: "Le site avait des centaines d'avis positifs.",
        answer:
          "Des avis affichés sur le site sont choisis par le site. Seuls des avis publiés ailleurs, sur une plateforme indépendante et antérieurs à votre visite, ont une valeur — et leur absence totale sur une boutique prétendument populaire est en soi un signal.",
      },
      {
        question:
          "Payer par carte plutôt que par virement change-t-il quelque chose ?",
        answer:
          "Oui, nettement. Un paiement par carte peut faire l'objet d'une contestation auprès de la banque en cas de non-livraison, alors qu'un virement est difficilement récupérable une fois exécuté.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "fake-online-store",
        simulationSlug: "exceptional-store-discount",
        name: "Fake online store",
        plainLanguageDefinition:
          "A store that looks normal, with very low prices and a countdown timer. You pay, and nothing ever arrives — no package, no reply to the contact form.",
        definition:
          "A fake online store is a shopping site created to collect payments without ever delivering, or to collect banking details under the guise of an order.",
        howItWorks:
          "The site is built from a standard store template, which immediately gives it a professional look. It's promoted through ads on social media or search engines, targeting a sought-after product or a promotion. Prices are noticeably below market, and a countdown timer keeps up the pressure. After payment, either nothing is delivered, or an unrelated item arrives — which is sometimes enough to get a dispute closed. The legal notices, when they exist, are copied from another site, and the only way to make contact is a form that never gets a reply.",
        warningSigns: [
          "Price far below market for a product that's usually rarely discounted",
          "Countdown timer or stock displayed as almost sold out",
          "No verifiable postal address or business registration number in the legal notices",
          "Contact limited to a form or a generic address",
          "Payment offered only by bank transfer, prepaid card, or outside usual payment methods",
          "Recently registered domain name, with no history and no reviews outside the site itself",
        ],
        howToVerify:
          "Search for the store's name outside its own site: reviews hosted on the page are written for the seller. Check that the legal notices include a company name and a registration number, and that this information matches the site. Finally, favor a payment method that offers a dispute process: a bank transfer offers almost none.",
        whatToDo:
          "Don't finalize the order if the seller can't be identified. No price justifies paying a stranger by bank transfer.",
        whatToDoIfVictim:
          "Dispute the payment with your bank, citing non-delivery, and keep all evidence: product page, order confirmation, exchanges. File a police report. Then watch your statement, since the details you provided may be reused.",
        faq: [
          {
            question: "The site had hundreds of positive reviews.",
            answer:
              "Reviews displayed on the site are chosen by the site. Only reviews published elsewhere, on an independent platform and predating your visit, have any value — and their total absence on a supposedly popular store is itself a signal.",
          },
          {
            question:
              "Does paying by card rather than bank transfer change anything?",
            answer:
              "Yes, significantly. A card payment can be disputed with the bank in case of non-delivery, while a bank transfer is difficult to recover once executed.",
          },
        ],
        whyItWorks:
          "The site looks like any other store because it uses the same template, and the ad leading to it lends it legitimacy. The very low price and the countdown put the decision before the check.",
        example: {
          setting: "Ad on a social network for a pair of sneakers you can't find anywhere else.",
          message:
            "UrbanStep Outlet — Clearance! 68% off the Runner X, only 3 pairs left.\nOffer ends in 07:42.\nurbanstep-outlet.example-not-real.test",
          giveaways: [
            "A steep discount on a product that's rarely on sale.",
            "A countdown pushing you to pay fast.",
            "A store you can't find anywhere outside its own ad.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are reviews of the store impossible to find anywhere but on its own site?",
            then: "Don't order.",
          },
          {
            check: "Does the legal notice leave out an identifiable company with a verifiable registration number?",
            then: "The seller can't be identified: give up.",
          },
          {
            check: "Is payment only possible by bank transfer or prepaid card?",
            then: "Give up: those methods offer almost no recourse.",
          },
        ],
        prevention: [
          "On an unfamiliar site, pay by card: a dispute remains possible.",
          "Be most wary of discounts on the most sought-after products.",
          "Search \"store name + reviews\" before ordering.",
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
    code: "PAYMENT-000005",
    slug: "fausse-facture",
    simulationSlug: "facture-renouvellement-nom-de-domaine",
    name: "Fausse facture",
    categorySlug: "fraudes-financieres",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Vous recevez une facture pour un service que vous n'avez jamais commandé — un renouvellement de nom de domaine, un annuaire professionnel, une prestation d'entretien. Le document a l'air normal, et il est fait pour être payé sans être lu.",
    attackerObjective: "argent",
    aliases: [
      "arnaque à la fausse facture",
      "faux annuaire professionnel",
      "facture frauduleuse",
      "faux renouvellement",
    ],
    primaryVector: "email",
    primaryDimension: "financial_fraud_recognition",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "La fausse facture est un document réclamant le paiement d'une prestation qui n'a jamais été commandée ni fournie, adressé à une entreprise, une association ou un professionnel indépendant, et rédigé pour ressembler à une échéance de routine.",
    howItWorks:
      "L'expéditeur s'appuie sur une réalité vérifiable : un nom de domaine qui expire réellement, une inscription au registre du commerce qui est publique, un contrat d'entretien qui existe vraiment chez un concurrent. Le document reprend donc des informations exactes sur l'entreprise, ce qui le rend crédible au premier coup d'œil. Le montant est calibré pour rester en dessous du seuil qui déclencherait une vérification — quelques dizaines à quelques centaines d'euros. Certaines variantes se présentent comme une simple « proposition d'insertion » en petits caractères, ce qui les rend juridiquement discutables plutôt que franchement fausses. Le procédé ne vise pas la personne qui décide, mais celle qui paie : il mise sur une organisation où les factures de faible montant sont réglées sans être rapprochées d'une commande.",
    warningSigns: [
      "Facture pour une prestation dont personne dans l'organisation ne se souvient d'avoir passé commande",
      "Émetteur inconnu, ou dont le nom ressemble à celui d'un prestataire réel sans être identique",
      "Montant modeste, choisi pour passer sous le seuil de validation habituel",
      "Mention « à régler sous huit jours » ou « dernier rappel » alors qu'aucune facture précédente n'a été reçue",
      "IBAN sans rapport avec la banque du prestataire supposé",
      "Petits caractères transformant la facture en « offre » ou en « proposition d'insertion »",
    ],
    triggers: ["authority", "urgency", "trust"],
    indicators: [],
    howToVerify:
      "Rapprochez chaque facture d'un bon de commande ou d'un contrat portant un nom de personne dans l'organisation. Si personne ne peut dire qui a commandé, rien n'a été commandé. Pour un renouvellement de nom de domaine, l'information exacte se trouve dans l'espace client de votre registraire habituel, jamais dans le courrier reçu.",
    whatToDo:
      "Ne payez pas et ne répondez pas. Conservez le document et signalez-le en interne, car les mêmes envois arrivent souvent en série sur plusieurs services. Établissez une règle simple : aucune facture n'est réglée sans une commande identifiable.",
    whatToDoIfVictim:
      "Contactez votre banque : un prélèvement récent peut parfois être contesté, et un virement très récent faire l'objet d'une demande de rappel. Rassemblez le document, l'enveloppe et les échanges, puis déposez plainte. Vérifiez aussi qu'aucun mandat de prélèvement récurrent n'a été mis en place à cette occasion.",
    whyItWorks:
      "Un document présenté comme une facture déclenche un geste de routine : on paie ce qui est dû. Les informations exactes sur l'entreprise donnent l'impression d'une relation existante, et un petit montant n'attire l'attention de personne.",
    example: {
      setting: "Courrier reçu par la personne qui règle les factures d'une petite entreprise.",
      message:
        "AVIS DE RENOUVELLEMENT — Nom de domaine votre-entreprise.test\nÀ régler sous 8 jours pour éviter la perte de votre nom de domaine.\nMontant : 189 € TTC, par virement à l'IBAN indiqué.",
      giveaways: [
        "L'émetteur n'est pas le registraire indiqué dans votre espace client.",
        "Personne dans l'entreprise ne se souvient d'avoir commandé ce service.",
        "En petits caractères, le document se décrit comme une simple offre.",
      ],
    },
    decisionChecklist: [
      {
        check: "La facture porte-t-elle sur un service dont personne ne peut dire qui l'a commandé ?",
        then: "Ne payez pas : sans commande identifiable, il n'y a rien à régler.",
      },
      {
        check: "Pour un nom de domaine, l'émetteur diffère-t-il du registraire de votre espace client ?",
        then: "Ignorez le courrier et vérifiez l'échéance dans cet espace.",
      },
      {
        check: "Avez-vous déjà payé ?",
        then: "Contactez votre banque pour contester ou rappeler le paiement, puis déposez plainte.",
      },
    ],
    prevention: [
      "Ne réglez aucune facture sans bon de commande ou contrat portant un nom.",
      "Tenez à jour la liste des prestataires réels et de leurs coordonnées bancaires.",
      "Faites lire les petits caractères avant tout premier paiement à un nouvel émetteur.",
    ],
    relatedAttackCodes: [
      "PAYMENT-000002",
      "PAYMENT-000004",
      "PHISH-000001",
      "PAYMENT-000008",
      "DATA-000008",
    ],
    faq: [
      {
        question:
          "La facture mentionnait des informations exactes sur mon entreprise.",
        answer:
          "C'est attendu : le numéro d'identification, l'adresse et le nom du dirigeant figurent dans des registres publics et se recopient en quelques secondes. L'exactitude de ces informations ne dit rien de l'existence d'une commande — c'est cette dernière qu'il faut vérifier.",
      },
      {
        question:
          "Le document se présente comme une « offre » et non comme une facture. Est-ce légal ?",
        answer:
          "C'est précisément la zone que ce procédé exploite : un document présenté comme une offre n'engage à rien tant qu'il n'a pas été accepté. En le payant, on peut être considéré comme l'ayant accepté. Ne payez pas, et faites examiner le document plutôt que de le régler pour clore le sujet.",
      },
      {
        question: "Faut-il répondre pour demander l'annulation ?",
        answer:
          "Non. Répondre confirme que l'adresse est active et lue, et engage un échange que l'émetteur maîtrise mieux que vous. Conservez le document sans y donner suite.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "fake-invoice",
        simulationSlug: "domain-renewal-invoice",
        name: "Fake invoice",
        plainLanguageDefinition:
          "You receive an invoice for a service you never ordered — a domain name renewal, a business directory listing, a maintenance service. The document looks normal, and it's designed to be paid without being read.",
        definition:
          "A fake invoice is a document demanding payment for a service that was never ordered or provided, sent to a business, an association, or a self-employed professional, and written to look like a routine bill.",
        howItWorks:
          "The sender relies on a verifiable fact: a domain name that really is expiring, a business registration that is public, a maintenance contract that really exists with a competitor. The document therefore includes accurate information about the business, which makes it credible at first glance. The amount is calibrated to stay below the threshold that would trigger a check — a few dozen to a few hundred euros. Some variants present themselves as a mere \"insertion proposal\" in fine print, which makes them legally questionable rather than outright fraudulent. The method doesn't target the decision-maker, but whoever pays: it relies on an organization where small invoices get paid without being matched to an order.",
        warningSigns: [
          "Invoice for a service no one in the organization recalls ordering",
          "Unknown sender, or one whose name resembles a real supplier's without being identical",
          "Modest amount, chosen to stay under the usual approval threshold",
          "\"Pay within eight days\" or \"final notice\" wording when no previous invoice was received",
          "Account number unrelated to the supposed supplier's bank",
          "Fine print turning the invoice into an \"offer\" or an \"insertion proposal\"",
        ],
        howToVerify:
          "Match every invoice to a purchase order or contract bearing a named person in the organization. If no one can say who ordered it, nothing was ordered. For a domain name renewal, the accurate information is in your usual registrar's client area, never in the letter received.",
        whatToDo:
          "Don't pay and don't reply. Keep the document and report it internally, since the same mailings often arrive in series across several departments. Set a simple rule: no invoice is paid without an identifiable order.",
        whatToDoIfVictim:
          "Contact your bank: a recent direct debit can sometimes be disputed, and a very recent transfer can be subject to a recall request. Gather the document, the envelope, and the exchanges, then file a police report. Also check that no recurring direct debit mandate was set up in the process.",
        faq: [
          {
            question:
              "The invoice mentioned accurate information about my business.",
            answer:
              "That's expected: the registration number, address, and executive's name appear in public registers and are copied in seconds. The accuracy of this information says nothing about whether an order exists — that's what needs checking.",
          },
          {
            question:
              "The document presents itself as an \"offer,\" not an invoice. Is that legal?",
            answer:
              "That's precisely the gray area this method exploits: a document presented as an offer creates no obligation until it's accepted. Paying it can be treated as acceptance. Don't pay, and have the document reviewed rather than paying it just to close the matter.",
          },
          {
            question: "Should I reply to ask for it to be cancelled?",
            answer:
              "No. Replying confirms the address is active and read, and starts an exchange the sender controls better than you do. Keep the document without following up.",
          },
        ],
        whyItWorks:
          "A document presented as an invoice triggers a routine gesture: you pay what's owed. Accurate details about the company give the impression of an existing relationship, and a small amount catches no one's attention.",
        example: {
          setting: "Letter received by the person who pays a small company's invoices.",
          message:
            "RENEWAL NOTICE — Domain name your-company.test\nPayable within 8 days to avoid losing your domain name.\nAmount: €189 incl. tax, by transfer to the IBAN shown.",
          giveaways: [
            "The sender isn't the registrar shown in your customer account.",
            "Nobody in the company remembers ordering this service.",
            "In the fine print, the document describes itself as a mere offer.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the invoice for a service that nobody can say who ordered?",
            then: "Don't pay: without an identifiable order, there's nothing to pay.",
          },
          {
            check: "For a domain name, does the sender differ from the registrar in your customer account?",
            then: "Ignore the letter and check the renewal date in that account.",
          },
          {
            check: "Have you already paid?",
            then: "Contact your bank to dispute or recall the payment, then file a police report.",
          },
        ],
        prevention: [
          "Pay no invoice without a purchase order or contract bearing a name.",
          "Keep an up-to-date list of real suppliers and their bank details.",
          "Have the fine print read before any first payment to a new sender.",
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
    code: "PAYMENT-000006",
    slug: "fausse-loterie",
    simulationSlug: "gain-loterie-frais-de-dossier",
    name: "Faux gain, fausse loterie",
    categorySlug: "fraudes-financieres",
    editorialStatus: "published",
    plainLanguageDefinition:
      "On vous annonce que vous avez gagné quelque chose à un jeu auquel vous n'avez jamais participé. Pour toucher le gain, il faut d'abord régler des frais — et le gain n'arrive jamais, quel que soit le nombre de fois où vous payez.",
    attackerObjective: "argent",
    aliases: [
      "arnaque au faux gain",
      "faux tirage au sort",
      "arnaque à l'héritage",
      "arnaque à la loterie",
    ],
    primaryVector: "email",
    primaryDimension: "financial_fraud_recognition",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le faux gain annonce l'attribution d'une somme d'argent, d'un lot ou d'un héritage, et conditionne sa remise au paiement préalable de frais — taxes, frais de dossier, de transfert ou de notaire — qui sont l'unique objet de la fraude.",
    howItWorks:
      "Le message annonce une bonne nouvelle, ce qui suspend la méfiance bien plus efficacement qu'une menace : personne ne se demande pourquoi on lui offre de l'argent. Un interlocuteur dédié accompagne ensuite la démarche, souvent avec courtoisie et patience, ce qui installe une relation. Vient alors une première somme à régler, justifiée par une obligation présentée comme administrative ou fiscale. Une fois ce premier paiement effectué, un obstacle apparaît, puis un autre : chaque nouvelle demande est justifiée par les sommes déjà versées, ce qui rend l'abandon psychologiquement coûteux. La variante dite de l'héritage suit le même schéma en s'appuyant sur un homonyme lointain, ce qui rend la vérification familiale impossible et le récit invérifiable.",
    warningSigns: [
      "Gain annoncé pour un jeu, un tirage ou une loterie auxquels vous n'avez pas participé",
      "Frais à régler avant de recevoir la somme, quel qu'en soit le nom",
      "Interlocuteur unique très disponible, joignable en dehors des heures ouvrables",
      "Demande de discrétion vis-à-vis de l'entourage ou de la banque",
      "Paiement demandé par virement, mandat cash ou cartes prépayées",
      "Documents officiels transmis en pièce jointe, censés attester de la démarche",
    ],
    triggers: ["reward", "financial_incentive", "urgency"],
    indicators: [],
    howToVerify:
      "Un gain réel n'exige jamais d'avance de fonds : les frais éventuels se prélèvent sur la somme due. Cette règle suffit à trancher sans rien vérifier d'autre. Un jeu auquel vous n'avez pas joué ne peut pas vous avoir désigné, et une succession qui vous concerne passe par un notaire que vous avez choisi ou qui vous est officiellement notifié.",
    whatToDo:
      "Ne réglez aucun frais et cessez le contact. Ne transmettez ni pièce d'identité, ni relevé d'identité bancaire, ni justificatif de domicile : ces documents servent ensuite à ouvrir des comptes ou des crédits à votre nom.",
    whatToDoIfVictim:
      "Arrêtez tout nouveau versement, en particulier ceux présentés comme le dernier obstacle. Contactez votre banque : un virement récent peut parfois être rappelé. Déposez plainte, en conservant l'ensemble des échanges. Méfiez-vous des sollicitations qui suivront, présentées comme une aide à la récupération des fonds : ce sont fréquemment les mêmes acteurs sous une autre identité.",
    whyItWorks:
      "Une bonne nouvelle désarme : on ne se méfie pas de quelqu'un qui veut nous donner de l'argent. Une fois les premiers frais payés, abandonner revient à accepter de les avoir perdus, et chaque nouvelle demande paraît être la dernière.",
    example: {
      setting: "Email reçu sur une adresse personnelle.",
      message:
        "Félicitations ! Votre adresse a été tirée au sort lors du grand tirage international. Vous remportez 850 000 €. Pour débloquer le virement, réglez les frais de dossier de 290 € auprès de notre notaire partenaire. Merci de garder cette information confidentielle jusqu'au versement.",
      giveaways: [
        "Vous n'avez participé à aucun tirage.",
        "Des frais sont demandés avant le gain.",
        "La discrétion demandée vous isole de ceux qui vous diraient que c'est faux.",
      ],
    },
    decisionChecklist: [
      {
        check: "Vous annonce-t-on un gain à un jeu auquel vous n'avez pas joué ?",
        then: "Le gain n'existe pas : ne répondez pas.",
      },
      {
        check: "Faut-il payer quelque chose avant de recevoir la somme ?",
        then: "Ne payez pas : un vrai gain ne demande jamais d'avance.",
      },
      {
        check: "Avez-vous déjà payé ou envoyé des documents ?",
        then: "Arrêtez tout versement, contactez votre banque et déposez plainte.",
      },
    ],
    prevention: [
      "Retenez la règle : recevoir un gain ne coûte jamais rien.",
      "Parlez à un proche de toute bonne nouvelle financière inattendue avant d'agir.",
      "Méfiez-vous de quiconque propose ensuite de récupérer vos fonds contre paiement.",
    ],
    relatedAttackCodes: ["PAYMENT-000001", "PAYMENT-000003", "SOCIAL-000008"],
    faq: [
      {
        question:
          "Comment auraient-ils obtenu mon adresse si je n'ai jamais joué ?",
        answer:
          "Les adresses circulent par listes, revendues ou issues de fuites de données antérieures. Recevoir un message ne prouve donc rien sur une participation, et l'absence de participation suffit à conclure.",
      },
      {
        question:
          "J'ai déjà versé une somme. Est-il logique de payer la dernière étape pour ne pas tout perdre ?",
        answer:
          "Non, et c'est exactement le raisonnement sur lequel le procédé repose. Les sommes déjà versées ne sont pas récupérables par un versement supplémentaire ; chaque paiement en appelle un autre. Le seul geste qui limite la perte est d'arrêter immédiatement.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "fake-lottery-prize",
        simulationSlug: "lottery-win-processing-fee",
        name: "Fake prize, fake lottery",
        plainLanguageDefinition:
          "You're told you've won something from a contest you never entered. To collect the prize, you first have to pay fees — and the prize never arrives, no matter how many times you pay.",
        definition:
          "The fake prize scam announces the award of a sum of money, a prize, or an inheritance, and makes handing it over conditional on paying fees beforehand — taxes, processing fees, transfer fees, or notary fees — which are the sole purpose of the fraud.",
        howItWorks:
          "The message announces good news, which lowers your guard far more effectively than a threat: no one wonders why they're being given money. A dedicated contact then guides the process, often with courtesy and patience, which builds a relationship. Then a first sum comes due, justified by an obligation presented as administrative or tax-related. Once that first payment is made, one obstacle appears, then another: each new request is justified by the sums already paid, which makes giving up psychologically costly. The inheritance variant follows the same pattern, relying on a distant namesake, which makes family verification impossible and the story unverifiable.",
        warningSigns: [
          "Prize announced for a contest, draw, or lottery you didn't enter",
          "Fees to pay before receiving the sum, whatever they're called",
          "A single, very available contact, reachable outside business hours",
          "Request for discretion toward friends, family, or your bank",
          "Payment requested by bank transfer, cash wire, or prepaid cards",
          "Official-looking documents sent as attachments, supposedly proving the process",
        ],
        howToVerify:
          "A real prize never requires an advance of funds: any fees are deducted from the sum owed. That rule alone is enough to settle it without checking anything else. A contest you didn't enter can't have selected you, and an inheritance concerning you goes through a notary you chose or who officially notifies you.",
        whatToDo:
          "Don't pay any fees and stop all contact. Don't share an ID document, a bank account statement, or proof of address: these documents are later used to open accounts or credit lines in your name.",
        whatToDoIfVictim:
          "Stop all further payments, especially those presented as the last obstacle. Contact your bank: a recent transfer can sometimes be recalled. File a police report, keeping all the exchanges. Be wary of later contact offering to help recover the funds: it's frequently the same people under another identity.",
        faq: [
          {
            question:
              "How would they have gotten my address if I never entered anything?",
            answer:
              "Addresses circulate through lists, resold or from earlier data leaks. Receiving a message therefore proves nothing about having entered a contest, and the absence of entry is enough to conclude it's a scam.",
          },
          {
            question:
              "I've already paid a sum. Is it reasonable to pay the last step to avoid losing everything?",
            answer:
              "No, and that's exactly the reasoning this method relies on. Sums already paid aren't recovered by paying more; each payment calls for another. The only action that limits the loss is stopping immediately.",
          },
        ],
        whyItWorks:
          "Good news disarms: nobody is suspicious of someone who wants to give them money. Once the first fees are paid, giving up means accepting they're lost, and each new request seems like the last one.",
        example: {
          setting: "Email received at a personal address.",
          message:
            "Congratulations! Your address was selected in the grand international draw. You've won €850,000. To release the transfer, pay the €290 processing fee to our partner notary. Please keep this information confidential until the payment.",
          giveaways: [
            "You never entered any draw.",
            "Fees are requested before the prize.",
            "The secrecy you're asked for cuts you off from people who would tell you it's fake.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are you told you've won a game you never played?",
            then: "The prize doesn't exist: don't reply.",
          },
          {
            check: "Do you have to pay something before receiving the money?",
            then: "Don't pay: a real prize never requires an advance.",
          },
          {
            check: "Have you already paid or sent documents?",
            then: "Stop all payments, contact your bank and file a police report.",
          },
        ],
        prevention: [
          "Remember the rule: receiving a prize never costs anything.",
          "Tell someone close about any unexpected financial good news before acting.",
          "Be wary of anyone who later offers to recover your money for a fee.",
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
    code: "PAYMENT-000007",
    slug: "fausse-amende",
    simulationSlug: "sms-amende-stationnement-impayee",
    name: "Fausse amende",
    categorySlug: "fraudes-financieres",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un message vous annonce une contravention à régler rapidement sous peine de majoration. Il imite un avis officiel, et la peur d'une sanction fait payer avant de vérifier.",
    attackerObjective: "argent",
    aliases: [
      "faux avis de contravention",
      "arnaque à l'amende",
      "faux PV",
      "fausse contravention",
    ],
    primaryVector: "email",
    primaryDimension: "financial_fraud_recognition",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "La fausse amende est un message imitant un avis de contravention émanant d'une administration, qui dirige vers une page de paiement contrôlée par l'attaquant afin d'encaisser la somme et de collecter des coordonnées bancaires complètes.",
    howItWorks:
      "Le message reprend la mise en forme d'un avis officiel : référence de dossier, date d'infraction, montant, et mention d'une majoration en cas de retard. Il n'a pas besoin d'être exact pour fonctionner, seulement plausible : beaucoup de gens conduisent, et un doute suffit. La sanction financière annoncée crée une urgence qui décourage la vérification, et le montant réclamé reste volontairement dans l'ordre de grandeur d'une contravention réelle. La page de paiement demande la carte complète, souvent accompagnée d'informations qui n'ont aucune raison d'y figurer — numéro de permis, date de naissance, adresse — et qui alimentent des usurpations ultérieures.",
    warningSigns: [
      "Avis de contravention reçu par email ou SMS alors que ces avis sont notifiés par courrier",
      "Lien de paiement menant à un domaine qui n'est pas celui du service officiel",
      "Montant à régler « sous 48 heures » sous peine de majoration immédiate",
      "Demande d'informations sans rapport avec un paiement : numéro de permis, date de naissance",
      "Absence de numéro d'avis vérifiable sur le site officiel",
      "Formulation approximative dans les mentions légales ou la désignation du service émetteur",
    ],
    triggers: ["authority", "fear", "urgency"],
    indicators: [],
    howToVerify:
      "Ne suivez pas le lien du message. Rejoignez le service officiel de paiement par vos propres moyens et recherchez l'avis avec son numéro : une amende réelle y figure, et une amende absente n'existe pas. En cas de doute persistant, l'avis papier fait foi.",
    whatToDo:
      "Ne réglez rien depuis le message. Si vous voulez en avoir le cœur net, une contravention réelle se retrouve sur le service officiel de paiement avec son numéro d'avis, et vous y accédez par vos propres moyens : c'est une vérification de trente secondes qui clôt la question. Un avis authentique arrive par courrier, et il ne disparaît pas parce que vous avez ignoré un email.",
    whatToDoIfVictim:
      "Faites opposition sur votre carte immédiatement et surveillez les prélèvements des semaines suivantes. Contestez les débits auprès de votre banque et déposez plainte. Si des informations d'identité ont été transmises, restez attentif aux courriers d'organismes de crédit que vous n'auriez pas sollicités.",
    whyItWorks:
      "La crainte d'une majoration pousse à payer vite, et le montant demandé ressemble à celui d'une vraie contravention. Comme beaucoup de gens conduisent ou stationnent, le message n'a pas besoin d'être exact pour paraître plausible.",
    example: {
      setting: "SMS reçu un lundi matin.",
      message:
        "AVIS DE CONTRAVENTION : stationnement non réglé le 12/06. Montant : 35 €, majoré à 75 € sans paiement sous 48 h. Réglez sur amendes-reglement.example-not-real.test",
      giveaways: [
        "Un avis de contravention par SMS, avec un lien de paiement.",
        "Une majoration immédiate pour presser le paiement.",
        "Un domaine qui n'est pas celui du service officiel.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'avis vous arrive-t-il par SMS ou email, avec un lien de paiement ?",
        then: "Ne payez pas depuis ce lien.",
      },
      {
        check: "L'avis est-il introuvable avec son numéro sur le service officiel, ouvert par vos propres moyens ?",
        then: "L'amende n'existe pas : supprimez le message.",
      },
      {
        check: "La page demande-t-elle votre date de naissance ou votre numéro de permis ?",
        then: "Quittez-la : ces informations n'ont rien à faire dans un paiement.",
      },
    ],
    prevention: [
      "Réglez une amende uniquement sur le service officiel, ouvert par vos propres moyens, avec le numéro de l'avis.",
      "Retenez qu'une amende authentique se retrouve toujours sur le service officiel avec son numéro.",
      "Ne donnez jamais d'informations d'identité sur une page de paiement.",
    ],
    relatedAttackCodes: ["SOCIAL-000010", "PAYMENT-000001", "SMS-000001"],
    faq: [
      {
        question: "Je conduis effectivement, l'avis pourrait être authentique.",
        answer:
          "La coïncidence est le ressort du procédé, pas une preuve. Le point décisif n'est pas de savoir si l'infraction est plausible mais si l'avis existe : cela se vérifie en quelques secondes sur le service officiel, avec le numéro d'avis.",
      },
      {
        question: "Une administration peut-elle réclamer un paiement par SMS ?",
        answer:
          "Une administration peut envoyer une information par message, mais elle ne fonde pas une demande de paiement sur un lien envoyé par SMS. Le réflexe reste identique : rejoindre le service officiel par un chemin que vous maîtrisez.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "fake-traffic-fine",
        simulationSlug: "unpaid-parking-fine-text",
        name: "Fake traffic fine",
        plainLanguageDefinition:
          "A message announces a fine to pay quickly or face a penalty increase. It imitates an official notice, and fear of a penalty makes people pay before checking.",
        definition:
          "The fake fine scam is a message imitating an official traffic-violation notice from a government agency, directing you to a payment page controlled by the attacker in order to collect the sum and full banking details.",
        howItWorks:
          "The message copies the format of an official notice: case reference, date of the offense, amount, and a mention of a penalty increase for late payment. It doesn't need to be accurate to work, only plausible: many people drive, and a doubt is enough. The announced financial penalty creates urgency that discourages verification, and the amount requested deliberately stays in the range of a real fine. The payment page asks for the full card number, often along with information that has no business being there — driver's license number, date of birth, address — which fuels later identity theft.",
        warningSigns: [
          "Fine notice received by email or text when such notices are normally sent by mail",
          "Payment link leading to a domain that isn't the official service's",
          "Amount due \"within 48 hours\" under threat of an immediate penalty increase",
          "Request for information unrelated to a payment: driver's license number, date of birth",
          "No notice number verifiable on the official site",
          "Approximate wording in the legal notices or the name of the issuing service",
        ],
        howToVerify:
          "Don't follow the link in the message. Go to the official payment service yourself and search for the notice using its number: a real fine will be there, and an absent one doesn't exist. If in doubt, the paper notice is authoritative.",
        whatToDo:
          "Don't pay anything from the message. If you want to be sure, a real fine can be found on the official payment service with its notice number, accessed by your own means: it's a thirty-second check that settles the question. A genuine notice arrives by mail, and it doesn't disappear because you ignored an email.",
        whatToDoIfVictim:
          "Block your card immediately and watch the following weeks' charges. Dispute the charges with your bank and file a police report. If identity information was shared, stay alert for mail from credit agencies you didn't apply to.",
        faq: [
          {
            question: "I do drive, so the notice could be genuine.",
            answer:
              "The coincidence is exactly what the method relies on, not proof. What matters isn't whether the offense is plausible but whether the notice exists: that can be checked in seconds on the official service, with the notice number.",
          },
          {
            question: "Can a government agency demand payment by text message?",
            answer:
              "A government agency can send information by message, but it doesn't base a payment request on a link sent by text. The reflex stays the same: reach the official service through a path you control.",
          },
        ],
        whyItWorks:
          "Fear of a penalty increase pushes people to pay fast, and the amount looks like a real fine. Since so many people drive or park, the message doesn't need to be accurate to seem plausible.",
        example: {
          setting: "Text message received on a Monday morning.",
          message:
            "TRAFFIC FINE NOTICE: unpaid parking on 06/12. Amount: €35, increased to €75 without payment within 48 hours. Pay at amendes-reglement.example-not-real.test",
          giveaways: [
            "A fine notice by text, with a payment link.",
            "An immediate penalty increase to rush payment.",
            "A domain that isn't the official service's.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the notice reach you by text or email, with a payment link?",
            then: "Don't pay through that link.",
          },
          {
            check: "Is the notice impossible to find by its number on the official service, opened on your own?",
            then: "The fine doesn't exist: delete the message.",
          },
          {
            check: "Does the page ask for your date of birth or driver's license number?",
            then: "Leave it: that information has no place in a payment.",
          },
        ],
        prevention: [
          "Pay a fine only on the official service, opened on your own, with the notice number.",
          "Remember that a genuine fine can always be found on the official service by its number.",
          "Never give identity information on a payment page.",
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
    code: "PAYMENT-000008",
    slug: "arnaque-a-la-location",
    simulationSlug: "location-appartement-sans-visite",
    name: "Arnaque à la location",
    categorySlug: "fraudes-financieres",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une annonce de logement au bon prix, un propriétaire injoignable autrement que par écrit, et un acompte réclamé avant toute visite. Le logement existe souvent — mais il n'appartient pas à la personne qui l'annonce.",
    attackerObjective: "argent",
    aliases: [
      "fausse annonce immobilière",
      "arnaque à la caution",
      "faux propriétaire",
      "arnaque à la location de vacances",
    ],
    primaryVector: "advertisement",
    primaryDimension: "financial_fraud_recognition",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "L'arnaque à la location consiste à publier une annonce pour un logement que l'on ne détient pas, afin d'obtenir un acompte, une caution ou un premier loyer avant que la victime ait pu constater qu'aucune location n'est possible.",
    howItWorks:
      "Les photographies et le descriptif proviennent d'une annonce authentique publiée ailleurs, ce qui donne un logement réel et vérifiable de l'extérieur. Le loyer est fixé légèrement en dessous du marché : assez bas pour attirer, pas assez pour alerter. Le prétendu propriétaire justifie son absence par un motif difficile à contredire — expatriation, mutation, succession en cours — et propose d'expédier les clés après réception des fonds. La tension du marché locatif fait le reste : dans une ville où les visites se comptent par dizaines de candidats, la crainte de perdre le logement pousse à verser avant de voir. La variante saisonnière suit la même mécanique sur des locations de vacances, avec une pression liée à l'approche de la date.",
    warningSigns: [
      "Impossibilité de visiter avant tout versement, quel que soit le motif invoqué",
      "Loyer sensiblement inférieur aux annonces comparables du même quartier",
      "Propriétaire joignable uniquement par écrit, jamais par téléphone",
      "Demande de virement, de mandat cash ou de paiement hors plateforme",
      "Photographies retrouvables sur une autre annonce, sous un autre nom",
      "Bail transmis prérempli, à signer avant toute rencontre",
    ],
    triggers: ["scarcity", "urgency", "trust"],
    indicators: [],
    howToVerify:
      "Ne versez rien avant d'avoir vu le logement et rencontré la personne. Recherchez les photographies de l'annonce sur un moteur de recherche d'images : les retrouver ailleurs, sous un autre nom, suffit à conclure. Demandez un titre de propriété ou une taxe foncière, et recoupez le nom avec celui du compte bancaire fourni : une divergence est un signal net.",
    whatToDo:
      "Aucun versement sans visite. Refusez tout paiement hors des moyens qui laissent une trace contestable, et méfiez-vous d'un interlocuteur qui ne peut jamais parler de vive voix.",
    whatToDoIfVictim:
      "Contactez votre banque sans attendre : un virement récent peut parfois être rappelé. Conservez l'annonce, les échanges et les coordonnées bancaires transmises, puis déposez plainte. Signalez l'annonce à la plateforme, qui peut la retirer et empêcher d'autres versements.",
    whyItWorks:
      "Quand les logements partent en quelques heures, verser vite paraît la seule façon d'obtenir le bon. L'absence du propriétaire est expliquée par un motif qui attire la compréhension, et les photos d'un logement réel rassurent.",
    example: {
      setting: "Réponse à votre message sur une annonce de deux-pièces, loyer un peu sous les prix du quartier.",
      message:
        "Bonjour, je suis en poste à l'étranger et ne peux pas organiser de visite. J'ai beaucoup de demandes : je réserve l'appartement au premier qui verse le dépôt de garantie et le premier mois. Je vous envoie les clés par courrier dès réception. Contrat ci-joint, à me retourner signé.",
      giveaways: [
        "Le paiement est demandé avant toute visite.",
        "Le propriétaire ne peut être ni vu ni appelé.",
        "La concurrence annoncée sert à vous presser.",
      ],
    },
    decisionChecklist: [
      {
        check: "Vous demande-t-on de payer avant d'avoir visité ?",
        then: "Ne versez rien : proposez une visite, ou passez votre chemin.",
      },
      {
        check: "Les photos de l'annonce apparaissent-elles ailleurs, sous un autre nom ou dans une autre ville ?",
        then: "L'annonce est fausse : signalez-la à la plateforme.",
      },
      {
        check: "Avez-vous déjà versé de l'argent ?",
        then: "Contactez votre banque pour demander un rappel, gardez tous les échanges et déposez plainte.",
      },
    ],
    prevention: [
      "Fixez-vous la règle : aucun versement sans visite et sans rencontre.",
      "Restez sur la messagerie et le paiement de la plateforme, qui laissent une trace.",
      "Faites une recherche d'image sur les photos de toute annonce qui vous intéresse.",
    ],
    relatedAttackCodes: [
      "PAYMENT-000009",
      "WEB-000001",
      "PAYMENT-000005",
      "DATA-000009",
    ],
    faq: [
      {
        question: "Le logement existe, je suis passé devant.",
        answer:
          "C'est habituel : les photographies proviennent d'une annonce authentique. L'existence du bien ne dit rien du droit de l'annonceur à le louer. Seule la rencontre, sur place, avec une personne pouvant justifier de la propriété, permet de trancher.",
      },
      {
        question:
          "On me demande une pièce d'identité avant la visite. Est-ce normal ?",
        answer:
          "Un dossier de location contient effectivement des pièces personnelles, mais elles se remettent lors de la rencontre, pas avant. Transmises en amont à un inconnu, elles servent à ouvrir des comptes ou des crédits à votre nom.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "rental-scam",
        simulationSlug: "apartment-rental-without-viewing",
        name: "Rental scam",
        plainLanguageDefinition:
          "A listing for housing at the right price, a landlord reachable only in writing, and a deposit requested before any viewing. The property often exists — but it doesn't belong to the person advertising it.",
        definition:
          "The rental scam consists of publishing a listing for housing the poster doesn't own, in order to obtain a deposit, security deposit, or first month's rent before the victim can find out that no rental is actually possible.",
        howItWorks:
          "The photos and description come from a genuine listing published elsewhere, giving a property that's real and verifiable from the outside. The rent is set slightly below market: low enough to attract, not low enough to raise alarm. The supposed landlord justifies their absence with a hard-to-question reason — living abroad, a job transfer, an ongoing inheritance — and offers to send the keys once funds are received. The pressure of the rental market does the rest: in a city where viewings draw dozens of applicants, fear of losing the place pushes people to pay before seeing it. The seasonal variant follows the same mechanics for vacation rentals, with pressure tied to an approaching date.",
        warningSigns: [
          "Impossible to view before any payment, whatever reason is given",
          "Rent noticeably below comparable listings in the same neighborhood",
          "Landlord reachable only in writing, never by phone",
          "Request for a bank transfer, cash wire, or payment outside the platform",
          "Photos found in another listing, under a different name",
          "Pre-filled lease sent to sign before any meeting",
        ],
        howToVerify:
          "Don't pay anything before seeing the property and meeting the person. Search the listing's photos on a reverse image search: finding them elsewhere, under a different name, is enough to conclude it's a scam. Ask for a title deed or property tax notice, and cross-check the name against the bank account provided: a mismatch is a clear signal.",
        whatToDo:
          "No payment without a viewing. Refuse any payment method that leaves no disputable trace, and be wary of a contact who can never speak by phone.",
        whatToDoIfVictim:
          "Contact your bank without delay: a recent transfer can sometimes be recalled. Keep the listing, the exchanges, and the banking details provided, then file a police report. Report the listing to the platform, which can take it down and prevent further payments.",
        faq: [
          {
            question: "The property exists, I walked past it.",
            answer:
              "That's typical: the photos come from a genuine listing. The property's existence says nothing about the poster's right to rent it out. Only meeting on-site with someone who can prove ownership settles it.",
          },
          {
            question:
              "I'm being asked for an ID document before the viewing. Is that normal?",
            answer:
              "A rental application does include personal documents, but they're handed over at the meeting, not before. Sent beforehand to a stranger, they're used to open accounts or credit lines in your name.",
          },
        ],
        whyItWorks:
          "When apartments go within hours, paying fast seems like the only way to get the right one. The owner's absence is explained by a reason that invites sympathy, and the photos of a real home are reassuring.",
        example: {
          setting: "Reply to your message about a one-bedroom listing, rent slightly below the neighborhood's prices.",
          message:
            "Hello, I'm posted abroad and can't arrange a viewing. I have a lot of requests: I'll reserve the apartment for the first person who pays the deposit and the first month. I'll mail you the keys as soon as I receive it. Lease attached, please return it signed.",
          giveaways: [
            "Payment is requested before any viewing.",
            "The owner can't be seen or called.",
            "The announced competition is there to rush you.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are you asked to pay before viewing the place?",
            then: "Pay nothing: suggest a viewing, or move on.",
          },
          {
            check: "Do the listing's photos appear elsewhere, under another name or in another city?",
            then: "The listing is fake: report it to the platform.",
          },
          {
            check: "Have you already paid any money?",
            then: "Contact your bank to request a recall, keep all the messages and file a police report.",
          },
        ],
        prevention: [
          "Set yourself the rule: no payment without a viewing and a meeting.",
          "Stay on the platform's messaging and payment system, which leave a trace.",
          "Run a reverse image search on the photos of any listing you're interested in.",
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
    code: "PAYMENT-000009",
    slug: "arnaque-a-la-petite-annonce",
    simulationSlug: "annonce-lien-deblocage-paiement",
    name: "Arnaque à la petite annonce",
    categorySlug: "fraudes-financieres",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Vous vendez un objet, et un acheteur très pressé vous envoie un lien pour « débloquer le paiement ». Le lien mène à une fausse page de votre banque : ce n'est pas de l'argent que vous recevez, c'est votre compte que vous ouvrez.",
    attackerObjective: "argent",
    aliases: [
      "arnaque au faux acheteur",
      "arnaque entre particuliers",
      "faux lien de paiement",
      "arnaque au colis entre particuliers",
    ],
    primaryVector: "messaging_app",
    primaryDimension: "financial_fraud_recognition",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "L'arnaque à la petite annonce vise les particuliers qui vendent entre eux : l'attaquant se présente comme acheteur intéressé et détourne la conversation vers un faux dispositif de paiement, afin d'obtenir des identifiants bancaires ou un virement.",
    howItWorks:
      "L'attaquant répond rapidement, accepte le prix sans négocier et propose de faire enlever l'objet par un transporteur. Il déplace ensuite l'échange en dehors de la plateforme, où plus rien n'est contrôlé, et envoie un lien censé permettre de « valider » ou « libérer » le paiement. La page imite l'espace bancaire du vendeur ou le service de paiement de la plateforme. La demande est contre-intuitive et c'est ce qui la rend efficace : on ne se méfie pas d'une procédure qui prétend vous faire recevoir de l'argent, alors même que le formulaire réclame des informations qui ne servent qu'à en envoyer. Une variante symétrique vise l'acheteur, avec un faux justificatif de virement et un objet qui n'est jamais expédié.",
    warningSigns: [
      "Acheteur qui accepte le prix immédiatement, sans question sur l'objet",
      "Conversation déplacée hors de la plateforme dès les premiers messages",
      "Lien envoyé pour « valider », « libérer » ou « confirmer » la réception d'un paiement",
      "Demande de vos identifiants bancaires ou d'un code reçu par SMS pour encaisser",
      "Justificatif de virement transmis en image plutôt que constaté sur votre compte",
      "Pression pour conclure avant une échéance annoncée",
    ],
    triggers: ["urgency", "trust", "financial_incentive"],
    indicators: [],
    howToVerify:
      "Recevoir de l'argent ne demande jamais de se connecter à son espace bancaire depuis un lien, ni de saisir un numéro de carte, ni de communiquer un code. Un encaissement se constate sur votre compte, en vous y connectant par vos propres moyens. Restez dans la messagerie de la plateforme : c'est le seul endroit où un litige pourra être instruit.",
    whatToDo:
      "Ne suivez aucun lien de paiement reçu en conversation. N'expédiez pas l'objet sur la foi d'un justificatif transmis en image : attendez de voir les fonds sur votre compte.",
    whatToDoIfVictim:
      "Si vous avez saisi des identifiants bancaires, contactez immédiatement votre banque pour faire opposition et bloquer l'accès en ligne, puis changez vos mots de passe. Conservez la conversation et l'annonce, signalez le compte à la plateforme et déposez plainte.",
    whyItWorks:
      "L'échange semble jouer en votre faveur : un acheteur accepte votre prix et dit avoir payé. On se méfie d'une demande d'argent, pas d'une procédure censée vous en faire recevoir.",
    example: {
      setting: "Vous vendez un vélo sur une plateforme de petites annonces.",
      message:
        "« Bonjour, je prends le vélo au prix affiché. Je suis loin, un transporteur passera le chercher. J'ai fait le paiement, il vous suffit de le valider ici : paiement-annonces.example-not-real.test/valider. Faites vite, le transporteur passe demain. »",
      giveaways: [
        "Aucune question sur l'objet, aucune négociation.",
        "Un lien pour « valider » un paiement reçu.",
        "La conversation a quitté la messagerie de la plateforme.",
      ],
    },
    decisionChecklist: [
      {
        check: "On vous envoie un lien pour recevoir ou valider un paiement ?",
        then: "Ne l'ouvrez pas : recevoir de l'argent ne demande aucune action de ce type.",
      },
      {
        check: "Les fonds sont-ils absents de votre compte, consulté par vos propres moyens ?",
        then: "N'expédiez rien, quelle que soit la preuve qu'on vous envoie.",
      },
      {
        check: "L'échange s'est-il déplacé hors de la plateforme ?",
        then: "Revenez-y : c'est le seul endroit où un litige pourra être traité.",
      },
    ],
    prevention: [
      "Gardez toute la conversation dans la messagerie de la plateforme.",
      "N'expédiez un objet qu'une fois les fonds visibles sur votre compte.",
      "Ne saisissez jamais vos identifiants bancaires ni un code pour recevoir un paiement.",
    ],
    relatedAttackCodes: [
      "PAYMENT-000008",
      "WEB-000001",
      "SOCIAL-000011",
      "DATA-000009",
    ],
    faq: [
      {
        question:
          "Pourquoi me demander mes informations bancaires pour me verser de l'argent ?",
        answer:
          "C'est le signal décisif. Un versement ne nécessite qu'un IBAN, que vous pouvez communiquer sans risque. Toute demande de numéro de carte, de mot de passe ou de code reçu par SMS sert à débiter, jamais à créditer.",
      },
      {
        question:
          "L'acheteur m'a envoyé une capture d'écran prouvant le virement.",
        answer:
          "Une image se fabrique en quelques minutes et ne prouve rien. Le seul justificatif qui compte est l'apparition des fonds sur votre compte, constatée depuis votre application bancaire.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "classified-ad-scam",
        simulationSlug: "classified-ad-payment-release-link",
        name: "Classified ad scam",
        plainLanguageDefinition:
          "You're selling an item, and a very eager buyer sends you a link to \"release the payment.\" The link leads to a fake page of your bank: it's not money you're receiving, it's your account you're opening up.",
        definition:
          "The classified ad scam targets people selling to one another: the attacker poses as an interested buyer and steers the conversation toward a fake payment scheme, in order to obtain banking credentials or a transfer.",
        howItWorks:
          "The attacker replies quickly, accepts the price without negotiating, and offers to have the item picked up by a carrier. They then move the conversation off the platform, where nothing is monitored anymore, and send a link supposedly needed to \"validate\" or \"release\" the payment. The page imitates the seller's banking portal or the platform's payment service. The request is counterintuitive, and that's what makes it work: people don't suspect a process that claims to make them receive money, even though the form asks for information that's only ever used to send money out. A mirror variant targets the buyer, with a fake proof of transfer and an item that's never shipped.",
        warningSigns: [
          "Buyer who accepts the price immediately, with no question about the item",
          "Conversation moved off the platform within the first messages",
          "Link sent to \"validate,\" \"release,\" or \"confirm\" receipt of a payment",
          "Request for your banking credentials or a code received by text to \"cash in\"",
          "Proof of transfer sent as an image rather than shown on your account",
          "Pressure to conclude before an announced deadline",
        ],
        howToVerify:
          "Receiving money never requires logging into your bank account from a link, entering a card number, or sharing a code. A payment received shows up on your account, which you check by your own means. Stay within the platform's messaging: it's the only place a dispute can be handled.",
        whatToDo:
          "Don't follow any payment link received in a conversation. Don't ship the item based on a proof sent as an image: wait to see the funds in your account.",
        whatToDoIfVictim:
          "If you entered banking credentials, contact your bank immediately to block the card and your online access, then change your passwords. Keep the conversation and the listing, report the account to the platform, and file a police report.",
        faq: [
          {
            question:
              "Why would they ask for my banking information to pay me?",
            answer:
              "That's the decisive signal. A payment only needs an account number (IBAN), which you can share without risk. Any request for a card number, password, or code received by text is used to charge, never to pay out.",
          },
          {
            question:
              "The buyer sent me a screenshot proving the transfer.",
            answer:
              "An image is made in minutes and proves nothing. The only proof that matters is the funds appearing on your account, checked from your banking app.",
          },
        ],
        whyItWorks:
          "The exchange seems to work in your favor: a buyer accepts your price and says they've paid. We're wary of requests for money, not of a procedure supposed to send money our way.",
        example: {
          setting: "You're selling a bike on a classified ads platform.",
          message:
            "\"Hello, I'll take the bike at the listed price. I'm far away, a courier will pick it up. I've made the payment, you just need to confirm it here: paiement-annonces.example-not-real.test/valider. Be quick, the courier comes tomorrow.\"",
          giveaways: [
            "No questions about the item, no negotiation.",
            "A link to \"confirm\" a payment you're receiving.",
            "The conversation has left the platform's messaging.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are you sent a link to receive or confirm a payment?",
            then: "Don't open it: receiving money never requires that kind of action.",
          },
          {
            check: "Are the funds missing from your account, checked on your own?",
            then: "Ship nothing, whatever proof you're sent.",
          },
          {
            check: "Has the conversation moved off the platform?",
            then: "Bring it back: that's the only place a dispute can be handled.",
          },
        ],
        prevention: [
          "Keep the whole conversation in the platform's messaging.",
          "Ship an item only once the funds are visible in your account.",
          "Never enter your banking credentials or a code to receive a payment.",
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
];

import type { AttackEntry } from "./types";
import { VERIFIED_REFERENCES as REF } from "./types";

/**
 * Données et identité numérique.
 *
 * RÈGLES PROPRES À CETTE FAMILLE, en plus de celles de ingenierie-sociale.ts :
 *
 *  1. Plusieurs sujets de cette famille ne sont PAS des attaques. Le
 *     moissonnage de données publiques, le traçage publicitaire et la revente
 *     de données relèvent de pratiques largement licites. Les fiches le
 *     disent, plutôt que de laisser croire à une infraction : présenter du
 *     légal comme du criminel décrédibilise le reste du site, et empêche de
 *     comprendre pourquoi la situation ne s'arrête pas toute seule.
 *
 *  2. Aucune affirmation juridique précise sans source. Le RGPD est cité pour
 *     l'existence de droits — accès, effacement, opposition — et pour
 *     l'existence d'un recours devant la CNIL, jamais pour des délais, des
 *     montants de sanction ou des qualifications pénales, qui demandent une
 *     vérification que cet environnement ne permet pas.
 *
 *  3. Une frontière du §4.1 du plan traverse cette famille et doit être tenue
 *     à l'ouverture : `vol-d-identite` ≠ `usurpation-d-identite`. La seconde
 *     est un MOYEN — se faire passer pour quelqu'un le temps d'un échange ;
 *     la première est un PRÉJUDICE — un tiers agit en votre nom dans la
 *     durée, et le dommage se découvre souvent longtemps après.
 *
 *  4. Ces fiches distinguent systématiquement ce que la personne peut faire
 *     de ce qui ne dépend pas d'elle. C'est la famille où l'illusion de
 *     contrôle est la plus coûteuse : une donnée diffusée ne se rappelle pas,
 *     et un conseil qui laisse penser le contraire fait perdre du temps au
 *     moment où il en reste peu.
 */
export const DONNEES_ET_IDENTITE_NUMERIQUE: AttackEntry[] = [
  {
    code: "DATA-000001",
    slug: "fuite-de-donnees",
    noSimulationReason:
      "L'origine est chez une organisation et aucune décision de la personne concernée n'aurait changé le fait d'y figurer. Ce qui se joue ensuite — un faux message qui imite la notification — est déjà couvert par les simulations d'hameçonnage.",
    name: "Fuite de données",
    categorySlug: "donnees-et-identite-numerique",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une entreprise chez qui vous aviez un compte s'est fait dérober ses fichiers clients, et vous êtes dedans. Vous n'avez rien fait de travers, et vous ne pouvez pas faire annuler la diffusion.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "violation de données",
      "data breach",
      "vol de données",
      "fuite de base de données",
      "compromission de données",
    ],
    primaryVector: "web",
    primaryDimension: "personal_data_exposure_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Une fuite de données est la divulgation, accidentelle ou par intrusion, de données détenues par une organisation sur ses clients, ses usagers ou ses salariés. Le point de vue de cette fiche est celui de la personne concernée : que signifie être dans une fuite, et que peut-elle faire d'utile.",
    howItWorks:
      "L'origine se situe chez l'organisation — intrusion, erreur de configuration, prestataire compromis, accès interne détourné — et non chez vous : aucune précaution personnelle n'aurait évité que votre adresse figure dans un fichier confié à un tiers. Ce qui vous concerne commence après. Les données extraites circulent, se recoupent avec d'autres fuites, et alimentent des usages précis. Une adresse électronique associée à un mot de passe sert à essayer ce couple sur d'autres services. Un numéro de téléphone associé à un nom et à une adresse rend crédible un message qui reprend ces éléments. Un historique d'achats rend crédible un faux message de livraison. C'est la raison pour laquelle une fuite se manifeste souvent par une hausse de sollicitations bien informées, plusieurs mois après les faits — et pourquoi le délai n'a rien de rassurant : une base de données ne se périme pas.",
    warningSigns: [
      "Notification de l'organisation vous informant que vos données ont été concernées",
      "Messages ou appels reprenant des informations exactes vous concernant : nom, adresse, achat récent",
      "Tentatives de connexion signalées sur des comptes réutilisant le même mot de passe",
      "Hausse nette de courriels indésirables et d'appels commerciaux visant la même adresse",
      "Demande de réinitialisation de mot de passe que vous n'avez pas déclenchée",
    ],
    triggers: ["trust", "urgency"],
    indicators: [],
    howToVerify:
      "Prenez au sérieux la notification reçue de l'organisation, mais rejoignez votre compte par vos propres moyens plutôt que par le lien du message — une fuite réelle est suivie de faux messages qui l'imitent, et c'est un moment où l'on clique. Vérifiez l'activité récente et les appareils connectés sur les comptes concernés. Interrogez l'organisation sur la nature exacte des données touchées : la conduite à tenir n'est pas la même selon qu'il s'agit d'adresses ou de pièces d'identité.",
    whatToDo:
      "Changez le mot de passe du service concerné, et surtout de tous ceux où le même était utilisé — c'est le seul geste qui traite la conséquence principale. Activez la double authentification là où elle existe. Attendez-vous à des messages bien informés dans les mois qui suivent et traitez toute sollicitation entrante avec la même règle qu'ailleurs : ne pas répondre par le canal reçu.",
    whatToDoIfVictim:
      "Vous disposez de droits opposables à l'organisation — être informé de la nature des données concernées, en demander l'accès, en demander l'effacement — et d'un recours devant la CNIL si elle ne répond pas. Si la fuite comprend des pièces d'identité ou des coordonnées bancaires, le risque change de nature : surveillez vos relevés, prévenez votre banque, et lisez la fiche vol d'identité. Conservez la notification reçue, elle documente la date et l'origine. Signalez les faits sur cybermalveillance.gouv.fr. Si un maître chanteur vous contacte en citant ces données, la fiche chantage après fuite de données traite ce cas précis.",
    whyItWorks:
      "La fuite a lieu loin de vous, et rien ne se passe tout de suite : on oublie. Les messages qui suivent connaissent votre nom, votre achat, votre numéro, et cette précision les rend crédibles.",
    example: {
      setting: "Email reçu de la part d'une boutique en ligne où vous avez un compte.",
      message:
        "Nous vous informons qu'un accès non autorisé à notre fichier clients a eu lieu. Les données concernées sont : nom, adresse email, adresse postale, historique de commandes. Aucune donnée bancaire n'est concernée. Nous vous recommandons de changer votre mot de passe.",
      giveaways: [
        "La notification peut être authentique : ouvrez votre compte par vous-même, pas par un lien.",
        "Les données listées serviront à rendre crédibles de faux messages de livraison.",
        "Le mot de passe de ce site sert peut-être ailleurs.",
      ],
    },
    decisionChecklist: [
      {
        check: "Une organisation vous annonce-t-elle que vos données sont concernées par une fuite ?",
        then: "Rejoignez votre compte par vos propres moyens et changez-y le mot de passe.",
      },
      {
        check: "Ce mot de passe servait-il aussi ailleurs ?",
        then: "Changez-le partout et activez la double authentification.",
      },
      {
        check: "La fuite comprend-elle une pièce d'identité ou des coordonnées bancaires ?",
        then: "Prévenez votre banque, surveillez vos relevés et lisez la fiche vol d'identité.",
      },
    ],
    prevention: [
      "Un mot de passe unique par service, pour qu'une fuite reste limitée à un compte.",
      "Ne donnez à un service que les informations dont il a vraiment besoin.",
      "Après une fuite, traitez tout message bien informé avec la même règle : ne pas répondre par le canal reçu.",
    ],
    relatedAttackCodes: [
      "PERS-000010",
      "ACCT-000001",
      "DATA-000002",
      "ACCT-000007",
      "PHISH-000001",
      "DATA-000008",
      "ACCT-000003",
    ],
    faq: [
      {
        question:
          "Puis-je faire retirer mes données une fois qu'elles ont fuité ?",
        answer:
          "Vous pouvez en demander l'effacement à l'organisation qui les détenait, et c'est utile pour l'avenir. Sur les copies déjà diffusées, personne ne le peut : c'est la réalité qu'il faut intégrer, parce qu'elle déplace l'effort là où il est efficace — changer ce qui peut l'être, à commencer par les mots de passe.",
      },
      {
        question: "La fuite date d'il y a deux ans, suis-je encore concerné ?",
        answer:
          "Oui. Une base de données ne se démode pas : votre nom, votre adresse et votre date de naissance n'ont pas changé, et un mot de passe jamais renouvelé reste valable. Les fichiers anciens continuent de circuler et de se recouper avec les plus récents.",
      },
      {
        question: "Comment savoir si je suis concerné sans notification ?",
        answer:
          "Vous ne le saurez pas toujours, toutes les fuites n'étant pas connues ni notifiées. Plutôt que de chercher à en établir la liste, adoptez la posture qui vaut dans les deux cas : un mot de passe unique par service et la double authentification sur les comptes qui comptent. Cela rend la question beaucoup moins déterminante.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "data-breach",
        name: "Data breach",
        plainLanguageDefinition:
          "A company where you had an account had its customer files stolen, and you're in them. You didn't do anything wrong, and you can't get the exposure undone.",
        definition:
          "A data breach is the disclosure, whether accidental or through an intrusion, of data an organization holds about its customers, users, or employees. This fiche takes the point of view of the person affected: what does it mean to be caught in a breach, and what can you usefully do about it.",
        howItWorks:
          "The origin lies with the organization — an intrusion, a misconfiguration, a compromised vendor, a misused internal access — not with you: no personal precaution would have kept your address out of a file entrusted to a third party. What concerns you starts afterward. The extracted data circulates, gets cross-referenced with other breaches, and feeds specific uses. An email address paired with a password gets tried against other services. A phone number paired with a name and address makes a message that reuses those details credible. A purchase history makes a fake delivery message credible. This is why a breach often shows up as a rise in well-informed solicitations, months after the fact — and why the delay is nothing to be reassured by: a database doesn't expire.",
        warningSigns: [
          "Notification from the organization informing you that your data was affected",
          "Messages or calls that reuse accurate information about you: name, address, a recent purchase",
          "Reported login attempts on accounts that reuse the same password",
          "A sharp rise in spam emails and sales calls targeting the same address",
          "A password-reset request you didn't trigger",
        ],
        howToVerify:
          "Take the notification from the organization seriously, but reach your account on your own rather than through the link in the message — a real breach is often followed by fake messages imitating it, and that's a moment when people click. Check recent activity and connected devices on the affected accounts. Ask the organization exactly which data was affected: the right response isn't the same for email addresses as it is for identity documents.",
        whatToDo:
          "Change the password of the affected service, and above all every other one where you reused it — that's the only action that addresses the main consequence. Turn on two-factor authentication wherever it's available. Expect well-informed messages in the months that follow, and treat every incoming solicitation with the same rule as elsewhere: never reply through the channel it arrived on.",
        whatToDoIfVictim:
          "You have rights you can assert against the organization — to be told which data was affected, to request access to it, to request its erasure — and a right of recourse with the CNIL if it doesn't respond. If the breach includes identity documents or banking details, the risk changes in nature: watch your statements, notify your bank, and read the identity theft fiche. Keep the notification you received, it documents the date and origin. Report the incident to the relevant authority. If someone tries to blackmail you by citing this data, the fiche on extortion after a data breach covers that specific case.",
        faq: [
          {
            question: "Can I get my data taken down once it has leaked?",
            answer:
              "You can ask the organization that held it to erase it, and that's useful going forward. On copies already circulating, no one can — that's the reality to accept, because it redirects effort to where it's effective: changing what can be changed, starting with passwords.",
          },
          {
            question: "The breach happened two years ago — am I still affected?",
            answer:
              "Yes. A database doesn't go out of date: your name, address, and date of birth haven't changed, and a password never renewed is still valid. Old files keep circulating and get cross-referenced with newer ones.",
          },
          {
            question: "How do I know if I'm affected without a notification?",
            answer:
              "You won't always know, since not every breach is known or notified. Rather than trying to compile a list, adopt the stance that holds in both cases: one unique password per service and two-factor authentication on the accounts that matter. That makes the question far less decisive.",
          },
        ],
        whyItWorks:
          "The breach happens far from you, and nothing happens right away: you forget. The messages that follow know your name, your purchase, your number, and that precision makes them believable.",
        example: {
          setting: "Email received from an online store where you have an account.",
          message:
            "We are informing you that unauthorized access to our customer file has occurred. The data concerned is: name, email address, postal address, order history. No banking data is affected. We recommend that you change your password.",
          giveaways: [
            "The notice may be genuine: open your account on your own, not through a link.",
            "The data listed will be used to make fake delivery messages believable.",
            "This site's password may be used elsewhere.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is an organization telling you that your data was part of a breach?",
            then: "Go to your account on your own and change the password there.",
          },
          {
            check: "Was that password also used elsewhere?",
            then: "Change it everywhere and turn on two-factor authentication.",
          },
          {
            check: "Does the breach include an ID document or bank details?",
            then: "Warn your bank, watch your statements and read the identity theft page.",
          },
        ],
        prevention: [
          "One unique password per service, so a breach stays limited to one account.",
          "Give a service only the information it really needs.",
          "After a breach, treat any well-informed message with the same rule: don't respond through the channel it came from.",
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
    code: "DATA-000002",
    slug: "vol-d-identite",
    noSimulationReason:
      "C'est un préjudice qui se découvre par un courrier, des mois après. La marche à suivre est une procédure administrative, pas une décision à prendre sur le moment.",
    name: "Vol d'identité",
    categorySlug: "donnees-et-identite-numerique",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Quelqu'un agit en votre nom dans la durée : un crédit ouvert, un abonnement souscrit, une déclaration faite. Vous l'apprenez généralement par un courrier de relance concernant une chose que vous n'avez jamais demandée.",
    attackerObjective: "identifiants",
    aliases: [
      "usurpation d'identité administrative",
      "identité volée",
      "fraude à l'identité",
      "vol d'identité en ligne",
    ],
    primaryVector: "web",
    primaryDimension: "identity_verification",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Le vol d'identité est l'utilisation durable de l'identité d'une personne réelle par un tiers pour accomplir des actes en son nom : souscrire un crédit ou un abonnement, ouvrir un compte, effectuer une démarche administrative. Il se distingue de l'usurpation d'identité au sens de l'ingénierie sociale, qui consiste à se faire passer pour quelqu'un le temps d'un échange : ici l'emprunt n'est pas le procédé mais le dommage, et il produit des effets qui se découvrent souvent longtemps après.",
    howItWorks:
      "La matière première se constitue par accumulation : une pièce d'identité photographiée et envoyée « pour vérification », des données issues d'une fuite, un justificatif de domicile, des informations laissées publiques. Prises séparément ces informations paraissent anodines ; réunies, elles suffisent à remplir un dossier. L'usage se fait ensuite à distance, auprès d'organismes qui ne vous connaissent pas et qui vérifient sur pièces. C'est ce qui explique la caractéristique la plus pénible de ce préjudice : le décalage. Le dossier est constitué et accepté sans que rien ne vous parvienne, et vous n'apprenez son existence qu'au premier impayé, par une relance, un refus de crédit inexpliqué, ou un courrier d'une administration. À ce stade, la charge de démontrer que ce n'est pas vous vous incombe en pratique, ce qui rend la conservation des preuves déterminante dès le premier jour.",
    warningSigns: [
      "Courrier de relance ou de recouvrement pour un contrat que vous n'avez jamais souscrit",
      "Refus de crédit ou de location sans explication liée à votre situation réelle",
      "Courrier d'une administration concernant une démarche que vous n'avez pas engagée",
      "Facture ou contrat à votre nom envoyé à une adresse qui n'est pas la vôtre",
      "Compte bancaire ou moyen de paiement apparaissant à votre nom sans votre intervention",
      "Convocation ou avis concernant des faits auxquels vous êtes étranger",
    ],
    triggers: ["authority"],
    indicators: [],
    howToVerify:
      "N'utilisez pas les coordonnées figurant sur le courrier reçu : cherchez l'organisme par vous-même et appelez-le pour faire confirmer l'existence du dossier et obtenir sa date, son adresse et les pièces fournies. Ces éléments sont ce qui étaye la contestation. Demandez à votre banque de vérifier ce qui est ouvert à votre nom.",
    whatToDo:
      "Ne transmettez une pièce d'identité que lorsque vous en comprenez la nécessité, et jamais à un interlocuteur qui vous a contacté. Quand l'envoi est réellement nécessaire, une copie portant une mention manuscrite indiquant le destinataire, l'usage et la date en limite la réutilisation.",
    whatToDoIfVictim:
      "Déposez plainte sans attendre : c'est la pièce que tous les organismes vous demanderont, et son absence bloque le reste. Contestez par écrit auprès de chaque organisme concerné, en conservant les preuves d'envoi. Signalez la situation à votre banque. Vérifiez si vous êtes inscrit dans un fichier d'incidents de paiement et engagez la démarche de radiation le cas échéant. Un accompagnement juridique est utile ici plus qu'ailleurs, la procédure se déroulant sur plusieurs mois et auprès de plusieurs interlocuteurs : cybermalveillance.gouv.fr oriente vers les dispositifs d'aide. Conservez tout — courriers, échanges, dates — depuis le premier jour.",
    whyItWorks:
      "Chaque document transmis paraît anodin pris isolément, et rien ne se passe pendant des mois. Quand le courrier arrive, le lien avec un envoi passé est rompu, et la personne ne sait même pas par où commencer.",
    example: {
      setting: "Courrier reçu d'une société de recouvrement.",
      message:
        "Objet : Mise en demeure — crédit à la consommation n° 2026-0417\nMalgré nos relances, l'échéance de 312 € reste impayée. Sans règlement sous 8 jours, nous engagerons une procédure.",
      giveaways: [
        "Vous n'avez jamais souscrit ce crédit.",
        "Les relances mentionnées ne vous sont jamais parvenues : elles sont allées à une autre adresse.",
        "Le courrier arrive des mois après l'ouverture du dossier.",
      ],
    },
    decisionChecklist: [
      {
        check: "Recevez-vous un courrier pour un contrat ou une démarche que vous n'avez jamais faits ?",
        then: "N'utilisez pas les coordonnées du courrier : cherchez l'organisme vous-même et faites-vous confirmer le dossier.",
      },
      {
        check: "Le dossier existe-t-il bien à votre nom ?",
        then: "Déposez plainte, puis contestez par écrit auprès de l'organisme, en gardant les preuves d'envoi.",
      },
      {
        check: "D'autres comptes ou crédits ont-ils pu être ouverts à votre nom ?",
        then: "Demandez à votre banque de vérifier et conservez tous les courriers depuis le premier jour.",
      },
    ],
    prevention: [
      "Ne transmettez une pièce d'identité qu'à un organisme que vous avez vérifié vous-même.",
      "Ajoutez en travers de chaque copie la mention du destinataire, de l'usage et de la date.",
      "Lisez votre courrier administratif et bancaire, même celui qui paraît sans intérêt.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000009",
      "DATA-000009",
      "DATA-000001",
      "PERS-000007",
      "ACCT-000003",
      "DATA-000005",
    ],
    faq: [
      {
        question: "Quelle différence avec l'usurpation d'identité ?",
        answer:
          "L'usurpation est un moyen : quelqu'un se fait passer pour vous ou pour votre banque le temps d'un appel. Le vol d'identité est un préjudice qui s'installe : un tiers agit en votre nom auprès d'organismes, dans la durée, et les effets se découvrent après coup. Le premier se déjoue sur le moment ; le second se répare, longuement.",
      },
      {
        question:
          "Dois-je payer la somme réclamée en attendant que la situation soit éclaircie ?",
        answer:
          "C'est précisément le point à faire trancher par un professionnel plutôt que par un site : la réponse dépend de la nature de la créance et de l'état de la procédure. Ce qui est certain, c'est qu'il faut contester par écrit sans tarder et conserver la preuve de la contestation. Ne restez pas sans répondre.",
      },
      {
        question: "Comment ont-ils obtenu mes documents ?",
        answer:
          "Le plus souvent par accumulation plutôt que par un vol unique : une pièce envoyée à une fausse annonce, une fuite chez un organisme, un justificatif transmis à un interlocuteur qui n'en avait pas besoin. C'est ce qui rend le point de départ difficile à identifier, et pourquoi la question utile est plutôt de savoir où vos documents circulent aujourd'hui.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "identity-theft",
        name: "Identity theft",
        plainLanguageDefinition:
          "Someone acts in your name over time: a loan opened, a subscription taken out, a filing made. You usually find out through a reminder letter about something you never asked for.",
        definition:
          "Identity theft is a third party's sustained use of a real person's identity to carry out acts in their name: taking out a loan or subscription, opening an account, completing an administrative procedure. It differs from identity impersonation in the social-engineering sense, which means posing as someone for the length of a single exchange: here, the borrowing isn't the method but the harm, and its effects are often discovered long afterward.",
        howItWorks:
          "The raw material builds up by accumulation: an ID document photographed and sent \"for verification,\" data from a breach, a proof of address, information left public. Taken separately these details look harmless; put together, they're enough to fill out a file. The use then happens remotely, with organizations that don't know you and verify on paper. This explains the most painful feature of this harm: the lag. The file is put together and accepted without anything reaching you, and you only learn it exists at the first unpaid bill, through a reminder, an unexplained credit refusal, or a letter from an administration. At that point, the burden of proving it wasn't you falls on you in practice, which is why keeping evidence from day one is decisive.",
        warningSigns: [
          "Reminder or collection letter for a contract you never took out",
          "Credit or rental refusal with no explanation tied to your real situation",
          "Letter from an administration about a procedure you never started",
          "Bill or contract in your name sent to an address that isn't yours",
          "Bank account or payment method appearing in your name without your involvement",
          "Summons or notice about facts you have nothing to do with",
        ],
        howToVerify:
          "Don't use the contact details shown on the letter you received: look up the organization yourself and call it to confirm the file exists and to get its date, address, and the documents supplied. These details are what a dispute rests on. Ask your bank to check what's open in your name.",
        whatToDo:
          "Only send an ID document once you understand why it's needed, and never to someone who contacted you first. When sending one really is necessary, a copy marked by hand with the recipient, the purpose, and the date limits its reuse.",
        whatToDoIfVictim:
          "File a police report without waiting: it's the document every organization will ask for, and not having it blocks everything else. Dispute in writing with each organization involved, keeping proof of postage. Notify your bank. Check whether you're listed in a payment-incident file and start the removal process if so. Legal support is more useful here than elsewhere, since the process runs over several months and with several parties: the relevant authority can direct you to assistance schemes. Keep everything — letters, exchanges, dates — from day one.",
        faq: [
          {
            question: "What's the difference with identity impersonation?",
            answer:
              "Impersonation is a method: someone poses as you or your bank for the length of a call. Identity theft is a harm that settles in: a third party acts in your name with organizations, over time, and the effects are discovered afterward. The first is defeated in the moment; the second is repaired, slowly.",
          },
          {
            question:
              "Do I have to pay the amount demanded while the situation gets sorted out?",
            answer:
              "That's precisely the point to have settled by a professional rather than a website: the answer depends on the nature of the debt and where the procedure stands. What's certain is that you need to dispute it in writing without delay and keep proof of the dispute. Don't leave it unanswered.",
          },
          {
            question: "How did they get my documents?",
            answer:
              "Usually by accumulation rather than a single theft: a document sent to a fake listing, a breach at an organization, a proof of identity given to someone who didn't need it. That's what makes the starting point hard to pin down, and why the useful question is rather where your documents are circulating today.",
          },
        ],
        whyItWorks:
          "Each document sent seems harmless on its own, and nothing happens for months. When the letter arrives, the link to a past exchange is broken, and the person doesn't even know where to start.",
        example: {
          setting: "Letter received from a debt collection agency.",
          message:
            "Subject: Formal notice — consumer loan no. 2026-0417\nDespite our reminders, the €312 installment remains unpaid. Without payment within 8 days, we will begin proceedings.",
          giveaways: [
            "You never took out this loan.",
            "The reminders mentioned never reached you: they went to another address.",
            "The letter arrives months after the file was opened.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are you receiving a letter about a contract or process you never started?",
            then: "Don't use the contact details in the letter: look up the organization yourself and have it confirm the file.",
          },
          {
            check: "Does the file really exist in your name?",
            then: "File a police report, then dispute it in writing with the organization, keeping proof of sending.",
          },
          {
            check: "Could other accounts or loans have been opened in your name?",
            then: "Ask your bank to check, and keep every letter from day one.",
          },
        ],
        prevention: [
          "Send an ID only to an organization you've verified yourself.",
          "Write the recipient, the purpose and the date across every copy.",
          "Read your administrative and bank mail, even the letters that seem uninteresting.",
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
    code: "DATA-000003",
    slug: "moissonnage-de-donnees",
    noSimulationReason:
      "La collecte est automatisée et ne se manifeste par rien chez la personne concernée. Ce qui se travaille est la visibilité de ses propres profils, pas la reconnaissance d'un message.",
    name: "Moissonnage de données (scraping)",
    categorySlug: "donnees-et-identite-numerique",
    editorialStatus: "published",
    plainLanguageDefinition:
      "La collecte automatisée, à grande échelle, de ce qui est déjà public sur vous. Rien n'est piraté : c'est le rassemblement qui crée l'information, pas chaque élément pris isolément.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "scraping",
      "aspiration de données",
      "collecte automatisée",
      "web scraping",
    ],
    primaryVector: "social_media",
    primaryDimension: "personal_data_exposure_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Le moissonnage est la collecte automatisée d'informations accessibles publiquement — profils de réseaux sociaux, annuaires, sites d'annonces, registres ouverts — afin d'en constituer des bases exploitables. Aucun système n'est forcé : la technique consiste à lire très vite ce que n'importe qui peut lire lentement, et c'est ce qui rend le sujet différent des autres fiches de ce site.",
    howItWorks:
      "Un programme parcourt les pages, extrait les champs qui l'intéressent et les range dans un fichier. L'opération n'a rien de remarquable prise une par une ; ce qui compte est le changement d'échelle et surtout le recoupement. Votre prénom sur un profil, votre employeur sur un réseau professionnel, votre ville dans une annonce, la photo de votre rue, le prénom de vos enfants dans un commentaire : chaque élément est banal, l'assemblage ne l'est plus. Il fournit exactement ce qu'exigent d'autres procédés décrits sur ce site — un message crédible parce qu'il connaît votre employeur, une réponse à une question de sécurité, un scénario d'usurpation d'un proche qui cite les bons prénoms. Le statut juridique mérite d'être dit clairement : collecter des données publiques n'est pas en soi une intrusion, mais leur réutilisation reste encadrée par le droit des données personnelles, et les conditions d'utilisation des plateformes l'interdisent le plus souvent.",
    warningSigns: [
      "Messages qui citent des informations exactes vous concernant sans que vous les ayez communiquées",
      "Votre profil réapparaît sur des annuaires ou des agrégateurs que vous n'avez jamais visités",
      "Sollicitations professionnelles reprenant votre poste et votre employeur avec précision",
      "Photo de profil réutilisée ailleurs, sur un compte qui n'est pas le vôtre",
      "Rien de particulier — le moissonnage ne laisse aucune trace visible chez la personne concernée",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Faites l'exercice à leur place : cherchez votre nom, votre adresse électronique et votre numéro de téléphone dans un moteur de recherche, et regardez ce qu'un inconnu obtient en une minute. Cherchez aussi vos photos de profil par recherche d'image inversée. Ce que vous trouvez est très exactement la matière disponible.",
    whatToDo:
      "Restreignez la visibilité de vos profils à vos contacts plutôt qu'au public, et retirez des profils publics ce qui sert de réponse à une question de sécurité : date de naissance, ville de naissance, nom des animaux, établissement scolaire. Réfléchissez à ce que révèlent les photos publiées — plaque, façade, badge, document en arrière-plan. Une donnée non publiée est la seule qui ne soit pas moissonnable.",
    whatToDoIfVictim:
      "Vous pouvez demander à un site le retrait de vos données et saisir la CNIL en l'absence de réponse ; c'est utile site par site, et sans effet sur les copies déjà constituées. L'effort le plus rentable porte donc sur l'avenir : réduire ce qui est publiquement lisible, et considérer comme connu ce qui l'a été. Si les informations rassemblées servent à vous nuire publiquement, la fiche doxxing traite ce cas.",
    whyItWorks:
      "Chaque information publiée paraît banale, et l'on ne voit jamais la collecte. Le danger n'apparaît qu'une fois tout rassemblé, dans un message qui en sait trop.",
    example: {
      setting: "Message reçu sur un réseau professionnel.",
      message:
        "Bonjour Claire, en tant que responsable comptable chez votre employeur à Nantes, vous êtes sans doute concernée par la réforme de la facturation. Je vous envoie notre guide : il suffit de vous identifier sur notre portail.",
      giveaways: [
        "Le message cite votre poste, votre employeur et votre ville, tous publics.",
        "L'expéditeur ne vous connaît pas.",
        "La précision sert à rendre crédible la demande d'identification.",
      ],
    },
    decisionChecklist: [
      {
        check: "Un inconnu cite-t-il des informations exactes sur vous pour obtenir quelque chose ?",
        then: "Ne lui accordez pas plus de crédit pour autant : vérifiez par un autre canal.",
      },
      {
        check: "Vos profils publics montrent-ils des réponses à des questions de sécurité ?",
        then: "Retirez-les et changez les réponses concernées.",
      },
      {
        check: "Un site a-t-il publié vos données sans votre accord ?",
        then: "Demandez-en le retrait, et saisissez la CNIL faute de réponse.",
      },
    ],
    prevention: [
      "Réglez la visibilité de vos profils sur vos contacts.",
      "Publiez moins de détails qui se recoupent : employeur, ville, prénoms des enfants.",
      "Considérez comme connu tout ce qui a été public un jour.",
    ],
    relatedAttackCodes: [
      "DATA-000004",
      "DATA-000005",
      "PERS-000004",
      "SOCIAL-000007",
      "AI-000003",
      "DATA-000008",
    ],
    faq: [
      {
        question: "Si c'est public, où est le problème ?",
        answer:
          "Dans l'assemblage. Chaque information prise seule ne dit rien ; réunies, elles donnent un profil complet — employeur, habitudes, entourage, adresse — qui rend crédible un message ciblé. Le problème n'est pas la publicité de chaque élément, c'est la vitesse à laquelle une machine les rassemble.",
      },
      {
        question: "Est-ce illégal ?",
        answer:
          "Pas en soi : lire une page publique n'est pas une intrusion. La réutilisation de données personnelles reste toutefois encadrée, et la plupart des plateformes l'interdisent dans leurs conditions. Autrement dit, ce n'est pas une infraction dont on attend qu'elle soit poursuivie, et c'est pourquoi la réponse pratique est de réduire ce qui est exposé.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "data-scraping",
        name: "Data scraping",
        plainLanguageDefinition:
          "The automated, large-scale collection of what's already public about you. Nothing is hacked: it's the gathering that creates the information, not any single piece taken on its own.",
        definition:
          "Scraping is the automated collection of publicly accessible information — social media profiles, directories, listing sites, open registries — in order to build usable databases. No system is forced open: the technique consists of reading very fast what anyone could read slowly, which is what makes this topic different from the other fiches on this site.",
        howItWorks:
          "A program crawls pages, extracts the fields it's after, and stores them in a file. The operation is unremarkable taken one at a time; what matters is the change of scale and, above all, the cross-referencing. Your first name on a profile, your employer on a professional network, your city in a listing, a photo of your street, your children's first names in a comment: each piece is mundane, the assembly no longer is. It supplies exactly what other methods described on this site require — a message made credible because it knows your employer, an answer to a security question, an impersonation-of-a-relative scenario that cites the right first names. The legal status is worth stating clearly: collecting public data isn't in itself an intrusion, but reusing it stays governed by data-protection law, and platform terms of use most often prohibit it.",
        warningSigns: [
          "Messages that cite accurate information about you that you never shared",
          "Your profile reappears on directories or aggregators you've never visited",
          "Professional solicitations that precisely reuse your job title and employer",
          "Your profile photo reused elsewhere, on an account that isn't yours",
          "Nothing in particular — scraping leaves no visible trace for the person affected",
        ],
        howToVerify:
          "Do the exercise in their place: search your name, email address, and phone number in a search engine, and see what a stranger gets in a minute. Also search your profile photos with a reverse image search. What you find is exactly the material that's available.",
        whatToDo:
          "Restrict your profiles' visibility to your contacts rather than the public, and remove from public profiles whatever serves as an answer to a security question: date of birth, city of birth, pet names, school attended. Think about what your published photos reveal — a license plate, a building front, a badge, a document in the background. Data that's never published is the only kind that can't be scraped.",
        whatToDoIfVictim:
          "You can ask a site to remove your data and refer the matter to the CNIL if it doesn't respond; that's useful site by site, and has no effect on copies already made. The most worthwhile effort is therefore forward-looking: reduce what's publicly readable, and treat what has already been exposed as known. If the gathered information is used to harm you publicly, the doxxing fiche covers that case.",
        faq: [
          {
            question: "If it's public, what's the problem?",
            answer:
              "It's in the assembly. Each piece of information taken alone says nothing; put together, they give a complete profile — employer, habits, circle, address — that makes a targeted message credible. The problem isn't the public nature of each element, it's the speed at which a machine assembles them.",
          },
          {
            question: "Is it illegal?",
            answer:
              "Not in itself: reading a public page isn't an intrusion. Reusing personal data nonetheless stays regulated, and most platforms forbid it in their terms. In other words, it isn't an offense you should expect to see prosecuted, which is why the practical answer is to reduce what's exposed.",
          },
        ],
        whyItWorks:
          "Each piece of information posted seems trivial, and you never see the collection happen. The danger only appears once everything is gathered, in a message that knows too much.",
        example: {
          setting: "Message received on a professional network.",
          message:
            "Hello Claire, as head of accounting at your employer in Nantes, you're probably affected by the invoicing reform. I'm sending you our guide: you just need to log in to our portal.",
          giveaways: [
            "The message quotes your job, your employer and your city, all public.",
            "The sender doesn't know you.",
            "The precision is there to make the login request believable.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is a stranger quoting accurate information about you to get something?",
            then: "Don't give them more credit for it: check through another channel.",
          },
          {
            check: "Do your public profiles show answers to security questions?",
            then: "Remove them and change the answers concerned.",
          },
          {
            check: "Has a site published your data without your consent?",
            then: "Ask for its removal, and contact the data protection authority (the CNIL in France) if there's no answer.",
          },
        ],
        prevention: [
          "Set your profiles' visibility to your contacts.",
          "Post fewer details that can be cross-referenced: employer, city, children's first names.",
          "Treat anything that was ever public as known.",
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
    code: "DATA-000004",
    slug: "reidentification",
    noSimulationReason:
      "Le sujet est la finesse des données fournies à un service, pas un moment de décision face à un contenu reçu.",
    name: "Réidentification de données anonymes",
    categorySlug: "donnees-et-identite-numerique",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Des données présentées comme anonymes, recroisées avec d'autres jusqu'à ce qu'on retrouve de qui il s'agit. Le nom n'était pas là ; il se reconstitue.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "désanonymisation",
      "réidentification",
      "recoupement de données",
      "anonymisation insuffisante",
    ],
    primaryVector: "web",
    primaryDimension: "personal_data_exposure_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "La réidentification consiste à retrouver l'identité de personnes dans un jeu de données dont les identifiants directs ont été retirés, en le recoupant avec d'autres sources. Elle montre qu'« anonyme » décrit une opération effectuée sur un fichier, et non une propriété stable de ce fichier une fois qu'il circule.",
    howItWorks:
      "Retirer un nom ne supprime pas ce qui distingue. Il reste des attributs — un code postal, une tranche d'âge, une profession, des horaires, des trajets — dont la combinaison peut ne correspondre qu'à très peu de personnes, parfois à une seule. Il suffit alors de disposer d'une seconde source où ces mêmes attributs figurent avec un nom : une fuite, un annuaire, un profil public, un registre ouvert. Le recoupement rend le nom. Les données de déplacement illustrent bien le mécanisme : sans aucun identifiant, un trajet répété entre deux points aux mêmes heures désigne une personne, parce que peu de gens dorment à un endroit et travaillent à un autre selon exactement ce rythme. La conséquence pratique pour un lecteur est de ne pas traiter « anonymisé » comme une garantie définitive — c'est une réduction du risque, dont la valeur dépend de ce qui existe ailleurs, aujourd'hui et plus tard.",
    warningSigns: [
      "Service qui affirme collecter des données « anonymes » sans dire lesquelles ni à quelle finesse",
      "Étude ou jeu de données publié avec des attributs précis : commune, âge exact, profession",
      "Application de santé, de sport ou de trajet dont vous ne savez pas ce qu'elle publie ou partage",
      "Résultat qui vous concerne visiblement dans un ensemble présenté comme anonyme",
      "Historique de position conservé et partageable, souvent activé par défaut",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Cherchez, dans la politique de confidentialité, non pas le mot « anonyme » mais la liste de ce qui est collecté et la finesse retenue : une commune plutôt qu'un département, une date de naissance plutôt qu'une tranche d'âge, une position plutôt qu'une zone. C'est cette finesse qui décide de la possibilité de recoupement, pas l'adjectif employé.",
    whatToDo:
      "Limitez la précision que vous fournissez lorsque le service le permet : position approchée plutôt qu'exacte, tranche d'âge plutôt que date, historique désactivé. Vérifiez ce que publient par défaut les applications de sport, de santé et de déplacement, où le partage est souvent actif sans demande explicite.",
    whatToDoIfVictim:
      "Vous pouvez demander à l'organisme l'accès aux données vous concernant, leur effacement, et vous opposer à leur traitement ; la CNIL est l'autorité de recours si la demande reste sans réponse. Sur un jeu de données déjà publié, l'effacement des copies n'est pas atteignable — la démarche utile est d'obtenir le retrait à la source et de réduire ce que vous alimentez ensuite.",
    whyItWorks:
      "Le mot « anonyme » rassure, et l'on ne pense pas qu'une commune, un âge et des horaires suffisent à désigner une personne. Le recoupement a lieu plus tard, ailleurs, sans que rien ne vous prévienne.",
    example: {
      setting: "Paramètres d'une application de course à pied.",
      message:
        "Vos activités sont partagées publiquement de façon anonyme : seuls vos parcours, vos horaires et votre ville sont visibles.\nHistorique de position : activé.",
      giveaways: [
        "Un parcours qui commence chaque matin au même point désigne un domicile.",
        "Les horaires répétés suffisent à reconnaître une personne.",
        "Le partage est actif par défaut.",
      ],
    },
    decisionChecklist: [
      {
        check: "Une application partage-t-elle par défaut vos trajets, horaires ou position ?",
        then: "Limitez le partage, ou masquez le début et la fin de vos parcours.",
      },
      {
        check: "Un service promet-il l'anonymat sans dire ce qu'il collecte, ni avec quelle précision ?",
        then: "Fournissez le moins de précision possible : zone plutôt que position, tranche d'âge plutôt que date.",
      },
      {
        check: "Vous reconnaissez-vous dans des données présentées comme anonymes ?",
        then: "Demandez le retrait à l'organisme, et saisissez la CNIL faute de réponse.",
      },
    ],
    prevention: [
      "Désactivez l'historique de position quand il ne vous sert pas.",
      "Vérifiez ce que publient par défaut les applications de sport, de santé et de trajet.",
      "Lisez ce qui est collecté, pas le mot « anonyme ».",
    ],
    relatedAttackCodes: [
      "DATA-000003",
      "DATA-000005",
      "DATA-000007",
      "DATA-000008",
    ],
    faq: [
      {
        question: "« Anonymisé » n'est donc pas une garantie ?",
        answer:
          "C'est une garantie relative, qui dépend de ce qui existe ailleurs. Un jeu de données réellement impossible à réidentifier aujourd'hui peut cesser de l'être demain, si une autre source apparaît et permet le recoupement. Le terme décrit un traitement, pas un état définitif.",
      },
      {
        question: "Que puis-je faire concrètement ?",
        answer:
          "Agir sur la finesse plutôt que sur le principe : une position approchée, une tranche d'âge, un historique désactivé réduisent considérablement l'unicité de votre combinaison d'attributs — et c'est cette unicité, non la présence de votre nom, qui rend la réidentification possible.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "data-re-identification",
        name: "Re-identification of anonymous data",
        plainLanguageDefinition:
          "Data presented as anonymous, cross-referenced with other sources until someone works out who it's about. The name wasn't there; it gets reconstructed.",
        definition:
          "Re-identification means recovering the identity of people within a dataset whose direct identifiers have been removed, by cross-referencing it with other sources. It shows that \"anonymous\" describes an operation performed on a file, not a stable property of that file once it circulates.",
        howItWorks:
          "Removing a name doesn't remove what distinguishes someone. Attributes remain — a postal code, an age range, an occupation, schedules, routes — whose combination may match very few people, sometimes only one. All it then takes is a second source where those same attributes appear alongside a name: a breach, a directory, a public profile, an open registry. The cross-reference restores the name. Location data illustrates the mechanism well: with no identifier at all, a route repeated between two points at the same times identifies a person, because few people sleep in one place and work in another on exactly that rhythm. The practical takeaway for a reader is not to treat \"anonymized\" as a permanent guarantee — it's a risk reduction, whose value depends on what exists elsewhere, today and later.",
        warningSigns: [
          "A service that claims to collect \"anonymous\" data without saying which data or at what level of detail",
          "A study or dataset published with precise attributes: municipality, exact age, occupation",
          "A health, fitness, or route app you don't know what it publishes or shares",
          "A result that visibly concerns you within a set presented as anonymous",
          "Location history kept and shareable, often turned on by default",
        ],
        howToVerify:
          "In a privacy policy, look not for the word \"anonymous\" but for the list of what's collected and how detailed it is: a town rather than a region, a date of birth rather than an age range, a precise location rather than a zone. It's that level of detail that determines whether cross-referencing is possible, not the adjective used.",
        whatToDo:
          "Limit the precision you provide when the service allows it: an approximate location rather than an exact one, an age range rather than a date, history turned off. Check what sport, health, and route apps publish by default, where sharing is often on without an explicit prompt.",
        whatToDoIfVictim:
          "You can ask the organization for access to data about you, its erasure, and object to its processing; the CNIL is the authority to turn to if the request goes unanswered. On a dataset already published, erasing existing copies isn't achievable — the useful step is to get it withdrawn at the source and reduce what you feed into it afterward.",
        faq: [
          {
            question: "So \"anonymized\" isn't a guarantee?",
            answer:
              "It's a relative guarantee, one that depends on what exists elsewhere. A dataset genuinely impossible to re-identify today can stop being so tomorrow, if another source appears and enables cross-referencing. The term describes a process, not a permanent state.",
          },
          {
            question: "What can I actually do?",
            answer:
              "Act on precision rather than on the principle: an approximate location, an age range, history turned off considerably reduce how unique your combination of attributes is — and it's that uniqueness, not the presence of your name, that makes re-identification possible.",
          },
        ],
        whyItWorks:
          "The word \"anonymous\" reassures, and nobody imagines that a town, an age and a schedule are enough to single someone out. The cross-referencing happens later, elsewhere, without anything warning you.",
        example: {
          setting: "Settings of a running app.",
          message:
            "Your activities are shared publicly and anonymously: only your routes, times and city are visible.\nLocation history: on.",
          giveaways: [
            "A route that starts at the same spot every morning points to a home.",
            "Repeated times are enough to recognize a person.",
            "Sharing is on by default.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does an app share your routes, times or location by default?",
            then: "Limit sharing, or hide the start and end of your routes.",
          },
          {
            check: "Does a service promise anonymity without saying what it collects, or how precisely?",
            then: "Provide as little precision as possible: an area rather than a position, an age range rather than a date.",
          },
          {
            check: "Do you recognize yourself in data presented as anonymous?",
            then: "Ask the organization to remove it, and contact the data protection authority (the CNIL in France) if there's no answer.",
          },
        ],
        prevention: [
          "Turn off location history when you don't need it.",
          "Check what sports, health and travel apps publish by default.",
          "Read what is collected, not the word \"anonymous\".",
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
    code: "DATA-000005",
    slug: "exposition-de-donnees-personnelles",
    noSimulationReason:
      "L'exercice utile est de regarder ses propres profils déconnecté, ce que la fiche demande explicitement. Un scénario fictif ne remplacerait pas cette vérification-là.",
    name: "Exposition de données personnelles",
    categorySlug: "donnees-et-identite-numerique",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Ce que vous publiez vous-même sans mesurer ce que cela révèle : une photo où l'on lit une adresse, un document avec un numéro visible, un profil qui répond à vos questions de sécurité.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "surexposition en ligne",
      "empreinte numérique",
      "données personnelles exposées",
      "traces numériques",
    ],
    primaryVector: "social_media",
    primaryDimension: "personal_data_exposure_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "L'exposition de données personnelles désigne la mise à disposition involontaire d'informations vous concernant par vos propres publications et paramètres. Contrairement aux autres fiches de cette famille, il n'y a ici ni intrusion ni tiers collecteur au départ : la donnée est fournie, et le problème vient de ce qu'elle permet une fois lue par quelqu'un qui la cherche.",
    howItWorks:
      "L'écart tient à l'intention de lecture. Vous publiez une photo de vacances ; un lecteur attentif y voit que le logement est vide, la marque de la voiture et le nom de la rue en arrière-plan. Vous publiez la photo d'un billet, d'un colis ou d'un document administratif ; le numéro y est lisible. Vous répondez à un jeu qui demande le nom de votre premier animal, votre ville de naissance et le prénom de votre mère — soit exactement les questions de récupération de compte de nombreux services. Vous laissez sur un profil professionnel votre poste, votre employeur et vos collègues, ce qui suffit à construire un message crédible à votre nom. Rien de tout cela n'est une faute, et c'est précisément pourquoi ce n'est pas visible sur le moment : la publication a un sens dans son contexte, et un tout autre usage hors de lui.",
    warningSigns: [
      "Publications comportant un document, un billet, un badge ou une plaque lisibles",
      "Photos où l'arrière-plan identifie le domicile, l'école ou le lieu de travail",
      "Jeux et chaînes demandant des informations qui servent de questions de sécurité",
      "Profil public indiquant date de naissance complète, adresse, numéro de téléphone",
      "Publication en temps réel d'une absence prolongée du domicile",
      "Anciens comptes toujours en ligne, avec des paramètres jamais revus",
    ],
    triggers: ["trust", "social_pressure"],
    indicators: [],
    howToVerify:
      "Regardez vos profils déconnecté, dans une fenêtre de navigation privée : vous voyez alors ce que voit un inconnu, ce que la vue connectée ne montre jamais. Cherchez votre nom et votre numéro dans un moteur de recherche, et vos photos par recherche d'image inversée. Faites l'exercice sur vos anciens comptes, qui sont le plus souvent les plus ouverts parce que personne ne revoit leurs réglages.",
    whatToDo:
      "Réglez la visibilité par défaut sur vos contacts plutôt que sur le public. Retirez des profils ce qui répond à une question de sécurité. Avant de publier une image, regardez ce qu'elle contient en dehors de son sujet. Publiez une absence après le retour plutôt que pendant. Fermez les comptes que vous n'utilisez plus, au lieu de les laisser en l'état.",
    whatToDoIfVictim:
      "Retirez ce qui peut l'être et changez les questions de sécurité dont les réponses étaient devenues publiques — remplacer une réponse vraie par une réponse arbitraire notée dans un gestionnaire de mots de passe est ici plus sûr qu'une réponse exacte. Pour le contenu publié par d'autres, demandez le retrait à la plateforme, puis à la personne. Si l'exposition sert à vous nuire ou à vous localiser, les fiches doxxing et cyberharcèlement traitent cette situation, et la conduite à tenir n'est pas la même.",
    whyItWorks:
      "Chaque publication a un sens dans son contexte, et personne ne la relit avec les yeux d'un inconnu. Les jeux qui demandent votre premier animal ou votre ville natale paraissent innocents.",
    example: {
      setting: "Jeu partagé sur un réseau social par plusieurs amis.",
      message:
        "Ton nom de star : le nom de ton premier animal + la ville où tu es né. Réponds en commentaire ! Moi : Caramel Montauban",
      giveaways: [
        "Ce sont deux questions de sécurité courantes pour récupérer un compte.",
        "Les réponses sont publiques et rattachées à votre nom.",
        "Le jeu n'apporte rien d'autre que ces deux informations.",
      ],
    },
    decisionChecklist: [
      {
        check: "Une publication ou un jeu vous demande-t-il des informations qui servent de questions de sécurité ?",
        then: "N'y répondez pas.",
      },
      {
        check: "Vos profils, vus déconnecté, montrent-ils date de naissance, adresse, numéro ou lieu de travail ?",
        then: "Réduisez leur visibilité à vos contacts.",
      },
      {
        check: "Certaines réponses à vos questions de sécurité sont-elles devenues publiques ?",
        then: "Remplacez-les par des réponses inventées, rangées dans votre gestionnaire de mots de passe.",
      },
    ],
    prevention: [
      "Regardez vos profils déconnecté une fois par an.",
      "Avant de publier une image, regardez ce qu'elle montre en dehors de son sujet.",
      "Publiez une absence après le retour plutôt que pendant.",
    ],
    relatedAttackCodes: [
      "PERS-000004",
      "DATA-000003",
      "ACCT-000009",
      "SOCIAL-000007",
      "DATA-000002",
      "DATA-000004",
      "AI-000009",
      "DATA-000008",
    ],
    faq: [
      {
        question: "Faut-il tout supprimer de ses réseaux sociaux ?",
        answer:
          "Non, et ce n'est pas là que se joue l'essentiel. Deux réglages font la plus grande partie du travail : la visibilité par défaut restreinte à vos contacts, et le retrait de ce qui sert de réponse à une question de sécurité. Le reste relève d'une attention ponctuelle au moment de publier.",
      },
      {
        question: "Comment supprimer une information déjà publiée ?",
        answer:
          "Vous pouvez la retirer à la source et demander son déréférencement aux moteurs de recherche. Sur les copies faites entre-temps, personne ne peut rien, et c'est ce qui rend la vérification avant publication plus efficace que n'importe quelle démarche après.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "personal-data-exposure",
        name: "Personal data exposure",
        plainLanguageDefinition:
          "What you publish yourself without gauging what it reveals: a photo where an address can be read, a document with a visible number, a profile that answers your security questions.",
        definition:
          "Personal data exposure refers to the unintentional availability of information about you through your own posts and settings. Unlike the other fiches in this family, there's no intrusion or third-party collector at the start: the data is provided, and the problem comes from what it enables once read by someone looking for it.",
        howItWorks:
          "The gap lies in the intent of the reader. You post a vacation photo; an attentive reader sees that the home is empty, the make of the car, and the street name in the background. You post a photo of a ticket, a package, or an official document; the number is legible. You answer a quiz asking for your first pet's name, your city of birth, and your mother's maiden name — exactly the account-recovery questions many services use. You leave your job title, employer, and colleagues on a professional profile, which is enough to build a credible message in your name. None of this is a mistake, which is exactly why it isn't visible in the moment: the post makes sense in its context, and has an entirely different use outside it.",
        warningSigns: [
          "Posts showing a legible document, ticket, badge, or license plate",
          "Photos where the background identifies the home, school, or workplace",
          "Quizzes and chain posts asking for information that doubles as security-question answers",
          "Public profile showing full date of birth, address, phone number",
          "Real-time posting of an extended absence from home",
          "Old accounts still online, with settings never revisited",
        ],
        howToVerify:
          "Look at your profiles logged out, in a private browsing window: that's what a stranger sees, which the logged-in view never shows. Search your name and phone number in a search engine, and your photos with a reverse image search. Do the exercise on your old accounts, which are usually the most open because no one revisits their settings.",
        whatToDo:
          "Set default visibility to your contacts rather than the public. Remove from profiles anything that answers a security question. Before posting an image, look at what it contains beyond its subject. Post about an absence after you're back rather than during it. Close accounts you no longer use, instead of leaving them as they are.",
        whatToDoIfVictim:
          "Remove what can be removed and change the security questions whose answers had become public — replacing a true answer with an arbitrary one saved in a password manager is safer here than an accurate answer. For content posted by others, ask the platform for removal, then the person. If the exposure is used to harm you or to locate you, the doxxing and cyberstalking/harassment fiches cover that situation, and the response isn't the same.",
        faq: [
          {
            question: "Do you have to delete everything from your social media?",
            answer:
              "No, and that's not where most of the work happens. Two settings do the bulk of it: default visibility restricted to your contacts, and removing whatever serves as an answer to a security question. The rest comes down to paying attention at the moment you post.",
          },
          {
            question: "How do I remove information that's already been published?",
            answer:
              "You can remove it at the source and ask search engines to de-index it. On copies made in the meantime, no one can do anything, which is exactly why checking before you publish is more effective than any after-the-fact step.",
          },
        ],
        whyItWorks:
          "Every post makes sense in its context, and nobody rereads it through a stranger's eyes. Games asking for your first pet or your hometown seem innocent.",
        example: {
          setting: "Game shared on a social network by several friends.",
          message:
            "Your star name: your first pet's name + the town where you were born. Answer in the comments! Mine: Caramel Montauban",
          giveaways: [
            "These are two common security questions for recovering an account.",
            "The answers are public and tied to your name.",
            "The game offers nothing beyond collecting those two pieces of information.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does a post or game ask for information that serves as a security question?",
            then: "Don't answer it.",
          },
          {
            check: "Do your profiles, viewed while logged out, show your date of birth, address, number or workplace?",
            then: "Limit their visibility to your contacts.",
          },
          {
            check: "Have some answers to your security questions become public?",
            then: "Replace them with invented answers, stored in your password manager.",
          },
        ],
        prevention: [
          "Look at your profiles while logged out once a year.",
          "Before posting an image, check what it shows besides its subject.",
          "Post about a trip after you're back rather than while you're away.",
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
    code: "DATA-000006",
    slug: "abus-d-autorisation-oauth",
    simulationSlug: "connexion-avec-compte-google-jeu-mobile",
    name: "Abus d'autorisation « Se connecter avec »",
    categorySlug: "donnees-et-identite-numerique",
    editorialStatus: "published",
    plainLanguageDefinition:
      "« Se connecter avec Google » ou « avec Facebook » accorde à un service un accès à votre compte. Cet accès reste ouvert après que vous avez cessé d'utiliser le service — parfois des années.",
    attackerObjective: "acces_a_un_compte",
    aliases: [
      "OAuth",
      "connexion tierce",
      "autorisation d'application",
      "se connecter avec Google",
      "accès applicatif",
    ],
    primaryVector: "web",
    primaryDimension: "personal_data_exposure_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "L'abus d'autorisation par connexion tierce consiste à obtenir, par le mécanisme légitime « Se connecter avec… », un accès à des données ou à des fonctions de votre compte principal qui dépasse ce que le service demandeur a besoin de savoir. L'accès accordé est durable, et il survit à l'arrêt de l'utilisation du service.",
    howItWorks:
      "Le mécanisme lui-même est sain, et présente un avantage réel : le service tiers ne reçoit pas votre mot de passe. Ce qu'il reçoit est une autorisation, dont la portée est décrite dans l'écran de consentement — celui que l'on valide sans le lire, parce qu'il apparaît au milieu d'une inscription et qu'il ressemble à une formalité. Or la différence est considérable entre « connaître votre adresse et votre nom » et « lire et envoyer vos courriels », « accéder à vos fichiers » ou « publier en votre nom ». Deux propriétés en font un sujet à part. La première est la durée : l'autorisation reste active jusqu'à ce que vous la retiriez, et désinstaller l'application n'y suffit pas. La seconde est l'indépendance vis-à-vis du mot de passe : changer celui de votre compte principal ne révoque pas les accès déjà accordés. Si le service tiers est ensuite revendu, abandonné ou compromis, l'accès qu'il détient sur votre compte reste ce qu'il était.",
    warningSigns: [
      "Écran de consentement demandant la lecture des courriels, l'accès aux fichiers ou la publication, pour un service sans rapport",
      "Application ou site accessoire proposant la connexion tierce comme seule option",
      "Messages ou publications émis en votre nom sans que vous les ayez rédigés",
      "Longue liste d'applications autorisées dans les réglages de votre compte principal, dont beaucoup vous sont inconnues",
      "Service inactif ou racheté, dont l'autorisation reste active",
    ],
    triggers: ["trust", "reward"],
    indicators: [],
    howToVerify:
      "Lisez l'écran de consentement avant de valider et rapportez ce qui est demandé à ce que fait le service — un outil de retouche d'images n'a besoin ni de vos courriels ni de votre carnet d'adresses. Passez en revue une fois par an la liste des applications autorisées dans les réglages de sécurité de vos comptes principaux : c'est là que se voit l'accumulation.",
    whatToDo:
      "Préférez la création d'un compte dédié lorsque le service n'a pas besoin de vos données, et n'accordez que ce que sa fonction justifie. Retirez les autorisations des services que vous n'utilisez plus, sans attendre d'incident.",
    whatToDoIfVictim:
      "Révoquez l'autorisation depuis les réglages de sécurité de votre compte principal — c'est l'action qui coupe l'accès, la désinstallation ne le fait pas. Changez ensuite votre mot de passe et vérifiez les sessions ouvertes, en sachant que le changement de mot de passe seul n'aurait pas suffi. Passez en revue les règles de transfert automatique de votre messagerie, un accès en écriture permettant d'en créer. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "L'écran de consentement apparaît au milieu d'une inscription et ressemble à une formalité : on clique pour continuer. Et comme aucun mot de passe n'est donné, on a le sentiment de n'avoir rien cédé.",
    example: {
      setting: "Écran affiché en s'inscrivant à un jeu mobile avec son compte de messagerie.",
      message:
        "Le jeu Bulles et Bonbons souhaite accéder à votre compte :\n• Voir votre nom et votre adresse email\n• Lire, envoyer et supprimer vos emails\n• Voir et modifier vos contacts\n[Autoriser]",
      giveaways: [
        "Un jeu n'a aucun besoin de lire ou d'envoyer vos emails.",
        "L'accès restera actif après la désinstallation du jeu.",
        "Changer votre mot de passe ne le coupera pas.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'écran de consentement demande-t-il vos emails, vos fichiers ou de publier en votre nom pour un service qui n'en a pas besoin ?",
        then: "Refusez, et créez plutôt un compte dédié si le service le permet.",
      },
      {
        check: "La liste des applications autorisées sur votre compte contient-elle des services inconnus ou abandonnés ?",
        then: "Révoquez leur accès dans les réglages de sécurité du compte.",
      },
      {
        check: "Des messages ou publications sont-ils partis en votre nom ?",
        then: "Révoquez l'autorisation, changez le mot de passe et vérifiez les règles de transfert de votre messagerie.",
      },
    ],
    prevention: [
      "Lisez l'écran de consentement avant de cliquer sur Autoriser.",
      "Faites une fois par an le tri des applications autorisées sur vos comptes principaux.",
      "N'accordez que ce que la fonction du service justifie.",
    ],
    relatedAttackCodes: [
      "ACCT-000003",
      "MOB-000007",
      "WEB-000006",
      "ACCT-000008",
      "ACCT-000010",
      "DATA-000008",
    ],
    faq: [
      {
        question:
          "Est-ce plus risqué que de créer un compte avec un mot de passe ?",
        answer:
          "Sur un point c'est plus sûr : le service tiers ne connaît pas votre mot de passe, donc une fuite chez lui ne l'expose pas. Sur un autre c'est plus engageant : vous accordez un accès durable à votre compte principal. Le risque tient donc à l'étendue de ce que vous accordez, et à l'oubli qui suit.",
      },
      {
        question: "J'ai changé mon mot de passe, les accès sont-ils coupés ?",
        answer:
          "Non, et c'est le point le plus contre-intuitif de cette fiche. Une autorisation est indépendante du mot de passe : elle se retire dans la liste des applications autorisées de votre compte, et nulle part ailleurs.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "oauth-permission-abuse",
        simulationSlug: "mobile-game-sign-in-with-account",
        name: "\"Sign in with\" permission abuse",
        plainLanguageDefinition:
          "\"Sign in with Google\" or \"with Facebook\" grants a service access to your account. That access stays open long after you've stopped using the service — sometimes for years.",
        definition:
          "Third-party sign-in permission abuse means obtaining, through the legitimate \"Sign in with…\" mechanism, access to data or functions on your main account that goes beyond what the requesting service needs to know. The access granted is long-lasting, and it survives after you stop using the service.",
        howItWorks:
          "The mechanism itself is sound, and has a real advantage: the third-party service never receives your password. What it receives is a permission, whose scope is described on the consent screen — the one you approve without reading, because it appears in the middle of a sign-up and looks like a formality. Yet the difference is significant between \"know your email and name\" and \"read and send your email,\" \"access your files,\" or \"post on your behalf.\" Two properties make this a case apart. The first is duration: the permission stays active until you revoke it, and uninstalling the app isn't enough. The second is independence from the password: changing your main account's password doesn't revoke access already granted. If the third-party service is later sold, abandoned, or compromised, the access it holds on your account stays exactly what it was.",
        warningSigns: [
          "Consent screen asking to read your email, access your files, or post on your behalf, for an unrelated service",
          "A minor app or site offering third-party sign-in as the only option",
          "Messages or posts made in your name that you didn't write",
          "A long list of authorized apps in your main account's settings, many of them unfamiliar",
          "An inactive or acquired service whose permission stays active",
        ],
        howToVerify:
          "Read the consent screen before approving it and compare what's being asked to what the service does — an image-editing tool has no need for your email or address book. Review the list of authorized apps in your main accounts' security settings once a year: that's where the buildup shows.",
        whatToDo:
          "Prefer creating a dedicated account when the service doesn't need your data, and grant only what its function justifies. Remove permissions for services you no longer use, without waiting for an incident.",
        whatToDoIfVictim:
          "Revoke the permission from your main account's security settings — that's the action that cuts off access, uninstalling doesn't. Then change your password and check your open sessions, knowing that changing the password alone wouldn't have been enough. Review your email account's auto-forwarding rules, since write access can be used to create one. Report the incident to the relevant authority.",
        faq: [
          {
            question: "Is this riskier than creating an account with a password?",
            answer:
              "In one respect it's safer: the third-party service never learns your password, so a breach there doesn't expose it. In another it commits you more: you grant lasting access to your main account. The risk depends on the scope of what you grant, and on the forgetting that follows.",
          },
          {
            question: "I changed my password — is the access cut off?",
            answer:
              "No, and that's the most counter-intuitive point in this fiche. A permission is independent from the password: it's revoked in the list of authorized apps on your account, and nowhere else.",
          },
        ],
        whyItWorks:
          "The consent screen appears in the middle of a sign-up and looks like a formality: you click to continue. And since no password is handed over, it feels like nothing was given away.",
        example: {
          setting: "Screen shown when signing up for a mobile game with your email account.",
          message:
            "The game Bubbles & Candies wants to access your account:\n• See your name and email address\n• Read, send and delete your emails\n• See and edit your contacts\n[Allow]",
          giveaways: [
            "A game has no need to read or send your emails.",
            "The access will stay active after you uninstall the game.",
            "Changing your password won't cut it off.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the consent screen ask for your emails, your files or permission to post in your name, for a service that doesn't need them?",
            then: "Decline, and create a dedicated account instead if the service allows it.",
          },
          {
            check: "Does the list of apps authorized on your account include unknown or abandoned services?",
            then: "Revoke their access in the account's security settings.",
          },
          {
            check: "Have messages or posts gone out in your name?",
            then: "Revoke the authorization, change the password and check your email forwarding rules.",
          },
        ],
        prevention: [
          "Read the consent screen before clicking Allow.",
          "Once a year, review the apps authorized on your main accounts.",
          "Grant only what the service's function justifies.",
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
    code: "DATA-000007",
    slug: "tracage-publicitaire-abusif",
    noSimulationReason:
      "La décision porte sur un bandeau de consentement, présent sur des sites réels. Reconstituer une interface de consentement reviendrait à noter un choix légitime comme une erreur.",
    name: "Traçage publicitaire abusif",
    categorySlug: "donnees-et-identite-numerique",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Le suivi de votre activité d'un site à l'autre pour cibler la publicité. Ce n'est pas une attaque et c'est en grande partie légal ; le sujet est ce que vous avez réellement accepté.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "traceurs",
      "cookies publicitaires",
      "pistage en ligne",
      "ciblage publicitaire",
      "trackers",
    ],
    primaryVector: "web",
    primaryDimension: "url_verification",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Le traçage publicitaire est le suivi de l'activité d'une personne à travers les sites et les applications afin de constituer un profil servant au ciblage. Cette fiche figure ici non pas comme une attaque — l'essentiel de la pratique est licite lorsque le consentement est correctement recueilli — mais parce qu'elle produit la matière que d'autres pages de ce site décrivent, et parce que le consentement demandé est souvent obtenu par une interface conçue pour cela.",
    howItWorks:
      "Un site affiche rarement seulement son propre contenu : il charge des composants fournis par des tiers — mesure d'audience, régie publicitaire, bouton de partage, police de caractères. Chacun voit passer votre visite et peut y associer un identifiant, ce qui permet de vous reconnaître d'un site à l'autre et de reconstituer un parcours. À cela s'ajoutent des techniques qui n'ont pas besoin de déposer quoi que ce soit, en reconnaissant la combinaison de caractéristiques de votre navigateur. Le point qui relève de ce site est le consentement : le droit européen exige qu'il soit libre et éclairé, et l'écran qui le recueille est fréquemment conçu pour rendre l'acceptation immédiate et le refus laborieux — bouton unique mis en avant, refus derrière plusieurs niveaux de réglages, cases pré-cochées. Ce déséquilibre est identifié comme tel par les autorités de protection des données, et il explique pourquoi tant de gens ont « accepté » sans l'avoir voulu.",
    warningSigns: [
      "Bandeau de consentement où « Tout accepter » est un bouton et le refus un lien discret",
      "Refus qui exige de parcourir plusieurs écrans de réglages, ou cases déjà cochées",
      "Publicités qui reprennent un produit consulté ailleurs, ou une conversation récente",
      "Site inaccessible sans acceptation, sans alternative proposée",
      "Application demandant un identifiant publicitaire ou l'accès à votre position sans rapport avec sa fonction",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Ouvrez les réglages détaillés du bandeau plutôt que de valider : le nombre de partenaires listés et les finalités déclarées y sont visibles, et ils dépassent souvent largement ce que le site laisse supposer. Regardez dans les réglages de votre téléphone quelles applications disposent de l'identifiant publicitaire et de la position.",
    whatToDo:
      "Refusez ce qui n'est pas nécessaire au fonctionnement, le refus étant un droit et non une faveur. Utilisez un navigateur qui limite les traceurs tiers par défaut. Sur téléphone, désactivez l'identifiant publicitaire et retirez la position aux applications qui n'en ont pas l'usage. Ces réglages valent pour l'avenir et n'effacent pas les profils déjà constitués.",
    whatToDoIfVictim:
      "Vous pouvez demander à un acteur l'accès aux données vous concernant, leur effacement, et vous opposer au traitement ; la CNIL est l'autorité compétente en France, y compris lorsque le bandeau de consentement ne permet pas un refus aussi simple que l'acceptation. Signaler un bandeau non conforme est utile au-delà de votre cas : c'est ce type de signalement qui fait évoluer la pratique.",
    whyItWorks:
      "Le bandeau de consentement rend l'acceptation immédiate et le refus laborieux : on clique sur le gros bouton pour lire la page. Le suivi est invisible ensuite, jusqu'à la publicité qui en sait trop.",
    example: {
      setting: "Bandeau affiché à l'ouverture d'un site d'actualité.",
      message:
        "Nous et nos 847 partenaires utilisons des cookies pour personnaliser votre expérience.\n[TOUT ACCEPTER]\nPersonnaliser mes choix (lien discret)",
      giveaways: [
        "Accepter est un bouton, refuser un lien.",
        "Le nombre de partenaires dépasse largement ce que le site laisse supposer.",
        "Le refus demande plusieurs écrans.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le bandeau met-il en avant Tout accepter et cache-t-il le refus ?",
        then: "Ouvrez les réglages et refusez ce qui n'est pas nécessaire.",
      },
      {
        check: "Des applications ont-elles accès à l'identifiant publicitaire ou à la position sans en avoir l'usage ?",
        then: "Retirez ces accès dans les réglages du téléphone.",
      },
      {
        check: "Un bandeau ne permet-il pas de refuser aussi facilement qu'accepter ?",
        then: "Vous pouvez le signaler à la CNIL.",
      },
    ],
    prevention: [
      "Utilisez un navigateur qui limite les traceurs tiers par défaut.",
      "Désactivez l'identifiant publicitaire du téléphone.",
      "Refusez par défaut : le refus est un droit, pas une faveur.",
    ],
    relatedAttackCodes: [
      "DATA-000008",
      "DATA-000004",
      "WEB-000004",
      "WEB-000006",
      "MOB-000007",
    ],
    faq: [
      {
        question: "Est-ce illégal ?",
        answer:
          "Le traçage avec un consentement libre et éclairé ne l'est pas. Ce qui pose problème est la manière dont ce consentement est obtenu quand l'interface rend le refus nettement plus coûteux que l'acceptation, ce que les autorités de protection des données considèrent comme un consentement mal recueilli.",
      },
      {
        question: "Mon téléphone m'écoute-t-il ?",
        answer:
          "L'explication la plus simple est généralement suffisante, et elle est déjà troublante : ce qui est connu de vous — recherches, position, achats, entourage, sites visités — permet des recoupements dont la précision surprend sans qu'aucune écoute soit nécessaire. Vérifiez tout de même quelles applications disposent du micro, un accès qu'aucune fonction ne justifie devant être retiré.",
      },
      {
        question: "Refuser change-t-il vraiment quelque chose ?",
        answer:
          "Pour l'avenir, oui : moins de traceurs déposés, donc moins de matière ajoutée à votre profil. Sur ce qui a déjà été collecté, le refus n'a pas d'effet rétroactif — c'est la demande d'effacement qui s'y applique.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "abusive-ad-tracking",
        name: "Abusive ad tracking",
        plainLanguageDefinition:
          "Tracking your activity from site to site to target ads. This isn't an attack and is mostly legal; the issue is what you actually agreed to.",
        definition:
          "Ad tracking is the tracking of a person's activity across sites and apps in order to build a profile used for targeting. This fiche appears here not as an attack — most of the practice is lawful when consent is properly obtained — but because it produces the raw material other pages on this site describe, and because the consent requested is often obtained through an interface designed for that purpose.",
        howItWorks:
          "A site rarely displays only its own content: it loads components supplied by third parties — audience measurement, ad networks, share buttons, fonts. Each one sees your visit and can attach an identifier to it, which makes it possible to recognize you from one site to the next and reconstruct a journey. On top of that, some techniques need not store anything at all, recognizing the combination of characteristics of your browser instead. The point that falls within this site's scope is consent: European law requires it to be free and informed, and the screen that collects it is frequently designed to make accepting instant and refusing laborious — a single prominent button, refusal hidden behind several layers of settings, pre-checked boxes. This imbalance is recognized as such by data-protection authorities, and it explains why so many people have \"accepted\" without meaning to.",
        warningSigns: [
          "Consent banner where \"Accept all\" is a button and refusal a discreet link",
          "Refusal that requires going through several settings screens, or boxes already checked",
          "Ads that reuse a product viewed elsewhere, or a recent conversation",
          "A site inaccessible without accepting, with no alternative offered",
          "An app requesting an advertising identifier or location access unrelated to its function",
        ],
        howToVerify:
          "Open the banner's detailed settings instead of approving it outright: the number of partners listed and the stated purposes are visible there, and they often go well beyond what the site suggests. Check your phone's settings for which apps have access to the advertising identifier and to location.",
        whatToDo:
          "Refuse whatever isn't necessary for the site to work, refusal being a right and not a favor. Use a browser that limits third-party trackers by default. On your phone, turn off the advertising identifier and remove location access from apps that have no use for it. These settings apply going forward and don't erase profiles already built.",
        whatToDoIfVictim:
          "You can ask an operator for access to data about you, its erasure, and object to its processing; the CNIL is the competent authority in France, including when a consent banner doesn't make refusing as easy as accepting. Reporting a non-compliant banner is useful beyond your own case: that kind of report is what drives the practice to change.",
        faq: [
          {
            question: "Is it illegal?",
            answer:
              "Tracking with free and informed consent isn't. What's problematic is how that consent is obtained when the interface makes refusing noticeably more costly than accepting, which data-protection authorities consider improperly obtained consent.",
          },
          {
            question: "Is my phone listening to me?",
            answer:
              "The simplest explanation is usually sufficient, and it's already unsettling: what's already known about you — searches, location, purchases, contacts, sites visited — allows cross-references precise enough to surprise, without any listening being necessary. Still, check which apps have microphone access, since no function justifies it and it should be removed.",
          },
          {
            question: "Does refusing really change anything?",
            answer:
              "Going forward, yes: fewer trackers set, so less material added to your profile. On what's already been collected, refusal has no retroactive effect — that's what an erasure request is for.",
          },
        ],
        whyItWorks:
          "The consent banner makes accepting instant and refusing tedious: you click the big button to read the page. The tracking is invisible afterward, until the ad that knows too much.",
        example: {
          setting: "Banner shown when opening a news site.",
          message:
            "We and our 847 partners use cookies to personalize your experience.\n[ACCEPT ALL]\nCustomize my choices (understated link)",
          giveaways: [
            "Accepting is a button, refusing is a link.",
            "The number of partners far exceeds what the site suggests.",
            "Refusing takes several screens.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the banner push Accept all and hide the refusal?",
            then: "Open the settings and refuse what isn't necessary.",
          },
          {
            check: "Do apps have access to the advertising ID or your location without using it?",
            then: "Remove that access in your phone's settings.",
          },
          {
            check: "Does a banner make refusing harder than accepting?",
            then: "You can report it to the data protection authority (the CNIL in France).",
          },
        ],
        prevention: [
          "Use a browser that limits third-party trackers by default.",
          "Turn off your phone's advertising ID.",
          "Refuse by default: refusing is a right, not a favor.",
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
    code: "DATA-000008",
    slug: "revente-de-donnees-personnelles",
    noSimulationReason:
      "Le préjudice se constate longtemps après une case acceptée dans un formulaire ordinaire. Il n'y a pas de signal à reconnaître au moment où la décision se prend.",
    name: "Revente de données personnelles",
    categorySlug: "donnees-et-identite-numerique",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Pourquoi vous êtes démarché après un achat anodin : vos coordonnées ont été cédées, souvent au titre d'une case acceptée sans être lue.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "vente de fichiers clients",
      "courtage de données",
      "data brokers",
      "cession de données",
      "démarchage",
    ],
    primaryVector: "email",
    primaryDimension: "personal_data_exposure_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "La revente de données personnelles est la cession, à titre onéreux ou non, de fichiers de coordonnées et de comportements à des tiers commerciaux. Elle est licite lorsqu'elle repose sur un consentement valablement recueilli et sur une information des personnes ; elle explique une grande partie du démarchage reçu, et la circulation qu'elle crée est ce qui rend possible d'autres procédés décrits sur ce site.",
    howItWorks:
      "Le point de départ est ordinaire : un achat, une inscription, un jeu-concours, une demande de devis, une carte de fidélité. Une mention accepte la transmission à des « partenaires », terme dont l'étendue n'est pas visible au moment de la signature. Les données rejoignent ensuite des acteurs dont c'est le métier, qui les enrichissent par recoupement — un âge, une composition de foyer, un centre d'intérêt déduit — et les revendent par segments. Une même adresse circule ainsi entre des acteurs qui n'ont aucun lien avec l'entreprise d'origine, ce qui explique deux constats fréquents : le démarchage arrive longtemps après, et se retirer chez l'un ne fait rien chez les autres. Ce qui relève de ce site est la suite : une base commerciale ancienne et bien renseignée est aussi ce qui rend crédible un message frauduleux, parce qu'il connaît un achat réel, un numéro de contrat ou une date.",
    warningSigns: [
      "Démarchage sur un sujet lié à un achat récent, par une entreprise sans lien avec le vendeur",
      "Courriels commerciaux d'acteurs auprès desquels vous n'avez jamais rien fait",
      "Appels dont l'interlocuteur connaît votre nom, votre adresse et parfois votre contrat",
      "Adresse électronique dédiée à un seul service qui commence à recevoir autre chose",
      "Case pré-cochée ou mention « partenaires » dans un formulaire que vous venez de signer",
    ],
    triggers: ["trust", "reward"],
    indicators: [],
    howToVerify:
      "Utilisez une adresse électronique différente par service important : quand une adresse dédiée reçoit autre chose, vous savez exactement qui a cédé le fichier. Demandez à un démarcheur l'origine de vos coordonnées — l'information vous est due, et la réponse ou l'embarras qu'elle provoque sont déjà instructifs.",
    whatToDo:
      "Décochez les cases de transmission aux partenaires, ne fournissez que ce qui est nécessaire à la prestation, et refusez auprès de chaque entreprise l'usage commercial de vos coordonnées. Les règles qui encadrent le démarchage téléphonique ne s'imposent qu'aux entreprises qui les respectent : elles n'ont aucun effet sur les appels frauduleux.",
    whatToDoIfVictim:
      "Exercez vos droits auprès de chaque acteur : accès aux données détenues, effacement, opposition à la prospection. La demande d'origine est particulièrement utile, car elle permet de remonter la chaîne de cession. Saisissez la CNIL en l'absence de réponse. Traitez par ailleurs le démarchage bien informé pour ce qu'il rend possible : un interlocuteur qui connaît votre contrat n'est pas légitime pour autant, et cette connaissance est exactement ce qu'exploite un faux conseiller.",
    whyItWorks:
      "La case qui autorise la transmission aux partenaires passe inaperçue au milieu d'un achat ou d'un jeu. Le démarchage arrive des mois plus tard, sans lien apparent avec la case cochée.",
    example: {
      setting: "Formulaire de participation à un jeu-concours dans un centre commercial.",
      message:
        "☑ J'accepte de recevoir des offres de nos partenaires sélectionnés.\n[Valider ma participation]",
      giveaways: [
        "La case est cochée d'avance.",
        "Les partenaires ne sont pas nommés.",
        "Les données demandées dépassent ce que le jeu exige.",
      ],
    },
    decisionChecklist: [
      {
        check: "Un formulaire contient-il une case de transmission aux partenaires ?",
        then: "Décochez-la, et ne remplissez que les champs obligatoires.",
      },
      {
        check: "Un démarcheur connaît-il votre nom, votre adresse ou votre contrat sans que vous l'ayez contacté ?",
        then: "Demandez-lui l'origine de vos coordonnées, et ne lui confirmez rien.",
      },
      {
        check: "Recevez-vous des sollicitations d'entreprises inconnues ?",
        then: "Exercez votre droit d'opposition et d'effacement auprès d'elles, et saisissez la CNIL faute de réponse.",
      },
    ],
    prevention: [
      "Utilisez une adresse email différente pour les services importants.",
      "Refusez, auprès de chaque entreprise, l'usage commercial de vos coordonnées.",
      "Retenez qu'un interlocuteur qui connaît votre contrat n'est pas légitime pour autant.",
    ],
    relatedAttackCodes: [
      "DATA-000007",
      "DATA-000001",
      "DATA-000003",
      "SOCIAL-000001",
      "PAYMENT-000005",
      "SOCIAL-000006",
      "DATA-000004",
      "DATA-000006",
      "DATA-000005",
    ],
    faq: [
      {
        question: "Comment ont-ils eu mon numéro ?",
        answer:
          "Le plus souvent par une cession que vous avez acceptée sans la voir, dans un formulaire ancien. Une adresse dédiée par service est la façon la plus simple de le déterminer à l'avenir : elle désigne la source sans discussion possible.",
      },
      {
        question:
          "Les règles sur le démarchage téléphonique protègent-elles des arnaques ?",
        answer:
          "Non, et c'est important de le savoir : ces règles s'imposent aux entreprises qui respectent la loi. Une personne qui vous appelle pour vous escroquer ne les applique pas. Un démarchage que vous n'avez pas accepté doit donc redoubler votre attention plutôt que la relâcher.",
      },
      {
        question: "Puis-je faire supprimer mes données de tous ces fichiers ?",
        answer:
          "Acteur par acteur, oui, en exerçant votre droit à l'effacement. Il n'existe pas de démarche unique valable pour tous, et c'est ce qui rend la prévention — cases décochées, données minimales, adresse dédiée — plus efficace que la réparation.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "personal-data-resale",
        name: "Resale of personal data",
        plainLanguageDefinition:
          "Why you get contacted after an ordinary purchase: your details were passed on, often under a box you agreed to without reading.",
        definition:
          "Resale of personal data is the transfer, for payment or not, of contact and behavioral files to commercial third parties. It's lawful when it rests on validly obtained consent and on informing the people concerned; it accounts for a large share of the solicitations people receive, and the circulation it creates is what makes other methods described on this site possible.",
        howItWorks:
          "The starting point is ordinary: a purchase, a sign-up, a sweepstakes, a quote request, a loyalty card. A checkbox agrees to sharing with \"partners,\" a term whose scope isn't visible at the moment of signing. The data then joins actors whose business this is, who enrich it through cross-referencing — an age, a household makeup, an inferred interest — and resell it in segments. The same address ends up circulating among actors with no connection to the original company, which explains two frequent observations: solicitation arrives long afterward, and opting out with one doesn't do anything with the others. What falls within this site's scope is what comes next: an old, well-informed commercial database is also what makes a fraudulent message credible, because it knows a real purchase, a contract number, or a date.",
        warningSigns: [
          "Solicitation about a topic tied to a recent purchase, from a company unrelated to the seller",
          "Marketing emails from actors you've never done anything with",
          "Calls where the caller knows your name, address, and sometimes your contract",
          "An email address dedicated to a single service starts receiving other things",
          "A pre-checked box or a \"partners\" clause in a form you just signed",
        ],
        howToVerify:
          "Use a different email address for each important service: when a dedicated address starts receiving other things, you know exactly who passed on the file. Ask a caller where they got your details — you're entitled to that information, and the answer, or the discomfort it causes, is already telling.",
        whatToDo:
          "Uncheck the boxes for sharing with partners, provide only what's necessary for the service, and refuse, with each company, the commercial use of your contact details. The rules governing telemarketing only bind companies that follow them: they have no effect on fraudulent calls.",
        whatToDoIfVictim:
          "Exercise your rights with each actor involved: access to the data held, erasure, objection to marketing. The request for the origin is particularly useful, since it lets you trace the chain of transfers back. Refer the matter to the CNIL if there's no response. Also treat well-informed solicitation for what it enables: a caller who knows your contract isn't legitimate because of that, and that knowledge is exactly what a fake advisor exploits.",
        faq: [
          {
            question: "How did they get my number?",
            answer:
              "Usually through a transfer you agreed to without seeing it, in an old form. A dedicated address per service is the simplest way to pin it down going forward: it identifies the source beyond doubt.",
          },
          {
            question: "Do the rules on telemarketing protect against scams?",
            answer:
              "No, and it's important to know that: these rules bind companies that follow the law. Someone calling to scam you doesn't apply them. A sales call you never agreed to should heighten your attention rather than relax it.",
          },
          {
            question: "Can I get my data removed from all these files?",
            answer:
              "Actor by actor, yes, by exercising your right to erasure. There's no single process that covers all of them, which is why prevention — unchecked boxes, minimal data, a dedicated address — is more effective than after-the-fact repair.",
          },
        ],
        whyItWorks:
          "The box authorizing sharing with partners goes unnoticed in the middle of a purchase or a contest. The sales calls come months later, with no apparent link to the box you ticked.",
        example: {
          setting: "Entry form for a contest in a shopping mall.",
          message:
            "☑ I agree to receive offers from our selected partners.\n[Submit my entry]",
          giveaways: [
            "The box is pre-checked.",
            "The partners aren't named.",
            "The data requested goes beyond what the contest needs.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does a form contain a box for sharing with partners?",
            then: "Uncheck it, and fill in only the required fields.",
          },
          {
            check: "Does a telemarketer know your name, address or contract without your having contacted them?",
            then: "Ask where they got your details, and confirm nothing.",
          },
          {
            check: "Are you receiving solicitations from unknown companies?",
            then: "Exercise your right to object and to erasure with them, and contact the data protection authority (the CNIL in France) if there's no answer.",
          },
        ],
        prevention: [
          "Use a different email address for important services.",
          "Refuse, with each company, the commercial use of your contact details.",
          "Remember that a caller who knows your contract isn't legitimate for that reason.",
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
    code: "DATA-000009",
    slug: "fraude-aux-documents-d-identite",
    simulationSlug: "verification-identite-avant-annonce-vehicule",
    name: "Fraude aux documents d'identité",
    categorySlug: "donnees-et-identite-numerique",
    editorialStatus: "published",
    plainLanguageDefinition:
      "La photo de votre carte d'identité, demandée « pour vérification » par une annonce, un logement ou un employeur qui n'existe pas. C'est la pièce qui manquait pour agir en votre nom.",
    attackerObjective: "identifiants",
    aliases: [
      "vol de pièce d'identité",
      "copie de carte d'identité",
      "faux justificatif",
      "collecte de documents d'identité",
    ],
    primaryVector: "messaging_app",
    primaryDimension: "identity_verification",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "La fraude aux documents d'identité consiste à obtenir la copie d'une pièce officielle — carte d'identité, passeport, permis, justificatif de domicile, relevé d'identité bancaire — sous un prétexte plausible, afin de constituer des dossiers au nom de la personne. C'est l'étape amont du vol d'identité : la pièce transmise est ce qui rend le reste possible.",
    howItWorks:
      "Le prétexte est toujours une situation où la demande paraît normale : une location qui exige un dossier, un employeur qui prépare un contrat, une plateforme qui « vérifie » un vendeur, un service client qui demande une preuve avant remboursement. La demande arrive au moment où elle est attendue, ce qui est tout l'art du procédé — on ne s'étonne pas qu'un bailleur demande une pièce d'identité. Les documents demandés se cumulent ensuite naturellement : pièce d'identité, justificatif de domicile, bulletins de salaire, relevé d'identité bancaire, soit exactement le dossier qu'exige la souscription d'un crédit à distance. Deux propriétés en font un cas grave. Une pièce d'identité ne se change pas comme un mot de passe : une fois diffusée, elle reste exploitable jusqu'à son renouvellement, et le numéro conserve sa valeur pour un dossier sur pièces. Et l'usage arrive bien plus tard, ce qui rompt le lien avec l'envoi et rend le préjudice difficile à rattacher à son origine.",
    warningSigns: [
      "Pièce d'identité demandée avant toute rencontre, visite ou entretien réel",
      "Envoi réclamé par messagerie instantanée, courriel ou formulaire hors du site officiel de l'organisme",
      "Demande cumulative : identité, domicile, salaires, relevé bancaire, dans un même échange",
      "Urgence invoquée — un autre candidat, un délai qui expire, un dossier à boucler ce jour",
      "Interlocuteur qui vous a contacté le premier et dont vous n'avez pas vérifié l'existence",
      "Photo demandée avec la pièce à la main, ou vidéo tenant le document",
    ],
    triggers: ["authority", "urgency", "trust"],
    indicators: [],
    howToVerify:
      "Vérifiez l'organisme avant d'envoyer, jamais après : cherchez-le par vous-même, appelez le numéro figurant sur son site officiel et faites confirmer la demande et la personne. Demandez sur quel fondement la pièce est exigée à ce stade de la démarche — un interlocuteur légitime répond sans difficulté, et l'agacement provoqué par la question est en soi une information.",
    whatToDo:
      "N'envoyez pas de pièce d'identité à un interlocuteur qui vous a contacté le premier, ni avant que la relation soit établie autrement. Quand l'envoi est réellement nécessaire, transmettez une copie portant en travers une mention manuscrite indiquant le destinataire, l'usage et la date, sur le document lui-même sans masquer les informations utiles — cela n'empêche pas la réutilisation mais la rend contestable. Ne masquez pas au point de rendre la pièce inexploitable pour un usage légitime, sous peine de devoir en renvoyer une seconde sans mention.",
    whatToDoIfVictim:
      "Déposez plainte immédiatement, même sans dommage constaté : la plainte date la diffusion et sert de référence si un dossier apparaît plus tard. Signalez les faits sur cybermalveillance.gouv.fr. Surveillez vos relevés bancaires et votre courrier dans les mois qui suivent, l'usage étant souvent différé, et prévenez votre banque. Si un crédit ou un contrat apparaît à votre nom, la fiche vol d'identité décrit la suite de la démarche. Envisagez le renouvellement de la pièce concernée, en sachant que l'ancien numéro conserve une valeur pour un dossier constitué sur pièces.",
    whyItWorks:
      "La demande arrive au moment où elle paraît normale : on ne s'étonne pas qu'un bailleur ou un employeur veuille une pièce d'identité. Refuser semble risquer de perdre le logement ou le poste.",
    example: {
      setting: "Message reçu sur une messagerie après avoir publié l'annonce de vente d'une voiture.",
      message:
        "Bonjour, je suis très intéressé par votre véhicule. Avant de me déplacer, la plateforme me demande de vérifier votre identité : pouvez-vous m'envoyer une photo de votre carte d'identité recto verso, et une photo de vous la tenant à la main ?",
      giveaways: [
        "Un acheteur n'a aucune raison de vérifier l'identité du vendeur avant de voir le véhicule.",
        "La plateforme ne passe pas par un inconnu pour vérifier les vendeurs.",
        "La photo avec la pièce en main sert à ouvrir des comptes à votre nom.",
      ],
    },
    decisionChecklist: [
      {
        check: "Une pièce d'identité vous est-elle demandée par quelqu'un qui vous a contacté le premier ?",
        then: "N'envoyez rien avant d'avoir vérifié l'organisme par vous-même, sur son site officiel.",
      },
      {
        check: "La demande arrive-t-elle avant toute rencontre, visite ou entretien réel ?",
        then: "Refusez et demandez sur quel fondement la pièce est exigée à ce stade.",
      },
      {
        check: "Avez-vous déjà envoyé une pièce d'identité ?",
        then: "Déposez plainte tout de suite, prévenez votre banque et surveillez votre courrier dans les mois qui suivent.",
      },
    ],
    prevention: [
      "N'envoyez une pièce d'identité qu'à un organisme que vous avez vérifié vous-même.",
      "Quand l'envoi est nécessaire, ajoutez en travers la mention du destinataire, de l'usage et de la date.",
      "Refusez les photos de vous tenant la pièce, sauf sur l'application officielle d'un organisme vérifié.",
    ],
    relatedAttackCodes: [
      "DATA-000002",
      "SOCIAL-000011",
      "PAYMENT-000008",
      "PAYMENT-000009",
      "SOCIAL-000009",
      "SOCIAL-000010",
    ],
    faq: [
      {
        question: "Barrer la copie protège-t-il vraiment ?",
        answer:
          "Partiellement, et il vaut mieux le savoir. Une mention manuscrite indiquant le destinataire et la date n'empêche pas techniquement la réutilisation ; elle la rend contestable et décourage l'usage devant un organisme attentif. Ce n'est pas une garantie, c'est une trace.",
      },
      {
        question:
          "J'ai déjà envoyé ma pièce d'identité. Que faire maintenant ?",
        answer:
          "Déposez plainte pour dater les faits, prévenez votre banque et surveillez votre courrier ainsi que vos relevés pendant plusieurs mois — l'usage est rarement immédiat. Vous ne pouvez pas faire disparaître la copie, mais vous pouvez être en mesure de démontrer, plus tard, que vous aviez signalé sa diffusion.",
      },
      {
        question:
          "Un vrai bailleur ou un vrai employeur peut-il demander ces documents ?",
        answer:
          "Oui, à un moment précis de la relation — après une visite, après un entretien, au moment de constituer un dossier. Ce qui distingue la fraude n'est donc pas la nature des pièces mais le moment et le canal : avant toute rencontre, par messagerie instantanée, et dans l'urgence.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "id-document-fraud",
        simulationSlug: "id-check-before-car-sale",
        name: "ID document fraud",
        plainLanguageDefinition:
          "A photo of your ID card, requested \"for verification\" by a listing, a rental, or an employer that doesn't exist. It's the missing piece needed to act in your name.",
        definition:
          "ID document fraud means obtaining a copy of an official document — ID card, passport, driver's license, proof of address, bank statement — under a plausible pretext, in order to build files in the person's name. It's the upstream step of identity theft: the document handed over is what makes the rest possible.",
        howItWorks:
          "The pretext is always a situation where the request seems normal: a rental that requires a file, an employer preparing a contract, a platform \"verifying\" a seller, customer service asking for proof before a refund. The request arrives exactly when it's expected, which is the whole art of the method — no one is surprised that a landlord asks for an ID. The documents requested then naturally pile up: ID, proof of address, pay slips, bank statement — exactly the file a remote loan application requires. Two properties make this a serious case. An ID document can't be changed like a password: once shared, it stays usable until it's renewed, and the number keeps its value for a paper-based file. And the use comes much later, which breaks the link with the original request and makes the harm hard to trace back to its source.",
        warningSigns: [
          "ID requested before any real meeting, viewing, or interview",
          "Sending requested by instant messaging, email, or a form outside the organization's official site",
          "Cumulative request: identity, home address, pay slips, bank statement, in a single exchange",
          "Urgency invoked — another candidate, an expiring deadline, a file to close today",
          "A contact who reached out to you first and whose existence you haven't verified",
          "A photo requested holding the document, or a video holding it",
        ],
        howToVerify:
          "Verify the organization before sending, never after: look it up yourself, call the number on its official site, and have the request and the person confirmed. Ask on what basis the document is required at this stage of the process — a legitimate contact answers without difficulty, and the irritation the question causes is itself informative.",
        whatToDo:
          "Don't send an ID document to someone who contacted you first, or before the relationship is established some other way. When sending one really is necessary, provide a copy marked across it by hand with the recipient, the purpose, and the date, directly on the document without covering up needed information — this doesn't prevent reuse but makes it contestable. Don't cover so much that the document becomes unusable for a legitimate purpose, or you'll have to send a second one without the mark.",
        whatToDoIfVictim:
          "File a police report immediately, even with no harm confirmed yet: the report dates the disclosure and serves as a reference if a file appears later. Report the incident to the relevant authority. Watch your bank statements and mail in the months that follow, since use is often delayed, and notify your bank. If a loan or contract appears in your name, the identity theft fiche covers the next steps. Consider renewing the document involved, knowing the old number keeps some value for a paper-based file.",
        faq: [
          {
            question: "Does crossing out the copy really protect you?",
            answer:
              "Partially, and it's worth knowing that. A handwritten note giving the recipient and the date doesn't technically prevent reuse; it makes it contestable and discourages use in front of an attentive organization. It isn't a guarantee, it's a trace.",
          },
          {
            question: "I've already sent my ID document. What should I do now?",
            answer:
              "File a police report to date the facts, notify your bank, and watch your mail and statements for several months — use is rarely immediate. You can't make the copy disappear, but you can be in a position to show, later, that you reported its disclosure.",
          },
          {
            question: "Can a real landlord or a real employer ask for these documents?",
            answer:
              "Yes, at a specific point in the relationship — after a viewing, after an interview, when putting together a file. What identifies fraud isn't the nature of the documents but the timing and channel: before any meeting, by instant message, and under urgency.",
          },
        ],
        whyItWorks:
          "The request comes at a moment when it seems normal: nobody is surprised that a landlord or an employer wants an ID. Refusing seems to risk losing the apartment or the job.",
        example: {
          setting: "Message received on a messaging app after posting an ad to sell a car.",
          message:
            "Hello, I'm very interested in your car. Before I travel, the platform asks me to verify your identity: could you send me a photo of both sides of your ID card, and a photo of you holding it?",
          giveaways: [
            "A buyer has no reason to verify the seller's identity before seeing the car.",
            "The platform doesn't go through a stranger to verify sellers.",
            "A photo of you holding the ID is used to open accounts in your name.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is an ID requested by someone who contacted you first?",
            then: "Send nothing before verifying the organization yourself, on its official website.",
          },
          {
            check: "Does the request come before any real meeting, viewing or interview?",
            then: "Refuse and ask on what basis the document is required at this stage.",
          },
          {
            check: "Have you already sent an ID?",
            then: "File a police report right away, warn your bank and watch your mail over the following months.",
          },
        ],
        prevention: [
          "Send an ID only to an organization you've verified yourself.",
          "When sending one is necessary, write across it the recipient, the purpose and the date.",
          "Refuse to send photos of yourself holding your ID, except in the official app of a verified organization.",
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

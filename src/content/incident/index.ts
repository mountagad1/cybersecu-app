/**
 * What to do once something went wrong, by what the visitor did or gave
 * away. Single source for the emergency checklist (`/outils/checklist-
 * urgence`, `/en/tools/emergency-checklist`) and the « I clicked »
 * assistant (`/outils/j-ai-clique`, `/en/tools/i-clicked`).
 *
 * RULE: every action restates what the fiches' « Si c'est déjà arrivé »
 * sections and FAQs, or the guides, already publish. No phone number,
 * procedure or deadline is introduced here that they do not state. The
 * help services stay the French ones, placed in context in English.
 */

export type IncidentCode =
  "banque" | "argent" | "appareil" | "mot-de-passe" | "compte" | "clic";

interface IncidentText {
  /** Anchor id on the checklist page, in that language. */
  id: string;
  /** Heading on the checklist: « Vous avez … ». */
  title: string;
  /** First-person choice in the assistant: « J'ai … ». */
  choice: string;
  /** A statement shown before the steps, not something to do. */
  note?: string;
  actions: string[];
}

export interface IncidentSituation {
  code: IncidentCode;
  /** On the checklist page too, or only in the assistant. */
  inChecklist: boolean;
  /** French slug of the detailed guide, if there is one. */
  guideSlug?: string;
  /**
   * A free tool that does one of the steps for the visitor, with the link
   * text in each language. Only where a step asks for it: « changez le mot
   * de passe » is the moment a new random one is needed.
   */
  tool?: { slug: string; label: { fr: string; en: string } };
  fr: IncidentText;
  en: IncidentText;
}

/**
 * In order of urgency: where minutes count first (bank), then what stops
 * further damage (an infected device, a password), then the rest. The
 * assistant shows a visitor's plan in this order.
 */
/** The steps that say « change the password » link to the generator. */
const PASSWORD_TOOL = {
  slug: "generateur-mot-de-passe",
  label: { fr: "Créer un mot de passe neuf avec le générateur", en: "Create a new password with the generator" },
} as const;

export const INCIDENT_SITUATIONS: readonly IncidentSituation[] = [
  {
    code: "banque",
    inChecklist: true,
    guideSlug: "j-ai-donne-mes-coordonnees-bancaires-ou-un-code",
    fr: {
      id: "banque",
      title: "Vous avez donné votre carte bancaire ou un code de validation",
      choice: "J'ai donné ma carte bancaire ou un code reçu par SMS",
      actions: [
        "Raccrochez si l'échange est en cours, puis rappelez votre banque vous-même, au numéro au dos de votre carte.",
        "Faites opposition, même si rien n'a encore été débité.",
        "Ne validez plus aucune notification ni aucun code tant que la banque ne vous l'a pas confirmé.",
      ],
    },
    en: {
      id: "bank",
      title: "You gave out your bank card or a verification code",
      choice: "I gave my bank card or a code I received by text",
      actions: [
        "Hang up if the exchange is still going on, then call your bank yourself, on the number on the back of your card.",
        "Block your card, even if nothing has been charged yet.",
        "Don't approve any further notification or code until the bank has confirmed it.",
      ],
    },
  },
  {
    code: "argent",
    inChecklist: true,
    guideSlug: "que-faire-apres-avoir-paye-une-arnaque",
    fr: {
      id: "argent",
      title: "Vous avez envoyé de l'argent",
      choice: "J'ai payé ou envoyé de l'argent",
      actions: [
        "Appelez votre banque tout de suite, au numéro au dos de votre carte ou depuis l'application officielle.",
        "Pour un virement, demandez le blocage de l'opération et une demande de rappel des fonds ; pour un paiement par carte, la contestation et l'opposition.",
        "Coupez tout contact avec l'escroc, sans rien supprimer de vos échanges.",
      ],
    },
    en: {
      id: "money",
      title: "You sent money",
      choice: "I paid or sent money",
      actions: [
        "Call your bank straight away, on the number on the back of your card or from the official app.",
        "For a transfer, ask for the transaction to be blocked and for a recall of the funds; for a card payment, a dispute and a block on the card.",
        "Cut off all contact with the scammer, without deleting anything from your exchanges.",
      ],
    },
  },
  {
    code: "appareil",
    inChecklist: true,
    guideSlug: "j-ai-laisse-quelqu-un-prendre-la-main-sur-mon-appareil",
    tool: PASSWORD_TOOL,
    fr: {
      id: "appareil",
      title:
        "Vous avez installé un logiciel ou laissé quelqu'un prendre la main sur votre appareil",
      choice:
        "J'ai téléchargé ou installé quelque chose, ou laissé quelqu'un prendre la main sur mon appareil",
      actions: [
        "Déconnectez l'appareil d'internet.",
        "Désinstallez tout outil de prise en main à distance installé à la demande de votre interlocuteur, puis faites analyser l'appareil.",
        "Depuis un autre appareil, fermez les sessions de vos comptes puis changez les mots de passe, en commençant par la messagerie et la banque.",
      ],
    },
    en: {
      id: "device",
      title:
        "You installed software or let someone take control of your device",
      choice:
        "I downloaded or installed something, or let someone take control of my device",
      actions: [
        "Disconnect the device from the internet.",
        "Uninstall any remote-control tool installed at your caller's request, then have the device checked.",
        "From another device, sign out your accounts' sessions, then change the passwords, starting with your email and your bank.",
      ],
    },
  },
  {
    code: "mot-de-passe",
    inChecklist: true,
    guideSlug: "j-ai-saisi-mon-mot-de-passe-sur-un-faux-site",
    tool: PASSWORD_TOOL,
    fr: {
      id: "mot-de-passe",
      title: "Vous avez saisi un mot de passe sur une page",
      choice: "J'ai saisi un mot de passe sur la page",
      actions: [
        "Changez-le depuis le vrai service, ouvert par un favori ou l'application — jamais par le lien reçu.",
        "Fermez toutes les sessions ouvertes sur le compte.",
        "Changez le même mot de passe partout où il servait, en commençant par votre messagerie, et activez la double authentification.",
      ],
    },
    en: {
      id: "password",
      title: "You entered a password on a page",
      choice: "I entered a password on the page",
      actions: [
        "Change it from the real service, opened through a bookmark or the app — never through the link you received.",
        "Sign out every open session on the account.",
        "Change the same password everywhere it was used, starting with your email, and turn on two-factor authentication.",
      ],
    },
  },
  {
    code: "compte",
    inChecklist: true,
    guideSlug: "mon-compte-a-ete-pirate",
    tool: PASSWORD_TOOL,
    fr: {
      id: "compte",
      title:
        "Vous n'avez plus accès à un compte, ou il envoie des messages sans vous",
      choice:
        "Je n'ai plus accès à un compte, ou il envoie des messages sans moi",
      actions: [
        "Lancez la procédure de récupération du service sans attendre, depuis un appareil sain.",
        "Fermez les sessions, changez le mot de passe, puis rétablissez l'adresse et le numéro de récupération.",
        "Prévenez vos contacts par un autre canal : ils reçoivent peut-être des demandes en votre nom.",
      ],
    },
    en: {
      id: "account",
      title:
        "You can no longer access an account, or it sends messages without you",
      choice:
        "I can no longer access an account, or it sends messages without me",
      actions: [
        "Start the service's recovery procedure without waiting, from a clean device.",
        "Sign out sessions, change the password, then restore the recovery email address and number.",
        "Warn your contacts through another channel: they may be receiving requests in your name.",
      ],
    },
  },
  {
    // From the phishing fiche's FAQ (« J'ai cliqué sur le lien mais rien
    // saisi, que faire ? »). Assistant only: the checklist is for when
    // something was given away.
    code: "clic",
    inChecklist: false,
    fr: {
      id: "clic",
      title: "Vous avez seulement cliqué, sans rien saisir ni télécharger",
      choice:
        "J'ai seulement cliqué ou ouvert la page, sans rien saisir ni télécharger",
      note: "Le risque principal reste limité si aucune information n'a été saisie et aucun fichier téléchargé.",
      actions: [
        "Par précaution, vérifiez l'activité récente du compte concerné et changez son mot de passe, depuis le vrai service ouvert par vous-même.",
      ],
    },
    en: {
      id: "click",
      title: "You only clicked, without entering or downloading anything",
      choice:
        "I only clicked or opened the page, without entering or downloading anything",
      note: "The main risk stays limited if no information was entered and no file was downloaded.",
      actions: [
        "As a precaution, check the account's recent activity and change its password, from the real service opened by yourself.",
      ],
    },
  },
];

/** « Dans tous les cas, ensuite » — after the situation-specific steps. */
export const INCIDENT_ALWAYS = {
  fr: [
    "Conservez les traces : messages, numéros, adresses, captures d'écran, références de paiement, heure des appels.",
    "Déposez plainte : elle sert aussi de base aux démarches auprès de votre banque.",
    "Signalez les faits sur cybermalveillance.gouv.fr. Un SMS frauduleux peut aussi être transféré au 33700.",
    "Ne payez rien à quelqu'un qui propose ensuite de vous aider à récupérer votre argent.",
  ],
  en: [
    "Keep the evidence: messages, numbers, addresses, screenshots, payment references, times of calls.",
    "File a police report: it is also the basis for your dealings with your bank.",
    "Report what happened to Cybermalveillance.gouv.fr (in France). A fraudulent text message can also be forwarded to 33700 (France's spam-text reporting number).",
    "Don't pay anything to someone who then offers to help you get your money back.",
  ],
} as const;

/** Situations shown on the emergency checklist, in its order. */
export function checklistSituations(): IncidentSituation[] {
  // The checklist keeps its published order: money first, as readers
  // arriving there have usually paid.
  const order: IncidentCode[] = [
    "argent",
    "banque",
    "mot-de-passe",
    "compte",
    "appareil",
  ];
  return order.map((code) => INCIDENT_SITUATIONS.find((s) => s.code === code)!);
}

/** Codes a shared assistant URL may carry; anything else is dropped. */
export function decodeIncidentCodes(param: string | null): IncidentCode[] {
  if (!param) return [];
  const known = new Set<string>(INCIDENT_SITUATIONS.map((s) => s.code));
  const wanted = new Set(
    param
      .split(",")
      .map((c) => c.trim())
      .filter((c) => known.has(c)),
  );
  return planCodes([...wanted] as IncidentCode[]);
}

/**
 * The situations of a plan, in urgency order. « Only clicked » means
 * nothing else happened, so it is dropped as soon as anything else is
 * ticked — its reassurance would contradict the rest of the plan.
 */
export function planCodes(selected: readonly IncidentCode[]): IncidentCode[] {
  const ordered = INCIDENT_SITUATIONS.map((s) => s.code).filter((c) =>
    selected.includes(c),
  );
  return ordered.length > 1 ? ordered.filter((c) => c !== "clic") : ordered;
}

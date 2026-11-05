import type { Locale } from "./locale";

/**
 * Shared UI strings for the pieces of the interface that are not authored
 * content (nav, footer, scenario player, paywall, etc.) — the English
 * pilot's copy of everything a French visitor already sees around the
 * content itself (docs/decisions/0009-i18n-pilot.md §1). Every component
 * that reads from here takes a `locale?: Locale` prop defaulting to
 * `"fr"`, so existing French call sites are untouched.
 */
export interface UiStrings {
  nav: {
    skipToContent: string;
    navLabel: string;
    attacks: string;
    guides: string;
    tools: string;
    simulations: string;
    aboutNavLabel: string;
    about: string;
    methodology: string;
    sources: string;
    tagline: string;
    legalNavLabel: string;
    restore: string;
    privacy: string;
    terms: string;
  };
  breadcrumbs: {
    ariaLabel: string;
    home: string;
  };
  difficulty: Record<1 | 2 | 3 | 4 | 5, string>;
  quota: {
    used: (used: number, limit: number) => string;
  };
  paywall: {
    title: string;
    description: string;
    included: string[];
    priceNote: string;
    consentPrefix: string;
    consentSuffix: string;
    learnMore: string;
    unlockCta: string;
    redirecting: string;
    errorPrefix: string;
    errorSuffix: string;
    restoreCta: string;
    alreadyPurchased: string;
    /** Shown instead of the offer while sales are suspended (src/lib/sales.ts). */
    closedTitle: string;
    closedDescription: string;
  };
  scenarioFrame: {
    newMessage: string;
  };
  pwa: {
    installLabel: string;
    installCta: string;
    close: string;
  };
  player: {
    whatDoYouDo: string;
    quotaExhaustedPrompt: string;
    retry: string;
    serviceUnavailable: string;
    genericError: string;
    goodReflex: string;
    dangerousChoice: string;
    noExplanation: string;
    encouragement: string;
    restartSimulation: string;
    nextSimulation: string;
    orTry: string;
    allSimulations: string;
    score: (correct: number, total: number) => string;
    illustratesPrefix: string;
    illustratesSuffix: string;
    /** After a wrong answer: back to the fiche's warning signs. */
    reviewSignalsMissed: string;
    /** After a right answer: the same link, framed as a recap. */
    reviewSignalsRecap: string;
    shareExercise: string;
    shareCopied: string;
  };
  explanation: {
    techniqueUsed: string;
    indicator: string;
    whyImportant: string;
    reflex: string;
    noExplanationAvailable: string;
  };
  streak: {
    inARow: (n: number) => string;
    milestones: Record<number, string>;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    tryCta: string;
    discoverCta: string;
    quotaNote: string;
    /** `quotaNote` while sales are suspended: no price for something that can't be bought. */
    quotaNoteSalesClosed: string;
    /** The hero's "unmask the trap" scene: one fictional SMS, then its giveaways. */
    reveal: {
      eyebrow: string;
      trust: { noAccount: string; fictional: string; sources: string };
      sceneLabel: string;
      stateSeen: string;
      stateHidden: string;
      seenCaption: string;
      toggleReveal: string;
      toggleBack: string;
      hint: string;
      /** Mobile-only cue under the CTAs, pointing down to the scene. */
      jumpToDemo: string;
      phone: {
        time: string;
        sender: string;
        received: string;
        /** The SMS body, split so the urgency and the link can be highlighted in place. */
        before: string;
        urgency: string;
        middle: string;
        link: string;
      };
      /** Exactly 3, in order: sender, urgency, link — numbered like the marks on the SMS. */
      giveaways: { title: string; body: string }[];
      reflex: string;
      announce: string;
    };
    /** `link`: where to go deeper on that step — a contextual link from the homepage. */
    cards: {
      title: string;
      headline: string;
      paragraphs: string[];
      takeaway?: string;
      link?: { href: string; label: string };
    }[];
  };
  simulationsIndex: {
    title: string;
    description: string;
    channels: Record<string, string>;
  };
  reflexMountain: {
    heading: string;
    subheading: string;
    roadmapAriaLabel: string;
    /** Exactly 5 stages, bottom to top: Apprendre/Observer/Vérifier/Décider/Se protéger. */
    stages: string[];
    summitLabel: string;
    scenario: {
      channelLabel: string;
      sender: string;
      message: string;
      link: string;
      prompt: string;
      choices: { id: string; label: string; correct: boolean; feedbackTitle: string; feedbackBody: string }[];
      retryCta: string;
      ctaHeading: string;
      ctaBody: string;
      ctaLabel: string;
    };
  };
}

const fr: UiStrings = {
  nav: {
    skipToContent: "Aller au contenu",
    navLabel: "Navigation principale",
    attacks: "Attaques",
    guides: "Guides",
    tools: "Outils",
    simulations: "Simulations",
    aboutNavLabel: "À propos du site",
    about: "À propos",
    methodology: "Méthodologie",
    sources: "Sources et références",
    tagline: "cybersecu.app — Développez vos réflexes. Évitez les pièges. Restez en sécurité.",
    legalNavLabel: "Liens légaux",
    restore: "Restaurer mon accès",
    privacy: "Confidentialité",
    terms: "Conditions d'utilisation",
  },
  breadcrumbs: {
    ariaLabel: "Fil d'Ariane",
    home: "Accueil",
  },
  difficulty: {
    1: "Très facile",
    2: "Facile",
    3: "Intermédiaire",
    4: "Difficile",
    5: "Expert",
  },
  quota: {
    used: (used, limit) => `${used} / ${limit} simulations gratuites utilisées`,
  },
  paywall: {
    title: "Débloquer toutes les simulations",
    description:
      "Vous avez utilisé vos 10 simulations gratuites. Continuez votre entraînement avec un accès complet.",
    included: [
      "Toutes les simulations actuelles",
      "Toutes les simulations à venir",
      "Tous les niveaux de difficulté",
    ],
    priceNote: "Paiement unique. Aucun abonnement.",
    consentPrefix:
      "J'accepte que l'accès soit débloqué immédiatement après le paiement, et je renonce à mon droit de rétractation de 14 jours pour ce contenu numérique (",
    consentSuffix: ").",
    learnMore: "en savoir plus",
    unlockCta: "Débloquer toutes les simulations",
    redirecting: "Redirection…",
    errorPrefix: "Une erreur est survenue. Veuillez réessayer, ou ",
    errorSuffix: ".",
    restoreCta: "restaurer un accès déjà acheté",
    alreadyPurchased: "Déjà acheté un accès sur un autre appareil ? Restaurer mon accès",
    closedTitle: "L'accès complet arrive bientôt",
    closedDescription:
      "Vous avez utilisé vos 10 simulations gratuites. L'accès à toutes les simulations n'est pas encore en vente : revenez bientôt. En attendant, les fiches, les guides et les outils restent gratuits.",
  },
  scenarioFrame: {
    newMessage: "Nouveau message",
  },
  pwa: {
    installLabel: "Installer l'application",
    installCta: "Installer",
    close: "Fermer",
  },
  player: {
    whatDoYouDo: "Que faites-vous ?",
    quotaExhaustedPrompt: "Vous avez utilisé vos simulations gratuites.",
    retry: "🔄 Réessayer",
    serviceUnavailable:
      "Les simulations sont momentanément indisponibles. Ce n'est pas une erreur de votre part — réessayez plus tard.",
    genericError: "Une erreur est survenue. Veuillez réessayer.",
    goodReflex: "Bon réflexe ! 🎉",
    dangerousChoice: "Ce choix aurait pu être dangereux ⚠️",
    noExplanation: "L'explication détaillée de ce choix n'est pas disponible pour cette simulation.",
    encouragement:
      "💪 Personne ne repère tout du premier coup, et c'est exactement pour ça que cette simulation existe. Relisez le réflexe ci-dessus, puis lancez une nouvelle tentative — l'essentiel est d'y revenir.",
    restartSimulation: "🔁 Recommencer cette simulation",
    nextSimulation: "Simulation suivante : ",
    orTry: "Ou essayer : ",
    allSimulations: "Toutes les simulations",
    score: (correct, total) =>
      `🎯 ${correct} / ${total} bonne${correct !== 1 ? "s" : ""} réponse${correct !== 1 ? "s" : ""} cette session.`,
    illustratesPrefix: "Cette simulation illustre ",
    illustratesSuffix: ". La fiche explique le mécanisme complet, les signaux d'alerte et la marche à suivre.",
    reviewSignalsMissed: "Voir les signaux qui auraient dû vous alerter",
    reviewSignalsRecap: "Revoir les signaux de cette arnaque, pour la reconnaître ailleurs",
    shareExercise: "Envoyer cet exercice à un proche",
    shareCopied: "Lien copié : il mène à l'exercice, pas à votre réponse.",
  },
  explanation: {
    techniqueUsed: "Technique utilisée",
    indicator: "Indice à repérer",
    whyImportant: "Pourquoi c'est important",
    reflex: "Le bon réflexe",
    noExplanationAvailable: "L'explication détaillée de ce choix n'est pas disponible pour cette simulation.",
  },
  streak: {
    inARow: (n) => `🔥 ${n} en série`,
    milestones: {
      3: "🔥 3 d'affilée ! Le réflexe commence à s'installer.",
      5: "🚀 5 d'affilée, imparable.",
      10: "🏆 10 d'affilée ! Ce réflexe est en train de devenir automatique.",
      15: "💎 15 d'affilée, du très solide.",
      20: "⚡ 20 d'affilée. Peu de monde va aussi loin.",
      30: "🌟 30 d'affilée — exceptionnel.",
      50: "👑 50 d'affilée. Un réflexe acquis, pour de bon.",
    },
  },
  home: {
    heroTitle:
      "Voici exactement le type de SMS, email, appel ou site que vous pourriez recevoir demain.",
    heroSubtitle:
      "Saurez-vous repérer le piège ? Entraînez-vous avec des simulations réalistes d'arnaques et développez vos réflexes face aux cyberattaques. Sans compte, sans engagement.",
    tryCta: "Tester une simulation",
    discoverCta: "Découvrir les attaques",
    quotaNote:
      "10 simulations gratuites, sans inscription. Puis 29 € en paiement unique pour tout débloquer — aucun abonnement.",
    quotaNoteSalesClosed: "10 simulations gratuites, sans inscription ni carte bancaire.",
    reveal: {
      eyebrow: "Simulations d'arnaques réalistes",
      trust: { noAccount: "Sans compte", fictional: "Exemples entièrement fictifs", sources: "Sources officielles" },
      sceneLabel: "Exemple fictif : un faux SMS bancaire, puis ses signaux d'alerte",
      stateSeen: "Ce que vous voyez",
      stateHidden: "Ce qui se cache",
      seenCaption: "Un SMS de votre banque, en apparence ordinaire. Avant de lire la suite : qu'est-ce qui cloche ?",
      toggleReveal: "Démasquer le piège",
      toggleBack: "Revoir le message",
      hint: "3 signaux à repérer",
      jumpToDemo: "Essayez de repérer le piège",
      phone: {
        time: "09:41",
        sender: "Banque Fictive",
        received: "Aujourd'hui 09:38",
        before:
          "Votre carte a été temporairement bloquée suite à une activité inhabituelle. Confirmez vos informations ",
        urgency: "sous 30 minutes",
        middle: " : ",
        link: "https://banque-fictive-secure.example-not-real.test/confirmer",
      },
      giveaways: [
        {
          title: "L'expéditeur",
          body: "Un nom d'expéditeur peut être usurpé : à lui seul, il ne prouve pas que le message vient de votre banque.",
        },
        {
          title: "L'urgence",
          body: "Trente minutes pour réagir : la pression sert à vous empêcher de vérifier.",
        },
        {
          title: "Le lien",
          body: "Le domaine n'est pas celui de votre banque. Ne saisissez rien sur une page ouverte depuis un SMS.",
        },
      ],
      reflex:
        "Le bon réflexe : vérifier dans l'application officielle de votre banque ou au numéro inscrit au dos de votre carte.",
      announce: "Trois signaux d'alerte révélés : l'expéditeur, l'urgence et le lien.",
    },
    cards: [
      {
        title: "Apprendre",
        headline: "Comprendre les mécanismes avant de tomber dans le piège.",
        paragraphs: [
          "Les cyberattaques ciblent de plus en plus nos réflexes : urgence, confiance, peur, curiosité ou pression financière.",
          "Cybersecu transforme ces mécanismes complexes en explications simples et concrètes. Phishing, faux SMS, appels frauduleux, faux conseillers, QR codes piégés, faux colis… comprenez comment chaque attaque fonctionne, ce que l'attaquant cherche à provoquer et les signaux qui doivent vous alerter.",
        ],
        takeaway: "Vous ne mémorisez pas une liste d'arnaques. Vous comprenez leur logique.",
        link: { href: "/leviers", label: "Les leviers psychologiques que les arnaques exploitent" },
      },
      {
        title: "Détecter",
        headline: "Passer de la théorie au réflexe.",
        paragraphs: [
          "Lire qu'une arnaque existe ne suffit pas. Le vrai test arrive lorsqu'un message semble crédible et qu'il faut décider en quelques secondes.",
          "Avec des simulations réalistes et sans risque, Cybersecu vous place dans ces situations : SMS, email, appel, QR code, site web et autres scénarios du quotidien.",
          "Observez. Analysez. Décidez.",
        ],
        takeaway: "Vous entraînez votre capacité à repérer le danger avant d'agir.",
        link: { href: "/exemples", label: "La galerie d'arnaques : des exemples annotés, par canal" },
      },
      {
        title: "Se protéger",
        headline: "Transformer chaque expérience en un réflexe durable.",
        paragraphs: [
          "Une erreur n'est pas un échec. C'est une occasion de comprendre ce qui vous a trompé.",
          "Après chaque simulation, Cybersecu décompose la situation : la technique utilisée, les signaux que vous pouviez repérer, la décision à prendre et le réflexe à retenir.",
          "L'objectif n'est pas de vous apprendre à avoir peur d'un message.",
          "L'objectif est de vous apprendre à savoir quoi faire lorsque le doute apparaît.",
        ],
        link: { href: "/guides", label: "Les guides : les gestes qui protègent, pas à pas" },
      },
    ],
  },
  simulationsIndex: {
    title: "Simulations",
    description:
      "Chaque simulation reproduit un message que vous pourriez réellement recevoir. Prenez une décision, puis découvrez pourquoi c'était — ou non — un piège. Tous les organismes cités sont fictifs et rien ne vous est jamais demandé.",
    channels: {
      sms: "SMS",
      email: "Email",
      phone: "Téléphone",
      web: "Site web",
      qr_code: "QR code",
      social_media: "Réseau social",
      messaging_app: "Messagerie",
      advertisement: "Publicité",
      file_attachment: "Pièce jointe",
    },
  },
  reflexMountain: {
    heading: "Saurez-vous repérer le piège ?",
    subheading: "Chaque bonne décision vous rapproche du sommet.",
    roadmapAriaLabel: "Les cinq étapes pour développer le bon réflexe",
    stages: ["Apprendre", "Observer", "Vérifier", "Décider", "Se protéger"],
    summitLabel: "Bon réflexe",
    scenario: {
      channelLabel: "SMS reçu",
      sender: "MobilConnect",
      message:
        "Votre abonnement va être suspendu suite à un échec de paiement. Mettez à jour vos informations sous 24h pour éviter la coupure :",
      link: "https://mobilconnect-paiement.example-not-real.test",
      prompt: "Que faites-vous ?",
      choices: [
        {
          id: "link",
          label: "Je clique sur le lien pour mettre à jour mes informations.",
          correct: false,
          feedbackTitle: "Ce choix présente un risque.",
          feedbackBody:
            "Le lien peut mener vers une fausse page conçue pour récupérer vos identifiants et vos données bancaires. Pour vérifier un abonnement, ouvrez vous-même l'application officielle de votre opérateur, sans passer par ce lien.",
        },
        {
          id: "verify",
          label: "Je me connecte directement à l'application officielle de mon opérateur, sans passer par ce lien.",
          correct: true,
          feedbackTitle: "Bon réflexe.",
          feedbackBody:
            "En vous connectant vous-même au site ou à l'application officielle, vous vérifiez l'information sans jamais transmettre vos identifiants à un site frauduleux.",
        },
        {
          id: "call",
          label: "J'appelle le numéro indiqué dans le SMS.",
          correct: false,
          feedbackTitle: "Ce choix présente un risque.",
          feedbackBody:
            "Un numéro donné dans un message suspect peut appartenir à la personne qui l'a envoyé. Utilisez plutôt le numéro officiel figurant sur une facture ou le site de votre opérateur.",
        },
        {
          id: "reply",
          label: "Je réponds au SMS pour poser une question.",
          correct: false,
          feedbackTitle: "Ce choix présente un risque.",
          feedbackBody:
            "Répondre confirme que votre numéro est actif et surveillé, ce qui peut entraîner d'autres tentatives. Le bon réflexe est de vérifier ailleurs, sans interagir avec le message.",
        },
      ],
      retryCta: "Réessayer",
      ctaHeading: "Prêt à continuer ?",
      ctaBody: "Découvrez une autre simulation pour continuer à développer vos réflexes.",
      ctaLabel: "Découvrir une autre simulation",
    },
  },
};

const en: UiStrings = {
  nav: {
    skipToContent: "Skip to content",
    navLabel: "Main navigation",
    attacks: "Attacks",
    guides: "Guides",
    tools: "Tools",
    simulations: "Simulations",
    aboutNavLabel: "About this site",
    about: "About",
    methodology: "Methodology",
    sources: "Sources and references",
    tagline: "cybersecu.app — Build your reflexes. Avoid the traps. Stay safe.",
    legalNavLabel: "Legal links",
    restore: "Restore my access",
    privacy: "Privacy",
    terms: "Terms of use",
  },
  breadcrumbs: {
    ariaLabel: "Breadcrumb",
    home: "Home",
  },
  difficulty: {
    1: "Very easy",
    2: "Easy",
    3: "Intermediate",
    4: "Hard",
    5: "Expert",
  },
  quota: {
    used: (used, limit) => `${used} / ${limit} free simulations used`,
  },
  paywall: {
    title: "Unlock all simulations",
    description: "You've used your 10 free simulations. Keep training with full access.",
    included: ["All current simulations", "All upcoming simulations", "Every difficulty level"],
    priceNote: "One-time payment. No subscription.",
    consentPrefix:
      "I agree that access will be unlocked immediately after payment, and I waive my 14-day withdrawal right for this digital content (",
    consentSuffix: ").",
    learnMore: "learn more",
    unlockCta: "Unlock all simulations",
    redirecting: "Redirecting…",
    errorPrefix: "Something went wrong. Please try again, or ",
    errorSuffix: ".",
    restoreCta: "restore access you already purchased",
    alreadyPurchased: "Already purchased access on another device? Restore my access",
    closedTitle: "Full access is coming soon",
    closedDescription:
      "You've used your 10 free simulations. Access to every simulation isn't on sale yet: check back soon. Meanwhile, the attack pages, guides and tools stay free.",
  },
  scenarioFrame: {
    newMessage: "New message",
  },
  pwa: {
    installLabel: "Install app",
    installCta: "Install",
    close: "Close",
  },
  player: {
    whatDoYouDo: "What do you do?",
    quotaExhaustedPrompt: "You've used your free simulations.",
    retry: "🔄 Retry",
    serviceUnavailable:
      "Simulations are temporarily unavailable. This isn't an error on your part — please try again later.",
    genericError: "Something went wrong. Please try again.",
    goodReflex: "Good reflex! 🎉",
    dangerousChoice: "This choice could have been dangerous ⚠️",
    noExplanation: "The detailed explanation for this choice isn't available for this simulation.",
    encouragement:
      "💪 Nobody spots everything on the first try, and that's exactly why this simulation exists. Re-read the reflex above, then try again — coming back is what matters.",
    restartSimulation: "🔁 Restart this simulation",
    nextSimulation: "Next simulation: ",
    orTry: "Or try: ",
    allSimulations: "All simulations",
    score: (correct, total) => `🎯 ${correct} / ${total} correct answer${correct !== 1 ? "s" : ""} this session.`,
    illustratesPrefix: "This simulation illustrates ",
    illustratesSuffix: ". The article explains the full mechanism, the warning signs and what to do.",
    reviewSignalsMissed: "See the signs that should have warned you",
    reviewSignalsRecap: "Review this scam's warning signs, to recognize it elsewhere",
    shareExercise: "Send this exercise to someone close",
    shareCopied: "Link copied: it leads to the exercise, not to your answer.",
  },
  explanation: {
    techniqueUsed: "Technique used",
    indicator: "What to spot",
    whyImportant: "Why it matters",
    reflex: "The right reflex",
    noExplanationAvailable: "The detailed explanation for this choice isn't available for this simulation.",
  },
  streak: {
    inARow: (n) => `🔥 ${n} in a row`,
    milestones: {
      3: "🔥 3 in a row! The reflex is starting to set in.",
      5: "🚀 5 in a row, unstoppable.",
      10: "🏆 10 in a row! This reflex is becoming automatic.",
      15: "💎 15 in a row, very solid.",
      20: "⚡ 20 in a row. Few people go this far.",
      30: "🌟 30 in a row — exceptional.",
      50: "👑 50 in a row. A reflex earned for good.",
    },
  },
  home: {
    heroTitle: "Here's exactly the kind of text, email, call or site you could receive tomorrow.",
    heroSubtitle:
      "Would you spot the trap? Train with realistic scam simulations and build your reflexes against cyberattacks. No account, no commitment.",
    tryCta: "Try a simulation",
    discoverCta: "Discover the attacks",
    quotaNote: "10 free simulations, no sign-up. Then a one-time payment of €29 to unlock everything — no subscription.",
    quotaNoteSalesClosed: "10 free simulations, no sign-up and no credit card.",
    reveal: {
      eyebrow: "Realistic scam simulations",
      trust: { noAccount: "No account", fictional: "Fully fictional examples", sources: "Official sources" },
      sceneLabel: "Fictional example: a fake bank text, then its warning signs",
      stateSeen: "What you see",
      stateHidden: "What it hides",
      seenCaption: "A text from your bank that looks ordinary. Before reading on: what feels off?",
      toggleReveal: "Unmask the trap",
      toggleBack: "See the message again",
      hint: "3 signs to spot",
      jumpToDemo: "Try to spot the trap",
      phone: {
        time: "09:41",
        sender: "Fictional Bank",
        received: "Today 09:38",
        before: "Your card has been temporarily blocked due to unusual activity. Confirm your information ",
        urgency: "within 30 minutes",
        middle: ": ",
        link: "https://fictional-bank-secure.example-not-real.test/confirm",
      },
      giveaways: [
        {
          title: "The sender",
          body: "A sender name can be spoofed: on its own, it doesn't prove the message comes from your bank.",
        },
        {
          title: "The urgency",
          body: "Thirty minutes to react: the pressure is there to stop you from checking.",
        },
        {
          title: "The link",
          body: "The domain isn't your bank's. Never enter anything on a page opened from a text message.",
        },
      ],
      reflex: "The right reflex: check in your bank's official app or call the number on the back of your card.",
      announce: "Three warning signs revealed: the sender, the urgency and the link.",
    },
    cards: [
      {
        title: "Learn",
        headline: "Understand the mechanisms before falling for the trap.",
        paragraphs: [
          "Cyberattacks increasingly target our reflexes: urgency, trust, fear, curiosity or financial pressure.",
          "Cybersecu turns these complex mechanisms into simple, concrete explanations. Phishing, fake texts, fraudulent calls, fake advisors, booby-trapped QR codes, fake deliveries… understand how each attack works, what the attacker is trying to trigger, and the signals that should alert you.",
        ],
        takeaway: "You're not memorizing a list of scams. You're understanding their logic.",
        link: { href: "/en/levers", label: "The psychological levers scams exploit" },
      },
      {
        title: "Detect",
        headline: "Turning theory into reflex.",
        paragraphs: [
          "Reading that a scam exists isn't enough. The real test comes when a message looks credible and you have only seconds to decide.",
          "With realistic, risk-free simulations, Cybersecu puts you in these situations: SMS, email, phone call, QR code, website and other everyday scenarios.",
          "Observe. Analyze. Decide.",
        ],
        takeaway: "You train your ability to spot the danger before acting.",
        link: { href: "/en/examples", label: "The scam gallery: annotated examples, by channel" },
      },
      {
        title: "Protect yourself",
        headline: "Turning every experience into a lasting reflex.",
        paragraphs: [
          "A mistake isn't a failure. It's a chance to understand what fooled you.",
          "After each simulation, Cybersecu breaks down the situation: the technique used, the signals you could have spotted, the decision to make, and the reflex to remember.",
          "The goal isn't to teach you to fear a message.",
          "The goal is to teach you what to do when doubt appears.",
        ],
        link: { href: "/en/guides", label: "Guides: the gestures that protect, step by step" },
      },
    ],
  },
  simulationsIndex: {
    title: "Simulations",
    description:
      "Each simulation reproduces a message you could really receive. Make a decision, then find out why it was — or wasn't — a trap. Every organization named is fictitious and nothing is ever actually requested of you.",
    channels: {
      sms: "SMS",
      email: "Email",
      phone: "Phone",
      web: "Website",
      qr_code: "QR code",
      social_media: "Social media",
      messaging_app: "Messaging app",
      advertisement: "Advertisement",
      file_attachment: "Attachment",
    },
  },
  reflexMountain: {
    heading: "Can you spot the trap?",
    subheading: "Every good decision takes you one step closer to the top.",
    roadmapAriaLabel: "The five steps to building the right reflex",
    stages: ["Learn", "Observe", "Verify", "Decide", "Protect"],
    summitLabel: "Good reflex",
    scenario: {
      channelLabel: "Text message received",
      sender: "MobilConnect",
      message:
        "Your plan will be suspended due to a failed payment. Update your payment details within 24h to avoid disconnection:",
      link: "https://mobilconnect-payment.example-not-real.test",
      prompt: "What do you do?",
      choices: [
        {
          id: "link",
          label: "I click the link to update my information.",
          correct: false,
          feedbackTitle: "This choice carries a risk.",
          feedbackBody:
            "The link may lead to a fake page designed to collect your login details and banking information. To check on a plan, open your carrier's official app yourself, without using this link.",
        },
        {
          id: "verify",
          label: "I log in directly to my carrier's official app, without using this link.",
          correct: true,
          feedbackTitle: "Good reflex.",
          feedbackBody:
            "By logging in yourself through the official site or app, you can check the information without ever handing your credentials to a fraudulent site.",
        },
        {
          id: "call",
          label: "I call the number given in the text.",
          correct: false,
          feedbackTitle: "This choice carries a risk.",
          feedbackBody:
            "A number given in a suspicious message can belong to the very person who sent it. Use the official number from a bill or your carrier's website instead.",
        },
        {
          id: "reply",
          label: "I reply to the text to ask a question.",
          correct: false,
          feedbackTitle: "This choice carries a risk.",
          feedbackBody:
            "Replying confirms your number is active and being watched, which can lead to further attempts. The right reflex is to verify elsewhere, without interacting with the message.",
        },
      ],
      retryCta: "Try again",
      ctaHeading: "Ready to continue?",
      ctaBody: "Try another simulation to keep building your reflexes.",
      ctaLabel: "Try another simulation",
    },
  },
};

const DICTIONARIES: Record<Locale, UiStrings> = { fr, en };

export function getUiStrings(locale: Locale): UiStrings {
  return DICTIONARIES[locale];
}

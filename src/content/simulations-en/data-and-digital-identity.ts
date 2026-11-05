import type { SimulationEntry } from "@/content/simulations/types";

/**
 * English simulations for the data and digital identity family — see social-engineering.ts
 * for the shared authoring rules (independent content, locale-invariant
 * attackCode, disjoint versionId range). Each mirrors the French scenario
 * for the same attack: same choices, same correct answer, same mistake
 * patterns; fictional names and `.test` domains are rewritten in English.
 */
export const SIMULATIONS_EN_DATA_AND_DIGITAL_IDENTITY: SimulationEntry[] = [
  {
    versionId: "10000000-0000-4000-8000-000000000055",
    scenarioCode: "EN-SCENARIO-000055",
    slug: "mobile-game-sign-in-with-account",
    version: 1,
    attackCode: "DATA-000006",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional mobile game",
    teaser:
      "A small mobile game offers to sign in with an existing account rather than creating a new one.",
    content: {
      sender: "Sign-in screen — mobile game “Daily Puzzle”",
      body: "Sign in with your account to save your progress.\n\nThis app is requesting permission to:\n— Read and send emails on your behalf\n— Access your contact list\n— See your calendar\n\n[ Continue with this account ]",
      ui: "web",
    },
    choices: [
      {
        id: "connect",
        label:
          "I sign in with my main account, it's quicker than a new account",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "connect-secondary",
        label: "I sign in with a secondary account I rarely use, just in case",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "create-account",
        label:
          "I create an account just for the game rather than granting these permissions to my existing account",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["create-account"],
    explanations: {
      connect: {
        technique: "Abuse of “Sign in with” permissions",
        indicator:
          "Permission to send emails and read the calendar for a simple game",
        whyDangerous:
          "A puzzle game has no need to read or send emails on your behalf, or to look at your calendar. These permissions, once granted, stay active regardless of your password and long after you've stopped playing.",
        reflex:
          "The permission should match the function. A game asking for access to your emails goes far beyond what it needs.",
      },
      "connect-secondary": {
        technique: "Abuse of “Sign in with” permissions",
        indicator:
          "Scope of the permission that doesn't change with the account used",
        whyDangerous:
          "Using a secondary account reduces what is exposed but doesn't avoid the problem: that account still grants broad, lasting access to a service that doesn't need it, and you'll have to remember to revoke it later.",
        reflex:
          "Reducing exposure isn't the same as refusing a disproportionate permission.",
      },
      "create-account": {
        technique: "Abuse of “Sign in with” permissions",
        indicator:
          "Simple function, broad and lasting permission offered for convenience",
        whyDangerous:
          "This is the right answer. A dedicated account, unconnected to your main email, limits what can be affected if the service is ever compromised or sold — without any excessive permission ever being granted.",
        reflex:
          "For a service that doesn't need your data, prefer a dedicated account to signing in with an existing one.",
      },
      unsure: {
        technique: "Abuse of “Sign in with” permissions",
        indicator: "Quick sign-in presented as the simplest route",
        whyDangerous:
          "Creating a separate account takes a few more seconds and loses you no feature of the game.",
        reflex:
          "When in doubt, always prefer a dedicated account to granting broad permissions on your main account.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000061",
    scenarioCode: "EN-SCENARIO-000061",
    slug: "id-check-before-car-sale",
    version: 1,
    attackCode: "DATA-000009",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional buyer interested in a car for sale",
    teaser:
      "An interested buyer asks for a photo of your ID “for verification” before any meeting.",
    content: {
      sender: "“Interested buyer” — classified ads platform messaging",
      body: "Hello, I'm very interested in your car. Before we arrange a meeting, the platform requires me to verify sellers' identity for this kind of amount: could you send me a photo of the front and back of your ID card?",
      ui: "web",
    },
    choices: [
      {
        id: "send-id",
        label: "I send the photo, it's a logical request for a large amount",
        mistakePatternCodes: [
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "send-marked",
        label:
          "I send a copy with a handwritten note stating its purpose and the date",
        mistakePatternCodes: [],
      },
      {
        id: "refuse-and-verify",
        label:
          "I refuse and check with the platform myself whether this requirement really exists",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["refuse-and-verify"],
    explanations: {
      "send-id": {
        technique: "Identity document fraud",
        indicator: "ID requested by a private individual, before any meeting",
        whyDangerous:
          "A classified ads platform never asks a buyer to verify a seller's identity this way: it's the pretext, not a real procedure. An ID document handed over like this can later be used to build a file in your name, long after this conversation.",
        reflex:
          "No classified ads platform requires a buyer to verify a seller's identity.",
      },
      "send-marked": {
        technique: "Identity document fraud",
        indicator: "Request presented as a platform requirement, unverified",
        whyDangerous:
          "A handwritten note limits reuse without preventing it, and above all doesn't address the underlying question: this requirement doesn't really exist on the platform, so no version of this document should be sent at this stage.",
        reflex:
          "Marking a document reduces the risk of a legitimate request; it isn't an answer to a request that should never have been made.",
      },
      "refuse-and-verify": {
        technique: "Identity document fraud",
        indicator:
          "Pretext attributed to the platform, never checked at its source",
        whyDangerous:
          "This is the right answer. Checking directly with the platform generally confirms that no such requirement exists, which ends the matter without ever handing over the document.",
        reflex:
          "A requirement attributed to a third party — a platform, an organization — is checked at its source before being followed.",
      },
      unsure: {
        technique: "Identity document fraud",
        indicator: "Large amount, plausible justification",
        whyDangerous:
          "Sending nothing loses you no real sale, which can be completed without this document.",
        reflex:
          "When in doubt, check any requirement attributed to a platform directly with it.",
      },
    },
  },
];

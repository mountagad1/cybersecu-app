import type { SimulationEntry } from "@/content/simulations/types";

/**
 * English simulations for the blackmail and harassment family — see social-engineering.ts
 * for the shared authoring rules (independent content, locale-invariant
 * attackCode, disjoint versionId range). Each mirrors the French scenario
 * for the same attack: same choices, same correct answer, same mistake
 * patterns; fictional names and `.test` domains are rewritten in English.
 */
export const SIMULATIONS_EN_BLACKMAIL_AND_HARASSMENT: SimulationEntry[] = [
  {
    versionId: "10000000-0000-4000-8000-000000000057",
    scenarioCode: "EN-SCENARIO-000057",
    slug: "old-password-blackmail-email",
    version: 1,
    attackCode: "PERS-000002",
    channel: "email",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "None — generic extortion message",
    teaser:
      "An email claims to have taken control of your webcam and quotes an old password as proof.",
    content: {
      sender: "Random email address, different with each sending",
      body: "I installed spyware on your device several months ago. I filmed you without your knowledge. As proof, your password is: [an old password you really did use]\n\nPay within 48 hours or I send the video to all your contacts.",
      ui: "email",
    },
    choices: [
      {
        id: "pay",
        label:
          "I pay: the password quoted really is mine, that proves they're telling the truth",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY"],
      },
      {
        id: "reply-negotiate",
        label: "I reply to ask for more proof before deciding",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "ignore-and-change",
        label:
          "I don't reply, I delete the message and change this password everywhere it was used",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["ignore-and-change"],
    explanations: {
      pay: {
        technique: "Fake hacking blackmail",
        indicator: "Old password quoted as proof, no image attached",
        whyDangerous:
          "The password quoted almost always comes from an old, already widely circulated data breach, not from spyware installed on your device. It's a message sent in bulk, with nothing real behind the threat, and paying only encourages its author.",
        reflex:
          "An exact password doesn't prove a device is being watched; it only proves it leaked once, somewhere.",
      },
      "reply-negotiate": {
        technique: "Fake hacking blackmail",
        indicator: "Random sender address, message sent in bulk",
        whyDangerous:
          "Replying confirms that the address is monitored and can trigger more approaches, including other attempts. There is no real material to ask for proof of: the threat itself is empty.",
        reflex:
          "There's nothing to negotiate with a message that has nothing real behind it.",
      },
      "ignore-and-change": {
        technique: "Fake hacking blackmail",
        indicator:
          "Threat with nothing real behind it, relying only on a password that already leaked",
        whyDangerous:
          "This is the right answer. The only real element in this message is the leaked password; changing it, and everywhere it was reused, deals with the actual problem without ever engaging with the author.",
        reflex:
          "Don't pay, don't reply. Change the password quoted and everywhere it was reused, and turn on two-factor authentication.",
      },
      unsure: {
        technique: "Fake hacking blackmail",
        indicator: "48-hour deadline, threat of sharing",
        whyDangerous:
          "Paying nothing puts you at no extra risk: there is no real material to share.",
        reflex:
          "When in doubt about this kind of message, never pay, and change the password quoted.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000058",
    scenarioCode: "EN-SCENARIO-000058",
    slug: "leaked-data-publication-threat",
    version: 1,
    attackCode: "PERS-000010",
    channel: "email",
    targetProfile: "business",
    difficulty: 4,
    impersonatedEntity:
      "None — author of a threat linked to a real data breach",
    teaser:
      "After a confirmed data breach at a provider, a message threatens to publish the information unless a payment is made.",
    content: {
      sender: "Anonymous email address",
      body: "We hold the data extracted during the breach recently confirmed by your provider. This information will be published or sold within 72 hours if the requested payment is not made to the attached address.",
      ui: "email",
    },
    choices: [
      {
        id: "pay-for-deletion",
        label:
          "I pay to get guaranteed deletion of the data before publication",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY"],
      },
      {
        id: "negotiate-amount",
        label: "I start negotiating the amount to buy time",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "act-on-controllable",
        label:
          "I don't pay, I change the affected passwords and get ready for a wave of phishing",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["act-on-controllable"],
    explanations: {
      "pay-for-deletion": {
        technique: "Data breach extortion",
        indicator: "Promise of deletion in exchange for payment",
        whyDangerous:
          "No deletion can be verified after payment, and data from a breach is frequently held by several different parties: paying one in no way stops the others from still having it.",
        reflex:
          "A promise of deletion in exchange for payment can never be verified; so it should never be believed.",
      },
      "negotiate-amount": {
        technique: "Data breach extortion",
        indicator: "72-hour deadline used to push for a quick decision",
        whyDangerous:
          "Negotiating starts an exchange with the author of the threat and confirms that contact can lead to a payment, which encourages them to carry on rather than stop. The amount isn't the core problem.",
        reflex:
          "Negotiating a demand like this amounts to validating it, whatever amount you get.",
      },
      "act-on-controllable": {
        technique: "Data breach extortion",
        indicator:
          "Real, confirmed breach, but its further spread is beyond anyone's control",
        whyDangerous:
          "This is the right answer. What you can really control is the affected passwords and two-factor authentication; the attack page also warns that this data will first be used to make an upcoming wave of phishing believable.",
        reflex:
          "Don't pay: act on what you still control — passwords, two-factor authentication — and anticipate the phishing that usually follows.",
      },
      unsure: {
        technique: "Data breach extortion",
        indicator:
          "Breach confirmed elsewhere, which makes the threat more believable",
        whyDangerous:
          "Not paying changes nothing about what has already leaked, and neither does paying.",
        reflex:
          "When in doubt, never pay a demand linked to a data breach: act only on what you still control.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000064",
    scenarioCode: "EN-SCENARIO-000064",
    slug: "friend-reports-fake-profile-in-your-name",
    version: 1,
    attackCode: "PERS-000007",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fake profile created in the victim's name",
    teaser:
      "A friend tells you about a second profile in your name, with your photos, that is asking her for money.",
    content: {
      sender: "Message from a friend, on your genuine account",
      body: "Hi, there's another profile in your name, with your photos, that just asked me for money urgently while pretending to be you. Are you really in trouble or is it a fake account?",
      ui: "web",
    },
    choices: [
      {
        id: "wait",
        label: "I wait until I get more reports before doing anything",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "report-only",
        label:
          "I report the fake account to the platform and wait for it to be dealt with",
        mistakePatternCodes: [],
      },
      {
        id: "post-warning",
        label:
          "I immediately post from my genuine account to warn all my contacts, then report the fake account",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["post-warning"],
    explanations: {
      wait: {
        technique: "Social media impersonation",
        indicator:
          "Active fake profile, already asking your contacts for money",
        whyDangerous:
          "The fake profile keeps approaching your contacts while you wait, and each new approach makes what will have to be fixed afterwards worse. A single trusted report is enough to act; there's no need to collect more.",
        reflex:
          "A reliable report from someone close is enough to act on; there's no need to wait for more.",
      },
      "report-only": {
        technique: "Social media impersonation",
        indicator:
          "Approaches to your contacts continuing while the report is being dealt with",
        whyDangerous:
          "Reporting to the platform is necessary but takes time to be processed, during which the fake profile keeps approaching your contacts. A post from your genuine account works immediately, without waiting for that delay.",
        reflex:
          "Reporting to the platform is one step out of two; posting immediately protects your contacts in the meantime.",
      },
      "post-warning": {
        technique: "Social media impersonation",
        indicator:
          "Fake profile actively approaching the victim's circle in their name",
        whyDangerous:
          "This is the right answer. Posting from your genuine account is the fastest and most effective action: by warning your circle directly, it defuses the fake account before it is taken down, even before the platform has dealt with the report that follows.",
        reflex:
          "Warn your contacts with a post from your genuine account first, then report the fake account to the platform.",
      },
      unsure: {
        technique: "Social media impersonation",
        indicator:
          "Report from a single person, a situation that seems limited",
        whyDangerous:
          "Acting right away only costs a post, and an active fake profile doesn't stop on its own.",
        reflex:
          "When in doubt about this report, post a warning from your genuine account without waiting.",
      },
    },
  },
];

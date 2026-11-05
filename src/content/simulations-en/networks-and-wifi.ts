import type { SimulationEntry } from "@/content/simulations/types";

/**
 * English simulations for the networks and Wi-Fi family — see social-engineering.ts
 * for the shared authoring rules (independent content, locale-invariant
 * attackCode, disjoint versionId range). Each mirrors the French scenario
 * for the same attack: same choices, same correct answer, same mistake
 * patterns; fictional names and `.test` domains are rewritten in English.
 */
export const SIMULATIONS_EN_NETWORKS_AND_WIFI: SimulationEntry[] = [
  {
    versionId: "10000000-0000-4000-8000-000000000029",
    scenarioCode: "EN-SCENARIO-000029",
    slug: "airport-wifi-two-networks",
    version: 1,
    attackCode: "NET-000002",
    channel: "web",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "None — Wi-Fi networks shown in a fictional airport",
    teaser: "In an airport, two Wi-Fi networks have almost the same name.",
    content: {
      sender: "Available Wi-Fi networks",
      body: "Networks found:\n\n📶 Fictional-Airport-FREE   (open)\n📶 Fictional-Airport_FREE  (open)\n📶 Fictional-Airport-STAFF (secured)\n📶 Julie's phone           (secured)",
      ui: "web",
    },
    choices: [
      {
        id: "either",
        label:
          "I connect to the first one in the list, they have almost the same name so it doesn't matter",
        mistakePatternCodes: [
          "MISSED_SUSPICIOUS_DOMAIN",
          "TRUSTED_DISPLAY_NAME",
        ],
      },
      {
        id: "strongest",
        label: "I connect to the one with the strongest signal",
        mistakePatternCodes: ["MISSED_SUSPICIOUS_DOMAIN"],
      },
      {
        id: "ask",
        label: "I ask airport staff for the exact name of the official network",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["ask"],
    explanations: {
      either: {
        technique: "Evil twin Wi-Fi access point",
        indicator:
          "Two networks with almost identical names, a hyphen versus an underscore",
        whyDangerous:
          "A network's name is freely chosen by whoever broadcasts it: nothing stops someone from creating a second network one character away from the real one. “They look alike” is exactly the intended effect, not proof that they are the same.",
        reflex:
          "Two almost identical networks are never equivalent. One of the two belongs to someone else.",
      },
      strongest: {
        technique: "Evil twin Wi-Fi access point",
        indicator: "Signal strength used as a sign of trust",
        whyDangerous:
          "Signal strength depends on how close the antenna is, not on whether the network is legitimate. A fake access point placed near you often even shows a stronger signal than the real one further away.",
        reflex:
          "Signal strength tells you nothing about who controls the network.",
      },
      ask: {
        technique: "Evil twin Wi-Fi access point",
        indicator: "No way to decide from the list shown alone",
        whyDangerous:
          "This is the right answer. The venue's staff are the only source that knows the exact name of the network they actually run; it's a check that takes ten seconds.",
        reflex:
          "Faced with two similar networks, ask the staff rather than picking at random.",
      },
      unsure: {
        technique: "Evil twin Wi-Fi access point",
        indicator: "Very similar names, no reliable distinguishing feature",
        whyDangerous: "Not connecting puts you at no risk.",
        reflex:
          "When in doubt, use your mobile data rather than picking at random between two similar networks.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000030",
    scenarioCode: "EN-SCENARIO-000030",
    slug: "hotel-wifi-portal-card",
    version: 1,
    attackCode: "NET-000007",
    channel: "web",
    targetProfile: "senior",
    difficulty: 3,
    impersonatedEntity: "Fictional hotel",
    teaser:
      "The hotel Wi-Fi login page asks for a bank card for a one-euro “deposit”.",
    content: {
      sender: "Login portal — Fictional Hotel Wi-Fi",
      body: "Welcome to the Fictional Hotel!\n\nTo activate your free Wi-Fi access, a €1.00 deposit will be charged and fully refunded when you check out.\n\nCard number: ____\nExpiry date: __/__\nSecurity code: ___\n\n[ Activate my access ]",
      ui: "web",
    },
    choices: [
      {
        id: "pay",
        label: "I enter my card, it's only one euro and it will be refunded",
        mistakePatternCodes: [
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
          "TRUSTED_BRAND_NAME",
        ],
      },
      {
        id: "different-card",
        label: "I enter a low-balance prepaid card, just in case",
        mistakePatternCodes: ["MISSED_UNUSUAL_PAYMENT_REQUEST"],
      },
      {
        id: "reception",
        label:
          "I go down and ask reception whether the Wi-Fi really asks for a bank card",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["reception"],
    explanations: {
      pay: {
        technique: "Malicious captive portal",
        indicator: "Bank card requested for Wi-Fi access advertised as free",
        whyDangerous:
          "Wi-Fi access needs no means of payment to work technically. The small amount and the promised refund are there to make the request acceptable; what is really wanted is a valid card number, reusable for much larger amounts.",
        reflex:
          "A “refunded” euro is no guarantee: what matters is that the card number has been handed over.",
      },
      "different-card": {
        technique: "Malicious captive portal",
        indicator: "Payment requested for a service that doesn't need one",
        whyDangerous:
          "Using a low-balance card reduces the possible loss but doesn't deal with the problem: the number remains valid and usable, and the gesture mostly confirms that the request was accepted without being questioned.",
        reflex:
          "Reducing the amount at risk isn't the same as refusing an abnormal request.",
      },
      reception: {
        technique: "Malicious captive portal",
        indicator:
          "No legitimate Wi-Fi access requires a bank card just to connect",
        whyDangerous:
          "This is the right answer. Reception can confirm in a few seconds whether the hotel really charges for its Wi-Fi — and the answer, in the vast majority of hotels, is no.",
        reflex:
          "Wi-Fi access that asks for a bank card should be checked on site before you enter anything.",
      },
      unsure: {
        technique: "Malicious captive portal",
        indicator: "Professional presentation imitating a real hotel portal",
        whyDangerous:
          "Entering nothing puts you at no risk: you can always use your mobile data.",
        reflex:
          "When in doubt, don't hand over a bank card for Wi-Fi access, and check on site.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000060",
    scenarioCode: "EN-SCENARIO-000060",
    slug: "certificate-warning-usual-site",
    version: 1,
    attackCode: "NET-000004",
    channel: "web",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "None — browser warning on a site you usually visit",
    teaser:
      "When you open a site you usually visit without trouble, the browser shows a security warning.",
    content: {
      sender: "Browser warning",
      body: "Your connection is not private\n\nAttackers might be trying to steal your information from this site. This problem may be caused by a misconfigured server, or by someone impersonating this site.\n\n[ Back to safety ]     [ Advanced ]",
      ui: "web",
    },
    choices: [
      {
        id: "proceed",
        label: "I bypass the warning, this site always works normally",
        mistakePatternCodes: [
          "MISSED_SUSPICIOUS_DOMAIN",
          "TRUSTED_DISPLAY_NAME",
        ],
      },
      {
        id: "retry-later",
        label: "I try again later, it's probably temporary",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "go-back",
        label:
          "I go back without continuing, and try again from another network",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["go-back"],
    explanations: {
      proceed: {
        technique: "DNS poisoning",
        indicator:
          "Certificate warning on a site that usually works without trouble",
        whyDangerous:
          "The fact that the site usually works fine is exactly what makes the warning significant: something has changed, precisely on this connection. Bypassing it means sending your data to a server that couldn't prove its identity.",
        reflex:
          "Never bypass a certificate warning, however used you are to the site in question.",
      },
      "retry-later": {
        technique: "DNS poisoning",
        indicator:
          "Warning that may come from local tampering, not a temporary incident on the site",
        whyDangerous:
          "If the tampering comes from your network or your device rather than the site itself, trying again later from the same place changes nothing: the problem will persist until its cause has been identified.",
        reflex:
          "A certificate warning isn't solved by waiting; it's solved by changing network or identifying the cause.",
      },
      "go-back": {
        technique: "DNS poisoning",
        indicator:
          "Warning specific to this network, on an otherwise reliable site",
        whyDangerous:
          "This is the right answer. Going back avoids sending any data to the unverified server, and testing from another network tells you whether the problem comes from your current connection rather than the site.",
        reflex:
          "Faced with a certificate warning, step back and test from another network rather than forcing your way through.",
      },
      unsure: {
        technique: "DNS poisoning",
        indicator: "Technical message, otherwise familiar site",
        whyDangerous:
          "Going back loses you no legitimate access, which can be reached another way once the cause is identified.",
        reflex: "When in doubt about a certificate warning, never continue.",
      },
    },
  },
];

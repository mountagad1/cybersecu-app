import type { SimulationEntry } from "@/content/simulations/types";

/**
 * English simulations for the phones and connected devices family — see social-engineering.ts
 * for the shared authoring rules (independent content, locale-invariant
 * attackCode, disjoint versionId range). Each mirrors the French scenario
 * for the same attack: same choices, same correct answer, same mistake
 * patterns; fictional names and `.test` domains are rewritten in English.
 */
export const SIMULATIONS_EN_PHONES_AND_CONNECTED_DEVICES: SimulationEntry[] = [
  {
    versionId: "10000000-0000-4000-8000-000000000031",
    scenarioCode: "EN-SCENARIO-000031",
    slug: "flashlight-app-listing",
    version: 1,
    attackCode: "MOB-000001",
    channel: "web",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "Fictional app “Ultra Flashlight”",
    teaser:
      "A free, highly rated flashlight app asks for access to your contacts and your text messages.",
    content: {
      sender: "App store — “Ultra Flashlight” listing",
      body: "Ultra Flashlight — Free\n4.7 ★ (18,200 reviews) — Developer: AppStudio92\n\nPermissions requested:\n— Contacts\n— SMS\n— Location\n— Microphone\n\n[ Install ]",
      ui: "web",
    },
    choices: [
      {
        id: "install",
        label: "I install it: the rating is excellent and the app is free",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check-dev",
        label: "I just look at the number of reviews before installing",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "refuse",
        label:
          "I notice nothing justifies these permissions for a flashlight, and I don't install it",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["refuse"],
    explanations: {
      install: {
        technique: "Malicious app",
        indicator: "Permissions unrelated to the advertised function",
        whyDangerous:
          "A flashlight needs none of these four permissions to turn on the flash: not your contacts, not your text messages, not your location, not your microphone. A good rating measures whether the app turns the light on, not what else it does with that access.",
        reflex:
          "Always compare the permission requested with the advertised function, whatever the rating.",
      },
      "check-dev": {
        technique: "Malicious app",
        indicator:
          "High number of reviews that says nothing about the permissions",
        whyDangerous:
          "A large number of positive reviews is about the visible function — the light turns on — and says nothing about the data collected in the background, which most people who leave a review never look at.",
        reflex: "The number of reviews is not a security check.",
      },
      refuse: {
        technique: "Malicious app",
        indicator:
          "Contacts, SMS, location and microphone requested to turn on a light",
        whyDangerous:
          "This is the right answer. A flashlight has no technical need for these four permissions; asking for them is the clearest sign that the app serves a purpose other than the one advertised.",
        reflex:
          "Turn down an app whose permissions clearly go beyond its function, however popular it is.",
      },
      unsure: {
        technique: "Malicious app",
        indicator: "Simple function, broad permissions",
        whyDangerous:
          "Not installing loses you no feature: a flashlight is already built into most phones.",
        reflex:
          "When in doubt, use your phone's built-in feature rather than a third-party app.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000032",
    scenarioCode: "EN-SCENARIO-000032",
    slug: "display-over-other-apps-permission",
    version: 1,
    attackCode: "MOB-000002",
    channel: "web",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Fictional app “Battery Saver Pro”",
    teaser: "An app asks for permission to display over other apps.",
    content: {
      sender: "System permission request",
      body: "“Battery Saver Pro” wants to display over other apps.\n\nThis permission lets the app appear on top of the apps you're using, including to show optimization alerts.\n\n[ Deny ]     [ Allow ]",
      ui: "web",
    },
    choices: [
      {
        id: "allow",
        label: "I allow it, it seems necessary to show the optimization alerts",
        mistakePatternCodes: [
          "TRUSTED_DISPLAY_NAME",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "allow-once",
        label: "I allow it, but I'll uninstall the app if I notice a problem",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "deny",
        label:
          "I deny it: a battery saver has no need to display over my other apps",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["deny"],
    explanations: {
      allow: {
        technique: "Overlay attack",
        indicator:
          "Permission to display over other apps requested for a function that doesn't justify it",
        whyDangerous:
          "This permission is precisely the one that allows a fake login screen to be drawn on top of a real banking or messaging app: whatever you type next goes to the malicious app, not to the one you think you're using. A battery saver has no technical need to display over anything.",
        reflex:
          "The permission to display over other apps is one of the most sensitive on a phone; it is never granted out of habit.",
      },
      "allow-once": {
        technique: "Overlay attack",
        indicator: "Permission granted on the bet of fixing it later",
        whyDangerous:
          "The problem with a malicious overlay is that it isn't necessarily “noticeable”: an imitation login screen looks like the real one. The moment to decide is when granting the permission, not afterwards when a visible symptom might appear — which may never happen.",
        reflex:
          "Don't count on a visible sign afterwards: the decision is made at the moment of granting the permission.",
      },
      deny: {
        technique: "Overlay attack",
        indicator:
          "Advertised function (battery optimization) unrelated to the permission requested",
        whyDangerous:
          "This is the right answer. Very few legitimate apps really need to display over others; a battery saver isn't one of them.",
        reflex:
          "Deny display over other apps unless there is a clearly justified need, and check the list of apps that have it from time to time.",
      },
      unsure: {
        technique: "Overlay attack",
        indicator: "Unfamiliar technical permission",
        whyDangerous: "Denying it loses a battery saver no essential function.",
        reflex:
          "When in doubt about a sensitive permission, deny it: it can still be changed later if a real need comes up.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000033",
    scenarioCode: "EN-SCENARIO-000033",
    slug: "airport-charging-station",
    version: 1,
    attackCode: "MOB-000003",
    channel: "web",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "None — fictional public charging station",
    teaser:
      "Your battery is almost dead. A public USB charging station is available in the terminal.",
    content: {
      sender: "Phone screen, once the charging station's cable is plugged in",
      body: "Allow this computer to access the device's data?\n\nIf you don't trust this computer, deny access. You can still charge without allowing access to data.\n\n[ Don't allow ]     [ Allow ]",
      ui: "web",
    },
    choices: [
      {
        id: "allow",
        label: "I allow it, I just want it to charge",
        mistakePatternCodes: [
          "RESPONDED_TO_URGENCY",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "unplug",
        label: "I unplug immediately, without answering the question",
        mistakePatternCodes: [],
      },
      {
        id: "deny",
        label: "I deny access to data and let the phone charge",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["deny"],
    explanations: {
      allow: {
        technique: "Juice jacking",
        indicator: "Request for data access appearing for a simple charge",
        whyDangerous:
          "Charging needs no access to the device's data: only electricity has to go through the cable. Allowing access lets the connected equipment read or copy what's on the phone.",
        reflex:
          "Charging never requires allowing access to data. If the question comes up, the answer is no.",
      },
      unplug: {
        technique: "Juice jacking",
        indicator: "Cable of unknown origin on a public station",
        whyDangerous:
          "Unplugging is cautious but not necessary here, and needlessly deprives you of charging: the phone itself offers the right option, denying access to data, which lets you charge normally and safely.",
        reflex:
          "Denying access to data is enough; there's no need to give up charging as a precaution.",
      },
      deny: {
        technique: "Juice jacking",
        indicator:
          "The phone itself offers the option that separates charging from data",
        whyDangerous:
          "This is the right answer. Denying access to data blocks everything this technique is after, while letting the electricity flow normally.",
        reflex:
          "On a public station, always deny any request for data access: charging continues without it.",
      },
      unsure: {
        technique: "Juice jacking",
        indicator: "Technical question asked when you plug in",
        whyDangerous: "Denying access doesn't stop the charging.",
        reflex:
          "When in doubt about this question, always deny: it's the risk-free option and it doesn't prevent charging.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000034",
    scenarioCode: "EN-SCENARIO-000034",
    slug: "unknown-bluetooth-pairing-request",
    version: 1,
    attackCode: "MOB-000004",
    channel: "web",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "None — unknown Bluetooth device",
    teaser:
      "A Bluetooth pairing request pops up while you're in a public place.",
    content: {
      sender: "Bluetooth notification",
      body: "Pairing request\n\nA device “Audio-Headset-27F3” wants to pair with your phone.\n\nCode: 4471\n\n[ Decline ]     [ Pair ]",
      ui: "web",
    },
    choices: [
      {
        id: "pair",
        label: "I pair, it's probably just a headset nearby",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "ignore-notification",
        label:
          "I ignore the notification without touching it, it will go away eventually",
        mistakePatternCodes: [],
      },
      {
        id: "refuse",
        label: "I decline: I didn't start any pairing myself",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["refuse"],
    explanations: {
      pair: {
        technique: "Bluetooth attack",
        indicator: "Unrequested pairing request, generic device name",
        whyDangerous:
          "A Bluetooth device's name is freely chosen by whoever broadcasts it: “Audio-Headset-27F3” doesn't prove it's a headset. A granted pairing can allow access to files or notifications, depending on the permissions it obtains afterwards.",
        reflex:
          "A pairing request you didn't start yourself has no reason to be accepted.",
      },
      "ignore-notification": {
        technique: "Bluetooth attack",
        indicator: "Notification left without an explicit answer",
        whyDangerous:
          "Leaving a notification unanswered isn't dangerous in itself, but it isn't the best answer either: declining it explicitly prevents any new attempt from treating your silence as hesitation worth trying again.",
        reflex: "An explicit refusal is better than an ignored notification.",
      },
      refuse: {
        technique: "Bluetooth attack",
        indicator: "Unrequested pairing, nothing you did triggered it",
        whyDangerous:
          "This is the right answer. You didn't search for any device: a pairing request that appears on its own has no legitimate reason to exist.",
        reflex:
          "Only accept a pairing that you started yourself, for a device you recognize.",
      },
      unsure: {
        technique: "Bluetooth attack",
        indicator: "Pairing code shown, which seems reassuring",
        whyDangerous:
          "The pairing code only confirms proximity, not the device's identity or intentions.",
        reflex:
          "When in doubt, decline: a device you know can always send its request again.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000054",
    scenarioCode: "EN-SCENARIO-000054",
    slug: "prize-draw-premium-rate-text",
    version: 1,
    attackCode: "MOB-000006",
    channel: "sms",
    targetProfile: "senior",
    difficulty: 2,
    impersonatedEntity: "Fictional prize draw",
    teaser:
      "A text message announces a prize to claim by calling a four-digit number.",
    content: {
      sender: "PrizeDraw",
      body: "You have been selected to receive a prize worth €200. Call 81 XX to claim it before it expires.",
      ui: "sms",
    },
    choices: [
      {
        id: "call",
        label: "I call the number to claim my prize before it expires",
        mistakePatternCodes: [
          "RESPONDED_TO_URGENCY",
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
        ],
      },
      {
        id: "text-stop",
        label: "I reply STOP to the text so I don't get any more",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "delete",
        label: "I delete the text without calling or replying",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["delete"],
    explanations: {
      call: {
        technique: "Premium-rate text scam",
        indicator:
          "Four-digit number, prize announced with no prior entry into any game",
        whyDangerous:
          "The four-digit number is a premium-rate number: the call itself is charged, sometimes by the minute, and that loss goes through your phone bill rather than your bank. There is generally no prize at the end.",
        reflex:
          "A four-digit short number in an unrequested text is in itself the warning sign, before even the content of the message.",
      },
      "text-stop": {
        technique: "Premium-rate text scam",
        indicator: "Unrequested text announcing a win",
        whyDangerous:
          "Replying STOP to a fraudulent text mostly confirms that the number is active and monitored, which can attract more messages of the same kind. That option exists for legitimate marketing, not for a message like this.",
        reflex:
          "A fraudulent text isn't switched off by replying to it; it is deleted.",
      },
      delete: {
        technique: "Premium-rate text scam",
        indicator: "Prize announced with no entry, number to call is charged",
        whyDangerous:
          "This is the right answer. No game you didn't enter can have named you the winner, and the number to call is what causes the loss.",
        reflex:
          "A win announced by text for a game you didn't play is deleted without calling or replying.",
      },
      unsure: {
        technique: "Premium-rate text scam",
        indicator: "Short message, urgency to act before it expires",
        whyDangerous: "Doing nothing loses you no real prize.",
        reflex:
          "When in doubt about a win announced by text, never call the number given.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000056",
    scenarioCode: "EN-SCENARIO-000056",
    slug: "security-camera-app-sign-in-alert",
    version: 1,
    attackCode: "MOB-000009",
    channel: "web",
    targetProfile: "senior",
    difficulty: 3,
    impersonatedEntity: "Fictional security camera app",
    teaser:
      "Your security camera's app reports a sign-in from an unknown device.",
    content: {
      sender: "Notification — security camera app",
      body: "New sign-in detected from an unrecognized device.\nApproximate location: a different town from yours.\n\nIf this wasn't you, change your password as soon as possible.",
      ui: "web",
    },
    choices: [
      {
        id: "dismiss",
        label: "I close the notification, it's probably a location error",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check-later",
        label:
          "I'll deal with it later if I notice something unusual in the footage",
        mistakePatternCodes: [
          "FAILED_TO_VERIFY_INDEPENDENTLY",
          "RESPONDED_TO_URGENCY",
        ],
      },
      {
        id: "change-now",
        label:
          "I immediately change the password and check the sign-in history in the app",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["change-now"],
    explanations: {
      dismiss: {
        technique: "Hacked security camera",
        indicator: "Sign-in location different from yours, unrecognized device",
        whyDangerous:
          "This notification comes from the app itself, not from an outside message to be checked: it describes a real sign-in that took place. Dismissing it as an error leaves a stranger's access active on a feed that shows the inside of your home.",
        reflex:
          "An unknown sign-in notification issued by the app itself describes a fact, not a hypothesis to dismiss.",
      },
      "check-later": {
        technique: "Hacked security camera",
        indicator: "Access already active when the notification arrives",
        whyDangerous:
          "Waiting for a visible sign in the footage leaves the access open in the meantime, and discreet access may never produce a visible sign while lasting a long time. The moment to act is the notification itself, not a later confirmation.",
        reflex:
          "Don't wait for a visible symptom: the sign-in notification already is the confirmation.",
      },
      "change-now": {
        technique: "Hacked security camera",
        indicator: "Real sign-in from an unrecognized place and device",
        whyDangerous:
          "This is the right answer. Changing the password closes access by credentials, and the sign-in history in the app confirms the extent of what happened — the two steps the attack page recommends.",
        reflex:
          "Faced with an unknown sign-in reported by the app, change the password without waiting and check the history.",
      },
      unsure: {
        technique: "Hacked security camera",
        indicator: "Technical notification, neutral tone",
        whyDangerous:
          "Changing the password loses you no legitimate access, which only needs the new password entered again.",
        reflex:
          "When in doubt about this notification, change the password: it costs nothing and closes the reported access.",
      },
    },
  },
];

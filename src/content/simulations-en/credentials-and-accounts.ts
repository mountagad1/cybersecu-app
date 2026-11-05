import type { SimulationEntry } from "@/content/simulations/types";

/**
 * English simulations for the credentials and accounts family — see social-engineering.ts
 * for the shared authoring rules (independent content, locale-invariant
 * attackCode, disjoint versionId range). Each mirrors the French scenario
 * for the same attack: same choices, same correct answer, same mistake
 * patterns; fictional names and `.test` domains are rewritten in English.
 */
export const SIMULATIONS_EN_CREDENTIALS_AND_ACCOUNTS: SimulationEntry[] = [
  {
    versionId: "10000000-0000-4000-8000-000000000022",
    scenarioCode: "EN-SCENARIO-000022",
    slug: "unusual-sign-in-alert",
    version: 1,
    attackCode: "ACCT-000001",
    channel: "email",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional online service",
    teaser:
      "A sign-in from an unknown country succeeded on an account you had forgotten existed.",
    content: {
      sender:
        "Fictional Service <security@fictional-service.example-not-real.test>",
      body: "New sign-in to your account\nDevice: Windows — Unknown browser\nApproximate location: outside your usual country\nStatus: sign-in successful\n\nThis account uses the same password as your main email account.",
      ui: "email",
    },
    choices: [
      {
        id: "ignore",
        label: "This account holds nothing important, I let it go",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "changeone",
        label: "I change the password of this one account",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "changeall",
        label:
          "I change my email password first, then that of every account that shared the same one, and I turn on two-factor authentication",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["changeall"],
    explanations: {
      ignore: {
        technique: "Reuse of credentials from a data breach",
        indicator: "Successful sign-in from an unknown device",
        whyDangerous:
          "The account has no value in itself: its value is the password it reveals, which is then tried on your email and your bank.",
        reflex:
          "An account with no apparent value is a way in, precisely because nobody is watching it.",
      },
      changeone: {
        technique: "Reuse of credentials from a data breach",
        indicator: "The same password is used on the main email account",
        whyDangerous:
          "The attacker already has the password and is trying it elsewhere. Changing just one account leaves all the others exposed.",
        reflex:
          "After a breach, change every account that shared the password, not just the one that raised the alert.",
      },
      changeall: {
        technique: "Reuse of credentials from a data breach",
        indicator: "Password reused across several services",
        whyDangerous:
          "This is the right answer: starting with your email is essential, because it can reset all the other accounts.",
        reflex:
          "A unique password for each service, kept in a password manager, completely defeats this attack.",
      },
      unsure: {
        technique: "Reuse of credentials from a data breach",
        indicator: "Unrequested sign-in notification",
        whyDangerous:
          "Changing a password puts you at no risk, even if the alert turns out to be harmless.",
        reflex: "When in doubt, start by securing your email.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000023",
    scenarioCode: "EN-SCENARIO-000023",
    slug: "one-time-code-request",
    version: 1,
    attackCode: "ACCT-000002",
    channel: "phone",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Fake support for a fictional service",
    teaser:
      "A code arrives without you asking for anything, and the phone rings right after.",
    content: {
      sender: "Text message, then incoming call",
      body: "Text: “481 902 is your verification code. Do not share it with anyone.”\n\nCall, 10 seconds later: “Hello, this is Fictional Service account security. A fraudulent sign-in attempt is in progress. To block it, read me the code you just received.”",
      ui: "call",
    },
    choices: [
      {
        id: "give",
        label: "I give them the code to block the fraudulent sign-in",
        mistakePatternCodes: [
          "SHARED_MFA_CODE",
          "TRUSTED_AUTHORITY",
          "RESPONDED_TO_URGENCY",
        ],
      },
      {
        id: "approve",
        label:
          "I'm also getting a flood of approval notifications, so I approve one to make them stop",
        mistakePatternCodes: ["SHARED_MFA_CODE", "RESPONDED_TO_URGENCY"],
      },
      {
        id: "refuse",
        label: "I share nothing, hang up and change my password immediately",
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
      give: {
        technique: "Asking for the second factor by voice",
        indicator:
          "The text message itself says not to share the code with anyone",
        whyDangerous:
          "The code is genuine because the attacker is the one who started the sign-in. Giving it to them signs them in as you.",
        reflex:
          "No service ever asks you for a verification code, through any channel.",
      },
      approve: {
        technique: "Notification fatigue",
        indicator: "Approval requests in a flood, often at night",
        whyDangerous:
          "A single approval is enough to open the session. The repetition isn't a bug: it is the technique.",
        reflex:
          "Never approve a request you didn't start that very second; change your password instead.",
      },
      refuse: {
        technique: "Asking for the second factor by voice",
        indicator: "A code received without having tried to sign in",
        whyDangerous:
          "This is the right answer: this code proves that someone already knows your password, which makes changing it urgent.",
        reflex:
          "An unrequested code is a warning that your password is compromised, not a request to deal with.",
      },
      unsure: {
        technique: "Asking for the second factor by voice",
        indicator: "Call coming immediately after the code arrives",
        whyDangerous:
          "Sharing nothing puts you at no risk: the attacker's sign-in will fail on its own.",
        reflex: "When in doubt, say nothing and hang up.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000024",
    scenarioCode: "EN-SCENARIO-000024",
    slug: "unknown-forwarding-rule",
    version: 1,
    attackCode: "ACCT-000003",
    channel: "email",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Settings of a fictional email service",
    teaser:
      "You changed your password. A forwarding rule, however, stayed in place.",
    content: {
      sender: "Your email settings",
      body: "Active rules:\n1. Forward a copy of all incoming messages to: archive.backup@unknown-mailbox.example-not-real.test — then mark as read\n\nYou didn't create any rules. Your password was changed yesterday.",
      ui: "email",
    },
    choices: [
      {
        id: "done",
        label: "I already changed my password yesterday, the problem is solved",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "keep",
        label:
          "I leave the rule: it only sends a copy, it can't delete anything",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "clean",
        label:
          "I delete the rule, sign out all active sessions, check the recovery address, then change the passwords of the linked accounts",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["clean"],
    explanations: {
      done: {
        technique: "Persistence after an intrusion",
        indicator: "Forwarding rule created by someone else",
        whyDangerous:
          "A forwarding rule survives a password change and keeps sending a copy of all your mail, including password reset links.",
        reflex:
          "After an intrusion, changing the password is the first step, never the last.",
      },
      keep: {
        technique: "Persistence after an intrusion",
        indicator: "Rule that also marks messages as read",
        whyDangerous:
          "A copy is enough: it gives access to the reset emails for all your other accounts, and marking them “read” hides the activity.",
        reflex:
          "Any forwarding rule you didn't create must be deleted immediately.",
      },
      clean: {
        technique: "Persistence after an intrusion",
        indicator: "Unknown destination address in the rules",
        whyDangerous:
          "This is the right answer: deleting the rule, signing out the sessions and restoring the recovery details really does close off access.",
        reflex:
          "Treat your email as your most critical account: it is the key to all the others.",
      },
      unsure: {
        technique: "Persistence after an intrusion",
        indicator:
          "Password changed the day before without any action on your part",
        whyDangerous:
          "Checking the rules and sessions carries no risk and takes two minutes.",
        reflex:
          "When in doubt, open your email's security settings and look at the active rules.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000040",
    scenarioCode: "EN-SCENARIO-000040",
    slug: "sim-change-confirmation-text",
    version: 1,
    attackCode: "ACCT-000004",
    channel: "sms",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Fictional mobile carrier",
    teaser:
      "A text from your carrier confirms a SIM card change you didn't ask for.",
    content: {
      sender: "FictionalMobile",
      body: "Your SIM card has been activated on a new device. If you did not make this change, contact us immediately on 3179 (free call).",
      ui: "sms",
    },
    choices: [
      {
        id: "wait",
        label:
          "I wait to see whether my phone really loses signal before acting",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "ignore",
        label:
          "It's surely a mistake or an unimportant automatic text, I ignore it",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "call-now",
        label:
          "I immediately call my carrier's official number to have the line blocked",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["call-now"],
    explanations: {
      wait: {
        technique: "SIM swapping",
        indicator:
          "Confirmation of activation on a new device you didn't request",
        whyDangerous:
          "Waiting for the signal to drop leaves a window during which your number is already receiving the security texts for your accounts — which is exactly what the operation is after. The moment to act is when you receive this message, not when the symptom is confirmed.",
        reflex:
          "This message already is the confirmation: there's nothing else to wait for before acting.",
      },
      ignore: {
        technique: "SIM swapping",
        indicator: "Message sent by the carrier itself, about a real operation",
        whyDangerous:
          "This isn't a message to sort among spam: it's a legitimate notification from your own carrier, describing a real operation on your line. Ignoring it gives whoever activated the card time to receive your security codes by text.",
        reflex:
          "A notification from your carrier about an operation you didn't make is handled as an emergency, not as background noise.",
      },
      "call-now": {
        technique: "SIM swapping",
        indicator:
          "Every minute counts, the number is already in someone else's hands",
        whyDangerous:
          "This is the right answer. The number given to you by the carrier itself lets you block the line immediately, before the security codes texted to your other accounts are intercepted.",
        reflex:
          "An unrequested SIM change is dealt with within the minute: every security code that follows goes to someone else's card.",
      },
      unsure: {
        technique: "SIM swapping",
        indicator: "Message matching exactly what the attack page describes",
        whyDangerous:
          "Doubt here costs time, which is precisely what the attacker needs.",
        reflex:
          "Faced with this exact message, speed of reaction is itself the protection.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000041",
    scenarioCode: "EN-SCENARIO-000041",
    slug: "failed-sign-in-attempts-email",
    version: 1,
    attackCode: "ACCT-000006",
    channel: "email",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Fictional online service",
    teaser:
      "An email reports several failed sign-in attempts on your account, with a link to “secure” access.",
    content: {
      sender:
        "Account Security <security@fictional-service-login.example-not-real.test>",
      body: "We detected 7 failed sign-in attempts on your account in the last 24 hours.\n\nIf this wasn't you, secure your account immediately: https://fictional-service-login.example-not-real.test/secure\n\nIf it was you, no action is needed.",
      ui: "email",
    },
    choices: [
      {
        id: "click-secure",
        label: "I click the link to secure my account, just in case",
        mistakePatternCodes: [
          "RESPONDED_TO_URGENCY",
          "CLICKED_UNKNOWN_LINK",
          "MISSED_SUSPICIOUS_DOMAIN",
        ],
      },
      {
        id: "nothing",
        label: "It might have been me, so I do nothing",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "own-app",
        label:
          "I open the service's app or website by my own means to check the sign-in history",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["own-app"],
    explanations: {
      "click-secure": {
        technique: "Brute-force attack",
        indicator:
          "Domain that isn't the service's, a “secure your account” link provided in the message",
        whyDangerous:
          "A real service never sends you a link to “secure” an account after a security alert: it sends you to your usual account area. This message imitates a legitimate alert precisely to get you to click a fake login link.",
        reflex:
          "A genuine security alert never comes with a link to follow from the message itself.",
      },
      nothing: {
        technique: "Brute-force attack",
        indicator:
          "Precise number of attempts, presented to look measured and believable",
        whyDangerous:
          "Doing nothing leaves the question unanswered either way: if the alert was real, an intrusion in progress goes unchallenged; if it was fake, nothing shows that either. Checking settles it in every case.",
        reflex: "“It might have been me” is never a reason not to check.",
      },
      "own-app": {
        technique: "Brute-force attack",
        indicator: "Check independent of the message received",
        whyDangerous:
          "This is the right answer. The sign-in history viewed from the service's app or website, reached by your own means, shows what attempts really happened — whether or not the message you received is genuine.",
        reflex:
          "The sign-in history, viewed independently of the message received, is the only check that settles it.",
      },
      unsure: {
        technique: "Brute-force attack",
        indicator: "Plausible alert, link provided so you act quickly",
        whyDangerous:
          "Not clicking puts you at no risk: the history can be viewed by your own means at any time.",
        reflex:
          "When in doubt about a security alert, always check by your own means rather than through the link you received.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000042",
    scenarioCode: "EN-SCENARIO-000042",
    slug: "recovery-email-change-notification",
    version: 1,
    attackCode: "ACCT-000009",
    channel: "email",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Fictional online service",
    teaser:
      "An email confirms a change to your recovery address — which you didn't change.",
    content: {
      sender:
        "Notifications <notifications@fictional-service-account.example-not-real.test>",
      body: "Your account's recovery email address was changed successfully.\n\nNew recovery address: r.dubois-pro@example-not-real.test\n\nIf you didn't make this change, you have 24 hours to undo it from your account's security settings.",
      ui: "email",
    },
    choices: [
      {
        id: "wait-24h",
        label: "The message says I have 24 hours, I'll do it later today",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY"],
      },
      {
        id: "reply",
        label: "I reply to this email to say it wasn't me",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "act-now",
        label:
          "I immediately log in to my account by my own means to check and undo this change",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["act-now"],
    explanations: {
      "wait-24h": {
        technique: "Account recovery hijacking",
        indicator: "Recovery address changed without any action on your part",
        whyDangerous:
          "The deadline the message gives isn't a guarantee to rely on: once the recovery address has changed, whoever controls the new address can start a password reset before you act, which makes getting the account back even harder.",
        reflex:
          "An unrequested change of recovery address is dealt with immediately, not in whatever slot is most convenient.",
      },
      reply: {
        technique: "Account recovery hijacking",
        indicator:
          "Sender address that isn't the service's, change already made",
        whyDangerous:
          "Replying to this email changes nothing on the account: the change has already been made, and your reply goes neither to the right service nor to anyone able to act. It isn't the channel that lets you take back control.",
        reflex:
          "You don't reply to a notification email: the action happens in the account's own settings.",
      },
      "act-now": {
        technique: "Account recovery hijacking",
        indicator: "Unfamiliar recovery address, limited window to correct it",
        whyDangerous:
          "This is the right answer. Logging in immediately by your own means and undoing the change in the security settings is the only action that actually takes back control of the recovery chain before it is used.",
        reflex:
          "An unrequested change of recovery address is undone immediately, by logging in to the account yourself — never by replying to the message.",
      },
      unsure: {
        technique: "Account recovery hijacking",
        indicator:
          "New address displayed, which seems transparent and reassuring",
        whyDangerous:
          "The message showing the new address changes nothing about the urgency of acting: that address doesn't belong to you.",
        reflex:
          "When in doubt, log in to your account immediately to check your security settings.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000043",
    scenarioCode: "EN-SCENARIO-000043",
    slug: "friend-reports-strange-message",
    version: 1,
    attackCode: "ACCT-000010",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity:
      "None — a message from a real friend about your own account",
    teaser: "A friend writes: “you sent me a weird link, is everything OK?”",
    content: {
      sender: "Message from a friend, on a social network",
      body: "Hi, you just sent me a link to a free-giveaway site — was that really you? It seemed odd coming from you.",
      ui: "web",
    },
    choices: [
      {
        id: "deny",
        label: "I reply that it wasn't me and think no more of it",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "change-password-only",
        label: "I change my password and consider the problem solved",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "full-check",
        label:
          "I change my password, check the active sessions and the email address linked to the account, then warn my other contacts",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["full-check"],
    explanations: {
      deny: {
        technique: "Social media account takeover",
        indicator: "Message sent from your account without you writing it",
        whyDangerous:
          "Replying that it wasn't you leaves the account in the state that allowed the message to be sent: still accessible to whoever took it, who will keep writing to your other contacts on the strength of the same trust.",
        reflex:
          "A message sent without you is a signal to act, not an anecdote to correct with one person.",
      },
      "change-password-only": {
        technique: "Social media account takeover",
        indicator:
          "Report from a single contact, the real extent remains unknown",
        whyDangerous:
          "Changing the password is necessary but not enough: if a session remains active elsewhere, it keeps working despite the change, and if the linked email address was changed, you may no longer be able to get the account back at all.",
        reflex:
          "The password is one step out of three: sessions, linked address, and warning your contacts.",
      },
      "full-check": {
        technique: "Social media account takeover",
        indicator: "First outside sign of a takeover in progress",
        whyDangerous:
          "This is the right answer. Changing the password closes access by credentials, checking sessions closes access that is already open, checking the email address confirms that you keep control of recovery, and warning your contacts limits the damage already under way while you act.",
        reflex:
          "A report from a contact is the first outside clue of a compromised account: password, sessions, linked address, then warn your other contacts, in that order.",
      },
      unsure: {
        technique: "Social media account takeover",
        indicator:
          "A single message received from a friend, a situation that seems minor",
        whyDangerous:
          "Checking only costs a few minutes, and the signal, even on its own, is enough to act on.",
        reflex:
          "When in doubt about this report, check your account rather than waiting for other signs.",
      },
    },
  },
];

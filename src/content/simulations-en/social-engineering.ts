import type { SimulationEntry } from "@/content/simulations/types";

/**
 * English simulations for the social-engineering pilot family
 * (docs/decisions/0009-i18n-pilot.md).
 *
 * Independent authored content, not a "translation object" merged onto
 * the French entries at render time — each has its own stable `versionId`
 * (never reused across languages, exactly like every other simulation on
 * this site) so the whole attempt/grading/quota pipeline needs zero
 * locale-awareness: an English attempt is graded by the same code path as
 * a French one, because from that code's point of view it just is
 * another `SimulationEntry`.
 *
 * `attackCode` stays the SAME code as its French counterpart —
 * locale-invariant, per docs/decisions/0009 — so `findAttackByCode()`
 * still resolves to the right attack (and the right cyber-reflex
 * dimension) regardless of which language the visitor played in.
 *
 * versionId range 10000000-… is reserved for English content, disjoint
 * from the French 00000000-… range, so a collision is a build-time
 * impossibility rather than something the audit has to detect.
 */
export const SIMULATIONS_EN_SOCIAL_ENGINEERING: SimulationEntry[] = [
  {
    versionId: "10000000-0000-4000-8000-000000000001",
    scenarioCode: "EN-SCENARIO-000001",
    slug: "bank-sms",
    version: 1,
    attackCode: "SMS-000001",
    channel: "sms",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "Fictional Bank",
    teaser: "A text message says your card is blocked and gives you thirty minutes to react.",
    content: {
      sender: "Fictional Bank",
      body: "Your card has been temporarily blocked due to unusual activity. Confirm your information within 30 minutes: https://fictional-bank-secure.example-not-real.test/confirm",
      ui: "sms",
    },
    choices: [
      {
        id: "click",
        label: "I click the link to confirm my information",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY", "CLICKED_UNKNOWN_LINK", "MISSED_SUSPICIOUS_DOMAIN"],
      },
      {
        id: "reply",
        label: "I reply to the text to ask for more details",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "verify",
        label: "I check directly with my bank (official app or the number on the back of my card)",
        isRecommended: true,
      },
      { id: "unsure", label: "I don't know", isUnsure: true },
    ],
    correctChoiceIds: ["verify"],
    explanations: {
      click: {
        technique: "Manufactured urgency",
        indicator: "Link to a domain that isn't your bank's (\"fictional-bank-secure.example-not-real.test\")",
        whyDangerous: "The link leads to a fake site that captures your banking credentials the moment you enter them.",
        reflex: "Never click a link received in an unsolicited text, even if it seems urgent.",
      },
      reply: {
        technique: "Manufactured urgency",
        indicator: "The text pushes you to reply directly instead of verifying through an official channel",
        whyDangerous: "Replying confirms to the attacker that your number is active and can lead to further trick questions.",
        reflex: "Never reply to a suspicious text: contact the organization through a channel you already know.",
      },
      verify: {
        technique: "Manufactured urgency",
        indicator: "Demand for immediate action within 30 minutes",
        whyDangerous: "This is the right answer: verifying independently neutralizes the urgency manufactured by the attacker.",
        reflex: "Keep verifying with the organization through an official channel before taking any action.",
      },
      unsure: {
        technique: "Manufactured urgency",
        indicator: "Demand for immediate action within 30 minutes",
        whyDangerous: "Not knowing is normal — what matters most is doing nothing from the text's link.",
        reflex: "When in doubt, don't click, and always verify with the organization through an official channel.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000002",
    scenarioCode: "EN-SCENARIO-000002",
    slug: "bank-email",
    version: 1,
    attackCode: "PHISH-000001",
    channel: "email",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "Fictional Bank",
    teaser: "A polished email asks you to \"re-verify\" your access before your account is closed.",
    content: {
      sender: "Fictional Bank <customer-service@fictional-bank-alert.example-not-real.test>",
      body: "Dear customer,\n\nOur security system was unable to re-verify your online access. Without confirmation from you within 48 hours, access to your account will be suspended.\n\nRe-verify my access: https://my-account.fictional-bank-alert.example-not-real.test/reverify\n\nCustomer Service",
      ui: "email",
    },
    choices: [
      {
        id: "click",
        label: "I click \"Re-verify my access\" and log in",
        mistakePatternCodes: ["CLICKED_UNKNOWN_LINK", "MISSED_SUSPICIOUS_DOMAIN", "SHARED_CREDENTIAL"],
      },
      {
        id: "logo",
        label: "The logo and layout are my bank's, so I treat the message as genuine",
        mistakePatternCodes: ["TRUSTED_LOGO", "TRUSTED_DISPLAY_NAME"],
      },
      {
        id: "app",
        label: "I open my bank's app myself to see if a message is waiting there",
        isRecommended: true,
      },
      { id: "unsure", label: "I don't know", isUnsure: true },
    ],
    correctChoiceIds: ["app"],
    explanations: {
      click: {
        technique: "Phishing by sender impersonation",
        indicator: "The sender's and link's domain isn't the bank's: \"fictional-bank-alert.example-not-real.test\"",
        whyDangerous: "The login page is a copy. Any credentials entered are used within the minute on the real site.",
        reflex: "Never log in from a link you received: reach the service through a bookmark or the official app.",
      },
      logo: {
        technique: "Phishing by sender impersonation",
        indicator: "Visual identity perfectly reproduced, but incorrect sender domain",
        whyDangerous: "A logo and layout can be copied in seconds: they prove nothing about a message's origin.",
        reflex: "Judge an email by its sender domain, never by its appearance.",
      },
      app: {
        technique: "Phishing by sender impersonation",
        indicator: "Threat of suspension within 48 hours to prevent verification",
        whyDangerous: "This is the right answer: a genuine alert always shows up in your official online account.",
        reflex: "Make the official app your only entry point, whatever message you receive.",
      },
      unsure: {
        technique: "Phishing by sender impersonation",
        indicator: "Impersonal wording (\"Dear customer\") from an organization that knows your name",
        whyDangerous: "Hesitating is healthy. The risk only appears once you log in from the link.",
        reflex: "When in doubt, don't use the link: open the official app instead.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000003",
    scenarioCode: "EN-SCENARIO-000003",
    slug: "tech-support-alert",
    version: 1,
    attackCode: "SOCIAL-000003",
    channel: "web",
    targetProfile: "senior",
    difficulty: 2,
    impersonatedEntity: "Fictional security alert",
    teaser: "A full-screen alert announces an infection and displays a support number.",
    content: {
      sender: "Window shown in the browser",
      body: "⚠ SECURITY ALERT — Your computer has been locked. 3 active threats detected. Do not restart your device. Call technical support immediately: 1-800-555-0199",
      ui: "web",
    },
    choices: [
      {
        id: "call",
        label: "I call the number shown to get my computer cleaned up",
        mistakePatternCodes: ["TRUSTED_AUTHORITY", "RESPONDED_TO_URGENCY"],
      },
      {
        id: "install",
        label: "I install the remote-support tool the technician asks me to install",
        mistakePatternCodes: ["TRUSTED_BRAND_NAME", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "close",
        label: "I close the tab, closing the browser entirely if needed",
        isRecommended: true,
      },
      { id: "unsure", label: "I don't know", isUnsure: true },
    ],
    correctChoiceIds: ["close"],
    explanations: {
      call: {
        technique: "Fake security alert",
        indicator: "A phone number displayed in a security alert",
        whyDangerous: "No operating system or antivirus displays a number to call. The call leads to a fake technician whose job is to get you to pay or install something.",
        reflex: "A phone number in an alert is, on its own, proof that the alert is fake.",
      },
      install: {
        technique: "Hijacking a legitimate tool",
        indicator: "Request to install remote-access software",
        whyDangerous: "The tool is real and legitimate, which makes it credible; once connected, the caller sees your files, saved passwords, and open sessions.",
        reflex: "Never install a remote-access tool at the request of someone who contacted you.",
      },
      close: {
        technique: "Fake security alert",
        indicator: "The alert is shown on a webpage, not by the system",
        whyDangerous: "This is the right answer: a webpage can't scan your machine, and closing the browser makes it disappear.",
        reflex: "Close the tab, then check your device's status with your usual security tool.",
      },
      unsure: {
        technique: "Fake security alert",
        indicator: "Message that appears to prevent the window from closing",
        whyDangerous: "The feeling of being locked out is part of the staging; the device itself is working normally.",
        reflex: "When in doubt, don't dial any number: close the browser and nothing will be lost.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000004",
    scenarioCode: "EN-SCENARIO-000004",
    slug: "relative-new-number-message",
    version: 1,
    attackCode: "SOCIAL-000005",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional contact posing as a relative",
    teaser: "\"It's me, I got a new number\" — followed by an urgent bill to pay.",
    content: {
      sender: "+1 555 000 0000 (unknown number)",
      body: "Hey it's me, I broke my phone, here's my new number 🙂\nI have a problem: I don't have my banking app on here yet and I have a $780 bill due tonight. Can you pay it for me? I'll pay you back tomorrow. I'll send you the account details. (Can't call, my mic is broken.)",
      ui: "sms",
    },
    choices: [
      {
        id: "pay",
        label: "I make the transfer — it's a relative and they'll pay me back tomorrow",
        mistakePatternCodes: ["TRUSTED_DISPLAY_NAME", "RESPONDED_TO_URGENCY", "MISSED_UNUSUAL_PAYMENT_REQUEST"],
      },
      {
        id: "ask",
        label: "I ask a personal question on this same thread to check it's really them",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "callold",
        label: "I call the person on their old number, already saved in my contacts",
        isRecommended: true,
      },
      { id: "unsure", label: "I don't know", isUnsure: true },
    ],
    correctChoiceIds: ["callold"],
    explanations: {
      pay: {
        technique: "Impersonating a relative",
        indicator: "Request for money in the very first messages, from an unknown number",
        whyDangerous: "The transfer goes to an account controlled by the attacker and becomes very hard to recover after a few hours.",
        reflex: "No transfer before hearing the person's voice on a number you already knew.",
      },
      ask: {
        technique: "Impersonating a relative",
        indicator: "Verification attempted on the very channel of the request",
        whyDangerous: "Many personal details are public or accessible from a compromised messaging account. Questioning the stranger amounts to asking them to confirm their own identity.",
        reflex: "A verification only has value on a channel different from the one used for the request.",
      },
      callold: {
        technique: "Impersonating a relative",
        indicator: "Refusal to call, justified by a broken microphone",
        whyDangerous: "This is the right answer: the inability to call is precisely the element the scenario needs to protect.",
        reflex: "Call the old number; if there's no answer, reach another family member.",
      },
      unsure: {
        technique: "Impersonating a relative",
        indicator: "Urgency and discretion requested together",
        whyDangerous: "Waiting costs nothing: a genuine request from a relative survives ten minutes of verification.",
        reflex: "When in doubt, call before paying.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000005",
    scenarioCode: "EN-SCENARIO-000005",
    slug: "online-relationship-message",
    version: 1,
    attackCode: "SOCIAL-000004",
    channel: "social_media",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional dating-site profile",
    teaser: "After three months of daily messages, a first request for money arrives.",
    content: {
      sender: "Fictional profile — dating-site messaging",
      body: "I don't dare ask you this, and it's the first time. My card is blocked abroad and I need to pay $900 in medical fees before tomorrow morning. You're the only person I can ask. I'll pay you back as soon as I'm back, next month. Please don't tell anyone, I'm ashamed.",
      ui: "email",
    },
    choices: [
      {
        id: "send",
        label: "I send the money — we've talked every day for months",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY", "MISSED_UNUSUAL_PAYMENT_REQUEST", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "less",
        label: "I send a smaller amount, to limit the risk while still helping",
        mistakePatternCodes: ["MISSED_UNUSUAL_PAYMENT_REQUEST"],
      },
      {
        id: "video",
        label: "I suggest an immediate video call and talk to someone I trust before sending anything",
        isRecommended: true,
      },
      { id: "unsure", label: "I don't know", isUnsure: true },
    ],
    correctChoiceIds: ["video"],
    explanations: {
      send: {
        technique: "Long-term emotional manipulation",
        indicator: "First request for money, urgent, with a promise of repayment",
        whyDangerous: "This first sum is a test. It's almost always followed by more requests, each justified by the previous one.",
        reflex: "The length of the relationship never replaces verification: the length of the exchange is part of the method.",
      },
      less: {
        technique: "Long-term emotional manipulation",
        indicator: "Negotiating the amount instead of verifying identity",
        whyDangerous: "Sending less doesn't answer the actual question: the first payment, whatever its size, establishes that you're willing to pay.",
        reflex: "The question isn't how much to send, but who to — and that's verified before any payment.",
      },
      video: {
        technique: "Long-term emotional manipulation",
        indicator: "Explicit request not to tell anyone",
        whyDangerous: "This is the right answer: an unplanned video call and a third party's perspective are exactly what this kind of fraud doesn't survive.",
        reflex: "A repeated refusal of a video call is itself an answer.",
      },
      unsure: {
        technique: "Long-term emotional manipulation",
        indicator: "Isolation requested (\"don't tell anyone\")",
        whyDangerous: "Doubt is legitimate and isn't insulting to a real person.",
        reflex: "When in doubt, talk to someone before sending anything.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000006",
    scenarioCode: "EN-SCENARIO-000006",
    slug: "fraud-department-call",
    version: 1,
    attackCode: "SOCIAL-000006",
    channel: "phone",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fraud department of a fictional bank",
    teaser: "A fraud-department representative calls you. They ask for no password.",
    content: {
      sender: "Incoming call — \"Fictional Bank, Fraud Department\"",
      body: "Hello, Fictional Bank fraud department. We're currently blocking a $890 payment attempt on your card, made with an overseas merchant.\n\nI will of course never ask for your password — you can check, no representative ever does. I just need to confirm your identity to cancel the transaction: can you give me your date of birth and the last four digits of your card?\n\nThen I'll send you a notification in your app, which you'll approve to block the payment.",
      ui: "call",
    },
    choices: [
      {
        id: "confirm",
        label: "I confirm my identity — they're not asking for anything confidential",
        mistakePatternCodes: ["TRUSTED_AUTHORITY", "SHARED_CREDENTIAL"],
      },
      {
        id: "validate",
        label: "I approve the notification that arrives in my app to block the payment",
        mistakePatternCodes: ["RESPONDED_TO_URGENCY", "SHARED_MFA_CODE", "TRUSTED_AUTHORITY"],
      },
      {
        id: "hangup",
        label: "I hang up and call the number on the back of my card",
        isRecommended: true,
      },
      { id: "unsure", label: "I don't know", isUnsure: true },
    ],
    correctChoiceIds: ["hangup"],
    explanations: {
      confirm: {
        technique: "Vishing",
        indicator: "Caller who emphasizes not asking for anything confidential",
        whyDangerous: "Announcing that they won't ask for your password is a credibility tactic, not a guarantee. These identity elements are then used to impersonate you with the real service, or to make the next exchange more credible.",
        reflex: "It's not what you're asked for that decides — it's who's calling: an incoming call never proves its caller's identity.",
      },
      validate: {
        technique: "Vishing",
        indicator: "Approval requested in the app during the call",
        whyDangerous: "This is the central trap of this scenario: the notification is real, but it approves the attacker's operation, not its blocking. You yourself confirm what you believe you're preventing, and the operation becomes hard to dispute since it's now authenticated.",
        reflex: "Never approve a notification while someone is talking to you. Hang up, read what it actually says, then decide.",
      },
      hangup: {
        technique: "Vishing",
        indicator: "Urgency and decision-making during the call",
        whyDangerous: "This is the right answer. Hanging up costs nothing: if the fraud is real, it will show up when you call back. The number on the back of the card is the only one whose origin you know.",
        reflex: "Hang up and call back yourself. A genuine fraud department never objects to this.",
      },
      unsure: {
        technique: "Vishing",
        indicator: "Displayed number that appears to be the bank's",
        whyDangerous: "The displayed number isn't proof: it can be chosen by the caller. Deciding nothing during the call is always risk-free.",
        reflex: "When in doubt, hang up and call the number you know.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000007",
    scenarioCode: "EN-SCENARIO-000007",
    slug: "internal-audit-directory",
    version: 1,
    attackCode: "SOCIAL-000007",
    channel: "email",
    targetProfile: "business",
    difficulty: 4,
    impersonatedEntity: "Fictional internal-audit vendor",
    teaser: "A third, friendly exchange with an auditor. This time they ask for the staff directory.",
    content: {
      sender: "C. Mercier <c.mercier@fictional-compliance-audit.example-not-real.test>",
      body: "Hi,\n\nThanks again for your answers on Tuesday, they really helped us scope things out.\n\nAs agreed with management as part of the annual compliance review, I'm finalizing the stakeholder map. Could you send me the team's internal directory (names, roles, direct lines) along with the name of your backup provider?\n\nNo rush, by Friday is perfect.\n\nBest,\nC. Mercier — Fictional Compliance Firm",
      ui: "email",
    },
    choices: [
      {
        id: "send",
        label: "I send the directory — it's not confidential information",
        mistakePatternCodes: ["TRUSTED_DISPLAY_NAME", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "partial",
        label: "I only send names and roles, without the direct lines",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check",
        label: "I ask my manager whether this audit and this vendor actually exist, before replying",
        isRecommended: true,
      },
      { id: "unsure", label: "I don't know", isUnsure: true },
    ],
    correctChoiceIds: ["check"],
    explanations: {
      send: {
        technique: "Pretexting",
        indicator: "Request that relies on earlier exchanges and on management approval never actually verified",
        whyDangerous: "The directory and the backup vendor's name aren't confidential taken alone — that's exactly why they're being requested. They provide the names, roles, and internal vocabulary that will make the next call or message credible.",
        reflex: "A harmless piece of information becomes useful once added to others. What needs checking isn't how sensitive the request is, but how legitimate the requester is.",
      },
      partial: {
        technique: "Pretexting",
        indicator: "No urgency, polite tone, reference to a prior exchange",
        whyDangerous: "Limiting what you share is a healthy reflex, but it doesn't solve the problem: names and roles are enough to build a credible scenario, and replying mainly confirms the contact is accepted. The next message will ask for more.",
        reflex: "Dosing your reply doesn't replace verifying who you're talking to.",
      },
      check: {
        technique: "Pretexting",
        indicator: "Authority invoked but never confirmed at its source",
        whyDangerous: "This is the right answer. Pretexting doesn't survive an internal check, because it only exists between you and them. The lack of urgency is precisely what should make the verification easy to do.",
        reflex: "Verify with the person supposedly having given approval, through a channel you choose.",
      },
      unsure: {
        technique: "Pretexting",
        indicator: "Relationship built over several exchanges",
        whyDangerous: "Not replying costs nothing: a genuine auditor will follow up, and their follow-up will go through your management.",
        reflex: "When in doubt, verify internally. Silence has never made a real audit fail.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000008",
    scenarioCode: "EN-SCENARIO-000008",
    slug: "found-usb-drive",
    version: 1,
    attackCode: "SOCIAL-000008",
    channel: "file_attachment",
    targetProfile: "business",
    difficulty: 2,
    impersonatedEntity: "None — anonymous physical device",
    teaser: "A USB drive is sitting in the lobby, labeled \"2026 Payroll.\"",
    content: {
      sender: "Lost and found — USB drive, front lobby",
      body: "A USB drive was left on the coffee table in the lobby. A handwritten label reads \"2026 Payroll — confidential.\"\n\nNo one at the front desk knows who it belongs to.",
      ui: "web",
    },
    choices: [
      {
        id: "open",
        label: "I plug it into my computer to see who it belongs to",
        mistakePatternCodes: ["CLICKED_UNKNOWN_LINK"],
      },
      {
        id: "isolated",
        label: "I plug it into an old computer that doesn't have anything important on it",
        mistakePatternCodes: ["CLICKED_UNKNOWN_LINK", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "handover",
        label: "I hand it over as-is to the front desk or IT, without plugging it in",
        isRecommended: true,
      },
      { id: "unsure", label: "I don't know", isUnsure: true },
    ],
    correctChoiceIds: ["handover"],
    explanations: {
      open: {
        technique: "Baiting",
        indicator: "Label designed to make the contents irresistible",
        whyDangerous: "The label is the bait: \"confidential\" and \"payroll\" are chosen so curiosity outweighs caution. Plugging in an unknown device means running code of unknown origin on a machine connected to the company network.",
        reflex: "A found device doesn't get plugged in. It's that simple, and that's the whole exercise.",
      },
      isolated: {
        technique: "Baiting",
        indicator: "Anonymous device left in a busy area",
        whyDangerous: "The intention is good but the assumption is wrong: \"an old computer\" is almost always on the same network, and often the least up-to-date machine around. It's reasoning that reassures without actually reducing the risk.",
        reflex: "A machine's isolation is decided and verified; it isn't inferred from its age or contents.",
      },
      handover: {
        technique: "Baiting",
        indicator: "No identifiable owner",
        whyDangerous: "This is the right answer. Not plugging it in costs nothing: if the drive belongs to a colleague, it will find its way back through the front desk. If it was planted, IT needs to know.",
        reflex: "Hand over the device, report it, and don't try to identify it yourself.",
      },
      unsure: {
        technique: "Baiting",
        indicator: "Desirable payoff requiring an action on your part",
        whyDangerous: "Hesitating is already the right posture: doubt about a found object always resolves to not plugging it in.",
        reflex: "When in doubt, hand over the drive without reading it.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000009",
    scenarioCode: "EN-SCENARIO-000009",
    slug: "administrative-notice",
    version: 1,
    attackCode: "SOCIAL-000010",
    channel: "email",
    targetProfile: "senior",
    difficulty: 3,
    impersonatedEntity: "Fictional public service",
    teaser: "A settlement notice, with a case number and a 48-hour deadline.",
    content: {
      sender: "Fictional Collections Service <notification@fictional-collections-service.example-not-real.test>",
      body: "SETTLEMENT NOTICE — Case No. 2026-US-884213\n\nDear Sir or Madam,\n\nAn outstanding balance of $128.40 remains unpaid for the past period. Without payment within 48 hours, a penalty will be applied and the case referred to litigation.\n\nPay online: https://fictional-collections-service.example-not-real.test/pay\n\nFor any dispute, call 1-800-XXX-XXXX (service open 24/7).",
      ui: "email",
    },
    choices: [
      {
        id: "pay",
        label: "I pay online to avoid the penalty — the amount is small",
        mistakePatternCodes: ["TRUSTED_AUTHORITY", "RESPONDED_TO_URGENCY", "CLICKED_UNKNOWN_LINK"],
      },
      {
        id: "call",
        label: "I call the number provided to dispute the case",
        mistakePatternCodes: ["TRUSTED_AUTHORITY", "FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "official",
        label: "I log into my official account myself to see if this case actually exists",
        isRecommended: true,
      },
      { id: "unsure", label: "I don't know", isUnsure: true },
    ],
    correctChoiceIds: ["official"],
    explanations: {
      pay: {
        technique: "Fake government official",
        indicator: "48-hour deadline and threat of a penalty",
        whyDangerous: "The amount is deliberately small: it makes paying cheaper than verifying, which is exactly the calculation being made. A government agency doesn't impose a 48-hour payment deadline by email, and paying also hands over your banking details.",
        reflex: "A small amount isn't a reason not to verify — it's the reason it was chosen.",
      },
      call: {
        technique: "Fake government official",
        indicator: "Contact number provided by the message itself",
        whyDangerous: "Disputing is a good instinct, but the number appears in the suspicious message: it leads to the same organization. The call then serves to obtain by voice what the email didn't, and the intent to dispute becomes a convenient opening.",
        reflex: "Never dial a number provided by the message you're doubting. Look it up yourself.",
      },
      official: {
        technique: "Fake government official",
        indicator: "Sender domain that isn't a government agency's",
        whyDangerous: "This is the right answer. A real debt shows up in your official account, and a government agency doesn't rely on email to notify you. Verifying carries no risk of a penalty.",
        reflex: "Reach the agency through a path you control: online account, mail, or in person.",
      },
      unsure: {
        technique: "Fake government official",
        indicator: "Precise case number, meant to make the notice credible",
        whyDangerous: "A case number proves nothing: it's made up. Doing nothing doesn't worsen any real situation within 48 hours.",
        reflex: "When in doubt, check your official account before paying anything.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000010",
    scenarioCode: "EN-SCENARIO-000010",
    slug: "recruitment-processing-fee",
    version: 1,
    attackCode: "SOCIAL-000011",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Recruiter at a fictional company",
    teaser: "Position accepted with no interview. Just one form left to complete.",
    content: {
      sender: "Recruiting — Fictional Logistics Group (instant messaging)",
      body: "Hi! Great news: your profile has been selected for the remote logistics-assistant position. $2,600/month, starting Monday.\n\nTo finalize by tonight, please send us:\n— a photo of the front and back of your ID\n— a proof of address\n— your bank account details\n\nThere's a $49 processing fee remaining (pre-employment health check), reimbursed on your first paycheck.\n\nAnother candidate is waiting, so I can hold the spot for you until tonight.",
      ui: "email",
    },
    choices: [
      {
        id: "all",
        label: "I send the documents and pay the $49 so I don't lose the position",
        mistakePatternCodes: ["MISSED_UNUSUAL_PAYMENT_REQUEST", "RESPONDED_TO_URGENCY", "SHARED_CREDENTIAL"],
      },
      {
        id: "docs",
        label: "I send the documents but won't pay anything until it's signed",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY", "SHARED_CREDENTIAL"],
      },
      {
        id: "verify",
        label: "I look up the company myself and ask for an interview before sending anything",
        isRecommended: true,
      },
      { id: "unsure", label: "I don't know", isUnsure: true },
    ],
    correctChoiceIds: ["verify"],
    explanations: {
      all: {
        technique: "Fake job offer",
        indicator: "Upfront fee requested from the candidate",
        whyDangerous: "No employer makes a hire pay, and a pre-employment health check is never the candidate's expense. The $49 is the visible loss; the documents shared are the lasting harm, since they form the file needed to act in your name.",
        reflex: "A fee requested from the candidate is enough on its own to rule out an offer, no further review needed.",
      },
      docs: {
        technique: "Fake job offer",
        indicator: "ID, proof of address, and bank details requested before any interview",
        whyDangerous: "Refusing the payment avoids the smaller loss and lets the bigger one through. These three documents together are exactly what's needed to build a remote file, and shared bank details can also be used to move funds of fraudulent origin — which implicates you.",
        reflex: "An ID doesn't get sent before an interview. It's the timing, not the nature of the document, that distinguishes a legitimate request.",
      },
      verify: {
        technique: "Fake job offer",
        indicator: "Hiring announced with no interview, with a same-night deadline imposed",
        whyDangerous: "This is the right answer. A genuine hiring process can withstand verification and an interview; it doesn't get concluded over instant messaging before the end of the day.",
        reflex: "Verify the company somewhere other than the ad, and insist on an interview before sending any document.",
      },
      unsure: {
        technique: "Fake job offer",
        indicator: "Scarcity invoked — \"another candidate is waiting\"",
        whyDangerous: "The competing candidate is pressure, not information. Not sending anything tonight won't cost you any real offer.",
        reflex: "When in doubt, send nothing and ask for an interview.",
      },
    },
  },
];

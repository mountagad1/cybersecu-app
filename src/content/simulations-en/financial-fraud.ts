import type { SimulationEntry } from "@/content/simulations/types";

/**
 * English simulations for the financial fraud family — see social-engineering.ts
 * for the shared authoring rules (independent content, locale-invariant
 * attackCode, disjoint versionId range). Each mirrors the French scenario
 * for the same attack: same choices, same correct answer, same mistake
 * patterns; fictional names and `.test` domains are rewritten in English.
 */
export const SIMULATIONS_EN_FINANCIAL_FRAUD: SimulationEntry[] = [
  {
    versionId: "10000000-0000-4000-8000-000000000013",
    scenarioCode: "EN-SCENARIO-000013",
    slug: "bank-advisor-call",
    version: 1,
    attackCode: "SOCIAL-000001",
    channel: "phone",
    targetProfile: "general",
    difficulty: 4,
    impersonatedEntity: "Fraud department — Fictional Bank",
    teaser:
      "On the phone, the fraud department asks you to approve a notification to block a transfer.",
    content: {
      sender:
        "Incoming call — number shown: the one printed on the back of your card",
      body: "“Hello, this is the Fictional Bank fraud department. We are currently blocking a €1,480 transfer from your account. To cancel it, I need to verify your identity: you're going to receive a notification in your app, tap Confirm. Whatever you do, don't hang up — the cancellation window is two minutes.”",
      ui: "call",
    },
    choices: [
      {
        id: "confirm",
        label: "I approve the notification in the app as asked",
        mistakePatternCodes: [
          "TRUSTED_AUTHORITY",
          "RESPONDED_TO_URGENCY",
          "SHARED_MFA_CODE",
        ],
      },
      {
        id: "number",
        label: "The number shown really is my bank's, so I trust the caller",
        mistakePatternCodes: [
          "TRUSTED_DISPLAY_NAME",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "hangup",
        label:
          "I hang up and call my bank back on the number on the back of my card",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["hangup"],
    explanations: {
      confirm: {
        technique: "Borrowed authority and an imposed time window",
        indicator: "Request to approve a notification during the call",
        whyDangerous:
          "The notification cancels nothing: it authorizes the attacker's transaction. You are the one approving it, which makes disputing it much harder afterwards.",
        reflex:
          "Never approve a notification someone asks for over the phone, whatever the reason given.",
      },
      number: {
        technique: "Caller ID spoofing",
        indicator: "The caller number shown matches the bank's",
        whyDangerous:
          "The caller number display can be faked. A correct number never proves who you are talking to.",
        reflex:
          "Never treat the number shown as proof: you have to be the one who dials.",
      },
      hangup: {
        technique: "Borrowed authority and an imposed time window",
        indicator: "Insistence that you not hang up",
        whyDangerous:
          "This is the right answer: taking back control of the call removes all of the attacker's power.",
        reflex:
          "Hanging up and calling back yourself is the only check that works over the phone.",
      },
      unsure: {
        technique: "Borrowed authority and an imposed time window",
        indicator: "Two-minute deadline announced",
        whyDangerous:
          "Doubt is exactly what urgency tries to remove. Hanging up puts you at no risk.",
        reflex:
          "When in doubt, hang up: a legitimate request will survive you calling back.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000014",
    scenarioCode: "EN-SCENARIO-000014",
    slug: "parcel-text-message",
    version: 1,
    attackCode: "SOCIAL-000002",
    channel: "sms",
    targetProfile: "general",
    difficulty: 1,
    impersonatedEntity: "Fictional Carrier",
    teaser:
      "A parcel is supposedly on hold: €1.95 in fees to pay to release it.",
    content: {
      sender: "FictionalCarrier",
      body: "Your parcel is awaiting delivery. A redelivery fee of €1.95 is still due: https://tracking-fictionalcarrier.example-not-real.test/payment",
      ui: "sms",
    },
    choices: [
      {
        id: "pay",
        label: "The amount is tiny, I pay the €1.95 to release the parcel",
        mistakePatternCodes: [
          "CLICKED_UNKNOWN_LINK",
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
          "MISSED_SUSPICIOUS_DOMAIN",
        ],
      },
      {
        id: "expecting",
        label: "I am expecting a parcel, so the message is probably genuine",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "tracking",
        label:
          "I find my tracking number in my order confirmation and enter it on the carrier's official website",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["tracking"],
    explanations: {
      pay: {
        technique: "Small amount to lower your guard",
        indicator:
          "Card payment requested on a domain that isn't the carrier's",
        whyDangerous:
          "The goal isn't collecting €1.95 but collecting your full card details, reused afterwards for much larger charges or a recurring subscription.",
        reflex:
          "A trivial amount doesn't reduce the risk: it's your card details being targeted.",
      },
      expecting: {
        technique: "Exploited coincidence",
        indicator: "Message with no verifiable tracking number",
        whyDangerous:
          "These texts are sent in bulk: some of the recipients are bound to be expecting a parcel. Coincidence is not proof.",
        reflex: "Always tie the request to a tracking number you already have.",
      },
      tracking: {
        technique: "Exploited coincidence",
        indicator: "Fees demanded for an ordinary delivery",
        whyDangerous:
          "This is the right answer: the official website shows the real status and won't ask you for anything.",
        reflex:
          "Always check tracking from the carrier's website, never from the link in the message.",
      },
      unsure: {
        technique: "Exploited coincidence",
        indicator: "Link domain unrelated to the carrier",
        whyDangerous:
          "Doing nothing costs nothing: a real parcel is never destroyed for lack of immediate payment.",
        reflex: "When in doubt, don't pay, and check the tracking yourself.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000016",
    scenarioCode: "EN-SCENARIO-000016",
    slug: "exceptional-store-discount",
    version: 1,
    attackCode: "WEB-000001",
    channel: "advertisement",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "Fictional online store",
    teaser:
      "70% off a product that is rarely discounted, and a nine-minute countdown.",
    content: {
      sender: "Ad shown on a social network",
      body: "Clearance sale −70% — only 3 items left!\nOffer ends in 09:41\n\nFictional-Store-Deals.example-not-real.test\nPayment by bank transfer only. Legal notice: no company name, no company registration number. Contact: form.",
      ui: "web",
    },
    choices: [
      {
        id: "buy",
        label: "I order right away before the countdown ends",
        mistakePatternCodes: [
          "RESPONDED_TO_URGENCY",
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
        ],
      },
      {
        id: "reviews",
        label:
          "The page shows hundreds of five-star reviews, so I consider the store reliable",
        mistakePatternCodes: [
          "TRUSTED_BRAND_NAME",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "check",
        label:
          "I look the store up outside its own website and check its legal notice before ordering anything",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["check"],
    explanations: {
      buy: {
        technique: "Manufactured scarcity and countdown",
        indicator: "Payment accepted by bank transfer only",
        whyDangerous:
          "A bank transfer offers practically no way to dispute it: once it has gone through, the money is lost even if nothing is delivered.",
        reflex:
          "A seller who refuses every payment method you could dispute is choosing one you can't reverse.",
      },
      reviews: {
        technique: "Manufactured social proof",
        indicator: "Reviews hosted on the seller's own website",
        whyDangerous:
          "The reviews shown on a website are chosen by that website; they are no independent proof.",
        reflex:
          "Only count reviews published elsewhere, on a platform the seller doesn't control.",
      },
      check: {
        technique: "Manufactured scarcity and countdown",
        indicator: "Legal notice with no company name or registration number",
        whyDangerous:
          "This is the right answer: a seller who can't be identified can't be contacted, taken to court or made to refund you.",
        reflex:
          "Before paying, check that the seller exists somewhere other than its own storefront.",
      },
      unsure: {
        technique: "Manufactured scarcity and countdown",
        indicator: "Price far below the market",
        whyDangerous:
          "The countdown is there to prevent exactly this hesitation; letting it run out costs nothing.",
        reflex: "When in doubt, let the offer go: a real promotion comes back.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000018",
    scenarioCode: "EN-SCENARIO-000018",
    slug: "tax-refund-email",
    version: 1,
    attackCode: "PAYMENT-000001",
    channel: "email",
    targetProfile: "general",
    difficulty: 2,
    impersonatedEntity: "Fictional government agency",
    teaser:
      "An overpayment of €384.29 is waiting for you. All you have to do is give your card.",
    content: {
      sender:
        "Fictional Agency <refund@fictional-agency-refund.example-not-real.test>",
      body: "Following a reassessment of your file, an overpayment of €384.29 is owed to you.\n\nTo receive this amount, enter your bank card details (card number, expiry date and security code) within 5 days, otherwise the sum will be returned to the Treasury.\n\nReceive my refund: https://fictional-agency-refund.example-not-real.test/payment",
      ui: "email",
    },
    choices: [
      {
        id: "fill",
        label: "I enter my card to receive the refund",
        mistakePatternCodes: [
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
          "CLICKED_UNKNOWN_LINK",
          "SHARED_CREDENTIAL",
        ],
      },
      {
        id: "deadline",
        label:
          "The deadline is short, so I fill it in first and will check afterwards",
        mistakePatternCodes: [
          "RESPONDED_TO_URGENCY",
          "FAILED_TO_VERIFY_INDEPENDENTLY",
        ],
      },
      {
        id: "space",
        label:
          "I log in to my official online account by my own means to check",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["space"],
    explanations: {
      fill: {
        technique: "Unexpected good news",
        indicator:
          "Full card number with security code requested in order to receive money",
        whyDangerous:
          "A security code is only used to debit, never to credit. The details you enter are used for immediate payments.",
        reflex:
          "A payment to you only needs your bank account details (IBAN): any request for a card to receive money is fraudulent.",
      },
      deadline: {
        technique: "Imposed deadline",
        indicator: "Threat of losing the sum after 5 days",
        whyDangerous:
          "The deadline only exists to prevent checking; a real refund is never cancelled for lack of a quick reply.",
        reflex:
          "Check first, act second: the reverse order is what the attack is after.",
      },
      space: {
        technique: "Unexpected good news",
        indicator: "Sender domain that isn't the government agency's",
        whyDangerous:
          "This is the right answer: a real refund appears in your official online account, with no steps to take by email.",
        reflex:
          "Always go through your online account, never through the link in a message.",
      },
      unsure: {
        technique: "Unexpected good news",
        indicator: "Precise amount meant to make the message believable",
        whyDangerous: "Doing nothing loses you no legitimate refund.",
        reflex: "When in doubt, log in to your official online account.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000019",
    scenarioCode: "EN-SCENARIO-000019",
    slug: "urgent-transfer-from-management",
    version: 1,
    attackCode: "PAYMENT-000002",
    channel: "email",
    targetProfile: "business",
    difficulty: 4,
    impersonatedEntity: "Management of a fictional company",
    teaser:
      "Management asks for an urgent, confidential transfer, outside the usual procedure.",
    content: {
      sender:
        "Chief Executive <ceo@fictional-company.example-not-real.test> (reply to: ceo.office@fictlonal-company.example-not-real.test)",
      body: "Hello,\n\nI'm travelling and working on a confidential deal. I need you to make a €24,800 transfer today to the account attached. The matter is sensitive: please don't mention it to the team, I'll explain on Monday.\n\nLet me know as soon as it has gone out.",
      ui: "email",
    },
    choices: [
      {
        id: "execute",
        label:
          "I make the transfer: the request comes from management and it's urgent",
        mistakePatternCodes: [
          "TRUSTED_AUTHORITY",
          "RESPONDED_TO_URGENCY",
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
        ],
      },
      {
        id: "replymail",
        label: "I reply to the email to ask for confirmation before making it",
        mistakePatternCodes: [
          "FAILED_TO_VERIFY_INDEPENDENTLY",
          "TRUSTED_DISPLAY_NAME",
        ],
      },
      {
        id: "callknown",
        label:
          "I call management on the internal number I already know and apply the required two-person approval",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["callknown"],
    explanations: {
      execute: {
        technique: "Authority and confidentiality combined",
        indicator: "Explicit instruction not to mention it to the team",
        whyDangerous:
          "The confidentiality requested serves only to prevent a colleague from checking — the one thing that would stop the fraud.",
        reflex:
          "A payment request that forbids you from talking about it is, for that reason alone, one to check.",
      },
      replymail: {
        technique: "Diverted reply-to address",
        indicator:
          "The reply-to address differs from the sender: “fictlonal-company” with an l in place of the i",
        whyDangerous:
          "Your confirmation request then goes to the attacker, who replies “yes”. Checking on the channel the request came from checks nothing.",
        reflex:
          "Always check on a different channel from the one the request arrived on.",
      },
      callknown: {
        technique: "Authority and confidentiality combined",
        indicator: "Usual approval procedure bypassed “just this once”",
        whyDangerous:
          "This is the right answer: a call on a number you already know and two-person approval defeat the fraud, even if the executive's mailbox has been compromised.",
        reflex:
          "No urgency justifies suspending two-person approval of a transfer.",
      },
      unsure: {
        technique: "Authority and confidentiality combined",
        indicator: "Large transfer to a new payee",
        whyDangerous:
          "Not making the transfer immediately puts the company at no real risk.",
        reflex:
          "When in doubt, follow the procedure: that is exactly what it exists for.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000020",
    scenarioCode: "EN-SCENARIO-000020",
    slug: "guaranteed-return-investment",
    version: 1,
    attackCode: "PAYMENT-000003",
    channel: "advertisement",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional broker",
    teaser:
      "A very available advisor offers you 9% guaranteed, and a first withdrawal did work.",
    content: {
      sender: "“Advisor” from a fictional investment platform",
      body: "Your portfolio already shows +€1,240. You were able to withdraw €150 last week, the platform works perfectly.\n\nTo move up to the next tier (9% guaranteed), your deposits need to reach €15,000. After that you can withdraw whenever you like — you'll just need to pay the €890 release fee.",
      ui: "email",
    },
    choices: [
      {
        id: "deposit",
        label:
          "I pay in the top-up: I was already able to withdraw, so the platform is reliable",
        mistakePatternCodes: [
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
          "TRUSTED_BRAND_NAME",
        ],
      },
      {
        id: "fees",
        label: "I pay the €890 fee so I can get my gains back",
        mistakePatternCodes: [
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
          "RESPONDED_TO_URGENCY",
        ],
      },
      {
        id: "stop",
        label:
          "I stop all payments and check that the firm is authorized by the financial regulator",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["stop"],
    explanations: {
      deposit: {
        technique: "Small initial withdrawal as manufactured proof",
        indicator: "Return presented as guaranteed",
        whyDangerous:
          "The first withdrawal costs the attacker little and serves precisely to obtain much larger payments. The gains displayed are only a display.",
        reflex:
          "Return and risk go together: a “guaranteed” high return doesn't exist.",
      },
      fees: {
        technique: "Release fees",
        indicator: "Extra payment demanded to get money back",
        whyDangerous:
          "Real fees are taken from the sum owed, never paid on top. This request is one more stage of the same fraud, and there will be others.",
        reflex:
          "Never pay to get money back: it is the clearest sign of the scam.",
      },
      stop: {
        technique: "Small initial withdrawal as manufactured proof",
        indicator:
          "Firm not registered with the regulator of the country where it claims to operate",
        whyDangerous:
          "This is the right answer: the official registers of authorized firms are public and can be checked in a few minutes.",
        reflex:
          "Check that the firm is authorized before the first payment, never after.",
      },
      unsure: {
        technique: "Small initial withdrawal as manufactured proof",
        indicator: "Insistent hand-holding by a personal “advisor”",
        whyDangerous:
          "Suspending payments loses you nothing: the gains displayed don't exist.",
        reflex: "When in doubt, pay nothing and ask your bank for advice.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000021",
    scenarioCode: "EN-SCENARIO-000021",
    slug: "supplier-bank-details-change",
    version: 1,
    attackCode: "PAYMENT-000004",
    channel: "email",
    targetProfile: "business",
    difficulty: 5,
    impersonatedEntity: "Fictional supplier",
    teaser:
      "Your usual supplier announces a change of bank. The invoice itself is identical.",
    content: {
      sender:
        "Fictional Supplier <accounts@fictional-supplier.example-not-real.test>",
      body: "Hello,\n\nWe have changed banks. Please pay invoice 2026-0412 (€7,340) to our new bank details, attached to this message.\n\nThe invoice is identical to the one you already received; only the IBAN has changed.\n\nKind regards,\nAccounts department",
      ui: "email",
    },
    choices: [
      {
        id: "pay",
        label:
          "I pay to the new IBAN: the message comes from the usual address and the invoice really is ours",
        mistakePatternCodes: [
          "TRUSTED_DISPLAY_NAME",
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
        ],
      },
      {
        id: "replythread",
        label: "I reply in the email thread to have the new IBAN confirmed",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "callsupplier",
        label:
          "I call the supplier on the number I was already using before this message to have the change confirmed",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["callsupplier"],
    explanations: {
      pay: {
        technique: "Hijacking an existing payment relationship",
        indicator: "Change of bank details announced by email",
        whyDangerous:
          "The payment was expected, so nothing raises suspicion. The fraud is only discovered when the real supplier chases payment, often weeks later.",
        reflex:
          "Every change of bank details is confirmed by phone, without exception.",
      },
      replythread: {
        technique: "Hijacking an existing payment relationship",
        indicator: "Check carried out on the very channel of the request",
        whyDangerous:
          "If the supplier's mailbox has been compromised, it's the attacker who replies “yes, it's us”. The message can be technically completely genuine.",
        reflex: "An email is never verified by email.",
      },
      callsupplier: {
        technique: "Hijacking an existing payment relationship",
        indicator: "New IBAN on an otherwise identical invoice",
        whyDangerous:
          "This is the right answer: a call to a number that predates the message settles it, and a small test transfer confirms it.",
        reflex:
          "Call a number you already had before the request, never the one it provides.",
      },
      unsure: {
        technique: "Hijacking an existing payment relationship",
        indicator: "Payee's bank different from the one used so far",
        whyDangerous:
          "Delaying a payment by a few hours has no consequence; paying the wrong recipient does.",
        reflex: "When in doubt, hold the payment and call.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000035",
    scenarioCode: "EN-SCENARIO-000035",
    slug: "domain-renewal-invoice",
    version: 1,
    attackCode: "PAYMENT-000005",
    channel: "email",
    targetProfile: "business",
    difficulty: 3,
    impersonatedEntity: "Fictional domain name registry",
    teaser:
      "An €89 invoice for renewing a domain name that nobody really recognizes.",
    content: {
      sender:
        "Billing Department <billing@fictional-domain-registry.example-not-real.test>",
      body: "INVOICE No. RF-2026-88431\n\nAnnual renewal of your domain name: €89.00\n\nPayable within 8 days to avoid suspension of the service.\n\nPay now: https://fictional-domain-registry.example-not-real.test/payment",
      ui: "email",
    },
    choices: [
      {
        id: "pay",
        label: "I pay, the amount is reasonable and the subject plausible",
        mistakePatternCodes: [
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
          "TRUSTED_DISPLAY_NAME",
          "RESPONDED_TO_URGENCY",
        ],
      },
      {
        id: "forward",
        label:
          "I forward the invoice to accounts so they pay it if it's legitimate",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check-registrar",
        label:
          "I check with my real registrar whether a renewal is actually due",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["check-registrar"],
    explanations: {
      pay: {
        technique: "Fake invoice",
        indicator: "Modest amount, eight-day deadline, threat of suspension",
        whyDangerous:
          "The amount is chosen precisely to stay below the level at which an invoice draws attention, and the sender isn't your real registrar. Paying mostly confirms that the address works and encourages more fake invoices to be sent.",
        reflex:
          "A plausible amount is no proof of legitimacy; it's often the opposite, chosen so as not to raise doubts.",
      },
      forward: {
        technique: "Fake invoice",
        indicator: "Invoice received with no matching purchase order",
        whyDangerous:
          "Forwarding without checking puts off the decision rather than making it: if nobody in the organization placed the order, accounts has no way of knowing that on their side and could pay on the strength of how the invoice looks.",
        reflex:
          "An invoice should be matched to a purchase order before it is forwarded, not after.",
      },
      "check-registrar": {
        technique: "Fake invoice",
        indicator:
          "Sender who isn't the registrar where the domain was actually registered",
        whyDangerous:
          "This is the right answer. The exact information on the renewal date and the real provider is in your own account with the registrar, never in an email you received.",
        reflex:
          "For any renewal, check with the real provider, found from your own account, never from the email you received.",
      },
      unsure: {
        technique: "Fake invoice",
        indicator: "Professional-looking invoice for a technical service",
        whyDangerous: "Not paying puts you at no risk of a real suspension.",
        reflex:
          "When in doubt, check with the real provider before paying anything.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000036",
    scenarioCode: "EN-SCENARIO-000036",
    slug: "lottery-win-processing-fee",
    version: 1,
    attackCode: "PAYMENT-000006",
    channel: "email",
    targetProfile: "senior",
    difficulty: 2,
    impersonatedEntity: "Fictional international lottery",
    teaser:
      "An email announces a €850,000 win. A processing fee must be paid before the payout.",
    content: {
      sender:
        "Fictional International Lottery <prizes@fictional-international-lottery.example-not-real.test>",
      body: "CONGRATULATIONS!\n\nYour email address was drawn and you have won €850,000 in the International Lottery.\n\nTo receive your prize, a processing fee of €450 must be paid (deducted afterwards from the total amount).\n\nContact our agent: Mr Robert Fontaine, available 24/7.",
      ui: "email",
    },
    choices: [
      {
        id: "pay-fee",
        label: "I pay the fee, it will be deducted from the prize anyway",
        mistakePatternCodes: [
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
          "TRUSTED_AUTHORITY",
        ],
      },
      {
        id: "ask-details",
        label: "I first ask for more details about the lottery before deciding",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "delete",
        label: "I delete the message: I never entered any lottery",
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
      "pay-fee": {
        technique: "Fake lottery",
        indicator: "Processing fee requested before a prize is paid out",
        whyDangerous:
          "A real prize never requires money up front: any fees, if there are any, are taken from the sum owed, they are never paid beforehand. This rule is enough to decide without having to investigate the lottery itself any further.",
        reflex:
          "No legitimate prize requires a payment first, whatever name that payment is given.",
      },
      "ask-details": {
        technique: "Fake lottery",
        indicator:
          "Contact available around the clock, ready to provide more details",
        whyDangerous:
          "Asking for details starts a conversation with someone whose job is precisely to make it convincing. What settles the matter isn't the level of detail provided, but the fact that no lottery you didn't enter can have picked you.",
        reflex:
          "Lack of detail isn't the problem; not having entered any game is.",
      },
      delete: {
        technique: "Fake lottery",
        indicator: "Win announced for a game you never entered",
        whyDangerous:
          "This is the right answer. A game you didn't play can't physically have named you the winner; there's nothing else to check.",
        reflex:
          "A win for a game you didn't enter is deleted without further examination.",
      },
      unsure: {
        technique: "Fake lottery",
        indicator: "Very large amount announced with no prior entry",
        whyDangerous: "Doing nothing loses you no real prize.",
        reflex:
          "When in doubt about an unexpected win, the rule is simple: no legitimate prize asks for a payment before payout.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000037",
    scenarioCode: "EN-SCENARIO-000037",
    slug: "unpaid-parking-fine-text",
    version: 1,
    attackCode: "PAYMENT-000007",
    channel: "sms",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional fine-payment service",
    teaser:
      "A text message announces an unpaid parking fine, to be paid within 48 hours.",
    content: {
      sender: "FineService",
      body: "Penalty notice no. FR88231 unpaid. Surcharge applies after 48h. Pay at: fine-service-fictional.example-not-real.test/pay",
      ui: "sms",
    },
    choices: [
      {
        id: "pay-link",
        label: "I pay through the link before the surcharge",
        mistakePatternCodes: [
          "MISSED_SUSPICIOUS_DOMAIN",
          "RESPONDED_TO_URGENCY",
          "CLICKED_UNKNOWN_LINK",
        ],
      },
      {
        id: "call-back",
        label:
          "I reply to the text to ask for more information about this fine",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "official-site",
        label:
          "I go to the official fine-payment website and look up the notice by its number",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["official-site"],
    explanations: {
      "pay-link": {
        technique: "Fake fine",
        indicator:
          "Penalty notice received by text, and a domain that isn't the official service's",
        whyDangerous:
          "In France, real penalty notices are sent by post, not by text message. The link's domain isn't that of the official payment service, and the 48-hour surcharge only serves to prevent checking.",
        reflex:
          "A penalty notice by text is already not the usual channel; that's a first sign, and enough not to follow the link.",
      },
      "call-back": {
        technique: "Fake fine",
        indicator: "Precise notice number, meant to look verifiable",
        whyDangerous:
          "Replying to the text starts a conversation with the sender of the suspicious message, who will confirm whatever they like. The notice number provided proves nothing until it has been looked up on the official service.",
        reflex: "Never ask the sender of a message you doubt to confirm it.",
      },
      "official-site": {
        technique: "Fake fine",
        indicator:
          "Notice number that can be checked independently of the message received",
        whyDangerous:
          "This is the right answer. The official fine-payment service lets you look up a notice by its number: a real fine is listed there, and a fine that isn't listed doesn't exist.",
        reflex:
          "Never follow the link you received: reach the official service by your own means and look up the notice by its number.",
      },
      unsure: {
        technique: "Fake fine",
        indicator: "48-hour deadline and threat of a surcharge",
        whyDangerous:
          "Doing nothing right away puts you at no risk: a real fine remains due and can be paid without rushing.",
        reflex:
          "When in doubt, check on the official service before paying anything.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000038",
    scenarioCode: "EN-SCENARIO-000038",
    slug: "apartment-rental-without-viewing",
    version: 1,
    attackCode: "PAYMENT-000008",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional apartment landlord",
    teaser:
      "A very well-located apartment, rented below the market price. The landlord is abroad.",
    content: {
      sender: "“Landlord” — listings platform messaging",
      body: "Hello, I'm currently abroad for work, which is why the rent is a bit lower — I want to let it quickly. The apartment is available right away.\n\nI can't show you around myself, but I can send you more photos. To reserve it, I need a transfer of the first month's rent and the deposit; I'll send you the keys by courier once the payment is received.",
      ui: "web",
    },
    choices: [
      {
        id: "transfer",
        label:
          "I transfer the first month's rent and the deposit to reserve the apartment",
        mistakePatternCodes: [
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
          "RESPONDED_TO_URGENCY",
        ],
      },
      {
        id: "partial",
        label: "I transfer just the deposit, keeping the rent for later",
        mistakePatternCodes: ["MISSED_UNUSUAL_PAYMENT_REQUEST"],
      },
      {
        id: "refuse-visit",
        label:
          "I refuse to pay anything before viewing the apartment and meeting the person",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["refuse-visit"],
    explanations: {
      transfer: {
        technique: "Rental scam",
        indicator:
          "No viewing possible, below-market price, landlord unreachable by phone",
        whyDangerous:
          "Taken together, these are the classic scenario: an apartment that doesn't belong to the sender, or doesn't exist, rented in a hurry from a distance so that payment comes before any possible check. Once the transfer is made, there's no apartment and no simple recourse.",
        reflex:
          "No real home is reserved by bank transfer before a viewing, whatever reason is given for the landlord's absence.",
      },
      partial: {
        technique: "Rental scam",
        indicator: "Payment requested before any viewing",
        whyDangerous:
          "Reducing the amount paid limits the loss but changes nothing about the problem: no money should be paid before seeing the apartment, whether it's the deposit alone or the full rent.",
        reflex:
          "It isn't the amount that should be reduced, it's the request for payment before a viewing that should be refused.",
      },
      "refuse-visit": {
        technique: "Rental scam",
        indicator: "No viewing possible, no phone contact",
        whyDangerous:
          "This is the right answer. A real apartment can be viewed, and its owner or agent can be met or at least reached by phone. The absence of both is disqualifying in itself.",
        reflex:
          "Never pay money for a home before viewing it and meeting a real person.",
      },
      unsure: {
        technique: "Rental scam",
        indicator: "Attractive price and immediate availability",
        whyDangerous:
          "Paying nothing only loses you an apartment whose existence isn't verified anyway.",
        reflex:
          "When in doubt, insist on a viewing before any payment — that criterion outweighs all the others.",
      },
    },
  },
  {
    versionId: "10000000-0000-4000-8000-000000000039",
    scenarioCode: "EN-SCENARIO-000039",
    slug: "classified-ad-payment-release-link",
    version: 1,
    attackCode: "PAYMENT-000009",
    channel: "messaging_app",
    targetProfile: "general",
    difficulty: 3,
    impersonatedEntity: "Fictional buyer on a classified ads platform",
    teaser:
      "A buyer accepts your price without haggling, then sends a link to “release” the payment.",
    content: {
      sender: "“Interested buyer” — classified ads platform messaging",
      body: "Hello, I'll take it at the listed price, no problem! I've already sent the payment through the platform's secure service.\n\nTo release the funds to your account, click this link and log in with your online banking credentials: classifieds-platform-payment.example-not-real.test/release",
      ui: "web",
    },
    choices: [
      {
        id: "unlock",
        label: "I click the link and log in to release the payment",
        mistakePatternCodes: [
          "MISSED_UNUSUAL_PAYMENT_REQUEST",
          "CLICKED_UNKNOWN_LINK",
          "SHARED_CREDENTIAL",
        ],
      },
      {
        id: "ask-code",
        label: "I ask the buyer to send me a confirmation code instead",
        mistakePatternCodes: ["FAILED_TO_VERIFY_INDEPENDENTLY"],
      },
      {
        id: "check-account",
        label: "I check my bank account directly, without using the link sent",
        isRecommended: true,
      },
      {
        id: "unsure",
        label: "I don't know",
        isUnsure: true,
      },
    ],
    correctChoiceIds: ["check-account"],
    explanations: {
      unlock: {
        technique: "Classified ad scam",
        indicator:
          "Link sent to “release” a payment, asking for online banking credentials",
        whyDangerous:
          "Receiving money never requires logging in to your bank from a link received in a message. This link leads to a copy of your bank's login page, and the credentials you enter go straight to the attacker.",
        reflex:
          "No payment received requires you to “release” anything through a link. That alone is the warning sign.",
      },
      "ask-code": {
        technique: "Classified ad scam",
        indicator: "Release pretext that exists in no real payment system",
        whyDangerous:
          "Asking for a different code stays within the frame set by the attacker, who will adapt the request. The problem isn't the kind of proof requested, it's that no legitimate payment goes through a “release” step outside your bank.",
        reflex:
          "The release pretext is the flaw in the scenario, whatever form it takes next.",
      },
      "check-account": {
        technique: "Classified ad scam",
        indicator:
          "A payment that can be seen directly on the account, with no intermediary",
        whyDangerous:
          "This is the right answer. A transfer or payment received appears on your account when you log in by your own means; no extra step is needed to use it.",
        reflex:
          "Always check that a payment has arrived directly on your account, never through a link provided by the other party.",
      },
      unsure: {
        technique: "Classified ad scam",
        indicator: "Price accepted immediately, without haggling",
        whyDangerous:
          "Not clicking the link loses you no real sale: a real buyer will pay through the platform's usual methods.",
        reflex:
          "When in doubt, ignore any “release” link and check your account directly.",
      },
    },
  },
];

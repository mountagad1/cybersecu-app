import type { SignalCode } from "./signals";

/**
 * The English reading of each signal: label, explanation and patterns.
 *
 * The patterns are written for English messages, not translated from the
 * French ones: scams phrase the same procedure differently in each
 * language (« sous 48h » / « within 48 hours », « c'est moi » / « it's
 * me »). Same normalisation as the French side: lowercase, accents
 * removed, apostrophes straightened.
 *
 * `Record<SignalCode, …>` makes a missing translation a type error.
 */
export interface SignalTextEn {
  label: string;
  explanation: string;
  patterns: RegExp[];
}

export const SIGNALS_EN: Record<Exclude<SignalCode, "lien">, SignalTextEn> = {
  urgence: {
    label: "A very short deadline",
    explanation:
      "A deadline of a few minutes or a few hours has only one purpose: getting you to act before you've checked. A legitimate request always survives an hour of thinking it over.",
    patterns: [
      /\burgent\w*/,
      /\bimmediately\b/,
      /\bright away\b/,
      /\b(as soon as possible|asap)\b/,
      /\bact now\b/,
      /\bfinal (notice|reminder|warning)\b/,
      /\b(within|in the next|in) \d+ ?(h|hrs?|hours?|minutes?|mins?|days?)\b/,
      /\bbefore (tonight|midnight|tomorrow|the end of the day)\b/,
      /\b(expires?|expiring|expired)\b/,
    ],
  },
  menace: {
    label: "A threat or a penalty",
    explanation:
      "Account blocked, legal action, surcharge: fear of a consequence pushes you to look for the solution offered rather than to check who is announcing it. A real organization gives you time and a way to check for yourself.",
    patterns: [
      /\b(suspended|suspension|blocked|locked|deactivated|disabled|terminated|frozen)\b/,
      /\b(legal action|lawsuit|bailiff|penalty|penalties|surcharge|late fee|arrest warrant)\b/,
      /\b(will|would) be (deleted|lost|destroyed|cancell?ed|closed|reported)\b/,
    ],
  },
  frais: {
    label: "Small fees to release something",
    explanation:
      "A few euros or dollars to release a parcel, a prize or a payment are rarely about collecting that money: they are about getting your full card number. Receiving something never requires paying first.",
    patterns: [
      // « €1.95 », not « €1,480 »: a figure followed by more digits is a large sum.
      /(?:€|£|\$) ?[0-4](?:\.\d{1,2})?(?![\d,.]*\d)/,
      /\b[0-4](?:[.,]\d{1,2})? ?(?:€|eur\b|euros?\b|usd\b|gbp\b)/,
      /\b(delivery|redelivery|shipping|customs|processing|handling|release|admin|administration|unlock) (fee|fees|charge|charges)\b/,
    ],
  },
  paiement: {
    label: "A request for payment or bank details",
    explanation:
      "A message asking you to pay, transfer or enter your card makes you carry out the transaction yourself, which is what makes it hard to dispute afterwards. Only pay from your official account, which you open yourself.",
    patterns: [
      /\b(pay|payment|transfer|wire|settle)\b/,
      /\b(card number|credit card|debit card|bank card|security code|cvv|cvc|expiry date|expiration date|bank details|account details|iban)\b/,
      /\b(bitcoins?|crypto(currency|currencies)?|usdt)\b/,
    ],
  },
  "carte-cadeau": {
    label: "Payment by gift card or voucher",
    explanation:
      "No organization, customer service or government agency takes payment in gift cards or prepaid vouchers. This method is asked for because it is impossible to reverse and hard to trace.",
    patterns: [
      /\b(gift ?cards?|prepaid (cards?|vouchers?|codes?)|vouchers?)\b/,
      /\b(pcs|transcash|neosurf|paysafecard)\b/,
    ],
  },
  "changement-rib": {
    label: "A change of bank details",
    explanation:
      "A new bank, a new IBAN announced by message: this is the technique that diverts an expected payment. A change of bank details is always confirmed by phone, on a number you already had.",
    patterns: [
      /\b(new|updated|changed) (bank details|bank account|banking details|account details|iban|sort code|account number)\b/,
      /\b(changed|switched|moved|changing) (banks?|our bank|bank accounts?)\b/,
    ],
  },
  code: {
    label: "A request for a code",
    explanation:
      "A code received by text or in an app is there to prove it's you. Anyone who asks you for it — bank, support, relative — is trying to pass themselves off as you. No service ever asks for this code.",
    patterns: [
      /\b(share|send|give|read|tell|forward|confirm|provide)\w*[^.\n]{0,40}\bcode\b/,
      /\bcode\b[^.\n]{0,40}\b(you (just |have just )?received|we (just )?sent|sent to you|by (text|sms))\b/,
      // Not « security code »: in English that is the card's CVV.
      /\b(verification|confirmation|validation|activation|one-time|one time|access) (code|pin)\b/,
    ],
  },
  identifiants: {
    label: "A request to sign in or give personal information",
    explanation:
      "“Confirm your details”, “log in”: the link leads to a copy of the login page, and what you type there goes to the sender. To sign in, use the app or a bookmark, never the link in a message.",
    patterns: [
      /\bpasswords?\b/,
      /\b(credentials|login details|sign-in details)\b/,
      /\b(log|sign) ?in (now|here|to (your|confirm|verify))\b/,
      /\b(confirm|verify|update|validate|complete)\w* (your) (information|details|data|identity|account|credentials|profile)\b/,
    ],
  },
  gain: {
    label: "Unexpected good news",
    explanation:
      "Refund, prize, gift: good news doesn't trigger suspicion, which is what makes it useful. A real refund appears in your official account, and a prize for a game you never entered doesn't exist.",
    patterns: [
      /\bcongratulations\b/,
      /\byou('ve| have)? (won|been selected|been chosen)\b/,
      /\bwinner\b/,
      /\b(refund|tax rebate|overpayment|reimbursement|compensation)s?\b/,
      /\bclaim your (prize|reward|gift|refund|winnings)\b/,
    ],
  },
  autorite: {
    label: "An organization or an authority",
    explanation:
      "The name of a bank, a government agency or the police cuts questions short: people don't dare check. Anyone can copy that name. Check by contacting the organization yourself, on a number or website you already know.",
    patterns: [
      /\b(tax (office|authority|department)|revenue service|government|ministry|police|court|customs|social security|benefits office|administration)\b/,
      /\b(fraud (department|team)|security (department|team)|customer service|collections department)\b/,
      /\b(your bank|bank advisor|account manager)\b/,
    ],
  },
  proche: {
    label: "A relative who changed number",
    explanation:
      "“It's me, I've got a new number” followed by a request for money is the relative-impersonation scenario. Call the person on their old number before anything else: that's the check that settles it.",
    patterns: [
      /\b(new number|changed (my )?number|my old number)\b/,
      /\bmy (phone|mobile|cell) (is|got|was) (broken|lost|stolen|dead|damaged)\b/,
      /\b(broke|lost|dropped|smashed) my (phone|mobile|cell)\b/,
      /\bit's me\b/,
      /\b(mum|mom|mummy|mommy|dad|daddy|grandma|grandpa|nan|nana)\b/,
    ],
  },
  secret: {
    label: "A request for discretion",
    explanation:
      "“Don't tell anyone” isolates you: the person who could tell you in ten seconds that it's a scam is exactly the one you're asked not to tell. A confidential request for money is always worth checking.",
    patterns: [
      /\bconfidential\w*/,
      /\b(discretion|discreet)\b/,
      /\b(don't|do not) (tell|mention|say)\b[^.\n]{0,25}\b(anyone|anybody|the team|dad|mum|mom|your)\b/,
      /\bkeep (this|it) (between us|to yourself|quiet|secret)\b/,
      /\bbetween us\b/,
    ],
  },
  rappel: {
    label: "A number to call",
    explanation:
      "The number given in the message leads to the sender, not to the organization. If it's premium-rate, the call itself costs you. To reach an organization, use the number on your card, your contract or its official website.",
    patterns: [
      /\b(call|ring|phone|dial|contact)\b[^.\n]{0,40}(\+?\d[\d .-]{3,})/,
    ],
  },
  colis: {
    label: "A parcel or a delivery",
    explanation:
      "These messages are sent in bulk: some recipients are bound to be expecting a parcel. Always tie the message to a tracking number you already have, on the carrier's website opened by yourself.",
    patterns: [
      /\b(parcel|package|delivery|courier|redelivery|tracking number|pick-?up point|missed delivery)\b/,
    ],
  },
  amende: {
    label: "A fine or a penalty notice",
    explanation:
      "A sum to pay quickly, or else a surcharge, is the fake-fine scenario. In France, penalty notices arrive by post, not by text with a link. Look the notice up on the official fine-payment website, opened by yourself, with the notice number.",
    patterns: [
      /\b(parking|speeding|traffic|toll|unpaid) (ticket|fine|charge|violation|offence|offense|notice)\b/,
      /\bpenalty (notice|charge)\b/,
      /\b(fine|ticket) (is )?(unpaid|outstanding|overdue)\b/,
      /\bunpaid (fine|toll|ticket)\b/,
    ],
  },
  logement: {
    label: "A home to book from a distance",
    explanation:
      "A low rent, a landlord abroad, keys sent after a transfer: a real home can be viewed before you pay anything, and its owner can be met or at least reached by phone.",
    patterns: [
      /\b(rent|deposit|apartment|flat|house|room|rental|property)\b[^.\n]{0,80}\b(transfer|pay|send|reserve|keys)\b/,
    ],
  },
  "carte-sim": {
    label: "A SIM card change",
    explanation:
      "If you didn't ask for anything, someone is having your number moved to their card to receive your security codes. Call your carrier immediately, on the number in your contract or on its website, to block the line.",
    patterns: [/\b(sim card|new sim|esim|e-sim|sim swap)\b/],
  },
  "adresse-secours": {
    label: "A change of recovery address or number",
    explanation:
      "The recovery address is what lets someone take back an account. If it changes without you, someone is preparing to reset your password. Sign in yourself straight away and undo the change in the security settings.",
    patterns: [
      /\b(recovery|backup|secondary) (email|e-mail|address|phone|number)\b/,
    ],
  },
  deblocage: {
    label: "A payment to “release”",
    explanation:
      "Receiving money never requires you to “release” anything, or to sign in to your bank from a link. A payment you've received shows up in your online banking, opened by yourself.",
    patterns: [
      /\b(release|unlock|unblock|free up|claim) (the |your )?(funds|payment|money|winnings|transfer)\b/,
    ],
  },
  facture: {
    label: "An invoice to pay",
    explanation:
      "An unexpected invoice, for a modest amount, with a payment link, counts on nobody checking small sums. Match it against a real order and check with the provider, from your own account.",
    patterns: [
      /\b(invoice|renewal|subscription)\b[^.\n]{0,40}\b(pay|payment|due|settle|outstanding|overdue)\b/,
      /\binvoice (no|number|#)\.?\s?\w+/,
    ],
  },
  compte: {
    label: "An alert about your account",
    explanation:
      "A sign-in or suspicious-activity alert may be genuine, or imitated to make you click. Either way, the answer is the same: open the service's app or website yourself and look at the sign-in history.",
    patterns: [
      /\b(unusual|suspicious|unauthori[sz]ed|fraudulent) (sign-?in|login|log-?in|activity|access|attempt|transaction)s?\b/,
      /\b(sign-?in|login|log-?in) attempts?\b/,
      /\b(new|unknown|unrecogni[sz]ed) device\b/,
      /\baccount (has been |was )?(compromised|hacked|locked)\b/,
    ],
  },
  placement: {
    label: "An investment or a return",
    explanation:
      "High return and zero risk never go together. Before paying anything in, check that the firm is authorized by the financial regulator, and never pay to get money back.",
    patterns: [
      /\b(investment|invest\w*|trading|portfolio|yield)\b/,
      /\b(guaranteed|risk-free|risk free) (returns?|profits?|income|gains?)\b/,
      /\b\d+ ?% (guaranteed|per (day|week|month|year)|a (day|week|month|year))\b/,
    ],
  },
  emploi: {
    label: "A job or task offer",
    explanation:
      "An easy, well-paid job offered without an interview often hides fees to pay upfront, a request for ID documents, or the use of your bank account. A real employer never makes you pay.",
    patterns: [
      /\b(job offer|we are hiring|we're hiring|recruit\w+|position (available|open)|work from home|remote job|easy (job|money)|paid tasks?)\b/,
    ],
  },
  "acces-distance": {
    label: "A request to install an app or take control",
    explanation:
      "Installing a remote-access app gives the other person control of your device, and of whatever you open on it — including your bank. No support team contacts you to get you to install it.",
    patterns: [
      /\b(anydesk|teamviewer|quicksupport|remote (access|control|desktop|support))\b/,
      /\b(install|download)\w* (the|this) (app|application|software|program)\b/,
    ],
  },
  chantage: {
    label: "Blackmail over images or data",
    explanation:
      "“I have videos of you”, “I'll publish your data”: these messages are often sent in bulk, with nothing real behind them. Don't pay, don't reply, keep screenshots, and change the password if one is quoted.",
    patterns: [
      /\b(webcam|recorded you|filmed you|videos? of you|photos? of you|pictures? of you|your (photos|videos|pictures))\b/,
      /\b(publish|leak|release|send|share)\w*[^.\n]{0,30}\b(to (all )?your contacts|your data|your photos|the video)\b/,
    ],
  },
};

export const LINK_SIGNAL_EN = {
  label: "A link to open",
  explanation:
    "The link is the path the sender chose for you. Even if the address looks right, to sign in or pay, use the official app or a bookmark. The reading of the address below says who it belongs to, not whether the site is honest.",
};

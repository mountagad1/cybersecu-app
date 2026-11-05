import type { PsychologicalTriggerCode } from "@/domain/scenario/types";
import type { LeverTranslation } from "./types";

/**
 * English translations of the psychological levers, keyed by lever code.
 * Same fields as the French entry; identity, publication and dates stay on
 * the French entry. No statistic, no named body: the French text names
 * none either.
 */
export const LEVERS_EN: Readonly<
  Record<PsychologicalTriggerCode, LeverTranslation>
> = {
  urgency: {
    slug: "urgency",
    name: "Urgency",
    plainLanguageDefinition:
      "You are given too little time to think. It is not a scheduling accident: the deadline is chosen so that you decide before you have been able to check.",
    definition:
      "Urgency is the deliberate shortening of the time between receiving a request and making a decision, in order to prevent any independent check.",
    whyItWorks:
      "Deciding fast and deciding well are two different modes, and we cannot be in both at once. Under time pressure, attention goes to what has to be done rather than to whether the request is legitimate — a shift we don't notice, because we feel we are thinking normally. Urgency doesn't even need to be believable: it only has to be there for checking to come after acting instead of before.",
    howToResist:
      "Make slowness automatic rather than voluntary: a rule decided in advance — no payment, no code, no login in the ten minutes after a request — holds where good intentions give way. A legitimate request always survives ten minutes; that is even the best practical definition of a legitimate request.",
    counterQuestion:
      "What actually happens if I wait an hour before doing this?",
  },
  fear: {
    slug: "fear",
    name: "Fear",
    plainLanguageDefinition:
      "You are told that something serious is happening or about to happen. Fear fills your mind, and meanwhile it is the other person who offers the solution.",
    definition:
      "Fear is the announcement of a dreaded consequence — losing money, a penalty, legal action, an exposure — presented as imminent and avoidable through a specific action the attacker points to.",
    whyItWorks:
      "A believable threat draws attention to itself: we try to ward off the danger, not to examine who is announcing it. The technique is all the more effective because it immediately provides a way out, turning a distressing situation into a task to carry out — and carrying it out brings relief. It is that relief, not gullibility, that makes people act. Its harshest form is shock: a serious accusation pushes people to clear their name rather than to check.",
    howToResist:
      "Separate the two moments: acknowledge the risk, then choose how to check it. The solution offered by the person announcing the danger is never the only one, and that is exactly the point to test. Reach the organization concerned through a route you chose, without using anything you were given.",
    counterQuestion:
      "Who is telling me about this danger, and why does the solution come from the same person?",
  },
  authority: {
    slug: "authority",
    name: "Authority",
    plainLanguageDefinition:
      "The other person presents themselves as someone you don't argue with: the bank, the government, the police, management. You obey before checking who is speaking.",
    definition:
      "Authority is borrowing an institutional or hierarchical position in order to get something done quickly and to make checking socially costly.",
    whyItWorks:
      "We constantly delegate our judgment to roles, and that works: asking every person for proof would make life unbearable. The attacker borrows that shortcut. Their added advantage is that checking an authority seems rude or suspicious — the brake is not cognitive but social, which makes it harder to overcome than an ordinary doubt. The markers of authority, meanwhile, can all be copied: a logo, a tone, a displayed number, an address.",
    howToResist:
      "Make checking impersonal to take the social weight out of it: “I'll call you back on the official number” accuses no one and needs no justification. A real authority always accepts being called back — that is even the one thing that sets it apart from a borrowed one.",
    counterQuestion:
      "Am I hesitating because it's doubtful, or because I don't dare ask?",
  },
  trust: {
    slug: "trust",
    name: "Trust",
    plainLanguageDefinition:
      "What reaches you looks like what you know: the name of someone close, your bank's logo, an almost exact address. The resemblance stands in for proof.",
    definition:
      "Trust is the exploitation of the signs by which we usually recognize who we are dealing with — display name, visual identity, address, conversation history — signs that can all be reproduced.",
    whyItWorks:
      "We almost never authenticate: we recognize. It is a necessary shortcut, since checking every message would be impractical, and it works because most messages are genuine. The attacker breaks nothing: they manufacture the signs of recognition. A sender name is a free-text field, a text message label can be chosen, a caller's number can be spoofed, a profile photo can be copied. The hardest case is when the trust is real — a genuine account that has been compromised — because then no sign is false.",
    howToResist:
      "Check the channel rather than the content: take another route. Calling a number you already had, opening the official app, using a bookmark — these steps need no expertise and work even when the message is perfectly imitated.",
    counterQuestion:
      "Do I recognize this person, or only the signs that point to them?",
  },
  social_pressure: {
    slug: "social-pressure",
    name: "Social pressure",
    plainLanguageDefinition:
      "You are put in a situation where saying no seems out of place: not helping someone close, keeping a manager waiting, letting down someone who is counting on you.",
    definition:
      "Social pressure is the use of an interpersonal relationship — an emotional bond, hierarchy, reciprocity, the eyes of a group — to make refusing costly regardless of whether the request is justified.",
    whyItWorks:
      "The cost of refusing is immediate and paid in front of someone; the cost of a mistake is deferred and abstract. Between the two, we almost always choose to avoid the first. Two forms keep coming back: the request for discretion, which isolates you by forbidding you to talk to the person who would settle it in ten seconds; and the sense of debt, when a favor was done first. The technique targets politeness, not gullibility, which is why it works on well-informed people.",
    howToResist:
      "Bring a third person into the loop: it is exactly what the request is trying to prevent, and so it is what defuses it. An instruction to keep a request for money or access secret is, on its own, reason enough to check.",
    counterQuestion:
      "Am I agreeing because it's justified, or because refusing would be awkward?",
  },
  reward: {
    slug: "reward",
    name: "Reward",
    plainLanguageDefinition:
      "You are given good news: a refund, a prize, an offer. Good news doesn't trigger suspicion — which is exactly what makes it useful to the attacker.",
    definition:
      "Reward is the announcement of a gain — money owed, a prize, a benefit, an opportunity — that requires an action from the victim to obtain.",
    whyItWorks:
      "We have learned to be wary of threats, much less of gifts. A pleasant announcement sets off no alarm: we try to obtain rather than to check, and attention goes to the steps to take. The prospect of a gain also makes acceptable what would otherwise be absurd — giving a full card number in order to receive money, for example, an inconsistency that good humor lets through.",
    howToResist:
      "Apply the same check to a gain as to a threat, and remember a rule that settles almost every case: receiving money never requires paying any first, nor providing anything other than your bank account details (IBAN). A real refund appears in your official account, where you can go and see it.",
    counterQuestion:
      "Why does this process need something from me if I'm the one receiving?",
  },
  financial_incentive: {
    slug: "lure-of-profit",
    name: "The lure of profit",
    plainLanguageDefinition:
      "A financial opportunity that is too good to be true, presented as reserved for those in the know. It is not greed that makes people give in: it is the fear of missing out.",
    definition:
      "The lure of profit is the promise of a disproportionate return, discount or income, kept up over time rather than delivered in a single message.",
    whyItWorks:
      "Where a reward is a one-off piece of good news, the lure of profit settles in: it builds a relationship, shows results, sometimes allows a small withdrawal. That apparent proof is the heart of the technique, because it turns doubt into trust and justifies far larger payments. Commitment adds to it: once money has been invested, giving up means accepting a loss, which we do very badly — and each new payment is justified by the previous ones.",
    howToResist:
      "Check the firm before the product: the public registers of firms authorized to offer investments can be consulted in a few minutes, and that check happens before the first payment, not after. Remember that a guaranteed high return does not exist — return and risk go together — and that you should never pay to get money back.",
    counterQuestion:
      "If it's so profitable and risk-free, why do they need my money?",
  },
  curiosity: {
    slug: "curiosity",
    name: "Curiosity",
    plainLanguageDefinition:
      "A file, a link or a found object you just want to see the contents of. Looking seems harmless — and that “just looking” is all it takes.",
    definition:
      "Curiosity is the exploitation of the need to resolve an uncertainty: content whose nature is not known until it has been opened.",
    whyItWorks:
      "Incomplete information creates a tension we want to resolve, and opening seems harmless because it seems reversible: you can always close it. That is false for a file that runs, a device that is plugged in or a link that is opened, where the action happens on opening. The technique is all the more effective because it needs no story: no urgency, no authority, no relationship — so none of the warning signs people have learned to spot.",
    howToResist:
      "Treat “just looking” as an action, not an observation. A storage device you find is handed to the relevant department rather than examined; a link is opened after reading the domain, not before; an unexpected file is checked with its supposed sender, through another channel.",
    counterQuestion: "What does it cost me never to know what was inside?",
  },
  scarcity: {
    slug: "scarcity",
    name: "Scarcity",
    plainLanguageDefinition:
      "Only two left, the offer ends in nine minutes, the apartment will be gone tomorrow. Announced scarcity doesn't need to be real to work: it only has to be displayed, and it serves to prevent comparison.",
    definition:
      "Scarcity is the announced limitation of a quantity or a period of time, meant to get a decision made before any comparison with the available alternatives.",
    whyItWorks:
      "Something available in small numbers seems more desirable, and the fear of missing out weighs more than the hope of getting it. It differs from urgency in what it prevents: urgency removes the time to check legitimacy, scarcity removes the time to compare offers. It is also the most commonplace — online retail uses it lawfully all the time — which makes it almost invisible where it is fraudulent. A genuinely tight market, such as rentals, provides a free version that the attacker only has to use.",
    howToResist:
      "Let it expire once to see: fake countdowns reset, and a real offer comes back. Decide on criteria that don't depend on time — is the seller identifiable, can the payment method be disputed — because they are the only ones pressure doesn't distort.",
    counterQuestion:
      "Am I choosing this offer, or am I just running from the idea of missing it?",
  },
};

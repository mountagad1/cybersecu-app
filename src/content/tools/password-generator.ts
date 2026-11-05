import type { Locale } from "@/domain/i18n/locale";
import { passphraseEntropy, passwordEntropy } from "@/domain/password/entropy";
import { LENGTH, WORDS } from "@/domain/password/options";

/**
 * What the password generator page explains, rendered on the server in
 * both languages. Every figure is computed from the generator's own
 * functions, not written by hand, so the text cannot drift from the tool.
 *
 * The line it follows is the site's (guide « Comment un mot de passe est
 * réellement volé ») : a password is stolen by reuse, a fake page or
 * malware, not by guessing. A generator's real job is to make a different
 * password for every account easy; its length only closes the one path
 * attackers rarely take.
 */

const bits = (n: number) => Math.floor(n);
/** 20 characters, all four classes (94 characters), each class required. */
const PASSWORD_BITS = bits(passwordEntropy([26, 26, 10, 32], LENGTH.default, true));
/** 8 lower-case letters only: the « short and simple » counter-example. */
const SHORT_BITS = bits(passwordEntropy([26], 8, false));
const PHRASE_BITS = bits(passphraseEntropy(7776, WORDS.default));
const BITS_PER_WORD = passphraseEntropy(7776, 1);

export interface Section {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface NextStep {
  text: string;
  /** French slug of the guide that explains the step, resolved per language by the page. */
  guideSlug?: string;
  linkLabel?: string;
  /** French slug of a tool that does the step. */
  toolSlug?: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface PasswordGeneratorContent {
  h1: string;
  intro: string;
  privacy: string;
  /** « En bref »: the answer to « how do I make a strong password », on its own. */
  summaryHeading: string;
  summary: string;
  /** What to do once the password is copied: where the visitor goes next. */
  nextHeading: string;
  nextSteps: NextStep[];
  faqHeading: string;
  faq: FaqEntry[];
  sections: Section[];
  /** What the tool does not do. */
  limitsHeading: string;
  limits: string[];
  guidesHeading: string;
  attacksHeading: string;
}

export const PASSWORD_GENERATOR_CONTENT: Record<Locale, PasswordGeneratorContent> = {
  fr: {
    h1: "Générateur de mot de passe",
    intro:
      "Un mot de passe ou une phrase de passe tirés au hasard, dans votre navigateur, à copier dans le compte qui en a besoin. Le plus utile n'est pas sa longueur : c'est d'en avoir un différent pour chaque compte.",
    privacy:
      "Le tirage se fait sur votre appareil. Le mot de passe n'est envoyé à aucun serveur, n'est enregistré nulle part et n'apparaît jamais dans l'adresse de la page.",
    summaryHeading: "En bref",
    summary: `Un bon mot de passe est tiré au hasard, pas inventé : ${LENGTH.default} caractères aléatoires, ou ${WORDS.default} mots au hasard s'il faut le retenir. Et surtout, un mot de passe différent pour chaque compte, gardé dans un gestionnaire de mots de passe, avec la double authentification activée là où elle existe.`,
    nextHeading: "Après la copie",
    nextSteps: [
      {
        text: "Collez le mot de passe dans le site, puis enregistrez-le dans votre gestionnaire de mots de passe (celui du navigateur ou du téléphone convient) avant de quitter cette page : elle ne garde rien.",
      },
      {
        text: "Activez la double authentification sur ce compte : un mot de passe, même parfait, peut être saisi sur une fausse page.",
        guideSlug: "activer-la-double-authentification",
        linkLabel: "Activer la double authentification",
      },
      {
        text: "Si l'ancien mot de passe servait ailleurs, changez-le aussi sur ces comptes, en commençant par votre messagerie.",
        guideSlug: "comment-un-mot-de-passe-est-vole",
        linkLabel: "Comment un mot de passe est réellement volé",
      },
      {
        text: "Vous changez de mot de passe parce que vous l'avez saisi sur une page suspecte ? Suivez les autres gestes dans l'ordre.",
        toolSlug: "j-ai-clique",
        linkLabel: "Que faire après un lien ou un message frauduleux",
      },
    ],
    faqHeading: "Questions fréquentes",
    faq: [
      {
        question: "Ce générateur de mot de passe est-il sûr ?",
        answer:
          "Le tirage se fait dans votre navigateur, avec son générateur aléatoire cryptographique (crypto.getRandomValues). Le mot de passe n'est envoyé à aucun serveur, n'est pas enregistré et n'apparaît pas dans l'adresse : aucune requête de la page ne le contient (en mode phrase de passe, seule la liste de mots est chargée depuis ce site). Comme toute page web, il ne protège pas un appareil déjà infecté par un logiciel espion.",
      },
      {
        question: "Quelle longueur de mot de passe choisir ?",
        answer: `La valeur par défaut, ${LENGTH.default} caractères de tous types, donne ${PASSWORD_BITS} bits de hasard : bien au-delà de ce qu'une attaque par essais successifs peut parcourir. Si un site limite la longueur ou refuse certains symboles, prenez le maximum qu'il accepte et décochez les symboles. Pour un mot de passe à retenir de tête, préférez une phrase de passe de ${WORDS.default} mots.`,
      },
      {
        question: "Mot de passe ou phrase de passe : que choisir ?",
        answer:
          "Pour les comptes enregistrés dans un gestionnaire, un mot de passe aléatoire : vous ne le taperez jamais. Pour les rares secrets à retenir ou à taper souvent — le mot de passe du gestionnaire, la session de l'ordinateur —, une phrase de passe : plus longue, mais plus facile à mémoriser et à saisir.",
      },
      {
        question: "Faut-il changer ses mots de passe régulièrement ?",
        answer:
          "Pas sans raison. Changez un mot de passe quand il a fuité, quand vous l'avez saisi sur une page suspecte, ou quand il sert sur plusieurs comptes. Les recommandations actuelles, comme celles du NIST américain (publication SP 800-63B), ne demandent plus de changement périodique, qui pousse à choisir des variantes prévisibles.",
      },
      {
        question: "Pourquoi l'outil ne vérifie-t-il pas mon mot de passe actuel ?",
        answer:
          "Parce qu'il ne faut jamais taper un vrai mot de passe dans une page qui n'est pas celle du service. Ce site ne vous le demandera jamais : il vous aide à en créer un nouveau, pas à tester l'ancien.",
      },
    ],
    sections: [
      {
        id: "longueur",
        heading: "Longueur et hasard : ce qui rend un mot de passe imprévisible",
        paragraphs: [
          "Un mot de passe est difficile à deviner quand il a été tiré au hasard parmi un très grand nombre de possibilités. Ce nombre se compte en bits : chaque bit double le nombre de mots de passe qu'il faudrait essayer.",
          `Ajouter un caractère multiplie les possibilités par la taille de l'alphabet ; ajouter un type de caractères n'élargit l'alphabet qu'une fois. La longueur pèse donc plus que la variété : 8 minuscules tirées au hasard donnent ${SHORT_BITS} bits, ${LENGTH.default} caractères pris parmi les 94 caractères ASCII imprimables (lettres sans accent, chiffres, symboles) en donnent ${PASSWORD_BITS}.`,
          "Le hasard compte autant que la longueur. Un mot de passe choisi par une personne — un prénom, une date, un mot suivi de « ! » — suit des habitudes que les outils d'attaque essaient en premier. Ce générateur utilise le générateur aléatoire sécurisé du navigateur, et chaque mot de passe possible a exactement la même probabilité d'être tiré.",
        ],
      },
      {
        id: "phrase-de-passe",
        heading: "Phrase de passe : des mots au lieu de caractères",
        paragraphs: [
          `Une phrase de passe enchaîne des mots tirés au hasard dans une liste fixe. Chaque mot pris parmi 7 776 apporte ${BITS_PER_WORD.toFixed(1)} bits : ${WORDS.default} mots en donnent ${PHRASE_BITS}. Elle est plus longue qu'un mot de passe de même force, mais se tape plus facilement sur un téléphone ou une télévision, et se retient mieux.`,
          "Le hasard doit venir du tirage, pas de vous : une phrase que vous inventez, même longue, ou une citation connue, est bien plus prévisible. La liste utilisée ici est celle de l'Electronic Frontier Foundation : ses mots sont en anglais.",
          "Une phrase de passe convient bien aux quelques secrets que vous devez retenir de tête : le mot de passe principal d'un gestionnaire, la session de votre ordinateur.",
        ],
      },
      {
        id: "unicite",
        heading: "Un mot de passe différent pour chaque compte",
        paragraphs: [
          "Quand un site se fait voler sa base d'identifiants, les adresses email et mots de passe circulent, puis sont essayés automatiquement sur d'autres services. Un mot de passe très long n'y change rien s'il sert ailleurs : il est déjà connu.",
          "C'est le premier usage d'un générateur : produire un mot de passe neuf pour chaque compte, au lieu d'en recycler un. Si l'un fuit, il n'ouvre que le compte où il a fuité.",
        ],
      },
      {
        id: "gestionnaire",
        heading: "Un gestionnaire de mots de passe pour les retenir",
        paragraphs: [
          "Personne ne retient des dizaines de mots de passe aléatoires. Un gestionnaire de mots de passe les garde dans un coffre chiffré, et la plupart les génèrent eux-mêmes, y compris ceux intégrés aux navigateurs et aux téléphones.",
          "Il protège aussi contre les fausses pages : en général, il ne propose de remplir un mot de passe que sur le site pour lequel il a été enregistré. S'il ne propose rien sur une page qui ressemble pourtant à votre banque, c'est un signal à prendre au sérieux.",
          "Ce générateur ne garde rien : copiez le résultat directement dans votre gestionnaire ou dans le formulaire du site, puis enregistrez-le.",
        ],
      },
      {
        id: "double-authentification",
        heading: "Double authentification et clés d'accès",
        paragraphs: [
          "Un mot de passe, même parfait, peut être saisi sur une fausse page ou récolté par un logiciel espion. La double authentification ajoute une seconde preuve — une application, une clé physique, un code — qui manque à celui qui n'a que le mot de passe. Le SMS est la forme la plus faible : le numéro lui-même peut être détourné.",
          "Les clés d'accès (« passkeys ») remplacent le mot de passe par une clé cryptographique gardée par votre appareil ou votre gestionnaire de mots de passe, et déverrouillée par votre empreinte, votre visage ou votre code. Elles sont liées au vrai site : une fausse page ne peut pas s'en servir. Quand un service les propose, c'est en général l'option la plus sûre.",
        ],
      },
      {
        id: "entropie",
        heading: "Ce que le nombre de bits ne dit pas",
        paragraphs: [
          "Le chiffre affiché mesure le tirage, pas la sécurité de votre compte. Il vaut si vous utilisez le résultat tel quel : modifié à la main, raccourci ou complété d'un mot à vous, il ne s'applique plus.",
          "Il ne protège pas d'une fuite chez un service, d'une fausse page de connexion, d'un logiciel espion ou d'un appel où l'on vous demande votre code. Ces voies n'ont pas besoin de deviner. C'est pour cela que cet outil n'affiche ni jauge « fort / faible » ni « temps pour craquer » : ils promettent une protection qu'aucune longueur ne donne.",
        ],
      },
      {
        id: "fonctionnement",
        heading: "Comment fonctionne l'outil",
        paragraphs: [
          "Chaque caractère ou mot est tiré avec crypto.getRandomValues, le générateur aléatoire cryptographique du navigateur, jamais avec Math.random. Les valeurs qui fausseraient la répartition sont écartées et retirées, pour qu'aucun caractère ne soit favorisé par le calcul.",
          "Avec l'option « au moins un caractère de chaque type », un tirage qui n'en contient pas est écarté en entier et recommencé, plutôt que corrigé : tous les mots de passe valides restent également probables, et le nombre de bits affiché est calculé exactement pour ce cas. Si vous demandez plusieurs propositions, ce nombre est réduit de ce que votre choix peut révéler.",
          "Rien n'est envoyé, rien n'est conservé : fermer ou recharger la page efface tout. Le presse-papiers n'est utilisé que si vous cliquez sur « Copier » — et ce que vous copiez peut y rester, ou être synchronisé avec vos autres appareils si votre système le fait.",
        ],
      },
    ],
    limitsHeading: "Ce que l'outil ne fait pas",
    limits: [
      "Il ne vérifie pas si un mot de passe a déjà fuité, et ne demande jamais le vôtre.",
      "Il ne garde aucun historique : notez ou enregistrez le résultat avant de quitter la page.",
      "Il ne protège pas un appareil déjà infecté : un logiciel espion peut lire l'écran ou le presse-papiers.",
    ],
    guidesHeading: "Pour aller plus loin",
    attacksHeading: "Les attaques contre les mots de passe",
  },
  en: {
    h1: "Password generator",
    intro:
      "A random password or passphrase, drawn in your browser, to copy into the account that needs it. What matters most is not its length: it is having a different one for every account.",
    privacy:
      "The draw happens on your device. The password is not sent to any server, is not stored anywhere and never appears in the page's address.",
    summaryHeading: "In short",
    summary: `A good password is drawn at random, not made up: ${LENGTH.default} random characters, or ${WORDS.default} random words if you have to remember it. Above all, a different password for every account, kept in a password manager, with two-factor authentication turned on wherever it exists.`,
    nextHeading: "After copying",
    nextSteps: [
      {
        text: "Paste the password into the site, then save it in your password manager (the one in your browser or phone will do) before leaving this page: it keeps nothing.",
      },
      {
        text: "Turn on two-factor authentication for this account: a password, however good, can be typed on a fake page.",
        guideSlug: "activer-la-double-authentification",
        linkLabel: "Turn on two-factor authentication",
      },
      {
        text: "If the old password was used elsewhere, change it on those accounts too, starting with your email.",
        guideSlug: "comment-un-mot-de-passe-est-vole",
        linkLabel: "How passwords really get stolen",
      },
      {
        text: "Changing your password because you typed it on a suspicious page? Follow the other steps in order.",
        toolSlug: "j-ai-clique",
        linkLabel: "What to do after a scam link or message",
      },
    ],
    faqHeading: "Frequently asked questions",
    faq: [
      {
        question: "Is this password generator safe?",
        answer:
          "The draw happens in your browser, with its cryptographic random generator (crypto.getRandomValues). The password is not sent to any server, is not stored and does not appear in the address: no request the page makes contains it (in passphrase mode, only the wordlist is loaded from this site). Like any web page, it does not protect a device already infected by spyware.",
      },
      {
        question: "How long should a password be?",
        answer: `The default, ${LENGTH.default} characters of every type, gives ${PASSWORD_BITS} bits of randomness: far beyond what an attack trying guesses one after another can cover. If a site limits the length or refuses some symbols, take the most it accepts and uncheck symbols. For a password to remember by heart, prefer a passphrase of ${WORDS.default} words.`,
      },
      {
        question: "Password or passphrase: which should I choose?",
        answer:
          "For accounts saved in a password manager, a random password: you will never type it. For the few secrets you must remember or type often — the manager's own password, your computer's login — a passphrase: longer, but easier to remember and to type.",
      },
      {
        question: "Should I change my passwords regularly?",
        answer:
          "Not without a reason. Change a password when it has leaked, when you typed it on a suspicious page, or when it is used on several accounts. Current guidance, such as the US NIST's (publication SP 800-63B), no longer asks for periodic changes, which push people towards predictable variations.",
      },
      {
        question: "Why doesn't the tool check my current password?",
        answer:
          "Because you should never type a real password into a page that is not the service's own. This site will never ask you to: it helps you create a new one, not test the old one.",
      },
    ],
    sections: [
      {
        id: "length",
        heading: "Length and randomness: what makes a password unpredictable",
        paragraphs: [
          "A password is hard to guess when it was drawn at random from a very large number of possibilities. That number is counted in bits: each bit doubles the number of passwords someone would have to try.",
          `Adding a character multiplies the possibilities by the size of the alphabet; adding a type of character widens the alphabet only once. Length therefore weighs more than variety: 8 random lowercase letters give ${SHORT_BITS} bits, ${LENGTH.default} characters drawn from the 94 printable ASCII characters (letters, digits, symbols) give ${PASSWORD_BITS}.`,
          "Randomness counts as much as length. A password a person picks — a name, a date, a word followed by “!” — follows habits that attack tools try first. This generator uses the browser's secure random generator, and every possible password has exactly the same chance of being drawn.",
        ],
      },
      {
        id: "passphrase",
        heading: "Passphrases: words instead of characters",
        paragraphs: [
          `A passphrase strings together words drawn at random from a fixed list. Each word drawn from 7,776 adds ${BITS_PER_WORD.toFixed(1)} bits: ${WORDS.default} words give ${PHRASE_BITS}. It is longer than a password of the same strength, but easier to type on a phone or a TV, and easier to remember.`,
          "The randomness must come from the draw, not from you: a phrase you make up, however long, or a well-known quote, is far more predictable. The list used here is the Electronic Frontier Foundation's.",
          "A passphrase suits the few secrets you have to remember by heart: a password manager's main password, your computer's login.",
        ],
      },
      {
        id: "unique",
        heading: "A different password for every account",
        paragraphs: [
          "When a site has its login database stolen, the email addresses and passwords circulate, then get tried automatically on other services. A very long password changes nothing if it is used elsewhere: it is already known.",
          "That is a generator's first job: a fresh password for every account, instead of a recycled one. If one leaks, it only opens the account it leaked from.",
        ],
      },
      {
        id: "manager",
        heading: "A password manager to remember them",
        paragraphs: [
          "Nobody remembers dozens of random passwords. A password manager keeps them in an encrypted vault, and most generate them too, including those built into browsers and phones.",
          "It also protects against fake pages: as a rule, it only offers to fill a password on the site it was saved for. If it offers nothing on a page that looks like your bank, take that seriously.",
          "This generator keeps nothing: copy the result straight into your manager or the site's form, then save it.",
        ],
      },
      {
        id: "two-factor",
        heading: "Two-factor authentication and passkeys",
        paragraphs: [
          "A password, however good, can be typed on a fake page or harvested by spyware. Two-factor authentication adds a second proof — an app, a physical key, a code — that someone holding only the password lacks. SMS is the weakest form: the phone number itself can be hijacked.",
          "Passkeys replace the password with a cryptographic key kept by your device or your password manager, and unlocked by your fingerprint, face or PIN. They are bound to the real site: a fake page cannot use them. When a service offers them, they are usually the safest option.",
        ],
      },
      {
        id: "entropy",
        heading: "What the number of bits does not tell you",
        paragraphs: [
          "The figure shown measures the draw, not the security of your account. It holds if you use the result exactly as generated: edited by hand, shortened or padded with a word of your own, it no longer applies.",
          "It does not protect against a leak at a service, a fake login page, spyware or a call asking for your code. Those paths do not need to guess. That is why this tool shows no “strong / weak” gauge and no “time to crack”: they promise a protection no length provides.",
        ],
      },
      {
        id: "how-it-works",
        heading: "How the tool works",
        paragraphs: [
          "Each character or word is drawn with crypto.getRandomValues, the browser's cryptographic random generator, never with Math.random. Values that would skew the distribution are discarded and redrawn, so the arithmetic favours no character.",
          "With “at least one character of each type”, a draw that lacks one is discarded whole and redrawn rather than patched: every valid password stays equally likely, and the number of bits shown is computed exactly for that case. If you ask for several suggestions, that number is reduced by what your choice can reveal.",
          "Nothing is sent, nothing is kept: closing or reloading the page erases everything. The clipboard is used only when you click “Copy” — and what you copy may stay there, or be synced to your other devices if your system does that.",
        ],
      },
    ],
    limitsHeading: "What the tool does not do",
    limits: [
      "It does not check whether a password has already leaked, and never asks for yours.",
      "It keeps no history: write down or save the result before leaving the page.",
      "It does not protect a device that is already infected: spyware can read the screen or the clipboard.",
    ],
    guidesHeading: "Further reading",
    attacksHeading: "Attacks on passwords",
  },
};

/**
 * Fiches the page links to, by code. Kept out of the tool's
 * `relatedAttackCodes` on purpose: that field also puts the tool on the
 * fiches themselves, which are frozen until 2026-11-24 for EXP-020
 * (docs/growth/EXPERIMENT_LOG.md). To be moved there after that date.
 */
export const PASSWORD_ATTACK_CODES = ["ACCT-000001", "ACCT-000005", "ACCT-000006", "ACCT-000002"] as const;

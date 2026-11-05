import type { AttackEntry } from "./types";
import { VERIFIED_REFERENCES as REF } from "./types";

/** Attaques de sites et navigateurs — see ingenierie-sociale.ts for the content rules. */
export const SITES_ET_NAVIGATEURS: AttackEntry[] = [
  {
    code: "IDN-000001",
    slug: "typosquatting",
    name: "Typosquatting",
    categorySlug: "sites-et-navigateurs",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une adresse presque identique à celle que vous vouliez : une lettre en moins, un tiret en plus, une extension différente. La page ressemble au vrai site, mais elle appartient à quelqu'un d'autre.",
    attackerObjective: "identifiants",
    aliases: ["faute de frappe de domaine", "domaine sosie", "URL hijacking"],
    primaryVector: "web",
    primaryDimension: "url_verification",
    simulationSlug: "adresse-mal-tapee-service-streaming",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "Le typosquatting consiste à enregistrer un nom de domaine très proche d'un site légitime — une lettre en moins, une inversion, une extension différente — pour capter les visiteurs qui se trompent en saisissant l'adresse ou qui lisent trop vite.",
    howItWorks:
      "L'attaquant enregistre des variantes plausibles du domaine visé : faute de frappe courante, doublement ou omission d'une lettre, tiret ajouté, extension différente. Le site hébergé reproduit l'apparence de l'original. Le visiteur, persuadé d'être au bon endroit, s'y connecte normalement. La technique se combine souvent avec l'hameçonnage : le domaine trompeur sert de destination à un lien envoyé par email ou SMS, où il paraît crédible à la lecture.",
    warningSigns: [
      "Adresse presque identique à celle attendue, à une lettre ou un caractère près",
      "Extension inhabituelle pour l'organisme concerné",
      "Tiret inséré dans un nom de domaine qui n'en comporte pas habituellement",
      "Page de connexion demandant des identifiants après un lien reçu par message",
      "Absence des éléments personnalisés habituels une fois « connecté »",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Lisez l'adresse en partant de la fin du nom de domaine, juste avant la première barre oblique : c'est cette partie qui détermine à qui appartient réellement le site. Le plus sûr reste de ne pas saisir l'adresse du tout et d'utiliser un favori enregistré une fois pour toutes.",
    whatToDo:
      "Ne saisissez aucun identifiant. Quittez la page et rejoignez le site par un favori ou l'application officielle.",
    whatToDoIfVictim:
      "Changez immédiatement le mot de passe du service concerné, ainsi que celui de tout compte réutilisant le même mot de passe. Activez la double authentification et vérifiez les connexions récentes du compte.",
    whyItWorks:
      "On lit une adresse familière en reconnaissant sa forme générale, pas lettre par lettre : une variante d'un caractère passe inaperçue. Quand on a tapé l'adresse soi-même, on fait confiance au résultat, puisqu'on croit avoir choisi la destination.",
    example: {
      setting: "Vous tapez un peu vite l'adresse de votre service de streaming, habituellement streamflix.test.",
      message:
        "Votre abonnement n'a pas pu être renouvelé. Reconnectez-vous et mettez à jour votre moyen de paiement pour continuer à regarder.\nAdresse affichée : stremflix.test/compte",
      giveaways: [
        "Il manque une lettre : stremflix au lieu de streamflix.",
        "Le service réclame votre carte alors qu'aucun problème de paiement ne vous a été signalé ailleurs.",
        "La page ne connaît ni votre nom ni vos profils.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'adresse diffère-t-elle, même d'une lettre, d'un tiret ou de l'extension, de celle que vous connaissez ?",
        then: "Ne saisissez rien. Fermez l'onglet et passez par votre favori.",
      },
      {
        check: "La page vous demande-t-elle de vous connecter ou de payer dès votre arrivée ?",
        then: "Ouvrez le service par votre favori ou l'application : si le problème n'y apparaît pas, il n'existe pas.",
      },
      {
        check: "Avez-vous saisi votre mot de passe ou votre carte sur cette page ?",
        then: "Changez le mot de passe depuis le vrai site, et faites opposition sur la carte si vous l'avez saisie.",
      },
    ],
    prevention: [
      "Enregistrez en favori les sites où vous vous connectez, et passez toujours par là.",
      "Utilisez un gestionnaire de mots de passe : il ne remplit rien sur une adresse qu'il ne connaît pas.",
      "Pour un service que vous utilisez souvent, préférez son application officielle.",
    ],
    relatedAttackCodes: [
      "IDN-000002",
      "PHISH-000001",
      "WEB-000001",
      "WEB-000002",
      "WEB-000003",
      "WEB-000008",
      "NET-000004",
    ],
    faq: [
      {
        question: "Quelle différence avec une attaque par homoglyphes ?",
        answer:
          "Le typosquatting utilise des caractères ordinaires arrangés différemment — une faute de frappe crédible. L'attaque par homoglyphes utilise des caractères différents mais visuellement identiques, ce qui la rend indétectable à la simple lecture.",
      },
      {
        question: "Le cadenas était affiché, le site n'était-il pas sécurisé ?",
        answer:
          "Le cadenas indique seulement que la connexion est chiffrée, pas que le site est légitime. N'importe quel site, y compris frauduleux, peut obtenir un certificat.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "typosquatting",
        name: "Typosquatting",
        simulationSlug: "mistyped-streaming-service-address",
        plainLanguageDefinition:
          "An address that's almost identical to the one you wanted: one letter short, an extra hyphen, a different extension. The page looks like the real site, but it belongs to someone else.",
        definition:
          "Typosquatting consists of registering a domain name very close to a legitimate site — a missing letter, a swap, a different extension — to catch visitors who mistype the address or read too quickly.",
        howItWorks:
          "The attacker registers plausible variants of the targeted domain: a common typo, a doubled or missing letter, an added hyphen, a different extension. The hosted site copies the appearance of the original. The visitor, convinced they're in the right place, logs in as usual. The technique is often combined with phishing: the deceptive domain serves as the destination of a link sent by email or text, where it looks credible at a glance.",
        warningSigns: [
          "Address almost identical to the expected one, off by a letter or character",
          "Unusual extension for the organization concerned",
          "Hyphen inserted into a domain name that doesn't usually have one",
          "Login page requesting credentials after a link received by message",
          "Missing usual personalized elements once \"logged in\"",
        ],
        howToVerify:
          "Read the address starting from the end of the domain name, just before the first forward slash: that part determines who actually owns the site. The safest approach is not to type the address at all, and to use a bookmark saved once and for all.",
        whatToDo:
          "Don't enter any credentials. Leave the page and reach the site through a bookmark or the official app.",
        whatToDoIfVictim:
          "Immediately change the password of the affected service, as well as any account reusing the same password. Enable two-factor authentication and check the account's recent logins.",
        faq: [
          {
            question: "What's the difference with a homoglyph attack?",
            answer:
              "Typosquatting uses ordinary characters arranged differently — a credible typo. A homoglyph attack uses different characters that look visually identical, which makes it undetectable by simply reading the address.",
          },
          {
            question: "The padlock was displayed, wasn't the site secure?",
            answer:
              "The padlock only indicates that the connection is encrypted, not that the site is legitimate. Any site, including a fraudulent one, can obtain a certificate.",
          },
        ],
        whyItWorks:
          "We read a familiar address by recognizing its overall shape, not letter by letter: a one-character variant goes unnoticed. When you typed the address yourself, you trust the result, since you believe you chose the destination.",
        example: {
          setting: "You type the address of your streaming service a little too fast; it's usually streamflix.test.",
          message:
            "Your subscription could not be renewed. Log in again and update your payment method to keep watching.\nAddress shown: stremflix.test/compte",
          giveaways: [
            "A letter is missing: stremflix instead of streamflix.",
            "The service wants your card although no payment problem was flagged anywhere else.",
            "The page knows neither your name nor your profiles.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the address differ, even by one letter, a hyphen or the extension, from the one you know?",
            then: "Enter nothing. Close the tab and use your bookmark.",
          },
          {
            check: "Does the page ask you to log in or pay as soon as you arrive?",
            then: "Open the service from your bookmark or the app: if the problem doesn't show there, it doesn't exist.",
          },
          {
            check: "Did you enter your password or card on this page?",
            then: "Change the password on the real site, and block the card if you entered it.",
          },
        ],
        prevention: [
          "Bookmark the sites where you log in, and always go through the bookmark.",
          "Use a password manager: it fills in nothing on an address it doesn't know.",
          "For a service you use often, prefer its official app.",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Phishing (French government cybersecurity assistance service)",
            url: REF.phishing.url,
          },
        ],
      },
    },
  },
  {
    code: "IDN-000002",
    slug: "homoglyphes",
    name: "Attaque par homoglyphes",
    categorySlug: "sites-et-navigateurs",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une adresse web qui se lit exactement comme la bonne, parce qu'une lettre a été remplacée par un caractère d'un autre alphabet qui lui ressemble trait pour trait. Relire ne sert à rien : l'œil ne peut pas voir la différence.",
    attackerObjective: "identifiants",
    aliases: [
      "attaque IDN",
      "domaine internationalisé trompeur",
      "caractères similaires",
    ],
    primaryVector: "web",
    primaryDimension: "url_verification",
    simulationSlug: "adresse-presque-correcte",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "Une attaque par homoglyphes utilise des caractères issus d'alphabets différents mais visuellement identiques aux caractères latins pour composer une adresse web qui paraît authentique à la lecture, tout en désignant un domaine entièrement distinct.",
    howItWorks:
      "Plusieurs systèmes d'écriture partagent des formes de lettres identiques ou quasi identiques : certaines lettres cyrilliques ou grecques sont indiscernables de leurs équivalents latins à l'œil nu. En substituant une seule de ces lettres dans un nom de domaine, l'attaquant obtient une adresse qui s'affiche comme l'originale mais pointe vers son propre serveur. Contrairement au typosquatting, il n'y a ici aucune faute à repérer : la lecture attentive ne suffit pas, car les caractères sont réellement différents pour la machine tout en étant identiques pour l'œil. Les navigateurs se défendent en affichant ces domaines sous leur forme technique encodée lorsqu'ils mélangent des alphabets.",
    warningSigns: [
      "Adresse affichée sous une forme technique commençant par « xn-- », signe d'un domaine internationalisé",
      "Avertissement du navigateur signalant un domaine mêlant plusieurs alphabets",
      "Lien reçu par message dont l'adresse paraît pourtant parfaitement correcte",
      "Page de connexion atteinte via un lien plutôt que par un favori",
      "Le gestionnaire de mots de passe ne propose pas de remplir le formulaire",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Le signal le plus fiable est le comportement de votre gestionnaire de mots de passe : il associe vos identifiants au domaine réel, pas à son apparence. S'il ne propose rien sur un site que vous utilisez habituellement, considérez que le domaine n'est pas celui attendu. Sinon, rejoignez le service par un favori enregistré.",
    whatToDo:
      "Ne saisissez aucun identifiant. Fermez l'onglet et accédez au service par un chemin que vous maîtrisez.",
    whatToDoIfVictim:
      "Changez le mot de passe du service concerné depuis une session ouverte par vos propres moyens, activez la double authentification et vérifiez l'historique de connexion du compte.",
    whyItWorks:
      "Ici, l'œil n'a rien à repérer : la vérification que l'on recommande d'habitude, relire l'adresse, confirme au contraire que tout est normal. Plus la personne est attentive, plus elle se rassure.",
    example: {
      setting: "Email au nom de votre banque. Au survol, le lien paraît exact, mais l'un de ses « a » est en réalité une lettre cyrillique.",
      message:
        "Une nouvelle version de votre espace client est disponible. Connectez-vous pour activer vos paramètres de sécurité : https://mabanque-exemple.test/activation",
      giveaways: [
        "Une fois la page ouverte, la barre d'adresse affiche xn--mabnque-exemple-k7c.test : la forme encodée trahit un alphabet mélangé.",
        "Votre gestionnaire de mots de passe ne propose pas vos identifiants sur cette page.",
        "La demande arrive par un lien, pas depuis votre espace habituel.",
      ],
    },
    decisionChecklist: [
      {
        check: "Votre gestionnaire de mots de passe refuse-t-il de remplir le formulaire d'un site que vous utilisez pourtant ?",
        then: "Considérez le site comme faux : fermez l'onglet et passez par votre favori.",
      },
      {
        check: "La barre d'adresse affiche-t-elle une forme commençant par xn-- ou un avertissement du navigateur ?",
        then: "Quittez la page sans rien saisir.",
      },
      {
        check: "Avez-vous saisi vos identifiants sur cette page ?",
        then: "Changez le mot de passe depuis votre favori et vérifiez l'historique de connexion du compte.",
      },
    ],
    prevention: [
      "Ne vous connectez jamais depuis un lien reçu : ouvrez le service par un favori ou l'application.",
      "Laissez votre gestionnaire de mots de passe remplir les formulaires : son silence est un signal.",
      "Activez la double authentification sur les comptes qui comptent, de préférence par application ou clé de sécurité.",
    ],
    relatedAttackCodes: [
      "IDN-000001",
      "PHISH-000001",
      "ACCT-000001",
      "WEB-000003",
    ],
    faq: [
      {
        question:
          "Comment vérifier une adresse qui semble identique à la vraie ?",
        answer:
          "Ne vous fiez pas à la lecture : c'est précisément ce que l'attaque contourne. Fiez-vous au comportement de votre gestionnaire de mots de passe, ou n'utilisez pas le lien du tout et passez par un favori.",
      },
      {
        question: "Cette attaque fonctionne-t-elle aussi sur téléphone ?",
        answer:
          "Oui, et le risque y est accru : les navigateurs mobiles affichent l'adresse de façon tronquée, ce qui laisse encore moins d'éléments visibles pour repérer une anomalie.",
      },
      {
        question: "Que signifie une adresse commençant par xn-- ?",
        answer:
          "C'est la forme encodée d'un domaine contenant des caractères non latins. Ce n'est pas frauduleux en soi, mais voir cette forme là où vous attendiez un nom ordinaire justifie de ne pas s'y connecter.",
      },
    ],
    references: [REF.unicodeSecurity, REF.phishing],
    translations: {
      en: {
        slug: "homoglyph-attack",
        name: "Homoglyph attack",
        simulationSlug: "almost-correct-address",
        plainLanguageDefinition:
          "A web address that reads exactly like the right one, because a letter has been swapped for a character from another alphabet that looks identical to it. Re-reading it doesn't help: the eye can't see the difference.",
        definition:
          "A homoglyph attack uses characters from different alphabets that are visually identical to Latin characters to compose a web address that looks genuine to the eye, while actually pointing to an entirely different domain.",
        howItWorks:
          "Several writing systems share identical or near-identical letter shapes: certain Cyrillic or Greek letters are indistinguishable from their Latin equivalents to the naked eye. By substituting just one of these letters in a domain name, the attacker gets an address that displays like the original but points to their own server. Unlike typosquatting, there's no typo to spot here: careful reading isn't enough, because the characters are genuinely different for the machine while being identical to the eye. Browsers defend against this by displaying such domains in their encoded technical form when they mix alphabets.",
        warningSigns: [
          "Address displayed in a technical form starting with \"xn--\", a sign of an internationalized domain",
          "Browser warning flagging a domain mixing several alphabets",
          "Link received by message whose address nonetheless looks perfectly correct",
          "Login page reached via a link rather than a bookmark",
          "Password manager not offering to fill in the form",
        ],
        howToVerify:
          "The most reliable signal is your password manager's behavior: it associates your credentials with the real domain, not its appearance. If it offers nothing on a site you normally use, assume the domain isn't the expected one. Otherwise, reach the service through a saved bookmark.",
        whatToDo:
          "Don't enter any credentials. Close the tab and access the service through a path you control.",
        whatToDoIfVictim:
          "Change the password of the affected service from a session opened by your own means, enable two-factor authentication, and check the account's login history.",
        faq: [
          {
            question: "How do I check an address that looks identical to the real one?",
            answer:
              "Don't rely on reading it: that's precisely what the attack gets around. Rely on your password manager's behavior instead, or don't use the link at all and go through a bookmark.",
          },
          {
            question: "Does this attack also work on a phone?",
            answer:
              "Yes, and the risk is greater there: mobile browsers display the address in truncated form, leaving even less visible material to spot an anomaly.",
          },
          {
            question: "What does an address starting with xn-- mean?",
            answer:
              "It's the encoded form of a domain containing non-Latin characters. It isn't fraudulent by itself, but seeing this form where you expected an ordinary name is reason enough not to log in.",
          },
        ],
        whyItWorks:
          "Here the eye has nothing to catch: the check people are usually told to do, rereading the address, actually confirms that everything looks normal. The more careful the person, the more reassured they feel.",
        example: {
          setting: "Email in your bank's name. When you hover over it, the link looks right, but one of its \"a\" letters is actually a Cyrillic character.",
          message:
            "A new version of your customer area is available. Log in to activate your security settings: https://mabanque-exemple.test/activation",
          giveaways: [
            "Once the page is open, the address bar shows xn--mabnque-exemple-k7c.test: the encoded form reveals a mixed alphabet.",
            "Your password manager doesn't offer your credentials on this page.",
            "The request comes through a link, not from your usual account area.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does your password manager refuse to fill in the form of a site you actually use?",
            then: "Treat the site as fake: close the tab and use your bookmark.",
          },
          {
            check: "Does the address bar show a form starting with xn-- or a browser warning?",
            then: "Leave the page without entering anything.",
          },
          {
            check: "Did you enter your credentials on this page?",
            then: "Change the password from your bookmark and check the account's login history.",
          },
        ],
        prevention: [
          "Never log in from a link you received: open the service from a bookmark or the app.",
          "Let your password manager fill in forms: its silence is a signal.",
          "Turn on two-factor authentication for the accounts that matter, preferably with an app or a security key.",
        ],
        references: [
          {
            label: "Unicode Consortium — Unicode Security Considerations (UTS #36)",
            url: REF.unicodeSecurity.url,
          },
          {
            label: "Cybermalveillance.gouv.fr — Phishing (French government cybersecurity assistance service)",
            url: REF.phishing.url,
          },
        ],
      },
    },
  },
  {
    code: "QR-000001",
    slug: "quishing",
    name: "Quishing (QR code frauduleux)",
    categorySlug: "sites-et-navigateurs",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un QR code ne montre pas où il mène. Un autocollant collé sur un horodateur ou une borne suffit à envoyer les gens vers une fausse page de paiement.",
    attackerObjective: "identifiants",
    aliases: [
      "QR code frauduleux",
      "hameçonnage par QR code",
      "QR code malveillant",
    ],
    primaryVector: "qr_code",
    primaryDimension: "qr_phishing_recognition",
    simulationSlug: "qr-code-borne-de-paiement",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "Le quishing est l'utilisation d'un QR code pour diriger vers un site frauduleux : le code masque l'adresse de destination, qui n'est donc pas lisible avant d'être ouverte.",
    howItWorks:
      "Un QR code n'est qu'une adresse encodée sous forme graphique. Rien dans son apparence n'indique où il mène : deux codes visuellement semblables peuvent pointer vers des destinations sans rapport. L'attaquant place un code frauduleux là où la démarche paraît normale — autocollant apposé sur un horodateur ou une borne, courrier imitant une administration, affiche dans un lieu public — et la destination reproduit un service de paiement ou une page de connexion. Le scan se fait le plus souvent au téléphone, où l'adresse s'affiche tronquée et où l'on est moins attentif qu'au bureau.",
    warningSigns: [
      "Autocollant apposé par-dessus un QR code d'origine, ou code visiblement rapporté",
      "Adresse affichée après le scan sans rapport avec l'organisme attendu",
      "Demande de paiement immédiat ou de saisie d'identifiants après un simple scan",
      "QR code reçu par courrier ou par message pour une démarche non sollicitée",
      "Redirections successives entre le scan et la page finale",
    ],
    triggers: ["trust", "curiosity"],
    indicators: [],
    howToVerify:
      "Avant d'ouvrir, lisez l'adresse que votre téléphone affiche en aperçu et vérifiez le nom de domaine. Pour un paiement ou une démarche administrative, ignorez le code et rejoignez le service officiel par vos propres moyens : un QR code n'est jamais le seul chemin disponible.",
    whatToDo:
      "N'ouvrez pas la page si le domaine ne correspond pas à l'organisme attendu. Sur un support physique, vérifiez qu'aucun autocollant ne recouvre le code d'origine.",
    whatToDoIfVictim:
      "Si des coordonnées bancaires ont été saisies, faites opposition immédiatement. Si des identifiants ont été saisis, changez le mot de passe concerné et activez la double authentification. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "On fait confiance au support plutôt qu'au code : un autocollant sur une borne officielle hérite de sa crédibilité. Et un QR code ne montre pas sa destination, si bien que l'on scanne avant d'avoir pu vérifier.",
    example: {
      setting: "Sur un horodateur, un autocollant QR propose de payer par téléphone.",
      message:
        "PAYEZ PLUS VITE — Scannez pour régler votre stationnement sans monnaie\n(adresse affichée au scan : stationnement-rapide.example-not-real.test)",
      giveaways: [
        "Un autocollant collé par-dessus le support d'origine.",
        "Un domaine sans rapport avec la commune ou l'exploitant.",
        "Un paiement demandé par un code que rien n'identifie.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le code est-il un autocollant rapporté ?",
        then: "Ne le scannez pas : utilisez l'application ou le site officiel.",
      },
      {
        check: "L'adresse affichée avant ouverture est-elle sans rapport avec l'organisme attendu ?",
        then: "N'ouvrez pas la page.",
      },
      {
        check: "Avez-vous payé ou saisi des identifiants ?",
        then: "Faites opposition, ou changez le mot de passe concerné, sans attendre.",
      },
    ],
    prevention: [
      "Prenez l'habitude de lire l'adresse que le téléphone affiche avant d'ouvrir un QR code.",
      "Pour un paiement, préférez l'application officielle au code affiché.",
      "Signalez un autocollant suspect au gestionnaire du lieu.",
    ],
    relatedAttackCodes: ["PHISH-000001", "SOCIAL-000002", "PAYMENT-000001"],
    faq: [
      {
        question: "Le simple fait de scanner un QR code est-il dangereux ?",
        answer:
          "Scanner ne fait qu'afficher une adresse. Le risque commence à l'ouverture de la page et surtout à la saisie d'informations. Prenez l'habitude de lire l'aperçu de l'adresse avant d'ouvrir.",
      },
      {
        question:
          "Comment repérer un QR code frauduleux sur un support physique ?",
        answer:
          "Passez le doigt dessus : un autocollant apposé par-dessus le code d'origine se sent au toucher et constitue le signal le plus fiable sur une borne ou un horodateur.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "quishing",
        simulationSlug: "parking-meter-qr-code",
        name: "Quishing (fraudulent QR code)",
        plainLanguageDefinition:
          "A QR code doesn't show where it leads. A sticker placed on a parking meter or a terminal is enough to send people to a fake payment page.",
        definition:
          "Quishing is the use of a QR code to direct people to a fraudulent site: the code hides the destination address, which is therefore not readable before it's opened.",
        howItWorks:
          "A QR code is just an address encoded as a graphic. Nothing about its appearance indicates where it leads: two visually similar codes can point to unrelated destinations. The attacker places a fraudulent code where the process seems ordinary — a sticker placed over a parking meter or terminal, a letter imitating an administration, a poster in a public place — and the destination mimics a payment service or a login page. The scan is most often done on a phone, where the address is shown truncated and where people pay less attention than at a desk.",
        warningSigns: [
          "Sticker placed over an original QR code, or a code that's visibly been added",
          "Address displayed after the scan unrelated to the expected organization",
          "Request for immediate payment or credentials after a simple scan",
          "QR code received by mail or message for an unsolicited procedure",
          "Successive redirects between the scan and the final page",
        ],
        howToVerify:
          "Before opening it, read the address your phone shows in the preview and check the domain name. For a payment or an administrative procedure, ignore the code and reach the official service on your own: a QR code is never the only path available.",
        whatToDo:
          "Don't open the page if the domain doesn't match the expected organization. On a physical support, check that no sticker covers the original code.",
        whatToDoIfVictim:
          "If banking details were entered, block your card immediately. If credentials were entered, change the affected password and enable two-factor authentication. Report the incident to the relevant authority.",
        faq: [
          {
            question: "Is simply scanning a QR code dangerous?",
            answer:
              "Scanning only displays an address. The risk starts when the page opens, and above all when information is entered. Get into the habit of reading the address preview before opening it.",
          },
          {
            question: "How do I spot a fraudulent QR code on a physical support?",
            answer:
              "Run your finger over it: a sticker placed over the original code can be felt by touch, and that's the most reliable signal on a terminal or parking meter.",
          },
        ],
        whyItWorks:
          "People trust the surface rather than the code: a sticker on an official machine inherits its credibility. And a QR code doesn't show where it leads, so you scan before you've been able to check.",
        example: {
          setting: "On a parking meter, a QR sticker offers to let you pay by phone.",
          message:
            "PAY FASTER — Scan to pay for your parking without coins\n(address shown when scanned: stationnement-rapide.example-not-real.test)",
          giveaways: [
            "A sticker placed on top of the original surface.",
            "A domain unrelated to the city or the operator.",
            "A payment requested through a code that nothing identifies.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the code a sticker that was added on?",
            then: "Don't scan it: use the official app or website.",
          },
          {
            check: "Is the address shown before opening unrelated to the expected organization?",
            then: "Don't open the page.",
          },
          {
            check: "Did you pay or enter credentials?",
            then: "Block the card, or change the password concerned, right away.",
          },
        ],
        prevention: [
          "Get into the habit of reading the address your phone shows before opening a QR code.",
          "For a payment, prefer the official app over the displayed code.",
          "Report a suspicious sticker to whoever manages the place.",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Phishing (French government cybersecurity assistance service)",
            url: REF.phishing.url,
          },
        ],
      },
    },
  },
  {
    code: "WEB-000002",
    slug: "fausse-mise-a-jour",
    name: "Fausse mise à jour de navigateur",
    categorySlug: "sites-et-navigateurs",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une bannière au milieu d'une page annonce que votre navigateur est périmé et propose de le mettre à jour. Le fichier téléchargé n'est pas une mise à jour : c'est un programme choisi par l'attaquant, et c'est vous qui l'installez.",
    attackerObjective: "controle_d_un_appareil",
    aliases: [
      "fausse mise à jour de navigateur",
      "fausse alerte de mise à jour",
    ],
    primaryVector: "web",
    primaryDimension: "url_verification",
    simulationSlug: "fausse-mise-a-jour-navigateur",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "La fausse mise à jour est une page web qui imite une notification du navigateur ou du système pour faire télécharger et exécuter un programme malveillant, présenté comme une mise à jour indispensable.",
    howItWorks:
      "En consultant un site ordinaire — souvent un site légitime dont une régie publicitaire a été détournée — une bannière apparaît, reprenant l'apparence exacte d'une notification du navigateur : logo, typographie, formulation. Elle annonce une version obsolète et propose un bouton de mise à jour. Le fichier téléchargé est un programme, non une mise à jour, et l'installation est entièrement volontaire de la part de la victime : c'est ce qui permet à l'attaque de contourner les protections du navigateur, qui n'ont pas été franchies mais contournées par l'utilisateur lui-même. Certaines variantes demandent de copier une commande et de la coller dans un outil du système, ce qui produit le même résultat sans aucun téléchargement visible.",
    warningSigns: [
      "Notification de mise à jour affichée à l'intérieur d'une page web plutôt que dans le navigateur",
      "Téléchargement d'un fichier exécutable proposé pour « mettre à jour » un logiciel",
      "Demande de copier-coller une commande dans un terminal ou une fenêtre d'exécution",
      "Mise à jour proposée pour un logiciel que vous n'utilisez pas",
      "Page qui empêche la fermeture de l'onglet ou revient automatiquement",
    ],
    triggers: ["urgency", "authority", "trust"],
    indicators: [],
    howToVerify:
      "Un navigateur se met à jour tout seul et signale son état dans son propre menu, jamais dans une page. Fermez l'onglet, puis ouvrez le menu du navigateur et vérifiez-y la version : c'est le seul endroit qui fasse foi. Aucune mise à jour légitime ne demande de coller une commande.",
    whatToDo:
      "N'exécutez pas le fichier téléchargé et supprimez-le. Ne collez aucune commande fournie par une page web, quelle que soit la justification donnée.",
    whatToDoIfVictim:
      "Déconnectez l'appareil du réseau et faites-le analyser par un outil de sécurité à jour. Depuis un autre appareil sain, changez les mots de passe des comptes sensibles en commençant par la messagerie, et activez la double authentification. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Mettre à jour est un conseil de sécurité que tout le monde a entendu : la fausse bannière se sert de cette bonne habitude. Elle apparaît sur un site connu, dont la réputation rejaillit sur elle.",
    example: {
      setting: "Bannière apparue pendant la lecture d'un article sur un site d'actualité habituel.",
      message:
        "Votre navigateur n'est plus à jour. Certaines pages pourraient ne plus s'afficher correctement. Installez la dernière version maintenant.\n[Mettre à jour] : télécharge un programme d'installation.",
      giveaways: [
        "La notification est dans la page, pas dans le menu du navigateur.",
        "Un navigateur ne se met pas à jour avec un fichier téléchargé depuis un site d'actualité.",
        "Le menu du navigateur indique qu'il est déjà à jour.",
      ],
    },
    decisionChecklist: [
      {
        check: "La proposition de mise à jour s'affiche-t-elle dans une page web ?",
        then: "Fermez l'onglet et vérifiez la version dans le menu du navigateur.",
      },
      {
        check: "Une page vous demande-t-elle de copier et coller une commande ?",
        then: "Ne collez rien, quelle que soit l'explication.",
      },
      {
        check: "Avez-vous ouvert le fichier téléchargé ou collé une commande ?",
        then: "Déconnectez l'appareil d'internet et suivez la checklist d'urgence.",
      },
    ],
    prevention: [
      "Laissez le navigateur et le système se mettre à jour automatiquement.",
      "Retenez que l'état des mises à jour se lit dans le menu du logiciel, jamais dans une page.",
      "Installez un bloqueur de publicité : ces bannières passent souvent par des espaces publicitaires.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000003",
      "IDN-000001",
      "ACCT-000003",
      "ACCT-000007",
      "WEB-000004",
      "WEB-000005",
      "MAL-000002",
      "MAL-000010",
    ],
    faq: [
      {
        question:
          "Le site sur lequel j'étais est pourtant un site connu et sérieux.",
        answer:
          "C'est courant : la bannière provient généralement d'un espace publicitaire chargé par le site, pas du site lui-même. Le sérieux du site visité ne dit rien du contenu affiché dans ses publicités.",
      },
      {
        question: "J'ai téléchargé le fichier sans l'ouvrir, suis-je exposé ?",
        answer:
          "Un fichier téléchargé mais jamais exécuté ne s'active pas de lui-même. Supprimez-le du dossier de téléchargements, videz la corbeille, et lancez par précaution une analyse de sécurité.",
      },
    ],
    references: [REF.fakeSupport],
    translations: {
      en: {
        slug: "fake-browser-update",
        simulationSlug: "fake-browser-update-banner",
        name: "Fake browser update",
        plainLanguageDefinition:
          "A banner in the middle of a page announces your browser is outdated and offers to update it. The downloaded file isn't an update: it's a program chosen by the attacker, and you're the one installing it.",
        definition:
          "A fake update is a web page that imitates a browser or system notification to get a malicious program downloaded and run, presented as an essential update.",
        howItWorks:
          "While browsing an ordinary site — often a legitimate site whose ad network has been hijacked — a banner appears, reproducing the exact look of a browser notification: logo, typography, wording. It announces an outdated version and offers an update button. The downloaded file is a program, not an update, and the installation is entirely voluntary on the victim's part: that's what lets the attack bypass the browser's protections, which aren't broken through but sidestepped by the user themselves. Some variants ask you to copy a command and paste it into a system tool, which produces the same result with no visible download at all.",
        warningSigns: [
          "Update notification displayed inside a web page rather than in the browser itself",
          "Executable file offered to \"update\" a piece of software",
          "Request to copy and paste a command into a terminal or execution window",
          "Update offered for a piece of software you don't use",
          "Page that prevents closing the tab or reappears automatically",
        ],
        howToVerify:
          "A browser updates itself and reports its status in its own menu, never in a page. Close the tab, then open the browser's menu and check the version there: it's the only place that counts. No legitimate update ever asks you to paste a command.",
        whatToDo:
          "Don't run the downloaded file and delete it. Don't paste any command provided by a web page, whatever justification is given.",
        whatToDoIfVictim:
          "Disconnect the device from the network and have it scanned with an up-to-date security tool. From another healthy device, change the passwords of sensitive accounts starting with email, and enable two-factor authentication. Report the incident to the relevant authority.",
        faq: [
          {
            question: "The site I was on is a well-known, serious site though.",
            answer:
              "That's common: the banner usually comes from an advertising slot loaded by the site, not from the site itself. How serious the visited site is says nothing about the content shown in its ads.",
          },
          {
            question: "I downloaded the file without opening it — am I exposed?",
            answer:
              "A file that's downloaded but never run doesn't activate on its own. Delete it from the downloads folder, empty the trash, and run a security scan as a precaution.",
          },
        ],
        whyItWorks:
          "Updating is a security tip everyone has heard: the fake banner exploits that good habit. It appears on a well-known site, whose reputation rubs off on it.",
        example: {
          setting: "Banner that appeared while reading an article on a news site you visit regularly.",
          message:
            "Your browser is out of date. Some pages may no longer display correctly. Install the latest version now.\n[Update] : downloads an installer.",
          giveaways: [
            "The notification is inside the page, not in the browser's menu.",
            "A browser doesn't update through a file downloaded from a news site.",
            "The browser's menu says it's already up to date.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the update offer displayed inside a web page?",
            then: "Close the tab and check the version in the browser's menu.",
          },
          {
            check: "Does a page ask you to copy and paste a command?",
            then: "Paste nothing, whatever the explanation.",
          },
          {
            check: "Did you open the downloaded file or paste a command?",
            then: "Disconnect the device from the internet and follow the emergency checklist.",
          },
        ],
        prevention: [
          "Let your browser and system update automatically.",
          "Remember that update status is shown in the software's menu, never in a page.",
          "Install an ad blocker: these banners often come through ad slots.",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Fake tech support (French government cybersecurity assistance service)",
            url: REF.fakeSupport.url,
          },
        ],
      },
    },
  },
  {
    code: "WEB-000003",
    slug: "faux-site-web",
    simulationSlug: "resultat-sponsorise-logiciel-comptable",
    name: "Faux site web",
    categorySlug: "sites-et-navigateurs",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une copie d'un site que vous connaissez, souvent pixel pour pixel. Elle ne cherche pas à vous tromper longtemps : juste le temps d'un formulaire de connexion ou d'un paiement.",
    attackerObjective: "identifiants",
    aliases: [
      "site frauduleux",
      "page de phishing",
      "site clone",
      "faux site officiel",
    ],
    primaryVector: "web",
    primaryDimension: "url_verification",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Un faux site web est une reproduction d'un service légitime, hébergée sur un domaine contrôlé par l'attaquant, dont la fonction est de recueillir ce que le visiteur y saisit.",
    howItWorks:
      "La copie est technique et immédiate : le code d'une page publique s'aspire en une commande, et l'apparence obtenue est identique parce que c'est littéralement la même. Le certificat qui affiche le cadenas s'obtient gratuitement en quelques minutes pour n'importe quel domaine, y compris frauduleux — il atteste du chiffrement, jamais de l'identité. Le site est ensuite atteint par un lien, une publicité, ou un résultat de recherche acheté. Certaines versions relaient en temps réel ce que vous saisissez vers le vrai site : le code de double authentification que vous entrez y est immédiatement rejoué, la connexion aboutit réellement, et vous ne voyez rien d'anormal — c'est ce qui rend l'apparence inutilisable comme critère.",
    warningSigns: [
      "Domaine différent de celui attendu, même d'un seul caractère",
      "Page atteinte depuis un lien, une publicité ou un résultat sponsorisé plutôt qu'un favori",
      "Gestionnaire de mots de passe qui ne propose pas de remplir le formulaire",
      "Fonctions secondaires du site absentes ou renvoyant vers le vrai site",
      "Demande d'informations que le service ne réclame jamais à cet endroit",
      "Page de connexion s'ouvrant dans une fenêtre qui imite le navigateur sans en être une",
    ],
    triggers: ["trust", "urgency"],
    indicators: [],
    howToVerify:
      "Ne jugez pas la page, jugez le domaine — et si vous devez vous identifier ou payer, ne jugez rien du tout : fermez et rejoignez le service par un favori ou son application. Le comportement de votre gestionnaire de mots de passe est le signal le plus fiable, parce qu'il associe vos identifiants au domaine réel et non à l'apparence.",
    whatToDo:
      "Ne saisissez ni identifiant ni coordonnées bancaires sur une page atteinte depuis un lien. Enregistrez un favori pour chaque service sensible et prenez l'habitude de n'utiliser que celui-ci : c'est le geste qui rend la qualité de la copie sans importance.",
    whatToDoIfVictim:
      "Changez immédiatement le mot de passe du service concerné, depuis une session ouverte par vos propres moyens, puis révoquez les sessions actives — une connexion relayée en temps réel reste ouverte après le changement. Si des coordonnées bancaires ont été saisies, faites opposition. Vérifiez ensuite les moyens de récupération du compte.",
    whyItWorks:
      "On reconnaît un site à son apparence, et c'est justement ce qui se copie parfaitement. Le cadenas rassure alors qu'il n'atteste que du chiffrement, et une annonce en tête des résultats donne au faux site la place qu'on attend du vrai.",
    example: {
      setting: "Vous cherchez la page de connexion de votre mutuelle ; le premier résultat est une annonce.",
      message:
        "Annonce · mutuelle-espace-adherent.example-not-real.test\nMa Mutuelle — Connexion à votre espace adhérent\nAccédez à vos remboursements en un clic.",
      giveaways: [
        "C'est une annonce, pas le site que vous utilisez d'habitude.",
        "Le domaine n'est pas celui de votre mutuelle.",
        "Votre gestionnaire de mots de passe ne propose rien sur la page.",
      ],
    },
    decisionChecklist: [
      {
        check: "Êtes-vous arrivé sur la page par un lien, une annonce ou un résultat sponsorisé ?",
        then: "Fermez-la et passez par votre favori ou l'application.",
      },
      {
        check: "Le nom de domaine diffère-t-il, même d'un caractère, de celui que vous connaissez ?",
        then: "Quittez la page : un seul caractère suffit à changer de propriétaire.",
      },
      {
        check: "Votre gestionnaire de mots de passe reste-t-il silencieux ?",
        then: "C'est un avertissement : ne saisissez rien à la main.",
      },
    ],
    prevention: [
      "Enregistrez un favori pour chaque service où vous vous connectez ou payez.",
      "N'utilisez pas les résultats sponsorisés pour rejoindre un service sensible.",
      "Utilisez un gestionnaire de mots de passe, qui associe vos identifiants au vrai domaine.",
    ],
    relatedAttackCodes: [
      "IDN-000001",
      "IDN-000002",
      "PHISH-000001",
      "WEB-000004",
      "ACCT-000008",
      "WEB-000008",
      "AI-000004",
      "MOB-000010",
      "NET-000001",
      "NET-000002",
      "NET-000004",
      "NET-000007",
    ],
    faq: [
      {
        question: "Le cadenas était affiché, cela ne prouve-t-il rien ?",
        answer:
          "Rien sur l'honnêteté du site. Le cadenas indique que la connexion est chiffrée, c'est-à-dire que personne ne lit ce que vous envoyez — y compris quand vous l'envoyez à un escroc. Les certificats sont gratuits et automatiques, donc un site frauduleux en a un.",
      },
      {
        question:
          "J'ai saisi mon code de double authentification, était-il inutile ?",
        answer:
          "Il a fonctionné, mais au profit de l'attaquant : certaines pages relaient votre saisie vers le vrai site en direct, ce qui valide sa connexion à lui. C'est pourquoi une clé de sécurité physique, qui vérifie le domaine avant de répondre, résiste là où un code saisi ne le peut pas.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "fake-website",
        simulationSlug: "sponsored-result-accounting-software",
        name: "Fake website",
        plainLanguageDefinition:
          "A copy of a site you know, often pixel for pixel. It's not trying to fool you for long: just long enough for a login form or a payment.",
        definition:
          "A fake website is a reproduction of a legitimate service, hosted on a domain controlled by the attacker, whose function is to collect whatever the visitor enters there.",
        howItWorks:
          "The copy is technical and immediate: the code of a public page can be pulled down with a single command, and the resulting appearance is identical because it literally is the same. The certificate that displays the padlock is obtained for free in minutes for any domain, including a fraudulent one — it attests to encryption, never to identity. The site is then reached through a link, an advertisement, or a paid search result. Some versions relay what you type to the real site in real time: the two-factor code you enter is immediately replayed there, the login genuinely succeeds, and you see nothing abnormal — which is what makes appearance useless as a criterion.",
        warningSigns: [
          "Domain different from the expected one, even by a single character",
          "Page reached from a link, an advertisement, or a sponsored result rather than a bookmark",
          "Password manager not offering to fill in the form",
          "Secondary functions of the site missing or redirecting to the real site",
          "Request for information the service never asks for at this point",
          "Login page opening in a window that imitates the browser without being one",
        ],
        howToVerify:
          "Don't judge the page, judge the domain — and if you need to log in or pay, don't judge anything at all: close it and reach the service through a bookmark or its app. Your password manager's behavior is the most reliable signal, because it associates your credentials with the real domain rather than the appearance.",
        whatToDo:
          "Don't enter credentials or banking details on a page reached from a link. Save a bookmark for each sensitive service and get into the habit of only using that one: it's the habit that makes the quality of the copy irrelevant.",
        whatToDoIfVictim:
          "Immediately change the password of the affected service, from a session opened by your own means, then revoke active sessions — a session relayed in real time stays open after the password change. If banking details were entered, block your card. Then check the account's recovery methods.",
        faq: [
          {
            question: "The padlock was displayed — doesn't that prove anything?",
            answer:
              "Nothing about the site's honesty. The padlock indicates the connection is encrypted, meaning nobody can read what you send — including when you send it to a scammer. Certificates are free and automatic, so a fraudulent site has one too.",
          },
          {
            question: "I entered my two-factor code — was it useless?",
            answer:
              "It worked, but for the attacker's benefit: some pages relay what you enter to the real site live, which validates the attacker's own login. That's why a physical security key, which checks the domain before responding, resists where an entered code cannot.",
          },
        ],
        whyItWorks:
          "We recognize a site by its appearance, and that's exactly what can be copied perfectly. The padlock reassures even though it only certifies encryption, and an ad at the top of the results gives the fake site the spot we expect the real one to hold.",
        example: {
          setting: "You search for your health insurer's login page; the first result is an ad.",
          message:
            "Ad · mutuelle-espace-adherent.example-not-real.test\nMy Health Insurance — Log in to your member area\nAccess your reimbursements in one click.",
          giveaways: [
            "It's an ad, not the site you usually use.",
            "The domain isn't your insurer's.",
            "Your password manager offers nothing on the page.",
          ],
        },
        decisionChecklist: [
          {
            check: "Did you reach the page through a link, an ad or a sponsored result?",
            then: "Close it and use your bookmark or the app.",
          },
          {
            check: "Does the domain name differ, even by one character, from the one you know?",
            then: "Leave the page: a single character is enough to change the owner.",
          },
          {
            check: "Is your password manager staying silent?",
            then: "That's a warning: don't type anything in by hand.",
          },
        ],
        prevention: [
          "Save a bookmark for every service where you log in or pay.",
          "Don't use sponsored results to reach a sensitive service.",
          "Use a password manager, which ties your credentials to the real domain.",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Phishing (French government cybersecurity assistance service)",
            url: REF.phishing.url,
          },
        ],
      },
    },
  },
  {
    code: "WEB-000004",
    slug: "malvertising",
    simulationSlug: "alerte-securite-sur-site-quelconque",
    name: "Publicité malveillante",
    categorySlug: "sites-et-navigateurs",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une publicité piégée affichée sur un site parfaitement légitime. Le site n'a rien fait de mal : il loue un espace, et ce qui s'y affiche est décidé ailleurs, en une fraction de seconde.",
    attackerObjective: "controle_d_un_appareil",
    aliases: [
      "publicité piégée",
      "malvertising",
      "annonce malveillante",
      "faux résultat sponsorisé",
    ],
    primaryVector: "advertisement",
    primaryDimension: "url_verification",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le malvertising est la diffusion de contenus malveillants par les réseaux publicitaires, ce qui permet de les afficher sur des sites légitimes sans que ceux-ci soient compromis.",
    howItWorks:
      "L'espace publicitaire d'un site est vendu automatiquement, annonce par annonce, à chaque chargement de page. Ce que vous voyez n'a donc pas été choisi par le site que vous visitez, et il ne l'a jamais vu. L'attaquant achète cet espace comme n'importe quel annonceur, ce qui lui procure la réputation du site hôte sans avoir eu à le pirater. Deux usages dominent. Le premier détourne la recherche : une annonce achetée sur le nom d'un logiciel connu apparaît au-dessus du résultat officiel, et le téléchargement proposé n'est pas celui de l'éditeur. Le second déclenche une redirection ou une fausse alerte au moment du chargement, sans qu'aucun clic soit nécessaire.",
    warningSigns: [
      "Résultat sponsorisé placé au-dessus du site officiel pour le nom d'un logiciel",
      "Redirection déclenchée sans clic, à l'ouverture d'une page ordinaire",
      "Fausse alerte de sécurité ou de mise à jour surgissant sur un site sans rapport",
      "Domaine de l'annonce différent de celui de l'éditeur annoncé",
      "Téléchargement proposé depuis un site de téléchargement plutôt que depuis l'éditeur",
    ],
    triggers: ["trust", "urgency", "reward"],
    indicators: [],
    howToVerify:
      "Ignorez les blocs signalés comme publicité ou sponsorisés dans les résultats de recherche, et descendez jusqu'au résultat organique. Pour un logiciel, tapez l'adresse de l'éditeur plutôt que de chercher son nom : c'est la recherche elle-même qui est le terrain de l'attaque, et la contourner supprime le problème.",
    whatToDo:
      "Téléchargez depuis le site de l'éditeur ou un magasin officiel, jamais depuis un lien sponsorisé. Un bloqueur de publicité réduit nettement l'exposition, et maintenir le navigateur à jour ferme les redirections qui n'exigent aucun clic.",
    whatToDoIfVictim:
      "Si un fichier a été téléchargé et exécuté, déconnectez l'appareil du réseau et faites-le analyser, puis changez vos mots de passe depuis un autre appareil sain en commençant par la messagerie. Si vous vous êtes seulement identifié sur une page atteinte par une annonce, changez ce mot de passe et révoquez les sessions.",
    whyItWorks:
      "On fait confiance au site que l'on visite et au moteur de recherche que l'on utilise, et cette confiance s'étend à ce qu'ils affichent. Le premier résultat d'une recherche paraît être le bon, et peu de gens distinguent une annonce d'un résultat.",
    example: {
      setting: "Recherche du nom d'un logiciel gratuit de traitement de texte.",
      message:
        "Sponsorisé — TexteLibre, téléchargement officiel gratuit\ntextelibre-download.example-not-real.test\nTéléchargez la dernière version en un clic.",
      giveaways: [
        "Le résultat porte la mention sponsorisé.",
        "Le domaine n'est pas celui de l'éditeur, textelibre.test.",
        "Le site officiel apparaît plus bas, sans mention de publicité.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le lien que vous alliez suivre est-il marqué comme annonce ou sponsorisé ?",
        then: "Descendez jusqu'au résultat non sponsorisé, ou tapez directement l'adresse de l'éditeur.",
      },
      {
        check: "Une page s'est-elle ouverte toute seule avec une alerte ou une offre ?",
        then: "Fermez l'onglet sans cliquer dans la page.",
      },
      {
        check: "Avez-vous téléchargé et lancé un fichier depuis ce lien ?",
        then: "Déconnectez l'appareil et faites-le analyser, puis changez vos mots de passe depuis un autre appareil.",
      },
    ],
    prevention: [
      "Téléchargez depuis le site de l'éditeur ou le magasin officiel, en tapant l'adresse.",
      "Installez un bloqueur de publicité.",
      "Gardez le navigateur à jour.",
    ],
    relatedAttackCodes: [
      "WEB-000002",
      "WEB-000005",
      "SOCIAL-000003",
      "WEB-000003",
      "WEB-000007",
      "AI-000005",
      "DATA-000007",
      "MAL-000009",
      "MAL-000010",
    ],
    faq: [
      {
        question: "Le site sur lequel j'étais est un grand site connu.",
        answer:
          "Cela ne change rien, et c'est le point de l'attaque : la publicité n'a pas été choisie par ce site. Son espace est vendu automatiquement à chaque affichage, et son sérieux ne dit rien du contenu qui y passe.",
      },
      {
        question: "Un bloqueur de publicité suffit-il ?",
        answer:
          "Il réduit fortement l'exposition et c'est une mesure utile, mais il ne couvre ni les résultats sponsorisés des moteurs de recherche ni les contenus intégrés autrement. Le réflexe qui reste nécessaire est de rejoindre un éditeur par son adresse plutôt que par une recherche.",
      },
    ],
    references: [REF.fakeSupport],
    translations: {
      en: {
        slug: "malvertising",
        simulationSlug: "security-alert-on-random-site",
        name: "Malvertising",
        plainLanguageDefinition:
          "A booby-trapped ad displayed on a perfectly legitimate site. The site did nothing wrong: it rents out a slot, and what shows up in it is decided elsewhere, in a fraction of a second.",
        definition:
          "Malvertising is the distribution of malicious content through advertising networks, which lets it be displayed on legitimate sites without those sites being compromised.",
        howItWorks:
          "A site's ad space is sold automatically, ad by ad, on every page load. What you see was therefore not chosen by the site you're visiting, and it never even saw it. The attacker buys that space like any other advertiser, which gives them the host site's reputation without having had to hack it. Two uses dominate. The first hijacks search: an ad bought on the name of a well-known piece of software appears above the official result, and the download offered isn't the publisher's. The second triggers a redirect or a fake alert as soon as the page loads, with no click required.",
        warningSigns: [
          "Sponsored result placed above the official site for the name of a piece of software",
          "Redirect triggered without a click, when an ordinary page loads",
          "Fake security or update alert popping up on an unrelated site",
          "Ad domain different from that of the advertised publisher",
          "Download offered from a download site rather than from the publisher",
        ],
        howToVerify:
          "Ignore blocks flagged as advertising or sponsored in search results, and scroll down to the organic result. For a piece of software, type the publisher's address rather than searching for its name: the search itself is the battleground for this attack, and bypassing it removes the problem.",
        whatToDo:
          "Download from the publisher's site or an official app store, never from a sponsored link. An ad blocker significantly reduces exposure, and keeping the browser up to date closes off the redirects that require no click at all.",
        whatToDoIfVictim:
          "If a file was downloaded and run, disconnect the device from the network and have it scanned, then change your passwords from another healthy device starting with email. If you only logged in on a page reached through an ad, change that password and revoke sessions.",
        faq: [
          {
            question: "The site I was on is a big, well-known site.",
            answer:
              "That doesn't change anything, and it's the whole point of the attack: the ad wasn't chosen by that site. Its slot is sold automatically on every display, and its seriousness says nothing about the content passing through it.",
          },
          {
            question: "Is an ad blocker enough?",
            answer:
              "It significantly reduces exposure and is a useful measure, but it doesn't cover search engines' sponsored results or content embedded another way. The habit that's still needed is reaching a publisher by its address rather than through a search.",
          },
        ],
        whyItWorks:
          "We trust the site we're visiting and the search engine we use, and that trust extends to what they display. The first search result looks like the right one, and few people tell an ad apart from a result.",
        example: {
          setting: "Searching for the name of a free word processor.",
          message:
            "Sponsored — TexteLibre, free official download\ntextelibre-download.example-not-real.test\nDownload the latest version in one click.",
          giveaways: [
            "The result is labeled sponsored.",
            "The domain isn't the publisher's, textelibre.test.",
            "The official site appears further down, with no ad label.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the link you were about to follow marked as an ad or sponsored?",
            then: "Scroll down to the non-sponsored result, or type the publisher's address directly.",
          },
          {
            check: "Did a page open on its own with an alert or an offer?",
            then: "Close the tab without clicking inside the page.",
          },
          {
            check: "Did you download and run a file from that link?",
            then: "Disconnect the device and have it scanned, then change your passwords from another device.",
          },
        ],
        prevention: [
          "Download from the publisher's site or the official store, typing the address.",
          "Install an ad blocker.",
          "Keep your browser up to date.",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Fake tech support (French government cybersecurity assistance service)",
            url: REF.fakeSupport.url,
          },
        ],
      },
    },
  },
  {
    code: "WEB-000005",
    slug: "faux-telechargement",
    simulationSlug: "installeur-avec-cases-precochees",
    name: "Faux téléchargement",
    categorySlug: "sites-et-navigateurs",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Sur une page de téléchargement, plusieurs gros boutons « Télécharger ». Un seul est le bon, et ce n'est ni le plus visible ni le premier.",
    attackerObjective: "controle_d_un_appareil",
    aliases: [
      "faux bouton de téléchargement",
      "installeur frauduleux",
    ],
    primaryVector: "web",
    primaryDimension: "url_verification",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le faux téléchargement est la substitution d'un programme malveillant au fichier attendu, soit par un bouton trompeur sur une page de téléchargement, soit par un installeur qui ajoute des logiciels non demandés.",
    howItWorks:
      "Les sites qui hébergent des fichiers financent leur activité par la publicité, et les annonces y prennent la forme d'un bouton de téléchargement, parce que c'est ce que le visiteur cherche. Le vrai lien se retrouve alors plus petit, plus bas, ou en texte simple. Une seconde variante ne trompe pas sur le bouton mais sur le contenu : l'installeur télécharge bien le logiciel voulu, en y ajoutant des extensions de navigateur, un moteur de recherche modifié ou un utilitaire non demandé, chaque écran d'installation étant conçu pour que « Suivant » vale acceptation. La troisième vise les logiciels payants proposés gratuitement, où le fichier fourni est autre chose.",
    warningSigns: [
      "Plusieurs boutons « Télécharger » sur une même page, de tailles différentes",
      "Fichier dont le nom ou la taille ne correspond pas au logiciel attendu",
      "Installeur proposant des options cochées d'avance pour des logiciels sans rapport",
      "Extension du fichier différente de celle attendue pour ce type de programme",
      "Téléchargement passant par un site tiers plutôt que par l'éditeur",
      "Avertissement du navigateur ou de l'antivirus que l'on vous invite à ignorer",
    ],
    triggers: ["curiosity", "reward", "trust"],
    indicators: [],
    howToVerify:
      "Vérifiez le domaine depuis lequel part le téléchargement, et non l'apparence du bouton : il doit être celui de l'éditeur. Pendant l'installation, lisez chaque écran et décochez ce que vous n'avez pas demandé. Une invitation à désactiver une protection pour terminer une installation est une raison suffisante d'arrêter.",
    whatToDo:
      "Passez par le site de l'éditeur ou un magasin d'applications officiel, et évitez les sites agrégateurs de téléchargement. Sur une page inconnue, préférez le lien discret au bouton spectaculaire — la hiérarchie visuelle y est inversée exprès.",
    whatToDoIfVictim:
      "Désinstallez le programme, puis vérifiez ce qui est le plus souvent modifié à cette occasion : extensions du navigateur, moteur de recherche par défaut, page d'accueil, programmes lancés au démarrage. Lancez une analyse complète, puis changez vos mots de passe depuis un autre appareil en commençant par la messagerie.",
    whyItWorks:
      "On cherche un bouton Télécharger, et la page en montre plusieurs : le regard va au plus visible. Pendant l'installation, cliquer sur Suivant est devenu un réflexe, et les options ajoutées passent sans être lues.",
    example: {
      setting: "Page d'un site agrégateur de téléchargements, en cherchant un lecteur vidéo gratuit.",
      message:
        "[TÉLÉCHARGER MAINTENANT] (gros bouton vert)\n[Download Free] (bouton orange)\nLien direct : lecteurvideo-libre.test (en petit, sous la description)",
      giveaways: [
        "Plusieurs boutons de téléchargement sur la même page.",
        "Le plus visible est une publicité, pas le fichier.",
        "Le seul lien vers le site de l'éditeur est discret.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le téléchargement part-il d'un autre domaine que celui de l'éditeur ?",
        then: "Arrêtez-vous et rejoignez le site de l'éditeur par vous-même.",
      },
      {
        check: "L'installeur propose-t-il des logiciels ou des réglages que vous n'avez pas demandés ?",
        then: "Décochez-les, ou annulez l'installation si l'écran ne le permet pas.",
      },
      {
        check: "Votre navigateur a-t-il changé après l'installation : extension, moteur de recherche, page d'accueil ?",
        then: "Désinstallez le programme et remettez ces réglages, puis lancez une analyse complète.",
      },
    ],
    prevention: [
      "Téléchargez depuis le site de l'éditeur ou un magasin officiel, jamais depuis un agrégateur.",
      "Lisez chaque écran d'installation avant de cliquer sur Suivant.",
      "Sur une page inconnue, méfiez-vous du bouton le plus voyant.",
    ],
    relatedAttackCodes: [
      "WEB-000004",
      "WEB-000002",
      "SOCIAL-000008",
      "ACCT-000007",
      "WEB-000006",
      "WEB-000007",
      "AI-000007",
      "MAL-000001",
      "MAL-000002",
      "MAL-000010",
    ],
    faq: [
      {
        question: "Comment reconnaître le bon bouton ?",
        answer:
          "Ne le reconnaissez pas : survolez-le et lisez le domaine vers lequel il pointe. Le bon téléchargement part du domaine de l'éditeur. Sur ce critère, la taille et la couleur du bouton n'ont plus d'importance.",
      },
      {
        question:
          "J'ai installé un logiciel qui a ajouté des choses non désirées.",
        answer:
          "Désinstallez-les une par une, puis vérifiez les extensions du navigateur et le moteur de recherche par défaut, que ces installeurs modifient en priorité. Si des comportements persistent après désinstallation, faites analyser la machine.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "fake-download",
        simulationSlug: "installer-with-pre-ticked-boxes",
        name: "Fake download",
        plainLanguageDefinition:
          "On a download page, several big \"Download\" buttons. Only one is the real one, and it's neither the most visible nor the first.",
        definition:
          "A fake download is the substitution of a malicious program for the expected file, either through a misleading button on a download page, or through an installer that adds unrequested software.",
        howItWorks:
          "Sites that host files fund their activity through advertising, and the ads there take the form of a download button, because that's what the visitor is looking for. The real link then ends up smaller, lower down, or as plain text. A second variant doesn't mislead on the button but on the content: the installer does download the intended software, while adding browser extensions, a modified search engine, or an unrequested utility, with each install screen designed so that \"Next\" counts as acceptance. A third targets paid software offered for free, where the file provided is something else entirely.",
        warningSigns: [
          "Several \"Download\" buttons on the same page, of different sizes",
          "File whose name or size doesn't match the expected software",
          "Installer offering pre-checked options for unrelated software",
          "File extension different from the one expected for this type of program",
          "Download going through a third-party site rather than the publisher",
          "Browser or antivirus warning that you're being urged to ignore",
        ],
        howToVerify:
          "Check the domain the download comes from, not the button's appearance: it should be the publisher's. During installation, read every screen and uncheck anything you didn't ask for. Being invited to disable a protection to finish an installation is reason enough to stop.",
        whatToDo:
          "Go through the publisher's site or an official app store, and avoid download aggregator sites. On an unfamiliar page, prefer the plain link over the flashy button — the visual hierarchy there is deliberately reversed.",
        whatToDoIfVictim:
          "Uninstall the program, then check what's most often changed on this occasion: browser extensions, default search engine, home page, programs launched at startup. Run a full scan, then change your passwords from another device starting with email.",
        faq: [
          {
            question: "How do I recognize the right button?",
            answer:
              "Don't try to recognize it: hover over it and read the domain it points to. The real download comes from the publisher's domain. On that criterion, the button's size and color no longer matter.",
          },
          {
            question: "I installed software that added things I didn't want.",
            answer:
              "Uninstall them one by one, then check your browser extensions and default search engine, which these installers modify first. If behavior persists after uninstalling, have the machine scanned.",
          },
        ],
        whyItWorks:
          "You're looking for a Download button, and the page shows several: the eye goes to the most visible. During installation, clicking Next has become a reflex, and the added options slip through unread.",
        example: {
          setting: "Page on a download aggregator site, while looking for a free video player.",
          message:
            "[DOWNLOAD NOW] (big green button)\n[Download Free] (orange button)\nDirect link: lecteurvideo-libre.test (small, under the description)",
          giveaways: [
            "Several download buttons on the same page.",
            "The most visible one is an ad, not the file.",
            "The only link to the publisher's site is understated.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the download come from a domain other than the publisher's?",
            then: "Stop and go to the publisher's site on your own.",
          },
          {
            check: "Does the installer offer software or settings you didn't ask for?",
            then: "Uncheck them, or cancel the installation if the screen won't let you.",
          },
          {
            check: "Did your browser change after the installation: extension, search engine, home page?",
            then: "Uninstall the program and restore those settings, then run a full scan.",
          },
        ],
        prevention: [
          "Download from the publisher's site or an official store, never from an aggregator.",
          "Read every installation screen before clicking Next.",
          "On an unfamiliar page, be wary of the flashiest button.",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "WEB-000006",
    slug: "extension-de-navigateur-malveillante",
    simulationSlug: "extension-convertisseur-de-fichiers",
    name: "Extension de navigateur malveillante",
    categorySlug: "sites-et-navigateurs",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une extension utile que vous avez installée volontairement, et qui lit toutes les pages que vous ouvrez — y compris votre banque. Elle a demandé cette permission à l'installation, et vous l'avez accordée.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "extension piégée",
      "module complémentaire malveillant",
      "add-on malveillant",
    ],
    primaryVector: "web",
    primaryDimension: "account_security_awareness",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Une extension de navigateur malveillante est un module installé volontairement par l'utilisateur, dont les autorisations lui permettent de lire ou de modifier le contenu des pages consultées.",
    howItWorks:
      "Une extension s'exécute à l'intérieur du navigateur, ce qui la place après le chiffrement : elle voit les pages telles que vous les voyez, une fois déchiffrées. L'autorisation « lire et modifier vos données sur tous les sites » est demandée par quantité d'extensions parfaitement honnêtes — un bloqueur de publicité en a besoin — ce qui la rend banale au moment de l'installation. Deux chemins mènent au problème. Le premier est l'extension conçue pour cela dès le départ, publiée avec une fonction réelle et utile. Le second est plus difficile à voir : une extension honnête, avec ses milliers d'utilisateurs, est rachetée ou son compte de développeur compromis, et une mise à jour automatique change son comportement du jour au lendemain. Rien n'est réinstallé, rien n'est redemandé, et l'avis positif que vous aviez lu portait sur la version précédente.",
    warningSigns: [
      "Extension demandant l'accès à tous les sites pour une fonction qui ne le justifie pas",
      "Publicités ou liens apparus sur des sites qui n'en affichaient pas",
      "Moteur de recherche ou page d'accueil modifiés sans votre action",
      "Extension installée par un logiciel plutôt que par vous",
      "Changement de comportement d'une extension ancienne, après une mise à jour",
      "Extension retirée du magasin officiel mais toujours active dans votre navigateur",
    ],
    triggers: ["trust", "reward"],
    indicators: [],
    howToVerify:
      "Ouvrez la liste des extensions et traitez-la comme une liste d'invités : chacune doit avoir une raison d'être là. Lisez les autorisations et comparez-les à la fonction annoncée — un convertisseur d'unités n'a pas besoin de lire votre banque. Supprimez ce que vous n'utilisez plus : une extension oubliée continue de s'exécuter et de se mettre à jour.",
    whatToDo:
      "Installez peu, depuis les magasins officiels, et refusez une extension dont les autorisations dépassent sa fonction. Faites le ménage périodiquement : le risque principal n'est pas ce que vous installez aujourd'hui, mais ce qui reste installé dans deux ans.",
    whatToDoIfVictim:
      "Supprimez l'extension, puis considérez comme exposé tout ce que vous avez consulté pendant qu'elle était active : changez les mots de passe des comptes sensibles depuis un autre appareil et révoquez les sessions, car une extension peut lire les jetons de session aussi bien que les mots de passe. Vérifiez ensuite le moteur de recherche et la page d'accueil.",
    whyItWorks:
      "L'extension rend un vrai service, et l'autorisation qu'elle demande est la même que celle de beaucoup d'extensions honnêtes : rien ne la distingue au moment de l'installer. Une fois installée, on l'oublie, et elle reste.",
    example: {
      setting: "Fiche d'une extension dans le magasin du navigateur, installée pour convertir un fichier.",
      message:
        "Convertisseur PDF Express\nCette extension peut : lire et modifier toutes vos données sur tous les sites web.\n[Ajouter au navigateur]",
      giveaways: [
        "Convertir un fichier ne demande pas de lire tous les sites que vous visitez.",
        "L'éditeur n'a pas de site identifiable.",
        "Une fois la conversion faite, l'extension restera active sur toutes vos pages.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'extension demande-t-elle l'accès à tous les sites pour une fonction qui n'en a pas besoin ?",
        then: "Ne l'installez pas, ou cherchez un outil qui ne demande rien de tel.",
      },
      {
        check: "Votre moteur de recherche, votre page d'accueil ou les publicités ont-ils changé sans votre action ?",
        then: "Ouvrez la liste des extensions et supprimez celles que vous ne reconnaissez pas.",
      },
      {
        check: "Une extension suspecte était-elle active pendant que vous consultiez vos comptes ?",
        then: "Supprimez-la, puis changez vos mots de passe depuis un autre appareil et déconnectez toutes les sessions.",
      },
    ],
    prevention: [
      "Installez peu d'extensions, et uniquement depuis le magasin officiel.",
      "Relisez la liste des extensions tous les quelques mois et supprimez celles qui ne servent plus.",
      "Comparez toujours les autorisations demandées à la fonction annoncée.",
    ],
    relatedAttackCodes: [
      "WEB-000007",
      "ACCT-000007",
      "ACCT-000008",
      "WEB-000005",
      "WEB-000009",
      "AI-000007",
      "DATA-000006",
      "DATA-000007",
      "MAL-000009",
    ],
    faq: [
      {
        question: "Elle vient du magasin officiel, n'est-elle pas vérifiée ?",
        answer:
          "Les magasins effectuent des contrôles, mais une extension est mise à jour automatiquement après publication. Une extension honnête peut être rachetée ou son compte compromis, et changer de comportement sans que rien ne vous soit redemandé.",
      },
      {
        question:
          "Pourquoi une extension voit-elle mes pages malgré le HTTPS ?",
        answer:
          "Parce qu'elle s'exécute dans le navigateur, après le déchiffrement. Le chiffrement protège la page pendant son transport ; l'extension la lit une fois arrivée, au même endroit que vos yeux.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "malicious-browser-extension",
        simulationSlug: "file-converter-extension",
        name: "Malicious browser extension",
        plainLanguageDefinition:
          "A useful extension you installed voluntarily, which reads every page you open — including your bank. It asked for that permission at install time, and you granted it.",
        definition:
          "A malicious browser extension is a module voluntarily installed by the user, whose permissions let it read or modify the content of the pages visited.",
        howItWorks:
          "An extension runs inside the browser, which places it after encryption: it sees pages the way you see them, once decrypted. The \"read and change your data on all sites\" permission is requested by plenty of perfectly honest extensions — an ad blocker needs it — which makes it unremarkable at install time. Two paths lead to a problem. The first is an extension designed for this from the start, published with a real, useful function. The second is harder to see: an honest extension, with thousands of users, gets bought out or its developer account compromised, and an automatic update changes its behavior overnight. Nothing gets reinstalled, nothing is asked again, and the positive review you'd read was about the previous version.",
        warningSigns: [
          "Extension requesting access to all sites for a function that doesn't justify it",
          "Ads or links appearing on sites that didn't show any before",
          "Search engine or home page changed without your action",
          "Extension installed by a program rather than by you",
          "Change in an old extension's behavior after an update",
          "Extension removed from the official store but still active in your browser",
        ],
        howToVerify:
          "Open the list of extensions and treat it like a guest list: each one should have a reason to be there. Read the permissions and compare them to the stated function — a unit converter doesn't need to read your bank. Remove anything you no longer use: a forgotten extension keeps running and updating.",
        whatToDo:
          "Install sparingly, from official stores, and refuse an extension whose permissions exceed its function. Do a periodic clean-up: the main risk isn't what you install today, but what's still installed two years from now.",
        whatToDoIfVictim:
          "Remove the extension, then treat everything you visited while it was active as exposed: change the passwords of sensitive accounts from another device and revoke sessions, since an extension can read session tokens just as well as passwords. Then check the search engine and home page.",
        faq: [
          {
            question: "It comes from the official store — isn't it vetted?",
            answer:
              "Stores run checks, but an extension is updated automatically after publication. An honest extension can be bought out or have its account compromised, and change behavior without anything being asked of you again.",
          },
          {
            question: "Why can an extension see my pages despite HTTPS?",
            answer:
              "Because it runs inside the browser, after decryption. Encryption protects the page while it's in transit; the extension reads it once it has arrived, at the same place your eyes do.",
          },
        ],
        whyItWorks:
          "The extension provides a real service, and the permission it asks for is the same one many honest extensions need: nothing sets it apart at install time. Once installed, it's forgotten, and it stays.",
        example: {
          setting: "Extension page in the browser's store, installed to convert a file.",
          message:
            "PDF Converter Express\nThis extension can: read and change all your data on all websites.\n[Add to browser]",
          giveaways: [
            "Converting a file doesn't require reading every site you visit.",
            "The publisher has no identifiable website.",
            "Once the conversion is done, the extension will stay active on all your pages.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the extension ask for access to all sites for a feature that doesn't need it?",
            then: "Don't install it, or look for a tool that asks for nothing of the sort.",
          },
          {
            check: "Did your search engine, home page or ads change without your doing anything?",
            then: "Open the list of extensions and remove the ones you don't recognize.",
          },
          {
            check: "Was a suspicious extension active while you were using your accounts?",
            then: "Remove it, then change your passwords from another device and sign out of all sessions.",
          },
        ],
        prevention: [
          "Install few extensions, and only from the official store.",
          "Review your extensions every few months and remove those you no longer use.",
          "Always compare the permissions requested with the feature advertised.",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "WEB-000007",
    slug: "detournement-de-navigateur",
    noSimulationReason:
      "Rien n'arrive à juger : la modification des réglages du navigateur se fait par un programme déjà installé, en arrière-plan. La protection est un contrôle à mener dans les réglages — extensions, moteur de recherche, programmes récents — pas une décision sous message.",
    name: "Détournement de navigateur",
    categorySlug: "sites-et-navigateurs",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Votre page d'accueil, votre moteur de recherche et vos onglets ne sont plus ceux que vous aviez choisis. Vous les remettez, et ils reviennent : quelque chose les réécrit.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "browser hijacking",
      "pirate de navigateur",
      "détournement de moteur de recherche",
    ],
    primaryVector: "web",
    primaryDimension: "url_verification",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le détournement de navigateur est la modification persistante des réglages du navigateur — page d'accueil, moteur de recherche, nouvel onglet, extensions — par un logiciel installé sur l'appareil, afin de rediriger la navigation.",
    howItWorks:
      "L'installation vient presque toujours d'un installeur qui proposait autre chose, avec une case cochée d'avance. Le programme modifie ensuite les réglages du navigateur, et surtout se réinstalle : une tâche planifiée, un service, ou une seconde extension rétablit ce que vous venez de corriger, ce qui explique le sentiment que la modification revient toute seule. L'objectif est rarement le vol direct. Il s'agit de capter la recherche : chaque requête passe par un intermédiaire qui affiche ses propres résultats sponsorisés, ce qui vaut de l'argent, et vous expose accessoirement à des annonces piégées. Le détournement est donc à la fois le plus visible des problèmes de cette famille et l'un des plus tenaces.",
    warningSigns: [
      "Moteur de recherche par défaut remplacé, et rétabli tout seul après correction",
      "Page d'accueil ou page de nouvel onglet inconnue",
      "Recherches passant par un intermédiaire avant d'atteindre les résultats",
      "Extensions que vous n'avez pas installées, réapparaissant après suppression",
      "Barre d'outils ajoutée au navigateur",
      "Impossibilité de modifier certains réglages, présentés comme gérés par l'organisation",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Contrôlez trois endroits, dans cet ordre : les extensions, les réglages de recherche et de démarrage, puis les programmes installés récemment sur le système. Le troisième est celui que l'on oublie, et c'est souvent lui qui réinstalle les deux premiers. Vérifiez aussi les raccourcis du navigateur, dont la cible peut avoir été modifiée pour ajouter une adresse au lancement.",
    whatToDo:
      "Refusez les options cochées d'avance pendant les installations, et téléchargez depuis l'éditeur plutôt que depuis un agrégateur. Ce détournement s'installe rarement seul : il accompagne autre chose que vous vouliez.",
    whatToDoIfVictim:
      "Désinstallez le programme responsable au niveau du système avant de corriger le navigateur, sans quoi la correction sera défaite. Supprimez ensuite les extensions inconnues, rétablissez les réglages, vérifiez la cible des raccourcis, puis lancez une analyse. Changez vos mots de passe si la navigation a été redirigée pendant une période prolongée.",
    whyItWorks:
      "Le programme arrive caché dans un autre que l'on voulait vraiment, avec une case cochée d'avance. Quand on corrige les réglages, ils reviennent : on finit par se résigner.",
    example: {
      setting: "Nouvel onglet ouvert, quelques jours après l'installation d'un convertisseur vidéo gratuit.",
      message:
        "Page d'accueil : RechercheMax — Recherche rapide et sécurisée\nAdresse de la recherche : search-boost.example-not-real.test/?q=",
      giveaways: [
        "Vous n'avez pas choisi ce moteur de recherche.",
        "Il revient après correction.",
        "Il est apparu juste après l'installation d'un autre logiciel.",
      ],
    },
    decisionChecklist: [
      {
        check: "Votre moteur de recherche ou votre page d'accueil ont-ils changé sans votre action ?",
        then: "Cherchez d'abord le programme récemment installé et désinstallez-le du système.",
      },
      {
        check: "Le réglage revient-il après correction ?",
        then: "Un programme le réécrit : vérifiez les programmes installés et les extensions, puis la cible des raccourcis du navigateur.",
      },
      {
        check: "Certains réglages sont-ils marqués comme gérés par l'organisation alors que l'appareil est personnel ?",
        then: "Faites vérifier l'appareil : un programme a pris la main sur ces réglages.",
      },
    ],
    prevention: [
      "Décochez les options cochées d'avance pendant les installations.",
      "Téléchargez depuis l'éditeur plutôt que depuis un agrégateur.",
      "Relisez de temps en temps vos extensions et votre moteur de recherche par défaut.",
    ],
    relatedAttackCodes: [
      "WEB-000006",
      "WEB-000005",
      "WEB-000004",
      "NET-000004",
    ],
    faq: [
      {
        question: "Je remets mon moteur de recherche et il change à nouveau.",
        answer:
          "C'est la signature de ce problème : un composant réinstalle le réglage. Cherchez du côté du système — programmes installés, tâches planifiées — plutôt que dans le navigateur, qui n'est que l'endroit où le symptôme s'affiche.",
      },
      {
        question: "Réinstaller le navigateur suffit-il ?",
        answer:
          "Non si le programme responsable reste sur la machine : il reconfigurera la nouvelle installation. L'ordre correct est de retirer la cause au niveau du système, puis de remettre le navigateur en état.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "browser-hijacking",
        name: "Browser hijacking",
        plainLanguageDefinition:
          "Your home page, your search engine, and your tabs are no longer the ones you chose. You reset them, and they come back: something keeps rewriting them.",
        definition:
          "Browser hijacking is the persistent modification of browser settings — home page, search engine, new tab page, extensions — by software installed on the device, in order to redirect browsing.",
        howItWorks:
          "The installation almost always comes from an installer that was offering something else, with a pre-checked box. The program then modifies the browser's settings, and above all reinstalls itself: a scheduled task, a service, or a second extension restores what you just corrected, which explains the feeling that the change comes back on its own. The goal is rarely direct theft. It's about capturing search: every query passes through an intermediary that displays its own sponsored results, which is worth money, and incidentally exposes you to booby-trapped ads. Hijacking is therefore both the most visible problem in this family and one of the most persistent.",
        warningSigns: [
          "Default search engine replaced, and restored on its own after being fixed",
          "Unfamiliar home page or new-tab page",
          "Searches passing through an intermediary before reaching the results",
          "Extensions you didn't install, reappearing after removal",
          "Toolbar added to the browser",
          "Inability to change certain settings, shown as managed by an organization",
        ],
        howToVerify:
          "Check three places, in this order: extensions, search and startup settings, then programs recently installed on the system. The third is the one people forget, and it's often the one reinstalling the first two. Also check the browser's shortcut targets, which may have been modified to add an address at launch.",
        whatToDo:
          "Refuse pre-checked options during installations, and download from the publisher rather than an aggregator. This hijacking rarely installs itself alone: it rides along with something else you wanted.",
        whatToDoIfVictim:
          "Uninstall the responsible program at the system level before fixing the browser, or the fix will be undone. Then remove unknown extensions, restore settings, check shortcut targets, and run a scan. Change your passwords if browsing was redirected over an extended period.",
        faq: [
          {
            question: "I reset my search engine and it changes again.",
            answer:
              "That's the signature of this problem: a component is reinstalling the setting. Look on the system side — installed programs, scheduled tasks — rather than in the browser, which is only where the symptom shows up.",
          },
          {
            question: "Is reinstalling the browser enough?",
            answer:
              "No, if the responsible program stays on the machine: it will reconfigure the new installation. The correct order is to remove the cause at the system level, then restore the browser.",
          },
        ],
        whyItWorks:
          "The program arrives hidden inside another one you actually wanted, with a pre-checked box. When you fix the settings, they come back: people end up giving in.",
        example: {
          setting: "New tab opened a few days after installing a free video converter.",
          message:
            "Home page: RechercheMax — Fast and secure search\nSearch address: search-boost.example-not-real.test/?q=",
          giveaways: [
            "You didn't choose this search engine.",
            "It comes back after you fix it.",
            "It appeared right after another program was installed.",
          ],
        },
        decisionChecklist: [
          {
            check: "Did your search engine or home page change without your doing anything?",
            then: "First find the recently installed program and uninstall it from the system.",
          },
          {
            check: "Does the setting come back after you fix it?",
            then: "A program is rewriting it: check installed programs and extensions, then the target of the browser's shortcuts.",
          },
          {
            check: "Are some settings marked as managed by an organization although the device is personal?",
            then: "Have the device checked: a program has taken control of those settings.",
          },
        ],
        prevention: [
          "Uncheck pre-checked options during installations.",
          "Download from the publisher rather than from a download aggregator.",
          "Review your extensions and default search engine from time to time.",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        noSimulationReason:
          "There's nothing to judge in the moment: browser settings are changed by a program already installed, running in the background. The protection is a check to carry out in settings — extensions, search engine, recent programs — not a decision made under a message.",
      },
    },
  },
  {
    code: "WEB-000008",
    slug: "tabnabbing",
    simulationSlug: "onglet-demande-reconnexion-inattendue",
    name: "Tabnabbing (onglet remplacé)",
    categorySlug: "sites-et-navigateurs",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un onglet laissé ouvert change de contenu pendant que vous regardez ailleurs. En y revenant, vous retrouvez une page de connexion — et vous vous connectez, puisque c'est vous qui aviez ouvert cet onglet.",
    attackerObjective: "identifiants",
    aliases: ["tabnabbing", "onglet détourné", "reverse tabnabbing"],
    primaryVector: "web",
    primaryDimension: "url_verification",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le tabnabbing consiste à modifier le contenu d'un onglet inactif pour y afficher une page de connexion contrefaite, en exploitant le fait que l'utilisateur attribue à un onglet l'origine qu'il avait en l'ouvrant.",
    howItWorks:
      "L'attaque vise une habitude plutôt qu'une faille : nous laissons des onglets ouverts pendant des heures, et en y revenant nous ne relisons pas l'adresse — nous avons déjà décidé, en l'ouvrant, de ce que contient cet onglet. Une page laissée inactive peut détecter cette inactivité et se remplacer par une imitation d'un service courant, avec l'icône et le titre correspondants, puisque tous deux sont choisis par la page. Au retour, l'utilisateur trouve une demande de reconnexion qui semble venir d'une session expirée, situation banale et donc peu suspecte. Une variante s'appuie sur un lien ouvert dans un nouvel onglet : la page d'arrivée conserve, dans certains cas, la possibilité de rediriger celle d'où vous venez — de sorte que ce n'est pas la page ouverte qui change, mais celle que vous aviez laissée derrière.",
    warningSigns: [
      "Demande de reconnexion sur un onglet que vous n'aviez pas quitté",
      "Onglet dont l'icône ou le titre a changé depuis que vous l'avez ouvert",
      "Session expirée annoncée alors que vous étiez actif sur le site il y a peu",
      "Adresse de l'onglet différente de celle du site que vous pensiez y avoir",
      "Gestionnaire de mots de passe qui ne propose plus de remplir un formulaire qu'il remplissait",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Relisez la barre d'adresse au retour sur un onglet, exactement comme s'il venait d'être ouvert : c'est ce réflexe unique qui neutralise l'attaque. Devant une demande de reconnexion inattendue, fermez l'onglet et rouvrez le service depuis un favori plutôt que de vous identifier là où vous êtes.",
    whatToDo:
      "Ne laissez pas d'onglets de services sensibles ouverts indéfiniment, et méfiez-vous des demandes de reconnexion que vous n'avez pas provoquées. Un navigateur à jour limite plusieurs variantes de ce comportement.",
    whatToDoIfVictim:
      "Changez le mot de passe du service depuis une session ouverte par vos propres moyens, puis révoquez les sessions actives. Vérifiez l'adresse email et le numéro de récupération du compte, ainsi que les règles de transfert s'il s'agit d'une messagerie.",
    whyItWorks:
      "On a décidé de ce que contient un onglet au moment de l'ouvrir, et on n'y revient pas pour relire l'adresse. Une session expirée est une situation banale : se reconnecter paraît normal.",
    example: {
      setting: "Retour sur un onglet laissé ouvert depuis une heure, que vous pensiez être votre messagerie.",
      message:
        "Votre session a expiré pour des raisons de sécurité. Veuillez vous reconnecter pour continuer.\nAdresse de l'onglet : messagerie-connexion.example-not-real.test",
      giveaways: [
        "Vous étiez actif sur ce service il y a peu.",
        "L'adresse de l'onglet n'est pas celle de votre messagerie.",
        "Le gestionnaire de mots de passe ne propose pas de remplir le formulaire.",
      ],
    },
    decisionChecklist: [
      {
        check: "Un onglet vous demande-t-il de vous reconnecter alors que vous ne l'aviez pas quitté longtemps ?",
        then: "Fermez l'onglet et rouvrez le service depuis votre favori.",
      },
      {
        check: "L'adresse de l'onglet diffère-t-elle de celle du service ?",
        then: "Ne saisissez rien.",
      },
      {
        check: "Avez-vous saisi votre mot de passe dans cet onglet ?",
        then: "Changez-le depuis le vrai site, déconnectez toutes les sessions et vérifiez les moyens de récupération.",
      },
    ],
    prevention: [
      "Relisez l'adresse en revenant sur un onglet, comme s'il venait d'être ouvert.",
      "Fermez les onglets de services sensibles quand vous avez terminé.",
      "Laissez le gestionnaire de mots de passe remplir les formulaires : son silence est un signal.",
    ],
    relatedAttackCodes: ["WEB-000003", "WEB-000009", "IDN-000001"],
    faq: [
      {
        question: "Une page peut-elle vraiment changer toute seule ?",
        answer:
          "Une page peut se rediriger elle-même, y compris après un délai, et modifier son titre et son icône : ce sont des fonctions ordinaires du web. L'attaque n'exploite pas un défaut, elle exploite le fait que nous ne relisons pas l'adresse d'un onglet déjà ouvert.",
      },
      {
        question: "Comment se protéger sans y penser en permanence ?",
        answer:
          "Deux habitudes suffisent : fermer les onglets des services sensibles après usage, et ne jamais s'identifier depuis un onglet déjà ouvert sans avoir relu l'adresse. Le gestionnaire de mots de passe aide, puisqu'il refusera de remplir un formulaire sur un domaine qui n'est pas le bon.",
      },
    ],
    references: [REF.phishing],
    translations: {
      en: {
        slug: "tabnabbing",
        simulationSlug: "unexpected-sign-in-again-tab",
        name: "Tabnabbing (swapped tab)",
        plainLanguageDefinition:
          "A tab left open changes content while you're looking elsewhere. Coming back to it, you find a login page — and you log in, since it was you who opened that tab.",
        definition:
          "Tabnabbing consists of changing the content of an inactive tab to display a fake login page in it, exploiting the fact that users attribute to a tab the origin it had when they opened it.",
        howItWorks:
          "The attack targets a habit rather than a flaw: we leave tabs open for hours, and when we come back to them we don't re-read the address — we already decided, when opening it, what that tab contains. A page left inactive can detect that inactivity and replace itself with an imitation of a common service, complete with matching icon and title, since both are chosen by the page. On returning, the user finds a login request that looks like it comes from an expired session, a routine situation and therefore not very suspicious. A variant relies on a link opened in a new tab: the arriving page can, in some cases, retain the ability to redirect the one you came from — so it's not the opened page that changes, but the one you left behind.",
        warningSigns: [
          "Login request on a tab you hadn't left",
          "Tab whose icon or title has changed since you opened it",
          "Session expiration announced when you were active on the site shortly before",
          "Tab address different from the site you thought you had there",
          "Password manager no longer offering to fill in a form it used to fill in",
        ],
        howToVerify:
          "Re-read the address bar when returning to a tab, exactly as if it had just been opened: that one habit alone neutralizes the attack. Faced with an unexpected login request, close the tab and reopen the service from a bookmark rather than logging in where you are.",
        whatToDo:
          "Don't leave tabs for sensitive services open indefinitely, and be wary of login requests you didn't trigger. An up-to-date browser limits several variants of this behavior.",
        whatToDoIfVictim:
          "Change the service's password from a session opened by your own means, then revoke active sessions. Check the account's recovery email and phone number, as well as forwarding rules if it's a mailbox.",
        faq: [
          {
            question: "Can a page really change on its own?",
            answer:
              "A page can redirect itself, including after a delay, and change its title and icon: these are ordinary web functions. The attack doesn't exploit a flaw, it exploits the fact that we don't re-read the address of a tab that's already open.",
          },
          {
            question: "How do I protect myself without thinking about it all the time?",
            answer:
              "Two habits are enough: close tabs of sensitive services after use, and never log in from an already-open tab without re-reading the address. A password manager helps, since it will refuse to fill in a form on a domain that isn't the right one.",
          },
        ],
        whyItWorks:
          "We decided what a tab contains when we opened it, and we don't go back to reread its address. An expired session is ordinary: logging back in seems normal.",
        example: {
          setting: "Returning to a tab left open for an hour, which you thought was your email.",
          message:
            "Your session has expired for security reasons. Please log in again to continue.\nTab address: messagerie-connexion.example-not-real.test",
          giveaways: [
            "You were active on this service a short while ago.",
            "The tab's address isn't your email provider's.",
            "Your password manager doesn't offer to fill in the form.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is a tab asking you to log in again when you hadn't left it for long?",
            then: "Close the tab and reopen the service from your bookmark.",
          },
          {
            check: "Does the tab's address differ from the service's?",
            then: "Enter nothing.",
          },
          {
            check: "Did you enter your password in that tab?",
            then: "Change it on the real site, sign out of all sessions and check your recovery options.",
          },
        ],
        prevention: [
          "Reread the address when you return to a tab, as if it had just been opened.",
          "Close tabs of sensitive services when you're done.",
          "Let your password manager fill in forms: its silence is a signal.",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Phishing (French government cybersecurity assistance service)",
            url: REF.phishing.url,
          },
        ],
      },
    },
  },
  {
    code: "WEB-000009",
    slug: "clickjacking",
    noSimulationReason:
      "Le clic détourné se constate après coup, pas au moment où il se produit : la superposition qui capte le clic est invisible par construction. Un exercice de reconnaissance apprendrait à repérer ce qui, par définition, ne se voit pas au moment où ça arrive.",
    name: "Clickjacking (clic détourné)",
    categorySlug: "sites-et-navigateurs",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Vous cliquez sur ce que vous voyez, mais le clic atteint autre chose : un bouton invisible superposé à la page. Le geste est bien le vôtre, sa cible ne l'est pas.",
    attackerObjective: "acces_a_un_compte",
    aliases: [
      "clic détourné",
      "clickjacking",
      "détournement de clic",
      "UI redressing",
    ],
    primaryVector: "web",
    primaryDimension: "url_verification",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le clickjacking consiste à superposer à une page visible un élément transparent provenant d'un autre site, de sorte qu'un clic destiné au contenu affiché soit reçu par cet élément caché.",
    howItWorks:
      "Une page peut afficher une autre page dans un cadre, la rendre transparente, et la positionner sous le curseur. L'utilisateur voit un bouton anodin — lire une vidéo, accepter une bannière — et clique dessus ; le clic est reçu par le cadre invisible, où se trouve un bouton d'un service sur lequel il est déjà connecté. Le résultat est une action authentifiée qu'il n'a pas voulue : autoriser une application, valider une permission, publier. La particularité est que rien n'est usurpé : le clic est réel, la session est réelle, et le service ne peut pas distinguer cette action d'une action volontaire. C'est pourquoi la défense est presque entièrement du côté des sites, qui indiquent au navigateur de refuser d'être affichés dans un cadre — une protection largement déployée aujourd'hui, ce qui rend l'attaque plus rare qu'autrefois sans la faire disparaître.",
    warningSigns: [
      "Bouton dont le clic produit un résultat différent de ce qui était annoncé",
      "Superposition de bannières ou de fenêtres exigeant plusieurs clics rapprochés",
      "Autorisation accordée à une application que vous n'avez pas installée",
      "Publication, abonnement ou permission apparus après une visite sur un site inconnu",
      "Page insistant pour que vous cliquiez à un endroit précis pour continuer",
    ],
    triggers: ["curiosity", "urgency"],
    indicators: [],
    howToVerify:
      "Le clic détourné se constate après coup plutôt que pendant : passez en revue les applications tierces autorisées et les permissions accordées sur vos comptes principaux. Une autorisation que vous ne reconnaissez pas s'y voit clairement, alors que le clic, lui, n'a rien laissé paraître.",
    whatToDo:
      "Restez à jour côté navigateur, qui applique les protections que les sites déclarent. Méfiez-vous des pages qui exigent une séquence de clics rapprochés à des emplacements précis, et déconnectez-vous des services sensibles plutôt que de rester connecté en permanence — le clic détourné n'a de valeur que sur une session ouverte.",
    whatToDoIfVictim:
      "Retirez les autorisations d'applications tierces que vous ne reconnaissez pas, révoquez les sessions actives et vérifiez les publications ou permissions récentes. Changez le mot de passe si une action sensible a pu être effectuée en votre nom.",
    whyItWorks:
      "Le clic est réel et le bouton visible paraît anodin : rien ne permet de voir ce qui se trouve dessous. Les pages qui multiplient les fenêtres à fermer habituent à cliquer vite, sans lire.",
    example: {
      setting: "Site de vidéos inconnu, ouvert depuis un lien partagé sur une messagerie.",
      message:
        "Cliquez deux fois sur Lecture pour confirmer que vous n'êtes pas un robot.\n[▶ Lecture]",
      giveaways: [
        "Aucun site ne confirme un humain par un double clic sur Lecture.",
        "La page exige un clic à un endroit précis.",
        "Vous êtes connecté à vos comptes dans le même navigateur.",
      ],
    },
    decisionChecklist: [
      {
        check: "Une page vous demande-t-elle plusieurs clics rapprochés à un endroit précis pour continuer ?",
        then: "Quittez la page sans cliquer.",
      },
      {
        check: "Une application, une permission ou une publication est-elle apparue sur votre compte après une visite ?",
        then: "Retirez-la dans les réglages du compte et déconnectez les sessions.",
      },
      {
        check: "Une action sensible a-t-elle pu être faite en votre nom ?",
        then: "Changez le mot de passe et vérifiez l'activité récente du compte.",
      },
    ],
    prevention: [
      "Gardez le navigateur à jour.",
      "Déconnectez-vous des services sensibles quand vous ne les utilisez pas.",
      "Relisez de temps en temps les applications autorisées sur vos comptes.",
    ],
    relatedAttackCodes: ["WEB-000008", "WEB-000006", "ACCT-000008"],
    faq: [
      {
        question:
          "Le service peut-il voir que le clic n'était pas volontaire ?",
        answer:
          "Non, et c'est ce qui rend l'attaque efficace : le clic provient de votre navigateur, dans votre session authentifiée. Du point de vue du service, rien ne le distingue d'une action délibérée.",
      },
      {
        question: "Est-ce encore répandu aujourd'hui ?",
        answer:
          "Les navigateurs et les grands services appliquent des protections qui empêchent l'affichage en cadre, ce qui a beaucoup réduit la surface. Le risque subsiste sur les services qui ne les déclarent pas, et la vérification des autorisations tierces reste le bon réflexe.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "clickjacking",
        name: "Clickjacking (hijacked click)",
        plainLanguageDefinition:
          "You click on what you see, but the click lands on something else: an invisible button laid over the page. The action really is yours, its target isn't.",
        definition:
          "Clickjacking consists of overlaying a visible page with a transparent element from another site, so that a click aimed at the displayed content is received by that hidden element instead.",
        howItWorks:
          "A page can display another page in a frame, make it transparent, and position it under the cursor. The user sees an innocuous button — play a video, accept a banner — and clicks it; the click is received by the invisible frame, where a button from a service the user is already logged into sits. The result is an authenticated action they didn't intend: authorizing an application, approving a permission, publishing something. The particularity is that nothing is spoofed: the click is real, the session is real, and the service can't tell this action apart from a deliberate one. That's why the defense is almost entirely on the sites' side, which tell the browser to refuse being displayed in a frame — a protection now widely deployed, which makes the attack rarer than it used to be without making it disappear.",
        warningSigns: [
          "Button whose click produces a different result from what was announced",
          "Overlapping banners or windows requiring several clicks in quick succession",
          "Permission granted to an application you didn't install",
          "Post, subscription, or permission appearing after a visit to an unfamiliar site",
          "Page insisting you click at a precise spot to continue",
        ],
        howToVerify:
          "A hijacked click is noticed after the fact rather than during: review the third-party applications authorized and the permissions granted on your main accounts. A permission you don't recognize will be clearly visible there, whereas the click itself left no trace.",
        whatToDo:
          "Keep your browser up to date, since it applies the protections sites declare. Be wary of pages that demand a sequence of closely spaced clicks at precise spots, and log out of sensitive services rather than staying permanently signed in — a hijacked click is only worth something on an open session.",
        whatToDoIfVictim:
          "Remove third-party application permissions you don't recognize, revoke active sessions, and check recent posts or permissions. Change the password if a sensitive action may have been carried out in your name.",
        faq: [
          {
            question: "Can the service tell the click wasn't intentional?",
            answer:
              "No, and that's what makes the attack effective: the click comes from your browser, in your authenticated session. From the service's point of view, nothing distinguishes it from a deliberate action.",
          },
          {
            question: "Is this still common today?",
            answer:
              "Browsers and major services apply protections that prevent frame display, which has greatly reduced the attack surface. The risk remains on services that don't declare these protections, and checking third-party permissions is still the right habit.",
          },
        ],
        whyItWorks:
          "The click is real and the visible button looks harmless: nothing lets you see what's underneath. Pages that pile up windows to close train you to click fast, without reading.",
        example: {
          setting: "Unknown video site, opened from a link shared in a messaging app.",
          message:
            "Click Play twice to confirm you're not a robot.\n[▶ Play]",
          giveaways: [
            "No site confirms you're human with a double click on Play.",
            "The page requires a click in a precise spot.",
            "You're logged in to your accounts in the same browser.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does a page ask for several quick clicks in a precise spot to continue?",
            then: "Leave the page without clicking.",
          },
          {
            check: "Did an app, a permission or a post appear on your account after a visit?",
            then: "Remove it in the account settings and sign out of all sessions.",
          },
          {
            check: "Could a sensitive action have been taken in your name?",
            then: "Change the password and check the account's recent activity.",
          },
        ],
        prevention: [
          "Keep your browser up to date.",
          "Sign out of sensitive services when you're not using them.",
          "Review the apps authorized on your accounts from time to time.",
        ],
        references: [
          {
            label: "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
];

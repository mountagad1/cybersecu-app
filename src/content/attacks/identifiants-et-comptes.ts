import type { AttackEntry } from "./types";
import { VERIFIED_REFERENCES as REF } from "./types";

/** Identifiants et comptes — see ingenierie-sociale.ts for the content rules. */
export const IDENTIFIANTS_ET_COMPTES: AttackEntry[] = [
  {
    code: "ACCT-000001",
    slug: "bourrage-d-identifiants",
    name: "Bourrage d'identifiants",
    categorySlug: "identifiants-et-comptes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Votre mot de passe a fuité chez un site piraté, et quelqu'un l'essaie automatiquement partout ailleurs. Si vous utilisez le même mot de passe sur plusieurs services, ils tombent tous en même temps.",
    attackerObjective: "acces_a_un_compte",
    aliases: [
      "credential stuffing",
      "réutilisation d'identifiants",
      "attaque par liste d'identifiants",
    ],
    primaryVector: "web",
    primaryDimension: "account_security_awareness",
    simulationSlug: "alerte-connexion-inhabituelle",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "Le bourrage d'identifiants consiste à réutiliser des couples identifiant / mot de passe issus d'une fuite de données sur d'autres services, en pariant sur le fait que la même personne a employé le même mot de passe ailleurs.",
    howItWorks:
      "Lorsqu'un service est compromis, les identifiants qu'il détenait circulent ensuite sous forme de listes. L'attaquant ne cherche pas à deviner un mot de passe : il dispose déjà du vôtre, et l'essaie automatiquement sur des dizaines de services courants — messagerie, commerce, réseaux sociaux. Aucune faille n'est exploitée sur le service visé, et la connexion apparaît légitime puisqu'elle utilise le bon mot de passe. C'est pourquoi la réutilisation d'un mot de passe transforme la fuite d'un service en compromission de tous les autres, parfois des années après la fuite d'origine.",
    warningSigns: [
      "Notification de connexion depuis un appareil ou un lieu inhabituel",
      "Email de réinitialisation de mot de passe que vous n'avez pas demandé",
      "Mot de passe qui ne fonctionne plus alors que vous ne l'avez pas changé",
      "Service vous signalant que votre adresse figure dans une fuite de données",
      "Activité inexpliquée sur un compte secondaire, apparemment sans valeur",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Consultez l'historique des connexions du compte, que la plupart des grands services proposent dans leurs paramètres de sécurité : il indique dates, appareils et localisations approximatives. Vérifiez aussi les règles de transfert automatique de votre messagerie, souvent modifiées après une intrusion.",
    whatToDo:
      "Utilisez un mot de passe différent pour chaque service — un gestionnaire de mots de passe rend cela praticable — et activez la double authentification au moins sur la messagerie et la banque. Un mot de passe unique par service suffit à neutraliser complètement cette attaque.",
    whatToDoIfVictim:
      "Changez le mot de passe du compte concerné, puis celui de tous les comptes qui partageaient le même. Commencez par la messagerie principale : elle permet de réinitialiser tous les autres. Révoquez les sessions actives, vérifiez les règles de transfert et activez la double authentification.",
    whyItWorks:
      "Retenir un mot de passe différent par service paraît impossible, alors on en réutilise un. Une fuite chez un site oublié semble sans conséquence, et rien ne prévient que ce même mot de passe ouvre aussi la messagerie.",
    example: {
      setting: "Email reçu un dimanche matin, envoyé par un site de commerce où vous avez un compte.",
      message:
        "Nouvelle connexion à votre compte depuis un ordinateur Windows, à 03:12. Si c'était vous, aucune action n'est nécessaire. Sinon, sécurisez votre compte depuis vos paramètres.",
      giveaways: [
        "Vous dormiez à cette heure et n'utilisez pas cet appareil.",
        "Le mot de passe de ce compte est le même que sur d'autres sites.",
        "La connexion a réussi du premier coup : le mot de passe était connu.",
      ],
    },
    decisionChecklist: [
      {
        check: "Recevez-vous une alerte de connexion ou de réinitialisation que vous n'expliquez pas ?",
        then: "Ouvrez le service par votre favori ou l'application et changez le mot de passe.",
      },
      {
        check: "Ce mot de passe sert-il aussi sur d'autres comptes ?",
        then: "Changez-le partout, en commençant par la messagerie.",
      },
      {
        check: "L'historique du compte montre-t-il des connexions inconnues ?",
        then: "Déconnectez toutes les sessions, vérifiez les règles de transfert et activez la double authentification.",
      },
    ],
    prevention: [
      "Un mot de passe différent par service, avec un gestionnaire de mots de passe.",
      "La double authentification, au moins sur la messagerie et la banque.",
      "Fermez les comptes que vous n'utilisez plus : leurs mots de passe peuvent fuiter aussi.",
    ],
    relatedAttackCodes: [
      "ACCT-000002",
      "ACCT-000003",
      "PHISH-000001",
      "IDN-000002",
      "PERS-000002",
      "PERS-000010",
      "ACCT-000005",
      "ACCT-000006",
      "ACCT-000010",
      "MOB-000009",
      "DATA-000001",
    ],
    faq: [
      {
        question: "Mon mot de passe est complexe, suis-je protégé ?",
        answer:
          "Non, et c'est ce qui distingue cette attaque des autres : elle n'essaie pas de deviner. Un mot de passe très long reste inutile s'il a fuité ailleurs et s'il est réutilisé. Le critère qui protège est l'unicité, pas la complexité.",
      },
      {
        question: "Un vieux compte oublié peut-il vraiment poser problème ?",
        answer:
          "Oui. Il porte souvent une adresse email encore active et un mot de passe réutilisé depuis. C'est un point d'entrée fréquent, précisément parce que personne ne le surveille.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "credential-stuffing",
        simulationSlug: "unusual-sign-in-alert",
        name: "Credential stuffing",
        plainLanguageDefinition:
          "Your password leaked from a hacked site, and someone is now trying it automatically everywhere else. If you use the same password on several services, they all fall at once.",
        definition:
          "Credential stuffing is the reuse of username/password pairs obtained from a data breach against other services, betting that the same person used the same password elsewhere.",
        howItWorks:
          "When a service is compromised, the credentials it held then circulate as lists. The attacker isn't trying to guess a password: they already have yours, and try it automatically against dozens of common services — email, shopping, social media. No flaw is exploited on the targeted service, and the login looks legitimate since it uses the correct password. This is why reusing a password turns one service's breach into the compromise of every other, sometimes years after the original leak.",
        warningSigns: [
          "Login notification from an unusual device or location",
          "Password reset email you didn't request",
          "A password that stops working even though you never changed it",
          "A service telling you your address appears in a data breach",
          "Unexplained activity on a secondary account that seems worthless",
        ],
        howToVerify:
          "Check the account's login history, which most major services offer in their security settings: it shows dates, devices, and approximate locations. Also check your email's automatic forwarding rules, often altered after an intrusion.",
        whatToDo:
          "Use a different password for each service — a password manager makes this practical — and enable two-factor authentication at least on email and banking. A unique password per service is enough to fully neutralize this attack.",
        whatToDoIfVictim:
          "Change the password of the affected account, then every account that shared it. Start with your main email: it lets you reset all the others. Revoke active sessions, check forwarding rules, and enable two-factor authentication.",
        faq: [
          {
            question: "My password is complex — am I protected?",
            answer:
              "No, and that's what sets this attack apart from others: it doesn't try to guess. A very long password is useless if it has leaked elsewhere and is reused. The criterion that protects you is uniqueness, not complexity.",
          },
          {
            question: "Can a forgotten old account really be a problem?",
            answer:
              "Yes. It often carries an email address that's still active and a password reused since then. It's a frequent entry point, precisely because no one is watching it.",
          },
        ],
        whyItWorks:
          "Remembering a different password for each service seems impossible, so people reuse one. A breach at a forgotten site seems harmless, and nothing warns you that the same password also opens your email.",
        example: {
          setting: "Email received on a Sunday morning, sent by a shopping site where you have an account.",
          message:
            "New sign-in to your account from a Windows computer, at 03:12. If this was you, no action is needed. If not, secure your account from your settings.",
          giveaways: [
            "You were asleep at that time and don't use that device.",
            "This account's password is the same as on other sites.",
            "The login succeeded on the first try: the password was already known.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are you receiving a login or reset alert you can't explain?",
            then: "Open the service from your bookmark or the app and change the password.",
          },
          {
            check: "Is this password also used on other accounts?",
            then: "Change it everywhere, starting with your email.",
          },
          {
            check: "Does the account history show logins you don't recognize?",
            then: "Sign out of all sessions, check forwarding rules and turn on two-factor authentication.",
          },
        ],
        prevention: [
          "A different password for each service, with a password manager.",
          "Two-factor authentication, at least on your email and your bank.",
          "Close accounts you no longer use: their passwords can leak too.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "ACCT-000002",
    slug: "contournement-double-authentification",
    name: "Contournement de la double authentification",
    categorySlug: "identifiants-et-comptes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "L'escroc a déjà votre mot de passe et déclenche une connexion. Il vous appelle dans la foulée pour vous faire dicter le code reçu — ou vous noie de notifications jusqu'à ce que vous en validiez une.",
    attackerObjective: "acces_a_un_compte",
    aliases: [
      "MFA fatigue",
      "fatigue d'authentification",
      "bombardement de notifications",
      "vol de code à usage unique",
    ],
    primaryVector: "phone",
    primaryDimension: "account_security_awareness",
    simulationSlug: "code-a-usage-unique-demande",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "Le contournement de la double authentification vise le second facteur lui-même : plutôt que de le franchir techniquement, l'attaquant obtient de la victime qu'elle le transmette ou qu'elle l'approuve.",
    howItWorks:
      "L'attaquant possède déjà le mot de passe et déclenche une connexion, ce qui envoie un code ou une notification à la victime. Il agit ensuite selon deux voies. Dans la première, il appelle ou écrit dans la seconde qui suit, en se présentant comme le service concerné, et demande de lui communiquer « le code de vérification » — le code est authentique, ce qui rend la demande crédible. Dans la seconde, il relance des dizaines de demandes d'approbation jusqu'à ce que la victime, lassée ou réveillée la nuit, en accepte une pour faire cesser les notifications. Dans les deux cas la protection fonctionne : c'est le consentement qui est obtenu, pas le mécanisme qui est cassé.",
    warningSigns: [
      "Code de vérification reçu sans avoir tenté de vous connecter",
      "Demande d'approbation répétée, en rafale ou pendant la nuit",
      "Interlocuteur qui demande de lui lire un code, quel que soit le motif invoqué",
      "Message rappelant qu'il faut « valider pour annuler » une connexion suspecte",
      "Contact survenant immédiatement après la réception du code",
    ],
    triggers: ["urgency", "authority", "fear"],
    indicators: [],
    howToVerify:
      "Un code reçu que vous n'avez pas déclenché signifie une seule chose : quelqu'un connaît déjà votre mot de passe. C'est le signal qu'il faut le changer immédiatement. Aucun service, aucune banque, aucun support ne demande jamais de communiquer un code de vérification, quel que soit le canal.",
    whatToDo:
      "Ne transmettez jamais un code et refusez toute demande d'approbation que vous n'avez pas initiée à la seconde même. Changez ensuite le mot de passe du compte concerné. Privilégiez une application d'authentification ou une clé de sécurité physique plutôt qu'un code par SMS.",
    whatToDoIfVictim:
      "Changez le mot de passe, révoquez toutes les sessions actives et vérifiez les paramètres de récupération du compte — adresse de secours, numéro de téléphone, règles de transfert — que l'attaquant modifie en priorité pour conserver l'accès. Régénérez les codes de secours.",
    whyItWorks:
      "Le code est authentique et arrive au moment exact où l'interlocuteur en parle : cette coïncidence tient lieu de preuve. Les rafales de notifications misent sur la lassitude, car accepter paraît le seul moyen d'avoir la paix, surtout en pleine nuit.",
    example: {
      setting: "Appel reçu quelques secondes après un SMS contenant un code, en milieu de soirée.",
      message:
        "Bonjour, service sécurité de votre messagerie. Nous bloquons en ce moment une connexion frauduleuse sur votre compte. Pour l'annuler, j'ai besoin du code à six chiffres que vous venez de recevoir par SMS.",
      giveaways: [
        "Un code sert à se connecter, jamais à annuler une connexion.",
        "Aucun service n'appelle pour se faire lire un code.",
        "L'appel suit le code de trop près : c'est l'appelant qui l'a déclenché.",
      ],
    },
    decisionChecklist: [
      {
        check: "Avez-vous reçu un code ou une demande d'approbation sans avoir essayé de vous connecter ?",
        then: "Ne le transmettez pas et refusez la demande : quelqu'un connaît votre mot de passe. Changez-le maintenant.",
      },
      {
        check: "Quelqu'un vous demande-t-il de lui lire ou de lui envoyer ce code ?",
        then: "Raccrochez. Aucun service ne le demande, quel que soit le motif.",
      },
      {
        check: "Avez-vous déjà communiqué le code ou validé la demande ?",
        then: "Changez le mot de passe, déconnectez toutes les sessions et vérifiez l'adresse et le numéro de secours du compte.",
      },
    ],
    prevention: [
      "Donnez à chaque compte un mot de passe unique : sans mot de passe connu, il n'y a pas de code à obtenir.",
      "Passez à une application d'authentification ou à une clé de sécurité là où le service le permet.",
      "Retenez la règle : un code se saisit, il ne se dicte jamais.",
    ],
    relatedAttackCodes: [
      "ACCT-000001",
      "ACCT-000004",
      "SOCIAL-000001",
      "ACCT-000003",
      "PERS-000005",
      "ACCT-000005",
      "ACCT-000008",
      "MAL-000004",
    ],
    faq: [
      {
        question:
          "La double authentification sert-elle encore à quelque chose ?",
        answer:
          "Oui, et elle reste indispensable : c'est précisément parce qu'elle bloque l'attaquant qu'il doit vous demander votre aide pour la franchir. Une clé de sécurité physique ou une application d'authentification résiste nettement mieux qu'un code par SMS.",
      },
      {
        question: "J'ai approuvé une notification par erreur, que faire ?",
        answer:
          "Changez le mot de passe immédiatement, puis déconnectez toutes les sessions actives depuis les paramètres du compte. Vérifiez ensuite l'adresse de récupération et les règles de transfert de la messagerie : ce sont les premières choses modifiées après une intrusion.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "mfa-bypass",
        simulationSlug: "one-time-code-request",
        name: "Two-factor authentication bypass",
        plainLanguageDefinition:
          "The scammer already has your password and triggers a login. They call you right afterward to get you to read out the code you received — or flood you with approval requests until you accept one.",
        definition:
          "Bypassing two-factor authentication targets the second factor itself: instead of breaking through it technically, the attacker gets the victim to hand it over or approve it.",
        howItWorks:
          "The attacker already has the password and triggers a login, which sends a code or a notification to the victim. They then act along one of two paths. In the first, they call or message within the following seconds, posing as the service in question, and ask the victim to share \"the verification code\" — the code is genuine, which makes the request credible. In the second, they send dozens of approval requests until the victim, worn down or woken at night, accepts one just to stop the notifications. In both cases the protection works as designed: it's consent that's obtained, not the mechanism that's broken.",
        warningSigns: [
          "A verification code received without having tried to log in",
          "Repeated approval requests, in a burst or during the night",
          "A caller asking you to read them a code, whatever the stated reason",
          "A message urging you to \"approve to cancel\" a suspicious login",
          "Contact arriving immediately after the code is received",
        ],
        howToVerify:
          "A code received that you didn't trigger means one thing: someone already knows your password. That's the signal to change it immediately. No service, no bank, no support line ever asks you to share a verification code, whatever the channel.",
        whatToDo:
          "Never share a code and refuse any approval request you didn't initiate yourself, the second it arrives. Then change the password of the affected account. Prefer an authenticator app or a physical security key over an SMS code.",
        whatToDoIfVictim:
          "Change the password, revoke all active sessions, and check the account's recovery settings — backup address, phone number, forwarding rules — which the attacker changes first to keep access. Regenerate backup codes.",
        faq: [
          {
            question: "Is two-factor authentication still worth anything?",
            answer:
              "Yes, and it remains essential: it's precisely because it blocks the attacker that they have to ask for your help to get past it. A physical security key or an authenticator app resists far better than an SMS code.",
          },
          {
            question: "I approved a notification by mistake — what should I do?",
            answer:
              "Change the password immediately, then sign out of all active sessions in the account settings. Then check the recovery address and the email's forwarding rules: these are the first things changed after an intrusion.",
          },
        ],
        whyItWorks:
          "The code is genuine and arrives at the exact moment the caller mentions it: that coincidence passes for proof. Floods of notifications bet on fatigue, since approving seems like the only way to get some peace, especially in the middle of the night.",
        example: {
          setting: "Call received a few seconds after a text containing a code, in the evening.",
          message:
            "Hello, this is your email provider's security team. We're blocking a fraudulent login on your account right now. To cancel it, I need the six-digit code you just received by text.",
          giveaways: [
            "A code is used to log in, never to cancel a login.",
            "No service calls to have a code read out to it.",
            "The call follows the code too closely: the caller triggered it.",
          ],
        },
        decisionChecklist: [
          {
            check: "Did you receive a code or an approval request without trying to log in?",
            then: "Don't pass it on and deny the request: someone knows your password. Change it now.",
          },
          {
            check: "Is someone asking you to read out or send them this code?",
            then: "Hang up. No service asks for it, whatever the reason.",
          },
          {
            check: "Have you already shared the code or approved the request?",
            then: "Change the password, sign out of all sessions and check the account's recovery email and phone number.",
          },
        ],
        prevention: [
          "Give each account a unique password: with no known password, there's no code to obtain.",
          "Switch to an authenticator app or a security key where the service allows it.",
          "Remember the rule: a code is typed in, never read out.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "ACCT-000003",
    slug: "piratage-de-messagerie",
    name: "Piratage de messagerie",
    categorySlug: "identifiants-et-comptes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Quelqu'un entre dans votre boîte email et y crée une règle qui lui transfère une copie de tout. Comme la messagerie permet de réinitialiser tous vos autres comptes, elle ouvre le reste.",
    attackerObjective: "acces_a_un_compte",
    aliases: [
      "piratage d'email",
      "compte de messagerie compromis",
      "piratage de boîte mail",
    ],
    primaryVector: "email",
    primaryDimension: "account_security_awareness",
    simulationSlug: "regle-de-transfert-inconnue",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "Le piratage de messagerie est la prise de contrôle d'une boîte email, qui donne accès non seulement aux messages mais aussi à la réinitialisation de tous les comptes qui y sont rattachés.",
    howItWorks:
      "L'accès est obtenu par un mot de passe réutilisé, un hameçonnage ou un code transmis. Ce qui suit est plus discret que la prise de contrôle elle-même : l'attaquant crée une règle de transfert automatique vers une adresse qu'il contrôle, ce qui lui donne une copie permanente du courrier même après un changement de mot de passe. Il consulte ensuite l'historique pour identifier banques, fournisseurs et administrations rattachés, puis utilise la fonction « mot de passe oublié » de ces services — dont les emails de réinitialisation arrivent, par construction, dans la boîte qu'il contrôle. La messagerie est ainsi le compte le plus sensible : elle est la clé de tous les autres.",
    warningSigns: [
      "Règle de transfert ou de filtrage automatique que vous n'avez pas créée",
      "Messages lus alors que vous ne les avez pas ouverts, ou disparus du dossier reçus",
      "Emails de réinitialisation reçus pour des services que vous n'avez pas sollicités",
      "Vos contacts reçoivent des messages que vous n'avez pas envoyés",
      "Adresse de récupération ou numéro de téléphone du compte modifié",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Ouvrez les paramètres de la messagerie et vérifiez trois éléments : les règles de transfert et de filtrage, l'adresse et le numéro de récupération, et l'historique des connexions récentes. Une règle de transfert inconnue est la preuve la plus nette d'une intrusion, et la plus fréquemment oubliée après un changement de mot de passe.",
    whatToDo:
      "Traitez la messagerie principale comme le compte le plus critique : mot de passe unique, double authentification activée, et vérification périodique des règles de transfert.",
    whatToDoIfVictim:
      "Changez le mot de passe depuis un appareil sain, supprimez toute règle de transfert inconnue, révoquez les sessions et les applications tierces connectées, puis rétablissez l'adresse et le numéro de récupération. Changez ensuite les mots de passe des comptes rattachés à cette adresse, en commençant par les comptes bancaires. Prévenez vos contacts, qui recevront probablement des messages en votre nom.",
    whyItWorks:
      "La messagerie est le compte le moins protégé au regard de ce qu'il ouvre : la réinitialisation de presque tous les autres passe par elle. Et l'intrusion peut rester silencieuse, une règle de transfert continuant de fonctionner après un changement de mot de passe.",
    example: {
      setting: "Un matin, plusieurs emails de réinitialisation arrivent pour des services que vous n'avez pas sollicités.",
      message:
        "Objet : Réinitialisation de votre mot de passe\n\nUne demande de réinitialisation a été faite pour votre compte. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.",
      giveaways: [
        "Plusieurs services différents au même moment.",
        "Des demandes que vous n'avez pas faites.",
        "Ces emails peuvent être authentiques : ils signalent que quelqu'un essaie d'utiliser votre adresse.",
      ],
    },
    decisionChecklist: [
      {
        check: "Trouvez-vous dans les paramètres une règle de transfert que vous n'avez pas créée ?",
        then: "Supprimez-la : c'est la preuve d'une intrusion. Suivez ensuite le guide pour reprendre le compte.",
      },
      {
        check: "L'adresse ou le numéro de récupération ont-ils changé ?",
        then: "Rétablissez-les avant tout le reste.",
      },
      {
        check: "L'historique montre-t-il des connexions que vous ne reconnaissez pas ?",
        then: "Fermez toutes les sessions et changez le mot de passe depuis un appareil sain.",
      },
    ],
    prevention: [
      "Donnez à votre messagerie un mot de passe unique et activez la double authentification.",
      "Contrôlez de temps en temps les règles de transfert et les moyens de récupération.",
      "Gardez une adresse de secours active et elle-même protégée.",
    ],
    relatedAttackCodes: [
      "ACCT-000001",
      "ACCT-000002",
      "PAYMENT-000004",
      "ACCT-000004",
      "PAYMENT-000002",
      "SOCIAL-000003",
      "SOCIAL-000004",
      "SOCIAL-000005",
      "WEB-000002",
      "PERS-000005",
      "ACCT-000008",
      "ACCT-000009",
      "DATA-000001",
      "DATA-000002",
      "DATA-000006",
      "MAL-000004",
    ],
    faq: [
      {
        question: "J'ai changé mon mot de passe, est-ce suffisant ?",
        answer:
          "Pas toujours. Une règle de transfert automatique créée pendant l'intrusion survit au changement de mot de passe et continue d'envoyer une copie de votre courrier. Il faut aussi révoquer les sessions actives et vérifier l'adresse de récupération.",
      },
      {
        question:
          "Pourquoi la messagerie est-elle plus sensible que le compte bancaire ?",
        answer:
          "Parce qu'elle permet de réinitialiser le reste, banque comprise. Un attaquant qui contrôle la boîte email peut demander une réinitialisation sur presque tous les services rattachés et en recevoir lui-même les liens.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "email-account-takeover",
        simulationSlug: "unknown-forwarding-rule",
        name: "Email account takeover",
        plainLanguageDefinition:
          "Someone gets into your inbox and creates a rule that forwards a copy of everything to them. Since email lets you reset all your other accounts, it opens up the rest.",
        definition:
          "Email account takeover is gaining control of a mailbox, which grants access not only to messages but also to resetting every account linked to it.",
        howItWorks:
          "Access is gained through the usual paths: a reused password, phishing, or a transmitted code. What follows is subtler than the takeover itself: the attacker creates an automatic forwarding rule to an address they control, which gives them a permanent copy of the mail even after a password change. They then browse the history to identify linked banks, providers, and administrations, and use those services' \"forgot password\" function — whose reset emails arrive, by design, in the mailbox they control. Email is therefore the most sensitive account: it is the key to all the others.",
        warningSigns: [
          "A forwarding or filtering rule you didn't create",
          "Messages marked as read that you never opened, or missing from the inbox",
          "Reset emails received for services you never requested",
          "Your contacts receiving messages you didn't send",
          "The account's recovery address or phone number changed",
        ],
        howToVerify:
          "Open the mailbox's settings and check three things: forwarding and filtering rules, the recovery address and phone number, and the recent login history. An unknown forwarding rule is the clearest proof of an intrusion, and the one most often overlooked after a password change.",
        whatToDo:
          "Treat your main mailbox as your most critical account: a unique password, two-factor authentication enabled, and periodic checks of forwarding rules.",
        whatToDoIfVictim:
          "Change the password from a clean device, remove any unknown forwarding rule, revoke sessions and connected third-party apps, then restore the recovery address and phone number. Then change the passwords of accounts linked to that address, starting with bank accounts. Warn your contacts, who will likely receive messages sent in your name.",
        faq: [
          {
            question: "I changed my password — is that enough?",
            answer:
              "Not always. A forwarding rule created during the intrusion survives a password change and keeps sending a copy of your mail. You also need to revoke active sessions and check the recovery address.",
          },
          {
            question: "Why is email more sensitive than a bank account?",
            answer:
              "Because it lets you reset everything else, banking included. An attacker who controls the mailbox can request a reset on nearly every linked service and receive the links themselves.",
          },
        ],
        whyItWorks:
          "Email is the least protected account compared with what it unlocks: resetting almost every other account goes through it. And the intrusion can stay silent, since a forwarding rule keeps working after a password change.",
        example: {
          setting: "One morning, several reset emails arrive for services you didn't contact.",
          message:
            "Subject: Reset your password\n\nA reset request was made for your account. If you did not make this request, ignore this message.",
          giveaways: [
            "Several different services at the same time.",
            "Requests you didn't make.",
            "These emails may be genuine: they signal that someone is trying to use your address.",
          ],
        },
        decisionChecklist: [
          {
            check: "Do you find a forwarding rule in your settings that you didn't create?",
            then: "Delete it: it's proof of an intrusion. Then follow the guide to take the account back.",
          },
          {
            check: "Has the recovery address or number changed?",
            then: "Restore them before anything else.",
          },
          {
            check: "Does the history show logins you don't recognize?",
            then: "Close all sessions and change the password from a clean device.",
          },
        ],
        prevention: [
          "Give your email a unique password and turn on two-factor authentication.",
          "Check forwarding rules and recovery options from time to time.",
          "Keep a backup address that is active and protected too.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "ACCT-000004",
    slug: "echange-de-carte-sim",
    simulationSlug: "sms-confirmation-changement-carte-sim",
    name: "Échange de carte SIM",
    categorySlug: "identifiants-et-comptes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Votre numéro de téléphone est transféré vers une carte SIM que quelqu'un d'autre détient. Votre téléphone perd le réseau, et les codes de vérification par SMS arrivent chez lui.",
    attackerObjective: "acces_a_un_compte",
    aliases: [
      "SIM swapping",
      "SIM swap",
      "détournement de numéro",
      "échange de SIM",
    ],
    primaryVector: "phone",
    primaryDimension: "account_security_awareness",
    updatedAt: "2026-08-31",
    publishedAt: "2026-08-31",
    definition:
      "L'échange de carte SIM consiste à faire transférer votre numéro de téléphone vers une carte contrôlée par l'attaquant, qui reçoit alors à votre place les appels et les codes de vérification envoyés par SMS.",
    howItWorks:
      "L'attaquant rassemble d'abord des informations personnelles suffisantes pour se faire passer pour vous auprès de l'opérateur — éléments souvent publics, ou obtenus par un hameçonnage préalable. Il demande ensuite le transfert du numéro vers une nouvelle carte, en invoquant une perte ou un changement d'appareil. Dès l'activation, votre téléphone perd le réseau : c'est le signe le plus immédiat, et il précède de peu les tentatives de réinitialisation. L'attaquant utilise alors « mot de passe oublié » sur vos comptes et reçoit les codes par SMS. Cette attaque explique pourquoi le SMS est le second facteur le plus fragile.",
    warningSigns: [
      "Perte soudaine et inexpliquée du réseau mobile, alors que le téléphone fonctionne",
      "Impossibilité d'appeler ou de recevoir des SMS sans panne connue de l'opérateur",
      "Notification de l'opérateur signalant un changement de carte SIM non demandé",
      "Emails de réinitialisation reçus juste après la perte du réseau",
      "Contact préalable inhabituel demandant des informations personnelles ou une pièce d'identité",
    ],
    triggers: ["authority", "trust"],
    indicators: [],
    howToVerify:
      "Si le réseau disparaît sans raison, insérez la carte dans un autre appareil ou vérifiez auprès d'une autre ligne s'il y a une panne locale. En l'absence de panne, appelez immédiatement l'opérateur depuis une autre ligne : le délai entre le transfert et l'exploitation est court.",
    whatToDo:
      "Demandez à votre opérateur d'ajouter un code confidentiel ou un blocage de portabilité sur la ligne. Remplacez, autant que possible, la double authentification par SMS par une application d'authentification ou une clé de sécurité, qui ne dépendent pas du numéro.",
    whatToDoIfVictim:
      "Appelez l'opérateur depuis une autre ligne pour faire annuler le transfert, puis contactez votre banque. Depuis un appareil sain, changez les mots de passe des comptes sensibles en commençant par la messagerie, et retirez le numéro comme moyen de récupération là où c'est possible. Déposez plainte et signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Le numéro de téléphone sert de clé à beaucoup de comptes, mais personne ne le surveille. Une perte de réseau ressemble à une panne banale : on attend qu'elle passe, et c'est ce temps que l'attaquant utilise.",
    example: {
      setting: "SMS reçu tard le soir, quelques minutes avant que le téléphone perde le réseau.",
      message:
        "Votre demande de nouvelle carte SIM a bien été prise en compte. Elle sera activée dans les prochaines minutes. Si vous n'êtes pas à l'origine de cette demande, contactez votre opérateur.",
      giveaways: [
        "Vous n'avez demandé aucune nouvelle carte.",
        "Le téléphone perd le réseau juste après, sans panne annoncée.",
        "Des emails de réinitialisation de mot de passe arrivent dans la foulée.",
      ],
    },
    decisionChecklist: [
      {
        check: "Votre téléphone a-t-il perdu le réseau sans raison, sans panne connue ?",
        then: "Appelez votre opérateur immédiatement depuis une autre ligne.",
      },
      {
        check: "Recevez-vous des emails de réinitialisation que vous n'avez pas demandés ?",
        then: "Changez le mot de passe de votre messagerie depuis un appareil sain, puis prévenez votre banque.",
      },
      {
        check: "L'opérateur confirme-t-il un changement de carte que vous n'avez pas fait ?",
        then: "Faites annuler le transfert, puis suivez la checklist d'urgence.",
      },
    ],
    prevention: [
      "Demandez à votre opérateur un code confidentiel ou un blocage sur la ligne.",
      "Remplacez la double authentification par SMS par une application ou une clé de sécurité là où c'est possible.",
      "Limitez les informations personnelles publiques qui permettent de se faire passer pour vous.",
    ],
    relatedAttackCodes: [
      "ACCT-000002",
      "ACCT-000003",
      "SOCIAL-000001",
      "ACCT-000009",
    ],
    faq: [
      {
        question: "Pourquoi mon téléphone n'a-t-il plus de réseau ?",
        answer:
          "Un numéro ne peut être actif que sur une seule carte à la fois. Si un transfert a été effectué, votre carte est désactivée dans la seconde. C'est pourquoi une perte de réseau soudaine, sans panne connue, mérite un appel immédiat à l'opérateur depuis une autre ligne.",
      },
      {
        question: "Faut-il abandonner la double authentification par SMS ?",
        answer:
          "Elle vaut mieux que rien et reste préférable à un mot de passe seul. Mais dès qu'un service propose une application d'authentification ou une clé de sécurité, préférez-la : ces méthodes ne dépendent pas du numéro et ne sont donc pas affectées par cette attaque.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "sim-swapping",
        simulationSlug: "sim-change-confirmation-text",
        name: "SIM swapping",
        plainLanguageDefinition:
          "Your phone number is transferred to a SIM card someone else holds. Your phone loses signal, and verification codes sent by SMS arrive on theirs instead.",
        definition:
          "SIM swapping consists of getting your phone number transferred to a card controlled by the attacker, who then receives calls and SMS verification codes meant for you.",
        howItWorks:
          "The attacker first gathers enough personal information to pose as you with the carrier — details that are often public, or obtained through prior phishing. They then request the number be transferred to a new SIM, claiming a lost phone or a device change. As soon as it's activated, your phone loses signal: that's the most immediate sign, and it comes shortly before reset attempts begin. The attacker then uses \"forgot password\" on your accounts and receives the codes by SMS. This attack is why SMS is the weakest second factor.",
        warningSigns: [
          "Sudden, unexplained loss of mobile signal while the phone still works otherwise",
          "Unable to call or receive texts with no known carrier outage",
          "A carrier notification about a SIM card change you didn't request",
          "Reset emails received right after the signal loss",
          "Unusual prior contact asking for personal information or an ID document",
        ],
        howToVerify:
          "If signal disappears for no reason, put the SIM in another device or check with another line whether there's a local outage. If there's no outage, call the carrier immediately from another line: the gap between the transfer and its exploitation is short.",
        whatToDo:
          "Ask your carrier to add a confidential code or a port-out block on the line. Replace SMS-based two-factor authentication with an authenticator app or a security key wherever possible, since these don't depend on the number.",
        whatToDoIfVictim:
          "Call the carrier from another line to have the transfer canceled, then contact your bank. From a clean device, change the passwords of sensitive accounts starting with email, and remove the number as a recovery method wherever possible. File a police report and report the incident to the relevant authority.",
        faq: [
          {
            question: "Why does my phone suddenly have no signal?",
            answer:
              "A number can only be active on one SIM at a time. If a transfer has taken place, your SIM is deactivated instantly. That's why a sudden loss of signal, with no known outage, deserves an immediate call to the carrier from another line.",
          },
          {
            question: "Should I give up on SMS-based two-factor authentication?",
            answer:
              "It's better than nothing and still preferable to a password alone. But as soon as a service offers an authenticator app or a security key, prefer it: these methods don't depend on the number and so aren't affected by this attack.",
          },
        ],
        whyItWorks:
          "Your phone number is the key to many accounts, but nobody keeps an eye on it. Losing signal looks like an ordinary outage: you wait for it to pass, and the attacker uses that time.",
        example: {
          setting: "Text received late in the evening, a few minutes before the phone loses signal.",
          message:
            "Your request for a new SIM card has been received. It will be activated in the next few minutes. If you did not make this request, contact your carrier.",
          giveaways: [
            "You didn't request a new SIM card.",
            "The phone loses signal right after, with no announced outage.",
            "Password reset emails arrive right after.",
          ],
        },
        decisionChecklist: [
          {
            check: "Has your phone lost signal for no reason, with no known outage?",
            then: "Call your carrier immediately from another line.",
          },
          {
            check: "Are you receiving reset emails you didn't request?",
            then: "Change your email password from a clean device, then warn your bank.",
          },
          {
            check: "Does your carrier confirm a SIM change you didn't make?",
            then: "Have the transfer canceled, then follow the emergency checklist.",
          },
        ],
        prevention: [
          "Ask your carrier for a PIN or a lock on your line.",
          "Replace text-message two-factor authentication with an app or a security key where possible.",
          "Limit the public personal information that lets someone pass as you.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "ACCT-000005",
    slug: "pulverisation-de-mots-de-passe",
    noSimulationReason:
      "Côté visiteur, le seul indice est l'historique de connexion du compte à consulter soi-même ; côté organisation, c'est une signature statistique invisible sans outil de supervision. Aucun des deux n'est un message reçu.",
    name: "Pulvérisation de mots de passe",
    categorySlug: "identifiants-et-comptes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Plutôt que d'essayer mille mots de passe sur votre compte, l'attaquant en essaie un seul — très courant — sur mille comptes. Aucun compte n'est bloqué, parce qu'aucun n'a subi plus d'une tentative.",
    attackerObjective: "acces_a_un_compte",
    aliases: [
      "password spraying",
      "attaque par pulvérisation",
      "essai de mots de passe courants",
    ],
    primaryVector: "web",
    primaryDimension: "account_security_awareness",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "La pulvérisation de mots de passe consiste à tester un très petit nombre de mots de passe très répandus sur un très grand nombre de comptes, de façon à rester sous le seuil de tentatives qui déclencherait un verrouillage.",
    howItWorks:
      "Les protections d'un service comptent les échecs par compte : trois ou cinq essais ratés, et l'accès se bloque. L'attaquant inverse donc la boucle. Il part d'une liste de comptes — souvent des adresses professionnelles, dont la forme est prévisible à partir de l'organigramme — et teste un seul mot de passe sur toute la liste, puis attend, puis en teste un deuxième. Les mots de passe choisis ne sont pas aléatoires : ce sont ceux que les politiques de sécurité produisent mécaniquement, une saison suivie de l'année, le nom de l'entreprise suivi d'un point d'exclamation, ou le motif du clavier que tout le monde tape quand on exige un changement trimestriel. Il suffit d'un seul compte pour entrer, et dans une organisation de plusieurs centaines de personnes, il y en a presque toujours un.",
    warningSigns: [
      "Connexions réussies depuis un lieu ou un appareil inhabituel sur un compte peu utilisé",
      "Vague d'échecs d'authentification répartis sur de nombreux comptes, visible côté administrateur",
      "Compte de service ou boîte partagée, sans double authentification, utilisé à des heures anormales",
      "Politique interne imposant un changement fréquent, qui pousse aux mots de passe à motif",
      "Adresses professionnelles construites selon un format devinable et publiées en ligne",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Côté utilisateur, l'historique de connexion du compte est le seul indice : une connexion réussie que vous ne reconnaissez pas. Côté organisation, la signature est un taux d'échec faible mais très étalé, invisible si l'on ne surveille que les comptes pris isolément. Les comptes de service et les boîtes partagées sont à vérifier en premier : ce sont ceux que personne ne surveille.",
    whatToDo:
      "Ne construisez pas votre mot de passe sur un motif — saison, année, nom de l'entreprise, suite du clavier — même s'il satisfait les règles de complexité affichées. Une phrase longue et sans rapport avec vous résiste, là où « Automne2026! » figure dans toutes les listes. Activez la double authentification, qui rend la réussite d'un essai insuffisante.",
    whatToDoIfVictim:
      "Changez le mot de passe du compte et de tous ceux qui partageaient le même motif, pas seulement le même mot. Révoquez les sessions actives, vérifiez les règles de transfert de la messagerie et les autorisations d'applications tierces. En organisation, l'incident concerne rarement un seul compte : demandez une vérification sur l'ensemble du domaine plutôt que sur le vôtre.",
    whyItWorks:
      "Les règles de complexité poussent à des motifs faciles à retenir, comme une saison suivie de l'année, et ces motifs sont les mêmes pour tout le monde. Aucun compte n'est bloqué, donc aucune alerte ne se déclenche.",
    example: {
      setting: "Écran de changement de mot de passe imposé par votre employeur, comme chaque trimestre.",
      message:
        "Votre mot de passe expire. Nouveau mot de passe : Automne2026!\nLe mot de passe respecte les règles : 12 caractères, majuscule, chiffre, symbole.",
      giveaways: [
        "Le mot de passe suit un motif saison et année que les attaquants essaient en premier.",
        "Respecter les règles affichées ne le rend pas difficile à deviner.",
        "Le prochain sera Hiver2026!, et les attaquants le savent aussi.",
      ],
    },
    decisionChecklist: [
      {
        check: "Votre mot de passe suit-il un motif : saison, année, nom de l'entreprise, suite du clavier ?",
        then: "Remplacez-le par une phrase longue sans rapport avec vous, rangée dans un gestionnaire.",
      },
      {
        check: "L'historique de votre compte montre-t-il une connexion réussie que vous ne reconnaissez pas ?",
        then: "Changez le mot de passe, déconnectez les sessions et prévenez le service informatique.",
      },
      {
        check: "Gérez-vous des comptes de service ou des boîtes partagées sans double authentification ?",
        then: "Activez-la en priorité sur ces comptes : ce sont ceux que personne ne surveille.",
      },
    ],
    prevention: [
      "Bannissez les motifs, même conformes aux règles de complexité.",
      "Activez la double authentification sur tous les comptes, y compris partagés.",
      "En organisation, surveillez les échecs de connexion répartis sur l'ensemble des comptes, pas compte par compte.",
    ],
    relatedAttackCodes: ["ACCT-000001", "ACCT-000006", "ACCT-000002"],
    faq: [
      {
        question:
          "Mon mot de passe respectait toutes les règles de complexité.",
        answer:
          "Les règles de complexité vérifient une forme, pas une originalité. « Automne2026! » contient une majuscule, des chiffres et un caractère spécial, et figure pourtant en tête des listes d'essai, précisément parce que ces règles poussent tout le monde vers les mêmes constructions.",
      },
      {
        question: "En quoi est-ce différent d'une attaque par force brute ?",
        answer:
          "La force brute essaie beaucoup de mots de passe sur un compte, ce qui déclenche le verrouillage. La pulvérisation essaie peu de mots de passe sur beaucoup de comptes, ce qui ne déclenche rien. C'est la même idée retournée pour contourner exactement la protection qui existe.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "password-spraying",
        name: "Password spraying",
        plainLanguageDefinition:
          "Instead of trying a thousand passwords on your account, the attacker tries one — a very common one — on a thousand accounts. No account gets locked, because none has taken more than one attempt.",
        definition:
          "Password spraying consists of testing a very small number of extremely common passwords against a very large number of accounts, staying below the attempt threshold that would trigger a lockout.",
        howItWorks:
          "A service's protections count failures per account: three or five failed attempts, and access locks. The attacker inverts that loop. They start from a list of accounts — often professional addresses, whose format is predictable from the org chart — and test a single password across the whole list, then wait, then test a second one. The passwords chosen aren't random: they're the ones security policies mechanically produce, a season followed by the year, the company name followed by an exclamation mark, or the keyboard pattern everyone types when a quarterly change is required. It only takes one account to get in, and in an organization of several hundred people, there's almost always one.",
        warningSigns: [
          "Successful logins from an unusual location or device on a rarely used account",
          "A wave of authentication failures spread across many accounts, visible on the admin side",
          "A service account or shared mailbox, without two-factor authentication, used at odd hours",
          "An internal policy requiring frequent changes, which pushes people toward patterned passwords",
          "Professional addresses built on a guessable format and published online",
        ],
        howToVerify:
          "On the user side, the account's login history is the only clue: a successful login you don't recognize. On the organization side, the signature is a low but very spread-out failure rate, invisible if you only monitor accounts one at a time. Service accounts and shared mailboxes should be checked first: they're the ones no one watches.",
        whatToDo:
          "Don't build your password on a pattern — season, year, company name, keyboard sequence — even if it satisfies the displayed complexity rules. A long phrase unrelated to you holds up, where \"Autumn2026!\" appears in every attack list. Enable two-factor authentication, which makes a single successful guess insufficient.",
        whatToDoIfVictim:
          "Change the password of the account and every account that shared the same pattern, not just the same word. Revoke active sessions, check email forwarding rules and third-party app permissions. In an organization, the incident rarely concerns a single account: ask for a check across the whole domain rather than just your own.",
        faq: [
          {
            question: "My password met every complexity rule.",
            answer:
              "Complexity rules check a shape, not originality. \"Autumn2026!\" contains a capital letter, digits, and a special character, and yet tops attack lists, precisely because these rules push everyone toward the same constructions.",
          },
          {
            question: "How is this different from a brute-force attack?",
            answer:
              "Brute force tries many passwords on one account, which triggers the lockout. Spraying tries few passwords on many accounts, which triggers nothing. It's the same idea flipped around to bypass exactly the protection that exists.",
          },
        ],
        whyItWorks:
          "Complexity rules push people toward easy-to-remember patterns, like a season followed by the year, and those patterns are the same for everyone. No account gets locked, so no alert goes off.",
        example: {
          setting: "Password change screen required by your employer, as every quarter.",
          message:
            "Your password is expiring. New password: Autumn2026!\nThe password meets the rules: 12 characters, uppercase, number, symbol.",
          giveaways: [
            "The password follows a season-and-year pattern that attackers try first.",
            "Meeting the displayed rules doesn't make it hard to guess.",
            "The next one will be Winter2026!, and attackers know that too.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does your password follow a pattern: season, year, company name, keyboard sequence?",
            then: "Replace it with a long phrase unrelated to you, stored in a password manager.",
          },
          {
            check: "Does your account history show a successful login you don't recognize?",
            then: "Change the password, sign out of sessions and alert IT.",
          },
          {
            check: "Do you manage service accounts or shared mailboxes without two-factor authentication?",
            then: "Turn it on for those accounts first: they're the ones nobody watches.",
          },
        ],
        prevention: [
          "Ban patterns, even when they meet complexity rules.",
          "Turn on two-factor authentication on every account, shared ones included.",
          "In an organization, watch for failed logins spread across all accounts, not account by account.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "ACCT-000006",
    slug: "attaque-par-force-brute",
    simulationSlug: "email-tentatives-de-connexion-echouees",
    name: "Attaque par force brute",
    categorySlug: "identifiants-et-comptes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Essayer les mots de passe un par un jusqu'à tomber juste. Sur un site en ligne, c'est bloqué au bout de quelques essais — le vrai danger est ailleurs : sur un fichier de mots de passe volé, où l'attaquant essaie sans limite et sans que personne le voie.",
    attackerObjective: "identifiants",
    aliases: [
      "brute-force",
      "attaque par dictionnaire",
      "cassage de mot de passe",
    ],
    primaryVector: "web",
    primaryDimension: "account_security_awareness",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "L'attaque par force brute est l'essai systématique de mots de passe jusqu'à trouver le bon, soit directement contre un service, soit hors ligne contre une base d'empreintes de mots de passe dérobée.",
    howItWorks:
      "Contre un service en ligne, cette attaque fonctionne mal : le compte se verrouille au bout de quelques échecs, et la lenteur du réseau limite le nombre d'essais. C'est pourquoi elle a largement cédé la place à des techniques qui n'ont pas besoin de deviner. Elle redevient en revanche redoutable dans un cas précis : quand une base a été dérobée. Le service n'y stocke pas les mots de passe mais leurs empreintes, calculs à sens unique dont on ne peut pas revenir en arrière — mais que l'on peut recalculer, en essayant des candidats jusqu'à obtenir la même empreinte. L'attaquant travaille alors sur sa propre machine, sans limite de tentatives et sans être observé. La robustesse du mot de passe redevient déterminante, et pour la première fois la longueur compte réellement : c'est elle, plus que les caractères spéciaux, qui rend le calcul hors de portée.",
    warningSigns: [
      "Notification du service annonçant une fuite de sa base d'identifiants",
      "Série d'échecs de connexion sur votre compte, signalée par le service",
      "Verrouillage temporaire de compte que vous n'avez pas provoqué",
      "Ancien mot de passe court, réutilisé, sur un service qui a connu une fuite",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Contre un service, l'historique de connexion et les alertes de tentatives échouées suffisent. Contre une base dérobée, il n'y a rien à vérifier de votre côté : vous l'apprenez par la notification du service. La bonne question n'est donc pas « m'a-t-on attaqué » mais « ce mot de passe est-il encore utilisé quelque part », car c'est cela qui décide de la suite.",
    whatToDo:
      "Privilégiez la longueur : une phrase de plusieurs mots sans rapport entre eux vaut mieux qu'un mot court truffé de symboles, parce que c'est la longueur qui fait exploser le nombre de combinaisons à recalculer. Un gestionnaire de mots de passe permet d'avoir long et unique sans rien retenir, et la double authentification rend le mot de passe seul insuffisant.",
    whatToDoIfVictim:
      "Après l'annonce d'une fuite chez un service, changez-y le mot de passe et partout où il était réutilisé, sans attendre de savoir s'il a été retrouvé — le délai entre la fuite et son exploitation est précisément la fenêtre dont vous disposez. Activez la double authentification et vérifiez les connexions récentes.",
    whyItWorks:
      "Un mot de passe court et complexe paraît solide, alors que c'est la longueur qui protège. Et la fuite d'une base arrive loin de vous : rien ne vous alerte avant que le service ne vous prévienne.",
    example: {
      setting: "Email reçu de la part d'un service de stockage en ligne où vous avez un compte.",
      message:
        "Nous avons constaté un accès non autorisé à une partie de notre base de comptes. Les mots de passe y étaient stockés sous forme chiffrée. Par précaution, nous vous invitons à changer votre mot de passe et ceux de tout compte où vous l'utilisez.",
      giveaways: [
        "La fuite a eu lieu chez le service, pas sur votre appareil.",
        "Un mot de passe court peut être retrouvé à partir de son empreinte.",
        "Le risque s'étend à tous les comptes qui partagent ce mot de passe.",
      ],
    },
    decisionChecklist: [
      {
        check: "Un service vous annonce-t-il une fuite de sa base de comptes ?",
        then: "Changez ce mot de passe tout de suite, en passant par le site ou l'application du service.",
      },
      {
        check: "Ce mot de passe sert-il aussi ailleurs ?",
        then: "Changez-le partout, en commençant par la messagerie.",
      },
      {
        check: "Des échecs de connexion ou un verrouillage inexpliqué apparaissent-ils sur votre compte ?",
        then: "Changez le mot de passe et activez la double authentification.",
      },
    ],
    prevention: [
      "Préférez la longueur : une phrase de plusieurs mots sans rapport entre eux.",
      "Un mot de passe unique par service, rangé dans un gestionnaire.",
      "La double authentification sur les comptes importants.",
    ],
    relatedAttackCodes: ["ACCT-000005", "ACCT-000001", "ACCT-000007"],
    faq: [
      {
        question: "Mon mot de passe fait douze caractères, est-ce suffisant ?",
        answer:
          "La longueur est le bon levier, et douze caractères d'une phrase réelle valent mieux que huit caractères tordus. Mais aucune longueur ne protège si le mot de passe est réutilisé : dans ce cas il n'a pas besoin d'être calculé, il est déjà connu par ailleurs.",
      },
      {
        question:
          "Pourquoi entend-on parler de mots de passe « cassés » si les sites ne les stockent pas ?",
        answer:
          "Parce qu'ils stockent une empreinte, dont on ne revient pas en arrière mais que l'on peut retrouver en essayant des candidats jusqu'à obtenir la même valeur. Un mot de passe court ou courant est retrouvé ainsi ; un mot de passe long ne l'est pas, faute de temps.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "brute-force-attack",
        simulationSlug: "failed-sign-in-attempts-email",
        name: "Brute-force attack",
        plainLanguageDefinition:
          "Trying passwords one by one until one hits. On a live site, this gets blocked after a few tries — the real danger is elsewhere: a stolen password file, where the attacker tries without limit and with no one watching.",
        definition:
          "A brute-force attack is the systematic trial of passwords until the right one is found, either directly against a service or offline against a stolen database of password hashes.",
        howItWorks:
          "Against a live service, this attack works poorly: the account locks after a few failures, and network latency limits the number of attempts. That's why it has largely given way to techniques that don't need to guess. It becomes formidable again in one specific case: when a database has been stolen. The service doesn't store passwords but their hashes, one-way calculations that can't be reversed — but that can be recomputed, by trying candidates until the same hash comes out. The attacker then works on their own machine, with no limit on attempts and no one watching. Password strength becomes decisive again, and for the first time length really matters: it's length, more than special characters, that puts the calculation out of reach.",
        warningSigns: [
          "A notification from a service announcing a breach of its credentials database",
          "A series of failed login attempts on your account, flagged by the service",
          "A temporary account lockout you didn't cause",
          "An old, short, reused password on a service that had a breach",
        ],
        howToVerify:
          "Against a service, the login history and failed-attempt alerts are enough. Against a stolen database, there's nothing to check on your end: you learn about it from the service's notification. The right question isn't \"was I attacked\" but \"is this password still used anywhere,\" since that's what decides what to do next.",
        whatToDo:
          "Favor length: a phrase of several unrelated words beats a short word stuffed with symbols, because length is what makes the number of combinations to recompute explode. A password manager lets you have long and unique passwords without memorizing anything, and two-factor authentication makes the password alone insufficient.",
        whatToDoIfVictim:
          "After a service announces a breach, change the password there and everywhere it was reused, without waiting to learn whether it was actually cracked — the gap between the breach and its exploitation is exactly the window you have. Enable two-factor authentication and check recent logins.",
        faq: [
          {
            question: "My password is twelve characters — is that enough?",
            answer:
              "Length is the right lever, and twelve characters from a real phrase beat eight twisted ones. But no length protects a password that's reused: in that case it doesn't need to be computed at all, it's already known elsewhere.",
          },
          {
            question:
              "Why do we hear about passwords being \"cracked\" if sites don't store them?",
            answer:
              "Because they store a hash, which can't be reversed but can be matched by trying candidates until one produces the same value. A short or common password is found this way; a long one isn't, for lack of time.",
          },
        ],
        whyItWorks:
          "A short, complex password looks strong, when length is what actually protects it. And a database breach happens far from you: nothing alerts you until the service tells you.",
        example: {
          setting: "Email received from an online storage service where you have an account.",
          message:
            "We have detected unauthorized access to part of our account database. Passwords were stored there in encrypted form. As a precaution, we invite you to change your password and that of any account where you use it.",
          giveaways: [
            "The breach happened at the service, not on your device.",
            "A short password can be recovered from its hash.",
            "The risk extends to every account sharing that password.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is a service announcing a breach of its account database?",
            then: "Change that password right away, through the service's website or app.",
          },
          {
            check: "Do you use that password anywhere else?",
            then: "Change it everywhere, starting with your email.",
          },
          {
            check: "Are failed logins or an unexplained lockout showing up on your account?",
            then: "Change the password and turn on two-factor authentication.",
          },
        ],
        prevention: [
          "Favor length: a phrase of several unrelated words.",
          "One unique password per service, stored in a password manager.",
          "Two-factor authentication on your important accounts.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "ACCT-000007",
    slug: "infostealer",
    noSimulationReason:
      "Le diagnostic passe par l'examen des programmes récemment installés et des sessions ouvertes sur chaque compte, pas par un message reçu à un instant donné.",
    name: "Infostealer (logiciel voleur d'identifiants)",
    categorySlug: "identifiants-et-comptes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un programme qui s'installe sur votre machine et vide, en quelques secondes, tout ce que votre navigateur avait retenu : mots de passe enregistrés, sessions ouvertes, moyens de paiement. Vous ne remarquez rien, parce qu'il n'y a rien à remarquer.",
    attackerObjective: "identifiants",
    aliases: [
      "voleur d'informations",
      "stealer",
      "logiciel voleur de mots de passe",
    ],
    primaryVector: "file_attachment",
    primaryDimension: "account_security_awareness",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Un infostealer est un logiciel malveillant dont la fonction unique est de collecter puis d'exfiltrer les identifiants, cookies de session, jetons et données de paiement présents sur un appareil, avant de disparaître.",
    howItWorks:
      "L'installation est volontaire du point de vue du système : un fichier ouvert, une fausse mise à jour acceptée, un logiciel pris hors magasin officiel, un jeu ou un utilitaire « gratuit ». Une fois exécuté, le programme ne s'installe pas durablement et ne cherche pas à persister — il collecte et il part, ce qui explique qu'aucun symptôme n'apparaisse. Il vise en priorité le navigateur, parce que tout y est réuni : les mots de passe enregistrés, les cartes bancaires mémorisées, l'historique, et surtout les cookies de session. Ces derniers sont le butin le plus intéressant, car ils représentent une connexion déjà validée : celui qui les rejoue entre sans mot de passe et sans déclencher la double authentification, qui a déjà été franchie. C'est le point que la plupart des victimes découvrent trop tard — changer le mot de passe ne suffit pas si les sessions ne sont pas révoquées.",
    warningSigns: [
      "Connexions à vos comptes depuis un appareil inconnu, sans qu'aucun mot de passe n'ait été changé",
      "Double authentification qui ne se déclenche pas alors qu'une connexion a eu lieu ailleurs",
      "Achats ou abonnements avec une carte enregistrée dans le navigateur",
      "Installation récente d'un logiciel gratuit, d'un crack, ou d'une mise à jour proposée par une page web",
      "Messages envoyés depuis vos comptes sans que vous les ayez écrits",
    ],
    triggers: ["curiosity", "reward", "trust"],
    indicators: [],
    howToVerify:
      "Regardez ce qui a été installé récemment, et les extensions ajoutées au navigateur. Puis, dans chaque compte sensible, ouvrez la liste des sessions et des appareils connectés : une session que vous ne reconnaissez pas est le signe le plus net, et c'est celui que le changement de mot de passe ne fait pas disparaître.",
    whatToDo:
      "N'installez de logiciel que depuis le site de son éditeur ou un magasin officiel, et méfiez-vous particulièrement de ce qui est présenté comme la version gratuite d'un logiciel payant. Évitez d'enregistrer vos cartes bancaires dans le navigateur : c'est le premier endroit fouillé.",
    whatToDoIfVictim:
      "Dans cet ordre, et depuis un autre appareil : révoquez toutes les sessions actives de vos comptes, puis changez les mots de passe, puis régénérez les codes de secours. Révoquer avant de changer est l'ordre qui compte, car un cookie volé reste valide tant que la session n'est pas fermée. Faites ensuite analyser la machine, et surveillez les paiements des semaines suivantes.",
    whyItWorks:
      "Le programme ne laisse aucun symptôme, donc personne ne pense à vérifier. Le navigateur garde tout au même endroit par commodité, et c'est cette commodité qui fait du vol un travail de quelques secondes.",
    example: {
      setting: "Liste des appareils connectés à votre messagerie, consultée après l'installation d'un jeu « gratuit » la semaine précédente.",
      message:
        "Appareils connectés :\n• Votre ordinateur — actif maintenant\n• Votre téléphone — il y a 2 heures\n• Windows, navigateur inconnu — il y a 3 jours, autre pays",
      giveaways: [
        "Une session inconnue existe alors que vous n'avez reçu aucun code de double authentification.",
        "Votre mot de passe n'a pas été changé et fonctionne toujours.",
        "Un logiciel gratuit, hors magasin officiel, a été installé juste avant.",
      ],
    },
    decisionChecklist: [
      {
        check: "Vos comptes montrent-ils une session ou un appareil que vous ne reconnaissez pas ?",
        then: "Depuis un autre appareil, déconnectez toutes les sessions d'abord, puis changez le mot de passe.",
      },
      {
        check: "Avez-vous installé récemment un logiciel gratuit, un crack ou une mise à jour proposée par une page ?",
        then: "Considérez tout ce que le navigateur avait enregistré comme exposé et faites analyser la machine.",
      },
      {
        check: "Des cartes bancaires étaient-elles enregistrées dans le navigateur ?",
        then: "Prévenez votre banque et surveillez vos relevés dans les semaines qui suivent.",
      },
    ],
    prevention: [
      "N'installez de logiciel que depuis le site de l'éditeur ou un magasin officiel.",
      "N'enregistrez pas vos cartes bancaires dans le navigateur.",
      "Retenez l'ordre en cas de doute : déconnecter les sessions avant de changer le mot de passe.",
    ],
    relatedAttackCodes: [
      "ACCT-000008",
      "ACCT-000006",
      "SOCIAL-000008",
      "WEB-000002",
      "WEB-000005",
      "WEB-000006",
      "MOB-000002",
      "DATA-000001",
      "MAL-000002",
      "MAL-000003",
      "MAL-000004",
    ],
    faq: [
      {
        question: "J'ai changé tous mes mots de passe, suis-je tranquille ?",
        answer:
          "Pas encore. Un cookie de session dérobé représente une connexion déjà établie : il continue de fonctionner après le changement de mot de passe, jusqu'à ce que la session soit explicitement révoquée. Cherchez « appareils connectés » ou « sessions actives » dans les paramètres de chaque compte.",
      },
      {
        question: "Mon antivirus n'a rien signalé.",
        answer:
          "C'est possible : ces programmes sont conçus pour s'exécuter brièvement puis disparaître, ce qui leur laisse peu de temps pour être remarqués. L'absence d'alerte ne prouve rien ; les sessions actives de vos comptes, elles, sont vérifiables.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "infostealer",
        name: "Infostealer (credential-stealing malware)",
        plainLanguageDefinition:
          "A program that installs itself on your machine and empties, within seconds, everything your browser had remembered: saved passwords, open sessions, payment methods. You notice nothing, because there's nothing to notice.",
        definition:
          "An infostealer is malware whose sole function is to collect and exfiltrate credentials, session cookies, tokens, and payment data present on a device, then disappear.",
        howItWorks:
          "Installation is voluntary from the system's point of view: an opened file, a fake update accepted, software downloaded outside an official store, a \"free\" game or utility. Once run, the program doesn't install itself durably and doesn't try to persist — it collects and it leaves, which is why no symptom appears. It targets the browser first, because everything is gathered there: saved passwords, stored bank cards, history, and above all session cookies. These last are the most valuable haul, since they represent an already-validated login: whoever replays them gets in without a password and without triggering two-factor authentication, which has already been passed. This is what most victims discover too late — changing the password isn't enough if sessions aren't revoked.",
        warningSigns: [
          "Logins to your accounts from an unknown device, with no password ever changed",
          "Two-factor authentication that doesn't trigger even though a login happened elsewhere",
          "Purchases or subscriptions using a card saved in the browser",
          "Recent installation of free software, a cracked program, or an update offered by a webpage",
          "Messages sent from your accounts that you didn't write",
        ],
        howToVerify:
          "Look at what was recently installed, and the extensions added to the browser. Then, in each sensitive account, open the list of sessions and connected devices: a session you don't recognize is the clearest sign, and the one a password change doesn't make disappear.",
        whatToDo:
          "Only install software from the publisher's own site or an official store, and be especially wary of anything presented as the free version of paid software. Avoid saving your bank cards in the browser: it's the first place searched.",
        whatToDoIfVictim:
          "In this order, and from another device: revoke all active sessions on your accounts, then change the passwords, then regenerate backup codes. Revoking before changing is the order that matters, since a stolen cookie stays valid as long as the session isn't closed. Then have the machine scanned, and watch for payments over the following weeks.",
        faq: [
          {
            question: "I changed all my passwords — am I safe?",
            answer:
              "Not yet. A stolen session cookie represents an already-established login: it keeps working after the password change, until the session is explicitly revoked. Look for \"connected devices\" or \"active sessions\" in each account's settings.",
          },
          {
            question: "My antivirus flagged nothing.",
            answer:
              "That's possible: these programs are designed to run briefly then vanish, which leaves little time to be noticed. The absence of an alert proves nothing; your accounts' active sessions, on the other hand, can be checked.",
          },
        ],
        whyItWorks:
          "The program leaves no symptoms, so nobody thinks to check. The browser keeps everything in one place for convenience, and that convenience turns the theft into a few seconds' work.",
        example: {
          setting: "List of devices connected to your email account, checked after installing a \"free\" game the week before.",
          message:
            "Connected devices:\n• Your computer — active now\n• Your phone — 2 hours ago\n• Windows, unknown browser — 3 days ago, another country",
          giveaways: [
            "An unknown session exists although you received no two-factor code.",
            "Your password hasn't been changed and still works.",
            "Free software, from outside an official store, was installed just before.",
          ],
        },
        decisionChecklist: [
          {
            check: "Do your accounts show a session or device you don't recognize?",
            then: "From another device, sign out of all sessions first, then change the password.",
          },
          {
            check: "Did you recently install free software, a crack or an update offered by a web page?",
            then: "Treat everything the browser had saved as exposed and have the machine scanned.",
          },
          {
            check: "Were bank cards saved in the browser?",
            then: "Warn your bank and watch your statements over the following weeks.",
          },
        ],
        prevention: [
          "Install software only from the publisher's site or an official store.",
          "Don't save your bank cards in the browser.",
          "Remember the order when in doubt: sign out of sessions before changing the password.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        noSimulationReason:
          "Diagnosis relies on reviewing recently installed programs and each account's open sessions, not on a message received at a given moment.",
      },
    },
  },
  {
    code: "ACCT-000008",
    slug: "detournement-de-session",
    noSimulationReason:
      "Le détournement se constate dans la liste des sessions actives du compte, jamais par un message qui arrive : il n'y a pas de décision à prendre sous pression, seulement une vérification à mener dans les réglages.",
    name: "Détournement de session",
    categorySlug: "identifiants-et-comptes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Quand vous vous connectez, le site vous remet un jeton qui prouve que c'est bien vous, pour ne pas redemander le mot de passe à chaque page. Qui vole ce jeton entre à votre place — sans mot de passe, et sans code de vérification.",
    attackerObjective: "acces_a_un_compte",
    aliases: [
      "vol de cookie",
      "session hijacking",
      "vol de session",
      "pass-the-cookie",
    ],
    primaryVector: "web",
    primaryDimension: "account_security_awareness",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le détournement de session est la réutilisation, par un tiers, du jeton d'authentification remis à un utilisateur après sa connexion, ce qui donne accès au compte sans franchir à nouveau l'authentification.",
    howItWorks:
      "L'authentification n'a lieu qu'une fois : ensuite, le navigateur présente un cookie de session à chaque requête, et c'est lui qui fait foi. Ce jeton est donc l'équivalent d'un badge déjà validé. Il peut être récupéré de trois façons : par un logiciel installé sur la machine qui lit ce que stocke le navigateur, sur un réseau où le trafic n'est pas chiffré, ou par une page malveillante qui parvient à le faire fuir. Le fait notable est que le vol contourne l'authentification au lieu de l'affronter : ni le mot de passe ni le second facteur n'entrent en jeu, puisque tous deux ont déjà été présentés. C'est ce qui rend la révocation des sessions — et non le changement de mot de passe — la mesure qui met réellement fin à l'accès.",
    warningSigns: [
      "Session active depuis un appareil ou un lieu que vous ne reconnaissez pas",
      "Actions effectuées sur votre compte sans nouvelle demande de connexion",
      "Déconnexion inattendue suivie d'une activité anormale",
      "Aucun code de double authentification reçu, alors qu'une connexion a bien eu lieu",
      "Paramètres du compte modifiés sans qu'aucun mot de passe n'ait changé",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Ouvrez la liste des sessions ou des appareils connectés dans les paramètres du compte : c'est là que le détournement est visible, et nulle part ailleurs. Une entrée inconnue s'y affiche avec sa date et sa localisation approximative, alors même que l'historique de connexion ne montre rien d'anormal — puisqu'aucune connexion nouvelle n'a eu lieu.",
    whatToDo:
      "Fermez vos sessions sur les appareils partagés au lieu de fermer simplement l'onglet. Évitez de rester connecté indéfiniment aux services sensibles, et méfiez-vous des extensions de navigateur, qui peuvent lire ce que le navigateur stocke.",
    whatToDoIfVictim:
      "Révoquez toutes les sessions actives, sur tous les appareils, avant toute autre chose — c'est la seule action qui invalide le jeton volé. Changez ensuite le mot de passe, ce qui, dans la plupart des services, force également une réauthentification. Vérifiez enfin les règles de transfert, les adresses de récupération et les applications tierces autorisées.",
    whyItWorks:
      "On pense que le mot de passe et le code protègent le compte à chaque instant, alors qu'ils ne servent qu'à l'entrée. Rester connecté est pratique, et personne ne relit la liste de ses sessions.",
    example: {
      setting: "Paramètres de sécurité d'un réseau social, ouverts après une publication que vous n'avez pas faite.",
      message:
        "Où vous êtes connecté :\n• Ce téléphone — actif maintenant\n• Ordinateur portable — hier\n• Navigateur sur Linux — actif il y a 10 minutes, localisation inconnue\nHistorique des connexions : aucune nouvelle connexion.",
      giveaways: [
        "Une session active est inconnue, alors que l'historique ne montre aucune nouvelle connexion.",
        "Aucun code de double authentification n'a été demandé.",
        "Une action a été faite en votre nom sans que votre mot de passe ait changé.",
      ],
    },
    decisionChecklist: [
      {
        check: "La liste des sessions contient-elle un appareil ou un lieu que vous ne reconnaissez pas ?",
        then: "Déconnectez toutes les sessions, sur tous les appareils, avant toute autre chose.",
      },
      {
        check: "Une action a-t-elle été faite en votre nom sans nouvelle connexion visible ?",
        then: "Après la déconnexion, changez le mot de passe et vérifiez les adresses de récupération.",
      },
      {
        check: "Des extensions de navigateur ou des applications tierces ont-elles accès au compte ?",
        then: "Retirez celles que vous ne reconnaissez pas.",
      },
    ],
    prevention: [
      "Fermez vos sessions sur les appareils partagés, au lieu de fermer seulement l'onglet.",
      "Évitez de rester connecté indéfiniment aux services sensibles.",
      "Installez peu d'extensions de navigateur.",
    ],
    relatedAttackCodes: [
      "ACCT-000007",
      "ACCT-000002",
      "ACCT-000003",
      "WEB-000003",
      "WEB-000006",
      "WEB-000009",
      "DATA-000006",
      "NET-000001",
      "NET-000002",
      "NET-000005",
    ],
    faq: [
      {
        question:
          "La double authentification ne devait-elle pas empêcher cela ?",
        answer:
          "Elle protège le moment de la connexion, et le jeton est délivré après ce moment. Un attaquant qui rejoue une session n'a pas à se connecter : il présente une authentification déjà accomplie. C'est pourquoi la parade est la révocation, pas un facteur supplémentaire.",
      },
      {
        question: "Le cadenas du navigateur ne protège-t-il pas mes cookies ?",
        answer:
          "Le chiffrement de la connexion empêche la lecture du trafic entre votre appareil et le site, ce qui écarte l'interception sur un réseau. Il ne protège pas contre un logiciel installé sur votre machine, qui lit le cookie là où il est stocké, après déchiffrement.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "session-hijacking",
        name: "Session hijacking",
        plainLanguageDefinition:
          "When you log in, the site hands you a token proving it's really you, so it doesn't have to ask for your password on every page. Whoever steals that token gets in as you — no password, no verification code.",
        definition:
          "Session hijacking is a third party's reuse of the authentication token issued to a user after they log in, which grants access to the account without going through authentication again.",
        howItWorks:
          "Authentication happens only once: after that, the browser presents a session cookie with every request, and that's what's taken as proof. This token is therefore the equivalent of an already-validated badge. It can be retrieved in three ways: by software installed on the machine that reads what the browser stores, on a network where traffic isn't encrypted, or through a malicious page that manages to leak it. The notable fact is that the theft bypasses authentication rather than confronting it: neither the password nor the second factor comes into play, since both have already been presented. This is what makes revoking sessions — not changing the password — the measure that actually ends access.",
        warningSigns: [
          "An active session from a device or location you don't recognize",
          "Actions taken on your account without a new login prompt",
          "An unexpected disconnection followed by abnormal activity",
          "No two-factor authentication code received, even though a login did happen",
          "Account settings changed without any password having changed",
        ],
        howToVerify:
          "Open the list of sessions or connected devices in the account's settings: that's where the hijacking is visible, and nowhere else. An unknown entry appears there with its date and approximate location, even while the login history shows nothing unusual — since no new login took place.",
        whatToDo:
          "Close your sessions on shared devices instead of just closing the tab. Avoid staying logged in indefinitely to sensitive services, and be wary of browser extensions, which can read what the browser stores.",
        whatToDoIfVictim:
          "Revoke all active sessions, on every device, before anything else — it's the only action that invalidates the stolen token. Then change the password, which in most services also forces reauthentication. Finally, check forwarding rules, recovery addresses, and authorized third-party apps.",
        faq: [
          {
            question: "Wasn't two-factor authentication supposed to prevent this?",
            answer:
              "It protects the moment of login, and the token is issued after that moment. An attacker replaying a session doesn't need to log in: they present an authentication that's already been completed. That's why the fix is revocation, not an extra factor.",
          },
          {
            question: "Doesn't the browser's padlock protect my cookies?",
            answer:
              "Encrypting the connection prevents reading the traffic between your device and the site, which rules out interception on a network. It doesn't protect against software installed on your machine, which reads the cookie where it's stored, after decryption.",
          },
        ],
        whyItWorks:
          "People think the password and the code protect the account at every moment, when they only guard the way in. Staying logged in is convenient, and nobody reviews their list of sessions.",
        example: {
          setting: "A social network's security settings, opened after a post you didn't write.",
          message:
            "Where you're logged in:\n• This phone — active now\n• Laptop — yesterday\n• Browser on Linux — active 10 minutes ago, unknown location\nLogin history: no new logins.",
          giveaways: [
            "An active session is unknown, while the history shows no new login.",
            "No two-factor code was requested.",
            "Something was done in your name without your password changing.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the session list include a device or location you don't recognize?",
            then: "Sign out of all sessions, on all devices, before anything else.",
          },
          {
            check: "Was something done in your name with no visible new login?",
            then: "After signing out everywhere, change the password and check the recovery addresses.",
          },
          {
            check: "Do browser extensions or third-party apps have access to the account?",
            then: "Remove the ones you don't recognize.",
          },
        ],
        prevention: [
          "Sign out on shared devices instead of just closing the tab.",
          "Avoid staying logged in indefinitely to sensitive services.",
          "Install few browser extensions.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        noSimulationReason:
          "The hijacking is spotted in the account's list of active sessions, never through a message that arrives: there's no decision to make under pressure, only a check to run in the settings.",
      },
    },
  },
  {
    code: "ACCT-000009",
    slug: "detournement-de-la-recuperation-de-compte",
    simulationSlug: "notification-changement-adresse-de-secours",
    name: "Détournement de la récupération de compte",
    categorySlug: "identifiants-et-comptes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "L'attaquant n'essaie pas votre mot de passe : il clique sur « mot de passe oublié ». Tout se joue alors sur ce que le service accepte comme preuve que c'est bien vous — une question secrète, une vieille adresse email, un numéro que vous n'avez plus.",
    attackerObjective: "acces_a_un_compte",
    aliases: [
      "abus de la procédure de récupération",
      "détournement de « mot de passe oublié »",
      "account recovery abuse",
    ],
    primaryVector: "web",
    primaryDimension: "account_security_awareness",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le détournement de la récupération de compte consiste à emprunter la procédure prévue pour les utilisateurs ayant perdu leur accès, en satisfaisant les preuves d'identité qu'elle réclame à la place du titulaire légitime.",
    howItWorks:
      "Toute procédure de récupération est un compromis : trop stricte, elle enferme dehors des utilisateurs légitimes ; trop souple, elle laisse entrer n'importe qui. L'attaquant vise ce compromis. Les questions secrètes sont sa cible favorite, parce que leurs réponses — nom de jeune fille de la mère, ville de naissance, premier animal — figurent souvent sur des profils publics ou se déduisent d'une conversation anodine. Les adresses de secours obsolètes sont l'autre porte : une adresse abandonnée peut avoir été recyclée par son fournisseur et appartenir aujourd'hui à quelqu'un d'autre. De même, un numéro de téléphone rendu à l'opérateur est réattribué. La particularité de ce chemin est qu'il est parfaitement silencieux du point de vue de la sécurité : rien n'est forcé, la procédure fonctionne exactement comme prévu.",
    warningSigns: [
      "Email annonçant une demande de réinitialisation que vous n'avez pas faite",
      "Notification de changement d'adresse de secours ou de numéro de récupération",
      "Question secrète dont la réponse est publiquement trouvable sur vos profils",
      "Adresse de secours pointant vers une boîte que vous n'utilisez plus depuis des années",
      "Compte accessible sans que le mot de passe ait été modifié de votre fait",
    ],
    triggers: ["trust", "authority"],
    indicators: [],
    howToVerify:
      "Ouvrez les paramètres de sécurité de chaque compte important et lisez trois choses : l'adresse de secours, le numéro de récupération, et les questions secrètes s'il y en a. Vérifiez que l'adresse de secours est encore la vôtre et qu'elle est elle-même protégée. Une adresse de secours abandonnée transforme la protection en porte d'entrée.",
    whatToDo:
      "Traitez les questions secrètes comme des mots de passe : inventez une réponse sans rapport avec la vérité et conservez-la dans votre gestionnaire. Rien n'oblige à ce que la ville de naissance soit la vraie. Maintenez l'adresse de secours à jour et active, et préférez une application d'authentification à un numéro de téléphone comme moyen de récupération.",
    whatToDoIfVictim:
      "Utilisez la procédure de récupération du service pour reprendre la main, puis reprenez immédiatement le contrôle des moyens de récupération eux-mêmes : adresse de secours, numéro, questions, codes. Un attaquant qui a repris ces éléments peut refaire la manœuvre indéfiniment, et tant qu'ils ne sont pas rétablis, changer le mot de passe ne sert à rien.",
    whyItWorks:
      "Personne ne relit ses paramètres de récupération une fois le compte créé : une vieille adresse ou une réponse facile reste en place pendant des années. Et comme la procédure fonctionne normalement, rien ne déclenche d'alarme.",
    example: {
      setting: "Email reçu un soir au nom de votre messagerie, peu après une demande de réinitialisation.",
      message:
        "L'adresse de récupération de votre compte a été modifiée. Si vous êtes à l'origine de ce changement, aucune action n'est requise. Sinon, sécurisez votre compte dès maintenant depuis les paramètres de sécurité.",
      giveaways: [
        "Vous n'avez rien modifié.",
        "Une demande de réinitialisation est arrivée juste avant.",
        "Votre ancienne adresse de secours n'était plus utilisée depuis des années.",
      ],
    },
    decisionChecklist: [
      {
        check: "Recevez-vous une notification de changement d'adresse de secours ou de numéro que vous n'avez pas fait ?",
        then: "Ouvrez le compte par vos propres moyens et rétablissez immédiatement les moyens de récupération.",
      },
      {
        check: "Votre adresse de secours est-elle une boîte que vous n'utilisez plus ?",
        then: "Remplacez-la par une adresse active et protégée.",
      },
      {
        check: "La réponse à votre question secrète se trouve-t-elle sur vos profils publics ?",
        then: "Remplacez-la par une réponse inventée, rangée dans votre gestionnaire de mots de passe.",
      },
    ],
    prevention: [
      "Relisez une fois par an les moyens de récupération de vos comptes importants.",
      "Inventez les réponses aux questions secrètes et gardez-les dans le gestionnaire.",
      "Préférez une application d'authentification au numéro de téléphone pour récupérer un compte.",
    ],
    relatedAttackCodes: [
      "ACCT-000003",
      "ACCT-000004",
      "ACCT-000010",
      "DATA-000005",
    ],
    faq: [
      {
        question: "Faut-il vraiment mentir aux questions secrètes ?",
        answer:
          "Oui, et ce n'est pas contourner la sécurité : c'est l'utiliser correctement. Une question secrète est un mot de passe déguisé en question ; sa valeur tient au fait que personne d'autre ne connaît la réponse. La vérité, elle, est souvent publique.",
      },
      {
        question:
          "Mon adresse de secours date d'il y a dix ans, est-ce grave ?",
        answer:
          "C'est un risque réel. Une adresse inactive peut être supprimée puis réattribuée par son fournisseur, auquel cas la personne qui la détient aujourd'hui peut recevoir vos liens de réinitialisation. Mettez-la à jour, et supprimez les moyens de récupération dont vous n'avez plus le contrôle.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "account-recovery-hijacking",
        simulationSlug: "recovery-email-change-notification",
        name: "Account recovery hijacking",
        plainLanguageDefinition:
          "The attacker doesn't try your password: they click \"forgot password.\" Everything then hinges on what the service accepts as proof that it's really you — a secret question, an old email address, a number you no longer have.",
        definition:
          "Account recovery hijacking is borrowing the procedure meant for users who've lost access, by satisfying the identity proofs it requires in place of the legitimate account holder.",
        howItWorks:
          "Every recovery procedure is a compromise: too strict, and it locks out legitimate users; too lax, and it lets anyone in. The attacker targets that compromise. Secret questions are their favorite target, because the answers — mother's maiden name, city of birth, first pet — often show up on public profiles or can be inferred from an innocuous conversation. Outdated backup addresses are the other door: an abandoned address may have been recycled by its provider and now belong to someone else. Likewise, a phone number returned to a carrier gets reassigned. What's distinctive about this path is that it's perfectly silent from a security standpoint: nothing is forced, the procedure works exactly as designed.",
        warningSigns: [
          "An email announcing a reset request you didn't make",
          "A notification of a change to the backup address or recovery number",
          "A secret question whose answer is publicly findable on your profiles",
          "A backup address pointing to a mailbox you haven't used in years",
          "An account accessible without you having changed the password",
        ],
        howToVerify:
          "Open the security settings of every important account and check three things: the backup address, the recovery number, and any secret questions. Verify that the backup address is still yours and that it's itself protected. An abandoned backup address turns the protection into an entry point.",
        whatToDo:
          "Treat secret questions like passwords: invent an answer unrelated to the truth and keep it in your password manager. Nothing requires the city of birth to be the real one. Keep the backup address up to date and active, and prefer an authenticator app to a phone number as a recovery method.",
        whatToDoIfVictim:
          "Use the service's recovery procedure to regain control, then immediately reclaim the recovery methods themselves: backup address, number, questions, codes. An attacker who has taken over these elements can repeat the maneuver indefinitely, and until they're restored, changing the password is pointless.",
        faq: [
          {
            question: "Do I really have to lie on secret questions?",
            answer:
              "Yes, and that's not bypassing security: it's using it correctly. A secret question is a password disguised as a question; its value depends on no one else knowing the answer. The truth, meanwhile, is often public.",
          },
          {
            question: "My backup address is ten years old — is that a problem?",
            answer:
              "It's a real risk. An inactive address can be deleted and then reassigned by its provider, in which case whoever holds it today can receive your reset links. Update it, and remove any recovery methods you no longer control.",
          },
        ],
        whyItWorks:
          "Nobody rereads their recovery settings once the account is created: an old address or an easy answer stays in place for years. And since the procedure works as designed, nothing sets off an alarm.",
        example: {
          setting: "Email received one evening in your email provider's name, shortly after a reset request.",
          message:
            "The recovery address for your account has been changed. If you made this change, no action is required. If not, secure your account now from the security settings.",
          giveaways: [
            "You didn't change anything.",
            "A reset request arrived just before.",
            "Your old recovery address hadn't been used for years.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are you receiving a notice that a recovery address or number was changed, and you didn't do it?",
            then: "Open the account on your own and restore the recovery options immediately.",
          },
          {
            check: "Is your recovery address a mailbox you no longer use?",
            then: "Replace it with an active, protected address.",
          },
          {
            check: "Can the answer to your security question be found on your public profiles?",
            then: "Replace it with an invented answer, stored in your password manager.",
          },
        ],
        prevention: [
          "Review the recovery options of your important accounts once a year.",
          "Invent the answers to security questions and keep them in your password manager.",
          "Prefer an authenticator app to a phone number for account recovery.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
  {
    code: "ACCT-000010",
    slug: "piratage-de-compte-de-reseau-social",
    simulationSlug: "ami-signale-message-etrange",
    name: "Piratage d'un compte de réseau social",
    categorySlug: "identifiants-et-comptes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Votre compte devient un outil contre vos proches : c'est votre nom, votre photo et votre historique qui servent à leur écrire. Le préjudice n'est pas la perte du compte, il est ce qui est fait avec.",
    attackerObjective: "acces_a_un_compte",
    aliases: [
      "compte piraté",
      "vol de compte Instagram",
      "compte de réseau social compromis",
    ],
    primaryVector: "social_media",
    primaryDimension: "account_security_awareness",
    updatedAt: "2026-09-02",
    publishedAt: "2026-09-02",
    definition:
      "Le piratage d'un compte de réseau social est la prise de contrôle du compte authentique d'une personne, utilisé ensuite pour solliciter ses contacts, diffuser des contenus en son nom, ou revendre son audience.",
    howItWorks:
      "L'entrée se fait par les chemins habituels : mot de passe réutilisé, page de connexion contrefaite atteinte depuis un message, code de vérification communiqué au téléphone. Ce qui est propre à ce compte-ci est l'usage qui en est fait. L'attaquant dispose d'une chose qu'aucune imitation ne procure : la confiance déjà accordée par des centaines de personnes. Il écrit aux contacts en reprenant le ton des conversations précédentes, qu'il peut lire, ce qui rend ses messages plus crédibles que n'importe quel faux profil. Les demandes ressemblent à celles d'un proche — un vote à soutenir, un lien à ouvrir, un code reçu par erreur à retransmettre — et ce dernier sert précisément à pirater le compte du contact à son tour. Le premier geste de l'attaquant est de changer l'adresse email et le mot de passe, ce qui rend la reprise plus difficile à mesure que le temps passe.",
    warningSigns: [
      "Messages envoyés depuis votre compte que vous n'avez pas écrits",
      "Contacts qui vous signalent une demande inhabituelle de votre part",
      "Email de changement d'adresse ou de mot de passe que vous n'avez pas demandé",
      "Publications, abonnements ou mentions apparus sans votre action",
      "Déconnexion soudaine, avec un mot de passe qui n'est plus accepté",
    ],
    triggers: ["trust", "social_pressure"],
    indicators: [],
    howToVerify:
      "Consultez l'historique de connexion et la liste des appareils dans les paramètres du compte, puis vérifiez l'adresse email associée : c'est le premier élément modifié lors d'une prise de contrôle. Regardez également les messages envoyés, que l'attaquant efface rarement en totalité.",
    whatToDo:
      "Utilisez la procédure de récupération du réseau social sans attendre, car ces procédures deviennent plus difficiles une fois l'adresse email changée. Prévenez vos contacts par un autre canal — un groupe de messagerie, un appel, un autre réseau — pour que les demandes envoyées en votre nom ne trouvent personne.",
    whatToDoIfVictim:
      "Reprenez le compte, puis révoquez les sessions et les applications tierces autorisées, et rétablissez l'adresse email et le numéro de récupération. Activez la double authentification. Publiez un message signalant les demandes envoyées pendant la période concernée : c'est ce qui protège vos contacts, et cela vaut mieux que des excuses individuelles. Si un proche a versé de l'argent, il doit contacter sa banque immédiatement et déposer plainte de son côté.",
    whyItWorks:
      "Vos contacts font confiance à votre nom et à votre photo, pas au message : l'attaquant hérite de cette confiance. Il peut lire vos conversations et imiter votre ton, ce qu'aucun faux profil ne permet.",
    example: {
      setting: "Un ami reçoit, depuis votre compte, un message privé.",
      message:
        "« Coucou ! Je participe à un concours, tu peux voter pour moi ? Tu vas recevoir un code par SMS, renvoie-le-moi, c'est pour valider ton vote 🙏 »",
      giveaways: [
        "Un code reçu par SMS à « renvoyer » : c'est le code de connexion du compte de votre ami.",
        "Un ton familier pour une demande inhabituelle.",
        "De l'insistance pour un enjeu sans importance.",
      ],
    },
    decisionChecklist: [
      {
        check: "Vos contacts signalent-ils des messages que vous n'avez pas envoyés ?",
        then: "Lancez tout de suite la procédure de récupération du réseau social.",
      },
      {
        check: "L'adresse email associée au compte a-t-elle changé ?",
        then: "Rétablissez-la en priorité : c'est elle qui permet de reprendre la main.",
      },
      {
        check: "Un contact vous demande-t-il de lui transmettre un code reçu par SMS ?",
        then: "Ne le faites jamais, même pour un proche : votre compte serait pris à son tour.",
      },
    ],
    prevention: [
      "Activez la double authentification sur vos réseaux sociaux.",
      "Utilisez un mot de passe que vous n'employez nulle part ailleurs.",
      "Ne transmettez jamais un code reçu par SMS, quel que soit le demandeur.",
    ],
    relatedAttackCodes: [
      "ACCT-000009",
      "PERS-000007",
      "ACCT-000001",
      "SOCIAL-000005",
      "DATA-000006",
    ],
    faq: [
      {
        question:
          "Un contact me demande de lui transmettre un code reçu par SMS.",
        answer:
          "N'envoyez rien. Ce code est celui qui permet de prendre le contrôle de votre propre compte : la demande vient du compte de votre contact, déjà compromis, et elle sert à vous compromettre à votre tour. Appelez la personne pour l'en informer.",
      },
      {
        question: "Quelle différence avec un faux compte à mon nom ?",
        answer:
          "Ici votre compte authentique est aux mains d'un tiers : vos messages, vos contacts et votre historique lui sont accessibles. Un faux compte se contente de copier ce qui est public, sans rien lire. Les deux situations se traitent différemment — voyez « usurpation de profil sur les réseaux sociaux » pour la seconde.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "social-media-account-takeover",
        simulationSlug: "friend-reports-strange-message",
        name: "Social media account takeover",
        plainLanguageDefinition:
          "Your account becomes a tool against the people close to you: it's your name, your photo, and your history that are used to write to them. The harm isn't losing the account, it's what's done with it.",
        definition:
          "Social media account takeover is gaining control of a person's authentic account, then used to approach their contacts, spread content in their name, or resell their audience.",
        howItWorks:
          "Entry happens through the usual paths: a reused password, a fake login page reached from a message, a verification code shared over the phone. What's specific to this account is the use it's put to. The attacker has something no imitation provides: the trust already granted by hundreds of people. They write to contacts reusing the tone of previous conversations, which they can read, making their messages more credible than any fake profile. The requests resemble those of a friend or relative — a vote to support, a link to open, a code received by mistake to forward — and that last one serves precisely to hijack the contact's account in turn. The attacker's first move is to change the email address and password, which makes recovery harder as time passes.",
        warningSigns: [
          "Messages sent from your account that you didn't write",
          "Contacts flagging an unusual request supposedly from you",
          "An email about an address or password change you didn't request",
          "Posts, follows, or mentions appearing without your action",
          "A sudden logout, with a password that's no longer accepted",
        ],
        howToVerify:
          "Check the login history and the list of devices in the account's settings, then verify the associated email address: it's the first element changed during a takeover. Also look at sent messages, which the attacker rarely deletes entirely.",
        whatToDo:
          "Use the social network's recovery procedure without delay, since these procedures become harder once the email address has been changed. Warn your contacts through another channel — a messaging group, a call, another network — so that requests sent in your name find no one.",
        whatToDoIfVictim:
          "Regain the account, then revoke sessions and authorized third-party apps, and restore the email address and recovery number. Enable two-factor authentication. Post a message flagging the requests sent during the affected period: that's what protects your contacts, and it works better than individual apologies. If someone close to you sent money, they should contact their bank immediately and file a police report of their own.",
        faq: [
          {
            question: "A contact is asking me to forward a code I received by SMS.",
            answer:
              "Don't send anything. That code is the one that lets someone take control of your own account: the request comes from your contact's account, already compromised, and it's meant to compromise you in turn. Call the person to let them know.",
          },
          {
            question: "What's the difference with a fake account under my name?",
            answer:
              "Here, your genuine account is in a third party's hands: your messages, contacts, and history are accessible to them. A fake account just copies what's public, without reading anything. The two situations are handled differently — see \"social media profile impersonation\" for the second.",
          },
        ],
        whyItWorks:
          "Your contacts trust your name and photo, not the message: the attacker inherits that trust. They can read your conversations and imitate your tone, which no fake profile can do.",
        example: {
          setting: "A friend receives a private message from your account.",
          message:
            "\"Hey! I'm in a contest, can you vote for me? You'll get a code by text, send it back to me, it's to confirm your vote 🙏\"",
          giveaways: [
            "A code received by text to \"send back\": it's the login code for your friend's account.",
            "A familiar tone for an unusual request.",
            "Insistence over something that doesn't matter.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are your contacts reporting messages you didn't send?",
            then: "Start the social network's account recovery procedure right away.",
          },
          {
            check: "Has the email address linked to the account changed?",
            then: "Restore it first: it's what lets you take the account back.",
          },
          {
            check: "Is a contact asking you to send them a code you received by text?",
            then: "Never do it, even for someone close: your account would be taken in turn.",
          },
        ],
        prevention: [
          "Turn on two-factor authentication on your social networks.",
          "Use a password you don't use anywhere else.",
          "Never pass on a code received by text, whoever is asking.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
      },
    },
  },
];

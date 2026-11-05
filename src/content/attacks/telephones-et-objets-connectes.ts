import type { AttackEntry } from "./types";
import { VERIFIED_REFERENCES as REF } from "./types";

/** Téléphones et objets connectés — see ingenierie-sociale.ts for the content rules. */
export const TELEPHONES_ET_OBJETS_CONNECTES: AttackEntry[] = [
  {
    code: "MOB-000001",
    slug: "application-malveillante",
    simulationSlug: "fiche-application-lampe-torche",
    name: "Application malveillante",
    categorySlug: "telephones-et-objets-connectes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une application qui fait ce qu'elle promet — lampe torche, scanner, retouche photo — et qui, en plus, lit vos messages ou suit vos déplacements. Elle fonctionne bien : c'est ce qui la rend difficile à soupçonner.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "fausse application",
      "appli piégée",
      "app malveillante",
    ],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Une application malveillante est un programme installé volontairement sur un téléphone, qui remplit une fonction visible tout en collectant des données ou en exécutant des actions que l'utilisateur n'a pas demandées.",
    howItWorks:
      "Deux voies mènent au même résultat. La première est l'imitation : une application reprend le nom, l'icône et la description d'un service connu, et se place dans les résultats de recherche du magasin d'applications à côté de l'originale. Le nom du développeur est le seul champ qui les distingue, et personne ne le lit. La seconde est l'installation hors magasin, présentée comme nécessaire pour obtenir une version gratuite, une fonction absente, ou une application « pas encore disponible dans votre pays ». Elle contourne les contrôles automatiques du magasin, qui constituent l'essentiel de la protection. Une fois installée, l'application demande ses autorisations à un moment où l'utilisateur veut s'en servir, donc où il accepte : la fonction annoncée sert précisément à justifier la demande.",
    warningSigns: [
      "Nom de développeur inconnu ou légèrement différent de l'éditeur attendu",
      "Application demandant des autorisations sans rapport avec sa fonction",
      "Installation proposée en dehors du magasin d'applications officiel",
      "Version gratuite d'une application habituellement payante",
      "Avis nombreux, courts et publiés sur une période très resserrée",
      "Batterie ou données mobiles consommées nettement plus vite après l'installation",
    ],
    triggers: ["reward", "trust", "curiosity"],
    indicators: [],
    howToVerify:
      "Lisez le nom du développeur, pas celui de l'application : c'est le champ que l'imitation ne peut pas reprendre à l'identique. Vérifiez-le sur le site officiel de l'éditeur, puis comparez les autorisations demandées à ce que l'application prétend faire. Une application qui n'a besoin ni de vos contacts ni de votre position ne devrait pas les demander.",
    whatToDo:
      "Installez depuis les magasins officiels et refusez les installations hors magasin, quelle que soit la raison invoquée. Accordez les autorisations au moment où la fonction en a besoin plutôt qu'à l'installation, et faites périodiquement le tri : une application oubliée continue de s'exécuter.",
    whatToDoIfVictim:
      "Désinstallez l'application, puis retirez ses autorisations si elles subsistent. Changez les mots de passe des comptes utilisés depuis ce téléphone, en commençant par la messagerie, et révoquez les sessions actives. Vérifiez la facture de l'opérateur, certaines applications souscrivant des services surtaxés.",
    whyItWorks:
      "L'application fait ce qu'elle promet, donc rien ne paraît anormal. Les autorisations sont demandées au moment où l'on veut s'en servir, et accepter est le chemin le plus court.",
    example: {
      setting: "Fiche d'application consultée dans le magasin d'applications.",
      message:
        "Lampe Torche Pro, gratuite\nDéveloppeur : Utility Apps Studio\nAutorisations demandées : appareil photo, contacts, position précise, SMS.",
      giveaways: [
        "Une lampe torche n'a besoin ni des contacts, ni de la position, ni des SMS.",
        "Le développeur est inconnu et n'a pas de site identifiable.",
        "Les avis, nombreux et très courts, datent tous de la même semaine.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'application demande-t-elle des autorisations sans rapport avec sa fonction ?",
        then: "Refusez-les, ou ne l'installez pas.",
      },
      {
        check: "L'installation vous oblige-t-elle à sortir du magasin officiel ?",
        then: "Renoncez : cette étape contourne les contrôles qui vous protègent.",
      },
      {
        check: "Votre batterie ou vos données mobiles se vident-elles plus vite depuis une installation récente ?",
        then: "Désinstallez l'application, puis changez les mots de passe des comptes utilisés sur ce téléphone.",
      },
    ],
    prevention: [
      "Lisez le nom du développeur avant d'installer.",
      "Faites le tri dans vos applications et leurs autorisations tous les quelques mois.",
      "N'autorisez jamais l'installation hors magasin à la demande d'un site ou d'un message.",
    ],
    relatedAttackCodes: [
      "MOB-000002",
      "MOB-000007",
      "AI-000007",
      "MOB-000006",
      "MAL-000002",
      "MAL-000003",
    ],
    faq: [
      {
        question: "Elle vient du magasin officiel, n'est-ce pas suffisant ?",
        answer:
          "Les magasins effectuent des contrôles, mais ils examinent un très grand nombre de soumissions et une application peut changer de comportement après une mise à jour. Le contrôle réduit le risque, il ne l'annule pas : les autorisations demandées restent à lire.",
      },
      {
        question: "Comment distinguer l'originale de sa copie ?",
        answer:
          "Par le nom du développeur, le nombre de téléchargements et la date de première publication. Une application très utilisée existe depuis longtemps ; une copie récente affiche une date de publication qui ne correspond pas à la notoriété qu'elle prétend avoir.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "malicious-app",
        simulationSlug: "flashlight-app-listing",
        name: "Malicious app",
        plainLanguageDefinition:
          "An app that does what it promises — flashlight, scanner, photo editor — and, on top of that, reads your messages or tracks your movements. It works well: that's what makes it hard to suspect.",
        definition:
          "A malicious app is a program voluntarily installed on a phone that performs a visible function while collecting data or carrying out actions the user did not ask for.",
        howItWorks:
          "Two paths lead to the same result. The first is imitation: an app copies the name, icon and description of a known service, and places itself in the app store's search results next to the original. The developer name is the only field that tells them apart, and nobody reads it. The second is installation outside the store, presented as necessary to get a free version, a missing feature, or an app \"not yet available in your country.\" It bypasses the store's automated checks, which make up most of the protection. Once installed, the app asks for its permissions at a moment when the user wants to use it, and so is willing to accept: the advertised feature exists precisely to justify the request.",
        warningSigns: [
          "Unknown developer name, or one slightly different from the expected publisher",
          "App requesting permissions unrelated to its function",
          "Installation offered outside the official app store",
          "Free version of an app that is normally paid",
          "Many reviews, short and published over a very narrow time window",
          "Battery or mobile data used noticeably faster after installation",
        ],
        howToVerify:
          "Read the developer name, not the app name: it's the field that imitation cannot reproduce exactly. Check it against the publisher's official website, then compare the requested permissions to what the app claims to do. An app that needs neither your contacts nor your location shouldn't be asking for them.",
        whatToDo:
          "Install from official app stores and refuse installations outside the store, whatever the reason given. Grant permissions when the feature actually needs them rather than at install time, and periodically clean up: a forgotten app keeps running.",
        whatToDoIfVictim:
          "Uninstall the app, then remove its permissions if they remain. Change the passwords of accounts used from this phone, starting with email, and revoke active sessions. Check your carrier bill, since some apps subscribe to premium-rate services.",
        faq: [
          {
            question: "It came from the official store, isn't that enough?",
            answer:
              "Stores do run checks, but they review a very large number of submissions and an app can change behavior after an update. The check reduces the risk, it doesn't remove it: the requested permissions are still worth reading.",
          },
          {
            question: "How can I tell the original from its copy?",
            answer:
              "By the developer name, the download count and the first publication date. A widely used app has been around for a long time; a recent copy shows a publication date that doesn't match the popularity it claims to have.",
          },
        ],
        whyItWorks:
          "The app does what it promises, so nothing seems wrong. Permissions are requested at the moment you want to use it, and accepting is the shortest path.",
        example: {
          setting: "App listing viewed in the app store.",
          message:
            "Flashlight Pro, free\nDeveloper: Utility Apps Studio\nPermissions requested: camera, contacts, precise location, SMS.",
          giveaways: [
            "A flashlight needs neither your contacts, nor your location, nor your texts.",
            "The developer is unknown and has no identifiable website.",
            "The reviews, numerous and very short, all date from the same week.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the app ask for permissions unrelated to its function?",
            then: "Deny them, or don't install it.",
          },
          {
            check: "Does installing it require leaving the official store?",
            then: "Give up: that step bypasses the checks that protect you.",
          },
          {
            check: "Is your battery or mobile data draining faster since a recent installation?",
            then: "Uninstall the app, then change the passwords of the accounts used on this phone.",
          },
        ],
        prevention: [
          "Read the developer's name before installing.",
          "Review your apps and their permissions every few months.",
          "Never allow installation outside the store at the request of a site or a message.",
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
    code: "MOB-000002",
    slug: "attaque-par-superposition",
    simulationSlug: "autorisation-affichage-par-dessus",
    name: "Attaque par superposition",
    categorySlug: "telephones-et-objets-connectes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Vous ouvrez votre application bancaire et vous voyez son écran de connexion. Sauf que ce que vous voyez est dessiné par-dessus par une autre application, et c'est elle qui reçoit ce que vous tapez.",
    attackerObjective: "identifiants",
    aliases: [
      "overlay attack",
      "attaque par recouvrement",
      "faux écran de connexion",
    ],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "L'attaque par superposition consiste, pour une application installée sur le téléphone, à afficher une fenêtre par-dessus une autre application au moment où celle-ci est lancée, afin d'intercepter ce que l'utilisateur y saisit.",
    howItWorks:
      "Un système mobile permet à une application d'afficher un élément au-dessus des autres : c'est ce qui fait fonctionner les bulles de conversation ou les filtres d'écran. L'autorisation correspondante est donc légitime et existe pour de bonnes raisons. Une application malveillante la demande sous un prétexte plausible, puis surveille quelle application passe au premier plan. Quand c'est une application bancaire, elle dessine instantanément une copie de son écran de connexion par-dessus. L'utilisateur ne peut rien remarquer : il a bien ouvert la bonne application, l'écran est celui qu'il attendait, et le geste est le sien. La saisie part vers l'application malveillante, qui referme ensuite sa fenêtre et laisse la vraie application apparaître.",
    warningSigns: [
      "Application ayant obtenu l'autorisation d'affichage par-dessus les autres sans raison évidente",
      "Écran de connexion qui apparaît avec un léger décalage ou un thème inhabituel",
      "Clavier ou apparence de l'écran qui diffère de ce que vous connaissez",
      "Retour brusque à l'écran d'accueil après une saisie",
      "Application demandant l'autorisation d'accessibilité pour une fonction qui ne l'exige pas",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Ouvrez les paramètres du téléphone et cherchez la liste des applications autorisées à s'afficher par-dessus les autres, ainsi que celles disposant de l'accessibilité. Ces deux listes doivent être courtes et chaque entrée doit s'expliquer. C'est le seul endroit où cette attaque est visible, l'écran lui-même ne pouvant rien révéler.",
    whatToDo:
      "N'accordez ni l'affichage par-dessus les autres applications ni l'accessibilité à une application dont la fonction ne l'exige pas — ce sont les deux autorisations les plus puissantes d'un téléphone. Maintenez le système à jour, et privilégiez la biométrie, qui ne se saisit pas sur un écran.",
    whatToDoIfVictim:
      "Désinstallez l'application concernée depuis le mode sans échec si elle résiste, puis changez les mots de passe saisis pendant la période, depuis un autre appareil. Prévenez votre banque et surveillez les opérations. Révoquez les sessions actives des comptes concernés.",
    whyItWorks:
      "Vous avez ouvert la bonne application et vous voyez l'écran attendu : il n'y a rien à repérer. L'autorisation a été accordée bien avant, sous un prétexte plausible, et personne ne fait le lien.",
    example: {
      setting: "Demande affichée à l'ouverture d'une application de nettoyage de téléphone installée la veille.",
      message:
        "Pour optimiser votre téléphone, autorisez l'affichage par-dessus les autres applications et activez le service d'accessibilité.\n[Autoriser]",
      giveaways: [
        "Nettoyer un téléphone ne demande ni l'une ni l'autre de ces autorisations.",
        "Ce sont les deux autorisations les plus puissantes du téléphone.",
        "L'application vient d'être installée.",
      ],
    },
    decisionChecklist: [
      {
        check: "Une application demande-t-elle l'affichage par-dessus les autres ou l'accessibilité sans raison liée à sa fonction ?",
        then: "Refusez et désinstallez-la.",
      },
      {
        check: "La liste des applications autorisées à s'afficher par-dessus les autres contient-elle une application que vous ne savez pas expliquer ?",
        then: "Retirez-lui l'autorisation et désinstallez-la.",
      },
      {
        check: "Avez-vous saisi des identifiants bancaires pendant qu'une telle application était installée ?",
        then: "Prévenez votre banque et changez vos mots de passe depuis un autre appareil.",
      },
    ],
    prevention: [
      "N'accordez ces deux autorisations qu'aux rares applications qui en ont réellement besoin.",
      "Relisez ces deux listes dans les paramètres du téléphone de temps en temps.",
      "Gardez le système à jour et privilégiez la biométrie pour vos applications bancaires.",
    ],
    relatedAttackCodes: ["MOB-000001", "MOB-000007", "ACCT-000007"],
    faq: [
      {
        question:
          "Comment une autre application peut-elle dessiner par-dessus ma banque ?",
        answer:
          "Parce que le système le permet volontairement, pour des usages légitimes comme les bulles de conversation. L'attaque n'exploite pas un défaut : elle détourne une fonction, ce qui explique qu'elle demande une autorisation plutôt qu'elle ne force quoi que ce soit.",
      },
      {
        question: "La biométrie protège-t-elle ?",
        answer:
          "Elle aide, car une empreinte ou un visage ne se saisit pas sur un écran et ne peut donc pas être recopié par une fenêtre superposée. Une application qui propose de revenir au code chiffré « parce que la biométrie ne fonctionne pas » mérite en revanche la plus grande méfiance.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "overlay-attack",
        simulationSlug: "display-over-other-apps-permission",
        name: "Overlay attack",
        plainLanguageDefinition:
          "You open your banking app and see its login screen. Except what you're seeing is drawn on top by another app, and that app is the one receiving what you type.",
        definition:
          "An overlay attack is when an app installed on the phone displays a window on top of another app as soon as it launches, in order to intercept what the user types into it.",
        howItWorks:
          "A mobile system lets an app display an element above the others: that's what makes chat bubbles or screen filters work. The corresponding permission is therefore legitimate and exists for good reasons. A malicious app requests it under a plausible pretext, then watches which app comes to the foreground. When it's a banking app, it instantly draws a copy of its login screen on top. The user has no way to notice: they did open the right app, the screen is the one they expected, and the action is theirs. The input goes to the malicious app, which then closes its window and lets the real app appear.",
        warningSigns: [
          "App that has obtained permission to display over other apps for no obvious reason",
          "Login screen that appears with a slight delay or an unusual theme",
          "Keyboard or screen appearance that differs from what you're used to",
          "Abrupt return to the home screen right after entering something",
          "App requesting accessibility permission for a feature that doesn't require it",
        ],
        howToVerify:
          "Open the phone's settings and look at the list of apps allowed to display over other apps, as well as those with accessibility access. Both lists should be short and every entry should make sense. This is the only place where this attack is visible, since the screen itself can't reveal anything.",
        whatToDo:
          "Don't grant either display-over-other-apps or accessibility access to an app whose function doesn't require it — these are the two most powerful permissions on a phone. Keep the system up to date, and prefer biometrics, which can't be typed on a screen.",
        whatToDoIfVictim:
          "Uninstall the app in question from safe mode if it resists, then change the passwords entered during the period, from another device. Notify your bank and monitor transactions. Revoke active sessions on the affected accounts.",
        faq: [
          {
            question: "How can another app draw over my banking app?",
            answer:
              "Because the system intentionally allows it, for legitimate uses like chat bubbles. The attack doesn't exploit a flaw: it hijacks a feature, which is why it requires a permission rather than forcing anything.",
          },
          {
            question: "Does biometrics protect against this?",
            answer:
              "It helps, because a fingerprint or a face can't be typed on a screen and so can't be captured by an overlaid window. An app that offers to fall back to the PIN code \"because biometrics isn't working\" deserves the utmost suspicion.",
          },
        ],
        whyItWorks:
          "You opened the right app and see the expected screen: there's nothing to notice. The permission was granted long before, under a plausible pretext, and nobody makes the connection.",
        example: {
          setting: "Request shown when opening a phone-cleaning app installed the day before.",
          message:
            "To optimize your phone, allow display over other apps and turn on the accessibility service.\n[Allow]",
          giveaways: [
            "Cleaning a phone requires neither of these permissions.",
            "They're the two most powerful permissions on the phone.",
            "The app has only just been installed.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is an app asking to display over other apps or for accessibility access with no reason tied to its function?",
            then: "Refuse and uninstall it.",
          },
          {
            check: "Does the list of apps allowed to display over others include one you can't explain?",
            then: "Remove its permission and uninstall it.",
          },
          {
            check: "Did you enter banking credentials while such an app was installed?",
            then: "Warn your bank and change your passwords from another device.",
          },
        ],
        prevention: [
          "Grant these two permissions only to the rare apps that really need them.",
          "Review both lists in your phone's settings from time to time.",
          "Keep the system up to date and prefer biometrics for your banking apps.",
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
    code: "MOB-000003",
    slug: "juice-jacking",
    simulationSlug: "recharge-borne-aeroport",
    name: "Juice jacking (borne de recharge piégée)",
    categorySlug: "telephones-et-objets-connectes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un port USB public sert à charger, mais un câble USB transporte aussi des données. Une borne modifiée peut donc tenter d'accéder au téléphone pendant qu'il se recharge.",
    attackerObjective: "donnees_personnelles",
    aliases: ["borne de recharge piégée", "câble piégé", "juice jacking"],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Le juice jacking désigne l'exploitation d'un port ou d'un câble de recharge public pour établir une connexion de données avec l'appareil qui s'y branche, plutôt qu'une simple alimentation électrique.",
    howItWorks:
      "Un connecteur USB transporte le courant et les données sur des broches distinctes, et c'est l'appareil qui décide de ce qu'il autorise. Le scénario suppose donc une borne ou un câble modifié à l'avance, dans un lieu où les gens branchent leur téléphone sans y penser : gare, aéroport, hôtel. Les systèmes mobiles récents se défendent en n'établissant aucun échange de données sans un accord explicite — la demande « Faire confiance à cet ordinateur ? » est exactement ce mécanisme, et la refuser suffit. Le risque réel tient donc moins à la borne qu'au réflexe d'accepter une demande sans la lire, et au câble prêté par un inconnu, qui peut contenir de l'électronique invisible de l'extérieur.",
    warningSigns: [
      "Demande d'autorisation d'accès aux données apparaissant lors d'une simple recharge",
      "Câble fourni ou laissé à disposition plutôt qu'un port où brancher le vôtre",
      "Borne présentant des câbles solidaires impossibles à remplacer",
      "Téléphone qui se déverrouille ou affiche une activité inattendue une fois branché",
    ],
    triggers: ["urgency", "trust"],
    indicators: [],
    howToVerify:
      "Le signal est la question elle-même : une recharge n'a jamais besoin d'accéder à vos données. Si le téléphone demande d'autoriser un échange alors que vous vouliez seulement de la batterie, refusez et débranchez.",
    whatToDo:
      "Emportez votre propre chargeur secteur et branchez-le sur une prise électrique, ou utilisez une batterie externe : ni l'un ni l'autre ne transporte de données. À défaut, refusez toute demande d'autorisation, gardez le téléphone verrouillé pendant la charge, et n'utilisez pas un câble que l'on vous prête.",
    whatToDoIfVictim:
      "Si une autorisation d'accès a été accordée, retirez-la dans les réglages, redémarrez l'appareil et faites-le analyser. Changez les mots de passe des comptes sensibles depuis un autre appareil et vérifiez les sessions actives.",
    whyItWorks:
      "Une batterie presque vide pousse à brancher le téléphone n'importe où. Et une demande d'autorisation qui apparaît pendant la recharge est souvent acceptée sans être lue.",
    example: {
      setting: "Borne de recharge dans un hall de gare, avec un câble attaché.",
      message:
        "Faire confiance à cet ordinateur ?\nVos réglages et vos données seront accessibles depuis cet ordinateur.\n[Se fier] [Ne pas se fier]",
      giveaways: [
        "Vous vouliez seulement recharger, pas échanger de données.",
        "Le câble appartient à la borne : vous ne savez pas ce qu'il contient.",
        "Une recharge n'a jamais besoin de cette autorisation.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le téléphone demande-t-il d'autoriser un échange de données pendant une recharge ?",
        then: "Refusez et débranchez.",
      },
      {
        check: "Le câble est-il fourni par la borne ou prêté par un inconnu ?",
        then: "Préférez votre propre chargeur sur une prise électrique, ou une batterie externe.",
      },
      {
        check: "Avez-vous accepté l'autorisation ?",
        then: "Retirez-la dans les réglages, redémarrez le téléphone et changez vos mots de passe sensibles depuis un autre appareil.",
      },
    ],
    prevention: [
      "Emportez votre chargeur secteur ou une batterie externe.",
      "Gardez le téléphone verrouillé pendant la recharge.",
      "N'utilisez pas un câble prêté par un inconnu.",
    ],
    relatedAttackCodes: ["MOB-000004", "SOCIAL-000008"],
    faq: [
      {
        question: "Est-ce un risque courant dans les gares et les aéroports ?",
        answer:
          "Le mécanisme est réel et documenté, mais il suppose un matériel modifié à l'avance et les systèmes mobiles récents demandent une autorisation explicite avant tout échange de données. La précaution reste simple et sans inconvénient : votre propre chargeur sur une prise, ou une batterie externe.",
      },
      {
        question: "Un câble peut-il vraiment être piégé ?",
        answer:
          "Un câble peut contenir de l'électronique invisible depuis l'extérieur — c'est un objet, pas un simple fil. C'est pourquoi la règle utile porte sur le câble autant que sur la borne : n'utilisez que le vôtre.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "juice-jacking",
        simulationSlug: "airport-charging-station",
        name: "Juice jacking (rigged charging station)",
        plainLanguageDefinition:
          "A public USB port is used for charging, but a USB cable also carries data. A modified charging station can therefore try to access the phone while it's charging.",
        definition:
          "Juice jacking refers to exploiting a public charging port or cable to establish a data connection with the device plugged into it, rather than a simple power supply.",
        howItWorks:
          "A USB connector carries power and data on separate pins, and it's the device that decides what it allows. The scenario therefore requires a station or cable modified in advance, in a place where people plug in their phone without thinking about it: a train station, airport, or hotel. Recent mobile systems defend against this by not establishing any data exchange without explicit consent — the \"Trust this computer?\" prompt is exactly that mechanism, and declining it is enough. The real risk lies less in the station itself than in the reflex of accepting a prompt without reading it, and in a cable borrowed from a stranger, which can contain electronics invisible from the outside.",
        warningSigns: [
          "A data-access permission prompt appearing during a simple charge",
          "A cable supplied or left available rather than a port for your own",
          "A charging station with cables permanently attached and impossible to replace",
          "Phone that unlocks or shows unexpected activity once plugged in",
        ],
        howToVerify:
          "The prompt itself is the warning sign: charging never needs access to your data. If the phone asks to authorize a data exchange when you only wanted battery power, decline and unplug.",
        whatToDo:
          "Bring your own power adapter and plug it into an electrical outlet, or use a portable battery: neither carries data. Failing that, decline any permission request, keep the phone locked while charging, and don't use a cable someone else lends you.",
        whatToDoIfVictim:
          "If data access was granted, revoke it in settings, restart the device and have it scanned. Change the passwords of sensitive accounts from another device and check active sessions.",
        faq: [
          {
            question: "Is this a common risk in train stations and airports?",
            answer:
              "The mechanism is real and documented, but it requires hardware modified in advance, and recent mobile systems ask for explicit authorization before any data exchange. The precaution stays simple and costs nothing: your own charger on an outlet, or a portable battery.",
          },
          {
            question: "Can a cable really be rigged?",
            answer:
              "A cable can contain electronics invisible from the outside — it's an object, not just a wire. That's why the useful rule applies to the cable as much as to the station: only use your own.",
          },
        ],
        whyItWorks:
          "An almost empty battery pushes people to plug their phone in anywhere. And a permission request that appears while charging is often accepted without being read.",
        example: {
          setting: "Charging station in a train station hall, with an attached cable.",
          message:
            "Trust this computer?\nYour settings and data will be accessible from this computer.\n[Trust] [Don't Trust]",
          giveaways: [
            "You only wanted to charge, not exchange data.",
            "The cable belongs to the station: you don't know what's inside it.",
            "Charging never needs this permission.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the phone asking you to allow a data exchange while charging?",
            then: "Decline and unplug.",
          },
          {
            check: "Is the cable provided by the station or lent by a stranger?",
            then: "Prefer your own charger on a power outlet, or a power bank.",
          },
          {
            check: "Did you accept the permission?",
            then: "Remove it in the settings, restart the phone and change your sensitive passwords from another device.",
          },
        ],
        prevention: [
          "Carry your wall charger or a power bank.",
          "Keep the phone locked while it charges.",
          "Don't use a cable lent by a stranger.",
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
    code: "MOB-000004",
    slug: "attaque-bluetooth",
    simulationSlug: "demande-appairage-bluetooth-inconnue",
    name: "Attaque Bluetooth",
    categorySlug: "telephones-et-objets-connectes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Le Bluetooth laissé allumé rend l'appareil visible et joignable par ce qui se trouve à quelques mètres. Cela suffit pour recevoir des demandes d'appairage non sollicitées, et parfois davantage.",
    attackerObjective: "controle_d_un_appareil",
    aliases: ["appairage abusif", "bluejacking", "attaque de proximité"],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Une attaque Bluetooth exploite la connectivité sans fil de courte portée d'un appareil pour lui envoyer des données non sollicitées, obtenir un appairage abusif, ou tirer parti d'une faille de sa pile logicielle.",
    howItWorks:
      "Le Bluetooth suppose la proximité — quelques mètres — ce qui restreint les situations à des lieux fréquentés : transports, salles d'attente, espaces partagés. Un appareil en mode découvrable annonce sa présence et son nom, ce qui fournit déjà une information. Les usages les plus simples consistent à envoyer des fichiers ou des demandes d'appairage à répétition, jusqu'à ce que quelqu'un accepte par lassitude ou par erreur — un appairage accordé donne accès à ce que le profil négocié permet, contacts ou fichiers selon les cas. Les cas plus sérieux visent des défauts de la pile logicielle Bluetooth elle-même, corrigés par les mises à jour du système, ce qui rend la mise à jour plus efficace ici que n'importe quelle vigilance.",
    warningSigns: [
      "Demandes d'appairage venant d'appareils inconnus, surtout répétées",
      "Fichiers ou messages reçus sans les avoir sollicités",
      "Appareil inconnu figurant dans la liste des appareils appairés",
      "Bluetooth se réactivant seul après avoir été coupé",
      "Consommation de batterie inhabituelle dans un lieu fréquenté",
    ],
    triggers: ["curiosity", "trust"],
    indicators: [],
    howToVerify:
      "Ouvrez la liste des appareils appairés et retirez tout ce que vous ne reconnaissez pas ou n'utilisez plus — un appairage ancien reste valable indéfiniment. Vérifiez ensuite que l'appareil n'est pas en mode découvrable en permanence.",
    whatToDo:
      "Coupez le Bluetooth quand vous ne l'utilisez pas, refusez systématiquement les appairages non sollicités, et maintenez le système à jour : ces attaques reposent sur des défauts corrigés par les mises à jour. Renommez l'appareil si son nom révèle votre identité.",
    whatToDoIfVictim:
      "Supprimez les appairages inconnus, redémarrez l'appareil, appliquez les mises à jour disponibles. Si des fichiers ont été reçus et ouverts, faites analyser l'appareil et changez les mots de passe sensibles depuis un autre matériel.",
    whyItWorks:
      "Le Bluetooth reste allumé par commodité, et une demande d'appairage ressemble à une notification ordinaire. Après plusieurs demandes, on finit par accepter pour la faire disparaître.",
    example: {
      setting: "Salle d'attente, téléphone dans la poche avec le Bluetooth allumé.",
      message:
        "Demande d'association Bluetooth\nTel-7731 souhaite s'associer à votre téléphone.\n[Associer] [Annuler]",
      giveaways: [
        "Vous n'avez rien cherché à connecter.",
        "Le nom de l'appareil ne vous dit rien.",
        "La demande revient si vous l'ignorez.",
      ],
    },
    decisionChecklist: [
      {
        check: "Recevez-vous une demande d'association que vous n'avez pas provoquée ?",
        then: "Refusez, puis coupez le Bluetooth.",
      },
      {
        check: "La liste des appareils associés contient-elle un appareil inconnu ou que vous n'utilisez plus ?",
        then: "Supprimez-le.",
      },
      {
        check: "Avez-vous accepté une association ou ouvert un fichier reçu ?",
        then: "Supprimez l'association, mettez le téléphone à jour et changez vos mots de passe sensibles depuis un autre appareil.",
      },
    ],
    prevention: [
      "Coupez le Bluetooth quand vous ne l'utilisez pas.",
      "Gardez le système à jour.",
      "Donnez à votre téléphone un nom qui ne révèle pas votre identité.",
    ],
    relatedAttackCodes: ["MOB-000003", "MOB-000008", "MOB-000005"],
    faq: [
      {
        question: "Faut-il couper le Bluetooth en permanence ?",
        answer:
          "Ce n'est pas nécessaire si le système est à jour et l'appareil non découvrable, d'autant que le Bluetooth sert à des usages utiles. Le geste qui compte davantage est le tri régulier des appareils appairés, qui s'accumulent sans que personne les regarde.",
      },
      {
        question: "Quelle portée réelle pour ce type d'attaque ?",
        answer:
          "Quelques mètres dans les usages courants, ce qui suppose une proximité physique. C'est une contrainte forte pour l'attaquant, et cela explique que ces attaques concernent surtout les lieux où l'on reste immobile un moment.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "bluetooth-attack",
        simulationSlug: "unknown-bluetooth-pairing-request",
        name: "Bluetooth attack",
        plainLanguageDefinition:
          "Bluetooth left on makes the device visible and reachable by whatever is within a few meters. That's enough to receive unsolicited pairing requests, and sometimes more.",
        definition:
          "A Bluetooth attack exploits a device's short-range wireless connectivity to send it unsolicited data, obtain abusive pairing, or take advantage of a flaw in its Bluetooth software stack.",
        howItWorks:
          "Bluetooth requires proximity — a few meters — which limits the situations to busy places: public transport, waiting rooms, shared spaces. A device in discoverable mode announces its presence and name, which is already a piece of information. The simplest uses involve sending files or repeated pairing requests until someone accepts out of fatigue or by mistake — a granted pairing gives access to whatever the negotiated profile allows, contacts or files depending on the case. More serious cases target flaws in the Bluetooth stack itself, fixed by system updates, which makes updating more effective here than any amount of vigilance.",
        warningSigns: [
          "Pairing requests from unknown devices, especially repeated ones",
          "Files or messages received without having asked for them",
          "An unknown device appearing in the list of paired devices",
          "Bluetooth turning itself back on after being switched off",
          "Unusual battery drain in a busy location",
        ],
        howToVerify:
          "Open the list of paired devices and remove anything you don't recognize or no longer use — an old pairing stays valid indefinitely. Then check that the device isn't permanently in discoverable mode.",
        whatToDo:
          "Turn Bluetooth off when you're not using it, systematically decline unsolicited pairing requests, and keep the system up to date: these attacks rely on flaws fixed by updates. Rename the device if its name reveals your identity.",
        whatToDoIfVictim:
          "Remove unknown pairings, restart the device, apply available updates. If files were received and opened, have the device scanned and change sensitive passwords from another device.",
        faq: [
          {
            question: "Should Bluetooth be turned off permanently?",
            answer:
              "It isn't necessary if the system is up to date and the device isn't discoverable, especially since Bluetooth serves useful purposes. The more important habit is regularly reviewing paired devices, which pile up without anyone looking at them.",
          },
          {
            question: "What's the real range for this kind of attack?",
            answer:
              "A few meters in typical uses, which requires physical proximity. That's a significant constraint for the attacker, and it explains why these attacks mostly concern places where people stay put for a while.",
          },
        ],
        whyItWorks:
          "Bluetooth stays on for convenience, and a pairing request looks like an ordinary notification. After several requests, people end up accepting just to make it go away.",
        example: {
          setting: "Waiting room, phone in your pocket with Bluetooth on.",
          message:
            "Bluetooth pairing request\nTel-7731 wants to pair with your phone.\n[Pair] [Cancel]",
          giveaways: [
            "You weren't trying to connect anything.",
            "The device name means nothing to you.",
            "The request comes back if you ignore it.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are you receiving a pairing request you didn't trigger?",
            then: "Decline, then turn off Bluetooth.",
          },
          {
            check: "Does your list of paired devices include one that's unknown or that you no longer use?",
            then: "Remove it.",
          },
          {
            check: "Did you accept a pairing or open a file you received?",
            then: "Remove the pairing, update the phone and change your sensitive passwords from another device.",
          },
        ],
        prevention: [
          "Turn off Bluetooth when you're not using it.",
          "Keep the system up to date.",
          "Give your phone a name that doesn't reveal your identity.",
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
    code: "MOB-000005",
    slug: "objet-connecte-compromis",
    noSimulationReason:
      "Le signal, quand il existe, est un comportement observé sur l'objet lui-même ou dans l'interface de la box — jamais un message à juger sous pression.",
    name: "Objet connecté compromis",
    categorySlug: "telephones-et-objets-connectes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une ampoule, une prise, un thermostat ou un jouet connecté n'a ni écran ni notification : s'il est compromis, rien ne vous le dira. Il continue de fonctionner normalement.",
    attackerObjective: "controle_d_un_appareil",
    aliases: ["IoT compromis", "objet connecté piraté", "domotique compromise"],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un objet connecté compromis est un appareil domestique relié au réseau — éclairage, prise, thermostat, électroménager, jouet — dont un tiers a pris le contrôle, généralement par un identifiant d'usine ou un défaut logiciel non corrigé.",
    howItWorks:
      "Ces objets sont vendus à bas prix, conçus pour être simples à installer, et rarement mis à jour après l'achat — parfois plus du tout une fois le modèle retiré de la vente. Beaucoup partagent le même identifiant d'administration d'usine pour toute une gamme, information publique puisqu'elle figure dans la notice. L'objet, lui, reste allumé en permanence et connecté au même réseau que l'ordinateur et le téléphone. Ce qui en fait une cible n'est pas sa valeur propre — personne ne veut vos ampoules — mais sa position : il offre un point d'appui à l'intérieur du réseau domestique, et une capacité de calcul mobilisable à distance dans un ensemble d'appareils asservis.",
    warningSigns: [
      "Objet fonctionnant de manière inattendue : allumage, mouvement, son sans commande",
      "Identifiants d'administration jamais modifiés depuis l'installation",
      "Appareil dont le fabricant ne publie plus de mises à jour",
      "Trafic réseau ou consommation de données inhabituels à la maison",
      "Appareil inconnu apparaissant dans la liste des équipements du routeur",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Ouvrez l'interface de votre box ou de votre routeur et regardez la liste des appareils connectés : elle doit correspondre à ce que vous possédez réellement. Pour chaque objet, vérifiez que le mot de passe d'usine a été changé et que le micrologiciel est à jour.",
    whatToDo:
      "Changez le mot de passe d'usine dès l'installation, activez les mises à jour automatiques quand elles existent, et n'exposez pas l'objet directement sur internet. Si votre box le permet, placez ces appareils sur un réseau invité, séparé de celui des ordinateurs et téléphones — c'est la mesure qui limite le mieux les conséquences.",
    whatToDoIfVictim:
      "Déconnectez l'objet du réseau, réinitialisez-le, mettez-le à jour et changez son mot de passe avant de le rebrancher. Vérifiez ensuite les autres appareils du foyer et le routeur lui-même, dont la configuration a pu être modifiée.",
    whyItWorks:
      "Un objet sans écran ne peut rien signaler, et il continue de faire ce qu'on attend de lui. On le branche, on garde le mot de passe d'usine, et on ne le met jamais à jour.",
    example: {
      setting: "Liste des appareils connectés, affichée dans l'interface de la box.",
      message:
        "Appareils connectés : 11\n• ordinateur-salon\n• telephone-anna\n• prise-connectee-cuisine\n• ESP-4F2A (inconnu)\n• …",
      giveaways: [
        "Un appareil au nom technique ne correspond à rien que vous ayez installé.",
        "Le nombre d'appareils dépasse ce que vous possédez.",
        "La prise connectée a toujours son mot de passe d'usine.",
      ],
    },
    decisionChecklist: [
      {
        check: "La liste des appareils de la box contient-elle un équipement que vous ne reconnaissez pas ?",
        then: "Bloquez-le dans la box et changez la clé du Wi-Fi.",
      },
      {
        check: "Un objet garde-t-il son mot de passe d'usine ou n'est-il plus mis à jour ?",
        then: "Changez le mot de passe, ou remplacez l'objet si le fabricant ne le suit plus.",
      },
      {
        check: "Un objet s'allume, bouge ou émet un son sans commande ?",
        then: "Débranchez-le, réinitialisez-le et mettez-le à jour avant de le reconnecter.",
      },
    ],
    prevention: [
      "Changez le mot de passe d'usine dès l'installation.",
      "Placez les objets connectés sur un réseau invité.",
      "Choisissez des objets dont le fabricant publie des mises à jour.",
    ],
    relatedAttackCodes: [
      "MOB-000009",
      "MOB-000010",
      "MOB-000004",
      "MAL-000006",
      "MAL-000008",
      "NET-000006",
    ],
    faq: [
      {
        question: "Pourquoi s'attaquer à une ampoule connectée ?",
        answer:
          "Pas pour l'ampoule. Pour la place qu'elle occupe : à l'intérieur de votre réseau, allumée en permanence, et rarement surveillée. Elle sert de point d'appui, ou de capacité de calcul dans un ensemble d'appareils pilotés à distance.",
      },
      {
        question:
          "Que faire d'un objet dont le fabricant ne publie plus de mises à jour ?",
        answer:
          "Isolez-le sur un réseau invité si votre box le permet, et acceptez de le remplacer s'il occupe une fonction sensible comme une caméra ou une serrure. Un appareil qui ne reçoit plus de correctifs conserve indéfiniment les défauts découverts après son abandon.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "compromised-smart-device",
        name: "Compromised smart device",
        plainLanguageDefinition:
          "A bulb, plug, thermostat or connected toy has no screen and no notifications: if it's compromised, nothing will tell you. It keeps working normally.",
        definition:
          "A compromised smart device is a network-connected home appliance — lighting, a plug, a thermostat, a household appliance, a toy — that a third party has taken control of, usually through a factory-set credential or an unpatched software flaw.",
        howItWorks:
          "These devices are sold cheaply, designed to be simple to set up, and rarely updated after purchase — sometimes not at all once the model is discontinued. Many share the same factory admin credential across an entire product line, information that is public since it appears in the manual. The device itself stays powered on permanently and connected to the same network as the computer and the phone. What makes it a target isn't its own value — nobody wants your light bulbs — but its position: it offers a foothold inside the home network, and computing capacity that can be mobilized remotely as part of a fleet of enslaved devices.",
        warningSigns: [
          "Device behaving unexpectedly: turning on, moving, or making sound without a command",
          "Admin credentials never changed since installation",
          "Device whose manufacturer no longer publishes updates",
          "Unusual network traffic or data usage at home",
          "Unknown device appearing in the router's list of connected equipment",
        ],
        howToVerify:
          "Open your box or router's interface and look at the list of connected devices: it should match what you actually own. For each device, check that the factory password has been changed and that the firmware is up to date.",
        whatToDo:
          "Change the factory password as soon as you install the device, enable automatic updates where available, and don't expose the device directly to the internet. If your box allows it, put these devices on a guest network, separate from your computers and phones — this is the measure that best limits the consequences.",
        whatToDoIfVictim:
          "Disconnect the device from the network, reset it, update it and change its password before reconnecting it. Then check the other devices in the home and the router itself, whose configuration may have been changed.",
        faq: [
          {
            question: "Why would anyone target a smart bulb?",
            answer:
              "Not for the bulb. For the position it occupies: inside your network, powered on permanently, and rarely monitored. It serves as a foothold, or as computing capacity within a fleet of remotely controlled devices.",
          },
          {
            question:
              "What should I do about a device whose manufacturer no longer publishes updates?",
            answer:
              "Isolate it on a guest network if your box allows it, and be prepared to replace it if it serves a sensitive function like a camera or a lock. A device that no longer receives patches keeps indefinitely the flaws discovered after it was abandoned.",
          },
        ],
        whyItWorks:
          "A device without a screen can't report anything, and it keeps doing what's expected of it. You plug it in, keep the factory password, and never update it.",
        example: {
          setting: "List of connected devices, shown in the router's interface.",
          message:
            "Connected devices: 11\n• living-room-computer\n• anna-phone\n• kitchen-smart-plug\n• ESP-4F2A (unknown)\n• …",
          giveaways: [
            "A device with a technical name matches nothing you installed.",
            "The number of devices exceeds what you own.",
            "The smart plug still has its factory password.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the router's device list include equipment you don't recognize?",
            then: "Block it in the router and change the Wi-Fi password.",
          },
          {
            check: "Does a device still have its factory password, or no longer receive updates?",
            then: "Change the password, or replace the device if the manufacturer no longer supports it.",
          },
          {
            check: "Does a device turn on, move or make a sound without a command?",
            then: "Unplug it, reset it and update it before reconnecting it.",
          },
        ],
        prevention: [
          "Change the factory password as soon as it's installed.",
          "Put connected devices on a guest network.",
          "Choose devices whose manufacturer publishes updates.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        noSimulationReason:
          "The signal, when there is one, is a behavior observed on the device itself or in the box's interface — never a message to judge under pressure.",
      },
    },
  },
  {
    code: "MOB-000006",
    slug: "sms-surtaxe",
    simulationSlug: "sms-jeu-concours-numero-surtaxe",
    name: "Abonnement et SMS surtaxés",
    categorySlug: "telephones-et-objets-connectes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Le préjudice n'apparaît pas sur votre compte bancaire mais sur la facture de votre opérateur, sous une ligne que personne ne lit. C'est pourquoi il peut durer des mois.",
    attackerObjective: "argent",
    aliases: [
      "numéro surtaxé",
      "abonnement caché",
      "SMS+ frauduleux",
      "prélèvement opérateur",
    ],
    primaryVector: "sms",
    primaryDimension: "sms_scam_recognition",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "L'abonnement surtaxé est la souscription, souvent non consciente, à un service facturé par l'opérateur téléphonique, déclenchée par un SMS, un appel vers un numéro spécial ou une validation sur une page mobile.",
    howItWorks:
      "Ce mécanisme repose sur un circuit de paiement particulier : la facturation passe par l'opérateur, sans carte bancaire ni saisie d'identifiants, ce qui supprime toutes les étapes où l'on se méfie habituellement. Le déclenchement prend plusieurs formes : un SMS invitant à répondre par un mot, un jeu-concours dont la participation vaut souscription, un bouton sur une page mobile où la mention de l'abonnement figure en petits caractères, ou un rappel demandé vers un numéro spécial. Le montant est modeste et récurrent, ce qui le rend supportable et donc durable : il se noie dans une facture que l'on regarde peu, et la découverte survient souvent des mois plus tard.",
    warningSigns: [
      "Ligne « achats », « SMS+ » ou « services tiers » inhabituelle sur la facture opérateur",
      "SMS de confirmation d'abonnement que vous n'avez pas sollicité",
      "Invitation à répondre par un mot précis pour obtenir un résultat ou un cadeau",
      "Numéro à quatre ou cinq chiffres à rappeler pour « récupérer un colis » ou « écouter un message »",
      "Page mobile faisant valider un service dont le prix figure en petits caractères",
    ],
    triggers: ["curiosity", "reward", "urgency"],
    indicators: [],
    howToVerify:
      "Lisez le détail de votre facture opérateur plutôt que son montant total : ces prélèvements y figurent sous une ligne distincte du forfait. Les opérateurs proposent également un blocage des services surtaxés, activable sur demande, qui règle la question à la source.",
    whatToDo:
      "Ne répondez pas aux SMS invitant à envoyer un mot, ne rappelez pas les numéros courts reçus sans contexte, et demandez à votre opérateur le blocage des services surtaxés si vous n'en avez pas l'usage. En France, un SMS frauduleux peut être transféré au 33700.",
    whatToDoIfVictim:
      "Demandez la résiliation et le remboursement auprès de votre opérateur, qui dispose d'une procédure pour ces services, et faites activer le blocage. Conservez la facture détaillée : elle identifie le service et la date de souscription, ce qui est nécessaire à la réclamation.",
    whyItWorks:
      "Le paiement passe par la facture du téléphone, sans carte ni identifiant : aucune des étapes où l'on se méfie d'habitude. Le montant est petit et revient chaque mois dans une facture que peu de gens détaillent.",
    example: {
      setting: "SMS reçu d'un numéro court, un samedi.",
      message:
        "Félicitations, vous êtes sélectionné pour gagner un smartphone ! Répondez OUI pour valider votre participation.",
      giveaways: [
        "Vous n'avez participé à aucun jeu.",
        "Répondre par un mot peut valoir souscription à un service payant.",
        "Le prix du service n'est indiqué nulle part dans le message.",
      ],
    },
    decisionChecklist: [
      {
        check: "Un SMS vous demande-t-il de répondre par un mot ou de rappeler un numéro court ?",
        then: "N'en faites rien : transférez le SMS au 33700, puis supprimez-le.",
      },
      {
        check: "Votre facture opérateur contient-elle une ligne d'achats ou de services tiers que vous n'expliquez pas ?",
        then: "Demandez la résiliation et le remboursement à votre opérateur.",
      },
      {
        check: "Avez-vous validé un service sur une page mobile sans en voir le prix ?",
        then: "Contactez votre opérateur pour identifier le service et le résilier.",
      },
    ],
    prevention: [
      "Demandez à votre opérateur le blocage des services surtaxés.",
      "Lisez le détail de la facture, pas seulement le total.",
      "Ne répondez jamais à un SMS qui vous fait envoyer un mot.",
    ],
    relatedAttackCodes: ["SMS-000001", "MOB-000001", "SOCIAL-000002"],
    faq: [
      {
        question: "Pourquoi ma banque n'a-t-elle rien bloqué ?",
        answer:
          "Parce qu'aucun paiement bancaire n'a lieu : la somme est facturée par l'opérateur avec votre forfait. C'est ce qui rend ce circuit efficace — il évite la carte, donc les alertes et les procédures de contestation qui vont avec.",
      },
      {
        question: "Répondre STOP met-il fin à l'abonnement ?",
        answer:
          "Pour un service régulier, le mot d'arrêt est effectivement prévu et fonctionne. Pour un envoi frauduleux, répondre confirme surtout que le numéro est actif et lu. La voie fiable passe par l'opérateur, pas par une réponse au message.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "premium-rate-sms-scam",
        simulationSlug: "prize-draw-premium-rate-text",
        name: "Premium-rate subscriptions and SMS",
        plainLanguageDefinition:
          "The damage doesn't show up on your bank statement but on your carrier bill, under a line nobody reads. That's why it can go on for months.",
        definition:
          "A premium-rate subscription is a subscription to a carrier-billed service, often taken out unknowingly, triggered by an SMS, a call to a special number, or a confirmation on a mobile page.",
        howItWorks:
          "This mechanism relies on a particular payment circuit: billing goes through the carrier, with no bank card or credential entry, which removes all the steps where people are normally wary. It's triggered in several ways: an SMS inviting a reply with a specific word, a competition where entering counts as subscribing, a button on a mobile page where the subscription is mentioned in fine print, or a callback requested to a special number. The amount is small and recurring, which makes it bearable and therefore durable: it gets lost in a bill people rarely look at closely, and discovery often comes months later.",
        warningSigns: [
          "Unusual \"purchases\", \"premium SMS\" or \"third-party services\" line on the carrier bill",
          "Subscription confirmation SMS that you did not request",
          "Invitation to reply with a specific word to get a result or a gift",
          "A four- or five-digit number to call back to \"collect a package\" or \"listen to a message\"",
          "A mobile page confirming a service whose price appears in fine print",
        ],
        howToVerify:
          "Read the detail of your carrier bill rather than its total: these charges appear under a line separate from your plan. Carriers also offer blocking of premium-rate services, activated on request, which settles the matter at the source.",
        whatToDo:
          "Don't reply to SMS inviting you to send back a word, don't call back short numbers received out of context, and ask your carrier to block premium-rate services if you have no use for them. In France, a fraudulent SMS can be forwarded to 33700.",
        whatToDoIfVictim:
          "Request cancellation and a refund from your carrier, which has a procedure for these services, and have the block activated. Keep the itemized bill: it identifies the service and the subscription date, which is needed for the claim.",
        faq: [
          {
            question: "Why didn't my bank block anything?",
            answer:
              "Because no bank payment takes place: the amount is billed by the carrier along with your plan. That's what makes this circuit effective — it bypasses the card, and so the alerts and dispute procedures that come with it.",
          },
          {
            question: "Does replying STOP end the subscription?",
            answer:
              "For a legitimate recurring service, the stop keyword is indeed provided and works. For a fraudulent message, replying mainly confirms that the number is active and read. The reliable path goes through the carrier, not through a reply to the message.",
          },
        ],
        whyItWorks:
          "Payment goes through the phone bill, with no card and no login: none of the steps where people are usually wary. The amount is small and comes back every month on a bill few people read in detail.",
        example: {
          setting: "Text from a short code, on a Saturday.",
          message:
            "Congratulations, you've been selected to win a smartphone! Reply YES to confirm your entry.",
          giveaways: [
            "You never entered any contest.",
            "Replying with a word can count as subscribing to a paid service.",
            "The service's price isn't stated anywhere in the message.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does a text ask you to reply with a word or call back a short number?",
            then: "Do neither: forward the text to your carrier's spam-reporting number (33700 in France), then delete it.",
          },
          {
            check: "Does your phone bill include a purchases or third-party services line you can't explain?",
            then: "Ask your carrier to cancel the service and refund you.",
          },
          {
            check: "Did you approve a service on a mobile page without seeing its price?",
            then: "Contact your carrier to identify the service and cancel it.",
          },
        ],
        prevention: [
          "Ask your carrier to block premium-rate services.",
          "Read the bill's details, not just the total.",
          "Never reply to a text that has you send a word.",
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
    code: "MOB-000007",
    slug: "permissions-abusives",
    noSimulationReason:
      "La décision se prend dans l'écran d'autorisation du système, sur une application par ailleurs légitime. Reconstituer cet écran hors de son contexte apprendrait à refuser au mauvais moment.",
    name: "Permissions abusives",
    categorySlug: "telephones-et-objets-connectes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Rien n'est piraté : une application parfaitement légale vous a demandé l'accès à vos contacts, à votre position et à votre micro, et vous avez dit oui pour pouvoir vous en servir.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "autorisations excessives",
      "collecte abusive",
      "permissions excessives",
    ],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Les permissions abusives désignent la collecte de données rendue possible par des autorisations accordées à une application, disproportionnées par rapport à la fonction qu'elle remplit.",
    howItWorks:
      "La demande arrive au pire moment pour la réflexion : l'application vient d'être ouverte, l'utilisateur veut s'en servir, et refuser semble empêcher la fonction. Elle est souvent formulée de façon à paraître nécessaire — l'accès aux contacts « pour trouver vos amis », la position « pour améliorer votre expérience ». Une fois accordée, l'autorisation est permanente et silencieuse : rien ne signale les accès ultérieurs, et l'application peut collecter en arrière-plan. Le préjudice n'est pas une intrusion mais une accumulation, souvent revendue à des courtiers en données, où les informations de plusieurs applications se recoupent pour reconstituer des habitudes, des déplacements et un entourage.",
    warningSigns: [
      "Autorisation demandée sans rapport avec la fonction : micro pour une lampe torche, contacts pour un jeu",
      "Demande formulée au lancement plutôt qu'au moment d'utiliser la fonction concernée",
      "Application refusant de fonctionner sans une autorisation non essentielle",
      "Position accordée « toujours » plutôt que « pendant l'utilisation »",
      "Applications anciennes conservant des autorisations dont vous ne vous servez plus",
    ],
    triggers: ["urgency", "reward", "trust"],
    indicators: [],
    howToVerify:
      "Les systèmes mobiles proposent une vue par autorisation plutôt que par application : ouvrez « position », puis « micro », puis « contacts », et regardez qui figure dans chaque liste. C'est plus révélateur que de parcourir les applications une par une, et cela fait apparaître les oubliées.",
    whatToDo:
      "Accordez au moment de l'usage plutôt qu'à l'installation, préférez « pendant l'utilisation » à « toujours » pour la position, et refusez ce qui n'est pas nécessaire — une application qui cesse alors de fonctionner vient de vous renseigner sur son modèle. Faites une revue périodique, en commençant par les applications que vous n'ouvrez plus.",
    whatToDoIfVictim:
      "Retirez les autorisations superflues, désinstallez les applications inutilisées et réinitialisez l'identifiant publicitaire du téléphone, qui est ce qui relie ces collectes entre elles. Vous pouvez exercer votre droit d'accès et d'effacement auprès des éditeurs concernés.",
    whyItWorks:
      "La demande arrive au moment où l'on veut se servir de l'application, et refuser semble l'empêcher de marcher. Ensuite, l'accès est silencieux : rien ne rappelle qu'il a été accordé.",
    example: {
      setting: "Premier lancement d'un jeu de cartes gratuit sur votre téléphone.",
      message:
        "Autoriser Jeu de cartes Atout à accéder à vos contacts ?\n[Autoriser] [Refuser]\nPuis : Autoriser l'accès à votre position ? [Toujours] [Pendant l'utilisation] [Refuser]",
      giveaways: [
        "Un jeu de cartes n'a besoin ni de vos contacts ni de votre position.",
        "Les demandes arrivent au lancement, avant toute fonction qui les justifierait.",
        "L'option Toujours est proposée en premier.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'autorisation demandée est-elle sans rapport avec ce que fait l'application ?",
        then: "Refusez. Si l'application cesse de fonctionner, elle vient de vous dire de quoi elle vit.",
      },
      {
        check: "La position est-elle demandée en permanence ?",
        then: "Choisissez Pendant l'utilisation, ou refusez.",
      },
      {
        check: "Des applications que vous n'ouvrez plus gardent-elles des autorisations ?",
        then: "Retirez-les depuis la vue par autorisation des paramètres, ou désinstallez ces applications.",
      },
    ],
    prevention: [
      "Accordez les autorisations au moment de l'usage, pas à l'installation.",
      "Passez en revue, de temps en temps, qui a accès à la position, au micro et aux contacts.",
      "Réinitialisez l'identifiant publicitaire du téléphone de temps en temps.",
    ],
    relatedAttackCodes: [
      "MOB-000001",
      "MOB-000002",
      "MOB-000008",
      "DATA-000006",
      "DATA-000007",
      "MAL-000003",
    ],
    faq: [
      {
        question: "Est-ce vraiment une attaque, si c'est légal ?",
        answer:
          "Le procédé n'est pas toujours illégal, et c'est ce qui le rend durable. Il figure ici parce que le résultat pour vous est le même qu'une collecte non consentie : des données que vous n'auriez pas données si la demande avait été formulée clairement.",
      },
      {
        question: "Refuser une autorisation casse-t-il l'application ?",
        answer:
          "Rarement pour les fonctions réelles : les systèmes récents permettent un refus sans blocage. Une application qui devient inutilisable après un refus portant sur une fonction accessoire vous indique que la collecte, et non le service, est ce qu'elle vend.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "excessive-app-permissions",
        name: "Excessive permissions",
        plainLanguageDefinition:
          "Nothing was hacked: a perfectly legal app asked for access to your contacts, your location and your microphone, and you said yes so you could use it.",
        definition:
          "Excessive permissions refers to data collection made possible by permissions granted to an app that are disproportionate to the function it performs.",
        howItWorks:
          "The request arrives at the worst possible moment for reflection: the app has just been opened, the user wants to use it, and refusing seems to block the feature. It's often phrased to sound necessary — access to contacts \"to find your friends\", location \"to improve your experience\". Once granted, the permission is permanent and silent: nothing signals later access, and the app can collect data in the background. The harm isn't an intrusion but an accumulation, often resold to data brokers, where information from several apps is cross-referenced to reconstruct habits, movements and a social circle.",
        warningSigns: [
          "Permission requested with no relation to the function: microphone for a flashlight, contacts for a game",
          "Request made at launch rather than when the relevant feature is actually used",
          "App refusing to work without a non-essential permission",
          "Location granted \"always\" rather than \"while using the app\"",
          "Old apps still holding permissions you no longer use",
        ],
        howToVerify:
          "Mobile systems offer a view by permission rather than by app: open \"location\", then \"microphone\", then \"contacts\", and look at who's in each list. This is more revealing than going through apps one by one, and it surfaces the forgotten ones.",
        whatToDo:
          "Grant permissions when you actually use the feature rather than at install time, prefer \"while using the app\" over \"always\" for location, and decline what isn't necessary — an app that then stops working has just told you something about its business model. Do a periodic review, starting with apps you no longer open.",
        whatToDoIfVictim:
          "Remove unnecessary permissions, uninstall unused apps, and reset the phone's advertising identifier, which is what links this data collection together. You can exercise your right of access and erasure with the publishers concerned.",
        faq: [
          {
            question: "Is this really an attack, if it's legal?",
            answer:
              "The practice isn't always illegal, and that's what makes it durable. It appears here because the outcome for you is the same as non-consensual collection: data you wouldn't have given if the request had been phrased clearly.",
          },
          {
            question: "Does refusing a permission break the app?",
            answer:
              "Rarely for actual features: recent systems allow refusal without blocking. An app that becomes unusable after refusing a permission tied to a secondary feature is telling you that collection, not the service, is what it's selling.",
          },
        ],
        whyItWorks:
          "The request comes just when you want to use the app, and refusing seems to stop it from working. Afterward, the access is silent: nothing reminds you that it was granted.",
        example: {
          setting: "First launch of a free card game on your phone.",
          message:
            "Allow Ace Card Game to access your contacts?\n[Allow] [Deny]\nThen: Allow access to your location? [Always] [While using the app] [Deny]",
          giveaways: [
            "A card game needs neither your contacts nor your location.",
            "The requests come at launch, before any feature that would justify them.",
            "The Always option is offered first.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the permission requested unrelated to what the app does?",
            then: "Deny it. If the app stops working, it has just told you how it makes its money.",
          },
          {
            check: "Is location requested permanently?",
            then: "Choose While using the app, or deny.",
          },
          {
            check: "Do apps you no longer open still hold permissions?",
            then: "Remove them from the settings' per-permission view, or uninstall those apps.",
          },
        ],
        prevention: [
          "Grant permissions when you use a feature, not at installation.",
          "From time to time, review who has access to your location, microphone and contacts.",
          "Reset your phone's advertising ID from time to time.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        noSimulationReason:
          "The decision is made in the system's permission screen, on an app that is otherwise legitimate. Recreating that screen out of context would teach refusing at the wrong moment.",
      },
    },
  },
  {
    code: "MOB-000008",
    slug: "tracage-par-balise",
    noSimulationReason:
      "L'alerte vient du système d'exploitation lui-même, et la conduite à tenir dépend du fait de se sentir ou non en danger. Ce n'est pas une reconnaissance de message.",
    name: "Traçage par balise",
    categorySlug: "telephones-et-objets-connectes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un petit traceur, conçu pour retrouver des clés, glissé dans un sac ou fixé sous un véhicule. Il ne coûte presque rien, tient dans une poche, et signale sa position en continu.",
    attackerObjective: "emprise_sur_une_personne",
    aliases: [
      "traceur glissé",
      "balise de localisation détournée",
      "AirTag détourné",
    ],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Le traçage par balise est l'usage détourné d'un traceur d'objets personnels pour suivre les déplacements d'une personne à son insu, en le dissimulant dans ses affaires ou son véhicule.",
    howItWorks:
      "Ces traceurs ne contiennent pas de GPS : ils émettent un signal capté par les téléphones qui passent à proximité, lesquels remontent la position à leur propriétaire. C'est ce qui explique leur autonomie de plusieurs mois et leur taille réduite, et c'est aussi ce qui les rend précis en ville, où les téléphones sont nombreux. Détournés, ils permettent un suivi continu sans aucune compétence technique, pour le prix d'un objet grand public. Les fabricants ont ajouté des alertes de traceur inconnu, désormais présentes sur les principaux systèmes mobiles, mais elles supposent que la personne suivie porte un téléphone compatible et que les notifications soient actives.",
    warningSigns: [
      "Notification du téléphone signalant qu'un traceur inconnu se déplace avec vous",
      "Sonnerie brève et inexpliquée provenant d'un sac ou d'un véhicule",
      "Une personne qui connaît vos déplacements sans que vous les lui ayez communiqués",
      "Objet inconnu trouvé dans une doublure, sous un siège ou dans un pare-chocs",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Répondez à l'alerte du téléphone si vous en recevez une : elle propose de faire sonner le traceur et d'afficher son identifiant. Les principaux systèmes proposent également une recherche manuelle de traceurs à proximité. En cas de doute, fouillez méthodiquement doublures, poches de sac, sièges et passages de roues.",
    whatToDo:
      "Laissez les notifications de traceur inconnu activées et le Bluetooth allumé — ce sont elles qui rendent l'alerte possible. Un traceur trouvé n'est pas à détruire : il porte un identifiant qui permet de remonter à son propriétaire.",
    whatToDoIfVictim:
      "Ne le désactivez pas immédiatement si vous craignez pour votre sécurité : sa disparition prévient la personne qui vous suit, comme pour un logiciel de surveillance. Photographiez-le en place, notez son identifiant, et déposez plainte — l'identifiant est exploitable par les forces de l'ordre. Si ce traçage s'inscrit dans des violences conjugales, le 3919 écoute et oriente les femmes qui en sont victimes.",
    whyItWorks:
      "Le traceur est minuscule, bon marché, et conçu pour un usage banal : retrouver des clés. Rien ne le signale si le téléphone n'est pas compatible ou si les alertes sont coupées.",
    example: {
      setting: "Notification reçue sur votre téléphone en rentrant chez vous.",
      message:
        "Traceur inconnu détecté. Un traceur qui ne vous appartient pas se déplace avec vous depuis un moment. Son propriétaire peut voir sa position.\n[Faire sonner]",
      giveaways: [
        "Vous ne possédez aucun traceur.",
        "Il vous suit depuis un moment, donc il est sur vous ou dans votre véhicule.",
        "Son propriétaire peut voir où vous êtes.",
      ],
    },
    decisionChecklist: [
      {
        check: "Craignez-vous pour votre sécurité ?",
        then: "Ne le désactivez pas tout de suite : sa disparition prévient la personne qui vous suit. En cas de danger immédiat, appelez le 17. Le 3919 écoute et oriente les femmes victimes de violences.",
      },
      {
        check: "Avez-vous trouvé le traceur ?",
        then: "Photographiez-le en place et notez son identifiant, affiché par l'alerte.",
      },
      {
        check: "Ces éléments sont-ils conservés ?",
        then: "Déposez plainte : l'identifiant permet de remonter au propriétaire.",
      },
    ],
    prevention: [
      "Laissez activées les alertes de traceur inconnu et le Bluetooth.",
      "Faites de temps en temps une recherche manuelle de traceurs à proximité.",
      "Ne détruisez pas un traceur trouvé : il est une preuve.",
    ],
    relatedAttackCodes: ["PERS-000005", "MOB-000004", "MOB-000007"],
    faq: [
      {
        question: "Mon téléphone m'a alerté, que faire en premier ?",
        answer:
          "Faites-le sonner pour le localiser et notez son identifiant, sans le retirer si vous êtes dans une situation où sa disparition pourrait vous exposer. L'identifiant est la pièce utile : il rattache l'objet à un compte.",
      },
      {
        question: "Ces alertes fonctionnent-elles sur tous les téléphones ?",
        answer:
          "Les principaux systèmes mobiles les proposent, mais elles supposent un téléphone compatible, à jour, avec le Bluetooth et les notifications actifs. Une recherche manuelle reste possible, et une fouille méthodique ne dépend d'aucun appareil.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "bluetooth-tracker-stalking",
        name: "Tracker stalking",
        plainLanguageDefinition:
          "A small tracker, designed to find keys, slipped into a bag or fixed under a vehicle. It costs almost nothing, fits in a pocket, and reports its position continuously.",
        definition:
          "Tracker stalking is the misuse of a personal-item tracker to follow a person's movements without their knowledge, by hiding it in their belongings or vehicle.",
        howItWorks:
          "These trackers don't contain GPS: they emit a signal picked up by nearby phones, which relay the position back to the owner. That's what explains their several-month battery life and small size, and it's also what makes them accurate in cities, where phones are numerous. Misused, they enable continuous tracking with no technical skill, for the price of an off-the-shelf consumer item. Manufacturers have added unknown-tracker alerts, now present on the major mobile systems, but they assume the person being tracked carries a compatible phone with notifications turned on.",
        warningSigns: [
          "Phone notification warning that an unknown tracker is moving with you",
          "A short, unexplained chime coming from a bag or a vehicle",
          "Someone who knows your movements without you having told them",
          "An unfamiliar object found in a lining, under a seat, or in a bumper",
        ],
        howToVerify:
          "Respond to the phone's alert if you receive one: it offers to make the tracker chime and to display its identifier. The major systems also offer a manual search for nearby trackers. If in doubt, methodically search linings, bag pockets, seats and wheel wells.",
        whatToDo:
          "Leave unknown-tracker notifications on and Bluetooth switched on — they're what makes the alert possible. A tracker you find shouldn't be destroyed: it carries an identifier that can be traced back to its owner.",
        whatToDoIfVictim:
          "Don't disable it immediately if you fear for your safety: its disappearance would warn the person tracking you, as with stalkerware. Photograph it in place, note its identifier, and file a police report — the identifier can be used by law enforcement. If this tracking is part of domestic abuse, the 3919 helpline in France listens to and guides women facing it.",
        faq: [
          {
            question: "My phone alerted me — what should I do first?",
            answer:
              "Make it chime to locate it and note its identifier, without removing it if you're in a situation where its disappearance could put you at risk. The identifier is the useful piece: it ties the object to an account.",
          },
          {
            question: "Do these alerts work on every phone?",
            answer:
              "The major mobile systems offer them, but they require a compatible, up-to-date phone with Bluetooth and notifications on. A manual search is still possible, and a methodical physical search doesn't depend on any device.",
          },
        ],
        whyItWorks:
          "The tracker is tiny, cheap and designed for an ordinary use: finding keys. Nothing flags it if the phone isn't compatible or alerts are turned off.",
        example: {
          setting: "Notification received on your phone as you get home.",
          message:
            "Unknown tracker detected. A tracker that doesn't belong to you has been moving with you for a while. Its owner can see its location.\n[Play sound]",
          giveaways: [
            "You don't own any tracker.",
            "It has been following you for a while, so it's on you or in your vehicle.",
            "Its owner can see where you are.",
          ],
        },
        decisionChecklist: [
          {
            check: "Do you fear for your safety?",
            then: "Don't disable it right away: its disappearance alerts the person following you. In immediate danger, call emergency services (17 in France). The helpline for women facing violence (3919 in France) listens and guides.",
          },
          {
            check: "Have you found the tracker?",
            then: "Photograph it where it is and note its identifier, shown by the alert.",
          },
          {
            check: "Are these details saved?",
            then: "File a police report: the identifier makes it possible to trace the owner.",
          },
        ],
        prevention: [
          "Keep unknown-tracker alerts and Bluetooth turned on.",
          "Run a manual scan for nearby trackers from time to time.",
          "Don't destroy a tracker you find: it's evidence.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        noSimulationReason:
          "The alert comes from the operating system itself, and the right response depends on whether you feel in danger. This isn't a message-recognition exercise.",
      },
    },
  },
  {
    code: "MOB-000009",
    slug: "camera-de-surveillance-piratee",
    simulationSlug: "notification-connexion-application-camera",
    name: "Caméra de surveillance piratée",
    categorySlug: "telephones-et-objets-connectes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une caméra installée pour surveiller votre domicile devient un moyen de l'observer. L'intrusion ne laisse aucune trace visible : l'image continue de vous parvenir normalement.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "caméra IP piratée",
      "babyphone piraté",
      "vidéosurveillance compromise",
    ],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Une caméra de surveillance piratée est un dispositif de vidéosurveillance domestique dont un tiers a obtenu l'accès, généralement par un identifiant d'usine, un mot de passe réutilisé, ou une exposition directe de l'appareil sur internet.",
    howItWorks:
      "Trois chemins mènent au même résultat. Le premier est l'identifiant d'usine jamais changé, souvent commun à toute une gamme et publié dans la notice. Le deuxième est le compte associé au service du fabricant, protégé par un mot de passe réutilisé ailleurs et donc déjà présent dans des listes issues de fuites. Le troisième est la configuration : une caméra rendue accessible depuis internet pour la consulter à distance devient joignable par n'importe qui, et des moteurs de recherche spécialisés recensent les équipements ainsi exposés. Ce qui distingue cette compromission des autres est son objet — l'intérieur du domicile, les habitudes, les horaires, les enfants — et le fait qu'elle ne produise aucun symptôme.",
    warningSigns: [
      "Caméra qui pivote, émet un son ou allume son témoin sans commande de votre part",
      "Connexions inconnues dans l'historique de l'application associée",
      "Mot de passe de l'application modifié sans votre action",
      "Identifiants d'usine jamais changés depuis l'installation",
      "Accès à distance activé sans que vous l'ayez configuré",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Consultez l'historique des connexions dans l'application du fabricant : c'est là qu'un accès étranger apparaît. Vérifiez que le mot de passe d'usine a été remplacé, que la double authentification est active si elle est proposée, et que l'accès distant est bien celui que vous avez choisi.",
    whatToDo:
      "Changez le mot de passe d'usine dès l'installation par un mot de passe unique, activez la double authentification, maintenez le micrologiciel à jour et n'exposez pas la caméra directement sur internet. Réfléchissez à l'orientation : une caméra qui ne filme pas les pièces de vie limite les conséquences d'une compromission.",
    whatToDoIfVictim:
      "Débranchez la caméra, changez le mot de passe du compte associé depuis un autre appareil, révoquez les sessions et les accès partagés, puis mettez à jour le micrologiciel avant de la rebrancher. Si des images ont pu être captées dans un espace privé, un dépôt de plainte est possible : l'atteinte à l'intimité de la vie privée est une infraction pénale.",
    whyItWorks:
      "Une caméra s'installe en quelques minutes et l'on garde souvent le mot de passe d'usine. Ensuite, l'image continue d'arriver normalement : rien ne signale qu'une autre personne la regarde.",
    example: {
      setting: "Notification de l'application de la caméra, reçue en pleine nuit.",
      message:
        "Nouvelle connexion à votre caméra Salon depuis un appareil inconnu.",
      giveaways: [
        "Personne du foyer n'était connecté à cette heure.",
        "L'appareil n'est pas l'un des vôtres.",
        "Le mot de passe d'usine n'a jamais été changé.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'historique de l'application montre-t-il une connexion que personne du foyer n'explique ?",
        then: "Débranchez la caméra, puis changez le mot de passe du compte depuis un autre appareil.",
      },
      {
        check: "La caméra utilise-t-elle encore son mot de passe d'usine, ou un mot de passe utilisé ailleurs ?",
        then: "Remplacez-le par un mot de passe unique et activez la double authentification.",
      },
      {
        check: "La caméra bouge-t-elle, parle-t-elle ou s'allume-t-elle sans commande de votre part ?",
        then: "Débranchez-la et suivez la marche à suivre de cette fiche avant de la rebrancher.",
      },
    ],
    prevention: [
      "Changez le mot de passe d'usine dès l'installation.",
      "Mettez à jour le micrologiciel et n'exposez pas la caméra directement sur internet.",
      "Évitez de filmer les pièces de vie.",
    ],
    relatedAttackCodes: [
      "MOB-000005",
      "MOB-000010",
      "ACCT-000001",
      "MAL-000008",
      "NET-000008",
    ],
    faq: [
      {
        question: "Comment savoir si quelqu'un regarde ?",
        answer:
          "Le témoin lumineux n'est pas fiable, car il peut être désactivé côté logiciel. L'élément exploitable est l'historique des connexions du compte associé, dans l'application du fabricant : il liste les accès avec leur date.",
      },
      {
        question: "Un babyphone connecté présente-t-il le même risque ?",
        answer:
          "Oui, et il est souvent moins bien protégé : mot de passe d'usine, mises à jour rares, et une orientation vers une chambre. Les mêmes gestes s'appliquent, avec une attention particulière au changement d'identifiant.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "hacked-security-camera",
        simulationSlug: "security-camera-app-sign-in-alert",
        name: "Hacked security camera",
        plainLanguageDefinition:
          "A camera installed to watch your home becomes a way of watching you instead. The intrusion leaves no visible trace: the feed keeps arriving normally.",
        definition:
          "A hacked security camera is a home surveillance device that a third party has gained access to, generally through a factory credential, a reused password, or the device being directly exposed to the internet.",
        howItWorks:
          "Three paths lead to the same result. The first is the factory credential never changed, often shared across an entire product line and published in the manual. The second is the account linked to the manufacturer's service, protected by a password reused elsewhere and therefore already present in lists sourced from data breaches. The third is configuration: a camera made accessible from the internet for remote viewing becomes reachable by anyone, and specialized search engines index equipment exposed this way. What sets this compromise apart from others is its subject — the inside of the home, habits, schedules, children — and the fact that it produces no symptoms.",
        warningSigns: [
          "Camera that pans, makes a sound, or lights its indicator without a command from you",
          "Unfamiliar connections in the associated app's history",
          "App password changed without your action",
          "Factory credentials never changed since installation",
          "Remote access enabled that you didn't configure",
        ],
        howToVerify:
          "Check the connection history in the manufacturer's app: that's where a foreign access would show up. Verify that the factory password has been replaced, that two-factor authentication is enabled if offered, and that remote access is the one you actually chose.",
        whatToDo:
          "Change the factory password as soon as you install the device, using a unique password, enable two-factor authentication, keep the firmware up to date, and don't expose the camera directly to the internet. Think about placement: a camera that doesn't film living spaces limits the consequences of a compromise.",
        whatToDoIfVictim:
          "Unplug the camera, change the password of the associated account from another device, revoke sessions and shared access, then update the firmware before plugging it back in. If footage may have been captured in a private space, filing a police report is possible: invasion of privacy is a criminal offense.",
        faq: [
          {
            question: "How can I tell if someone is watching?",
            answer:
              "The indicator light isn't reliable, since it can be disabled through software. The useful evidence is the connection history of the associated account, in the manufacturer's app: it lists access attempts with their date.",
          },
          {
            question: "Does a connected baby monitor carry the same risk?",
            answer:
              "Yes, and it's often less well protected: factory password, rare updates, and pointed at a bedroom. The same steps apply, with particular attention to changing the credentials.",
          },
        ],
        whyItWorks:
          "A camera is set up in minutes and the factory password is often kept. Afterward, the picture keeps arriving normally: nothing signals that someone else is watching it.",
        example: {
          setting: "Notification from the camera's app, received in the middle of the night.",
          message:
            "New connection to your Living Room camera from an unknown device.",
          giveaways: [
            "Nobody in the household was connected at that time.",
            "The device isn't one of yours.",
            "The factory password was never changed.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the app's history show a connection nobody in the household can explain?",
            then: "Unplug the camera, then change the account password from another device.",
          },
          {
            check: "Is the camera still using its factory password, or a password used elsewhere?",
            then: "Replace it with a unique password and turn on two-factor authentication.",
          },
          {
            check: "Does the camera move, speak or turn on without any command from you?",
            then: "Unplug it and follow the steps on this page before plugging it back in.",
          },
        ],
        prevention: [
          "Change the factory password as soon as it's installed.",
          "Update the firmware and don't expose the camera directly to the internet.",
          "Avoid filming living spaces.",
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
    code: "MOB-000010",
    slug: "routeur-domestique-compromis",
    noSimulationReason:
      "Rien n'arrive à juger : les trois réglages à contrôler — DNS, administration à distance, appareils connectés — se vérifient dans l'interface de la box, pas dans un message reçu.",
    name: "Box ou routeur compromis",
    categorySlug: "telephones-et-objets-connectes",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Tout ce que fait votre foyer passe par la box. Compromise, elle peut envoyer chaque appareil de la maison vers de faux sites — sans que rien ne soit installé sur ces appareils.",
    attackerObjective: "controle_d_un_appareil",
    aliases: [
      "box internet piratée",
      "routeur compromis",
      "détournement DNS domestique",
    ],
    primaryVector: "web",
    primaryDimension: "url_verification",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un routeur domestique compromis est l'équipement d'accès à internet d'un foyer dont la configuration a été modifiée par un tiers, ce qui lui permet d'orienter ou d'observer le trafic de tous les appareils connectés.",
    howItWorks:
      "L'accès s'obtient par l'interface d'administration : mot de passe d'usine conservé, interface accessible depuis internet, ou micrologiciel non mis à jour. Une fois entré, le changement le plus utile à l'attaquant est celui des serveurs DNS, l'annuaire qui traduit un nom de domaine en adresse : en le remplaçant, il peut envoyer une adresse parfaitement correcte vers le serveur de son choix. Rien n'est installé sur les téléphones ni les ordinateurs, ce qui rend le problème invisible à un antivirus, et l'effet porte sur tout le foyer d'un coup, y compris les objets connectés. Le chiffrement limite les dégâts — un navigateur signale un certificat qui ne correspond pas — mais la redirection reste efficace vers des pages conçues pour cela.",
    warningSigns: [
      "Avertissements de certificat sur plusieurs sites et plusieurs appareils à la fois",
      "Redirections inattendues affectant tout le foyer, pas un seul appareil",
      "Serveurs DNS de la box différents de ceux du fournisseur d'accès",
      "Mot de passe d'administration de la box qui ne fonctionne plus",
      "Appareils inconnus dans la liste des équipements connectés",
      "Accès à l'interface d'administration activé depuis l'extérieur",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Connectez-vous à l'interface d'administration de la box et contrôlez trois réglages : les serveurs DNS, l'administration à distance, et la liste des appareils connectés. Un avertissement de certificat qui apparaît sur plusieurs appareils simultanément désigne le réseau plutôt que les appareils, et c'est le signal le plus net.",
    whatToDo:
      "Changez le mot de passe d'administration dès l'installation, désactivez l'administration depuis internet, appliquez les mises à jour du micrologiciel, et utilisez un réseau invité pour les objets connectés. Ces quatre gestes suppriment l'essentiel des chemins d'entrée.",
    whatToDoIfVictim:
      "Réinitialisez la box aux réglages d'usine, puis reconfigurez-la avec un mot de passe unique et les DNS de votre fournisseur. Mettez à jour le micrologiciel avant toute autre chose. Changez ensuite les mots de passe des comptes sensibles utilisés depuis ce réseau, car le trafic a pu être redirigé pendant la période concernée.",
    whyItWorks:
      "La box est installée une fois puis oubliée, avec son mot de passe d'usine. Comme rien n'est installé sur les téléphones ni les ordinateurs, aucun antivirus ne voit le problème.",
    example: {
      setting: "Interface d'administration de la box, ouverte après plusieurs avertissements de certificat sur différents appareils.",
      message:
        "Paramètres réseau :\nServeur DNS principal : 203.0.113.53 (manuel)\nAdministration à distance : activée\nAppareils connectés : 9",
      giveaways: [
        "Les serveurs DNS ont été saisis à la main et ne sont pas ceux du fournisseur.",
        "L'administration à distance est activée sans que vous l'ayez choisie.",
        "Le foyer compte 6 appareils, pas 9.",
      ],
    },
    decisionChecklist: [
      {
        check: "Des avertissements de certificat apparaissent-ils sur plusieurs appareils du foyer en même temps ?",
        then: "Soupçonnez la box : vérifiez ses réglages DNS, d'administration à distance et la liste des appareils.",
      },
      {
        check: "Un de ces trois réglages diffère-t-il de ce que vous avez choisi ?",
        then: "Réinitialisez la box aux réglages d'usine, mettez-la à jour, puis donnez-lui un mot de passe unique.",
      },
      {
        check: "Avez-vous saisi des identifiants pendant la période suspecte ?",
        then: "Changez ces mots de passe depuis un autre réseau.",
      },
    ],
    prevention: [
      "Changez le mot de passe d'administration de la box dès l'installation.",
      "Désactivez l'administration depuis internet et appliquez les mises à jour.",
      "Mettez les objets connectés sur un réseau invité.",
    ],
    relatedAttackCodes: [
      "MOB-000005",
      "MOB-000009",
      "WEB-000003",
      "MAL-000001",
      "MAL-000006",
      "MAL-000008",
      "NET-000003",
      "NET-000004",
      "NET-000006",
    ],
    faq: [
      {
        question: "Mon antivirus ne détecte rien, est-ce normal ?",
        answer:
          "Oui : rien n'est installé sur vos appareils. La modification est dans la box, en amont, ce qui la place hors de portée d'un antivirus. C'est ce qui rend le symptôme collectif — plusieurs appareils, en même temps — plus révélateur que n'importe quelle analyse.",
      },
      {
        question: "Réinitialiser la box suffit-il ?",
        answer:
          "C'est la bonne première étape, à condition de ne pas remettre ensuite le mot de passe d'usine ni de réactiver l'administration à distance. Mettez également le micrologiciel à jour : si l'entrée s'est faite par un défaut logiciel, la réinitialisation seule le laisse ouvert.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "compromised-home-router",
        name: "Compromised router or gateway",
        plainLanguageDefinition:
          "Everything your household does goes through the router. Compromised, it can send every device in the home to fake sites — without anything being installed on those devices.",
        definition:
          "A compromised home router is a household's internet access equipment whose configuration has been altered by a third party, letting them redirect or observe the traffic of every connected device.",
        howItWorks:
          "Access is gained through the admin interface: a factory password left unchanged, an interface accessible from the internet, or firmware that was never updated. Once in, the change most useful to the attacker is the DNS servers, the directory that translates a domain name into an address: by replacing them, the attacker can send a perfectly correct address to a server of their choosing. Nothing is installed on phones or computers, which makes the problem invisible to antivirus software, and the effect hits the whole household at once, including smart devices. Encryption limits the damage — a browser will flag a certificate that doesn't match — but the redirection remains effective toward pages designed for exactly this.",
        warningSigns: [
          "Certificate warnings on several sites and several devices at once",
          "Unexpected redirects affecting the whole household, not a single device",
          "Router DNS servers different from the internet provider's",
          "Router admin password that no longer works",
          "Unknown devices in the list of connected equipment",
          "Remote access to the admin interface enabled from outside",
        ],
        howToVerify:
          "Log into the router's admin interface and check three settings: the DNS servers, remote administration, and the list of connected devices. A certificate warning appearing on several devices at the same time points to the network rather than the devices, and it's the clearest signal.",
        whatToDo:
          "Change the admin password as soon as you set it up, disable remote administration from the internet, apply firmware updates, and use a guest network for smart devices. These four steps remove most of the entry paths.",
        whatToDoIfVictim:
          "Reset the router to factory settings, then reconfigure it with a unique password and your provider's DNS servers. Update the firmware before anything else. Then change the passwords of sensitive accounts used from this network, since traffic may have been redirected during the affected period.",
        faq: [
          {
            question: "My antivirus isn't detecting anything, is that normal?",
            answer:
              "Yes: nothing is installed on your devices. The change is in the router, upstream, which puts it out of an antivirus's reach. That's what makes the collective symptom — several devices, at the same time — more telling than any scan.",
          },
          {
            question: "Is resetting the router enough?",
            answer:
              "It's the right first step, provided you don't put the factory password back or re-enable remote administration afterward. Also update the firmware: if the entry point was a software flaw, a reset alone leaves it open.",
          },
        ],
        whyItWorks:
          "The router is set up once and forgotten, with its factory password. Since nothing is installed on phones or computers, no antivirus sees the problem.",
        example: {
          setting: "Router admin interface, opened after several certificate warnings on different devices.",
          message:
            "Network settings:\nPrimary DNS server: 203.0.113.53 (manual)\nRemote administration: on\nConnected devices: 9",
          giveaways: [
            "The DNS servers were entered by hand and aren't your provider's.",
            "Remote administration is on although you never chose it.",
            "The household has 6 devices, not 9.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are certificate warnings appearing on several household devices at the same time?",
            then: "Suspect the router: check its DNS settings, remote administration and device list.",
          },
          {
            check: "Does any of those three settings differ from what you chose?",
            then: "Reset the router to factory settings, update it, then give it a unique password.",
          },
          {
            check: "Did you enter credentials during the suspicious period?",
            then: "Change those passwords from another network.",
          },
        ],
        prevention: [
          "Change the router's admin password as soon as it's installed.",
          "Turn off administration from the internet and apply updates.",
          "Put connected devices on a guest network.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        noSimulationReason:
          "There is nothing to judge: the three settings to check — DNS, remote administration, connected devices — are verified in the router's interface, not in a received message.",
      },
    },
  },
];

import type { AttackEntry } from "./types";
import { VERIFIED_REFERENCES as REF } from "./types";

/**
 * Réseaux et Wi-Fi.
 *
 * RÈGLES PROPRES À CETTE FAMILLE, en plus de celles de ingenierie-sociale.ts :
 *
 *  1. C'est la famille où la frontière avec le manuel opératoire est la plus
 *     proche. Chaque mécanisme est décrit au niveau qui permet de RECONNAÎTRE
 *     et de SE PROTÉGER, jamais à celui qui permettrait de reproduire :
 *     aucun nom d'outil, aucune commande, aucun paramétrage d'attaque, aucun
 *     détail de trame. Un lecteur doit comprendre pourquoi la mesure de
 *     protection fonctionne ; il n'a besoin de rien de plus.
 *
 *  2. Ces fiches ne surestiment pas la détectabilité. Pour la plupart de ces
 *     procédés, la personne visée ne peut RIEN observer, et le dire est plus
 *     utile qu'une liste de signes qui donnerait l'illusion d'un contrôle.
 *     La protection est ici structurelle — chiffrement de bout en bout,
 *     réseau de confiance, mises à jour — et non comportementale.
 *
 *  3. Une idée reçue est corrigée explicitement plutôt que reprise : « sur un
 *     Wi-Fi public on lit vos mots de passe ». Le raisonnement tenu est
 *     mécanique et non statistique — une connexion chiffrée de bout en bout
 *     ne livre pas son contenu à l'intermédiaire, qui voit les destinations
 *     et non ce qui est échangé. Les risques résiduels réels sont nommés à la
 *     place, ce qui vaut mieux qu'une peur imprécise que le lecteur finit par
 *     ignorer en bloc.
 *
 *  4. `attaque-de-l-homme-du-milieu` est l'entité chapeau : elle DÉFINIT et
 *     RENVOIE, à la manière de `phishing` pour ses canaux. Les fiches
 *     spécialisées ne redéfinissent jamais le concept général.
 */
export const RESEAUX_ET_WIFI: AttackEntry[] = [
  {
    code: "NET-000001",
    slug: "attaque-de-l-homme-du-milieu",
    noSimulationReason:
      "Entité chapeau de la famille : elle définit et renvoie. Les formes concrètes qui comportent une décision — faux point d'accès, portail captif — sont celles qui reçoivent une simulation.",
    name: "Attaque de l'homme du milieu",
    categorySlug: "reseaux-et-wifi",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Quelqu'un se place entre votre appareil et le service que vous utilisez. Tout fonctionne normalement à l'écran — c'est le trajet de vos données qui a changé.",
    attackerObjective: "identifiants",
    aliases: [
      "man in the middle",
      "MITM",
      "attaque de l'intercepteur",
      "homme du milieu",
    ],
    primaryVector: "web",
    primaryDimension: "network_trust_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Une attaque de l'homme du milieu désigne toute situation où un tiers s'intercale entre deux correspondants qui se croient en relation directe, et se trouve en mesure de lire ou de modifier ce qui transite. C'est la catégorie générale ; les fiches de cette famille en décrivent les formes concrètes — faux point d'accès, usurpation sur le réseau local, détournement de résolution de noms — et cette page n'en redéfinit aucune.",
    howItWorks:
      "Le principe est toujours le même : obtenir que votre trafic passe par un point contrôlé, puis en tirer quelque chose. Ce qui varie est la manière d'obtenir ce passage. Le tiers peut fournir le réseau lui-même, en publiant un point d'accès qui ressemble à celui que vous attendez. Il peut, sur un réseau que vous avez déjà rejoint, se faire passer pour la passerelle auprès de votre appareil. Il peut agir sur la traduction des noms de sites en adresses, de sorte qu'une adresse correcte mène à un serveur qui ne l'est pas. Ce qu'il obtient dépend ensuite entièrement du chiffrement. Face à une connexion chiffrée de bout en bout, il voit les destinations et les volumes, non le contenu — ce qui est déjà une information, mais pas vos identifiants. En l'absence de chiffrement, il voit tout, et peut modifier ce qui passe : injecter du contenu dans une page, remplacer un fichier en cours de téléchargement, rediriger vers une copie d'un site. C'est pourquoi la vérification de la connexion sécurisée n'est pas ici un détail de forme : c'est la seule chose qui distingue les deux situations.",
    warningSigns: [
      "Avertissement de certificat, d'identité de site ou de connexion non privée, sur un site habituellement sans problème",
      "Site connu qui s'affiche en connexion non sécurisée alors qu'il ne l'était pas",
      "Sessions fermées, connexions à refaire, formulaires qui échouent sans raison sur un réseau donné",
      "Page de connexion au Wi-Fi qui réapparaît en réclamant davantage qu'à l'ordinaire",
      "Aucun signe — c'est le cas le plus fréquent lorsque le trafic est chiffré et simplement observé",
    ],
    triggers: ["trust", "urgency"],
    indicators: [],
    howToVerify:
      "Ne passez jamais outre un avertissement de certificat : sur un réseau public, c'est l'unique signal fiable de cette famille, et il ne se produit pas sans raison. Vérifiez que l'adresse du site est bien celle attendue, en connexion sécurisée. Si un doute persiste, changez de réseau — un partage de connexion depuis votre téléphone suffit — et regardez si le comportement disparaît : c'est la comparaison la plus concluante à votre portée.",
    whatToDo:
      "Sur un réseau que vous ne maîtrisez pas, tenez-vous-en aux services qui utilisent une connexion chiffrée, ce qui est aujourd'hui le cas de la quasi-totalité des sites sérieux, et n'ignorez aucun avertissement de sécurité. Gardez votre système et votre navigateur à jour : les protections contre ce type d'interception sont largement dans le logiciel, pas dans votre attention.",
    whatToDoIfVictim:
      "Depuis un autre réseau, changez les mots de passe des services utilisés pendant la période concernée et fermez les sessions ouvertes. Vérifiez l'activité récente de vos comptes principaux. Si un téléchargement a eu lieu sur ce réseau, ne l'exécutez pas et reprenez-le depuis une connexion de confiance — le remplacement d'un fichier en cours de transfert est l'un des usages de ce procédé. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Tout s'affiche normalement : la personne n'a aucune raison de penser que le trajet de ses données a changé. Sur un réseau public, on accepte vite ce qui permet d'être connecté.",
    example: {
      setting: "Wi-Fi d'un café, en consultant votre messagerie habituelle.",
      message:
        "Attention : risque probable de sécurité\nLe certificat de messagerie-exemple.test n'est pas valide pour ce réseau.\n[Retour (recommandé)] [Accepter le risque et poursuivre]",
      giveaways: [
        "Le site n'affiche jamais cet avertissement chez vous.",
        "Vous êtes sur un réseau que vous ne maîtrisez pas.",
        "Le bouton pour poursuivre vous fait accepter exactement ce que l'attaque demande.",
      ],
    },
    decisionChecklist: [
      {
        check: "Un avertissement de certificat ou de connexion non privée apparaît-il sur un réseau public ?",
        then: "Ne poursuivez pas. Passez au partage de connexion de votre téléphone.",
      },
      {
        check: "Le problème disparaît-il sur une autre connexion ?",
        then: "C'est le réseau qui est en cause : ne l'utilisez plus.",
      },
      {
        check: "Avez-vous saisi des identifiants ou téléchargé un fichier sur ce réseau ?",
        then: "Depuis une connexion de confiance, changez les mots de passe et retéléchargez le fichier sans l'ouvrir d'abord.",
      },
    ],
    prevention: [
      "Ne passez jamais outre un avertissement de sécurité.",
      "Gardez le système et le navigateur à jour.",
      "Sur un réseau que vous ne maîtrisez pas, préférez le partage de connexion de votre téléphone.",
    ],
    relatedAttackCodes: [
      "NET-000002",
      "NET-000003",
      "NET-000004",
      "NET-000005",
      "NET-000007",
      "WEB-000003",
      "ACCT-000008",
      "NET-000008",
    ],
    faq: [
      {
        question: "Le cadenas dans la barre d'adresse me protège-t-il ?",
        answer:
          "Il indique que la connexion est chiffrée, ce qui empêche un intermédiaire d'en lire le contenu — c'est précisément la protection utile ici. Il ne dit rien en revanche sur l'honnêteté du site lui-même : un site frauduleux peut parfaitement présenter une connexion sécurisée. Le cadenas répond à « qui peut lire ? », pas à « à qui je parle ? ».",
      },
      {
        question: "Un VPN règle-t-il le problème ?",
        answer:
          "Il déplace la confiance. Votre trafic est chiffré jusqu'au serveur du fournisseur, ce qui neutralise un intercepteur situé sur le réseau local — utile sur un Wi-Fi public. Mais le fournisseur voit alors ce que voyait cet intercepteur, et vous lui accordez ce que vous refusiez à l'autre. Un VPN est un outil, pas une garantie.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "man-in-the-middle-attack",
        noSimulationReason:
          "Umbrella entry for this family: it defines the concept and links out to the rest. The concrete forms that involve an actual decision — fake access point, captive portal — are the ones that get a simulation.",
        name: "Man-in-the-Middle Attack",
        plainLanguageDefinition:
          "Someone places themselves between your device and the service you're using. Everything looks normal on screen — it's the path your data takes that has changed.",
        aliases: ["on-path attack", "MITM", "interceptor attack"],
        definition:
          "A man-in-the-middle attack is any situation where a third party inserts itself between two parties who believe they are communicating directly, and is able to read or modify what passes between them. This is the general category; the entries in this family describe its concrete forms — a fake access point, spoofing on the local network, hijacked name resolution — and this page does not redefine any of them.",
        howItWorks:
          "The principle is always the same: get your traffic to pass through a controlled point, then extract something from it. What varies is how that passage is obtained. The third party can provide the network itself, by publishing an access point that resembles the one you expect. On a network you have already joined, it can impersonate the gateway to your device. It can act on the translation of site names into addresses, so that a correct address leads to the wrong server. What it then obtains depends entirely on encryption. Faced with an end-to-end encrypted connection, it sees destinations and volumes, not content — which is already information, but not your credentials. Without encryption, it sees everything, and can modify what passes through: inject content into a page, replace a file being downloaded, redirect to a copy of a site. This is why verifying the secure connection is not a formality here: it is the only thing that distinguishes the two situations.",
        warningSigns: [
          "Certificate, site identity, or non-private connection warning, on a site that's usually fine",
          "A familiar site displaying as an unsecured connection when it previously wasn't",
          "Closed sessions, connections you have to redo, forms that fail for no reason, on a given network",
          "Wi-Fi login page reappearing and asking for more than usual",
          "No sign at all — the most common case when traffic is encrypted and simply observed",
        ],
        howToVerify:
          "Never bypass a certificate warning: on a public network, it is the only reliable signal in this family, and it doesn't happen without reason. Check that the site's address is the one you expect, over a secure connection. If in doubt, switch networks — your phone's mobile hotspot is enough — and see whether the behavior disappears: that's the most conclusive comparison available to you.",
        whatToDo:
          "On a network you don't control, stick to services that use an encrypted connection, which today is the case for nearly all serious sites, and don't ignore any security warning. Keep your system and browser up to date: protections against this kind of interception live mostly in the software, not in your attention.",
        whatToDoIfVictim:
          "From another network, change the passwords of the services used during the period concerned and close open sessions. Check the recent activity of your main accounts. If a download happened on that network, don't run it and redownload it from a trusted connection — replacing a file mid-transfer is one use of this technique. Report the incident to the relevant authority.",
        faq: [
          {
            question: "Does the padlock in the address bar protect me?",
            answer:
              "It indicates the connection is encrypted, which stops an intermediary from reading its content — that's precisely the useful protection here. It says nothing, however, about the honesty of the site itself: a fraudulent site can perfectly well show a secure connection. The padlock answers \"who can read this?\", not \"who am I talking to?\".",
          },
          {
            question: "Does a VPN solve the problem?",
            answer:
              "It shifts the trust. Your traffic is encrypted up to the provider's server, which neutralizes an interceptor on the local network — useful on public Wi-Fi. But the provider then sees what that interceptor saw, and you grant it what you refused the other party. A VPN is a tool, not a guarantee.",
          },
        ],
        whyItWorks:
          "Everything displays normally: the person has no reason to think the path of their data has changed. On a public network, people quickly accept whatever gets them connected.",
        example: {
          setting: "A café's Wi-Fi, while checking your usual email.",
          message:
            "Warning: potential security risk ahead\nThe certificate for messagerie-exemple.test is not valid on this network.\n[Go back (recommended)] [Accept the risk and continue]",
          giveaways: [
            "The site never shows this warning at home.",
            "You're on a network you don't control.",
            "The button to continue makes you accept exactly what the attack needs.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does a certificate or \"connection not private\" warning appear on a public network?",
            then: "Don't continue. Switch to your phone's hotspot.",
          },
          {
            check: "Does the problem disappear on another connection?",
            then: "The network is the cause: stop using it.",
          },
          {
            check: "Did you enter credentials or download a file on this network?",
            then: "From a trusted connection, change the passwords and download the file again, without opening the first one.",
          },
        ],
        prevention: [
          "Never click through a security warning.",
          "Keep your system and browser up to date.",
          "On a network you don't control, prefer your phone's hotspot.",
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
    code: "NET-000002",
    slug: "faux-point-d-acces-wifi",
    simulationSlug: "wifi-aeroport-deux-reseaux",
    name: "Faux point d'accès Wi-Fi",
    categorySlug: "reseaux-et-wifi",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un réseau Wi-Fi qui porte le nom auquel vous vous attendez — celui du café, de l'hôtel, de l'aéroport — mais qui appartient à quelqu'un d'autre. Rien ne le distingue du vrai dans la liste des réseaux.",
    attackerObjective: "identifiants",
    aliases: [
      "evil twin",
      "faux hotspot",
      "point d'accès pirate",
      "rogue AP",
      "faux wifi public",
    ],
    primaryVector: "web",
    primaryDimension: "network_trust_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un faux point d'accès est un réseau sans fil publié par un tiers sous un nom qui imite celui d'un réseau légitime, afin que des appareils s'y connectent et que leur trafic transite par lui. C'est la forme la plus courante d'attaque de l'homme du milieu dans un lieu public.",
    howItWorks:
      "Le nom d'un réseau sans fil est une simple étiquette que celui qui le publie choisit librement : rien n'empêche deux réseaux de porter le même nom, et rien n'indique dans la liste lequel appartient à l'établissement. Un appareil qui a déjà connu un réseau à ce nom peut même s'y raccrocher seul, sans que personne ne choisisse quoi que ce soit — c'est la raison pour laquelle la connexion automatique aux réseaux ouverts est le réglage le plus utile à désactiver. Une fois la connexion établie, tout le trafic passe par le matériel du tiers. La suite dépend du chiffrement, comme pour toute interception : sur des connexions chiffrées, il observe les destinations ; ce qui l'intéresse davantage est de provoquer une saisie, généralement au moyen d'une page de connexion au réseau qui réclame des informations qu'aucun accès Wi-Fi ne nécessite. C'est cette page, et non l'interception elle-même, qui produit le plus souvent le préjudice.",
    warningSigns: [
      "Deux réseaux portant le même nom au même endroit, ou une variante à un caractère près",
      "Réseau ouvert au nom d'un établissement qui, lui, remet un mot de passe à ses clients",
      "Page de connexion réclamant une adresse électronique avec son mot de passe, un numéro de carte, ou l'installation d'un profil ou d'un certificat",
      "Connexion qui s'établit seule dans un lieu où vous n'êtes jamais venu",
      "Avertissement de certificat juste après s'être connecté au réseau",
      "Le personnel de l'établissement ne reconnaît pas le nom du réseau affiché",
    ],
    triggers: ["trust", "reward", "urgency"],
    indicators: [],
    howToVerify:
      "Demandez au personnel le nom exact du réseau et son mode d'accès : c'est la vérification qui tranche, et elle prend dix secondes. Méfiez-vous d'un réseau ouvert là où l'établissement remet habituellement un mot de passe. Une page de connexion qui demande un mot de passe de messagerie ou des coordonnées bancaires est frauduleuse sans autre examen : aucun accès Wi-Fi n'en a besoin.",
    whatToDo:
      "Désactivez la connexion automatique aux réseaux ouverts, et faites oublier à votre appareil les réseaux publics une fois quittés. Ne saisissez jamais d'identifiant de compte ni de moyen de paiement dans une page d'accès au Wi-Fi. N'installez aucun profil ni certificat demandé par un réseau. En cas de doute, le partage de connexion de votre téléphone est plus sûr que n'importe quel Wi-Fi public.",
    whatToDoIfVictim:
      "Depuis un autre réseau, changez immédiatement tout identifiant saisi sur la page de connexion, ainsi que celui des comptes réutilisant le même mot de passe, et fermez les sessions ouvertes. Si vous avez communiqué des données bancaires, contactez votre banque sans attendre. Si vous avez installé un profil ou un certificat à la demande du réseau, retirez-le dans les réglages de l'appareil : il permet d'observer des connexions que le chiffrement protégeait. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Le nom du réseau est celui que l'on attend, et rien dans la liste ne distingue le vrai du faux. Un réseau ouvert paraît même plus pratique : pas de mot de passe à demander.",
    example: {
      setting: "Liste des réseaux Wi-Fi affichée dans le hall d'un aéroport.",
      message:
        "Aeroport_WiFi_Gratuit (sécurisé)\nAeroport_WiFi_Gratuit (ouvert)",
      giveaways: [
        "Deux réseaux portent le même nom au même endroit.",
        "L'un est ouvert alors que l'autre demande un mot de passe.",
        "Rien n'indique lequel appartient à l'aéroport.",
      ],
    },
    decisionChecklist: [
      {
        check: "Plusieurs réseaux portent-ils le même nom, ou presque ?",
        then: "Demandez au personnel le nom exact du réseau et son mode d'accès avant de vous connecter.",
      },
      {
        check: "La page de connexion demande-t-elle un mot de passe de messagerie, une carte ou l'installation d'un profil ?",
        then: "Fermez-la et déconnectez-vous : aucun accès Wi-Fi n'en a besoin.",
      },
      {
        check: "Avez-vous saisi un identifiant ou une carte sur cette page ?",
        then: "Depuis un autre réseau, changez le mot de passe et prévenez votre banque si une carte a été saisie.",
      },
    ],
    prevention: [
      "Désactivez la connexion automatique aux réseaux ouverts.",
      "Faites oublier à votre appareil les réseaux publics une fois quittés.",
      "En cas de doute, utilisez le partage de connexion de votre téléphone.",
    ],
    relatedAttackCodes: [
      "NET-000001",
      "NET-000007",
      "NET-000008",
      "NET-000005",
      "WEB-000003",
      "ACCT-000008",
    ],
    faq: [
      {
        question: "Est-il vraiment risqué d'utiliser le Wi-Fi d'un café ?",
        answer:
          "Moins qu'on ne le dit souvent, et pas pour les raisons habituellement avancées. Les connexions des sites sérieux sont chiffrées de bout en bout : un intermédiaire voit vers où vous allez, pas ce que vous y faites. Les risques réels sont ailleurs — une page d'accès qui vous fait saisir un mot de passe, un certificat que l'on vous fait installer, un téléchargement remplacé en chemin. C'est sur ces trois points qu'il faut être ferme, pas sur l'usage lui-même.",
      },
      {
        question: "Comment savoir lequel des deux réseaux est le bon ?",
        answer:
          "Vous ne pouvez pas le déterminer depuis votre appareil : le nom est librement choisi et rien d'affiché ne fait autorité. La seule réponse fiable vient de l'établissement lui-même. En son absence, considérez le lieu comme non fiable et utilisez votre connexion mobile.",
      },
      {
        question: "Mon téléphone s'est connecté tout seul, est-ce grave ?",
        answer:
          "C'est le comportement normal d'un appareil qui reconnaît un nom déjà mémorisé, et c'est exactement ce que ce procédé exploite. Faites oublier les réseaux publics après usage et désactivez la connexion automatique : cela supprime la principale voie d'entrée sans rien vous coûter.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "evil-twin-wifi",
        simulationSlug: "airport-wifi-two-networks",
        name: "Evil Twin Wi-Fi Hotspot",
        plainLanguageDefinition:
          "A Wi-Fi network carrying the name you expect — the café's, the hotel's, the airport's — but belonging to someone else. Nothing distinguishes it from the real one in the list of networks.",
        aliases: [
          "evil twin",
          "fake hotspot",
          "rogue access point",
          "rogue AP",
          "fake public Wi-Fi",
        ],
        definition:
          "A fake access point is a wireless network published by a third party under a name that imitates a legitimate one, so that devices connect to it and their traffic passes through it. It is the most common form of man-in-the-middle attack in a public place.",
        howItWorks:
          "A wireless network's name is just a label that whoever publishes it chooses freely: nothing stops two networks from carrying the same name, and nothing in the list shows which one belongs to the venue. A device that has already known a network with that name can even reconnect to it on its own, without anyone choosing anything — which is why turning off automatic connection to open networks is the single most useful setting to disable. Once the connection is made, all traffic passes through the third party's equipment. What follows depends on encryption, as with any interception: over encrypted connections, it observes destinations; what interests it more is prompting you to type something in, generally through a Wi-Fi login page asking for information no Wi-Fi access actually needs. It is that page, not the interception itself, that most often causes the harm.",
        warningSigns: [
          "Two networks with the same name in the same place, or a variant one character apart",
          "Open network under the name of a venue that normally hands out a password to its customers",
          "Login page asking for an email address with its password, a card number, or the installation of a profile or certificate",
          "Connection made on its own in a place you've never been before",
          "Certificate warning right after connecting to the network",
          "Venue staff don't recognize the displayed network name",
        ],
        howToVerify:
          "Ask staff for the network's exact name and how to access it: that's the check that settles it, and it takes ten seconds. Be wary of an open network where the venue normally hands out a password. A login page asking for an email password or bank card details is fraudulent without any further examination: no Wi-Fi access needs that.",
        whatToDo:
          "Turn off automatic connection to open networks, and make your device forget public networks once you leave. Never enter an account credential or payment method on a Wi-Fi login page. Don't install any profile or certificate requested by a network. If in doubt, your phone's mobile hotspot is safer than any public Wi-Fi.",
        whatToDoIfVictim:
          "From another network, immediately change any credential entered on the login page, as well as any account reusing the same password, and close open sessions. If you shared banking details, contact your bank without delay. If you installed a profile or certificate at the network's request, remove it in the device's settings: it allows connections that encryption was protecting to be observed. Report the incident to the relevant authority.",
        faq: [
          {
            question: "Is it really risky to use a café's Wi-Fi?",
            answer:
              "Less than is often said, and not for the usual reasons. Serious sites' connections are end-to-end encrypted: an intermediary sees where you're going, not what you're doing there. The real risks lie elsewhere — a login page that gets you to type a password, a certificate you're asked to install, a download replaced along the way. That's what to be firm about, not using public Wi-Fi itself.",
          },
          {
            question: "How do I know which of the two networks is the real one?",
            answer:
              "You can't tell from your device: the name is freely chosen and nothing displayed is authoritative. The only reliable answer comes from the venue itself. Failing that, treat the place as untrusted and use your mobile connection.",
          },
          {
            question: "My phone connected on its own — is that serious?",
            answer:
              "That's the normal behavior of a device recognizing a name it already remembers, and it's exactly what this technique exploits. Make your device forget public networks after use and turn off automatic connection: that removes the main way in, at no cost to you.",
          },
        ],
        whyItWorks:
          "The network's name is the one you expect, and nothing in the list tells the real one from the fake. An open network even seems more convenient: no password to ask for.",
        example: {
          setting: "List of Wi-Fi networks shown in an airport hall.",
          message:
            "Airport_Free_WiFi (secured)\nAirport_Free_WiFi (open)",
          giveaways: [
            "Two networks have the same name in the same place.",
            "One is open while the other asks for a password.",
            "Nothing shows which one belongs to the airport.",
          ],
        },
        decisionChecklist: [
          {
            check: "Do several networks have the same name, or almost?",
            then: "Ask the staff for the exact network name and how to access it before connecting.",
          },
          {
            check: "Does the login page ask for an email password, a card or a profile to install?",
            then: "Close it and disconnect: no Wi-Fi access needs that.",
          },
          {
            check: "Did you enter a credential or a card on that page?",
            then: "From another network, change the password, and warn your bank if a card was entered.",
          },
        ],
        prevention: [
          "Turn off automatic connection to open networks.",
          "Have your device forget public networks once you leave.",
          "When in doubt, use your phone's hotspot.",
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
    code: "NET-000003",
    slug: "usurpation-arp",
    noSimulationReason:
      "Rien n'est visible du côté de l'utilisateur : ni réseau à choisir, ni page à valider. La protection consiste à savoir qui est présent sur son réseau, ce qui n'est pas un jugement sous message.",
    name: "Usurpation ARP",
    categorySlug: "reseaux-et-wifi",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Sur un réseau que vous avez déjà rejoint, un appareil se fait passer pour la box auprès du vôtre. Votre trafic lui est remis avant d'être transmis.",
    attackerObjective: "identifiants",
    aliases: [
      "ARP spoofing",
      "ARP poisoning",
      "empoisonnement ARP",
      "usurpation sur réseau local",
    ],
    primaryVector: "web",
    primaryDimension: "network_trust_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "L'usurpation ARP est une technique par laquelle un appareil déjà présent sur un réseau local se fait passer pour la passerelle — la box ou le routeur — auprès des autres appareils, afin que leur trafic transite par lui. Elle suppose un accès préalable au réseau, ce qui la distingue du faux point d'accès, où c'est le réseau lui-même qui est fourni par le tiers.",
    howItWorks:
      "Sur un réseau local, les appareils déterminent entre eux qui détient quelle adresse par un échange de questions et de réponses conçu à une époque où l'on supposait les participants honnêtes. Ce mécanisme ne comporte pas de vérification d'identité : une réponse affirmant « c'est moi la passerelle » est acceptée comme telle. Un appareil malveillant présent sur le réseau peut donc se placer sur le chemin sans rien forcer, en se contentant de répondre. Les conséquences sont celles de toute interception, avec deux particularités. La première est le périmètre : cela ne fonctionne que sur le réseau local, donc suppose que l'attaquant y soit déjà — un invité, un appareil compromis du foyer, un poste voisin dans un espace partagé. La seconde est l'invisibilité : rien ne change du point de vue de l'utilisateur, il n'y a pas de réseau à choisir, pas de page à valider, pas de nom suspect. C'est pourquoi la protection ne peut pas être comportementale : elle consiste à ne pas laisser d'appareil inconnu sur son réseau, et à ne pas dépendre du réseau pour la confidentialité.",
    warningSigns: [
      "Appareils inconnus dans la liste des équipements connectés à votre box",
      "Avertissements de certificat répétés sur un réseau donné, et sur lui seul",
      "Lenteurs ou coupures régulières touchant plusieurs appareils du même réseau",
      "Sur un réseau partagé — colocation, espace de travail, hôtel — vous n'avez aucun moyen de savoir qui est présent",
      "Aucun signe visible, ce qui est le cas ordinaire",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "La vérification à votre portée porte sur la composition du réseau, pas sur l'attaque : ouvrez l'interface de votre box et identifiez chaque appareil connecté. Ce qui ne s'explique pas doit être retiré. Sur un réseau partagé que vous ne gérez pas, considérez la question comme indécidable et agissez en conséquence.",
    whatToDo:
      "Ne laissez pas d'appareil inconnu sur votre réseau : mot de passe Wi-Fi solide, réseau invité séparé pour les visiteurs et les objets connectés. Sur un réseau que vous ne gérez pas, ne comptez pas sur le réseau pour la confidentialité — les connexions chiffrées et, si nécessaire, un VPN font le travail que le réseau local ne peut pas faire.",
    whatToDoIfVictim:
      "Retirez du réseau l'appareil non identifié et changez le mot de passe du Wi-Fi ainsi que celui de l'interface d'administration de la box, souvent resté à sa valeur d'usine. Depuis un autre réseau, changez les mots de passe des services utilisés et fermez les sessions ouvertes. Si l'appareil intrus appartient au foyer, il est lui-même compromis : traitez-le comme tel avant de le rebrancher. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Rien ne change à l'écran : pas de réseau à choisir, pas de page à valider. Sur un réseau partagé, on fait confiance aux autres appareils sans savoir qui ils sont.",
    example: {
      setting: "Liste des appareils connectés à votre box, consultée après des avertissements de certificat répétés à la maison.",
      message:
        "Appareils connectés :\n• ordinateur-salon\n• telephone-marc\n• appareil-inconnu (connecté depuis 3 jours)",
      giveaways: [
        "Un appareil que personne ne reconnaît est présent depuis plusieurs jours.",
        "Les avertissements de certificat n'apparaissent que sur ce réseau.",
        "Le mot de passe du Wi-Fi a été donné à des invités.",
      ],
    },
    decisionChecklist: [
      {
        check: "La liste des appareils de la box contient-elle un équipement que personne n'explique ?",
        then: "Retirez-le du réseau et changez le mot de passe du Wi-Fi et celui de l'administration de la box.",
      },
      {
        check: "Des avertissements de certificat apparaissent-ils sur ce réseau, et sur lui seul ?",
        then: "N'y saisissez rien et utilisez le partage de connexion de votre téléphone.",
      },
      {
        check: "L'appareil intrus appartient-il au foyer ?",
        then: "Traitez-le comme compromis : remise à zéro et mise à jour avant de le rebrancher.",
      },
    ],
    prevention: [
      "Utilisez un mot de passe Wi-Fi solide et un réseau invité pour les visiteurs.",
      "Relisez de temps en temps la liste des appareils connectés à la box.",
      "Sur un réseau partagé, ne comptez pas sur le réseau pour la confidentialité.",
    ],
    relatedAttackCodes: [
      "NET-000001",
      "NET-000004",
      "NET-000005",
      "MOB-000010",
      "MAL-000008",
    ],
    faq: [
      {
        question: "Suis-je concerné chez moi ?",
        answer:
          "Seulement si un appareil indésirable est présent sur votre réseau — intrus connecté au Wi-Fi, ou équipement du foyer déjà compromis. C'est pour cette raison que la protection utile est en amont : un mot de passe Wi-Fi solide et un réseau invité séparé pour les objets connectés.",
      },
      {
        question: "Puis-je le détecter moi-même ?",
        answer:
          "Pas de façon fiable sans outillage technique, et ce n'est pas la bonne piste. La question à votre portée est plus simple et plus utile : qui est connecté à mon réseau ? Si vous pouvez répondre à celle-là, l'attaque n'a pas de point de départ.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "arp-spoofing",
        noSimulationReason:
          "Nothing is visible from the user's side: no network to choose, no page to accept. The protection consists of knowing who is present on your network, which is not a judgment call made under a message.",
        name: "ARP Spoofing",
        plainLanguageDefinition:
          "On a network you've already joined, a device impersonates the router to your own. Your traffic is handed to it before being forwarded on.",
        aliases: [
          "ARP spoofing",
          "ARP poisoning",
          "ARP cache poisoning",
          "local network impersonation",
        ],
        definition:
          "ARP spoofing is a technique by which a device already present on a local network impersonates the gateway — the router or box — to the other devices, so that their traffic passes through it. It requires prior access to the network, which sets it apart from a fake access point, where the third party supplies the network itself.",
        howItWorks:
          "On a local network, devices work out among themselves who holds which address through an exchange of questions and answers designed at a time when participants were assumed to be honest. This mechanism includes no identity check: a reply claiming 'I am the gateway' is accepted as such. A malicious device already present on the network can therefore place itself on the path without forcing anything, simply by answering. The consequences are those of any interception, with two particularities. The first is scope: this only works on the local network, so it requires the attacker to already be on it — a guest, a compromised device in the household, a neighboring workstation in a shared space. The second is invisibility: nothing changes from the user's point of view, there's no network to choose, no page to accept, no suspicious name. This is why the protection can't be behavioral: it consists of not leaving unknown devices on your network, and not relying on the network for confidentiality.",
        warningSigns: [
          "Unknown devices in the list of equipment connected to your router",
          "Repeated certificate warnings on one given network, and that one alone",
          "Recurring slowdowns or drops affecting several devices on the same network",
          "On a shared network — shared housing, workspace, hotel — you have no way of knowing who is present",
          "No visible sign at all, which is the ordinary case",
        ],
        howToVerify:
          "The check within your reach concerns the network's makeup, not the attack itself: open your router's admin interface and identify every connected device. Whatever can't be explained should be removed. On a shared network you don't manage, treat the question as undecidable and act accordingly.",
        whatToDo:
          "Don't leave unknown devices on your network: use a strong Wi-Fi password, and set up a separate guest network for visitors and connected objects. On a network you don't manage, don't rely on the network for confidentiality — encrypted connections and, if needed, a VPN do the work the local network can't.",
        whatToDoIfVictim:
          "Remove the unidentified device from the network and change both the Wi-Fi password and the router's admin password, which is often still at its factory default. From another network, change the passwords of the services used and close open sessions. If the intruding device belongs to the household, it is itself compromised: treat it as such before reconnecting it. Report the incident to the relevant authority.",
        faq: [
          {
            question: "Am I at risk at home?",
            answer:
              "Only if an unwanted device is present on your network — an intruder connected to the Wi-Fi, or a household device already compromised. That's why the useful protection happens upstream: a strong Wi-Fi password and a separate guest network for connected objects.",
          },
          {
            question: "Can I detect it myself?",
            answer:
              "Not reliably without technical tooling, and that's not the right angle anyway. The question within your reach is simpler and more useful: who is connected to my network? If you can answer that one, the attack has no starting point.",
          },
        ],
        whyItWorks:
          "Nothing changes on screen: no network to choose, no page to approve. On a shared network, you trust the other devices without knowing whose they are.",
        example: {
          setting: "List of devices connected to your router, checked after repeated certificate warnings at home.",
          message:
            "Connected devices:\n• living-room-computer\n• marc-phone\n• unknown-device (connected for 3 days)",
          giveaways: [
            "A device nobody recognizes has been there for several days.",
            "The certificate warnings only appear on this network.",
            "The Wi-Fi password was given to guests.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does your router's device list include equipment nobody can explain?",
            then: "Remove it from the network and change both the Wi-Fi password and the router's admin password.",
          },
          {
            check: "Do certificate warnings appear on this network, and only this one?",
            then: "Enter nothing there and use your phone's hotspot.",
          },
          {
            check: "Does the intruding device belong to the household?",
            then: "Treat it as compromised: reset and update it before reconnecting it.",
          },
        ],
        prevention: [
          "Use a strong Wi-Fi password and a guest network for visitors.",
          "Review the list of devices connected to your router from time to time.",
          "On a shared network, don't rely on the network for privacy.",
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
    code: "NET-000004",
    slug: "empoisonnement-dns",
    simulationSlug: "avertissement-certificat-site-habituel",
    name: "Empoisonnement DNS",
    categorySlug: "reseaux-et-wifi",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Vous tapez la bonne adresse et vous arrivez sur le mauvais serveur. Rien n'est faux dans ce que vous avez écrit : c'est l'annuaire qui a été altéré.",
    attackerObjective: "identifiants",
    aliases: [
      "DNS spoofing",
      "détournement DNS",
      "empoisonnement de cache DNS",
      "usurpation DNS",
    ],
    primaryVector: "web",
    primaryDimension: "network_trust_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "L'empoisonnement DNS consiste à altérer la traduction d'un nom de site en adresse de serveur, de sorte qu'une adresse correctement saisie mène à un serveur contrôlé par un tiers. Il se distingue du typosquatting, où c'est l'adresse elle-même qui diffère : ici l'adresse est la bonne, et c'est la destination qui a changé.",
    howItWorks:
      "Chaque fois que vous ouvrez un site, votre appareil demande à un service de traduction l'adresse du serveur correspondant. Cette réponse peut être altérée à plusieurs endroits : dans la box du foyer, si son administration est compromise ou si son réglage a été modifié ; sur le réseau local, par un appareil qui répond à la place du service ; ou par la configuration de l'appareil lui-même, un programme malveillant pouvant désigner un service de traduction contrôlé. C'est ce qui rend le procédé remarquable : l'adresse affichée reste exacte, ce que le lecteur a appris à vérifier ne révèle rien, et la page peut être une copie fidèle. Une protection subsiste toutefois, et c'est la seule sur laquelle il faut compter : le certificat. Un serveur imposteur ne peut pas présenter un certificat valide pour un nom qui ne lui appartient pas, et le navigateur affiche alors un avertissement. Ce qui explique une consigne autrement abstraite — ne jamais passer outre un tel avertissement — et pourquoi les procédés de cette famille cherchent souvent à faire installer un certificat sur l'appareil, ce qui supprime précisément ce garde-fou.",
    warningSigns: [
      "Avertissement de certificat sur un site que vous fréquentez habituellement sans problème",
      "Site connu dont l'apparence a changé, ou qui demande une reconnexion inattendue",
      "Redirections vers des pages publicitaires depuis plusieurs sites différents",
      "Le même site s'affiche normalement en connexion mobile mais pas sur votre réseau",
      "Serveurs DNS modifiés dans les réglages de votre box ou de votre appareil sans votre intervention",
    ],
    triggers: ["trust", "urgency"],
    indicators: [],
    howToVerify:
      "Comparez deux réseaux : ouvrez le site en question via le partage de connexion de votre téléphone. Si le problème disparaît, il vient du réseau ou de la box, non du site. Vérifiez ensuite les serveurs DNS configurés dans l'interface de votre box : une valeur que vous n'avez pas choisie est un signal net.",
    whatToDo:
      "Changez le mot de passe d'administration de votre box — souvent resté à sa valeur d'usine — et maintenez son logiciel à jour, la modification de ses réglages étant la voie la plus courante. N'installez jamais un certificat demandé par un site ou un réseau. Ne passez outre aucun avertissement de certificat, c'est la protection qui reste debout quand tout le reste a été trompé.",
    whatToDoIfVictim:
      "Rétablissez les réglages réseau de la box, changez son mot de passe d'administration et mettez-la à jour. Depuis un autre réseau, changez les identifiants saisis pendant la période concernée et fermez les sessions ouvertes. Vérifiez qu'aucun certificat inconnu n'a été ajouté à vos appareils. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "L'adresse affichée est exacte : la vérification que l'on a appris à faire ne révèle rien. Il ne reste que l'avertissement de certificat, et l'habitude de cliquer pour passer outre.",
    example: {
      setting: "Votre site de banque, ouvert depuis votre favori, sur le Wi-Fi de la maison.",
      message:
        "Votre connexion n'est pas privée\nLe site banque-exemple.test pourrait tenter de dérober vos informations.\n[Retour] [Paramètres avancés]",
      giveaways: [
        "L'adresse est la bonne, mais le certificat ne correspond pas.",
        "Le site s'ouvre normalement sur la connexion mobile du téléphone.",
        "L'avertissement apparaît sur un site habituel, sans raison connue.",
      ],
    },
    decisionChecklist: [
      {
        check: "Un avertissement de certificat apparaît-il sur un site que vous utilisez sans problème d'habitude ?",
        then: "Ne passez pas outre. Revenez en arrière.",
      },
      {
        check: "Le site s'ouvre-t-il normalement sur la connexion mobile du téléphone ?",
        then: "Le problème vient de votre réseau : vérifiez les serveurs DNS dans l'interface de la box.",
      },
      {
        check: "Avez-vous saisi des identifiants malgré l'avertissement ?",
        then: "Depuis un autre réseau, changez ces mots de passe et déconnectez les sessions.",
      },
    ],
    prevention: [
      "Ne passez jamais outre un avertissement de certificat.",
      "Changez le mot de passe d'administration de la box et gardez-la à jour.",
      "N'installez jamais un certificat demandé par un site ou un réseau.",
    ],
    relatedAttackCodes: [
      "NET-000001",
      "NET-000003",
      "MOB-000010",
      "WEB-000003",
      "IDN-000001",
      "WEB-000007",
    ],
    faq: [
      {
        question: "L'adresse est correcte, comment le site peut-il être faux ?",
        answer:
          "Parce que le nom et la destination sont deux choses distinctes. Le nom est traduit en adresse de serveur par un annuaire, et c'est cette traduction qui est altérée. C'est ce qui rend ce procédé différent de tous ceux où il suffit de bien lire l'adresse : ici, bien lire ne suffit pas.",
      },
      {
        question: "Que reste-t-il pour se protéger, alors ?",
        answer:
          "Le certificat. Un serveur imposteur ne peut pas en présenter un valide pour un nom qui n'est pas le sien, et l'avertissement du navigateur est donc le dernier garde-fou effectif. C'est la raison concrète pour laquelle il ne faut jamais le contourner, et pour laquelle on cherche parfois à vous faire installer un certificat : cela revient à le désarmer.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "dns-poisoning",
        simulationSlug: "certificate-warning-usual-site",
        name: "DNS Poisoning",
        plainLanguageDefinition:
          "You type the correct address and land on the wrong server. Nothing about what you typed is wrong — it's the directory that has been tampered with.",
        aliases: [
          "DNS spoofing",
          "DNS hijacking",
          "DNS cache poisoning",
          "DNS spoofing attack",
        ],
        definition:
          "DNS poisoning consists of tampering with the translation of a site name into a server address, so that a correctly typed address leads to a server controlled by a third party. It differs from typosquatting, where it is the address itself that differs: here the address is correct, and it's the destination that has changed.",
        howItWorks:
          "Every time you open a site, your device asks a translation service for the address of the corresponding server. That reply can be tampered with at several points: in the household's router, if its administration is compromised or its settings have been changed; on the local network, by a device answering in place of the service; or through the device's own configuration, since malicious software can point it to a controlled translation service. This is what makes the technique remarkable: the displayed address stays exact, what a reader has learned to check reveals nothing, and the page can be a faithful copy. One protection nonetheless remains, and it is the only one worth counting on: the certificate. An impostor server cannot present a valid certificate for a name it doesn't own, and the browser then shows a warning. This explains an otherwise abstract instruction — never bypass such a warning — and why techniques in this family often try to get a certificate installed on the device, which removes precisely that safeguard.",
        warningSigns: [
          "Certificate warning on a site you normally visit without any problem",
          "Familiar site whose appearance has changed, or asking for an unexpected reconnection",
          "Redirects to advertising pages from several different sites",
          "The same site displays normally over mobile data but not on your network",
          "DNS servers changed in your router's or device's settings without your involvement",
        ],
        howToVerify:
          "Compare two networks: open the site in question through your phone's mobile hotspot. If the problem disappears, it comes from the network or the router, not the site. Then check the DNS servers configured in your router's interface: a value you didn't choose is a clear signal.",
        whatToDo:
          "Change your router's admin password — often still at its factory default — and keep its firmware up to date, since changing its settings is the most common route in. Never install a certificate requested by a site or a network. Never bypass a certificate warning; it's the protection still standing once everything else has been fooled.",
        whatToDoIfVictim:
          "Restore the router's network settings, change its admin password, and update it. From another network, change the credentials entered during the period concerned and close open sessions. Check that no unknown certificate has been added to your devices. Report the incident to the relevant authority.",
        faq: [
          {
            question: "The address is correct — how can the site be fake?",
            answer:
              "Because the name and the destination are two different things. The name is translated into a server address by a directory, and it's that translation that's been tampered with. This is what makes this technique different from every case where simply reading the address carefully is enough: here, reading carefully isn't enough.",
          },
          {
            question: "What's left to protect yourself, then?",
            answer:
              "The certificate. An impostor server cannot present a valid one for a name that isn't its own, so the browser's warning is the last effective safeguard. That's the concrete reason it should never be bypassed, and why you're sometimes pushed to install a certificate: doing so disarms it.",
          },
        ],
        whyItWorks:
          "The address displayed is correct: the check you learned to do reveals nothing. All that's left is the certificate warning, and the habit of clicking through it.",
        example: {
          setting: "Your bank's site, opened from your bookmark, on your home Wi-Fi.",
          message:
            "Your connection is not private\nThe site banque-exemple.test may be trying to steal your information.\n[Back] [Advanced]",
          giveaways: [
            "The address is right, but the certificate doesn't match.",
            "The site opens normally on your phone's mobile connection.",
            "The warning appears on a site you use regularly, with no known reason.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does a certificate warning appear on a site you normally use without any problem?",
            then: "Don't click through. Go back.",
          },
          {
            check: "Does the site open normally on your phone's mobile connection?",
            then: "The problem is on your network: check the DNS servers in your router's interface.",
          },
          {
            check: "Did you enter credentials despite the warning?",
            then: "From another network, change those passwords and sign out of sessions.",
          },
        ],
        prevention: [
          "Never click through a certificate warning.",
          "Change your router's admin password and keep it up to date.",
          "Never install a certificate requested by a site or a network.",
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
    code: "NET-000005",
    slug: "interception-de-trafic",
    noSimulationReason:
      "L'écoute passive est indétectable depuis l'appareil observé, et la fiche le dit explicitement. Un exercice de reconnaissance contredirait son propre contenu.",
    name: "Interception de trafic",
    categorySlug: "reseaux-et-wifi",
    editorialStatus: "published",
    plainLanguageDefinition:
      "L'écoute de ce qui passe sur un réseau, sans rien modifier. Ce que l'on peut en tirer dépend entièrement du chiffrement — beaucoup moins qu'on ne l'imagine, et plus qu'on ne le voudrait.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "sniffing",
      "écoute réseau",
      "capture de trafic",
      "espionnage réseau",
    ],
    primaryVector: "web",
    primaryDimension: "network_trust_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "L'interception de trafic est l'observation passive des données circulant sur un réseau par un tiers en mesure de les voir passer. Elle ne modifie rien et ne laisse aucune trace chez la personne observée, ce qui la rend indétectable de son côté — cette fiche explique donc surtout ce qu'elle permet réellement, et ce que le chiffrement protège.",
    howItWorks:
      "Pour observer, il faut être sur le trajet : fournir le réseau, être présent sur le réseau local, ou administrer un équipement traversé. Ce que l'observation livre dépend alors du chiffrement, et la distinction est ce qu'il faut retenir. Avec une connexion chiffrée de bout en bout — le cas de la quasi-totalité des sites aujourd'hui — l'observateur voit vers quels services vous vous connectez, à quels moments et pour quels volumes, mais pas le contenu échangé : ni le mot de passe saisi, ni la page consultée, ni le message envoyé. Ce n'est pas rien : la liste des services que vous utilisez est en elle-même une information, parfois sensible. Sans chiffrement, il voit tout, et l'ancienne image de mots de passe lus en clair sur un réseau public correspond à cette situation, devenue marginale sur le web. Le risque s'est donc déplacé plutôt que supprimé : il porte aujourd'hui sur les métadonnées, sur les applications anciennes ou mal conçues qui n'utilisent pas de connexion chiffrée, et sur les manœuvres visant à faire tomber ce chiffrement — installation d'un certificat, page de connexion réclamant une saisie.",
    warningSigns: [
      "Aucun signe : l'observation passive est indétectable depuis l'appareil observé",
      "Application affichant un avertissement de connexion non sécurisée",
      "Réseau qui demande l'installation d'un profil ou d'un certificat avant de donner l'accès",
      "Site habituellement en connexion sécurisée qui s'affiche sans, sur ce réseau uniquement",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Il n'y a rien à vérifier du côté de l'observation, et prétendre le contraire serait trompeur. Ce qui se vérifie est votre propre exposition : vos connexions sont-elles chiffrées, avez-vous installé un certificat demandé par un réseau, une application ancienne transmet-elle encore en clair. C'est là que se joue la différence entre voir vos destinations et voir vos données.",
    whatToDo:
      "Utilisez des services et des applications qui chiffrent leurs connexions, et tenez-les à jour. N'installez aucun certificat ni profil réseau demandé pour « accéder à internet ». Sur un réseau que vous ne maîtrisez pas, un VPN masque vos destinations à l'observateur local — en les révélant à son fournisseur, ce qui est un arbitrage à faire en connaissance de cause, pas une solution automatique.",
    whatToDoIfVictim:
      "Retirez tout certificat ou profil installé à la demande d'un réseau. Depuis une connexion de confiance, changez les mots de passe des services utilisés pendant la période concernée, en commençant par ceux dont vous savez que l'application n'était pas chiffrée. Fermez les sessions ouvertes. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "On imagine que tout est lisible sur un Wi-Fi public, ou au contraire que rien ne l'est. La réalité se joue sur le chiffrement, et l'attaque cherche justement à vous faire accepter ce qui le fait tomber.",
    example: {
      setting: "Wi-Fi d'un hôtel, juste après la connexion.",
      message:
        "Pour sécuriser votre navigation, installez le profil de configuration du réseau.\n[Installer le profil]",
      giveaways: [
        "Un accès Wi-Fi n'a besoin d'aucun profil ni certificat.",
        "Ce profil permettrait d'observer des connexions jusque-là chiffrées.",
        "La demande arrive au moment où vous voulez juste vous connecter.",
      ],
    },
    decisionChecklist: [
      {
        check: "Un réseau vous demande-t-il d'installer un profil ou un certificat ?",
        then: "Refusez et utilisez le partage de connexion de votre téléphone.",
      },
      {
        check: "Une application affiche-t-elle un avertissement de connexion non sécurisée sur ce réseau ?",
        then: "N'y saisissez rien et changez de réseau.",
      },
      {
        check: "Avez-vous installé un profil ou un certificat à la demande d'un réseau ?",
        then: "Retirez-le dans les réglages, puis changez vos mots de passe depuis une connexion de confiance.",
      },
    ],
    prevention: [
      "N'installez jamais de profil ou de certificat pour accéder à internet.",
      "Utilisez des applications à jour, qui chiffrent leurs connexions.",
      "Sur un réseau que vous ne maîtrisez pas, préférez le partage de connexion.",
    ],
    relatedAttackCodes: [
      "NET-000001",
      "NET-000002",
      "NET-000003",
      "ACCT-000008",
      "NET-000007",
    ],
    faq: [
      {
        question: "Peut-on lire mes mots de passe sur un Wi-Fi public ?",
        answer:
          "Pas sur un site dont la connexion est chiffrée, ce qui est aujourd'hui la norme : l'intermédiaire voit la destination, pas ce qui est échangé. L'image des mots de passe lus en clair correspond à des connexions non chiffrées, devenues rares sur le web. Les vrais points d'attention sont ailleurs : une page d'accès au réseau qui vous fait saisir un identifiant, un certificat que l'on vous fait installer, une vieille application qui transmet sans chiffrement.",
      },
      {
        question: "Que voit exactement l'observateur, alors ?",
        answer:
          "Les services que vous contactez, quand et combien de données transitent. C'est déjà une information personnelle — la liste des sites consultés peut être sensible en elle-même — mais ce n'est pas le contenu de vos échanges.",
      },
      {
        question: "Faut-il un VPN sur un réseau public ?",
        answer:
          "C'est utile si vous voulez que le réseau local ne voie pas vos destinations. Sachez toutefois ce que vous faites : vous transférez cette visibilité au fournisseur du VPN. La question n'est donc pas d'en utiliser un, mais de savoir à qui vous préférez accorder cette confiance.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "network-traffic-interception",
        noSimulationReason:
          "Passive eavesdropping is undetectable from the observed device, and the entry says so explicitly. A recognition exercise would contradict its own content.",
        name: "Network Traffic Interception",
        plainLanguageDefinition:
          "Listening in on what passes over a network, without changing anything. What can be gained from it depends entirely on encryption — much less than people imagine, and more than one would like.",
        aliases: ["sniffing", "network eavesdropping", "traffic capture", "network spying"],
        definition:
          "Traffic interception is the passive observation of data traveling over a network by a third party able to see it pass by. It changes nothing and leaves no trace for the person being observed, which makes it undetectable from their side — this entry therefore mainly explains what it actually allows, and what encryption protects.",
        howItWorks:
          "To observe, you have to be on the path: providing the network, being present on the local network, or administering a piece of equipment the traffic crosses. What the observation yields then depends on encryption, and that distinction is the key thing to remember. With an end-to-end encrypted connection — the case for nearly all sites today — the observer sees which services you connect to, at what times and in what volumes, but not the content exchanged: not the password typed, not the page viewed, not the message sent. That's not nothing: the list of services you use is itself information, sometimes sensitive. Without encryption, it sees everything, and the old image of passwords read in the clear on a public network corresponds to that situation, now marginal on the web. The risk has therefore shifted rather than disappeared: today it bears on metadata, on old or poorly designed apps that don't use an encrypted connection, and on maneuvers aimed at bringing that encryption down — installing a certificate, a login page demanding you type something in.",
        warningSigns: [
          "No sign at all: passive observation is undetectable from the observed device",
          "App displaying an unsecured-connection warning",
          "Network requiring you to install a profile or certificate before granting access",
          "Site normally on a secure connection displaying without one, on this network only",
        ],
        howToVerify:
          "There is nothing to check on the observation side, and claiming otherwise would be misleading. What can be checked is your own exposure: are your connections encrypted, have you installed a certificate requested by a network, does an old app still transmit in the clear. That's where the difference between seeing your destinations and seeing your data plays out.",
        whatToDo:
          "Use services and apps that encrypt their connections, and keep them up to date. Don't install any certificate or network profile requested to 'access the internet.' On a network you don't control, a VPN hides your destinations from the local observer — while revealing them to its own provider, which is a trade-off to make knowingly, not an automatic fix.",
        whatToDoIfVictim:
          "Remove any certificate or profile installed at a network's request. From a trusted connection, change the passwords of services used during the period concerned, starting with those you know weren't running over an encrypted app. Close open sessions. Report the incident to the relevant authority.",
        faq: [
          {
            question: "Can someone read my passwords on public Wi-Fi?",
            answer:
              "Not on a site whose connection is encrypted, which is the norm today: the intermediary sees the destination, not what's exchanged. The image of passwords read in the clear corresponds to unencrypted connections, which have become rare on the web. The real points of attention lie elsewhere: a network login page that gets you to type a credential, a certificate you're pushed to install, an old app that transmits without encryption.",
          },
          {
            question: "So what exactly does the observer see?",
            answer:
              "Which services you contact, when, and how much data goes through. That's already personal information — the list of sites you visit can be sensitive in itself — but it isn't the content of your exchanges.",
          },
          {
            question: "Do I need a VPN on a public network?",
            answer:
              "It's useful if you want the local network not to see your destinations. Just know what you're doing, though: you're transferring that visibility to the VPN provider. The question isn't whether to use one, but who you'd rather grant that trust to.",
          },
        ],
        whyItWorks:
          "People imagine that everything is readable on public Wi-Fi, or on the contrary that nothing is. The reality depends on encryption, and the attack tries precisely to get you to accept what breaks it.",
        example: {
          setting: "A hotel's Wi-Fi, right after connecting.",
          message:
            "To secure your browsing, install the network configuration profile.\n[Install profile]",
          giveaways: [
            "Wi-Fi access doesn't need any profile or certificate.",
            "This profile would make it possible to observe connections that were encrypted until now.",
            "The request comes just when you only want to get online.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is a network asking you to install a profile or a certificate?",
            then: "Refuse and use your phone's hotspot.",
          },
          {
            check: "Is an app showing an insecure connection warning on this network?",
            then: "Enter nothing there and switch networks.",
          },
          {
            check: "Did you install a profile or certificate at a network's request?",
            then: "Remove it in the settings, then change your passwords from a trusted connection.",
          },
        ],
        prevention: [
          "Never install a profile or certificate to get internet access.",
          "Use up-to-date apps that encrypt their connections.",
          "On a network you don't control, prefer your phone's hotspot.",
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
    code: "NET-000006",
    slug: "deni-de-service",
    noSimulationReason:
      "Un particulier n'en est presque jamais la cible mais parfois l'un des moyens, sans rien recevoir. Il n'y a pas de message à juger.",
    name: "Déni de service",
    categorySlug: "reseaux-et-wifi",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un service est submergé de demandes jusqu'à ne plus répondre. Rien n'est volé et rien n'est modifié : c'est la disponibilité qui est visée.",
    attackerObjective: "controle_d_un_appareil",
    aliases: [
      "DDoS",
      "attaque par déni de service",
      "DoS",
      "saturation de service",
    ],
    primaryVector: "web",
    primaryDimension: "network_trust_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un déni de service consiste à rendre un service indisponible en le saturant de requêtes ou en épuisant ses ressources. Il se distingue de tout le reste de ce catalogue par son objectif : ni données ni comptes, mais l'interruption. Lorsque la saturation provient de nombreux appareils à la fois, on parle d'attaque distribuée.",
    howItWorks:
      "La forme distribuée est la plus courante, et elle mobilise des appareils compromis un peu partout — souvent des objets connectés enrôlés à leur insu, que leurs propriétaires ne surveillent pas. C'est le point qui concerne directement un lecteur particulier : dans la grande majorité des cas, vous n'êtes pas la cible d'un déni de service, vous en êtes potentiellement un des moyens. Les motivations, du côté des cibles, vont de la pression économique à la revendication ; il arrive aussi que la saturation serve de diversion pendant qu'autre chose se produit ailleurs. À l'échelle d'un particulier, l'effet visible est indirect : un service que vous utilisez devient inaccessible pendant quelques heures. Une ligne domestique peut être visée directement, mais c'est un cas nettement moins fréquent que ce que la notoriété du terme laisse croire.",
    warningSigns: [
      "Service en ligne inaccessible ou très lent, pour vous comme pour d'autres au même moment",
      "Communication de l'éditeur signalant un incident de disponibilité",
      "Votre propre connexion saturée sans usage qui l'explique, plusieurs appareils touchés",
      "Signalement de votre fournisseur d'accès concernant du trafic sortant anormal — vous êtes alors du côté des moyens, pas des cibles",
    ],
    triggers: ["urgency"],
    indicators: [],
    howToVerify:
      "Vérifiez d'abord si l'indisponibilité vous est propre : essayez depuis une connexion mobile, et regardez si d'autres utilisateurs constatent la même chose. Un service inaccessible pour tout le monde relève de l'éditeur, et vous n'avez rien à y faire. Une saturation limitée à votre ligne mérite en revanche d'examiner vos propres appareils.",
    whatToDo:
      "Ce que vous pouvez faire porte sur votre contribution éventuelle, et c'est loin d'être négligeable : changez les mots de passe d'usine de tout ce qui est connecté, activez les mises à jour automatiques, désactivez l'accès à distance des équipements qui n'en ont pas besoin, et retirez du réseau ceux qui ne sont plus mis à jour. Ce sont ces appareils qui composent les réseaux utilisés pour ces attaques.",
    whatToDoIfVictim:
      "Si un service que vous utilisez est indisponible, il n'y a rien à faire de votre côté sinon attendre et vous méfier des messages profitant de l'incident — une panne visible est une occasion classique de faux messages de « rétablissement de compte ». Si votre propre ligne est visée ou si votre fournisseur d'accès vous signale un trafic anormal, contactez-le : lui seul peut agir en amont. Identifiez ensuite l'appareil en cause, remettez-le en configuration d'usine et mettez-le à jour. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Pour un particulier, le déni de service paraît lointain, et il l'est le plus souvent : le vrai lien est l'objet connecté oublié qui participe sans qu'on le sache. Une panne visible est aussi une occasion de faux messages.",
    example: {
      setting: "Votre service de messagerie est inaccessible depuis le matin. Un SMS arrive.",
      message:
        "Suite à l'incident de ce matin, votre compte doit être réactivé. Confirmez vos identifiants : retablissement-compte.example-not-real.test",
      giveaways: [
        "La panne est réelle, mais elle ne demande aucune action de votre part.",
        "Le lien ne mène pas au site du service.",
        "Le message profite de l'actualité pour paraître légitime.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le service est-il indisponible pour tout le monde, y compris sur votre connexion mobile ?",
        then: "C'est un incident chez l'éditeur : attendez, il n'y a rien à faire de votre côté.",
      },
      {
        check: "Recevez-vous un message qui vous demande d'agir à cause de la panne ?",
        then: "Ignorez-le et passez par le site ou l'application officielle une fois le service rétabli.",
      },
      {
        check: "Votre fournisseur d'accès vous signale-t-il un trafic anormal depuis votre ligne ?",
        then: "Identifiez l'appareil en cause dans la box, remettez-le en configuration d'usine et mettez-le à jour.",
      },
    ],
    prevention: [
      "Changez les mots de passe d'usine des objets connectés.",
      "Activez les mises à jour automatiques et retirez du réseau ce qui n'est plus mis à jour.",
      "Pendant une panne, méfiez-vous des messages de rétablissement de compte.",
    ],
    relatedAttackCodes: [
      "MAL-000008",
      "MOB-000005",
      "MOB-000010",
      "MAL-000006",
      "NET-000008",
    ],
    faq: [
      {
        question: "Suis-je une cible probable ?",
        answer:
          "Rarement en tant que particulier. Ce qui vous concerne réellement est l'autre bout : vos objets connectés peuvent être enrôlés pour participer à ces attaques, sans que rien ne vous alerte. C'est pourquoi les mesures utiles de cette fiche portent sur vos propres équipements.",
      },
      {
        question: "Un service que j'utilise est en panne. Que faire ?",
        answer:
          "Attendre, et rester attentif à ce qui arrive pendant l'incident : les périodes d'indisponibilité connue sont propices aux faux messages annonçant un rétablissement ou demandant une reconnexion. Rejoignez toujours le service par vos propres moyens plutôt que par un lien reçu.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "denial-of-service-attack",
        noSimulationReason:
          "An individual is almost never the target, but is sometimes one of the means, without receiving anything at all. There's no message to judge.",
        name: "Denial of Service",
        plainLanguageDefinition:
          "A service is overwhelmed with requests until it stops responding. Nothing is stolen and nothing is altered: it's availability that's being targeted.",
        aliases: ["DDoS", "denial-of-service attack", "DoS", "service flooding"],
        definition:
          "A denial-of-service attack consists of making a service unavailable by flooding it with requests or exhausting its resources. It differs from everything else in this catalogue in its goal: neither data nor accounts, but interruption. When the flooding comes from many devices at once, it's called a distributed attack.",
        howItWorks:
          "The distributed form is the most common, and it mobilizes compromised devices scattered widely — often connected objects enrolled without their owners' knowledge, left unmonitored. This is the point that directly concerns an individual reader: in the vast majority of cases, you are not the target of a denial-of-service attack, you are potentially one of its means. Motivations, on the target side, range from economic pressure to activism; sometimes the flooding also serves as a diversion while something else happens elsewhere. At an individual's scale, the visible effect is indirect: a service you use becomes unreachable for a few hours. A home internet line can be targeted directly, but that's a markedly less frequent case than the term's notoriety suggests.",
        warningSigns: [
          "Online service unreachable or very slow, for you as for others at the same time",
          "Announcement from the provider reporting an availability incident",
          "Your own connection saturated with no usage explaining it, several devices affected",
          "Notice from your internet provider about abnormal outbound traffic — in that case you're on the side of the means, not the targets",
        ],
        howToVerify:
          "First check whether the unavailability is specific to you: try it over mobile data, and see if other users report the same thing. A service unreachable for everyone is the provider's problem, and there's nothing for you to do about it. Saturation limited to your own line, on the other hand, is worth examining your own devices for.",
        whatToDo:
          "What you can act on is your possible contribution, and it's far from negligible: change the factory passwords of everything connected, enable automatic updates, disable remote access on equipment that doesn't need it, and remove from the network anything no longer receiving updates. These are the devices that make up the networks used for these attacks.",
        whatToDoIfVictim:
          "If a service you use is unavailable, there's nothing to do on your end except wait, and be wary of messages exploiting the incident — a visible outage is a classic opportunity for fake 'account restoration' messages. If your own line is targeted, or your internet provider flags abnormal traffic, contact them: only they can act upstream. Then identify the device responsible, reset it to factory settings, and update it. Report the incident to the relevant authority.",
        faq: [
          {
            question: "Am I a likely target?",
            answer:
              "Rarely, as an individual. What really concerns you is the other end: your connected objects can be enrolled to take part in these attacks, without anything alerting you. That's why the useful measures in this entry focus on your own equipment.",
          },
          {
            question: "A service I use is down. What should I do?",
            answer:
              "Wait, and stay alert to what happens during the incident: known outage periods are prime opportunities for fake messages announcing a restoration or asking you to reconnect. Always reach the service through your own means rather than through a received link.",
          },
        ],
        whyItWorks:
          "For an individual, denial of service seems remote, and it usually is: the real link is the forgotten connected device that takes part without anyone knowing. A visible outage is also an opportunity for fake messages.",
        example: {
          setting: "Your email service has been unavailable since this morning. A text arrives.",
          message:
            "Following this morning's incident, your account must be reactivated. Confirm your credentials: retablissement-compte.example-not-real.test",
          giveaways: [
            "The outage is real, but it requires no action from you.",
            "The link doesn't lead to the service's site.",
            "The message uses the news to look legitimate.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the service unavailable for everyone, including on your mobile connection?",
            then: "It's an incident on the provider's side: wait, there's nothing to do on yours.",
          },
          {
            check: "Are you receiving a message asking you to act because of the outage?",
            then: "Ignore it and use the official site or app once the service is back.",
          },
          {
            check: "Is your internet provider reporting abnormal traffic from your line?",
            then: "Find the device responsible in your router, reset it to factory settings and update it.",
          },
        ],
        prevention: [
          "Change the factory passwords of connected devices.",
          "Turn on automatic updates and remove from the network anything that no longer gets updates.",
          "During an outage, be wary of account-recovery messages.",
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
    code: "NET-000007",
    slug: "portail-captif-malveillant",
    simulationSlug: "portail-wifi-hotel-carte-bancaire",
    name: "Portail captif malveillant",
    categorySlug: "reseaux-et-wifi",
    editorialStatus: "published",
    plainLanguageDefinition:
      "La page « connectez-vous pour accéder au Wi-Fi » qui demande bien plus qu'un accès au Wi-Fi : votre adresse électronique avec son mot de passe, une carte bancaire, ou l'installation d'un fichier.",
    attackerObjective: "identifiants",
    aliases: [
      "portail captif",
      "page de connexion wifi frauduleuse",
      "captive portal",
      "fausse page d'accès wifi",
    ],
    primaryVector: "web",
    primaryDimension: "phishing_recognition",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un portail captif est la page d'accès qui s'ouvre automatiquement lorsqu'on rejoint certains réseaux publics. Sa version malveillante en reprend l'apparence pour obtenir des identifiants, un paiement ou l'installation d'un composant. C'est l'endroit où un faux point d'accès produit le plus souvent son effet, et le mécanisme est celui de l'hameçonnage — dans un contexte où l'on s'attend précisément à voir une page de connexion.",
    howItWorks:
      "Le contexte fait tout le travail. Vous venez de choisir un réseau, une page s'ouvre d'elle-même, elle porte le nom du lieu : la séquence est celle que vous attendez, et l'attente désarme l'examen. Le prétexte de la demande est ensuite calibré sur cette attente — « connectez-vous avec votre adresse électronique », « vérifiez votre identité », « une caution d'un euro sera débitée puis remboursée », « installez ce profil pour sécuriser votre connexion ». Chacune de ces demandes vise autre chose que l'accès : un couple adresse et mot de passe réutilisable ailleurs, un numéro de carte, ou un certificat qui permettra d'observer des connexions jusque-là protégées. La règle qui tranche est simple et tient en une phrase : un accès Wi-Fi n'a besoin ni du mot de passe de votre messagerie, ni de votre carte bancaire, ni d'installer quoi que ce soit sur votre appareil.",
    warningSigns: [
      "Page demandant une adresse électronique accompagnée de son mot de passe",
      "Demande de carte bancaire pour un accès annoncé comme gratuit, ou pour une « caution » remboursée",
      "Invitation à installer un profil, un certificat ou une application pour accéder au réseau",
      "Bouton « se connecter avec » un compte de réseau social ou de messagerie",
      "Page mal traduite, adresse sans rapport avec l'établissement, ou absence de connexion sécurisée",
      "Portail qui réapparaît en boucle et redemande les informations déjà saisies",
    ],
    triggers: ["urgency", "trust", "reward"],
    indicators: [],
    howToVerify:
      "Rapportez la demande à ce qu'elle prétend servir : donner accès à un réseau ne nécessite ni mot de passe de messagerie, ni moyen de paiement, ni installation. Regardez l'adresse de la page et la présence d'une connexion sécurisée. En cas de doute, demandez au personnel comment se fait l'accès chez eux — c'est la vérification décisive, et elle est immédiate.",
    whatToDo:
      "Ne saisissez jamais dans un portail captif un identifiant qui vous sert ailleurs. N'y payez rien et n'y installez rien. Si l'accès exige l'une de ces trois choses, renoncez au réseau et utilisez le partage de connexion de votre téléphone.",
    whatToDoIfVictim:
      "Depuis un autre réseau, changez immédiatement le mot de passe saisi et celui de tous les comptes qui le réutilisent, en commençant par la messagerie, puis fermez les sessions ouvertes. Si vous avez communiqué une carte bancaire, contactez votre banque et faites opposition — une « caution d'un euro » sert à valider le numéro pour des débits ultérieurs. Si vous avez installé un profil ou un certificat, retirez-le dans les réglages de l'appareil. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Vous venez de choisir le réseau, une page s'ouvre d'elle-même avec le nom du lieu : c'est exactement la séquence attendue. Pressé de vous connecter, vous remplissez sans vous demander pourquoi cette page a besoin de ces informations.",
    example: {
      setting: "Page ouverte après la connexion au Wi-Fi d'un hôtel.",
      message:
        "Bienvenue à l'hôtel. Pour activer votre accès gratuit, une caution de 1 € sera débitée puis remboursée. Numéro de carte, date d'expiration, cryptogramme.",
      giveaways: [
        "Un accès annoncé comme gratuit demande une carte.",
        "La caution d'un euro sert à valider la carte pour des débits ultérieurs.",
        "La réception de l'hôtel peut vous dire comment l'accès se fait réellement.",
      ],
    },
    decisionChecklist: [
      {
        check: "La page demande-t-elle une carte bancaire, le mot de passe de votre messagerie ou l'installation d'un fichier ?",
        then: "Fermez-la : aucun accès Wi-Fi n'en a besoin. Demandez à l'accueil comment se connecter.",
      },
      {
        check: "L'adresse de la page est-elle sans rapport avec l'établissement ?",
        then: "Déconnectez-vous du réseau.",
      },
      {
        check: "Avez-vous saisi une carte ou un mot de passe ?",
        then: "Faites opposition sur la carte, et changez le mot de passe depuis un autre réseau.",
      },
    ],
    prevention: [
      "Ne saisissez jamais dans une page d'accès Wi-Fi un identifiant qui vous sert ailleurs.",
      "N'y payez rien et n'y installez rien.",
      "Si l'accès l'exige, préférez le partage de connexion de votre téléphone.",
    ],
    relatedAttackCodes: [
      "NET-000002",
      "PHISH-000001",
      "NET-000001",
      "NET-000005",
      "WEB-000003",
      "NET-000008",
    ],
    faq: [
      {
        question:
          "Certains vrais réseaux demandent bien une adresse électronique. Comment faire la différence ?",
        answer:
          "Une adresse seule, oui, cela se pratique. Le mot de passe qui va avec, jamais : un établissement n'a aucun usage de vos identifiants de messagerie, et aucun accès Wi-Fi n'en a besoin techniquement. C'est la présence du mot de passe, pas celle de l'adresse, qui tranche.",
      },
      {
        question: "Et la caution d'un euro qui doit être remboursée ?",
        answer:
          "C'est un motif classique pour obtenir un numéro de carte valide. Le montant faible sert à rendre la demande acceptable ; ce qui est recherché est le numéro, utilisable ensuite pour de tout autres montants. Un accès Wi-Fi gratuit ne demande pas de carte bancaire.",
      },
    ],
    references: [REF.phishing, REF.cybermalveillance],
    translations: {
      en: {
        slug: "malicious-captive-portal",
        simulationSlug: "hotel-wifi-portal-card",
        name: "Malicious Captive Portal",
        plainLanguageDefinition:
          "The 'log in to access Wi-Fi' page that asks for far more than Wi-Fi access: your email address with its password, a bank card, or the installation of a file.",
        aliases: [
          "captive portal",
          "fraudulent Wi-Fi login page",
          "captive portal attack",
          "fake Wi-Fi access page",
        ],
        definition:
          "A captive portal is the access page that opens automatically when joining certain public networks. Its malicious version reuses that appearance to obtain credentials, a payment, or the installation of a component. It's the point where a fake access point most often produces its effect, and the mechanism is that of phishing — in a context where you specifically expect to see a login page.",
        howItWorks:
          "The context does all the work. You've just chosen a network, a page opens on its own, it carries the venue's name: the sequence is the one you expect, and that expectation disarms scrutiny. The pretext for the request is then calibrated to that expectation — 'log in with your email address,' 'verify your identity,' 'a one-euro deposit will be charged then refunded,' 'install this profile to secure your connection.' Each of these requests aims at something other than access: an email-and-password pair reusable elsewhere, a card number, or a certificate that will allow connections that were previously protected to be observed. The rule that settles it is simple and fits in one sentence: Wi-Fi access needs neither your email password, nor your bank card, nor the installation of anything on your device.",
        warningSigns: [
          "Page asking for an email address along with its password",
          "Request for a bank card for access advertised as free, or for a 'deposit' to be refunded",
          "Invitation to install a profile, certificate, or app to access the network",
          "'Log in with' button for a social media or email account",
          "Poorly translated page, address unrelated to the venue, or absence of a secure connection",
          "Portal that reappears in a loop and asks again for information already entered",
        ],
        howToVerify:
          "Weigh the request against what it's supposed to serve: granting access to a network needs neither an email password, nor a means of payment, nor any installation. Check the page's address and whether the connection is secure. If in doubt, ask staff how access works there — that's the decisive check, and it's instant.",
        whatToDo:
          "Never enter a credential you use elsewhere into a captive portal. Don't pay anything there and don't install anything. If access requires any of these three things, give up on the network and use your phone's mobile hotspot instead.",
        whatToDoIfVictim:
          "From another network, immediately change the password entered and that of every account reusing it, starting with your email, then close open sessions. If you shared a bank card, contact your bank and block the card — a 'one-euro deposit' is used to validate the number for later charges. If you installed a profile or certificate, remove it in the device's settings. Report the incident to the relevant authority.",
        faq: [
          {
            question:
              "Some real networks do ask for an email address. How do I tell the difference?",
            answer:
              "An address alone, yes, that does happen. The password that goes with it, never: a venue has no use for your email credentials, and no Wi-Fi access technically needs them. It's the presence of the password, not of the address, that settles it.",
          },
          {
            question: "What about the one-euro deposit that's supposed to be refunded?",
            answer:
              "That's a classic pretext for obtaining a valid card number. The small amount makes the request seem acceptable; what's actually sought is the number, usable afterward for entirely different amounts. Free Wi-Fi access doesn't ask for a bank card.",
          },
        ],
        whyItWorks:
          "You've just chosen the network, and a page opens on its own with the venue's name: it's exactly the expected sequence. In a hurry to get online, you fill it in without asking why this page needs that information.",
        example: {
          setting: "Page that opened after connecting to a hotel's Wi-Fi.",
          message:
            "Welcome to the hotel. To activate your free access, a €1 deposit will be charged and then refunded. Card number, expiration date, security code.",
          giveaways: [
            "Access advertised as free asks for a card.",
            "The one-euro deposit is used to validate the card for later charges.",
            "The hotel's front desk can tell you how access really works.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the page ask for a bank card, your email password or a file to install?",
            then: "Close it: no Wi-Fi access needs that. Ask the front desk how to connect.",
          },
          {
            check: "Is the page's address unrelated to the establishment?",
            then: "Disconnect from the network.",
          },
          {
            check: "Did you enter a card or a password?",
            then: "Block the card, and change the password from another network.",
          },
        ],
        prevention: [
          "Never enter on a Wi-Fi login page a credential you use anywhere else.",
          "Don't pay or install anything there.",
          "If access requires it, use your phone's hotspot instead.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Phishing (French government cybersecurity assistance service)",
            url: REF.phishing.url,
          },
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
    code: "NET-000008",
    slug: "attaque-par-deauthentification",
    noSimulationReason:
      "La décision réelle — ne pas rejoindre un réseau ouvert parce que le sien est instable — est celle du faux point d'accès, qui a sa propre simulation. En faire une seconde dupliquerait l'exercice.",
    name: "Attaque par déauthentification",
    categorySlug: "reseaux-et-wifi",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Votre appareil est déconnecté du Wi-Fi de façon répétée, jusqu'à ce que vous choisissiez un autre réseau. La coupure n'est pas une panne : c'est le but.",
    attackerObjective: "identifiants",
    aliases: [
      "déauthentification",
      "deauth",
      "déconnexion forcée wifi",
      "brouillage wifi",
    ],
    primaryVector: "web",
    primaryDimension: "network_trust_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Une attaque par déauthentification consiste à provoquer la déconnexion répétée d'appareils de leur réseau sans fil. Elle ne donne accès à rien par elle-même : sa fonction est d'être le préalable d'autre chose, généralement le basculement vers un faux point d'accès.",
    howItWorks:
      "Certains réseaux sans fil, notamment ceux reposant sur des générations anciennes, acceptent des messages de gestion de connexion qui ne sont pas authentifiés : un appareil peut donc être invité à se déconnecter sans que cette invitation soit vérifiée. Cette fiche n'entre pas plus avant dans le détail, qui n'apporterait rien à un lecteur et beaucoup à qui voudrait reproduire. Ce qui compte est l'usage : la déconnexion seule n'a pas d'intérêt, elle sert à provoquer une décision. Un appareil déconnecté cherche un réseau, et une personne agacée par des coupures en choisit un autre — celui qui reste disponible, souvent ouvert, souvent au nom attendu. C'est là que le préjudice commence. Un second usage existe, dirigé contre l'équipement plutôt que contre vous : couper des caméras ou des détecteurs sans fil, dont l'enregistrement s'interrompt sans que personne ne soit alerté. Les générations récentes de sécurité sans fil protègent ces messages de gestion, ce qui rend le maintien à jour des équipements plus utile ici que n'importe quelle vigilance.",
    warningSigns: [
      "Déconnexions répétées du Wi-Fi alors que le signal est bon et que rien n'a changé",
      "Coupures touchant plusieurs appareils au même moment, et eux seuls",
      "Apparition d'un réseau ouvert au nom voisin juste au moment où le vôtre devient instable",
      "Caméra ou détecteur sans fil qui perd la connexion de façon répétée, notamment la nuit",
      "Retour à la normale dès que vous quittez les lieux",
    ],
    triggers: ["urgency"],
    indicators: [],
    howToVerify:
      "Distinguez la panne de la manœuvre : des coupures qui touchent tous les appareils d'un lieu, avec un bon signal, sans changement de configuration, et pendant lesquelles apparaît un réseau ouvert au nom similaire, ne ressemblent pas à un incident matériel. Testez un partage de connexion depuis votre téléphone : s'il reste stable, le problème est bien sur le réseau sans fil local.",
    whatToDo:
      "Le réflexe qui compte est de ne pas céder à la coupure : ne rejoignez pas un réseau ouvert simplement parce que le vôtre est instable — c'est exactement la décision recherchée. Utilisez votre connexion mobile en attendant. Maintenez votre box et vos équipements à jour et activez le niveau de sécurité sans fil le plus récent qu'ils prennent en charge, les générations actuelles protégeant les messages de gestion visés ici.",
    whatToDoIfVictim:
      "Si vous vous êtes connecté à un autre réseau pendant les coupures, traitez la situation comme un faux point d'accès : depuis une connexion de confiance, changez les identifiants saisis à ce moment-là et retirez tout profil ou certificat installé. Pour un système de surveillance sans fil qui se coupe de façon répétée, envisagez une liaison filaire, la coupure étant ici l'objectif même. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Des coupures répétées agacent, et l'on veut seulement que ça marche : le réseau ouvert qui reste disponible paraît être la solution. La décision est prise par lassitude, pas par examen.",
    example: {
      setting: "Dans un espace de coworking, votre ordinateur perd le Wi-Fi toutes les deux minutes depuis une demi-heure.",
      message:
        "Réseaux disponibles :\n• Coworking-Membres (sécurisé) — connexion perdue\n• Coworking-Membres_5G (ouvert)",
      giveaways: [
        "Le signal est bon, mais la connexion tombe sans cesse.",
        "Un réseau ouvert au nom voisin vient d'apparaître.",
        "Les autres personnes de la salle ont le même problème au même moment.",
      ],
    },
    decisionChecklist: [
      {
        check: "Votre Wi-Fi coupe-t-il sans cesse alors qu'un réseau ouvert au nom voisin reste disponible ?",
        then: "Ne le rejoignez pas : passez au partage de connexion de votre téléphone.",
      },
      {
        check: "Vous êtes-vous connecté à ce réseau ouvert pendant les coupures ?",
        then: "Depuis une connexion de confiance, changez les mots de passe saisis à ce moment-là.",
      },
      {
        check: "Une caméra ou un détecteur sans fil perd-il la connexion de façon répétée ?",
        then: "Envisagez une liaison filaire pour cet équipement.",
      },
    ],
    prevention: [
      "Ne rejoignez jamais un réseau ouvert simplement parce que le vôtre est instable.",
      "Gardez la box et les équipements à jour, avec le niveau de sécurité Wi-Fi le plus récent qu'ils acceptent.",
      "Désactivez la connexion automatique aux réseaux ouverts.",
    ],
    relatedAttackCodes: [
      "NET-000002",
      "NET-000001",
      "MOB-000009",
      "NET-000007",
      "NET-000006",
    ],
    faq: [
      {
        question: "Comment distinguer cela d'une simple panne de box ?",
        answer:
          "Par le contexte plutôt que par la coupure elle-même. Une panne ne s'accompagne pas de l'apparition d'un réseau ouvert au nom voisin, ne s'arrête pas quand vous changez de lieu, et n'épargne pas les appareils filaires. Si tout cela se conjugue, l'hypothèse mérite d'être prise au sérieux.",
      },
      {
        question: "Que risque une caméra de surveillance sans fil ?",
        answer:
          "L'interruption de l'enregistrement, ce qui est précisément l'objectif dans ce cas d'usage — et l'absence d'images n'alerte personne sur le moment. Pour un équipement dont dépend une surveillance, une liaison filaire supprime la vulnérabilité plutôt que de la réduire.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "wifi-deauthentication-attack",
        noSimulationReason:
          "The real decision — not joining an open network because your own has become unstable — belongs to the fake access point entry, which already has its own simulation. A second one would duplicate that exercise.",
        name: "Wi-Fi Deauthentication Attack",
        plainLanguageDefinition:
          "Your device is repeatedly disconnected from Wi-Fi until you choose another network. The drop isn't a glitch: it's the goal.",
        aliases: [
          "deauthentication attack",
          "deauth attack",
          "forced Wi-Fi disconnection",
          "Wi-Fi jamming",
        ],
        definition:
          "A deauthentication attack consists of repeatedly forcing devices off their wireless network. It grants access to nothing by itself: its function is to be the setup for something else, usually a switch to a fake access point.",
        howItWorks:
          "Some wireless networks, particularly those relying on older generations of the standard, accept connection-management messages that aren't authenticated: a device can therefore be told to disconnect without that instruction being verified. This entry doesn't go further into the detail, which would give a reader nothing useful and a would-be attacker a great deal. What matters is the use made of it: the disconnection alone is of no interest, it serves to trigger a decision. A disconnected device looks for a network, and a person annoyed by repeated drops picks another one — whichever stays available, often open, often under the expected name. That's where the harm begins. A second use exists, aimed at the equipment rather than at you: cutting off wireless cameras or sensors, whose recording stops without anyone being alerted. Recent generations of wireless security protect these management messages, which makes keeping equipment up to date more useful here than any amount of vigilance.",
        warningSigns: [
          "Repeated Wi-Fi disconnections despite good signal and no configuration change",
          "Drops affecting several devices at the same time, and only them",
          "An open network with a similar name appearing right as your own becomes unstable",
          "Wireless camera or sensor repeatedly losing connection, especially at night",
          "Everything returns to normal as soon as you leave the premises",
        ],
        howToVerify:
          "Distinguish a fault from a maneuver: disconnections affecting every device in a location, with good signal, no configuration change, and during which an open network with a similar name appears, don't look like a hardware incident. Test a mobile hotspot from your phone: if it stays stable, the problem is indeed on the local wireless network.",
        whatToDo:
          "The reflex that matters is not giving in to the disconnection: don't join an open network simply because your own has become unstable — that's exactly the decision being sought. Use your mobile connection in the meantime. Keep your router and equipment up to date and enable the most recent wireless security level they support, since current generations protect the management messages targeted here.",
        whatToDoIfVictim:
          "If you connected to another network during the drops, treat the situation as a fake access point: from a trusted connection, change the credentials entered at that time and remove any installed profile or certificate. For a wireless surveillance system that keeps dropping, consider a wired link, since the disconnection is itself the goal here. Report the incident to the relevant authority.",
        faq: [
          {
            question: "How do I tell this apart from a simple router fault?",
            answer:
              "By the context rather than the drop itself. A fault doesn't come with an open network with a similar name appearing, doesn't stop when you change location, and doesn't spare wired devices. If all of that lines up, the hypothesis deserves to be taken seriously.",
          },
          {
            question: "What's at risk for a wireless surveillance camera?",
            answer:
              "The interruption of the recording, which is precisely the goal in that use case — and the absence of footage doesn't alert anyone at the time. For equipment surveillance depends on, a wired link removes the vulnerability rather than reducing it.",
          },
        ],
        whyItWorks:
          "Repeated drops are irritating, and you just want it to work: the open network that stays available seems like the solution. The decision is made out of frustration, not after examination.",
        example: {
          setting: "In a coworking space, your computer has been losing Wi-Fi every two minutes for half an hour.",
          message:
            "Available networks:\n• Coworking-Members (secured) — connection lost\n• Coworking-Members_5G (open)",
          giveaways: [
            "The signal is good, but the connection keeps dropping.",
            "An open network with a similar name has just appeared.",
            "Other people in the room have the same problem at the same time.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does your Wi-Fi keep dropping while an open network with a similar name stays available?",
            then: "Don't join it: switch to your phone's hotspot.",
          },
          {
            check: "Did you connect to that open network during the drops?",
            then: "From a trusted connection, change the passwords you entered at that time.",
          },
          {
            check: "Does a wireless camera or sensor keep losing its connection?",
            then: "Consider a wired connection for that device.",
          },
        ],
        prevention: [
          "Never join an open network just because yours is unstable.",
          "Keep your router and devices up to date, with the most recent Wi-Fi security level they support.",
          "Turn off automatic connection to open networks.",
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

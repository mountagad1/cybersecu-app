import type { AttackEntry } from "./types";
import { VERIFIED_REFERENCES as REF } from "./types";

/**
 * Logiciels malveillants.
 *
 * RÈGLES PROPRES À CETTE FAMILLE, en plus de celles de ingenierie-sociale.ts :
 *
 *  1. Aucun nom de famille de logiciel malveillant, aucun identifiant de
 *     vulnérabilité, aucun nom d'éditeur d'antivirus. Ces noms datent une
 *     fiche en quelques mois et n'aident pas un lecteur non technique.
 *
 *  2. Aucune procédure de désinfection présentée comme fiable. C'est la
 *     tentation propre au domaine, et elle est dangereuse : une machine
 *     nettoyée à moitié inspire une confiance que rien ne justifie. Quand la
 *     réponse honnête est « réinstaller » ou « faire examiner par un
 *     professionnel », les fiches le disent.
 *
 *  3. Chaque fiche sépare ce qui est OBSERVABLE de ce qui ne l'est pas.
 *     La propriété qui définit un logiciel malveillant est qu'il cherche à
 *     ne pas se voir : l'absence de symptôme ne prouve donc rien. Une liste
 *     de signes qui ne le dit pas fabrique de la fausse assurance.
 *
 *  4. Deux frontières du §4.1 du plan traversent cette famille et doivent
 *     être tenues à l'ouverture de chaque fiche concernée :
 *       - `logiciel-espion` ≠ `stalkerware` : même technique, contexte
 *         opposé — un inconnu à distance vs un proche avec accès physique.
 *         La seconde impose une marche à suivre de sécurité personnelle que
 *         la première n'a pas.
 *       - `scareware` ≠ `faux-support-technique` : un logiciel qui vend une
 *         fausse solution vs un humain au téléphone qui réclame la prise en
 *         main. Souvent enchaînés, jamais confondus.
 *
 * Note de cohérence : comme la famille 10, cette famille n'est pas décrite
 * par `CyberReflexDimensionCode`, défini pour des attaques reçues par
 * message (voir §12 bis du plan). Le rattachement le moins faux est retenu,
 * en attendant la migration.
 */
export const LOGICIELS_MALVEILLANTS: AttackEntry[] = [
  {
    code: "MAL-000001",
    slug: "rancongiciel",
    simulationSlug: "message-rancongiciel-fichiers-verrouilles",
    name: "Rançongiciel (ransomware)",
    categorySlug: "logiciels-malveillants",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Vos fichiers sont toujours là mais plus aucun ne s'ouvre, et un message réclame un paiement pour les rendre lisibles. Rien n'a été volé au sens habituel : tout a été verrouillé sur place.",
    attackerObjective: "argent",
    aliases: [
      "ransomware",
      "logiciel de rançon",
      "logiciel rançonneur",
      "chiffrement malveillant",
    ],
    primaryVector: "file_attachment",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un rançongiciel est un logiciel malveillant qui rend illisibles les fichiers d'un appareil en les chiffrant, puis réclame un paiement en échange du moyen de les rétablir. Il ne s'agit pas d'un vol de fichiers mais d'une privation d'accès : les données restent à leur place, et c'est la clé qui manque.",
    howItWorks:
      "L'entrée se fait par les chemins ordinaires : une pièce jointe ouverte, un logiciel téléchargé hors de sa source officielle, un accès distant mal protégé. Une fois exécuté, le programme parcourt les fichiers de l'appareil et de tout ce qui lui est rattaché — disque externe branché, dossier partagé, sauvegarde synchronisée en continu — et les remplace par des versions chiffrées. C'est ce dernier point qui décide de la gravité : une sauvegarde connectée au moment de l'exécution est chiffrée avec le reste, et c'est la raison pour laquelle une sauvegarde débranchée n'est pas une précaution excessive. Un message s'affiche ensuite, souvent accompagné d'un délai et d'une menace d'augmentation du montant. Le délai n'a aucune fonction technique : il sert à empêcher de réfléchir et d'appeler quelqu'un.",
    warningSigns: [
      "Fichiers dont l'extension a changé et qui n'ouvrent plus dans aucun logiciel",
      "Message plein écran ou fichier texte déposé dans chaque dossier, réclamant un paiement",
      "Paiement demandé en cryptomonnaie, avec un compte à rebours",
      "Ralentissement marqué et activité disque intense juste avant que les fichiers deviennent illisibles",
      "Documents récents absents de la liste des fichiers récemment ouverts",
    ],
    triggers: ["fear", "urgency", "scarcity"],
    indicators: [],
    howToVerify:
      "Il n'y a rien à vérifier au sens habituel : si vos fichiers ne s'ouvrent plus et qu'un paiement est réclamé, la situation est établie. Ce qui reste à déterminer est l'étendue — quels autres appareils, disques externes et espaces partagés étaient accessibles depuis la machine touchée au moment des faits.",
    whatToDo:
      "Débranchez l'appareil du réseau et éteignez-le, avant de chercher quoi que ce soit d'autre : tant qu'il est connecté, l'atteinte peut s'étendre aux dossiers partagés et aux disques encore accessibles. Ne payez pas : le paiement ne garantit pas le rétablissement des fichiers, il finance l'activité et il désigne un payeur. Ne reformatez pas immédiatement — les fichiers chiffrés doivent être conservés, un moyen de déchiffrement pouvant exister ou apparaître plus tard.",
    whatToDoIfVictim:
      "Conservez une copie des fichiers chiffrés et du message de rançon, ils sont nécessaires à toute tentative de rétablissement ultérieure. Déposez plainte. Signalez les faits sur cybermalveillance.gouv.fr, qui oriente vers des prestataires et recense les outils de déchiffrement disponibles. Restaurez à partir d'une sauvegarde qui n'était pas connectée à l'appareil, sur un système réinstallé et non sur celui qui a été touché. Si l'appareil contenait des données professionnelles ou celles d'autres personnes, l'obligation d'information de ces personnes se pose et mérite un avis juridique.",
    whyItWorks:
      "Le message arrive au pire moment, devant des fichiers devenus illisibles, et le compte à rebours pousse à payer avant de réfléchir. Payer paraît être le seul moyen de tout récupérer, surtout sans sauvegarde.",
    example: {
      setting: "Écran affiché au démarrage, après une soirée où l'ordinateur a beaucoup ralenti.",
      message:
        "Tous vos fichiers ont été chiffrés. Pour obtenir la clé de déchiffrement, payez l'équivalent de 600 € en cryptomonnaie dans les 72 heures. Passé ce délai, le montant doublera. N'éteignez pas l'ordinateur.",
      giveaways: [
        "Les fichiers ont changé d'extension et ne s'ouvrent plus.",
        "Le délai et la menace de hausse servent à empêcher de demander de l'aide.",
        "L'interdiction d'éteindre va contre ce qu'il faut faire.",
      ],
    },
    decisionChecklist: [
      {
        check: "Vos fichiers ne s'ouvrent-ils plus et un paiement est-il réclamé ?",
        then: "Débranchez l'appareil du réseau et éteignez-le, puis appelez à l'aide.",
      },
      {
        check: "Un disque externe ou un dossier partagé était-il connecté ?",
        then: "Débranchez-le aussi, et vérifiez les autres appareils qui y avaient accès.",
      },
      {
        check: "Disposez-vous d'une sauvegarde qui n'était pas connectée ?",
        then: "Restaurez à partir d'elle, sur un système réinstallé, après avoir conservé une copie des fichiers chiffrés.",
      },
    ],
    prevention: [
      "Faites une sauvegarde régulière sur un support que vous débranchez ensuite.",
      "Gardez le système et les logiciels à jour.",
      "N'ouvrez pas de pièce jointe ni de logiciel venant d'une source que vous n'avez pas vérifiée.",
    ],
    relatedAttackCodes: [
      "MAL-000002",
      "PHISH-000001",
      "MAL-000006",
      "WEB-000005",
      "MOB-000010",
      "MAL-000005",
    ],
    faq: [
      {
        question: "Si je paie, est-ce que je récupère mes fichiers ?",
        answer:
          "Rien ne le garantit. Vous dépendez entièrement de la volonté de la personne qui vous a attaqué, sans aucun recours si elle ne fait rien ou si l'outil fourni ne fonctionne pas. C'est aussi ce qui vous inscrit comme payeur pour la suite. Les autorités françaises déconseillent le paiement.",
      },
      {
        question: "Un antivirus aurait-il empêché cela ?",
        answer:
          "Il peut arrêter ce qu'il reconnaît, et il ne reconnaît pas tout. La protection qui tient réellement est ailleurs : des sauvegardes régulières et déconnectées, dont vous avez vérifié au moins une fois qu'elles se restaurent. Une sauvegarde jamais testée n'est pas une sauvegarde.",
      },
      {
        question: "Mes fichiers ont-ils été volés en plus d'être chiffrés ?",
        answer:
          "Vous ne pouvez pas le savoir depuis la machine touchée, et c'est une possibilité réelle, certaines attaques combinant les deux. Traitez les identifiants qui y étaient enregistrés comme exposés : changez-les depuis un autre appareil, en commençant par votre messagerie principale.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "ransomware",
        simulationSlug: "ransomware-locked-files-message",
        name: "Ransomware",
        plainLanguageDefinition:
          "Your files are still there, but none of them will open, and a message demands payment to make them readable again. Nothing has been stolen in the usual sense: everything has been locked in place.",
        definition:
          "Ransomware is malicious software that renders a device's files unreadable by encrypting them, then demands payment in exchange for the means to restore them. This isn't a theft of files but a denial of access: the data stays where it is, and it's the key that's missing.",
        howItWorks:
          "The entry point is one of the usual paths: an opened attachment, software downloaded outside its official source, a poorly protected remote access. Once executed, the program scans the files on the device and everything connected to it — a plugged-in external drive, a shared folder, a continuously syncing backup — and replaces them with encrypted versions. This last point is what decides the severity: a backup connected at the time of execution is encrypted along with everything else, which is why an unplugged backup is not an excessive precaution. A message then appears, often accompanied by a deadline and a threat to raise the amount. The deadline has no technical function: it exists to stop you from thinking and from calling someone.",
        warningSigns: [
          "Files whose extension has changed and that no longer open in any program",
          "Full-screen message or text file dropped in every folder, demanding payment",
          "Payment demanded in cryptocurrency, with a countdown",
          "Marked slowdown and intense disk activity just before files become unreadable",
          "Recent documents missing from the list of recently opened files",
        ],
        howToVerify:
          "There's nothing to verify in the usual sense: if your files no longer open and a payment is being demanded, the situation is established. What remains to be determined is the extent — which other devices, external drives and shared spaces were reachable from the affected machine at the time.",
        whatToDo:
          "Disconnect the device from the network and turn it off before looking into anything else: as long as it's connected, the damage can spread to shared folders and drives still reachable. Don't pay: payment doesn't guarantee your files will be restored, it funds the activity, and it marks you as a payer. Don't reformat immediately — the encrypted files should be kept, since a decryption method may exist or appear later.",
        whatToDoIfVictim:
          "Keep a copy of the encrypted files and the ransom message; they're needed for any later attempt at recovery. File a police report. Report the incident to cybermalveillance.gouv.fr, which directs you to service providers and lists available decryption tools. Restore from a backup that wasn't connected to the device, onto a reinstalled system rather than the affected one. If the device held professional data or other people's data, the obligation to inform those people arises and deserves legal advice.",
        faq: [
          {
            question: "If I pay, will I get my files back?",
            answer:
              "Nothing guarantees it. You're entirely dependent on the goodwill of the person who attacked you, with no recourse if they do nothing or the tool provided doesn't work. It's also what marks you as a payer for the future. French authorities advise against paying.",
          },
          {
            question: "Would antivirus software have prevented this?",
            answer:
              "It can stop what it recognizes, and it doesn't recognize everything. The protection that actually holds up lies elsewhere: regular, disconnected backups that you've checked at least once actually restore. A backup that's never been tested isn't a backup.",
          },
          {
            question: "Were my files stolen as well as encrypted?",
            answer:
              "You can't know from the affected machine, and it's a real possibility — some attacks combine both. Treat any credentials stored on it as exposed: change them from another device, starting with your main email account.",
          },
        ],
        whyItWorks:
          "The message arrives at the worst moment, in front of files that can no longer be read, and the countdown pushes you to pay before thinking. Paying seems like the only way to get everything back, especially without a backup.",
        example: {
          setting: "Screen shown at startup, after an evening when the computer slowed down a lot.",
          message:
            "All your files have been encrypted. To get the decryption key, pay the equivalent of €600 in cryptocurrency within 72 hours. After that, the amount will double. Do not turn off the computer.",
          giveaways: [
            "The files have changed extension and no longer open.",
            "The deadline and the threatened increase are there to stop you from asking for help.",
            "The order not to turn the computer off goes against what you should do.",
          ],
        },
        decisionChecklist: [
          {
            check: "Do your files no longer open, and is a payment being demanded?",
            then: "Unplug the device from the network and turn it off, then call for help.",
          },
          {
            check: "Was an external drive or a shared folder connected?",
            then: "Unplug it too, and check the other devices that had access to it.",
          },
          {
            check: "Do you have a backup that wasn't connected?",
            then: "Restore from it, on a reinstalled system, after keeping a copy of the encrypted files.",
          },
        ],
        prevention: [
          "Back up regularly to a device you then unplug.",
          "Keep the system and software up to date.",
          "Don't open attachments or software from a source you haven't verified.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "ransomware",
          "ransom software",
          "crypto-ransomware",
          "malicious encryption",
        ],
      },
    },
  },
  {
    code: "MAL-000002",
    slug: "cheval-de-troie",
    simulationSlug: "logiciel-professionnel-pirate-en-telechargement",
    name: "Cheval de Troie",
    categorySlug: "logiciels-malveillants",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un programme qui fait ce qu'il annonce — et autre chose en plus. C'est vous qui l'avez installé, volontairement, parce qu'il paraissait utile.",
    attackerObjective: "controle_d_un_appareil",
    aliases: [
      "trojan",
      "troyen",
      "logiciel piégé",
      "cheval de troie informatique",
    ],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un cheval de Troie est un logiciel malveillant dissimulé dans un programme d'apparence légitime, que l'utilisateur installe lui-même. Contrairement au virus et au ver, il ne se reproduit pas : il n'a pas besoin de se propager puisqu'il obtient son exécution de la personne visée.",
    howItWorks:
      "Le mécanisme n'est pas technique, il est éditorial : rendre l'installation désirable. Un logiciel payant proposé gratuitement, un utilitaire qui promet d'accélérer un appareil lent, une version modifiée d'une application connue, un lecteur qu'un site prétend nécessaire pour afficher son contenu. Le programme téléchargé fait généralement ce qu'il annonce, ce qui écarte le soupçon, et exécute en même temps sa charge réelle : ouvrir un accès distant, installer d'autres composants, collecter des identifiants. La conséquence pratique est que le moment décisif n'est pas l'exécution mais le téléchargement — c'est la seule étape où la décision vous appartient encore entièrement.",
    warningSigns: [
      "Logiciel habituellement payant proposé gratuitement, ou version « débridée » d'une application connue",
      "Téléchargement proposé depuis un site tiers, un lien de messagerie ou une publicité plutôt que depuis l'éditeur",
      "Installation qui réclame des droits d'administration sans raison liée à sa fonction annoncée",
      "Programme présenté comme indispensable pour lire une vidéo ou ouvrir un document",
      "Applications ou icônes apparues après l'installation, que vous n'avez pas choisies",
    ],
    triggers: ["reward", "curiosity", "trust"],
    indicators: [],
    howToVerify:
      "Avant d'installer : partez du nom de l'éditeur et rejoignez son site par une recherche indépendante plutôt que par le lien qui vous est proposé, puis téléchargez depuis là. Sur téléphone, restez sur le magasin d'applications officiel. Après coup, la vérification est beaucoup moins fiable — un programme conçu pour ne pas se voir se voit mal — ce qui est précisément la raison de vérifier avant.",
    whatToDo:
      "N'installez que depuis la source d'origine, même quand un intermédiaire paraît plus commode. Refusez les logiciels que l'on vous présente comme nécessaires pour consulter un contenu : c'est un prétexte, pas un besoin technique.",
    whatToDoIfVictim:
      "Déconnectez l'appareil du réseau. Considérez que tous les identifiants saisis ou enregistrés sur cette machine sont exposés et changez-les depuis un autre appareil, en commençant par la messagerie qui sert à réinitialiser les autres comptes. La désinstallation du programme ne suffit pas à établir que la machine est saine : sur un appareil qui contient des données importantes, la réinstallation du système est la seule remise à zéro dont on puisse répondre. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Le programme fait ce qu'il promet, ce qui écarte le soupçon. La gratuité d'un logiciel payant ou la promesse d'un appareil plus rapide créent une envie qui passe avant la question de la provenance.",
    example: {
      setting: "Lien partagé sur un forum, pour un logiciel de montage habituellement payant.",
      message:
        "Version complète débloquée, toutes les fonctions, sans licence. Désactivez votre antivirus pendant l'installation, il bloque le patch par erreur.",
      giveaways: [
        "Un logiciel payant offert gratuitement par un inconnu.",
        "La demande de désactiver l'antivirus.",
        "Le fichier ne vient pas du site de l'éditeur.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le logiciel vient-il d'ailleurs que du site de son éditeur ou d'un magasin officiel ?",
        then: "Ne l'installez pas : rejoignez l'éditeur par une recherche indépendante.",
      },
      {
        check: "L'installation vous demande-t-elle de désactiver une protection ?",
        then: "Arrêtez : c'est une raison suffisante de renoncer.",
      },
      {
        check: "Avez-vous déjà installé et lancé le programme ?",
        then: "Déconnectez l'appareil et changez vos mots de passe depuis un autre appareil, en commençant par la messagerie.",
      },
    ],
    prevention: [
      "N'installez que depuis la source d'origine, même si un intermédiaire paraît plus commode.",
      "Refusez tout programme présenté comme nécessaire pour lire un contenu.",
      "Gardez votre protection active : une installation qui demande de la couper n'est pas légitime.",
    ],
    relatedAttackCodes: [
      "MAL-000001",
      "WEB-000005",
      "WEB-000002",
      "MAL-000003",
      "MOB-000001",
      "MAL-000008",
      "SOCIAL-000008",
      "ACCT-000007",
      "MAL-000005",
      "MAL-000006",
      "MAL-000007",
      "MAL-000009",
      "MAL-000010",
    ],
    faq: [
      {
        question: "Quelle différence avec un virus ?",
        answer:
          "La reproduction. Un virus se copie pour se répandre ; un cheval de Troie ne se copie pas, parce qu'il obtient de vous ce que le virus doit voler — son exécution. C'est aussi pourquoi il n'y a rien à « attraper » : il y a eu une installation.",
      },
      {
        question:
          "Le logiciel que j'ai installé fonctionne normalement. Est-ce rassurant ?",
        answer:
          "Non, c'est le principe même du procédé. Un programme piégé qui ne remplirait pas sa fonction annoncée serait désinstallé dans la minute. Le fonctionnement normal est un argument de discrétion, pas une preuve d'innocuité.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "trojan-horse",
        simulationSlug: "pirated-professional-software-download",
        name: "Trojan Horse",
        plainLanguageDefinition:
          "A program that does what it claims — and something else besides. You installed it yourself, voluntarily, because it looked useful.",
        definition:
          "A trojan horse is malicious software hidden inside an apparently legitimate program, which the user installs themselves. Unlike a virus or a worm, it doesn't reproduce: it doesn't need to spread, since it gets itself run by the targeted person.",
        howItWorks:
          "The mechanism isn't technical, it's editorial: making the installation desirable. Normally paid software offered for free, a utility promising to speed up a slow device, a modified version of a well-known app, a player a site claims is necessary to display its content. The downloaded program generally does what it claims, which dispels suspicion, while also carrying out its real payload: opening remote access, installing other components, collecting credentials. The practical consequence is that the decisive moment isn't execution but download — it's the only step where the decision is still entirely yours.",
        warningSigns: [
          "Normally paid software offered for free, or an \"unlocked\" version of a well-known app",
          "Download offered from a third-party site, an email link or an ad rather than from the publisher",
          "Installation requesting administrator rights with no connection to its stated purpose",
          "Program presented as essential to play a video or open a document",
          "Apps or icons that appeared after installation, which you didn't choose",
        ],
        howToVerify:
          "Before installing: start from the publisher's name and reach their site through an independent search rather than the link you're offered, then download from there. On a phone, stick to the official app store. Afterwards, verification is far less reliable — a program designed not to be noticed is hard to spot — which is precisely why checking beforehand matters.",
        whatToDo:
          "Only install from the original source, even when an intermediary seems more convenient. Refuse software presented to you as necessary to view content: it's a pretext, not a technical requirement.",
        whatToDoIfVictim:
          "Disconnect the device from the network. Treat any credentials entered or saved on this machine as exposed and change them from another device, starting with the email account used to reset your other accounts. Uninstalling the program isn't enough to establish that the machine is clean: on a device holding important data, reinstalling the system is the only reset you can vouch for. Report the incident to cybermalveillance.gouv.fr.",
        faq: [
          {
            question: "What's the difference with a virus?",
            answer:
              "Reproduction. A virus copies itself to spread; a trojan horse doesn't copy itself, because it gets from you what a virus has to steal — its execution. It's also why there's nothing to \"catch\": there was an installation.",
          },
          {
            question: "The software I installed works normally. Is that reassuring?",
            answer:
              "No, that's the whole point of the method. A trojan program that failed to perform its stated function would be uninstalled within minutes. Normal operation is an argument for discretion, not proof of harmlessness.",
          },
        ],
        whyItWorks:
          "The program does what it promises, which keeps suspicion away. Free paid software or the promise of a faster device creates a desire that comes before the question of where it came from.",
        example: {
          setting: "Link shared on a forum, for video editing software that's usually paid.",
          message:
            "Full unlocked version, all features, no license. Turn off your antivirus during installation, it blocks the patch by mistake.",
          giveaways: [
            "Paid software offered for free by a stranger.",
            "The request to turn off the antivirus.",
            "The file doesn't come from the publisher's site.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does the software come from somewhere other than its publisher's site or an official store?",
            then: "Don't install it: find the publisher through an independent search.",
          },
          {
            check: "Does the installation ask you to turn off a protection?",
            then: "Stop: that's reason enough to give up.",
          },
          {
            check: "Have you already installed and run the program?",
            then: "Disconnect the device and change your passwords from another device, starting with your email.",
          },
        ],
        prevention: [
          "Install only from the original source, even when a middleman seems more convenient.",
          "Refuse any program presented as necessary to view content.",
          "Keep your protection on: an installation that asks you to turn it off isn't legitimate.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: ["trojan", "trojan virus", "trojan malware", "trojan program"],
      },
    },
  },
  {
    code: "MAL-000003",
    slug: "logiciel-espion",
    noSimulationReason:
      "La propriété qui définit un logiciel espion est de ne rien laisser observer : la vérification porte sur la liste des applications et des autorisations installées, pas sur un message qui arrive.",
    name: "Logiciel espion (spyware)",
    categorySlug: "logiciels-malveillants",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un programme installé à votre insu qui observe ce que vous faites sur votre appareil et transmet ce qu'il voit. Il ne casse rien : son but est de durer sans être remarqué.",
    attackerObjective: "donnees_personnelles",
    aliases: [
      "spyware",
      "mouchard",
      "logiciel de surveillance",
      "spyware mobile",
    ],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un logiciel espion est un programme installé à l'insu de l'utilisateur pour observer son activité — pages consultées, messages, identifiants, position — et la transmettre à un tiers. Cette fiche traite du cas où ce tiers est un inconnu agissant à distance. Lorsque l'installation est le fait d'un proche disposant d'un accès physique à l'appareil, il s'agit de stalkerware, dont la marche à suivre est différente et tient compte du danger que représente cette personne.",
    howItWorks:
      "L'installation emprunte les voies habituelles : un programme piégé, une extension de navigateur, une application hors magasin officiel, parfois un composant ajouté à un logiciel par ailleurs légitime. Une fois en place, le programme est conçu pour l'endurance plutôt que pour le rendement immédiat : il consomme peu, ne modifie rien de visible, et se relance au démarrage. Ce qu'il collecte dépend des autorisations qu'il a obtenues — historique et saisies au clavier, contenu de la messagerie, position, micro et caméra sur un téléphone. La difficulté pour la personne visée est structurelle : le seul symptôme d'un logiciel espion qui fonctionne bien est qu'il n'y en a pas.",
    warningSigns: [
      "Batterie qui se vide nettement plus vite qu'avant, sans changement d'usage",
      "Consommation de données mobiles en hausse inexpliquée",
      "Appareil tiède au repos, ou lent alors que rien ne tourne",
      "Application inconnue dans la liste, ou accès accordé à des fonctions sans rapport avec son objet",
      "Sur téléphone, indicateur de micro ou de caméra qui s'allume hors utilisation",
      "Aucun signe du tout — ce qui n'écarte rien",
    ],
    triggers: ["curiosity", "trust"],
    indicators: [],
    howToVerify:
      "Passez en revue la liste des applications et des extensions installées, et les autorisations accordées à chacune : une application dont l'objet n'a rien à voir avec le micro, la position ou l'accessibilité et qui y a accès est le signal le plus exploitable. Vérifiez les appareils connectés à vos comptes principaux depuis un autre appareil. Sachez toutefois ce que cet examen vaut : il repère ce qui n'a pas cherché à se cacher, et un programme conçu pour se dissimuler ne s'y montrera pas.",
    whatToDo:
      "Installez uniquement depuis les magasins et les sites d'éditeurs officiels, et refusez les autorisations qu'une application ne justifie pas par sa fonction. Maintenez le système à jour : c'est la mesure qui referme les chemins d'installation silencieuse.",
    whatToDoIfVictim:
      "Depuis un autre appareil, changez les mots de passe de vos comptes principaux et vérifiez les sessions ouvertes. Sur l'appareil suspect, la remise à zéro du système est la seule mesure dont on puisse répondre — la suppression d'une application repérée ne prouve pas qu'elle était seule. Ne restaurez pas une sauvegarde antérieure au doute sans la faire examiner, sous peine de réinstaller ce que vous venez de retirer. Signalez les faits sur cybermalveillance.gouv.fr. Si vous soupçonnez qu'une personne de votre entourage est à l'origine de la surveillance, ne modifiez rien tout de suite et lisez d'abord la fiche stalkerware : agir sur l'appareil est visible de la personne qui surveille.",
    whyItWorks:
      "Un logiciel espion bien fait ne casse rien et ne se montre pas : il n'y a rien qui pousse à chercher. Les autorisations qu'il utilise ont été accordées un jour, sans y penser, à une application qui paraissait utile.",
    example: {
      setting: "Paramètres du téléphone, rubrique « Autorisations », section Micro.",
      message:
        "Applications autorisées à utiliser le micro :\n• Téléphone\n• Messagerie\n• Scanner PDF Rapide — toujours autorisé",
      giveaways: [
        "Un scanner de documents n'a aucune raison d'utiliser le micro.",
        "L'autorisation est permanente, pas seulement pendant l'utilisation.",
        "Vous ne vous souvenez pas d'avoir installé cette application.",
      ],
    },
    decisionChecklist: [
      {
        check: "Une application a-t-elle accès au micro, à la position ou à l'accessibilité sans rapport avec sa fonction ?",
        then: "Retirez l'autorisation et désinstallez l'application.",
      },
      {
        check: "Soupçonnez-vous une personne de votre entourage d'avoir installé quelque chose ?",
        then: "Ne modifiez rien tout de suite et lisez d'abord la fiche stalkerware : agir sur l'appareil est visible de cette personne.",
      },
      {
        check: "Le doute persiste-t-il après ce tri ?",
        then: "Changez vos mots de passe depuis un autre appareil, puis envisagez la remise à zéro du téléphone.",
      },
    ],
    prevention: [
      "Installez uniquement depuis les magasins et sites d'éditeurs officiels.",
      "Refusez les autorisations qu'une application ne justifie pas par sa fonction.",
      "Gardez le système à jour et verrouillez l'appareil avec un code que personne d'autre ne connaît.",
    ],
    relatedAttackCodes: [
      "PERS-000005",
      "MAL-000004",
      "MAL-000002",
      "MOB-000007",
      "ACCT-000007",
      "MOB-000001",
      "MAL-000005",
      "MAL-000007",
    ],
    faq: [
      {
        question: "Quelle différence exacte avec le stalkerware ?",
        answer:
          "La technique est la même, le contexte est inverse. Le logiciel espion vient d'un inconnu qui vise vos données ; le stalkerware vient d'un proche qui vous surveille, et qui est physiquement présent. La conséquence est pratique : dans le second cas, retirer l'application peut être perçu et exposer la personne surveillée, ce qui change complètement l'ordre des gestes.",
      },
      {
        question: "Un antivirus détecte-t-il un logiciel espion ?",
        answer:
          "Il détecte ce qu'il connaît. Une détection est donc une information utile, mais une absence de détection n'établit rien — c'est vrai de tout examen mené depuis la machine que l'on soupçonne.",
      },
      {
        question: "Réinitialiser mon téléphone suffit-il ?",
        answer:
          "La remise à zéro efface ce qui est installé, mais restaurer ensuite une sauvegarde antérieure peut ramener l'application. Si vous réinitialisez, repartez d'une configuration neuve pour les applications, en ne récupérant que vos documents.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "spyware",
        name: "Spyware",
        plainLanguageDefinition:
          "A program installed without your knowledge that watches what you do on your device and sends back what it sees. It doesn't break anything: its purpose is to last without being noticed.",
        definition:
          "Spyware is a program installed without the user's knowledge to observe their activity — pages visited, messages, credentials, location — and transmit it to a third party. This entry covers the case where that third party is a stranger acting remotely. When the installation is carried out by someone close to the victim with physical access to the device, it is stalkerware, which calls for a different course of action that accounts for the danger that person poses.",
        howItWorks:
          "Installation follows the usual routes: a trojan program, a browser extension, an app from outside the official store, sometimes a component bundled into otherwise legitimate software. Once in place, the program is built for endurance rather than immediate payoff: it uses few resources, changes nothing visible, and restarts at boot. What it collects depends on the permissions it obtained — browsing history and keystrokes, messaging content, location, microphone and camera on a phone. The difficulty for the targeted person is structural: the only symptom of spyware working well is that there is none.",
        warningSigns: [
          "Battery draining noticeably faster than before, with no change in use",
          "Unexplained rise in mobile data consumption",
          "Device warm at rest, or slow when nothing seems to be running",
          "Unknown app in the list, or access granted to functions unrelated to its purpose",
          "On a phone, a microphone or camera indicator lighting up outside of use",
          "No sign at all — which rules nothing out",
        ],
        howToVerify:
          "Review the list of installed apps and extensions, and the permissions granted to each: an app whose purpose has nothing to do with the microphone, location or accessibility features, yet has access to them, is the most useful signal. Check the devices connected to your main accounts from another device. But know what this check is worth: it catches what didn't try to hide, and a program designed to stay hidden won't show up this way.",
        whatToDo:
          "Only install from official stores and publishers' sites, and refuse permissions an app doesn't justify through its function. Keep the system updated: that's what closes off silent-installation paths.",
        whatToDoIfVictim:
          "From another device, change the passwords of your main accounts and check open sessions. On the suspect device, resetting the system to factory settings is the only measure you can vouch for — removing a spotted app doesn't prove it was the only one. Don't restore a backup made before the suspicion arose without having it examined, or you risk reinstalling what you just removed. Report the incident to cybermalveillance.gouv.fr. If you suspect someone close to you is behind the surveillance, don't change anything right away and read the stalkerware entry first: acting on the device is visible to the person watching.",
        faq: [
          {
            question: "What's the exact difference with stalkerware?",
            answer:
              "The technique is the same, the context is reversed. Spyware comes from a stranger after your data; stalkerware comes from someone close to you who is watching you, and who is physically present. The practical consequence: in the second case, removing the app can be noticed and put the person under surveillance at risk, which completely changes the order of steps to take.",
          },
          {
            question: "Does antivirus software detect spyware?",
            answer:
              "It detects what it knows. A detection is therefore useful information, but a lack of detection proves nothing — that's true of any check run from the machine under suspicion.",
          },
          {
            question: "Is resetting my phone enough?",
            answer:
              "The reset erases what's installed, but restoring a backup made before that can bring the app back. If you reset, start fresh for apps, recovering only your documents.",
          },
        ],
        whyItWorks:
          "Well-made spyware breaks nothing and doesn't show itself: nothing prompts you to look. The permissions it uses were granted one day, without thinking, to an app that seemed useful.",
        example: {
          setting: "Phone settings, \"Permissions\" section, Microphone.",
          message:
            "Apps allowed to use the microphone:\n• Phone\n• Messages\n• Quick PDF Scanner — always allowed",
          giveaways: [
            "A document scanner has no reason to use the microphone.",
            "The permission is permanent, not just while the app is in use.",
            "You don't remember installing this app.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does an app have access to the microphone, location or accessibility features with no link to its function?",
            then: "Remove the permission and uninstall the app.",
          },
          {
            check: "Do you suspect someone close to you of installing something?",
            then: "Don't change anything yet and read the stalkerware page first: acting on the device is visible to that person.",
          },
          {
            check: "Does the doubt persist after this review?",
            then: "Change your passwords from another device, then consider resetting the phone.",
          },
        ],
        prevention: [
          "Install only from official stores and publishers' sites.",
          "Refuse permissions an app can't justify by its function.",
          "Keep the system up to date and lock the device with a code nobody else knows.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "spyware",
          "mobile spyware",
          "monitoring software",
          "snoopware",
        ],
      },
    },
  },
  {
    code: "MAL-000004",
    slug: "enregistreur-de-frappe",
    noSimulationReason:
      "La version matérielle se repère en regardant le montage derrière l'ordinateur, et la version logicielle dans les programmes au démarrage : les deux sont des vérifications physiques ou de réglages, pas des messages à juger.",
    name: "Enregistreur de frappe (keylogger)",
    categorySlug: "logiciels-malveillants",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un dispositif qui note tout ce que vous tapez au clavier. Y compris ce que vous effacez avant de l'envoyer, et ce que vous saisissez sur des sites parfaitement authentiques.",
    attackerObjective: "identifiants",
    aliases: ["keylogger", "enregistreur de touches", "capture de frappe"],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un enregistreur de frappe est un dispositif — programme, ou petit matériel intercalé sur le port du clavier — qui capte les touches saisies sur un appareil et les transmet à un tiers. Sa particularité est de fonctionner en amont de tout site : le caractère légitime de la page où vous tapez n'y change rien.",
    howItWorks:
      "La version logicielle s'installe comme les autres logiciels malveillants et se place entre le clavier et le système : elle voit la frappe avant l'application qui la reçoit. La version matérielle est un boîtier discret branché entre le clavier et l'unité centrale, ce qui la réserve aux appareils physiquement accessibles à d'autres — poste partagé, machine en libre accès, bureau ouvert. Dans les deux cas, ce qui distingue ce procédé des autres est le périmètre : sont capturés le mot de passe correct saisi sur le vrai site, la phrase commencée puis effacée, le message jamais envoyé, le code recopié depuis un carnet. Les protections qui reposent sur l'idée d'un site frauduleux à éviter n'ont ici aucune prise, puisqu'il n'y a pas de faux site.",
    warningSigns: [
      "Petit boîtier ou adaptateur inhabituel entre le câble du clavier et l'ordinateur",
      "Connexions à vos comptes depuis des lieux ou des appareils que vous ne reconnaissez pas",
      "Comptes compromis alors que vous n'avez cliqué sur aucun lien et réutilisé aucun mot de passe",
      "Sur un poste partagé, session déjà ouverte ou logiciel inconnu au démarrage",
      "Décalage ou saccade à la saisie, inconstant et peu concluant à lui seul",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Sur un poste fixe dont l'accès physique n'est pas garanti, regardez ce qui est branché derrière la machine — c'est la seule vérification franchement concluante de cette fiche. Côté logiciel, examinez les programmes lancés au démarrage et les autorisations d'accessibilité, qui sont le mécanisme habituellement détourné. Sur un ordinateur que vous ne maîtrisez pas, considérez la question comme indécidable et n'y saisissez rien de sensible.",
    whatToDo:
      "Ne saisissez pas de mot de passe important sur un ordinateur partagé ou public. Activez la double authentification : elle est ce qui limite le mieux les dégâts ici, puisqu'un mot de passe capturé ne suffit alors plus. Un gestionnaire de mots de passe qui remplit les champs sans passer par le clavier réduit également la surface exposée.",
    whatToDoIfVictim:
      "Depuis un autre appareil, changez les mots de passe des comptes utilisés sur la machine suspecte, en commençant par la messagerie principale, et fermez les sessions ouvertes. Si un enregistreur matériel est trouvé, ne le retirez pas avant d'avoir photographié le montage : c'est un élément à joindre à la plainte. Sur un poste professionnel, prévenez le service informatique avant toute manipulation. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Vous saisissez votre mot de passe sur le vrai site : aucune des précautions contre les faux sites ne joue. Sur un poste partagé, personne ne regarde ce qui est branché derrière la machine.",
    example: {
      setting: "Ordinateur en libre accès dans un espace de coworking, au moment de consulter votre messagerie.",
      message:
        "Derrière l'unité centrale, entre le câble du clavier et le port USB : un petit adaptateur noir, sans marque, qui ressemble à une rallonge.",
      giveaways: [
        "Un clavier se branche directement, sans adaptateur.",
        "Le poste est accessible à n'importe qui.",
        "Rien à l'écran ne trahit sa présence.",
      ],
    },
    decisionChecklist: [
      {
        check: "Devez-vous saisir un mot de passe important sur un ordinateur partagé ou public ?",
        then: "Renoncez, ou utilisez votre téléphone sur votre propre connexion.",
      },
      {
        check: "Un boîtier ou un adaptateur inhabituel est-il branché entre le clavier et l'ordinateur ?",
        then: "N'y touchez pas : photographiez le montage et prévenez le responsable du lieu ou le service informatique.",
      },
      {
        check: "Avez-vous déjà saisi des identifiants sur cette machine ?",
        then: "Depuis un autre appareil, changez ces mots de passe et déconnectez les sessions.",
      },
    ],
    prevention: [
      "Ne saisissez pas de mot de passe important sur un poste que vous ne maîtrisez pas.",
      "Activez la double authentification : un mot de passe capturé ne suffit plus.",
      "Utilisez un gestionnaire de mots de passe qui remplit les champs sans passer par le clavier.",
    ],
    relatedAttackCodes: [
      "MAL-000003",
      "ACCT-000007",
      "PERS-000005",
      "ACCT-000002",
      "ACCT-000003",
      "MAL-000005",
    ],
    faq: [
      {
        question: "La double authentification protège-t-elle vraiment ?",
        answer:
          "Elle empêche que le seul mot de passe capturé suffise, ce qui est déjà l'essentiel. Elle ne rend pas le compte inviolable : un code à usage unique tapé au clavier est capturé comme le reste, et n'a de valeur que quelques instants. Une clé physique ou une validation dans une application dédiée ne passent pas par le clavier et ne sont donc pas exposées de cette façon.",
      },
      {
        question: "Copier-coller mon mot de passe évite-t-il la capture ?",
        answer:
          "Pas de façon fiable : le presse-papiers est lui aussi accessible à un programme installé sur la machine. Le raisonnement utile n'est pas de contourner la capture sur un appareil compromis, mais de ne pas saisir d'information sensible sur un appareil dont vous ne répondez pas.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "keylogger",
        name: "Keylogger",
        plainLanguageDefinition:
          "A device that records everything you type on the keyboard. Including what you delete before sending, and what you type on perfectly genuine websites.",
        definition:
          "A keylogger is a device — software, or a small piece of hardware inserted on the keyboard port — that captures the keys typed on a device and sends them to a third party. Its distinctive feature is that it works upstream of any website: whether the page you're typing on is legitimate makes no difference.",
        howItWorks:
          "The software version installs like other malware and places itself between the keyboard and the system: it sees the keystrokes before the app that receives them. The hardware version is a discreet unit plugged in between the keyboard and the computer, which limits it to devices physically accessible to others — a shared computer, a publicly accessible machine, an open desk. In both cases, what sets this method apart is its scope: it captures the correct password typed on the real site, the sentence started then deleted, the message never sent, the code copied from a notebook. Protections based on the idea of avoiding a fraudulent site have no purchase here, since there is no fake site.",
        warningSigns: [
          "Small box or unusual adapter between the keyboard cable and the computer",
          "Logins to your accounts from places or devices you don't recognize",
          "Accounts compromised despite not having clicked any link or reused any password",
          "On a shared computer, a session already open or an unknown program at startup",
          "Lag or stutter while typing, inconsistent and not conclusive on its own",
        ],
        howToVerify:
          "On a desktop computer whose physical access isn't guaranteed, check what's plugged in behind the machine — it's the only genuinely conclusive check in this entry. On the software side, review the programs launched at startup and accessibility permissions, which is the mechanism usually hijacked. On a computer you don't control, treat the question as undecidable and don't type anything sensitive into it.",
        whatToDo:
          "Don't type an important password on a shared or public computer. Enable two-factor authentication: it's what limits the damage best here, since a captured password is no longer enough on its own. A password manager that fills in fields without going through the keyboard also reduces exposure.",
        whatToDoIfVictim:
          "From another device, change the passwords of accounts used on the suspect machine, starting with your main email account, and close open sessions. If a hardware keylogger is found, don't remove it before photographing the setup: it's evidence to include with a police report. On a work computer, notify IT before doing anything. Report the incident to cybermalveillance.gouv.fr.",
        faq: [
          {
            question: "Does two-factor authentication really protect you?",
            answer:
              "It prevents a captured password alone from being enough, which is already the main point. It doesn't make an account unbreakable: a one-time code typed on the keyboard is captured like everything else, and is only valid for a few moments. A physical security key or approval in a dedicated app don't go through the keyboard and so aren't exposed this way.",
          },
          {
            question: "Does copy-pasting my password avoid capture?",
            answer:
              "Not reliably: the clipboard is also accessible to a program installed on the machine. The useful reasoning isn't how to get around capture on a compromised device, but not entering sensitive information on a device you can't vouch for.",
          },
        ],
        whyItWorks:
          "You type your password on the real site: none of the precautions against fake sites apply. On a shared computer, nobody looks at what's plugged in behind the machine.",
        example: {
          setting: "Public computer in a coworking space, when you go to check your email.",
          message:
            "Behind the tower, between the keyboard cable and the USB port: a small black adapter, unbranded, that looks like an extension.",
          giveaways: [
            "A keyboard plugs in directly, without an adapter.",
            "The computer is accessible to anyone.",
            "Nothing on screen gives it away.",
          ],
        },
        decisionChecklist: [
          {
            check: "Do you need to type an important password on a shared or public computer?",
            then: "Don't, or use your phone on your own connection.",
          },
          {
            check: "Is an unusual box or adapter plugged in between the keyboard and the computer?",
            then: "Don't touch it: photograph the setup and alert whoever runs the place or IT.",
          },
          {
            check: "Have you already entered credentials on this machine?",
            then: "From another device, change those passwords and sign out of sessions.",
          },
        ],
        prevention: [
          "Don't type an important password on a computer you don't control.",
          "Turn on two-factor authentication: a captured password is no longer enough.",
          "Use a password manager that fills in fields without going through the keyboard.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: ["keylogger", "keystroke logger", "keystroke capture"],
      },
    },
  },
  {
    code: "MAL-000005",
    slug: "virus-informatique",
    noSimulationReason:
      "Fiche chapeau du domaine : elle oriente vers la catégorie exacte à partir du symptôme. Une simulation ferait porter l'exercice sur un terme générique plutôt que sur une attaque précise.",
    name: "Virus informatique",
    categorySlug: "logiciels-malveillants",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Dans l'usage courant, « virus » désigne tout logiciel malveillant. Au sens strict, c'est une catégorie précise : un programme qui se copie dans d'autres fichiers pour se répandre.",
    attackerObjective: "controle_d_un_appareil",
    aliases: [
      "virus",
      "infection informatique",
      "virus PC",
      "attraper un virus",
    ],
    primaryVector: "file_attachment",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un virus informatique est un programme malveillant qui se reproduit en insérant une copie de lui-même dans d'autres fichiers ou programmes, et qui se propage lorsque ces fichiers sont ouverts ou partagés. Dans le langage courant, le mot désigne l'ensemble des logiciels malveillants ; cette fiche donne les deux sens et renvoie vers la catégorie exacte dans chaque cas.",
    howItWorks:
      "Au sens strict, un virus a besoin d'un hôte : il s'attache à un fichier existant, et son exécution dépend de l'ouverture de cet hôte. C'est ce qui le distingue du ver, qui se déplace seul, et du cheval de Troie, qui ne se copie pas. Historiquement il circulait par les disquettes et les fichiers exécutables partagés ; aujourd'hui, la forme la plus courante passe par les documents bureautiques contenant des macros, ce qui explique pourquoi les logiciels de bureautique demandent confirmation avant d'activer un contenu actif. Cela dit, si vous cherchez « virus » après avoir constaté un problème, la question qui vous concerne est rarement taxonomique : ce que vous observez oriente vers une catégorie précise. Des fichiers qui ne s'ouvrent plus avec une demande de paiement, c'est un rançongiciel. Une machine chaude et lente sans raison, c'est du cryptojacking. Des mots de passe qui fuient sans que vous ayez cliqué, c'est un logiciel espion ou un enregistreur de frappe. Une fenêtre alarmiste qui vend un nettoyeur, c'est un scareware — et souvent, il n'y a aucune infection du tout.",
    warningSigns: [
      "Document bureautique demandant d'activer les macros ou le contenu actif pour s'afficher",
      "Fichiers ou raccourcis apparus dans des dossiers que vous n'avez pas modifiés",
      "Programmes qui se lancent seuls, ou messages d'erreur répétés au démarrage",
      "Ralentissement général sans cause identifiable et sans changement d'usage",
      "Contacts qui reçoivent de votre part des fichiers que vous n'avez pas envoyés",
    ],
    triggers: ["curiosity", "trust", "urgency"],
    indicators: [],
    howToVerify:
      "Partez de ce que vous constatez plutôt que du mot : le symptôme désigne la catégorie, et chaque catégorie a une marche à suivre différente. Un examen antivirus à jour est un point de départ raisonnable, à condition de savoir ce qu'il vaut : une détection est une information, une absence de détection n'est pas un certificat de bonne santé.",
    whatToDo:
      "N'activez pas les macros d'un document reçu, sauf si vous en attendiez précisément un de la part de son expéditeur et que vous l'avez confirmé autrement que par le message lui-même. Maintenez le système et les logiciels à jour, et gardez des sauvegardes régulières déconnectées de la machine.",
    whatToDoIfVictim:
      "Déconnectez l'appareil du réseau et identifiez d'abord ce à quoi vous avez affaire, en repartant du symptôme : la conduite à tenir face à un rançongiciel n'a rien à voir avec celle qui convient à un logiciel espion. Ne partagez plus de fichiers depuis cette machine tant que la situation n'est pas établie. Signalez les faits sur cybermalveillance.gouv.fr, qui oriente selon le cas.",
    whyItWorks:
      "Un document demande d'activer son contenu pour s'afficher, et l'on clique pour pouvoir le lire. Ensuite, le mot virus recouvre tant de choses qu'on ne sait plus quoi faire : la panique remplace le diagnostic.",
    example: {
      setting: "Pièce jointe ouverte, reçue d'un fournisseur au sujet d'une facture.",
      message:
        "AVERTISSEMENT DE SÉCURITÉ : Les macros ont été désactivées.\nCe document a été créé dans une version plus récente. Pour afficher son contenu, cliquez sur Activer le contenu.",
      giveaways: [
        "Une facture n'a pas besoin de macros pour s'afficher.",
        "Le prétexte de la version plus récente sert à vous faire cliquer.",
        "Le document n'était pas attendu.",
      ],
    },
    decisionChecklist: [
      {
        check: "Un document reçu vous demande-t-il d'activer les macros ou le contenu ?",
        then: "N'activez rien, sauf si vous l'attendiez et l'avez confirmé avec l'expéditeur par un autre canal.",
      },
      {
        check: "Constatez-vous un symptôme précis : fichiers verrouillés, machine lente et chaude, alerte qui vend un nettoyeur ?",
        then: "Partez du symptôme : il désigne la fiche à suivre, chacune avec sa marche à suivre.",
      },
      {
        check: "Vos contacts reçoivent-ils de votre part des fichiers que vous n'avez pas envoyés ?",
        then: "Déconnectez l'appareil du réseau et prévenez-les de ne pas ouvrir ces fichiers.",
      },
    ],
    prevention: [
      "N'activez jamais les macros d'un document que vous n'attendiez pas.",
      "Gardez le système et les logiciels à jour.",
      "Faites des sauvegardes régulières sur un support que vous débranchez ensuite.",
    ],
    relatedAttackCodes: [
      "MAL-000006",
      "MAL-000002",
      "MAL-000001",
      "MAL-000009",
      "MAL-000010",
      "MAL-000003",
      "MAL-000007",
      "MAL-000008",
      "MAL-000004",
      "PHISH-000001",
    ],
    faq: [
      {
        question: "Mon téléphone peut-il avoir un virus ?",
        answer:
          "Au sens strict, la propagation par contamination de fichiers ne correspond pas au fonctionnement des téléphones modernes, où chaque application est isolée des autres. Ce qui existe bel et bien, en revanche, ce sont les applications malveillantes et les autorisations abusives — c'est là qu'il faut chercher, plutôt que sous le mot « virus ».",
      },
      {
        question: "Un antivirus gratuit suffit-il ?",
        answer:
          "La question la plus utile n'est pas le prix mais ce que vous en attendez. Un antivirus arrête ce qui est déjà connu ; il ne remplace ni les mises à jour, ni des sauvegardes déconnectées, ni le fait de n'installer que depuis les sources d'origine. Ces trois mesures évitent plus de situations qu'un choix de produit.",
      },
      {
        question:
          "Comment savoir de quel type de logiciel malveillant il s'agit ?",
        answer:
          "Par ce que vous observez. Fichiers verrouillés et rançon demandée : rançongiciel. Appareil chaud et lent : cryptojacking. Alerte agressive qui vous vend une solution : scareware. Comptes compromis sans clic de votre part : logiciel espion ou enregistreur de frappe. Chacune de ces fiches donne la conduite correspondante.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "computer-virus",
        name: "Computer Virus",
        plainLanguageDefinition:
          "In everyday use, \"virus\" refers to any piece of malware. Strictly speaking, it's a precise category: a program that copies itself into other files to spread.",
        definition:
          "A computer virus is malicious software that reproduces by inserting a copy of itself into other files or programs, and that spreads when those files are opened or shared. In everyday language the word covers malware as a whole; this entry gives both meanings and points to the exact category in each case.",
        howItWorks:
          "Strictly speaking, a virus needs a host: it attaches itself to an existing file, and its execution depends on that host being opened. This is what sets it apart from a worm, which moves on its own, and from a trojan horse, which doesn't copy itself. Historically it spread through floppy disks and shared executable files; today the most common form travels through office documents containing macros, which is why office software asks for confirmation before enabling active content. That said, if you're searching for \"virus\" after noticing a problem, the question that actually concerns you is rarely about terminology: what you observe points to a specific category. Files that no longer open with a payment demand: that's ransomware. A hot, slow machine for no reason: that's cryptojacking. Passwords leaking without you clicking anything: that's spyware or a keylogger. An alarming window selling a cleanup tool: that's scareware — and often, there's no infection at all.",
        warningSigns: [
          "Office document asking you to enable macros or active content to display",
          "Files or shortcuts appearing in folders you didn't touch",
          "Programs launching on their own, or repeated error messages at startup",
          "General slowdown with no identifiable cause and no change in use",
          "Contacts receiving files from you that you never sent",
        ],
        howToVerify:
          "Start from what you observe rather than the word: the symptom points to the category, and each category calls for a different course of action. An up-to-date antivirus scan is a reasonable starting point, provided you know what it's worth: a detection is information, an absence of detection is not a certificate of good health.",
        whatToDo:
          "Don't enable macros in a document you received, unless you were specifically expecting one from its sender and confirmed it through a channel other than the message itself. Keep the system and software updated, and keep regular backups disconnected from the machine.",
        whatToDoIfVictim:
          "Disconnect the device from the network and first identify what you're dealing with, starting from the symptom: the response to ransomware has nothing to do with the one suited to spyware. Stop sharing files from this machine until the situation is established. Report the incident to cybermalveillance.gouv.fr, which will direct you depending on the case.",
        faq: [
          {
            question: "Can my phone get a virus?",
            answer:
              "Strictly speaking, spreading by infecting files doesn't match how modern phones work, where each app is isolated from the others. What does exist, though, are malicious apps and excessive permissions — that's where to look, rather than under the word \"virus\".",
          },
          {
            question: "Is free antivirus software enough?",
            answer:
              "The more useful question isn't the price but what you expect from it. Antivirus software stops what's already known; it doesn't replace updates, disconnected backups, or only installing from original sources. Those three measures prevent more situations than a choice of product.",
          },
          {
            question: "How can I tell which type of malware it is?",
            answer:
              "By what you observe. Locked files with a ransom demand: ransomware. A hot, slow device: cryptojacking. An aggressive alert selling you a solution: scareware. Compromised accounts with no click on your part: spyware or a keylogger. Each of these entries gives the matching course of action.",
          },
        ],
        whyItWorks:
          "A document asks you to enable its content to display, and you click so you can read it. Afterward, the word virus covers so many things that you no longer know what to do: panic replaces diagnosis.",
        example: {
          setting: "Attachment opened, received from a supplier about an invoice.",
          message:
            "SECURITY WARNING: Macros have been disabled.\nThis document was created in a newer version. To display its content, click Enable Content.",
          giveaways: [
            "An invoice doesn't need macros to display.",
            "The \"newer version\" excuse is there to make you click.",
            "The document wasn't expected.",
          ],
        },
        decisionChecklist: [
          {
            check: "Does a document you received ask you to enable macros or content?",
            then: "Enable nothing, unless you were expecting it and confirmed with the sender through another channel.",
          },
          {
            check: "Are you seeing a specific symptom: locked files, a slow hot machine, an alert selling a cleaner?",
            then: "Start from the symptom: it points to the page to follow, each with its own steps.",
          },
          {
            check: "Are your contacts receiving files from you that you didn't send?",
            then: "Disconnect the device from the network and warn them not to open those files.",
          },
        ],
        prevention: [
          "Never enable macros in a document you weren't expecting.",
          "Keep the system and software up to date.",
          "Back up regularly to a device you then unplug.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: ["virus", "computer infection", "PC virus", "catching a virus"],
      },
    },
  },
  {
    code: "MAL-000006",
    slug: "ver-informatique",
    noSimulationReason:
      "Rien n'arrive à juger : un ver se propage sans action de l'utilisateur, et la protection est une configuration — mises à jour, mots de passe d'usine changés. Un scénario mettrait en scène une décision que personne ne prend jamais.",
    name: "Ver informatique",
    categorySlug: "logiciels-malveillants",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un programme qui se propage tout seul d'un appareil à l'autre, sans que personne n'ouvre ni ne clique quoi que ce soit. C'est ce qui le rend rapide.",
    attackerObjective: "controle_d_un_appareil",
    aliases: ["worm", "ver", "ver réseau"],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un ver est un logiciel malveillant qui se reproduit et se déplace de lui-même à travers un réseau, sans nécessiter d'action de l'utilisateur ni de fichier hôte. C'est cette autonomie qui le distingue du virus, lequel a besoin d'être ouvert, et du cheval de Troie, qui a besoin d'être installé.",
    howItWorks:
      "Le ver cherche, depuis une machine où il s'exécute, les autres machines joignables, et exploite pour s'y installer une faiblesse qui ne demande pas d'accord humain : un défaut logiciel non corrigé, un service ouvert, un mot de passe par défaut jamais changé. Puis il recommence depuis chaque nouvelle machine, ce qui donne une progression rapide. Deux conséquences pratiques en découlent. La première est que la vigilance individuelle — ne pas cliquer, ne pas ouvrir — n'y peut rien : il n'y a rien à cliquer. La seconde est que la protection est essentiellement collective et matérielle : appliquer les mises à jour, changer les mots de passe d'usine, et ne pas exposer inutilement d'appareil sur internet. Dans un foyer, la box et les objets connectés sont concernés au même titre que les ordinateurs.",
    warningSigns: [
      "Réseau lent ou saturé sans usage qui l'explique",
      "Plusieurs appareils du même réseau qui se comportent anormalement au même moment",
      "Appareils qui redémarrent seuls, ou services qui s'arrêtent sans raison",
      "Trafic sortant continu depuis un appareil que personne n'utilise",
      "Avertissement de votre fournisseur d'accès signalant une activité anormale sur votre ligne",
    ],
    triggers: ["urgency"],
    indicators: [],
    howToVerify:
      "Regardez l'échelle : un ver touche plusieurs appareils du même réseau, ce qui le distingue d'un problème isolé. Passez en revue la liste des appareils connectés à votre box et l'état de leurs mises à jour, en particulier ceux qui n'ont pas d'écran et que l'on oublie.",
    whatToDo:
      "Activez les mises à jour automatiques sur tout ce qui est connecté, y compris la box et les objets sans écran. Changez les mots de passe d'usine. N'exposez pas d'appareil directement sur internet sans nécessité — c'est ce que fait, souvent sans le dire clairement, l'option d'accès à distance de nombreux équipements domestiques.",
    whatToDoIfVictim:
      "Isolez le réseau : coupez l'accès internet plutôt que d'éteindre un seul appareil, la propagation étant latérale. Mettez à jour puis redémarrez les équipements un par un, en commençant par la box. Sur un réseau professionnel, prévenez le service informatique avant toute manipulation, une intervention non coordonnée pouvant effacer des traces nécessaires. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Il n'y a rien à cliquer : la vigilance habituelle ne sert à rien. Le ver profite des appareils oubliés, ceux qui ne sont plus mis à jour et gardent leur mot de passe d'usine.",
    example: {
      setting: "Un soir, plusieurs appareils de la maison ralentissent en même temps.",
      message:
        "Interface de la box : trafic sortant élevé depuis l'enregistreur vidéo, l'imprimante et un ordinateur.\nDernière mise à jour de l'enregistreur : il y a 4 ans.",
      giveaways: [
        "Plusieurs appareils sont touchés en même temps.",
        "Un équipement n'est plus mis à jour depuis longtemps.",
        "Personne n'a rien ouvert ni cliqué.",
      ],
    },
    decisionChecklist: [
      {
        check: "Plusieurs appareils du même réseau se comportent-ils anormalement en même temps ?",
        then: "Coupez l'accès internet de la box plutôt qu'un seul appareil.",
      },
      {
        check: "Des appareils ne sont-ils plus mis à jour, ou gardent-ils leur mot de passe d'usine ?",
        then: "Mettez à jour, puis redémarrez les équipements un par un, en commençant par la box.",
      },
      {
        check: "S'agit-il d'un réseau professionnel ?",
        then: "Prévenez le service informatique avant toute manipulation.",
      },
    ],
    prevention: [
      "Activez les mises à jour automatiques sur tout ce qui est connecté.",
      "Changez les mots de passe d'usine.",
      "N'exposez pas d'appareil sur internet sans nécessité.",
    ],
    relatedAttackCodes: [
      "MAL-000005",
      "MAL-000008",
      "MOB-000010",
      "MOB-000005",
      "MAL-000002",
      "MAL-000001",
      "NET-000006",
    ],
    faq: [
      {
        question: "Comment se protéger si aucun clic n'est nécessaire ?",
        answer:
          "En retirant ce dont le ver a besoin : un défaut non corrigé ou un accès laissé ouvert. Les mises à jour et les mots de passe par défaut changés sont ici la protection principale, et la prudence face aux messages, si utile soit-elle ailleurs, n'a aucune prise.",
      },
      {
        question: "Mes objets connectés sont-ils concernés ?",
        answer:
          "Ce sont souvent les plus exposés, parce qu'ils restent allumés en permanence, se mettent rarement à jour tout seuls et gardent leur mot de passe d'usine. Une caméra ou un enregistreur oublié dans un coin est un point d'entrée dont personne ne surveille l'état.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "computer-worm",
        name: "Computer Worm",
        plainLanguageDefinition:
          "A program that spreads by itself from one device to another, without anyone opening or clicking anything. That's what makes it fast.",
        definition:
          "A worm is malicious software that reproduces and moves through a network on its own, without needing any user action or host file. This autonomy sets it apart from a virus, which needs to be opened, and from a trojan horse, which needs to be installed.",
        howItWorks:
          "The worm searches, from a machine where it's running, for other reachable machines, and exploits a weakness that requires no human approval to install itself there: an unpatched software flaw, an open service, a default password never changed. It then starts over from each new machine, which produces rapid progression. Two practical consequences follow. First, individual vigilance — not clicking, not opening — is powerless here: there's nothing to click. Second, protection is essentially collective and material: applying updates, changing default passwords, and not needlessly exposing a device to the internet. In a household, the router and connected devices are just as concerned as computers.",
        warningSigns: [
          "Network slow or saturated with no usage that explains it",
          "Several devices on the same network behaving abnormally at the same time",
          "Devices restarting on their own, or services stopping for no reason",
          "Continuous outgoing traffic from a device nobody is using",
          "A warning from your internet provider flagging unusual activity on your line",
        ],
        howToVerify:
          "Look at the scale: a worm affects several devices on the same network, which sets it apart from an isolated problem. Review the list of devices connected to your router and the state of their updates, especially those without a screen that get forgotten.",
        whatToDo:
          "Enable automatic updates on everything connected, including the router and screenless devices. Change default passwords. Don't expose a device directly to the internet without necessity — which is often, without saying so clearly, what the remote-access option on many home devices does.",
        whatToDoIfVictim:
          "Isolate the network: cut internet access rather than turning off a single device, since the spread is lateral. Update then restart devices one by one, starting with the router. On a work network, notify IT before doing anything, since uncoordinated action can erase evidence that's needed. Report the incident to cybermalveillance.gouv.fr.",
        faq: [
          {
            question: "How do you protect yourself if no click is needed?",
            answer:
              "By removing what the worm needs: an unpatched flaw or an access left open. Updates and changed default passwords are the main protection here, and caution around messages, however useful elsewhere, has no purchase at all.",
          },
          {
            question: "Are my connected devices affected?",
            answer:
              "They're often the most exposed, because they stay on all the time, rarely update themselves, and keep their factory password. A camera or recorder forgotten in a corner is an entry point nobody keeps an eye on.",
          },
        ],
        whyItWorks:
          "There's nothing to click: the usual vigilance is no help. The worm takes advantage of forgotten devices, the ones that no longer get updates and still have their factory password.",
        example: {
          setting: "One evening, several devices in the home slow down at the same time.",
          message:
            "Router interface: high outgoing traffic from the video recorder, the printer and a computer.\nVideo recorder's last update: 4 years ago.",
          giveaways: [
            "Several devices are affected at the same time.",
            "One device hasn't been updated in a long time.",
            "Nobody opened or clicked anything.",
          ],
        },
        decisionChecklist: [
          {
            check: "Are several devices on the same network behaving abnormally at the same time?",
            then: "Cut the router's internet access rather than a single device.",
          },
          {
            check: "Have some devices stopped getting updates, or do they still have their factory password?",
            then: "Update them, then restart the devices one by one, starting with the router.",
          },
          {
            check: "Is it a work network?",
            then: "Alert IT before doing anything.",
          },
        ],
        prevention: [
          "Turn on automatic updates on everything connected.",
          "Change factory passwords.",
          "Don't expose a device to the internet without a reason.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: ["worm", "network worm"],
      },
    },
  },
  {
    code: "MAL-000007",
    slug: "rootkit",
    noSimulationReason:
      "La propriété qui définit un rootkit est de ne rien laisser observer depuis la machine. Un exercice de reconnaissance apprendrait à repérer ce qui, par construction, ne se repère pas depuis l'appareil visé.",
    name: "Rootkit",
    categorySlug: "logiciels-malveillants",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Un logiciel malveillant qui se cache du système d'exploitation lui-même. Il ne figure pas dans la liste des programmes, parce que c'est lui qui décide de ce que cette liste affiche.",
    attackerObjective: "controle_d_un_appareil",
    aliases: ["rootkit", "outil de dissimulation", "bootkit"],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un rootkit est un ensemble de composants malveillants qui s'installe à un niveau de privilège élevé afin de dissimuler sa présence et celle d'autres programmes au système d'exploitation lui-même. Sa fonction propre n'est pas de nuire directement, mais de rendre invisible ce qui nuit.",
    howItWorks:
      "Un logiciel ordinaire demande au système la liste des fichiers et des processus, et affiche ce qu'on lui répond. Le rootkit s'installe en amont de cette réponse : il modifie ce que le système rapporte, de sorte que ses propres fichiers et processus soient omis de la liste avant même qu'un antivirus ne la consulte. Cela explique une situation autrement déroutante — une machine qui se comporte anormalement pendant que tous les outils lancés depuis elle la déclarent saine. La conséquence méthodologique est directe et vaut au-delà de cette fiche : un système ne peut pas s'examiner lui-même de façon fiable. La vérification qui a du sens vient de l'extérieur, en démarrant l'appareil sur un support indépendant, ou en observant depuis le réseau ce que la machine émet.",
    warningSigns: [
      "Comportement anormal persistant alors que tous les examens depuis la machine ne rapportent rien",
      "Antivirus qui se désactive seul, ou qui ne parvient plus à se mettre à jour",
      "Écarts entre ce que la machine affiche et ce que l'on observe depuis un autre point : trafic réseau, taille des fichiers, espace disque",
      "Problème qui réapparaît à l'identique après une désinfection déclarée réussie",
      "Démarrage sensiblement plus long, ou message lié au démarrage sécurisé",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Ne concluez pas depuis la machine soupçonnée. Comparez ce qu'elle affirme avec une observation extérieure — le trafic vu depuis le routeur, un démarrage sur un support externe. C'est laborieux, et c'est aussi la raison pour laquelle la réponse pratique passe souvent directement par la réinstallation.",
    whatToDo:
      "Gardez le démarrage sécurisé activé et le système à jour : c'est ce qui rend l'installation à ce niveau difficile. Évitez d'utiliser un compte administrateur au quotidien, un rootkit ayant besoin de privilèges élevés pour se placer.",
    whatToDoIfVictim:
      "Considérez la machine comme non digne de confiance tant qu'elle n'a pas été réinstallée, et changez vos mots de passe depuis un autre appareil, non depuis celle-ci. La réinstallation complète du système, formatage compris, est ici la réponse normale plutôt qu'une mesure extrême. Sauvegardez vos documents personnels, pas les programmes ni les fichiers système. Sur un appareil professionnel, ne réinstallez pas de votre propre initiative : prévenez le service informatique, qui peut avoir besoin de la machine en l'état. Faites-vous accompagner si l'opération n'est pas dans vos habitudes — cybermalveillance.gouv.fr oriente vers des prestataires.",
    whyItWorks:
      "Tous les outils lancés depuis la machine la déclarent saine : on finit par croire que le problème vient d'ailleurs. Le rootkit contrôle justement ce que ces outils peuvent voir.",
    example: {
      setting: "Ordinateur qui se comporte bizarrement depuis des semaines.",
      message:
        "Analyse terminée : aucune menace détectée.\nPendant ce temps, la box montre que l'ordinateur envoie des données en continu, même la nuit.",
      giveaways: [
        "L'analyse dit tout va bien, mais l'observation extérieure dit le contraire.",
        "Le problème est revenu après une désinfection déclarée réussie.",
        "L'antivirus ne parvient plus à se mettre à jour.",
      ],
    },
    decisionChecklist: [
      {
        check: "La machine se comporte-t-elle mal alors que tous les examens faits depuis elle disent qu'elle est saine ?",
        then: "Ne concluez pas depuis cette machine : comparez avec ce que montre la box.",
      },
      {
        check: "Le problème revient-il après une désinfection ?",
        then: "Prévoyez une réinstallation complète du système, après avoir sauvegardé vos documents personnels.",
      },
      {
        check: "S'agit-il d'un appareil professionnel ?",
        then: "Ne réinstallez rien vous-même : prévenez le service informatique.",
      },
    ],
    prevention: [
      "Gardez le démarrage sécurisé activé et le système à jour.",
      "N'utilisez pas un compte administrateur au quotidien.",
      "Faites des sauvegardes régulières de vos documents, sur un support débranché ensuite.",
    ],
    relatedAttackCodes: [
      "MAL-000003",
      "MAL-000008",
      "MAL-000002",
      "MAL-000005",
    ],
    faq: [
      {
        question: "Pourquoi mon antivirus ne voit-il rien ?",
        answer:
          "Parce qu'il interroge le système, et que le système lui répond ce que le rootkit veut lui faire répondre. Ce n'est pas un défaut de l'antivirus : c'est la limite de tout examen mené depuis l'intérieur de la machine que l'on soupçonne.",
      },
      {
        question: "Réinstaller le système suffit-il ?",
        answer:
          "Dans la grande majorité des situations rencontrées par un particulier, oui — à condition de formater le disque et de ne pas restaurer une image système antérieure. Ne réinstallez pas les mêmes programmes depuis les mêmes sources si l'un d'eux est à l'origine du problème.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "rootkit",
        name: "Rootkit",
        plainLanguageDefinition:
          "Malware that hides from the operating system itself. It doesn't show up in the list of programs, because it's the one deciding what that list displays.",
        definition:
          "A rootkit is a set of malicious components that installs itself at an elevated privilege level in order to hide its own presence and that of other programs from the operating system itself. Its own purpose isn't to cause direct harm, but to make what does cause harm invisible.",
        howItWorks:
          "Ordinary software asks the system for the list of files and processes, and displays whatever answer it gets. A rootkit installs itself upstream of that answer: it alters what the system reports, so that its own files and processes are left off the list before any antivirus even queries it. That explains an otherwise baffling situation — a machine behaving abnormally while every tool run from it declares it clean. The methodological consequence is direct and holds beyond this entry: a system cannot reliably examine itself. A meaningful check comes from outside, by booting the device from independent media, or by observing what the machine sends out over the network.",
        warningSigns: [
          "Persistent abnormal behavior while every check run from the machine reports nothing",
          "Antivirus software that disables itself, or can no longer update",
          "Discrepancies between what the machine reports and what's observed from another point: network traffic, file sizes, disk space",
          "A problem that returns identically after a disinfection declared successful",
          "Noticeably longer startup, or a secure-boot related message",
        ],
        howToVerify:
          "Don't draw conclusions from the suspected machine. Compare what it claims against an outside observation — traffic seen from the router, a boot from external media. It's tedious, which is also why the practical answer often goes straight to reinstalling.",
        whatToDo:
          "Keep secure boot enabled and the system updated: that's what makes installation at this level difficult. Avoid using an administrator account day to day, since a rootkit needs elevated privileges to install itself.",
        whatToDoIfVictim:
          "Treat the machine as untrustworthy until it has been reinstalled, and change your passwords from another device, not from this one. A full system reinstall, including formatting, is the normal response here rather than an extreme measure. Back up your personal documents, not the programs or system files. On a work device, don't reinstall on your own initiative: notify IT, which may need the machine as is. Get help if the operation isn't something you're used to — cybermalveillance.gouv.fr directs you to service providers.",
        faq: [
          {
            question: "Why doesn't my antivirus see anything?",
            answer:
              "Because it queries the system, and the system answers with whatever the rootkit wants it to answer. That's not a flaw in the antivirus: it's the limit of any check run from inside the machine under suspicion.",
          },
          {
            question: "Is reinstalling the system enough?",
            answer:
              "In the large majority of situations an individual encounters, yes — provided you format the drive and don't restore an earlier system image. Don't reinstall the same programs from the same sources if one of them caused the problem.",
          },
        ],
        whyItWorks:
          "Every tool run from the machine says it's clean: you end up believing the problem lies elsewhere. The rootkit controls exactly what those tools are able to see.",
        example: {
          setting: "Computer that has been behaving strangely for weeks.",
          message:
            "Scan complete: no threats detected.\nMeanwhile, the router shows the computer sending data continuously, even at night.",
          giveaways: [
            "The scan says all is well, but outside observation says otherwise.",
            "The problem came back after a cleanup reported as successful.",
            "The antivirus can no longer update.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the machine misbehaving while every scan run from it says it's clean?",
            then: "Don't draw conclusions from that machine: compare with what the router shows.",
          },
          {
            check: "Does the problem come back after a cleanup?",
            then: "Plan a full reinstall of the system, after backing up your personal documents.",
          },
          {
            check: "Is it a work device?",
            then: "Don't reinstall anything yourself: alert IT.",
          },
        ],
        prevention: [
          "Keep secure boot enabled and the system up to date.",
          "Don't use an administrator account for everyday tasks.",
          "Back up your documents regularly to a device you then unplug.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: ["rootkit", "concealment tool", "bootkit"],
      },
    },
  },
  {
    code: "MAL-000008",
    slug: "botnet",
    noSimulationReason:
      "L'appareil enrôlé n'est pas la cible et ne reçoit rien ; le seul signal vient souvent du fournisseur d'accès. Il n'y a pas de moment de décision à reconstituer.",
    name: "Botnet (réseau d'appareils zombies)",
    categorySlug: "logiciels-malveillants",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Votre appareil est enrôlé dans un réseau qui attaque d'autres cibles. Vous n'êtes pas la victime visée : vous êtes le moyen, et c'est pourquoi rien ne vous alerte.",
    attackerObjective: "controle_d_un_appareil",
    aliases: [
      "botnet",
      "réseau de machines zombies",
      "machine zombie",
      "appareil zombie",
    ],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Un botnet est un ensemble d'appareils compromis, pilotés à distance par un même opérateur, et utilisés collectivement pour envoyer du courrier indésirable, saturer des services, relayer du trafic ou tester des identifiants volés. L'appareil enrôlé n'est pas la cible de l'attaque : il en est l'instrument.",
    howItWorks:
      "L'enrôlement passe par les chemins habituels — programme piégé, défaut logiciel non corrigé, mot de passe d'usine sur un appareil connecté. Ce qui distingue ce cas est le modèle économique, dont découle tout le reste : la valeur d'un appareil enrôlé tient au nombre, pas à ce qu'il contient. Le programme est donc réglé pour ne pas se faire remarquer, et n'utilise qu'une fraction des ressources de la machine. C'est pourquoi les objets connectés — caméras, enregistreurs, box, imprimantes réseau — sont des cibles de choix : allumés en permanence, rarement mis à jour, et dépourvus d'écran pour signaler quoi que ce soit. Le seul retour visible arrive souvent de l'extérieur : un fournisseur d'accès qui signale une activité anormale, une adresse bloquée, des messages qui n'arrivent plus à destination.",
    warningSigns: [
      "Avertissement du fournisseur d'accès concernant une activité anormale sur votre ligne",
      "Vos courriels finissent en indésirable chez vos correspondants, ou votre adresse est rejetée",
      "Trafic sortant continu alors que personne n'utilise le réseau, notamment la nuit",
      "Adresse IP bloquée par des sites, ou vérifications anti-robot devenues systématiques",
      "Objet connecté qui chauffe ou répond mal alors que son usage n'a pas changé",
    ],
    triggers: ["trust"],
    indicators: [],
    howToVerify:
      "Regardez le trafic plutôt que l'appareil : dans l'interface de votre box, la liste des appareils connectés et leur consommation à une heure où personne n'est actif est le meilleur indice accessible. Un appareil qui émet en continu la nuit mérite d'être examiné. Prenez au sérieux un signalement venu de votre fournisseur d'accès, c'est souvent l'information la plus fiable dont vous disposerez.",
    whatToDo:
      "Changez les mots de passe d'usine de tout ce qui est connecté, box comprise, et activez les mises à jour automatiques. Désactivez l'accès à distance des équipements qui n'en ont pas besoin. Retirez du réseau les appareils qui ne reçoivent plus de mises à jour de leur fabricant.",
    whatToDoIfVictim:
      "Identifiez l'appareil concerné depuis l'interface de la box, puis remettez-le en configuration d'usine et mettez-le à jour avant de le remettre en service — pour un objet connecté sans écran, c'est généralement la seule opération disponible. Changez ensuite son mot de passe et celui de la box. Si l'appareil ne reçoit plus de mises à jour, ne le rebranchez pas. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "L'appareil enrôlé continue de fonctionner normalement, et ce n'est pas vous que l'attaque vise : il n'y a aucune raison de s'inquiéter. Les objets sans écran ne peuvent rien signaler.",
    example: {
      setting: "Email de votre fournisseur d'accès.",
      message:
        "Nous avons détecté depuis votre ligne un trafic sortant inhabituel, caractéristique d'un équipement compromis. Nous vous invitons à vérifier les appareils connectés à votre box.",
      giveaways: [
        "Personne au foyer n'utilise la connexion de façon inhabituelle.",
        "Les vérifications anti-robot sont devenues systématiques sur les sites.",
        "Une caméra connectée garde son mot de passe d'usine.",
      ],
    },
    decisionChecklist: [
      {
        check: "Votre fournisseur d'accès vous signale-t-il une activité anormale sur votre ligne ?",
        then: "Prenez-le au sérieux : ouvrez votre espace client par vous-même, puis l'interface de la box.",
      },
      {
        check: "Un appareil émet-il du trafic en continu, la nuit, quand personne ne s'en sert ?",
        then: "Remettez-le en configuration d'usine et mettez-le à jour avant de le rebrancher.",
      },
      {
        check: "Cet appareil ne reçoit-il plus de mises à jour de son fabricant ?",
        then: "Ne le rebranchez pas.",
      },
    ],
    prevention: [
      "Changez les mots de passe d'usine de tout ce qui est connecté, box comprise.",
      "Activez les mises à jour automatiques.",
      "Désactivez l'accès à distance des équipements qui n'en ont pas besoin.",
    ],
    relatedAttackCodes: [
      "MAL-000006",
      "MOB-000005",
      "MOB-000010",
      "MOB-000009",
      "MAL-000002",
      "MAL-000007",
      "MAL-000009",
      "MAL-000005",
      "NET-000003",
      "NET-000006",
    ],
    faq: [
      {
        question:
          "Est-ce que je risque quelque chose alors que je ne suis pas la cible ?",
        answer:
          "Oui, à deux titres. Le premier est concret et immédiat : votre ligne peut être bloquée, votre adresse rejetée, votre connexion dégradée. Le second est que l'accès qui a permis l'enrôlement reste ouvert et peut servir à autre chose — un appareil enrôlé est un appareil contrôlé.",
      },
      {
        question: "Mon ordinateur semble normal, est-ce possible quand même ?",
        answer:
          "C'est le cas le plus fréquent, et c'est délibéré : un appareil qui rame se fait réparer, donc se perd. Le procédé n'a d'intérêt que par le nombre, ce qui rend la discrétion rentable.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "botnet",
        name: "Botnet",
        plainLanguageDefinition:
          "Your device has been recruited into a network that attacks other targets. You aren't the intended victim: you're the instrument, which is why nothing alerts you.",
        definition:
          "A botnet is a set of compromised devices, remotely controlled by a single operator, and used collectively to send spam, overwhelm services, relay traffic, or test stolen credentials. The recruited device isn't the target of the attack: it's the instrument.",
        howItWorks:
          "Recruitment follows the usual paths — a trojan program, an unpatched software flaw, a default password on a connected device. What sets this case apart is the business model, from which everything else follows: a recruited device's value lies in numbers, not in what it contains. The program is therefore tuned to stay unnoticed, using only a fraction of the machine's resources. That's why connected devices — cameras, recorders, routers, network printers — are prime targets: always on, rarely updated, and without a screen to flag anything. The only visible sign often comes from outside: an internet provider flagging unusual activity, a blocked address, messages that no longer reach their destination.",
        warningSigns: [
          "Warning from your internet provider about unusual activity on your line",
          "Your emails end up in recipients' spam folders, or your address gets rejected",
          "Continuous outgoing traffic while nobody is using the network, especially at night",
          "IP address blocked by websites, or anti-robot checks that have become constant",
          "A connected device running hot or responding poorly with no change in how it's used",
        ],
        howToVerify:
          "Look at the traffic rather than the device: in your router's interface, the list of connected devices and their consumption at a time when nobody is active is the most accessible clue. A device transmitting continuously at night deserves a closer look. Take seriously any report from your internet provider — it's often the most reliable information you'll have.",
        whatToDo:
          "Change the default passwords of everything connected, including the router, and enable automatic updates. Disable remote access on equipment that doesn't need it. Remove from the network any devices that no longer receive updates from their manufacturer.",
        whatToDoIfVictim:
          "Identify the device involved from the router's interface, then reset it to factory settings and update it before putting it back into service — for a screenless connected device, that's generally the only option available. Then change its password and the router's. If the device no longer receives updates, don't plug it back in. Report the incident to cybermalveillance.gouv.fr.",
        faq: [
          {
            question: "Am I at risk even though I'm not the target?",
            answer:
              "Yes, in two ways. The first is concrete and immediate: your line can be blocked, your address rejected, your connection degraded. The second is that the access that allowed the recruitment stays open and can be used for something else — a recruited device is a controlled device.",
          },
          {
            question: "My computer seems normal — is that possible even so?",
            answer:
              "It's the most common case, and it's deliberate: a device that lags gets fixed, and so gets lost to the operator. The method only pays off through numbers, which makes discretion worthwhile.",
          },
        ],
        whyItWorks:
          "The enlisted device keeps working normally, and you're not the one being attacked: there's no reason to worry. Devices without a screen can't report anything.",
        example: {
          setting: "Email from your internet provider.",
          message:
            "We have detected unusual outgoing traffic from your line, typical of a compromised device. We invite you to check the devices connected to your router.",
          giveaways: [
            "Nobody in the household uses the connection unusually.",
            "Anti-robot checks have become constant on websites.",
            "A connected camera still has its factory password.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is your internet provider reporting abnormal activity on your line?",
            then: "Take it seriously: open your customer account on your own, then the router's interface.",
          },
          {
            check: "Is a device sending traffic continuously, at night, when no one is using it?",
            then: "Reset it to factory settings and update it before reconnecting it.",
          },
          {
            check: "Has this device stopped receiving updates from its manufacturer?",
            then: "Don't reconnect it.",
          },
        ],
        prevention: [
          "Change the factory passwords of everything connected, router included.",
          "Turn on automatic updates.",
          "Turn off remote access on devices that don't need it.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "botnet",
          "zombie device network",
          "zombie machine",
          "zombie device",
        ],
      },
    },
  },
  {
    code: "MAL-000009",
    slug: "cryptojacking",
    noSimulationReason:
      "Le diagnostic passe par l'observation de la charge processeur sur l'appareil, pas par le jugement d'un message. C'est un geste de vérification, que le guide couvre mieux qu'un scénario à choix.",
    name: "Cryptojacking (minage pirate)",
    categorySlug: "logiciels-malveillants",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Votre appareil calcule pour quelqu'un d'autre, afin de produire de la cryptomonnaie. Rien n'est volé dans vos fichiers : ce sont l'électricité, la vitesse et la durée de vie du matériel qui y passent.",
    attackerObjective: "controle_d_un_appareil",
    aliases: [
      "minage pirate",
      "cryptominage malveillant",
      "cryptojacking",
      "minage caché",
    ],
    primaryVector: "web",
    primaryDimension: "device_integrity_awareness",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Le cryptojacking est l'utilisation à votre insu de la puissance de calcul de votre appareil pour produire de la cryptomonnaie au profit d'un tiers. Il se distingue des autres logiciels malveillants par ce qu'il vise : ni vos données ni vos comptes, mais une ressource matérielle.",
    howItWorks:
      "Deux formes coexistent. La première est un programme installé, qui tourne en arrière-plan et se relance au démarrage. La seconde s'exécute dans le navigateur, à la simple visite d'une page ou par une extension, et s'arrête quand l'onglet se ferme — ce qui explique qu'un ordinateur puisse chauffer sur certains sites et pas sur d'autres. Le calcul mobilise le processeur en continu, d'où la chaleur, les ventilateurs, la lenteur générale et, sur un portable ou un téléphone, une autonomie qui s'effondre. Les programmes soignés modèrent leur consommation quand vous utilisez la machine et accélèrent lorsque vous la laissez au repos, ce qui rend le symptôme plus difficile à relier à une cause. Le préjudice est réel bien qu'indirect : consommation électrique, usure accélérée, et sur un téléphone, une batterie qui vieillit vite.",
    warningSigns: [
      "Ventilateurs bruyants et appareil chaud alors que vous ne faites rien d'exigeant",
      "Lenteur générale qui disparaît à la fermeture du navigateur ou d'un onglet précis",
      "Autonomie très réduite, téléphone tiède en poche",
      "Processeur fortement occupé au repos, par un processus dont le nom ne vous dit rien",
      "Facture d'électricité en hausse sans changement d'équipement, pour un appareil laissé allumé",
    ],
    triggers: ["curiosity"],
    indicators: [],
    howToVerify:
      "Ouvrez le gestionnaire des tâches ou le moniteur d'activité et regardez ce qui occupe le processeur au repos. Fermez ensuite le navigateur : si la charge retombe aussitôt, cherchez du côté d'un onglet ou d'une extension plutôt que d'un programme installé. C'est l'une des rares fiches de cette famille où la vérification depuis la machine est concluante, le procédé n'ayant pas intérêt à se cacher au point de renoncer au calcul.",
    whatToDo:
      "Passez en revue les extensions de votre navigateur et retirez celles que vous n'utilisez pas — c'est le vecteur le plus courant de la forme navigateur. Maintenez le navigateur et le système à jour. Ne laissez pas ouverts en permanence des onglets de sites dont vous ne connaissez pas l'origine.",
    whatToDoIfVictim:
      "Identifiez le processus ou l'onglet responsable et supprimez ce qui l'installe : extension, programme, page laissée ouverte. Si la charge revient après redémarrage sans navigateur ouvert, il s'agit d'un programme installé, souvent arrivé avec un autre — traitez alors la machine comme compromise plus largement, et changez depuis un autre appareil les mots de passe qui y étaient enregistrés. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "Un ordinateur lent ou chaud paraît simplement vieux. Les programmes les mieux faits ralentissent quand vous travaillez et accélèrent quand vous partez, ce qui brouille le lien entre la cause et l'effet.",
    example: {
      setting: "Gestionnaire des tâches ouvert un soir où l'ordinateur chauffe sans raison.",
      message:
        "Processeur : 96 % d'utilisation\nProcessus principal : svc_host_update — 91 %\nNavigateur : fermé",
      giveaways: [
        "Le processeur est presque entièrement occupé alors que vous ne faites rien.",
        "Le processus porte un nom qui imite un composant du système.",
        "La charge reste élevée navigateur fermé : c'est un programme installé.",
      ],
    },
    decisionChecklist: [
      {
        check: "Le processeur est-il très occupé au repos, par un processus que vous ne connaissez pas ?",
        then: "Fermez le navigateur et regardez si la charge retombe.",
      },
      {
        check: "La charge retombe-t-elle à la fermeture du navigateur ?",
        then: "Cherchez l'onglet ou l'extension en cause et supprimez-la.",
      },
      {
        check: "La charge revient-elle après redémarrage, sans navigateur ouvert ?",
        then: "Un programme est installé : traitez la machine comme compromise et changez vos mots de passe depuis un autre appareil.",
      },
    ],
    prevention: [
      "Faites le tri dans vos extensions de navigateur.",
      "Gardez le navigateur et le système à jour.",
      "Ne laissez pas ouverts en permanence des onglets de sites inconnus.",
    ],
    relatedAttackCodes: [
      "WEB-000006",
      "MAL-000008",
      "MAL-000002",
      "WEB-000004",
      "MAL-000005",
    ],
    faq: [
      {
        question: "Est-ce vraiment grave si rien n'est volé ?",
        answer:
          "Le préjudice est matériel : électricité payée, matériel usé plus vite, appareil ralenti. Mais la question plus importante est celle du chemin d'entrée : si un programme a pu s'installer pour miner, le même chemin reste disponible pour autre chose.",
      },
      {
        question: "Fermer l'onglet suffit-il ?",
        answer:
          "Pour la forme navigateur, oui, et c'est ce qui la distingue. Si la charge processeur ne retombe pas navigateur fermé, ou si elle revient après un redémarrage, c'est un programme installé et la fermeture n'y change rien.",
      },
    ],
    references: [REF.cybermalveillance],
    translations: {
      en: {
        slug: "cryptojacking",
        name: "Cryptojacking",
        plainLanguageDefinition:
          "Your device is computing for someone else, to produce cryptocurrency. Nothing is stolen from your files: it's electricity, speed, and the hardware's lifespan that get consumed.",
        definition:
          "Cryptojacking is the unauthorized use of your device's computing power to produce cryptocurrency for a third party's benefit. It differs from other malware in what it targets: neither your data nor your accounts, but a hardware resource.",
        howItWorks:
          "Two forms coexist. The first is an installed program that runs in the background and restarts at boot. The second runs inside the browser, triggered simply by visiting a page or through an extension, and stops when the tab closes — which explains why a computer can heat up on some sites and not others. The computation keeps the processor busy continuously, hence the heat, the fans, the general slowness, and, on a laptop or phone, a battery life that collapses. Well-designed programs throttle their consumption while you're using the machine and speed up once you leave it idle, which makes the symptom harder to trace to a cause. The harm is real though indirect: power consumption, accelerated wear, and, on a phone, a battery that ages quickly.",
        warningSigns: [
          "Noisy fans and a hot device while you're doing nothing demanding",
          "General slowness that disappears when you close the browser or a specific tab",
          "Very reduced battery life, phone warm in your pocket",
          "Processor heavily used at rest, by a process whose name means nothing to you",
          "Electricity bill rising with no change in equipment, for a device left switched on",
        ],
        howToVerify:
          "Open the task manager or activity monitor and see what's using the processor at rest. Then close the browser: if the load drops immediately, look at a tab or extension rather than an installed program. This is one of the few entries in this family where checking from the machine itself is conclusive, since the method has no interest in hiding to the point of giving up the computation.",
        whatToDo:
          "Review your browser's extensions and remove any you don't use — it's the most common vector for the browser form. Keep the browser and the system updated. Don't leave tabs permanently open from sites of unknown origin.",
        whatToDoIfVictim:
          "Identify the responsible process or tab and remove whatever installs it: extension, program, page left open. If the load returns after a restart with no browser open, it's an installed program, often bundled with another one — treat the machine as more broadly compromised, and change from another device the passwords that were stored on it. Report the incident to cybermalveillance.gouv.fr.",
        faq: [
          {
            question: "Is it really serious if nothing is stolen?",
            answer:
              "The harm is material: electricity paid for, hardware worn out faster, a slowed-down device. But the more important question is the entry path: if a program managed to install itself to mine, that same path remains available for something else.",
          },
          {
            question: "Is closing the tab enough?",
            answer:
              "For the browser form, yes, and that's what sets it apart. If the processor load doesn't drop with the browser closed, or comes back after a restart, it's an installed program and closing the tab changes nothing.",
          },
        ],
        whyItWorks:
          "A slow or hot computer just seems old. The best-made programs slow down while you work and speed up when you leave, which blurs the link between cause and effect.",
        example: {
          setting: "Task manager opened one evening when the computer is heating up for no reason.",
          message:
            "CPU: 96% in use\nMain process: svc_host_update — 91%\nBrowser: closed",
          giveaways: [
            "The processor is almost fully busy while you're doing nothing.",
            "The process has a name that imitates a system component.",
            "The load stays high with the browser closed: it's an installed program.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the processor very busy at rest, because of a process you don't know?",
            then: "Close the browser and see whether the load drops.",
          },
          {
            check: "Does the load drop when the browser is closed?",
            then: "Find the tab or extension responsible and remove it.",
          },
          {
            check: "Does the load come back after a restart, with no browser open?",
            then: "A program is installed: treat the machine as compromised and change your passwords from another device.",
          },
        ],
        prevention: [
          "Clean up your browser extensions.",
          "Keep your browser and system up to date.",
          "Don't leave tabs from unknown sites open permanently.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "hidden mining",
          "malicious cryptomining",
          "cryptojacking",
          "hidden mining malware",
        ],
      },
    },
  },
  {
    code: "MAL-000010",
    slug: "scareware",
    simulationSlug: "alerte-antivirus-numero-a-appeler",
    name: "Scareware (logiciel alarmiste)",
    categorySlug: "logiciels-malveillants",
    editorialStatus: "published",
    plainLanguageDefinition:
      "Une alerte spectaculaire annonce que votre appareil est infecté et propose le logiciel qui va le réparer. L'infection n'existe pas ; le seul programme malveillant de l'histoire est celui qu'on vous vend.",
    attackerObjective: "argent",
    aliases: [
      "scareware",
      "faux antivirus",
      "logiciel alarmiste",
      "fausse alerte de virus",
    ],
    primaryVector: "web",
    primaryDimension: "social_engineering_resistance",
    updatedAt: "2026-09-03",
    publishedAt: "2026-09-03",
    definition:
      "Le scareware est un logiciel ou une page web qui fabrique une alerte de sécurité alarmante afin de faire acheter ou installer une prétendue solution. Cette fiche traite du procédé logiciel ; lorsqu'un interlocuteur humain vous appelle ou vous fait appeler pour obtenir la prise en main de votre machine, il s'agit d'un faux support technique, qui a sa propre fiche. Les deux s'enchaînent fréquemment, l'alerte affichant un numéro à composer.",
    howItWorks:
      "Le procédé n'exploite aucune faille technique, il exploite la peur, et sa mise en scène est étudiée pour cela : compte à rebours, sirène, imitation d'une fenêtre système, liste de menaces prétendument détectées, parfois affichage plein écran dont la sortie paraît bloquée. Cette impression de blocage est une propriété de la page web, pas de votre ordinateur. Deux détails suffisent en général à trancher : un vrai logiciel de sécurité n'annonce jamais un résultat d'analyse depuis une page de navigateur — il n'a pas accès à vos fichiers depuis là — et il ne demande pas de payer pour retirer ce qu'il vient de trouver. Ce qui suit dépend du scénario : soit un paiement pour un produit sans fonction, soit l'installation d'un programme qui, lui, est réellement malveillant, soit un numéro à composer qui bascule vers un faux support.",
    warningSigns: [
      "Alerte de virus affichée dans une page web ou une fenêtre de navigateur",
      "Compte à rebours, son d'alarme, ou impossibilité apparente de fermer la fenêtre",
      "Numéro de téléphone d'assistance affiché dans le message d'alerte",
      "Nom de produit inconnu, ou proche d'une marque connue à un détail près",
      "Résultat d'analyse annoncé instantanément, avant tout examen possible",
      "Paiement demandé pour retirer les menaces prétendument détectées",
    ],
    triggers: ["fear", "urgency", "authority"],
    indicators: [],
    howToVerify:
      "Demandez-vous d'où vient le message. Une alerte affichée par un onglet de navigateur ne peut rien savoir de vos fichiers. Le contrôle qui tranche est simple : fermez la fenêtre — au besoin en fermant le navigateur depuis le gestionnaire des tâches — puis rouvrez-le sans restaurer les onglets. Si l'alerte a disparu, il n'y avait rien. Si vous voulez en avoir le cœur net, lancez un examen depuis le logiciel de sécurité déjà installé sur votre machine, celui que vous ouvrez vous-même.",
    whatToDo:
      "Ne cliquez sur rien dans la fenêtre, pas même sur le bouton de fermeture qu'elle propose, et n'appelez pas le numéro affiché. Fermez le navigateur, puis rouvrez-le sans restaurer les onglets. N'installez et ne payez aucun logiciel proposé par une alerte que vous n'avez pas déclenchée.",
    whatToDoIfVictim:
      "Si vous avez payé, contactez votre banque pour contester l'opération et faire opposition — la démarche est d'autant plus efficace qu'elle est rapide. Si vous avez installé le programme, désinstallez-le et changez depuis un autre appareil les mots de passe enregistrés sur cette machine, un faux logiciel de sécurité ayant reçu des droits étendus. Si vous avez appelé le numéro et donné la main sur votre ordinateur, la situation relève de la fiche faux support technique. Signalez les faits sur cybermalveillance.gouv.fr.",
    whyItWorks:
      "La peur de perdre ses fichiers pousse à agir avant de réfléchir, et l'alerte offre aussitôt la solution. La mise en scène imite des fenêtres que l'on a l'habitude de voir, ce qui lui prête une autorité technique.",
    example: {
      setting: "Fenêtre surgie pendant une navigation ordinaire, avec un compte à rebours.",
      message:
        "AVERTISSEMENT : 5 menaces détectées sur votre appareil. Vos fichiers seront endommagés dans 02:59. Supprimez les virus maintenant avec ProtectPC Ultra, licence 49,99 €.",
      giveaways: [
        "Une page web ne peut pas analyser votre appareil.",
        "Le résultat s'affiche sans qu'aucune analyse ait eu lieu.",
        "Le produit proposé n'est pas le logiciel de sécurité installé sur votre machine.",
      ],
    },
    decisionChecklist: [
      {
        check: "L'alerte s'affiche-t-elle dans le navigateur ?",
        then: "Fermez le navigateur sans cliquer dans la fenêtre, puis rouvrez-le sans restaurer les onglets.",
      },
      {
        check: "L'alerte vous propose-t-elle d'acheter, d'installer ou d'appeler ?",
        then: "N'en faites rien. Pour vérifier, lancez vous-même votre logiciel de sécurité.",
      },
      {
        check: "Avez-vous payé ou installé le logiciel proposé ?",
        then: "Faites opposition auprès de votre banque, désinstallez le programme et changez vos mots de passe depuis un autre appareil.",
      },
    ],
    prevention: [
      "Sachez quel logiciel de sécurité est installé sur votre machine : toute autre alerte lui est étrangère.",
      "Apprenez à fermer un navigateur bloqué depuis le gestionnaire des tâches.",
      "Gardez le navigateur à jour et utilisez un bloqueur de publicité.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000003",
      "WEB-000002",
      "WEB-000004",
      "MAL-000002",
      "WEB-000005",
      "MAL-000005",
    ],
    faq: [
      {
        question:
          "Comment distinguer une vraie alerte de sécurité d'une fausse ?",
        answer:
          "Par sa provenance et par sa demande. Un logiciel installé sur votre machine vous alerte depuis sa propre fenêtre, pas depuis une page web, et il ne réclame pas de paiement pour retirer ce qu'il vient de détecter. L'urgence affichée est également un indice : un vrai outil ne vous met pas sous chronomètre.",
      },
      {
        question:
          "La fenêtre refuse de se fermer, mon ordinateur est-il bloqué ?",
        answer:
          "Non. C'est la page qui bloque son propre affichage, ce que le navigateur permet ; l'ordinateur fonctionne normalement. Fermez le navigateur par le gestionnaire des tâches, puis rouvrez-le sans restaurer la session précédente.",
      },
      {
        question: "Quelle différence avec le faux support technique ?",
        answer:
          "Le scareware est un logiciel ou une page qui vous vend une solution ; le faux support technique est une personne au téléphone qui demande la prise en main de votre machine. L'alerte sert souvent d'amorce au second en affichant un numéro, mais les conséquences diffèrent : un accès à distance accordé est bien plus grave qu'un achat inutile.",
      },
    ],
    references: [REF.fakeSupport, REF.cybermalveillance],
    translations: {
      en: {
        slug: "scareware",
        simulationSlug: "antivirus-alert-number-to-call",
        name: "Scareware",
        plainLanguageDefinition:
          "A dramatic alert announces that your device is infected and offers the software that will fix it. The infection doesn't exist; the only malicious program in the whole story is the one being sold to you.",
        definition:
          "Scareware is software or a web page that manufactures an alarming security alert in order to get you to buy or install a supposed solution. This entry covers the software-based method; when a human caller contacts you or has you call them to get you to hand over control of your machine, that's fake tech support, which has its own entry. The two are frequently chained together, with the alert displaying a number to call.",
        howItWorks:
          "The method exploits no technical flaw; it exploits fear, and its staging is designed for that: countdown, siren sound, imitation of a system window, a list of supposedly detected threats, sometimes a full-screen display that appears impossible to close. That sense of being locked is a property of the web page, not of your computer. Two details are usually enough to settle it: a genuine security program never announces a scan result from a browser page — it has no access to your files from there — and it doesn't ask for payment to remove what it just found. What follows depends on the scenario: either a payment for a product with no function, or the installation of a program that is, this time, genuinely malicious, or a number to call that leads to fake tech support.",
        warningSigns: [
          "Virus alert displayed in a web page or browser window",
          "Countdown, alarm sound, or an apparent inability to close the window",
          "Support phone number displayed in the alert message",
          "Unknown product name, or one close to a known brand with one detail changed",
          "Scan result announced instantly, before any check could actually happen",
          "Payment requested to remove supposedly detected threats",
        ],
        howToVerify:
          "Ask yourself where the message is coming from. An alert shown by a browser tab can know nothing about your files. The decisive check is simple: close the window — if needed by closing the browser from the task manager — then reopen it without restoring the tabs. If the alert is gone, there was nothing. If you want to be certain, run a scan from the security software already installed on your machine, the one you open yourself.",
        whatToDo:
          "Don't click anything in the window, not even the close button it offers, and don't call the number shown. Close the browser, then reopen it without restoring the tabs. Don't install or pay for any software offered by an alert you didn't trigger yourself.",
        whatToDoIfVictim:
          "If you paid, contact your bank to dispute the transaction and block it — the sooner you act, the more effective it is. If you installed the program, uninstall it and change, from another device, the passwords stored on that machine, since a fake security program was granted broad rights. If you called the number and gave control of your computer, the situation falls under the fake tech support entry. Report the incident to cybermalveillance.gouv.fr.",
        faq: [
          {
            question: "How do you tell a real security alert from a fake one?",
            answer:
              "By where it comes from and what it asks for. Software installed on your machine alerts you from its own window, not from a web page, and it doesn't ask for payment to remove what it just detected. The urgency on display is also a giveaway: a genuine tool doesn't put you on a countdown clock.",
          },
          {
            question: "The window won't close — is my computer locked?",
            answer:
              "No. It's the page blocking its own display, which the browser allows; the computer is working normally. Close the browser through the task manager, then reopen it without restoring the previous session.",
          },
          {
            question: "What's the difference with fake tech support?",
            answer:
              "Scareware is software or a page selling you a solution; fake tech support is a person on the phone asking for control of your machine. The alert often serves as the opening move for the second by displaying a number, but the consequences differ: remote access granted is far more serious than an unnecessary purchase.",
          },
        ],
        whyItWorks:
          "Fear of losing your files pushes you to act before thinking, and the alert immediately offers the solution. The staging imitates windows you're used to seeing, which lends it technical authority.",
        example: {
          setting: "Window that popped up during ordinary browsing, with a countdown.",
          message:
            "WARNING: 5 threats detected on your device. Your files will be damaged in 02:59. Remove the viruses now with ProtectPC Ultra, license €49.99.",
          giveaways: [
            "A web page can't scan your device.",
            "The result appears without any scan having taken place.",
            "The product offered isn't the security software installed on your machine.",
          ],
        },
        decisionChecklist: [
          {
            check: "Is the alert displayed in the browser?",
            then: "Close the browser without clicking in the window, then reopen it without restoring tabs.",
          },
          {
            check: "Does the alert offer to sell you something, install something or have you call?",
            then: "Do none of it. To check, launch your own security software yourself.",
          },
          {
            check: "Did you pay for or install the software offered?",
            then: "Ask your bank to block the payment, uninstall the program and change your passwords from another device.",
          },
        ],
        prevention: [
          "Know which security software is installed on your machine: any other alert has nothing to do with it.",
          "Learn how to close a frozen browser from the task manager.",
          "Keep your browser up to date and use an ad blocker.",
        ],
        references: [
          {
            label:
              "Cybermalveillance.gouv.fr — Fake tech support (French government cybersecurity assistance service)",
            url: REF.fakeSupport.url,
          },
          {
            label:
              "Cybermalveillance.gouv.fr — Assistance and reporting (French government cybersecurity assistance service)",
            url: REF.cybermalveillance.url,
          },
        ],
        aliases: [
          "scareware",
          "fake antivirus",
          "alarmist software",
          "fake virus alert",
        ],
      },
    },
  },
];

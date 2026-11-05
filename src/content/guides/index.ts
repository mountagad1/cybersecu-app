import { VERIFIED_REFERENCES as REF } from "@/content/attacks/types";
import { listAttacks, type AttackEntry } from "@/content/attacks";
import { getLocalizedAttack, type LocalizedAttack } from "@/content/attacks/localize";
import type { GuideEntry, GuideTranslation } from "./types";
import { GUIDES_EN } from "./en";

export type { GuideEntry, GuideIntent, GuideStep, GuideTranslation } from "./types";
export { GUIDE_INTENT_LABELS, GUIDE_INTENT_LABELS_EN } from "./types";

const ALL_GUIDES: readonly GuideEntry[] = [
  {
    slug: "verifier-un-lien-avant-de-cliquer",
    title: "Vérifier un lien avant de cliquer",
    intent: "PREVENTION",
    question: "Comment savoir si un lien est dangereux avant de l'ouvrir ?",
    shortAnswer:
      "Lisez le nom de domaine, c'est-à-dire ce qui se trouve juste avant la première barre oblique, et lisez-le de droite à gauche. C'est la seule partie de l'adresse que son propriétaire ne peut pas choisir librement. Et quand le lien mène à un endroit où vous devez vous identifier ou payer, ne l'utilisez pas du tout : rejoignez le service par un favori ou son application.",
    why: "Tout le reste d'une adresse est décoratif du point de vue de la sécurité : le sous-domaine, le chemin, les paramètres, le texte affiché à la place du lien, et jusqu'au cadenas — qui n'indique que le chiffrement de la connexion, pas l'honnêteté du site. Un attaquant peut écrire « banque.fr » n'importe où dans une adresse qui ne lui appartient pas. Le seul élément qu'il doit réellement posséder est le nom de domaine, et c'est donc le seul que vous devez lire.",
    steps: [
      {
        title: "Faites apparaître l'adresse réelle",
        body: "Sur ordinateur, survolez le lien sans cliquer : l'adresse s'affiche en bas de la fenêtre. Sur téléphone, appuyez longuement pour ouvrir un aperçu. Le texte visible du lien ne veut rien dire — il peut afficher une adresse et en désigner une autre.",
      },
      {
        title: "Trouvez le nom de domaine",
        body: "Repérez la première barre oblique après « https:// » : tout ce qui la précède est le domaine, et c'est sa FIN qui compte. Dans « connexion.mabanque.fr.exemple-douteux.test/ », le site appartient à « exemple-douteux.test » — le « mabanque.fr » du milieu est décoratif, placé là pour être lu en premier. Lisez donc de droite à gauche jusqu'à rencontrer le nom de l'organisme : s'il n'arrive pas tout de suite, vous n'êtes pas chez lui. Attention aux extensions composées comme « .gouv.fr » ou « .co.uk », où le nom réel est le mot juste avant : dans « impots.gouv.fr », c'est « impots ».",
      },
      {
        title: "Comparez avec ce que vous attendiez",
        body: "Une lettre en trop, un tiret ajouté, une extension différente : ce sont des domaines distincts, qui appartiennent à quelqu'un d'autre. Une adresse qui commence par « xn-- » signale des caractères non latins, ce qui n'est pas frauduleux en soi mais n'a rien à faire là où vous attendiez un nom ordinaire.",
      },
      {
        title: "Pour un identifiant ou un paiement, changez de chemin",
        body: "Ne vous connectez jamais depuis un lien reçu, même après vérification. Ouvrez un favori enregistré ou l'application officielle. Votre gestionnaire de mots de passe est ici un allié discret : il associe vos identifiants au domaine réel, donc son silence sur un site que vous utilisez d'habitude est un avertissement.",
      },
    ],
    pitfalls: [
      "Croire que le cadenas garantit le site : il ne garantit que le chiffrement de la connexion.",
      "Lire le début de l'adresse plutôt que la fin du nom de domaine.",
      "Faire confiance à un lien raccourci, qui masque justement la destination.",
      "Vérifier un message en utilisant les coordonnées fournies par ce message.",
      "Saisir un mot de passe à la main parce que le gestionnaire ne le propose pas : c'est contourner la seule alerte que vous ayez reçue.",
    ],
    relatedAttackCodes: [
      "PHISH-000001",
      "SMS-000001",
      "IDN-000001",
      "IDN-000002",
      "QR-000001",
      "PAYMENT-000007",
    ],
    references: [REF.phishing],
    editorialStatus: "published",
    updatedAt: "2026-09-02",
  },
  {
    slug: "verifier-l-identite-d-un-interlocuteur",
    title: "Vérifier à qui vous parlez vraiment",
    intent: "PREVENTION",
    question: "Comment être sûr que la personne qui me contacte est bien celle qu'elle prétend ?",
    shortAnswer:
      "Changez de canal. Reprenez contact par un chemin que vous possédiez déjà avant ce message : le numéro au dos de votre carte, celui enregistré dans vos contacts, l'application officielle. Vérifier en répondant au message revient à demander à l'inconnu de confirmer qu'il est bien votre interlocuteur.",
    why: "Aucun signe reçu ne prouve une identité, parce qu'ils sont tous reproductibles : le nom affiché d'un email est un champ libre, l'expéditeur d'un SMS est un simple libellé, le numéro appelant se falsifie, une photo de profil se recopie. Même une messagerie authentique peut être compromise, auquel cas le message vient réellement du bon compte. Ce qui reste hors de portée de l'attaquant n'est pas un signe mais un chemin : celui que vous choisissez vous-même.",
    steps: [
      {
        title: "Interrompez l'échange en cours",
        body: "Raccrochez, ne répondez pas, fermez la conversation. Rien de ce qui vous est demandé ne perd sa validité en dix minutes, et un interlocuteur qui prétend le contraire vient de vous renseigner.",
      },
      {
        title: "Choisissez un chemin antérieur au message",
        body: "Le critère est la date : le numéro doit être en votre possession avant que la demande arrive. Le dos de votre carte bancaire, un contact enregistré de longue date, une facture papier, l'application officielle installée depuis un magasin d'applications.",
      },
      {
        title: "Pour un proche, appelez, ne écrivez pas",
        body: "Un message venu d'un « nouveau numéro » se vérifie en appelant l'ancien, pas en écrivant au nouveau. Si personne ne répond, appelez quelqu'un d'autre de l'entourage. La voix reste, pour l'instant, plus difficile à imiter qu'un texte — mais gardez en tête qu'elle se clone désormais : une question dont seul le vrai proche a la réponse reste utile.",
      },
      {
        title: "En entreprise, appliquez la procédure plutôt que votre jugement",
        body: "La double validation d'un virement existe pour les jours où le message est convaincant. La suspendre « exceptionnellement » est exactement ce que la fraude demande ; l'appliquer n'a jamais besoin d'être justifié.",
      },
    ],
    pitfalls: [
      "Rappeler le numéro affiché par l'appel entrant : il peut être falsifié.",
      "Répondre au message pour demander confirmation : la réponse arrive chez l'attaquant.",
      "Traiter un détail exact vous concernant comme une preuve : il vient souvent d'une fuite de données.",
      "Renoncer à vérifier par politesse, alors que la vérification n'a pas besoin d'être annoncée comme un doute.",
      "Rappeler immédiatement sans avoir raccroché franchement : la ligne peut rester ouverte.",
    ],
    relatedAttackCodes: [
      "SOCIAL-000001",
      "SOCIAL-000005",
      "SOCIAL-000006",
      "SOCIAL-000009",
      "SOCIAL-000010",
      "PAYMENT-000002",
      "PAYMENT-000004",
    ],
    references: [REF.phishing],
    editorialStatus: "published",
    updatedAt: "2026-09-02",
  },
  {
    slug: "comment-un-mot-de-passe-est-vole",
    title: "Comment un mot de passe est réellement volé",
    intent: "INFORMATIONAL",
    question: "Comment les pirates obtiennent-ils un mot de passe ?",
    shortAnswer:
      "Il y a trois chemins, et deviner n'en fait pas partie. Soit ils l'ont déjà, parce qu'il a fuité chez un service que vous utilisiez et qu'ils l'essaient ailleurs. Soit c'est vous qui le saisissez, sur une page qui imite un site que vous connaissez. Soit un logiciel installé sur votre machine le récolte. La longueur d'un mot de passe ne protège d'aucun des trois — seule son unicité le fait.",
    why: "L'image du pirate qui « craque » un mot de passe caractère par caractère décrit mal ce qui se passe, pour une raison mécanique : les services limitent les tentatives et verrouillent le compte au bout de quelques essais, ce qui rend cette voie impraticable quelle que soit la puissance de calcul. Les trois chemins ci-dessous contournent le problème au lieu de l'affronter — ils n'ont pas besoin de deviner. C'est pourquoi les conseils utiles portent sur l'unicité et le second facteur plutôt que sur la complexité : la complexité ne défend que contre la voie que personne n'emprunte.",
    steps: [
      {
        title: "La fuite chez un tiers, puis la réutilisation",
        body: "Un site est compromis, ses identifiants circulent par lots, et un attaquant les essaie automatiquement sur des dizaines d'autres services. Rien n'est deviné : votre mot de passe est connu, et il ouvre tout ce qui le partage. Ce chemin ne coûte presque rien à l'attaquant — il n'a ni faille à trouver ni victime à convaincre — et le seul remède est un mot de passe différent par service.",
      },
      {
        title: "La saisie sur une fausse page",
        body: "Une page imitant un service légitime récolte ce que vous y tapez. Aucune faille n'est exploitée : la saisie est volontaire, ce qui rend l'attaque indépendante de la robustesse du mot de passe.",
      },
      {
        title: "Le logiciel installé sur votre appareil",
        body: "Un programme récolte les mots de passe enregistrés dans le navigateur, les cookies de session et les frappes au clavier. Il a fallu qu'il soit installé, et cela suppose une action de votre part : un fichier ouvert, une fausse mise à jour acceptée, une application prise ailleurs que dans un magasin officiel. C'est ce qui le rend évitable.",
      },
      {
        title: "Le contournement du second facteur",
        body: "Quand un mot de passe ne suffit plus, l'attaquant demande le code — au téléphone, dans la seconde qui suit son envoi — ou noie la victime de demandes d'approbation. Recevoir un code que vous n'avez pas demandé signifie une seule chose : quelqu'un connaît déjà votre mot de passe.",
      },
    ],
    pitfalls: [
      "Chercher la complexité plutôt que l'unicité : un mot de passe très long reste inutile s'il a fuité et qu'il est réutilisé.",
      "Négliger un vieux compte sans valeur : il porte souvent un mot de passe encore utilisé ailleurs.",
      "Changer le mot de passe du seul compte alerté, en laissant les autres qui le partagent.",
      "Croire qu'un gestionnaire de mots de passe est risqué : le risque qu'il supprime — la réutilisation — est celui qui cause l'essentiel des compromissions.",
      "Compter uniquement sur le SMS comme second facteur, alors que le numéro lui-même peut être détourné.",
    ],
    relatedAttackCodes: ["ACCT-000001", "ACCT-000002", "ACCT-000003", "ACCT-000004", "PHISH-000001"],
    references: [REF.cybermalveillance],
    editorialStatus: "published",
    updatedAt: "2026-09-02",
  },
  {
    slug: "activer-la-double-authentification",
    title: "Activer la double authentification, et bien la choisir",
    intent: "PREVENTION",
    question: "Comment protéger mes comptes avec la double authentification ?",
    shortAnswer:
      "Activez-la d'abord sur votre messagerie principale, avant même la banque : c'est elle qui permet de réinitialiser tous vos autres comptes. Préférez une application d'authentification ou une clé physique au code par SMS. Et notez vos codes de secours ailleurs que dans le téléphone qui génère les codes.",
    why: "La double authentification ajoute une preuve que l'attaquant ne peut pas obtenir avec le seul mot de passe. Toutes les méthodes ne se valent pas : le SMS dépend de votre numéro, qui peut être transféré vers une autre carte SIM à votre insu ; une application génère les codes hors ligne sur votre appareil ; une clé physique vérifie en plus le domaine du site, ce qui la rend insensible aux fausses pages. L'ordre d'activation compte autant que la méthode, parce qu'une messagerie non protégée annule la protection de tout le reste.",
    steps: [
      {
        title: "Commencez par la messagerie principale",
        body: "C'est le compte qui ouvre les autres : la fonction « mot de passe oublié » de vos services y envoie ses liens. Protégez-la avant la banque, avant les réseaux sociaux.",
      },
      {
        title: "Choisissez la méthode la plus forte proposée",
        body: "Clé de sécurité physique si le service l'accepte, sinon application d'authentification, et SMS seulement en dernier recours. Le SMS reste très supérieur à l'absence de second facteur : si c'est le seul choix, prenez-le.",
      },
      {
        title: "Mettez les codes de secours à l'abri",
        body: "Ils servent le jour où l'appareil est perdu ou volé. Conservez-les hors de ce même appareil : sur papier, ou dans un gestionnaire de mots de passe accessible depuis ailleurs. Des codes de secours enregistrés dans le seul téléphone qui génère les codes ne protègent de rien.",
      },
      {
        title: "Vérifiez les moyens de récupération",
        body: "Adresse de secours, numéro de téléphone, questions secrètes : ce sont les portes dérobées de votre compte, et ce sont les premières choses qu'un attaquant modifie. Contrôlez-les à l'activation, puis de temps en temps.",
      },
    ],
    pitfalls: [
      "Protéger la banque et laisser la messagerie sans second facteur.",
      "Communiquer un code de vérification à quelqu'un : aucun service n'en demande jamais, par aucun canal.",
      "Valider une demande d'approbation pour faire cesser des notifications répétées.",
      "Garder les codes de secours dans l'appareil qui génère les codes.",
      "Laisser des questions secrètes dont les réponses figurent sur vos profils publics.",
    ],
    relatedAttackCodes: ["ACCT-000001", "ACCT-000002", "ACCT-000003", "ACCT-000004"],
    references: [REF.cybermalveillance],
    editorialStatus: "published",
    updatedAt: "2026-09-02",
  },
  {
    slug: "que-faire-apres-avoir-paye-une-arnaque",
    title: "Que faire dans l'heure qui suit un paiement frauduleux",
    intent: "INCIDENT_RESPONSE",
    question: "J'ai payé une arnaque, que faire maintenant ?",
    shortAnswer:
      "Appelez votre banque tout de suite, avant toute autre démarche. Le délai est le seul facteur que vous contrôlez encore : un virement très récent peut parfois être rappelé, un paiement par carte contesté. Conservez tout, ne rappelez pas l'escroc, et déposez plainte ensuite.",
    why: "Ce qui décide de l'issue n'est pas la somme mais le temps écoulé et le moyen de paiement employé. Un virement quitte votre compte définitivement une fois exécuté, mais tant que les fonds n'ont pas été retirés du compte destinataire, la banque peut tenter un rappel. Un paiement par carte relève d'une procédure de contestation. Les moyens irrévocables — mandat cash, cartes prépayées, cryptomonnaie — n'offrent presque aucun recours, ce qui explique pourquoi les escrocs les demandent.",
    steps: [
      {
        title: "Appelez la banque, dans l'heure si possible",
        body: "Demandez explicitement le blocage de l'opération et, pour un virement, une demande de rappel des fonds. Faites opposition sur la carte si elle a été utilisée ou saisie. C'est la seule étape où chaque minute compte réellement.",
      },
      {
        title: "Coupez le contact, sans rien supprimer",
        body: "Ne répondez plus, ne rappelez pas, ne cherchez pas à négocier. Mais ne supprimez rien : conversations, annonce, coordonnées bancaires transmises, références de virement, capture de la page de paiement. Ce sont les pièces de la plainte.",
      },
      {
        title: "Changez ce qui a pu être exposé",
        body: "Si vous avez saisi des identifiants sur une page, changez ce mot de passe et tous ceux qui lui ressemblent, en commençant par la messagerie. Si des documents d'identité ont été transmis, surveillez les courriers d'organismes de crédit que vous n'avez pas sollicités.",
      },
      {
        title: "Déposez plainte, puis signalez",
        body: "La plainte est ce qui donne un cadre aux démarches bancaires ultérieures. Signalez ensuite les faits sur cybermalveillance.gouv.fr et, s'il y a lieu, à la plateforme sur laquelle l'échange a eu lieu — cela protège les personnes suivantes.",
      },
    ],
    pitfalls: [
      "Attendre le lendemain pour appeler la banque : c'est la seule fenêtre qui se referme.",
      "Payer une somme supplémentaire présentée comme nécessaire pour récupérer la première.",
      "Supprimer la conversation par honte ou par colère : elle est votre preuve.",
      "Faire confiance à quelqu'un qui propose ensuite de vous aider à récupérer les fonds : ce sont fréquemment les mêmes acteurs.",
      "Renoncer à déposer plainte parce que la somme paraît trop faible : les plaintes se recoupent entre elles.",
    ],
    relatedAttackCodes: [
      "PAYMENT-000001",
      "PAYMENT-000003",
      "PAYMENT-000005",
      "PAYMENT-000006",
      "PAYMENT-000008",
      "PAYMENT-000009",
      "SOCIAL-000002",
      "SOCIAL-000005",
    ],
    references: [REF.cybermalveillance],
    editorialStatus: "published",
    updatedAt: "2026-09-02",
  },
  // The three incident guides below consolidate, in the order a victim
  // needs them, the « Si c'est déjà arrivé » sections already published on
  // the fiches they name. They add no fact, number or procedure that the
  // fiches do not already state: an emergency page is the worst place to
  // introduce an unverified one.
  {
    slug: "j-ai-saisi-mon-mot-de-passe-sur-un-faux-site",
    title: "J'ai saisi mon mot de passe sur un faux site : que faire",
    intent: "INCIDENT_RESPONSE",
    question: "J'ai cliqué sur un lien et saisi mon mot de passe sur une fausse page, que faire ?",
    shortAnswer:
      "Changez ce mot de passe tout de suite, depuis le vrai service ouvert par vos propres moyens — un favori ou l'application, jamais le lien reçu — puis fermez toutes les sessions ouvertes sur le compte. Changez ensuite le même mot de passe partout où vous l'utilisiez, en commençant par votre messagerie. Si vous avez aussi saisi une carte bancaire, appelez votre banque avant tout le reste.",
    why: "Une fausse page n'a pas besoin de casser quoi que ce soit : vous lui avez donné le mot de passe, et elle peut le transmettre immédiatement à quelqu'un qui se connecte à votre place pendant que vous lisez encore la page. Deux choses en découlent. D'abord, une connexion déjà ouverte par l'attaquant survit au changement de mot de passe si vous ne fermez pas les sessions actives. Ensuite, le mot de passe volé ne vaut pas que pour ce service : il sera essayé partout ailleurs, et la messagerie compte plus que tout le reste parce qu'elle permet de réinitialiser les autres comptes.",
    steps: [
      {
        title: "Changez le mot de passe depuis le vrai service",
        body: "Fermez la page reçue. Ouvrez le service par un favori enregistré ou par son application officielle, puis changez le mot de passe. Ne passez par aucun lien du message, même pour « vérifier » : c'est lui qui vous a mené à la copie.",
      },
      {
        title: "Fermez les sessions actives",
        body: "Dans les paramètres de sécurité du compte, déconnectez tous les appareils et sessions. Une connexion relayée en temps réel par la fausse page reste ouverte après le changement de mot de passe : c'est l'étape qui la coupe.",
      },
      {
        title: "Changez-le partout où il était réutilisé",
        body: "Le mot de passe volé sera essayé sur d'autres services. Commencez par la messagerie principale, puis la banque, puis le reste. Profitez-en pour activer la double authentification, au moins sur la messagerie et la banque.",
      },
      {
        title: "Vérifiez ce que l'attaquant a pu modifier",
        body: "Adresse et numéro de récupération, règles de transfert de la messagerie, appareils connectés : ce sont les premières choses qu'un attaquant change pour garder l'accès. Si des coordonnées bancaires ont été saisies sur la page, faites opposition auprès de votre banque. Signalez ensuite les faits sur cybermalveillance.gouv.fr ; si le lien était arrivé par SMS, le message peut être transféré au 33700.",
      },
    ],
    pitfalls: [
      "Retourner sur la page par le même lien pour « vérifier » ou annuler la saisie.",
      "Changer le mot de passe sans fermer les sessions ouvertes, qui restent valides.",
      "Ne changer que le compte concerné, alors que le même mot de passe ouvre d'autres services.",
      "Ignorer un code de vérification reçu sans l'avoir demandé : il signifie que quelqu'un connaît déjà le mot de passe.",
      "Attendre de voir si quelque chose se passe : le délai profite uniquement à l'attaquant.",
    ],
    relatedAttackCodes: [
      "PHISH-000001",
      "SMS-000001",
      "WEB-000003",
      "QR-000001",
      "IDN-000001",
      "IDN-000002",
      "ACCT-000002",
    ],
    references: [REF.phishing, REF.cybermalveillance],
    editorialStatus: "published",
    updatedAt: "2026-10-07",
  },
  {
    slug: "j-ai-donne-mes-coordonnees-bancaires-ou-un-code",
    title: "J'ai donné mes coordonnées bancaires ou un code : que faire",
    intent: "INCIDENT_RESPONSE",
    question: "J'ai communiqué ma carte bancaire ou un code de validation à un escroc, que faire ?",
    shortAnswer:
      "Appelez votre banque immédiatement, au numéro qui figure au dos de votre carte ou dans l'application officielle, et faites opposition. Faites-le même si aucune somme n'a encore été débitée : une carte ou un code communiqués servent à payer ou à valider une opération dans les minutes qui suivent. Puis notez ce qui s'est passé et déposez plainte.",
    why: "Un numéro de carte ou un code de validation n'a de valeur pour l'escroc que tant qu'il fonctionne. L'opposition le rend inutilisable, et c'est la seule démarche dont l'efficacité dépend de votre rapidité. Le numéro à appeler compte autant que la vitesse : celui que vous a donné votre interlocuteur, ou celui qui s'affichait pendant l'appel, peut mener à la même personne. Une banque ne demande jamais de déplacer de l'argent pour le protéger, et aucun service ne demande jamais de lui communiquer un code de vérification — si on vous l'a demandé, l'opération en cours est celle de l'escroc.",
    steps: [
      {
        title: "Raccrochez, puis rappelez la banque vous-même",
        body: "Si l'échange est en cours, coupez-le. Composez ensuite le numéro au dos de votre carte ou passez par l'application officielle. Attendez quelques minutes ou utilisez une autre ligne : une ligne peut rester ouverte si vous ne raccrochez pas franchement.",
      },
      {
        title: "Faites opposition et signalez l'opération",
        body: "Demandez l'opposition sur la carte et signalez toute opération que vous n'avez pas faite ou que vous avez validée sous la pression. Ne validez plus aucune notification ni aucun code tant que la banque ne vous a pas confirmé que la situation est maîtrisée.",
      },
      {
        title: "Notez les traces pendant qu'elles sont fraîches",
        body: "Heure de l'appel, numéro affiché, nom donné par l'interlocuteur, montants évoqués, messages reçus. Ne supprimez rien : ce sont les éléments de la plainte et de la contestation.",
      },
      {
        title: "Déposez plainte, signalez, sécurisez le reste",
        body: "Déposez plainte, puis signalez les faits sur cybermalveillance.gouv.fr. Si vous avez aussi donné un identifiant ou un mot de passe, changez-le depuis un appareil sain et fermez les sessions actives du compte.",
      },
    ],
    pitfalls: [
      "Rappeler le numéro qui s'est affiché ou celui donné pendant l'appel.",
      "Attendre de voir un débit pour réagir : l'opposition sert justement à l'empêcher.",
      "Valider « pour annuler » une notification ou un code qui arrive juste après l'appel.",
      "Croire qu'un interlocuteur qui connaissait vos informations était forcément légitime : ces détails proviennent souvent d'une fuite de données.",
      "Renoncer à la plainte par gêne : elle sert aussi de base aux démarches avec la banque.",
    ],
    relatedAttackCodes: ["SOCIAL-000001", "SOCIAL-000006", "SMS-000001", "QR-000001", "WEB-000003", "ACCT-000002"],
    references: [REF.cybermalveillance],
    editorialStatus: "published",
    updatedAt: "2026-10-07",
  },
  {
    slug: "mon-compte-a-ete-pirate",
    title: "Reprendre un compte piraté (messagerie, réseau social)",
    intent: "INCIDENT_RESPONSE",
    question: "Mon compte a été piraté, comment le récupérer ?",
    shortAnswer:
      "Lancez sans attendre la procédure de récupération du service, depuis un appareil sain. Une fois le compte repris, fermez toutes les sessions, supprimez ce que l'attaquant a ajouté — règles de transfert, applications connectées — et rétablissez vos moyens de récupération avant tout le reste. Prévenez ensuite vos contacts par un autre canal.",
    why: "Reprendre un compte ne suffit pas à le garder. Un attaquant qui a changé l'adresse de secours, le numéro de récupération ou ajouté une règle de transfert peut refaire la manœuvre autant de fois qu'il veut : tant que ces éléments ne sont pas rétablis, changer le mot de passe ne sert à rien. La rapidité compte aussi pour une autre raison : les procédures de récupération deviennent plus difficiles une fois que l'adresse email associée a été remplacée. Enfin, un compte piraté sert souvent à écrire à vos proches en votre nom, et c'est eux qu'il faut protéger.",
    steps: [
      {
        title: "Récupérez le compte depuis un appareil sain",
        body: "Utilisez la procédure de récupération officielle du service. Si vous soupçonnez un logiciel malveillant sur votre appareil — un programme installé récemment, une extension inconnue —, faites-le depuis un autre appareil.",
      },
      {
        title: "Fermez les sessions, puis changez le mot de passe",
        body: "Déconnectez tous les appareils et sessions, puis changez le mot de passe. Cet ordre compte quand des cookies de session ont été volés : ils restent valides tant que la session n'est pas fermée. Régénérez ensuite les codes de secours.",
      },
      {
        title: "Retirez ce que l'attaquant a laissé",
        body: "Supprimez toute règle de transfert ou de filtrage inconnue dans la messagerie, révoquez les applications tierces autorisées, et rétablissez l'adresse email et le numéro de récupération. Activez la double authentification.",
      },
      {
        title: "Protégez les comptes rattachés et vos contacts",
        body: "Changez les mots de passe des comptes liés à cette adresse, en commençant par la banque. Prévenez vos contacts par un autre canal, et publiez si besoin un message signalant les demandes envoyées en votre nom. Si un proche a versé de l'argent, il doit contacter sa banque immédiatement et déposer plainte de son côté. Signalez les faits sur cybermalveillance.gouv.fr.",
      },
    ],
    pitfalls: [
      "Changer le mot de passe sans vérifier l'adresse et le numéro de récupération.",
      "Oublier les règles de transfert de la messagerie, qui continuent d'envoyer vos emails à l'attaquant.",
      "Faire la récupération depuis l'appareil qui a pu servir à voler l'accès.",
      "Attendre avant de lancer la récupération : elle devient plus difficile une fois l'adresse associée changée.",
      "Ne prévenir personne, alors que vos contacts reçoivent des demandes en votre nom.",
    ],
    relatedAttackCodes: ["ACCT-000003", "ACCT-000010", "ACCT-000009", "ACCT-000001", "ACCT-000007", "ACCT-000004"],
    references: [REF.cybermalveillance],
    editorialStatus: "published",
    updatedAt: "2026-10-07",
  },
  // Same rule as the incident guides above: every step restates what the
  // fiches named in `relatedAttackCodes` and the emergency checklist
  // (« appareil ») already publish — faux support technique, cheval de
  // Troie, scareware, logiciel espion, enregistreur de frappe. Nothing new
  // (docs/seo/PROGRAMMATIC_SEO_MATRIX.csv, candidate « prendre la main »).
  {
    slug: "j-ai-laisse-quelqu-un-prendre-la-main-sur-mon-appareil",
    title: "J'ai laissé quelqu'un prendre la main sur mon appareil : que faire",
    intent: "INCIDENT_RESPONSE",
    question:
      "J'ai installé un logiciel ou laissé un « technicien » prendre la main sur mon ordinateur, que faire ?",
    shortAnswer:
      "Si vous avez payé ou donné une carte, appelez d'abord votre banque pour faire opposition. Puis déconnectez l'appareil d'internet et désinstallez tout outil de prise en main à distance installé à la demande de votre interlocuteur. Depuis un autre appareil, sain, fermez les sessions de vos comptes et changez les mots de passe, en commençant par la messagerie et la banque. Faites enfin analyser l'appareil.",
    why: "Pendant la prise en main, la personne a eu accès à tout ce qui était accessible sur la session : fichiers, messagerie, mots de passe enregistrés dans le navigateur, sessions ouvertes. Deux choses en découlent. D'abord, l'appareil n'est plus une base sûre : c'est depuis un autre appareil que les mots de passe se changent. Ensuite, désinstaller le programme ne suffit pas à établir que la machine est saine, et un logiciel qui fonctionne normalement ne prouve rien : c'est un argument de discrétion, pas une preuve d'innocuité. Sur un appareil qui contient des données importantes, la réinstallation du système est la seule remise à zéro dont on puisse répondre.",
    steps: [
      {
        title: "Si de l'argent est en jeu, la banque d'abord",
        body: "Si vous avez payé, ou communiqué une carte ou un code pendant l'échange, contactez votre banque pour contester l'opération et faire opposition : la démarche est d'autant plus efficace qu'elle est rapide. Appelez le numéro figurant au dos de votre carte, jamais celui donné par votre interlocuteur.",
      },
      {
        title: "Coupez l'accès",
        body: "Déconnectez l'appareil d'internet. Désinstallez ensuite tout outil de prise en main à distance installé à la demande de votre interlocuteur, et tout programme qu'il vous a fait installer.",
      },
      {
        title: "Changez vos mots de passe depuis un autre appareil",
        body: "Considérez que tous les identifiants saisis ou enregistrés sur cette machine sont exposés. Depuis un autre appareil sain, fermez les sessions ouvertes de vos comptes, puis changez les mots de passe, en commençant par la messagerie, qui sert à réinitialiser les autres comptes, et la banque.",
      },
      {
        title: "Faites vérifier l'appareil, ou remettez-le à zéro",
        body: "Faites analyser la machine, en sachant ce que l'examen vaut : il repère ce qui n'a pas cherché à se cacher, et une absence de détection n'établit rien. Sur un appareil qui contient des données importantes, la réinstallation du système est la seule remise à zéro dont on puisse répondre. Ne restaurez pas ensuite une sauvegarde antérieure au doute sans la faire examiner, sous peine de réinstaller ce que vous venez de retirer.",
      },
      {
        title: "Signalez",
        body: "Signalez les faits sur cybermalveillance.gouv.fr. Sur un poste professionnel, prévenez le service informatique avant toute manipulation.",
      },
    ],
    pitfalls: [
      "Rappeler le numéro affiché par l'alerte, ou celui donné par le « technicien ».",
      "Changer les mots de passe depuis l'appareil qui a été pris en main.",
      "Se contenter de désinstaller le programme : cela ne prouve pas que la machine est saine.",
      "Se rassurer parce que l'ordinateur, ou le logiciel installé, fonctionne normalement.",
      "Restaurer une sauvegarde antérieure au doute sans la faire examiner : elle peut ramener ce que vous venez de retirer.",
      "Tout supprimer tout de suite quand c'est un proche qui surveille l'appareil : agir dessus lui est visible. Lisez d'abord la fiche stalkerware.",
    ],
    relatedAttackCodes: ["SOCIAL-000003", "MAL-000002", "MAL-000010", "MAL-000003", "MAL-000004", "PERS-000005"],
    references: [REF.fakeSupport, REF.cybermalveillance],
    editorialStatus: "published",
    updatedAt: "2026-10-12",
  },
];

export function auditGuides(guides: readonly GuideEntry[]): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  const codes = new Set(listAttacks().map((a) => a.code));

  for (const guide of guides) {
    if (seen.has(guide.slug)) problems.push(`slug de guide dupliqué : ${guide.slug}`);
    seen.add(guide.slug);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(guide.updatedAt)) {
      problems.push(`${guide.slug} : updatedAt doit être au format YYYY-MM-DD`);
    }
    if (!guide.question.trim().endsWith("?")) {
      problems.push(`${guide.slug} : « question » doit être une question`);
    }
    if (guide.steps.length < 3) problems.push(`${guide.slug} : moins de trois étapes`);
    if (guide.pitfalls.length < 3) problems.push(`${guide.slug} : moins de trois pièges`);

    // A guide with no attack is unreachable: fiches derive their guides
    // from this list, so an empty one is linked from nowhere.
    if (guide.relatedAttackCodes.length === 0) {
      problems.push(`${guide.slug} : ne défend contre aucune attaque publiée`);
    }
    for (const code of guide.relatedAttackCodes) {
      if (!codes.has(code)) {
        problems.push(`${guide.slug} : code d'attaque inexistant « ${code} »`);
      }
    }
  }
  problems.push(...auditGuideTranslations(guides, GUIDES_EN));
  return problems;
}

/**
 * The English overlay follows the French guide item for item: a translation
 * that drops a step or a pitfall is a different guide, not a translation.
 */
export function auditGuideTranslations(
  guides: readonly GuideEntry[],
  translations: Readonly<Record<string, GuideTranslation>>,
): string[] {
  const problems: string[] = [];
  const known = new Set(guides.map((g) => g.slug));
  const enSlugs = new Set<string>();
  for (const [frSlug, en] of Object.entries(translations)) {
    const guide = guides.find((g) => g.slug === frSlug);
    if (!known.has(frSlug) || !guide) {
      problems.push(`traduction anglaise d'un guide inconnu : ${frSlug}`);
      continue;
    }
    if (enSlugs.has(en.slug)) problems.push(`${frSlug} (en) : slug anglais dupliqué « ${en.slug} »`);
    enSlugs.add(en.slug);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(en.slug)) problems.push(`${frSlug} (en) : slug invalide « ${en.slug} »`);
    if (!en.question.trim().endsWith("?")) problems.push(`${frSlug} (en) : « question » doit être une question`);
    if (en.steps.length !== guide.steps.length) {
      problems.push(`${frSlug} (en) : ${en.steps.length} étapes au lieu de ${guide.steps.length}`);
    }
    if (en.pitfalls.length !== guide.pitfalls.length) {
      problems.push(`${frSlug} (en) : ${en.pitfalls.length} pièges au lieu de ${guide.pitfalls.length}`);
    }
    if (en.references.length !== guide.references.length) {
      problems.push(`${frSlug} (en) : sources différentes du français`);
    }
    const text = [en.title, en.shortAnswer, en.why, ...en.steps.flatMap((s) => [s.title, s.body]), ...en.pitfalls];
    if (text.some((t) => /%/.test(t))) problems.push(`${frSlug} (en) : pourcentage (aucune statistique sans source)`);
  }
  return problems;
}

const problems = auditGuides(ALL_GUIDES);
if (problems.length > 0) {
  throw new Error(`Catalogue de guides invalide :\n  - ${problems.join("\n  - ")}`);
}

export function listGuides(): GuideEntry[] {
  return [...ALL_GUIDES].filter((g) => g.editorialStatus === "published");
}

export function findGuideBySlug(slug: string): GuideEntry | undefined {
  return listGuides().find((g) => g.slug === slug);
}

/** Guides that name this attack. Declared once, on the guide. */
export function guidesForAttack(attack: AttackEntry): GuideEntry[] {
  return listGuides().filter((g) => g.relatedAttackCodes.includes(attack.code));
}

/** Fiches a guide defends, resolved to published entries. */
export function attacksForGuide(guide: GuideEntry): AttackEntry[] {
  const published = listAttacks();
  return guide.relatedAttackCodes
    .map((code) => published.find((a) => a.code === code))
    .filter((a): a is AttackEntry => a !== undefined);
}

/** A guide as the English pages show it: the French entry's identity, the English text. */
export interface LocalizedGuide extends GuideTranslation {
  frSlug: string;
  intent: GuideEntry["intent"];
  relatedAttackCodes: string[];
  updatedAt: string;
}

export function getLocalizedGuide(guide: GuideEntry): LocalizedGuide | null {
  const en = GUIDES_EN[guide.slug];
  if (!en) return null;
  return {
    ...en,
    frSlug: guide.slug,
    intent: guide.intent,
    relatedAttackCodes: guide.relatedAttackCodes,
    updatedAt: guide.updatedAt,
  };
}

/** Published guides that have an English version, in the French order. */
export function listGuidesEn(): LocalizedGuide[] {
  return listGuides()
    .map(getLocalizedGuide)
    .filter((g): g is LocalizedGuide => g !== null);
}

export function findGuideByEnSlug(slug: string): LocalizedGuide | undefined {
  return listGuidesEn().find((g) => g.slug === slug);
}

/** English slug of a French guide, for hreflang. Null when untranslated. */
export function englishGuideSlug(frSlug: string): string | null {
  const guide = findGuideBySlug(frSlug);
  return guide ? (getLocalizedGuide(guide)?.slug ?? null) : null;
}

/** English guides that name this attack. */
export function guidesForAttackEn(attack: AttackEntry): LocalizedGuide[] {
  return guidesForAttack(attack)
    .map(getLocalizedGuide)
    .filter((g): g is LocalizedGuide => g !== null);
}

/** English fiches an English guide defends, skipping untranslated ones. */
export function attacksForGuideEn(guide: LocalizedGuide): LocalizedAttack[] {
  const published = listAttacks();
  return guide.relatedAttackCodes
    .map((code) => published.find((a) => a.code === code))
    .filter((a): a is AttackEntry => a !== undefined)
    .map((a) => getLocalizedAttack(a, "en"))
    .filter((a): a is LocalizedAttack => a !== null);
}

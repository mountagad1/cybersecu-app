/**
 * The ten families that organise /attaques.
 *
 * This is the single source of truth for the category tree: the hub
 * routes, the sitemap, the breadcrumbs and the internal-link graph are all
 * projections of this array. Nothing else may hard-code a category slug —
 * that is how a URL set drifts apart from the pages that actually exist.
 *
 * Membership is declared on each attack entry (`categorySlug`), not here,
 * so an attack can never belong to two families or to none: the registry
 * in src/content/attacks/index.ts fails the build if it does.
 */

export interface AttackCategory {
  slug: string;
  name: string;
  /** One sentence, used as the hub's <h1> lead and its meta description. */
  definition: string;
  /** Why these techniques belong together — the hub's reason to exist. */
  whatUnitesThem: string;
  /** Same overlay pattern as `AttackEntry.translations` (docs/decisions/0009). */
  translations?: {
    en?: { slug: string; name: string; definition: string; whatUnitesThem: string };
  };
}

/**
 * A hub needs enough entries to be worth more than the fiches it lists.
 * Below this, `/attaques/<slug>` is a list of one or two items — a page
 * whose whole body duplicates what it links to, which is the thin page
 * `ANTI_THIN_CONTENT` forbids. Declared families under the threshold exist
 * in this array (so content can name them) but are not routed, not
 * indexed and not in the sitemap.
 */
export const CATEGORY_PUBLICATION_THRESHOLD = 3;

/**
 * Membership is NOT declared here. Each attack entry names its own
 * category (`AttackEntry.categorySlug`), and the registry in
 * src/content/attacks derives the mapping — so an attack cannot belong to
 * two families or to none, and a list of codes here can never fall out of
 * step with the pages that exist. Membership helpers
 * (`getCategoryForAttackCode`, `isCategoryPublishable`,
 * `auditCategoryCoverage`) therefore live in src/content/attacks.
 */

export const ATTACK_CATEGORIES: readonly AttackCategory[] = [
  {
    slug: "ingenierie-sociale",
    name: "Ingénierie sociale",
    definition:
      "Les attaques qui visent la personne plutôt que la machine : un message ou un appel vous pousse à agir vous-même contre votre intérêt.",
    whatUnitesThem:
      "Aucune de ces techniques n'exploite une faille logicielle. Elles exploitent une réaction humaine normale — l'urgence, le respect de l'autorité, l'envie d'aider — et c'est la victime qui exécute l'action. La défense est donc la même partout : ralentir, et vérifier par un canal que l'on a choisi soi-même.",
    translations: {
      en: {
        slug: "social-engineering",
        name: "Social engineering",
        definition:
          "Attacks that target the person rather than the machine: a message or a call pushes you to act against your own interest.",
        whatUnitesThem:
          "None of these techniques exploit a software flaw. They exploit a normal human reaction — urgency, respect for authority, the wish to help — and it's the victim who carries out the action. The defence is therefore the same everywhere: slow down, and verify through a channel you chose yourself.",
      },
    },
  },
  {
    slug: "sites-et-navigateurs",
    name: "Attaques de sites et navigateurs",
    definition:
      "Les attaques qui se jouent dans la barre d'adresse et dans la page : un site imite un service légitime, ou une adresse ressemble à une autre.",
    whatUnitesThem:
      "Le point commun est l'apparence. Le contenu de la page, le logo, le cadenas et même l'adresse peuvent être copiés ou imités. Le seul élément fiable est le nom de domaine réel, et le seul réflexe fiable est de rejoindre un service par un chemin que l'on maîtrise plutôt que par un lien reçu.",
    translations: {
      en: {
        slug: "website-and-browser-attacks",
        name: "Website and browser attacks",
        definition:
          "Attacks that play out in the address bar and on the page itself: a site imitates a legitimate service, or one address looks like another.",
        whatUnitesThem:
          "What they share is appearance. The page's content, the logo, the padlock icon and even the address can be copied or imitated. The only reliable element is the real domain name, and the only reliable reflex is reaching a service by a path you control rather than a link you were sent.",
      },
    },
  },
  {
    slug: "fraudes-financieres",
    name: "Fraudes financières",
    definition:
      "Les attaques dont l'objectif est direct : un paiement, un virement, ou vos coordonnées bancaires complètes.",
    whatUnitesThem:
      "Ici l'argent est l'objectif, pas un moyen. Ces fraudes reposent presque toujours sur un mouvement de fonds que la victime déclenche elle-même, ce qui rend le recours plus difficile ensuite. Le réflexe commun : aucune urgence légitime n'exige un paiement immédiat sans vérification.",
    translations: {
      en: {
        slug: "financial-fraud",
        name: "Financial fraud",
        definition:
          "Attacks with a direct objective: a payment, a transfer, or your full bank details.",
        whatUnitesThem:
          "Here, money is the objective, not a means to something else. These frauds almost always rely on a transfer the victim triggers themselves, which makes recourse harder afterwards. The shared reflex: no legitimate urgency ever requires an immediate payment without verification.",
      },
    },
  },
  {
    slug: "identifiants-et-comptes",
    name: "Identifiants et comptes",
    definition:
      "Les attaques qui visent l'accès à un compte existant : mot de passe, second facteur, ou numéro de téléphone associé.",
    whatUnitesThem:
      "Le compte est la cible, pas la conséquence. Une messagerie compromise sert ensuite à réinitialiser tous les autres comptes, ce qui en fait le point le plus sensible à protéger. La défense commune : un mot de passe unique par service, et une double authentification qui ne repose pas uniquement sur le SMS.",
    translations: {
      en: {
        slug: "credentials-and-accounts",
        name: "Credentials and accounts",
        definition:
          "Attacks that target access to an existing account: a password, a second factor, or the phone number tied to it.",
        whatUnitesThem:
          "The account is the target, not a side effect. A compromised mailbox is then used to reset every other account, which makes it the single most sensitive thing to protect. The shared defence: a unique password per service, and two-factor authentication that doesn't rely on SMS alone.",
      },
    },
  },
  {
    slug: "logiciels-malveillants",
    name: "Logiciels malveillants",
    definition:
      "Les programmes installés sur un appareil pour l'espionner, en chiffrer les fichiers, en détourner la puissance ou en prendre le contrôle.",
    whatUnitesThem:
      "Ce qui les réunit n'est pas ce qu'ils font mais la façon dont ils arrivent : presque toujours par une action de l'utilisateur — un fichier ouvert, une application installée, une mise à jour acceptée. Les symptômes diffèrent, la porte d'entrée est la même, et c'est là que la défense se joue.",
    translations: {
      en: {
        slug: "malware",
        name: "Malware",
        definition:
          "Programs installed on a device to spy on it, encrypt its files, hijack its processing power, or take control of it.",
        whatUnitesThem:
          "What unites them isn't what they do but how they arrive: almost always through something the user does — a file opened, an app installed, an update accepted. The symptoms differ, the entry point is the same, and that's where the defence plays out.",
      },
    },
  },
  {
    slug: "telephones-et-objets-connectes",
    name: "Téléphones et objets connectés",
    definition:
      "Les attaques propres aux appareils que l'on garde sur soi ou chez soi : téléphone, montre, caméra, box, assistant vocal.",
    whatUnitesThem:
      "Ces appareils sont allumés en permanence, mis à jour rarement, et souvent dépourvus d'écran sur lequel un avertissement pourrait s'afficher. Une compromission y est donc silencieuse et durable. Le réflexe commun : changer les mots de passe d'usine et regarder ce que chaque application a le droit de faire.",
    translations: {
      en: {
        slug: "phones-and-connected-devices",
        name: "Phones and connected devices",
        definition:
          "Attacks specific to the devices you keep on you or at home: phone, watch, camera, router, voice assistant.",
        whatUnitesThem:
          "These devices are on all the time, rarely updated, and often have no screen a warning could appear on. A compromise there is therefore silent and long-lasting. The shared reflex: change factory-default passwords and check what each app is actually allowed to do.",
      },
    },
  },
  {
    slug: "reseaux-et-wifi",
    name: "Réseaux et Wi-Fi",
    definition:
      "Les attaques qui s'intercalent entre votre appareil et internet : faux réseau, interception de trafic, détournement de la résolution d'adresses.",
    whatUnitesThem:
      "Elles ne visent aucun de vos comptes en particulier : elles visent le chemin. C'est la famille la moins visible, parce qu'aucune n'affiche de message et que l'appareil fonctionne normalement. La défense commune tient en deux gestes : le chiffrement de bout en bout, et la méfiance vis-à-vis d'un réseau que l'on n'a pas choisi.",
    translations: {
      en: {
        slug: "network-and-wifi-attacks",
        name: "Network and Wi-Fi attacks",
        definition:
          "Attacks that insert themselves between your device and the internet: a fake network, traffic interception, hijacked address resolution.",
        whatUnitesThem:
          "None of them target a specific account of yours: they target the path. This is the least visible family, because none of them show a message and the device keeps working normally. The shared defence comes down to two habits: end-to-end encryption, and distrust of a network you didn't choose.",
      },
    },
  },
  {
    slug: "donnees-et-identite-numerique",
    name: "Données et identité numérique",
    definition:
      "Ce qui arrive à vos informations personnelles une fois qu'elles circulent : fuites, collecte massive, recoupements, usage de votre identité.",
    whatUnitesThem:
      "Aucune de ces situations ne commence par un piratage de votre appareil. Elles commencent ailleurs — chez une entreprise, dans une page publique, dans une autorisation accordée il y a trois ans — et vous les découvrez après coup. La question utile n'est donc pas comment les empêcher, mais comment réduire ce qui circule et quoi faire quand c'est fait.",
    translations: {
      en: {
        slug: "data-and-digital-identity",
        name: "Data and digital identity",
        definition:
          "What happens to your personal information once it's out there: leaks, mass collection, cross-referencing, use of your identity.",
        whatUnitesThem:
          "None of these situations start with your device being hacked. They start elsewhere — at a company, on a public page, in a permission granted three years ago — and you discover them after the fact. The useful question isn't how to prevent them, but how to reduce what's out there and what to do once it is.",
      },
    },
  },
  {
    slug: "ia-et-contenus-synthetiques",
    name: "IA et contenus synthétiques",
    definition:
      "Les attaques qui utilisent des contenus fabriqués par une intelligence artificielle : voix clonée, visage synthétique, texte parfaitement rédigé.",
    whatUnitesThem:
      "L'IA ne crée pas de nouvelles attaques : elle retire les indices sur lesquels nous nous appuyions pour repérer les anciennes. Les fautes d'orthographe, la voix qui ne ressemble pas, le visage introuvable ailleurs — ces repères ne fonctionnent plus. La défense commune consiste à revenir à ce que l'IA ne peut pas fabriquer : un canal que vous avez choisi vous-même.",
    translations: {
      en: {
        slug: "ai-and-synthetic-content",
        name: "AI and synthetic content",
        definition:
          "Attacks that use content fabricated by artificial intelligence: a cloned voice, a synthetic face, perfectly written text.",
        whatUnitesThem:
          "AI doesn't create new attacks: it removes the clues we used to rely on to spot the old ones. Spelling mistakes, a voice that doesn't quite match, a face you can't find anywhere else — those markers no longer work. The shared defence is going back to what AI can't fabricate: a channel you chose yourself.",
      },
    },
  },
  {
    slug: "chantage-et-harcelement",
    name: "Chantage, harcèlement et atteintes à la personne",
    definition:
      "Les attaques dont la cible est la personne elle-même : chantage, diffusion de contenus, harcèlement, surveillance par un proche.",
    whatUnitesThem:
      "Ce sont les seules attaques de ce site où l'on arrive en général après coup, en cherchant quoi faire maintenant plutôt que comment se protéger. La marche à suivre est pourtant la même pour toutes : ne pas payer, ne pas répondre, conserver les preuves, signaler à la plateforme, et déposer plainte. Rien de ce qui vous arrive ici n'est votre faute, et le dire fait partie de la réponse.",
    translations: {
      en: {
        slug: "blackmail-and-harassment",
        name: "Blackmail, harassment and personal harm",
        definition:
          "Attacks that target the person directly: blackmail, distribution of content, harassment, surveillance by someone close to you.",
        whatUnitesThem:
          "These are the only attacks on this site that people usually arrive at after the fact, looking for what to do now rather than how to protect themselves. The procedure is still the same for all of them: don't pay, don't reply, keep the evidence, report it to the platform, and file a police report. Nothing that happens to you here is your fault, and saying so is part of the response.",
      },
    },
  },
] as const;

export type AttackCategorySlug = (typeof ATTACK_CATEGORIES)[number]["slug"];

export function findCategory(slug: string): AttackCategory | undefined {
  return ATTACK_CATEGORIES.find((c) => c.slug === slug);
}

/** Kept as the name the SEO layer already uses. */
export const getCategoryBySlug = findCategory;

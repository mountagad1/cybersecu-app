import type { Locale } from "@/domain/i18n/locale";
import { findAttackByCode } from "./index";
import { getLocalizedAttack } from "./localize";

/**
 * « À ne pas confondre avec » — the pairs of fiches close enough to be
 * mistaken for one another, and what tells them apart.
 *
 * Source: docs/CONTENT_TAXONOMY_PLAN.md §4.1, « Les six frontières à tenir
 * en rédaction », which required every fiche of a pair to say what it is
 * not. Until now that rule only lived in the plan and, for some fiches, in
 * the last sentence of the definition. Here it is one record per pair, so
 * both pages show the same comparison and it cannot drift on one side:
 * reciprocity holds by construction.
 *
 * Each side is described in one sentence that only makes sense next to the
 * other; `difference` is the criterion a reader actually applies. No
 * statistic, no new fact: every sentence restates what the two fiches
 * already say.
 */
interface Text {
  fr: string;
  en: string;
}

export interface Boundary {
  /** Attack codes. Order is irrelevant. */
  pair: readonly [string, string];
  /** What each side is, in the context of this comparison. Keyed by code. */
  sides: Readonly<Record<string, Text>>;
  /** The criterion that separates them. */
  difference: Text;
}

export const BOUNDARIES: readonly Boundary[] = [
  {
    pair: ["SOCIAL-000006", "SOCIAL-000001"],
    sides: {
      "SOCIAL-000006": {
        fr: "La technique : obtenir des informations ou des actions au cours d'un appel, quel que soit l'organisme imité.",
        en: "The technique: getting information or actions out of you during a phone call, whoever the caller claims to be.",
      },
      "SOCIAL-000001": {
        fr: "Un scénario précis de vishing : un faux service anti-fraude bancaire vous fait valider vous-même une opération.",
        en: "One specific vishing scenario: a fake bank fraud department gets you to approve a transaction yourself.",
      },
    },
    difference: {
      fr: "Le vishing désigne la méthode ; le faux conseiller bancaire est l'une de ses mises en scène, avec sa propre marche à suivre auprès de la banque.",
      en: "Vishing is the method; the fake bank advisor is one way of staging it, with its own steps to take with your bank.",
    },
  },
  {
    pair: ["SOCIAL-000009", "DATA-000002"],
    sides: {
      "SOCIAL-000009": {
        fr: "Un moyen : quelqu'un se fait passer pour une personne ou un organisme le temps d'un échange.",
        en: "A means: someone poses as a person or an organisation for the length of an exchange.",
      },
      "DATA-000002": {
        fr: "Un préjudice : un tiers agit en votre nom dans la durée — crédit, abonnement, démarche.",
        en: "A harm: someone acts in your name over time — a loan, a subscription, a formality.",
      },
    },
    difference: {
      fr: "L'usurpation trompe la personne à qui l'on parle ; le vol d'identité vous fait porter, en apparence, des actes que vous n'avez pas faits.",
      en: "Impersonation deceives the person being spoken to; identity theft makes you appear responsible for acts you did not carry out.",
    },
  },
  {
    pair: ["PHISH-000001", "SMS-000001"],
    sides: {
      "PHISH-000001": {
        fr: "Le principe : un message qui imite un expéditeur légitime pour obtenir vos identifiants ou vos données bancaires, le plus souvent par email.",
        en: "The principle: a message that imitates a legitimate sender to obtain your credentials or bank details, most often by email.",
      },
      "SMS-000001": {
        fr: "La même méthode par SMS, sur un écran où l'adresse du lien s'affiche souvent tronquée.",
        en: "The same method by text message, on a screen where the link's address is often cut short.",
      },
    },
    difference: {
      fr: "Le smishing n'est pas une autre arnaque : c'est l'hameçonnage par SMS. Ce qui change, c'est ce que vous pouvez vérifier sur un téléphone.",
      en: "Smishing is not a different scam: it is phishing by text message. What changes is what you can check on a phone.",
    },
  },
  {
    pair: ["PHISH-000001", "SOCIAL-000006"],
    sides: {
      "PHISH-000001": {
        fr: "Le principe, le plus souvent par écrit : un message, un lien, une page à inspecter.",
        en: "The principle, most often in writing: a message, a link, a page you can inspect.",
      },
      "SOCIAL-000006": {
        fr: "La même méthode à l'oral : rien n'est écrit, rien ne peut être relu, et l'interlocuteur impose son rythme.",
        en: "The same method by voice: nothing is written down, nothing can be reread, and the caller sets the pace.",
      },
    },
    difference: {
      fr: "Un appel n'a pas de lien à inspecter : la seule vérification possible est de raccrocher et de rappeler l'organisme par un numéro que vous connaissez déjà.",
      en: "A call has no link to inspect: the only possible check is to hang up and call the organisation back on a number you already know.",
    },
  },
  {
    pair: ["PHISH-000001", "QR-000001"],
    sides: {
      "PHISH-000001": {
        fr: "Le principe, dans un message reçu : l'adresse du lien peut être lue avant d'être ouverte.",
        en: "The principle, inside a message you receive: the link's address can be read before it is opened.",
      },
      "QR-000001": {
        fr: "La même méthode par QR code, souvent hors de l'écran : affiche, horodateur, courrier. Le code masque l'adresse.",
        en: "The same method through a QR code, often away from any screen: a poster, a parking meter, a letter. The code hides the address.",
      },
    },
    difference: {
      fr: "Avec un QR code, l'adresse ne se lit qu'une fois le code scanné : c'est à ce moment qu'il faut la vérifier, avant d'ouvrir la page.",
      en: "With a QR code, the address can only be read once the code is scanned: that is the moment to check it, before opening the page.",
    },
  },
  {
    pair: ["SOCIAL-000003", "MAL-000010"],
    sides: {
      "SOCIAL-000003": {
        fr: "Un humain : un faux technicien, au téléphone, obtient la prise en main de votre ordinateur ou un paiement.",
        en: "A person: a fake technician, on the phone, gets remote control of your computer or a payment.",
      },
      "MAL-000010": {
        fr: "Un logiciel ou une page : une fausse alerte vend ou fait installer une prétendue solution.",
        en: "A program or a web page: a fake alert sells or installs a so-called fix.",
      },
    },
    difference: {
      fr: "Les deux s'enchaînent souvent — l'alerte affiche un numéro, le numéro mène au faux technicien —, mais ne se confondent pas : d'un côté on ferme la page, de l'autre on raccroche.",
      en: "They often follow one another — the alert shows a number, the number leads to the fake technician — but they are not the same: in one case you close the page, in the other you hang up.",
    },
  },
  {
    pair: ["MAL-000003", "PERS-000005"],
    sides: {
      "MAL-000003": {
        fr: "Un inconnu, à distance, installe un programme pour observer votre activité.",
        en: "A stranger, remotely, installs a program to watch your activity.",
      },
      "PERS-000005": {
        fr: "Un proche, avec un accès physique à votre téléphone, y installe une application de surveillance.",
        en: "Someone close to you, with physical access to your phone, installs a surveillance app on it.",
      },
    },
    difference: {
      fr: "La technique est la même, la situation est opposée : face à un stalkerware, supprimer l'application peut alerter la personne qui vous surveille. La sécurité passe avant le nettoyage.",
      en: "The technique is the same, the situation is the opposite: with stalkerware, removing the app can alert the person watching you. Safety comes before clean-up.",
    },
  },
  {
    pair: ["PERS-000001", "PERS-000002"],
    sides: {
      "PERS-000001": {
        fr: "L'auteur détient, ou a pu obtenir, des images intimes de vous, et menace de les diffuser.",
        en: "The blackmailer has, or may have obtained, intimate images of you, and threatens to share them.",
      },
      "PERS-000002": {
        fr: "Rien n'existe : un email envoyé en masse prétend que votre webcam vous a filmé.",
        en: "Nothing exists: a mass-mailed email claims your webcam filmed you.",
      },
    },
    difference: {
      fr: "La première question à se poser : avez-vous réellement partagé des images intimes, ou été filmé, avec la personne qui vous menace ? Dans les deux cas, payer ne met pas fin à la demande.",
      en: "The first question to ask: did you actually share intimate images, or get filmed, with the person threatening you? Either way, paying does not end the demand.",
    },
  },
  // Added 2026-10-10 from docs/seo/PROGRAMMATIC_SEO_MATRIX.csv: the four
  // groups whose definitions are the closest in the catalogue, and which
  // already set themselves against each other in their own definitions.
  {
    pair: ["MAL-000005", "MAL-000006"],
    sides: {
      "MAL-000005": {
        fr: "Un programme qui se copie dans d'autres fichiers et se propage quand on les ouvre ou les partage.",
        en: "A program that copies itself into other files and spreads when they are opened or shared.",
      },
      "MAL-000006": {
        fr: "Un programme qui se propage tout seul à travers un réseau, sans fichier hôte ni action de l'utilisateur.",
        en: "A program that spreads on its own through a network, with no host file and no user action.",
      },
    },
    difference: {
      fr: "Le virus attend qu'on ouvre un fichier ; le ver n'attend personne, et c'est ce qui le rend rapide.",
      en: "A virus waits for someone to open a file; a worm waits for no one, which is what makes it fast.",
    },
  },
  {
    pair: ["MAL-000005", "MAL-000002"],
    sides: {
      "MAL-000005": {
        fr: "Il se reproduit : il se copie dans d'autres fichiers pour se répandre.",
        en: "It reproduces: it copies itself into other files to spread.",
      },
      "MAL-000002": {
        fr: "Il ne se reproduit pas : c'est vous qui l'installez, parce qu'il se présente comme un programme utile.",
        en: "It doesn't reproduce: you install it yourself, because it presents itself as a useful program.",
      },
    },
    difference: {
      fr: "Le virus se répand de fichier en fichier ; le cheval de Troie n'a pas besoin de se propager, puisqu'il obtient son exécution de la personne visée.",
      en: "A virus spreads from file to file; a trojan horse doesn't need to spread, since it gets itself run by the targeted person.",
    },
  },
  {
    pair: ["MAL-000006", "MAL-000002"],
    sides: {
      "MAL-000006": {
        fr: "Il se déplace seul d'un appareil à l'autre, sans que personne n'ouvre ni n'installe rien.",
        en: "It moves by itself from one device to another, without anyone opening or installing anything.",
      },
      "MAL-000002": {
        fr: "Il ne se déplace pas : il attend qu'on l'installe, caché dans un programme d'apparence légitime.",
        en: "It doesn't move: it waits to be installed, hidden in an apparently legitimate program.",
      },
    },
    difference: {
      fr: "Le ver se propage par sa propre autonomie ; le cheval de Troie, par la confiance de la personne qui l'installe.",
      en: "A worm spreads through its own autonomy; a trojan horse, through the trust of the person who installs it.",
    },
  },
  {
    pair: ["MOB-000009", "MOB-000005"],
    sides: {
      "MOB-000009": {
        fr: "Une caméra de vidéosurveillance dont un tiers a obtenu l'accès : c'est l'intérieur de votre domicile qui est exposé.",
        en: "A surveillance camera a third party has gained access to: what is exposed is the inside of your home.",
      },
      "MOB-000005": {
        fr: "Un appareil connecté sans écran — ampoule, prise, thermostat, jouet — dont un tiers a pris le contrôle sans que rien ne le signale.",
        en: "A connected device with no screen — a bulb, a plug, a thermostat, a toy — that a third party has taken control of with nothing to signal it.",
      },
    },
    difference: {
      fr: "La porte d'entrée est souvent la même, un identifiant d'usine ; ce qui change, c'est ce que l'intrus obtient : des images de chez vous avec la caméra, le contrôle d'un appareil avec les autres objets.",
      en: "The way in is often the same, a factory credential; what changes is what the intruder gets: images of your home with the camera, control of a device with other objects.",
    },
  },
  {
    pair: ["MOB-000010", "MOB-000005"],
    sides: {
      "MOB-000010": {
        fr: "L'équipement par lequel passe tout le trafic du foyer : compromis, il peut orienter ou observer celui de chaque appareil.",
        en: "The equipment all of the household's traffic goes through: compromised, it can redirect or observe the traffic of every device.",
      },
      "MOB-000005": {
        fr: "Un seul appareil du foyer, dont un tiers a pris le contrôle.",
        en: "A single device in the home, which a third party has taken control of.",
      },
    },
    difference: {
      fr: "Un objet compromis, c'est un appareil perdu ; une box compromise met en cause tous les appareils de la maison, sans que rien ne soit installé sur eux.",
      en: "A compromised device is one device lost; a compromised router puts every device in the home at risk, without anything being installed on them.",
    },
  },
  {
    pair: ["AI-000009", "PERS-000003"],
    sides: {
      "AI-000009": {
        fr: "Des images fabriquées à partir de photos ordinaires et publiques : la personne n'a jamais rien envoyé d'intime.",
        en: "Images manufactured from ordinary, public photos: the person never sent anything intimate.",
      },
      "PERS-000003": {
        fr: "Des images intimes réelles, confiées à quelqu'un, publiées ou envoyées sans accord.",
        en: "Real intimate images, entrusted to someone, published or sent without consent.",
      },
    },
    difference: {
      fr: "Le détournement par IA fabrique des images qui n'ont jamais existé ; la diffusion non consentie publie des images réelles obtenues dans une relation de confiance.",
      en: "AI misuse manufactures images that never existed; non-consensual sharing publishes real images obtained within a relationship of trust.",
    },
  },
  {
    pair: ["PERS-000001", "PERS-000003"],
    sides: {
      "PERS-000001": {
        fr: "Une menace de diffuser des contenus intimes pour obtenir de l'argent, d'autres images ou la poursuite d'une relation.",
        en: "A threat to distribute intimate content to obtain money, more images, or a continued relationship.",
      },
      "PERS-000003": {
        fr: "La diffusion elle-même, sans demande d'argent : l'objectif est de nuire.",
        en: "The distribution itself, with no demand for money: the goal is to harm.",
      },
    },
    difference: {
      fr: "La sextorsion menace pour obtenir quelque chose ; la diffusion non consentie est déjà passée à l'acte.",
      en: "Sextortion threatens in order to get something; non-consensual sharing has already acted.",
    },
  },
  {
    pair: ["NET-000008", "NET-000002"],
    sides: {
      "NET-000008": {
        fr: "Des déconnexions répétées du Wi-Fi : elles ne donnent accès à rien, elles préparent autre chose.",
        en: "Repeated disconnections from Wi-Fi: they grant access to nothing, they set up something else.",
      },
      "NET-000002": {
        fr: "Un réseau publié sous un nom qui imite le vrai, pour que votre trafic passe par lui.",
        en: "A network published under a name that imitates the real one, so that your traffic passes through it.",
      },
    },
    difference: {
      fr: "La déauthentification vous chasse de votre réseau ; le faux point d'accès est celui vers lequel elle vous pousse.",
      en: "Deauthentication drives you off your network; the fake access point is the one it pushes you towards.",
    },
  },
  {
    pair: ["NET-000003", "NET-000002"],
    sides: {
      "NET-000003": {
        fr: "Sur un réseau que vous avez déjà rejoint, un appareil se fait passer pour la box.",
        en: "On a network you have already joined, a device impersonates the router.",
      },
      "NET-000002": {
        fr: "Le réseau lui-même est fourni par le tiers, sous un nom qui imite celui que vous attendez.",
        en: "The network itself is supplied by the third party, under a name that imitates the one you expect.",
      },
    },
    difference: {
      fr: "L'usurpation ARP suppose un accès préalable au réseau ; avec le faux point d'accès, c'est vous qui rejoignez le réseau de l'attaquant.",
      en: "ARP spoofing requires prior access to the network; with a fake access point, you are the one joining the attacker's network.",
    },
  },
];

/** One comparison as a page shows it: the other fiche, both descriptions, the criterion. */
export interface LocalizedBoundary {
  other: { code: string; name: string; slug: string };
  self: string;
  that: string;
  difference: string;
}

/**
 * The comparisons a fiche shows, in its locale. A pair whose other fiche is
 * missing, unpublished or untranslated is left out rather than linked to a
 * page that does not exist.
 */
export function boundariesFor(
  code: string,
  locale: Locale,
): LocalizedBoundary[] {
  return BOUNDARIES.filter((b) => b.pair.includes(code)).flatMap((b) => {
    const otherCode = b.pair[0] === code ? b.pair[1] : b.pair[0];
    const other = findAttackByCode(otherCode);
    if (!other || other.editorialStatus !== "published") return [];
    const localized = getLocalizedAttack(other, locale);
    if (!localized) return [];
    return [
      {
        other: { code: otherCode, name: localized.name, slug: localized.slug },
        self: b.sides[code][locale],
        that: b.sides[otherCode][locale],
        difference: b.difference[locale],
      },
    ];
  });
}

/** Build-time checks, run by boundaries.test.ts. */
export function auditBoundaries(boundaries: readonly Boundary[]): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const b of boundaries) {
    const [a, c] = b.pair;
    const key = [a, c].sort().join("|");
    if (a === c)
      problems.push(`${a} : une fiche ne se compare pas à elle-même`);
    if (seen.has(key)) problems.push(`${key} : paire en double`);
    seen.add(key);
    for (const code of b.pair) {
      if (!findAttackByCode(code)) problems.push(`${code} : code inconnu`);
      if (!b.sides[code])
        problems.push(`${key} : description manquante pour ${code}`);
    }
    const texts = [...Object.values(b.sides), b.difference].flatMap((t) => [
      t.fr,
      t.en,
    ]);
    if (texts.some((t) => !t.trim())) problems.push(`${key} : texte vide`);
    if (texts.some((t) => /%/.test(t)))
      problems.push(`${key} : pourcentage (aucune statistique sans source)`);
    if (texts.some((t) => !/[.?!]$/.test(t.trim())))
      problems.push(`${key} : chaque texte est une phrase complète`);
  }
  return problems;
}

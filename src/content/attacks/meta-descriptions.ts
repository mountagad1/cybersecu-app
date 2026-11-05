import type { Locale } from "@/domain/i18n/locale";

/**
 * Hand-written search-result descriptions, for the fiches that already have
 * Search Console impressions (export of 2026-10-20, docs/growth/EXPERIMENT_LOG.md
 * cycle 5). Elsewhere the description stays the definition, cut by
 * `metaDescription` — which on 168 of 200 fiches ended in « … » because the
 * first sentence runs past 160 characters.
 *
 * Each one restates the fiche's own definition and names sections the fiche
 * really has (signs, what to do); nothing here says more than the page.
 * Keyed by the slug in that locale; checked against the catalogue and the
 * length limit by attack-meta.test.ts.
 */
export const ATTACK_META_DESCRIPTIONS: Record<Locale, Readonly<Record<string, string>>> = {
  fr: {
    baiting:
      "Baiting (appât) : on vous offre ce que vous voulez — fichier, logiciel gratuit, clé USB, cadeau — contre une action. Définition, exemples et que faire.",
    clickjacking:
      "Clickjacking : un élément invisible superposé à la page reçoit votre clic à la place de ce que vous voyez. Définition, signes et comment s'en protéger.",
    "camera-de-surveillance-piratee":
      "Caméra de surveillance piratée : un tiers y accède, souvent par un mot de passe d'usine ou réutilisé. Les signes, les vérifications et que faire.",
    cryptojacking:
      "Cryptojacking : votre appareil produit de la cryptomonnaie pour un tiers, à votre insu. Définition, signes à repérer et que faire.",
    "fraude-aux-documents-d-identite":
      "Fraude aux documents d'identité : une copie de votre pièce, demandée sous un faux prétexte, pour agir en votre nom. Comment la reconnaître et que faire.",
    "fausse-application-d-ia":
      "Fausse application d'IA : logiciel ou extension qui imite un outil d'IA connu pour collecter vos identifiants ou vos données. Signes et que faire.",
  },
  en: {
    "computer-worm":
      "Computer worm definition: malware that copies itself across a network on its own, with no click and no host file. How it differs from a virus, and protection.",
    scareware:
      "Scareware definition: a fake security alert that scares you into buying or installing a bogus fix. How to recognise it and what to do if you clicked.",
    "arp-spoofing":
      "ARP spoofing (ARP poisoning): a device on your local network impersonates the router so your traffic passes through it. Definition, signs and protection.",
    pretexting:
      "Pretexting definition: an attacker builds a credible role over several exchanges, then makes a request that seems normal. Examples and how to verify.",
    rootkit:
      "What is a rootkit? Malware installed with high privileges to hide itself and other malicious programs from the operating system. Signs and what to do.",
    "network-traffic-interception":
      "Network traffic interception: a third party watches data crossing a network. What it really exposes, what encryption protects, and how to stay safe.",
    "fake-ai-app":
      "Fake AI app: software, extension or mobile app posing as a well-known AI tool to collect your credentials or data. How to spot it and what to do.",
    "browser-hijacking":
      "Browser hijacking: software keeps changing your home page, search engine or new tab to redirect your browsing. Signs to spot and what to do.",
    "identity-impersonation":
      "Identity impersonation: someone borrows the identity of a person or organisation you trust to obtain something from you. How to verify and react.",
    "session-hijacking":
      "Session hijacking definition: reusing the token a site issues after login to enter your account with no password or code. Signs and what to do.",
    "deepfake-video-call":
      "Deepfake video call: a synthetic face and voice used live to get a request — often a wire transfer — approved. Why seeing is no longer verifying.",
    "dns-poisoning":
      "DNS poisoning: the address you typed is correct, but you land on a server controlled by a third party. Definition, difference with typosquatting, what to do.",
    "data-re-identification":
      "Re-identification: working out who is behind « anonymous » data by cross-referencing other sources. What it means for your personal data.",
    baiting:
      "Baiting definition: you are offered something you want — a file, free software, a USB drive, a gift — in exchange for an action. Examples and what to do.",
    "overlay-attack":
      "Overlay attack: a phone app draws a fake window over another app, such as your banking app, to capture what you type. Warning signs and what to do.",
    swatting:
      "Swatting: a false report of a serious emergency sends police to someone's home in order to harm them. What it is and what to do if you are targeted.",
    malvertising:
      "Malvertising definition: malicious content spread through ad networks and shown on legitimate sites that were never hacked. Signs and protection.",
    "computer-virus":
      "Computer virus definition: malware that copies itself into other files and spreads when they are opened or shared. Virus or malware? Signs and what to do.",
  },
};

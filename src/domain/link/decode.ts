import { parse } from "tldts";

/**
 * Reads a URL the way the browser will, and explains it.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 * It never says a link is safe or dangerous. It has no reputation data,
 * and even with some, « not on a list » would be read as « safe » — the
 * single most harmful thing a tool like this could tell a scam target. It
 * states facts about the address (who owns the domain, what is decorative,
 * which characters are not what they look like) and leaves the judgement
 * to the reader, with the rule that a login or a payment never goes
 * through a received link anyway.
 *
 * Pure and synchronous: it runs in the browser and nothing typed into the
 * tool is sent anywhere.
 */

export type ObservationKind =
  | "subdomain"
  | "userinfo"
  | "ip"
  | "punycode"
  | "non-ascii"
  | "mixed-script"
  | "uppercase"
  | "shortener"
  | "http"
  | "no-scheme"
  | "unknown-suffix";

export interface Observation {
  kind: ObservationKind;
  /** Plain-language explanation shown to the reader. */
  text: string;
}

export interface SuspiciousChar {
  char: string;
  /** e.g. "U+0430" */
  codePoint: string;
  script: string;
}

export type LinkAnalysis =
  | { ok: false; error: string }
  | {
      ok: true;
      /** Lowercased host as the browser resolves it (punycode for non-ASCII). */
      hostname: string;
      /** The part the owner actually registered — null for an IP address. */
      registrableDomain: string | null;
      subdomain: string;
      publicSuffix: string | null;
      protocol: string;
      observations: Observation[];
      suspiciousChars: SuspiciousChar[];
    };

/**
 * Well-known general-purpose URL shorteners. Not a blocklist — shorteners
 * are legitimate — but a shortened link hides its destination, which is
 * the one thing the reader is trying to check.
 */
const SHORTENERS = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "cutt.ly",
  "rebrand.ly",
  "shorturl.at",
  "rb.gy",
  "tiny.cc",
  "buff.ly",
]);

export type DecodeLocale = "fr" | "en";

const SCRIPTS: { name: Record<DecodeLocale, string>; re: RegExp }[] = [
  { name: { fr: "latin", en: "Latin" }, re: /\p{Script=Latin}/u },
  { name: { fr: "cyrillique", en: "Cyrillic" }, re: /\p{Script=Cyrillic}/u },
  { name: { fr: "grec", en: "Greek" }, re: /\p{Script=Greek}/u },
  { name: { fr: "arménien", en: "Armenian" }, re: /\p{Script=Armenian}/u },
];

function scriptOf(char: string, locale: DecodeLocale): string {
  return SCRIPTS.find((s) => s.re.test(char))?.name[locale] ?? (locale === "fr" ? "autre" : "other");
}

/**
 * Every sentence the analysis can produce, per language. The French and
 * English versions say the same thing — the same facts, the same absence of
 * verdict (`decode.test.ts` checks both).
 */
const MESSAGES = {
  fr: {
    empty: "Collez une adresse à analyser.",
    space: "Une adresse ne contient pas d'espace : collez uniquement le lien.",
    unreadable: "Ce texte n'est pas une adresse web lisible.",
    notWeb: "Seules les adresses web (http ou https) peuvent être analysées.",
    noScheme: "L'adresse n'indiquait pas « https:// » : elle a été lue comme si elle commençait ainsi.",
    userinfo: (user: string) =>
      `Tout ce qui précède le signe « @ » (« ${user} ») est ignoré pour choisir le site : la destination réelle est ce qui le suit. C'est une façon classique de faire lire un nom rassurant en premier.`,
    ip: "L'adresse désigne une machine par son numéro (adresse IP) au lieu d'un nom de domaine. Aucun organisme ne vous demandera de vous connecter de cette façon.",
    subdomain: (sub: string, domain: string) =>
      `« ${sub} » est un sous-domaine : le propriétaire de « ${domain} » peut y écrire ce qu'il veut, y compris le nom d'une banque ou d'une administration. Il ne dit rien de qui possède le site.`,
    unknownSuffix: (suffix: string) =>
      `L'extension « .${suffix} » n'est pas une extension officielle d'internet : vérifiez l'adresse, elle est peut-être incomplète.`,
    nonAscii:
      "L'adresse contient des caractères qui ne sont pas des lettres latines ordinaires, même s'ils leur ressemblent. Le navigateur les traduit en une forme commençant par « xn-- » : c'est cette forme, ci-dessous, qui désigne réellement le site.",
    mixedScript: (scripts: string) =>
      `Le nom mélange des alphabets différents (${scripts}). Un vrai nom de domaine n'a aucune raison de le faire : c'est la signature d'une attaque par homoglyphes.`,
    punycode:
      "Une partie de l'adresse commence par « xn-- » : c'est l'encodage de caractères non latins. Ce n'est pas frauduleux en soi, mais cela n'a rien à faire là où vous attendiez un nom ordinaire.",
    uppercase: (host: string) =>
      `Les noms de domaine ne distinguent pas majuscules et minuscules. Lu en minuscules, comme le fait le navigateur, le nom devient « ${host} » : une majuscule peut servir à imiter une autre lettre (un I majuscule ressemble à un l minuscule).`,
    shortener: (domain: string) =>
      `« ${domain} » est un service de raccourcissement de liens : il redirige vers une autre adresse que celle-ci ne montre pas. Le domaine qui compte est celui de la destination, invisible ici.`,
    http: "La connexion n'est pas chiffrée (http et non https). À l'inverse, un « https » ou un cadenas ne prouve pas qu'un site est honnête : il indique seulement que la connexion est chiffrée.",
  },
  en: {
    empty: "Paste an address to analyze.",
    space: "An address contains no spaces: paste only the link.",
    unreadable: "This text is not a readable web address.",
    notWeb: "Only web addresses (http or https) can be analyzed.",
    noScheme: "The address did not include “https://”: it was read as if it started that way.",
    userinfo: (user: string) =>
      `Everything before the “@” sign (“${user}”) is ignored when choosing the site: the real destination is what follows it. It is a classic way of getting a reassuring name read first.`,
    ip: "The address points to a machine by its number (IP address) instead of a domain name. No organization will ask you to sign in this way.",
    subdomain: (sub: string, domain: string) =>
      `“${sub}” is a subdomain: the owner of “${domain}” can write whatever they like there, including the name of a bank or a government agency. It says nothing about who owns the site.`,
    unknownSuffix: (suffix: string) =>
      `The extension “.${suffix}” is not an official internet extension: check the address, it may be incomplete.`,
    nonAscii:
      "The address contains characters that are not ordinary Latin letters, even if they look like them. The browser converts them into a form starting with “xn--”: that form, below, is what actually identifies the site.",
    mixedScript: (scripts: string) =>
      `The name mixes different alphabets (${scripts}). A real domain name has no reason to do that: it is the signature of a homoglyph attack.`,
    punycode:
      "Part of the address starts with “xn--”: that is the encoding of non-Latin characters. It is not fraudulent in itself, but it has no business being there when you expected an ordinary name.",
    uppercase: (host: string) =>
      `Domain names do not distinguish between upper and lower case. Read in lower case, as the browser does, the name becomes “${host}”: a capital letter can be used to imitate another letter (a capital I looks like a lower-case l).`,
    shortener: (domain: string) =>
      `“${domain}” is a link-shortening service: it redirects to another address that this one does not show. The domain that matters is the destination's, invisible here.`,
    http: "The connection is not encrypted (http, not https). Conversely, “https” or a padlock does not prove a site is honest: it only shows that the connection is encrypted.",
  },
} as const;

/** The host exactly as typed, before the URL parser lowercases and encodes it. */
function rawHost(input: string): string {
  const afterScheme = input.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
  const authority = afterScheme.split(/[/?#]/, 1)[0] ?? "";
  const hostAndPort = authority.includes("@") ? authority.slice(authority.lastIndexOf("@") + 1) : authority;
  return hostAndPort.replace(/:\d+$/, "");
}

export function analyzeLink(rawInput: string, locale: DecodeLocale = "fr"): LinkAnalysis {
  const m = MESSAGES[locale];
  const input = rawInput.trim();
  if (!input) return { ok: false, error: m.empty };
  if (/\s/.test(input)) {
    return { ok: false, error: m.space };
  }

  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(input);
  let url: URL;
  try {
    url = new URL(hasScheme ? input : `https://${input}`);
  } catch {
    return { ok: false, error: m.unreadable };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, error: m.notWeb };
  }

  const hostname = url.hostname;
  const parsed = parse(url.href);
  const observations: Observation[] = [];
  const typedHost = rawHost(input);

  if (!hasScheme) {
    observations.push({
      kind: "no-scheme",
      text: m.noScheme,
    });
  }

  if (url.username || url.password) {
    observations.push({
      kind: "userinfo",
      text: m.userinfo(decodeURIComponent(url.username)),
    });
  }

  if (parsed.isIp) {
    observations.push({
      kind: "ip",
      text: m.ip,
    });
  }

  if (parsed.subdomain) {
    observations.push({
      kind: "subdomain",
      text: m.subdomain(parsed.subdomain, parsed.domain ?? ""),
    });
  }

  if (!parsed.isIp && parsed.publicSuffix && !parsed.isIcann && parsed.publicSuffix !== "test") {
    observations.push({
      kind: "unknown-suffix",
      text: m.unknownSuffix(parsed.publicSuffix),
    });
  }

  const nonAscii = [...typedHost].filter((c) => c.charCodeAt(0) > 127);
  const suspiciousChars: SuspiciousChar[] = [...new Set(nonAscii)].map((char) => ({
    char,
    codePoint: `U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`,
    script: scriptOf(char, locale),
  }));

  if (suspiciousChars.length > 0) {
    observations.push({
      kind: "non-ascii",
      text: m.nonAscii,
    });
    const scripts = new Set([...typedHost].filter((c) => /\p{L}/u.test(c)).map((c) => scriptOf(c, locale)));
    if (scripts.size > 1) {
      observations.push({
        kind: "mixed-script",
        text: m.mixedScript([...scripts].join(", ")),
      });
    }
  } else if (hostname.split(".").some((label) => label.startsWith("xn--"))) {
    observations.push({
      kind: "punycode",
      text: m.punycode,
    });
  }

  if (suspiciousChars.length === 0 && typedHost !== typedHost.toLowerCase()) {
    observations.push({
      kind: "uppercase",
      text: m.uppercase(hostname),
    });
  }

  if (parsed.domain && SHORTENERS.has(parsed.domain)) {
    observations.push({
      kind: "shortener",
      text: m.shortener(parsed.domain),
    });
  }

  if (url.protocol === "http:") {
    observations.push({
      kind: "http",
      text: m.http,
    });
  }

  return {
    ok: true,
    hostname,
    registrableDomain: parsed.domain,
    subdomain: parsed.subdomain ?? "",
    publicSuffix: parsed.publicSuffix,
    protocol: url.protocol.replace(":", ""),
    observations,
    suspiciousChars,
  };
}

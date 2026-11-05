import { listAttacks } from "@/content/attacks";
import { listAudiences } from "@/content/audiences";
import { listGuides, listGuidesEn } from "@/content/guides";
import { listLevers, listLeversEn } from "@/content/levers";
import { listSimulations } from "@/content/simulations";
import { listSimulationsEn } from "@/content/simulations-en";
import { buildUrlRegistry } from "@/domain/seo/indexability";

/**
 * Segmentation of Search Console rows (docs/growth/WEEKLY_SEO_GEO_PROTOCOL.md
 * §3). A page is described by stable keys only — French slugs, attack
 * codes, family slugs — so the French and English page of one entity land
 * in the same entity segment, and a renamed English slug does not split a
 * time series.
 */

/** Same vocabulary as `PageType` in `@/lib/analytics`, so a segment read in
 * Search Console and one read in analytics mean the same pages. */
export type PageSegment =
  | "home"
  | "attack"
  | "category"
  | "guide"
  | "simulation"
  | "tool"
  | "audience"
  | "gallery"
  | "comparator"
  | "lever"
  | "index"
  | "other";

export interface ClassifiedPage {
  path: string;
  locale: "fr" | "en";
  pageType: PageSegment;
  /** Attack code, guide or lever French slug: one key per entity, both languages. */
  entity: string | null;
  /** Attack family (French slug) for fiches, hubs and simulations; guide intent for guides. */
  category: string | null;
  /** False for a URL Google reports that the registry does not list as indexable. */
  inRegistry: boolean;
}

interface Lookup {
  indexable: Set<string>;
  attacks: Map<string, { code: string; category: string }>;
  simulations: Map<string, string>;
  guides: Map<string, { slug: string; intent: string }>;
  levers: Map<string, string>;
  audiences: Set<string>;
  familyOf: Map<string, string>;
}

let cached: Lookup | null = null;

function lookup(): Lookup {
  if (cached) return cached;
  const attacks = new Map<string, { code: string; category: string }>();
  const familyOf = new Map<string, string>();
  for (const a of listAttacks()) {
    familyOf.set(a.code, a.categorySlug);
    attacks.set(a.slug, { code: a.code, category: a.categorySlug });
    const en = a.translations?.en?.slug;
    if (en) attacks.set(`en:${en}`, { code: a.code, category: a.categorySlug });
  }
  const simulations = new Map<string, string>();
  for (const s of listSimulations()) simulations.set(s.slug, s.attackCode);
  for (const s of listSimulationsEn()) simulations.set(`en:${s.slug}`, s.attackCode);
  const guides = new Map<string, { slug: string; intent: string }>();
  for (const g of listGuides()) guides.set(g.slug, { slug: g.slug, intent: g.intent });
  for (const g of listGuidesEn()) guides.set(`en:${g.slug}`, { slug: g.frSlug, intent: g.intent });
  const levers = new Map<string, string>();
  for (const l of listLevers()) levers.set(l.slug, l.slug);
  for (const l of listLeversEn()) levers.set(`en:${l.slug}`, l.frSlug);
  const audiences = new Set(listAudiences().flatMap((a) => [a.slug, `en:${a.enSlug}`]));
  cached = {
    indexable: new Set(buildUrlRegistry().filter((e) => e.indexable).map((e) => e.path)),
    attacks,
    simulations,
    guides,
    levers,
    audiences,
    familyOf,
  };
  return cached;
}

/** Site path of a URL as Search Console reports it: no origin, query, fragment or trailing slash. */
export function normalizePath(url: string): string {
  let path = url.trim();
  try {
    path = new URL(path, "https://placeholder.invalid").pathname;
  } catch {
    path = path.split(/[?#]/)[0];
  }
  try {
    path = decodeURIComponent(path);
  } catch {
    // keep the encoded form
  }
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return path || "/";
}

export function classifyPage(url: string): ClassifiedPage {
  const l = lookup();
  const path = normalizePath(url);
  const locale: ClassifiedPage["locale"] = path === "/en" || path.startsWith("/en/") ? "en" : "fr";
  const rest = locale === "en" ? path.slice(3) || "/" : path;
  const [section, slug] = rest.split("/").filter(Boolean);
  const key = (s: string) => (locale === "en" ? `en:${s}` : s);
  const page = (pageType: PageSegment, entity: string | null = null, category: string | null = null): ClassifiedPage => ({
    path,
    locale,
    pageType,
    entity,
    category,
    inRegistry: l.indexable.has(path),
  });

  if (!section) return page("home");
  if (!slug) {
    if (section === "exemples" || section === "examples") return page("gallery");
    return page(["attaques", "guides", "simulations", "outils", "tools", "leviers", "levers"].includes(section) ? "index" : "other");
  }
  switch (section) {
    case "attaques": {
      const attack = l.attacks.get(key(slug));
      if (attack) return page("attack", attack.code, attack.category);
      // Not a fiche: a family hub if the registry lists it, otherwise an old or unknown URL.
      return l.indexable.has(path) ? page("category", null, slug) : page("other");
    }
    case "simulations": {
      // A simulation belongs to the family of the fiche it trains.
      const code = l.simulations.get(key(slug)) ?? null;
      return page("simulation", code, code ? (l.familyOf.get(code) ?? null) : null);
    }
    case "guides": {
      const guide = l.guides.get(key(slug));
      return page("guide", guide?.slug ?? null, guide?.intent ?? null);
    }
    case "leviers":
    case "levers":
      return page("lever", l.levers.get(key(slug)) ?? null);
    case "outils":
    case "tools":
      if (slug === "x-ou-y" || slug === "x-or-y") return page("comparator");
      return page(l.audiences.has(key(slug)) ? "audience" : "tool", slug);
    default:
      return page("other");
  }
}

/** What the searcher wants to do. Same names as `QUERY_ENTITY_PAGE_MAP.csv`, where they overlap. */
export type QueryIntent =
  | "navigational"
  | "incident-response"
  | "report"
  | "comparison"
  | "simulation"
  | "detection"
  | "prevention"
  | "informational"
  | "unclassified";

// First match wins: « j'ai cliqué sur un faux sms que faire » is an incident,
// not a detection query, even though it names the channel.
const INTENT_RULES: readonly [QueryIntent, RegExp][] = [
  ["navigational", /cybersecu/],
  ["incident-response", /que faire|j'?ai (cliqué|clique|donné|donne|payé|paye|répondu|repondu|saisi|laissé|laisse)|piraté|pirate|hack(ed)?\b|i clicked|what to do|récupérer|recuperer|recover|rembours|refund|victime|victim|après avoir|apres avoir/],
  ["report", /signaler|porter plainte|plainte|\breport\b|33700|pharos/],
  ["comparison", /diff[ée]rence|\bvs\.?\b|versus|confondre|compar/],
  ["simulation", /\btests?\b|quiz|simulat|exercice|entra[iî]n|practi[cs]e|training/],
  ["detection", /reconna[iî]t|recogni[sz]e|\bspot\b|signes?\b|exemple|example|est[- ]ce une arnaque|is (it|this) a scam|vrai ou faux|real or fake|legit|fiable|v[ée]rifier|\bcheck\b|suspect|arnaque\s*\?/],
  ["prevention", /prot[ée]ger|[ée]viter|pr[ée]munir|protect|prevent|avoid|s[ée]curiser|\bsecure\b/],
  ["informational", /c'?est quoi|qu'?est[- ]ce|d[ée]finition|definition|what is|meaning|signification|comment (ça )?fonctionne|how does|how do/],
];

// « definition » without an accent is English; French writes « définition ».
const FR_HINT = /[àâçéèêëîïôûùüÿœ]|\b(arnaque|comment|que|quoi|j'?ai|le|la|les|des|mon|ma|faire|sur|par|une?|de|du|attaques?|piratée?|lien|simulateur)\b/;
const EN_HINT = /\b(scam|what|how|my|the|is|hacked|fake|to|of|clicked|with|definition|meaning|computer|purpose|apps?|attacks?|browser|simulator|in)\b/;

export interface ClassifiedQuery {
  intent: QueryIntent;
  language: "fr" | "en" | "unknown";
}

export function classifyQuery(query: string): ClassifiedQuery {
  const q = query.toLowerCase().replace(/’/g, "'");
  const intent = INTENT_RULES.find(([, re]) => re.test(q))?.[0] ?? "unclassified";
  const fr = FR_HINT.test(q);
  const en = EN_HINT.test(q);
  return { intent, language: fr === en ? "unknown" : fr ? "fr" : "en" };
}

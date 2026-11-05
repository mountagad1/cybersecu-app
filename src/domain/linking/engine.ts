/**
 * The internal-linking engine: one place that decides which pages a page
 * links to, and with which words (docs/seo/INTERNAL_LINKING_IMPLEMENTATION.md).
 *
 * Pages render what it returns; the knowledge graph
 * (src/domain/graph/knowledge-graph.ts) records the same output as edges.
 * A link therefore exists on a page if and only if it exists in the graph,
 * and every property tested on the graph — no orphan, no self-link, no
 * duplicate, descriptive anchors — holds for the pages.
 *
 * Every relation is derived from content, never from a hand-kept list of
 * links:
 *   - related attacks       ← `relatedAttackCodes` declared on each fiche
 *   - related guides        ← `relatedAttackCodes` declared on each guide
 *   - related simulations   ← the fiche's simulation; an audience's
 *                              `targetProfile` simulations
 *   - related tools         ← `relatedAttackCodes` / `relatedGuideSlugs` of each tool
 *   - related audiences     ← the fiches a checklist cites, and the
 *                              simulations written for that audience
 *   - protection actions    ← the incident tools (« j'ai cliqué », checklist
 *                              d'urgence) and the checklists that prevent it
 *
 * Rankings, where a list must be cut, are by overlap (shared fiches), ties
 * broken by catalogue order — deterministic, so a page never changes
 * between two builds without its content changing.
 */

import {
  findAttackByCode,
  listAttacksInCategory,
  relatedAttacks,
  type AttackEntry,
} from "@/content/attacks";
import { getLocalizedAttack } from "@/content/attacks/localize";
import {
  audienceAttacks,
  audiencePath,
  listAudiences,
  type AudienceEntry,
} from "@/content/audiences";
import {
  englishGuideSlug,
  getLocalizedGuide,
  guidesForAttack,
  listGuides,
  type GuideEntry,
} from "@/content/guides";
import { findSimulationBySlug, listSimulations } from "@/content/simulations";
import {
  findSimulationEnBySlug,
  listSimulationsEn,
} from "@/content/simulations-en";
import type { SimulationEntry } from "@/content/simulations/types";
import {
  getLocalizedTool,
  listTools,
  toolsForAttack,
  type ToolEntry,
} from "@/content/tools";
import { leversForAttack, leversForAttackEn } from "@/content/levers";
import { INCIDENT_SITUATIONS, type IncidentCode } from "@/content/incident";
import {
  COMPARATOR_SLUG,
  comparatorHrefFor,
} from "@/domain/attack/comparisons";
import type { Locale } from "@/domain/i18n/locale";
import type { AttackVectorCode } from "@/domain/scenario/types";

export type LinkKind =
  | "attack"
  | "guide"
  | "simulation"
  | "tool"
  | "audience"
  | "protection"
  | "lever";

export interface ContextLink {
  kind: LinkKind;
  /** Site-rooted URL, in the page's language. */
  href: string;
  /** Visible link text — says what is behind the link, never « en savoir plus ». */
  anchor: string;
  /** One line under the link, when the target has one. */
  description?: string;
  /**
   * Stable identity of the target for measurement: the fiche's code, or
   * the guide's French slug (the same in both languages).
   */
  code?: string;
}

/** Tools that answer « it already happened »: shown as protection actions, not as tools. */
const RESPOND_TOOLS = ["checklist-urgence", "j-ai-clique"] as const;

const STRINGS = {
  fr: {
    simulation: (name: string) => `Lancer la simulation « ${name} »`,
    simulationShort: (name: string) => `Simulation : ${name}`,
    audienceFromAttack: (a: AudienceEntry) =>
      `La checklist ${a.name.fr}, à imprimer`,
    audienceFromSimulation: (a: AudienceEntry) =>
      `${a.h1.fr} : la checklist ${a.name.fr}`,
    audienceFromGuide: (a: AudienceEntry) => `Checklist ${a.name.fr}`,
    audienceSibling: (a: AudienceEntry) => `La checklist ${a.name.fr}`,
    toolsIndex: "Tous les outils gratuits, sans inscription",
    comparator:
      "Toutes les attaques qu'on confond, côte à côte : le comparateur « X ou Y ? »",
    respondSection: (title: string) => `Checklist d'urgence : « ${title} »`,
    respondChannel: {
      sms: "L'assistant « J'ai cliqué » : les gestes après un SMS, dans l'ordre",
      email:
        "L'assistant « J'ai cliqué » : les gestes après un email, dans l'ordre",
      call: "L'assistant « J'ai cliqué » : les gestes après un appel, dans l'ordre",
      web: "L'assistant « J'ai cliqué » : les gestes après un site piégé, dans l'ordre",
      qr: "L'assistant « J'ai cliqué » : les gestes après un QR code, dans l'ordre",
    } as Record<string, string>,
    respond: {
      "checklist-urgence":
        "Les premiers gestes, dans l'ordre : la checklist d'urgence",
      "j-ai-clique":
        "L'assistant « J'ai cliqué » : le plan des gestes selon votre situation",
    },
  },
  en: {
    simulation: (name: string) => `Start the simulation: ${name}`,
    simulationShort: (name: string) => `Simulation: ${name}`,
    audienceFromAttack: (a: AudienceEntry) =>
      `The checklist ${a.name.en}, to print`,
    audienceFromSimulation: (a: AudienceEntry) =>
      `${a.h1.en}: the checklist ${a.name.en}`,
    audienceFromGuide: (a: AudienceEntry) => `Checklist ${a.name.en}`,
    audienceSibling: (a: AudienceEntry) => `The checklist ${a.name.en}`,
    toolsIndex: "All free tools, no sign-up",
    comparator:
      "All the attacks people mix up, side by side: the “X or Y?” comparator",
    respondSection: (title: string) => `Emergency checklist: “${title}”`,
    respondChannel: {
      sms: "The “I clicked” assistant: the steps after a text message, in order",
      email: "The “I clicked” assistant: the steps after an email, in order",
      call: "The “I clicked” assistant: the steps after a call, in order",
      web: "The “I clicked” assistant: the steps after a rigged website, in order",
      qr: "The “I clicked” assistant: the steps after a QR code, in order",
    } as Record<string, string>,
    respond: {
      "checklist-urgence": "The first steps, in order: the emergency checklist",
      "j-ai-clique":
        "The “I clicked” assistant: the plan of steps for your situation",
    },
  },
} as const;

const prefix = (locale: Locale) => (locale === "en" ? "/en" : "");

// --- Primitive projections -------------------------------------------------

function attackLink(attack: AttackEntry, locale: Locale): ContextLink | null {
  const localized = getLocalizedAttack(attack, locale);
  return localized
    ? {
        kind: "attack",
        href: `${prefix(locale)}/attaques/${localized.slug}`,
        anchor: localized.name,
        code: attack.code,
      }
    : null;
}

function guideLink(guide: GuideEntry, locale: Locale): ContextLink | null {
  if (locale === "fr") {
    return {
      kind: "guide",
      href: `/guides/${guide.slug}`,
      anchor: guide.title,
      description: guide.question,
      code: guide.slug,
    };
  }
  const en = getLocalizedGuide(guide);
  const slug = englishGuideSlug(guide.slug);
  return en && slug
    ? {
        kind: "guide",
        href: `/en/guides/${slug}`,
        anchor: en.title,
        description: en.question,
        code: guide.slug,
      }
    : null;
}

function toolLink(tool: ToolEntry, locale: Locale): ContextLink | null {
  if (locale === "fr") {
    return {
      kind: "tool",
      href: `/outils/${tool.slug}`,
      anchor: tool.title,
      description: tool.description,
    };
  }
  const en = getLocalizedTool(tool);
  return en
    ? {
        kind: "tool",
        href: `/en/tools/${en.slug}`,
        anchor: en.title,
        description: en.description,
      }
    : null;
}

function findSimulation(
  slug: string,
  locale: Locale,
): SimulationEntry | undefined {
  return locale === "fr"
    ? findSimulationBySlug(slug)
    : findSimulationEnBySlug(slug);
}

function simulationsOf(locale: Locale): SimulationEntry[] {
  return locale === "fr" ? listSimulations() : listSimulationsEn();
}

/** The fiche's own simulation, in the page's language. */
function ownSimulation(
  attack: AttackEntry,
  locale: Locale,
): SimulationEntry | undefined {
  const slug =
    locale === "fr"
      ? attack.simulationSlug
      : getLocalizedAttack(attack, locale)?.simulationSlug;
  return slug ? findSimulation(slug, locale) : undefined;
}

function simulationLink(
  sim: SimulationEntry,
  locale: Locale,
  short = false,
): ContextLink | null {
  const attack = findAttackByCode(sim.attackCode);
  const name = attack ? getLocalizedAttack(attack, locale)?.name : undefined;
  if (!name) return null;
  const t = STRINGS[locale];
  return {
    kind: "simulation",
    href: `${prefix(locale)}/simulations/${sim.slug}`,
    anchor: short ? t.simulationShort(name) : t.simulation(name),
    description: sim.teaser,
  };
}

/** Which checklist section answers « what the attacker was after ». */
const CHECKLIST_SECTION: Partial<
  Record<AttackEntry["attackerObjective"], IncidentCode>
> = {
  argent: "argent",
  identifiants: "mot-de-passe",
  acces_a_un_compte: "compte",
  controle_d_un_appareil: "appareil",
};

/** Which channel the « J'ai cliqué » assistant preselects, from a fiche's primary vector. */
const ASSISTANT_CHANNEL: Partial<Record<AttackVectorCode, string>> = {
  sms: "sms",
  email: "email",
  phone: "call",
  web: "web",
  advertisement: "web",
  qr_code: "qr",
};

/**
 * « Si c'est déjà arrivé »: the emergency checklist and the « J'ai cliqué »
 * assistant. From a fiche, both open where that fiche's reader needs them —
 * the checklist section matching what the attacker was after, the assistant
 * with the fiche's channel preselected — and say so in the anchor.
 */
function respondLinks(locale: Locale, attack?: AttackEntry): ContextLink[] {
  const t = STRINGS[locale];
  return RESPOND_TOOLS.flatMap((slug): ContextLink[] => {
    const tool = listTools().find((x) => x.slug === slug);
    const link = tool && toolLink(tool, locale);
    if (!link) return [];
    let href = link.href;
    let anchor: string = t.respond[slug];
    if (attack && slug === "checklist-urgence") {
      const code = CHECKLIST_SECTION[attack.attackerObjective];
      const situation =
        code && INCIDENT_SITUATIONS.find((s) => s.code === code);
      if (situation) {
        href = `${href}#${situation[locale].id}`;
        anchor = t.respondSection(situation[locale].title);
      }
    }
    if (attack && slug === "j-ai-clique") {
      const channel = ASSISTANT_CHANNEL[attack.primaryVector];
      if (channel) {
        href = `${href}?${locale === "fr" ? "canal" : "channel"}=${channel}`;
        anchor = t.respondChannel[channel];
      }
    }
    return [{ ...link, kind: "protection", href, anchor }];
  });
}

const isAudienceTool = (tool: ToolEntry) =>
  listAudiences().some((a) => a.slug === tool.slug);
const isComparator = (tool: ToolEntry) => tool.slug === COMPARATOR_SLUG;
const isRespondTool = (tool: ToolEntry) =>
  (RESPOND_TOOLS as readonly string[]).includes(tool.slug);

// --- Relations ---------------------------------------------------------------

/** Simulations an audience page shows: written for it, or training a fiche it cites. */
export function audienceSimulations(
  audience: AudienceEntry,
  locale: Locale,
): SimulationEntry[] {
  const cited = new Set(audienceAttacks(audience).map((a) => a.code));
  return simulationsOf(locale).filter((sim) =>
    audience.profile
      ? sim.targetProfile === audience.profile
      : cited.has(sim.attackCode),
  );
}

/** Audiences whose checklist cites this fiche. */
export function audiencesForAttack(attack: AttackEntry): AudienceEntry[] {
  return listAudiences().filter((a) =>
    audienceAttacks(a).some((x) => x.code === attack.code),
  );
}

/** Audiences whose page shows this simulation — the reverse of `audienceSimulations`. */
export function audiencesForSimulation(
  sim: SimulationEntry,
  locale: Locale,
): AudienceEntry[] {
  return listAudiences().filter((a) =>
    audienceSimulations(a, locale).some((s) => s.slug === sim.slug),
  );
}

/** Guides ranked by how many of the given fiches they cover; ties keep catalogue order. */
function guidesByOverlap(codes: Set<string>, limit: number): GuideEntry[] {
  return listGuides()
    .map((guide, index) => ({
      guide,
      index,
      overlap: guide.relatedAttackCodes.filter((c) => codes.has(c)).length,
    }))
    .filter((x) => x.overlap > 0)
    .sort((x, y) => y.overlap - x.overlap || x.index - y.index)
    .slice(0, limit)
    .map((x) => x.guide);
}

/** Audiences whose cited fiches overlap a guide's, best first. */
export function audiencesForGuide(
  guide: Pick<GuideEntry, "relatedAttackCodes">,
): AudienceEntry[] {
  const codes = new Set(guide.relatedAttackCodes);
  return listAudiences()
    .map((audience, index) => ({
      audience,
      index,
      overlap: audienceAttacks(audience).filter((a) => codes.has(a.code))
        .length,
    }))
    .filter((x) => x.overlap > 0)
    .sort((x, y) => y.overlap - x.overlap || x.index - y.index)
    .map((x) => x.audience);
}

// --- Page-level link sets ------------------------------------------------------

/**
 * Removes self-links and links already present in an earlier group (groups
 * are listed in display priority), so a page never offers the same target
 * twice.
 */
export function finalize<T extends Record<string, ContextLink[]>>(
  self: string,
  groups: T,
): T {
  const seen = new Set([self]);
  const out = {} as T;
  for (const [key, links] of Object.entries(groups) as [
    keyof T,
    ContextLink[],
  ][]) {
    out[key] = links.filter((link) => {
      if (seen.has(link.href)) return false;
      seen.add(link.href);
      return true;
    }) as T[keyof T];
  }
  return out;
}

/**
 * The first fiche among `candidates` with a simulation in this language,
 * as a link to that simulation — or nothing. Candidates are given in
 * order of relevance by the caller; this never invents a relation.
 */
function firstSimulationOf(
  candidates: AttackEntry[],
  locale: Locale,
  exclude: string,
): ContextLink[] {
  for (const candidate of candidates) {
    if (candidate.code === exclude) continue;
    const sim = ownSimulation(candidate, locale);
    const link = sim && simulationLink(sim, locale, true);
    if (link) return [{ ...link, code: candidate.code }];
  }
  return [];
}

export interface AttackLinks extends Record<string, ContextLink[]> {
  simulations: ContextLink[];
  /** The comparator, opened on this fiche's pair — shown under « À ne pas confondre avec ». */
  /**
   * Only for a fiche without a simulation of its own: the simulation of a
   * related fiche, else of a fiche of the same family — so every fiche has
   * a « test yourself » step (docs/growth/SEO_TO_PRODUCT_FUNNEL.md).
   */
  nearbySimulation: ContextLink[];
  comparison: ContextLink[];
  tools: ContextLink[];
  guides: ContextLink[];
  audiences: ContextLink[];
  protection: ContextLink[];
  attacks: ContextLink[];
}

export function linksForAttack(
  attack: AttackEntry,
  locale: Locale,
): AttackLinks {
  const self = attackLink(attack, locale)?.href ?? "";
  const sim = ownSimulation(attack, locale);
  const t = STRINGS[locale];
  return finalize(self, {
    simulations: sim
      ? [simulationLink(sim, locale)].filter(
          (l): l is ContextLink => l !== null,
        )
      : [],
    nearbySimulation: sim
      ? []
      : firstSimulationOf(
          [...relatedAttacks(attack), ...listAttacksInCategory(attack.categorySlug)],
          locale,
          attack.code,
        ),
    comparison: (() => {
      const href = comparatorHrefFor(attack.code, locale);
      return href
        ? [{ kind: "tool" as const, href, anchor: t.comparator }]
        : [];
    })(),
    tools: toolsForAttack(attack)
      .filter(
        (tool) =>
          !isAudienceTool(tool) && !isRespondTool(tool) && !isComparator(tool),
      )
      .flatMap((tool) => toolLink(tool, locale) ?? []),
    guides: guidesForAttack(attack).flatMap(
      (guide) => guideLink(guide, locale) ?? [],
    ),
    audiences: audiencesForAttack(attack).map((a) => ({
      kind: "audience" as const,
      href: audiencePath(a, locale),
      anchor: t.audienceFromAttack(a),
      description: a.description[locale],
    })),
    protection: respondLinks(locale, attack),
    attacks: relatedAttacks(attack).flatMap(
      (other) => attackLink(other, locale) ?? [],
    ),
  });
}

export interface AudienceLinks extends Record<string, ContextLink[]> {
  attacks: ContextLink[];
  simulations: ContextLink[];
  guides: ContextLink[];
  protection: ContextLink[];
  audiences: ContextLink[];
  tools: ContextLink[];
}

export function linksForAudience(
  audience: AudienceEntry,
  locale: Locale,
): AudienceLinks {
  const t = STRINGS[locale];
  const cited = audienceAttacks(audience);
  return finalize(audiencePath(audience, locale), {
    attacks: cited.flatMap((a) => attackLink(a, locale) ?? []),
    simulations: audienceSimulations(audience, locale).flatMap(
      (sim) => simulationLink(sim, locale, true) ?? [],
    ),
    guides: guidesByOverlap(new Set(cited.map((a) => a.code)), 3).flatMap(
      (g) => guideLink(g, locale) ?? [],
    ),
    protection: respondLinks(locale),
    audiences: listAudiences()
      .filter((a) => a.code !== audience.code)
      .map((a) => ({
        kind: "audience" as const,
        href: audiencePath(a, locale),
        anchor: t.audienceSibling(a),
        description: a.description[locale],
      })),
    // After `protection`, so a respond tool is never offered twice.
    tools: linksForTool(audience.slug, locale).tools,
  });
}

export interface SimulationLinks extends Record<string, ContextLink[]> {
  attack: ContextLink[];
  guides: ContextLink[];
  levers: ContextLink[];
  audiences: ContextLink[];
}

/**
 * What a simulation page shows after the exercise: the fiche it trains, the
 * gestures that defend against it, the levers it pulls, and the checklists
 * it belongs to. Never which answer was right.
 */
export function linksForSimulation(
  sim: SimulationEntry,
  locale: Locale,
): SimulationLinks {
  const t = STRINGS[locale];
  const attack = findAttackByCode(sim.attackCode);
  const levers = !attack
    ? []
    : locale === "fr"
      ? leversForAttack(attack).map((l) => ({
          kind: "lever" as const,
          href: `/leviers/${l.slug}`,
          anchor: l.name,
        }))
      : leversForAttackEn(attack).map((l) => ({
          kind: "lever" as const,
          href: `/en/levers/${l.slug}`,
          anchor: l.name,
        }));
  return finalize(`${prefix(locale)}/simulations/${sim.slug}`, {
    attack: attack
      ? [attackLink(attack, locale)].filter((l): l is ContextLink => l !== null)
      : [],
    guides: attack
      ? guidesForAttack(attack).flatMap((g) => guideLink(g, locale) ?? [])
      : [],
    levers,
    audiences: audiencesForSimulation(sim, locale).map((a) => ({
      kind: "audience" as const,
      href: audiencePath(a, locale),
      anchor: t.audienceFromSimulation(a),
    })),
  });
}

/**
 * What a guide page adds: the checklists for the people its fiches target.
 * Takes the French entry or its English projection — both carry the slug
 * of their own language and the shared `relatedAttackCodes`.
 */
export function linksForGuide(
  guide: Pick<GuideEntry, "slug" | "relatedAttackCodes">,
  locale: Locale,
): { practice: ContextLink[]; audiences: ContextLink[] } {
  const t = STRINGS[locale];
  return finalize(`${prefix(locale)}/guides/${guide.slug}`, {
    // « Voyez si vous reconnaissez ces signaux »: the simulation of the
    // first fiche the guide covers that has one.
    practice: firstSimulationOf(
      guide.relatedAttackCodes
        .map((c) => findAttackByCode(c))
        .filter((a): a is AttackEntry => a !== undefined),
      locale,
      "",
    ),
    audiences: audiencesForGuide(guide).map((a) => ({
      kind: "audience" as const,
      href: audiencePath(a, locale),
      anchor: t.audienceFromGuide(a),
      description: a.description[locale],
    })),
  });
}

/**
 * A tool page's « other tools »: the functional tools that serve the most
 * fiches or guides in common with it, then the index of all tools.
 */
export function linksForTool(
  toolSlug: string,
  locale: Locale,
): { tools: ContextLink[] } {
  const tools = listTools();
  const self = tools.find((t) => t.slug === toolSlug);
  const audience = listAudiences().find((a) => a.slug === toolSlug);
  const selfHref = audience
    ? audiencePath(audience, locale)
    : self
      ? (toolLink(self, locale)?.href ?? "")
      : "";
  const codes = new Set(
    audience
      ? audienceAttacks(audience).map((a) => a.code)
      : (self?.relatedAttackCodes ?? []),
  );
  const guideSlugs = new Set(self?.relatedGuideSlugs ?? []);
  const ranked = tools
    .map((tool, index) => ({
      tool,
      index,
      overlap:
        tool.relatedAttackCodes.filter((c) => codes.has(c)).length +
        tool.relatedGuideSlugs.filter((g) => guideSlugs.has(g)).length,
    }))
    .filter((x) => x.tool.slug !== toolSlug && !isAudienceTool(x.tool))
    .sort((x, y) => y.overlap - x.overlap || x.index - y.index)
    .slice(0, 3)
    .flatMap((x) => toolLink(x.tool, locale) ?? []);
  const index: ContextLink = {
    kind: "tool",
    href: locale === "fr" ? "/outils" : "/en/tools",
    anchor: STRINGS[locale].toolsIndex,
  };
  return finalize(selfHref, { tools: [...ranked, index] });
}

/**
 * The site's knowledge graph: every entity page and every contextual link
 * between them, derived from the relations declared in `src/content`.
 *
 * It is not a second source of truth. Each edge here is produced by the
 * same call the corresponding page makes to render that link — for fiches,
 * simulations, guides, tools and audience checklists, the linking engine
 * (`src/domain/linking/engine.ts`: `linksForAttack`, `linksForSimulation`,
 * …) — so the graph describes what the pages actually link, and lets
 * tests assert properties no single page can: every
 * important page receives several contextual links, no page links to
 * itself, every anchor is descriptive. See docs/seo/KNOWLEDGE_GRAPH.md.
 *
 * Navigation chrome (header, footer, breadcrumbs, index pages) is
 * deliberately excluded: those links exist on every page and say nothing
 * about how two entities relate.
 */

import { buildHubContext } from "@/domain/attack/hub-context";
import { channelScenarios } from "@/domain/attack/channel-scenarios";
import { audiencePath, listAudiences } from "@/content/audiences";
import {
  linksForAttack,
  linksForAudience,
  linksForGuide,
  linksForSimulation,
  linksForTool,
  type ContextLink,
} from "@/domain/linking/engine";
import { ATTACK_CATEGORIES, type AttackCategory } from "@/domain/attack/categories";
import type { Locale } from "@/domain/i18n/locale";
import { localePrefix } from "@/domain/i18n/locale";
import {
  findAttackByCode,
  isCategoryPublishable,
  listAttacks,
  listAttacksInCategory,
} from "@/content/attacks";
import { getLocalizedAttack, getLocalizedCategory } from "@/content/attacks/localize";
import { findSimulationBySlug, listSimulations } from "@/content/simulations";
import { findSimulationEnBySlug, listSimulationsEn } from "@/content/simulations-en";
import {
  attacksUsingLever,
  leversForAttack,
  listLevers,
  leversForAttackEn,
  listLeversEn,
} from "@/content/levers";
import {
  attacksForGuide,
  attacksForGuideEn,
  listGuides,
  listGuidesEn,
} from "@/content/guides";
import {
  attacksForTool,
  attacksForToolEn,
  guidesForTool,
  guidesForToolEn,
  listTools,
  listToolsEn,
  toolsForGuide,
  toolsForGuideEn,
} from "@/content/tools";

export type NodeType = "attack" | "category" | "simulation" | "guide" | "lever" | "tool" | "audience";

export interface GraphNode {
  /** Site-rooted URL — one node per indexable entity page. */
  url: string;
  type: NodeType;
  locale: Locale;
  label: string;
}

export type Relation =
  | "attack→category"
  | "category→attack"
  | "category→category"
  | "category→simulation"
  | "category→lever"
  | "category→guide"
  | "category→tool"
  | "attack→attack"
  | "attack→channel-scenario"
  | "attack→channel-simulation"
  | "attack→lever"
  | "lever→attack"
  | "attack→simulation"
  | "simulation→attack"
  | "simulation→guide"
  | "simulation→lever"
  | "attack→guide"
  | "guide→attack"
  | "attack→tool"
  | "tool→attack"
  | "guide→tool"
  | "tool→guide"
  | "attack→incident-response"
  | "attack→audience"
  | "audience→attack"
  | "audience→simulation"
  | "simulation→audience"
  | "audience→guide"
  | "guide→audience"
  | "audience→tool"
  | "audience→audience"
  | "tool→tool"
  | "attack→nearby-simulation"
  | "guide→simulation";

export interface GraphEdge {
  from: string;
  to: string;
  relation: Relation;
  /** The visible link text. */
  anchor: string;
}

export const EMERGENCY_CHECKLIST_URL = "/outils/checklist-urgence";
export const EMERGENCY_CHECKLIST_ANCHOR = "Les premiers gestes, dans l'ordre : la checklist d'urgence";
export const EMERGENCY_CHECKLIST_URL_EN = "/en/tools/emergency-checklist";
export const EMERGENCY_CHECKLIST_ANCHOR_EN = "The first steps, in order: the emergency checklist";

// --- Relations shared by pages and the graph ------------------------------

export interface HubSimulation {
  slug: string;
  /** Name of the attack the simulation trains. */
  name: string;
  teaser: string;
}

/**
 * Simulations attached to a family's fiches, in one locale. Used by both
 * hub routes and by the graph, so the hub and its edges cannot disagree.
 */
export function simulationsForCategory(categorySlug: string, locale: Locale): HubSimulation[] {
  return listAttacksInCategory(categorySlug).flatMap((attack) => {
    if (locale === "fr") {
      const sim = attack.simulationSlug ? findSimulationBySlug(attack.simulationSlug) : undefined;
      return sim ? [{ slug: sim.slug, name: attack.name, teaser: sim.teaser }] : [];
    }
    const localized = getLocalizedAttack(attack, locale);
    const sim = localized?.simulationSlug ? findSimulationEnBySlug(localized.simulationSlug) : undefined;
    return localized && sim ? [{ slug: sim.slug, name: localized.name, teaser: sim.teaser }] : [];
  });
}

/** Every other routed family, in one locale — never the family itself. */
export function siblingCategories(categorySlug: string, locale: Locale): { slug: string; name: string }[] {
  return ATTACK_CATEGORIES.filter((c) => c.slug !== categorySlug && isCategoryPublishable(c)).flatMap((c) => {
    const localized = getLocalizedCategory(c, locale);
    return localized ? [{ slug: localized.slug, name: localized.name }] : [];
  });
}

// --- Graph construction ----------------------------------------------------

function categoryNode(category: AttackCategory, locale: Locale): GraphNode | null {
  const localized = getLocalizedCategory(category, locale);
  if (!localized || !isCategoryPublishable(category)) return null;
  return { url: `${localePrefix(locale)}/attaques/${localized.slug}`, type: "category", locale, label: localized.name };
}

export function buildKnowledgeGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const node = (n: GraphNode) => nodes.set(n.url, n);
  const edge = (from: string, to: string, relation: Relation, anchor: string) =>
    edges.push({ from, to, relation, anchor });
  const edgesTo = (from: string, links: ContextLink[], relation: Relation) => {
    // A query string or fragment opens the page in a given state; the
    // node is the page itself.
    for (const link of links) edge(from, link.href.split(/[?#]/)[0], relation, link.anchor);
  };
  // What the linking engine puts on a fiche, exactly as the page renders it.
  const attackEdges = (url: string, links: ReturnType<typeof linksForAttack>) => {
    edgesTo(url, links.attacks, "attack→attack");
    edgesTo(url, links.guides, "attack→guide");
    edgesTo(url, links.tools, "attack→tool");
    edgesTo(url, links.comparison, "attack→tool");
    edgesTo(url, links.audiences, "attack→audience");
    edgesTo(url, links.simulations, "attack→simulation");
    edgesTo(url, links.nearbySimulation, "attack→nearby-simulation");
    edgesTo(url, links.protection, "attack→incident-response");
  };
  const simulationEdges = (url: string, links: ReturnType<typeof linksForSimulation>) => {
    edgesTo(url, links.attack, "simulation→attack");
    edgesTo(url, links.guides, "simulation→guide");
    edgesTo(url, links.levers, "simulation→lever");
    edgesTo(url, links.audiences, "simulation→audience");
  };
  const audienceCodes = new Set(listAudiences().map((a) => a.slug));

  const attacks = listAttacks();

  // French
  for (const category of ATTACK_CATEGORIES) {
    const hub = categoryNode(category, "fr");
    if (!hub) continue;
    node(hub);
    for (const attack of listAttacksInCategory(category.slug)) {
      edge(hub.url, `/attaques/${attack.slug}`, "category→attack", attack.name);
    }
    for (const sibling of siblingCategories(category.slug, "fr")) {
      edge(hub.url, `/attaques/${sibling.slug}`, "category→category", sibling.name);
    }
    for (const sim of simulationsForCategory(category.slug, "fr")) {
      edge(hub.url, `/simulations/${sim.slug}`, "category→simulation", `Simulation : ${sim.name}`);
    }
    // What the hub's « levers », « if it already happened » sections link to.
    const context = buildHubContext(category.slug, "fr");
    for (const lever of context.levers) if (lever.href) edge(hub.url, lever.href, "category→lever", lever.label);
    for (const guide of context.guides) edge(hub.url, guide.href, "category→guide", guide.title);
    edge(hub.url, "/outils/j-ai-clique", "category→tool", "L'assistant « J'ai cliqué » : les gestes dans l'ordre, selon votre situation");
    edge(hub.url, "/outils/checklist-urgence", "category→tool", "La checklist d'urgence, à imprimer");
  }

  for (const attack of attacks) {
    const url = `/attaques/${attack.slug}`;
    node({ url, type: "attack", locale: "fr", label: attack.name });
    const category = ATTACK_CATEGORIES.find((c) => c.slug === attack.categorySlug);
    if (category) edge(url, `/attaques/${category.slug}`, "attack→category", category.name);
    for (const lever of leversForAttack(attack)) edge(url, `/leviers/${lever.slug}`, "attack→lever", lever.name);
    attackEdges(url, linksForAttack(attack, "fr"));
    // « Ce qui arrive aussi par … » on the channel fiches.
    for (const other of channelScenarios(attack.code, "fr")) {
      edge(url, `/attaques/${other.slug}`, "attack→channel-scenario", other.name);
      if (other.simulation) {
        edge(url, `/simulations/${other.simulation.slug}`, "attack→channel-simulation", `Simulation : ${other.name}`);
      }
    }
  }

  for (const sim of listSimulations()) {
    const url = `/simulations/${sim.slug}`;
    const attack = findAttackByCode(sim.attackCode);
    node({ url, type: "simulation", locale: "fr", label: `Simulation : ${attack?.name ?? sim.impersonatedEntity}` });
    if (!attack) continue;
    simulationEdges(url, linksForSimulation(sim, "fr"));
  }

  for (const lever of listLevers()) {
    const url = `/leviers/${lever.slug}`;
    node({ url, type: "lever", locale: "fr", label: lever.name });
    for (const attack of attacksUsingLever(lever.code)) edge(url, `/attaques/${attack.slug}`, "lever→attack", attack.name);
  }

  for (const guide of listGuides()) {
    const url = `/guides/${guide.slug}`;
    node({ url, type: "guide", locale: "fr", label: guide.title });
    for (const attack of attacksForGuide(guide)) edge(url, `/attaques/${attack.slug}`, "guide→attack", attack.name);
    for (const tool of toolsForGuide(guide)) edge(url, `/outils/${tool.slug}`, "guide→tool", tool.title);
    const guideLinksFr = linksForGuide(guide, "fr");
    edgesTo(url, guideLinksFr.audiences, "guide→audience");
    edgesTo(url, guideLinksFr.practice, "guide→simulation");
  }

  for (const tool of listTools()) {
    if (audienceCodes.has(tool.slug)) continue;
    const url = `/outils/${tool.slug}`;
    node({ url, type: "tool", locale: "fr", label: tool.title });
    for (const attack of attacksForTool(tool)) edge(url, `/attaques/${attack.slug}`, "tool→attack", attack.name);
    for (const guide of guidesForTool(tool)) edge(url, `/guides/${guide.slug}`, "tool→guide", guide.title);
    edgesTo(url, linksForTool(tool.slug, "fr").tools, "tool→tool");
  }

  // English — only what is translated, mirroring the English routes.
  for (const category of ATTACK_CATEGORIES) {
    const hub = categoryNode(category, "en");
    if (!hub) continue;
    node(hub);
    for (const attack of listAttacksInCategory(category.slug)) {
      const localized = getLocalizedAttack(attack, "en");
      if (localized) edge(hub.url, `/en/attaques/${localized.slug}`, "category→attack", localized.name);
    }
    for (const sibling of siblingCategories(category.slug, "en")) {
      edge(hub.url, `/en/attaques/${sibling.slug}`, "category→category", sibling.name);
    }
    for (const sim of simulationsForCategory(category.slug, "en")) {
      edge(hub.url, `/en/simulations/${sim.slug}`, "category→simulation", `Simulation: ${sim.name}`);
    }
    // What the hub's « levers », « if it already happened » sections link to.
    const context = buildHubContext(category.slug, "en");
    for (const lever of context.levers) if (lever.href) edge(hub.url, lever.href, "category→lever", lever.label);
    for (const guide of context.guides) edge(hub.url, guide.href, "category→guide", guide.title);
    edge(hub.url, "/en/tools/i-clicked", "category→tool", "The “I clicked” assistant: the steps in order, for your situation");
    edge(hub.url, "/en/tools/emergency-checklist", "category→tool", "The emergency checklist, to print");
  }

  for (const attack of attacks) {
    const localized = getLocalizedAttack(attack, "en");
    if (!localized) continue;
    const url = `/en/attaques/${localized.slug}`;
    node({ url, type: "attack", locale: "en", label: localized.name });
    const category = ATTACK_CATEGORIES.find((c) => c.slug === attack.categorySlug);
    const hub = category ? categoryNode(category, "en") : null;
    if (hub) edge(url, hub.url, "attack→category", hub.label);
    for (const lever of leversForAttackEn(attack)) edge(url, `/en/levers/${lever.slug}`, "attack→lever", lever.name);
    attackEdges(url, linksForAttack(attack, "en"));
    for (const other of channelScenarios(attack.code, "en")) {
      edge(url, `/en/attaques/${other.slug}`, "attack→channel-scenario", other.name);
      if (other.simulation) {
        edge(url, `/en/simulations/${other.simulation.slug}`, "attack→channel-simulation", `Simulation: ${other.name}`);
      }
    }
  }

  for (const guide of listGuidesEn()) {
    const url = `/en/guides/${guide.slug}`;
    node({ url, type: "guide", locale: "en", label: guide.title });
    for (const attack of attacksForGuideEn(guide)) edge(url, `/en/attaques/${attack.slug}`, "guide→attack", attack.name);
    for (const tool of toolsForGuideEn(guide)) edge(url, `/en/tools/${tool.slug}`, "guide→tool", tool.title);
    const guideLinksEn = linksForGuide(guide, "en");
    edgesTo(url, guideLinksEn.audiences, "guide→audience");
    edgesTo(url, guideLinksEn.practice, "guide→simulation");
  }

  for (const lever of listLeversEn()) {
    const url = `/en/levers/${lever.slug}`;
    node({ url, type: "lever", locale: "en", label: lever.name });
    for (const attack of attacksUsingLever(lever.code)) {
      const localized = getLocalizedAttack(attack, "en");
      if (localized) edge(url, `/en/attaques/${localized.slug}`, "lever→attack", localized.name);
    }
  }

  for (const tool of listToolsEn()) {
    if (audienceCodes.has(tool.frSlug)) continue;
    const url = `/en/tools/${tool.slug}`;
    node({ url, type: "tool", locale: "en", label: tool.title });
    for (const attack of attacksForToolEn(tool.frSlug)) edge(url, `/en/attaques/${attack.slug}`, "tool→attack", attack.name);
    for (const guide of guidesForToolEn(tool.frSlug)) edge(url, `/en/guides/${guide.slug}`, "tool→guide", guide.title);
    edgesTo(url, linksForTool(tool.frSlug, "en").tools, "tool→tool");
  }

  // Audience checklists, both languages: what `AudienceChecklist` renders.
  for (const locale of ["fr", "en"] as const) {
    for (const audience of listAudiences()) {
      const url = audiencePath(audience, locale);
      node({ url, type: "audience", locale, label: audience.h1[locale] });
      const links = linksForAudience(audience, locale);
      edgesTo(url, links.attacks, "audience→attack");
      edgesTo(url, links.simulations, "audience→simulation");
      edgesTo(url, links.guides, "audience→guide");
      edgesTo(url, links.protection, "audience→tool");
      edgesTo(url, links.audiences, "audience→audience");
      edgesTo(url, links.tools, "audience→tool");
    }
  }

  for (const sim of listSimulationsEn()) {
    const url = `/en/simulations/${sim.slug}`;
    const attack = findAttackByCode(sim.attackCode);
    const localized = attack ? getLocalizedAttack(attack, "en") : null;
    node({ url, type: "simulation", locale: "en", label: `Simulation: ${localized?.name ?? sim.impersonatedEntity}` });
    if (localized) simulationEdges(url, linksForSimulation(sim, "en"));
  }

  return { nodes: [...nodes.values()], edges };
}

/** Contextual links a page receives, by source page. */
export function inboundEdges(graph: { edges: GraphEdge[] }, url: string): GraphEdge[] {
  return graph.edges.filter((e) => e.to === url && e.from !== url);
}

/**
 * The attack page's own position in the graph, as schema.org: the article
 * is `about` one defined term (with its synonyms, within its family) and
 * `mentions` the related attacks it visibly links to. Nothing here that the
 * page does not show.
 */
export function attackEntityJsonLd(args: {
  name: string;
  aliases?: readonly string[];
  /** Absolute URL of the family hub. */
  familyUrl?: string;
  related: readonly { name: string; url: string }[];
}) {
  return {
    about: {
      "@type": "DefinedTerm",
      name: args.name,
      ...(args.aliases?.length ? { alternateName: [...args.aliases] } : {}),
      ...(args.familyUrl ? { inDefinedTermSet: args.familyUrl } : {}),
    },
    ...(args.related.length > 0 && {
      mentions: args.related.map((r) => ({ "@type": "DefinedTerm", name: r.name, url: r.url })),
    }),
  };
}

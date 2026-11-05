import { listAttacks } from "@/content/attacks";
import { classifyPage, normalizePath, type ClassifiedPage } from "./segment";
import { aggregate, compareWindows, DEFAULT_THRESHOLDS, type WindowMetrics } from "./noise";

/**
 * SEO opportunity engine (docs/growth/GROWTH_OS.md, cycle loop « identify →
 * prioritise »). Reads Search Console rows — never invents a row, a volume
 * or a CTR curve — and returns a ranked list of what to look at, with the
 * reason, the evidence and an explainable score.
 *
 * It recommends; it changes nothing. Pages under an experiment freeze come
 * out « deferred » with the date the freeze ends, so a cycle cannot touch
 * what an experiment is measuring.
 */

export interface GscRow extends WindowMetrics {
  /** Page URL or query text, as exported. */
  key: string;
}

export type OpportunityType =
  | "high_impressions_low_ctr"
  | "positions_4_to_10"
  | "positions_11_to_20"
  | "declining_page";

/** A page set an experiment is measuring: no change until `until` (exclusive). */
export interface Freeze {
  id: string;
  until: string;
  covers: (page: ClassifiedPage) => boolean;
}

/** docs/growth/EXPERIMENT_LOG.md, EXP-020: fiches, simulations and /simulations. */
export const FREEZES: readonly Freeze[] = [
  {
    id: "EXP-020",
    until: "2026-11-24",
    covers: (p) => p.pageType === "attack" || p.pageType === "simulation" || p.path === "/simulations",
  },
];

/**
 * The repository's prioritisation (docs/growth/GROWTH_OS.md §4, decision
 * G-003): Score = (Impact × Confidence × Leverage) / (Effort × Risk), each
 * from 1 to 5 with the anchors of that table, so a cycle scored by hand and
 * one scored here mean the same thing. Risk 5 blocks the action.
 */
export interface Scores {
  /** 1: an opportunity found on one page affects one page. */
  impact: number;
  /** 4 with own data past the noise threshold (200 impressions), 3 below it. */
  confidence: number;
  /** 2 when what is learned applies to the page's whole template (title and snippet), else 1. */
  leverage: number;
  /** 1 under an hour (title, description) to 3 (content against the intent). */
  effort: number;
  /** 2: reversible, visible. 5 while an experiment freeze covers the page: contrary to a decision. */
  risk: number;
  /** The formula above. Ranks; predicts nothing. */
  priority: number;
  /** Risk 5. */
  blocked: boolean;
}

export interface Opportunity {
  type: OpportunityType;
  page: ClassifiedPage;
  observed: WindowMetrics;
  /** For declining pages: the earlier window. */
  before?: WindowMetrics;
  problem: string;
  action: string;
  successCriterion: string;
  scores: Scores;
  status: "actionable" | "deferred";
  /** Freeze id and end date when deferred, and the score the page will have once it ends. */
  deferredBy?: { id: string; until: string; priorityAfter: number };
}

export const MIN_IMPRESSIONS = 10;

const EFFORT: Record<OpportunityType, number> = {
  // Title and description: one file, one review.
  high_impressions_low_ctr: 1,
  // Snippet plus contextual links from related pages: half a day.
  positions_4_to_10: 2,
  // Content against the intent, then links: one or two days.
  positions_11_to_20: 3,
  // Diagnose first: half a day before any change.
  declining_page: 2,
};

export function score(type: OpportunityType, observed: WindowMetrics, frozen: boolean): Scores {
  const impact = 1;
  const confidence = observed.impressions >= DEFAULT_THRESHOLDS.minImpressions ? 4 : 3;
  const leverage = type === "high_impressions_low_ctr" ? 2 : 1;
  const effort = EFFORT[type];
  const risk = frozen ? 5 : 2;
  const priority = Math.round(((impact * confidence * leverage) / (effort * risk)) * 100) / 100;
  return { impact, confidence, leverage, effort, risk, priority, blocked: risk === 5 };
}

const TEXT: Record<OpportunityType, { problem: string; action: string; success: string }> = {
  high_impressions_low_ctr: {
    problem: "Première page, mais le résultat n'est presque jamais cliqué.",
    action: "Vérifier que le title et la description annoncent la réponse à l'intention observée (requêtes du cluster), puis comparer à la SERP.",
    success: "CTR en hausse selon les règles anti-bruit, à position égale, sur deux fenêtres de 28 jours.",
  },
  positions_4_to_10: {
    problem: "Bas de première page : visible, peu cliqué.",
    action: "Aligner l'extrait sur l'intention et ajouter des liens contextuels depuis les pages du même cluster.",
    success: "Position gagnée d'au moins 3 places sur au moins 200 impressions, ou CTR en hausse.",
  },
  positions_11_to_20: {
    problem: "Deuxième page : l'intention est reconnue, la réponse ne suffit pas.",
    action: "Comparer le contenu à l'intention des requêtes observées (définition, exemples, que faire), combler l'écart, renforcer les liens entrants.",
    success: "Passage en première page (position ≤ 10) sur au moins 200 impressions.",
  },
  declining_page: {
    problem: "Baisse significative entre deux fenêtres de même durée.",
    action: "Chercher la cause avant de toucher la page : changement récent, indexation, cannibalisation, saisonnalité, mise à jour Google.",
    success: "Cause identifiée et documentée ; retour au niveau précédent si la cause est corrigible.",
  },
};

function classifyType(m: WindowMetrics): OpportunityType | null {
  if (m.impressions < MIN_IMPRESSIONS) return null;
  const ctr = m.clicks / m.impressions;
  if (m.position <= 10.5 && m.impressions >= 20 && ctr < 0.01) return "high_impressions_low_ctr";
  if (m.position > 3.5 && m.position <= 10.5) return "positions_4_to_10";
  if (m.position > 10.5 && m.position <= 20.5) return "positions_11_to_20";
  return null;
}

function freezeFor(page: ClassifiedPage, today: string): Freeze | undefined {
  return FREEZES.find((f) => today < f.until && f.covers(page));
}

function build(type: OpportunityType, page: ClassifiedPage, observed: WindowMetrics, today: string, before?: WindowMetrics): Opportunity {
  const freeze = freezeFor(page, today);
  const t = TEXT[type];
  return {
    type,
    page,
    observed,
    before,
    problem: t.problem,
    action: t.action,
    successCriterion: t.success,
    scores: score(type, observed, Boolean(freeze)),
    status: freeze ? "deferred" : "actionable",
    deferredBy: freeze && { id: freeze.id, until: freeze.until, priorityAfter: score(type, observed, false).priority },
  };
}

/**
 * Opportunities from a Pages export, optionally compared with an earlier
 * window of the same length (for declines). `today` is an ISO date, passed
 * in so the result is reproducible.
 */
export function findOpportunities(after: readonly GscRow[], today: string, before?: readonly GscRow[]): Opportunity[] {
  const byPath = (rows: readonly GscRow[]) => {
    const m = new Map<string, GscRow[]>();
    for (const r of rows) {
      const p = normalizePath(r.key);
      m.set(p, [...(m.get(p) ?? []), r]);
    }
    return new Map([...m].map(([p, rs]) => [p, aggregate(rs)] as const));
  };
  const now = byPath(after);
  const earlier = before ? byPath(before) : new Map<string, WindowMetrics>();
  const out: Opportunity[] = [];
  for (const [path, m] of now) {
    const page = classifyPage(path);
    const prev = earlier.get(path);
    if (prev && compareWindows(prev, m).clicks === "down") out.push(build("declining_page", page, m, today, prev));
    const type = classifyType(m);
    if (type) out.push(build(type, page, m, today));
  }
  // Pages Google stopped showing at all count as declines too.
  for (const [path, prev] of earlier) {
    if (now.has(path)) continue;
    const gone = { clicks: 0, impressions: 0, position: 0 };
    if (compareWindows(prev, gone).clicks === "down") out.push(build("declining_page", classifyPage(path), gone, today, prev));
  }
  // Deferred ones are ranked by the score they will have after the freeze,
  // so the list is the post-freeze backlog. GROWTH_OS §4: at equal score,
  // the opportunity with the most data first.
  const rank = (o: Opportunity) => o.deferredBy?.priorityAfter ?? o.scores.priority;
  return out.sort((a, b) => Number(a.status === "deferred") - Number(b.status === "deferred") || rank(b) - rank(a) || b.observed.impressions - a.observed.impressions);
}

// --- Query clusters ---------------------------------------------------------

const STOP = new Set([
  "a", "an", "the", "of", "in", "on", "for", "to", "is", "what", "whats", "how", "and", "or", "terms",
  "le", "la", "les", "un", "une", "des", "de", "du", "d", "l", "en", "par", "et", "que", "qu", "est", "ce",
]);

/** Variants of one search, as a key: lower case, no quotes or punctuation, no stop words, sorted tokens. */
export function clusterKey(query: string): string {
  const tokens = query
    .toLowerCase()
    // « j'ai » is not « AI »; other elisions (« l'attaque ») just lose their article.
    .replace(/\bj['’]ai\b/g, " ")
    .replace(/\b[cdjlmnst]['’]/g, " ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((t) => t && !STOP.has(t))
    // « scarewares » and « scareware » are one search.
    .map((t) => (t.length > 4 && t.endsWith("s") ? t.slice(0, -1) : t));
  return [...new Set(tokens)].sort().join(" ");
}

export interface QueryCluster {
  key: string;
  queries: string[];
  metrics: WindowMetrics;
  /**
   * Fiches whose name or slug shares the cluster's subject words: a
   * heuristic lead for the manual query → page mapping, which a Search
   * Console « Requêtes » export does not give. Never a proof.
   */
  candidateAttacks: string[];
}

function words(s: string): string[] {
  return clusterKey(s).split(" ").filter((w) => w.length > 2);
}

const GENERIC = new Set(["definition", "meaning", "attack", "attaque", "cyber", "security", "computer", "simulation", "simulator", "test", "tests"]);

export function clusterQueries(rows: readonly GscRow[]): QueryCluster[] {
  const groups = new Map<string, GscRow[]>();
  for (const r of rows) {
    const k = clusterKey(r.key);
    if (!k) continue;
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }
  const attacks = listAttacks().map((a) => ({
    code: a.code,
    words: new Set([...words(a.name), ...words(a.slug.replace(/-/g, " ")), ...words(a.translations?.en?.name ?? ""), ...words((a.translations?.en?.slug ?? "").replace(/-/g, " "))]),
  }));
  return [...groups]
    .map(([key, rs]) => {
      const subject = key.split(" ").filter((w) => w.length > 2 && !GENERIC.has(w));
      return {
        key,
        queries: rs.map((r) => r.key),
        metrics: aggregate(rs),
        candidateAttacks:
          subject.length === 0 ? [] : attacks.filter((a) => subject.every((w) => a.words.has(w))).map((a) => a.code),
      };
    })
    .sort((a, b) => b.metrics.impressions - a.metrics.impressions);
}


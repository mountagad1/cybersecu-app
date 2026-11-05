import type { AttackDetail } from "@/domain/attack/types";
import type { AttackCategorySlug } from "@/domain/attack/categories";

/**
 * One encyclopedia entry, as it lives in the repository.
 *
 * WHY CONTENT LIVES IN CODE
 * The encyclopedia is editorial content, not user data: it is written,
 * reviewed and versioned like the rest of the codebase, and it is
 * identical for every visitor. Keeping it in git means a deploy alone
 * publishes it — there is no separate SQL step that can silently be
 * skipped, and no configuration under which /attaques renders empty.
 * See docs/decisions/0007-content-in-repository.md.
 *
 * The database keeps what genuinely belongs to a database: attempts,
 * quotas, entitlements and purchases — per-visitor state that changes at
 * runtime.
 */
export type EditorialStatus = "draft" | "review" | "published";

export interface AttackEntry extends AttackDetail, AttackDepth {
  /** Exactly one family. Checked by the registry at module load. */
  categorySlug: AttackCategorySlug;

  /**
   * Only `published` entries get a route, a sitemap entry and an internal
   * link. Until now this was implicit — everything in `src/content` was
   * live the moment it was committed, which left no way to land a fiche
   * for review without publishing it.
   */
  editorialStatus: EditorialStatus;

  /**
   * The « En clair » level: one or two short sentences, no jargon, that a
   * reader with no technical background understands on first pass
   * (brief SENIOR_AND_BEGINNER_ACCESSIBILITY, level 1).
   *
   * This is NOT a shortened `definition`. `definition` names the thing;
   * this says what happens to you. If the two read the same, one of them
   * is wrong.
   */
  plainLanguageDefinition: string;

  /**
   * What the attacker is actually after — money, credentials, an account,
   * a device, data, or leverage over a person.
   *
   * A node in the knowledge graph, not prose: it lets « account takeover »
   * and « vol de mot de passe » be expressed as objectives shared by
   * several attacks rather than as umbrella pages that could only
   * summarise the fiches beneath them.
   */
  attackerObjective: AttackerObjective;

  /**
   * Other names for the same thing, including the ones that were merged
   * into this entry rather than given their own page. They carry the
   * synonym without creating a competing URL, and are what a search inside
   * the site has to match on.
   */
  aliases?: string[];

  /** Slug of the simulation that trains this attack, if one exists. */
  simulationSlug?: string;

  /**
   * Why this attack deliberately has no simulation.
   *
   * A simulation on this site is one thing: a message or an interface
   * arrives, and the visitor decides. Several attacks in the catalogue
   * have no such moment — nothing arrives, and the protection is a
   * configuration or an after-the-fact procedure rather than a judgement
   * call. Inventing a scenario for those would teach a decision that does
   * not exist, which is worse than teaching nothing.
   *
   * This field records that judgement per fiche so it can be reviewed,
   * instead of leaving « pas de simulation » indistinguishable from « pas
   * encore écrite ». It is mutually exclusive with `simulationSlug`;
   * having neither means the simulation is still to be written, and
   * `pnpm seo:audit` reports how many remain.
   */
  noSimulationReason?: string;

  /**
   * Editorial last-review date (YYYY-MM-DD). Feeds `lastmod` in the
   * sitemap and `dateModified` in JSON-LD, so it must reflect a real
   * review of this entry — never bump it to game freshness signals.
   */
  updatedAt: string;

  /**
   * Overlay, not a duplicate entry: `code`, `categorySlug`,
   * `attackerObjective`, `triggers`, `primaryDimension`/`primaryVector`
   * and `relatedAttackCodes` stay locale-invariant (docs/decisions/0009).
   * Only what a reader actually reads is translated. `slug` is required
   * because reusing the French slug under `/en/` is a coincidence, not a
   * guarantee — several already collide usefully (`phishing`, `baiting`),
   * most don't.
   */
  translations?: {
    en?: AttackTranslation;
  };
}

/**
 * Content depth fields (docs/content/CONTENT_ENTITY_TEMPLATE.md), shared by
 * the French entry and its English overlay. Optional and rendered only when
 * present. Where the French entry has them, `translations.en` must carry the
 * same fields with the same number of items — checked by `auditDepthFields`.
 */
export interface AttackDepth {
  /** Why the technique works on an attentive person — the short, direct answer. Not a restatement of `howItWorks`. */
  whyItWorks?: string;

  /**
   * A wholly fictional illustration (decision 0002): no real organisation,
   * every address under `.test`. Rendered under an explicit « Exemple fictif »
   * (« Fictional example ») label, distinct from the factual sections.
   */
  example?: {
    /** One sentence: when and how the message arrives. */
    setting: string;
    /** The message, call transcript or screen, as the person sees it. */
    message: string;
    /** What gives it away, in observable terms. */
    giveaways: string[];
  };

  /** The questions to ask, in order, each with what to do when the answer is yes. */
  decisionChecklist?: { check: string; then: string }[];

  /** Lasting habits that stop it from happening again. */
  prevention?: string[];
}

export interface AttackTranslation extends AttackDepth {
  slug: string;
  name: string;
  plainLanguageDefinition: string;
  definition: string;
  howItWorks: string;
  warningSigns: string[];
  /** Defaults to empty, matching most French entries — see
   * getLocalizedAttack in ./localize.ts. */
  indicators?: string[];
  howToVerify: string;
  whatToDo: string;
  whatToDoIfVictim: string;
  faq: { question: string; answer: string }[];
  /** English label for the same verified URL — the link itself is never
   * retranslated into a different source. */
  references: { label: string; url: string }[];
  aliases?: string[];
  /**
   * Slug of the English simulation, in the separate English catalogue
   * (`src/content/simulations-en`) — never the French `simulationSlug`
   * reinterpreted. An English simulation is independent authored content
   * with its own stable id, not a lookup key into the French one
   * (docs/decisions/0009 §3).
   */
  simulationSlug?: string;
  noSimulationReason?: string;
}

/**
 * Deliberately coarse. A finer list would invite guessing, and this exists
 * to group fiches, not to describe an attacker's business model.
 */
export type AttackerObjective =
  | "argent"
  | "identifiants"
  | "acces_a_un_compte"
  | "controle_d_un_appareil"
  | "donnees_personnelles"
  | "emprise_sur_une_personne";

export const ATTACKER_OBJECTIVE_LABELS: Record<AttackerObjective, string> = {
  argent: "Obtenir un paiement",
  identifiants: "Voler des identifiants",
  acces_a_un_compte: "Prendre le contrôle d'un compte",
  controle_d_un_appareil: "Prendre le contrôle d'un appareil",
  donnees_personnelles: "Collecter des données personnelles",
  emprise_sur_une_personne: "Exercer une emprise sur une personne",
};

/**
 * References may only point at pages whose existence has been verified.
 * This sandbox has no outbound access to public-authority sites, so new
 * deep links cannot be checked here: prefer a link already used elsewhere
 * in the catalogue, or the site root. A reference that 404s is worse than
 * no reference at all.
 */
export const VERIFIED_REFERENCES = {
  phishing: {
    label: "Cybermalveillance.gouv.fr — Hameçonnage (phishing)",
    url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/hameconnage-phishing",
  },
  fakeSupport: {
    label: "Cybermalveillance.gouv.fr — Faux support technique",
    url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/menaces/faux-support-technique-arnaque",
  },
  cybermalveillance: {
    label: "Cybermalveillance.gouv.fr — Assistance et signalement",
    url: "https://www.cybermalveillance.gouv.fr/",
  },
  unicodeSecurity: {
    label: "Unicode Consortium — Unicode Security Considerations (UTS #36)",
    url: "https://www.unicode.org/reports/tr36/",
  },
} as const;

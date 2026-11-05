import "server-only";
import { deriveLearningState, type GradedHistoryEntry } from "@/domain/adaptive/learningState";
import { selectNextScenario, type ScenarioCandidate } from "@/domain/adaptive/selectNext";
import type { CyberReflexDimensionCode, Difficulty } from "@/domain/scenario/types";
import { findAttackByCode } from "@/content/attacks";
import { findSimulationByVersionId, listSimulations } from "@/content/simulations";
import { findSimulationEnByVersionId, listSimulationsEn } from "@/content/simulations-en";
import type { CallerIdentity } from "@/infra/entitlements/repository";
import { createSupabaseAdminClient } from "@/infra/supabase/admin";
import { describeError, log } from "@/infra/observability/log";
import type { Locale } from "@/domain/i18n/locale";

/**
 * Serves the last step of the learning loop — "adaptive next scenario"
 * (docs/LEARNING_ENGINE.md §1).
 *
 * `selectNextScenario`/`weightCandidate` were implemented and unit-tested but
 * nothing ever called them: after answering, the player was a dead end and the
 * only way on was back to the index. This is the missing wiring between the
 * decided algorithm and a real caller.
 *
 * The candidate catalogue comes from `src/content/simulations`, which is
 * the same source the pages render from
 * (docs/decisions/0007-content-in-repository.md) — so a scenario can never
 * be suggested that has no page, and the suggestion works even when the
 * database is unavailable.
 *
 * Only the caller's own history still needs a query, and it goes through
 * the service-role client because anonymous visitors cannot select their
 * `attempts` rows under RLS (they hold no Supabase Auth identity —
 * docs/NO_LOGIN_ARCHITECTURE.md §4).
 */

export interface NextScenarioSuggestion {
  slug: string;
  impersonatedEntity: string;
  difficulty: Difficulty;
}

interface CatalogueEntry extends ScenarioCandidate {
  slug: string;
  impersonatedEntity: string;
  scenarioId: string;
  version: number;
}

export async function suggestNextScenario(
  identity: CallerIdentity,
  excludeScenarioVersionId?: string,
  locale: Locale = "fr",
): Promise<NextScenarioSuggestion | null> {
  const [catalogue, history] = await Promise.all([
    loadCatalogue(locale),
    loadGradedHistory(identity),
  ]);

  const attemptedVersionIds = new Set(history.map((entry) => entry.scenarioVersionId));

  const candidates = catalogue
    .filter((entry) => entry.scenarioVersionId !== excludeScenarioVersionId)
    .map((entry) => ({ ...entry, recentlySeen: attemptedVersionIds.has(entry.scenarioVersionId) }));

  if (candidates.length === 0) return null;

  const state = deriveLearningState(
    history.map(({ dimension, correct }): GradedHistoryEntry => ({ dimension, correct })),
  );

  const chosen = selectNextScenario(candidates, state);

  // `selectNextScenario` returns null when every candidate weighs zero, which
  // for a `general` profile is every scenario authored for `senior` or
  // `business` (docs/LEARNING_ENGINE.md §3). That is a correct refusal to
  // *adapt*, not a reason to leave the visitor at a dead end — so fall back to
  // the plainest sensible pick: something they have not attempted, easiest
  // first, and failing that anything at all.
  const suggestion =
    (chosen as CatalogueEntry | null) ??
    pickFallback(candidates as CatalogueEntry[], attemptedVersionIds);

  if (!suggestion) return null;

  return {
    slug: suggestion.slug,
    impersonatedEntity: suggestion.impersonatedEntity,
    difficulty: suggestion.difficulty,
  };
}

function pickFallback(
  candidates: CatalogueEntry[],
  attemptedVersionIds: ReadonlySet<string>,
): CatalogueEntry | null {
  const byEase = [...candidates].sort(
    (a, b) => a.difficulty - b.difficulty || a.slug.localeCompare(b.slug),
  );
  return byEase.find((c) => !attemptedVersionIds.has(c.scenarioVersionId)) ?? byEase[0] ?? null;
}

/**
 * Every simulation in the catalogue, resolved to what the selection
 * algorithm needs. Synchronous in substance — kept async so the
 * `Promise.all` above stays symmetric with the history read.
 *
 * Scoped to one locale's catalogue — a suggestion must always be a slug
 * that resolves on the page the visitor is currently reading
 * (docs/decisions/0009-i18n-pilot.md §3): an English reader who gets
 * suggested a French-only slug hits a dead link.
 */
async function loadCatalogue(locale: Locale): Promise<CatalogueEntry[]> {
  const simulations = locale === "en" ? listSimulationsEn() : listSimulations();
  return simulations.flatMap((sim) => {
    const attack = findAttackByCode(sim.attackCode);
    // A simulation whose attack has no page must not be offered as the
    // next step: the catalogue audit prevents this, so it is defensive.
    if (!attack) return [];

    return [
      {
        scenarioVersionId: sim.versionId,
        scenarioId: sim.scenarioCode,
        version: sim.version,
        slug: sim.slug,
        impersonatedEntity: sim.impersonatedEntity,
        attackCode: attack.code,
        dimension: attack.primaryDimension,
        difficulty: sim.difficulty,
        targetProfile: sim.targetProfile,
        recentlySeen: false,
      },
    ];
  });
}

interface HistoryEntry extends GradedHistoryEntry {
  scenarioVersionId: string;
}

/**
 * The caller's answered attempts, most recent first, with their dimension.
 * Not scoped to a locale: `attempts` has no language column, and a visitor
 * who played both catalogues in the same session should have both count
 * toward the adaptive selection — `loadDimensions` below resolves each
 * `scenario_version_id` against whichever catalogue it actually belongs to.
 */
async function loadGradedHistory(identity: CallerIdentity): Promise<HistoryEntry[]> {
  if (!identity.userId && !identity.anonymousSessionId) return [];

  const admin = createSupabaseAdminClient();
  const query = admin
    .from("attempts")
    .select("scenario_version_id, attempt_decisions(correct)")
    .order("started_at", { ascending: false })
    .limit(200);

  const { data: attempts, error } = identity.userId
    ? await query.eq("user_id", identity.userId)
    : await query.eq("anonymous_session_id", identity.anonymousSessionId!);

  if (error) {
    // A missing history degrades selection to the no-history path, which is a
    // valid state — never a reason to deny the visitor a next scenario.
    log.warn("scenarios.next_history_failed", describeError(error));
    return [];
  }
  if (!attempts || attempts.length === 0) return [];

  type JoinedAttempt = {
    scenario_version_id: string;
    attempt_decisions: { correct: boolean } | { correct: boolean }[] | null;
  };

  const rows = attempts as unknown as JoinedAttempt[];
  const dimensionByVersionId = loadDimensions(rows.map((r) => r.scenario_version_id));

  return rows.flatMap((row) => {
    const decision = Array.isArray(row.attempt_decisions)
      ? row.attempt_decisions[0]
      : row.attempt_decisions;
    const dimension = dimensionByVersionId.get(row.scenario_version_id);
    // An unanswered attempt has no decision and teaches nothing about
    // accuracy, but the scenario was still seen — it is carried with the
    // grading it has, and filtered out of the accuracy tally below.
    if (!decision || !dimension) return [];
    return [{ scenarioVersionId: row.scenario_version_id, dimension, correct: decision.correct }];
  });
}

function loadDimensions(
  scenarioVersionIds: string[],
): Map<string, CyberReflexDimensionCode> {
  const result = new Map<string, CyberReflexDimensionCode>();
  for (const versionId of new Set(scenarioVersionIds)) {
    const sim = findSimulationByVersionId(versionId) ?? findSimulationEnByVersionId(versionId);
    const dimension = sim ? findAttackByCode(sim.attackCode)?.primaryDimension : undefined;
    if (dimension) result.set(versionId, dimension);
  }
  return result;
}

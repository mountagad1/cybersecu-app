import "server-only";
import { computeDimensionScore, type ScoredAttempt } from "@/domain/scoring/reflexScore";
import { findSimulationByVersionId } from "@/content/simulations";
import { findAttackByCode } from "@/content/attacks";
import { createSupabaseAdminClient } from "@/infra/supabase/admin";
import type { Database } from "@/infra/supabase/database.types";

type CyberReflexScoresInsert = Database["public"]["Tables"]["cyber_reflex_scores"]["Insert"];

/**
 * Recomputes and upserts a user's Cyber Reflex score for one dimension
 * after a new attempt is graded. Runs server-side only (service role),
 * per docs/LEARNING_ENGINE.md §5 and docs/SECURITY_MODEL.md §2 (users
 * cannot write their own cyber_reflex_scores directly).
 *
 * The difficulty and the attack's dimension used to come from a join
 * through scenario_versions → scenarios → attacks. Since the simulation
 * catalogue moved into the repository (migration 0005,
 * docs/decisions/0007-content-in-repository.md) they are resolved from
 * src/content instead, and the query only reads what is genuinely
 * per-user: the attempt and its decision.
 */
export async function recomputeDimensionScore(userId: string, dimension: string): Promise<void> {
  const supabase = createSupabaseAdminClient();

  const { data: rows, error } = await supabase
    .from("attempts")
    .select("answered_at, scenario_version_id, attempt_decisions(correct)")
    .eq("user_id", userId)
    .filter("answered_at", "not.is", null)
    .order("answered_at", { ascending: false });

  if (error) throw error;

  type AttemptRow = {
    answered_at: string | null;
    scenario_version_id: string;
    attempt_decisions: { correct: boolean } | { correct: boolean }[] | null;
  };

  const scored: ScoredAttempt[] = [];
  let recencyIndex = 0;

  for (const row of (rows ?? []) as unknown as AttemptRow[]) {
    const simulation = findSimulationByVersionId(row.scenario_version_id);
    // An attempt against a simulation that has since been retired from
    // the catalogue: skipped rather than guessed at, so a removed
    // scenario can never distort a score.
    if (!simulation) continue;

    if (findAttackByCode(simulation.attackCode)?.primaryDimension !== dimension) continue;

    const decision = Array.isArray(row.attempt_decisions) ? row.attempt_decisions[0] : row.attempt_decisions;
    if (!decision) continue;

    scored.push({
      correct: decision.correct,
      difficulty: simulation.difficulty,
      recencyIndex: recencyIndex++,
    });
  }

  const score = computeDimensionScore(scored);
  if (score === null) return;

  // `as never` — see docs/decisions/0004-hand-rolled-database-types.md addendum.
  const payload: CyberReflexScoresInsert = { user_id: userId, dimension, score, attempts_count: scored.length };
  await supabase.from("cyber_reflex_scores").upsert(payload as never, { onConflict: "user_id,dimension" });
}

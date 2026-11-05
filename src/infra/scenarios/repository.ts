import "server-only";
import type { AttackVectorCode, Difficulty, GradedScenario, PublicScenario } from "@/domain/scenario/types";
import {
  findSimulationBySlug,
  findSimulationByVersionId,
  listSimulations,
  toGradedScenario,
  toPublicScenario,
} from "@/content/simulations";
import { findSimulationEnBySlug, findSimulationEnByVersionId, listSimulationsEn } from "@/content/simulations-en";

/**
 * Reads of the simulation catalogue.
 *
 * Like the encyclopedia, simulations are authored content and live in the
 * repository (docs/decisions/0007-content-in-repository.md). The database
 * keeps what is genuinely per-visitor: attempts, quota usage,
 * entitlements and purchases.
 *
 * `getPublicScenarioBySlug` still returns the public projection only —
 * correct answers and explanations never reach the browser before an
 * answer is submitted (docs/SECURITY_MODEL.md §9).
 *
 * French and English are separate content catalogues
 * (docs/decisions/0009-i18n-pilot.md §3), but share this one lookup surface:
 * slugs and `versionId`s are disjoint by construction across the two
 * (English slugs are English words, `versionId`s live in a separate UUID
 * range), so checking French then English here is safe and lets the
 * attempt/grading pipeline stay locale-agnostic.
 */

export async function getPublicScenarioBySlug(slug: string): Promise<PublicScenario | null> {
  const sim = findSimulationBySlug(slug) ?? findSimulationEnBySlug(slug);
  return sim ? toPublicScenario(sim) : null;
}

export interface ScenarioListItem {
  slug: string;
  impersonatedEntity: string;
  channel: AttackVectorCode;
  difficulty: Difficulty;
  teaser: string;
  attackCode: string;
}

export async function listPublishedScenarios(): Promise<ScenarioListItem[]> {
  return listSimulations().map((sim) => ({
    slug: sim.slug,
    impersonatedEntity: sim.impersonatedEntity,
    channel: sim.channel,
    difficulty: sim.difficulty,
    teaser: sim.teaser,
    attackCode: sim.attackCode,
  }));
}

/** English mirror of `listPublishedScenarios` — never merged into the
 * French list (docs/decisions/0009-i18n-pilot.md §3). */
export async function listPublishedScenariosEn(): Promise<ScenarioListItem[]> {
  return listSimulationsEn().map((sim) => ({
    slug: sim.slug,
    impersonatedEntity: sim.impersonatedEntity,
    channel: sim.channel,
    difficulty: sim.difficulty,
    teaser: sim.teaser,
    attackCode: sim.attackCode,
  }));
}

/**
 * Server-side grading source. Kept behind an async function because the
 * answer route awaits it, and because grading must stay the one place
 * that can see `correctChoiceIds`.
 */
export async function getGradedScenarioVersionById(scenarioVersionId: string): Promise<GradedScenario | null> {
  const sim = findSimulationByVersionId(scenarioVersionId) ?? findSimulationEnByVersionId(scenarioVersionId);
  return sim ? toGradedScenario(sim) : null;
}

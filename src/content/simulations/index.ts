import type { GradedScenario, PublicScenario } from "@/domain/scenario/types";
import { SIMULATIONS_INGENIERIE_SOCIALE } from "./ingenierie-sociale";
import { SIMULATIONS_INGENIERIE_SOCIALE_SUITE } from "./ingenierie-sociale-suite";
import { SIMULATIONS_SITES_ET_NAVIGATEURS } from "./sites-et-navigateurs";
import { SIMULATIONS_SITES_ET_NAVIGATEURS_SUITE } from "./sites-et-navigateurs-suite";
import { SIMULATIONS_TELEPHONES_ET_OBJETS_CONNECTES } from "./telephones-et-objets-connectes";
import { SIMULATIONS_IDENTIFIANTS_ET_COMPTES_SUITE } from "./identifiants-et-comptes-suite";
import { SIMULATIONS_IA_ET_CONTENUS_SYNTHETIQUES } from "./ia-et-contenus-synthetiques";
import { SIMULATIONS_SITES_ET_NAVIGATEURS_SUITE2 } from "./sites-et-navigateurs-suite2";
import { SIMULATIONS_LOT10_DIVERS } from "./lot10-divers";
import { SIMULATIONS_FRAUDES_ET_COMPTES } from "./fraudes-et-comptes";
import { SIMULATIONS_FRAUDES_FINANCIERES_SUITE } from "./fraudes-financieres-suite";
import type { SimulationEntry } from "./types";

export type { SimulationEntry } from "./types";

const ALL_SIMULATIONS: readonly SimulationEntry[] = [
  ...SIMULATIONS_INGENIERIE_SOCIALE,
  ...SIMULATIONS_INGENIERIE_SOCIALE_SUITE,
  ...SIMULATIONS_SITES_ET_NAVIGATEURS,
  ...SIMULATIONS_SITES_ET_NAVIGATEURS_SUITE,
  ...SIMULATIONS_TELEPHONES_ET_OBJETS_CONNECTES,
  ...SIMULATIONS_IDENTIFIANTS_ET_COMPTES_SUITE,
  ...SIMULATIONS_IA_ET_CONTENUS_SYNTHETIQUES,
  ...SIMULATIONS_SITES_ET_NAVIGATEURS_SUITE2,
  ...SIMULATIONS_LOT10_DIVERS,
  ...SIMULATIONS_FRAUDES_ET_COMPTES,
  ...SIMULATIONS_FRAUDES_FINANCIERES_SUITE,
];

/**
 * Safety net for the content rule that matters most here: a simulation
 * must never be usable as real phishing material. Every URL in a
 * scenario body has to sit under the reserved `.test` TLD (RFC 6761),
 * which cannot be registered by anyone, and every impersonated entity has
 * to be visibly fictional.
 */
const NON_TEST_URL = /https?:\/\/[^\s)]+/g;

export function auditSimulations(
  simulations: readonly SimulationEntry[],
): string[] {
  const problems: string[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const sim of simulations) {
    if (seenIds.has(sim.versionId))
      problems.push(`versionId dupliqué : ${sim.versionId}`);
    seenIds.add(sim.versionId);
    if (seenSlugs.has(sim.slug)) problems.push(`slug dupliqué : ${sim.slug}`);
    seenSlugs.add(sim.slug);

    const choiceIds = new Set(sim.choices.map((c) => c.id));
    if (sim.choices.length < 2)
      problems.push(`${sim.slug} : moins de deux choix`);
    if (sim.correctChoiceIds.length === 0)
      problems.push(`${sim.slug} : aucune bonne réponse`);

    for (const id of sim.correctChoiceIds) {
      if (!choiceIds.has(id))
        problems.push(
          `${sim.slug} : correctChoiceIds référence « ${id} », absent des choix`,
        );
    }
    for (const id of choiceIds) {
      if (!sim.explanations[id])
        problems.push(
          `${sim.slug} : aucune explication pour le choix « ${id} »`,
        );
    }
    if (!sim.choices.some((c) => c.isUnsure)) {
      // "Je ne sais pas" must always be offered: forcing a guess teaches
      // guessing, and the unsure answer is itself a teachable moment.
      problems.push(`${sim.slug} : pas d'option « Je ne sais pas »`);
    }

    for (const url of sim.content.body.match(NON_TEST_URL) ?? []) {
      const host = url.replace(/^https?:\/\//, "").split(/[/?#]/)[0];
      if (!host.endsWith(".test")) {
        problems.push(
          `${sim.slug} : URL hors du TLD réservé .test — « ${host} »`,
        );
      }
    }
  }

  return problems;
}

const problems = auditSimulations(ALL_SIMULATIONS);
if (problems.length > 0) {
  throw new Error(
    `Catalogue de simulations invalide :\n  - ${problems.join("\n  - ")}`,
  );
}

export function listSimulations(): SimulationEntry[] {
  return [...ALL_SIMULATIONS].sort(
    (a, b) => a.difficulty - b.difficulty || a.slug.localeCompare(b.slug, "fr"),
  );
}

export function findSimulationBySlug(
  slug: string,
): SimulationEntry | undefined {
  return ALL_SIMULATIONS.find((s) => s.slug === slug);
}

export function findSimulationByVersionId(
  versionId: string,
): SimulationEntry | undefined {
  return ALL_SIMULATIONS.find((s) => s.versionId === versionId);
}

export function listSimulationsForAttack(
  attackCode: string,
): SimulationEntry[] {
  return listSimulations().filter((s) => s.attackCode === attackCode);
}

/**
 * Public projection: strips `correctChoiceIds`, `explanations` and every
 * choice's `mistakePatternCodes`, which are answer-only data and must
 * never reach the browser before an answer is submitted
 * (docs/SECURITY_MODEL.md §9).
 */
export function toPublicScenario(sim: SimulationEntry): PublicScenario {
  return {
    scenarioVersionId: sim.versionId,
    scenarioCode: sim.scenarioCode,
    version: sim.version,
    attackCode: sim.attackCode,
    channel: sim.channel,
    targetProfile: sim.targetProfile,
    difficulty: sim.difficulty,
    impersonatedEntity: sim.impersonatedEntity,
    content: sim.content,
    choices: sim.choices.map((c) => ({
      id: c.id,
      label: c.label,
      isUnsure: c.isUnsure,
    })),
  };
}

/** Server-only projection used for grading. */
export function toGradedScenario(sim: SimulationEntry): GradedScenario {
  return {
    scenarioVersionId: sim.versionId,
    scenarioCode: sim.scenarioCode,
    version: sim.version,
    attackCode: sim.attackCode,
    channel: sim.channel,
    targetProfile: sim.targetProfile,
    difficulty: sim.difficulty,
    impersonatedEntity: sim.impersonatedEntity,
    content: sim.content,
    choices: sim.choices,
    correctChoiceIds: sim.correctChoiceIds,
    explanations: sim.explanations,
  };
}

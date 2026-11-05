import { compileWorkflow, validateCompiledWorkflow } from "@/infra/voice/dograh/compileWorkflow";
import { FAUX_CONSEILLER_BANCAIRE_VOICE } from "./faux-conseiller-bancaire";
import type { VoiceScenarioDefinition } from "@/domain/voice/types";

export type { VoiceScenarioDefinition } from "@/domain/voice/types";

const ALL_VOICE_SIMULATIONS: readonly VoiceScenarioDefinition[] = [FAUX_CONSEILLER_BANCAIRE_VOICE];

/**
 * Same discipline as `src/content/simulations/index.ts` and
 * `src/content/attacks/index.ts`: a structural fault throws at module
 * load, so a broken voice scenario fails the build instead of shipping.
 *
 * Compiling every scenario through `compileWorkflow` here — even though
 * nothing calls Dograh's API at build time — catches the class of error
 * the sync script (docs/DOGRAH_INTEGRATION.md §4) would otherwise be the
 * first to discover: a dangling transition, a duplicate stage id, more
 * than one entry stage.
 */
export function auditVoiceSimulations(scenarios: readonly VoiceScenarioDefinition[]): string[] {
  const problems: string[] = [];
  const seenSlugs = new Set<string>();

  for (const scenario of scenarios) {
    if (seenSlugs.has(scenario.slug)) problems.push(`slug dupliqué : ${scenario.slug}`);
    seenSlugs.add(scenario.slug);

    if ((scenario.dograhWorkflowId === null) !== (scenario.dograhEmbedToken === null)) {
      problems.push(
        `${scenario.slug} : dograhWorkflowId et dograhEmbedToken doivent être définis ensemble ou pas du tout`,
      );
    }

    if (scenario.signals.length === 0) {
      problems.push(`${scenario.slug} : aucun signal déclaré — rien ne pourrait jamais être évalué`);
    }

    const seenSignalNames = new Set<string>();
    for (const signal of scenario.signals) {
      if (seenSignalNames.has(signal.name)) problems.push(`${scenario.slug} : signal dupliqué "${signal.name}"`);
      seenSignalNames.add(signal.name);
    }

    try {
      const compiled = compileWorkflow(scenario);
      for (const problem of validateCompiledWorkflow(compiled)) {
        problems.push(`${scenario.slug} : ${problem}`);
      }
    } catch (error) {
      problems.push(`${scenario.slug} : ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return problems;
}

const problems = auditVoiceSimulations(ALL_VOICE_SIMULATIONS);
if (problems.length > 0) {
  throw new Error(`Catalogue de simulations vocales invalide :\n  - ${problems.join("\n  - ")}`);
}

export function listVoiceSimulations(): VoiceScenarioDefinition[] {
  return [...ALL_VOICE_SIMULATIONS];
}

export function findVoiceSimulationBySlug(slug: string): VoiceScenarioDefinition | undefined {
  return ALL_VOICE_SIMULATIONS.find((s) => s.slug === slug);
}

export function findVoiceSimulationsForAttack(attackCode: string): VoiceScenarioDefinition[] {
  return ALL_VOICE_SIMULATIONS.filter((s) => s.attackCode === attackCode);
}

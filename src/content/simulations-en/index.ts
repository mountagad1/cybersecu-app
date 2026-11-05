import { auditSimulations, toGradedScenario, toPublicScenario } from "@/content/simulations";
import type { SimulationEntry } from "@/content/simulations/types";
import { SIMULATIONS_EN_SOCIAL_ENGINEERING } from "./social-engineering";
import { SIMULATIONS_EN_SITES_AND_BROWSERS } from "./sites-and-browsers";
import { SIMULATIONS_EN_FINANCIAL_FRAUD } from "./financial-fraud";
import { SIMULATIONS_EN_CREDENTIALS_AND_ACCOUNTS } from "./credentials-and-accounts";
import { SIMULATIONS_EN_MALWARE } from "./malware";
import { SIMULATIONS_EN_PHONES_AND_CONNECTED_DEVICES } from "./phones-and-connected-devices";
import { SIMULATIONS_EN_NETWORKS_AND_WIFI } from "./networks-and-wifi";
import { SIMULATIONS_EN_DATA_AND_DIGITAL_IDENTITY } from "./data-and-digital-identity";
import { SIMULATIONS_EN_AI_AND_SYNTHETIC_CONTENT } from "./ai-and-synthetic-content";
import { SIMULATIONS_EN_BLACKMAIL_AND_HARASSMENT } from "./blackmail-and-harassment";

export { toGradedScenario, toPublicScenario };
export type { SimulationEntry } from "@/content/simulations/types";

/**
 * The English simulation catalogue, kept separate from the French one
 * (`@/content/simulations`) rather than merged into it —
 * docs/decisions/0009-i18n-pilot.md §3. `listSimulations()` here must
 * never appear on the French `/simulations` index or in the French
 * sitemap, and vice versa; two registries make that a structural
 * guarantee instead of a filter someone has to remember to apply.
 *
 * `auditSimulations`/`toPublicScenario`/`toGradedScenario` are reused
 * from the French registry unchanged: they operate on `SimulationEntry`
 * and have nothing locale-specific in them.
 */
const ALL_SIMULATIONS_EN: readonly SimulationEntry[] = [
  ...SIMULATIONS_EN_SOCIAL_ENGINEERING,
  ...SIMULATIONS_EN_SITES_AND_BROWSERS,
  ...SIMULATIONS_EN_FINANCIAL_FRAUD,
  ...SIMULATIONS_EN_CREDENTIALS_AND_ACCOUNTS,
  ...SIMULATIONS_EN_MALWARE,
  ...SIMULATIONS_EN_PHONES_AND_CONNECTED_DEVICES,
  ...SIMULATIONS_EN_NETWORKS_AND_WIFI,
  ...SIMULATIONS_EN_DATA_AND_DIGITAL_IDENTITY,
  ...SIMULATIONS_EN_AI_AND_SYNTHETIC_CONTENT,
  ...SIMULATIONS_EN_BLACKMAIL_AND_HARASSMENT,
];

const problems = auditSimulations(ALL_SIMULATIONS_EN);
if (problems.length > 0) {
  throw new Error(`Invalid English simulation catalogue:\n  - ${problems.join("\n  - ")}`);
}

export function listSimulationsEn(): SimulationEntry[] {
  return [...ALL_SIMULATIONS_EN].sort((a, b) => a.difficulty - b.difficulty || a.slug.localeCompare(b.slug, "en"));
}

export function findSimulationEnBySlug(slug: string): SimulationEntry | undefined {
  return ALL_SIMULATIONS_EN.find((s) => s.slug === slug);
}

export function findSimulationEnByVersionId(versionId: string): SimulationEntry | undefined {
  return ALL_SIMULATIONS_EN.find((s) => s.versionId === versionId);
}

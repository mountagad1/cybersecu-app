import { acceptedNames, ENV_REGISTRY, getEnvSpec, type EnvGroup } from "@/lib/env/registry";

/**
 * Résolution des variables d'environnement depuis le registre.
 *
 * Volontairement SANS `import "server-only"` : `token.ts` documente qu'il reste
 * libre de cette garde pour rester testable directement, et ce module ne fait
 * que lire `process.env` — aucun cookie, aucune requête. Les gardes vivent sur
 * les modules qui touchent réellement des API serveur.
 *
 * EFFET DE BORD RECHERCHÉ : l'accès est dynamique (`process.env[nom]`). Next
 * n'inline statiquement que les accès littéraux `process.env.NEXT_PUBLIC_X`, si
 * bien que les alias `NEXT_PUBLIC_*` du registre ne sont plus figés dans le
 * bundle au moment du build. Ils redeviennent ce qu'ils auraient toujours dû
 * être : des noms de repli lus au runtime, côté serveur uniquement.
 */

/**
 * Panne de configuration, distincte de toute panne d'infrastructure.
 *
 * Une classe plutôt qu'un message à reconnaître par expression régulière : les
 * appelants doivent pouvoir répondre 503 « pas encore configuré » sans deviner,
 * et un log doit pouvoir la classer sans relire sa prose.
 */
export class EnvConfigurationError extends Error {
  readonly variable: string;
  readonly acceptedNames: readonly string[];

  /** `null` quand la variable est absente ; sinon, pourquoi sa valeur est refusée. */
  readonly problem: string | null;

  constructor(variable: string, accepted: readonly string[], problem: string | null = null) {
    const alternatives =
      accepted.length > 1 ? ` (ou, acceptés : ${accepted.slice(1).join(", ")})` : "";
    super(
      problem
        ? `Invalid ${variable} — ${problem}.`
        : `Missing ${variable}${alternatives} — définissez-la pour CET environnement de déploiement, puis redéployez.`,
    );
    this.name = "EnvConfigurationError";
    this.variable = variable;
    this.acceptedNames = accepted;
    this.problem = problem;
  }
}

function readRaw(name: string): string | undefined {
  const value = process.env[name];
  // Une variable définie à la chaîne vide est un état de déploiement réel
  // (champ créé puis vidé dans une interface) et doit compter comme absente,
  // sans quoi `new URL("")` lève plus loin, hors contexte.
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

/** Nom sous lequel la variable est réellement définie, ou `null`. */
export function resolvedNameOf(canonical: string): string | null {
  const spec = getEnvSpec(canonical);
  if (!spec) throw new Error(`Variable inconnue du registre : ${canonical}`);
  return acceptedNames(spec).find((name) => readRaw(name) !== undefined) ?? null;
}

/** Valeur résolue, ou `undefined`. Ne lève jamais. */
export function readEnv(canonical: string): string | undefined {
  const name = resolvedNameOf(canonical);
  return name ? readRaw(name) : undefined;
}

/** Présence seule. La valeur ne quitte jamais cette fonction. */
export function hasEnv(canonical: string): boolean {
  return resolvedNameOf(canonical) !== null;
}

/**
 * Valeur résolue, ou une erreur qui nomme TOUTES les orthographes acceptées.
 *
 * Le message compte : l'incident de production affichait « Missing
 * SUPABASE_URL » alors que le code acceptait aussi `NEXT_PUBLIC_SUPABASE_URL`,
 * sans jamais le dire. Un opérateur ne pouvait pas savoir quoi définir.
 */
export function requireEnv(canonical: string): string {
  const value = readEnv(canonical);
  const spec = getEnvSpec(canonical);

  if (value === undefined) {
    throw new EnvConfigurationError(canonical, spec ? acceptedNames(spec) : [canonical]);
  }

  // Une valeur présente mais invalide est refusée aussi fermement qu'une
  // absente : accepter un secret devinable reviendrait à annuler
  // silencieusement la protection qu'il représente.
  const problem = spec?.validate?.(value, readEnv) ?? null;
  if (problem) {
    throw new EnvConfigurationError(canonical, spec ? acceptedNames(spec) : [canonical], problem);
  }

  return value;
}

/** Raison pour laquelle la valeur présente est inutilisable, ou `null`. */
export function validationProblem(canonical: string): string | null {
  const value = readEnv(canonical);
  if (value === undefined) return null;
  return getEnvSpec(canonical)?.validate?.(value, readEnv) ?? null;
}

export interface EnvReport {
  name: string;
  group: EnvGroup;
  required: boolean;
  present: boolean;
  /** Nom effectivement utilisé — jamais la valeur. */
  resolvedVia: string | null;
  /** `true` si résolue par un alias hérité plutôt que par le nom canonique. */
  usingLegacyAlias: boolean;
  /** `false` si la valeur est présente mais inutilisable. */
  valid: boolean;
  /** Raison du rejet — décrit la catégorie, jamais la valeur. */
  problem: string | null;
}

/**
 * État de configuration, présence uniquement. Aucune valeur, aucune longueur,
 * aucun hachage — c'est ce qui rend ce rapport sûr à exposer par un diagnostic.
 */
export function reportEnv(): EnvReport[] {
  return ENV_REGISTRY.map((spec) => {
    const resolvedVia = resolvedNameOf(spec.name);
    const problem = resolvedVia !== null ? validationProblem(spec.name) : null;
    return {
      name: spec.name,
      group: spec.group,
      required: spec.required,
      present: resolvedVia !== null,
      resolvedVia,
      usingLegacyAlias: resolvedVia !== null && resolvedVia !== spec.name,
      valid: problem === null,
      problem,
    };
  });
}

/** Variables requises manquantes pour un groupe donné. */
export function missingRequired(group: EnvGroup): string[] {
  return reportEnv()
    .filter((r) => r.group === group && r.required && (!r.present || !r.valid))
    .map((r) => r.name);
}

/**
 * Lève si une variable requise manque, sans rien retourner.
 *
 * Sert à échouer AVANT le premier effet de bord. `getOrCreateAnonymousSessionId`
 * insérait une ligne dans `anonymous_sessions` puis signait le cookie : sans
 * `ANON_SESSION_SECRET`, chaque tentative laissait une session orpheline en base
 * — mesuré, une ligne par clic de visiteur.
 */
export function assertConfigured(canonical: string): void {
  requireEnv(canonical);
}

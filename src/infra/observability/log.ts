import "server-only";
import { EnvConfigurationError } from "@/lib/env/read";

/**
 * Minimal structured server-side logging (brief §18 OBSERVABILITY).
 *
 * Why this exists: when `/attaques` went blank in production there was no way
 * to tell, from the outside, whether the database was unreachable, the schema
 * was missing, or there was simply no published content. All three produced
 * the same silent outcome. These logs make the three cases distinguishable in
 * Vercel's function logs.
 *
 * SAFETY: never pass secrets, tokens, keys, connection strings or user
 * identifiers into `context`. `redact()` strips the obvious offenders as a
 * backstop, but it is a safety net, not a licence to pass sensitive values.
 */

type Level = "info" | "warn" | "error";

const SENSITIVE_KEY = /(key|token|secret|password|authorization|cookie|dsn|url|email)/i;

function redact(context: Record<string, unknown>): Record<string, unknown> {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    safe[key] = SENSITIVE_KEY.test(key) ? "[redacted]" : value;
  }
  return safe;
}

function emit(level: Level, event: string, context: Record<string, unknown> = {}): void {
  const line = JSON.stringify({
    level,
    event,
    at: new Date().toISOString(),
    ...redact(context),
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info: (event: string, context?: Record<string, unknown>) => emit("info", event, context),
  warn: (event: string, context?: Record<string, unknown>) => emit("warn", event, context),
  error: (event: string, context?: Record<string, unknown>) => emit("error", event, context),
};

/**
 * What a transport failure looks like coming out of `supabase-js`.
 *
 * When the Supabase host cannot be reached at all — DNS failure, an egress
 * policy denying the domain, the project paused — the client does not throw
 * and does not populate `code`, `details` or `hint`. It returns an error whose
 * only own property is `message`, set to the empty string. Logging that
 * verbatim produced `{"message":""}`, i.e. a recorded failure with no stated
 * cause: the exact shape of the incident in docs/BLANK_PAGES_ROOT_CAUSE.md,
 * where an unreachable database and an unapplied migration were
 * indistinguishable from the outside. Naming the case is the whole point of
 * this module, so it gets a message of its own.
 */
export const UNREACHABLE_HOST_MESSAGE =
  "Réponse vide de Supabase : hôte injoignable (DNS, réseau sortant bloqué, ou projet en pause).";

/**
 * Normalises an unknown thrown value into something loggable.
 *
 * Postgres/PostgREST errors carry a `code` that is the single most useful
 * field for this incident class:
 *   - `42P01` undefined_table  → migrations were never applied
 *   - `42501` insufficient_privilege → RLS is blocking the read
 * Surfacing it turns "the page is blank" into a specific, actionable cause.
 */
export function describeError(error: unknown): Record<string, unknown> {
  if (error && typeof error === "object") {
    const e = error as { message?: string; code?: string; details?: string; hint?: string };
    return {
      message: e.message || UNREACHABLE_HOST_MESSAGE,
      ...(e.code ? { pgCode: e.code } : {}),
      ...(e.details ? { details: e.details } : {}),
      ...(e.hint ? { hint: e.hint } : {}),
    };
  }
  return { message: String(error) };
}

/**
 * The failure classes behind a non-rendering data page, as distinct outcomes.
 *
 * These are NOT interchangeable, and collapsing them is what made the original
 * incident so expensive: an unreachable database, an unapplied migration, an
 * RLS policy denying the public read, and a genuinely empty table all produced
 * the same silent nothing. Emitting the class alongside the message makes a
 * production log filterable — `kind:"CONFIGURATION_ERROR"` is a deploy
 * problem, `kind:"PERMISSION_DENIED"` is an RLS problem, and no one has to
 * infer which from prose.
 *
 * `EMPTY_DATASET` is deliberately in the same enum even though it is not an
 * error: "the query succeeded and returned nothing" is a real, distinct state,
 * and the whole point is that it must never be reported as, or mistaken for,
 * any of the four failures above it.
 */
export type DataFailureKind =
  | "CONFIGURATION_ERROR"
  | "DATABASE_CONNECTION_ERROR"
  | "SCHEMA_MISSING"
  | "PERMISSION_DENIED"
  | "DATABASE_QUERY_ERROR"
  | "EMPTY_DATASET";

/**
 * Classifies a Supabase/PostgREST failure. Never swallows and never converts a
 * failure into an empty result — it only labels an error the caller is about
 * to rethrow.
 */
export function classifyDataFailure(error: unknown): DataFailureKind {
  // Reconnu par son type, pas par sa prose : le message peut changer, la
  // classification non.
  if (error instanceof EnvConfigurationError) return "CONFIGURATION_ERROR";

  const { message, pgCode } = describeError(error) as { message: string; pgCode?: string };

  if (pgCode === "42P01") return "SCHEMA_MISSING";
  if (pgCode === "42501") return "PERMISSION_DENIED";
  if (/Missing (?:NEXT_PUBLIC_)?SUPABASE_(?:URL|ANON_KEY|PUBLISHABLE_KEY|SERVICE_ROLE_KEY)/.test(message)) {
    return "CONFIGURATION_ERROR";
  }
  if (message === UNREACHABLE_HOST_MESSAGE || /fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|not in allowlist/i.test(message)) {
    return "DATABASE_CONNECTION_ERROR";
  }
  return "DATABASE_QUERY_ERROR";
}

/** `describeError` plus its failure class, for logging at a throw site. */
export function describeDataFailure(error: unknown): Record<string, unknown> {
  return { kind: classifyDataFailure(error), ...describeError(error) };
}

/** Human-readable cause for the known failure modes behind a blank page. */
export function explainDataError(error: unknown): string {
  const { message, pgCode } = describeError(error) as { message: string; pgCode?: string };

  if (pgCode === "42P01") {
    return "Table absente : les migrations n'ont pas été appliquées à cette base.";
  }
  if (pgCode === "42501") {
    return "Lecture refusée par RLS : la policy de lecture publique est absente ou incorrecte.";
  }
  if (/Missing (?:NEXT_PUBLIC_)?SUPABASE_(?:URL|ANON_KEY|PUBLISHABLE_KEY)/.test(message)) {
    return "Variables d'environnement Supabase absentes dans cet environnement de déploiement.";
  }
  if (message === UNREACHABLE_HOST_MESSAGE) {
    return "Base injoignable : vérifiez SUPABASE_URL, l'état du projet Supabase et le réseau sortant.";
  }
  return message;
}

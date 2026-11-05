import "server-only";
import { cookies } from "next/headers";
import { assertConfigured, EnvConfigurationError } from "@/lib/env/read";
import { log } from "@/infra/observability/log";
import { createSupabaseAdminClient } from "@/infra/supabase/admin";
import { signSessionToken, verifySessionToken } from "./token";

export const ANON_SESSION_COOKIE = "csa";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

/**
 * Resolves the caller's anonymous session id from the signed cookie,
 * creating a new session (and setting the cookie) if none exists or the
 * existing one fails signature verification. Only callable from a Route
 * Handler / Server Action (cookies() is write-capable there).
 *
 * Returns null if called somewhere that only has read-only cookie access
 * (a plain Server Component render) and no valid cookie is present —
 * callers needing a guaranteed session must run this from a Route
 * Handler.
 */
export async function getOrCreateAnonymousSessionId(): Promise<string> {
  // Avant toute écriture. Sans le secret, la signature du cookie échouera de
  // toute façon à la fin de cette fonction — mais après l'insertion, laissant
  // une ligne `anonymous_sessions` orpheline par tentative. Échouer ici rend
  // l'opération sans effet de bord.
  assertConfigured("ANON_SESSION_SECRET");

  const cookieStore = await cookies();
  const existingToken = cookieStore.get(ANON_SESSION_COOKIE)?.value;
  const existingId = verifySessionToken(existingToken);

  const admin = createSupabaseAdminClient();

  if (existingId) {
    // Confirm the session still exists server-side (it could have been
    // deleted) before trusting it, and bump last_seen_at.
    const { data } = await admin
      .from("anonymous_sessions")
      .update({ last_seen_at: new Date().toISOString() } as never)
      .eq("id", existingId)
      .select("id")
      .returns<{ id: string }[]>();

    if (data && data.length > 0) {
      return existingId;
    }
    // Falls through to create a new session if the cookie referenced a
    // session that no longer exists.
  }

  const { data: created, error } = await admin
    .from("anonymous_sessions")
    .insert({} as never)
    .select("id")
    .returns<{ id: string }[]>();

  if (error || !created?.[0]) {
    throw new Error("Could not create anonymous session");
  }

  const newId = created[0].id;
  cookieStore.set(ANON_SESSION_COOKIE, signSessionToken(newId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });

  return newId;
}

/**
 * Read-only variant for routes that must not create a session as a side
 * effect of merely checking state (e.g. GET /api/quota called before
 * the visitor has done anything) — returns null rather than minting a
 * new session record for every idle page view.
 */
export async function getAnonymousSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ANON_SESSION_COOKIE)?.value;

  try {
    return verifySessionToken(token);
  } catch (error) {
    // Un secret absent ou refusé rend AUCUN cookie vérifiable, ce qui est
    // exactement le contrat documenté de `verifySessionToken` : un jeton
    // invérifiable vaut « pas encore de session ». Laisser l'exception
    // remonter donnait 500 sur /simulations/[slug] et /api/quota à tout
    // visiteur portant un cookie — une page publique cassée par un défaut de
    // configuration qui, lui, n'a rien à voir avec la lecture.
    //
    // Ce n'est pas masquer la panne : les écritures la refusent bruyamment
    // (`assertConfigured`), `pnpm db:doctor` la nomme, et elle est
    // journalisée ici. Seule la lecture dégrade.
    if (error instanceof EnvConfigurationError) {
      log.error("anon_session.unverifiable", {
        kind: "CONFIGURATION_ERROR",
        variable: error.variable,
        message: error.message,
      });
      return null;
    }
    throw error;
  }
}

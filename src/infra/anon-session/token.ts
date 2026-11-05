import { createHmac, timingSafeEqual } from "node:crypto";
import { requireEnv } from "@/lib/env/read";

/**
 * Signs/verifies the anonymous session cookie value (docs/NO_LOGIN_ARCHITECTURE.md
 * §2). Deliberately a plain HMAC over the session id rather than a JWT —
 * there's exactly one claim (the id) and no need for JWT's header/alg
 * negotiation surface.
 *
 * No `import "server-only"` here even though this never runs in the
 * browser in practice: it's pure crypto with no cookies()/DB access, and
 * keeping it free of that guard is what makes it unit-testable directly
 * (`token.test.ts`) — the guard lives on `session.ts`, which is the
 * module that actually touches server-only APIs.
 */

function getSecret(): string {
  return requireEnv("ANON_SESSION_SECRET");
}

function sign(sessionId: string): string {
  return createHmac("sha256", getSecret()).update(sessionId).digest("base64url");
}

export function signSessionToken(sessionId: string): string {
  return `${sessionId}.${sign(sessionId)}`;
}

/**
 * Returns the session id if the token's signature is valid, otherwise
 * null. Never throws on a malformed/forged token — callers treat null
 * the same as "no session yet" and issue a fresh one.
 */
export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const separatorIndex = token.lastIndexOf(".");
  if (separatorIndex <= 0) return null;

  const sessionId = token.slice(0, separatorIndex);
  const providedSignature = token.slice(separatorIndex + 1);

  // Basic UUID shape check before touching HMAC/DB — rejects garbage cheaply.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
    return null;
  }

  const expectedSignature = sign(sessionId);
  const expected = Buffer.from(expectedSignature);
  const provided = Buffer.from(providedSignature);
  if (expected.length !== provided.length) return null;
  if (!timingSafeEqual(expected, provided)) return null;

  return sessionId;
}

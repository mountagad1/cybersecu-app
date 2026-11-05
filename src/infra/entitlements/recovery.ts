import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { createSupabaseAdminClient } from "@/infra/supabase/admin";
import type { Database } from "@/infra/supabase/database.types";

type RecoveryTokensInsert = Database["public"]["Tables"]["recovery_tokens"]["Insert"];

const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Normalizes before hashing so "Foo@Bar.com " and "foo@bar.com" match. */
export function hashEmail(email: string): string {
  return sha256Hex(email.trim().toLowerCase());
}

/**
 * Generates a fresh recovery token for an entitlement and stores only
 * its hash (docs/PAYMENT_ENTITLEMENT.md §4) — the raw token exists only
 * in memory here and in the email that gets sent, never at rest.
 */
export async function issueRecoveryToken(entitlementId: string, email: string): Promise<string> {
  const rawToken = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  const payload: RecoveryTokensInsert = {
    entitlement_id: entitlementId,
    email_hash: hashEmail(email),
    token_hash: sha256Hex(rawToken),
    expires_at: expiresAt,
  };

  const admin = createSupabaseAdminClient();
  await admin.from("recovery_tokens").insert(payload as never);

  return rawToken;
}

export interface VerifiedRecovery {
  entitlementId: string;
  recoveryTokenId: string;
}

/**
 * Verifies a submitted raw token: unused, unexpired, and matches a
 * stored hash exactly (constant-time comparison). Does not mark it used
 * — call `markRecoveryTokenUsed` after successfully applying the
 * restoration, so a failure partway through doesn't burn the token.
 */
export async function verifyRecoveryToken(rawToken: string): Promise<VerifiedRecovery | null> {
  const tokenHash = sha256Hex(rawToken);
  const admin = createSupabaseAdminClient();

  const { data } = await admin
    .from("recovery_tokens")
    .select("id, entitlement_id, token_hash, expires_at, used_at")
    .eq("token_hash", tokenHash)
    .maybeSingle()
    .returns<{ id: string; entitlement_id: string; token_hash: string; expires_at: string; used_at: string | null } | null>();

  if (!data) return null;
  if (data.used_at) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  // Belt-and-suspenders constant-time re-check even though the lookup
  // above already matched on the hash — guards against a future refactor
  // that loosens the query to a prefix/LIKE match.
  const expected = Buffer.from(tokenHash);
  const stored = Buffer.from(data.token_hash);
  if (expected.length !== stored.length || !timingSafeEqual(expected, stored)) return null;

  return { entitlementId: data.entitlement_id, recoveryTokenId: data.id };
}

export async function markRecoveryTokenUsed(recoveryTokenId: string): Promise<void> {
  const admin = createSupabaseAdminClient();
  await admin
    .from("recovery_tokens")
    .update({ used_at: new Date().toISOString() } as never)
    .eq("id", recoveryTokenId);
}

/**
 * Looks up an active entitlement by hashed email, without leaking existence
 * via timing.
 *
 * Deliberately NOT `.maybeSingle()`: nothing stops one address from holding
 * two active entitlements (the same person buying again on a second device —
 * `entitlements` is unique on `stripe_checkout_session_id`, not on
 * `email_hash`). PostgREST answers a multi-row `.maybeSingle()` with an error
 * and no data, so that spelling turned a paying customer's second purchase
 * into a silent "no match" on the restoration form. Taking the most recent
 * one restores the access they most recently paid for.
 */
export async function findActiveEntitlementByEmail(email: string): Promise<string | null> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("entitlements")
    .select("id")
    .eq("email_hash", hashEmail(email))
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .returns<{ id: string }[]>();
  return data?.[0]?.id ?? null;
}

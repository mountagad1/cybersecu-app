import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { markRecoveryTokenUsed, verifyRecoveryToken } from "@/infra/entitlements/recovery";
import { signSessionToken } from "@/infra/anon-session/token";
import { ANON_SESSION_COOKIE } from "@/infra/anon-session/session";
import { createSupabaseAdminClient } from "@/infra/supabase/admin";
import type { Database } from "@/infra/supabase/database.types";

type LicenseEventsInsert = Database["public"]["Tables"]["license_events"]["Insert"];

const verifySchema = z.object({ token: z.string().min(1) });
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * Applies a valid, unused, unexpired recovery token by re-pointing the
 * caller's browser at the anonymous session that owns the entitlement
 * (docs/PAYMENT_ENTITLEMENT.md §4). Single-use: the token is marked
 * used only after successfully applying the restoration.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const verified = await verifyRecoveryToken(parsed.data.token);
  if (!verified) {
    return NextResponse.json({ error: "invalid_or_expired_token" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: entitlement } = await admin
    .from("entitlements")
    .select("id, anonymous_session_id, user_id")
    .eq("id", verified.entitlementId)
    .maybeSingle()
    .returns<{ id: string; anonymous_session_id: string | null; user_id: string | null } | null>();

  if (!entitlement) {
    return NextResponse.json({ error: "invalid_or_expired_token" }, { status: 400 });
  }

  if (entitlement.user_id) {
    // v1 limitation (docs/PAYMENT_ENTITLEMENT.md §4): a purchase made
    // while signed in restores by signing back into that account, not
    // via this anonymous-session mechanism.
    return NextResponse.json({ error: "sign_in_required" }, { status: 409 });
  }

  // The `entitlements_owner_xor` constraint guarantees one owner is set and
  // the branch above already handled `user_id`, so this is unreachable in a
  // consistent database. Checked rather than asserted because the failure it
  // guards against is silent: signing a `null` id would mint a cookie that
  // verifies against nothing, restoring the visitor into a session that does
  // not exist and reporting success while doing it.
  const anonymousSessionId = entitlement.anonymous_session_id;
  if (!anonymousSessionId) {
    return NextResponse.json({ error: "invalid_or_expired_token" }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ANON_SESSION_COOKIE, signSessionToken(anonymousSessionId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });

  await markRecoveryTokenUsed(verified.recoveryTokenId);

  const eventPayload: LicenseEventsInsert = {
    entitlement_id: entitlement.id,
    event_type: "restored",
    metadata: {},
  };
  await admin.from("license_events").insert(eventPayload as never);

  return NextResponse.json({ ok: true });
}

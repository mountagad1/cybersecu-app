import { NextResponse } from "next/server";
import { z } from "zod";
import { findActiveEntitlementByEmail, issueRecoveryToken } from "@/infra/entitlements/recovery";
import { sendRecoveryEmail } from "@/infra/email/send";
import { SITE_URL } from "@/lib/site";

const requestSchema = z.object({ email: z.string().email() });

/**
 * Always returns the same response whether or not the email matches an
 * entitlement — no account-enumeration signal
 * (docs/PAYMENT_ENTITLEMENT.md §4). Rate limiting per IP/email is a
 * documented follow-up (docs/SIMULATION_QUOTA.md §5 discusses the same
 * tradeoff for quota abuse) — not built this pass since it needs
 * infrastructure (e.g. Upstash) not yet provisioned.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const entitlementId = await findActiveEntitlementByEmail(parsed.data.email);
  if (entitlementId) {
    const rawToken = await issueRecoveryToken(entitlementId, parsed.data.email);
    const restoreUrl = `${SITE_URL}/restaurer?token=${rawToken}`;
    try {
      await sendRecoveryEmail(parsed.data.email, restoreUrl);
    } catch (err) {
      // Never leak the send failure (or the fact that a match was found)
      // to the client — log server-side for operator visibility only.
      console.error("[restore-request] failed to send recovery email", err);
    }
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}

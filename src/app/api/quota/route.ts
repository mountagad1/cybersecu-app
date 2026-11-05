import { NextResponse } from "next/server";
import { getCurrentQuotaState } from "@/infra/entitlements/currentQuota";

/**
 * Read-only quota/entitlement check for the current caller. Never
 * creates an anonymous session as a side effect (docs/SIMULATION_QUOTA.md
 * §3) — a visitor who hasn't played anything yet just gets the default
 * full quota back.
 */
export async function GET() {
  // Depends on the caller's cookie: no shared cache may keep it
  // (docs/architecture/CACHING_STRATEGY.md).
  return NextResponse.json(await getCurrentQuotaState(), { headers: { "Cache-Control": "private, no-store" } });
}

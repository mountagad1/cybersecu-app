import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env";

/**
 * Service-role client. Bypasses RLS entirely — see docs/SECURITY_MODEL.md
 * §2 and docs/ARCHITECTURE.md §5. Import only from `admin/` route
 * handlers and server-only grading logic (e.g. writing attempt_decisions
 * after validating the request), and only after an explicit role check.
 * The `server-only` import makes accidentally bundling this into client
 * code a build-time error rather than a runtime secret leak.
 */
export function createSupabaseAdminClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

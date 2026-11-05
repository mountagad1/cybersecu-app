import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";
import { describeError, log } from "@/infra/observability/log";

/**
 * Request-scoped Supabase client for Server Components and Route
 * Handlers. Uses the anon key — RLS applies. This is the client every
 * public/authenticated read should use; never reach for the service-role
 * client (admin.ts) unless the operation genuinely needs to bypass RLS.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  // Read config inside a guard, not inline in the call below.
  //
  // `getSupabaseUrl()` throws when the env var is absent, and that throw
  // happens BEFORE any query — so repository-level logging never ran and
  // production showed only Next.js's opaque error digest. This is the
  // earliest point where the real cause can be recorded
  // (docs/BLANK_PAGES_ROOT_CAUSE.md).
  let url: string;
  let anonKey: string;
  try {
    url = getSupabaseUrl();
    anonKey = getSupabaseAnonKey();
  } catch (error) {
    log.error("supabase.config_missing", {
      ...describeError(error),
      hint:
        "Définissez SUPABASE_URL et SUPABASE_PUBLISHABLE_KEY (ou SUPABASE_ANON_KEY) " +
        "pour CET environnement de déploiement, puis redéployez : Vercel fige les variables " +
        "au moment du build. `pnpm db:doctor` dit ce que voit l'environnement où il tourne.",
    });
    throw error;
  }

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component: cookies are read-only there.
          // Middleware is responsible for refreshing the session cookie.
        }
      },
    },
  });
}

/**
 * Cookie-free client for PUBLIC content reads. Same project, same
 * publishable/anon key, so RLS applies exactly as it does above — the only
 * difference is that this one never touches `cookies()`.
 *
 * WHY IT HAS TO EXIST
 * `createSupabaseServerClient()` reads cookies to resolve a Supabase Auth
 * session. Calling it from a route Next renders *statically* is illegal:
 * `/attaques/[slug]` declares `generateStaticParams` + `revalidate`, so Next
 * renders it in a static context, and the `cookies()` call inside the data
 * layer threw `DYNAMIC_SERVER_USAGE` — every attack page and every category
 * hub returned 500. Measured, not inferred: with this client they return 200.
 *
 * The public encyclopedia has no signed-in concept — no page under `/attaques`
 * or the `/simulations` index varies by viewer — so the cookie read was buying
 * nothing and costing the entire SEO surface. It also silently opted the index
 * pages out of the `revalidate = 3600` they declare, since `cookies()` forces
 * dynamic rendering.
 *
 * Config comes from the same `env.ts` accessors, so there is one canonical
 * source of Supabase configuration, not two.
 */
export function createSupabasePublicClient() {
  let url: string;
  let anonKey: string;
  try {
    url = getSupabaseUrl();
    anonKey = getSupabaseAnonKey();
  } catch (error) {
    log.error("supabase.config_missing", {
      ...describeError(error),
      scope: "public-read",
      hint:
        "Définissez SUPABASE_URL et SUPABASE_PUBLISHABLE_KEY (ou SUPABASE_ANON_KEY) " +
        "pour CET environnement de déploiement, puis redéployez.",
    });
    throw error;
  }

  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

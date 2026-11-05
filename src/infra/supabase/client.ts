"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Browser Supabase client for Client Components (auth forms, the
 * simulation player's optimistic UI). Uses the anon key — RLS applies.
 *
 * The URL and anon key must be passed in by the caller. They live in
 * unprefixed env vars (`SUPABASE_URL`, `SUPABASE_ANON_KEY`), which Next.js
 * does not inline into the client bundle, so `process.env` is empty for them
 * here: a Server Component has to read them and hand them down as props.
 * Nothing calls this today; if you wire up a Client Component, thread the
 * values through rather than re-adding a `NEXT_PUBLIC_` alias.
 */
export function createSupabaseBrowserClient(url: string, anonKey: string) {
  if (!url || !anonKey) {
    throw new Error(
      "createSupabaseBrowserClient requires the URL and anon key as arguments: " +
        "SUPABASE_URL / SUPABASE_ANON_KEY are server-only and are not available in the browser.",
    );
  }
  return createBrowserClient<Database>(url, anonKey);
}

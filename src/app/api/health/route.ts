import { NextResponse } from "next/server";
import { listAttacks } from "@/content/attacks";
import { listSimulations } from "@/content/simulations";
import { createSupabaseServerClient } from "@/infra/supabase/server";
import { describeError, explainDataError } from "@/infra/observability/log";

export const dynamic = "force-dynamic";

/**
 * Machine-readable state of the deployment, so "the site looks broken"
 * can be answered from outside without guessing
 * (docs/BLANK_PAGES_ROOT_CAUSE.md §6).
 *
 * The two halves are reported separately on purpose, because they now
 * fail independently: `content` comes from the repository and is fine as
 * long as the build succeeded, while `database` only affects playing a
 * simulation. Reporting one number for both is what made the original
 * incident so hard to diagnose.
 *
 * Never returns a key, a URL or any visitor data — only presence,
 * counts, and a plain-language cause.
 */
export async function GET() {
  const content = {
    ok: true,
    attacks: listAttacks().length,
    simulations: listSimulations().length,
    source: "repository" as const,
  };

  let database: { ok: boolean; detail: string };
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("anonymous_sessions")
      .select("*", { count: "exact", head: true });

    // 42501 means RLS refused the read — the table exists and the
    // connection works, which is all this check needs to establish.
    const code = (error as { code?: string } | null)?.code;
    if (error && code !== "42501") {
      database = { ok: false, detail: explainDataError(error) };
    } else {
      database = { ok: true, detail: "joignable" };
    }
  } catch (error) {
    database = { ok: false, detail: explainDataError(error) };
    console.error(JSON.stringify({ level: "error", event: "health.database_unreachable", ...describeError(error) }));
  }

  return NextResponse.json(
    {
      content,
      database,
      // Content pages render regardless of the database, so the overall
      // status follows the content. A database fault is reported, not
      // hidden, but it does not make the site "down".
      status: content.ok ? (database.ok ? "ok" : "degraded") : "down",
    },
    { status: content.ok ? 200 : 503 },
  );
}

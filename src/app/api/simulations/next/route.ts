import { NextResponse } from "next/server";
import { getAnonymousSessionId } from "@/infra/anon-session/session";
import { suggestNextScenario } from "@/infra/scenarios/nextScenario";
import { createSupabaseServerClient } from "@/infra/supabase/server";
import type { Locale } from "@/domain/i18n/locale";

/**
 * Closes the learning loop: "adaptive next scenario"
 * (docs/LEARNING_ENGINE.md §1). Called by the player once an answer has been
 * graded, so the caller's just-recorded attempt is already part of the history
 * the selection weighs.
 *
 * Read-only, and deliberately uses the read-only session accessor: asking what
 * to play next must never mint an anonymous session as a side effect
 * (docs/SIMULATION_QUOTA.md §3). A visitor with no session simply has no
 * history, which the selector handles as its neutral starting state.
 *
 * `exclude` is a scenario_version id, not a slug: it is what the player
 * already holds, and it is the unit selection actually reasons about.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const exclude = url.searchParams.get("exclude") ?? undefined;
  const locale: Locale = url.searchParams.get("locale") === "en" ? "en" : "fr";

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const identity = user
    ? { anonymousSessionId: null, userId: user.id }
    : { anonymousSessionId: await getAnonymousSessionId(), userId: null };

  const next = await suggestNextScenario(identity, exclude, locale);

  // A null suggestion is a normal outcome — the visitor has reached the end of
  // the published catalogue — so it is a 200 with `next: null`, not a 404.
  // Depends on the caller's history: no shared cache may keep it.
  return NextResponse.json({ next }, { headers: { "Cache-Control": "private, no-store" } });
}

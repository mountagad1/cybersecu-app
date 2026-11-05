/**
 * The boundary the rest of the app depends on for voice simulations.
 * `DograhVoiceProvider` (src/infra/voice/dograh) is the only
 * implementation today; nothing outside `src/infra/voice/dograh` may
 * import Dograh-specific types or call its API directly
 * (docs/decisions/0008 §5 — ARCHITECTURAL_BOUNDARY).
 *
 * Shaped after what Dograh's real API actually returns (verified against
 * dograh-hq/dograh, not invented): an embed session is a token plus a
 * widget script origin, not a symmetrical "create/start/end session"
 * triple — the browser widget owns the call lifecycle once it has the
 * token; the server's remaining job is to hand out that token and, later,
 * fetch the finished run.
 */

export interface VoiceEmbedSession {
  /** Passed to the client; safe to expose — it's domain-whitelisted and scoped to one workflow. */
  embedToken: string;
  /** Origin the client loads `dograh-widget.js` from. */
  widgetOrigin: string;
}

export type VoiceRunStatus = "pending" | "in_progress" | "completed" | "failed";

export interface VoiceRunRecord {
  runId: string;
  status: VoiceRunStatus;
  durationSeconds: number | null;
  gatheredContext: Record<string, unknown>;
  recordingUrl: string | null;
  transcriptUrl: string | null;
  costUsdCents: number | null;
}

export interface VoiceSimulationProvider {
  /**
   * Resolves a scenario slug to a ready-to-embed session, or `null` if
   * the scenario has no `dograhEmbedToken` yet. This never calls out to
   * Dograh — the token was minted once, at setup time, by the sync
   * script (docs/DOGRAH_INTEGRATION.md §4) — so a visitor loading the
   * page never waits on, or fails because of, Dograh's availability.
   */
  getEmbedSession(scenarioSlug: string): Promise<VoiceEmbedSession | null>;

  /**
   * Fetches a finished (or in-progress) run for evaluation and display.
   * This DOES call Dograh's API and needs `DOGRAH_API_KEY`
   * (`EnvConfigurationError` is caught here, not thrown to the caller —
   * the route layer decides what a `null` means for the page).
   */
  getRun(workflowId: number, runId: string): Promise<VoiceRunRecord | null>;
}

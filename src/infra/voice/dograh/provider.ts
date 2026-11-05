import "server-only";
import { dograhFetch, getDograhBaseUrl } from "@/infra/voice/dograh/client";
import { listVoiceSimulations } from "@/content/voice-simulations";
import type { VoiceEmbedSession, VoiceRunRecord, VoiceSimulationProvider } from "@/domain/voice/provider";

/**
 * The only piece of the codebase allowed to know Dograh's response shapes
 * (docs/decisions/0008 §5). Field names below are taken from
 * `GET /workflow/{id}/runs/{run_id}` in dograh-hq/dograh's OpenAPI spec —
 * verified, not guessed.
 */

interface DograhRunResponse {
  id: number;
  status: "pending" | "in_progress" | "completed" | "failed";
  gathered_context: Record<string, unknown> | null;
  recording_url: string | null;
  transcript_url: string | null;
  cost_info?: { call_duration_seconds?: number; total_cost_cents?: number };
}

export const dograhVoiceProvider: VoiceSimulationProvider = {
  async getEmbedSession(scenarioSlug: string): Promise<VoiceEmbedSession | null> {
    const scenario = listVoiceSimulations().find((s) => s.slug === scenarioSlug);
    if (!scenario?.dograhEmbedToken) return null;

    return { embedToken: scenario.dograhEmbedToken, widgetOrigin: getDograhBaseUrl() };
  },

  async getRun(workflowId: number, runId: string): Promise<VoiceRunRecord | null> {
    try {
      const run = await dograhFetch<DograhRunResponse>(`/workflow/${workflowId}/runs/${runId}`);
      return {
        runId: String(run.id),
        status: run.status,
        durationSeconds: run.cost_info?.call_duration_seconds ?? null,
        gatheredContext: run.gathered_context ?? {},
        recordingUrl: run.recording_url,
        transcriptUrl: run.transcript_url,
        costUsdCents: run.cost_info?.total_cost_cents ?? null,
      };
    } catch {
      // EnvConfigurationError (not configured) and DograhApiError (the
      // run doesn't exist, or the API is down) collapse to the same
      // `null` here: the caller's job is to show "not available", not to
      // distinguish why (docs/VOICE_SIMULATION_ARCHITECTURE.md §Fallback).
      return null;
    }
  },
};

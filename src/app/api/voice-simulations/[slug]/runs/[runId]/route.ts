import { NextResponse } from "next/server";
import { serviceUnconfiguredResponse } from "@/app/api/_lib/configurationGuard";
import { evaluateVoiceRun } from "@/domain/voice/evaluate";
import { dograhVoiceProvider } from "@/infra/voice/dograh/provider";
import { findVoiceSimulationBySlug } from "@/content/voice-simulations";

/**
 * Fetches a finished call and grades it. The client calls this after
 * `window.DograhWidget.onCallDisconnected` fires with `{ workflowRunId }`
 * (docs/DOGRAH_INTEGRATION.md §Widget lifecycle) — this route is what
 * turns that id into the explanation screen the text simulations already
 * show (`ExplanationPanel`), never the LLM's own `qa` node verdict
 * (docs/decisions/0008 §4).
 */
async function handleGET(_request: Request, { params }: { params: Promise<{ slug: string; runId: string }> }) {
  const { slug, runId } = await params;
  const scenario = findVoiceSimulationBySlug(slug);
  if (!scenario) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (scenario.dograhWorkflowId === null) {
    return NextResponse.json({ error: "voice_not_configured" }, { status: 503 });
  }

  const run = await dograhVoiceProvider.getRun(scenario.dograhWorkflowId, runId);
  if (!run) {
    return NextResponse.json({ error: "run_not_found" }, { status: 404 });
  }

  if (run.status !== "completed") {
    return NextResponse.json({ status: run.status });
  }

  const verdict = evaluateVoiceRun(scenario, run.gatheredContext);
  return NextResponse.json({ status: run.status, durationSeconds: run.durationSeconds, verdict });
}

export async function GET(...args: Parameters<typeof handleGET>) {
  try {
    return await handleGET(...args);
  } catch (error) {
    const response = serviceUnconfiguredResponse(error);
    if (response) return response;
    throw error;
  }
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { ExplanationPanel } from "@/components/scenario/explanation-panel";
import { Paywall } from "@/components/paywall/paywall";

/**
 * Drives Dograh's Headless embed widget (docs/DOGRAH_INTEGRATION.md
 * §Widget lifecycle) from our own UI.
 *
 * The embed token is fetched lazily, on click, from
 * `POST /api/voice-simulations/{slug}/session` — never baked into the
 * static page. Three reasons: quota has to be checked at the moment of
 * the attempt, not at render time (same rule the text player already
 * follows for `/api/attempts`); a token embedded in prerendered HTML
 * would be handed to every crawler regardless of quota; and it means
 * this component renders identically whether or not voice is configured
 * at all — the click is what reveals a 503, not the page load.
 *
 * Text alternative is not optional (brief §24 ACCESSIBILITY): a visitor
 * who never grants microphone access, or prefers not to talk to their
 * computer, gets `textSimulationHref` instead — always rendered, never
 * hidden behind a "no thanks" click.
 */

type CallStatus = "idle" | "connecting" | "connected" | "failed" | "ended";

interface DograhCallConnectedPayload {
  agentId: string;
  workflowRunId: string;
  token: string;
}

declare global {
  interface Window {
    DograhWidget?: {
      start: () => void;
      end: () => void;
      onCallConnected: (cb: (payload: DograhCallConnectedPayload) => void) => void;
      onCallDisconnected: (cb: (payload: DograhCallConnectedPayload & { durationSeconds: number }) => void) => void;
      onStatusChange: (cb: (status: CallStatus) => void) => void;
      onError: (cb: (err: Error) => void) => void;
    };
  }
}

interface VoiceResultVerdict {
  passed: boolean;
  signals: { name: string; safe: boolean }[];
}

type PlayerState =
  | { phase: "idle" }
  | { phase: "requesting_session" }
  | { phase: "quota_exhausted" }
  | { phase: "unconfigured" }
  | { phase: "in_call"; status: CallStatus }
  | { phase: "error"; message: string }
  | { phase: "graded"; verdict: VoiceResultVerdict };

export function VoicePlayer({
  scenarioSlug,
  textSimulationHref,
}: {
  scenarioSlug: string;
  textSimulationHref: string | null;
}) {
  const [state, setState] = useState<PlayerState>({ phase: "idle" });
  const [runId, setRunId] = useState<string | null>(null);
  const scriptLoaded = useRef(false);

  async function beginCall() {
    setState({ phase: "requesting_session" });
    try {
      const res = await fetch(`/api/voice-simulations/${scenarioSlug}/session`, { method: "POST" });
      if (res.status === 403) {
        setState({ phase: "quota_exhausted" });
        return;
      }
      if (res.status === 503) {
        setState({ phase: "unconfigured" });
        return;
      }
      if (!res.ok) {
        setState({ phase: "error", message: "Impossible de démarrer l'appel. Réessayez plus tard." });
        return;
      }
      const { embedToken, widgetOrigin } = await res.json();
      await loadWidgetScript(widgetOrigin, embedToken);
      window.DograhWidget?.start();
    } catch {
      setState({ phase: "error", message: "Impossible de démarrer l'appel. Réessayez plus tard." });
    }
  }

  function loadWidgetScript(widgetOrigin: string, embedToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (scriptLoaded.current && window.DograhWidget) {
        resolve();
        return;
      }
      scriptLoaded.current = true;

      const script = document.createElement("script");
      script.src = `${widgetOrigin}/dograh-widget.js?token=${encodeURIComponent(embedToken)}`;
      script.async = true;
      script.onload = () => {
        if (!window.DograhWidget) {
          reject(new Error("widget failed to expose window.DograhWidget"));
          return;
        }
        window.DograhWidget.onStatusChange((status) => setState({ phase: "in_call", status }));
        window.DograhWidget.onError((err) => setState({ phase: "error", message: err.message }));
        window.DograhWidget.onCallDisconnected(({ workflowRunId }) => setRunId(workflowRunId));
        resolve();
      };
      script.onerror = () => reject(new Error("could not load the voice widget"));
      document.body.appendChild(script);
    });
  }

  useEffect(() => {
    if (!runId) return;
    let cancelled = false;

    async function fetchResult() {
      try {
        const res = await fetch(`/api/voice-simulations/${scenarioSlug}/runs/${runId}`);
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (data.verdict && !cancelled) setState({ phase: "graded", verdict: data.verdict });
      } catch {
        // The call already happened; a failed evaluation fetch just means
        // no verdict renders. The text-simulation link below still works.
      }
    }
    void fetchResult();
    return () => {
      cancelled = true;
    };
  }, [runId, scenarioSlug]);

  if (state.phase === "quota_exhausted") return <Paywall />;

  const isLive = state.phase === "in_call" && (state.status === "connecting" || state.status === "connected");
  const buttonLabel =
    state.phase === "requesting_session"
      ? "Préparation…"
      : state.phase === "in_call" && state.status === "connected"
        ? "Raccrocher"
        : state.phase === "in_call" && state.status === "connecting"
          ? "Connexion…"
          : "Décrocher";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        🎙️ Simulation pédagogique — appel synthétique, aucune donnée réelle n&apos;est collectée
      </p>

      <Button
        size="lg"
        disabled={state.phase === "requesting_session"}
        onClick={() => (isLive ? window.DograhWidget?.end() : void beginCall())}
      >
        {buttonLabel}
      </Button>

      {state.phase === "unconfigured" && (
        <Alert tone="info">
          Cette simulation vocale n&apos;est pas encore disponible.
          {textSimulationHref ? " Essayez la version texte ci-dessous." : ""}
        </Alert>
      )}

      {state.phase === "error" && <Alert tone="warning">{state.message}</Alert>}

      {state.phase === "graded" && <ExplanationPanel correct={state.verdict.passed} explanation={null} />}

      {textSimulationHref && (
        <p className="text-sm text-muted-foreground">
          Vous préférez ne pas utiliser le micro ?{" "}
          <Link href={textSimulationHref} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Essayer la version texte
          </Link>
        </p>
      )}
    </div>
  );
}

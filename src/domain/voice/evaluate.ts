import type { VoiceScenarioDefinition, VoiceSignalDefinition } from "@/domain/voice/types";

/**
 * Grades a finished call deterministically from the signals Dograh
 * extracted (`gathered_context` in its run record), never from an LLM's
 * free-text verdict (docs/decisions/0008 §4). The LLM's only job upstream
 * was to notice, per `VoiceSignalDefinition.prompt`, whether something
 * happened during the call — not to decide whether that was safe. This
 * function makes that decision, the same way `src/domain/mistakes` grades
 * a text answer against `correctChoiceIds`.
 */

export interface VoiceSignalResult {
  name: string;
  observed: boolean | string | number | undefined;
  safe: boolean;
  mistakePattern: VoiceSignalDefinition["mistakePattern"];
}

export interface VoiceEvaluationVerdict {
  /** `true` only if every signal came back at its safe value. */
  passed: boolean;
  signals: VoiceSignalResult[];
  /** Signals whose definition exists but never appeared in the run's context. */
  missing: string[];
}

/**
 * `gatheredContext` is Dograh's run field of the same name: whatever
 * values its `extraction_variables` produced, keyed by signal name. It is
 * untyped JSON coming from a third party, so every read here is defensive
 * — a missing or mistyped signal fails safe (`safe: false`) rather than
 * silently passing a call nothing actually evaluated.
 */
export function evaluateVoiceRun(
  definition: VoiceScenarioDefinition,
  gatheredContext: Record<string, unknown>,
): VoiceEvaluationVerdict {
  const missing: string[] = [];
  const signals: VoiceSignalResult[] = definition.signals.map((signal) => {
    const raw = gatheredContext[signal.name];
    const observed = coerce(raw, signal.type);

    if (observed === undefined) {
      missing.push(signal.name);
      return { name: signal.name, observed: undefined, safe: false, mistakePattern: signal.mistakePattern };
    }

    return {
      name: signal.name,
      observed,
      safe: observed === signal.safeValue,
      mistakePattern: signal.mistakePattern,
    };
  });

  return {
    passed: signals.length > 0 && signals.every((s) => s.safe),
    signals,
    missing,
  };
}

function coerce(value: unknown, type: VoiceSignalDefinition["type"]): boolean | string | number | undefined {
  if (value === undefined || value === null) return undefined;
  if (type === "boolean") return typeof value === "boolean" ? value : undefined;
  if (type === "number") return typeof value === "number" ? value : undefined;
  return typeof value === "string" ? value : undefined;
}

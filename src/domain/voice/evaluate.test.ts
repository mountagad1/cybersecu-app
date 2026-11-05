import { describe, expect, it } from "vitest";
import { evaluateVoiceRun } from "./evaluate";
import type { VoiceScenarioDefinition } from "./types";

const BASE: VoiceScenarioDefinition = {
  slug: "test-scenario",
  attackCode: "SOCIAL-000001",
  name: "Test",
  targetProfile: "general",
  impersonatedEntity: "Banque fictive",
  triggers: ["urgency"],
  attackerObjective: "identifiants",
  teaser: "t",
  stages: [],
  signals: [
    { name: "revealed_otp", type: "boolean", prompt: "p", mistakePattern: "SHARED_MFA_CODE", safeValue: false },
    {
      name: "verified_independently",
      type: "boolean",
      prompt: "p",
      mistakePattern: "FAILED_TO_VERIFY_INDEPENDENTLY",
      safeValue: true,
    },
  ],
  dograhWorkflowId: null,
  dograhEmbedToken: null,
};

describe("evaluateVoiceRun", () => {
  it("passes when every signal matches its safe value", () => {
    const verdict = evaluateVoiceRun(BASE, { revealed_otp: false, verified_independently: true });
    expect(verdict.passed).toBe(true);
    expect(verdict.missing).toEqual([]);
  });

  it("fails when a signal deviates from its safe value", () => {
    const verdict = evaluateVoiceRun(BASE, { revealed_otp: true, verified_independently: true });
    expect(verdict.passed).toBe(false);
    const otp = verdict.signals.find((s) => s.name === "revealed_otp");
    expect(otp?.safe).toBe(false);
    expect(otp?.mistakePattern).toBe("SHARED_MFA_CODE");
  });

  it("fails safe when a signal never appears in gathered context, rather than passing silently", () => {
    const verdict = evaluateVoiceRun(BASE, { revealed_otp: false });
    expect(verdict.passed).toBe(false);
    expect(verdict.missing).toEqual(["verified_independently"]);
    const missing = verdict.signals.find((s) => s.name === "verified_independently");
    expect(missing?.safe).toBe(false);
    expect(missing?.observed).toBeUndefined();
  });

  it("fails safe on a type mismatch rather than trusting an untyped third-party payload", () => {
    // Dograh's gathered_context is untyped JSON; a string where a boolean
    // is expected must not silently coerce to a truthy pass.
    const verdict = evaluateVoiceRun(BASE, { revealed_otp: "false", verified_independently: true });
    const otp = verdict.signals.find((s) => s.name === "revealed_otp");
    expect(otp?.observed).toBeUndefined();
    expect(otp?.safe).toBe(false);
  });

  it("does not pass a scenario declaring no signals at all", () => {
    const verdict = evaluateVoiceRun({ ...BASE, signals: [] }, {});
    expect(verdict.passed).toBe(false);
  });
});

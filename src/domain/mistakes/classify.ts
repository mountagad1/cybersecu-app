import type {
  GradedScenario,
  MistakePatternCode,
  ScenarioExplanation,
} from "@/domain/scenario/types";

export interface AttemptResult {
  choiceId: string;
  correct: boolean;
  mistakePatternCodes: MistakePatternCode[];
  explanation: ScenarioExplanation | null;
}

/**
 * Grades a submitted choice against the server-held scenario version.
 * Never trusts a client-claimed answer or correctness (docs/SECURITY_MODEL.md §3).
 */
export function gradeAttempt(
  scenario: GradedScenario,
  submittedChoiceId: string,
): AttemptResult {
  const choice = scenario.choices.find((c) => c.id === submittedChoiceId);
  if (!choice) {
    throw new Error(
      `Invalid choice "${submittedChoiceId}" for scenario ${scenario.scenarioCode} v${scenario.version}`,
    );
  }

  const correct = scenario.correctChoiceIds.includes(submittedChoiceId);

  return {
    choiceId: submittedChoiceId,
    correct,
    mistakePatternCodes: correct ? [] : (choice.mistakePatternCodes ?? []),
    explanation: scenario.explanations[submittedChoiceId] ?? null,
  };
}

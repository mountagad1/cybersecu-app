import { describe, expect, it } from "vitest";
import { gradeAttempt } from "./classify";
import type { GradedScenario } from "@/domain/scenario/types";

const scenario: GradedScenario = {
  scenarioVersionId: "00000000-0000-0000-0000-000000000001",
  scenarioCode: "SCENARIO-000001",
  version: 1,
  attackCode: "SMS-000001",
  channel: "sms",
  targetProfile: "general",
  difficulty: 2,
  impersonatedEntity: "Banque Fictive",
  content: { sender: "Banque Fictive", body: "Votre carte a été bloquée.", ui: "sms" },
  choices: [
    { id: "click", label: "Je clique sur le lien" },
    {
      id: "verify",
      label: "Je vérifie directement auprès de ma banque",
      isRecommended: true,
    },
    { id: "unsure", label: "Je ne sais pas", isUnsure: true },
  ],
  correctChoiceIds: ["verify"],
  explanations: {
    click: {
      technique: "Urgence artificielle",
      indicator: "Lien raccourci suspect",
      whyDangerous: "Le lien mène à un faux site qui vole vos identifiants.",
      reflex: "Ne cliquez jamais sur un lien reçu par SMS non sollicité.",
    },
    verify: {
      technique: "Urgence artificielle",
      indicator: "Demande d'action immédiate",
      whyDangerous: "N/A — bonne réponse.",
      reflex: "Continuez à vérifier indépendamment.",
    },
    unsure: {
      technique: "Urgence artificielle",
      indicator: "Demande d'action immédiate",
      whyDangerous: "Ne pas savoir est normal — voici comment réagir la prochaine fois.",
      reflex: "Prenez le temps de vérifier avant d'agir.",
    },
  },
};

describe("gradeAttempt", () => {
  it("throws on a choice id that does not belong to the scenario version", () => {
    expect(() => gradeAttempt(scenario, "does-not-exist")).toThrow();
  });

  it("marks the correct choice as correct with no mistake patterns", () => {
    const result = gradeAttempt(scenario, "verify");
    expect(result.correct).toBe(true);
    expect(result.mistakePatternCodes).toEqual([]);
    expect(result.explanation?.technique).toBe("Urgence artificielle");
  });

  it("marks a wrong choice as incorrect and surfaces its mistake patterns", () => {
    const scenarioWithMistakes: GradedScenario = {
      ...scenario,
      choices: scenario.choices.map((c) =>
        c.id === "click"
          ? { ...c, mistakePatternCodes: ["RESPONDED_TO_URGENCY", "CLICKED_UNKNOWN_LINK"] }
          : c,
      ),
    };
    const result = gradeAttempt(scenarioWithMistakes, "click");
    expect(result.correct).toBe(false);
    expect(result.mistakePatternCodes).toEqual(["RESPONDED_TO_URGENCY", "CLICKED_UNKNOWN_LINK"]);
  });

  it("never marks 'je ne sais pas' as correct", () => {
    const result = gradeAttempt(scenario, "unsure");
    expect(result.correct).toBe(false);
  });
});

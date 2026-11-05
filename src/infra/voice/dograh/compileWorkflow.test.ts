import { describe, expect, it } from "vitest";
import { compileWorkflow, validateCompiledWorkflow } from "./compileWorkflow";
import type { VoiceScenarioDefinition } from "@/domain/voice/types";

function scenario(overrides: Partial<VoiceScenarioDefinition> = {}): VoiceScenarioDefinition {
  return {
    slug: "test",
    attackCode: "SOCIAL-000001",
    name: "Test",
    targetProfile: "general",
    impersonatedEntity: "Fictif",
    triggers: ["urgency"],
    attackerObjective: "identifiants",
    teaser: "t",
    stages: [
      { id: "a", kind: "greeting", allowInterrupt: true, prompt: "Bonjour", transitions: { b: "toujours" } },
      { id: "b", kind: "conclusion", allowInterrupt: false, prompt: "Au revoir", transitions: {} },
    ],
    signals: [{ name: "s1", type: "boolean", prompt: "p", mistakePattern: null, safeValue: false }],
    dograhWorkflowId: null,
    dograhEmbedToken: null,
    ...overrides,
  };
}

describe("compileWorkflow", () => {
  it("produces exactly one startCall node, from the first stage", () => {
    const compiled = compileWorkflow(scenario());
    const starts = compiled.nodes.filter((n) => n.type === "startCall");
    expect(starts).toHaveLength(1);
    expect(starts[0].id).toBe("a");
  });

  it("appends an endCall node not present in the source stages", () => {
    const compiled = compileWorkflow(scenario());
    expect(compiled.nodes.some((n) => n.type === "endCall")).toBe(true);
  });

  it("attaches every declared signal as an extraction variable on each agent-bearing node", () => {
    const compiled = compileWorkflow(scenario());
    const nonEnd = compiled.nodes.filter((n) => n.type !== "endCall");
    for (const node of nonEnd) {
      expect(node.data.extraction_variables?.map((v) => v.name)).toEqual(["s1"]);
    }
  });

  it("routes a stage with no declared transitions to the end node", () => {
    const compiled = compileWorkflow(scenario());
    const fromB = compiled.edges.filter((e) => e.source === "b");
    expect(fromB).toHaveLength(1);
    expect(fromB[0].target).toBe("end-call");
  });

  it("throws on a scenario with no stages, rather than compiling an empty workflow", () => {
    expect(() => compileWorkflow(scenario({ stages: [] }))).toThrow(/no stages/);
  });
});

describe("validateCompiledWorkflow", () => {
  it("accepts a well-formed compiled workflow", () => {
    expect(validateCompiledWorkflow(compileWorkflow(scenario()))).toEqual([]);
  });

  it("catches an edge pointing at a node id that doesn't exist", () => {
    const compiled = compileWorkflow(scenario());
    compiled.edges.push({ id: "bad", source: "a", target: "ghost", data: { label: "x", condition: "x" } });
    const problems = validateCompiledWorkflow(compiled);
    expect(problems.some((p) => p.includes("ghost"))).toBe(true);
  });

  it("catches more than one startCall node", () => {
    const compiled = compileWorkflow(scenario());
    compiled.nodes[1].type = "startCall";
    const problems = validateCompiledWorkflow(compiled);
    expect(problems.some((p) => p.includes("startCall"))).toBe(true);
  });

  it("catches a duplicate node id", () => {
    const compiled = compileWorkflow(scenario());
    compiled.nodes.push({ ...compiled.nodes[0] });
    const problems = validateCompiledWorkflow(compiled);
    expect(problems.some((p) => p.includes("dupliqué"))).toBe(true);
  });
});

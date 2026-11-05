import type { VoiceScenarioDefinition, VoiceStage } from "@/domain/voice/types";

/**
 * Translates our canonical `VoiceScenarioDefinition` into the
 * `{nodes, edges}` graph Dograh's `POST /workflow/create/definition`
 * accepts (schema verified against
 * dograh-hq/dograh docs/developer/workflow-schema.mdx — node types
 * `startCall`/`agentNode`/`endCall`, `extraction_variables` on
 * `agentNode`, `data.condition` on edges). This is the ONLY place that
 * shape is produced — nothing hand-authors a Dograh workflow definition
 * (docs/decisions/0008 §3).
 *
 * Every non-final stage becomes an `agentNode`; the first stage becomes a
 * `startCall` node (voice widget calls, not telephony triggers, are the
 * only run mode this project uses — docs/decisions/0008 §2); the final
 * stage's outgoing edges all target one `endCall` node. All of a
 * scenario's `signals` are attached as `extraction_variables` on every
 * stage node — Dograh extracts per node, and a signal (e.g. "was an OTP
 * ever read aloud") can become true at any point in the call.
 */

export interface DograhWorkflowDefinition {
  nodes: DograhNode[];
  edges: DograhEdge[];
}

interface DograhNode {
  id: string;
  type: "startCall" | "agentNode" | "endCall";
  position: { x: number; y: number };
  data: {
    name: string;
    prompt: string;
    allow_interrupt: boolean;
    extraction_enabled?: boolean;
    extraction_variables?: { name: string; type: "string" | "number" | "boolean"; prompt: string }[];
  };
}

interface DograhEdge {
  id: string;
  source: string;
  target: string;
  data: { label: string; condition: string };
}

const END_NODE_ID = "end-call";

export function compileWorkflow(definition: VoiceScenarioDefinition): DograhWorkflowDefinition {
  if (definition.stages.length === 0) {
    throw new Error(`compileWorkflow: "${definition.slug}" has no stages to compile`);
  }

  const extractionVariables = definition.signals.map((s) => ({
    name: s.name,
    type: s.type,
    prompt: s.prompt,
  }));

  const nodes: DograhNode[] = definition.stages.map((stage, index) => ({
    id: stage.id,
    type: index === 0 ? "startCall" : "agentNode",
    position: { x: index * 260, y: 0 },
    data: {
      name: stageLabel(stage),
      prompt: stage.prompt,
      allow_interrupt: stage.allowInterrupt,
      extraction_enabled: extractionVariables.length > 0,
      extraction_variables: extractionVariables.length > 0 ? extractionVariables : undefined,
    },
  }));

  nodes.push({
    id: END_NODE_ID,
    type: "endCall",
    position: { x: definition.stages.length * 260, y: 0 },
    data: { name: "Fin de l'appel", prompt: "Terminez l'appel poliment.", allow_interrupt: false },
  });

  const edges: DograhEdge[] = [];
  let edgeCount = 0;
  for (const stage of definition.stages) {
    const targets = Object.keys(stage.transitions).length > 0 ? stage.transitions : { [END_NODE_ID]: "L'échange est terminé" };
    for (const [targetId, condition] of Object.entries(targets)) {
      edgeCount += 1;
      edges.push({
        id: `edge-${edgeCount}`,
        source: stage.id,
        target: targetId,
        data: { label: `${stage.id} → ${targetId}`, condition },
      });
    }
  }

  return { nodes, edges };
}

function stageLabel(stage: VoiceStage): string {
  const labels: Record<VoiceStage["kind"], string> = {
    greeting: "Accueil",
    claimed_identity: "Identité revendiquée",
    problem: "Problème annoncé",
    urgency: "Urgence",
    request: "Demande",
    adapt: "Adaptation",
    conclusion: "Conclusion",
  };
  return labels[stage.kind];
}

/**
 * Validation rules Dograh enforces server-side
 * (docs/developer/workflow-schema.mdx §Validation rules), checked here
 * first so a malformed scenario fails a local test rather than a
 * `POST /workflow/create/definition` call against a real account.
 */
export function validateCompiledWorkflow(workflow: DograhWorkflowDefinition): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();

  for (const node of workflow.nodes) {
    if (ids.has(node.id)) problems.push(`identifiant de nœud dupliqué : "${node.id}"`);
    ids.add(node.id);
    if (node.type !== "endCall" && node.data.prompt.trim().length === 0) {
      problems.push(`nœud "${node.id}" : prompt vide`);
    }
  }

  const startNodes = workflow.nodes.filter((n) => n.type === "startCall");
  if (startNodes.length !== 1) {
    problems.push(`exactement un nœud "startCall" est requis, ${startNodes.length} trouvé(s)`);
  }

  for (const edge of workflow.edges) {
    if (!ids.has(edge.source)) problems.push(`arête "${edge.id}" : source "${edge.source}" introuvable`);
    if (!ids.has(edge.target)) problems.push(`arête "${edge.id}" : cible "${edge.target}" introuvable`);
  }

  return problems;
}

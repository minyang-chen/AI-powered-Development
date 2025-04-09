// src/utils/templateData.js

// Helper to generate unique IDs for templates
let templateIdCounter = 0;
const getTemplateId = (prefix = 'template_node') => `${prefix}_${templateIdCounter++}`;

// --- Template Definitions ---

// Basic Chat: Runner -> Agent
const basicChatNodes = [
  { id: 'runner_start', type: 'runner', position: { x: 100, y: 100 }, data: { name: 'Start Runner', label: 'Start Runner' } },
  { id: 'agent_chat', type: 'agent', position: { x: 350, y: 100 }, data: { name: 'Chat Agent', label: 'Chat Agent', instructions: 'You are a helpful assistant.' } },
];
const basicChatEdges = [
  { id: 'edge_runner_agent', source: 'runner_start', target: 'agent_chat', type: 'default' }, // Assuming default handles connect runner output to agent input
];

// Function Calling: Runner -> Agent -> FunctionTool
const functionCallingNodes = [
  { id: 'runner_start', type: 'runner', position: { x: 50, y: 100 }, data: { name: 'Start Runner', label: 'Start Runner' } },
  { id: 'agent_tool', type: 'agent', position: { x: 300, y: 100 }, data: { name: 'Tool Agent', label: 'Tool Agent', instructions: 'Use the provided tool to answer the user.' } },
  { id: 'func_tool', type: 'function_tool', position: { x: 550, y: 100 }, data: { name: 'My Function', label: 'My Function', description: 'Description of my function.' } },
];
const functionCallingEdges = [
  { id: 'edge_runner_agent', source: 'runner_start', target: 'agent_tool', type: 'default' }, // Runner output -> Agent input
  { id: 'edge_agent_func', source: 'agent_tool', target: 'func_tool', type: 'default', sourceHandle: 'b' }, // Agent tool output ('b') -> Function input
];

// Routing: Runner -> Triage Agent -> Specialist A / Specialist B
const routingNodes = [
  { id: 'runner_start', type: 'runner', position: { x: 300, y: 0 }, data: { name: 'Start Runner', label: 'Start Runner' } },
  { id: 'agent_triage', type: 'agent', position: { x: 300, y: 150 }, data: { name: 'Triage Agent', label: 'Triage Agent', instructions: 'Route the request to the correct specialist agent.' } },
  { id: 'agent_spec_a', type: 'agent', position: { x: 100, y: 300 }, data: { name: 'Specialist A', label: 'Specialist A', instructions: 'Handle requests related to topic A.' } },
  { id: 'agent_spec_b', type: 'agent', position: { x: 500, y: 300 }, data: { name: 'Specialist B', label: 'Specialist B', instructions: 'Handle requests related to topic B.' } },
];
const routingEdges = [
  { id: 'edge_runner_triage', source: 'runner_start', target: 'agent_triage', type: 'default' }, // Runner output -> Triage input
  // Representing handoffs as edges for visualization - ADDING HANDLES
  { id: 'edge_triage_a', source: 'agent_triage', target: 'agent_spec_a', type: 'default', label: 'Handoff A', sourceHandle: 'c', targetHandle: 'a' }, // Triage handoff output ('c') -> Specialist A input ('a')
  { id: 'edge_triage_b', source: 'agent_triage', target: 'agent_spec_b', type: 'default', label: 'Handoff B', sourceHandle: 'c', targetHandle: 'a' }, // Triage handoff output ('c') -> Specialist B input ('a')
];

// LLM-as-a-Judge: Runner -> Generator Agent -> Judge Agent
const llmAsJudgeNodes = [
  { id: 'runner_start', type: 'runner', position: { x: 50, y: 100 }, data: { name: 'Start Runner', label: 'Start Runner' } },
  { id: 'agent_gen', type: 'agent', position: { x: 300, y: 100 }, data: { name: 'Generator Agent', label: 'Generator Agent', instructions: 'Generate the initial response.' } },
  { id: 'agent_judge', type: 'agent', position: { x: 550, y: 100 }, data: { name: 'Judge Agent', label: 'Judge Agent', instructions: 'Evaluate the response from the Generator Agent.' } },
];
const llmAsJudgeEdges = [
  { id: 'edge_runner_gen', source: 'runner_start', target: 'agent_gen', type: 'default' }, // Runner output -> Generator input
  // Assuming the output of Generator is passed to Judge via handoff/tool call
  { id: 'edge_gen_judge', source: 'agent_gen', target: 'agent_judge', type: 'default', label: 'Evaluate', sourceHandle: 'c', targetHandle: 'a' }, // Generator handoff ('c') -> Judge input ('a')
];


// --- Exported Templates Object ---
export const agentTemplates = {
  basicChat: {
    name: "Basic Chat",
    nodes: basicChatNodes,
    edges: basicChatEdges,
  },
  functionCalling: {
    name: "Function Calling",
    nodes: functionCallingNodes,
    edges: functionCallingEdges,
  },
  routing: {
    name: "Routing (Handoff)",
    nodes: routingNodes,
    edges: routingEdges,
  },
  llmAsJudge: {
    name: "LLM-as-a-Judge",
    nodes: llmAsJudgeNodes,
    edges: llmAsJudgeEdges,
  },
};

// --- Get Template Function (Handles ID regeneration) ---
export const getTemplate = (templateKey) => {
  const originalTemplate = agentTemplates[templateKey];
  if (!originalTemplate) return null;

  // Reset counter for each template load
  templateIdCounter = 0;
  const idMap = new Map(); // Map old IDs to new IDs

  // Create new nodes with fresh IDs and store the mapping
  const newNodes = originalTemplate.nodes.map(node => {
    const oldId = node.id;
    // Generate new ID based on type and counter
    const newId = getTemplateId(`${node.type}_${templateIdCounter}`);
    idMap.set(oldId, newId); // Store mapping: oldId -> newId
    return {
      ...node,
      id: newId,
      // Ensure data object is also copied to avoid mutation issues
      data: { ...node.data }
    };
  });

  // Create new edges using the mapped source/target IDs
  const newEdges = originalTemplate.edges.map(edge => {
    const oldEdgeId = edge.id;
    const newEdgeId = getTemplateId(`edge_${templateIdCounter}`);
    const newSourceId = idMap.get(edge.source); // Look up new source ID
    const newTargetId = idMap.get(edge.target); // Look up new target ID

    // Basic check if mapping failed (shouldn't happen if template is well-defined)
    if (!newSourceId || !newTargetId) {
        console.error(`Edge ${oldEdgeId} in template ${templateKey} references unknown node IDs ${edge.source} or ${edge.target}. Check template definition.`);
        return null; // Skip invalid edges
    }

    return {
      ...edge,
      id: newEdgeId,
      source: newSourceId,
      target: newTargetId,
    };
  }).filter(edge => edge !== null); // Remove any null edges

  return {
    name: originalTemplate.name,
    nodes: newNodes,
    edges: newEdges,
  };
};
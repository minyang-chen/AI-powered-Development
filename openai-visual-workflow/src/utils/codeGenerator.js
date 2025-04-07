import { getConnectedEdges } from 'reactflow'; // Import helper from React Flow

// Helper to generate valid Python variable names from node names/IDs
const sanitizeName = (name) => {
    // Replace invalid characters with underscores
    let sanitized = name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    // Ensure it doesn't start with a number (invalid Python identifier)
    if (/^[0-9]/.test(sanitized)) {
        sanitized = '_' + sanitized;
    }
    // Handle empty or fully sanitized names
    return sanitized || 'unnamed_node'; // Provide a default if name becomes empty
};

// Main function to generate Python code from React Flow nodes and edges
export const generatePythonCode = (nodes, edges) => {
    // Initialize code sections and state
    let code = ''; // Final code string
    let imports = new Set(['from agents import Agent, Runner']); // Start with base imports
    let pydanticModels = ''; // String for Pydantic model definitions (if used)
    let functionDefs = ''; // String for function tool definitions
    let agentDefs = ''; // String for Agent instantiations
    let runnerCode = ''; // String for Runner execution code
    let requiresAsync = false; // Flag to track if asyncio boilerplate is needed

    // Filter nodes by type for easier processing
    const functionToolNodes = nodes.filter(n => n.type === 'function_tool');
    const agentNodes = nodes.filter(n => n.type === 'agent');
    const runnerNodes = nodes.filter(n => n.type === 'runner');

    // 1. Generate Function Tool Definitions
    // Process Function Tool nodes first to define functions before they are used
    if (functionToolNodes.length > 0) {
        imports.add('from agents import function_tool'); // Add required import
        functionToolNodes.forEach(node => {
            // Sanitize the function name from node data
            const funcName = sanitizeName(node.data.name || node.id);
            // Get parameters (assuming a structure like [{ name: 'p1', type: 'str' }, ...]) - needs refinement
            const params = node.data.parameters || [];
            // Get return type, default to 'str'
            const returnType = node.data.returnType || 'str';
            // Get implementation code, provide a placeholder if empty
            const implementation = node.data.implementation || `    # TODO: Implement ${funcName}\n    return "Not implemented"`;

            // Basic parameter string generation (needs refinement for actual types)
            const paramString = params.map(p => `${p.name}: ${p.type || 'str'}`).join(', '); // Create parameter string with type hints

            // Assemble the function definition string
            functionDefs += `@function_tool\n`; // Add decorator
            functionDefs += `def ${funcName}(${paramString}) -> ${returnType}:\n`; // Add signature
            // Indent the provided implementation code correctly
            const indentedImplementation = implementation.split('\n').map(line => `    ${line}`).join('\n');
            functionDefs += `${indentedImplementation}\n\n`; // Add implementation and spacing
        });
    }

    // 2. Generate Agent Definitions (Map node ID to variable name)
    // Create a map to store the generated Python variable name for each agent node ID
    const agentVarNames = new Map();
    agentNodes.forEach(node => {
        // Sanitize the agent name to create a valid Python variable name
        agentVarNames.set(node.id, sanitizeName(node.data.name || node.id));
    });

    agentNodes.forEach(node => {
        // Get the generated variable name and other properties
        const agentVar = agentVarNames.get(node.id);
        const agentName = node.data.name || node.id; // Use original name for the 'name' parameter
        const instructions = node.data.instructions || 'No instructions provided.';
        const handoffDesc = node.data.handoff_description;
        const outputType = node.data.output_type; // Placeholder for Pydantic handling

        // Initialize lists for tools and handoffs for this agent
        let tools = [];
        let handoffs = [];

        // Find connected tools (Function -> Agent)
        // Find incoming edges to this agent node
        const incomingEdges = getConnectedEdges([node], edges).filter(edge => edge.target === node.id);
        incomingEdges.forEach(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            // If the source is a function tool, add its sanitized name to the tools list
            // TODO: Add check for specific target handle ID ('b') if needed
            if (sourceNode?.type === 'function_tool') {
                tools.push(sanitizeName(sourceNode.data.name || sourceNode.id));
            }
            // TODO: Add logic for Guardrails if implemented
        });

        // Find connected handoffs (Agent -> Agent)
        // Find outgoing edges from this agent node
        const outgoingEdges = getConnectedEdges([node], edges).filter(edge => edge.source === node.id);
         outgoingEdges.forEach(edge => {
            const targetNode = nodes.find(n => n.id === edge.target);
            // If the target is another agent, add its variable name to the handoffs list
            if (targetNode?.type === 'agent' && agentVarNames.has(targetNode.id)) {
                // Check source handle to ensure it's a handoff connection (bottom 'c' or right 'd')
                // This distinguishes handoffs from connections to Runners
                if (edge.sourceHandle === 'c' || edge.sourceHandle === 'd') {
                     // Check target handle to ensure it connects to the top ('a') of the target agent
                     if (edge.targetHandle === 'a') {
                        handoffs.push(agentVarNames.get(targetNode.id));
                     }
                }
            }
        });


        // Assemble the Agent instantiation string
        agentDefs += `${agentVar} = Agent(\n`; // Start definition
        agentDefs += `    name="${agentName}",\n`; // Add name parameter
        agentDefs += `    instructions="""${instructions.replace(/"""/g, '\\"\\"\\"')}""",\n`; // Use triple quotes for instructions
        if (handoffDesc) { // Add optional handoff description
            agentDefs += `    handoff_description="""${handoffDesc.replace(/"""/g, '\\"\\"\\"')}""",\n`;
        }
        if (outputType && outputType !== 'None') { // Add output type (commented out for now)
            imports.add('from pydantic import BaseModel'); // Assume BaseModel needed if output_type used
            pydanticModels += `# TODO: Define Pydantic model for ${outputType}\n`;
            pydanticModels += `# class ${outputType}(BaseModel):\n#     pass\n\n`;
            agentDefs += `    # output_type=${outputType}, # Requires Pydantic model definition\n`;
        }
        if (tools.length > 0) { // Add tools list if not empty
            agentDefs += `    tools=[${tools.join(', ')}],\n`;
        }
        if (handoffs.length > 0) { // Add handoffs list if not empty
            agentDefs += `    handoffs=[${handoffs.join(', ')}],\n`;
        }
        // TODO: Add guardrails list if implemented
        agentDefs += `)\n\n`; // Close definition and add spacing
    });


    // 3. Generate Runner Code
    runnerNodes.forEach(node => {
        // Sanitize runner name for variable naming (e.g., for result storage)
        const runnerVar = sanitizeName(node.data.name || node.id);
        // Get input string, default to empty string
        const input = node.data.input || '';
        // Get execution mode
        const mode = node.data.execution_mode || 'Async';
        // Get context string
        const context = node.data.context;

        // Find connected Agent (Agent -> Runner)
        // Find the agent connected to this runner's input handle ('agent-input')
        const incomingEdges = getConnectedEdges([node], edges).filter(edge => edge.target === node.id && edge.targetHandle === 'agent-input');
        let connectedAgentVar = null;
        // Should only be one connection, but loop defensively
        incomingEdges.forEach(edge => {
             const sourceNode = nodes.find(n => n.id === edge.source);
             // Check if source is an agent and its variable name is known
             if (sourceNode?.type === 'agent' && agentVarNames.has(sourceNode.id)) {
                 // Check if the source handle is appropriate (bottom 'c' or right 'd')
                 if (edge.sourceHandle === 'c' || edge.sourceHandle === 'd') {
                    connectedAgentVar = agentVarNames.get(sourceNode.id);
                 }
             }
        });

        // Only generate runner code if a valid agent connection is found
        if (connectedAgentVar) {
            let contextArg = '';
            // Prepare context argument string
            if (context) {
                try {
                    JSON.parse(context); // Attempt to parse JSON to validate
                    contextArg = `, context=${context}`; // Use the raw string if valid JSON
                } catch (e) {
                    // If JSON is invalid, add a comment and use an empty dict
                    contextArg = `, context={} # WARNING: Invalid JSON in context: ${context}`;
                }
            }

            // Generate synchronous runner code
            if (mode === 'Sync') {
                runnerCode += `result_${runnerVar} = Runner.run_sync(${connectedAgentVar}, """${input.replace(/"""/g, '\\"\\"\\"')}"""${contextArg})\n`;
                runnerCode += `print(f"Result from ${runnerVar}: {result_${runnerVar}.final_output}")\n\n`;
            } else {
                // Generate asynchronous runner code
                requiresAsync = true; // Mark that asyncio boilerplate is needed
                imports.add('import asyncio'); // Add asyncio import
                // Note: Runner code generated here assumes it will be placed inside an async function
                runnerCode += `    result_${runnerVar} = await Runner.run(${connectedAgentVar}, """${input.replace(/"""/g, '\\"\\"\\"')}"""${contextArg})\n`;
                runnerCode += `    print(f"Result from ${runnerVar}: {result_${runnerVar}.final_output}")\n\n`;
            }
        } else {
             // Add a comment if the runner is not properly connected
             runnerCode += `# WARNING: Runner node '${node.data.name || node.id}' is not connected to a valid Agent output.\n\n`;
        }
    });

    // 4. Assemble Code
    // Assemble the final code string in order
    // Imports
    code += Array.from(imports).sort().join('\n') + '\n\n'; // Sort imports
    // Pydantic Models (if any)
    if (pydanticModels) {
        code += "# --- Pydantic Model Definitions (if used) ---\n";
        code += pydanticModels + '\n';
    }
    // Function Tools
    if (functionDefs) {
        code += "# --- Function Tool Definitions ---\n";
        code += functionDefs; // Includes trailing newlines
    }
    // Agent Definitions
    if (agentDefs) {
        code += "# --- Agent Definitions ---\n";
        code += agentDefs; // Includes trailing newlines
    }

    // Runner Execution Code
    if (runnerCode) { // Only add section if there's runner code
        if (requiresAsync) {
            // Wrap async runner code in main() and asyncio.run()
            code += "# --- Runner Execution (Async) ---\n";
            code += `async def main():\n`;
            // Indent existing runner code (which already includes necessary indentation for inside async def)
            code += runnerCode; // runnerCode already has '    ' prepended for async lines
            code += `\n\nif __name__ == "__main__":\n`;
            code += `    asyncio.run(main())\n`;
        } else {
            // Add sync runner code directly
            code += "# --- Runner Execution (Sync) ---\n";
            code += runnerCode;
        }
    }


    return code;
};
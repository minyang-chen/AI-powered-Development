import React, { useState, useEffect, useCallback } from 'react';

// Component to display configuration options for the selected node
const ConfigPanel = ({ selectedNode, onUpdateNodeData }) => {
  // Local state to manage the form data, initialized with the selected node's data
  const [nodeData, setNodeData] = useState(selectedNode?.data || {});

  // Update local state when the selected node changes
  // Effect to update the local form state when the selectedNode prop changes
  useEffect(() => {
    // Reset local state to the data of the newly selected node, or empty object if none selected
    setNodeData(selectedNode?.data || {});
  }, [selectedNode]); // Dependency: run effect when selectedNode changes

  // Use useCallback to prevent unnecessary re-renders of the input handler
  // Generic handler for input changes in the forms
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target; // Get input name and value
    // Create a new data object with the updated value
    const updatedData = { ...nodeData, [name]: value };
    // Update the local form state immediately for responsiveness
    setNodeData(updatedData);
    // Call the update function passed from App.jsx
    // If a node is actually selected, call the callback passed from App
    // to update the global nodes state in the main App component
    if (selectedNode) {
      onUpdateNodeData(selectedNode.id, updatedData);
    }
  }, [nodeData, selectedNode, onUpdateNodeData]);

  // Renders the configuration form specific to Agent nodes
  const renderAgentConfig = () => (
    <>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={nodeData.name || ''}
        onChange={handleInputChange}
      />

      <label htmlFor="instructions">Instructions:</label>
      <textarea
        id="instructions"
        name="instructions"
        value={nodeData.instructions || ''}
        onChange={handleInputChange}
        rows={4}
      />

      <label htmlFor="handoff_description">Handoff Description (Optional):</label>
      <input
        type="text"
        id="handoff_description"
        name="handoff_description"
        value={nodeData.handoff_description || ''}
        onChange={handleInputChange}
      />

      <label htmlFor="output_type">Output Type:</label>
      <select
        id="output_type"
        name="output_type"
        value={nodeData.output_type || 'None'}
        onChange={handleInputChange}
      >
        <option value="None">None</option>
        <option value="Custom Pydantic">Custom Pydantic (Define Separately)</option>
        {/* Add specific Pydantic models if needed later */}
      </select>

      {/* Display connected handoffs/tools (read-only here) */}
      {/* <p>Handoffs: {selectedNode?.data?.handoffs?.length || 0}</p> */}
      {/* <p>Tools: {selectedNode?.data?.tools?.length || 0}</p> */}
    </>
  );

  // Renders the configuration form specific to Runner nodes
  const renderRunnerConfig = () => (
    <>
       <label htmlFor="name">Name:</label> {/* Runner can also have a name/label */}
       <input
         type="text"
         id="name"
         name="name"
         value={nodeData.name || ''}
         onChange={handleInputChange}
       />
      <label htmlFor="input">Input:</label>
      <textarea
        id="input"
        name="input"
        value={nodeData.input || ''}
        onChange={handleInputChange}
        rows={3}
      />

      <label htmlFor="execution_mode">Execution Mode:</label>
      <select
        id="execution_mode"
        name="execution_mode"
        value={nodeData.execution_mode || 'Async'}
        onChange={handleInputChange}
      >
        <option value="Async">Asynchronous</option>
        <option value="Sync">Synchronous</option>
      </select>

      <label htmlFor="context">Context (JSON - Optional):</label>
      <textarea
        id="context"
        name="context"
        value={nodeData.context || ''}
        onChange={handleInputChange}
        rows={3}
        placeholder='e.g., {"user_id": "123"}'
      />
       {/* Add validation for JSON later */}
    </>
  );

  // Renders the configuration form specific to Function Tool nodes
  const renderFunctionToolConfig = () => (
    <>
      <label htmlFor="name">Function Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={nodeData.name || ''}
        onChange={handleInputChange}
      />

      {/* Parameters - Simple display for now, complex editor later */}
      <label>Parameters:</label>
      <p style={{fontSize: '0.8em', color: '#666'}}>Define parameters in code editor.</p>
      {/* Add parameter editor later */}


      <label htmlFor="returnType">Return Type:</label>
      <select
        id="returnType"
        name="returnType"
        value={nodeData.returnType || 'None'}
        onChange={handleInputChange}
      >
        <option value="None">None</option>
        <option value="str">String</option>
        <option value="int">Integer</option>
        <option value="float">Float</option>
        <option value="bool">Boolean</option>
        <option value="list">List</option>
        <option value="dict">Dictionary</option>
      </select>

      <label htmlFor="implementation">Implementation (Python):</label>
      <textarea
        id="implementation"
        name="implementation"
        value={nodeData.implementation || ''}
        onChange={handleInputChange}
        rows={8}
        placeholder={`def ${nodeData.name || 'my_function'}(param1: str) -> ${nodeData.returnType || 'str'}:\n  # Your code here\n  return "result"`}
        style={{ fontFamily: 'monospace', fontSize: '0.9em' }}
      />
    </>
  );


  return (
    // Main render method for the ConfigPanel
    <aside className="config-panel">
      <h3>Configuration</h3>
      {/* Conditionally render content based on whether a node is selected */}
      {selectedNode ? (
        <div>
          {/* Display basic info for the selected node */}
          <p style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>
            Node ID: <strong>{selectedNode.id}</strong> <br/>
            Type: <strong>{selectedNode.type}</strong>
          </p>
          {/* Render the appropriate configuration form based on the selected node's type */}
          {selectedNode.type === 'agent' && renderAgentConfig()}
          {selectedNode.type === 'runner' && renderRunnerConfig()}
          {selectedNode.type === 'function_tool' && renderFunctionToolConfig()}
          {/* Placeholder comment for adding future node type configurations */}
          {/* {selectedNode.type === 'guardrail' && renderGuardrailConfig()} */}
        </div>
      ) :
        // Message displayed when no node is selected (No parentheses needed here)
        <p>Select a node to configure it.</p>
      }
    </aside>
  );
};

export default ConfigPanel;
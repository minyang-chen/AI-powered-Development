import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// Custom node component for representing an Agent
const AgentNode = ({ data }) => { // Receives node data as props
  // data contains properties set in App.jsx during node creation/update
  // Extract the node name, falling back to label or a default
  const nodeName = data.name || data.label || 'Agent Node';

  return (
    // Apply specific CSS class for Agent node styling (blue border)
    <div className="react-flow__node-agent">
      {/* Define connection handles */}
      {/* Target handles (inputs) */}
      <Handle type="target" position={Position.Top} id="a" /> {/* Input from Runner/Agent */}
      <Handle type="target" position={Position.Left} id="b" /> {/* Input from Tools/Guardrails */}

      {/* Display the node's name in the header */}
      <div className="node-header">{nodeName}</div>
      <div>
        {/* Display some key properties directly on the node */}
        {/* More detailed configuration happens in ConfigPanel */}
        <small>Instructions: {data.instructions ? `${data.instructions.substring(0, 30)}...` : '...'}</small><br/> {/* Show snippet */}
        <small>Output: {data.output_type || 'None'}</small>
        {/* Display connections later */}
        {/* <small>Handoffs: {data.handoffs?.length || 0}</small><br/>
        <small>Tools: {data.tools?.length || 0}</small> */}
      </div>

      {/* Source handles (outputs) */}
      <Handle type="source" position={Position.Bottom} id="c" /> {/* Output to Runner/Agent */}
      <Handle type="source" position={Position.Right} id="d" /> {/* Output to Agent (Handoff) */}
    </div>
  );
};

// Wrap component in memo to prevent unnecessary re-renders if props haven't changed
export default memo(AgentNode);
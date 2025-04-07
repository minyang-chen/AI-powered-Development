import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// Custom node component for representing a Runner execution
const RunnerNode = ({ data }) => { // Receives node data as props
  // Extract properties from data, providing defaults
  const nodeName = data.name || data.label || 'Runner Node';
  const executionMode = data.execution_mode || 'Async'; // Default execution mode

  return (
    // Apply specific CSS class for Runner node styling (red border)
    <div className="react-flow__node-runner">
      {/* Define connection handles */}
      {/* Runner nodes only accept input from an Agent */}
      <Handle type="target" position={Position.Left} id="agent-input" />

      {/* Display the node's name */}
      <div className="node-header">{nodeName}</div>
      <div>
        {/* Display key configuration directly on the node */}
        <small>Input: {data.input ? `"${data.input.substring(0, 20)}..."` : '"..."'}</small><br/> {/* Show snippet */}
        <small>Mode: {executionMode}</small><br/>
        <small>Context: {data.context ? 'Provided' : 'None'}</small>
      </div>

      {/* Runner usually represents the end of a flow or triggers execution, might not need a source handle */}
      {/* <Handle type="source" position={Position.Right} id="result-output" /> */}
    </div>
  );
};

// Wrap component in memo for performance optimization
export default memo(RunnerNode);
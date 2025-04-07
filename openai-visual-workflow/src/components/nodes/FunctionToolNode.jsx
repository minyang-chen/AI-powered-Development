import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// Custom node component for representing a Function Tool
const FunctionToolNode = ({ data }) => { // Receives node data as props
  // Extract properties from data, providing defaults
  const nodeName = data.name || data.label || 'Function Tool';
  const returnType = data.returnType || 'None'; // Default return type

  return (
    // Apply specific CSS class for Function Tool node styling (yellow border)
    <div className="react-flow__node-function_tool">
      {/* Function tools don't typically take direct input via handles */}
      {/* <Handle type="target" position={Position.Left} id="a" /> */}

      {/* Display the node's name (function name) */}
      <div className="node-header">{nodeName}</div>
      <div>
        {/* Display key configuration directly on the node */}
        {/* Parameter editing is complex, deferred to ConfigPanel/Code Editor */}
        <small>Params: {data.parameters?.length || 0}</small><br/>
        <small>Returns: {returnType}</small><br/>
        <small>Implementation: {data.implementation ? 'Provided' : '...'}</small>
      </div>

      {/* Define connection handles */}
      {/* Function tools only act as a source, providing the tool to an Agent */}
      <Handle type="source" position={Position.Right} id="tool-output" />
    </div>
  );
};

// Wrap component in memo for performance optimization
export default memo(FunctionToolNode);
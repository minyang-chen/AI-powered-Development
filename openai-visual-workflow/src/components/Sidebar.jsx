import React from 'react';

// Function to handle the start of a drag event from the sidebar items
const onDragStart = (event, nodeType, nodeName) => {
  // Prepare the data to be transferred during the drag
  const nodeData = { type: nodeType, name: nodeName }; // Include node type and a default name
  // Set the data type and the stringified data for React Flow to recognize
  event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
  // Specify the allowed drag effect
  event.dataTransfer.effectAllowed = 'move';
};

// Sidebar component displaying draggable node types and the generate code button
const Sidebar = ({ onGenerateCode }) => { // Receives callback for code generation
  return (
    <aside className="sidebar">
      <h3>Components</h3>
      <p style={{ fontSize: '0.8em', color: '#666', marginBottom: '15px' }}>Drag nodes to the canvas</p>

      {/* Draggable Agent Node representation */}
      <div
        className="dndnode agent" // Class for styling
        onDragStart={(event) => onDragStart(event, 'agent', 'Agent')} // Set data for 'agent' type on drag start
        draggable // Make the div draggable
        style={styles.dndNode} // Apply common draggable node styles
      >
        <div style={{...styles.nodeIndicator, backgroundColor: '#3498db'}}></div> {/* Blue indicator */}
        Agent Node
      </div>
      {/* Draggable Runner Node representation */}
      <div
        className="dndnode runner"
        onDragStart={(event) => onDragStart(event, 'runner', 'Runner')} // Set data for 'runner' type
        draggable
        style={styles.dndNode}
      >
         <div style={{...styles.nodeIndicator, backgroundColor: '#e74c3c'}}></div> {/* Red indicator */}
        Runner Node
      </div>
      {/* Draggable Function Tool Node representation */}
      <div
        className="dndnode function_tool"
        onDragStart={(event) => onDragStart(event, 'function_tool', 'Function Tool')} // Set data for 'function_tool' type
        draggable
        style={styles.dndNode}
      >
         <div style={{...styles.nodeIndicator, backgroundColor: '#f39c12'}}></div> {/* Yellow indicator */}
        Function Tool
      </div>
      {/* Add Guardrail later if needed */}
      {/* <div
        className="dndnode guardrail"
        onDragStart={(event) => onDragStart(event, 'guardrail', 'Guardrail')}
        draggable
        style={styles.dndNode}
      >
         <div style={{...styles.nodeIndicator, backgroundColor: '#9b59b6'}}></div> // Purple
        Guardrail Node
      </div> */}

      {/* Button to trigger code generation */}
      <button onClick={onGenerateCode} style={{ width: '100%', marginTop: '20px' }}>
        Generate Code
      </button>
    </aside>
  );
};

// Inline styles object (can be moved to CSS file if preferred)
const styles = {
  dndNode: {
    height: '40px', // Increased height
    padding: '8px 12px', // Adjusted padding
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '10px',
    display: 'flex', // Use flexbox for alignment
    alignItems: 'center', // Center items vertically
    justifyContent: 'flex-start', // Align items to the start
    cursor: 'grab',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.2s',
  },
  nodeIndicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginRight: '10px',
  }
};

// Add hover effect style (optional, requires CSS or more complex JS)
// .dndnode:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.15); }


export default Sidebar;
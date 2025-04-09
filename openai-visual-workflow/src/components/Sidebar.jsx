import React, { useState, useRef } from 'react'; // Import useState and useRef
import { agentTemplates } from '../utils/templateData'; // Import templates

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
const Sidebar = ({ onGenerateCode, onLogout, username, onLoadTemplate }) => { // Add onLoadTemplate prop
  const [isHelpVisible, setIsHelpVisible] = useState(false); // State for help visibility
  const templateSelectRef = useRef(null); // Ref for the select dropdown

  const handleTemplateChange = (event) => {
    const templateKey = event.target.value;
    if (templateKey && onLoadTemplate) {
      onLoadTemplate(templateKey);
      // Reset dropdown after loading
      if (templateSelectRef.current) {
        templateSelectRef.current.value = "";
      }
    }
  };

  return (
    <aside className="sidebar">
      <h3>Components</h3>
      {/* Display logged-in user */}
      {username && (
        <div style={{ padding: '10px 0', borderBottom: '1px solid #eee', marginBottom: '15px', fontSize: '0.9em', color: '#333' }}>
          Logged in as: <strong>{username}</strong>
        </div>
      )}

      {/* Template Loader Section */}
      <div style={{ padding: '10px 0', borderBottom: '1px solid #eee', marginBottom: '15px' }}>
        <label htmlFor="template-select" style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#333' }}>Load Template:</label>
        <select
          id="template-select"
          ref={templateSelectRef}
          onChange={handleTemplateChange}
          style={{ width: '100%', padding: '8px', fontSize: '0.9em', marginBottom: '10px' }}
          defaultValue="" // Ensure default is selected initially
        >
          <option value="" disabled>-- Select Template --</option>
          {Object.entries(agentTemplates).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

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

      {/* Help Section */}
      <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        <button
          onClick={() => setIsHelpVisible(!isHelpVisible)}
          style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '5px 0', fontSize: '0.9em', color: '#007bff', marginBottom: '5px' }}
        >
          {isHelpVisible ? '▼ Hide Help' : '► Show Help'}
        </button>

        {/* Collapsible Help Content */}
        {isHelpVisible && (
          <div style={{ padding: '10px', marginTop: '5px', border: '1px solid #eee', borderRadius: '4px', fontSize: '0.85em', textAlign: 'left', backgroundColor: '#f9f9f9' }}>
            <h4>Quick Reference</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {/* Added Template Instruction */}
              <li><strong>Load Template:</strong> Select a pattern from the dropdown above to load a pre-built workflow (clears current canvas).</li>
              <li><strong>Add Nodes:</strong> Drag from sidebar to canvas.</li>
              <li><strong>Connect Nodes:</strong> Drag between node handles (circles).</li>
              <li><strong>Configure:</strong> Click node, use right panel.</li>
              <li><strong>Generate Code:</strong> Click 'Generate Code' button above.</li>
              <li><strong>Navigate:</strong> Zoom with wheel, pan by dragging background.</li>
              <li><strong>Logout:</strong> Click 'Logout' button below.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Button to trigger logout */}
      <button onClick={onLogout} style={{ width: '100%', marginTop: '10px', backgroundColor: '#f44336', color: 'white' }}>
        Logout
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
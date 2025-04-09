import React, { useState, useCallback, useRef, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ReactFlow, { // Import React Flow components and hooks
  // ReactFlowProvider removed, it's in main.jsx
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  useReactFlow, // Hook used here
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css'; // Import React Flow default styles

// Import local components

import Sidebar from './components/Sidebar';
import ConfigPanel from './components/ConfigPanel';
import AgentNode from './components/nodes/AgentNode';
import RunnerNode from './components/nodes/RunnerNode';
import FunctionToolNode from './components/nodes/FunctionToolNode';
import CodeModal from './components/CodeModal';
import { generatePythonCode } from './utils/codeGenerator';
import { getTemplate } from './utils/templateData'; // Import template loader

// Initial state for nodes (starts empty)
const initialNodes = [];
// Mapping of custom node type names to their React components
const nodeTypes = {
  agent: AgentNode,
  runner: RunnerNode,
  function_tool: FunctionToolNode,
};

// Simple counter for generating unique node IDs
let idCounter = 0;
const getId = () => `dndnode_${idCounter++}`; // Function to get next unique ID

// Main App component
function App() {
  const reactFlowWrapper = useRef(null); // Ref for the canvas container div, used for drag/drop calculations
  // React Flow state hooks for managing nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  // State for tracking the currently selected node
  const [selectedNode, setSelectedNode] = useState(null);
  // State for storing the generated Python code
  const [generatedCode, setGeneratedCode] = useState(null);
  // State to control the visibility of the code generation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const reactFlowInstance = useReactFlow(); // Get instance for fitView
  const { screenToFlowPosition } = reactFlowInstance; // Destructure screenToFlowPosition
  const navigate = useNavigate(); // Hook for navigation
  const [loggedInUser, setLoggedInUser] = useState(''); // State for username

  // Effect to get username from localStorage on mount
  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(user);
    }
  }, []); // Empty dependency array means run once on mount

  // Callback function for handling new connections (edges)
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)), // Use React Flow's addEdge helper
    [setEdges] // Dependency: setEdges function
  );

  // Callback function for handling node clicks
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node); // Update the selected node state
    console.log('Selected Node:', node); // Log for debugging
  }, []); // No dependencies needed as setSelectedNode is stable

  // Callback function for handling clicks on the canvas background (pane)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null); // Deselect any currently selected node
  }, []); // No dependencies needed

  // Callback function for handling drag over the canvas area
  const onDragOver = useCallback((event) => {
    event.preventDefault(); // Necessary to allow dropping
    event.dataTransfer.dropEffect = 'move'; // Indicate the type of drop operation
  }, []); // No dependencies needed

  // Callback function for handling dropping a node onto the canvas
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      console.log('onDrop Event:', event);

      // Retrieve the node type and data transferred from the drag source (Sidebar)
      const typeData = event.dataTransfer.getData('application/reactflow');
      console.log('onDrop typeData:', typeData);

      // Basic validation for the transferred data
      if (typeof typeData === 'undefined' || !typeData) {
        console.log('onDrop: Invalid typeData, exiting.');
        return; // Exit if data is missing
      }

      let nodeInfo;
      try {
        // Parse the JSON string containing node type and default name
        nodeInfo = JSON.parse(typeData);
        console.log('onDrop nodeInfo:', nodeInfo);
      } catch (e) {
        console.error('onDrop: Failed to parse typeData:', e);
        return;
      }

      // Check if the screenToFlowPosition function (from useReactFlow) is available
      if (!screenToFlowPosition) {
          console.error("screenToFlowPosition is not ready"); // Should not happen if Provider is set up correctly
          return;
      }

      // Calculate the node's position on the flow canvas based on the drop coordinates
      const position = screenToFlowPosition({
        x: event.clientX, // Use mouse coordinates from the drop event
        y: event.clientY,
      });
      console.log('onDrop calculated position:', position);

      // Create the new node object
      const newNode = {
        id: getId(), // Generate a unique ID
        type: nodeInfo.type, // Set the node type (e.g., 'agent', 'runner')
        position, // Set the calculated position
        data: { label: `${nodeInfo.name} ${idCounter}`, name: `${nodeInfo.name} ${idCounter}` }, // Initial data (label and name)
      };
      console.log('onDrop newNode:', newNode);

      // Add the new node to the existing nodes state
      setNodes((nds) => {
        const newNodes = nds.concat(newNode); // Create a new array with the added node
        console.log('onDrop updated nodes state:', newNodes); // Log for debugging
        return newNodes; // Return the updated nodes array
      });
    },
    [screenToFlowPosition, setNodes] // Dependencies for the useCallback hook
  );

  // Callback function to trigger code generation
  const handleGenerateCode = useCallback(() => {
    try {
      // Call the utility function to generate code based on current nodes and edges
      const pythonCode = generatePythonCode(nodes, edges);
      setGeneratedCode(pythonCode); // Store the generated code in state
      setIsModalOpen(true); // Open the code display modal
    } catch (error) {
      console.error("Code generation failed:", error);
      // If generation fails, show an error message in the modal
      setGeneratedCode(`# Code generation failed:\n# ${error.message}`);
      setIsModalOpen(true); // Still open the modal to show the error
    }
  }, [nodes, edges]); // Dependencies: nodes and edges state

  // Callback function passed to ConfigPanel to update a node's data
  const handleUpdateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      // Map over existing nodes to find the one to update
      nds.map((node) => {
        if (node.id === nodeId) {
          // If found, return a *new* node object with the merged data
          // This ensures immutability for React state updates
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node; // Otherwise, return the original node unchanged
      })
    );
     // Also update the selectedNode state if the currently selected node was the one updated
     setSelectedNode(prev => prev && prev.id === nodeId ? {...prev, data: {...prev.data, ...newData}} : prev);
  }, [setNodes]); // Dependency: setNodes function

  // Callback function for handling logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
    navigate('/'); // Redirect to landing page
  }, [navigate]); // Dependency: navigate function

  // Callback function for loading a template
  const handleLoadTemplate = useCallback((templateKey) => {
    const template = getTemplate(templateKey);
    if (!template) {
      console.error(`Template not found: ${templateKey}`);
      return;
    }

    // Clear existing nodes and edges
    setNodes([]);
    setEdges([]);

    // Use setTimeout to allow state to clear before setting new nodes/edges and fitting view
    // This helps prevent potential race conditions with React Flow's internal state updates
    setTimeout(() => {
      setNodes(template.nodes);
      setEdges(template.edges);
      // Fit view to the loaded template
      reactFlowInstance.fitView({ padding: 0.1 }); // Add some padding
    }, 0);

  }, [setNodes, setEdges, reactFlowInstance]); // Dependencies

  return (
      <> {/* Fragment for multiple top-level elements */}
        <div style={{ display: 'flex', height: '100%' }}> {/* Main layout container */}
          {/* Left Sidebar Component */}
          <Sidebar onGenerateCode={handleGenerateCode} onLogout={handleLogout} username={loggedInUser} onLoadTemplate={handleLoadTemplate} /> {/* Pass username and template loader */}

          {/* Canvas container using flex: 1 from CSS */}
          {/* Center Canvas Area */}
          <div className="canvas-container" ref={reactFlowWrapper}>
             {/* No inner wrapper */}
                {/* React Flow Component */}
                <ReactFlow
                  // style removed - dimensions handled by CSS on .canvas-container
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  onPaneClick={onPaneClick}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  nodeTypes={nodeTypes}
                  fitView
                  attributionPosition="top-right"
                >
                  <Controls />
                  <MiniMap />
                  <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
              {/* Removed inner wrapper closing tag */}
          </div>

          {/* Right Configuration Panel Component */}
          <ConfigPanel
            selectedNode={selectedNode} // Pass the currently selected node
            onUpdateNodeData={handleUpdateNodeData} // Pass the update callback
          />
        </div>

        {/* Render the modal conditionally */}
        {/* Conditionally render the Code Modal */}
        {isModalOpen && (
          <CodeModal code={generatedCode} onClose={() => setIsModalOpen(false)} />
        )}
      </>
  );
}

export default App;
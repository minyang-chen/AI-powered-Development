# Task: Create an OpenAI Agents Visual Workflow Designer

Build a web application using **React** and **Vite** that allows users to visually design workflows compatible with the `openai-agents` Python SDK. The core functionality involves dragging, configuring, and connecting nodes on a canvas, and then generating the corresponding Python code.

**Key Requirements:**

1.  **UI Layout (Critical for Stability):**
    *   Implement a **three-panel layout**:
        *   Left Sidebar (fixed width, e.g., 200px): Contains draggable node components.
        *   Center Canvas Area (flexible width): Renders the React Flow graph. This area *must* have stable, calculable dimensions for React Flow to render correctly. Consider using **CSS Grid** for the main layout (e.g., `grid-template-columns: 200px 1fr 300px;`) or ensure the container using `flex: 1` has a reliable height context (`html, body, #root { height: 100% }`).
        *   Right Config Panel (fixed width, e.g., 300px): Displays configuration for the selected node.
    *   The entire application should fill the viewport height (`height: 100%` on `html, body, #root`).

2.  **Canvas Implementation (React Flow):**
    *   Use the `reactflow` library for the canvas.
    *   Wrap the main application or the canvas component with `<ReactFlowProvider>`.
    *   **Crucially:** Ensure the direct parent container of the `<ReactFlow>` component has explicit `width` and `height` (e.g., `100%`) defined when React Flow initializes. The recommended pattern is often an inner `div` wrapper:
        ```jsx
        <div className="canvas-container"> {/* Sized by Grid/Flexbox */}
          <div style={{ width: '100%', height: '100%' }}> {/* Explicit dimensions */}
            <ReactFlow ... />
          </div>
        </div>
        ```
    *   Use the `useReactFlow` hook (e.g., for `screenToFlowPosition`) *only* within components rendered *inside* the `<ReactFlowProvider>`.

3.  **Node Types & Data:**
    *   **Agent Node:** Stores `name`, `instructions`, `handoff_description` (optional), `output_type` (None/Custom Pydantic). Needs target handles (top, left) and source handles (bottom, right). Style with blue top border (`#3498db`).
    *   **Runner Node:** Stores `name` (optional), `input`, `execution_mode` (Async/Sync), `context` (optional JSON). Needs target handle (left). Style with red top border (`#e74c3c`).
    *   **Function Tool Node:** Stores `name`, `parameters` (structure TBD), `returnType` (select), `implementation` (code string). Needs source handle (right). Style with yellow top border (`#f39c12`).

4.  **Core Interactions:**
    *   **Drag & Drop:** Implement dragging nodes from Sidebar to Canvas using HTML Drag/Drop API and React Flow's `onDrop`/`onDragOver`. Use `screenToFlowPosition` in `onDrop`.
    *   **Selection & Configuration:** Clicking a node updates `selectedNode` state (managed in `App`). `ConfigPanel` displays form based on `selectedNode.type` and updates node data via a callback (`handleUpdateNodeData`) passed from `App`.
    *   **Connections:** Use `onConnect` and `addEdge`. Implement `isValidConnection` to strictly enforce rules based on **node type and handle ID** (e.g., FunctionTool(right) -> Agent(left) is valid for tools).

5.  **Code Generation (`utils/codeGenerator.js`):**
    *   Function `generatePythonCode(nodes, edges)` produces Python script string.
    *   **Map Connections to SDK:**
        *   FunctionTool -> Agent (left handle): Add function name to Agent's `tools=[]`.
        *   Agent -> Agent (bottom/right to top handle): Add target Agent variable to source Agent's `handoffs=[]`.
        *   Agent -> Runner (bottom/right to left handle): Use source Agent variable in `Runner.run/run_sync()`.
    *   Generate imports, function defs (`@function_tool`), Agent instances, and Runner calls accurately based on node data and connections. Handle async/sync mode and context. Add `asyncio` boilerplate if needed.

6.  **UI Elements:**
    *   `Sidebar.jsx`: Draggable components, "Generate Code" button.
    *   `ConfigPanel.jsx`: Forms for node properties.
    *   `CodeModal.jsx`: Displays generated code with copy button.
    *   Custom Node Components (`AgentNode.jsx`, etc.): Render node appearance and handles.

7.  **State Management:**
    *   The main `App` component should manage `nodes`, `edges`, and `selectedNode` state. Use `useNodesState` and `useEdgesState` hooks.

**Development Strategy Suggestion:**

1.  Implement and **verify the static 3-panel layout** using CSS Grid or Flexbox *first*.
2.  Integrate React Flow using the **inner wrapper div pattern** and confirm it renders without dimension errors.
3.  Implement drag-and-drop.
4.  Implement custom nodes, selection, and configuration panel updates.
5.  Implement connection logic (`onConnect`, `isValidConnection`).
6.  Implement code generation logic, potentially with unit tests.
7.  Integrate code generation UI (button, modal).
8.  Refine styling and add error handling.
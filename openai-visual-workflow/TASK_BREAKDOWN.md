# Optimized Task Breakdown (Based on Lessons Learned)

This breakdown prioritizes establishing a stable foundation before adding complex interactions, aiming to minimize layout and rendering bugs encountered previously.

**Phase 1: Core Layout & Basic Canvas Rendering**

1.  **Task 1.1: Project Setup & Static Layout**
    *   Initialize Vite + React project.
    *   Install `reactflow`.
    *   Create basic file structure (`App.jsx`, `main.jsx`, `style.css`, `components/`).
    *   **Implement Stable 3-Panel Layout:** Use CSS Grid (preferred: `grid-template-columns: 200px 1fr 300px;`) or Flexbox for Sidebar, Canvas Area, Config Panel in `App.jsx`. Use simple colored `div`s as placeholders.
    *   **Verify Layout:** Ensure layout stability and correct sizing of the central area *without* React Flow. Test resizing.
    *   Apply base styles (`html, body, #root { height: 100% }`, fonts, colors).

2.  **Task 1.2: Integrate React Flow (Minimal)**
    *   Add `<ReactFlowProvider>` in `main.jsx`.
    *   In `App.jsx`, replace the canvas placeholder `div` with `.canvas-container`.
    *   *Inside* `.canvas-container`, add an inner `div` with inline `style={{ width: '100%', height: '100%' }}`.
    *   Place the `<ReactFlow>` component *inside* this inner `div`, initially with only `<Background />` and `<Controls />`.
    *   Add minimal state for nodes/edges (`useState([])`) in `App.jsx`.
    *   **Verify Rendering:** Confirm React Flow canvas renders correctly within the layout *without* the dimension error.

**Phase 2: Core Functionality**

3.  **Task 2.1: Sidebar & Drag Source**
    *   Create `Sidebar.jsx`.
    *   Add static draggable node type representations.
    *   Implement `onDragStart` to set `event.dataTransfer`.

4.  **Task 2.2: Canvas Drop Target**
    *   Add `onDragOver` and `onDrop` handlers to the `.canvas-container` div in `App.jsx`.
    *   Use the `useReactFlow` hook within `App.jsx` (since Provider is in `main.jsx`).
    *   Implement `onDrop` logic: get data, calculate position (`screenToFlowPosition`), create new node, update `nodes` state.
    *   **Verify Drag-and-Drop:** Test dragging nodes; ensure they appear correctly. Use console logs.

5.  **Task 2.3: Custom Node Components & Rendering**
    *   Create basic `AgentNode.jsx`, `RunnerNode.jsx`, `FunctionToolNode.jsx` with structure and `Handle`s.
    *   Define `nodeTypes` map in `App.jsx`.
    *   Pass `nodeTypes` prop to `<ReactFlow>`.
    *   **Verify Custom Nodes:** Confirm dropped nodes render correctly.

6.  **Task 2.4: Node Selection & Basic Config Panel**
    *   Add `selectedNode` state to `App.jsx`.
    *   Implement `onNodeClick` for `<ReactFlow>` to update `selectedNode`.
    *   Create `ConfigPanel.jsx`, pass `selectedNode`.
    *   Implement basic display of selected node info in `ConfigPanel`.
    *   **Verify Selection:** Click nodes, confirm Config Panel updates.

**Phase 3: Configuration & Connections**

7.  **Task 3.1: Config Panel Forms & State Update**
    *   Add form elements to `ConfigPanel.jsx`.
    *   Implement `handleUpdateNodeData` callback in `App.jsx`.
    *   Pass callback to `ConfigPanel`.
    *   Implement `onChange` handlers in `ConfigPanel` to call the callback.
    *   **Verify Configuration:** Edit properties, confirm node data updates.

8.  **Task 3.2: Edge Connections**
    *   Implement `onConnect` callback for `<ReactFlow>` using `addEdge`.
    *   Implement `isValidConnection` callback for connection validation logic.
    *   **Verify Connections:** Test creating valid/invalid edges.

**Phase 4: Code Generation**

9.  **Task 4.1: Code Generator Logic & Testing**
    *   Create `utils/codeGenerator.js`.
    *   Define `generatePythonCode(nodes, edges)`.
    *   **Implement Core Generation:** Focus on correct Python syntax for imports, functions, Agents (finding connections), Runners.
    *   **(Optional) Unit Tests:** Test generator with mock data.

10. **Task 4.2: Code Generation UI**
    *   Create `CodeModal.jsx`.
    *   Add `generatedCode`, `isModalOpen` state to `App.jsx`.
    *   Implement `handleGenerateCode` callback in `App.jsx`.
    *   Render `CodeModal` conditionally.
    *   Implement copy-to-clipboard.
    *   **(Optional) Add Syntax Highlighting.**
    *   **Verify Code Gen UI:** Build workflows, generate code, check modal, copy.

**Phase 5: Refinement**

11. **Task 5.1: Styling & Polish.**
12. **Task 5.2: Error Handling/Validation.**
13. **Task 5.3: Extended Features.**
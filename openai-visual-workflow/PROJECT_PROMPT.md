# OpenAI Agents Visual Workflow Designer - Improved Requirements

## 1. Overview

Create a web-based visual editor that allows users to design OpenAI Agent workflows by dragging, dropping, connecting, and configuring nodes representing Agents, Runners, and Function Tools. The editor should generate valid Python code using the `openai-agents` SDK based on the visual workflow.

## 2. Core Technologies

- **Frontend Framework:** React (using Vite for build tooling)
- **Visual Canvas:** React Flow (`reactflow`)
- **Styling:** Standard CSS (or CSS Modules/Styled Components if preferred)
- **Language:** JavaScript (JSX)

## 3. UI Layout

- **Three-Panel Layout:**
    - **Left Sidebar:** Fixed width (e.g., 200px). Contains draggable components (nodes).
    - **Center Canvas:** Flexible width, occupying the remaining space between the sidebars. This is where the React Flow graph is rendered.
    - **Right Config Panel:** Fixed width (e.g., 300px). Displays configuration options for the selected node.
- **Responsiveness:** The layout should handle standard screen sizes gracefully, but complex responsiveness is not a primary requirement. The center canvas should resize appropriately.
- **Scrolling:** The Right Config Panel should scroll vertically if its content overflows. The canvas itself will handle panning/zooming via React Flow controls.

## 4. Component Design (Nodes)

### 4.1 General Node Appearance
- Rounded rectangle shape.
- Clear header displaying the node's configured name.
- Consistent padding and font sizes.
- Connection handles (source/target points) clearly visible.

### 4.2 Agent Node (`type: 'agent'`)
- **Appearance**: Top border in Blue (`#3498db`). Header text also blue.
- **Handles**:
    - Target (Input): Top (for Runner connection), Left (for Tool/Guardrail connections).
    - Source (Output): Bottom (for Runner/Handoff connection), Right (for Handoff connection).
- **Basic Properties (Editable in Config Panel)**:
    - `name`: Text input (required, defaults to "Agent X").
    - `instructions`: Multi-line text area (required).
    - `handoff_description`: Text input (optional).
    - `output_type`: Dropdown selection (`None`, `Custom Pydantic`). (Pydantic model definition itself is out of scope for direct UI editing initially).
- **Display Properties (Read-only in Config Panel, derived from connections)**:
    - Connected Handoffs: List/count of connected target Agent nodes.
    - Connected Tools: List/count of connected source Function Tool nodes.
    - Connected Guardrails: List/count of connected source Guardrail nodes (if implemented).

### 4.3 Runner Node (`type: 'runner'`)
- **Appearance**: Top border in Red (`#e74c3c`). Header text also red.
- **Handles**:
    - Target (Input): Left (expects connection *from* an Agent node's Bottom or Right handle).
- **Basic Properties (Editable in Config Panel)**:
    - `name`: Text input (optional, for identifying the run, defaults to "Runner X").
    - `input`: Multi-line text area (for the initial input string).
    - `execution_mode`: Dropdown/Toggle (`Async`, `Sync`). Default: `Async`.
    - `context`: Multi-line text area for JSON input (optional). Basic validation (is it valid JSON?) is desirable.
- **Note**: A Runner node must be connected *from* an Agent node to generate valid execution code.

### 4.4 Function Tool Node (`type: 'function_tool'`)
- **Appearance**: Top border in Yellow (`#f39c12`). Header text also yellow.
- **Handles**:
    - Source (Output): Right (connects *to* an Agent node's Left handle).
- **Basic Properties (Editable in Config Panel)**:
    - `name`: Text input (required, should follow Python function naming conventions, defaults to "Function X").
    - `parameters`: (Advanced Feature) A way to define parameters (name, type hint). Initially, this can be deferred to the code editor.
    - `returnType`: Dropdown selection (`str`, `int`, `float`, `bool`, `list`, `dict`, `None`). Default: `str`.
    - `implementation`: Code editor area (e.g., using a simple `<textarea>` or a library like Monaco Editor if feasible) for the Python function body. Placeholder code should be generated based on name/return type.

### 4.5 Guardrail Node (`type: 'guardrail'`) - *Optional/Future*
- **Appearance**: Top border in Purple (`#9b59b6`). Header text also purple.
- **Handles**:
    - Source (Output): Right (connects *to* an Agent node's Left handle).
- **Properties**: TBD (e.g., reference to a guardrail function, connection to a guardrail Agent).

## 5. Connection Relationship Design (Edges)

- **Validation**: Implement connection validation using React Flow's `isValidConnection` prop.
    - Agent (Source: Bottom/Right) → Agent (Target: Top): Represents a handoff.
    - Function Tool (Source: Right) → Agent (Target: Left): Represents a tool relationship.
    - Guardrail (Source: Right) → Agent (Target: Left): Represents a guardrail relationship.
    - Agent (Source: Bottom/Right) → Runner (Target: Left): Represents an execution relationship.
- **Visuals**: Use default React Flow edges initially. Consider custom edge types or labels later if needed.

## 6. Code Generator Implementation (`/src/utils/codeGenerator.js`)

The generator function (`generatePythonCode(nodes, edges)`) must produce a valid Python script string based on the graph state.

- **Imports**: Dynamically include necessary imports (`Agent`, `Runner`, `asyncio`, `function_tool`, Pydantic `BaseModel` if needed).
- **Pydantic Models**: If `output_type` is "Custom Pydantic", generate a placeholder Pydantic class definition (or require the user to define it manually).
- **Function Tools**: Generate Python functions decorated with `@function_tool`, including type hints based on UI selections and the implementation code from the node's data. Sanitize node names for valid Python identifiers.
- **Agents**: Generate `Agent(...)` instantiations.
    - Include `name`, `instructions`.
    - Include `handoff_description` if provided.
    - Include `output_type` reference if specified (comment out if Pydantic model isn't auto-generated).
    - Populate `tools=[...]` based on incoming Function Tool connections.
    - Populate `handoffs=[...]` based on outgoing Agent connections (ensure correct handle usage if distinguishing from Runner connections).
    - Populate `input_guardrails=[...]` based on incoming Guardrail connections (if implemented).
- **Runner**: Generate `Runner.run(...)` or `Runner.run_sync(...)` calls.
    - Identify the connected Agent.
    - Use the `input` string from the Runner node data.
    - Include `context={...}` if valid JSON is provided.
    - Wrap in `async def main():` and `asyncio.run(main())` boilerplate if any asynchronous runs (`Runner.run`) are generated.
- **Error Handling**: The generator should handle disconnected Runners gracefully (e.g., add a comment). Basic sanitization of names/strings is needed.

## 7. User Interaction Design

1.  **Component Drag-and-Drop**:
    - Drag components from the Sidebar onto the Canvas.
    - Use HTML Drag and Drop API (`draggable`, `onDragStart`, `onDragOver`, `onDrop`).
    - `onDragStart`: Set data transfer type (`application/reactflow`) and node info (type, default name).
    - `onDrop` (on React Flow pane): Get data, calculate flow position using `screenToFlowPosition`, create new node object with unique ID, and update nodes state.
2.  **Node Connections**:
    - Use React Flow's built-in edge creation by dragging between handles.
    - Implement `onConnect` callback to add edges to state.
    - Implement `isValidConnection` to enforce rules defined in Section 5.
3.  **Node Configuration**:
    - `onNodeClick`: Update `selectedNode` state.
    - Config Panel: Renders form elements based on `selectedNode.type`.
    - Input/Textarea `onChange`: Update local component state and call an `onUpdateNodeData(nodeId, updatedData)` callback passed from the main App component to update the global nodes state immutably.
    - Debounce updates from text areas if performance becomes an issue.
4.  **Code Generation**:
    - "Generate Code" button in the Sidebar triggers generation.
    - Display generated code in a Modal component (`CodeModal.jsx`).
    - Modal should include syntax highlighting (e.g., using `react-syntax-highlighter` or similar) and a "Copy to Clipboard" button.
    - Display generation errors in the modal if they occur.

## 8. Styling (`style.css`)

- **Layout:** Use Flexbox for the main three-panel layout. Ensure the `.canvas-container` correctly fills the available space (e.g., using `flex: 1`).
- **React Flow Container:** Ensure the direct parent of the `<ReactFlow>` component has explicit `width` and `height` (e.g., `100%`), potentially using an inner wrapper `div` if needed to resolve rendering issues.
- **Node Styles:** Use CSS classes (`.react-flow__node-agent`, etc.) for specific node appearances (borders, header colors).
- **General:** Clean, modern interface, soft color palette, clear visual hierarchy.

## 9. Extended Features (Optional - If Time Allows)

1.  **Save/Load**: Export/Import workflow state (nodes, edges) as JSON.
2.  **Example Templates**: Provide pre-built examples.
3.  **Enhanced Code Editor**: Use Monaco Editor or CodeMirror for the Function Tool implementation field.
4.  **Workflow Validation**: Add visual cues or messages for errors (e.g., disconnected Runner).
5.  **Zoom/Pan Controls**: Ensure React Flow's `<Controls>` and `<MiniMap>` are included.
6.  **Delete Nodes/Edges**: Use React Flow's default delete key handling or add explicit delete buttons.
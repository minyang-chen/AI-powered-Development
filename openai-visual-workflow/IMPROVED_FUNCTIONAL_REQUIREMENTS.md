# OpenAI Agents Visual Workflow Designer - Improved Functional Requirements

## 1. Overview

Develop a web-based visual editor enabling users to design OpenAI Agent workflows. Users will interact with a graphical interface to add, configure, and connect nodes representing Agents, Runners, and Function Tools. The application must generate functional Python code based on the visual workflow, utilizing the `openai-agents` SDK.

## 2. Core Technologies

- **Frontend:** React, Vite
- **Canvas:** React Flow (`reactflow`)
- **Styling:** CSS (Specify method: e.g., Standard CSS, CSS Modules)

## 3. UI Layout & Styling

- **Structure:** Implement a three-panel layout using CSS Grid or Flexbox:
    - **Left Sidebar:** Fixed width (e.g., 200px), contains draggable node components. Must remain visible and not be obscured. `flex-shrink: 0` if using Flexbox.
    - **Center Canvas Area:** Flexible width (`1fr` track or `flex: 1`), occupies remaining horizontal space. This container (`.canvas-container`) must provide a stable rendering area for React Flow.
    - **Right Config Panel:** Fixed width (e.g., 300px), displays configuration for the selected node. Must remain visible. `flex-shrink: 0` if using Flexbox.
- **Height:** The entire application (`#root` and its parent elements `html`, `body`) must occupy 100% of the viewport height. The three panels should also occupy 100% of the application height.
- **React Flow Container Sizing:** The immediate parent container of the `<ReactFlow>` component *must* have explicit `width` and `height` (e.g., `100%`) defined either via CSS or inline styles *at the time React Flow renders*. Using an inner wrapper `div` with `style={{width: '100%', height: '100%'}}` inside the `.canvas-container` is the recommended approach if CSS inheritance proves unreliable. The `.canvas-container` itself should be sized by the parent layout (Grid/Flexbox).
- **Scrolling:** The Right Config Panel requires vertical scrolling (`overflow-y: auto`). The `.canvas-container` should hide overflow (`overflow: hidden`).
- **Appearance:** Clean, modern UI. Use provided color codes for node top borders and headers. Ensure sufficient padding and clear typography.

## 4. Component Design (Nodes)

### 4.1 General
- **Appearance:** Rounded rectangles, clear header with node name.
- **Handles:** Clearly defined source/target connection points.

### 4.2 Agent Node (`type: 'agent'`)
- **Appearance**: Blue top border/header (`#3498db`).
- **Handles**:
    - Target: Top (`id: 'a'`), Left (`id: 'b'`).
    - Source: Bottom (`id: 'c'`), Right (`id: 'd'`).
- **Configurable Properties**: `name` (text), `instructions` (textarea), `handoff_description` (text, optional), `output_type` (select: None/Custom Pydantic).
- **Display (Read-only)**: Connected Tools count, Connected Handoffs count.

### 4.3 Runner Node (`type: 'runner'`)
- **Appearance**: Red top border/header (`#e74c3c`).
- **Handles**:
    - Target: Left (`id: 'agent-input'`).
- **Configurable Properties**: `name` (text, optional), `input` (textarea), `execution_mode` (select: Async/Sync), `context` (textarea, JSON, optional).

### 4.4 Function Tool Node (`type: 'function_tool'`)
- **Appearance**: Yellow top border/header (`#f39c12`).
- **Handles**:
    - Source: Right (`id: 'tool-output'`).
- **Configurable Properties**: `name` (text), `parameters` (TBD/deferred), `returnType` (select: str, int, etc.), `implementation` (textarea - code editor).

## 5. Connection Logic (Edges)

- **Implementation:** Use React Flow's `onConnect` and `addEdge`.
- **Validation (`isValidConnection`)**: Enforce rules strictly based on **source/target node types AND handle IDs**:
    - Agent(`c` or `d`) -> Agent(`a`): OK (Handoff)
    - FunctionTool(`tool-output`) -> Agent(`b`): OK (Tool)
    - Agent(`c` or `d`) -> Runner(`agent-input`): OK (Execution)
    - *All other connection attempts should return `false`.*

## 6. State Management

- **Location:** The primary state (`nodes`, `edges`, `selectedNode`) should reside in the main `App` component (or a shared context/store).
- **Updates:** Configuration changes from `ConfigPanel` must update the main `nodes` state immutably via a callback function (`handleUpdateNodeData`). React Flow callbacks (`onNodesChange`, `onEdgesChange`, `onConnect`) also update state immutably.

## 7. Code Generator (`utils/codeGenerator.js`)

- **Input:** `nodes`, `edges` arrays.
- **Output:** Python script string.
- **Logic:**
    - **Imports:** Generate dynamically based on used features.
    - **Functions:** Generate `@function_tool` definitions. Sanitize names.
    - **Agents:** Generate `Agent()` instances.
        - **Tools:** Find incoming edges *from* FunctionTool nodes *to* the Agent's Left handle (`b`). Add corresponding function names to `tools=[]`.
        - **Handoffs:** Find outgoing edges *from* the Agent's Bottom/Right handles (`c`/`d`) *to* another Agent's Top handle (`a`). Add corresponding agent variable names to `handoffs=[]`.
    - **Runners:** Generate `Runner.run/run_sync()`.
        - Find incoming edge *from* an Agent's Bottom/Right handle (`c`/`d`) *to* the Runner's Left handle (`agent-input`). Use the source Agent variable name.
        - Include `input` and `context` (if valid JSON).
        - Determine async/sync based on `execution_mode`. Generate `asyncio` boilerplate if needed.
    - **Error Handling:** Add comments for disconnected Runners. Handle potential errors during generation gracefully.

## 8. User Interaction

- **Drag/Drop:** Implement using HTML Drag/Drop API and React Flow's `onDrop`, `onDragOver`. Ensure `screenToFlowPosition` is used correctly within the `ReactFlowProvider` context.
- **Selection:** Use `onNodeClick` to update `selectedNode` state.
- **Configuration:** `ConfigPanel` reflects `selectedNode` and uses `handleUpdateNodeData` callback for updates.
- **Code Gen Trigger:** Button in `Sidebar` calls `handleGenerateCode`.
- **Code Display:** Use a `CodeModal` component with copy functionality.

## 9. Error Handling & Validation

- **Connection Validation:** Strictly enforce rules via `isValidConnection`.
- **Code Generation:** Handle disconnected nodes gracefully (e.g., comments in generated code).
- **Config Input:** Basic validation for JSON context field. Consider validation for function/agent names.
- **React Flow Errors:** Ensure layout prevents the "parent container needs width/height" error.

## 10. Examples & Extended Features

- (Same as original prompt)

This revised prompt provides more explicit instructions regarding layout, state flow, connection logic, and code generation specifics, aiming to prevent the issues encountered during the initial implementation.
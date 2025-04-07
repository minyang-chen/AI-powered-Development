# OpenAI Agents Visual Workflow - High-Level Functional Requirements (Code Gen Focus)

## 1. Core Goal

To visually represent an OpenAI Agent workflow using interconnected nodes and generate functional Python code (`openai-agents` SDK) that accurately reflects the visual structure and configuration.

## 2. Essential Node Representations

The system must support visual nodes corresponding to key `openai-agents` concepts, storing the necessary data for code generation:

*   **Agent Node:**
    *   **Required Data:** `name` (for variable naming/Agent `name` param), `instructions`.
    *   **Optional Data:** `handoff_description`, `output_type` (influences potential Pydantic generation).
    *   **Implicit Data (from connections):** List of connected Function Tools, List of connected Handoff Agents.
*   **Runner Node:**
    *   **Required Data:** `input` string, `execution_mode` (Sync/Async).
    *   **Optional Data:** `context` (JSON string).
    *   **Implicit Data (from connections):** The single Agent connected as its input.
*   **Function Tool Node:**
    *   **Required Data:** `name` (for function definition name), `returnType`, `implementation` (Python code string).
    *   **Optional Data:** `parameters` (structure TBD, influences function signature).

## 3. Connection Semantics for Code Generation

Connections (edges) between nodes define relationships that directly map to SDK parameters:

*   **Function Tool -> Agent:** The `name` of the source Function Tool node is added to the target Agent's `tools=[]` list during code generation.
*   **Agent -> Agent:** The variable name representing the target Agent is added to the source Agent's `handoffs=[]` list.
*   **Agent -> Runner:** The variable name representing the source Agent is used as the target agent for the `Runner.run()` or `Runner.run_sync()` call.

*(Note: Specific handle IDs might be needed internally to differentiate connection types if multiple outputs exist, e.g., Agent->Agent vs Agent->Runner).*

## 4. Code Generation Logic Outline

A code generator function must perform the following:

1.  **Identify Nodes:** Separate nodes by type (Agent, Runner, Function Tool).
2.  **Generate Tools:** Create Python function definitions for each Function Tool node, decorated with `@function_tool`.
3.  **Generate Agents:** Instantiate each Agent node as a Python variable (`agent_name = Agent(...)`).
    *   Determine `tools=[]` list by analyzing incoming Function Tool connections.
    *   Determine `handoffs=[]` list by analyzing outgoing Agent connections.
    *   Include other configured properties (`name`, `instructions`, etc.).
4.  **Generate Runner Calls:** For each Runner node:
    *   Identify the connected input Agent.
    *   Generate the appropriate `Runner.run()` or `Runner.run_sync()` call using the Agent variable, `input`, `execution_mode`, and `context`.
5.  **Assemble Script:** Combine generated imports, tool definitions, agent definitions, and runner calls (including `asyncio` boilerplate if needed) into a single, valid Python script string.

## 5. Core UI Requirements (Minimal for Code Gen)

*   A mechanism to add nodes of the specified types to a canvas.
*   A mechanism to configure the required/optional data for each node type.
*   A mechanism to create connections between nodes according to the defined semantics.
*   A trigger to invoke the code generation logic using the current nodes and connections.
*   A way to display the generated code output.
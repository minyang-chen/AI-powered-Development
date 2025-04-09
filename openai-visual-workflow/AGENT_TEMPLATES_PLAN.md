# Agent Pattern Templates Plan

## Overview

Provide users with an option to select predefined agent patterns as starting points in the visual editor, instead of always starting with a blank canvas. This will use a dropdown menu in the sidebar and will clear the existing canvas when a template is loaded.

## Templates to Include

Based on the examples in `openai-agents-python/examples/agent_patterns`, the following templates will be implemented:

1.  **Basic Chat:** A single `Agent` node.
2.  **Function Calling:** An `Agent` node connected to a `Function Tool` node.
3.  **Routing (Handoff):** A central `Agent` (Triage) node connected via edges (representing handoffs) to two or more specialized `Agent` nodes.
4.  **LLM-as-a-Judge:** A sequence of two `Agent` nodes (e.g., Generator -> Judge).

## Implementation Steps

1.  **Define Template Structures:**
    *   Create a new utility file, e.g., `src/utils/templateData.js`.
    *   Inside this file, define JavaScript objects (or JSON) representing the node and edge configurations for each of the four templates listed above.
    *   Each template definition should include:
        *   A unique key/name (e.g., 'basicChat', 'functionCalling').
        *   A user-friendly display name (e.g., "Basic Chat", "Function Calling").
        *   An array of node objects compatible with React Flow (`id`, `type`, `position`, `data`). Include sensible default data (names, instructions).
        *   An array of edge objects compatible with React Flow (`id`, `source`, `target`).

2.  **Add Dropdown UI to `Sidebar.jsx`:**
    *   Modify `src/components/Sidebar.jsx`.
    *   Import the template definitions from `src/utils/templateData.js`.
    *   Add a `<select>` HTML element, likely within a new section or near the top/bottom. Label it clearly (e.g., "Load Template:").
    *   Add a default `<option>` like "-- Select Template --" with an empty value.
    *   Dynamically generate `<option>` elements for each defined template, using the template key as the `value` and the display name as the text.
    *   Add an `onChange` event handler to the `<select>` element.

3.  **Implement Template Loading Logic:**
    *   **In `App.jsx`:**
        *   Create a new callback function, e.g., `handleLoadTemplate = (templateKey) => { ... }`.
        *   This function will:
            *   Check if `templateKey` is valid (not the default empty value).
            *   Find the corresponding template data object using the `templateKey`.
            *   Clear the current canvas by calling `setNodes([])` and `setEdges([])`.
            *   Load the new template by calling `setNodes(templateData.nodes)` and `setEdges(templateData.edges)`.
            *   Consider adding a `reactFlowInstance.fitView()` call after setting nodes/edges to adjust the viewport.
    *   **Pass Handler to Sidebar:** Pass the `handleLoadTemplate` function as a prop to the `<Sidebar>` component, e.g., `<Sidebar ... onLoadTemplate={handleLoadTemplate} />`.
    *   **In `Sidebar.jsx`:**
        *   Accept the `onLoadTemplate` prop.
        *   The `onChange` handler for the `<select>` dropdown should call `onLoadTemplate(event.target.value)`.
        *   Reset the dropdown back to the default "-- Select Template --" option after loading (optional, but good UX).

## Summary of Changes

*   New `src/utils/templateData.js` file containing template definitions.
*   Modify `src/components/Sidebar.jsx` to include a template selection dropdown and call a new prop function on change.
*   Modify `src/App.jsx` to add the template loading logic (`handleLoadTemplate`) and pass it down to the Sidebar.
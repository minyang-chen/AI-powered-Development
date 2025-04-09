# Agent Template Runner Update Plan

## Overview

Update the existing agent pattern templates ("Basic Chat", "Function Calling", "Routing", "LLM-as-a-Judge") to include an initial `Agent Runner` node connected to the entry `Agent` node. This makes each template a runnable starting point.

## Implementation Steps

1.  **Modify Template Definitions (`src/utils/templateData.js`):**
    *   Locate the `agentTemplates` object within the file.
    *   For **each** of the four template keys (`basicChat`, `functionCalling`, `routing`, `llmAsJudge`):
        *   **Add Runner Node:** In the `nodes` array for the template, add a new node object:
            *   `id`: Generate a unique ID using the existing `getTemplateId` helper (e.g., `getTemplateId('runner')`). Store this ID for edge creation.
            *   `type`: `'runner'`
            *   `position`: Choose coordinates that place it logically before the entry agent (e.g., `{ x: 100, y: 50 }` if the agent is at `{ x: 300, y: 100 }`). Adjust existing node positions if necessary to make space.
            *   `data`: `{ label: 'Start Runner', name: 'Start Runner' }` (or similar default).
        *   **Add Connecting Edge:** In the `edges` array for the template, add a new edge object:
            *   `id`: Generate a unique ID (e.g., `getTemplateId('edge')`).
            *   `source`: The ID generated for the new `Runner` node.
            *   `target`: The ID of the primary/entry `Agent` node for that specific template.
            *   `type`: `'default'` (or the appropriate edge type if different).

2.  **Verify `getTemplate` Function:**
    *   Ensure the `getTemplate` helper function in `src/utils/templateData.js` correctly handles mapping the new Runner node IDs when generating fresh copies of templates, especially for the new connecting edge's `source` property. (The current implementation using `idMap` should handle this correctly).

## Summary of Changes

*   Modify the `nodes` and `edges` arrays within each template definition in `src/utils/templateData.js`.
*   No changes required in `App.jsx` or `Sidebar.jsx`.
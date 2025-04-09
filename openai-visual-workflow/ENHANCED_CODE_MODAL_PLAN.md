# Enhanced Code Modal Plan (with CodeMirror)

## Overview

Replace the simple code display in the existing `CodeModal.jsx` with an interactive code editor using `@uiw/react-codemirror`. This will allow users to view the generated Python code with syntax highlighting, make minor edits (like adding an API key), and easily copy the code for local execution. The code generator will also be updated to include an explicit placeholder for the OpenAI API key.

## Implementation Steps

1.  **Install Dependencies:**
    *   Run `npm install @uiw/react-codemirror @codemirror/lang-python @codemirror/theme-okaidia` (or choose a different theme package like `@codemirror/theme-github`).

2.  **Update Code Generator (`src/utils/codeGenerator.js`):**
    *   Ensure `import os` is added to the generated imports set.
    *   After the import block in the generated code, insert the following Python snippet:
        ```python
        # --- API Key Configuration ---
        # IMPORTANT: Replace "YOUR_API_KEY_HERE" with your actual OpenAI API key
        # or set the OPENAI_API_KEY environment variable before running.
        api_key = os.environ.get("OPENAI_API_KEY", "YOUR_API_KEY_HERE")
        if api_key == "YOUR_API_KEY_HERE":
            print("Warning: OPENAI_API_KEY not set. Using placeholder value.")
        # Note: Ensure the openai-agents SDK or your specific agent/runner setup
        # utilizes this 'api_key' variable or the environment variable directly.
        # ---------------------------

        ```

3.  **Enhance `CodeModal.jsx` (`src/components/CodeModal.jsx`):**
    *   **Import necessary components:**
        ```javascript
        import React, { useState, useCallback } from 'react';
        import CodeMirror from '@uiw/react-codemirror';
        import { python } from '@codemirror/lang-python';
        import { okaidia } from '@codemirror/theme-okaidia'; // Or your chosen theme
        ```
    *   **Manage Editor State:** Use `useState` to hold the current code content in the editor, initializing it with the `code` prop received from `App.jsx`.
        ```javascript
        const [editableCode, setEditableCode] = useState(code);
        ```
    *   **Handle Code Changes:** Create an `onChange` handler for the CodeMirror component to update the `editableCode` state.
        ```javascript
        const onChange = useCallback((value, viewUpdate) => {
          setEditableCode(value);
        }, []);
        ```
    *   **Replace `<pre>` with `<CodeMirror>`:**
        *   Remove the existing `<pre><code>...</code></pre>` block.
        *   Add the `<CodeMirror>` component:
            ```jsx
            <CodeMirror
              value={editableCode}
              height="400px" // Adjust height as needed
              theme={okaidia} // Apply theme
              extensions={[python()]} // Apply Python language support
              onChange={onChange}
              basicSetup={{ // Optional: configure basic features
                lineNumbers: true,
                foldGutter: true,
                // Add other setup options if desired
              }}
            />
            ```
    *   **Add "Copy Code" Button:**
        *   Add a button element.
        *   Implement an `onClick` handler that uses the `navigator.clipboard.writeText()` API to copy the current `editableCode` state to the clipboard. Provide user feedback (e.g., briefly changing button text to "Copied!").
    *   **(Optional) Add "Reset" Button:**
        *   Add a button.
        *   Implement an `onClick` handler that resets the `editableCode` state back to the original `code` prop value.

## Summary of Changes

*   Install CodeMirror dependencies.
*   Modify `src/utils/codeGenerator.js` to include API key placeholder code.
*   Overhaul `src/components/CodeModal.jsx` to use the `<CodeMirror>` component, manage editable state, and add a "Copy Code" button.
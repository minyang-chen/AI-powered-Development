# Collapsible Help Section Plan

## Overview

Add a collapsible quick reference section within the main application's sidebar (`src/components/Sidebar.jsx`) to provide users with instructions on how to use the visual editor.

## Implementation Steps

1.  **Define Instruction Content:**
    *   Prepare the text for the help section. Example points:
        *   **Adding Nodes:** "Drag nodes (Agent, Runner, Function Tool) from the left sidebar onto the canvas."
        *   **Connecting Nodes:** "Click and drag from the small circle (handle) on one node to the handle on another node to create a connection (edge)."
        *   **Configuring Nodes:** "Click on a node on the canvas to select it. Use the right panel to configure its specific properties (like name, system prompt, etc.)."
        *   **Generating Code:** "Click the 'Generate Code' button in the left sidebar to create Python code based on your workflow."
        *   **Navigation:** "Use mouse wheel to zoom, click and drag on the background to pan the canvas."
        *   **User:** "Your username is displayed above. Click 'Logout' to sign out."
    *   *(Actual text can be refined during implementation).*

2.  **Modify `Sidebar.jsx` (`src/components/Sidebar.jsx`):**
    *   **Import `useState`:** Add `import React, { useState } from 'react';`.
    *   **Add State:** Inside the `Sidebar` component function, add state for visibility: `const [isHelpVisible, setIsHelpVisible] = useState(false);`.
    *   **Add Toggle Button:** Add a button or clickable element within the sidebar's JSX. This button's `onClick` handler should toggle the state: `onClick={() => setIsHelpVisible(!isHelpVisible)}`. The button text should change based on the state (e.g., "Show Help" / "Hide Help").
    *   **Add Collapsible Section:** Below the toggle button, add a `div`. Use conditional rendering (`{isHelpVisible && ...}`) to show this `div` only when `isHelpVisible` is true.
    *   **Add Instructions:** Inside the conditionally rendered `div`, place the instruction text (from Step 1), formatted clearly (e.g., using `<h4>`, `<ul>`, `<li>`).

## Conceptual Code Snippet (`Sidebar.jsx`)

```jsx
import React, { useState } from 'react'; // Add useState

const Sidebar = ({ onGenerateCode, onLogout, username }) => {
  const [isHelpVisible, setIsHelpVisible] = useState(false); // State for visibility

  return (
    <aside className="sidebar">
      {/* ... existing username display ... */}
      <h3>Components</h3>
      {/* ... draggable nodes ... */}

      {/* Help Section Toggle */}
      <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        <button onClick={() => setIsHelpVisible(!isHelpVisible)} style={{ width: '100%', /* ... other styles */ }}>
          {isHelpVisible ? '▼ Hide Help' : '► Show Help'}
        </button>

        {/* Collapsible Help Content */}
        {isHelpVisible && (
          <div style={{ padding: '10px', /* ... other styles */ }}>
            <h4>Quick Reference</h4>
            <ul>
              <li><strong>Add Nodes:</strong> Drag from sidebar...</li>
              {/* ... other instructions ... */}
            </ul>
          </div>
        )}
      </div>

      {/* ... Generate Code and Logout buttons ... */}
    </aside>
  );
};
```

## Summary of Changes

*   All modifications will be contained within the `src/components/Sidebar.jsx` file.
*   No changes are required in `App.jsx` or other components for this approach.
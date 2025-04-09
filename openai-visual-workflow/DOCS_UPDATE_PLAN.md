# Documentation Update Plan

## Overview
Update the application's Landing Page and the in-app Help Instructions to reflect the addition of the Agent Pattern Templates feature.

## Implementation Steps

1.  **Update Landing Page (`src/pages/LandingPage.jsx`):**
    *   Locate the "Features" section (likely a `<ul>` element).
    *   Add a new list item (`<li>`) describing the templates feature.
    *   Example Text: "Start quickly with pre-built Agent Patterns."

2.  **Update Help Instructions (`src/components/Sidebar.jsx`):**
    *   Locate the conditionally rendered `div` for the help section (`{isHelpVisible && ...}`).
    *   Find the `<ul>` containing the instructions.
    *   Add a new list item (`<li>`) explaining the template dropdown.
    *   Example Text: "<strong>Load Template:</strong> Select a pattern from the dropdown to load a pre-built workflow (clears current canvas)."
    *   Review other instructions to ensure they remain accurate.

## Summary of Changes
*   Modify `src/pages/LandingPage.jsx` to add a feature bullet point.
*   Modify `src/components/Sidebar.jsx` to add a help instruction bullet point.
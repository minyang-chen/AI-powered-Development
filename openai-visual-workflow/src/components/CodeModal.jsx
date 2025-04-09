import React, { useState, useCallback, useEffect } from 'react'; // Added useEffect
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { okaidia } from '@uiw/codemirror-theme-okaidia'; // Or your chosen theme

// Inline styles for the modal overlay (background dimming)
const modalOverlayStyle = {
  position: 'fixed', // Position relative to the viewport
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  display: 'flex', // Use flexbox for centering
  alignItems: 'center', // Center vertically
  justifyContent: 'center', // Center horizontally
  zIndex: 1000, // Ensure modal is on top of other content
};

// Inline styles for the modal content area
const modalContentStyle = {
  backgroundColor: '#fff', // White background
  padding: '20px 30px', // Padding inside the modal
  borderRadius: '8px', // Rounded corners
  maxWidth: '80%', // Limit maximum width relative to viewport
  maxHeight: '80%', // Limit maximum height relative to viewport
  width: '700px', // Preferred fixed width
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)', // Drop shadow
  display: 'flex', // Use flexbox for internal layout
  flexDirection: 'column', // Stack elements vertically
};

// Inline styles for the container holding the modal buttons
const buttonContainerStyle = {
  display: 'flex', // Use flexbox for button alignment
  justifyContent: 'flex-end', // Align buttons to the right side
  marginTop: '15px', // Space above the buttons
};

// Base inline styles for modal buttons
const buttonStyle = {
  padding: '8px 15px', // Button padding
  marginLeft: '10px', // Space between buttons
  border: 'none', // No border
  borderRadius: '4px', // Rounded corners
  cursor: 'pointer', // Pointer cursor on hover
};

// Modal component to display generated code
const CodeModal = ({ code, onClose }) => { // Receives generated code string and close callback
  const [editableCode, setEditableCode] = useState(code); // State for editor content
  const [copyStatus, setCopyStatus] = useState('Copy');

  // Update editableCode if the incoming code prop changes (e.g., re-generating)
  useEffect(() => {
    setEditableCode(code);
    setCopyStatus('Copy'); // Reset copy status when code changes
  }, [code]);

  // Callback for editor changes
  const onEditorChange = useCallback((value, viewUpdate) => {
    setEditableCode(value);
    // Reset copy status if user edits the code
    if (copyStatus !== 'Copy') {
        setCopyStatus('Copy');
    }
  }, [copyStatus]); // Include copyStatus dependency

  // Callback function to handle copying the code to the clipboard
  const handleCopy = useCallback(async () => {
    try {
      // Use the modern navigator.clipboard API with the current editor content
      await navigator.clipboard.writeText(editableCode);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
      setCopyStatus('Failed!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }
  }, [editableCode]); // Dependency: use current editor content

  // If no code is provided (e.g., initially), don't render the modal
  // Note: We check the original 'code' prop, not 'editableCode'
  if (!code) return null;

  return (
    // Render the modal structure
    <div style={modalOverlayStyle} onClick={onClose}> {/* Overlay closes modal on click */}
      {/* Content area prevents click propagation to overlay */}
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h3>Generated Python Code</h3>
        {/* CodeMirror Editor */}
        <CodeMirror
          value={editableCode}
          height="400px" // Adjust height as needed
          theme={okaidia} // Apply theme
          extensions={[python()]} // Apply Python language support
          onChange={onEditorChange}
          basicSetup={{ // Optional: configure basic features
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            // Add other setup options if desired
          }}
          style={{ border: '1px solid #dee2e6', borderRadius: '4px', flexGrow: 1, overflow: 'hidden' }} // Added style for border and flex grow
        />
        <div style={buttonContainerStyle}>
          {/* Optional Reset Button */}
          <button
            onClick={() => setEditableCode(code)} // Reset to original code prop
            style={{ ...buttonStyle, backgroundColor: '#ffc107', color: 'black', marginRight: 'auto' }} // Align left
            disabled={editableCode === code} // Disable if not edited
          >
            Reset
          </button>
          {/* Copy button */}
          <button
            onClick={handleCopy} // Trigger copy handler
            style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white' }} // Apply base and specific styles
          >
            {copyStatus} {/* Display dynamic button text */}
          </button>
          {/* Close button */}
          <button
            onClick={onClose} // Trigger close callback
            style={{ ...buttonStyle, backgroundColor: '#6c757d', color: 'white' }} // Apply base and specific styles
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;
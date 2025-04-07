import React, { useState, useCallback } from 'react';

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

// Inline styles for the <pre> tag containing the code
const preStyle = {
  backgroundColor: '#f8f9fa', // Light background for code block
  border: '1px solid #dee2e6', // Subtle border
  borderRadius: '4px', // Rounded corners
  padding: '15px', // Padding around the code
  overflow: 'auto', // Enable horizontal and vertical scrolling if code overflows
  flexGrow: 1, // Allow the code block to fill available vertical space
  fontFamily: 'monospace', // Use a monospace font for code
  fontSize: '0.9em', // Slightly smaller font size
  whiteSpace: 'pre', // Preserve whitespace and line breaks from the code string
  maxHeight: 'calc(80vh - 150px)', // Limit height to prevent overly tall modals (adjust 150px based on header/button height)
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
  // State to manage the text displayed on the copy button ("Copy", "Copied!", "Failed!")
  const [copyStatus, setCopyStatus] = useState('Copy');

  // Callback function to handle copying the code to the clipboard
  const handleCopy = useCallback(async () => {
    try {
      // Use the modern navigator.clipboard API
      await navigator.clipboard.writeText(code);
      // Update button text to show success
      setCopyStatus('Copied!');
      // Reset button text after a short delay
      setTimeout(() => setCopyStatus('Copy'), 2000);
    } catch (err) {
      // Handle potential errors during copy (e.g., permissions)
      console.error('Failed to copy code: ', err);
      // Update button text to show failure
      setCopyStatus('Failed!');
      // Reset button text after a short delay
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }
  }, [code]); // Dependency: re-create callback if the 'code' prop changes

  // If no code is provided (e.g., initially), don't render the modal
  if (!code) return null;

  return (
    // Render the modal structure
    <div style={modalOverlayStyle} onClick={onClose}> {/* Overlay closes modal on click */}
      {/* Content area prevents click propagation to overlay */}
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <h3>Generated Python Code</h3>
        {/* Code display area */}
        <pre style={preStyle}>
          <code>{code}</code> {/* Display the code string */}
        </pre>
        <div style={buttonContainerStyle}>
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
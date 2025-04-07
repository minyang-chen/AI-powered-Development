import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Import the main application component
import { ReactFlowProvider } from 'reactflow'; // Import the context provider from React Flow
import '../style.css'; // Import global styles

// Get the root DOM element
const rootElement = document.getElementById('root');
// Create a React root
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  // React.StrictMode was removed for testing layout issues, can be re-added if desired
  // <React.StrictMode>
    // Wrap the entire application with ReactFlowProvider
    // This makes React Flow hooks (like useReactFlow) available to child components
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  // </React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import React Router components
import App from './App.jsx'; // Import the main application component
import { ReactFlowProvider } from 'reactflow'; // Import the context provider from React Flow
import LoginPage from './pages/LoginPage.jsx'; // Import Login Page
import RegisterPage from './pages/RegisterPage.jsx'; // Import Register Page
import AuthLayout from './layouts/AuthLayout.jsx'; // Import Auth Layout
import LandingPage from './pages/LandingPage.jsx'; // Import Landing Page
import '../style.css'; // Import global styles

// Get the root DOM element
const rootElement = document.getElementById('root');
// Create a React root
const root = ReactDOM.createRoot(rootElement);

// Render the application with routing
root.render(
  // <React.StrictMode> // Can be re-added if desired
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LandingPage />} /> {/* Add Landing Page route */}

        {/* Protected route for the main application */}
        <Route
          path="/app" // Change protected route path to /app
          element={
            <AuthLayout> {/* AuthLayout checks login status */}
              <ReactFlowProvider> {/* ReactFlowProvider needed for App */}
                <App />
              </ReactFlowProvider>
            </AuthLayout>
          }
        />
        {/* Add other protected routes here if needed */}
      </Routes>
    </BrowserRouter>
  // </React.StrictMode>
);
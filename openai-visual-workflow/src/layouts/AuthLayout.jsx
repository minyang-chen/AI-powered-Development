import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// This component wraps protected routes/pages.
// It checks if the user is logged in based on localStorage.
function AuthLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Start with null to indicate loading state
  const location = useLocation(); // Get current location for redirect state

  useEffect(() => {
    // Check login status from localStorage when the component mounts or location changes
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, [location]); // Re-check if the route changes

  // While checking status, don't render anything (or show a loader)
  if (isLoggedIn === null) {
    return null; // Or return <LoadingSpinner />;
  }

  // If logged in, render the child components (the protected page)
  if (isLoggedIn) {
    return children;
  }

  // If not logged in, redirect to the login page.
  // We pass the current location in state so the login page can redirect back after successful login (optional).
  return <Navigate to="/login" state={{ from: location }} replace />;
}

export default AuthLayout;
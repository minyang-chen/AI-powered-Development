import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // --- Basic Local Storage Login Logic ---
    // WARNING: Storing passwords directly is insecure. This is for demonstration only.
    try {
      const users = JSON.parse(localStorage.getItem('app_users') || '{}');
      if (users[username] && users[username] === password) {
        // Login successful
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', username);
        navigate('/app'); // Redirect to the main app page
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      console.error("Error reading or parsing user data from localStorage:", err);
      setError('An error occurred during login. Please try again.');
    }
    // --- End Login Logic ---
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 15px', marginRight: '10px' }}>Login</button>
        <Link to="/register">Need an account? Register</Link>
      </form>
    </div>
  );
}

export default LoginPage;
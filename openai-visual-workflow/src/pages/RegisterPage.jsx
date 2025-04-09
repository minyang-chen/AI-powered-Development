import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // --- Basic Local Storage Registration Logic ---
    // WARNING: Storing passwords directly is insecure. This is for demonstration only.
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!username || !password) {
        setError('Username and password cannot be empty.');
        return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('app_users') || '{}');

      if (users[username]) {
        setError('Username already exists. Please choose another.');
        return;
      }

      // Add new user
      users[username] = password; // Store password directly (insecure)
      localStorage.setItem('app_users', JSON.stringify(users));

      // Registration successful - redirect to login
      navigate('/login');

    } catch (err) {
      console.error("Error reading/writing user data to localStorage:", err);
      setError('An error occurred during registration. Please try again.');
    }
    // --- End Registration Logic ---
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 15px', marginRight: '10px' }}>Register</button>
        <Link to="/login">Already have an account? Login</Link>
      </form>
    </div>
  );
}

export default RegisterPage;
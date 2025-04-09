import React from 'react';
import { Link } from 'react-router-dom';

// Basic inline styles (consider moving to a CSS file for larger applications)
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '960px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
  },
  hero: {
    padding: '60px 20px',
    backgroundColor: '#f4f4f4',
    marginBottom: '30px',
    borderRadius: '8px',
  },
  headline: {
    fontSize: '2.5em',
    marginBottom: '10px',
  },
  tagline: {
    fontSize: '1.2em',
    color: '#555',
    marginBottom: '30px',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '12px 25px',
    margin: '0 10px',
    fontSize: '1em',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  registerButton: {
    backgroundColor: '#28a745', // Green for register
  },
  features: {
    padding: '30px 0',
  },
  featureList: {
    display: 'flex',
    justifyContent: 'space-around',
    listStyle: 'none',
    padding: 0,
    flexWrap: 'wrap', // Allow wrapping on smaller screens
  },
  featureItem: {
    flexBasis: '30%', // Adjust as needed
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '5px',
    minWidth: '200px', // Ensure items don't get too small
  },
  footer: {
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    fontSize: '0.9em',
    color: '#777',
  }
};

function LandingPage() {
  return (
    <div style={styles.container}>
      {/* Added Header */}
      <h1 style={{ marginTop: '20px', marginBottom: '40px', color: '#333' }}>OpenAI Agents Designer</h1>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.headline}>Build Workflows Visually</h1>
        <p style={styles.tagline}>Design, configure, and generate code for complex agent workflows with ease.</p>
        <div>
          <Link to="/login" style={styles.ctaButton}>Login</Link>
          <Link to="/register" style={{...styles.ctaButton, ...styles.registerButton}}>Sign Up</Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2>Key Features</h2>
        <ul style={styles.featureList}>
          <li style={styles.featureItem}>
            <h3>Intuitive Drag & Drop</h3>
            <p>Easily construct workflows by dragging nodes onto the canvas.</p>
          </li>
          <li style={styles.featureItem}>
            <h3>Code Generation</h3>
            <p>Automatically generate executable Python code from your visual design.</p>
          </li>
          <li style={styles.featureItem}>
            <h3>Customizable Nodes</h3>
            <p>Configure agents, runners, and tools to fit your specific needs.</p>
          </li>
          {/* Added Feature Item */}
          <li style={styles.featureItem}>
            <h3>Agent Templates</h3>
            <p>Start quickly with pre-built Agent Patterns like Function Calling and Routing.</p>
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Visual Workflow Builder. All rights reserved.</p>
        {/* Optional: Add links for Terms/Privacy later */}
        {/* <p><Link to="/terms">Terms of Service</Link> | <Link to="/privacy">Privacy Policy</Link></p> */}
      </footer>
    </div>
  );
}

export default LandingPage;
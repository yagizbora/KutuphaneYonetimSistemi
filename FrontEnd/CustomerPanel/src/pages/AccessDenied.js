import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="access-denied-container">
      <div className="access-denied-content">
        <h1>Access Denied</h1>
        <p>You dont have permission to access this page.</p>
        <div className="action-buttons">
          <Link to="/" className="home-link">
            Go to Home
          </Link>
          <Link to="/login" className="login-link">
            Login with Different Account or go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied; 
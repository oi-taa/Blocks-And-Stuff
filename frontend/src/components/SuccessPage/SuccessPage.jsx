// src/components/SuccessPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './SuccessPage.css';

const SuccessPage = () => {
  return (
    <div className="success-page">
      <div className="success-message">
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase.</p>
        <div className="go-home-button">
          <Link to="/" className="home-link">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;

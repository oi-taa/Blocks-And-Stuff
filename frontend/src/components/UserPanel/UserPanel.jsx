// UserPanel.jsx
import React, { useState } from 'react';
import './UserPanel.css'; // Custom CSS file for styling
import profile_icon from '../assets/user_profile.png'; // Assuming you have a profile icon

const UserPanel = () => {
  const [selectedOption, setSelectedOption] = useState('Account');

  const renderContent = () => {
    switch (selectedOption) {
      case 'Account':
        return <AccountDetails />;
      case 'Orders':
        return <OrderHistory />;
      case 'Payment':
        return <PaymentMethods />;
      case 'Settings':
        return <AccountSettings />;
      default:
        return <AccountDetails />;
    }
  };

  return (
    <div className="user-panel">
      <div className="user-panel-sidebar">
        <div className="user-panel-header">
          <img src={profile_icon} alt="Profile" className="profile-pic" />
          <div className="user-info">
            <h2>John Doe</h2>
            <p>ID: 12345678</p> {/* Replace with dynamic user ID from payline */}
          </div>
        </div>
        <nav className="user-panel-nav">
          <button onClick={() => setSelectedOption('Account')}>Account</button>
          <button onClick={() => setSelectedOption('Orders')}>Order History</button>
          <button onClick={() => setSelectedOption('Payment')}>Payment Methods</button>
          <button onClick={() => setSelectedOption('Settings')}>Settings</button>
          <button  className="logout-button" onClick={() => {
            localStorage.removeItem('auth-token');
            window.location.replace('/');
          }}>Logout</button>
        </nav>
      </div>
      <div className="user-panel-content">
        {renderContent()}
      </div>
    </div>
  );
};

// Components for different sections
const AccountDetails = () => <div>Account Details Content</div>;
const OrderHistory = () => <div>Order History Content</div>;
const PaymentMethods = () => <div>Payment Methods Content</div>;
const AccountSettings = () => <div>Account Settings Content</div>;

export default UserPanel;

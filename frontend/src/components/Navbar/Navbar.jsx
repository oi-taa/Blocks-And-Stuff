import React, { useContext, useState } from 'react';
import './Navbar.css'; 
import logo from '../assets/logo.png';
import cart_icon from '../assets/cart_icon.png';
import profile_icon from '../assets/user_profile.png'; // Assuming you have a profile icon
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const { getTotalCartItems } = useContext(ShopContext);
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleClick = (index) => {
    setActiveTab(index);
  };

  const handleProfileClick = () => {
    navigate('/userpanel'); // Navigate to UserProfile component
  };

  const isLoggedIn = !!localStorage.getItem('auth-token'); // Check if user is logged in

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="logo" onClick={() => window.location.href = '/'} />
        <p className="header" onClick={() => window.location.href = '/'}>SHOPPER</p>
      </div>
      <ul className="nav-menu">
        <li className={activeTab === 0 ? 'active' : ''} onClick={() => handleClick(0)}>
          <Link style={{ textDecoration: 'none', color: '#f00000' }} to='/'>Shop</Link>
        </li>
        <li className={activeTab === 1 ? 'active' : ''} onClick={() => handleClick(1)}>
          <Link style={{ textDecoration: 'none', color: '#f00000' }} to='/mens'>Men</Link>
        </li>
        <li className={activeTab === 2 ? 'active' : ''} onClick={() => handleClick(2)}>
          <Link style={{ textDecoration: 'none', color: '#f00000' }} to='/womens'>Women</Link>
        </li>
        <li className={activeTab === 3 ? 'active' : ''} onClick={() => handleClick(3)}>
          <Link style={{ textDecoration: 'none', color: '#f00000' }} to='/kids'>Kids</Link>
        </li>
      </ul>

      <div className="nav-login-cart">
        {isLoggedIn ? (
          <button className="login-signup" onClick={() => {
            localStorage.removeItem('auth-token');
            window.location.replace('/');
          }}>Logout</button>
        ) : (
          <Link to='/login'><button className="login-signup">Login</button></Link>
        )}
        
        <Link to='/cart'><img src={cart_icon} alt="cart" /></Link>
        {isLoggedIn && (
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        )}
        
        {/* User Profile Icon */}
        {isLoggedIn && (
          <img 
            src={profile_icon} 
            alt="profile" 
            className="profile-icon" 
            onClick={handleProfileClick} 
            style={{ cursor: 'pointer', marginLeft: '10px', width: '30px', height: '30px', borderRadius: '50%' }}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;

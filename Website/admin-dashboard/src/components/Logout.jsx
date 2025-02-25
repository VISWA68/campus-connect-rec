import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Logout.css';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import recLogo from '../assets/REC_logo.jpg';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="logout-container">
      <div className="logout-card">
        <div className="logout-header">
          <img src={recLogo} alt="REC Logo" className="logout-logo" />
          <h2>Confirm Logout</h2>
        </div>
        
        <div className="logout-content">
          <FaSignOutAlt className="logout-icon" />
          <p>Are you sure you want to logout?</p>
          <p className="logout-subtitle">You will be returned to the login screen</p>
        </div>

        <div className="logout-buttons">
          <button className="logout-button confirm" onClick={handleLogout}>
            <FaSignOutAlt />
            Yes, Logout
          </button>
          <button className="logout-button cancel" onClick={handleCancel}>
            <FaTimes />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;

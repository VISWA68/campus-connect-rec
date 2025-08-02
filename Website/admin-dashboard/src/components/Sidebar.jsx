import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsersCog, FaSignOutAlt, FaKey } from 'react-icons/fa';
import '../styles/Sidebar.css';
import recLogo from '../assets/REC_logo.jpg';

const Sidebar = () => {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={recLogo} alt="REC Logo" className="rec-logo" />
      </div>
      <div className="sidebar-header">Admin Panel</div>
      <ul className="sidebar-menu">
        <li className={location.pathname === '/dashboard' ? 'active' : ''}>
          <Link to="/dashboard">
            <FaHome className="sidebar-icon" />
            <span>Dashboard</span>
          </Link>
        </li>
        {userRole === 'admin' && (
          <li className={location.pathname === '/credentials' ? 'active' : ''}>
            <Link to="/credentials">
              <FaKey className="sidebar-icon" />
              <span>Manage Coordinators</span>
            </Link>
          </li>
        )}
        <li className={location.pathname === '/settings' ? 'active' : ''}>
          <Link to="/settings">
            <FaUsersCog className="sidebar-icon" />
            <span>Settings</span>
          </Link>
        </li>
        <li className={location.pathname === '/logout' ? 'active' : ''}>
          <Link to="/logout">
            <FaSignOutAlt className="sidebar-icon" />
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
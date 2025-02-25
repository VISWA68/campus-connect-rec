import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import recLogo from '../assets/REC_logo.jpg';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Please enter your email');
      return false;
    }
    if (!formData.email.endsWith('@rajalakshmi.edu.in')) {
      setError('Please use your Rajalakshmi email address');
      return false;
    }
    if (!formData.password) {
      setError('Please enter your password');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Hardcoded admin for safety
      if (formData.email === 'admin@rajalakshmi.edu.in') {
        if (formData.password === '123456789') {
          localStorage.setItem('userRole', 'admin');
          localStorage.setItem('userToken', 'admin-token-123');
          localStorage.setItem('adminEmail', formData.email);
          navigate('/dashboard');
          return;
        } else {
          setError('Invalid password for admin account');
          return;
        }
      }

      // For all other users, verify against the database
      const response = await fetch('http://172.16.59.107:5000/login_event_admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Login successful
      localStorage.setItem('userRole', 'coordinator');
      localStorage.setItem('userToken', 'coordinator-token');
      localStorage.setItem('adminEmail', formData.email);
      localStorage.setItem('adminEvents', JSON.stringify(data.events)); // Store admin's events
      
      navigate('/post-event');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={recLogo} alt="REC Logo" className="login-logo" />
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Please login to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              <FaEnvelope className="input-icon" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={error && !formData.email ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock className="input-icon" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={error && !formData.password ? 'error' : ''}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            <FaSignInAlt className="button-icon" />
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>&copy; 2024 Rajalakshmi Engineering College. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

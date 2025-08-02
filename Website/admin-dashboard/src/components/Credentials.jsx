import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaSpinner } from 'react-icons/fa';
import Sidebar from './Sidebar';
import '../styles/Credentials.css';

const Credentials = () => {
  const [newCoordinator, setNewCoordinator] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Base URL for API
  const API_BASE_URL = 'http://172.16.59.107:5000';

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoordinator(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  // Handle coordinator registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/register_event_admin`, newCoordinator);
      console.log('Registration response:', response.data);
      setSuccess('Event coordinator registered successfully');
      setNewCoordinator({ email: '', password: '' });
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to register coordinator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="credentials-container">
          <div className="credentials-header">
            <h2>Manage Event Coordinators</h2>
            <p>Add event coordinator access</p>
          </div>

          <div className="credentials-form-container">
            <form onSubmit={handleRegister} className="credentials-form">
              <div className="form-group">
                <label htmlFor="email">Coordinator Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newCoordinator.email}
                  onChange={handleInputChange}
                  placeholder="Enter coordinator email"
                  pattern=".*@rajalakshmi\.edu\.in$"
                  title="Please use a Rajalakshmi email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newCoordinator.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  minLength="8"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <button type="submit" className="add-button" disabled={loading}>
                {loading ? (
                  <><FaSpinner className="spinner" /> Adding...</>
                ) : (
                  <><FaUserPlus /> Add Coordinator</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Credentials;

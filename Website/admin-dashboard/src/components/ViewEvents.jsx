import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ViewEvents.css';
import { FaCalendarAlt, FaUserFriends, FaMoneyBillWave, FaClock, FaExclamationCircle } from 'react-icons/fa';
import recLogo from '../assets/REC_logo.jpg';

const EventSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={recLogo} alt="REC Logo" className="rec-logo" />
      </div>
      <div className="sidebar-header">Event Management</div>
      <ul className="sidebar-menu">
        <li><Link to="/post-event">Post Event</Link></li>
        <li><Link to="/view-events" className="active">View Events</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </div>
  );
};

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const adminEmail = localStorage.getItem('adminEmail');
        if (!adminEmail) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://172.16.59.107:5000/get_admin_events/${adminEmail}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch events');
        }

        setEvents(data.events);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="app-container">
        <EventSidebar />
        <div className="main-content">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <EventSidebar />
        <div className="main-content">
          <div className="error-message">
            <FaExclamationCircle className="error-icon" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <EventSidebar />
      <div className="main-content">
        {events.length === 0 ? (
          <div className="no-events">
            <FaCalendarAlt className="no-events-icon" />
            <h2>No Events Found</h2>
            <p>You haven't created any events yet.</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.event_id} className="event-card">
                <div className="event-card-header">
                  <h2 className="event-name">{event.event_name}</h2>
                  <span className="event-status">Active</span>
                </div>
                
                <div className="event-details">
                  <div className="event-detail">
                    <FaCalendarAlt className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Start Date</span>
                      <span className="detail-value">{formatDate(event.start_date)}</span>
                    </div>
                  </div>
                  
                  <div className="event-detail">
                    <FaClock className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">End Date</span>
                      <span className="detail-value">{formatDate(event.end_date)}</span>
                    </div>
                  </div>
                  
                  <div className="event-detail">
                    <FaUserFriends className="detail-icon" />
                    <div className="detail-content">
                      <span className="detail-label">Organized By</span>
                      <span className="detail-value">{event.organized_by}</span>
                    </div>
                  </div>
                  
                  <div className="event-description">
                    <p>{event.description}</p>
                  </div>
                  
                  <div className="event-footer">
                    <div className="event-price">
                      <FaMoneyBillWave className="price-icon" />
                      <span>₹{event.pricing}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEvents;

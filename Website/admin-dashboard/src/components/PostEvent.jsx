import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/PostEvent.css';
import { FaCalendarAlt, FaUserFriends, FaClock, FaMapMarkerAlt, FaFileAlt, FaImage, FaPaperPlane, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
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
        <li><Link to="/view-events">View Events</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </div>
  );
};

const PostEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    event_name: '',
    start_date: '',
    end_date: '',
    organized_by: '',
    description: '',
    pricing: '',
    admin_email: localStorage.getItem('adminEmail') || ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('adminEmail');
    if (storedEmail && storedEmail !== eventData.admin_email) {
      setEventData(prev => ({ ...prev, admin_email: storedEmail }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://172.16.59.107:5000/create_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const data = await response.json();
      alert('Event created successfully!');
      setEventData({
        event_name: '',
        start_date: '',
        end_date: '',
        organized_by: '',
        description: '',
        pricing: '',
        admin_email: localStorage.getItem('adminEmail') || ''
      });
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <EventSidebar />
      <div className="post-event-container">
        <div className="post-event-content">
          <div className="post-event-header">
            <div className="header-left">
              <h1>Event Management</h1>
              <p className="header-subtitle">Create and manage your events</p>
            </div>
            <div className="header-right">
              <span className="coordinator-badge">
                Event Coordinator
              </span>
            </div>
          </div>

          <div className="post-event-card">
            <div className="card-header">
              <FaCalendarAlt className="header-icon" />
              <h2>Post New Event</h2>
              <p className="subtitle">Fill in the details below to create a new event</p>
            </div>

            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <FaCalendarAlt className="icon" />
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="event_name"
                    value={eventData.event_name}
                    onChange={handleInputChange}
                    placeholder="Enter event name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaCalendarAlt className="icon" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={eventData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaCalendarAlt className="icon" />
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={eventData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaUserFriends className="icon" />
                    Organized By
                  </label>
                  <input
                    type="text"
                    name="organized_by"
                    value={eventData.organized_by}
                    onChange={handleInputChange}
                    placeholder="Enter organizer name"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>
                    <FaFileAlt className="icon" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={eventData.description}
                    onChange={handleInputChange}
                    placeholder="Enter event description"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaMoneyBillWave className="icon" />
                    Pricing
                  </label>
                  <input
                    type="number"
                    name="pricing"
                    value={eventData.pricing}
                    onChange={handleInputChange}
                    placeholder="Enter event price"
                    required
                  />
                </div>

                <input
                  type="hidden"
                  name="admin_email"
                  value={eventData.admin_email}
                />

                <div className="form-group">
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Event...' : 'Create Event'}
                    <FaPaperPlane className="icon" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEvent;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Report.css";

const Report = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      //const response = await fetch(`http://192.168.219.231:5000/get_user_details/${userId}`);
      const response = await fetch(`http://172.16.59.107:5000/get_user_details/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      setUserData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    try {
      const response = await fetch(`http://192.168.219.231:5000/user_action/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      // Show success message
      alert(`Successfully ${action}ed user`);
      
      // Refresh user data after action
      fetchUserDetails();
    } catch (err) {
      setError(err.message);
      alert(`Failed to ${action} user: ${err.message}`);
    }
  };

  const getRiskBadge = (reportCount) => {
    if (reportCount >= 5) {
      return <span className="risk-badge high">High Risk</span>;
    } else if (reportCount >= 3) {
      return <span className="risk-badge medium">Medium Risk</span>;
    } else {
      return <span className="risk-badge low">Low Risk</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="report-page">
        <Sidebar />
        <div className="report-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-page">
        <Sidebar />
        <div className="report-content">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <Sidebar />
      <div className="report-content">
        <div className="report-header">
          <h1>Student Report Details</h1>
          <button className="back-button" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>

        <div className="report-card user-info">
          <h2>User Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Email:</label>
              <span>{userData.email}</span>
            </div>
            <div className="info-item">
              <label>Name:</label>
              <span>{userData.user_name}</span>
            </div>
            <div className="info-item">
              <label>Report Count:</label>
              <span>
                {userData.report_count} {getRiskBadge(userData.report_count)}
              </span>
            </div>
            <div className="info-item">
              <label>First Reported:</label>
              <span>{formatDate(userData.first_reported_at)}</span>
            </div>
          </div>
        </div>

        <div className="report-card messages">
          <h2>Reported Messages</h2>
          <div className="messages-list">
            {userData.messages.map((message, index) => (
              <div key={index} className="message-item">
                <div className="message-time">
                  {formatDate(message.reported_at)}
                </div>
                <div className="message-content">{message.content}</div>
                <div className="report-reason">
                  Reason: {message.report_reason || "Inappropriate content"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="report-card actions">
          <h2>Actions</h2>
          <div className="action-buttons">
            <button
              className="action-button warn"
              onClick={() => handleAction("warn")}
            >
              Send Warning
            </button>
            <button
              className="action-button ban"
              onClick={() => handleAction("ban")}
            >
              Ban User
            </button>
            <button
              className="action-button dismiss"
              onClick={() => handleAction("dismiss")}
            >
              Dismiss Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;

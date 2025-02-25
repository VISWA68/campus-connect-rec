import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/StudentDetails.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const StudentDetails = () => {
  const { registerNumber } = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleMessages, setVisibleMessages] = useState({});

  useEffect(() => {
    fetchStudentDetails();
  }, [registerNumber]);

  const fetchStudentDetails = async () => {
    try {
      const response = await fetch(`http://172.16.59.107:5000/get_reported_messages`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const student = data.reported_users.find(user => user.user_id === registerNumber);
      if (!student) {
        throw new Error("Student not found");
      }
      setStudentData(student);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getSeverityLevel = (messageCount) => {
    if (messageCount >= 5) return 'high';
    if (messageCount >= 3) return 'moderate';
    return 'low';
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const toggleMessage = (index) => {
    setVisibleMessages(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) return <div className="loading">Loading student details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!studentData) return <div className="no-data">No student data available</div>;

  return (
    <div className="student-details">
      <Sidebar />
      <div className="details-container">
        <h2>Student Details</h2>
        <div className="card student-info">
          <h3>{studentData.user_name}</h3>
          <p><strong>Email:</strong> {studentData.email}</p>
          <p><strong>Report Count:</strong> {studentData.report_count}</p>
          <p><strong>First Reported:</strong> {formatDate(studentData.first_reported_at)}</p>
          <p><strong>Severity Level:</strong> {getSeverityLevel(studentData.report_count)}</p>
        </div>

        <div className="card reports-section">
          <h3>Reported Messages</h3>
          <div className="reports-list">
            {studentData.messages && studentData.messages.map((message, index) => (
              <div key={index} className={`report-card severity-${getSeverityLevel(index + 1)}`}>
                <div className="report-header">
                  <h4>Report #{index + 1}</h4>
                  <span className="report-date">{formatDate(message.reported_at)}</span>
                </div>
                <div className="report-content">
                  <div className="message-container">
                    <button 
                      className="toggle-message-btn"
                      onClick={() => toggleMessage(index)}
                    >
                      {visibleMessages[index] ? (
                        <><FaEyeSlash /> Hide Message</>
                      ) : (
                        <><FaEye /> View Message</>
                      )}
                    </button>
                    {visibleMessages[index] && (
                      <p className="message-text">
                        <strong>Message:</strong> {message.message}
                      </p>
                    )}
                  </div>
                  <p><strong>Severity:</strong> {getSeverityLevel(index + 1)}</p>
                  <p><strong>Reported By:</strong> {message.reported_by || 'Anonymous'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="back-button" onClick={() => navigate(-1)}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default StudentDetails;
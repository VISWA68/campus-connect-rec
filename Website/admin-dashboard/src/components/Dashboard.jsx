import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import Sidebar from "./Sidebar";
import "./../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [reportedUsers, setReportedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    severityDistribution: [],
    reportTimeline: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchReportedMessages();
  }, []);

  const fetchReportedMessages = async () => {
    try {
      const response = await fetch("http://172.16.59.107:5000/get_reported_messages");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setReportedUsers(data.reported_users);
      processAnalytics(data.reported_users);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const processAnalytics = (users) => {
    // Process severity distribution
    const severityCount = {
      low: 0,
      moderate: 0,
      high: 0
    };

    users.forEach(user => {
      if (user.report_count >= 5) severityCount.high++;
      else if (user.report_count >= 3) severityCount.moderate++;
      else severityCount.low++;
    });

    const severityDistribution = [
      { name: "Low Risk", value: severityCount.low, color: "#2ecc71" },
      { name: "Moderate Risk", value: severityCount.moderate, color: "#f1c40f" },
      { name: "High Risk", value: severityCount.high, color: "#e74c3c" }
    ];

    // Process report timeline
    const timelineMap = new Map();
    users.forEach(user => {
      user.messages.forEach(msg => {
        const date = new Date(msg.reported_at).toLocaleDateString();
        timelineMap.set(date, (timelineMap.get(date) || 0) + 1);
      });
    });

    const reportTimeline = Array.from(timelineMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // Last 7 days

    // Process recent activity
    const recentActivity = users
      .map(user => ({
        name: user.user_name || "Unknown User",
        reports: user.report_count,
        lastReport: new Date(user.first_reported_at).getTime()
      }))
      .sort((a, b) => b.lastReport - a.lastReport)
      .slice(0, 5);

    setAnalytics({
      severityDistribution,
      reportTimeline,
      recentActivity
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Student Reports Dashboard</h1>
        
        <div className="analytics-grid">
          {/* Summary Cards */}
          <div className="analytics-cards">
            <div className="analytics-card total">
              <h3>Total Reports</h3>
              <div className="card-value">{reportedUsers.reduce((sum, user) => sum + user.report_count, 0)}</div>
            </div>
            <div className="analytics-card high-risk">
              <h3>High Risk Students</h3>
              <div className="card-value">{reportedUsers.filter(user => user.report_count >= 5).length}</div>
            </div>
            <div className="analytics-card active">
              <h3>Active Cases</h3>
              <div className="card-value">{reportedUsers.length}</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            {/* Severity Distribution */}
            <div className="chart-container">
              <h3>Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.severityDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {analytics.severityDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Report Timeline */}
            <div className="chart-container">
              <h3>Report Timeline (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.reportTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3498db" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="chart-container">
              <h3>Recent Reports by Student</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reports" fill="#3498db" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="table-container">
          <h3>Reported Students</h3>
          <table className="student-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Report Count</th>
                <th>First Reported</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportedUsers.map((user) => (
                <tr key={user.user_id} className={user.report_count >= 3 ? 'high-risk-row' : ''}>
                  <td>{user.email}</td>
                  <td>{user.user_name}</td>
                  <td>
                    <span className={`report-badge count-${user.report_count >= 5 ? 'high' : 'low'}`}>
                      {user.report_count}
                    </span>
                  </td>
                  <td>{new Date(user.first_reported_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="view-button" 
                      onClick={() => navigate(`/student/${user.user_id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import StudentDetails from "./components/StudentDetails";
import Logout from "./components/Logout";
import Login from "./components/Login";
import PostEvent from "./components/PostEvent";
import ViewEvents from "./components/ViewEvents";
import Credentials from "./components/Credentials";
import "./App.css";

// Protected Route component with role-based access
const ProtectedRoute = ({ children, allowedRole }) => {
  const isAuthenticated = localStorage.getItem('userToken') !== null;
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={userRole === 'admin' ? '/dashboard' : '/postevent'} />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/login" 
            element={<Login />} 
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin", "coordinator"]}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/:registerNumber"
            element={
              <ProtectedRoute allowedRole="admin">
                <StudentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/credentials"
            element={
              <ProtectedRoute allowedRole="admin">
                <Credentials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-event"
            element={
              <ProtectedRoute allowedRole="coordinator">
                <PostEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-events"
            element={
              <ProtectedRoute allowedRole="coordinator">
                <ViewEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
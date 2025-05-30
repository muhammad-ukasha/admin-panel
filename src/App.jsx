import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./screens/Dashboard";
import MeetingsManagement from "./screens/MeetingsManagement";
import UsersManagement from "./screens/UserManagement";
import DevicesManagement from "./screens/DevicesManagement";
import AdminLogin from "./screens/AdminLogin";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to be passed to AdminLogin to update login state
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Function to log out (optional, can be passed to AdminLayout or header)
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Public Route: Login */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          }
        />

        {/* Protected Routes - all require login */}
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <AdminLayout onLogout={handleLogout}>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="meetings" element={<MeetingsManagement />} />
                  <Route path="users" element={<UsersManagement />} />
                  <Route path="devices" element={<DevicesManagement />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AdminLayout>
            ) : (
              // If not logged in, redirect all routes except /login to login page
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

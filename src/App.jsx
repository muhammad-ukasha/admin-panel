import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./screens/Dashboard"; // make sure Dashboard.jsx exists
import MeetingsManagement from "./screens/MeetingsManagement";
import UsersManagement from "./screens/UserManagement";
import DevicesManagement from "./screens/DevicesManagement";

export default function App() {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meetings" element={<MeetingsManagement />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/devices" element={<DevicesManagement />} />
          <Route path="*" element={<Dashboard />} /> {/* default redirect to dashboard */}
        </Routes>
      </AdminLayout>
    </Router>
  );
}

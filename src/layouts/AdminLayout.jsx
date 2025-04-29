import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCog } from "react-icons/fa";

export default function AdminLayout({ children }) {
  // Load from localStorage if available
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("profile");
    return saved
      ? JSON.parse(saved)
      : {
          firstName: "Khan",
          lastName: "",
          email: "khan@example.com",
          password: "",
          avatar: "https://i.pravatar.cc/100",
        };
  });

  const [showSettings, setShowSettings] = useState(false);

  // Save profile to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col justify-between p-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-700 mb-8">CoHost Admin</h1>
          <nav className="flex flex-col gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
              🏠 Dashboard
            </Link>
            <Link to="/meetings" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
              📅 Meetings
            </Link>
            <Link to="/users" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
              👥 Users
            </Link>
            <Link to="/devices" className="flex items-center gap-2 text-gray-700 hover:text-purple-700">
              ⚙️ Devices
            </Link>
          </nav>
        </div>

        {/* Footer Profile Section */}
        <div className="flex items-center justify-between gap-2 mt-8">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowSettings(true)}
          >
            <img src={profile.avatar} className="rounded-full w-10 h-10 object-cover" alt="User" />
            <div>
              <p className="font-bold">{profile.firstName}</p>
              <p className="text-xs text-gray-500">Co-host</p>
            </div>
          </div>
          <FaCog
            onClick={() => setShowSettings(true)}
            className="cursor-pointer text-gray-600 hover:text-purple-700"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">Hello {profile.firstName} 👋</h2>
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {children}
      </div>

      {/* Profile Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg relative">
            <h3 className="text-xl font-bold mb-6 text-center">Edit Profile</h3>

            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
              <label className="text-blue-600 cursor-pointer text-sm underline">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setProfile({ ...profile, avatar: event.target.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                Change Picture
              </label>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  placeholder="First Name"
                  className="w-1/2 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  placeholder="Last Name"
                  className="w-1/2 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Change Email Address"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                value={profile.password}
                onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                placeholder="Change Password"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowSettings(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.setItem("profile", JSON.stringify(profile));
                  setShowSettings(false);
                  alert("Profile Updated Successfully!");
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
              >
                Update
              </button>
            </div>

            {/* Close */}
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

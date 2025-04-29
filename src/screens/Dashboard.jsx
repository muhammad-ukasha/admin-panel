import { useEffect, useState } from "react";
import { FaUsers, FaCalendarAlt, FaCogs } from "react-icons/fa";

export default function Dashboard() {
  const [meetingCount, setMeetingCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);

  useEffect(() => {
    // Fetch data from localStorage (simulate)
    const meetings = JSON.parse(localStorage.getItem("meetings")) || [
      { id: "4220-483-10932" },
      { id: "5678-367-0909" },
    ];

    const users = JSON.parse(localStorage.getItem("users")) || [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ];

    const devices = JSON.parse(localStorage.getItem("devices")) || [
      { name: "Sensor A" },
      { name: "Camera B" },
    ];

    setMeetingCount(meetings.length);
    setUserCount(users.length);
    setDeviceCount(devices.length);
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Section - Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Meetings */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="bg-purple-100 p-3 rounded-full text-purple-700">
            <FaCalendarAlt size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{meetingCount}</h3>
            <p className="text-gray-500 text-sm">Total Meetings</p>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="bg-green-100 p-3 rounded-full text-green-700">
            <FaUsers size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{userCount}</h3>
            <p className="text-gray-500 text-sm">Total Users</p>
          </div>
        </div>

        {/* Total Devices */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="bg-blue-100 p-3 rounded-full text-blue-700">
            <FaCogs size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{deviceCount}</h3>
            <p className="text-gray-500 text-sm">Devices Connected</p>
          </div>
        </div>
      </div>

      {/* Bottom Section - Recent Activities */}
      <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activities</h2>

        <ul className="space-y-4">
          <li className="flex items-center gap-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <p className="text-gray-600 text-sm">Meeting scheduled with Microsoft - 2 days ago</p>
          </li>
          <li className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-gray-600 text-sm">User Rayyan Khan registered - 3 days ago</p>
          </li>
          <li className="flex items-center gap-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-gray-600 text-sm">New IoT Device added - Sensor A</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

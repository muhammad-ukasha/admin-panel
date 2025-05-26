import { useEffect, useState } from "react";
import { FaUsers, FaCalendarAlt, FaCogs } from "react-icons/fa";
import axiosInstance from "../utils/axios";
import moment from "moment";

export default function Dashboard() {
  const [meetingCount, setMeetingCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);
  const [recentMeetings, setRecentMeetings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch meetings
        const meetingsResponse = await axiosInstance.get("/list-meeting");
        if (meetingsResponse.status !== 200)
          throw new Error("Failed to fetch meetings");
        const meetings = meetingsResponse.data;
        setMeetingCount(meetings.length);
        setRecentMeetings(meetings.slice(-5).reverse()); // last 5 meetings, most recent first

        // Fetch users
        const usersResponse = await axiosInstance.get("/users");
        if (usersResponse.status !== 200)
          throw new Error("Failed to fetch users");
        setUserCount(usersResponse.data.length);

        // Optionally fetch devices
        // const devicesResponse = await axiosInstance.get("/devices");
        // if (devicesResponse.status !== 200) throw new Error("Failed to fetch devices");
        // setDeviceCount(devicesResponse.data.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="bg-purple-100 p-3 rounded-full text-purple-700">
            <FaCalendarAlt size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{meetingCount}</h3>
            <p className="text-gray-500 text-sm">Total Meetings</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
          <div className="bg-green-100 p-3 rounded-full text-green-700">
            <FaUsers size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{userCount}</h3>
            <p className="text-gray-500 text-sm">Total Users</p>
          </div>
        </div>

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

      {/* Recent Activities Section */}
      <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Recent Activities
        </h2>
        <ul className="space-y-4">
          {recentMeetings.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No recent meetings available.
            </p>
          ) : (
            recentMeetings.map((meeting, index) => (
              <li key={index} className="flex items-center gap-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-gray-600 text-sm">
                  {meeting.title || "Untitled Meeting"} –{" "}
                  {moment(meeting.createdAt || meeting.date).fromNow()}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

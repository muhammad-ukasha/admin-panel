import { useState } from "react";

export default function MeetingsManagement() {
  const [tab, setTab] = useState("upcoming");
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const meetings = [
    { id: "4220-483-10932", name: "Microsoft Event 2.0", participants: 12, subject: "Microsoft Annual Product Launch" },
    { id: "5678-367-0909", name: "Yahoo", participants: 8, subject: "Annual Tech Meetup" },
  ];

  const participants = [
    { name: "Rayyan Khan" },
    { name: "Taha Mallick" },
    { name: "M Ukasha" },
    { name: "Anas Nasir" },
    { name: "Areeb bin Zulqir" },
  ];

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {["upcoming", "present", "past"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
              tab === t ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
            }`}
          >
            {t === "upcoming" && "Upcoming"}
            {t === "present" && "Recorded"}
            {t === "past" && "Past Meetings"}
          </button>
        ))}
      </div>

      {/* Meetings Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Meetings Management</h2>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex items-center border rounded-lg px-4 py-2 cursor-pointer">
              <span className="text-gray-600 mr-2">Sort by:</span> Newest
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-600 uppercase text-sm">
                <th className="py-3 px-6">Meeting ID</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Participants</th>
                <th className="py-3 px-6">Subject</th>
                <th className="py-3 px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedMeeting(meeting)}
                      className="text-purple-700 underline hover:text-purple-900"
                    >
                      {meeting.id}
                    </button>
                  </td>
                  <td className="py-4 px-6">{meeting.name}</td>
                  <td className="py-4 px-6">{meeting.participants}</td>
                  <td className="py-4 px-6">{meeting.subject}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedMeeting(meeting)}
                      className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Show below only if meeting selected */}
      {selectedMeeting && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meeting Details */}
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-2">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Meeting Details</h3>
            <p><strong>Meeting ID:</strong> {selectedMeeting.id}</p>
            <p><strong>Meeting Name:</strong> {selectedMeeting.name}</p>
            <p><strong>Subject:</strong> {selectedMeeting.subject}</p>
            <p><strong>Meeting Minutes:</strong> Total Meeting lasted for 30 Minutes</p>
          </div>

          {/* Attendance Management */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Attendance Management</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-gray-600 uppercase text-sm border-b">
                    <th className="py-3 px-6">Participant</th>
                    <th className="py-3 px-6">Present</th>
                    <th className="py-3 px-6">Remote</th>
                    <th className="py-3 px-6">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">{participant.name}</td>
                      <td className="py-4 px-6"><input type="checkbox" /></td>
                      <td className="py-4 px-6"><input type="checkbox" /></td>
                      <td className="py-4 px-6"><input type="checkbox" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transcription */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Transcription</h3>
            <p className="text-sm text-gray-600 overflow-y-auto max-h-80">
              (Mock Text) Welcome to {selectedMeeting.name}! Today, important updates were discussed...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

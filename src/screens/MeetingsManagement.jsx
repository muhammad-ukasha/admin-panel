import { useState } from "react";
import {
  FaEdit,
  FaPlus,
  FaTimes,
  FaUserPlus,
  FaTrash,
} from "react-icons/fa";

// Mock user lookup (replace with your GET /users)
const MOCK_USERS = [
  { email: "rayyan@example.com", name: "Rayyan Khan" },
  { email: "taha@example.com", name: "Taha Mallick" },
  { email: "pc19659.rayyan@gmail.com", name: "Rayyan Gmail" },
];

export default function MeetingsManagement() {
  // === State ===
  const [tab, setTab] = useState("upcoming");
  const [meetings, setMeetings] = useState([
    {
      id: "4220-483-10932",
      name: "Microsoft Event 2.0",
      subject: "Microsoft Annual Product Launch",
      date: "2025-05-01",
      time: "10:00",
      description: "Quarterly product showcase.",
      participants: [
        { email: "rayyan@example.com", status: "" },
        { email: "taha@example.com", status: "" },
      ],
    },
  ]);

  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Create/Edit Modal
  const [showCreateEdit, setShowCreateEdit] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formMeeting, setFormMeeting] = useState({
    id: "",
    name: "",
    subject: "",
    date: "",
    time: "",
    description: "",
    participants: [],
  });

  // Add Participants Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalMeetingId, setAddModalMeetingId] = useState(null);
  const [addModalInput, setAddModalInput] = useState("");

  // === Helpers ===
  const getNameByEmail = (email) => {
    const u = MOCK_USERS.find((u) => u.email === email);
    return u ? u.name : email;
  };

  const resetForm = () => {
    setFormMeeting({
      id: "",
      name: "",
      subject: "",
      date: "",
      time: "",
      description: "",
      participants: [],
    });
  };

  // === Handlers ===

  // Open Create modal
  const openCreate = () => {
    resetForm();
    setIsEditMode(false);
    setShowCreateEdit(true);
  };

  // Open Edit modal
  const openEdit = (m) => {
    setFormMeeting({ ...m });
    setIsEditMode(true);
    setShowCreateEdit(true);
  };

  // Save Create/Edit
  const saveMeeting = () => {
    if (isEditMode) {
      setMeetings((ms) =>
        ms.map((m) => (m.id === formMeeting.id ? formMeeting : m))
      );
    } else {
      setMeetings((ms) => [
        ...ms,
        { ...formMeeting, id: Date.now().toString() },
      ]);
    }
    setShowCreateEdit(false);
  };

  // Delete
  const deleteMeeting = (id) => {
    setMeetings((ms) => ms.filter((m) => m.id !== id));
    if (selectedMeeting?.id === id) setSelectedMeeting(null);
  };

  // Open Add-Participants modal for an existing meeting
  const openAddParticipants = (id) => {
    setAddModalMeetingId(id);
    setAddModalInput("");
    setShowAddModal(true);
  };

  // Add to existing meeting
  const addParticipantToMeeting = () => {
    if (!addModalInput.trim()) return;
    setMeetings((ms) =>
      ms.map((m) =>
        m.id === addModalMeetingId
          ? {
              ...m,
              participants: [
                ...m.participants,
                { email: addModalInput.trim(), status: "" },
              ],
            }
          : m
      )
    );
    setAddModalInput("");
  };

  // Update Attendance
  const updateAttendance = () => {
    setMeetings((ms) =>
      ms.map((m) =>
        m.id === selectedMeeting.id ? selectedMeeting : m
      )
    );
    alert("Attendance updated.");
  };

  // Change a participant’s status
  const changeStatus = (idx, status) => {
    setSelectedMeeting((m) => {
      const ps = m.participants.map((p, i) =>
        i === idx ? { ...p, status } : p
      );
      return { ...m, participants: ps };
    });
  };

  // === Render ===
  return (
    <div className="space-y-8 p-4">
      {/* Tabs + Create */}
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex gap-2">
          {["upcoming", "present", "past"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                tab === t
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={openCreate}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Create Meeting
        </button>
      </div>

      {/* Meetings Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Meetings Management</h2>
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-gray-600 uppercase text-sm">
              <th className="py-3 px-6">Meeting ID</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Participants</th>
              <th className="py-3 px-6">Subject</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((m) => (
              <tr
                key={m.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="py-4 px-6">
                  <button
                    onClick={() => setSelectedMeeting(m)}
                    className="text-purple-700 underline"
                  >
                    {m.id}
                  </button>
                </td>
                <td className="py-4 px-6">{m.name}</td>
                <td className="py-4 px-6">
                  {m.participants.length}
                </td>
                <td className="py-4 px-6">{m.subject}</td>
                <td className="py-4 px-6 flex gap-2">
                  <button
                    onClick={() => openEdit(m)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() =>
                      openAddParticipants(m.id)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    <FaUserPlus />
                  </button>
                  <button
                    onClick={() => deleteMeeting(m.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details / Attendance / Transcription */}
      {selectedMeeting && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-4">
              Meeting Details
            </h3>
            <p>
              <strong>ID:</strong> {selectedMeeting.id}
            </p>
            <p>
              <strong>Name:</strong> {selectedMeeting.name}
            </p>
            <p>
              <strong>Subject:</strong>{" "}
              {selectedMeeting.subject}
            </p>
            <p>
              <strong>
                When:
              </strong>{" "}
              {selectedMeeting.date} @{" "}
              {selectedMeeting.time}
            </p>
            <p className="mt-2">
              {selectedMeeting.description}
            </p>
          </div>

          {/* Attendance */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-4">
              Attendance Management
            </h3>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2 px-4 text-left">
                    Participant
                  </th>
                  <th className="text-center">Present</th>
                  <th className="text-center">Remote</th>
                  <th className="text-center">Absent</th>
                </tr>
              </thead>
              <tbody>
                {selectedMeeting.participants.map(
                  (p, idx) => (
                    <tr
                      key={idx}
                      className="border-b"
                    >
                      <td className="py-2 px-4">
                        {getNameByEmail(p.email)}
                      </td>
                      {["present", "remote", "absent"].map(
                        (st) => (
                          <td
                            key={st}
                            className="text-center"
                          >
                            <input
                              type="radio"
                              name={`att-${idx}`}
                              checked={p.status === st}
                              onChange={() =>
                                changeStatus(idx, st)
                              }
                            />
                          </td>
                        )
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <button
              onClick={updateAttendance}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              Update Attendance
            </button>
          </div>

          {/* Transcription */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-4">
              Transcription
            </h3>
            <p className="text-sm text-gray-600">
              (Mock) Your meeting transcript goes here…
            </p>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg space-y-4 relative">
            <button
              onClick={() => setShowCreateEdit(false)}
              className="absolute top-4 right-4 text-xl text-gray-500"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold">
              {isEditMode
                ? "Edit Meeting"
                : "Schedule a Meeting"}
            </h3>

            <input
              type="text"
              placeholder="Name"
              className="w-full border px-4 py-2 rounded-lg"
              value={formMeeting.name}
              onChange={(e) =>
                setFormMeeting((fm) => ({
                  ...fm,
                  name: e.target.value,
                }))
              }
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full border px-4 py-2 rounded-lg"
              value={formMeeting.subject}
              onChange={(e) =>
                setFormMeeting((fm) => ({
                  ...fm,
                  subject: e.target.value,
                }))
              }
            />
            <div className="flex gap-2">
              <input
                type="date"
                className="w-1/2 border px-4 py-2 rounded-lg"
                value={formMeeting.date}
                onChange={(e) =>
                  setFormMeeting((fm) => ({
                    ...fm,
                    date: e.target.value,
                  }))
                }
              />
              <input
                type="time"
                className="w-1/2 border px-4 py-2 rounded-lg"
                value={formMeeting.time}
                onChange={(e) =>
                  setFormMeeting((fm) => ({
                    ...fm,
                    time: e.target.value,
                  }))
                }
              />
            </div>
            <textarea
              placeholder="Description"
              className="w-full border px-4 py-2 rounded-lg"
              value={formMeeting.description}
              onChange={(e) =>
                setFormMeeting((fm) => ({
                  ...fm,
                  description: e.target.value,
                }))
              }
            />

            <button
              onClick={saveMeeting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              {isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Add Participants Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-xl text-gray-500"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold">
              Add Participants
            </h3>
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-4 py-2 rounded-lg"
              value={addModalInput}
              onChange={(e) =>
                setAddModalInput(e.target.value)
              }
            />
            <button
              onClick={addParticipantToMeeting}
              className="w-full bg-green-500 text-white py-2 rounded-lg"
            >
              Add
            </button>
            <ul className="list-disc pl-5">
              {meetings
                .find((m) => m.id === addModalMeetingId)
                ?.participants.map((p, i) => (
                  <li key={i}>{p.email}</li>
                ))}
            </ul>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Confirm Participants
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

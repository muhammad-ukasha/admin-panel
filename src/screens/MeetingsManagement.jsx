import { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTimes, FaUserPlus, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axios";
import axios from "axios";
// Mock user lookup (replace with your GET /users)
const MOCK_USERS = [
  { email: "rayyan@example.com", name: "Rayyan Khan" },
  { email: "taha@example.com", name: "Taha Mallick" },
  { email: "pc19659.rayyan@gmail.com", name: "Rayyan Gmail" },
];

export default function MeetingsManagement() {
  const [tab, setTab] = useState("upcoming");
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [originalParticipants, setOriginalParticipants] = useState([]);
  const [recordingStatus, setrecordingStatus] = useState("");

  // Create/Edit Modal
  const [showCreateEdit, setShowCreateEdit] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formMeeting, setFormMeeting] = useState({
    id: "",
    title: "",
    subject: "",
    date: "",
    time: "",
    description: "",
    participants: [],
    newParticipant: "",
  });
  const [participantsDetails, setParticipantsDetails] = useState({});
  const api =  "https://fe0634b5-b9ef-4605-8312-3d014ea3ce6a-00-2i7vpu8mwwwpu.sisko.replit.dev/mobile/trigger" 
  // === State ===
  // const ESP32_BASE_URL = "http://192.168.0.178:80"; // 👈 Change to your actual ESP32 IP
  const fetchESP32Status = async () => {
    try {
      const res = await axiosInstance.get(`esp32/status`);
      if (res.status === 200) {
        // console.log(res.data);
        return res.data.recordingStatus; // "recording" or "stopped"
      }
    } catch (err) {
      console.error("Failed to get ESP32 status", err);
    }
    return null;
  };
  const startRecording = async () => {

    let esp32staus = await fetchESP32Status();
    // setrecordingStatus(esp32staus);
    console.log("startRecording ", esp32staus);
    if (esp32staus !== "stopped" && selectedMeeting.status !== "scheduled") {
      toast.error("Meeting must be stopped or scheduled to start recording.");
      return;
    }

    try {
      await axios.post(`${api}`,{
        "action": "start"
      })
      const meetingDateTime = new Date(
        selectedMeeting.date + "T" + selectedMeeting.time
      );
      const now = new Date();

      if (now < meetingDateTime) {
        toast.error("You cannot start the meeting before its scheduled time.");
        return;
      }
      // Send start command to ESP32
      await sendCommand("START_RECORDING");
      // Update meeting status to started
      await updateMeetingStatus("started");
    } catch (err) {
      toast.error("Failed to start recording");
    }
  };

  const pauseRecording = async () => {
    let esp32staus = await fetchESP32Status();
    console.log("pauseRecording", esp32staus);
    // setrecordingStatus(esp32staus);

    if (esp32staus !== "recording") {
      toast.error("Meeting must be started to pause recording.");
      return;
    }

    try {
      // Send stop/pause command to ESP32
      await sendCommand("PAUSE_RECORDING");
      // Update meeting status to stopped (paused)
      // await updateMeetingStatus("stopped");
    } catch (err) {
      toast.error("Failed to pause recording");
    }
  };
  const resumeRecording = async () => {
    let esp32staus = await fetchESP32Status();
    console.log("resumeRecording", esp32staus);
    // setrecordingStatus(esp32staus);

    if (esp32staus !== "paused") {
      toast.error("Recording must be paused to resume.");
      return;
    }

    try {
      // Send stop/pause command to ESP32
      await sendCommand("RESUME_RECORDING");
      // Update meeting status to stopped (paused)
      // await updateMeetingStatus("stopped");
    } catch (err) {
      toast.error("Failed to pause recording");
    }
  };
  const endMeetingHandler = async () => {
    try {
      // Send stop command to ESP32 and save transcription
      // await sendCommand("STOP_RECORDING");
      await endMeeting("STOP_RECORDING"); 
      await axios.post(`${api}`,{
        "action": "stop"
      })// your existing endMeeting function
      // Mark meeting as completed
      await updateMeetingStatus("completed");
    } catch (err) {
      toast.error("Failed to end meeting");
    }
  };
  const sendCommand = async (command) => {
    try {
      const response = await axiosInstance.post("/commands", {
        command,
        meetingId: selectedMeeting.meetingId,
        // can be string or array of strings
      });
      toast.success(`Command queued: ${JSON.stringify(command)}`);
    } catch (error) {
      console.error("Failed to send command:", error);
      toast.error("Failed to send command");
    }
  };

  const endMeeting = async (command) => {
    try {
      sendCommand(command);

      const dbRes = await axiosInstance.put(
        `/end-meeting/${selectedMeeting._id}`
      );

      if (dbRes.status === 200) {
        toast.success("Meeting ended and transcription saved.");
      } else {
        toast.error("Transcription saving failed.");
      }
    } catch (err) {
      console.error("End meeting failed:", err);
      toast.error("Something went wrong while ending the meeting.");
    }
  };

  const fetchParticipantsDetails = async () => {
    const details = {};
    for (let p of selectedMeeting.participants) {
      const user = await fetchUserById(p.user);
      if (user) {
        console.log(user);

        details[p.user] = `${user.firstname} ${user.lastname}`;
        console.log(details);
      }
    }
    setParticipantsDetails(details);
  };

  // Add Participants Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalMeetingId, setAddModalMeetingId] = useState(null);
  const [addModalInput, setAddModalInput] = useState("");

  useEffect(() => {
    fetchMeetings();
    if (selectedMeeting) {
      // fetchParticipantsDetails();
    }
  }, [selectedMeeting]);
  const getParticipantDetails = async (userId) => {
    // Fetch the user data using userId
    const user = await fetchUserById(userId);
    console.log(userId);
    if (user) {
      return `${user.firstName} ${user.lastName} (${user.email})`; // Format as desired
    }
    return "Unknown User"; // Fallback in case user data is missing
  };
  const updateMeetingStatus = async (status) => {
    try {
      await axiosInstance.put(`/update-status/${selectedMeeting._id}`, {
        status,
      });
      toast.success(`Meeting marked as "${status}"`);
      fetchMeetings(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to update meeting status");
    }
  };

  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/list-meeting");
      console.log(res);
      setMeetings(res.data);
    } catch (err) {
      console.error("Error fetching meetings", err);
      toast.error("Failed to fetch meetings");
    } finally {
      setIsLoading(false);
    }
  };

  // === Helpers ===
  const getNameByEmail = (email) => {
    const u = MOCK_USERS.find((u) => u.email === email);
    return u ? u.name : email;
  };

  const resetForm = () => {
    setFormMeeting({
      id: "",
      title: "",
      subject: "",
      date: "",
      time: "",
      description: "",
      participants: [],
      newParticipant: "",
    });
  };

  // === Handlers ===
  const openCreate = () => {
    resetForm();
    setIsEditMode(false);
    setShowCreateEdit(true);
  };

  const openEdit = (meeting) => {
    const participants = Array.isArray(meeting.participants)
      ? meeting.participants.map((p) => {
          if (p.user?.email) {
            return {
              email: p.user.email,
              firstname: p.user.firstname,
              lastname: p.user.lastname,
            };
          } else if (p.email) {
            return { email: p.email };
          } else {
            return { email: "unknown@example.com" };
          }
        })
      : [];

    setFormMeeting({
      id: meeting._id || meeting.id,
      title: meeting.title,
      subject: meeting.subject,
      date: meeting.date,
      time: meeting.time,
      description: meeting.description,
      participants,
      newParticipant: "",
    });

    // Store original emails for diffing
    setOriginalParticipants(participants.map((p) => p.email));
    // console.log(originalParticipants);
    setIsEditMode(true);
    setShowCreateEdit(true);
  };

  const saveMeeting = async () => {
    if (!formMeeting.title || !formMeeting.date || !formMeeting.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedEmails = formMeeting.participants.map((p) => p.email);
    const add = updatedEmails.filter(
      (email) => !originalParticipants.includes(email)
    );
    const remove = originalParticipants.filter(
      (email) => !updatedEmails.includes(email)
    );
    if (isEditMode) {
      // console.log(formMeeting);
      try {
        const payload = {
          title: formMeeting.title,
          subject: formMeeting.subject,
          description: formMeeting.description,
          date: formMeeting.date,
          time: formMeeting.time,
        };

        await axiosInstance.put(`/editmeetings/${formMeeting.id}`, payload);
        if (add.length || remove.length) {
          await axiosInstance.put(`/meetings/${formMeeting.id}/participants`, {
            add,
            remove,
          });
        }

        toast.success("Meeting updated successfully!");
        fetchMeetings();
        setShowCreateEdit(false);
      } catch (err) {
        console.error("err ", err);
        toast.error("Failed to update meeting");
      }
      return;
    }

    // Create new meeting
    try {
      const payload = {
        title: formMeeting.title,
        subject: formMeeting.subject,
        date: formMeeting.date,
        time: formMeeting.time,
        description: formMeeting.description,
        organizer: "Admin",
        participants: formMeeting.participants.map((p) => p.email),
      };

      if (formMeeting.participants.length === 0) {
        toast.error("Please add at least one participant.");
        return;
      }
      await axiosInstance.post("/addmeeting", payload);
      console.log(payload);

      toast.success("Meeting created successfully!");
      fetchMeetings();
      setShowCreateEdit(false);
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to create meeting");
    }
  };

  const deleteMeeting = async (id) => {
    try {
      await axiosInstance.delete(`/deletemeeting/${id}`);
      toast.success("Meeting deleted successfully!");
      fetchMeetings();
      if (selectedMeeting?.id === id) setSelectedMeeting(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete meeting");
    }
  };

  const openAddParticipants = (id) => {
    setAddModalMeetingId(id);
    setAddModalInput("");
    setShowAddModal(true);
  };

  const addParticipantToMeeting = async () => {
    const email = addModalInput.trim();
    if (!email) return;

    try {
      // Call backend to add participant
      const res = await axiosInstance.put(`/meetings/${addModalMeetingId}/participants`, {
        add: [email],
        remove: [],
      });
      console.log(res)
      toast.success("Participant added successfully!");

      // Refresh meetings to show updated participants
      fetchMeetings();

      setAddModalInput("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add participant");
    }
  };

  const changeStatus1 = (idx, status) => {
    setSelectedMeeting((prev) => {
      const updated = [...prev.participants];
      updated[idx] = { ...updated[idx], status };
      return { ...prev, participants: updated };
    });
  };

  const updateAttendance = async () => {
    try {
      const attendance = selectedMeeting.participants.map((p) => ({
        email: p.user?.email || p.email,
        status: p.status || "absent", // default to "absent" if not selected
      }));

      await axiosInstance.put(`/meetings/${selectedMeeting._id}/attendance`, {
        attendance,
      });

      toast.success("Attendance updated!");
      fetchMeetings(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to update attendance");
    }
  };

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
        {isLoading ? (
          <div className="text-center py-8">Loading meetings...</div>
        ) : (
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
                <tr key={m._id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <button
                      onClick={() =>
                        setSelectedMeeting({
                          ...m,
                          participants: m.participants.map((p) => ({
                            ...p,
                            status: p.attendanceStatus || "absent", // sync status for UI
                          })),
                        })
                      }
                      className="text-purple-700 underline"
                    >
                      {m.meetingId}
                    </button>
                  </td>
                  <td className="py-4 px-6">{m.title}</td>
                  <td className="py-4 px-6">
                    {Array.isArray(m.participants) ? m.participants.length : 0}
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
                      onClick={() => openAddParticipants(m._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      <FaUserPlus />
                    </button>
                    <button
                      onClick={() => deleteMeeting(m._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details / Attendance / Transcription */}
      {selectedMeeting && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Meeting Details</h3>
            <p>
              <strong>Meeting Code:</strong> {selectedMeeting.meetingId}
            </p>
            <p>
              <strong>Name:</strong> {selectedMeeting.title}
            </p>
            <p>
              <strong>Subject:</strong> {selectedMeeting.subject}
            </p>
            <p>
              <strong>When:</strong> {selectedMeeting.date} @{" "}
              {selectedMeeting.time}
            </p>
            <p className="mt-2">{selectedMeeting.description}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Audio Recorder Controls</h3>
            <div className="flex gap-4">
              <button
                onClick={startRecording}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                ▶️ Start
              </button>
              <button
                onClick={pauseRecording}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
              >
                ⏸️ Pause
              </button>
              <button
                onClick={resumeRecording}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                ▶️ Resume
              </button>
              <button
                onClick={endMeetingHandler}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                🛑 End Meeting
              </button>
            </div>
          </div>
          {/* Attendance */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Attendance Management</h3>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2 px-4 text-left">Participant</th>
                  <th className="text-center">Present</th>
                  <th className="text-center">Remote</th>
                  <th className="text-center">Absent</th>
                </tr>
              </thead>
              <tbody>
                {selectedMeeting.participants.map((p, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-4">
                      {p.user?.firstname && p.user?.lastname
                        ? `${p.user.firstname} ${p.user.lastname}`
                        : p.user?.email || "Unknown"}
                    </td>
                    {["present", "remote", "absent"].map((st) => (
                      <td key={st} className="text-center">
                        <input
                          type="radio"
                          name={`att-${idx}`}
                          checked={p.status === st}
                          onChange={() => changeStatus(idx, st)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
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
            <h3 className="text-xl font-bold mb-4">Transcription</h3>
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
              {isEditMode ? "Edit Meeting" : "Schedule a Meeting"}
            </h3>

            <input
              type="text"
              placeholder="Name"
              className="w-full border px-4 py-2 rounded-lg"
              value={formMeeting.title}
              onChange={(e) =>
                setFormMeeting((fm) => ({
                  ...fm,
                  title: e.target.value,
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
            <div className="space-y-2">
              <label className="block font-medium text-sm text-gray-700">
                Add Participants (by Email)
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter participant email"
                  className="flex-1 border px-4 py-2 rounded-lg"
                  value={formMeeting.newParticipant}
                  onChange={(e) =>
                    setFormMeeting((fm) => ({
                      ...fm,
                      newParticipant: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => {
                    if (!formMeeting.newParticipant?.trim()) return;
                    const email = formMeeting.newParticipant.trim();
                    if (
                      !formMeeting.participants.find((p) => p.email === email)
                    ) {
                      setFormMeeting((fm) => ({
                        ...fm,
                        participants: [...fm.participants, { email }],
                        newParticipant: "",
                      }));
                    }
                  }}
                >
                  Add
                </button>
              </div>

              {/* Participant List */}
              {formMeeting.participants.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {formMeeting.participants.map((p, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between pr-2"
                    >
                      <span>
                        {p.firstname && p.lastname
                          ? `${p.firstname} ${p.lastname} (${p.email})`
                          : p.email}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 text-xs ml-2"
                        onClick={() =>
                          setFormMeeting((fm) => ({
                            ...fm,
                            participants: fm.participants.filter(
                              (_, i) => i !== idx
                            ),
                          }))
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
            <h3 className="text-lg font-bold">Add Participants</h3>
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-4 py-2 rounded-lg"
              value={addModalInput}
              onChange={(e) => setAddModalInput(e.target.value)}
            />
            <button
              onClick={addParticipantToMeeting}
              className="w-full bg-green-500 text-white py-2 rounded-lg"
            >
              Add
            </button>
            <ul className="list-disc pl-5 text-sm">
              {meetings
                .find((m) => m._id === addModalMeetingId)
                ?.participants?.map((p, i) => {
                  const email =
                    typeof p === "string"
                      ? p
                      : p.email || p.user?.email || "Unknown Email";
                  const name =
                    p.user?.firstname && p.user?.lastname
                      ? `${p.user.firstname} ${p.user.lastname}`
                      : null;

                  return <li key={i}>{name ? `${name} (${email})` : email}</li>;
                })}
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

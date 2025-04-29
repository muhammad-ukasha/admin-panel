import { useState } from "react";
import { FaCog, FaPlus } from "react-icons/fa";

export default function DevicesManagement() {
  const [devices, setDevices] = useState([
    { id: 1, name: "Sensor A", ip: "192.168.1.10", location: "Building 1", status: "active" },
    { id: 2, name: "Camera B", ip: "192.168.1.11", location: "Building 2", status: "inactive" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleEditClick = (device) => {
    setEditingDevice({ ...device });
    setIsAddingNew(false);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setEditingDevice({ name: "", ip: "", location: "", status: "inactive" });
    setIsAddingNew(true);
    setShowModal(true);
  };

  const handleSave = () => {
    if (isAddingNew) {
      const newDevice = {
        ...editingDevice,
        id: devices.length + 1,
      };
      setDevices([...devices, newDevice]);
    } else {
      const updated = devices.map((d) =>
        d.id === editingDevice.id ? editingDevice : d
      );
      setDevices(updated);
    }
    setShowModal(false);
  };

  const handleChange = (e) => {
    setEditingDevice({ ...editingDevice, [e.target.name]: e.target.value });
  };

  const handleStatusToggle = () => {
    setEditingDevice({
      ...editingDevice,
      status: editingDevice.status === "active" ? "inactive" : "active",
    });
  };

  return (
    <div className="space-y-8">
      {/* Topbar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">IoT Device Management</h2>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <FaPlus /> Add Device
        </button>
      </div>

      {/* Devices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.length > 0 ? (
          devices.map((device) => (
            <div key={device.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 hover:shadow-lg transition">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{device.name}</h3>
                  <p className="text-sm text-gray-500">{device.ip}</p>
                </div>
                <button
                  onClick={() => handleEditClick(device)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <FaCog size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-sm text-gray-600">
                  📍 Location: <span className="font-semibold">{device.location}</span>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    device.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {device.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            No devices configured. <br /> Click <span className="text-purple-600 font-bold">Add Device</span> to get started!
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && editingDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-96 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {isAddingNew ? "Add New Device" : "Edit Device Settings"}
            </h2>

            <div className="flex flex-col gap-4">
              {/* Name */}
              <input
                type="text"
                name="name"
                value={editingDevice.name}
                onChange={handleChange}
                placeholder="Device Name"
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {/* IP */}
              <input
                type="text"
                name="ip"
                value={editingDevice.ip}
                onChange={handleChange}
                placeholder="IP Address"
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {/* Location */}
              <input
                type="text"
                name="location"
                value={editingDevice.location}
                onChange={handleChange}
                placeholder="Location"
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Status Toggle */}
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold text-gray-700">Status:</span>
                <button
                  onClick={handleStatusToggle}
                  className={`px-6 py-2 rounded-full font-semibold ${
                    editingDevice.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                  }`}
                >
                  {editingDevice.status === "active" ? "Active" : "Inactive"}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                {isAddingNew ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

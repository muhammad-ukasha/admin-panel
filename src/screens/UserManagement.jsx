import { useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: "Jane Cooper", email: "jane@microsoft.com" },
    { id: 2, name: "Floyd Miles", email: "floyd@yahoo.com" },
    { id: 3, name: "Ronald Richards", email: "ronald@adobe.com" },
    { id: 4, name: "Marvin McKinney", email: "marvin@tesla.com" },
    { id: 5, name: "Jerome Bell", email: "jerome@google.com" },
    { id: 6, name: "Kathryn Murphy", email: "kathryn@microsoft.com" },
    { id: 7, name: "Jacob Jones", email: "jacob@yahoo.com" },
    { id: 8, name: "Kristin Watson", email: "kristin@facebook.com" },
  ]);

  const [editingUser, setEditingUser] = useState(null);

  const handleDelete = (id) => {
    const updated = users.filter(user => user.id !== id);
    setUsers(updated);
  };

  const handleSave = () => {
    const updated = users.map(user => (user.id === editingUser.id ? editingUser : user));
    setUsers(updated);
    setEditingUser(null);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
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

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-600 uppercase text-sm">
                <th className="py-3 px-6">User ID</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6">{user.id}</td>
                  <td className="py-4 px-6">{user.name}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6 flex gap-2">
                    <button
                      onClick={() => setEditingUser({ ...user })}
                      className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Form */}
      {editingUser && (
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Edit User</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Name"
            />
            <input
              type="text"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Email"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

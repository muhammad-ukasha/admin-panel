import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";


export default function UserManagement() {
  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        console.log(res.data)
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axiosInstance.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Save edited user
  const handleSave = async () => {
    try {
      const payload = {
        firstName: editingUser.name.split(" ")[0],
        lastName: editingUser.name.split(" ").slice(1).join(" "),
        email: editingUser.email,
      };
      const res = await axiosInstance.put(
        `/users/${editingUser.id}`,
        payload
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === res.data.id ? res.data : u))
      );
      setEditingUser(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div className="p-6">Loading users…</div>;

  return (
    <div className="space-y-8 p-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            User Management
          </h2>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => {
                const q = e.target.value.toLowerCase();
                setUsers((prev) =>
                  prev.filter(
                    (u) =>
                      u.name.toLowerCase().includes(q) ||
                      u.email.toLowerCase().includes(q)
                  )
                );
              }}
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
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="py-4 px-6">{user._id}</td>
                  <td className="py-4 px-6">{user.firstname} {user.lastname}</td>
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
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Edit User
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser((u) => ({
                  ...u,
                  name: e.target.value,
                }))
              }
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Name"
            />
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser((u) => ({
                  ...u,
                  email: e.target.value,
                }))
              }
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

import React, { useEffect, useState } from "react";
import API from "../../api/api";

const ManageUsers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [clients, setClients]         = useState([]);
  const [tab, setTab]                 = useState("freelancers");
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [fRes, cRes] = await Promise.all([
        API.get("/users/freelancers"),
        API.get("/users/clients"),
      ]);
      setFreelancers(fRes.data || []);
      setClients(cRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      setFreelancers((prev) => prev.filter((u) => u.id !== id));
      setClients((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Error deleting user");
    }
  };

  const users = tab === "freelancers" ? freelancers : clients;

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>

        {/* TABS */}
        <div className="flex gap-3 mb-6">
          {["freelancers", "clients"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition capitalize ${
                tab === t ? "bg-teal-600 text-white shadow" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {t} ({t === "freelancers" ? freelancers.length : clients.length})
            </button>
          ))}
        </div>

        {/* USER TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">#</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Role</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">No {tab} found.</td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-sm">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                        u.role === "freelancer" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-medium transition"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;

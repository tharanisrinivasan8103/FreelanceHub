import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getFreelancers, getClients } from "../../api/api";

const ManageUsers = () => {
  const [activeTab, setActiveTab] = useState("freelancers");
  const [freelancers, setFreelancers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const freelancerRes = await getFreelancers();
      const clientRes = await getClients();

      setFreelancers(freelancerRes.data);
      setClients(clientRes.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const usersToShow =
    activeTab === "freelancers" ? freelancers : clients;

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Top Header Bar */}
        <div className="bg-white border-b px-8 py-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">
            Users
          </h2>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8">

          <div className="max-w-6xl mx-auto">

            {/* Page Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              User Management
            </h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab("freelancers")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === "freelancers"
                    ? "bg-teal-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Freelancers
              </button>

              <button
                onClick={() => setActiveTab("clients")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === "clients"
                    ? "bg-teal-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Clients
              </button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

              {/* Card Header */}
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-700">
                  {activeTab === "freelancers"
                    ? "All Freelancers"
                    : "All Clients"}
                </h2>
              </div>

              {/* Table */}
              {loading ? (
                <div className="p-6 text-gray-500">
                  Loading...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">

                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Specialization</th>
                        <th className="px-6 py-3">Rating</th>
                        <th className="px-6 py-3">Projects</th>
                        <th className="px-6 py-3">Earnings</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {usersToShow.length > 0 ? (
                        usersToShow.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4 font-medium text-gray-800">
                              {user.name}
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                              {user.specialization || "—"}
                            </td>

                            <td className="px-6 py-4 text-yellow-500 font-medium">
                              ⭐ {user.rating || "4.8"}
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                              {user.projects || 20}
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                              $
                              {user.earnings
                                ? user.earnings.toLocaleString("en-US")
                                : "25,000"}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                  user.status === "busy"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {user.status || "active"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-8 text-gray-500"
                          >
                            No Users Found
                          </td>
                        </tr>
                      )}
                    </tbody>

                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
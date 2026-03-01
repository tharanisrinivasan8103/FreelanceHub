import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  getAllUsers,
  getAllProjects
} from "../../api/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    revenue: 128000,
    disputes: 3
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const users = await getAllUsers();
      const projects = await getAllProjects();

      setStats({
        users: users.data.length,
        projects: projects.data.length,
        revenue: 128000, // dummy revenue
        disputes: 3      // dummy disputes
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Monthly Revenue Data
  const revenueData = [
    { name: "Jan", revenue: 12000 },
    { name: "Feb", revenue: 18000 },
    { name: "Mar", revenue: 15000 },
    { name: "Apr", revenue: 21000 },
    { name: "May", revenue: 28000 },
    { name: "Jun", revenue: 24000 }
  ];

  // Category Data
  const categoryData = [
    { name: "Web Dev", value: 40 },
    { name: "Mobile", value: 25 },
    { name: "Design", value: 20 },
    { name: "Marketing", value: 15 }
  ];

  const COLORS = ["#0d9488", "#f59e0b", "#3b82f6", "#10b981"];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mb-8">
          Platform overview and management
        </p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

              {/* Total Users */}
              <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Total Users</p>
                  <h2 className="text-3xl font-bold">{stats.users}</h2>
                  <p className="text-green-500 text-sm">+12% this month</p>
                </div>
                <div className="bg-teal-600 text-white p-3 rounded-xl">
                  👥
                </div>
              </div>

              {/* Active Projects */}
              <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Active Projects</p>
                  <h2 className="text-3xl font-bold">{stats.projects}</h2>
                  <p className="text-green-500 text-sm">+8% this month</p>
                </div>
                <div className="bg-teal-600 text-white p-3 rounded-xl">
                  💼
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Revenue</p>
                  <h2 className="text-3xl font-bold">
                    ${stats.revenue.toLocaleString()}
                  </h2>
                  <p className="text-green-500 text-sm">+22% this month</p>
                </div>
                <div className="bg-teal-600 text-white p-3 rounded-xl">
                  📊
                </div>
              </div>

              {/* Disputes */}
              <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Disputes</p>
                  <h2 className="text-3xl font-bold">{stats.disputes}</h2>
                  <p className="text-green-500 text-sm">-50% this month</p>
                </div>
                <div className="bg-teal-600 text-white p-3 rounded-xl">
                  🛡️
                </div>
              </div>

            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

              {/* Monthly Revenue */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-lg font-semibold mb-4">
                  Monthly Revenue
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#0d9488" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Projects by Category (Donut) */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-lg font-semibold mb-4">
                  Projects by Category
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      label
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* RECENT FREELANCERS */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold mb-4">
                Recent Freelancers
              </h2>

              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Name</th>
                    <th>Skill</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">John Doe</td>
                    <td>Web Developer</td>
                    <td className="text-green-600">Active</td>
                  </tr>
                  <tr>
                    <td className="py-2">Jane Smith</td>
                    <td>UI/UX Designer</td>
                    <td className="text-yellow-500">Pending</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
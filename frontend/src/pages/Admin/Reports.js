import React from "react";
import Sidebar from "../../components/Sidebar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  // Sample data (you can later connect backend)
  const userGrowthData = [
    { month: "Jan", users: 45, freelancers: 30 },
    { month: "Feb", users: 52, freelancers: 38 },
    { month: "Mar", users: 48, freelancers: 42 },
    { month: "Apr", users: 70, freelancers: 55 },
    { month: "May", users: 65, freelancers: 60 },
    { month: "Jun", users: 80, freelancers: 72 },
  ];

  const projectActivityData = [
    { month: "Jan", posted: 35, completed: 20 },
    { month: "Feb", posted: 40, completed: 28 },
    { month: "Mar", posted: 38, completed: 35 },
    { month: "Apr", posted: 55, completed: 42 },
    { month: "May", posted: 60, completed: 50 },
    { month: "Jun", posted: 65, completed: 55 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col">

        {/* Top Header */}
        <div className="bg-white border-b px-8 py-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">
            Reports
          </h2>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Reports & Analytics
            </h1>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* User Growth */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                  User Growth
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#14b8a6"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="freelancers"
                      stroke="#f59e0b"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Project Activity */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                  Project Activity
                </h2>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="posted"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="completed"
                      fill="#22c55e"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
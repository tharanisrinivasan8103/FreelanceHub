import React, { useEffect, useState } from "react";
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
import API from "../../api/api";

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  const userGrowthData = stats?.monthlyRegistrations || [];

  const projectActivityData = [
    { name: "Open", count: stats?.openProjects || 0 },
    { name: "In Progress", count: stats?.inProgressProjects || 0 },
    { name: "Completed", count: stats?.completedProjects || 0 },
  ];

  const proposalData = [
    { name: "Pending", count: stats?.pendingProposals || 0 },
    { name: "Accepted", count: stats?.acceptedProposals || 0 },
    { name: "Rejected", count: stats?.rejectedProposals || 0 },
  ];

  const submissionData = [
    { name: "Submitted", count: stats?.pendingSubmissions || 0 },
    { name: "Approved", count: stats?.approvedSubmissions || 0 },
    { name: "Revision", count: stats?.revisionSubmissions || 0 },
  ];

  const summaryCards = [
    {
      label: "Total Users",
      value: (stats?.totalFreelancers || 0) + (stats?.totalClients || 0),
      icon: "👥",
      bg: "bg-teal-50",
      text: "text-teal-600",
    },
    {
      label: "Total Projects",
      value: stats?.totalProjects || 0,
      icon: "📁",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
    },
    {
      label: "Total Proposals",
      value: stats?.totalProposals || 0,
      icon: "📄",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      label: "Total Submissions",
      value: stats?.totalSubmissions || 0,
      icon: "📤",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-100 min-h-screen">

      {/* Top Header */}
      <div className="bg-white border-b px-8 py-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700">Reports</h2>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-500 mb-8">
            Real-time platform data from your database
          </p>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {summaryCards.map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className={"w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 " + card.bg}>
                  {card.icon}
                </div>
                <p className={"text-3xl font-bold mb-1 " + card.text}>
                  {card.value}
                </p>
                <p className="text-gray-500 text-sm">{card.label}</p>
              </div>
            ))}
          </div>

          {/* CHARTS ROW 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* Monthly Registrations */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Monthly Registrations
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                New users registered per month (last 6 months)
              </p>
              {userGrowthData.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                  No registration data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#14b8a6"
                      strokeWidth={3}
                      dot={{ fill: "#14b8a6", r: 5 }}
                      activeDot={{ r: 7 }}
                      name="New Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Project Status */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Project Status
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Breakdown of all projects by current status
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={projectActivityData} barSize={50}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  />
                  <Bar dataKey="count" fill="#14b8a6" radius={[6, 6, 0, 0]} name="Projects" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHARTS ROW 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Proposal Stats */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Proposal Stats
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Proposals grouped by status
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={proposalData} barSize={50}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Proposals" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Submission Stats */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Submission Stats
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Submissions grouped by status
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={submissionData} barSize={50}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  />
                  <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Submissions" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

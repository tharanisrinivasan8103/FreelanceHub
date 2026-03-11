import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import API from "../../api/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 text-red-600 px-8 py-6 rounded-xl shadow text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalUsers = (stats.totalFreelancers || 0) + (stats.totalClients || 0);

  // PIE chart data for user roles
  const userRoleData = [
    { name: "Freelancers", value: stats.totalFreelancers || 0 },
    { name: "Clients", value: stats.totalClients || 0 },
  ];

  // BAR chart data for projects by status
  const projectStatusData = [
    { name: "Open", count: stats.openProjects || 0 },
    { name: "In Progress", count: stats.inProgressProjects || 0 },
    { name: "Completed", count: stats.completedProjects || 0 },
  ];

  // BAR chart for proposals by status
  const proposalStatusData = [
    { name: "Pending", count: stats.pendingProposals || 0 },
    { name: "Accepted", count: stats.acceptedProposals || 0 },
    { name: "Rejected", count: stats.rejectedProposals || 0 },
  ];

  // LINE chart for monthly registrations
  const monthlyData = stats.monthlyRegistrations || [];

  const PIE_COLORS = ["#14b8a6", "#6366f1"];
  const BAR_COLORS = ["#14b8a6", "#f59e0b", "#6366f1"];

  const statCards = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: "👥",
      color: "bg-teal-500",
      sub: `${stats.totalFreelancers || 0} Freelancers · ${stats.totalClients || 0} Clients`,
      path: "/admin/users",
    },
    {
      label: "Total Projects",
      value: stats.totalProjects || 0,
      icon: "📁",
      color: "bg-indigo-500",
      sub: `${stats.openProjects || 0} Open · ${stats.completedProjects || 0} Completed`,
      path: "/admin/projects",
    },
    {
      label: "Total Proposals",
      value: stats.totalProposals || 0,
      icon: "📄",
      color: "bg-amber-500",
      sub: `${stats.acceptedProposals || 0} Accepted · ${stats.pendingProposals || 0} Pending`,
      path: "/admin/projects",
    },
    {
      label: "Total Submissions",
      value: stats.totalSubmissions || 0,
      icon: "📤",
      color: "bg-purple-500",
      sub: `${stats.approvedSubmissions || 0} Approved · ${stats.pendingSubmissions || 0} Submitted`,
      path: "/admin/projects",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here is your platform overview.
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, i) => (
            <div
              key={i}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={"w-12 h-12 rounded-xl flex items-center justify-center text-2xl " + card.color}>
                  {card.icon}
                </div>
                <span className="text-3xl font-bold text-gray-800">
                  {card.value}
                </span>
              </div>
              <p className="text-gray-700 font-semibold mb-1">{card.label}</p>
              <p className="text-gray-400 text-xs">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* CHARTS ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* PROJECT STATUS BAR CHART */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Projects by Status</h2>
            <p className="text-gray-400 text-sm mb-6">Overview of all project statuses</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={projectStatusData} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {projectStatusData.map((entry, index) => (
                    <Cell key={index} fill={BAR_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* USER ROLE PIE CHART */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-1">User Distribution</h2>
            <p className="text-gray-400 text-sm mb-6">Freelancers vs Clients</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHARTS ROW 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* PROPOSAL STATUS BAR CHART */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Proposals by Status</h2>
            <p className="text-gray-400 text-sm mb-6">Overview of all proposal statuses</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={proposalStatusData} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {proposalStatusData.map((entry, index) => (
                    <Cell key={index} fill={BAR_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* MONTHLY REGISTRATIONS LINE CHART */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Monthly Registrations</h2>
            <p className="text-gray-400 text-sm mb-6">New users per month</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData}>
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUBMISSION STATS */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Submission Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-5 text-center">
              <p className="text-4xl font-bold text-blue-600 mb-1">
                {stats.totalSubmissions || 0}
              </p>
              <p className="text-gray-600 font-medium">Total Submissions</p>
            </div>
            <div className="bg-green-50 rounded-xl p-5 text-center">
              <p className="text-4xl font-bold text-green-600 mb-1">
                {stats.approvedSubmissions || 0}
              </p>
              <p className="text-gray-600 font-medium">Approved</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-5 text-center">
              <p className="text-4xl font-bold text-orange-500 mb-1">
                {stats.revisionSubmissions || 0}
              </p>
              <p className="text-gray-600 font-medium">Revision Requested</p>
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/admin/users")}
            className="bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-semibold transition shadow-sm"
          >
            👥 Manage Users
          </button>
          <button
            onClick={() => navigate("/admin/projects")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold transition shadow-sm"
          >
            📁 Manage Projects
          </button>
          <button
            onClick={() => navigate("/admin/reports")}
            className="bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-semibold transition shadow-sm"
          >
            📈 View Reports
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

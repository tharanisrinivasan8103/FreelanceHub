import React from "react";

const FreelancerDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, Sarah 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Here's your freelancing overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h4 className="text-gray-500 text-sm">Active Projects</h4>
          <h2 className="text-3xl font-bold mt-2">4</h2>
          <p className="text-green-500 text-sm mt-1">+1 new</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h4 className="text-gray-500 text-sm">Total Earnings</h4>
          <h2 className="text-3xl font-bold mt-2">$52K</h2>
          <p className="text-green-500 text-sm mt-1">+15% this month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h4 className="text-gray-500 text-sm">Avg Rating</h4>
          <h2 className="text-3xl font-bold mt-2">4.9</h2>
          <p className="text-green-500 text-sm mt-1">Top 5%</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h4 className="text-gray-500 text-sm">Pending Proposals</h4>
          <h2 className="text-3xl font-bold mt-2">7</h2>
          <p className="text-gray-500 text-sm mt-1">3 viewed</p>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Active Project */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">
            Active Projects
          </h2>

          <div className="border rounded-xl p-5">
            <h3 className="text-lg font-semibold">
              Mobile App Development
            </h3>

            <p className="text-gray-500 mt-2 mb-4">
              Build a cross-platform mobile app with real-time tracking.
            </p>

            <div className="flex justify-between text-sm text-gray-500">
              <span>$8,000 - $12,000</span>
              <span>8 proposals</span>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-6">
            Profile Completion
          </h2>

          <Progress label="Basic Info" value={100} />
          <Progress label="Portfolio" value={75} />
          <Progress label="Skills" value={90} />
          <Progress label="Certifications" value={40} />
        </div>

      </div>

    </div>
  );
};

const Progress = ({ label, value }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-teal-500 h-2 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default FreelancerDashboard;
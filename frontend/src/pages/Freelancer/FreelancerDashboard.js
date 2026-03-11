import React, { useEffect, useState } from "react";
import { getFreelancerDashboard } from "../../api/api";
import { useNavigate } from "react-router-dom";

const FreelancerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const [data, setData] = useState({ activeProjects: 0, pendingProposals: 0, projects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getFreelancerDashboard();
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  // ✅ Date format fix: 2026-03-17T18:30:00.000Z → 17 Mar 2026
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ Proposal status badge color
  const getStatusStyle = (status) => {
    if (status === "accepted") return "bg-green-100 text-green-600";
    if (status === "rejected") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name} 👋</h1>
        <p className="text-gray-500 mt-1">Here's your freelancing overview</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Applied Projects</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-1">{data.activeProjects}</h2>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Pending Proposals</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-1">{data.pendingProposals}</h2>
        </div>
        <div
          onClick={() => navigate("/freelancer/find-projects")}
          className="bg-teal-600 hover:bg-teal-700 cursor-pointer rounded-xl p-6 shadow-sm text-white transition"
        >
          <p className="text-sm text-teal-100">Find New Projects</p>
          <h2 className="text-xl font-bold mt-1">Browse Projects →</h2>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => navigate("/freelancer/find-projects")}
          className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-xl text-left transition"
        >
          <div className="text-2xl mb-2">🔎</div>
          <h3 className="font-bold text-lg">Find Projects</h3>
          <p className="text-blue-200 text-sm">Browse available projects</p>
        </button>
        <button
          onClick={() => navigate("/freelancer/proposals")}
          className="bg-green-600 hover:bg-green-700 text-white p-5 rounded-xl text-left transition"
        >
          <div className="text-2xl mb-2">📄</div>
          <h3 className="font-bold text-lg">My Proposals</h3>
          <p className="text-green-200 text-sm">Track your submitted proposals</p>
        </button>
      </div>

      {/* PROJECTS YOU APPLIED TO */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Projects You Applied To</h2>

        {data.projects.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No projects yet.{" "}
            <span
              className="text-blue-500 font-semibold cursor-pointer"
              onClick={() => navigate("/freelancer/find-projects")}
            >
              Find projects now!
            </span>
          </p>
        ) : (
          <div className="space-y-3">
            {data.projects.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{p.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {p.description?.slice(0, 70)}...
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-gray-500">
                      Budget: <span className="font-semibold text-gray-700">₹{p.budget}</span>
                    </span>
                    {/* ✅ Your Bid amount காட்டுது */}
                    <span className="text-teal-600 font-semibold">
                      Your Bid: ₹{p.my_bid}
                    </span>
                  </div>
                </div>
                {/* ✅ Proposal status badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(p.proposal_status)}`}>
                  {p.proposal_status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;

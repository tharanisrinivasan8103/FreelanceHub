import React, { useEffect, useState } from "react";
import API from "../../api/api";

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/proposals/my");
      setProposals(res.data || []);
    } catch (err) {
      console.error("Proposal fetch error:", err.response || err.message);
      setError("Unable to load proposals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "accepted") return "bg-green-100 text-green-600";
    if (status === "rejected") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Proposals</h1>

        {loading && <p className="text-gray-600">Loading Proposals...</p>}

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">{error}</div>
        )}

        {!loading && proposals.length === 0 && !error && (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <p className="text-gray-500 text-lg">No Proposals Found</p>
          </div>
        )}

        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {proposal.project_title || `Project #${proposal.project_id}`}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{proposal.message}</p>
                  <div className="flex gap-6 text-sm">
                    <span className="text-teal-600 font-bold">Your Bid: ₹{proposal.bid}</span>
                    {proposal.project_budget && (
                      <span className="text-gray-500">Project Budget: ₹{proposal.project_budget}</span>
                    )}
                    <span className="text-gray-400">
                      {proposal.created_at
                        ? new Date(proposal.created_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
                <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusStyle(proposal.status)}`}>
                  {proposal.status || "pending"}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyProposals;
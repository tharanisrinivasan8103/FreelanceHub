import React, { useEffect, useState } from "react";
import API from "../../api/api";

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH PROPOSALS =================
  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/proposals/freelancer/my-proposals");
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

  // ================= STATUS STYLE =================
  const getStatusStyle = (status) => {
    if (status === "accepted")
      return "bg-green-100 text-green-600";
    if (status === "rejected")
      return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
  };

  return (
    <div className="bg-gray-50 min-h-screen p-10">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          My Proposals
        </h1>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-600">Loading Proposals...</p>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && proposals.length === 0 && !error && (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <p className="text-gray-500 text-lg">
              No Proposals Found
            </p>
          </div>
        )}

        {/* PROPOSAL GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              {/* PROJECT TITLE */}
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {proposal.project_title ||
                  `Project ID: ${proposal.project_id}`}
              </h3>

              {/* BID */}
              <p className="text-teal-600 font-bold mb-3">
                ₹ {proposal.bid}
              </p>

              {/* MESSAGE */}
              <p className="text-gray-600 text-sm mb-4">
                {proposal.message}
              </p>

              {/* STATUS BADGE */}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                  proposal.status
                )}`}
              >
                {proposal.status || "pending"}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyProposals;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

const ProjectProposals = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectTitle, setProjectTitle] = useState("");

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await API.get(`/proposals/project/${id}`);
      setProposals(res.data || []);
      if (res.data?.length > 0) setProjectTitle(res.data[0].project_title || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (proposalId, status) => {
    try {
      await API.put(`/proposals/${proposalId}/status`, { status });
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status } : p))
      );
    } catch (err) {
      alert("Error updating proposal status");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 text-teal-600 hover:underline text-sm">
          ← Back to My Projects
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Proposals Received</h1>
        {projectTitle && <p className="text-gray-500 mb-6">Project: <span className="font-semibold text-gray-700">{projectTitle}</span></p>}

        {proposals.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow">
            No proposals received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow p-6 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{p.freelancer_name}</h3>
                    <p className="text-gray-500 text-sm">{p.freelancer_email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(p.status)}`}>
                    {p.status || "pending"}
                  </span>
                </div>

                <div className="mt-3 flex gap-6 text-sm">
                  <span className="text-teal-600 font-bold text-lg">₹{p.bid}</span>
                  <span className="text-gray-500 self-center">Bid Amount</span>
                </div>

                <p className="mt-3 text-gray-600 bg-gray-50 p-3 rounded-lg">{p.message}</p>

                {/* Accept / Reject buttons — only show if pending */}
                {(!p.status || p.status === "pending") && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => updateStatus(p.id, "accepted")}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => updateStatus(p.id, "rejected")}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectProposals;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

const ProposalView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectTitle, setProjectTitle] = useState("");

  const fetchProposals = async () => {
    try {
      const res = await API.get(`/proposals/project/${projectId}`);
      setProposals(res.data || []);
      if (res.data.length > 0) {
        setProjectTitle(res.data[0].project_title || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [projectId]);

  const handleAccept = async (proposalId) => {
    try {
      await API.put(`/proposals/${proposalId}/accept`);
      fetchProposals();
    } catch (err) {
      alert("Error accepting proposal");
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await API.put(`/proposals/${proposalId}/reject`);
      fetchProposals();
    } catch (err) {
      alert("Error rejecting proposal");
    }
  };

  const getStatusStyle = (status) => {
    if (status === "accepted") return "bg-green-100 text-green-600";
    if (status === "rejected") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
  };

  return (
    <div className="p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-2">Proposals</h2>
      {projectTitle && <p className="text-gray-500 mb-6">Project: {projectTitle}</p>}

      {loading && <p className="text-gray-500">Loading proposals...</p>}

      {!loading && proposals.length === 0 && (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <p className="text-gray-500 text-lg">No proposals received yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="bg-white border p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                    {proposal.freelancer_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{proposal.freelancer_name}</h3>
                    <p className="text-gray-400 text-xs">{proposal.freelancer_email}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{proposal.message}</p>
                <div className="flex gap-6 text-sm">
                  <span className="text-teal-600 font-bold text-base">Bid: ₹{proposal.bid}</span>
                  <span className="text-gray-400">
                    {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(proposal.status)}`}>
                  {proposal.status || "pending"}
                </span>
                {proposal.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(proposal.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(proposal.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalView;
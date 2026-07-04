import React from "react";

// ✅ Date format fix
const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });
};

const statusStyle = (status) => {
  if (status === "accepted") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-600";
  return "bg-yellow-100 text-yellow-700";
};

const ProposalCard = ({ proposal, onAccept, onReject, showActions }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl p-5 mb-4 border border-gray-100 hover:shadow-md transition">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">
        <div>
          {/* Show project title for freelancer view */}
          <h2 className="text-lg font-semibold text-gray-800">
            {proposal.project_title || proposal.freelancer_name || "Project"}
          </h2>
          {proposal.freelancer_name && !proposal.project_title && (
            <p className="text-sm text-gray-500">{proposal.freelancer_name}</p>
          )}
        </div>
        {/* ✅ Status badge */}
        <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusStyle(proposal.status)}`}>
          {proposal.status || "pending"}
        </span>
      </div>

      {/* MESSAGE */}
      <p className="text-gray-600 text-sm mb-3 bg-gray-50 p-3 rounded-lg">
        {proposal.message}
      </p>

      {/* BID + BUDGET + DATE */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="text-teal-600 font-bold">Your Bid: ₹{proposal.bid}</span>
        {proposal.project_budget && (
          <span className="text-gray-500">Project Budget: ₹{proposal.project_budget}</span>
        )}
        {/* ✅ Date format fixed */}
        {proposal.created_at && (
          <span className="text-gray-400">{formatDate(proposal.created_at)}</span>
        )}
        {proposal.project_deadline && (
          <span className="text-gray-400">📅 {formatDate(proposal.project_deadline)}</span>
        )}
      </div>

      {/* ACTION BUTTONS — client view */}
      {showActions && (!proposal.status || proposal.status === "pending") && (
        <div className="flex gap-3 mt-4 pt-4 border-t">
          <button onClick={() => onAccept(proposal.id)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
            ✓ Accept
          </button>
          <button onClick={() => onReject(proposal.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
            ✗ Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default ProposalCard;

import React from "react";

const ProposalCard = ({ proposal, onAccept, onReject, showActions }) => {

  return (

    <div className="bg-white shadow-md rounded-xl p-5 mb-4 hover:shadow-lg transition">


      {/* HEADER */}

      <div className="flex justify-between items-center mb-2">

        <h2 className="text-lg font-semibold text-gray-800">

          {proposal.freelancer_name || "Freelancer"}

        </h2>


        {/* STATUS */}

        <span
          className={`px-3 py-1 text-sm rounded-full ${
            proposal.status === "accepted"
              ? "bg-green-100 text-green-600"
              : proposal.status === "rejected"
              ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >

          {proposal.status || "pending"}

        </span>

      </div>



      {/* PROJECT */}

      <p className="text-gray-500 mb-1">

        Project: {proposal.project_title || "Project"}

      </p>



      {/* BID */}

      <p className="text-blue-500 font-bold mb-2">

        Bid: ₹{proposal.bid}

      </p>



      {/* MESSAGE */}

      <p className="text-gray-600 mb-3">

        {proposal.message}

      </p>



      {/* DATE */}

      <p className="text-sm text-gray-400 mb-3">

        {proposal.created_at
          ? new Date(proposal.created_at).toLocaleDateString()
          : ""}

      </p>



      {/* ACTION BUTTONS */}

      {showActions && proposal.status === "pending" && (

        <div className="flex gap-3">

          <button

            onClick={() => onAccept(proposal.id)}

            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"

          >

            Accept

          </button>


          <button

            onClick={() => onReject(proposal.id)}

            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"

          >

            Reject

          </button>

        </div>

      )}

    </div>

  );

};

export default ProposalCard;
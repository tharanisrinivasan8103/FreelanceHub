import React, { useState } from "react";
import { sendProposal } from "../api/api";

const ProjectCard = ({ project }) => {

  const user = JSON.parse(localStorage.getItem("user"));

  const [showModal, setShowModal] = useState(false);

  const [bid, setBid] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);



  // ==========================================
  // SEND PROPOSAL
  // ==========================================

  const handleProposalSubmit = async () => {

    if (!bid || !message) {

      alert("Please fill all fields");

      return;

    }

    try {

      setLoading(true);

      await sendProposal({

        project_id: project.id,

        freelancer_id: user.id,

        bid,

        message,

      });

      alert("Proposal Sent Successfully");

      setShowModal(false);

      setBid("");

      setMessage("");

    } catch (error) {

      alert("Error sending proposal");

    }

    setLoading(false);

  };



  return (

    <>

      {/* CARD */}

      <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">


        {/* TITLE */}

        <h2 className="text-xl font-bold text-gray-800 mb-2">

          {project.title}

        </h2>



        {/* DESCRIPTION */}

        <p className="text-gray-600 mb-3">

          {project.description}

        </p>



        {/* BUDGET */}

        <p className="text-blue-500 font-semibold mb-2">

          Budget: ₹{project.budget}

        </p>



        {/* SKILLS */}

        {project.skills && (

          <div className="flex flex-wrap gap-2 mb-3">

            {project.skills.split(",").map((skill, index) => (

              <span

                key={index}

                className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm"

              >

                {skill}

              </span>

            ))}

          </div>

        )}



        {/* BUTTON */}

        {user?.role === "freelancer" && (

          <button

            onClick={() => setShowModal(true)}

            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"

          >

            Send Proposal

          </button>

        )}

      </div>



      {/* ==========================================
          PROPOSAL MODAL
      ========================================== */}

      {showModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">


          <div className="bg-white p-6 rounded-lg w-96">


            <h2 className="text-xl font-bold mb-4">

              Send Proposal

            </h2>



            <input

              type="number"

              placeholder="Enter your bid"

              value={bid}

              onChange={(e) => setBid(e.target.value)}

              className="w-full border p-2 mb-3 rounded"

            />



            <textarea

              placeholder="Enter your message"

              value={message}

              onChange={(e) => setMessage(e.target.value)}

              className="w-full border p-2 mb-3 rounded"

            />



            <div className="flex justify-between">


              <button

                onClick={() => setShowModal(false)}

                className="bg-gray-400 text-white px-4 py-2 rounded"

              >

                Cancel

              </button>



              <button

                onClick={handleProposalSubmit}

                disabled={loading}

                className="bg-blue-500 text-white px-4 py-2 rounded"

              >

                {loading ? "Sending..." : "Send"}

              </button>


            </div>


          </div>


        </div>

      )}

    </>

  );

};

export default ProjectCard;
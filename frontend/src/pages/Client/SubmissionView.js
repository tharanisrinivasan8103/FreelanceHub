import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectSubmissions, approveSubmission, requestRevision } from "../../api/api";

const SubmissionView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [revisionModal, setRevisionModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState("");

  const fetchSubmissions = async () => {
    try {
      const res = await getProjectSubmissions(projectId);
      setSubmissions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [projectId]);

  const handleApprove = async (id) => {
    try {
      await approveSubmission(id);
      setSuccess("Submission Approved! Project marked as Completed");
      fetchSubmissions();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Error approving submission");
    }
  };

  const handleRevision = async () => {
    try {
      await requestRevision(selectedId, feedback);
      setRevisionModal(false);
      setFeedback("");
      setSuccess("Revision requested successfully");
      fetchSubmissions();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert("Error requesting revision");
    }
  };

  const getStatusStyle = (status) => {
    if (status === "approved") return "bg-green-100 text-green-600";
    if (status === "revision") return "bg-orange-100 text-orange-600";
    return "bg-blue-100 text-blue-600";
  };

  const openLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-500 hover:text-gray-700"
      >
        Back
      </button>

      <h2 className="text-2xl font-bold mb-2">Project Submissions</h2>
      {submissions[0] && (
        <p className="text-gray-500 mb-6">Project: {submissions[0].project_title}</p>
      )}

      {success && (
        <div className="mb-6 bg-green-100 text-green-600 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {loading && <p className="text-gray-500">Loading submissions...</p>}

      {!loading && submissions.length === 0 && (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-500 text-lg">No submissions yet</p>
          <p className="text-gray-400 text-sm mt-2">Freelancer has not submitted work yet</p>
        </div>
      )}

      <div className="space-y-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="bg-white border rounded-xl p-6 shadow-sm">

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                  {sub.freelancer_name && sub.freelancer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{sub.freelancer_name}</h3>
                  <p className="text-gray-400 text-xs">{sub.freelancer_email}</p>
                </div>
              </div>
              <span className={"px-3 py-1 rounded-full text-xs font-semibold capitalize " + getStatusStyle(sub.status)}>
                {sub.status}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4">{sub.description}</p>

            <div className="flex gap-4 mb-4">
              {sub.github_link && (
                <button
                  onClick={() => openLink(sub.github_link)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition"
                >
                  🔗 View GitHub
                </button>
              )}
              {sub.live_link && (
                <button
                  onClick={() => openLink(sub.live_link)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  🌐 Live Demo
                </button>
              )}
            </div>

            <p className="text-gray-400 text-xs mb-4">
              Submitted: {new Date(sub.created_at).toLocaleDateString()}
            </p>

            {sub.status === "submitted" && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(sub.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                >
                  ✅ Approve and Complete
                </button>
                <button
                  onClick={() => { setSelectedId(sub.id); setRevisionModal(true); }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                >
                  🔄 Request Revision
                </button>
              </div>
            )}

            {sub.status === "approved" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-600 text-sm font-medium">✅ Project Completed and Approved</p>
              </div>
            )}

            {sub.status === "revision" && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-orange-600 text-sm font-medium">🔄 Revision Requested - Waiting for resubmission</p>
              </div>
            )}

          </div>
        ))}
      </div>

      {revisionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Request Revision</h2>
            <textarea
              placeholder="Explain what needs to be changed..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg outline-none text-sm resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRevisionModal(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRevision}
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold"
              >
                Send Revision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionView;

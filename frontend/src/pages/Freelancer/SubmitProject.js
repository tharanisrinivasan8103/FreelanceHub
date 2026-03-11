import React, { useEffect, useState } from "react";
import API, { submitProject, getMySubmissions } from "../../api/api";
import { useNavigate } from "react-router-dom";

const SubmitProject = () => {
  const navigate = useNavigate();
  const [acceptedProjects, setAcceptedProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    description: "",
    github_link: "",
    live_link: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proposalsRes, submissionsRes] = await Promise.all([
          API.get("/proposals/my"),
          getMySubmissions(),
        ]);
        const accepted = (proposalsRes.data || []).filter(
          (p) => p.status === "accepted"
        );
        setAcceptedProjects(accepted);
        setSubmissions(submissionsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setForm({ description: "", github_link: "", live_link: "" });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.description) {
      setError("Description is required!");
      return;
    }
    try {
      setSubmitting(true);
      await submitProject({
        project_id: selectedProject.project_id,
        description: form.description,
        github_link: form.github_link,
        live_link: form.live_link,
      });
      setSuccess("Project submitted successfully!");
      setShowModal(false);
      const res = await getMySubmissions();
      setSubmissions(res.data || []);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "approved") return "bg-green-100 text-green-600";
    if (status === "revision") return "bg-orange-100 text-orange-600";
    return "bg-blue-100 text-blue-600";
  };

  const isSubmitted = (projectId) =>
    submissions.some((s) => s.project_id === projectId);

  const getSubmission = (projectId) =>
    submissions.find((s) => s.project_id === projectId);

  const openLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Submit Project</h1>
        <p className="text-gray-500 mb-8">Submit your completed work for client review</p>

        {success && (
          <div className="mb-6 bg-green-100 text-green-600 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {loading && <p className="text-gray-500">Loading projects...</p>}

        {!loading && acceptedProjects.length === 0 && (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-500 text-lg mb-2">No accepted projects yet</p>
            <p className="text-gray-400 text-sm mb-6">
              You need to get hired first before submitting work
            </p>
            <button
              onClick={() => navigate("/freelancer/find-projects")}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Find Projects
            </button>
          </div>
        )}

        <div className="space-y-4">
          {acceptedProjects.map((project) => {
            const submission = getSubmission(project.project_id);
            const submitted = isSubmitted(project.project_id);
            return (
              <div
                key={project.id}
                className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {project.project_title}
                    </h3>
                    <div className="flex gap-6 text-sm text-gray-500 mb-3">
                      <span>Budget: <strong>Rs.{project.project_budget}</strong></span>
                      <span>Your Bid: <strong className="text-teal-600">Rs.{project.bid}</strong></span>
                    </div>

                    {submitted && submission && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-700">Status:</span>
                          <span className={"px-3 py-1 rounded-full text-xs font-semibold capitalize " + getStatusStyle(submission.status)}>
                            {submission.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{submission.description}</p>
                        <div className="flex gap-4 text-sm">
                          {submission.github_link && (
                            <button
                              onClick={() => openLink(submission.github_link)}
                              className="text-blue-500 hover:underline"
                            >
                              🔗 GitHub Link
                            </button>
                          )}
                          {submission.live_link && (
                            <button
                              onClick={() => openLink(submission.live_link)}
                              className="text-green-500 hover:underline"
                            >
                              🌐 Live Demo
                            </button>
                          )}
                        </div>
                        {submission.status === "revision" && (
                          <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-orange-600 text-sm font-medium">
                              📝 Revision Requested
                            </p>
                          </div>
                        )}
                        {submission.status === "approved" && (
                          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-green-600 text-sm font-medium">
                              ✅ Project Approved! Great work!
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    {!submitted ? (
                      <button
                        onClick={() => handleOpenModal(project)}
                        className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition font-medium"
                      >
                        Submit Work
                      </button>
                    ) : submission && submission.status === "revision" ? (
                      <button
                        onClick={() => handleOpenModal(project)}
                        className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition font-medium"
                      >
                        Resubmit
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">Submitted</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Submit Your Work</h2>
            <p className="text-gray-500 text-sm mb-6">
              {selectedProject && selectedProject.project_title}
            </p>

            {error && (
              <div className="mb-4 bg-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Work Description *
              </label>
              <textarea
                placeholder="Describe what you built..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="4"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg outline-none text-sm resize-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                GitHub Repository Link
              </label>
              <input
                type="text"
                placeholder="https://github.com/username/repo"
                value={form.github_link}
                onChange={(e) => setForm({ ...form, github_link: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg outline-none text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Live Demo Link
              </label>
              <input
                type="text"
                placeholder="https://yourproject.com"
                value={form.live_link}
                onChange={(e) => setForm({ ...form, live_link: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg outline-none text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-semibold disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitProject;

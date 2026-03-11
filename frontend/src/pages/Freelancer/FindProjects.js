import React, { useEffect, useState } from "react";
import API from "../../api/api";

const CATEGORIES = [
  { value: "All",                 label: "All" },
  { value: "web-development",     label: "Web Development" },
  { value: "mobile-development",  label: "Mobile Development" },
  { value: "ui-ux-design",        label: "UI/UX Design" },
  { value: "graphic-design",      label: "Graphic Design" },
  { value: "backend-development", label: "Backend Development" },
  { value: "data-science",        label: "Data Science & ML" },
  { value: "devops",              label: "DevOps & Cloud" },
  { value: "content-writing",     label: "Content Writing" },
  { value: "digital-marketing",   label: "Digital Marketing" },
  { value: "video-editing",       label: "Video Editing" },
  { value: "seo",                 label: "SEO" },
  { value: "cybersecurity",       label: "Cybersecurity" },
  { value: "other",               label: "Other" },
];

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const FindProjects = () => {
  const [projects, setProjects]             = useState([]);
  const [search, setSearch]                 = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading]               = useState(true);
  const [appliedIds, setAppliedIds]         = useState([]);  // ✅ track applied projects
  const [modal, setModal]                   = useState(null); // ✅ modal state
  const [bid, setBid]                       = useState("");
  const [message, setMessage]               = useState("");
  const [submitting, setSubmitting]         = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchApplied();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get already applied project IDs
  const fetchApplied = async () => {
    try {
      const res = await API.get("/proposals/my");
      const ids = res.data.map((p) => p.project_id);
      setAppliedIds(ids);
    } catch (err) {}
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ✅ Open modal
  const openModal = (project) => {
    setModal(project);
    setBid("");
    setMessage("");
  };

  // ✅ Submit proposal from modal
  const submitProposal = async () => {
    if (!bid || !message) return alert("Please fill both fields");
    setSubmitting(true);
    try {
      await API.post("/proposals", { project_id: modal.id, bid, message });
      setAppliedIds((prev) => [...prev, modal.id]);
      setModal(null);
      alert("✅ Proposal Sent Successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending proposal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Find Projects</h1>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
        />

        {/* CATEGORY BUTTONS */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat.value
                  ? "bg-teal-600 text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-500">Loading projects...</p>}

        {!loading && filteredProjects.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow text-center text-gray-400">
            No projects found.
          </div>
        )}

        {/* PROJECT CARDS */}
        <div className="space-y-6">
          {filteredProjects.map((project) => {
            const alreadyApplied = appliedIds.includes(project.id);
            return (
              <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                    <p className="text-gray-600 mt-1">{project.description}</p>
                  </div>
                  <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-4">
                    Open
                  </span>
                </div>

                {project.skills && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.split(",").map((s, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="border-t pt-4 flex justify-between items-center">
                  <div className="flex gap-4 text-sm items-center flex-wrap">
                    <span className="font-semibold text-gray-800">₹{project.budget}</span>
                    {project.deadline && (
                      <span className="text-gray-500">📅 {formatDate(project.deadline)}</span>
                    )}
                    {project.category && (
                      <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-xs font-medium">
                        {CATEGORIES.find(c => c.value === project.category)?.label || project.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-teal-600 font-medium text-sm">
                      {project.proposalsCount || 0} proposals
                    </span>
                    {/* ✅ Already Applied disable */}
                    {alreadyApplied ? (
                      <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm cursor-not-allowed">
                        ✓ Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => openModal(project)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition text-sm"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ APPLY MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Apply for Project</h2>
            <p className="text-gray-500 text-sm mb-5">{modal.title}</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid Amount (₹)</label>
              <input
                type="number"
                placeholder={`Project budget: ₹${modal.budget}`}
                value={bid}
                onChange={(e) => setBid(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter / Message</label>
              <textarea
                rows={4}
                placeholder="Why are you the best fit for this project?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitProposal}
                disabled={submitting}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Submit Proposal"}
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindProjects;

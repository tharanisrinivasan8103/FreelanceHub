import React, { useState } from "react";
import { createProject } from "../../api/api";
import { useNavigate } from "react-router-dom";

// ✅ All categories for freelancing platform
const CATEGORIES = [
  { value: "web-development",     label: "🌐 Web Development" },
  { value: "mobile-development",  label: "📱 Mobile Development" },
  { value: "ui-ux-design",        label: "🎨 UI/UX Design" },
  { value: "graphic-design",      label: "✏️ Graphic Design" },
  { value: "backend-development", label: "⚙️ Backend Development" },
  { value: "data-science",        label: "📊 Data Science & ML" },
  { value: "devops",              label: "🚀 DevOps & Cloud" },
  { value: "content-writing",     label: "📝 Content Writing" },
  { value: "digital-marketing",   label: "📣 Digital Marketing" },
  { value: "video-editing",       label: "🎬 Video Editing" },
  { value: "seo",                 label: "🔍 SEO Optimization" },
  { value: "cybersecurity",       label: "🔒 Cybersecurity" },
  { value: "other",               label: "💼 Other" },
];

const PostProject = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    skills: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title || !form.description || !form.budget || !form.category) {
      setError("Title, Description, Budget and Category are required!");
      return;
    }

    setLoading(true);

    try {
      await createProject({
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
        category: form.category,
        skills: form.skills,
        deadline: form.deadline,
      });

      setSuccess("✅ Project posted successfully! Redirecting...");
      setForm({ title: "", description: "", budget: "", category: "", skills: "", deadline: "" });
      setTimeout(() => navigate("/client/my-projects"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error posting project");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">➕ Post a New Project</h1>
      <p className="text-gray-500 mb-6">Fill in the details to find the right freelancer.</p>

      <div className="bg-white rounded-xl shadow-sm p-8">

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4 text-sm">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* PROJECT TITLE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Build a React E-commerce Website"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-gray-700"
            >
              <option value="">-- Select a Category --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Describe what you need in detail..."
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* BUDGET + DEADLINE side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Budget (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="budget"
                placeholder="e.g. 5000"
                value={form.budget}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          {/* SKILLS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Required Skills
            </label>
            <input
              type="text"
              name="skills"
              placeholder="e.g. React, Node.js, MongoDB"
              value={form.skills}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <p className="text-xs text-gray-400 mt-1">Comma separated skills</p>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Posting..." : "🚀 Post Project"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default PostProject;

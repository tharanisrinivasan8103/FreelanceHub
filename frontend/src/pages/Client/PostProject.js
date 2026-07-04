import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export const CATEGORIES = [
  { value: "web-development",     label: "Web Development"     },
  { value: "mobile-development",  label: "Mobile Development"  },
  { value: "ui-ux-design",        label: "UI/UX Design"        },
  { value: "graphic-design",      label: "Graphic Design"      },
  { value: "backend-development", label: "Backend Development" },
  { value: "data-science",        label: "Data Science & ML"   },
  { value: "devops-cloud",        label: "DevOps / Cloud"      },
  { value: "content-writing",     label: "Content Writing"     },
  { value: "digital-marketing",   label: "Digital Marketing"   },
  { value: "video-editing",       label: "Video Editing"       },
  { value: "seo",                 label: "SEO"                 },
  { value: "cybersecurity",       label: "Cybersecurity"       },
  { value: "other",               label: "Other"               },
];

export const getCategoryLabel = (value) =>
  CATEGORIES.find((c) => c.value === value)?.label || value || "Other";

export default function PostProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", budget: "",
    category: "", skills: "", deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.title || !form.description || !form.budget || !form.category) {
      setError("Please fill all required fields including category.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/projects", {
        title:       form.title,
        description: form.description,
        budget:      form.budget,
        category:    form.category,
        skills:      form.skills,
        deadline:    form.deadline || null,
      });
      setSuccess("Project posted successfully!");
      setTimeout(() => navigate("/client/my-projects"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post project.");
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>

      {/* Header */}
      <p style={s.overline}>CLIENT</p>
      <h1 style={s.title}>Post a Project</h1>
      <p style={s.subtitle}>Fill in the details to find the right freelancer</p>

      {/* Alerts */}
      {error && (
        <div style={s.alertError}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div style={s.alertSuccess}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7"/>
          </svg>
          {success}
        </div>
      )}

      {/* Form card */}
      <div style={s.formCard}>

        {/* Project Title */}
        <div style={s.field}>
          <label style={s.label}>
            Project Title <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            name="title" value={form.title} onChange={handleChange}
            placeholder="e.g. Build a React dashboard"
            style={s.input}
          />
        </div>

        {/* Description */}
        <div style={s.field}>
          <label style={s.label}>
            Description <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <textarea
            name="description" value={form.description} onChange={handleChange}
            placeholder="Describe what you need, requirements, deliverables..."
            rows={4} style={{ ...s.input, resize: "none", lineHeight: 1.6 }}
          />
        </div>

        {/* Budget + Category */}
        <div style={s.twoCol}>
          <div style={s.field}>
            <label style={s.label}>
              Budget (₹) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={s.inputWrap}>
              <span style={s.inputPrefix}>₹</span>
              <input
                name="budget" type="number" value={form.budget} onChange={handleChange}
                placeholder="5000"
                style={{ ...s.input, paddingLeft: 28 }}
              />
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>
              Category <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select name="category" value={form.category} onChange={handleChange} style={s.input}>
              <option value="">-- Select Category --</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills */}
        <div style={s.field}>
          <label style={s.label}>
            Required Skills{" "}
            <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", fontSize: 11 }}>
              (optional, comma separated)
            </span>
          </label>
          <input
            name="skills" value={form.skills} onChange={handleChange}
            placeholder="e.g. React, Node.js, MySQL"
            style={s.input}
          />
        </div>

        {/* Deadline */}
        <div style={{ ...s.field, marginBottom: 28 }}>
          <label style={s.label}>
            Deadline{" "}
            <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", fontSize: 11 }}>
              (optional)
            </span>
          </label>
          <input
            name="deadline" type="date" value={form.deadline} onChange={handleChange}
            style={s.input}
          />
        </div>

        {/* Actions */}
        <div style={s.actions}>
          <button
            type="button" onClick={handleSubmit} disabled={loading}
            style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? (
              <>
                <div style={s.btnSpinner} /> Posting...
              </>
            ) : (
              <>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
                Post Project
              </>
            )}
          </button>
          <button
            type="button" onClick={() => navigate("/client/my-projects")}
            style={s.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    background: "#f8fafc", minHeight: "100vh",
    padding: "36px 40px", fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  overline: {
    fontSize: 11, fontWeight: 700, color: "#94a3b8",
    letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 6px",
  },
  title: {
    fontSize: 26, fontWeight: 700, color: "#0f172a",
    margin: "0 0 4px", letterSpacing: "-0.5px",
  },
  subtitle: { fontSize: 14, color: "#64748b", margin: "0 0 28px" },

  /* alerts */
  alertError: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#fff1f2", border: "1px solid #fecdd3",
    color: "#dc2626", padding: "11px 16px", borderRadius: 9,
    marginBottom: 16, fontSize: 13, fontWeight: 500,
  },
  alertSuccess: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#f0fdf4", border: "1px solid #86efac",
    color: "#15803d", padding: "11px 16px", borderRadius: 9,
    marginBottom: 16, fontSize: 13, fontWeight: 500,
  },

  /* form card */
  formCard: {
    background: "white", border: "1px solid #e2e8f0",
    borderRadius: 16, padding: "28px 32px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    maxWidth: 640,
  },
  field:  { marginBottom: 18 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 0 },
  label: {
    fontSize: 11, fontWeight: 700, color: "#64748b",
    display: "block", marginBottom: 5,
    textTransform: "uppercase", letterSpacing: "0.7px",
  },
  input: {
    width: "100%", padding: "10px 13px",
    border: "1.5px solid #e2e8f0", borderRadius: 8,
    fontSize: 13, outline: "none",
    background: "white", color: "#0f172a",
    boxSizing: "border-box", fontFamily: "inherit",
  },
  inputWrap: { position: "relative" },
  inputPrefix: {
    position: "absolute", left: 11, top: "50%",
    transform: "translateY(-50%)",
    fontSize: 13, color: "#94a3b8", fontWeight: 600,
    pointerEvents: "none",
  },

  /* actions */
  actions: { display: "flex", gap: 12 },
  submitBtn: {
    display: "flex", alignItems: "center", gap: 7,
    flex: 1, padding: "12px 20px", borderRadius: 9, border: "none",
    background: "#0f766e", color: "white",
    fontSize: 14, fontWeight: 700,
  },
  cancelBtn: {
    padding: "12px 20px", borderRadius: 9,
    border: "1px solid #e2e8f0", background: "white",
    color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
  btnSpinner: {
    width: 14, height: 14, borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white",
  },
};

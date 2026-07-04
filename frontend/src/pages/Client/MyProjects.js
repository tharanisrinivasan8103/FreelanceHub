import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const CATEGORIES = [
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

const getCategoryLabel = (value) =>
  CATEGORIES.find((c) => c.value === value)?.label || value || "Other";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

/* SVG icons matching the sidebar style */
const IconDoc = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
  </svg>
);
const IconSubmit = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
  </svg>
);
const IconPlus = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 4v16M4 12h16"/>
  </svg>
);

const statusStyle = (status) => {
  const map = {
    open:        { bg: "#dcfce7", color: "#15803d" },
    "in-progress": { bg: "#dbeafe", color: "#1d4ed8" },
    completed:   { bg: "#f1f5f9", color: "#475569" },
  };
  return map[status] || map.open;
};

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/projects/client")
      .then((res) => setProjects(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={s.loadWrap}><div style={s.spinner} /></div>
  );

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.headerRow}>
        <div>
          <p style={s.overline}>CLIENT</p>
          <h1 style={s.title}>My Projects</h1>
          <p style={s.subtitle}>{projects.length} project{projects.length !== 1 ? "s" : ""} posted</p>
        </div>
        <button onClick={() => navigate("/client/post-project")} style={s.primaryBtn}>
          <IconPlus />
          Post New Project
        </button>
      </div>

      {/* ── List ── */}
      {projects.length === 0 ? (
        <div style={s.emptyCard}>
          <svg width="40" height="40" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M3 7h18M3 12h18M3 17h18"/>
          </svg>
          <p style={{ color: "#94a3b8", margin: "10px 0 16px", fontSize: 14 }}>No projects posted yet.</p>
          <button onClick={() => navigate("/client/post-project")} style={s.primaryBtn}>
            <IconPlus /> Post your first project
          </button>
        </div>
      ) : (
        <div style={s.list}>
          {projects.map((p) => {
            const st = statusStyle(p.status);
            return (
              <div key={p.id} style={s.card}>

                {/* Title + Status */}
                <div style={s.cardTop}>
                  <h3 style={s.cardTitle}>{p.title}</h3>
                  <span style={{ ...s.statusBadge, background: st.bg, color: st.color }}>
                    {(p.status || "open").toUpperCase()}
                  </span>
                </div>

                {/* Description */}
                <p style={s.cardDesc}>
                  {p.description?.slice(0, 110)}{p.description?.length > 110 ? "..." : ""}
                </p>

                {/* Meta row */}
                <div style={s.metaRow}>
                  <span style={s.metaItem}>
                    <svg width="13" height="13" fill="none" stroke="#0f766e" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                    <strong style={{ color: "#0f172a" }}>₹{Number(p.budget).toLocaleString()}</strong>
                  </span>
                  {p.deadline && (
                    <span style={s.metaItem}>
                      <svg width="13" height="13" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                      </svg>
                      {formatDate(p.deadline)}
                    </span>
                  )}
                  <span style={s.catTag}>{getCategoryLabel(p.category)}</span>
                </div>

                {/* Skills */}
                {p.skills && (
                  <div style={s.skillRow}>
                    {p.skills.split(",").map((sk, i) => (
                      <span key={i} style={s.skillTag}>{sk.trim()}</span>
                    ))}
                  </div>
                )}

                {/* Divider + Actions */}
                <div style={s.cardFooter}>
                  <button onClick={() => navigate(`/client/projects/${p.id}/proposals`)} style={s.btnPrimary}>
                    <IconDoc /> View Proposals
                  </button>
                  <button onClick={() => navigate(`/client/projects/${p.id}/submissions`)} style={s.btnGhost}>
                    <IconSubmit /> Submissions
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  page: {
    background: "#f8fafc", minHeight: "100vh",
    padding: "36px 40px", fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  loadWrap: {
    background: "#f8fafc", minHeight: "100vh",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  spinner: {
    width: 32, height: 32, borderRadius: "50%",
    border: "3px solid #e2e8f0", borderTopColor: "#14b8a6",
  },

  /* header */
  headerRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 28,
  },
  overline: {
    fontSize: 11, fontWeight: 700, color: "#94a3b8",
    letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 6px",
  },
  title: {
    fontSize: 26, fontWeight: 700, color: "#0f172a",
    margin: "0 0 4px", letterSpacing: "-0.5px",
  },
  subtitle: { fontSize: 13, color: "#64748b", margin: 0 },
  primaryBtn: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "10px 18px", borderRadius: 9, border: "none",
    background: "#0f766e", color: "white",
    fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0,
  },

  /* empty */
  emptyCard: {
    background: "white", border: "1px solid #e2e8f0",
    borderRadius: 14, padding: "60px 24px", textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center",
  },

  /* list */
  list: { display: "flex", flexDirection: "column", gap: 14 },

  /* card — matches Image 1: white, clean, compact */
  card: {
    background: "white", border: "1px solid #e2e8f0",
    borderRadius: 14, padding: "20px 24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  cardTop: {
    display: "flex", alignItems: "center", gap: 10, marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0,
  },
  statusBadge: {
    fontSize: 10, fontWeight: 700, padding: "3px 10px",
    borderRadius: 20, letterSpacing: "0.5px", flexShrink: 0,
  },
  cardDesc: {
    fontSize: 13, color: "#64748b", margin: "0 0 10px", lineHeight: 1.55,
  },

  /* meta */
  metaRow: {
    display: "flex", alignItems: "center", gap: 14,
    flexWrap: "wrap", marginBottom: 10,
  },
  metaItem: {
    display: "flex", alignItems: "center", gap: 4,
    fontSize: 13, color: "#64748b",
  },
  catTag: {
    fontSize: 11, fontWeight: 700, color: "#0f766e",
    background: "#f0fdfa", border: "1px solid #99f6e4",
    borderRadius: 20, padding: "2px 10px",
  },

  /* skills */
  skillRow: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 },
  skillTag: {
    background: "#f8fafc", color: "#475569",
    border: "1px solid #e2e8f0", borderRadius: 6,
    padding: "2px 9px", fontSize: 11, fontWeight: 600,
  },

  /* footer buttons — matches Image 1: teal + ghost, small, rounded */
  cardFooter: {
    borderTop: "1px solid #f1f5f9", paddingTop: 14,
    display: "flex", gap: 10,
  },
  btnPrimary: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "8px 16px", borderRadius: 8, border: "none",
    background: "#0f766e", color: "white",
    fontSize: 12, fontWeight: 700, cursor: "pointer",
  },
  btnGhost: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "8px 16px", borderRadius: 8,
    border: "1px solid #99f6e4", background: "#f0fdfa",
    color: "#0f766e", fontSize: 12, fontWeight: 700, cursor: "pointer",
  },
};

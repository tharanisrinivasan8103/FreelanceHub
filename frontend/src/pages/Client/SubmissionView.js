import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

const statusConfig = {
  submitted: { bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE", dot: "#3B82F6", label: "Submitted" },
  approved:  { bg: "#F0FDF4", color: "#15803D", border: "#86EFAC", dot: "#22C55E", label: "Approved"  },
  revision:  { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA", dot: "#F97316", label: "Needs Revision" },
};

const AVATAR_COLORS = [
  "linear-gradient(135deg,#0f766e,#0891b2)",
  "linear-gradient(135deg,#7c3aed,#a855f7)",
  "linear-gradient(135deg,#be185d,#f43f5e)",
  "linear-gradient(135deg,#b45309,#f59e0b)",
  "linear-gradient(135deg,#166534,#22c55e)",
];

/* ── Icons ── */
const IconGithub = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
  </svg>
);
const IconExternal = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M5 13l4 4L19 7"/>
  </svg>
);
const IconRevision = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
  </svg>
);
const IconBack = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const IconDoc = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
  </svg>
);

export default function Submissions() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [project,     setProject]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [feedback,    setFeedback]    = useState({});
  const [acting,      setActing]      = useState({});
  const [toast,       setToast]       = useState({ msg: "", type: "success" });

  useEffect(() => {
    API.get(`/submissions/project/${projectId}`)
      .then((res) => {
        const data = res.data || [];
        setSubmissions(data);
        if (data.length > 0 && data[0].project_title) {
          setProject({ title: data[0].project_title });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const act = async (subId, status) => {
    setActing((a) => ({ ...a, [subId]: true }));
    try {
      await API.put(`/submissions/${subId}/status`, {
        status,
        feedback: feedback[subId] || "",
      });
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === subId
            ? { ...s, status, feedback: feedback[subId] || s.feedback }
            : s
        )
      );
      showToast(
        status === "approved"
          ? "✓ Submission approved successfully!"
          : "↺ Revision requested",
        status === "approved" ? "success" : "warning"
      );
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    }
    setActing((a) => ({ ...a, [subId]: false }));
  };

  const initials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  if (loading) return (
    <div style={s.loadWrap}>
      <style>{spinCSS}</style>
      <div style={s.spinnerWrap}>
        <div style={s.spinner} />
        <span style={{ fontSize: 13, color: "#64748b", marginTop: 12 }}>Loading submissions...</span>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <style>{spinCSS}</style>

      {/* ── Toast ── */}
      {toast.msg && (
        <div style={{
          ...s.toast,
          background: toast.type === "success" ? "#065f46"
                    : toast.type === "warning"  ? "#92400e"
                    : "#991b1b",
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {toast.type === "success" ? <IconCheck /> : <IconRevision />}
          </div>
          {toast.msg}
        </div>
      )}

      {/* ── Back ── */}
      <button
        onClick={() => navigate("/client/my-projects")}
        style={s.backBtn}
        onMouseEnter={e => { e.currentTarget.style.color = "#0f766e"; e.currentTarget.style.background = "#f0fdfa"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "transparent"; }}
      >
        <IconBack /> Back to Projects
      </button>

      {/* ── Page Header ── */}
      <div style={s.headerRow}>
        <div>
          <p style={s.overline}>SUBMISSIONS</p>
          <h1 style={s.title}>Work Submissions</h1>
          {project && (
            <p style={s.subtitle}>
              Project: <strong style={{ color: "#0f172a", fontWeight: 700 }}>{project.title}</strong>
            </p>
          )}
        </div>
        <div style={s.countBadge}>
          <div style={s.countIcon}><IconDoc /></div>
          <span>{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* ── Empty state ── */}
      {submissions.length === 0 ? (
        <div style={s.emptyCard}>
          <div style={s.emptyIconWrap}>
            <svg width="40" height="40" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p style={s.emptyTitle}>No submissions yet</p>
          <p style={s.emptyText}>The freelancer hasn't submitted their work yet.</p>
        </div>
      ) : (
        <div style={s.list}>
          {submissions.map((sub, idx) => {
            const st       = statusConfig[sub.status] || statusConfig.submitted;
            const isActing = acting[sub.id];
            const isDone   = sub.status === "approved";
            const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length];

            return (
              <div key={sub.id} style={s.card}>

                {/* Card header */}
                <div style={s.cardHeader}>
                  <div style={s.freelancerRow}>
                    <div style={{ ...s.avatar, background: avatarBg }}>
                      {initials(sub.freelancer_name)}
                    </div>
                    <div>
                      <p style={s.freelancerName}>{sub.freelancer_name}</p>
                      <p style={s.submittedAt}>Submitted: {fmt(sub.created_at)}</p>
                    </div>
                  </div>
                  <span style={{
                    ...s.statusBadge,
                    background: st.bg,
                    color: st.color,
                    border: `1px solid ${st.border}`,
                  }}>
                    <span style={{ ...s.dot, background: st.dot }} />
                    {st.label.toUpperCase()}
                  </span>
                </div>

                {/* Divider */}
                <div style={s.divider} />

                {/* Work description */}
                <div style={s.descBox}>
                  <p style={s.descLabel}>Work Description</p>
                  <p style={s.descText}>{sub.description}</p>
                </div>

                {/* Links */}
                {(sub.github_link || sub.live_link) && (
                  <div style={s.linkRow}>
                    {sub.github_link && (
                      <a
                        href={sub.github_link}
                        target="_blank"
                        rel="noreferrer"
                        style={s.linkBtnDark}
                        onMouseEnter={e => e.currentTarget.style.background = "#1e293b"}
                        onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
                      >
                        <IconGithub /> GitHub
                      </a>
                    )}
                    {sub.live_link && (
                      <a
                        href={sub.live_link}
                        target="_blank"
                        rel="noreferrer"
                        style={s.linkBtnTeal}
                        onMouseEnter={e => e.currentTarget.style.background = "#ccfbf1"}
                        onMouseLeave={e => e.currentTarget.style.background = "#f0fdfa"}
                      >
                        <IconExternal /> Live Demo
                      </a>
                    )}
                  </div>
                )}

                {/* Previous feedback (revision state) */}
                {sub.feedback && sub.status === "revision" && (
                  <div style={s.prevFeedbackBox}>
                    <p style={s.prevFeedbackLabel}>Previous Feedback</p>
                    <p style={s.prevFeedbackText}>{sub.feedback}</p>
                  </div>
                )}

                {/* Action section */}
                {!isDone && (
                  <div style={s.actionSection}>
                    <label style={s.feedbackLabel}>
                      Feedback
                      <span style={s.feedbackHint}> (optional – for revision)</span>
                    </label>
                    <textarea
                      value={feedback[sub.id] || ""}
                      onChange={(e) => setFeedback((f) => ({ ...f, [sub.id]: e.target.value }))}
                      placeholder="Tell the freelancer what needs to be changed..."
                      rows={3}
                      style={s.textarea}
                      onFocus={e  => e.target.style.border = "1.5px solid #14b8a6"}
                      onBlur={e   => e.target.style.border = "1.5px solid #e2e8f0"}
                    />
                    <div style={s.btnRow}>
                      <button
                        onClick={() => act(sub.id, "approved")}
                        disabled={isActing}
                        style={{ ...s.approveBtn, opacity: isActing ? 0.7 : 1 }}
                        onMouseEnter={e => !isActing && (e.currentTarget.style.background = "#065f46")}
                        onMouseLeave={e => !isActing && (e.currentTarget.style.background = "#0f766e")}
                      >
                        {isActing ? <div style={s.btnSpinnerWhite} /> : <IconCheck />}
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          if (!feedback[sub.id]?.trim()) {
                            showToast("Please add feedback before requesting a revision.", "warning");
                            return;
                          }
                          act(sub.id, "revision");
                        }}
                        disabled={isActing}
                        style={{ ...s.revisionBtn, opacity: isActing ? 0.7 : 1 }}
                        onMouseEnter={e => !isActing && (e.currentTarget.style.background = "#fff7ed")}
                        onMouseLeave={e => !isActing && (e.currentTarget.style.background = "#fffbf5")}
                      >
                        {isActing
                          ? <div style={{ ...s.btnSpinnerWhite, borderTopColor: "#ea580c" }} />
                          : <IconRevision />}
                        Request Revision
                      </button>
                    </div>
                  </div>
                )}

                {/* Approved state */}
                {isDone && (
                  <div style={s.approvedBanner}>
                    <div style={s.approvedIconWrap}><IconCheck /></div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#15803d" }}>
                        Submission Approved
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#16a34a" }}>
                        Great work! This submission has been accepted.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const spinCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  @keyframes _sub_spin { to { transform: rotate(360deg); } }
  @keyframes _toast_in { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
`;

const s = {
  page: {
    background: "#f8fafc",
    minHeight: "100vh",
    padding: "32px 40px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  loadWrap: {
    background: "#f8fafc",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  spinner: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "3px solid #e2e8f0",
    borderTopColor: "#14b8a6",
    animation: "_sub_spin .8s linear infinite",
  },

  toast: {
    position: "fixed",
    top: 20,
    right: 24,
    color: "white",
    padding: "12px 18px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    zIndex: 200,
    animation: "_toast_in .2s ease",
  },

  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "#64748b",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: 8,
    marginBottom: 20,
    transition: "color 0.15s, background 0.15s",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  overline: {
    fontSize: 11,
    fontWeight: 700,
    color: "#94a3b8",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    margin: "0 0 6px",
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
    letterSpacing: "-0.5px",
  },
  subtitle: { fontSize: 14, color: "#64748b", margin: 0 },

  countBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#f0fdfa",
    border: "1px solid #99f6e4",
    borderRadius: 10,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 600,
    color: "#0f766e",
    flexShrink: 0,
  },
  countIcon: {
    width: 26,
    height: 26,
    borderRadius: 7,
    background: "#ccfbf1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyCard: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: "64px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" },
  emptyText:  { fontSize: 13, color: "#94a3b8", margin: 0 },

  list: { display: "flex", flexDirection: "column", gap: 16 },

  card: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: "22px 24px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  freelancerRow: { display: "flex", alignItems: "center", gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 800,
    color: "white",
    flexShrink: 0,
    letterSpacing: 0.5,
  },
  freelancerName: { fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 3px" },
  submittedAt:   { fontSize: 12, color: "#94a3b8", margin: 0 },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  dot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },

  divider: {
    height: 1,
    background: "#f1f5f9",
    margin: "0 0 16px",
  },

  descBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "14px 16px",
    marginBottom: 16,
  },
  descLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    margin: "0 0 8px",
  },
  descText: {
    fontSize: 13,
    color: "#374151",
    margin: 0,
    lineHeight: 1.7,
  },

  linkRow: { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" },
  linkBtnDark: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 16px",
    borderRadius: 8,
    background: "#0f172a",
    color: "white",
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
    transition: "background 0.15s",
  },
  linkBtnTeal: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 16px",
    borderRadius: 8,
    background: "#f0fdfa",
    color: "#0f766e",
    border: "1px solid #99f6e4",
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
    transition: "background 0.15s",
  },

  prevFeedbackBox: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: 9,
    padding: "12px 14px",
    marginBottom: 16,
  },
  prevFeedbackLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#c2410c",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    margin: "0 0 5px",
  },
  prevFeedbackText: { fontSize: 13, color: "#9a3412", margin: 0, lineHeight: 1.55 },

  actionSection: {
    borderTop: "1px solid #f1f5f9",
    paddingTop: 18,
    marginTop: 4,
  },
  feedbackLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    display: "block",
    marginBottom: 7,
    textTransform: "uppercase",
    letterSpacing: "0.7px",
  },
  feedbackHint: {
    fontSize: 10,
    fontWeight: 400,
    color: "#94a3b8",
    textTransform: "none",
  },
  textarea: {
    width: "100%",
    padding: "10px 13px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 9,
    fontSize: 13,
    color: "#0f172a",
    outline: "none",
    resize: "none",
    lineHeight: 1.6,
    background: "#fafafa",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border 0.15s",
    marginBottom: 14,
    display: "block",
  },

  btnRow: { display: "flex", gap: 10 },

  approveBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 22px",
    borderRadius: 9,
    border: "none",
    background: "#0f766e",
    color: "white",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.15s, opacity 0.15s",
  },
  revisionBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 22px",
    borderRadius: 9,
    border: "1.5px solid #fed7aa",
    background: "#fffbf5",
    color: "#ea580c",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.15s, opacity 0.15s",
  },
  btnSpinnerWhite: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    animation: "_sub_spin .7s linear infinite",
  },

  approvedBanner: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: 10,
    padding: "14px 16px",
    marginTop: 16,
  },
  approvedIconWrap: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#22c55e",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};

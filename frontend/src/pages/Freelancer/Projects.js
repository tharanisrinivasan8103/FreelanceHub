import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

const subStatus = {
  approved:  { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7", dot: "#10b981", label: "Approved" },
  revision:  { bg: "#fff7ed", color: "#9a3412", border: "#fed7aa", dot: "#f97316", label: "Needs Revision" },
  submitted: { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe", dot: "#3b82f6", label: "Under Review" },
};

export default function Projects() {
  const navigate = useNavigate();
  const [proposals, setProposals]     = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(null);
  const [form, setForm]               = useState({ description: "", github_link: "", live_link: "" });
  const [submitting, setSubmitting]   = useState(false);
  const [successId, setSuccessId]     = useState(null);

  useEffect(() => {
    Promise.all([API.get("/proposals/my"), API.get("/submissions/my")])
      .then(([pr, sr]) => {
        setProposals((pr.data || []).filter((p) => p.status === "accepted"));
        setSubmissions(sr.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getSub = (pid) => submissions.find((s) => s.project_id === pid);

  const handleSubmit = async () => {
    if (!form.description) return alert("Description is required");
    setSubmitting(true);
    try {
      await API.post("/submissions", {
        project_id:  modal.project_id,
        description: form.description,
        github_link: form.github_link,
        live_link:   form.live_link,
      });
      const r = await API.get("/submissions/my");
      setSubmissions(r.data || []);
      setSuccessId(modal.project_id);
      setTimeout(() => { setSuccessId(null); setModal(null); }, 2000);
    } catch (e) {
      alert(e.response?.data?.message || "Error submitting work");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div style={styles.loadWrap}><div style={styles.spinner} /></div>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.overline}>WORKSPACE</p>
          <h1 style={styles.title}>My Projects</h1>
          <p style={styles.subtitle}>Submit completed work for client review</p>
        </div>
        {proposals.length > 0 && (
          <div style={styles.countPill}>
            <svg width="14" height="14" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {proposals.length} Active Project{proposals.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Empty state */}
      {proposals.length === 0 ? (
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>
            <svg width="32" height="32" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
          </div>
          <p style={styles.emptyTitle}>No accepted projects yet</p>
          <p style={styles.emptySub}>Once a client accepts your proposal, projects will appear here</p>
          <button onClick={() => navigate("/freelancer/find-projects")} style={styles.primaryBtn}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            Browse Projects
          </button>
        </div>
      ) : (
        <div style={styles.list}>
          {proposals.map((p) => {
            const sub = getSub(p.project_id);
            const ss  = sub ? (subStatus[sub.status] || subStatus.submitted) : null;
            return (
              <div key={p.id} style={styles.card}>
                {/* Top Row */}
                <div style={styles.cardTop}>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.cardTitle}>{p.project_title}</h3>
                    <div style={styles.cardMeta}>
                      <span style={styles.metaChip}>
                        Budget: <strong>₹{p.project_budget || p.budget}</strong>
                      </span>
                      <span style={{ ...styles.metaChip, color: "#0f766e", background: "#f0fdfa", border: "1px solid #99f6e4" }}>
                        Your Bid: <strong>₹{p.bid}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!sub ? (
                    <button onClick={() => { setModal(p); setForm({ description: "", github_link: "", live_link: "" }); }} style={styles.submitWorkBtn}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                      Submit Work
                    </button>
                  ) : sub.status === "revision" ? (
                    <button onClick={() => { setModal(p); setForm({ description: sub.description || "", github_link: sub.github_link || "", live_link: sub.live_link || "" }); }} style={styles.resubmitBtn}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                      Resubmit
                    </button>
                  ) : (
                    <span style={styles.doneChip}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                      Submitted
                    </span>
                  )}
                </div>

                {/* Submission Card */}
                {sub && ss && (
                  <div style={{ ...styles.subCard, borderLeft: `3px solid ${ss.dot}` }}>
                    <div style={styles.subHeader}>
                      <span style={{ ...styles.badge, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                        <span style={{ ...styles.dot, background: ss.dot }} />
                        {ss.label}
                      </span>
                      <div style={styles.subLinks}>
                        {sub.github_link && (
                          <a href={sub.github_link} target="_blank" rel="noreferrer" style={styles.link}>
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                            GitHub
                          </a>
                        )}
                        {sub.live_link && (
                          <a href={sub.live_link} target="_blank" rel="noreferrer" style={{ ...styles.link, color: "#0f766e", borderColor: "#99f6e4", background: "#f0fdfa" }}>
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    {sub.description && <p style={styles.subDesc}>{sub.description}</p>}
                    {sub.feedback && (
                      <div style={styles.feedbackBox}>
                        <strong>Client Feedback:</strong> {sub.feedback}
                      </div>
                    )}
                    {sub.status === "approved" && (
                      <div style={styles.approvedBox}>
                        <svg width="15" height="15" fill="none" stroke="#065f46" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Project approved — great work!
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Modal */}
      {modal && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div style={styles.modalBox}>
            {successId === modal.project_id ? (
              <div style={styles.successState}>
                <div style={styles.successIcon}>
                  <svg width="28" height="28" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                </div>
                <h3 style={{ color: "#065f46", fontWeight: 700, margin: "12px 0 4px" }}>Work Submitted!</h3>
                <p style={{ color: "#64748b", fontSize: 13 }}>The client will review your submission.</p>
              </div>
            ) : (
              <>
                <div style={styles.modalHeader}>
                  <div>
                    <h2 style={styles.modalTitle}>Submit Your Work</h2>
                    <p style={styles.modalSub}>{modal.project_title}</p>
                  </div>
                  <button onClick={() => setModal(null)} style={styles.closeBtn}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>

                <label style={styles.label}>Work Description <span style={{ color: "#ef4444" }}>*</span></label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} placeholder="Describe what you built and any key decisions..."
                  style={{ ...styles.input, resize: "none", lineHeight: 1.6 }} />

                <label style={styles.label}>GitHub Repository</label>
                <input type="url" value={form.github_link} onChange={(e) => setForm({ ...form, github_link: e.target.value })}
                  placeholder="https://github.com/username/repo" style={styles.input} />

                <label style={styles.label}>Live Demo <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", fontSize: 11 }}>(optional)</span></label>
                <input type="url" value={form.live_link} onChange={(e) => setForm({ ...form, live_link: e.target.value })}
                  placeholder="https://yourproject.vercel.app" style={{ ...styles.input, marginBottom: 20 }} />

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleSubmit} disabled={submitting} style={{ ...styles.primaryBtn, flex: 1, justifyContent: "center", opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? "Submitting..." : "Submit Project"}
                  </button>
                  <button onClick={() => setModal(null)} style={styles.cancelBtn}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { background: "#f8fafc", minHeight: "100vh", padding: "36px 40px", fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  loadWrap: { background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" },
  spinner: { width: 36, height: 36, borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#14b8a6" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  overline: { fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 6px" },
  title: { fontSize: 26, fontWeight: 700, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.5px" },
  subtitle: { fontSize: 14, color: "#64748b", margin: 0 },
  countPill: { display: "flex", alignItems: "center", gap: 7, background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, color: "#065f46" },
  emptyCard: { background: "white", border: "1px solid #e2e8f0", borderRadius: 14, padding: "64px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" },
  emptyIcon: { width: 72, height: 72, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" },
  emptySub: { fontSize: 13, color: "#94a3b8", margin: "0 0 20px", maxWidth: 320 },
  primaryBtn: { display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, border: "none", background: "#0f766e", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: 14 },
  card: { background: "white", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" },
  cardMeta: { display: "flex", gap: 8 },
  metaChip: { fontSize: 12, color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "3px 10px" },
  submitWorkBtn: { display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, border: "none", background: "#0f766e", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 },
  resubmitBtn: { display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, border: "none", background: "#ea580c", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 },
  doneChip: { display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#16a34a", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  subCard: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px" },
  subHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" },
  badge: { display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 },
  dot: { width: 6, height: 6, borderRadius: "50%" },
  subLinks: { display: "flex", gap: 8, marginLeft: "auto" },
  link: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#1e40af", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "4px 10px", textDecoration: "none" },
  subDesc: { fontSize: 13, color: "#64748b", margin: "0 0 8px", lineHeight: 1.5 },
  feedbackBox: { background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#9a3412", marginTop: 8 },
  approvedBox: { display: "flex", alignItems: "center", gap: 6, background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#065f46", fontWeight: 600, marginTop: 8 },
  overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 },
  modalBox: { background: "white", borderRadius: 16, padding: "28px", width: "100%", maxWidth: 460, boxShadow: "0 24px 64px rgba(0,0,0,0.18)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 },
  modalTitle: { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 3px" },
  modalSub: { fontSize: 12, color: "#64748b", margin: 0 },
  closeBtn: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 7, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", flexShrink: 0 },
  label: { fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.7px" },
  input: { width: "100%", padding: "10px 13px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 14, color: "#0f172a", background: "#fafafa" },
  cancelBtn: { padding: "10px 18px", borderRadius: 8, border: "1px solid #e2e8f0", background: "white", color: "#64748b", fontSize: 13, cursor: "pointer" },
  successState: { textAlign: "center", padding: "24px 16px" },
  successIcon: { width: 64, height: 64, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" },
};

import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { T, fonts, Spinner, PageHeader, SVGIcon, Card } from "./designSystem";

const RateFreelancer = () => {
  const [projects,    setProjects]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modal,       setModal]       = useState(null);
  const [rating,      setRating]      = useState(0);
  const [hover,       setHover]       = useState(0);
  const [review,      setReview]      = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [reviewed,    setReviewed]    = useState({});
  const [success,     setSuccess]     = useState("");
  const [error,       setError]       = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Load projects with accepted proposals
        const all = (await API.get("/projects/client")).data || [];
        const withProposals = await Promise.all(all.map(async p => {
          try {
            const acc = (await API.get(`/proposals/project/${p.id}`)).data?.find(pr => pr.status === "accepted");
            return { ...p, acceptedProposal: acc || null };
          } catch { return { ...p, acceptedProposal: null }; }
        }));

        setProjects(withProposals.filter(p => p.acceptedProposal));

        // Load already-submitted reviews to pre-mark reviewed projects
        try {
          const myReviews = (await API.get("/reviews/my")).data || [];
          const reviewMap = {};
          myReviews.forEach(r => {
            reviewMap[r.project_id] = { rating: r.rating, review: r.review };
          });
          setReviewed(reviewMap);
        } catch {}

      } catch {}
      setLoading(false);
    })();
  }, []);

  const openModal = p => { setModal(p); setRating(0); setHover(0); setReview(""); setError(""); };

  const submit = async () => {
    if (!rating) return;
    setSubmitting(true);
    setError("");
    try {
      await API.post("/reviews", {
        project_id: modal.id,
        freelancer_id: modal.acceptedProposal.freelancer_id,
        rating,
        review,
      });
      setReviewed(prev => ({ ...prev, [modal.id]: { rating, review } }));
      setSuccess(`Review submitted for ${modal.acceptedProposal.freelancer_name}!`);
      setModal(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      const msg = e.response?.data?.message || "Error submitting review";
      // 409 = already reviewed — close modal and mark as done
      if (e.response?.status === 409) {
        setReviewed(prev => ({ ...prev, [modal.id]: { rating, review } }));
        setModal(null);
        setSuccess(msg);
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(msg);
      }
    }
    setSubmitting(false);
  };

  const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, fontFamily: "'DM Sans',sans-serif" }}>
      <link href={fonts} rel="stylesheet" />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "36px 28px" }}>

        <PageHeader eyebrow="Feedback" title="Rate Freelancers"
          subtitle="Review freelancers for your completed projects" />

        {success && (
          <div style={{ background: "#D1FAE5", border: "1px solid #6EE7B7", borderRadius: 12,
            padding: "12px 16px", marginBottom: 22, color: T.success, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            ✅ {success}
          </div>
        )}

        {loading ? <Card><Spinner /></Card> : projects.length === 0 ? (
          <Card>
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>⭐</div>
              <h3 style={{ color: T.text, fontFamily: "'Syne',sans-serif" }}>No projects to rate yet</h3>
              <p style={{ color: T.muted, fontSize: 13 }}>Once you hire and work with freelancers, they will appear here.</p>
            </div>
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {projects.map(p => {
              const done = reviewed[p.id];
              return (
                <div key={p.id} style={{ background: T.card, borderRadius: 16,
                  border: `1px solid ${T.border}`, padding: "20px 24px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12,
                      background: `linear-gradient(135deg,${T.accent},${T.accent2})`,
                      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, fontWeight: 800, fontFamily: "'Syne',sans-serif", flexShrink: 0 }}>
                      {p.acceptedProposal.freelancer_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>{p.title}</h3>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: T.muted }}>
                        {p.acceptedProposal.freelancer_name}
                        <span style={{ color: T.accent, fontWeight: 700, marginLeft: 6 }}>
                          · ₹{Number(p.acceptedProposal.bid).toLocaleString()}
                        </span>
                      </p>
                      {done && <p style={{ margin: "3px 0 0", fontSize: 13, color: T.warn }}>
                        {"⭐".repeat(done.rating)}
                      </p>}
                    </div>
                  </div>
                  {done ? (
                    <span style={{ padding: "5px 12px", background: "#D1FAE5", color: T.success,
                      borderRadius: 8, fontSize: 12, fontWeight: 700 }}>Reviewed ✓</span>
                  ) : (
                    <button onClick={() => openModal(p)} style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10,
                      background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff",
                      border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
                      boxShadow: "0 3px 10px rgba(245,158,11,.28)",
                      fontFamily: "'DM Sans',sans-serif" }}>
                      ⭐ Rate Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.55)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
          onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px",
            maxWidth: 460, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,.22)" }}>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: T.text }}>
                  Rate Freelancer
                </h2>
                <p style={{ color: T.muted, fontSize: 13, margin: "4px 0 0" }}>
                  {modal.acceptedProposal.freelancer_name} · {modal.title}
                </p>
              </div>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none",
                cursor: "pointer", color: T.muted, fontSize: 20, lineHeight: 1 }}>✕</button>
            </div>

            {/* Stars */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 10 }}>
                Your Rating <span style={{ color: T.danger }}>*</span>
              </p>
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} style={{
                    background: "none", border: "none", cursor: "pointer", fontSize: 34, padding: 1,
                    transition: "transform .1s",
                    transform: (hover || rating) >= n ? "scale(1.18)" : "scale(1)" }}>
                    {(hover || rating) >= n ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
              {(hover || rating) > 0 && (
                <p style={{ fontSize: 12, color: T.accent, fontWeight: 700, marginTop: 5 }}>
                  {LABELS[hover || rating]}
                </p>
              )}
            </div>

            {/* Comment */}
            <div style={{ marginBottom: 26 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600,
                color: T.text, marginBottom: 7 }}>Comment (optional)</label>
              <textarea value={review} onChange={e => setReview(e.target.value)} rows={3}
                placeholder="Share your experience..."
                style={{ width: "100%", padding: "10px 13px", borderRadius: 10, border: `1.5px solid ${T.border}`,
                  fontSize: 13, fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box",
                  resize: "vertical", outline: "none" }}
                onFocus={e => e.target.style.border = `1.5px solid ${T.accent}`}
                onBlur={e => e.target.style.border = `1.5px solid ${T.border}`} />
            </div>

            {/* Inline error message */}
            {error && (
              <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 8,
                padding: "9px 13px", marginBottom: 16, color: "#DC2626", fontSize: 13, fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(null)} style={{
                flex: 1, padding: "11px", borderRadius: 10, border: `1.5px solid ${T.border}`,
                background: "#fff", color: T.muted, fontWeight: 600, cursor: "pointer",
                fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
              <button onClick={submit} disabled={!rating || submitting} style={{
                flex: 2, padding: "11px", borderRadius: 10,
                background: rating ? "linear-gradient(135deg,#F59E0B,#D97706)" : T.border,
                color: rating ? "#fff" : T.muted, border: "none", fontWeight: 700,
                cursor: rating ? "pointer" : "not-allowed", fontSize: 13,
                fontFamily: "'DM Sans',sans-serif" }}>
                {submitting ? "Submitting..." : "⭐ Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RateFreelancer;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

const STATUS = {
  accepted: { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7", dot: "#10b981", icon: "✓", label: "Accepted" },
  rejected: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5", dot: "#ef4444", icon: "✕", label: "Rejected" },
  pending:  { bg: "#fef3c7", color: "#92400e", border: "#fde68a", dot: "#f59e0b", icon: "⋯", label: "Pending" },
};

export default function MyProposals() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    API.get("/proposals/my")
      .then((r) => { setProposals(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? proposals : proposals.filter((p) => p.status === filter);
  const counts = { all: proposals.length, pending: proposals.filter(p => p.status === "pending").length, accepted: proposals.filter(p => p.status === "accepted").length, rejected: proposals.filter(p => p.status === "rejected").length };

  if (loading) return (
    <div style={styles.loadWrap}><div style={styles.spinner} /></div>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.overline}>PROPOSALS</p>
          <h1 style={styles.title}>My Proposals</h1>
          <p style={styles.subtitle}>Track and manage all your submitted proposals</p>
        </div>
        <button onClick={() => navigate("/freelancer/find-projects")} style={styles.primaryBtn}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          New Proposal
        </button>
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        {[
          { key: "all", label: "All", color: "#64748b" },
          { key: "pending", label: "Pending", color: "#f59e0b" },
          { key: "accepted", label: "Accepted", color: "#10b981" },
          { key: "rejected", label: "Rejected", color: "#ef4444" },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            style={{ ...styles.tabBtn, ...(filter === tab.key ? { ...styles.tabActive, borderBottom: `2px solid ${tab.color}`, color: tab.color } : {}) }}>
            {tab.label}
            <span style={{ ...styles.tabCount, background: filter === tab.key ? tab.color + "1a" : "#f1f5f9", color: filter === tab.key ? tab.color : "#94a3b8" }}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div style={styles.emptyCard}>
          <svg width="44" height="44" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/></svg>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: "10px 0 16px" }}>
            {filter === "all" ? "No proposals yet." : `No ${filter} proposals.`}
          </p>
          <button onClick={() => navigate("/freelancer/find-projects")} style={styles.primaryBtn}>
            Browse Projects
          </button>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map((p) => {
            const s = STATUS[p.status] || STATUS.pending;
            return (
              <div key={p.id} style={{ ...styles.card, borderLeft: `4px solid ${s.dot}` }}>
                <div style={styles.cardTop}>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.cardTitle}>{p.project_title}</h3>
                    <p style={styles.cardMsg}>{p.message}</p>
                  </div>
                  <span style={{ ...styles.badge, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                    <span style={{ ...styles.dot, background: s.dot }} />
                    {s.label}
                  </span>
                </div>

                <div style={styles.metaRow}>
                  <div style={styles.metaItem}>
                    <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Your Bid: <strong style={{ color: "#0f766e" }}>₹{p.bid}</strong>
                  </div>
                  {p.project_budget && (
                    <div style={styles.metaItem}>
                      <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
                      Budget: ₹{p.project_budget}
                    </div>
                  )}
                  {p.created_at && (
                    <div style={styles.metaItem}>
                      <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      Submitted {fmt(p.created_at)}
                    </div>
                  )}
                  {p.project_deadline && (
                    <div style={styles.metaItem}>
                      <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      Due {fmt(p.project_deadline)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
  primaryBtn: { display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, border: "none", background: "#0f766e", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  statsRow: { display: "flex", gap: 0, marginBottom: 24, background: "white", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", padding: "4px" },
  tabBtn: { flex: 1, display: "flex", align: "center", justifyContent: "center", gap: 8, padding: "10px 16px", background: "transparent", border: "none", borderBottom: "2px solid transparent", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer", transition: "all 0.15s", borderRadius: 7 },
  tabActive: { background: "#f8fafc" },
  tabCount: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 },
  emptyCard: { background: "white", border: "1px solid #e2e8f0", borderRadius: 14, padding: "60px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  card: { background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" },
  cardMsg: { fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 },
  badge: { display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0 },
  dot: { width: 6, height: 6, borderRadius: "50%" },
  metaRow: { display: "flex", flexWrap: "wrap", gap: 16, paddingTop: 12, borderTop: "1px solid #f1f5f9" },
  metaItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b" },
};

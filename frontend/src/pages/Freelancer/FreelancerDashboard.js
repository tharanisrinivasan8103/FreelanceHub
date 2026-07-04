import React, { useEffect, useState, useCallback } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

const statusConfig = {
  accepted: { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  rejected:  { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  pending:   { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
};

const Blob = ({ color }) => (
  <svg
    width="100" height="100" viewBox="0 0 100 100" fill="none"
    style={{ position: "absolute", top: -14, right: -14, pointerEvents: "none" }}
  >
    <ellipse cx="60" cy="40" rx="48" ry="44" fill={color} fillOpacity="0.15" />
  </svg>
);

export default function FreelancerDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const [data, setData] = useState({ activeProjects: 0, pendingProposals: 0, projects: [] });
  const [loading, setLoading] = useState(true);

  // ✅ FIX: extracted into a reusable function so we can call it on demand
  const fetchDashboard = useCallback(() => {
    setLoading(true);
    API.get("/projects/freelancer/dashboard")
      .then((r) => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ✅ FIX: re-fetch whenever the tab regains focus (user comes back from another tab)
  useEffect(() => {
    const onFocus = () => fetchDashboard();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchDashboard]);

  if (loading) return (
    <div style={s.loadWrap}>
      <style>{spinCSS}</style>
      <div style={s.spinner} />
    </div>
  );

  // ✅ FIX: count accepted from the fresh data, not stale proposal_status
  const accepted = data.projects?.filter((p) => p.proposal_status === "accepted").length || 0;

  const statCards = [
    {
      label: "Applied Projects", value: data.activeProjects, sub: "Total applied",
      blobColor: "#14b8a6",
      icon: (
        <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#14b8a6" strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx="9" cy="7" r="4" stroke="#14b8a6" strokeWidth="1.7"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#14b8a6" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: "Total Proposals", value: data.pendingProposals, sub: "Submitted",
      blobColor: "#8b5cf6",
      icon: (
        <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" stroke="#8b5cf6" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: "Accepted", value: accepted, sub: "Projects won",
      blobColor: "#10b981",
      icon: (
        <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10b981" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: "Account Type", value: "Freelancer", sub: user.email?.slice(0, 26) || "",
      blobColor: "#f59e0b", isText: true,
      icon: (
        <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#f59e0b" strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx="12" cy="7" r="4" stroke="#f59e0b" strokeWidth="1.7"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={s.page}>
      <style>{spinCSS}</style>

      {/* Header */}
      <p style={s.overline}>OVERVIEW</p>
      <div style={s.headerRow}>
        <div>
          <h1 style={s.title}>Freelancer Dashboard</h1>
          <p style={s.subtitle}>
            Welcome back, <strong>{user.name}</strong> — here's your activity summary
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {/* ✅ Manual refresh button */}
          <button onClick={fetchDashboard} style={s.refreshBtn} title="Refresh">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Refresh
          </button>
          <button onClick={() => navigate("/freelancer/find-projects")} style={s.primaryBtn}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Browse Projects
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={s.cardGrid}>
        {statCards.map((c, i) => (
          <div key={i} style={s.statCard}>
            <Blob color={c.blobColor} />
            <div style={{ marginBottom: 14 }}>{c.icon}</div>
            <p style={{ ...s.statValue, color: c.isText ? c.blobColor : "#0f172a" }}>
              {c.value}
            </p>
            <p style={s.statLabel}>{c.label}</p>
            <p style={s.statSub}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Projects Table */}
      <div style={s.tableCard}>
        <div style={s.tableHeader}>
          <div style={s.tableHeaderLeft}>
            <svg width="18" height="18" fill="none" stroke="#14b8a6" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 7h18M3 12h18M3 17h18"/>
            </svg>
            <h2 style={s.tableTitle}>Projects You Applied To</h2>
          </div>
          <button onClick={() => navigate("/freelancer/find-projects")} style={s.ghostBtn}>
            View All &nbsp;›
          </button>
        </div>

        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              {["Title", "Budget", "Your Bid", "Deadline", "Status"].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(!data.projects || data.projects.length === 0) ? (
              <tr>
                <td colSpan={5} style={s.emptyCell}>
                  <div style={s.emptyState}>
                    <svg width="40" height="40" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <p>No projects yet. Start browsing!</p>
                  </div>
                </td>
              </tr>
            ) : data.projects.map((p) => {
              // ✅ FIX: always read status directly from DB response
              const statusKey = p.proposal_status || "pending";
              const st = statusConfig[statusKey] || statusConfig.pending;
              return (
                <tr key={p.id} style={s.trow}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={s.td}>
                    <p style={s.tdTitle}>{p.title}</p>
                    <p style={s.tdSub}>{p.description?.slice(0, 55)}...</p>
                  </td>
                  <td style={{ ...s.td, fontWeight: 600, color: "#0f172a" }}>
                    ₹{Number(p.budget).toLocaleString()}
                  </td>
                  <td style={{ ...s.td, fontWeight: 600, color: "#14b8a6" }}>
                    {p.my_bid ? `₹${Number(p.my_bid).toLocaleString()}` : "—"}
                  </td>
                  <td style={{ ...s.td, color: "#64748b" }}>
                    {p.deadline ? fmt(p.deadline) : "—"}
                  </td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: st.bg, color: st.color }}>
                      <span style={{ ...s.dot, background: st.dot }} />
                      {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const spinCSS = `
  @keyframes _dash_spin { to { transform: rotate(360deg); } }
`;

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
    width: 36, height: 36, borderRadius: "50%",
    border: "3px solid #e2e8f0", borderTopColor: "#14b8a6",
    animation: "_dash_spin .8s linear infinite",
  },

  overline: {
    fontSize: 12, fontWeight: 600, color: "#94a3b8",
    letterSpacing: "1.2px", textTransform: "uppercase", margin: "0 0 8px",
  },
  headerRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 32,
  },
  title: {
    fontSize: 28, fontWeight: 700, color: "#0f172a",
    margin: "0 0 6px", letterSpacing: "-0.5px",
  },
  subtitle: { fontSize: 14, color: "#64748b", margin: 0 },

  primaryBtn: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "11px 22px", borderRadius: 9, border: "none",
    background: "#0f766e", color: "white",
    fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
  refreshBtn: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "11px 18px", borderRadius: 9,
    border: "1px solid #e2e8f0", background: "white",
    color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },

  cardGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: 20, marginBottom: 32,
  },
  statCard: {
    background: "white", border: "1px solid #e8edf2",
    borderRadius: 14, padding: "24px 24px 22px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    position: "relative", overflow: "hidden",
  },
  statValue: {
    fontSize: 38, fontWeight: 800,
    margin: "0 0 4px", letterSpacing: "-1.5px", lineHeight: 1,
  },
  statLabel: { fontSize: 13, fontWeight: 500, color: "#64748b", margin: "0 0 2px" },
  statSub:   { fontSize: 11, color: "#94a3b8", margin: 0 },

  tableCard: {
    background: "white", border: "1px solid #e2e8f0",
    borderRadius: 14, overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  tableHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "18px 24px",
    borderBottom: "1px solid #f1f5f9",
  },
  tableHeaderLeft: { display: "flex", alignItems: "center", gap: 10 },
  tableTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 },
  ghostBtn: {
    fontSize: 13, fontWeight: 600, color: "#14b8a6",
    background: "transparent", border: "none", cursor: "pointer",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: {
    padding: "11px 24px", fontSize: 11, fontWeight: 700,
    color: "#94a3b8", textAlign: "left",
    textTransform: "uppercase", letterSpacing: "0.8px",
    borderBottom: "1px solid #f1f5f9",
  },
  trow: { borderBottom: "1px solid #f8fafc", transition: "background 0.15s" },
  td: { padding: "15px 24px", fontSize: 13, color: "#374151", verticalAlign: "middle" },
  tdTitle: { fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 2px" },
  tdSub: { fontSize: 11, color: "#94a3b8", margin: 0 },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "4px 12px", borderRadius: 20,
    fontSize: 12, fontWeight: 600, textTransform: "capitalize",
  },
  dot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  emptyCell: { padding: "48px 24px", textAlign: "center" },
  emptyState: {
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 10, color: "#94a3b8", fontSize: 13,
  },
};

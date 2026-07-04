import React, { useEffect, useState } from "react";
import API from "../../api/api";

// ✅ MASTER CATEGORIES — exact same values as PostProject & MyProjects
const CATS = [
  { value: "",                    label: "All Categories"     },
  { value: "web-development",     label: "Web Development"    },
  { value: "mobile-development",  label: "Mobile Development" },
  { value: "ui-ux-design",        label: "UI/UX Design"       },
  { value: "graphic-design",      label: "Graphic Design"     },
  { value: "backend-development", label: "Backend Development"},
  { value: "data-science",        label: "Data Science"       },
  { value: "devops-cloud",        label: "DevOps / Cloud"     }, // ✅ "devops-cloud" matches PostProject
  { value: "content-writing",     label: "Content Writing"    },
  { value: "digital-marketing",   label: "Digital Marketing"  },
  { value: "video-editing",       label: "Video Editing"      },
  { value: "seo",                 label: "SEO"                },
  { value: "cybersecurity",       label: "Cybersecurity"      },
  { value: "other",               label: "Other"              },
];

const getCategoryLabel = (value) =>
  CATS.find(c => c.value === value)?.label || value || "Other";

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

export default function FindProjects() {
  const [projects, setProjects]   = useState([]);
  const [search, setSearch]       = useState("");
  const [cat, setCat]             = useState("");
  const [appliedIds, setAppliedIds] = useState([]);
  const [modal, setModal]         = useState(null);
  const [form, setForm]           = useState({ bid: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([API.get("/projects"), API.get("/proposals/my")])
      .then(([pr, my]) => {
        setProjects(pr.data || []);
        setAppliedIds((my.data || []).map(p => p.project_id));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    return (
      (!q || p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)) &&
      (!cat || p.category === cat)
    );
  });

  const submit = async () => {
    if (!form.bid || !form.message) return alert("Fill all fields");
    setSubmitting(true);
    try {
      await API.post("/proposals", { project_id: modal.id, bid: form.bid, message: form.message });
      setAppliedIds(prev => [...prev, modal.id]);
      setModal(null);
      setForm({ bid: "", message: "" });
    } catch (e) {
      alert(e.response?.data?.message || "Error submitting proposal");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div style={styles.loadWrap}><div style={styles.spinner} /></div>
  );

  return (
    <div style={styles.page}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <p style={styles.overline}>MARKETPLACE</p>
          <h1 style={styles.title}>Find Projects</h1>
          <p style={styles.subtitle}>Browse available projects and submit your proposals</p>
        </div>
        <div style={styles.countBadge}>
          <svg width="14" height="14" fill="none" stroke="#14b8a6" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
          <span>{filtered.length} project{filtered.length !== 1 ? "s" : ""} found</span>
        </div>
      </div>

      {/* Search + Filters */}
      <div style={styles.filterRow}>
        <div style={styles.searchWrap}>
          <svg style={styles.searchIcon} width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input style={styles.searchInput} placeholder="Search by title or description..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)} style={styles.select}>
          {CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Category Pills */}
      <div style={styles.pills}>
        {CATS.map(c => (
          <button key={c.value} onClick={() => setCat(c.value)}
            style={{ ...styles.pill, ...(cat === c.value ? styles.pillActive : {}) }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ color:"#94a3b8", fontSize:14 }}>No projects found matching your search</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(p => {
            const applied = appliedIds.includes(p.id);
            return (
              <div key={p.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ flex:1 }}>
                    <h3 style={styles.cardTitle}>{p.title}</h3>
                    {p.category && (
                      <span style={styles.catTag}>{getCategoryLabel(p.category)}</span>
                    )}
                  </div>
                  <span style={styles.openBadge}>Open</span>
                </div>

                <p style={styles.cardDesc}>{p.description?.slice(0, 100)}...</p>

                {p.skills && (
                  <div style={styles.skillRow}>
                    {p.skills.split(",").slice(0, 4).map((s, i) => (
                      <span key={i} style={styles.skillTag}>{s.trim()}</span>
                    ))}
                  </div>
                )}

                <div style={styles.metaRow}>
                  {p.deadline && (
                    <span style={styles.metaItem}>
                      <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      {fmt(p.deadline)}
                    </span>
                  )}
                  <span style={styles.metaItem}>
                    <svg width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/></svg>
                    {p.proposals_count || 0} proposals
                  </span>
                </div>

                <div style={styles.cardFooter}>
                  <div>
                    <p style={styles.budgetLabel}>Budget</p>
                    <p style={styles.budget}>₹{Number(p.budget).toLocaleString()}</p>
                  </div>
                  {applied ? (
                    <button style={styles.appliedBtn} disabled>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                      Applied
                    </button>
                  ) : (
                    <button onClick={() => { setModal(p); setForm({ bid:"", message:"" }); }} style={styles.applyBtn}>
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Proposal Modal */}
      {modal && (
        <div style={styles.overlay} onClick={e => e.target===e.currentTarget && setModal(null)}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Submit Proposal</h2>
                <p style={styles.modalSub}>{modal.title} · Budget: ₹{modal.budget}</p>
              </div>
              <button onClick={() => setModal(null)} style={styles.closeBtn}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <label style={styles.label}>Your Bid (₹)</label>
            <input type="number" placeholder="Enter your bid amount" value={form.bid}
              onChange={e => setForm({ ...form, bid: e.target.value })} style={styles.input} />
            <label style={styles.label}>Cover Letter</label>
            <textarea placeholder="Why are you the best fit for this project?" value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              style={{ ...styles.input, height:100, resize:"none", lineHeight:1.5 }} />
            <div style={{ display:"flex", gap:10, marginTop:8 }}>
              <button onClick={submit} disabled={submitting} style={styles.submitBtn}>
                {submitting ? "Submitting..." : "Submit Proposal"}
              </button>
              <button onClick={() => setModal(null)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { background:"#f8fafc", minHeight:"100vh", padding:"36px 40px", fontFamily:"'Inter','Segoe UI',sans-serif" },
  loadWrap: { background:"#f8fafc", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" },
  spinner: { width:36, height:36, borderRadius:"50%", border:"3px solid #e2e8f0", borderTopColor:"#14b8a6" },
  pageHeader: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 },
  overline: { fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:"1.5px", textTransform:"uppercase", margin:"0 0 6px" },
  title: { fontSize:26, fontWeight:700, color:"#0f172a", margin:"0 0 4px", letterSpacing:"-0.5px" },
  subtitle: { fontSize:14, color:"#64748b", margin:0 },
  countBadge: { display:"flex", alignItems:"center", gap:6, background:"#f0fdfa", border:"1px solid #99f6e4", borderRadius:8, padding:"8px 14px", fontSize:13, fontWeight:600, color:"#0f766e" },
  filterRow: { display:"flex", gap:12, marginBottom:16 },
  searchWrap: { flex:1, position:"relative" },
  searchIcon: { position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" },
  searchInput: { width:"100%", padding:"11px 14px 11px 40px", border:"1px solid #e2e8f0", borderRadius:9, fontSize:13, outline:"none", background:"white", color:"#0f172a", boxSizing:"border-box" },
  select: { padding:"11px 16px", border:"1px solid #e2e8f0", borderRadius:9, fontSize:13, color:"#0f172a", background:"white", outline:"none", cursor:"pointer", minWidth:180 },
  pills: { display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 },
  pill: { padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", border:"1px solid #e2e8f0", background:"white", color:"#64748b" },
  pillActive: { background:"#0f766e", color:"white", border:"1px solid #0f766e" },
  emptyState: { textAlign:"center", padding:"64px 24px" },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:16 },
  card: { background:"white", border:"1px solid #e2e8f0", borderRadius:14, padding:"22px", boxShadow:"0 1px 3px rgba(0,0,0,0.05)", display:"flex", flexDirection:"column" },
  cardHeader: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 },
  cardTitle: { fontSize:15, fontWeight:700, color:"#0f172a", margin:"0 0 5px", lineHeight:1.3 },
  catTag: { fontSize:10, fontWeight:700, color:"#0f766e", background:"#f0fdfa", border:"1px solid #99f6e4", borderRadius:5, padding:"2px 8px", textTransform:"capitalize" },
  openBadge: { background:"#dcfce7", color:"#15803d", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, flexShrink:0, marginLeft:8 },
  cardDesc: { fontSize:13, color:"#64748b", lineHeight:1.6, margin:"0 0 12px" },
  skillRow: { display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 },
  skillTag: { background:"#f8fafc", color:"#475569", border:"1px solid #e2e8f0", borderRadius:6, padding:"3px 9px", fontSize:11, fontWeight:600 },
  metaRow: { display:"flex", gap:14, marginBottom:14 },
  metaItem: { display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#94a3b8" },
  cardFooter: { display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:14, borderTop:"1px solid #f1f5f9", marginTop:"auto" },
  budgetLabel: { fontSize:10, fontWeight:600, color:"#94a3b8", margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.5px" },
  budget: { fontSize:20, fontWeight:800, color:"#0f766e", margin:0 },
  applyBtn: { padding:"9px 20px", borderRadius:8, border:"none", background:"#0f766e", color:"white", fontSize:12, fontWeight:700, cursor:"pointer" },
  appliedBtn: { display:"flex", alignItems:"center", gap:5, padding:"9px 16px", borderRadius:8, border:"1px solid #bbf7d0", background:"#f0fdf4", color:"#16a34a", fontSize:12, fontWeight:700, cursor:"default" },
  overlay: { position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:20 },
  modalBox: { background:"white", borderRadius:16, padding:"28px 28px 24px", width:"100%", maxWidth:460, boxShadow:"0 24px 64px rgba(0,0,0,0.18)" },
  modalHeader: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 },
  modalTitle: { fontSize:18, fontWeight:700, color:"#0f172a", margin:"0 0 3px" },
  modalSub: { fontSize:12, color:"#64748b", margin:0 },
  closeBtn: { background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:7, width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b", flexShrink:0 },
  label: { fontSize:11, fontWeight:700, color:"#64748b", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.7px" },
  input: { width:"100%", padding:"10px 13px", border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:13, outline:"none", boxSizing:"border-box", marginBottom:14, color:"#0f172a", background:"#fafafa" },
  submitBtn: { flex:1, padding:"11px", borderRadius:9, border:"none", background:"#0f766e", color:"white", fontWeight:700, fontSize:13, cursor:"pointer" },
  cancelBtn: { padding:"11px 18px", borderRadius:9, border:"1px solid #e2e8f0", background:"white", color:"#64748b", fontSize:13, cursor:"pointer" },
};

import React, { useEffect, useState } from "react";
import API from "../../api/api";

const T = {
  accent:"#14B8A6", accent2:"#0F766E", text:"#1E293B", muted:"#64748B",
  border:"#E2E8F0", card:"#FFFFFF", pageBg:"#F1F5F9",
  success:"#10B981", danger:"#EF4444", warn:"#F59E0B",
};
const fonts = `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap`;

const Icon = ({ d, size=16, color=T.accent, stroke=1.8 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24"
    stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    API.get("/projects")
      .then(r => setProjects(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    setDeleting(id);
    try {
      await API.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch { alert("Error deleting project"); }
    setDeleting(null);
  };

  const filtered = projects.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.client_name?.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";

  return (
    <div style={{ minHeight:"100vh", background:T.pageBg, fontFamily:"'Inter',sans-serif" }}>
      <link href={fonts} rel="stylesheet"/>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 28px" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:26 }}>
          <div>
            <p style={{ fontSize:11, color:T.muted, letterSpacing:1.8, textTransform:"uppercase",
              fontWeight:600, marginBottom:5 }}>Project Management</p>
            <h1 style={{ fontSize:24, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
              color:T.text, margin:0, letterSpacing:-0.3 }}>Manage Projects</h1>
            <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>{projects.length} total projects</p>
          </div>
          <div style={{ padding:"6px 14px", borderRadius:20, background:`${T.accent}1A`,
            color:T.accent, fontSize:13, fontWeight:700, fontFamily:"'Inter',sans-serif" }}>
            {projects.length} Total
          </div>
        </div>

        {/* Search */}
        <div style={{ position:"relative", marginBottom:20, maxWidth:360 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>
            <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" color={T.muted} size={15}/>
          </span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search projects..."
            style={{ width:"100%", padding:"10px 13px 10px 36px", borderRadius:10,
              border:`1.5px solid ${T.border}`, fontSize:13, color:T.text, background:"#fff",
              outline:"none", fontFamily:"'Inter',sans-serif", boxSizing:"border-box" }}
            onFocus={e=>e.target.style.border=`1.5px solid ${T.accent}`}
            onBlur={e=>e.target.style.border=`1.5px solid ${T.border}`}/>
        </div>

        {/* Table */}
        <div style={{ background:T.card, borderRadius:16, border:`1px solid ${T.border}`,
          boxShadow:"0 1px 3px rgba(0,0,0,0.05)", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#F8FAFC" }}>
                {["#","Title","Budget","Category","Deadline","Status","Action"].map(h => (
                  <th key={h} style={{ padding:"11px 18px", textAlign:"left", fontSize:11,
                    fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:.8,
                    borderBottom:`1px solid ${T.border}`, fontFamily:"'Inter',sans-serif",
                    whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding:40, textAlign:"center", color:T.muted }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:48, textAlign:"center" }}>
                  <div style={{ fontSize:40, marginBottom:10 }}>📁</div>
                  <p style={{ color:T.muted, margin:0 }}>No projects found</p>
                </td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i<filtered.length-1?`1px solid ${T.border}`:"none",
                  transition:"background .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"14px 18px", fontSize:12, color:T.muted }}>{i+1}</td>
                  <td style={{ padding:"14px 18px" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{p.title}</div>
                    {p.description && (
                      <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>
                        {p.description.slice(0,45)}{p.description.length>45?"...":""}
                      </div>
                    )}
                  </td>
                  <td style={{ padding:"14px 18px", fontSize:13, fontWeight:500, color:T.text, whiteSpace:"nowrap" }}>
                    ₹{Number(p.budget).toLocaleString()}
                  </td>
                  <td style={{ padding:"14px 18px" }}>
                    {p.category && (
                      <span style={{ padding:"2px 9px", background:`${T.accent}12`, color:T.accent,
                        borderRadius:6, fontSize:10, fontWeight:600 }}>
                        {p.category.replace(/-/g," ").replace(/\b\w/g,l=>l.toUpperCase())}
                      </span>
                    )}
                  </td>
                  <td style={{ padding:"14px 18px", fontSize:12, color:T.muted, whiteSpace:"nowrap" }}>
                    {fmt(p.deadline)}
                  </td>
                  <td style={{ padding:"14px 18px" }}>
                    <span style={{ padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:600,
                      background: p.status==="open"?"#D1FAE5":"#FEE2E2",
                      color: p.status==="open"?T.success:T.danger }}>
                      {(p.status||"open").charAt(0).toUpperCase()+(p.status||"open").slice(1)}
                    </span>
                  </td>
                  <td style={{ padding:"14px 18px" }}>
                    <button onClick={() => handleDelete(p.id)} disabled={deleting===p.id} style={{
                      display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:7,
                      background:"#FEF2F2", color:T.danger, border:`1px solid #FECACA`,
                      fontSize:11, fontWeight:600, cursor:"pointer",
                      fontFamily:"'Inter',sans-serif", opacity: deleting===p.id?.5:1 }}>
                      <Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" color={T.danger} size={12}/>
                      {deleting===p.id ? "..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ManageProjects;

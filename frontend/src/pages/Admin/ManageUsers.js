import React, { useEffect, useState } from "react";
import API from "../../api/api";

const T = {
  accent:"#14B8A6", accent2:"#0F766E", text:"#1E293B", muted:"#64748B",
  border:"#E2E8F0", card:"#FFFFFF", pageBg:"#F1F5F9",
  success:"#10B981", danger:"#EF4444", indigo:"#6366F1", blue:"#3B82F6",
};
const fonts = `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap`;

const Icon = ({ d, size=16, color=T.accent, stroke=1.8 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24"
    stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

const ManageUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [tab,     setTab]     = useState("freelancer");
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [deleting,setDeleting]= useState(null);

  useEffect(() => {
    API.get("/users")
      .then(r => setUsers(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    setDeleting(id);
    try {
      await API.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch { alert("Error deleting user"); }
    setDeleting(null);
  };

  const filtered = users.filter(u =>
    u.role === tab &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) ||
     u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const freelancers = users.filter(u => u.role === "freelancer");
  const clients     = users.filter(u => u.role === "client");

  return (
    <div style={{ minHeight:"100vh", background:T.pageBg, fontFamily:"'Inter',sans-serif" }}>
      <link href={fonts} rel="stylesheet"/>
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"32px 28px" }}>

        {/* Header */}
        <div style={{ marginBottom:26 }}>
          <p style={{ fontSize:11, color:T.muted, letterSpacing:1.8, textTransform:"uppercase",
            fontWeight:600, marginBottom:5 }}>User Management</p>
          <h1 style={{ fontSize:24, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
            color:T.text, margin:0, letterSpacing:-0.3 }}>Manage Users</h1>
          <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>
            {freelancers.length} freelancers · {clients.length} clients
          </p>
        </div>

        {/* Tab + Search row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          marginBottom:20, flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", gap:6, background:T.card, padding:4, borderRadius:12,
            border:`1px solid ${T.border}` }}>
            {[
              { key:"freelancer", label:`Freelancers (${freelancers.length})` },
              { key:"client",     label:`Clients (${clients.length})` },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:"8px 16px", borderRadius:9, border:"none", cursor:"pointer",
                fontSize:12, fontWeight:600, fontFamily:"'Inter',sans-serif", transition:"all .15s",
                background: tab===t.key ? `linear-gradient(135deg,${T.accent},${T.accent2})` : "transparent",
                color: tab===t.key ? "#fff" : T.muted,
                boxShadow: tab===t.key ? `0 2px 8px ${T.accent}30` : "none",
              }}>{t.label}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)" }}>
              <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" color={T.muted} size={14}/>
            </span>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search users..."
              style={{ padding:"9px 13px 9px 34px", borderRadius:9, border:`1.5px solid ${T.border}`,
                fontSize:12, color:T.text, background:"#fff", outline:"none",
                fontFamily:"'Inter',sans-serif", width:200 }}
              onFocus={e=>e.target.style.border=`1.5px solid ${T.accent}`}
              onBlur={e=>e.target.style.border=`1.5px solid ${T.border}`}/>
          </div>
        </div>

        {/* Table */}
        <div style={{ background:T.card, borderRadius:16, border:`1px solid ${T.border}`,
          boxShadow:"0 1px 3px rgba(0,0,0,0.05)", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#F8FAFC" }}>
                {["#","Name","Email","Role","Joined","Action"].map(h => (
                  <th key={h} style={{ padding:"11px 18px", textAlign:"left", fontSize:11,
                    fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:.8,
                    borderBottom:`1px solid ${T.border}`, fontFamily:"'Inter',sans-serif" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:T.muted }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding:40, textAlign:"center" }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>👥</div>
                  <p style={{ color:T.muted, margin:0 }}>No users found</p>
                </td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i<filtered.length-1 ? `1px solid ${T.border}`:"none",
                  transition:"background .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"13px 18px", fontSize:12, color:T.muted }}>{i+1}</td>
                  <td style={{ padding:"13px 18px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:10,
                        background:`linear-gradient(135deg,${T.accent},${T.accent2})`,
                        color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:13, fontWeight:700, flexShrink:0,
                        fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"13px 18px", fontSize:13, color:T.muted }}>{u.email}</td>
                  <td style={{ padding:"13px 18px" }}>
                    <span style={{ padding:"2px 9px", borderRadius:20, fontSize:10, fontWeight:600,
                      background: u.role==="freelancer" ? `${T.accent}1A` : "#EFF6FF",
                      color: u.role==="freelancer" ? T.accent : T.blue,
                      fontFamily:"'Inter',sans-serif" }}>
                      {u.role?.charAt(0).toUpperCase()+u.role?.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding:"13px 18px", fontSize:12, color:T.muted }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN",
                      {day:"2-digit",month:"short",year:"numeric"}) : "—"}
                  </td>
                  <td style={{ padding:"13px 18px" }}>
                    <button onClick={() => handleDelete(u.id)} disabled={deleting===u.id} style={{
                      display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:7,
                      background:"#FEF2F2", color:T.danger, border:`1px solid #FECACA`,
                      fontSize:11, fontWeight:600, cursor:"pointer",
                      fontFamily:"'Inter',sans-serif", opacity: deleting===u.id ? .5:1 }}>
                      <Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" color={T.danger} size={12}/>
                      {deleting===u.id ? "..." : "Delete"}
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
export default ManageUsers;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { T, fonts, Spinner, Badge, PrimaryBtn, SVGIcon, Card } from "./designSystem";

const ProjectProposals = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposals,     setProposals]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [projectTitle,  setProjectTitle]  = useState("");
  const [updating,      setUpdating]      = useState(null);

  const fetch = async () => {
    try {
      const res = await API.get(`/proposals/project/${id}`);
      setProposals(res.data || []);
      if (res.data?.[0]?.project_title) setProjectTitle(res.data[0].project_title);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (pid, status) => {
    setUpdating(pid);
    try {
      await API.put(`/proposals/${pid}/status`, { status });
      setProposals(prev => prev.map(p => p.id===pid ? {...p,status} : p));
    } catch { alert("Error updating proposal"); }
    setUpdating(null);
  };

  return (
    <div style={{ minHeight:"100vh", background:T.pageBg, fontFamily:"'DM Sans',sans-serif" }}>
      <link href={fonts} rel="stylesheet"/>
      <div style={{ maxWidth:860, margin:"0 auto", padding:"36px 28px" }}>

        <button onClick={() => navigate(-1)} style={{
          display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
          color:T.muted, fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
          marginBottom:20, padding:0, fontWeight:500 }}>
          <SVGIcon d="M15 19l-7-7 7-7" color={T.muted} size={15} stroke={2}/> Back to My Projects
        </button>

        <div style={{ marginBottom:28 }}>
          <p style={{ fontSize:11, color:T.muted, letterSpacing:2.5, textTransform:"uppercase",
            fontWeight:600, marginBottom:6 }}>Proposals Received</p>
          <h1 style={{ fontSize:26, fontFamily:"'Syne',sans-serif", fontWeight:800,
            color:T.text, margin:0 }}>Project Proposals</h1>
          {projectTitle && <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>
            Project: <strong style={{ color:T.text }}>{projectTitle}</strong>
          </p>}
        </div>

        {loading ? <Card><Spinner/></Card> : proposals.length === 0 ? (
          <Card>
            <div style={{ padding:"60px 20px", textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📨</div>
              <p style={{ color:T.muted }}>No proposals received yet.</p>
            </div>
          </Card>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {proposals.map(p => (
              <div key={p.id} style={{ background:T.card, borderRadius:16,
                border:`1px solid ${T.border}`, padding:"22px 24px",
                boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>

                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"flex-start", marginBottom:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:44, height:44, borderRadius:12,
                      background:`linear-gradient(135deg,${T.accent},${T.accent2})`,
                      color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:17, fontWeight:800, fontFamily:"'Syne',sans-serif", flexShrink:0 }}>
                      {p.freelancer_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:T.text }}>{p.freelancer_name}</h3>
                      <p style={{ margin:"2px 0 0", fontSize:12, color:T.muted }}>{p.freelancer_email}</p>
                    </div>
                  </div>
                  <Badge status={p.status||"pending"}/>
                </div>

                {/* Bid */}
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <div style={{ padding:"6px 14px", borderRadius:8, background:`${T.accent}12`,
                    color:T.accent, fontWeight:800, fontSize:16, fontFamily:"'Syne',sans-serif" }}>
                    ₹{Number(p.bid).toLocaleString()}
                  </div>
                  <span style={{ fontSize:12, color:T.muted }}>Bid Amount</span>
                  {p.created_at && <span style={{ fontSize:11, color:T.muted, marginLeft:"auto" }}>
                    {new Date(p.created_at).toLocaleDateString("en-IN")}
                  </span>}
                </div>

                {/* Message */}
                {p.message && (
                  <div style={{ background:"#F8FAFC", borderRadius:10, padding:"12px 14px",
                    marginBottom:14, border:`1px solid ${T.border}` }}>
                    <p style={{ margin:0, fontSize:13, color:T.text, lineHeight:1.6 }}>{p.message}</p>
                  </div>
                )}

                {/* Actions */}
                {(!p.status || p.status==="pending") && (
                  <div style={{ display:"flex", gap:10 }}>
                    <button onClick={() => updateStatus(p.id,"accepted")} disabled={updating===p.id} style={{
                      display:"flex", alignItems:"center", gap:6, padding:"9px 18px", borderRadius:9,
                      background:T.success, color:"#fff", border:"none", fontSize:13, fontWeight:700,
                      cursor: updating===p.id ? "not-allowed":"pointer",
                      fontFamily:"'DM Sans',sans-serif", opacity: updating===p.id ? .6:1 }}>
                      <SVGIcon d="M5 13l4 4L19 7" color="#fff" size={13} stroke={2.5}/>
                      {updating===p.id ? "Updating..." : "Accept"}
                    </button>
                    <button onClick={() => updateStatus(p.id,"rejected")} disabled={updating===p.id} style={{
                      display:"flex", alignItems:"center", gap:6, padding:"9px 18px", borderRadius:9,
                      background:T.danger, color:"#fff", border:"none", fontSize:13, fontWeight:700,
                      cursor: updating===p.id ? "not-allowed":"pointer",
                      fontFamily:"'DM Sans',sans-serif", opacity: updating===p.id ? .6:1 }}>
                      <SVGIcon d="M6 18L18 6M6 6l12 12" color="#fff" size={13} stroke={2.5}/>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ProjectProposals;

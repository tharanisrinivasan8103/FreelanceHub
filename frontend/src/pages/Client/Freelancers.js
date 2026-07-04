import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFreelancers } from "../../api/api";
import API from "../../api/api";

const Freelancers = () => {
  const navigate = useNavigate();
  const [freelancers, setFreelancers] = useState([]);
  const [search, setSearch]           = useState("");
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    getFreelancers()
      .then(r => { setFreelancers(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = freelancers.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.email?.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = async (freelancer) => {
    try {
      await API.post("/messages", {
        receiver_id: freelancer.id,
        content: `Hi ${freelancer.name}! I'd like to connect with you.`,
      });
      navigate("/client/messages");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div style={{ background:"#f8fafc", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ color:"#0f766e", fontWeight:"600" }}>Loading...</span>
    </div>
  );

  const avatarColors = ["#0f766e","#0891b2","#7c3aed","#be185d","#b45309","#166534"];

  return (
    <div style={{ background:"#f8fafc", minHeight:"100vh", padding:"32px", fontFamily:"'Segoe UI',sans-serif" }}>

      <h1 style={{ fontSize:"24px", fontWeight:"700", color:"#0f172a", margin:"0 0 4px" }}>Browse Freelancers</h1>
      <p style={{ color:"#64748b", fontSize:"13px", marginBottom:"24px" }}>Connect with skilled freelancers for your projects</p>

      {/* SEARCH */}
      <div style={{ position:"relative", maxWidth:"440px", marginBottom:"28px" }}>
        <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", color:"#94a3b8", fontSize:"16px" }}>🔍</span>
        <input
          type="text"
          placeholder="Search freelancers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width:"100%", padding:"11px 16px 11px 40px", border:"1px solid #e2e8f0", borderRadius:"10px", fontSize:"13px", outline:"none", background:"white", color:"#0f172a", boxSizing:"border-box", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}
        />
      </div>

      {/* GRID */}
      {filtered.length === 0 ? (
        <div style={{ background:"white", borderRadius:"14px", padding:"60px", textAlign:"center", border:"1px solid #e2e8f0" }}>
          <div style={{ fontSize:"40px", marginBottom:"12px" }}>👨‍💻</div>
          <p style={{ color:"#94a3b8" }}>No freelancers found.</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:"16px" }}>
          {filtered.map((f, i) => (
            <div key={f.id} style={{ background:"white", border:"1px solid #e2e8f0", borderRadius:"16px", padding:"24px", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", transition:"box-shadow 0.2s" }}>

              {/* AVATAR + INFO */}
              <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"16px" }}>
                <div style={{ width:"52px", height:"52px", borderRadius:"50%", background:avatarColors[i%avatarColors.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", fontWeight:"800", color:"white", flexShrink:0 }}>
                  {f.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize:"15px", fontWeight:"700", color:"#0f172a", margin:"0 0 3px" }}>{f.name}</h2>
                  <p style={{ fontSize:"12px", color:"#64748b", margin:"0 0 5px" }}>{f.email}</p>
                  <span style={{ background:"#f0fdf9", color:"#0f766e", border:"1px solid #99f6e4", fontSize:"10px", fontWeight:"700", padding:"2px 10px", borderRadius:"20px", textTransform:"uppercase", letterSpacing:"0.5px" }}>
                    Freelancer
                  </span>
                </div>
              </div>

              {/* MESSAGE BUTTON ONLY — no Invite */}
              <button
                onClick={() => sendMessage(f)}
                style={{ width:"100%", padding:"10px", borderRadius:"9px", border:"none", background:"linear-gradient(135deg,#0f766e,#0891b2)", color:"white", fontSize:"13px", fontWeight:"700", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                💬 Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Freelancers;

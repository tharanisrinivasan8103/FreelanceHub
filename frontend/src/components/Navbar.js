import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        .fh-nb-login:hover  { background:#F1F5F9!important; }
        .fh-nb-reg:hover    { opacity:.88!important; transform:translateY(-1px); }
        .fh-nb-login, .fh-nb-reg { transition:all .15s; }
      `}</style>

      <nav style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"0 60px", height:64, background:"#fff",
        borderBottom:"1px solid #E2E8F0", position:"sticky",
        top:0, zIndex:100, boxShadow:"0 1px 3px rgba(0,0,0,0.05)",
        fontFamily:"'Inter',sans-serif",
      }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}
          onClick={() => navigate("/")}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:"linear-gradient(135deg,#14B8A6,#0F766E)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 3px 10px rgba(20,184,166,.3)",
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M3 6C3 4.9 3.9 4 5 4h10c1.1 0 2 .9 2 2v1H3V6z" fill="white" fillOpacity=".95"/>
              <rect x="3" y="8" width="14" height="8" rx="1" fill="white" fillOpacity=".45"/>
              <rect x="7" y="11.5" width="6" height="1.5" rx=".75" fill="white" fillOpacity=".9"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:"#1E293B",
              fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1 }}>Freelancing Project Platform</div>
            <div style={{ fontSize:9, fontWeight:600, color:"#14B8A6",
              letterSpacing:1.6, textTransform:"uppercase" }}>Pro Platform</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {isAuthenticated ? (
            <button className="fh-nb-reg" onClick={handleLogout} style={{
              padding:"8px 18px", borderRadius:9, border:"none",
              background:"linear-gradient(135deg,#14B8A6,#0F766E)",
              color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer",
              fontFamily:"'Inter',sans-serif", boxShadow:"0 3px 10px rgba(20,184,166,.3)",
            }}>Logout</button>
          ) : (
            <>
              <button className="fh-nb-login" onClick={() => navigate("/login")} style={{
                padding:"8px 18px", borderRadius:9, border:"1.5px solid #E2E8F0",
                background:"#fff", color:"#1E293B", fontSize:13, fontWeight:600,
                cursor:"pointer", fontFamily:"'Inter',sans-serif",
              }}>Login</button>
              <button className="fh-nb-reg" onClick={() => navigate("/register")} style={{
                padding:"8px 18px", borderRadius:9, border:"none",
                background:"linear-gradient(135deg,#14B8A6,#0F766E)",
                color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer",
                fontFamily:"'Inter',sans-serif", boxShadow:"0 3px 10px rgba(20,184,166,.3)",
              }}>Register</button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

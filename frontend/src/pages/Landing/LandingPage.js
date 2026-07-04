import React from "react";
import { useNavigate } from "react-router-dom";

const T = {
  accent: "#14B8A6", accent2: "#0F766E", text: "#1E293B",
  muted: "#64748B", border: "#E2E8F0", pageBg: "#F8FAFC",
};
const fonts = `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap`;

const Icon = ({ d, size = 20, color = "#fff", stroke = 1.8 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24"
    stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      title: "Find Projects",
      desc: "Browse thousands of projects across multiple categories and industries.",
      color: T.accent,
    },
    {
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      title: "Hire Talent",
      desc: "Connect with skilled freelancers vetted for quality and reliability.",
      color: "#6366F1",
    },
    {
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      title: "Grow Your Career",
      desc: "Build your portfolio, earn reviews, and unlock premium opportunities.",
      color: "#F59E0B",
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: T.pageBg, minHeight: "100vh" }}>
      <link href={fonts} rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fh-land-hero { animation: fadeUp .7s ease both }
        .fh-land-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,0.1)!important; }
        .fh-land-card { transition: transform .2s, box-shadow .2s; }
        .fh-nav-btn:hover { opacity:.88; transform:translateY(-1px); }
        .fh-nav-btn { transition:opacity .15s,transform .15s; }
        .fh-cta:hover { opacity:.9; transform:translateY(-2px); box-shadow:0 8px 24px rgba(20,184,166,.45)!important; }
        .fh-cta { transition:all .2s; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 60px", height: 64, background: "#fff",
        borderBottom: `1px solid ${T.border}`,
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => navigate("/")}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg,${T.accent},${T.accent2})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 3px 10px ${T.accent}35`,
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M3 6C3 4.9 3.9 4 5 4h10c1.1 0 2 .9 2 2v1H3V6z" fill="white" fillOpacity=".95"/>
              <rect x="3" y="8" width="14" height="8" rx="1" fill="white" fillOpacity=".45"/>
              <rect x="7" y="11.5" width="6" height="1.5" rx=".75" fill="white" fillOpacity=".9"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.text,
              fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1 }}>Freelancing Project</div>
            <div style={{ fontSize: 9, fontWeight: 600, color: T.accent,
              letterSpacing: 1.6, textTransform: "uppercase" }}>Platform</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="fh-nav-btn" onClick={() => navigate("/login")} style={{
            padding: "8px 18px", borderRadius: 9, border: `1.5px solid ${T.border}`,
            background: "#fff", color: T.text, fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Inter',sans-serif",
          }}>Login</button>
          <button className="fh-nav-btn" onClick={() => navigate("/register")} style={{
            padding: "8px 18px", borderRadius: 9, border: "none",
            background: `linear-gradient(135deg,${T.accent},${T.accent2})`,
            color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Inter',sans-serif", boxShadow: `0 3px 10px ${T.accent}30`,
          }}>Register</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        textAlign: "center", padding: "100px 20px 80px",
        background: "linear-gradient(180deg,#F0FDFA 0%,#F8FAFC 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position:"absolute", top:-80, left:-80, width:320, height:320, borderRadius:"50%",
          background:`${T.accent}0C`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-60, right:-60, width:240, height:240, borderRadius:"50%",
          background:"#6366F11A", pointerEvents:"none" }}/>

        <div className="fh-land-hero">
          <h1 style={{ fontSize:52, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800,
            color:T.text, margin:"0 0 12px", lineHeight:1.15, letterSpacing:-1 }}>
            Connect with top talent.
          </h1>
          <h2 style={{ fontSize:48, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800,
            margin:"0 0 22px", lineHeight:1.15, letterSpacing:-1,
            background:`linear-gradient(135deg,${T.accent},#3B82F6)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Build something great.
          </h2>
          <p style={{ fontSize:17, color:T.muted, maxWidth:560, margin:"0 auto 36px",
            lineHeight:1.7, fontWeight:400 }}>
            The professional freelancing platform that connects skilled developers,
            designers, and creators with clients who need exceptional work.
          </p>

          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="fh-cta" onClick={() => navigate("/register")} style={{
              display:"flex", alignItems:"center", gap:8, padding:"14px 30px", borderRadius:12,
              background:`linear-gradient(135deg,${T.accent},${T.accent2})`,
              color:"#fff", border:"none", fontSize:15, fontWeight:700,
              cursor:"pointer", fontFamily:"'Inter',sans-serif",
              boxShadow:`0 6px 20px ${T.accent}38`,
            }}>
              Get Started
              <Icon d="M17 8l4 4m0 0l-4 4m4-4H3" size={16} color="#fff" stroke={2.5}/>
            </button>
            <button className="fh-nav-btn" onClick={() => navigate("/login")} style={{
              padding:"14px 30px", borderRadius:12, border:`1.5px solid ${T.border}`,
              background:"#fff", color:T.text, fontSize:15, fontWeight:600,
              cursor:"pointer", fontFamily:"'Inter',sans-serif",
            }}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:"80px 60px", background:T.pageBg }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <p style={{ fontSize:11, color:T.muted, letterSpacing:2, textTransform:"uppercase",
              fontWeight:600, marginBottom:10 }}>Features</p>
            <h2 style={{ fontSize:32, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
              color:T.text, margin:"0 0 12px", letterSpacing:-0.5 }}>Everything You Need</h2>
            <p style={{ color:T.muted, fontSize:15, maxWidth:480, margin:"0 auto", lineHeight:1.6 }}>
              A complete platform for freelancers and clients to work together seamlessly.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:18 }}>
            {features.map((f,i) => (
              <div key={i} className="fh-land-card" style={{
                background:"#fff", borderRadius:16, padding:"32px 26px",
                border:`1px solid ${T.border}`, boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
                textAlign:"center",
              }}>
                <div style={{ width:54, height:54, borderRadius:14, margin:"0 auto 18px",
                  background:`linear-gradient(135deg,${f.color},${f.color}99)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 4px 14px ${f.color}30` }}>
                  <Icon d={f.icon} size={22} color="#fff" stroke={1.8}/>
                </div>
                <h3 style={{ margin:"0 0 8px", fontSize:15, fontWeight:700, color:T.text,
                  fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{f.title}</h3>
                <p style={{ margin:0, fontSize:13, color:T.muted, lineHeight:1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{
        margin:"0 60px 80px", borderRadius:20, padding:"56px 40px",
        background:`linear-gradient(135deg,${T.accent2} 0%,#0C4A6E 100%)`,
        textAlign:"center", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200,
          borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-40, left:-40, width:160, height:160,
          borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }}/>
        <h2 style={{ fontSize:28, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
          color:"#fff", margin:"0 0 12px", letterSpacing:-0.3 }}>
          Ready to get started?
        </h2>
        <p style={{ color:"rgba(255,255,255,0.75)", fontSize:15, margin:"0 0 28px", lineHeight:1.6 }}>
          Join thousands of freelancers and clients already working on Freelancing Project Platform.
        </p>
        <button className="fh-cta" onClick={() => navigate("/register")} style={{
          padding:"13px 32px", borderRadius:12, border:"none",
          background:"#fff", color:T.accent2, fontSize:14, fontWeight:700,
          cursor:"pointer", fontFamily:"'Inter',sans-serif",
          boxShadow:"0 4px 16px rgba(0,0,0,0.2)",
        }}>
          Create Free Account
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${T.border}`, padding:"24px 60px",
        display:"flex", justifyContent:"center", alignItems:"center",
        background:"#fff" }}>
        <p style={{ margin:0, fontSize:12, color:T.muted }}>
          © 2026 Freelancing Project Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [message,  setMessage]  = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.role === "admin")       navigate("/admin/dashboard");
      else if (result.role === "client") navigate("/client/dashboard");
      else                               navigate("/freelancer/dashboard");
    } else {
      setMessage(result.message);
    }
  };

  const inp = {
    width: "100%", padding: "5px 9px", fontSize: "11.5px",
    borderRadius: "6px", border: "1.5px solid #e5e7eb",
    outline: "none", background: "#f9fafb",
    boxSizing: "border-box", height: "30px",
  };
  const lbl = { fontSize: "10.5px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "2px" };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }}>

      {/* LEFT PANEL */}
      <div style={{
        background: "linear-gradient(135deg, #0f766e 0%, #134e4a 60%, #0c3b36 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 50px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", top: "-80px", right: "-80px" }} />
        <div style={{ position: "absolute", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", bottom: "-50px", left: "-50px" }} />
        <h1 style={{ fontSize: "42px", fontWeight: "800", color: "white", lineHeight: 1.15, marginBottom: "16px", zIndex: 1 }}>
          Welcome to<br /><span style={{ color: "#5eead4" }}>FreelanceHub</span>
        </h1>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: "36px", zIndex: 1 }}>
          The professional platform connecting skilled freelancers with clients who need exceptional work.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", zIndex: 1 }}>
          {[["🚀","Post projects and find top talent instantly"],
            ["💼","Freelancers earn more with direct client connections"],
            ["🔒","Secure payments and transparent proposals"],
            ["⭐","Rate and review after project completion"],
          ].map(([icon, text], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", background: "rgba(255,255,255,0.12)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{icon}</div>
              <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.88)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "#f8fafc", padding: "16px" }}>
        <div style={{
          width: "100%", maxWidth: "400px",
          background: "white", padding: "28px 32px",
          borderRadius: "14px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}>
          {/* HEADER — no logo */}
          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", margin: "0 0 4px", color: "#111827" }}>Welcome Back</h2>
            <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>Sign in to your FreelanceHub account</p>
          </div>

          {/* TOGGLE */}
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "8px", padding: "3px", marginBottom: "20px" }}>
            {[["Login", true], ["Register", false]].map(([label, active]) => (
              <button key={label} onClick={() => !active && navigate("/register")} style={{
                flex: 1, padding: "7px", fontSize: "12px", fontWeight: "600",
                borderRadius: "6px", border: "none", cursor: "pointer",
                background: active ? "#0f766e" : "transparent",
                color: active ? "white" : "#6b7280",
                boxShadow: active ? "0 1px 4px rgba(15,118,110,0.3)" : "none",
              }}>{label}</button>
            ))}
          </div>

          {message && (
            <p style={{
              fontSize: "11px", marginBottom: "12px", textAlign: "center",
              color: "#ef4444", background: "#fef2f2",
              border: "1px solid #fecaca",
              padding: "6px 10px", borderRadius: "6px",
            }}>{message}</p>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={lbl}>Email</label>
              <input style={inp} type="email" placeholder="demo@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={lbl}>Password</label>
              <input style={inp} type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "10px", fontSize: "13px", fontWeight: "600",
              borderRadius: "8px", border: "none",
              background: "linear-gradient(135deg, #0f766e, #134e4a)",
              color: "white", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, marginTop: "4px",
            }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

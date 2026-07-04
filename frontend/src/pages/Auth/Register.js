import React, { useState } from "react";
import "../../styles/auth.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "",
    phone: "", gender: "", dob: "", role: "freelancer",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    if (form.password !== form.confirmPassword) { setMessage("❌ Passwords do not match!"); return; }
    if (form.phone.length !== 10) { setMessage("❌ Enter valid 10-digit phone!"); return; }
    setLoading(true);
    const result = await register({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email, password: form.password,
      phone: form.phone, gender: form.gender, dob: form.dob, role: form.role,
    });
    setLoading(false);
    if (result.success) {
      setMessage("✅ Registered! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } else { setMessage(result.message); }
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
          Join<br /><span style={{ color: "#5eead4" }}>FreelanceHub</span>
        </h1>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: "36px", zIndex: 1 }}>
          Connect with top talent or find exciting projects today.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", zIndex: 1 }}>
          {[["💻","Freelancers — showcase skills & get hired"],
            ["🏢","Clients — post projects & find experts"],
            ["💬","Chat directly with your team"],
            ["📊","Track earnings and project progress"],
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
          background: "white", padding: "16px 20px",
          borderRadius: "14px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}>

          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 2px", color: "#111827" }}>Create Account</h2>
            <p style={{ fontSize: "10px", color: "#6b7280", margin: 0 }}>Join FreelanceHub today</p>
          </div>

          {/* TOGGLE */}
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "8px", padding: "3px", marginBottom: "10px" }}>
            {[["Login", false], ["Register", true]].map(([label, active]) => (
              <button key={label} onClick={() => !active && navigate("/login")} style={{
                flex: 1, padding: "6px", fontSize: "11.5px", fontWeight: "600",
                borderRadius: "5px", border: "none", cursor: "pointer",
                background: active ? "#0f766e" : "transparent",
                color: active ? "white" : "#6b7280",
              }}>{label}</button>
            ))}
          </div>

          {message && (
            <p style={{
              fontSize: "10.5px", marginBottom: "8px", textAlign: "center",
              color: message.startsWith("✅") ? "#059669" : "#ef4444",
              background: message.startsWith("✅") ? "#f0fdf4" : "#fef2f2",
              border: `1px solid ${message.startsWith("✅") ? "#bbf7d0" : "#fecaca"}`,
              padding: "4px 8px", borderRadius: "5px",
            }}>{message}</p>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

            {/* First + Last */}
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ flex: 1 }}><label style={lbl}>First Name</label>
                <input style={inp} type="text" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} required /></div>
              <div style={{ flex: 1 }}><label style={lbl}>Last Name</label>
                <input style={inp} type="text" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} required /></div>
            </div>

            {/* Email */}
            <div><label style={lbl}>Email</label>
              <input style={inp} type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required /></div>

            {/* Password + Confirm */}
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ flex: 1 }}><label style={lbl}>Password</label>
                <input style={inp} type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required /></div>
              <div style={{ flex: 1 }}><label style={lbl}>Confirm</label>
                <input style={inp} type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required /></div>
            </div>

            {/* Phone */}
            <div><label style={lbl}>Phone Number</label>
              <input style={inp} type="tel" name="phone" placeholder="9876543210" maxLength="10" value={form.phone} onChange={handleChange} required /></div>

            {/* Gender + DOB */}
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ flex: 1 }}><label style={lbl}>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} required style={inp}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select></div>
              <div style={{ flex: 1 }}><label style={lbl}>Date of Birth</label>
                <input style={inp} type="date" name="dob" value={form.dob} onChange={handleChange} required /></div>
            </div>

            {/* Role */}
            <div>
              <label style={lbl}>Register As</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[["freelancer","👤","Freelancer"],["client","👥","Client"]].map(([val, icon, label]) => (
                  <div key={val} onClick={() => setForm({ ...form, role: val })} style={{
                    flex: 1, textAlign: "center", padding: "5px 4px",
                    borderRadius: "7px", cursor: "pointer",
                    border: form.role === val ? "2px solid #0f766e" : "1.5px solid #e5e7eb",
                    background: form.role === val ? "#f0fdf9" : "#f9fafb",
                  }}>
                    <span style={{ fontSize: "14px" }}>{icon}</span>
                    <p style={{ fontSize: "10px", fontWeight: "600", margin: "1px 0 0", color: form.role === val ? "#0f766e" : "#6b7280" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "8px", fontSize: "12.5px", fontWeight: "600",
              borderRadius: "8px", border: "none",
              background: "linear-gradient(135deg, #0f766e, #134e4a)",
              color: "white", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, marginTop: "2px",
            }}>
              {loading ? "Creating..." : "Create Account"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

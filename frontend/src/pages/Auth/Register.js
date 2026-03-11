import React, { useState } from "react";
import "../../styles/auth.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    dob: "",
    role: "freelancer",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    // Confirm password check
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    // Phone number validation
    if (form.phone.length !== 10) {
      setMessage("❌ Enter valid 10-digit phone number!");
      return;
    }

    setLoading(true);

    const fullName = `${form.firstName} ${form.lastName}`.trim();

    const result = await register({
      name: fullName,
      email: form.email,
      password: form.password,
      phone: form.phone,
      gender: form.gender,
      dob: form.dob,
      role: form.role,
    });

    setLoading(false);

    if (result.success) {
      setMessage("✅ Registered! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper" style={{ maxWidth: "480px" }}>

        {/* HEADER */}
        <div className="register-header">
          <div className="logo-icon">🧳</div>
          <h2>Create Account</h2>
          <p>Join FreelanceHub today</p>
        </div>

        {/* TOGGLE */}
        <div className="toggle-container">
          <button onClick={() => navigate("/login")}>Login</button>
          <button className="active">Register</button>
        </div>

        {message && (
          <p className={`success-msg ${message.startsWith("✅") ? "text-green" : ""}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleRegister} className="register-form">

          {/* ROW 1: First Name + Last Name */}
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <label>Email ID</label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* ROW 2: Password + Confirm Password */}
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="********"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="9876543210"
            maxLength="10"
            value={form.phone}
            onChange={handleChange}
            required
          />

          {/* ROW 3: Gender + DOB */}
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "9px",
                  fontSize: "13px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  outline: "none",
                  marginBottom: "0",
                  background: "white",
                }}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Register As */}
          <label style={{ marginTop: "10px" }}>Register As</label>
          <div className="role-selection">
            <div
              className={`role-box ${form.role === "freelancer" ? "active" : ""}`}
              onClick={() => setForm({ ...form, role: "freelancer" })}
            >
              👤<p>Freelancer</p>
            </div>
            <div
              className={`role-box ${form.role === "client" ? "active" : ""}`}
              onClick={() => setForm({ ...form, role: "client" })}
            >
              👥<p>Client</p>
            </div>
          </div>

          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;

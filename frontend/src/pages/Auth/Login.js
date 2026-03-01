import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password, role);

    setLoading(false);

    if (result.success) {
      navigate(`/${result.role}/dashboard`);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">

        <div className="register-header">
          <div className="logo-icon">🧳</div>
          <h2>Welcome Back</h2>
          <p>Sign in to your FreelanceHub account</p>
        </div>

        {/* TOGGLE */}
        <div className="toggle-container">
          <button className="active">
            Login
          </button>
          <button onClick={() => navigate("/register")}>
            Register
          </button>
        </div>

        {message && <p className="success-msg">{message}</p>}

        <form onSubmit={handleLogin} className="register-form">

          <label>Email</label>
          <input
            type="email"
            placeholder="demo@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Login As</label>

          <div className="role-selection">
            <div
              className={`role-box ${role === "admin" ? "active" : ""}`}
              onClick={() => setRole("admin")}
            >
              🛡️
              <p>Admin</p>
            </div>

            <div
              className={`role-box ${role === "freelancer" ? "active" : ""}`}
              onClick={() => setRole("freelancer")}
            >
              👤
              <p>Freelancer</p>
            </div>

            <div
              className={`role-box ${role === "client" ? "active" : ""}`}
              onClick={() => setRole("client")}
            >
              👥
              <p>Client</p>
            </div>
          </div>

          <button type="submit" className="create-btn">
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;
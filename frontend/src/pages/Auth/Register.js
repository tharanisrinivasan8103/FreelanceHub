import React, { useState } from "react";
import "../../styles/auth.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("User Registered Successfully");

        localStorage.setItem(
          "user",
          JSON.stringify({ name, email, role })
        );

        setTimeout(() => {
          if (role === "admin") navigate("/admin/dashboard");
          else if (role === "freelancer")
            navigate("/freelancer/dashboard");
          else navigate("/client/dashboard");
        }, 1000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Server error");
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
          <button onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="active">
            Register
          </button>
        </div>

        {message && <p className="success-msg">{message}</p>}

        <form onSubmit={handleRegister} className="register-form">

          <label>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="john@example.com"
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

          <label>Register As</label>

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
            Create Account
          </button>

        </form>

      </div>
    </div>
  );
}

export default Register;
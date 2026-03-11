import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/landing.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div className="logo" onClick={() => navigate("/")}>
        <div className="logo-box">🎁</div>
        Freelancing Platform
      </div>

      {/* RIGHT SIDE - Only Login */}
      <div className="nav-links">
        <span className="nav-link" onClick={() => navigate("/login")}>
          Login
        </span>
        <button
          onClick={() => navigate("/register")}
          className="register"
        >
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
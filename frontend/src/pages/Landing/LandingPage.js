import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/landing.css";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // If already logged in, redirect to their dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <div className="hero">
        <h1>
          Connect with top talent. <br />
          <span className="highlight">Build something great.</span>
        </h1>

        <p>
          The professional freelancing platform that connects skilled developers,
          designers, and creators with clients who need exceptional work.
        </p>

        <div className="hero-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate("/register")}
          >
            Get Started →
          </button>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="features">
        <h2 className="features-title">Everything You Need</h2>
        <p className="features-subtitle">
          A complete platform for freelancers and clients to work together seamlessly.
        </p>

        <div className="feature-container">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Find Projects</h3>
            <p>Browse thousands of projects across multiple categories and industries.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Hire Talent</h3>
            <p>Connect with skilled freelancers vetted for quality and reliability.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Grow Your Career</h3>
            <p>Build your portfolio, earn reviews, and unlock premium opportunities.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
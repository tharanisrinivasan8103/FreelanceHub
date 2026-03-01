import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

const Navbar = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <nav className="navbar">

      {/* LOGO */}

      <div className="logo" onClick={() => navigate("/")}>

        <div className="logo-box">
          🎁
        </div>

        Freelancing Platform

      </div>


      {/* RIGHT SIDE */}

      <div className="nav-links">

        {token ? (

          <>
          
            <span className="nav-link">

              {user?.name}

            </span>

            <button onClick={logout} className="get-started">

              Logout

            </button>

          </>

        ) : (

          <span
            className="nav-link"
            onClick={() => navigate("/login")}
          >

            Login

          </span>

        )}

      </div>

    </nav>

  );

};

export default Navbar;
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  // =========================
  // GET TOKEN
  // =========================
  const token = localStorage.getItem("token");

  // =========================
  // SAFELY PARSE USER
  // =========================
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data in localStorage");
    localStorage.removeItem("user");
    user = null;
  }

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // =========================
  // ROLE CHECK
  // =========================
  if (role) {
    const userRole = user.role?.toString().toLowerCase().trim();
    const requiredRole = role.toString().toLowerCase().trim();

    if (userRole !== requiredRole) {
      console.log("Role mismatch:", userRole, requiredRole);
      return <Navigate to="/login" replace />;
    }
  }

  // =========================
  // ALLOW ACCESS
  // =========================
  return children;
};

export default ProtectedRoute;
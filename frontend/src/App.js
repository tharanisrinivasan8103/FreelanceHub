import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ================= PUBLIC =================
import LandingPage from "./pages/Landing/LandingPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// ================= ADMIN =================
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageProjects from "./pages/Admin/ManageProjects"; 
import Reports from "./pages/Admin/Reports";
import AdminSettings from "./pages/Admin/Settings";

// ================= FREELANCER =================
import FreelancerDashboard from "./pages/Freelancer/FreelancerDashboard";
import FindProjects from "./pages/Freelancer/FindProjects";
import MyProposals from "./pages/Freelancer/MyProposals";
import Profile from "./pages/Freelancer/Profile";
import MyProjects from "./pages/Freelancer/Projects";

// ================= CLIENT =================
import ClientDashboard from "./pages/Client/ClientDashboard";
import PostProject from "./pages/Client/PostProject";
import ClientMyProjects from "./pages/Client/MyProjects";
import Freelancers from "./pages/Client/Freelancers";
import Settings from "./pages/Client/Settings";

// ================= LAYOUT =================
import DashboardLayout from "./components/DashboardLayout";
import FreelancerLayout from "./components/FreelancerLayout";

// ================= PROTECTED ROUTE =================
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ ADD THIS ROUTE */}
    <Route
path="/admin/users"
element={
<ProtectedRoute role="admin">
<ManageUsers />
</ProtectedRoute>
}
/>
  <Route
        path="/admin/projects"
        element={
          <ProtectedRoute role="admin">
            <ManageProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute role="admin">
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/settings"
  element={
    <ProtectedRoute role="admin">
      <AdminSettings />
    </ProtectedRoute>
  }
/>

      {/* ================= FREELANCER ================= */}
      <Route
        path="/freelancer"
        element={
          <ProtectedRoute role="freelancer">
            <FreelancerLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" />} />

        <Route path="dashboard" element={<FreelancerDashboard />} />
        <Route path="find-projects" element={<FindProjects />} />
        <Route path="my-projects" element={<MyProjects />} />
        <Route path="proposals" element={<MyProposals />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ================= CLIENT ================= */}
      <Route
        path="/client"
        element={
          <ProtectedRoute role="client">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect */}
        <Route index element={<Navigate to="dashboard" />} />

        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="post-project" element={<PostProject />} />
        <Route path="my-projects" element={<ClientMyProjects />} />
        <Route path="freelancers" element={<Freelancers />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* ================= DEFAULT ================= */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;
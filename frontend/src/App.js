import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// PUBLIC
import LandingPage from "./pages/Landing/LandingPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// ADMIN
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageProjects from "./pages/Admin/ManageProjects";
import Reports from "./pages/Admin/Reports";
import AdminSettings from "./pages/Admin/Settings";

// FREELANCER
import FreelancerDashboard from "./pages/Freelancer/FreelancerDashboard";
import FindProjects from "./pages/Freelancer/FindProjects";
import MyProposals from "./pages/Freelancer/MyProposals";
import Profile from "./pages/Freelancer/Profile";
import MyProjects from "./pages/Freelancer/Projects";
import SubmitProject from "./pages/Freelancer/SubmitProject";

// CLIENT
import ClientDashboard from "./pages/Client/ClientDashboard";
import PostProject from "./pages/Client/PostProject";
import ClientMyProjects from "./pages/Client/MyProjects";
import Freelancers from "./pages/Client/Freelancers";
import Settings from "./pages/Client/Settings";
import ProposalView from "./pages/Client/ProposalView";
import SubmissionView from "./pages/Client/SubmissionView";

// LAYOUTS
import AdminLayout from "./components/AdminLayout";
import DashboardLayout from "./components/DashboardLayout";
import FreelancerLayout from "./components/FreelancerLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// HOME ROUTE - redirects logged in users to their dashboard
const HomeRoute = () => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user?.role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  return <LandingPage />;
};

function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN - all wrapped in AdminLayout which shows sidebar */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* FREELANCER */}
      <Route
        path="/freelancer"
        element={
          <ProtectedRoute role="freelancer">
            <FreelancerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<FreelancerDashboard />} />
        <Route path="find-projects" element={<FindProjects />} />
        <Route path="my-projects" element={<MyProjects />} />
        <Route path="proposals" element={<MyProposals />} />
        <Route path="submit-project" element={<SubmitProject />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* CLIENT */}
      <Route
        path="/client"
        element={
          <ProtectedRoute role="client">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="post-project" element={<PostProject />} />
        <Route path="my-projects" element={<ClientMyProjects />} />
        <Route path="projects/:projectId/proposals" element={<ProposalView />} />
        <Route path="projects/:projectId/submissions" element={<SubmissionView />} />
        <Route path="freelancers" element={<Freelancers />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;

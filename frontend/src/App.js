import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// PUBLIC
import LandingPage  from "./pages/Landing/LandingPage";
import Login        from "./pages/Auth/Login";
import Register     from "./pages/Auth/Register";

// ADMIN
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageUsers    from "./pages/Admin/ManageUsers";
import ManageProjects from "./pages/Admin/ManageProjects";
import Reports        from "./pages/Admin/Reports";

// FREELANCER
import FreelancerDashboard from "./pages/Freelancer/FreelancerDashboard";
import FindProjects        from "./pages/Freelancer/FindProjects";
import MyProposals         from "./pages/Freelancer/MyProposals";
import Profile             from "./pages/Freelancer/Profile";
import FreelancerProjects  from "./pages/Freelancer/Projects";
import FreelancerChat      from "./pages/Freelancer/Chat";

// CLIENT
import ClientDashboard  from "./pages/Client/ClientDashboard";
import PostProject      from "./pages/Client/PostProject";
import ClientMyProjects from "./pages/Client/MyProjects";
import Freelancers      from "./pages/Client/Freelancers";
import Settings         from "./pages/Client/Settings";
import ProjectProposals from "./pages/Client/ProjectProposals";
import RateFreelancer   from "./pages/Client/RateFreelancer";
import ClientChat       from "./pages/Client/Chat";
import SubmissionView   from "./pages/Client/SubmissionView";

// LAYOUT
import AdminLayout      from "./components/AdminLayout";
import DashboardLayout  from "./components/DashboardLayout";
import FreelancerLayout from "./components/FreelancerLayout";
import ProtectedRoute   from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index            element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users"     element={<ManageUsers />} />
        <Route path="projects"  element={<ManageProjects />} />
        <Route path="reports"   element={<Reports />} />
      </Route>

      {/* FREELANCER */}
      <Route path="/freelancer" element={<ProtectedRoute role="freelancer"><FreelancerLayout /></ProtectedRoute>}>
        <Route index                element={<Navigate to="dashboard" />} />
        <Route path="dashboard"     element={<FreelancerDashboard />} />
        <Route path="find-projects" element={<FindProjects />} />
        <Route path="my-projects"   element={<FreelancerProjects />} />
        <Route path="proposals"     element={<MyProposals />} />
        <Route path="messages"      element={<FreelancerChat />} />
        <Route path="profile"       element={<Profile />} />
      </Route>

      {/* CLIENT */}
      <Route path="/client" element={<ProtectedRoute role="client"><DashboardLayout /></ProtectedRoute>}>
        <Route index                           element={<Navigate to="dashboard" />} />
        <Route path="dashboard"                element={<ClientDashboard />} />
        <Route path="post-project"             element={<PostProject />} />
        <Route path="my-projects"              element={<ClientMyProjects />} />
        <Route path="freelancers"              element={<Freelancers />} />
        <Route path="rate-freelancer"          element={<RateFreelancer />} />
        <Route path="messages"                 element={<ClientChat />} />
        <Route path="settings"                 element={<Settings />} />
        <Route path="projects/:id/proposals"   element={<ProjectProposals />} />
        <Route path="projects/:id/submissions" element={<SubmissionView />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;

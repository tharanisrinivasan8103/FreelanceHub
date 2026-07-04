import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

// ✅ Route → Title mapping
const pageTitles = {
  "/client/dashboard":         "Dashboard",
  "/client/post-project":      "Post Project",
  "/client/my-projects":       "My Projects",
  "/client/freelancers":       "Browse Freelancers",
  "/client/rate-freelancer":   "Rate Freelancer",
  "/client/messages":          "Messages",
  "/client/settings":          "Settings",
  "/freelancer/dashboard":     "Dashboard",
  "/freelancer/find-projects": "Find Projects",
  "/freelancer/my-projects":   "My Projects",
  "/freelancer/proposals":     "My Proposals",
  "/freelancer/messages":      "Messages",
  "/freelancer/profile":       "Profile",
  "/freelancer/earnings":      "Earnings",
  "/admin/dashboard":          "Dashboard",
  "/admin/users":              "Manage Users",
  "/admin/projects":           "Manage Projects",
  "/admin/reports":            "Reports",
  "/admin/settings":           "Settings",
};

const getTitle = (pathname) => {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.includes("/proposals"))   return "Proposals";
  if (pathname.includes("/submissions")) return "Submissions";
  if (pathname.includes("/milestones"))  return "Milestones";
  return "Dashboard";
};

const DashboardLayout = () => {
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#F1F5F9" }}>

      {/* SIDEBAR */}
      <aside style={{
        width:256, flexShrink:0, position:"fixed",
        left:0, top:0, height:"100vh", zIndex:50, overflowY:"auto"
      }}>
        <Sidebar />
      </aside>

      {/* MAIN */}
      <div style={{ marginLeft:256, flex:1, display:"flex", flexDirection:"column", minHeight:"100vh" }}>

        {/* ✅ Dynamic Header */}
        <header style={{
          background:"#fff", borderBottom:"1px solid #E2E8F0",
          padding:"0 32px", height:56, display:"flex", alignItems:"center",
          position:"sticky", top:0, zIndex:40,
          boxShadow:"0 1px 3px rgba(0,0,0,0.04)"
        }}>
          <h1 style={{
            margin:0, fontSize:15, fontWeight:600, color:"#1E293B",
            fontFamily:"'Inter','Plus Jakarta Sans',sans-serif", letterSpacing:-0.1
          }}>
            {title}
          </h1>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex:1, overflowY:"auto" }}>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;

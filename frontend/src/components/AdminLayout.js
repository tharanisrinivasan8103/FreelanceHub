import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f3f4f6" }}>

      {/* SIDEBAR - Fixed, 256px width */}
      <div style={{
        width: "256px",
        flexShrink: 0,
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        zIndex: 50,
        overflowY: "auto"
      }}>
        <Sidebar />
      </div>

      {/* MAIN CONTENT - margin-left: 256px */}
      <div style={{
        marginLeft: "256px",
        flex: 1,
        minHeight: "100vh",
        overflowY: "auto"
      }}>
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;

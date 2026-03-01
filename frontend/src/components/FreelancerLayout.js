import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const FreelancerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </div>

    </div>
  );
};

export default FreelancerLayout;
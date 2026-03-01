import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white shadow-lg fixed h-full left-0 top-0 z-50">
        <Sidebar />
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 ml-64 flex flex-col">

        {/* Top Header (Optional but Professional) */}
        <header className="bg-white shadow-sm px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-700">
            Dashboard
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;
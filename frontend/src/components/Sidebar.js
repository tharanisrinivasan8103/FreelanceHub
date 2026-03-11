import React, { useMemo, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const menus = {
    freelancer: [
      { name: "Dashboard", path: "/freelancer/dashboard", icon: "📊" },
      { name: "Find Projects", path: "/freelancer/find-projects", icon: "🔎" },
      { name: "My Projects", path: "/freelancer/my-projects", icon: "📁" },
      { name: "My Proposals", path: "/freelancer/proposals", icon: "📄" },
      { name: "Submit Project", path: "/freelancer/submit-project", icon: "📤" },
      { name: "Profile", path: "/freelancer/profile", icon: "👤" },
    ],
    client: [
      { name: "Dashboard", path: "/client/dashboard", icon: "📊" },
      { name: "Post Project", path: "/client/post-project", icon: "➕" },
      { name: "My Projects", path: "/client/my-projects", icon: "📁" },
      { name: "Freelancers", path: "/client/freelancers", icon: "👨‍💻" },
      { name: "Settings", path: "/client/settings", icon: "⚙️" },
    ],
    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
      { name: "Users", path: "/admin/users", icon: "👥" },
      { name: "Reports", path: "/admin/reports", icon: "📈" },
      { name: "Projects", path: "/admin/projects", icon: "📁" },
      { name: "Settings", path: "/admin/settings", icon: "⚙️" },
    ],
  };

  const menu = menus[user.role] || [];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col justify-between shadow-xl">

      {/* TOP */}
      <div>
        {/* LOGO */}
        <div
          className="p-6 border-b border-slate-700 cursor-pointer"
          onClick={() => navigate(`/${user.role}/dashboard`)}
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-green-500 p-2 rounded-lg">💼</span>
            FreelanceHub
          </h1>
        </div>

        {/* USER INFO */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* MENU LABEL */}
        <div className="px-6 pt-4 text-gray-400 text-sm tracking-wide">
          MENU
        </div>

        {/* MENU ITEMS */}
        <div className="p-4 space-y-2">
          {menu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-green-500 text-white shadow-md"
                    : "hover:bg-slate-700 text-gray-300"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* LOGOUT */}
      <div className="p-6 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition duration-200"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
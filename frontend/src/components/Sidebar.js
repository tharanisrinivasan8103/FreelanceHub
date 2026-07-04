import React, { useMemo, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  }, []);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menus = {
    freelancer: [
      { name: "Dashboard",     path: "/freelancer/dashboard",     icon: <DashboardIcon /> },
      { name: "Find Projects", path: "/freelancer/find-projects", icon: <SearchIcon /> },
      { name: "My Projects",   path: "/freelancer/my-projects",   icon: <FolderIcon /> },
      { name: "My Proposals",  path: "/freelancer/proposals",     icon: <ProposalIcon /> },
      { name: "Messages",      path: "/freelancer/messages",      icon: <MessageIcon /> },
      { name: "Profile",       path: "/freelancer/profile",       icon: <ProfileIcon /> },
    ],
    client: [
      { name: "Dashboard",       path: "/client/dashboard",       icon: <DashboardIcon /> },
      { name: "Post Project",    path: "/client/post-project",    icon: <PlusIcon /> },
      { name: "My Projects",     path: "/client/my-projects",     icon: <FolderIcon /> },
      { name: "Freelancers",     path: "/client/freelancers",     icon: <UsersIcon /> },
      { name: "Rate Freelancer", path: "/client/rate-freelancer", icon: <StarIcon /> },
      { name: "Messages",        path: "/client/messages",        icon: <MessageIcon /> },
      { name: "Settings",        path: "/client/settings",        icon: <SettingsIcon /> },
    ],
    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
      { name: "Users",     path: "/admin/users",     icon: <UsersIcon /> },
      { name: "Reports",   path: "/admin/reports",   icon: <ReportIcon /> },
      { name: "Projects",  path: "/admin/projects",  icon: <FolderIcon /> },
    ],
  };

  const menu = menus[user.role] || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

        /* ── Light theme — matches landing page ── */
        .fh-sidebar {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          border-right: 1px solid #E2E8F0;
        }

        /* Subtle teal glow top-left */
        .fh-sidebar::before {
          content: '';
          position: absolute;
          top: -80px;
          left: -60px;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Logo ── */
        .fh-logo-wrap {
          padding: 20px 18px 16px;
          border-bottom: 1px solid #F1F5F9;
          cursor: pointer;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .fh-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .fh-logo-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #14b8a6 0%, #0f766e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(20,184,166,0.30);
        }
        .fh-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }
        .fh-logo-name {
          font-size: 14px;
          font-weight: 800;
          color: #1E293B;
          letter-spacing: -0.2px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .fh-logo-sub {
          font-size: 9px;
          font-weight: 600;
          color: #14b8a6;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          margin-top: 3px;
        }

        /* ── User section ── */
        .fh-user {
          padding: 12px 18px;
          border-bottom: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          background: #F8FAFC;
        }
        .fh-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #14b8a6, #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          color: white;
          flex-shrink: 0;
          border: 2px solid rgba(20,184,166,0.2);
          overflow: hidden;
        }
        .fh-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fh-user-name {
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fh-user-role {
          font-size: 10px;
          font-weight: 500;
          color: #14b8a6;
          text-transform: capitalize;
          letter-spacing: 0.3px;
          margin-top: 1px;
        }

        /* ── Nav ── */
        .fh-nav {
          flex: 1;
          padding: 12px 10px 8px;
          overflow-y: auto;
          position: relative;
          z-index: 1;
        }
        .fh-nav-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #94A3B8;
          padding: 0 10px;
          margin-bottom: 6px;
        }
        .fh-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          margin-bottom: 2px;
          text-decoration: none;
          color: #64748B;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.15s ease;
          position: relative;
        }
        .fh-nav-link:hover {
          color: #1E293B;
          background: #F1F5F9;
        }
        .fh-nav-link.active {
          background: linear-gradient(90deg, rgba(20,184,166,0.12) 0%, rgba(20,184,166,0.03) 100%);
          color: #0F766E;
          font-weight: 600;
        }
        .fh-nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 55%;
          background: linear-gradient(180deg, #14b8a6, #0f766e);
          border-radius: 0 3px 3px 0;
        }
        .fh-nav-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          opacity: 0.5;
          display: flex;
          align-items: center;
          color: #64748B;
        }
        .fh-nav-link.active .fh-nav-icon {
          opacity: 1;
          color: #14b8a6;
        }
        .fh-nav-link:hover .fh-nav-icon {
          opacity: 0.8;
        }

        /* ── Logout ── */
        .fh-logout-wrap {
          padding: 10px 10px 16px;
          border-top: 1px solid #F1F5F9;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .fh-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #94A3B8;
          font-size: 13px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }
        .fh-logout-btn:hover {
          background: #FEF2F2;
          color: #EF4444;
        }

        /* Scrollbar */
        .fh-nav::-webkit-scrollbar { width: 3px; }
        .fh-nav::-webkit-scrollbar-track { background: transparent; }
        .fh-nav::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>

      <div className="fh-sidebar">

        {/* LOGO */}
        <div className="fh-logo-wrap" onClick={() => navigate(`/${user.role}/dashboard`)}>
          <div className="fh-logo">
            <div className="fh-logo-mark">
              <LogoIcon />
            </div>
            <div className="fh-logo-text">
              <span className="fh-logo-name">Freelancing Project</span>
              <span className="fh-logo-sub">Platform</span>
            </div>
          </div>
        </div>

        {/* USER */}
        <div className="fh-user">
          <div className="fh-avatar">
            {localStorage.getItem("profile_photo")
              ? <img src={localStorage.getItem("profile_photo")} alt="Profile" />
              : (user?.name?.charAt(0)?.toUpperCase() || "U")
            }
          </div>
          <div style={{ minWidth:0 }}>
            <div className="fh-user-name">{user?.name}</div>
            <div className="fh-user-role">{user?.role}</div>
          </div>
        </div>

        {/* NAV */}
        <nav className="fh-nav">
          <div className="fh-nav-label">Menu</div>
          {menu.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) => `fh-nav-link${isActive ? " active" : ""}`}
            >
              <span className="fh-nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="fh-logout-wrap">
          <button className="fh-logout-btn" onClick={logout}>
            <LogoutIcon />
            <span>Log out</span>
          </button>
        </div>

      </div>
    </>
  );
};

/* ── ICONS ── */
const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 6C3 4.9 3.9 4 5 4h10c1.1 0 2 .9 2 2v1H3V6z" fill="white" fillOpacity="0.95"/>
    <rect x="3" y="8" width="14" height="8" rx="1" fill="white" fillOpacity="0.45"/>
    <rect x="7" y="11.5" width="6" height="1.5" rx="0.75" fill="white" fillOpacity="0.9"/>
    <path d="M7.5 2.5h5a.5.5 0 010 1h-5a.5.5 0 010-1z" fill="white" fillOpacity="0.6"/>
  </svg>
);

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
    <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" fillOpacity="0.5"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" fillOpacity="0.5"/>
    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 4.5C1 3.67 1.67 3 2.5 3H6l1.5 2H13.5c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-11C1.67 14 1 13.33 1 12.5v-8z" fill="currentColor"/>
  </svg>
);

const ProposalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="1" width="12" height="14" rx="1.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 3.5C2 2.67 2.67 2 3.5 2h9c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5H5l-3 2V3.5z" fill="currentColor"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5.5" r="2.5" fill="currentColor"/>
    <path d="M2.5 13c0-2.76 2.46-5 5.5-5s5.5 2.24 5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="5" r="2.5" fill="currentColor"/>
    <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="12" cy="5" r="2" fill="currentColor" fillOpacity="0.5"/>
    <path d="M14.5 13c0-2-1.12-3.7-2.8-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2l1.6 4H14l-3.5 2.5 1.3 4L8 10l-3.8 2.5 1.3-4L2 6h4.4L8 2z" fill="currentColor"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const ReportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 10V8M8 10V6M11 10V4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M6 2H3a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10l3-2.5L10 5M13 7.5H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Sidebar;

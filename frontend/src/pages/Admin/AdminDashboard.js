import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const T = {
  accent:"#14B8A6", accent2:"#0F766E", text:"#1E293B", muted:"#64748B",
  border:"#E2E8F0", card:"#FFFFFF", pageBg:"#F1F5F9",
  success:"#10B981", warn:"#F59E0B", danger:"#EF4444", indigo:"#6366F1", blue:"#3B82F6",
};
const fonts = `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap`;

const Icon = ({ d, size=18, color=T.accent, stroke=1.8 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24"
    stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

const StatCard = ({ label, value, color, icon }) => (
  <div style={{ background:T.card, borderRadius:14, padding:"22px 20px", border:`1px solid ${T.border}`,
    boxShadow:"0 1px 3px rgba(0,0,0,0.05)", flex:1, position:"relative", overflow:"hidden", minWidth:160 }}>
    <div style={{ position:"absolute", top:-16, right:-16, width:64, height:64,
      borderRadius:"50%", background:color+"18" }}/>
    <div style={{ width:36, height:36, borderRadius:9, background:color+"1C",
      display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
      <Icon d={icon} color={color} size={17}/>
    </div>
    <div style={{ fontSize:28, fontWeight:700, color:T.text, lineHeight:1,
      fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{value}</div>
    <div style={{ fontSize:12, color:T.muted, marginTop:5, fontWeight:500 }}>{label}</div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats,    setStats]    = useState({ clients:0, freelancers:0, projects:0, proposals:0 });
  const [projects, setProjects] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [pdfLoading,      setPdfLoading]      = useState(false);
  const [loginPdfLoading, setLoginPdfLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [usersRes, projRes] = await Promise.all([
          API.get("/users"),
          API.get("/projects"),
        ]);
        const u = usersRes.data || [];
        const p = projRes.data  || [];
        setUsers(u);

        let totalProposals = 0;
        const updatedProjects = await Promise.all(
          p.map(async (proj) => {
            try {
              const propRes = await API.get(`/proposals/project/${proj.id}`);
              const count   = (propRes.data || []).length;
              totalProposals += count;
              return { ...proj, proposal_count: count };
            } catch {
              return { ...proj, proposal_count: 0 };
            }
          })
        );
        setProjects(updatedProjects);
        setStats({
          clients:     u.filter(x => x.role === "client").length,
          freelancers: u.filter(x => x.role === "freelancer").length,
          projects:    p.length,
          proposals:   totalProposals,
        });
      } catch {}
      setLoading(false);
    })();
  }, []);

  // Load jsPDF from CDN
  const loadJsPDF = () => new Promise((resolve, reject) => {
    if (window.jspdf) { resolve(window.jspdf.jsPDF); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload  = () => resolve(window.jspdf.jsPDF);
    s.onerror = reject;
    document.head.appendChild(s);
  });

  // ── FULL REPORT ────────────────────────────────────────────────
  const generateFullReport = async () => {
    setPdfLoading(true);
    try {
      const jsPDF = await loadJsPDF();
      const doc   = new jsPDF();
      const date  = new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" });

      // Header bar
      doc.setFillColor(15, 118, 110);
      doc.rect(0, 0, 210, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20); doc.setFont("helvetica", "bold");
      doc.text("Freelancing Project Platform", 14, 17);
      doc.setFontSize(11); doc.setFont("helvetica", "normal");
      doc.text("Full Platform Report", 14, 27);
      doc.text(`Generated: ${date}`, 14, 35);

      // Stats section
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(13); doc.setFont("helvetica", "bold");
      doc.text("Platform Statistics", 14, 55);
      doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.3);
      doc.line(14, 58, 196, 58);

      const statItems = [
        { label:"Total Clients",     value: stats.clients },
        { label:"Total Freelancers", value: stats.freelancers },
        { label:"Total Projects",    value: stats.projects },
        { label:"Total Proposals",   value: stats.proposals },
      ];
      let sx = 14;
      statItems.forEach(s => {
        doc.setFillColor(240, 253, 250);
        doc.roundedRect(sx, 62, 42, 20, 2, 2, "F");
        doc.setTextColor(15, 118, 110);
        doc.setFontSize(16); doc.setFont("helvetica", "bold");
        doc.text(String(s.value), sx + 21, 72, { align:"center" });
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(7); doc.setFont("helvetica", "normal");
        doc.text(s.label, sx + 21, 79, { align:"center" });
        sx += 46;
      });

      // Registered Users table
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(13); doc.setFont("helvetica", "bold");
      doc.text("Registered Users", 14, 100);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 103, 196, 103);

      // Table header
      doc.setFillColor(15, 118, 110);
      doc.rect(14, 106, 182, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8); doc.setFont("helvetica", "bold");
      doc.text("#",    18,  112);
      doc.text("Name", 28,  112);
      doc.text("Email", 80, 112);
      doc.text("Role",  150, 112);
      doc.text("Joined",170, 112);

      let y = 122;
      doc.setFont("helvetica", "normal");
      users.slice(0, 20).forEach((u, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        if (i % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, y - 5, 182, 8, "F");
        }
        doc.setTextColor(30, 41, 59);
        doc.text(String(i + 1), 18, y);
        doc.text((u.name  || "").slice(0, 22), 28,  y);
        doc.text((u.email || "").slice(0, 30), 80,  y);

        // Role color
        if (u.role === "freelancer")      doc.setTextColor(15, 118, 110);
        else if (u.role === "client")     doc.setTextColor(37, 99, 235);
        else                              doc.setTextColor(100, 116, 139);
        doc.text((u.role || "").charAt(0).toUpperCase() + (u.role || "").slice(1), 150, y);

        doc.setTextColor(100, 116, 139);
        doc.text(
          u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN") : "—",
          170, y
        );
        y += 9;
      });

      // Projects page
      doc.addPage();
      doc.setFillColor(15, 118, 110);
      doc.rect(0, 0, 210, 14, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9); doc.setFont("helvetica", "bold");
      doc.text("Freelancing Project Platform — Project Report", 14, 9);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(13); doc.setFont("helvetica", "bold");
      doc.text("All Projects", 14, 26);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 29, 196, 29);

      // Table header
      doc.setFillColor(15, 118, 110);
      doc.rect(14, 32, 182, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8); doc.setFont("helvetica", "bold");
      doc.text("#",        18,  38);
      doc.text("Title",    28,  38);
      doc.text("Budget",   110, 38);
      doc.text("Status",   140, 38);
      doc.text("Deadline", 168, 38);

      y = 50;
      doc.setFont("helvetica", "normal");
      projects.forEach((p, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        if (i % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, y - 5, 182, 8, "F");
        }
        doc.setTextColor(30, 41, 59);
        doc.text(String(i + 1), 18, y);
        doc.text((p.title || "").slice(0, 30), 28, y);
        doc.text(`Rs.${Number(p.budget || 0).toLocaleString()}`, 110, y);

        // Status color
        if ((p.status || "open") === "open") doc.setTextColor(16, 185, 129);
        else                                 doc.setTextColor(220, 38, 38);
        doc.text(
          (p.status || "open").charAt(0).toUpperCase() + (p.status || "open").slice(1),
          140, y
        );

        doc.setTextColor(100, 116, 139);
        doc.text(
          p.deadline ? new Date(p.deadline).toLocaleDateString("en-IN") : "—",
          168, y
        );
        y += 9;
      });

      // Footer
      doc.setFontSize(8); doc.setTextColor(148, 163, 184);
      doc.text(`© ${new Date().getFullYear()} Freelancing Project Platform`, 14, 285);

      doc.save(`Platform_FullReport_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      alert("Error generating PDF. Please try again.");
    }
    setPdfLoading(false);
  };

  // ── TODAY'S LOGIN REPORT ───────────────────────────────────────
  const generateLoginReport = async () => {
    setLoginPdfLoading(true);
    try {
      const jsPDF    = await loadJsPDF();
      const doc      = new jsPDF();
      const today    = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      const dateStr  = today.toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" });

      // Header bar
      doc.setFillColor(15, 118, 110);
      doc.rect(0, 0, 210, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20); doc.setFont("helvetica", "bold");
      doc.text("Freelancing Project Platform", 14, 17);
      doc.setFontSize(11); doc.setFont("helvetica", "normal");
      doc.text("Today's Login Report", 14, 27);
      doc.text(`Date: ${dateStr}`, 14, 35);

      const todayUsers = users.filter(u => (u.created_at || "").slice(0, 10) === todayStr);

      const summaryItems = [
        { label:"Total Users",      value: users.length },
        { label:"Freelancers",      value: users.filter(u => u.role === "freelancer").length },
        { label:"Clients",          value: users.filter(u => u.role === "client").length },
        { label:"Registered Today", value: todayUsers.length },
      ];

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(13); doc.setFont("helvetica", "bold");
      doc.text("User Summary", 14, 55);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 58, 196, 58);

      let sx2 = 14;
      summaryItems.forEach(s => {
        doc.setFillColor(240, 253, 250);
        doc.roundedRect(sx2, 62, 42, 22, 2, 2, "F");
        doc.setTextColor(15, 118, 110);
        doc.setFontSize(18); doc.setFont("helvetica", "bold");
        doc.text(String(s.value), sx2 + 21, 73, { align:"center" });
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(7); doc.setFont("helvetica", "normal");
        doc.text(s.label, sx2 + 21, 80, { align:"center" });
        sx2 += 46;
      });

      // New users today
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(13); doc.setFont("helvetica", "bold");
      doc.text(`New Users Today (${todayUsers.length})`, 14, 100);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 103, 196, 103);

      if (todayUsers.length === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, 107, 182, 14, "F");
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        doc.text("No new users registered today.", 105, 116, { align:"center" });
      } else {
        // Table header
        doc.setFillColor(15, 118, 110);
        doc.rect(14, 106, 182, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8); doc.setFont("helvetica", "bold");
        doc.text("#",    18,  112);
        doc.text("Name", 28,  112);
        doc.text("Email", 80, 112);
        doc.text("Role",  155, 112);

        let y3 = 122;
        doc.setFont("helvetica", "normal");
        todayUsers.forEach((u, i) => {
          if (i % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(14, y3 - 5, 182, 8, "F");
          }
          doc.setTextColor(30, 41, 59);
          doc.text(String(i + 1), 18, y3);
          doc.text((u.name  || "").slice(0, 22), 28,  y3);
          doc.text((u.email || "").slice(0, 30), 80,  y3);
          doc.setTextColor(15, 118, 110);
          doc.text(
            (u.role || "").charAt(0).toUpperCase() + (u.role || "").slice(1),
            155, y3
          );
          y3 += 9;
        });
      }

      // Footer
      doc.setFontSize(8); doc.setTextColor(148, 163, 184);
      doc.text(`© ${new Date().getFullYear()} Freelancing Project Platform`, 14, 285);

      doc.save(`Platform_LoginReport_${todayStr}.pdf`);
    } catch (e) {
      alert("Error generating PDF. Please try again.");
    }
    setLoginPdfLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:T.pageBg, fontFamily:"'Inter',sans-serif" }}>
      <link href={fonts} rel="stylesheet"/>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 28px" }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <p style={{ fontSize:11, color:T.muted, letterSpacing:1.8, textTransform:"uppercase",
            fontWeight:600, marginBottom:5 }}>Overview</p>
          <h1 style={{ fontSize:24, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
            color:T.text, margin:0 }}>Admin Dashboard</h1>
          <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>Platform statistics and recent activity</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display:"flex", gap:14, marginBottom:28, flexWrap:"wrap" }}>
          <StatCard label="Total Clients"     value={stats.clients}     color={T.blue}
            icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          <StatCard label="Total Freelancers" value={stats.freelancers} color={T.accent}
            icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          <StatCard label="Total Projects"    value={stats.projects}    color={T.indigo}
            icon="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          <StatCard label="Total Proposals"   value={stats.proposals}   color={T.warn}
            icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </div>

        {/* Projects Table */}
        <div style={{ background:T.card, borderRadius:16, border:`1px solid ${T.border}`,
          boxShadow:"0 1px 3px rgba(0,0,0,0.05)", overflow:"hidden" }}>

          {/* Table Header */}
          <div style={{ padding:"18px 24px", borderBottom:`1px solid ${T.border}`,
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:`${T.accent}1A`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  size={15} color={T.accent}/>
              </div>
              <h2 style={{ margin:0, fontSize:14, fontWeight:600, color:T.text,
                fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Project Details</h2>
            </div>
            <button onClick={() => navigate("/admin/projects")} style={{
              fontSize:12, color:T.accent, background:"none", border:"none",
              cursor:"pointer", fontWeight:600, fontFamily:"'Inter',sans-serif",
              display:"flex", alignItems:"center", gap:4 }}>
              View All <Icon d="M9 5l7 7-7 7" color={T.accent} size={12} stroke={2.5}/>
            </button>
          </div>

          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#F8FAFC" }}>
                  {["Title","Status","Budget","Client","Proposals"].map(h => (
                    <th key={h} style={{ padding:"11px 20px", textAlign:"left", fontSize:11,
                      fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:.8,
                      borderBottom:`1px solid ${T.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding:40, textAlign:"center", color:T.muted }}>
                    Loading...
                  </td></tr>
                ) : projects.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding:40, textAlign:"center", color:T.muted }}>
                    No projects yet
                  </td></tr>
                ) : projects.map((p, i) => (
                  <tr key={p.id}
                    style={{ borderBottom:i < projects.length-1 ? `1px solid ${T.border}` : "none",
                      transition:"background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding:"14px 20px", fontSize:13, fontWeight:600, color:T.text }}>
                      {p.title}
                    </td>
                    <td style={{ padding:"14px 20px" }}>
                      <span style={{ padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:600,
                        background: p.status === "open" ? "#D1FAE5" : "#FEE2E2",
                        color:      p.status === "open" ? T.success  : T.danger }}>
                        {(p.status || "open").charAt(0).toUpperCase() + (p.status || "open").slice(1)}
                      </span>
                    </td>
                    <td style={{ padding:"14px 20px", fontSize:13, fontWeight:500, color:T.text }}>
                      ₹{Number(p.budget).toLocaleString()}
                    </td>
                    <td style={{ padding:"14px 20px", fontSize:13, color:T.muted }}>
                      {p.client_name || "—"}
                    </td>
                    <td style={{ padding:"14px 20px", fontSize:13, color:T.muted }}>
                      {p.proposal_count || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PDF Buttons */}
          <div style={{ padding:"16px 20px", borderTop:`1px solid ${T.border}`,
            display:"flex", gap:10, flexWrap:"wrap" }}>
            <button onClick={generateFullReport} disabled={pdfLoading} style={{
              display:"flex", alignItems:"center", gap:7, padding:"10px 20px", borderRadius:9,
              background: pdfLoading ? T.muted : `linear-gradient(135deg,${T.accent},${T.accent2})`,
              color:"#fff", border:"none", fontSize:13, fontWeight:600,
              cursor: pdfLoading ? "not-allowed" : "pointer",
              fontFamily:"'Inter',sans-serif",
              boxShadow:`0 3px 10px ${T.accent}30`, transition:"all .2s" }}>
              <Icon d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                color="#fff" size={14}/>
              {pdfLoading ? "Generating..." : "Generate Full PDF Report"}
            </button>

            <button onClick={generateLoginReport} disabled={loginPdfLoading} style={{
              display:"flex", alignItems:"center", gap:7, padding:"10px 20px", borderRadius:9,
              background: loginPdfLoading ? "#E2E8F0" : `${T.accent}12`,
              color:  loginPdfLoading ? T.muted : T.accent,
              border: `1px solid ${loginPdfLoading ? T.border : T.accent + "25"}`,
              fontSize:13, fontWeight:600,
              cursor: loginPdfLoading ? "not-allowed" : "pointer",
              fontFamily:"'Inter',sans-serif", transition:"all .2s" }}>
              <Icon d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                color={loginPdfLoading ? T.muted : T.accent} size={14}/>
              {loginPdfLoading ? "Generating..." : "Generate Today's Login Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

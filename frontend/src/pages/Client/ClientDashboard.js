import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { T, fonts, Spinner, PageHeader, PrimaryBtn, GhostBtn, Badge, SVGIcon, Card } from "./designSystem";

const StatCard = ({ label, value, icon, color }) => (
  <div style={{ background:T.card, borderRadius:16, padding:"22px 20px", border:`1px solid ${T.border}`,
    boxShadow:"0 1px 4px rgba(0,0,0,0.05)", flex:1, position:"relative", overflow:"hidden", minWidth:140 }}>
    <div style={{ position:"absolute", top:-18, right:-18, width:72, height:72,
      borderRadius:"50%", background:color+"16" }}/>
    <div style={{ width:38, height:38, borderRadius:10, background:color+"1C",
      display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
      <SVGIcon d={icon} color={color} size={18}/>
    </div>
    <div style={{ fontSize:30, fontWeight:800, color:T.text, lineHeight:1,
      fontFamily:"'Syne',sans-serif" }}>{value}</div>
    <div style={{ fontSize:12, color:T.muted, marginTop:5, fontWeight:500 }}>{label}</div>
  </div>
);

const ICONS = {
  projects:  "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  open:      "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  proposals: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  hired:     "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  money:     "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  folder:    "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
  add:       "M12 4v16m8-8H4",
  chevron:   "M9 5l7 7-7 7",
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [projects,  setProjects]  = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d = (await API.get("/projects/client")).data || [];
        setProjects(d);
        const all = [];
        await Promise.all(d.map(async p => {
          try { (await API.get(`/proposals/project/${p.id}`)).data?.forEach(pr => all.push(pr)); } catch {}
        }));
        setProposals(all);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const stats = {
    total: projects.length,
    open:  projects.filter(p => !p.status || p.status === "open").length,
    props: proposals.length,
    hired: proposals.filter(p => p.status === "accepted").length,
  };

  const fmt = d => d ? new Date(d).toLocaleDateString("en-IN",{ day:"2-digit", month:"short", year:"numeric" }) : "";

  return (
    <div style={{ minHeight:"100vh", background:T.pageBg, fontFamily:"'DM Sans',sans-serif" }}>
      <link href={fonts} rel="stylesheet"/>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"36px 28px" }}>

        <PageHeader
          eyebrow="Overview"
          title={`Welcome back, ${user.name?.split(" ")[0]} 👋`}
          subtitle="Here's what's happening with your projects today."
          action={
            <PrimaryBtn onClick={() => navigate("/client/post-project")}>
              <SVGIcon d={ICONS.add} color="#fff" size={14} stroke={2.5}/> Post New Project
            </PrimaryBtn>
          }
        />

        {/* Stats */}
        <div style={{ display:"flex", gap:16, marginBottom:32, flexWrap:"wrap" }}>
          <StatCard label="Total Projects"    value={stats.total} icon={ICONS.projects}  color={T.accent}/>
          <StatCard label="Open Projects"     value={stats.open}  icon={ICONS.open}      color={T.success}/>
          <StatCard label="Total Proposals"   value={stats.props} icon={ICONS.proposals} color={T.warn}/>
          <StatCard label="Hired Freelancers" value={stats.hired} icon={ICONS.hired}     color={T.indigo}/>
        </div>

        {/* Recent Projects */}
        <Card>
          <div style={{ padding:"18px 24px", borderBottom:`1px solid ${T.border}`,
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:`${T.accent}1A`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <SVGIcon d={ICONS.folder} color={T.accent} size={17}/>
              </div>
              <h2 style={{ margin:0, fontSize:15, fontWeight:700, color:T.text, fontFamily:"'Syne',sans-serif" }}>
                Recent Projects
              </h2>
            </div>
            <GhostBtn small onClick={() => navigate("/client/my-projects")}>
              View All <SVGIcon d={ICONS.chevron} color={T.accent} size={12} stroke={2.5}/>
            </GhostBtn>
          </div>

          {loading ? <Spinner/> : projects.length === 0 ? (
            <div style={{ padding:"56px 20px", textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
              <p style={{ color:T.muted, marginBottom:20, fontSize:14 }}>No projects yet.</p>
              <PrimaryBtn onClick={() => navigate("/client/post-project")}>Post First Project</PrimaryBtn>
            </div>
          ) : projects.slice(0,5).map((p, i) => {
            const pp  = proposals.filter(pr => pr.project_id === p.id);
            const acc = pp.find(pr => pr.status === "accepted");
            return (
              <div key={p.id} style={{
                padding:"15px 24px", display:"flex", alignItems:"center",
                justifyContent:"space-between",
                borderBottom: i<Math.min(projects.length,5)-1 ? `1px solid ${T.border}` : "none",
                transition:"background .15s",
              }}
                onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:T.text }}>{p.title}</span>
                    <Badge status={p.status||"open"}/>
                  </div>
                  <div style={{ display:"flex", gap:14, fontSize:11, color:T.muted, flexWrap:"wrap" }}>
                    <span>₹{Number(p.budget).toLocaleString()}</span>
                    {p.deadline && <span>{fmt(p.deadline)}</span>}
                    <span>{pp.length} proposal{pp.length!==1?"s":""}</span>
                    {acc && <span style={{ color:T.success, fontWeight:600 }}>✓ {acc.freelancer_name} hired</span>}
                  </div>
                </div>
                <GhostBtn small onClick={() => navigate(`/client/projects/${p.id}/proposals`)}>
                  Proposals →
                </GhostBtn>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};
export default ClientDashboard;

import React, { useEffect, useState } from "react";
import API from "../../api/api";

const T = {
  accent:"#14B8A6", accent2:"#0F766E", text:"#1E293B", muted:"#64748B",
  border:"#E2E8F0", card:"#FFFFFF", pageBg:"#F1F5F9",
  success:"#10B981", warn:"#F59E0B", danger:"#EF4444",
  indigo:"#6366F1", blue:"#3B82F6",
};
const fonts = `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap`;

const Icon = ({ d, size=18, color=T.accent, stroke=1.8 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24"
    stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

// Simple bar chart component
const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:160, padding:"0 8px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:11, fontWeight:700, color:T.text }}>{d.value}</span>
          <div style={{ width:"100%", borderRadius:"6px 6px 0 0", transition:"height .5s",
            height: `${(d.value/max)*120}px`, minHeight:4,
            background:`linear-gradient(180deg,${d.color},${d.color}88)` }}/>
          <span style={{ fontSize:10, color:T.muted, textAlign:"center", lineHeight:1.2 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// Simple donut chart
const DonutChart = ({ freelancers, clients }) => {
  const total = freelancers + clients || 1;
  const fPct  = (freelancers / total) * 100;
  const cPct  = (clients / total) * 100;
  const r = 50, cx = 70, cy = 70, circ = 2 * Math.PI * r;
  const fDash = (fPct / 100) * circ;
  const cDash = (cPct / 100) * circ;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:24 }}>
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.border} strokeWidth={18}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.blue} strokeWidth={18}
          strokeDasharray={`${cDash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.accent} strokeWidth={18}
          strokeDasharray={`${fDash} ${circ}`} strokeLinecap="round"
          strokeDashoffset={-cDash}
          transform={`rotate(-90 ${cx} ${cy})`}/>
        <text x={cx} y={cy-6} textAnchor="middle" fontSize="18" fontWeight="700" fill={T.text}>{total}</text>
        <text x={cx} y={cy+12} textAnchor="middle" fontSize="10" fill={T.muted}>Users</text>
      </svg>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:10, height:10, borderRadius:3, background:T.accent }}/>
          <span style={{ fontSize:12, color:T.muted }}>Freelancers:</span>
          <span style={{ fontSize:12, fontWeight:700, color:T.text }}>{freelancers}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:10, height:10, borderRadius:3, background:T.blue }}/>
          <span style={{ fontSize:12, color:T.muted }}>Clients:</span>
          <span style={{ fontSize:12, fontWeight:700, color:T.text }}>{clients}</span>
        </div>
      </div>
    </div>
  );
};

const Reports = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [users, projs] = await Promise.all([
          API.get("/users"),
          API.get("/projects"),
        ]);
        const u = users.data || [];
        const p = projs.data || [];

        // ✅ Fetch real proposal count from each project
        let totalProposals = 0;
        await Promise.all(
          p.map(async (proj) => {
            try {
              const res = await API.get(`/proposals/project/${proj.id}`);
              totalProposals += (res.data || []).length;
            } catch {}
          })
        );

        setData({
          totalUsers:  u.length,
          freelancers: u.filter(x => x.role === "freelancer").length,
          clients:     u.filter(x => x.role === "client").length,
          projects:    p.length,
          proposals:   totalProposals,
        });
      } catch {}
      setLoading(false);
    })();
  }, []);

  const statCards = data ? [
    { label:"Total Users",     value:data.totalUsers,  color:T.indigo, icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { label:"Total Projects",  value:data.projects,    color:T.warn,   icon:"M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
    { label:"Total Proposals", value:data.proposals,   color:T.blue,   icon:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { label:"Freelancers",     value:data.freelancers, color:T.accent, icon:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { label:"Clients",         value:data.clients,     color:T.success,icon:"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  ] : [];

  const barData = data ? [
    { label:"Users",       value:data.totalUsers,  color:T.indigo },
    { label:"Freelancers", value:data.freelancers, color:T.accent },
    { label:"Clients",     value:data.clients,     color:T.blue },
    { label:"Projects",    value:data.projects,    color:T.warn },
    { label:"Proposals",   value:data.proposals,   color:T.success },
  ] : [];

  const summaryRows = data ? [
    { metric:"Total Users",     count:data.totalUsers,  color:T.indigo },
    { metric:"Total Projects",  count:data.projects,    color:T.warn },
    { metric:"Total Proposals", count:data.proposals,   color:T.blue },
    { metric:"Freelancers",     count:data.freelancers, color:T.accent },
    { metric:"Clients",         count:data.clients,     color:T.success },
  ] : [];

  return (
    <div style={{ minHeight:"100vh", background:T.pageBg, fontFamily:"'Inter',sans-serif" }}>
      <link href={fonts} rel="stylesheet"/>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 28px" }}>

        {/* Header */}
        <div style={{ marginBottom:26 }}>
          <p style={{ fontSize:11, color:T.muted, letterSpacing:1.8, textTransform:"uppercase",
            fontWeight:600, marginBottom:5 }}>Analytics</p>
          <h1 style={{ fontSize:24, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
            color:T.text, margin:0, letterSpacing:-0.3 }}>Reports & Analytics</h1>
          <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>Real-time platform data from your database</p>
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:80, color:T.muted }}>Loading...</div>
        ) : (
          <>
            {/* Stat cards */}
            <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
              {statCards.map((s,i) => (
                <div key={i} style={{ background:T.card, borderRadius:14, padding:"16px 18px",
                  border:`1px solid ${T.border}`, boxShadow:"0 1px 3px rgba(0,0,0,0.05)",
                  flex:1, minWidth:140, position:"relative", overflow:"hidden",
                  borderTop:`3px solid ${s.color}` }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:s.color+"1C",
                    display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
                    <Icon d={s.icon} color={s.color} size={16}/>
                  </div>
                  <div style={{ fontSize:26, fontWeight:700, color:T.text, lineHeight:1,
                    fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize:11, color:T.muted, marginTop:4, fontWeight:500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
              {/* Bar chart */}
              <div style={{ background:T.card, borderRadius:16, border:`1px solid ${T.border}`,
                padding:"20px 22px", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin:"0 0 18px", fontSize:14, fontWeight:600, color:T.text,
                  fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Platform Overview</h3>
                <BarChart data={barData}/>
              </div>

              {/* Donut chart */}
              <div style={{ background:T.card, borderRadius:16, border:`1px solid ${T.border}`,
                padding:"20px 22px", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin:"0 0 18px", fontSize:14, fontWeight:600, color:T.text,
                  fontFamily:"'Plus Jakarta Sans',sans-serif" }}>User Distribution</h3>
                <DonutChart freelancers={data.freelancers} clients={data.clients}/>
              </div>
            </div>

            {/* Summary table */}
            <div style={{ background:T.card, borderRadius:16, border:`1px solid ${T.border}`,
              boxShadow:"0 1px 3px rgba(0,0,0,0.05)", overflow:"hidden" }}>
              <div style={{ padding:"16px 22px", borderBottom:`1px solid ${T.border}` }}>
                <h3 style={{ margin:0, fontSize:14, fontWeight:600, color:T.text,
                  fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Summary</h3>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#F8FAFC" }}>
                    {["Metric","Count","Status"].map(h => (
                      <th key={h} style={{ padding:"10px 20px", textAlign:"left", fontSize:11,
                        fontWeight:600, color:T.muted, textTransform:"uppercase", letterSpacing:.8,
                        borderBottom:`1px solid ${T.border}`, fontFamily:"'Inter',sans-serif" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: i<summaryRows.length-1?`1px solid ${T.border}`:"none" }}>
                      <td style={{ padding:"12px 20px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:8, height:8, borderRadius:2, background:r.color }}/>
                          <span style={{ fontSize:13, color:T.text, fontWeight:500 }}>{r.metric}</span>
                        </div>
                      </td>
                      <td style={{ padding:"12px 20px" }}>
                        <span style={{ fontSize:13, fontWeight:700, color:r.color }}>{r.count}</span>
                      </td>
                      <td style={{ padding:"12px 20px" }}>
                        <span style={{ padding:"2px 9px", borderRadius:20, fontSize:10, fontWeight:600,
                          background:"#D1FAE5", color:T.success }}>Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Reports;

import React, { useState } from "react";

const T = {
  accent:"#14B8A6", accent2:"#0F766E", text:"#1E293B", muted:"#64748B",
  border:"#E2E8F0", card:"#FFFFFF", pageBg:"#F1F5F9",
  success:"#10B981",
};
const fonts = `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap`;

const Toggle = ({ checked, onChange }) => (
  <div onClick={() => onChange(!checked)} style={{
    width:44, height:24, borderRadius:12, cursor:"pointer", transition:"background .2s",
    background: checked ? T.accent : "#CBD5E1", position:"relative", flexShrink:0,
  }}>
    <div style={{
      width:18, height:18, borderRadius:9, background:"#fff", position:"absolute",
      top:3, left: checked ? 23:3, transition:"left .2s",
      boxShadow:"0 1px 3px rgba(0,0,0,0.2)",
    }}/>
  </div>
);

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    platformName:      "FreelanceHub",
    supportEmail:      "support@freelancehub.com",
    maintenanceMode:   false,
    newRegistrations:  true,
    autoApprove:       false,
  });
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState("");

  const set = k => v => setSettings(s => ({ ...s, [k]:v }));
  const setVal = k => e => setSettings(s => ({ ...s, [k]:e.target.value }));

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 2500);
    }, 600);
  };

  const inputSt = { width:"100%", padding:"10px 13px", borderRadius:9,
    border:`1.5px solid ${T.border}`, fontSize:13, color:T.text, background:"#FAFAFA",
    outline:"none", fontFamily:"'Inter',sans-serif", boxSizing:"border-box" };

  const Section = ({ title, subtitle, children }) => (
    <div style={{ background:T.card, borderRadius:16, border:`1px solid ${T.border}`,
      boxShadow:"0 1px 3px rgba(0,0,0,0.05)", overflow:"hidden", marginBottom:16 }}>
      <div style={{ padding:"16px 22px", borderBottom:`1px solid ${T.border}` }}>
        <h3 style={{ margin:0, fontSize:14, fontWeight:600, color:T.text,
          fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{title}</h3>
        {subtitle && <p style={{ margin:"3px 0 0", fontSize:12, color:T.muted }}>{subtitle}</p>}
      </div>
      <div style={{ padding:"20px 22px" }}>{children}</div>
    </div>
  );

  const ToggleRow = ({ label, subtitle, checked, onChange }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
      <div>
        <p style={{ margin:0, fontSize:13, fontWeight:500, color:T.text }}>{label}</p>
        <p style={{ margin:"2px 0 0", fontSize:11, color:T.muted }}>{subtitle}</p>
      </div>
      <Toggle checked={checked} onChange={onChange}/>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:T.pageBg, fontFamily:"'Inter',sans-serif" }}>
      <link href={fonts} rel="stylesheet"/>
      <div style={{ maxWidth:720, margin:"0 auto", padding:"32px 28px" }}>

        {/* Header */}
        <div style={{ marginBottom:26 }}>
          <p style={{ fontSize:11, color:T.muted, letterSpacing:1.8, textTransform:"uppercase",
            fontWeight:600, marginBottom:5 }}>Configuration</p>
          <h1 style={{ fontSize:24, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
            color:T.text, margin:0, letterSpacing:-0.3 }}>Platform Settings</h1>
          <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>Manage platform configuration and controls</p>
        </div>

        {success && (
          <div style={{ background:"#D1FAE5", border:"1px solid #6EE7B7", borderRadius:10,
            padding:"11px 16px", marginBottom:18, color:T.success, fontWeight:600, fontSize:13,
            display:"flex", alignItems:"center", gap:8 }}>
            ✅ {success}
          </div>
        )}

        {/* General */}
        <Section title="General" subtitle="Basic platform information">
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:T.text, marginBottom:7 }}>
                Platform Name
              </label>
              <input value={settings.platformName} onChange={setVal("platformName")} style={inputSt}
                onFocus={e=>e.target.style.border=`1.5px solid ${T.accent}`}
                onBlur={e=>e.target.style.border=`1.5px solid ${T.border}`}/>
            </div>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:T.text, marginBottom:7 }}>
                Support Email
              </label>
              <input value={settings.supportEmail} onChange={setVal("supportEmail")} style={inputSt}
                onFocus={e=>e.target.style.border=`1.5px solid ${T.accent}`}
                onBlur={e=>e.target.style.border=`1.5px solid ${T.border}`}/>
            </div>
          </div>
        </Section>

        {/* Platform Controls */}
        <Section title="Platform Controls" subtitle="Toggle platform features on or off">
          <div>
            <ToggleRow
              label="Maintenance Mode"
              subtitle="Temporarily disable the platform for all users"
              checked={settings.maintenanceMode}
              onChange={set("maintenanceMode")}/>
            <ToggleRow
              label="New Registrations"
              subtitle="Allow new users to sign up on the platform"
              checked={settings.newRegistrations}
              onChange={set("newRegistrations")}/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:12 }}>
              <div>
                <p style={{ margin:0, fontSize:13, fontWeight:500, color:T.text }}>Auto-approve Freelancers</p>
                <p style={{ margin:"2px 0 0", fontSize:11, color:T.muted }}>Automatically approve new freelancer registrations</p>
              </div>
              <Toggle checked={settings.autoApprove} onChange={set("autoApprove")}/>
            </div>
          </div>
        </Section>



        {/* Save */}
        <button onClick={save} disabled={saving} style={{
          display:"flex", alignItems:"center", gap:8, padding:"12px 24px", borderRadius:11,
          background: saving ? T.muted : `linear-gradient(135deg,${T.accent},${T.accent2})`,
          color:"#fff", border:"none", fontSize:13, fontWeight:600, cursor: saving?"not-allowed":"pointer",
          fontFamily:"'Inter',sans-serif", boxShadow:`0 4px 14px ${T.accent}30` }}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
export default AdminSettings;

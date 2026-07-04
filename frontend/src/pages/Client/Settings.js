import React, { useState, useRef, useEffect } from "react";
import { T, fonts, SVGIcon, Card } from "./designSystem";

const Settings = () => {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const fileRef = useRef(null);

  // ✅ KEY FIX: Store photo per user email so it survives logout/login
  // e.g. "profile_photo_agila@gmail.com" instead of just "profile_photo"
  const photoKey = `profile_photo_${stored.email || "guest"}`;

  const [photo,   setPhoto]   = useState(localStorage.getItem(photoKey) || null);
  const [profile, setProfile] = useState({
    name:    stored.name    || "",
    email:   stored.email   || "",
    phone:   stored.phone   || "",
    role:    stored.role    || "",
    company: stored.company || "",
    website: stored.website || "",
    about:   stored.about   || "",
  });
  const [tab,     setTab]     = useState("profile");
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState("");

  // ✅ Re-sync photo from localStorage on mount + listen for updates
  useEffect(() => {
    const syncPhoto = () => {
      setPhoto(localStorage.getItem(photoKey) || null);
    };
    syncPhoto();
    window.addEventListener("profilePhotoUpdated", syncPhoto);
    return () => window.removeEventListener("profilePhotoUpdated", syncPhoto);
  }, [photoKey]);

  const set = k => e => setProfile(p => ({ ...p, [k]: e.target.value }));

  // ✅ Save photo under user-specific key + notify sidebar
  const handlePhoto = e => {
    const f = e.target.files[0];
    if (!f || f.size > 2 * 1024 * 1024) { alert("Max 2MB"); return; }
    const r = new FileReader();
    r.onloadend = () => {
      setPhoto(r.result);
      localStorage.setItem(photoKey, r.result);
      // Also keep the generic key updated for sidebar compatibility
      localStorage.setItem("profile_photo", r.result);
      window.dispatchEvent(new Event("profilePhotoUpdated"));
    };
    r.readAsDataURL(f);
  };

  // ✅ Remove photo from both keys + notify sidebar
  const removePhoto = () => {
    setPhoto(null);
    localStorage.removeItem(photoKey);
    localStorage.removeItem("profile_photo");
    window.dispatchEvent(new Event("profilePhotoUpdated"));
  };

  const save = () => {
    setSaving(true);
    localStorage.setItem("user", JSON.stringify({ ...stored, ...profile }));
    setTimeout(() => {
      setSaving(false);
      setSuccess("Saved!");
      setTimeout(() => setSuccess(""), 2500);
    }, 500);
  };

  const tabs = [
    { key: "profile",  label: "Profile",      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { key: "company",  label: "Company Info",  icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { key: "security", label: "Security",      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  ];

  const inputSt = (disabled = false) => ({
    width: "100%", padding: "11px 13px", borderRadius: 10, fontSize: 13,
    color: disabled ? T.muted : T.text,
    background: disabled ? "#F8FAFC" : "#FAFAFA",
    border: `1.5px solid ${T.border}`,
    outline: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box",
    cursor: disabled ? "not-allowed" : "text",
  });

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, fontFamily: "'DM Sans',sans-serif" }}>
      <link href={fonts} rel="stylesheet" />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "36px 28px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: T.muted, letterSpacing: 2.5, textTransform: "uppercase",
            fontWeight: 600, marginBottom: 6 }}>Configuration</p>
          <h1 style={{ fontSize: 26, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: T.text, margin: 0 }}>
            Account Settings
          </h1>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>Manage your profile and preferences</p>
        </div>

        {/* Success Banner */}
        {success && (
          <div style={{ background: "#D1FAE5", border: "1px solid #6EE7B7", borderRadius: 10,
            padding: "11px 15px", marginBottom: 20, color: T.success, fontWeight: 600, fontSize: 13,
            display: "flex", alignItems: "center", gap: 8 }}>
            <SVGIcon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color={T.success} size={15} />
            {success}
          </div>
        )}

        {/* Tab Bar */}
        <div style={{ display: "flex", gap: 4, background: T.card, borderRadius: 14, padding: 5,
          border: `1px solid ${T.border}`, marginBottom: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", transition: "all .15s",
              background: tab === t.key ? `linear-gradient(135deg,${T.accent},${T.accent2})` : "transparent",
              color: tab === t.key ? "#fff" : T.muted,
              boxShadow: tab === t.key ? `0 3px 10px ${T.accent}35` : "none",
            }}>
              <SVGIcon d={t.icon} color={tab === t.key ? "#fff" : T.muted} size={14} />
              {t.label}
            </button>
          ))}
        </div>

        <Card>
          <div style={{ padding: "28px 30px" }}>

            {/* ───── Profile Tab ───── */}
            {tab === "profile" && (
              <div>
                {/* Photo Section */}
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26,
                  paddingBottom: 22, borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    {photo ? (
                      <img src={photo} alt="Profile" style={{ width: 72, height: 72, borderRadius: 16,
                        objectFit: "cover", border: `2px solid ${T.accent}` }} />
                    ) : (
                      <div style={{ width: 72, height: 72, borderRadius: 16,
                        background: `linear-gradient(135deg,${T.accent},${T.accent2})`,
                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 26, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>
                        {profile.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                    <button onClick={() => fileRef.current.click()} style={{
                      position: "absolute", bottom: -4, right: -4, width: 24, height: 24, borderRadius: 8,
                      background: T.accent, border: "2px solid #fff", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <SVGIcon d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" color="#fff" size={11} />
                    </button>
                  </div>

                  <div>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'Syne',sans-serif" }}>
                      {profile.name}
                    </h2>
                    <p style={{ margin: "3px 0 5px", fontSize: 12, color: T.muted }}>{profile.email}</p>
                    <span style={{ padding: "2px 9px", background: `${T.accent}1A`, color: T.accent,
                      borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                      {profile.role}
                    </span>
                    <div style={{ display: "flex", gap: 8, marginTop: 9 }}>
                      <button onClick={() => fileRef.current.click()} style={{
                        fontSize: 11, padding: "5px 11px", borderRadius: 7,
                        background: `${T.accent}12`, color: T.accent, border: `1px solid ${T.accent}22`,
                        cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
                        Change Photo
                      </button>
                      {photo && (
                        <button onClick={removePhoto} style={{
                          fontSize: 11, padding: "5px 11px", borderRadius: 7,
                          background: "#FEF2F2", color: T.danger, border: "1px solid #FECACA",
                          cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
                </div>

                {/* Fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[["Full Name", "name"], ["Phone", "phone"]].map(([label, key]) => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 7 }}>{label}</label>
                      <input value={profile[key]} onChange={set(key)} style={inputSt()}
                        onFocus={e => e.target.style.border = `1.5px solid ${T.accent}`}
                        onBlur={e  => e.target.style.border = `1.5px solid ${T.border}`} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 7 }}>Email</label>
                    <input value={profile.email} disabled style={inputSt(true)} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 7 }}>Role</label>
                    <input value={profile.role} disabled style={{ ...inputSt(true), textTransform: "capitalize" }} />
                  </div>
                </div>
              </div>
            )}

            {/* ───── Company Tab ───── */}
            {tab === "company" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  ["Company Name",  "company", "Your company name",       "text"],
                  ["Contact Email", "email",   "contact@company.com",     "email"],
                  ["Website URL",   "website", "https://yourcompany.com", "url"],
                ].map(([label, key, ph, type]) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 7 }}>{label}</label>
                    <input type={type} value={profile[key]} onChange={set(key)} placeholder={ph} style={inputSt()}
                      onFocus={e => e.target.style.border = `1.5px solid ${T.accent}`}
                      onBlur={e  => e.target.style.border = `1.5px solid ${T.border}`} />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 7 }}>About Company</label>
                  <textarea value={profile.about} onChange={set("about")} rows={4}
                    placeholder="Tell freelancers about your company..."
                    style={{ ...inputSt(), resize: "vertical", minHeight: 90 }}
                    onFocus={e => e.target.style.border = `1.5px solid ${T.accent}`}
                    onBlur={e  => e.target.style.border = `1.5px solid ${T.border}`} />
                </div>
              </div>
            )}

            {/* ───── Security Tab ───── */}
            {tab === "security" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10,
                  padding: "12px 16px", color: "#92400E", fontSize: 13 }}>
                  🔒 Password change feature coming soon. Contact support if you need to reset your password.
                </div>
                {["Current Password", "New Password", "Confirm New Password"].map(l => (
                  <div key={l}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 7 }}>{l}</label>
                    <input type="password" placeholder="••••••••" disabled style={inputSt(true)} />
                  </div>
                ))}
              </div>
            )}

            {/* ───── Save Button ───── */}
            {tab !== "security" && (
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
                <button onClick={save} disabled={saving} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: saving ? T.muted : `linear-gradient(135deg,${T.accent},${T.accent2})`,
                  color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px",
                  fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans',sans-serif", boxShadow: `0 4px 12px ${T.accent}30` }}>
                  <SVGIcon d="M5 13l4 4L19 7" color="#fff" size={14} stroke={2.5} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

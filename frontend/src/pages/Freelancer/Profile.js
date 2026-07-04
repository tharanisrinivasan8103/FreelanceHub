import React, { useState, useRef } from "react";
import API from "../../api/api";

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(localStorage.getItem("profile_photo") || null);
  const [profile, setProfile] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
    role: storedUser.role || "",
    bio: storedUser.bio || "",
    skills: storedUser.skills || "",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Max photo size is 2MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setPhoto(reader.result); localStorage.setItem("profile_photo", reader.result); };
    reader.readAsDataURL(file);
  };

  const save = () => {
    setSaving(true);
    localStorage.setItem("user", JSON.stringify({ ...storedUser, ...profile }));
    setTimeout(() => {
      setSaving(false);
      setToast("Profile saved successfully!");
      setTimeout(() => setToast(""), 3000);
    }, 600);
  };

  const initials = profile.name?.charAt(0)?.toUpperCase() || "?";
  const skills = profile.skills ? profile.skills.split(",").map(s => s.trim()).filter(Boolean) : [];

  return (
    <div style={styles.page}>
      {/* Toast */}
      {toast && (
        <div style={styles.toast}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.overline}>ACCOUNT</p>
          <h1 style={styles.title}>My Profile</h1>
          <p style={styles.subtitle}>Manage your personal information and preferences</p>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Left: Avatar Card */}
        <div style={styles.avatarCard}>
          <div style={styles.avatarWrap}>
            {photo ? (
              <img src={photo} alt="Profile" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarFallback}>{initials}</div>
            )}
            <button onClick={() => fileRef.current.click()} style={styles.editAvatarBtn} title="Change photo">
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            </button>
          </div>
          <input type="file" ref={fileRef} onChange={handlePhoto} accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} />

          <h2 style={styles.avatarName}>{profile.name || "Your Name"}</h2>
          <p style={styles.avatarEmail}>{profile.email}</p>
          <span style={styles.roleBadge}>{profile.role || "Freelancer"}</span>

          {photo && (
            <button onClick={() => { setPhoto(null); localStorage.removeItem("profile_photo"); }} style={styles.removePhotoBtn}>
              Remove Photo
            </button>
          )}

          <p style={styles.photoNote}>JPG, PNG, WebP — Max 2MB</p>

          {/* Skills Preview */}
          {skills.length > 0 && (
            <div style={styles.skillsSection}>
              <p style={styles.skillsLabel}>Skills</p>
              <div style={styles.skillTags}>
                {skills.slice(0, 6).map((s, i) => (
                  <span key={i} style={styles.skillTag}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Form */}
        <div style={styles.formCard}>
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>
              <svg width="16" height="16" fill="none" stroke="#14b8a6" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Personal Information
            </h3>

            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>Full Name</label>
                <input name="name" value={profile.name} onChange={handleChange}
                  placeholder="Your full name" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Phone Number</label>
                <input name="phone" value={profile.phone} onChange={handleChange}
                  placeholder="+91 98765 43210" style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrap}>
                  <input value={profile.email} disabled style={styles.inputDisabled} />
                  <svg style={styles.lockIcon} width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
              </div>
              <div>
                <label style={styles.label}>Account Role</label>
                <div style={styles.inputWrap}>
                  <input value={profile.role} disabled style={{ ...styles.inputDisabled, textTransform: "capitalize" }} />
                  <svg style={styles.lockIcon} width="13" height="13" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>
              <svg width="16" height="16" fill="none" stroke="#14b8a6" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              Skills & Expertise
            </h3>
            <label style={styles.label}>Skills <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none" }}>(comma separated)</span></label>
            <input name="skills" value={profile.skills} onChange={handleChange}
              placeholder="React, Node.js, MySQL, Figma..." style={styles.input} />
          </div>

          <div style={styles.divider} />

          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>
              <svg width="16" height="16" fill="none" stroke="#14b8a6" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
              Bio
            </h3>
            <label style={styles.label}>About You</label>
            <textarea name="bio" value={profile.bio} onChange={handleChange} rows={4}
              placeholder="Describe your experience, expertise, and what makes you stand out to clients..."
              style={{ ...styles.input, resize: "none", lineHeight: 1.6 }} />
          </div>

          <div style={styles.formFooter}>
            <button onClick={save} disabled={saving} style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}>
              {saving ? (
                <>
                  <div style={styles.btnSpinner} />
                  Saving...
                </>
              ) : (
                <>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                  Save Profile
                </>
              )}
            </button>
            <p style={styles.saveNote}>Changes are saved locally</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#f8fafc", minHeight: "100vh", padding: "36px 40px", fontFamily: "'Inter', 'Segoe UI', sans-serif" },
  toast: { position: "fixed", top: 20, right: 20, background: "#065f46", color: "white", padding: "12px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 100 },
  header: { marginBottom: 28 },
  overline: { fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 6px" },
  title: { fontSize: 26, fontWeight: 700, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.5px" },
  subtitle: { fontSize: 14, color: "#64748b", margin: 0 },
  layout: { display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "start" },
  avatarCard: { background: "white", border: "1px solid #e2e8f0", borderRadius: 14, padding: "28px 20px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", position: "sticky", top: 20 },
  avatarWrap: { position: "relative", display: "inline-block", marginBottom: 14 },
  avatarImg: { width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #14b8a6", display: "block" },
  avatarFallback: { width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#0f766e,#0891b2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "white", border: "3px solid #14b8a6" },
  editAvatarBtn: { position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "#0f766e", border: "2px solid white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  avatarName: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 3px" },
  avatarEmail: { fontSize: 12, color: "#94a3b8", margin: "0 0 10px" },
  roleBadge: { display: "inline-block", background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4", borderRadius: 20, fontSize: 11, fontWeight: 700, padding: "3px 12px", textTransform: "capitalize" },
  removePhotoBtn: { display: "block", margin: "12px auto 0", padding: "6px 14px", borderRadius: 7, border: "1px solid #fca5a5", background: "#fff1f2", color: "#dc2626", fontSize: 11, fontWeight: 600, cursor: "pointer" },
  photoNote: { fontSize: 10, color: "#cbd5e1", marginTop: 6 },
  skillsSection: { marginTop: 20, borderTop: "1px solid #f1f5f9", paddingTop: 16, textAlign: "left" },
  skillsLabel: { fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 8px" },
  skillTags: { display: "flex", flexWrap: "wrap", gap: 5 },
  skillTag: { background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4", borderRadius: 5, padding: "3px 8px", fontSize: 10, fontWeight: 600 },
  formCard: { background: "white", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  formSection: { padding: "24px 28px" },
  sectionTitle: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 18px" },
  divider: { height: 1, background: "#f1f5f9", margin: "0 28px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" },
  label: { fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.7px" },
  input: { width: "100%", padding: "10px 13px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", background: "white", color: "#0f172a", boxSizing: "border-box", fontFamily: "inherit" },
  inputWrap: { position: "relative" },
  inputDisabled: { width: "100%", padding: "10px 36px 10px 13px", border: "1.5px solid #f1f5f9", borderRadius: 8, fontSize: 13, outline: "none", background: "#f8fafc", color: "#94a3b8", boxSizing: "border-box" },
  lockIcon: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" },
  formFooter: { padding: "20px 28px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 16 },
  saveBtn: { display: "flex", alignItems: "center", gap: 7, padding: "11px 24px", borderRadius: 9, border: "none", background: "#0f766e", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  btnSpinner: { width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white" },
  saveNote: { fontSize: 11, color: "#94a3b8", margin: 0 },
};

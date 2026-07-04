// Design tokens — sidebar-matching teal dark theme
export const T = {
  accent:  "#14B8A6",
  accent2: "#0F766E",
  text:    "#1E293B",
  muted:   "#64748B",
  border:  "#E2E8F0",
  card:    "#FFFFFF",
  pageBg:  "#F1F5F9",
  success: "#10B981",
  warn:    "#F59E0B",
  danger:  "#EF4444",
  indigo:  "#6366F1",
};

// ✅ Changed: Inter (clean professional) + normal weight headings
export const fonts = `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap`;

export const Spinner = () => (
  <>
    <style>{`@keyframes _spin{to{transform:rotate(360deg)}}`}</style>
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:60, gap:14 }}>
      <div style={{ width:32, height:32, border:`3px solid ${T.border}`,
        borderTopColor:T.accent, borderRadius:"50%", animation:"_spin .8s linear infinite" }}/>
      <span style={{ fontSize:13, color:T.muted, fontFamily:"'Inter',sans-serif" }}>Loading...</span>
    </div>
  </>
);

export const PageHeader = ({ eyebrow, title, subtitle, action }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32 }}>
    <div>
      {eyebrow && (
        <p style={{ fontSize:11, color:T.muted, letterSpacing:1.8, textTransform:"uppercase",
          fontWeight:600, marginBottom:6, fontFamily:"'Inter',sans-serif" }}>{eyebrow}</p>
      )}
      {/* ✅ Changed: Plus Jakarta Sans 700 instead of Syne 800 — less aggressive */}
      <h1 style={{ fontSize:26, fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700,
        color:T.text, margin:0, letterSpacing:-0.3 }}>{title}</h1>
      {subtitle && (
        <p style={{ color:T.muted, fontSize:13, marginTop:5,
          fontFamily:"'Inter',sans-serif", fontWeight:400 }}>{subtitle}</p>
      )}
    </div>
    {action}
  </div>
);

export const PrimaryBtn = ({ onClick, children, disabled, small }) => (
  <button onClick={onClick} disabled={disabled} style={{
    display:"flex", alignItems:"center", justifyContent:"center", gap:7,
    background: disabled ? T.muted : `linear-gradient(135deg,${T.accent},${T.accent2})`,
    color:"#fff", border:"none", borderRadius:10, cursor: disabled ? "not-allowed" : "pointer",
    padding: small ? "8px 14px" : "10px 18px",
    fontSize: small ? 12 : 13,
    fontWeight:600,
    boxShadow: disabled ? "none" : `0 3px 12px ${T.accent}35`,
    fontFamily:"'Inter',sans-serif", transition:"opacity .15s",
  }}>{children}</button>
);

export const GhostBtn = ({ onClick, children, small }) => (
  <button onClick={onClick} style={{
    display:"flex", alignItems:"center", gap:6, background:`${T.accent}10`,
    color:T.accent, border:`1px solid ${T.accent}22`, borderRadius:8,
    padding: small ? "6px 12px" : "8px 14px",
    fontSize: small ? 11 : 12,
    fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif",
  }}>{children}</button>
);

export const Badge = ({ status }) => {
  const map = {
    open:         { bg:"#D1FAE5", color:"#059669" },
    pending:      { bg:"#FEF3C7", color:"#D97706" },
    accepted:     { bg:"#D1FAE5", color:"#059669" },
    rejected:     { bg:"#FEE2E2", color:"#DC2626" },
    closed:       { bg:"#FEE2E2", color:"#DC2626" },
    approved:     { bg:"#D1FAE5", color:"#059669" },
    revision:     { bg:"#FEF3C7", color:"#D97706" },
    submitted:    { bg:"#DBEAFE", color:"#2563EB" },
    "in-progress":{ bg:"#FEF3C7", color:"#D97706" },
    completed:    { bg:"#DBEAFE", color:"#2563EB" },
  };
  const s = map[status] || map["open"];
  return (
    <span style={{
      padding:"2px 9px", borderRadius:20, fontSize:10, fontWeight:600,
      letterSpacing:.3, background:s.bg, color:s.color,
      fontFamily:"'Inter',sans-serif", textTransform:"uppercase",
    }}>
      {status || "OPEN"}
    </span>
  );
};

export const SVGIcon = ({ d, size=18, color, stroke=1.8 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24"
    stroke={color || T.accent} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

export const Card = ({ children, style={} }) => (
  <div style={{
    background:T.card, borderRadius:16, border:`1px solid ${T.border}`,
    boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden", ...style,
  }}>
    {children}
  </div>
);

// ✅ Input with Inter font
export const Input = ({ label, required, ...props }) => (
  <div>
    {label && (
      <label style={{ display:"block", fontSize:12, fontWeight:600, color:T.text,
        marginBottom:7, fontFamily:"'Inter',sans-serif" }}>
        {label}{required && <span style={{ color:T.danger }}> *</span>}
      </label>
    )}
    <input {...props} style={{
      width:"100%", padding:"10px 13px", borderRadius:9,
      border:`1.5px solid ${T.border}`, fontSize:13, color:T.text, background:"#FAFAFA",
      outline:"none", fontFamily:"'Inter',sans-serif", boxSizing:"border-box",
      transition:"border .15s", fontWeight:400, ...props.style,
    }}
      onFocus={e => e.target.style.border=`1.5px solid ${T.accent}`}
      onBlur={e  => e.target.style.border=`1.5px solid ${T.border}`}
    />
  </div>
);

export const Textarea = ({ label, required, ...props }) => (
  <div>
    {label && (
      <label style={{ display:"block", fontSize:12, fontWeight:600, color:T.text,
        marginBottom:7, fontFamily:"'Inter',sans-serif" }}>
        {label}{required && <span style={{ color:T.danger }}> *</span>}
      </label>
    )}
    <textarea {...props} style={{
      width:"100%", padding:"10px 13px", borderRadius:9,
      border:`1.5px solid ${T.border}`, fontSize:13, color:T.text, background:"#FAFAFA",
      outline:"none", fontFamily:"'Inter',sans-serif", boxSizing:"border-box",
      resize:"vertical", fontWeight:400, ...props.style,
    }}
      onFocus={e => e.target.style.border=`1.5px solid ${T.accent}`}
      onBlur={e  => e.target.style.border=`1.5px solid ${T.border}`}
    />
  </div>
);

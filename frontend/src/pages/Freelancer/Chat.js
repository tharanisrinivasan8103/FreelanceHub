import React, { useEffect, useState, useRef } from "react";
import API from "../../api/api";

export default function Chat() {
  const me = JSON.parse(localStorage.getItem("user") || "{}");
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    API.get("/messages/contacts").then((r) => setContacts(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) return;
    API.get(`/messages/conversation/${selected.id}`).then((r) => setMessages(r.data || [])).catch(() => {});
  }, [selected]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!text.trim() || !selected) return;
    setSending(true);
    try {
      await API.post("/messages", { receiver_id: selected.id, content: text });
      const r = await API.get(`/messages/conversation/${selected.id}`);
      setMessages(r.data || []);
      setText("");
    } catch {}
    setSending(false);
  };

  const fmtTime = (d) => d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "";
  const initials = (name) => name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  const avatarColors = ["#0d9488", "#0284c7", "#7c3aed", "#db2777", "#d97706", "#16a34a"];
  const getColor = (id) => avatarColors[id % avatarColors.length];

  // Group messages by date
  const groupedMessages = messages.reduce((acc, m) => {
    const date = fmtDate(m.created_at);
    if (!acc[date]) acc[date] = [];
    acc[date].push(m);
    return acc;
  }, {});

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.sidebarTitle}>
            <svg width="18" height="18" fill="none" stroke="#14b8a6" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            Messages
          </div>
          <span style={styles.contactCount}>{contacts.length}</span>
        </div>

        <div style={styles.contactList}>
          {contacts.length === 0 ? (
            <div style={styles.emptyContacts}>
              <svg width="32" height="32" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <p>No conversations yet</p>
            </div>
          ) : contacts.map((c, i) => (
            <div key={c.id} onClick={() => setSelected(c)}
              style={{ ...styles.contactItem, ...(selected?.id === c.id ? styles.contactActive : {}) }}>
              <div style={{ ...styles.avatar, background: getColor(i) }}>{initials(c.name)}</div>
              <div style={styles.contactInfo}>
                <p style={styles.contactName}>{c.name}</p>
                <p style={styles.contactPreview}>{c.last_message || "Start a conversation"}</p>
              </div>
              {selected?.id === c.id && <div style={styles.activeDot} />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div style={styles.main}>
        {!selected ? (
          <div style={styles.emptyMain}>
            <div style={styles.emptyMainIcon}>
              <svg width="36" height="36" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </div>
            <h3 style={{ color: "#475569", fontWeight: 600, fontSize: 15, margin: "12px 0 4px" }}>No conversation selected</h3>
            <p style={{ color: "#94a3b8", fontSize: 13 }}>Choose a contact from the sidebar to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={styles.chatHeader}>
              <div style={{ ...styles.avatar, background: getColor(contacts.indexOf(selected)), width: 40, height: 40, fontSize: 14 }}>
                {initials(selected.name)}
              </div>
              <div>
                <p style={styles.chatName}>{selected.name}</p>
                <p style={styles.chatRole}>{selected.role}</p>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button style={styles.headerBtn} title="View profile">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={styles.messageArea}>
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div style={styles.dateDivider}>
                    <span style={styles.datePill}>{date}</span>
                  </div>
                  {msgs.map((m, i) => {
                    const mine = m.sender_id === me.id;
                    return (
                      <div key={i} style={{ ...styles.msgRow, justifyContent: mine ? "flex-end" : "flex-start" }}>
                        {!mine && (
                          <div style={{ ...styles.msgAvatar, background: getColor(contacts.indexOf(selected)) }}>
                            {initials(selected.name)}
                          </div>
                        )}
                        <div style={{ ...styles.bubble, ...(mine ? styles.bubbleMine : styles.bubbleTheirs) }}>
                          <p style={{ ...styles.bubbleText, color: mine ? "white" : "#0f172a" }}>{m.content}</p>
                          <p style={{ ...styles.bubbleTime, color: mine ? "rgba(255,255,255,0.65)" : "#94a3b8", textAlign: mine ? "right" : "left" }}>
                            {fmtTime(m.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={styles.inputArea}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder={`Message ${selected.name}...`}
                style={styles.msgInput}
              />
              <button onClick={send} disabled={sending || !text.trim()} style={{ ...styles.sendBtn, opacity: sending || !text.trim() ? 0.5 : 1 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: { display: "flex", height: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#f8fafc", overflow: "hidden" },
  sidebar: { width: 280, background: "white", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 },
  sidebarHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px", borderBottom: "1px solid #f1f5f9" },
  sidebarTitle: { display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700, color: "#0f172a" },
  contactCount: { background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 },
  contactList: { flex: 1, overflowY: "auto" },
  emptyContacts: { padding: "40px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#94a3b8", fontSize: 12 },
  contactItem: { display: "flex", alignItems: "center", gap: 11, padding: "13px 18px", cursor: "pointer", borderBottom: "1px solid #f8fafc", transition: "background 0.15s", position: "relative" },
  contactActive: { background: "#f0fdfa", borderLeft: "3px solid #14b8a6" },
  avatar: { width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 },
  contactInfo: { flex: 1, overflow: "hidden" },
  contactName: { fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 2px" },
  contactPreview: { fontSize: 11, color: "#94a3b8", margin: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: 160 },
  activeDot: { width: 7, height: 7, borderRadius: "50%", background: "#14b8a6", flexShrink: 0 },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  emptyMain: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  emptyMainIcon: { width: 72, height: 72, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" },
  chatHeader: { display: "flex", alignItems: "center", gap: 12, padding: "14px 22px", borderBottom: "1px solid #e2e8f0", background: "white" },
  chatName: { fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 1px" },
  chatRole: { fontSize: 11, color: "#64748b", margin: 0, textTransform: "capitalize" },
  headerBtn: { width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" },
  messageArea: { flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 2, background: "#f8fafc" },
  dateDivider: { display: "flex", alignItems: "center", justifyContent: "center", margin: "16px 0 10px" },
  datePill: { background: "white", border: "1px solid #e2e8f0", color: "#94a3b8", fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20 },
  msgRow: { display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 8 },
  msgAvatar: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", flexShrink: 0 },
  bubble: { maxWidth: "60%", padding: "10px 14px" },
  bubbleMine: { background: "#0f766e", borderTopLeftRadius: 14, borderTopRightRadius: 14, borderBottomLeftRadius: 14, borderBottomRightRadius: 4 },
  bubbleTheirs: { background: "white", border: "1px solid #e2e8f0", borderTopLeftRadius: 14, borderTopRightRadius: 14, borderBottomLeftRadius: 4, borderBottomRightRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  bubbleText: { fontSize: 13, margin: "0 0 4px", lineHeight: 1.5 },
  bubbleTime: { fontSize: 10, margin: 0 },
  inputArea: { padding: "14px 22px", borderTop: "1px solid #e2e8f0", background: "white", display: "flex", gap: 10, alignItems: "center" },
  msgInput: { flex: 1, padding: "11px 16px", border: "1.5px solid #e2e8f0", borderRadius: 24, fontSize: 13, outline: "none", color: "#0f172a", background: "#f8fafc", fontFamily: "inherit" },
  sendBtn: { width: 42, height: 42, borderRadius: "50%", border: "none", background: "#0f766e", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "opacity 0.15s" },
};

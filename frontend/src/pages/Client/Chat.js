import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import API from "../../api/api";

const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();

  const [contacts, setContacts]     = useState([]);
  const [selected, setSelected]     = useState(null);
  const [messages, setMessages]     = useState([]);
  const [newMsg, setNewMsg]         = useState("");
  const [sending, setSending]       = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const bottomRef = useRef(null);

  // ✅ Fetch contacts on load
  useEffect(() => {
    fetchContacts();
  }, []);

  // ✅ Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Auto-select contact if navigated from Freelancers page
  useEffect(() => {
    if (contacts.length > 0 && !selected) {
      // Most recent contact auto-select பண்ணு
      setSelected(contacts[0]);
    }
  }, [contacts]);

  // ✅ Fetch conversation when contact selected
  useEffect(() => {
    if (selected) fetchConversation(selected.id);
  }, [selected]);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const res = await API.get("/messages/contacts");
      setContacts(res.data || []);
    } catch (err) {
      console.error("Contacts fetch error:", err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchConversation = async (userId) => {
    setLoadingMsg(true);
    try {
      const res = await API.get(`/messages/conversation/${userId}`);
      setMessages(res.data || []);
      // Mark as read
      setContacts(prev =>
        prev.map(c => c.id === userId ? { ...c, unread: 0 } : c)
      );
    } catch (err) {
      console.error("Conversation fetch error:", err);
    } finally {
      setLoadingMsg(false);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !selected) return;
    setSending(true);
    try {
      await API.post("/messages", {
        receiver_id: selected.id,
        content: newMsg
      });
      // Optimistically add message
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender_id: user.id,
        receiver_id: selected.id,
        content: newMsg,
        sender_name: user.name,
        created_at: new Date().toISOString()
      }]);
      setNewMsg("");
      // Update last message in contacts
      setContacts(prev =>
        prev.map(c => c.id === selected.id ? { ...c, last_message: newMsg } : c)
      );
    } catch (err) {
      alert("Error sending message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>

        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-200 flex"
          style={{ height: "600px" }}
        >
          {/* ========================
              LEFT — Contacts List
          ======================== */}
          <div className="w-64 border-r flex-shrink-0 flex flex-col">
            <div className="p-4 border-b">
              <p className="font-semibold text-gray-700 text-sm">Conversations</p>
            </div>

            <div className="overflow-y-auto flex-1">
              {loadingContacts ? (
                <div className="text-center p-6">
                  <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center p-6">
                  <p className="text-gray-400 text-sm">No conversations yet</p>
                  <p className="text-gray-300 text-xs mt-1">
                    Go to Freelancers page to start a chat
                  </p>
                </div>
              ) : (
                contacts.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition border-b border-gray-50 ${
                      selected?.id === c.id
                        ? "bg-teal-50 border-l-2 border-l-teal-500"
                        : ""
                    }`}
                  >
                    <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {c.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {c.name}
                        </p>
                        {c.unread > 0 && (
                          <span className="bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs truncate">
                        {c.last_message || "..."}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ========================
              RIGHT — Chat Window
          ======================== */}
          <div className="flex-1 flex flex-col">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-5xl mb-3">💬</div>
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3 bg-gray-50">
                  <div className="w-9 h-9 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">
                    {selected.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{selected.name}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {selected.role}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMsg ? (
                    <div className="text-center py-10">
                      <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm mt-10">
                      No messages yet. Say hi! 👋
                    </p>
                  ) : (
                    messages.map(m => {
                      const isMe = m.sender_id === user.id;
                      return (
                        <div
                          key={m.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl text-sm ${
                              isMe
                                ? "bg-teal-600 text-white rounded-tr-none"
                                : "bg-gray-100 text-gray-800 rounded-tl-none"
                            }`}
                          >
                            <p>{m.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isMe ? "text-teal-200" : "text-gray-400"
                              }`}
                            >
                              {formatTime(m.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t flex gap-3">
                  <input
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMsg.trim()}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-full text-sm font-medium disabled:opacity-50 transition"
                  >
                    {sending ? "..." : "Send"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

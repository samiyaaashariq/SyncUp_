import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

export default function ChatBox({ projectId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  // 🔥 REAL-TIME MESSAGES
  useEffect(() => {
    if (!projectId) return;

    const q = query(
      collection(db, "projects", projectId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return () => unsub();
  }, [projectId]);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 TYPING INDICATOR (local simulation)
  useEffect(() => {
    if (!input) {
      setTyping(false);
      return;
    }

    setTyping(true);

    const t = setTimeout(() => setTyping(false), 800);
    return () => clearTimeout(t);
  }, [input]);

  // 🚀 SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim() || !projectId) return;

    try {
      await addDoc(
        collection(db, "projects", projectId, "messages"),
        {
          text: input.trim(),
          user: auth.currentUser?.email || "anonymous",
          createdAt: serverTimestamp()
        }
      );

      setInput("");
    } catch (err) {
      console.log("Send error:", err);
    }
  };

  // 👤 GET INITIALS
  const getInitials = (email) => {
    if (!email) return "?";
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h3>💬 SyncUp Chat Pro</h3>
        <p style={styles.sub}>
          {projectId ? "Live Collaboration Space" : "Select a project to start"}
        </p>
      </div>

      {/* CHAT AREA */}
      <div style={styles.chatArea}>
        {!projectId ? (
          <div style={styles.empty}>👈 Select a project to begin chatting</div>
        ) : messages.length === 0 ? (
          <div style={styles.empty}>No messages yet — start conversation 🚀</div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.user === auth.currentUser?.email;
            const showTime = msg.createdAt?.seconds;

            return (
              <div
                key={msg.id}
                style={{
                  ...styles.msgRow,
                  justifyContent: isMe ? "flex-end" : "flex-start"
                }}
              >
                {/* Avatar */}
                {!isMe && (
                  <div style={styles.avatar}>
                    {getInitials(msg.user)}
                  </div>
                )}

                {/* Message */}
                <div
                  style={{
                    ...styles.msg,
                    background: isMe
                      ? "linear-gradient(135deg,#22c55e,#16a34a)"
                      : "#2a2a2a"
                  }}
                >
                  <div style={styles.user}>
                    {isMe ? "You" : msg.user}
                  </div>

                  <div>{msg.text}</div>

                  {showTime && (
                    <div style={styles.time}>
                      {new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* TYPING INDICATOR */}
        {typing && projectId && (
          <div style={styles.typing}>Typing...</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a message..."
          style={styles.input}
          disabled={!projectId}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          disabled={!projectId}
          style={{
            ...styles.button,
            opacity: projectId ? 1 : 0.5
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    borderRadius: "14px",
    overflow: "hidden",
    border: "1px solid #222",
    display: "flex",
    flexDirection: "column",
    height: "420px",
    background: "#0b0b0b",
    color: "#fff"
  },

  header: {
    padding: "12px",
    background: "#111",
    borderBottom: "1px solid #222"
  },

  sub: {
    fontSize: "12px",
    color: "#888"
  },

  chatArea: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  msgRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px"
  },

  msg: {
    padding: "8px 10px",
    borderRadius: "10px",
    maxWidth: "70%",
    fontSize: "14px"
  },

  user: {
    fontSize: "10px",
    opacity: 0.6,
    marginBottom: "2px"
  },

  time: {
    fontSize: "9px",
    opacity: 0.5,
    marginTop: "4px"
  },

  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px"
  },

  empty: {
    color: "#777",
    textAlign: "center",
    marginTop: "20px"
  },

  typing: {
    fontSize: "12px",
    color: "#888",
    marginLeft: "10px"
  },

  inputBox: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #222",
    background: "#111"
  },

  input: {
    flex: 1,
    padding: "9px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#000",
    color: "#fff"
  },

  button: {
    marginLeft: "10px",
    padding: "9px 14px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg,#6366f1,#3b82f6)",
    color: "#fff",
    cursor: "pointer"
  }
};

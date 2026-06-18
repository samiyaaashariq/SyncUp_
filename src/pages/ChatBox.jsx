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

export default function ChatBox({ projects = [], projectId }) {
  const [activeProject, setActiveProject] = useState(projectId || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // 🔥 REAL-TIME CHAT
  useEffect(() => {
    if (!activeProject) return;

    const q = query(
      collection(db, "projects", activeProject, "messages"),
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
  }, [activeProject]);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🚀 SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim() || !activeProject) return;

    await addDoc(
      collection(db, "projects", activeProject, "messages"),
      {
        text: input,
        user: auth.currentUser?.email || "anonymous",
        createdAt: serverTimestamp()
      }
    );

    setInput("");
  };

  return (
    <div style={styles.wrapper}>
      {/* LEFT SIDEBAR */}
      <div style={styles.sidebar}>
        <h3 style={styles.brand}>SyncUp Chat</h3>

        <div style={styles.projectList}>
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => setActiveProject(p.id)}
              style={{
                ...styles.projectItem,
                background:
                  activeProject === p.id ? "#2563eb" : "transparent",
                color: activeProject === p.id ? "#fff" : "#333"
              }}
            >
              {p.title}
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div style={styles.chatArea}>
        {/* HEADER */}
        <div style={styles.header}>
          <h3>SyncUp Chat</h3>
          <p style={styles.sub}>
            {activeProject
              ? "Live collaboration space"
              : "Select a project from left"}
          </p>
        </div>

        {/* MESSAGES */}
        <div style={styles.messages}>
          {!activeProject ? (
            <div style={styles.empty}>
              👈 Select a project to start chatting
            </div>
          ) : messages.length === 0 ? (
            <div style={styles.empty}>
              No messages yet — start conversation 🚀
            </div>
          ) : (
            messages.map((msg) => {
              const isMe =
                msg.user === auth.currentUser?.email;

              return (
                <div
                  key={msg.id}
                  style={{
                    ...styles.msg,
                    alignSelf: isMe
                      ? "flex-end"
                      : "flex-start",
                    background: isMe
                      ? "#2563eb"
                      : "#f1f5f9",
                    color: isMe ? "#fff" : "#111"
                  }}
                >
                  <div style={styles.user}>
                    {isMe ? "You" : msg.user}
                  </div>
                  <div>{msg.text}</div>
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={styles.inputBox}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeProject
                ? "Write a message..."
                : "Select a project first"
            }
            style={styles.input}
            disabled={!activeProject}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
          />

          <button
            onClick={sendMessage}
            disabled={!activeProject}
            style={{
              ...styles.button,
              opacity: activeProject ? 1 : 0.5
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🎨 STARTUP STYLE UI */
const styles = {
  wrapper: {
    display: "flex",
    height: "420px",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    fontFamily: "Arial"
  },

  sidebar: {
    width: "220px",
    background: "#f8fafc",
    borderRight: "1px solid #e5e7eb",
    padding: "10px"
  },

  brand: {
    marginBottom: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#111"
  },

  projectList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },

  projectItem: {
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px"
  },

  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#fff"
  },

  header: {
    padding: "10px",
    borderBottom: "1px solid #e5e7eb"
  },

  sub: {
    fontSize: "12px",
    color: "#666"
  },

  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

  msg: {
    padding: "8px 10px",
    borderRadius: "10px",
    maxWidth: "60%",
    fontSize: "14px"
  },

  user: {
    fontSize: "10px",
    opacity: 0.6,
    marginBottom: "3px"
  },

  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: "30px"
  },

  inputBox: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #e5e7eb"
  },

  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  button: {
    marginLeft: "10px",
    padding: "8px 14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px"
  }
};

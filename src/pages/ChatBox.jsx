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
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!projectId) return;

    const q = query(
      collection(db, "projects", projectId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return () => unsubscribe();
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !projectId) return;

    await addDoc(
      collection(db, "projects", projectId, "messages"),
      {
        text: input,
        user: auth.currentUser?.email || "anonymous",
        createdAt: serverTimestamp()
      }
    );

    setInput("");
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h3>💬 SyncUp Chat</h3>
        <p style={styles.sub}>
          {projectId ? "Live Project Chat Active" : "Select a project to start chatting"}
        </p>
      </div>

      {/* CHAT AREA */}
      <div style={styles.chatArea}>
        {!projectId ? (
          <div style={styles.empty}>
            👈 Click “Open Chat” on any project
          </div>
        ) : messages.length === 0 ? (
          <div style={styles.empty}>No messages yet 🚀</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user === auth.currentUser?.email;

            return (
              <div
                key={msg.id}
                style={{
                  ...styles.msg,
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  background: isMe
                    ? "linear-gradient(135deg,#4ade80,#22c55e)"
                    : "#2a2a2a",
                  color: "#fff"
                }}
              >
                <div style={styles.user}>{msg.user}</div>
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
          placeholder="Type message..."
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

const styles = {
  container: {
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #333",
    display: "flex",
    flexDirection: "column",
    height: "380px",
    background: "#0f0f0f",
    color: "#fff",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)"
  },

  header: {
    padding: "12px",
    background: "#111",
    borderBottom: "1px solid #222"
  },

  sub: {
    fontSize: "12px",
    color: "#aaa"
  },

  chatArea: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    background: "#0f0f0f"
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

  empty: {
    color: "#777",
    textAlign: "center",
    marginTop: "20px"
  },

  inputBox: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #222",
    background: "#111"
  },

  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #333",
    background: "#000",
    color: "#fff"
  },

  button: {
    marginLeft: "10px",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
    color: "#fff",
    cursor: "pointer"
  }
};

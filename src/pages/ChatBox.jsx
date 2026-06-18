import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

export default function ChatBox({ project }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // REALTIME CHAT
  useEffect(() => {
    if (!project?.id) return;

    const q = query(
      collection(db, "projects", project.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      );
    });

    return () => unsub();
  }, [project]);

  // SEND
  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(
      collection(db, "projects", project.id, "messages"),
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
      
      {/* 🔥 CHAT HEADER (FIXED COLOR) */}
      <div style={styles.header}>
        💬 <span style={styles.title}>
          SyncUp Chat
        </span>
        <div style={styles.subtitle}>
          {project.title}
        </div>
      </div>

      {/* MESSAGES */}
      <div style={styles.chat}>
        {messages.map((m) => {
          const me =
            m.user === auth.currentUser?.email;

          return (
            <div
              key={m.id}
              style={{
                textAlign: me ? "right" : "left",
                margin: "6px"
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 10px",
                  borderRadius: "10px",
                  background: me ? "#4f46e5" : "#f1f5f9",
                  color: me ? "#fff" : "#111"
                }}
              >
                <small>{m.user}</small>
                <div>{m.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          style={styles.input}
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
        />

        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    height: "420px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },

  header: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    background: "#f8fafc"
  },

  title: {
    color: "#4f46e5",
    fontWeight: "bold",
    fontSize: "16px"
  },

  subtitle: {
    fontSize: "12px",
    color: "#666"
  },

  chat: {
    flex: 1,
    padding: "10px",
    overflowY: "auto"
  },

  inputBox: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd"
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
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px"
  }
};

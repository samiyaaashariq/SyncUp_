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

  // REAL-TIME MESSAGES
  useEffect(() => {
    if (!projectId) return;

    const q = query(
      collection(db, "projects", projectId, "messages"),
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
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE
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
      <div style={styles.header}>
        <h3>SyncUp Chat</h3>
      </div>

      <div style={styles.chat}>
        {messages.map((msg) => {
          const isMe =
            msg.user === auth.currentUser?.email;

          return (
            <div
              key={msg.id}
              style={{
                ...styles.msg,
                alignSelf: isMe ? "flex-end" : "flex-start",
                background: isMe ? "#4f46e5" : "#f1f5f9",
                color: isMe ? "#fff" : "#111"
              }}
            >
              <div style={styles.user}>{msg.user}</div>
              <div>{msg.text}</div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write message..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
    height: "400px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },

  header: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    background: "#f8fafc"
  },

  chat: {
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
    maxWidth: "65%"
  },

  user: {
    fontSize: "10px",
    opacity: 0.6,
    marginBottom: "3px"
  },

  inputBox: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd"
  },

  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px"
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

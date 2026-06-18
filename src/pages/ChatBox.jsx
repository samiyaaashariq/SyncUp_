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

export default function ChatBox({ projectId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 🔥 REAL-TIME LISTENER
  useEffect(() => {
    if (!projectId) return;

    const q = query(
      collection(db, "projects", projectId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setMessages(data);
    });

    return () => unsubscribe();
  }, [projectId]);

  // 🚀 SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      await addDoc(
        collection(db, "projects", projectId, "messages"),
        {
          text: input,
          user: auth.currentUser?.email || "anonymous",
          createdAt: serverTimestamp()
        }
      );

      setInput("");
    } catch (err) {
      console.log("Message send error:", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>SyncUp Chat 💬</h3>
      </div>

      <div style={styles.chatArea}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.msg,
              alignSelf:
                msg.user === auth.currentUser?.email
                  ? "flex-end"
                  : "flex-start",
              backgroundColor:
                msg.user === auth.currentUser?.email
                  ? "#dcf8c6"
                  : "#eee"
            }}
          >
            <small style={{ fontSize: "10px", opacity: 0.6 }}>
              {msg.user}
            </small>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          style={styles.input}
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
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    height: "300px"
  },

  header: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    background: "#f5f5f5"
  },

  chatArea: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },

  msg: {
    padding: "8px",
    borderRadius: "8px",
    maxWidth: "70%"
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
    borderRadius: "5px"
  },

  button: {
    marginLeft: "10px",
    padding: "8px 12px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px"
  }
};

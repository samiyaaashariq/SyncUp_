import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default function ProjectChat() {
  const { id: projectId } = useParams();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // AUTH
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  // REALTIME MESSAGES
  useEffect(() => {
    if (!projectId) return;

    const q = query(
      collection(db, "chats", projectId, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [projectId]);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!text.trim() || !user) return;

    await addDoc(collection(db, "chats", projectId, "messages"), {
      text,
      sender: user.email,
      createdAt: new Date(),
    });

    setText("");
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>👥 Project Chat Room</h2>

      <div style={styles.chatBox}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.msg,
              alignSelf:
                msg.sender === user?.email ? "flex-end" : "flex-start",
              background:
                msg.sender === user?.email ? "#22d3ee" : "#111827",
              color: msg.sender === user?.email ? "#000" : "#fff",
            }}
          >
            <p style={{ fontSize: "12px", opacity: 0.7 }}>
              {msg.sender}
            </p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div style={styles.inputBox}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          style={styles.input}
        />

        <button onClick={sendMessage} style={styles.btn}>
          Send
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: "20px",
    minHeight: "100vh",
    background: "#0b1120",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },

  title: {
    color: "#22d3ee",
    marginBottom: "15px",
  },

  chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
    border: "1px solid #22d3ee",
    borderRadius: "12px",
    overflowY: "auto",
    marginBottom: "10px",
  },

  msg: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "60%",
  },

  inputBox: {
    display: "flex",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #22d3ee",
  },

  btn: {
    padding: "10px",
    background: "#22d3ee",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
  },
};

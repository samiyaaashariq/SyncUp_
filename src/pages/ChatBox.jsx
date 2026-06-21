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

export default function ChatBox() {
  const { projectId } = useParams();
  const user = auth.currentUser;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // REALTIME MESSAGES
  useEffect(() => {
    const q = query(
      collection(db, "projects", projectId, "messages"),
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
    if (!text.trim()) return;

    await addDoc(collection(db, "projects", projectId, "messages"), {
      text,
      user: user?.email,
      createdAt: new Date(),
    });

    setText("");
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>💬 Project Chat Room</h2>
      <p style={styles.sub}>Project ID: {projectId}</p>

      <div style={styles.chatBox}>
        {messages.map((m) => (
          <div key={m.id} style={styles.msg}>
            <b>{m.user}:</b> {m.text}
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

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Inter, sans-serif",
    background: "linear-gradient(135deg, #ffe4ec, #fff)",
    minHeight: "100vh",
  },

  title: {
    fontWeight: "900",
    color: "#0f172a",
  },

  sub: {
    color: "#475569",
    marginBottom: "10px",
  },

  chatBox: {
    background: "white",
    padding: "15px",
    borderRadius: "12px",
    height: "400px",
    overflowY: "auto",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },

  msg: {
    marginBottom: "10px",
    color: "#0f172a",
  },

  inputBox: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  btn: {
    padding: "10px 14px",
    background: "#0ea5e9",
    color: "white",
    border: "none",
    borderRadius: "8px",
  },
};

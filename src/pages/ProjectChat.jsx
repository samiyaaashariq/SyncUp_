import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function ProjectChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user || !id) {
      navigate("/dashboard");
      return;
    }

    const q = query(
      collection(db, "projects", id, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, user, navigate]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    await addDoc(collection(db, "projects", id, "messages"), {
      text: input.trim(),
      sender: user.email,
      createdAt: serverTimestamp(),
      reactions: {},
    });

    setInput("");
  };

  const addReaction = async (messageId, emoji) => {
    const msgRef = doc(db, "projects", id, "messages", messageId);
    const msg = messages.find(m => m.id === messageId);

    const currentReactions = msg.reactions || {};
    const currentCount = currentReactions[emoji] || 0;

    await updateDoc(msgRef, {
      [`reactions.${emoji}`]: currentCount + 1,
    });
  };

  if (loading) return <div style={styles.loading}>Loading chat...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.glow} />

      <div style={styles.header}>
        <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>← Back</button>
        <h1 style={styles.title}>💬 Project Chat</h1>
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              alignSelf: msg.sender === user.email ? "flex-end" : "flex-start",
              background: msg.sender === user.email ? "#ec4899" : "rgba(79,140,255,0.2)",
            }}
          >
            <small style={styles.sender}>{msg.sender}</small>
            {msg.text}

            {/* Reactions */}
            <div style={styles.reactions}>
              {Object.entries(msg.reactions || {}).map(([emoji, count]) => (
                <span key={emoji} style={styles.reaction} onClick={() => addReaction(msg.id, emoji)}>
                  {emoji} {count}
                </span>
              ))}
              <span style={styles.addReaction} onClick={() => {
                const emoji = prompt("Enter emoji (❤️, 👍, 😂, 🎉, 👏)");
                if (emoji) addReaction(msg.id, emoji);
              }}>+</span>
            </div>
          </div>
        ))}

        <div ref={endRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
      </div>
    </div>
  );
}

/* ====================== STYLES ====================== */
const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "linear-gradient(135deg, #0b1020 0%, #0f172a 45%, #050814 100%)",
    color: "#fff",
    padding: "40px 20px",
    position: "relative",
  },
  glow: {
    position: "absolute",
    inset: 0,
    background: `radial-gradient(circle at 20% 20%, rgba(236,72,153,0.15), transparent 60%), 
                 radial-gradient(circle at 80% 30%, rgba(79,140,255,0.12), transparent 70%)`,
    zIndex: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "32px",
  },
  backBtn: {
    padding: "10px 18px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "999px",
    color: "#fff",
    cursor: "pointer",
  },
  title: {
    fontSize: "28px",
    background: "linear-gradient(90deg, #ec4899, #4f8cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  chatBox: {
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(79,140,255,0.25)",
    borderRadius: "20px",
    height: "520px",
    padding: "24px",
    overflowY: "auto",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  message: {
    maxWidth: "70%",
    padding: "12px 18px",
    borderRadius: "18px",
    color: "#fff",
    position: "relative",
  },
  sender: {
    fontSize: "12px",
    opacity: 0.7,
    display: "block",
    marginBottom: "4px",
  },
  reactions: {
    marginTop: "6px",
    display: "flex",
    gap: "6px",
  },
  reaction: {
    background: "rgba(255,255,255,0.15)",
    padding: "2px 8px",
    borderRadius: "999px",
    fontSize: "14px",
    cursor: "pointer",
  },
  addReaction: {
    background: "rgba(255,255,255,0.15)",
    padding: "2px 8px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "14px",
  },
  inputArea: {
    display: "flex",
    gap: "12px",
  },
  input: {
    flex: 1,
    padding: "16px",
    borderRadius: "999px",
    border: "1px solid rgba(79,140,255,0.3)",
    background: "rgba(15,23,42,0.8)",
    color: "#fff",
    fontSize: "15px",
  },
  sendBtn: {
    padding: "16px 32px",
    background: "linear-gradient(135deg, #ec4899, #4f8cff)",
    color: "white",
    border: "none",
    borderRadius: "999px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ChatBox() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  const sendMessage = () => {
    if (!text.trim()) return;
    setMessages([...messages, { text, isUser: true }]);
    setText("");

    // Simulate AI reply
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "That's a great idea! How can I help you with the project?", isUser: false }]);
    }, 800);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.container}>
      <div style={styles.glow} />

      <div style={styles.chatContainer}>
        <h1 style={styles.title}>💬 Messages</h1>

        <div style={styles.chatBox}>
          {messages.length === 0 && (
            <p style={styles.empty}>Start a conversation with teammates or AI</p>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={msg.isUser ? styles.userMessage : styles.aiMessage}>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
        </div>
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
  chatContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontSize: "28px",
    textAlign: "center",
    marginBottom: "32px",
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
  },
  userMessage: {
    textAlign: "right",
    margin: "12px 0",
    background: "#ec4899",
    color: "white",
    padding: "12px 18px",
    borderRadius: "18px 18px 4px 18px",
    display: "inline-block",
    maxWidth: "70%",
  },
  aiMessage: {
    textAlign: "left",
    margin: "12px 0",
    background: "rgba(79,140,255,0.2)",
    padding: "12px 18px",
    borderRadius: "18px 18px 18px 4px",
    display: "inline-block",
    maxWidth: "70%",
  },
  empty: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: "180px",
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

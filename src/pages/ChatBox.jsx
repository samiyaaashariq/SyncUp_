import React, { useState } from "react";

export default function ChatBox({ projectId }) {
  const [messages, setMessages] = useState([
    { text: "Welcome to SyncUp Chat 🚀", sender: "bot" },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { text: input, sender: "user" },
    ]);

    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Got it 👍 (bot reply)", sender: "bot" },
      ]);
    }, 400);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>SyncUp Chat</h3>
        <p style={styles.subtext}>
          Project: {projectId ? projectId : "General"}
        </p>
      </div>

      <div style={styles.chatArea}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf:
                msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor:
                msg.sender === "user" ? "#dcf8c6" : "#eee",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
        />

        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "300px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
  },

  header: {
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ddd",
  },

  subtext: {
    fontSize: "12px",
    color: "#666",
  },

  chatArea: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    backgroundColor: "#fff",
  },

  message: {
    padding: "8px",
    borderRadius: "8px",
    maxWidth: "70%",
  },

  inputBox: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
  },

  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  button: {
    marginLeft: "10px",
    padding: "8px 12px",
    border: "none",
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "5px",
  },
};

import React, { useState } from "react";

export default function ChatBox({ projectId }) {
  const [messages, setMessages] = useState([
    { text: "Welcome to SyncUp Chat 🚀", sender: "bot" },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };

    setMessages([...messages, newMessage]);

    setInput("");

    // simple bot reply (temporary logic)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Got it 👍 (bot reply coming soon)", sender: "bot" },
      ]);
    }, 500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>SyncUp Chat</h3>
        <p style={styles.subtext}>Project ID: {projectId || "General"}</p>
      </div>

      <div style={styles.chatArea}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.sender === "user"
                ? styles.userMsg
                : styles.botMsg
            }
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
    height: "100%",
    fontFamily: "Arial",
  },

  header: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f5f5f5",
  },

  subtext: {
    fontSize: "12px",
    color: "#666",
  },

  chatArea: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    backgroundColor: "#fff",
  },

  userMsg: {
    textAlign: "right",
    margin: "5px",
    padding: "8px",
    backgroundColor: "#dcf8c6",
    borderRadius: "8px",
    display: "inline-block",
    alignSelf: "flex-end",
  },

  botMsg: {
    textAlign: "left",
    margin: "5px",
    padding: "8px",
    backgroundColor: "#eee",
    borderRadius: "8px",
    display: "inline-block",
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
    cursor: "pointer",
  },
};

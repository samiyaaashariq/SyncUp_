import React, { useState, useRef, useEffect } from "react";

export default function CadetChatbot() {
  const [messages, setMessages] = useState([
    {
      text: "Hi 👋 I’m Cadet AI. Ask me anything about SyncUp or coding!",
      sender: "bot"
    }
  ]);

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simple AI logic (upgrade later)
  const getBotReply = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) {
      return "Hey 👋 How can I help you today?";
    }

    if (text.includes("syncup")) {
      return "SyncUp is your project collaboration platform 🚀";
    }

    if (text.includes("project")) {
      return "You can create and join projects inside SyncUp.";
    }

    if (text.includes("chat")) {
      return "This chat helps teammates collaborate in real-time 💬";
    }

    if (text.includes("help")) {
      return "Ask me about projects, chat, or coding issues!";
    }

    return "I’m still learning 🤖 but I’ll improve soon!";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      text: input,
      sender: "user"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // bot reply delay
    setTimeout(() => {
      const botMsg = {
        text: getBotReply(userMsg.text),
        sender: "bot"
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        🤖 <span style={styles.title}>Cadet AI Chat</span>
      </div>

      {/* CHAT BOX */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "user"
                  ? "flex-end"
                  : "flex-start",
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                ...styles.message,
                background:
                  msg.sender === "user"
                    ? "#4f46e5"
                    : "#f1f5f9",
                color:
                  msg.sender === "user"
                    ? "#fff"
                    : "#111"
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Cadet AI..."
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

// UI STYLES
const styles = {
  container: {
    width: "100%",
    maxWidth: "500px",
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden",
    fontFamily: "Arial"
  },

  header: {
    background: "#111827",
    color: "#fff",
    padding: "12px",
    fontWeight: "bold"
  },

  title: {
    color: "#a5b4fc"
  },

  chatBox: {
    height: "350px",
    overflowY: "auto",
    padding: "10px",
    background: "#ffffff"
  },

  message: {
    padding: "10px 12px",
    borderRadius: "10px",
    maxWidth: "75%",
    fontSize: "14px"
  },

  inputBox: {
    display: "flex",
    borderTop: "1px solid #ddd"
  },

  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none"
  },

  button: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer"
  }
};

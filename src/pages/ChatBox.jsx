import React, { useState } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input) return;

    const userMsg = { role: "user", text: input };
    setMessages([...messages, userMsg]);

    // Simple AI simulation (we can upgrade to real OpenAI later)
    setTimeout(() => {
      const botMsg = {
        role: "bot",
        text: "AI Response: I understand your project query → " + input,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 800);

    setInput("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🤖 SyncUp AI Chat</h2>

      <div style={{ height: 300, overflowY: "scroll", border: "1px solid gray" }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role}:</b> {m.text}
          </p>
        ))}
      </div>

      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}

import React, { useEffect, useState, useRef } from "react";
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
  const [aiMessages, setAiMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const isProjectChat = Boolean(projectId);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, messages]);

  // Firebase Project Chat
  useEffect(() => {
    if (!isProjectChat) return;

    const q = query(
      collection(db, "projects", projectId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [projectId, isProjectChat]);

  // Enhanced Visual / AR Detection
  const isVisualRequest = (msg) => {
    const keywords = ["visualize", "architecture", "diagram", "flow", "structure", "ar", "vr", "3d", "system design", "project map", "explain visually"];
    return keywords.some(k => msg.toLowerCase().includes(k));
  };

  // GEMINI AI (Replace with your real key)
  const sendToAI = async (userMessage) => {
    setLoading(true);
    const GEMINI_API_KEY = "AQ.Ab8RN6IklzoYeAaFo4NE01dxtOS51WEOUIY8hcdenN3O2bfeCg"; // ← YOUR KEY HERE

    const isVisual = isVisualRequest(userMessage);

    const systemPrompt = isVisual 
      ? `You are SyncUp AI - Visual Architecture Expert.
When user asks for visual explanation, respond with rich markdown including:
- **System Architecture** section
- **Flow Diagram** (use ASCII or mermaid-like syntax)
- **Component Breakdown**
- Neon-style highlights for key parts.
Make it feel like AR/VR visualization.` 
      : `You are SyncUp AI - Project Copilot for student builders. Be helpful, practical and encouraging.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemPrompt}

User: ${userMessage}

Respond in a modern, clear, and visually engaging way.`
              }]
            }]
          })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "API Error");

      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't respond.";
    } catch (err) {
      console.error(err);
      return "AI is temporarily unavailable. Please try again.";
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    const userMessage = text.trim();
    setText("");

    if (!isProjectChat) {
      // AI Mode
      const aiReply = await sendToAI(userMessage);
      setAiMessages(prev => [
        ...prev,
        { role: "user", text: userMessage },
        { role: "ai", text: aiReply }
      ]);
    } else {
      // Project Chat
      try {
        await addDoc(collection(db, "projects", projectId, "messages"), {
          text: userMessage,
          user: user?.email || "Anonymous",
          createdAt: new Date(),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      padding: "20px",
      background: "linear-gradient(135deg, #0a0a0a, #001a14, #002b24)",
      color: "#e0f2f1",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{
          fontWeight: "900",
          fontSize: "2.2rem",
          background: "linear-gradient(90deg, #00ff9f, #00b8d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "8px"
        }}>
          {isProjectChat ? "Project Team Chat" : "SyncUp AI Copilot 🤖"}
        </h2>
        <p style={{ color: "#80cbc4", marginBottom: "20px" }}>
          {isProjectChat 
            ? `Project ID: ${projectId}` 
            : "Neon Visual AI • Describe your idea or ask for architecture"}
        </p>

        {/* CHAT CONTAINER - ChatGPT Style */}
        <div style={{
          background: "rgba(15, 23, 42, 0.95)",
          border: "1px solid #334155",
          borderRadius: "16px",
          height: "520px",
          overflowY: "auto",
          padding: "20px",
          boxShadow: "0 20px 40px rgba(0, 255, 159, 0.1)",
          position: "relative",
        }}>
          {isProjectChat ? (
            messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: "16px" }}>
                <div style={{ color: "#00ff9f", fontWeight: "600" }}>{msg.user}</div>
                <div style={{ color: "#e0f2f1" }}>{msg.text}</div>
              </div>
            ))
          ) : (
            <>
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{
                    maxWidth: "78%",
                    padding: "14px 18px",
                    borderRadius: "18px",
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, #00ff9f, #00b8d4)"
                      : "#1e2937",
                    color: msg.role === "user" ? "#0a0a0a" : "#e0f2f1",
                    boxShadow: msg.role === "ai" 
                      ? "0 4px 15px rgba(0, 184, 212, 0.2)" 
                      : "none",
                    border: msg.role === "ai" ? "1px solid #334155" : "none",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.5",
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#80cbc4" }}>
                  <span>AI thinking</span>
                  <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                </div>
              )}

              <div ref={chatEndRef} />

              {aiMessages.length === 0 && (
                <div style={{ textAlign: "center", marginTop: "140px", color: "#80cbc4" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🌌</div>
                  <p style={{ fontSize: "1.1rem" }}>
                    Describe your project idea<br />
                    or type <strong>"visualize architecture"</strong>
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* INPUT AREA */}
        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder={isProjectChat ? "Message your team..." : "Ask AI anything... (try visual mode)"}
            style={{
              flex: 1,
              padding: "16px 20px",
              borderRadius: "9999px",
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#e0f2f1",
              fontSize: "1.05rem",
            }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !text.trim()}
            style={{
              padding: "0 28px",
              borderRadius: "9999px",
              background: loading ? "#334155" : "linear-gradient(90deg, #00ff9f, #00b8d4)",
              color: "#0a0a0a",
              fontWeight: "700",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1.05rem",
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      {/* Neon Animation */}
      <style>
        {`
          .dot {
            animation: blink 1.4s infinite;
          }
          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }

          @keyframes blink {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
          }

          /* Subtle neon glow on chat container */
          div[style*="rgba(15, 23, 42"] {
            animation: neonPulse 4s infinite alternate;
          }

          @keyframes neonPulse {
            from { box-shadow: 0 20px 40px rgba(0, 255, 159, 0.1); }
            to { box-shadow: 0 20px 50px rgba(0, 184, 212, 0.25); }
          }
        `}
      </style>
    </div>
  );
}

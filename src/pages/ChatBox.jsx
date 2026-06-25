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
  }, [projectId]);

  const isVisualRequest = (msg) => {
    const keywords = ["visualize", "architecture", "diagram", "flow", "ar", "vr", "3d"];
    return keywords.some(k => msg.toLowerCase().includes(k));
  };

  const sendToAI = async (userMessage) => {
    setLoading(true);
    const GEMINI_API_KEY = "AQ.Ab8RN6IklzoYeAaFo4NE01dxtOS51WEOUIY8hcdenN3O2bfeCg";

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ 
              text: `You are SyncUp AI. Be helpful and encouraging.
${isVisualRequest(userMessage) ? "Give structured visual architecture response using markdown." : ""}
User: ${userMessage}` 
            }]}]
          })
        }
      );

      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't respond.";
    } catch (err) {
      console.error(err);
      return "AI is temporarily unavailable.";
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    const userMessage = text.trim();
    setText("");

    if (!isProjectChat) {
      const aiReply = await sendToAI(userMessage);
      setAiMessages(prev => [...prev, { role: "user", text: userMessage }, { role: "ai", text: aiReply }]);
    } else {
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
      fontFamily: "Inter, sans-serif"
    }}>
      <h2 style={{ color: "#00ff9f", textAlign: "center" }}>
        {isProjectChat ? "Team Chat" : "SyncUp AI Assistant"}
      </h2>

      <div style={{
        maxWidth: "800px",
        margin: "30px auto",
        background: "rgba(15, 23, 42, 0.95)",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid #334155",
        height: "520px",
        overflowY: "auto"
      }}>
        {!isProjectChat && aiMessages.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "180px", color: "#80cbc4" }}>
            Describe your project idea or ask for visual architecture
          </p>
        )}

        {isProjectChat ? (
          messages.map(msg => (
            <div key={msg.id} style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#00ff9f" }}>{msg.user}:</strong> {msg.text}
            </div>
          ))
        ) : (
          aiMessages.map((msg, i) => (
            <div key={i} style={{ textAlign: msg.role === "user" ? "right" : "left", margin: "15px 0" }}>
              <span style={{
                padding: "12px 18px",
                borderRadius: "18px",
                background: msg.role === "user" ? "linear-gradient(135deg, #00ff9f, #00b8d4)" : "#1e2937",
                color: msg.role === "user" ? "#0a0a0a" : "#e0f2f1",
                display: "inline-block",
                maxWidth: "75%"
              }}>
                {msg.text}
              </span>
            </div>
          ))
        )}

        {loading && <p style={{ color: "#80cbc4" }}>AI is thinking...</p>}
        <div ref={chatEndRef} />
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", gap: "10px" }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={e => e.key === "Enter" && sendMessage()}
          placeholder={isProjectChat ? "Type message..." : "Ask AI anything..."}
          style={{
            flex: 1,
            padding: "15px",
            borderRadius: "9999px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#e0f2f1"
          }}
        />
        <button onClick={sendMessage} disabled={loading} style={{
          padding: "15px 30px",
          background: "linear-gradient(90deg, #00ff9f, #00b8d4)",
          color: "#0a0a0a",
          border: "none",
          borderRadius: "9999px",
          fontWeight: "bold"
        }}>
          Send
        </button>
      </div>
    </div>
  );
}

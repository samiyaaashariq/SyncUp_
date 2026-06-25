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

  // AI states
  const [aiMessages, setAiMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const isProjectChat = Boolean(projectId);

  // ---------------- FIREBASE PROJECT CHAT ----------------
  useEffect(() => {
    if (!isProjectChat) return;

    const q = query(
      collection(db, "projects", projectId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(data);
    });

    return () => unsubscribe();
  }, [projectId, isProjectChat]);

  // ---------------- AR/VR DETECTOR ----------------
  const isARMode = (msg) => {
    const keywords = ["ar", "vr", "visualize", "3d", "virtual", "explain visually"];
    return keywords.some((k) => msg.toLowerCase().includes(k));
  };

  // ---------------- GEMINI AI CALL ----------------
  const sendToAI = async (userMessage) => {
    setLoading(true);

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: userMessage }],
              },
            ],
          }),
        }
      );

      const data = await res.json();

      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't respond."
      );
    } catch (err) {
      console.log(err);
      return "Error connecting to AI.";
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMessage = text;
    setText("");

    // ================= AI CHAT MODE =================
    if (!isProjectChat) {
      let prompt = userMessage;

      // AR / VR MODE ENHANCEMENT
      if (isARMode(userMessage)) {
        prompt =
          userMessage +
          "\n\nRespond in a structured immersive visual breakdown format with sections, flow, and project architecture style explanation (AR/VR experience).";
      }

      const aiReply = await sendToAI(prompt);

      setAiMessages((prev) => [
        ...prev,
        { role: "user", text: userMessage },
        { role: "ai", text: aiReply },
      ]);

      return;
    }

    // ================= PROJECT CHAT MODE =================
    try {
      await addDoc(collection(db, "projects", projectId, "messages"), {
        text: userMessage,
        user: user?.email || "Anonymous",
        createdAt: new Date(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- UI ----------------
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(135deg, #ffe4ec, #ffffff)",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <h2 style={{ color: "#0f172a", fontWeight: "900" }}>
        {isProjectChat ? "Project Chat Room" : "SyncUp AI Assistant 🤖"}
      </h2>

      <p style={{ color: "#475569" }}>
        {isProjectChat ? `Project ID: ${projectId}` : "AI Powered Chatbot + AR Mode"}
      </p>

      {/* CHAT WINDOW */}
      <div
        style={{
          background: "white",
          height: "420px",
          overflowY: "auto",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          marginTop: "15px",
        }}
      >
        {/* ---------------- PROJECT CHAT ---------------- */}
        {isProjectChat ? (
          messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: "10px" }}>
              <strong>{msg.user}</strong>: {msg.text}
            </div>
          ))
        ) : (
          /* ---------------- AI CHAT ---------------- */
          <div>
            {aiMessages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  margin: "10px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "10px",
                    borderRadius: "10px",
                    background:
                      msg.role === "user" ? "#0ea5e9" : "#e2e8f0",
                    color: msg.role === "user" ? "white" : "black",
                    maxWidth: "75%",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {loading && (
              <p style={{ color: "#64748b" }}>AI is thinking...</p>
            )}

            {aiMessages.length === 0 && (
              <p style={{ textAlign: "center", marginTop: "150px", color: "#64748b" }}>
                Ask me anything about your project or say "explain in AR mode" 🚀
              </p>
            )}
          </div>
        )}
      </div>

      {/* INPUT */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isProjectChat
              ? "Type a project message..."
              : "Ask AI or try 'explain in AR mode'"
          }
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#0ea5e9",
            color: "white",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

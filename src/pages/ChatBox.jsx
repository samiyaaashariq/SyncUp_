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
  const isVisualMode = (msg) => {
  const keywords = [
    "visualize",
    "architecture",
    "system design",
    "flow",
    "diagram",
    "structure",
    "project map",
    "explain visually"
  ];

  return keywords.some((k) =>
    msg.toLowerCase().includes(k)
  );
};

  const chatEndRef = useRef(null);

  const isProjectChat = Boolean(projectId);

  // AUTO SCROLL
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, messages]);

  // FIREBASE PROJECT CHAT
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

  // AR / VR DETECTOR
  const isARMode = (msg) => {
    const keywords = ["ar", "vr", "visualize", "3d", "virtual", "explain visually"];
    return keywords.some((k) => msg.toLowerCase().includes(k));
  };

 
 // SIMPLE AI 
const sendToAI = async (userMessage) => {
  setLoading(true);

  try {
    return `🤖 SyncUp AI

You said:
${userMessage}

AI integration is temporarily disabled while deployment is being fixed.`;
  } catch (err) {
    console.log(err);
    return "Error connecting to AI.";
  } finally {
    setLoading(false);
  }
};
                  },
                ],
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

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMessage = text;
    setText("");
    

    // ================= AI MODE =================
    if (!isProjectChat) {
  let prompt = userMessage;

  const visual = isVisualMode(userMessage);
  const ar = isARMode(userMessage);

  if (ar || visual) {
    prompt =
      userMessage +
      "\n\nReturn structured system architecture / visual breakdown format.";
  }

  const aiReply = await sendToAI(prompt);
      setAiMessages((prev) => [
        ...prev,
        { role: "user", text: userMessage },
        { role: "ai", text: aiReply },
      ]);

      return;
    }

    // ================= PROJECT CHAT =================
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

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(135deg, #ffe4ec, #ffffff)",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <h2 style={{ fontWeight: "900", color: "#0f172a" }}>
        {isProjectChat ? "Project Chat Room" : "SyncUp AI Assistant 🤖"}
      </h2>

      <p style={{ color: "#475569" }}>
        {isProjectChat ? `Project ID: ${projectId}` : "AI + AR Smart Assistant"}
      </p>

      {/* CHAT AREA */}
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
        {/* PROJECT CHAT */}
        {isProjectChat ? (
          messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: "10px" }}>
              <strong>{msg.user}</strong>: {msg.text}
            </div>
          ))
        ) : (
          /* AI CHAT */
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
                    maxWidth: "75%",
                    whiteSpace: "pre-wrap",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg,#0ea5e9,#2563eb)"
                        : "#f1f5f9",
                    color: msg.role === "user" ? "white" : "black",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {loading && (
              <div style={{ marginTop: "10px", color: "#64748b" }}>
                AI is thinking...
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            )}

            <div ref={chatEndRef} />

            {aiMessages.length === 0 && (
              <p style={{ textAlign: "center", marginTop: "150px", color: "#64748b" }}>
                Ask anything or try "explain in AR mode"
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isProjectChat
              ? "Type project message..."
              : "Ask AI or try AR mode"
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

      {/* DOT ANIMATION */}
      <style>
        {`
        .dot {
          animation: blink 1.4s infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        `}
      </style>
    </div>
  );
}

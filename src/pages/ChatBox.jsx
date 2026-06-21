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

  const isProjectChat = Boolean(projectId);

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

  const sendMessage = async () => {
    if (!text.trim()) return;

    if (!isProjectChat) {
      alert("AI Chat integration coming soon");
      return;
    }

    try {
      await addDoc(
        collection(db, "projects", projectId, "messages"),
        {
          text: text,
          user: user?.email || "Anonymous",
          createdAt: new Date(),
        }
      );

      setText("");
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
      <h2
        style={{
          color: "#0f172a",
          fontWeight: "900",
        }}
      >
        {isProjectChat ? "Project Chat Room" : "AI Assistant"}
      </h2>

      <p
        style={{
          color: "#475569",
        }}
      >
        {isProjectChat
          ? `Project ID: ${projectId}`
          : "General AI Assistant"}
      </p>

      <div
        style={{
          background: "white",
          height: "400px",
          overflowY: "auto",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          marginTop: "15px",
        }}
      >
        {isProjectChat ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                marginBottom: "10px",
                color: "#0f172a",
              }}
            >
              <strong>{msg.user}</strong>: {msg.text}
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              marginTop: "150px",
              color: "#64748b",
            }}
          >
            AI Assistant page is working.
          </div>
        )}
      </div>

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
              : "Ask AI something..."
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

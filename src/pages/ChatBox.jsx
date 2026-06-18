import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

export default function ChatBox({ projectId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 🔥 CHECK PROJECT ID
  useEffect(() => {
    if (!projectId) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, "projects", projectId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return () => unsub();
  }, [projectId]);

  // 🚀 SEND MESSAGE (FIXED HARD)
  const sendMessage = async () => {
    if (!projectId) {
      alert("No project selected");
      return;
    }

    if (!input.trim()) return;

    try {
      await addDoc(
        collection(db, "projects", projectId, "messages"),
        {
          text: input,
          user: auth.currentUser?.email || "anonymous",
          createdAt: serverTimestamp()
        }
      );

      setInput("");
    } catch (err) {
      console.log("SEND ERROR:", err);
      alert("Message failed. Check Firestore rules.");
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "10px" }}>
      
      {/* HEADER (ALWAYS VISIBLE) */}
      <h3>SyncUp Chat</h3>

      {/* MESSAGES */}
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #eee",
          padding: "10px"
        }}
      >
        {!projectId ? (
          <p>Select a project first</p>
        ) : messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                textAlign:
                  msg.user === auth.currentUser?.email
                    ? "right"
                    : "left",
                marginBottom: "8px"
              }}
            >
              <b>{msg.user}</b>
              <div>{msg.text}</div>
            </div>
          ))
        )}
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            projectId
              ? "Type message..."
              : "Select a project first"
          }
          style={{ flex: 1, padding: "8px" }}
          disabled={!projectId}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          disabled={!projectId}
          style={{ marginLeft: "10px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

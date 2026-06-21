import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function ChatBox() {
  const { projectId } = useParams();
  const user = auth.currentUser;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // REAL-TIME CHAT
  useEffect(() => {
    if (!projectId) return;

    const q = query(
      collection(db, "projects", projectId, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, [projectId]);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(
      collection(db, "projects", projectId, "messages"),
      {
        text: input,
        sender: user?.email,
        createdAt: new Date(),
      }
    );

    setInput("");
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h2>💬 Project Chat Room</h2>
      <p style={{ color: "gray" }}>Project ID: {projectId}</p>

      {/* MESSAGES BOX */}
      <div
        style={{
          height: "400px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ color: "gray" }}>No messages yet...</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              style={{
                marginBottom: "10px",
                padding: "8px",
                background: "#f3f4f6",
                borderRadius: "8px",
              }}
            >
              <b>{m.sender}</b>
              <p style={{ margin: "5px 0" }}>{m.text}</p>
            </div>
          ))
        )}
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "10px 15px",
            background: "#0ea5e9",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

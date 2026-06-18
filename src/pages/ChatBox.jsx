import React, { useEffect, useState, useRef } from "react";
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
  const bottomRef = useRef(null);

  // 🔥 REALTIME CHAT
  useEffect(() => {
    if (!projectId) return;

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

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🚀 SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim() || !projectId) return;

    await addDoc(
      collection(db, "projects", projectId, "messages"),
      {
        text: input,
        user: auth.currentUser?.email || "anonymous",
        createdAt: serverTimestamp()
      }
    );

    setInput("");
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "10px" }}>
      <div style={{ height: "300px", overflowY: "auto" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign:
                msg.user === auth.currentUser?.email
                  ? "right"
                  : "left",
              margin: "5px"
            }}
          >
            <b>{msg.user}</b>
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          style={{ flex: 1 }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

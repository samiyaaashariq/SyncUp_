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

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const CHAT_ID = "global-chat";

  // 🔥 REALTIME LISTENER
  useEffect(() => {
    const q = query(
      collection(db, "projects", CHAT_ID, "messages"),
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
  }, []);

  // 🚀 SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      await addDoc(
        collection(db, "projects", CHAT_ID, "messages"),
        {
          text: input,
          user: auth.currentUser?.email || "anonymous",
          createdAt: serverTimestamp()
        }
      );

      setInput("");
    } catch (err) {
      console.log("Error:", err);
      alert("Message not sent. Check Firebase setup.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>💬 SyncUp Chat</h2>

      {/* MESSAGES */}
      <div
        style={{
          border: "1px solid #ddd",
          height: "300px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px"
        }}
      >
        {messages.length === 0 ? (
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
                margin: "5px 0"
              }}
            >
              <b>{msg.user}</b>
              <div>{msg.text}</div>
            </div>
          ))
        )}
      </div>

      {/* INPUT */}
      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          style={{ flex: 1, padding: "8px" }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          style={{ marginLeft: "10px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

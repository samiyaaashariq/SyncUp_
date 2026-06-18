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

  useEffect(() => {
    if (!projectId) return;

    const q = query(
      collection(db, "projects", projectId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }))
      );
    });

    return () => unsub();
  }, [projectId]);

  const sendMessage = async () => {
    const sendMessage = async () => {
  try {
    console.log("Project ID:", projectId);

    const ref = collection(db, "projects", projectId, "messages");

    await addDoc(ref, {
      text: input,
      user: auth.currentUser?.email || "test-user",
      createdAt: serverTimestamp()
    });

    console.log("Message sent");

    setInput("");
  } catch (err) {
    console.log("ERROR SENDING MESSAGE:", err);
    alert(err.message);
  }
};
      }
    );

    setInput("");
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "10px" }}>
      <h3 style={{ color: "#4f46e5" }}>SyncUp Chat</h3>

      <div style={{ height: "300px", overflowY: "auto" }}>
        {messages.map((m) => (
          <div key={m.id}>
            <b>{m.user}</b>
            <div>{m.text}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          style={{ flex: 1 }}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

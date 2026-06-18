import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

export default function ChatBox({ projectId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "projects", projectId, "chat"),
      orderBy("time")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    });

    return () => unsub();
  }, [projectId]);

  const sendMessage = async () => {
    if (!message) return;

    await addDoc(collection(db, "projects", projectId, "chat"), {
      text: message,
      user: auth.currentUser.email,
      time: new Date()
    });

    setMessage("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
      <h3>Chat 💬</h3>

      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {messages.map((m) => (
          <div key={m.id}>
            <b>{m.user}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        placeholder="Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}
export default ChatBox;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";

export default function ProjectChat() {
  const { id } = useParams();
  const nav = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  // CHECK ACCESS
  useEffect(() => {
    const checkAccess = async () => {
      const user = auth.currentUser;

      if (!user) {
        nav("/");
        return;
      }

      try {
        const ref = doc(db, "projects", id, "members", user.email);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setAllowed(true);
        } else {
          alert("❌ You are not a member of this project");
          nav("/dashboard");
        }
      } catch (err) {
        console.error(err);
        nav("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [id, nav]);

  // REALTIME CHAT
  useEffect(() => {
    const ref = collection(db, "projects", id, "messages");
    const q = query(ref, orderBy("createdAt"));

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [id]);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, "projects", id, "messages"), {
      text: input,
      sender: auth.currentUser.email,
      createdAt: new Date(),
    });

    setInput("");
  };

  // LOADING
  if (loading) {
    return (
      <div style={styles.page}>
        <p>Checking access...</p>
      </div>
    );
  }

  // BLOCKED
  if (!allowed) {
    return null;
  }

  // UI (IMPORTANT FIX: MUST RETURN)
  return (
    <div style={styles.page}>

      <h2 style={styles.title}>💬 Project Chat</h2>

      <div style={styles.chatBox}>

        {/* messages */}
        <div style={{ height: "300px", overflowY: "auto" }}>
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: "10px" }}>
              <b style={{ color: "#22d3ee" }}>{m.sender}</b>
              <p style={{ margin: 0 }}>{m.text}</p>
            </div>
          ))}
        </div>

        {/* input */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "10px",
              background: "#22d3ee",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: "20px",
    minHeight: "100vh",
    background: "#0b1120",
    color: "#fff",
  },

  title: {
    color: "#22d3ee",
    marginBottom: "10px",
  },

  chatBox: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #22d3ee",
    borderRadius: "10px",
    background: "#111827",
    minHeight: "300px",
  },
};

import React, { useEffect, useState, useRef } from "react";
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
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function ProjectChat() {
  const { id } = useParams();
  const nav = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);

  const endRef = useRef(null);

  const user = auth.currentUser;

  /* ================= ACCESS CHECK ================= */
  useEffect(() => {
    const checkAccess = async () => {
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
  }, [id]);

  /* ================= REALTIME MESSAGES ================= */
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

  /* ================= TYPING USERS ================= */
  useEffect(() => {
    const ref = collection(db, "projects", id, "typing");

    const unsub = onSnapshot(ref, (snap) => {
      setTypingUsers(snap.docs.map((d) => d.id));
    });

    return () => unsub();
  }, [id]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, "projects", id, "messages"), {
      text: input,
      sender: user.email,
      createdAt: serverTimestamp(),
    });

    setInput("");

    // remove typing status
    const tRef = doc(db, "projects", id, "typing", user.email);
    await deleteDoc(tRef);
  };

  /* ================= TYPING HANDLER ================= */
  const handleTyping = async (value) => {
    setInput(value);

    const tRef = doc(db, "projects", id, "typing", user.email);

    if (value.length > 0) {
      await setDoc(tRef, { typing: true });
    } else {
      await deleteDoc(tRef);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div style={styles.page}>
        <p>Checking access...</p>
      </div>
    );
  }

  /* ================= BLOCKED ================= */
  if (!allowed) return null;

  /* ================= UI ================= */
  return (
    <div style={styles.page}>
      <h2 style={styles.title}>💬 Project Chat</h2>

      {/* CHAT BOX */}
      <div style={styles.chatBox}>

        {/* MESSAGES */}
        <div style={{ height: "320px", overflowY: "auto" }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent:
                  m.sender === user.email ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  background:
                    m.sender === user.email ? "#22d3ee" : "#1f2937",
                  color: m.sender === user.email ? "#000" : "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "60%",
                }}
              >
                <small style={{ display: "block", opacity: 0.7 }}>
                  {m.sender}
                </small>
                {m.text}
              </div>
            </div>
          ))}

          <div ref={endRef} />
        </div>

        {/* TYPING */}
        {typingUsers.length > 0 && (
          <p style={{ color: "#94a3b8", fontSize: "12px" }}>
            {typingUsers.join(", ")} typing...
          </p>
        )}

        {/* INPUT */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <input
            value={input}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "10px",
              background: "#22d3ee",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
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
  },
};

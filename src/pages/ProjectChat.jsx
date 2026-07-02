import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";

export default function ProjectChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const checkAccess = async () => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      try {
        const ref = doc(db, "projects", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setCheckingAccess(false);
          return;
        }
        const data = { id: snap.id, ...snap.data() };
        setProject(data);
        const isMember =
          data.members?.includes(currentUser.uid) || data.creator === currentUser.email;
        setHasAccess(isMember);
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingAccess(false);
      }
    };
    checkAccess();
  }, [id, currentUser, navigate]);

  useEffect(() => {
    if (!hasAccess) return;
    const q = query(
      collection(db, "projects", id, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [hasAccess, id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, "projects", id, "messages"), {
        text: text.trim(),
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  if (checkingAccess) {
    return <div style={styles.container}><p style={styles.muted}>Checking access...</p></div>;
  }

  if (!hasAccess) {
    return (
      <div style={styles.container}>
        <div style={styles.deniedCard}>
          <h2 style={{ color: "#f87171" }}>🚫 Access Denied</h2>
          <p style={styles.muted}>Only project members can access this chat room.</p>
          <button style={styles.backBtn} onClick={() => navigate(`/project/${id}`)}>
            ← Back to Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(`/project/${id}`)}>← Back</button>
        <h2 style={styles.title}>{project?.title} — Chat</h2>
      </div>

      <div style={styles.messagesBox}>
        {messages.length === 0 && <p style={styles.muted}>No messages yet. Say hi 👋</p>}
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.messageBubble,
              alignSelf: msg.senderId === currentUser.uid ? "flex-end" : "flex-start",
              background:
                msg.senderId === currentUser.uid
                  ? "linear-gradient(135deg, #ec4899, #c084fc)"
                  : "rgba(103,232,249,0.1)",
            }}
          >
            <p style={styles.sender}>{msg.senderEmail}</p>
            <p style={styles.messageText}>{msg.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "800px", margin: "0 auto", color: "#fff", display: "flex", flexDirection: "column", height: "85vh" },
  muted: { color: "#94a3b8" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" },
  title: { color: "#c084fc" },
  backBtn: {
    background: "transparent",
    border: "1px solid rgba(103,232,249,0.3)",
    color: "#67e8f9",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  deniedCard: {
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(248,113,113,0.4)",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
  },
  messagesBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "16px",
    background: "rgba(15,23,42,0.6)",
    borderRadius: "16px",
    marginBottom: "16px",
  },
  messageBubble: {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: "14px",
    color: "#fff",
  },
  sender: { fontSize: "0.75rem", color: "#e2e8f0", marginBottom: "4px", opacity: 0.8 },
  messageText: { margin: 0 },
  inputRow: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "14px",
    background: "rgba(15,23,42,0.9)",
    border: "1px solid #67e8f9",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "1rem",
  },
  sendBtn: {
    padding: "14px 24px",
    background: "linear-gradient(135deg, #ec4899, #c084fc)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

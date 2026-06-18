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
  const [status, setStatus] = useState("loading");
  const bottomRef = useRef(null);

  // 🔥 REAL-TIME LISTENER
  useEffect(() => {
    if (!projectId) {
      setStatus("no-project");
      setMessages([]);
      return;
    }

    setStatus("active");

    const q = query(
      collection(db, "projects", projectId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setMessages(data);
      },
      (error) => {
        console.log(error);
        setStatus("error");
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🚀 SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!projectId) {
      alert("Please select a project first to start chatting.");
      return;
    }

    if (!auth.currentUser) {
      alert("User not logged in.");
      return;
    }

    try {
      await addDoc(
        collection(db, "projects", projectId, "messages"),
        {
          text: input.trim(),
          user: auth.currentUser.email,
          createdAt: serverTimestamp()
        }
      );

      setInput("");
    } catch (err) {
      console.log(err);
      alert("Message failed to send.");
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h3>SyncUp Chat 💬</h3>
        <p style={styles.subtext}>
          {projectId
            ? `Project ID: ${projectId}`
            : "⚠ Select a project to start chatting"}
        </p>
      </div>

      {/* STATUS */}
      {status === "error" && (
        <div style={styles.error}>Chat failed to load</div>
      )}

      {/* CHAT AREA */}
      <div style={styles.chatArea}>
        {status === "no-project" ? (
          <p style={{ color: "#888" }}>
            No project selected. Click “Open Chat” on a project.
          </p>
        ) : messages.length === 0 ? (
          <p style={{ color: "#aaa" }}>
            No messages yet. Start the conversation 🚀
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user === auth.currentUser?.email;

            return (
              <div
                key={msg.id}
                style={{
                  ...styles.msg,
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  backgroundColor: isMe ? "#dcf8c6" : "#eee"
                }}
              >
                <div style={styles.user}>{msg.user}</div>
                <div>{msg.text}</div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            projectId ? "Type a message..." : "Select a project first"
          }
          style={styles.input}
          disabled={!projectId}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            ...styles.button,
            opacity: projectId ? 1 : 0.5,
            cursor: projectId ? "pointer" : "not-allowed"
          }}
          disabled={!projectId}
        >
          Send
        </button>
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    height: "350px",
    fontFamily: "Arial",
    overflow: "hidden"
  },

  header: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    background: "#f5f5f5"
  },

  subtext: {
    fontSize: "12px",
    color: "#666"
  },

  error: {
    padding: "5px 10px",
    background: "#ffe5e5",
    color: "#d00",
    fontSize: "12px"
  },

  chatArea: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    background: "#fff"
  },

  msg: {
    padding: "8px",
    borderRadius: "10px",
    maxWidth: "70%",
    fontSize: "14px"
  },

  user: {
    fontSize: "10px",
    opacity: 0.6,
    marginBottom: "3px"
  },

  inputBox: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd"
  },

  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    outline: "none"
  },

  button: {
    marginLeft: "10px",
    padding: "8px 14px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px"
  }
};

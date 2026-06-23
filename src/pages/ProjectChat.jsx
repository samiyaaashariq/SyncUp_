import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProjectChat() {
  const { id } = useParams();
  const nav = useNavigate();

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

  // LOADING STATE
  if (loading) {
    return (
      <div style={styles.page}>
        <p>Checking access...</p>
      </div>
    );
  }

  // BLOCKED STATE
  if (!allowed) {
    return null;
  }

  // CHAT UI (PLACEHOLDER FOR NOW)
  return (
    <div style={styles.page}>

      <h2 style={styles.title}>💬 Project Chat Room</h2>

      <p style={{ color: "#94a3b8" }}>
        Welcome to the team chat for project: {id}
      </p>

      <div style={styles.chatBox}>
        <p style={{ color: "#94a3b8" }}>
          🔥 Real-time chat system will be added next step
        </p>
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

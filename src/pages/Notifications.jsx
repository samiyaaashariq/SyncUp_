import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Notifications() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  // AUTH LISTENER
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  // NOTIFICATIONS LISTENER
  useEffect(() => {
    if (!user?.email) return;

    const ref = collection(db, "notifications", user.email, "items");

    const unsub = onSnapshot(ref, (snap) => {
      setNotes(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [user]);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🔔 Notifications</h2>

      {notes.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No notifications yet</p>
      ) : (
        notes.map((n) => (
          <div key={n.id} style={styles.card}>
            <p style={{ margin: 0 }}>{n.text}</p>
            <small style={{ color: "#94a3b8" }}>{n.type}</small>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    minHeight: "100vh",
    background: "#0b1120",
    color: "#fff",
  },

  title: {
    color: "#22d3ee",
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  card: {
    padding: "15px",
    border: "1px solid #22d3ee",
    borderRadius: "10px",
    marginBottom: "10px",
    background: "#111827",
  },
};

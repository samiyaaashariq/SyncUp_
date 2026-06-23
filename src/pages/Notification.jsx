import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Notifications() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    const unsub = onSnapshot(
      collection(db, "notifications", user.email, "items"),
      (snap) => {
        setNotes(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      }
    );

    return () => unsub();
  }, [user]);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🔔 Notifications</h2>

      {notes.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        notes.map((n) => (
          <div key={n.id} style={styles.card}>
            <p>{n.text}</p>
            <small>{n.type}</small>
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
  },

  card: {
    padding: "15px",
    border: "1px solid #22d3ee",
    borderRadius: "10px",
    marginBottom: "10px",
  },
};

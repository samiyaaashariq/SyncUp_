import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function ProjectMembers() {
  const { id } = useParams();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "projects", id, "members"),
      (snap) => {
        setMembers(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      }
    );

    return () => unsub();
  }, [id]);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>👥 Team Members</h2>

      {members.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>
          No members yet. Be the first to join 🚀
        </p>
      ) : (
        members.map((m) => (
          <div key={m.id} style={styles.card}>
            <p>👤 {m.email}</p>
          </div>
        ))
      )}
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
    marginBottom: "15px",
  },

  card: {
    padding: "15px",
    border: "1px solid #22d3ee",
    borderRadius: "10px",
    marginBottom: "10px",
    background: "#111827",
  },
};

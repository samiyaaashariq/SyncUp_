import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function ProjectMembers() {
  const { id } = useParams();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const ref = collection(db, "projects", id, "applications");

    const unsub = onSnapshot(ref, (snap) => {
      const accepted = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((m) => m.status === "accepted");

      setMembers(accepted);
    });

    return () => unsub();
  }, [id]);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>👥 Team Members</h2>

      {members.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>
          No approved members yet 🚀
        </p>
      ) : (
        members.map((m) => (
          <div key={m.id} style={styles.card}>
            <p>👤 {m.applicant}</p>
            <small style={{ color: "#94a3b8" }}>
              Status: {m.status}
            </small>
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

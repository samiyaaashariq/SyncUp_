import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

export default function ProjectMembers() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [members, setMembers] = useState([]);

  // GET APPLICATIONS (pending/accepted/rejected)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "projects", id, "applications"),
      (snap) => {
        setApplications(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      }
    );

    return () => unsub();
  }, [id]);

  // GET MEMBERS (only accepted users)
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

  // ACCEPT USER
  const acceptUser = async (appId, email) => {
    const ref = doc(db, "projects", id, "applications", appId);

    await updateDoc(ref, {
      status: "accepted",
    });

    // add to members collection
    await setDoc(doc(db, "projects", id, "members", email), {
      email,
      role: "member",
      joinedAt: new Date(),
    });
  };

  // REJECT USER
  const rejectUser = async (appId) => {
    const ref = doc(db, "projects", id, "applications", appId);

    await updateDoc(ref, {
      status: "rejected",
    });
  };

  return (
    <div style={styles.page}>

      <h2 style={styles.title}>👑 Project Control Panel</h2>

      {/* MEMBERS SECTION */}
      <h3 style={styles.sectionTitle}>👥 Members</h3>

      {members.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No members yet</p>
      ) : (
        members.map((m) => (
          <div key={m.id} style={styles.card}>
            <p>👤 {m.email}</p>
            <small style={{ color: "#94a3b8" }}>{m.role}</small>
          </div>
        ))
      )}

      {/* APPLICATIONS SECTION */}
      <h3 style={styles.sectionTitle}>📩 Applications</h3>

      {applications.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No applications yet</p>
      ) : (
        applications.map((a) => (
          <div key={a.id} style={styles.card}>

            <p>👤 {a.applicant}</p>
            <p>Status: {a.status}</p>

            {a.status === "pending" && (
              <div style={styles.row}>

                <button
                  onClick={() => acceptUser(a.id, a.applicant)}
                  style={styles.accept}
                >
                  ✅ Accept
                </button>

                <button
                  onClick={() => rejectUser(a.id)}
                  style={styles.reject}
                >
                  ❌ Reject
                </button>

              </div>
            )}

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
    marginBottom: "20px",
  },

  sectionTitle: {
    color: "#38bdf8",
    marginTop: "20px",
  },

  card: {
    padding: "15px",
    border: "1px solid #22d3ee",
    borderRadius: "10px",
    marginBottom: "10px",
    background: "#111827",
  },

  row: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  accept: {
    padding: "8px",
    background: "#22c55e",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
  },

  reject: {
    padding: "8px",
    background: "#ef4444",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
  },
};

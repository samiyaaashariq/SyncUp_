import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { sendNotification } from "../notifications";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

export default function ProjectMembers() {
  const { id } = useParams();

  const [members, setMembers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [project, setProject] = useState(null);

  const user = auth.currentUser;

  const isOwner = project?.createdBy === user?.email;

  /* ================= GET PROJECT ================= */
  useEffect(() => {
    const fetchProject = async () => {
      const ref = doc(db, "projects", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProject(snap.data());
      }
    };

    fetchProject();
  }, [id]);

  /* ================= GET MEMBERS ================= */
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

  /* ================= GET APPLICATIONS ================= */
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

  /* ================= ACCEPT USER ================= */
  const acceptUser = async (appId, email) => {
    if (!isOwner) return;

    const ref = doc(db, "projects", id, "applications", appId);

    await updateDoc(ref, {
      status: "accepted",
    });

    await setDoc(doc(db, "projects", id, "members", email), {
      email,
      role: "member",
      joinedAt: new Date(),
    });

    // 🔔 NOTIFICATION
    await sendNotification({
      to: email,
      text: `You were accepted into project: ${project.title}`,
      type: "accepted",
      projectId: id,
    });
  };

  /* ================= REJECT USER ================= */
  const rejectUser = async (appId, email) => {
    if (!isOwner) return;

    const ref = doc(db, "projects", id, "applications", appId);

    await updateDoc(ref, {
      status: "rejected",
    });

    // 🔔 NOTIFICATION
    await sendNotification({
      to: email,
      text: `Your application was rejected from: ${project.title}`,
      type: "rejected",
      projectId: id,
    });
  };

  /* ================= KICK MEMBER ================= */
  const kickUser = async (email) => {
    if (!isOwner) return;

    await deleteDoc(doc(db, "projects", id, "members", email));

    // 🔔 NOTIFICATION
    await sendNotification({
      to: email,
      text: `You were removed from project: ${project.title}`,
      type: "kicked",
      projectId: id,
    });
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>👑 Project Control Panel</h2>

      {/* ================= MEMBERS ================= */}
      <h3 style={styles.section}>👥 Members</h3>

      {members.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No members yet</p>
      ) : (
        members.map((m) => (
          <div key={m.id} style={styles.card}>
            <p>👤 {m.email}</p>
            <p style={{ color: "#94a3b8" }}>{m.role}</p>

            {isOwner && (
              <button
                onClick={() => kickUser(m.email)}
                style={styles.kickBtn}
              >
                ❌ Kick
              </button>
            )}
          </div>
        ))
      )}

      {/* ================= APPLICATIONS ================= */}
      <h3 style={styles.section}>📩 Applications</h3>

      {applications.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No applications yet</p>
      ) : (
        applications.map((a) => (
          <div key={a.id} style={styles.card}>
            <p>👤 {a.applicant}</p>
            <p>Status: {a.status}</p>

            {a.status === "pending" && isOwner && (
              <div style={styles.row}>
                <button
                  onClick={() => acceptUser(a.id, a.applicant)}
                  style={styles.accept}
                >
                  ✅ Accept
                </button>

                <button
                  onClick={() => rejectUser(a.id, a.applicant)}
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

  section: {
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

  kickBtn: {
    marginTop: "10px",
    padding: "6px",
    background: "#ef4444",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
  },
};

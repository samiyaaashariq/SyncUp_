import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function ProjectMembers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const ref = doc(db, "projects", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProject({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const isCreator = project && currentUser && project.creator === currentUser.email;

  const handleRemove = async (uid) => {
    if (!window.confirm("Remove this member from the project?")) return;
    try {
      const ref = doc(db, "projects", id);
      await updateDoc(ref, { members: arrayRemove(uid) });
      setProject((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m !== uid),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to remove member.");
    }
  };

  if (loading) return <div style={styles.container}><p style={styles.muted}>Loading...</p></div>;
  if (!project) return <div style={styles.container}><p style={styles.muted}>Project not found.</p></div>;

  const members = project.members || [];

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate(`/project/${id}`)}>← Back</button>

      <div style={styles.card}>
        <h1 style={styles.title}>Team Members</h1>
        <p style={styles.subtitle}>Creator: {project.creator}</p>

        {members.length === 0 ? (
          <p style={styles.muted}>No members have joined yet.</p>
        ) : (
          <div style={styles.list}>
            {members.map((uid) => (
              <div key={uid} style={styles.memberRow}>
                <span style={styles.uid}>{uid}</span>
                {isCreator && (
                  <button style={styles.removeBtn} onClick={() => handleRemove(uid)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "30px 20px", maxWidth: "700px", margin: "0 auto", color: "#fff" },
  muted: { color: "#94a3b8" },
  backBtn: {
    background: "transparent",
    border: "1px solid rgba(103,232,249,0.3)",
    color: "#67e8f9",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  card: {
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(103,232,249,0.3)",
    borderRadius: "20px",
    padding: "30px",
  },
  title: { color: "#c084fc", marginBottom: "8px" },
  subtitle: { color: "#94a3b8", marginBottom: "24px" },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  memberRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(103,232,249,0.08)",
    padding: "12px 16px",
    borderRadius: "12px",
  },
  uid: { color: "#67e8f9", fontFamily: "monospace", fontSize: "0.9rem" },
  removeBtn: {
    background: "transparent",
    color: "#f87171",
    border: "1px solid #f87171",
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
};

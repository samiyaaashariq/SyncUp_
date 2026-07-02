import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

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

  const currentUser = auth.currentUser;
  const isMember =
    project &&
    currentUser &&
    ((Array.isArray(project.members) && project.members.includes(currentUser.uid)) ||
      project.creator === currentUser.email);

  const handleJoin = async () => {
    if (!currentUser) return navigate("/login");
    setJoining(true);
    try {
      const ref = doc(db, "projects", id);
      await updateDoc(ref, {
        members: arrayUnion(currentUser.uid),
      });
      setProject((prev) => ({
        ...prev,
        members: [...(Array.isArray(prev.members) ? prev.members : []), currentUser.uid],
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to join project. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div style={styles.container}><p style={styles.muted}>Loading project...</p></div>;
  if (!project) return <div style={styles.container}><p style={styles.muted}>Project not found.</p></div>;

  const memberCount = Array.isArray(project.members) ? project.members.length : 0;

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>

      <div style={styles.card}>
        <h1 style={styles.title}>{project.title}</h1>
        <p style={styles.creator}>Created by {project.creator || "Unknown"}</p>

        <div style={styles.tags}>
          {project.tags?.map((tag, i) => (
            <span key={i} style={styles.tag}>{tag}</span>
          ))}
        </div>

        <p style={styles.desc}>{project.fullBrief || project.description || "No description provided."}</p>

        <div style={styles.metaRow}>
          <span>👥 {memberCount} member(s)</span>
          <span>📌 Status: {project.status || "Recruiting"}</span>
        </div>

        {!isMember ? (
          <button style={styles.joinBtn} onClick={handleJoin} disabled={joining}>
            {joining ? "Joining..." : "Join Project"}
          </button>
        ) : (
          <p style={styles.memberBadge}>✅ You're a member of this project</p>
        )}

        <div style={styles.actionsRow}>
          <button
            style={{
              ...styles.actionBtn,
              opacity: isMember ? 1 : 0.4,
              cursor: isMember ? "pointer" : "not-allowed",
            }}
            disabled={!isMember}
            title={!isMember ? "Only project members can access chat" : ""}
            onClick={() => isMember && navigate(`/project/${project.id}/chat`)}
          >
            💬 Chat
          </button>

          <button style={styles.actionBtn} onClick={() => navigate(`/project/${project.id}/manage`)}>
            ⚙️ Manage
          </button>

          <button style={styles.actionBtn} onClick={() => navigate(`/project/${project.id}/members`)}>
            👥 Members
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "30px 20px", maxWidth: "800px", margin: "0 auto", color: "#fff" },
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
  title: { fontSize: "2rem", color: "#c084fc", marginBottom: "8px" },
  creator: { color: "#94a3b8", marginBottom: "20px" },
  tags: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" },
  tag: {
    background: "rgba(103,232,249,0.15)",
    color: "#67e8f9",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "0.85rem",
  },
  desc: { color: "#cbd5e1", lineHeight: "1.7", marginBottom: "24px" },
  metaRow: { display: "flex", gap: "24px", color: "#94a3b8", marginBottom: "24px" },
  joinBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #ec4899, #c084fc)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "24px",
  },
  memberBadge: {
    color: "#4ade80",
    fontWeight: 600,
    marginBottom: "24px",
  },
  actionsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },
  actionBtn: {
    padding: "12px 6px",
    background: "rgba(103,232,249,0.1)",
    color: "#67e8f9",
    border: "1px solid rgba(103,232,249,0.3)",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
  },
};

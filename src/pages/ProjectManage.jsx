import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function ProjectManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("Recruiting");
  const [saving, setSaving] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const ref = doc(db, "projects", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setProject(data);
          setTitle(data.title || "");
          setDesc(data.fullBrief || data.description || "");
          setStatus(data.status || "Recruiting");
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const ref = doc(db, "projects", id);
      await updateDoc(ref, {
        title,
        fullBrief: desc,
        status,
      });
      alert("Project updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this project permanently? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to delete project.");
    }
  };

  if (loading) return <div style={styles.container}><p style={styles.muted}>Loading...</p></div>;
  if (!project) return <div style={styles.container}><p style={styles.muted}>Project not found.</p></div>;

  if (!isCreator) {
    return (
      <div style={styles.container}>
        <div style={styles.deniedCard}>
          <h2 style={{ color: "#f87171" }}>🚫 Access Denied</h2>
          <p style={styles.muted}>Only the project creator can manage this project.</p>
          <button style={styles.backBtn} onClick={() => navigate(`/project/${id}`)}>
  ← Back
</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate(`/project/${id}`)}>← Back</button>
      <div style={styles.card}>
        <h1 style={styles.title}>Manage Project</h1>

        <label style={styles.label}>Title</label>
        <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />

        <label style={styles.label}>Description</label>
        <textarea style={styles.textarea} value={desc} onChange={(e) => setDesc(e.target.value)} />

        <label style={styles.label}>Status</label>
        <select style={styles.input} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Recruiting">Recruiting</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <div style={styles.buttonRow}>
          <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button style={styles.deleteBtn} onClick={handleDelete}>
            Delete Project
          </button>
        </div>
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
  deniedCard: {
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(248,113,113,0.4)",
    borderRadius: "20px",
    padding: "40px",
    textAlign: "center",
  },
  card: {
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(103,232,249,0.3)",
    borderRadius: "20px",
    padding: "30px",
  },
  title: { color: "#c084fc", marginBottom: "24px" },
  label: { display: "block", color: "#94a3b8", marginBottom: "6px", marginTop: "16px", fontSize: "0.9rem" },
  input: {
    width: "100%",
    padding: "12px",
    background: "rgba(15,23,42,0.9)",
    border: "1px solid #67e8f9",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1rem",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    minHeight: "120px",
    background: "rgba(15,23,42,0.9)",
    border: "1px solid #67e8f9",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1rem",
    resize: "vertical",
  },
  buttonRow: { display: "flex", gap: "12px", marginTop: "28px" },
  saveBtn: {
    flex: 1,
    padding: "14px",
    background: "linear-gradient(135deg, #ec4899, #c084fc)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontWeight: 600,
    cursor: "pointer",
  },
  deleteBtn: {
    flex: 1,
    padding: "14px",
    background: "transparent",
    color: "#f87171",
    border: "1px solid #f87171",
    borderRadius: "999px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

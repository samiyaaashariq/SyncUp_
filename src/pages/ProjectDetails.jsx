import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState("");

  useEffect(() => {
    if (!id) {
      navigate("/dashboard");
      return;
    }

    const projectRef = doc(db, "projects", id);

    const unsubscribe = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        setProject(docSnap.data());
      } else {
        alert("Project not found");
        navigate("/dashboard");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, navigate]);

  const updateMilestoneStatus = async (milestoneId, newStatus) => {
    if (!project || !project.milestones) return;

    const updatedMilestones = project.milestones.map(m => 
      m.id === milestoneId ? { ...m, status: newStatus } : m
    );

    await updateDoc(doc(db, "projects", id), {
      milestones: updatedMilestones
    });
  };

  const addMilestone = async () => {
    if (!newMilestone.trim() || !project) return;

    const currentMilestones = project.milestones || [];
    await updateDoc(doc(db, "projects", id), {
      milestones: [
        ...currentMilestones,
        {
          id: Date.now(),
          name: newMilestone.trim(),
          status: "pending",
          dependsOn: [],
        }
      ]
    });

    setNewMilestone("");
  };

  if (loading) return <div style={styles.loading}>Loading project...</div>;

  const milestones = project?.milestones || [
    { id: 1, name: "Planning", status: "completed", dependsOn: [] },
    { id: 2, name: "Design", status: "completed", dependsOn: [1] },
    { id: 3, name: "Development", status: "in-progress", dependsOn: [2] },
    { id: 4, name: "Testing", status: "pending", dependsOn: [3] },
    { id: 5, name: "Launch", status: "pending", dependsOn: [4] },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.glow} />

      <div style={styles.content}>
        <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>← Back</button>

        <h1 style={styles.title}>{project?.name}</h1>
        <p style={styles.status}>Status: <strong>{project?.status}</strong></p>

        <div style={styles.description}>
          <h2>Description</h2>
          <p>{project?.description}</p>
        </div>

        {/* Milestone Dependency Graph */}
        <div style={styles.graphSection}>
          <h2>Project Milestone Dependency Graph</h2>
          <div style={styles.graph}>
            {milestones.map((milestone) => (
              <div key={milestone.id} style={styles.nodeContainer}>
                <div style={{
                  ...styles.node,
                  background: milestone.status === "completed" ? "#34d399" : milestone.status === "in-progress" ? "#60a5fa" : "#94a3b8",
                }}>
                  {milestone.name}
                </div>
                <div style={styles.statusButtons}>
                  <button onClick={() => updateMilestoneStatus(milestone.id, "pending")} style={styles.statusBtn}>Pending</button>
                  <button onClick={() => updateMilestoneStatus(milestone.id, "in-progress")} style={styles.statusBtn}>In Progress</button>
                  <button onClick={() => updateMilestoneStatus(milestone.id, "completed")} style={styles.statusBtn}>Completed</button>
                </div>
                {milestone.dependsOn.length > 0 && (
                  <div style={styles.dependencyLine} />
                )}
              </div>
            ))}
          </div>

          {/* Add new milestone */}
          <div style={styles.addMilestone}>
            <input
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder="New milestone name"
              style={styles.milestoneInput}
            />
            <button onClick={addMilestone} style={styles.addBtn}>+ Add Milestone</button>
          </div>
        </div>

        <div style={styles.actions}>
          <button style={styles.primaryBtn} onClick={() => navigate(`/chat/${id}`)}>
            💬 Open Chat
          </button>
          <button style={styles.secondaryBtn} onClick={() => alert("Manage project")}>
            Manage Project
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====================== STYLES (Mobile Responsive) ====================== */
const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "linear-gradient(135deg, #0b1020 0%, #0f172a 45%, #050814 100%)",
    color: "#fff",
    padding: "40px 20px",
    position: "relative",
  },
  glow: {
    position: "absolute",
    inset: 0,
    background: `radial-gradient(circle at 20% 20%, rgba(236,72,153,0.15), transparent 60%), 
                 radial-gradient(circle at 80% 30%, rgba(79,140,255,0.12), transparent 70%)`,
    zIndex: 0,
  },
  content: {
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  backBtn: {
    padding: "10px 18px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "999px",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "32px",
  },
  title: {
    fontSize: "32px",
    background: "linear-gradient(90deg, #ec4899, #4f8cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px",
  },
  status: {
    color: "#34d399",
    fontSize: "15px",
    marginBottom: "32px",
  },
  description: {
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(79,140,255,0.25)",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "32px",
  },
  graphSection: {
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(79,140,255,0.25)",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "32px",
  },
  graph: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    overflowX: "auto",
    padding: "20px 0",
  },
  nodeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    minWidth: "160px",
  },
  node: {
    width: "160px",
    padding: "18px",
    borderRadius: "14px",
    textAlign: "center",
    fontWeight: 600,
    color: "#fff",
    boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
    position: "relative",
    zIndex: 2,
  },
  dependencyLine: {
    position: "absolute",
    top: "50%",
    left: "-40px",
    width: "40px",
    height: "3px",
    background: "rgba(148,163,184,0.6)",
    zIndex: 1,
  },
  statusButtons: {
    display: "flex",
    gap: "6px",
    marginTop: "8px",
    flexWrap: "wrap",
  },
  statusBtn: {
    padding: "4px 8px",
    fontSize: "12px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },
  addMilestone: {
    marginTop: "24px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  milestoneInput: {
    flex: 1,
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid rgba(79,140,255,0.3)",
    background: "rgba(15,23,42,0.8)",
    color: "#fff",
  },
  addBtn: {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #ec4899, #4f8cff)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 600,
  },
  actions: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    padding: "14px 32px",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg, #ec4899, #4f8cff)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "14px 28px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },
};

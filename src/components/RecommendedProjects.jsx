import React from "react";
import { useNavigate } from "react-router-dom";

const recommendedProjects = [
  {
    id: 1,
    title: "AI Resume Analyzer",
    description: "Upload resume → Get instant feedback, ATS score & improvement suggestions using Gemini AI.",
    tags: ["React", "Firebase", "Gemini"],
    difficulty: "Medium",
    time: "3 weeks",
    matchScore: 92,
  },
  {
    id: 2,
    title: "AR/VR Learning Hub",
    description: "Interactive platform to learn AR/VR concepts with hands-on 3D projects and team collaboration.",
    tags: ["React", "Three.js", "Firebase"],
    difficulty: "Hard",
    time: "6 weeks",
    matchScore: 88,
  },
];

export default function RecommendedProjects() {
  const navigate = useNavigate();

  const launchIdea = (project) => {
    navigate("/ai-copilot", { state: { idea: project.description } });
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Recommended Projects</h2>
      
      <div style={styles.grid}>
        {recommendedProjects.map((proj) => (
          <div key={proj.id} style={styles.card}>
            <div style={styles.match}>{proj.matchScore}% Match</div>
            
            <h3 style={styles.title}>{proj.title}</h3>
            <p style={styles.desc}>{proj.description}</p>

            <div style={styles.tags}>
              {proj.tags.map((tag, i) => (
                <span key={i} style={styles.tag}>{tag}</span>
              ))}
            </div>

            <div style={styles.meta}>
              <span>⭐ {proj.difficulty}</span>
              <span>⏱ {proj.time}</span>
            </div>

            <button onClick={() => launchIdea(proj)} style={styles.launchBtn}>
              Launch Idea with AI
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  section: { padding: "20px 0" },
  heading: { 
    fontSize: "1.8rem", 
    background: "linear-gradient(90deg, #67e8f9, #c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "24px" 
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
    gap: "20px" 
  },
  card: {
    background: "rgba(15,23,42,0.95)",
    border: "1px solid rgba(103,232,249,0.3)",
    borderRadius: "20px",
    padding: "24px",
    position: "relative",
  },
  match: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "#22d3ee",
    color: "#000",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: 700,
  },
  title: { fontSize: "1.4rem", marginBottom: "12px", color: "#c084fc" },
  desc: { color: "#cbd5e1", lineHeight: "1.6", marginBottom: "20px" },
  tags: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" },
  tag: {
    background: "rgba(103,232,249,0.15)",
    color: "#67e8f9",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "0.8rem",
  },
  meta: { display: "flex", gap: "20px", color: "#94a3b8", marginBottom: "20px" },
  launchBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #ec4899, #c084fc)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

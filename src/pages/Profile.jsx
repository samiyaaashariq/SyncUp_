import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projectsCount, setProjectsCount] = useState(0);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.glow} />

      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.avatar}>
            {user?.email?.[0].toUpperCase() || "👤"}
          </div>
          <div>
            <h1 style={styles.name}>{user?.email?.split('@')[0] || "Builder"}</h1>
            <p style={styles.email}>{user?.email}</p>
          </div>
        </div>

        <div style={styles.stats}>
          <div style={styles.statItem}>
            <h3>Projects Joined</h3>
            <p style={styles.statNumber}>{projectsCount}</p>
          </div>
          <div style={styles.statItem}>
            <h3>Connections</h3>
            <p style={styles.statNumber}>12</p>
          </div>
          <div style={styles.statItem}>
            <h3>Badges Earned</h3>
            <p style={styles.statNumber}>5</p>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>My Projects</h2>
          <p style={{ color: "#b7c0d1", textAlign: "center" }}>No projects yet. Start one from the dashboard!</p>
        </div>

        <div style={styles.actions}>
          <button style={styles.primaryBtn} onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
          <button style={styles.secondaryBtn} onClick={() => auth.signOut().then(() => navigate("/"))}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====================== PREMIUM STYLES ====================== */
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
  header: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "48px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ec4899, #4f8cff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: 700,
  },
  name: {
    fontSize: "28px",
    fontWeight: 700,
  },
  email: {
    color: "#b7c0d1",
    fontSize: "15px",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginBottom: "60px",
  },
  statItem: {
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(79,140,255,0.25)",
    borderRadius: "20px",
    padding: "24px",
    textAlign: "center",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#ec4899",
    margin: "8px 0 0",
  },
  section: {
    marginBottom: "60px",
  },
  sectionTitle: {
    fontSize: "24px",
    marginBottom: "20px",
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

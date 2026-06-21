import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  // AUTH SAFE LISTENER
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // REALTIME PROJECTS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snap) => {
      setProjects(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  // CREATE PROJECT
  const createProject = async () => {
    const title = prompt("Enter project title");
    const description = prompt("Enter project description");

    if (!title || !description) return;

    await addDoc(collection(db, "projects"), {
      title,
      description,
      tech: "React • Firebase",
      createdBy: user?.email,
    });
  };

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.logoBox}>
          <span style={styles.logo}>📊</span>
          <span style={styles.brand}>SyncUp</span>
        </div>

        <p style={styles.email}>{user?.email}</p>

        <div style={styles.nav}>
          <div style={styles.navItem} onClick={() => nav("/dashboard")}>
            Dashboard
          </div>

          <div style={styles.navItem} onClick={() => nav("/chat")}>
            AI Chat
          </div>

          <div style={styles.navItem} onClick={() => nav("/profile")}>
            Profile
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* HEADER */}
        <div style={styles.headerCard}>
          <h1 style={styles.title}>Welcome back 👋</h1>
          <p style={styles.subText}>{user?.email}</p>
          <p style={styles.muted}>Build. Collaborate. Grow.</p>
        </div>

        {/* FEATURED */}
        <h2 style={styles.sectionTitle}>🔥 Featured Projects</h2>

        <div style={styles.grid}>
          {projects.map((p) => (
            <div key={p.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{p.title}</h3>
              <p style={styles.cardDesc}>{p.description}</p>
              <small style={styles.tech}>{p.tech}</small>

              <div style={styles.cardActions}>
                <button style={styles.btnPrimary} onClick={() => nav("/chat")}>
                  Discuss
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div style={styles.actionCard}>
          <h3 style={styles.sectionTitle}>⚡ Quick Actions</h3>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button style={styles.btnPrimary} onClick={() => nav("/chat")}>
              Open Chat
            </button>

            <button style={styles.btnGreen} onClick={createProject}>
              Create Project
            </button>
          </div>
        </div>

        {/* INTERESTS */}
        <h3 style={styles.sectionTitle}>🎯 Your Interests</h3>

        <div style={styles.tags}>
          {["AI", "Web Dev", "ML", "Cybersecurity", "App Dev"].map((t, i) => (
            <span key={i} style={styles.tag}>
              {t}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    background: "linear-gradient(135deg, #e0f2fe, #f8fafc, #eef2ff)",
    color: "#0f172a",
  },

  sidebar: {
    width: "260px",
    background: "#0f172a",
    color: "white",
    padding: "20px",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "18px",
    fontWeight: "800",
  },

  logo: {
    fontSize: "20px",
  },

  brand: {
    fontWeight: "800",
  },

  email: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "10px",
  },

  nav: {
    marginTop: "30px",
  },

  navItem: {
    padding: "10px",
    cursor: "pointer",
    color: "#cbd5e1",
  },

  main: {
    flex: 1,
    padding: "30px",
  },

  headerCard: {
    background: "white",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },

  title: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0f172a",
  },

  subText: {
    color: "#111827",
    fontWeight: "600",
  },

  muted: {
    color: "#334155",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "800",
    margin: "20px 0 10px",
    color: "#0f172a",
  },

  grid: {
    display: "grid",
    gap: "15px",
  },

  card: {
    background: "white",
    padding: "16px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },

  cardTitle: {
    fontWeight: "800",
    color: "#0f172a",
  },

  cardDesc: {
    color: "#1f2937",
    marginTop: "5px",
  },

  tech: {
    color: "#334155",
  },

  cardActions: {
    marginTop: "10px",
  },

  btnPrimary: {
    padding: "8px 12px",
    background: "#0ea5e9",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  btnGreen: {
    padding: "8px 12px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  actionCard: {
    marginTop: "25px",
    background: "white",
    padding: "20px",
    borderRadius: "14px",
  },

  tags: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  tag: {
    background: "#e0f2fe",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
};

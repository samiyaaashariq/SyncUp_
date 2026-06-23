import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { sendNotification } from "../notifications";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [projects, setProjects] = useState([]);

  // AUTH
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
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

  // FILTER
  const filteredProjects = projects.filter((p) => {
    const text = search.toLowerCase();

    const matchSearch =
      p.title?.toLowerCase().includes(text) ||
      p.description?.toLowerCase().includes(text) ||
      p.techStack?.toLowerCase().includes(text) ||
      p.roleNeeded?.toLowerCase().includes(text);

    const matchTag =
      selectedTag === "" ||
      p.roleNeeded?.toLowerCase().includes(selectedTag) ||
      p.techStack?.toLowerCase().includes(selectedTag);

    return matchSearch && matchTag;
  });

  // CREATE PROJECT
  const createProject = async () => {
    if (!user?.email) return;

    const title = prompt("Project title");
    const description = prompt("Project description");
    const roleNeeded = prompt("Role Needed");
    const techStack = prompt("Tech Stack");

    if (!title || !description) return;

    await addDoc(collection(db, "projects"), {
      title,
      description,
      roleNeeded,
      techStack,
      createdBy: user.email,
      membersCount: 0,
    });
  };

  // APPLY (FIXED + SAFE)
  const applyToProject = async (project) => {
  if (!user?.email) return;

  await addDoc(collection(db, "projects", project.id, "applications"), {
    applicant: user.email,
    status: "pending",
    createdAt: new Date(),
  });

  await sendNotification({
    to: project.createdBy,
    text: `${user.email} applied to ${project.title}`,
    type: "apply",
    projectId: project.id,
  });

  alert("Applied successfully 🚀");
};

      // notification
      await sendNotification({
        to: project.createdBy,
        text: `${user.email} applied to ${project.title}`,
        type: "apply",
        projectId: project.id,
      });

      alert("Application sent!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>📊 SyncUp</h2>
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

          <div style={styles.navItem} onClick={() => nav("/notifications")}>
            Notifications 🔔
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* HERO */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>🚀 Welcome to SyncUp</h1>

          <p style={styles.heroText}>
            Find teammates, join projects, collaborate, and build real-world experience.
          </p>

          <p style={{ color: "#94a3b8" }}>
            Logged in: {user?.email}
          </p>

          <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
            <button onClick={createProject} style={styles.btnGreen}>
              + Create Project
            </button>

            <button
              onClick={() => nav("/chat")}
              style={styles.btn}
            >
              Open AI Chat
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        {/* PROJECT LIST */}
        <h3 style={styles.heading}>🔥 Featured Projects</h3>

        {filteredProjects.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No projects found</p>
        ) : (
          filteredProjects.map((p) => (
            <div key={p.id} style={styles.card}>

              <h3 style={{ color: "#22d3ee" }}>{p.title}</h3>

              <p>{p.description}</p>

              <p>👤 {p.createdBy}</p>
              <p>🎯 {p.roleNeeded}</p>
              <p>⚙️ {p.techStack}</p>

              {/* 🔥 ALL ACTION BUTTONS RESTORED */}
              <div style={styles.actions}>

                <button
                  onClick={() => applyToProject(p)}
                  style={styles.btn}
                >
                  🚀 Apply
                </button>

                <button
                  onClick={() => nav(`/chat/${p.id}`)}
                  style={styles.btnAlt}
                >
                  👥 Team Chat
                </button>

                <button
                  onClick={() => nav(`/members/${p.id}`)}
                  style={styles.btn}
                >
                  👥 Members
                </button>

                <button
                  onClick={() => nav(`/manage/${p.id}`)}
                  style={styles.btnAlt}
                >
                  👑 Manage
                </button>

                <button
                  onClick={() => nav(`/project/${p.id}`)}
                  style={styles.btn}
                >
                  📄 Details
                </button>

              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#0b1120", color: "#fff" },
  sidebar: { width: "260px", padding: "20px", background: "#111827" },
  logo: { color: "#22d3ee" },
  email: { fontSize: "12px", color: "#94a3b8" },
  navItem: { padding: "10px", cursor: "pointer" },

  main: { flex: 1, padding: "20px" },

  hero: {
    padding: "20px",
    border: "1px solid #22d3ee",
    borderRadius: "12px",
    marginBottom: "15px",
  },

  heroTitle: { color: "#22d3ee" },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },

  heading: { color: "#22d3ee" },

  card: {
    border: "1px solid #22d3ee",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
  },

  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
    flexWrap: "wrap",
  },

  btn: {
    padding: "8px 10px",
    background: "#22d3ee",
    border: "none",
    borderRadius: "6px",
  },

  btnAlt: {
    padding: "8px 10px",
    background: "#8b5cf6",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
  },

  btnGreen: {
    padding: "10px",
    background: "#22d3ee",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
  },
};

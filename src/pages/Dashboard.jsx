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
    const description = prompt("Description");
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
      applicationsCount: 0,
      views: 0,
    });
  };

  // APPLY (FIXED)
  const applyToProject = async (project) => {
    if (!user?.email) return;

    try {
      await addDoc(
        collection(db, "projects", project.id, "applications"),
        {
          applicant: user.email,
          status: "pending",
          createdAt: new Date(),
        }
      );

      // notification
      await sendNotification({
        to: project.createdBy,
        text: `${user.email} applied to ${project.title}`,
        type: "apply",
        projectId: project.id,
      });

      alert("Applied successfully!");
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
        <h1 style={styles.heroTitle}>🚀 SyncUp Dashboard</h1>

        <button onClick={createProject} style={styles.btn}>
          Create Project
        </button>

        {/* SEARCH */}
        <input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        {/* PROJECTS */}
        {filteredProjects.map((p) => (
          <div key={p.id} style={styles.card}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p>👤 {p.createdBy}</p>

            <button
              onClick={() => applyToProject(p)}
              style={styles.btn}
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#0b1120", color: "#fff" },
  sidebar: { width: "250px", background: "#111827", padding: "20px" },
  logo: { color: "#22d3ee" },
  email: { fontSize: "12px", color: "#94a3b8" },
  navItem: { padding: "10px", cursor: "pointer" },
  main: { flex: 1, padding: "20px" },
  heroTitle: { color: "#22d3ee" },
  card: { padding: "15px", border: "1px solid #22d3ee", marginBottom: "10px" },
  btn: { padding: "8px 12px", marginTop: "10px" },
  input: { padding: "10px", margin: "10px 0", width: "100%" },
};

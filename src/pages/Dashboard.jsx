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

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  /* ================= PROJECTS REALTIME ================= */
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

  /* ================= FILTER ================= */
  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack?.toLowerCase().includes(search.toLowerCase()) ||
      p.roleNeeded?.toLowerCase().includes(search.toLowerCase());

    const matchTag =
      selectedTag === "" ||
      p.roleNeeded?.toLowerCase().includes(selectedTag.toLowerCase()) ||
      p.techStack?.toLowerCase().includes(selectedTag.toLowerCase());

    return matchSearch && matchTag;
  });

  /* ================= CREATE PROJECT ================= */
  const createProject = async () => {
    if (!user?.email) return;

    const title = prompt("Enter project title");
    const description = prompt("Enter project description");
    const roleNeeded = prompt("Role Needed");
    const techStack = prompt("Tech Stack");

    if (!title || !description) return;

    await addDoc(collection(db, "projects"), {
      title,
      description,
      roleNeeded,
      techStack,
      createdBy: user.email,
    });
  };

  /* ================= LIKE ================= */
  const toggleLike = async (projectId) => {
    if (!user?.email) return;

    const likeRef = doc(db, "projects", projectId, "likes", user.email);

    const likesSnap = await getDocs(
      collection(db, "projects", projectId, "likes")
    );

    const alreadyLiked = likesSnap.docs.some(
      (d) => d.id === user.email
    );

    if (alreadyLiked) {
      await deleteDoc(likeRef);
    } else {
      await setDoc(likeRef, {
        user: user.email,
      });
    }
  };

  /* ================= COMMENT ================= */
  const addComment = async (projectId) => {
    if (!user?.email) return;

    const text = prompt("Write comment");
    if (!text) return;

    await addDoc(collection(db, "projects", projectId, "comments"), {
      text,
      user: user.email,
      createdAt: new Date(),
    });
  };

  /* ================= APPLY (FIXED) ================= */
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

      await sendNotification({
        to: project.createdBy,
        text: `${user.email} applied to your project ${project.title}`,
        type: "apply",
        projectId: project.id,
      });

      alert("🎉 Applied successfully!");
    } catch (err) {
      console.error(err);
      alert("Error applying");
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

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button onClick={createProject} style={styles.btnGreen}>
              Create Project
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            style={styles.input}
          >
            <option value="">All</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="ui">UI/UX</option>
            <option value="ai">AI</option>
          </select>
        </div>

        {/* PROJECTS */}
        <h3 style={styles.heading}>🔥 Projects</h3>

        {filteredProjects.map((p) => (
          <div key={p.id} style={styles.card}>

            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p>Role: {p.roleNeeded}</p>
            <p>Tech: {p.techStack}</p>

            <div style={styles.actions}>

              <button onClick={() => toggleLike(p.id)} style={styles.btn}>
                ❤️ Like
              </button>

              <button onClick={() => addComment(p.id)} style={styles.btn}>
                💬 Comment
              </button>

              <button
                onClick={() => applyToProject(p)}
                style={styles.btnGreen}
              >
                🚀 Apply
              </button>

              <button
                onClick={() => nav(`/chat/${p.id}`)}
                style={styles.btnAlt}
              >
                Team Chat
              </button>

              <button
                onClick={() => nav(`/members/${p.id}`)}
                style={styles.btnAlt}
              >
                Members
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#0b1120", color: "#fff" },
  sidebar: { width: "250px", padding: "20px", background: "#111827" },
  main: { flex: 1, padding: "20px" },
  logo: { color: "#22d3ee" },
  email: { fontSize: "12px", color: "#94a3b8" },
  navItem: { padding: "10px", cursor: "pointer" },
  hero: { marginBottom: "20px" },
  heroTitle: { color: "#22d3ee" },
  heading: { color: "#22d3ee" },
  card: { padding: "15px", border: "1px solid #22d3ee", marginBottom: "10px" },
  actions: { display: "flex", gap: "10px", marginTop: "10px" },
  btn: { padding: "8px", background: "#22d3ee", border: "none" },
  btnGreen: { padding: "8px", background: "#22c55e", border: "none" },
  btnAlt: { padding: "8px", background: "#8b5cf6", border: "none", color: "#fff" },
  input: { padding: "8px", flex: 1 },
};

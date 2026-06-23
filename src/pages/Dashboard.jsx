import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
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

  // CREATE PROJECT
  const createProject = async () => {
    const title = prompt("Enter project title");
    const description = prompt("Enter project description");
    const roleNeeded = prompt("Role Needed (Frontend, Backend, UI/UX, AI etc.)");
    const techStack = prompt("Tech Stack");

    if (!title || !description) return;

   await addDoc(collection(db, "projects"), {
  title,
  description,
  roleNeeded,
  techStack,
  createdBy: user?.email,
});
  };

  // LIKE TOGGLE
  const toggleLike = async (projectId) => {
    const likeRef = doc(db, "projects", projectId, "likes", user?.email);

    const likesSnap = await getDocs(
      collection(db, "projects", projectId, "likes")
    );

    const alreadyLiked = likesSnap.docs.some(
      (d) => d.id === user?.email
    );

    if (alreadyLiked) {
      await deleteDoc(likeRef);
    } else {
      await setDoc(likeRef, {
        user: user?.email,
      });
    }
  };

  // COMMENT
  const addComment = async (projectId) => {
    const text = prompt("Write your comment");
    if (!text) return;

    await addDoc(collection(db, "projects", projectId, "comments"), {
      text,
      user: user?.email,
      createdAt: new Date(),
    });
  };
  const applyToProject = async (project) => {
  try {
    await addDoc(collection(db, "applications"), {
      applicant: user?.email,
      projectId: project.id,
      projectTitle: project.title,
      createdAt: new Date(),
    });

    alert("🎉 Application submitted successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to apply.");
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
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* HEADER */}
        {/* HERO SECTION */}
<div style={styles.hero}>
  <h1 style={styles.heroTitle}>
    🚀 Welcome to SyncUp
  </h1>

  <p style={styles.heroText}>
    Find teammates, join exciting projects, collaborate with students,
    and build real-world experience together.
  </p>

  <p style={{ color: "#94a3b8", marginTop: "10px" }}>
  Logged in as: {user?.email}
</p>
  
  <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
    <button onClick={createProject} style={styles.btnGreen}>
      Create Project
    </button>

    <button
      onClick={() => window.scrollTo({
        top: 500,
        behavior: "smooth"
      })}
      style={styles.btn}
    >
      Explore Projects
    </button>
  </div>
</div>

        {/* PROJECTS */}
        <h3 style={styles.heading}>🔥 Featured Projects</h3>

   {projects.map((p) => (
  {projects.length === 0 ? (
  <div style={{ color: "#94a3b8", padding: "20px" }}>
    No projects yet. Be the first to create one 🚀
  </div>
) : (
  projects.map((p) => (
    <div key={p.id} style={styles.card}>

      {/* TITLE */}
      <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#22d3ee" }}>
        {p.title}
      </h2>

      {/* META INFO */}
      <p style={{ color: "#94a3b8", fontSize: "13px" }}>
        👤 {p.createdBy}
      </p>

      <p style={{ color: "#22d3ee", fontSize: "13px" }}>
        🎯 Looking For: {p.roleNeeded}
      </p>

      <p style={{ color: "#cbd5e1", fontSize: "13px" }}>
        ⚙️ Tech Stack: {p.techStack}
      </p>

      {/* DESCRIPTION (TRUNCATED) */}
      <p style={{ marginTop: "8px", color: "#e2e8f0", fontSize: "14px" }}>
        {p.description?.length > 140
          ? p.description.slice(0, 140) + "..."
          : p.description}
      </p>

      {/* TAGS (NEW UX UPGRADE) */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
        {p.techStack?.split(",").map((tag, i) => (
          <span
            key={i}
            style={{
              background: "#164e63",
              color: "#22d3ee",
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: "600",
            }}
          >
            #{tag.trim()}
          </span>
        ))}
      </div>

      {/* ACTIONS (UNCHANGED) */}
      <div style={styles.actions}>

        <button onClick={() => toggleLike(p.id)} style={styles.btn}>
          ❤️ Like
        </button>

        <button onClick={() => addComment(p.id)} style={styles.btn}>
          💬 Comment
        </button>

        <button onClick={() => applyToProject(p)} style={styles.btn}>
          🚀 Apply to Join
        </button>

        <button
          onClick={() => nav(`/chat/${p.id}`)}
          style={styles.btnAlt}
        >
          👥 View Team Room
        </button>

      </div>
    </div>
  ))
)}
            {/* ACTIONS */}
            <div style={styles.actions}>

              <button
                onClick={() => toggleLike(p.id)}
                style={styles.btn}
              >
                ❤️ Like
              </button>

              <button
                onClick={() => addComment(p.id)}
                style={styles.btn}
              >
                💬 Comment
              </button>
              <button
  onClick={() => applyToProject(p)}
  style={styles.btn}
>
  🚀 Apply to Join
</button>

<button
  onClick={() => nav(`/chat/${p.id}`)}
  style={styles.btnAlt}
>
  👥 View Team Room
</button>

             
            </div>
          </div>
        ))}

        {/* QUICK ACTIONS */}
        <div style={styles.quick}>
          <h3>⚡ Quick Actions</h3>

          <button onClick={() => nav("/chat")} style={styles.btn}>
            Open AI Chat
          </button>

          <button onClick={createProject} style={styles.btnGreen}>
            Create Project
          </button>
        </div>

        {/* INTERESTS */}
        <h3 style={styles.heading}>🎯 Your Interests</h3>

        <div style={styles.tags}>
          {["AI", "Web Dev", "ML", "Cybersecurity", "App Dev"].map((t) => (
            <span key={t} style={styles.tag}>
              {t}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}

/* =================== STYLES (UNCHANGED THEME) =================== */
const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    background: "#0b1120",
    color: "#f8fafc",
  },

  sidebar: {
    width: "260px",
    background: "#111827",
    color: "white",
    padding: "20px",
    borderRight: "1px solid #22d3ee",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "900",
    color: "#22d3ee",
  },

  email: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  nav: {
    marginTop: "30px",
  },

  navItem: {
    padding: "12px",
    cursor: "pointer",
    color: "#cbd5e1",
    borderRadius: "8px",
  },

  main: {
    flex: 1,
    padding: "30px",
  },

  heading: {
    fontWeight: "800",
    margin: "20px 0 10px",
    color: "#22d3ee",
  },

  hero: {
    background: "#111827",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "25px",
    border: "1px solid #22d3ee",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
  },

  heroTitle: {
    fontSize: "34px",
    fontWeight: "900",
    color: "#22d3ee",
    marginBottom: "10px",
  },

  heroText: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#cbd5e1",
    maxWidth: "700px",
  },

  card: {
    background: "#111827",
    border: "1px solid #22d3ee",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
    flexWrap: "wrap",
  },

  btn: {
    padding: "10px 14px",
    background: "#22d3ee",
    color: "#0b1120",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  btnAlt: {
    padding: "10px 14px",
    background: "#8b5cf6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  btnGreen: {
    padding: "10px 14px",
    background: "#22d3ee",
    color: "#0b1120",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  quick: {
    marginTop: "25px",
    background: "#111827",
    border: "1px solid #22d3ee",
    padding: "20px",
    borderRadius: "16px",
  },

  tags: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  tag: {
    background: "#164e63",
    color: "#22d3ee",
    padding: "8px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
};

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

    if (!title || !description) return;

    await addDoc(collection(db, "projects"), {
      title,
      description,
      tech: "React • Firebase",
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

  <p style={{ color: "#475569", marginTop: "10px" }}>
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
          <div key={p.id} style={styles.card}>

            <h3 style={{ marginBottom: "10px" }}>
  {p.title}
</h3>

<p style={{ marginBottom: "12px" }}>
  {p.description}
</p>

<p>
  <strong>Skills Needed:</strong> {p.tech}
</p>

<p>
  <strong>Created By:</strong> {p.createdBy}
</p>
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
                onClick={() => nav(`/chat/${p.id}`)}
                style={styles.btnAlt}
              >
                View Team Room
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
    background: "linear-gradient(135deg, #ffe4ec, #ffffff, #fff0f5)",
    color: "#0f172a",
  },

  sidebar: {
    width: "260px",
    background: "#0f172a",
    color: "white",
    padding: "20px",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "800",
  },

  email: {
    fontSize: "12px",
    color: "#94a3b8",
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

  header: {
    background: "white",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "20px",
  },

  heading: {
    fontWeight: "800",
    margin: "20px 0 10px",
  },

  card: {
    background: "white",
    padding: "16px",
    borderRadius: "14px",
    marginBottom: "15px",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  btn: {
    padding: "8px 12px",
    background: "#0ea5e9",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  btnAlt: {
    padding: "8px 12px",
    background: "#6366f1",
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

  quick: {
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
  hero: {
  background: "white",
  padding: "30px",
  borderRadius: "20px",
  marginBottom: "25px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
},

heroTitle: {
  fontSize: "34px",
  fontWeight: "900",
  marginBottom: "10px",
  color: "#0f172a",
},

heroText: {
  fontSize: "16px",
  lineHeight: "1.8",
  color: "#475569",
  maxWidth: "700px",
},
};

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [commentText, setCommentText] = useState({});

  // SAFE AUTH LISTENER (fixes blank screen issues)
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // REAL-TIME PROJECTS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snapshot) => {
      setProjects(
        snapshot.docs.map((d) => ({
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
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter" }}>

      {/* SIDEBAR (RESTORED) */}
      <div
        style={{
          width: "250px",
          background: "#0f172a",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>📊 SyncUp</h2>

        <p style={{ fontSize: "12px", color: "#94a3b8" }}>
          {user?.email}
        </p>

        <div style={{ marginTop: "30px" }}>
          <div onClick={() => nav("/dashboard")} style={{ cursor: "pointer", padding: 10 }}>
            Dashboard
          </div>

          <div onClick={() => nav("/chat")} style={{ cursor: "pointer", padding: 10 }}>
            AI Chat
          </div>

          <div onClick={() => nav("/profile")} style={{ cursor: "pointer", padding: 10 }}>
            Profile
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "25px", background: "#f1f5f9" }}>

        {/* HEADER */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <h2>Welcome back 👋</h2>
          <p>{user?.email}</p>
        </div>

        {/* FEATURED PROJECTS HEADING (RESTORED) */}
        <h2 style={{ marginBottom: "15px" }}>
          🔥 Featured Projects
        </h2>

        {/* PROJECT FEED */}
        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              background: "white",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "12px",
            }}
          >
            <h3>{p.title}</h3>
            <p>{p.description}</p>

            <small>{p.tech}</small>

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => nav("/chat")} style={{ marginRight: 10 }}>
                Discuss
              </button>
            </div>
          </div>
        ))}

        {/* QUICK ACTIONS (RESTORED) */}
        <div
          style={{
            marginTop: "25px",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>⚡ Quick Actions</h3>

          <button onClick={() => nav("/chat")} style={{ marginRight: 10 }}>
            Open Chat
          </button>

          <button onClick={createProject}>
            Create Project
          </button>
        </div>

        {/* INTERESTS (RESTORED) */}
        <h3 style={{ marginTop: "25px" }}>🎯 Your Interests</h3>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["AI", "Web Dev", "ML", "Cybersecurity"].map((i, idx) => (
            <span
              key={idx}
              style={{
                background: "#e0f2fe",
                padding: "6px 10px",
                borderRadius: "20px",
              }}
            >
              {i}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

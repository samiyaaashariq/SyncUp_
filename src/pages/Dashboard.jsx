import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const nav = useNavigate();
  const user = auth.currentUser;

  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async () => {
    const title = prompt("Enter project title");
    const description = prompt("Enter project description");
    if (!title || !description) return;

    await addDoc(collection(db, "projects"), {
      title,
      description,
      tech: "React • Firebase",
    });

    fetchProjects();
  };

  const applyToProject = async (projectId) => {
    await addDoc(collection(db, "projects", projectId, "applicants"), {
      name: user?.email,
      appliedAt: new Date(),
    });

    alert("Applied successfully 🚀");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Inter, Arial, sans-serif",
        background: "#f8fafc",
        color: "#0f172a",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "260px",
          background: "#0b1220",
          color: "#e2e8f0",
          padding: "20px",
        }}
      >
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "800",
            color: "#fff",
          }}
        >
          <span
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            📊
          </span>
          SyncUp
        </h2>

        <p style={{ fontSize: "12px", color: "#94a3b8" }}>
          {user?.email}
        </p>

        <div style={{ marginTop: "30px" }}>
          <div
            onClick={() => nav("/dashboard")}
            style={{
              padding: "10px",
              cursor: "pointer",
              color: "#cbd5e1",
            }}
          >
            Dashboard
          </div>

          {/* FIXED: AI CHAT ONLY */}
          <div
            onClick={() => nav("/chat")}
            style={{
              padding: "10px",
              cursor: "pointer",
              color: "#cbd5e1",
            }}
          >
            AI Chat
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "30px" }}>
        {/* HEADER */}
        <div
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "14px",
            marginBottom: "20px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h1 style={{ fontSize: "18px", fontWeight: "700" }}>
            Welcome back 👋
          </h1>

          <p style={{ fontWeight: "500", color: "#334155" }}>
            {user?.email}
          </p>

          <p style={{ color: "#64748b", fontSize: "13px" }}>
            Build projects. Connect. Grow.
          </p>
        </div>

        {/* PROJECTS */}
        <h2 style={{ fontWeight: "800", marginBottom: "12px" }}>
          🔥 Featured Projects
        </h2>

        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#ffffff",
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ fontWeight: "700" }}>{p.title}</h3>

            <p style={{ color: "#475569" }}>{p.description}</p>

            <small style={{ color: "#64748b" }}>{p.tech}</small>

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => applyToProject(p.id)}
                style={{
                  marginRight: "10px",
                  padding: "8px 12px",
                  background: "#0ea5e9",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Apply
              </button>

              {/* FIXED: PROJECT CHAT WITH ID */}
              <button
                onClick={() => nav(`/chat/${p.id}`)}
                style={{
                  padding: "8px 12px",
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Discuss
              </button>
            </div>
          </div>
        ))}

        {/* QUICK ACTIONS */}
        <div
          style={{
            marginTop: "25px",
            background: "#ffffff",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3 style={{ fontWeight: "700" }}>⚡ Quick Actions</h3>

          <button
            onClick={() => nav("/chat")}
            style={{
              marginRight: "10px",
              padding: "10px 14px",
              background: "#0ea5e9",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Open AI Chat
          </button>

          <button
            onClick={createProject}
            style={{
              padding: "10px 14px",
              background: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Create Project
          </button>
        </div>

        {/* INTERESTS (FIXED VISIBILITY) */}
        <h2 style={{ marginTop: "30px", fontWeight: "800" }}>
          🎯 Your Interests
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {["AI", "Web Dev", "ML", "Cybersecurity", "App Dev"].map(
            (item, i) => (
              <span
                key={i}
                style={{
                  background: "#e0f2fe",
                  padding: "8px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  color: "#0f172a",
                  fontWeight: "500",
                }}
              >
                {item}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

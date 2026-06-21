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

    try {
      await addDoc(collection(db, "projects"), {
        title,
        description,
        tech: "React • Firebase",
        createdBy: user?.email,
        createdAt: new Date(),
      });

      fetchProjects();
    } catch (err) {
      console.log(err);
    }
  };

  const applyToProject = async (projectId) => {
    try {
      await addDoc(collection(db, "projects", projectId, "applicants"), {
        name: user?.email,
        appliedAt: new Date(),
      });

      alert("Applied successfully 🚀");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "Inter, Arial, sans-serif",
        background: "linear-gradient(135deg, #dbeafe, #f8fafc)",
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
              width: "40px",
              height: "40px",
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
            style={{ padding: "10px", cursor: "pointer", color: "#cbd5e1" }}
          >
            Dashboard
          </div>

          <div
            onClick={() => nav("/chat")}
            style={{ padding: "10px", cursor: "pointer", color: "#cbd5e1" }}
          >
            AI Chat
          </div>
        </div>
      </div>

      {/* MAIN AREA */}
      <div style={{ flex: 1, padding: "30px" }}>
        {/* HEADER */}
        <div
          style={{
            background: "#ffffff",
            padding: "22px",
            borderRadius: "14px",
            marginBottom: "20px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "4px",
            }}
          >
            Welcome back 👋
          </h1>

          <p style={{ fontWeight: "600", color: "#111827" }}>
            {user?.email}
          </p>

          <p style={{ color: "#475569", fontSize: "13px" }}>
            Build projects. Collaborate. Grow faster.
          </p>
        </div>

        {/* PROJECTS */}
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "800",
            marginBottom: "12px",
            color: "#0f172a",
          }}
        >
          🔥 Featured Projects
        </h2>

        {projects.map((p) => (
  <div
    key={p.id}
    style={{
      background: "#fff",
      padding: "16px",
      marginBottom: "14px",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
    }}
  >
    {/* HEADER */}
    <h3 style={{ fontWeight: "700" }}>{p.title}</h3>

    <p style={{ color: "#475569" }}>{p.description}</p>

    <small style={{ color: "#64748b" }}>{p.tech}</small>

    <p style={{ fontSize: "12px", marginTop: "6px", color: "#94a3b8" }}>
      Posted by: {p.createdBy || "Anonymous"}
    </p>

    {/* ACTIONS */}
    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
      
      <button
        onClick={() => applyToProject(p.id)}
        style={{
          padding: "6px 10px",
          background: "#0ea5e9",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Apply
      </button>

      <button
        onClick={() => nav(`/chat/${p.id}`)}
        style={{
          padding: "6px 10px",
          background: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Discuss
      </button>

      {/* LIKE BUTTON (frontend only for now) */}
      <button
        onClick={() => alert("Like system coming next upgrade 🚀")}
        style={{
          padding: "6px 10px",
          background: "#f43f5e",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ❤️ Like
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
          <h3 style={{ fontWeight: "700", color: "#0f172a" }}>
            ⚡ Quick Actions
          </h3>

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

        {/* INTERESTS */}
        <h2
          style={{
            marginTop: "30px",
            fontWeight: "800",
            color: "#0f172a",
          }}
        >
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
                  fontWeight: "600",
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

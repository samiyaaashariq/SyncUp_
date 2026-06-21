import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";

export default function Dashboard() {
  const nav = useNavigate();
  const user = auth.currentUser;

  const [projects, setProjects] = useState([]);

  // FETCH PROJECTS
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

  // CREATE PROJECT
  const createProject = async () => {
    const title = prompt("Enter project title");
    const description = prompt("Enter project description");

    if (!title || !description) return;

    try {
      await addDoc(collection(db, "projects"), {
        title,
        description,
        tech: "React • Firebase",
      });

      fetchProjects();
      alert("Project created 🚀");
    } catch (err) {
      console.log(err);
    }
  };

  // APPLY SYSTEM (NEW FEATURE)
  const applyToProject = async (projectId) => {
    try {
      await addDoc(
        collection(db, "projects", projectId, "applicants"),
        {
          name: user?.email,
          appliedAt: new Date(),
        }
      );

      alert("Applied successfully 🚀");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "240px",
          background: "#0f172a",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span
            style={{
              background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
          <div onClick={() => nav("/dashboard")} style={{ padding: "10px", cursor: "pointer" }}>
            Dashboard
          </div>

          <div onClick={() => nav("/chat")} style={{ padding: "10px", cursor: "pointer" }}>
            AI Chat
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "linear-gradient(135deg,#e0f2fe,#f8fafc)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ fontSize: "20px", marginBottom: "5px" }}>
            Welcome back 👋
          </h1>

          <p style={{ color: "#475569" }}>{user?.email}</p>
        </div>

        {/* PROJECTS */}
        <h2 style={{ color: "#0f172a" }}>🔥 Featured Projects</h2>

        {projects.length === 0 && (
          <p style={{ color: "#64748b" }}>No projects yet...</p>
        )}

        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              background: "white",
              padding: "15px",
              marginTop: "15px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3>{p.title}</h3>
            <p style={{ color: "#475569" }}>{p.description}</p>
            <small>{p.tech}</small>

            {/* APPLY BUTTON (NEW FEATURE) */}
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => applyToProject(p.id)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Apply
              </button>
            </div>
          </div>
        ))}

        {/* QUICK ACTIONS */}
        <div
          style={{
            marginTop: "30px",
            background: "white",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h3>⚡ Quick Actions</h3>

          <button
            onClick={() => nav("/chat")}
            style={{ marginRight: "10px", padding: "10px 14px" }}
          >
            Open AI Chat
          </button>

          <button
            onClick={createProject}
            style={{ padding: "10px 14px" }}
          >
            Create Project
          </button>
        </div>

        {/* YOUR INTERESTS (UNCHANGED) */}
        <h2 style={{ marginTop: "30px", color: "#0f172a" }}>
          🎯 Your Interests
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {["AI", "Web Dev", "ML", "Cybersecurity", "App Dev"].map(
            (item, index) => (
              <span
                key={index}
                style={{
                  background: "#e8f0fe",
                  padding: "8px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
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

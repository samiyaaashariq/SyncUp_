import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

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
      });

      fetchProjects();
      alert("Project created 🚀");
    } catch (err) {
      console.log(err);
    }
  };

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
        fontFamily: "Inter, Arial, sans-serif",
        background: "#f1f5f9",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "250px",
          background: "#0f172a",
          color: "white",
          padding: "20px",
        }}
      >
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "800",
          }}
        >
          <span
            style={{
              width: "36px",
              height: "36px",
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
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "800",
              color: "#0f172a",
              marginBottom: "6px",
            }}
          >
            Welcome back 👋
          </h1>

          <p
            style={{
              color: "#1f2937",
              fontWeight: "500",
            }}
          >
            {user?.email}
          </p>

          <p style={{ color: "#64748b", marginTop: "6px" }}>
            Build projects. Connect. Grow.
          </p>
        </div>

        {/* FEATURED PROJECTS */}
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#0f172a",
            marginBottom: "15px",
          }}
        >
          🔥 Featured Projects
        </h2>

        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              background: "white",
              padding: "16px",
              marginBottom: "15px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <h3 style={{ color: "#0f172a", fontWeight: "700" }}>
              {p.title}
            </h3>

            <p style={{ color: "#1f2937", fontWeight: "500" }}>
              {p.description}
            </p>

            <small style={{ color: "#475569", fontWeight: "500" }}>
              {p.tech}
            </small>

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => applyToProject(p.id)}
                style={{
                  padding: "8px 12px",
                  marginRight: "10px",
                  cursor: "pointer",
                  background: "#0ea5e9",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Apply
              </button>

              <button
                onClick={() => nav("/chat")}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  background: "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
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
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ fontWeight: "800", color: "#0f172a" }}>
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
              cursor: "pointer",
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
              cursor: "pointer",
            }}
          >
            Create Project
          </button>
        </div>

        {/* INTERESTS */}
        <h2
          style={{
            marginTop: "30px",
            fontSize: "20px",
            fontWeight: "800",
            color: "#0f172a",
          }}
        >
          🎯 Your Interests
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {["AI", "Web Dev", "ML", "Cybersecurity", "App Dev"].map(
            (item, index) => (
              <span
                key={index}
                style={{
                  background: "#e0f2fe",
                  padding: "8px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#0f172a",
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

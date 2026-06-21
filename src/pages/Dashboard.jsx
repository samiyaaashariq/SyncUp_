import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const user = auth.currentUser || {};

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Chat AI", path: "/chat" },
  ];

  const projects = [
    {
      title: "CampusVerse",
      description:
        "A student platform to discover opportunities, events, and communities.",
      tech: "React • Firebase",
    },
    {
      title: "AI Resume Analyzer",
      description:
        "AI tool that analyzes resumes and suggests improvements.",
      tech: "AI • React",
    },
    {
      title: "Hackathon Team Finder",
      description:
        "Find teammates based on skills and interests for hackathons.",
      tech: "Web App",
    },
    {
      title: "Study Buddy App",
      description:
        "Connect with peers for collaborative learning and study sessions.",
      tech: "React • UI",
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: "240px",
          background: "#0f172a",
          color: "white",
          padding: "20px",
        }}
      >
        {/* LOGO (LOCKED) */}
        <h2
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "900",
              color: "white",
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
          {menu.map((item, index) => (
            <div
              key={index}
              onClick={() => nav(item.path)}
              style={{
                padding: "10px",
                marginBottom: "10px",
                background: "#1e293b",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",
        }}
      >
        <h1 style={{ color: "#0f172a" }}>
          Welcome, {user?.email || "User"} 👋
        </h1>

        <p style={{ color: "#475569" }}>
          Build projects, find teammates, and collaborate in one place.
        </p>

        {/* PROJECTS */}
        <h2 style={{ marginTop: "30px", color: "#0f172a" }}>
          🔥 Featured Projects
        </h2>

        {projects.map((project, index) => (
          <div
            key={index}
            style={{
              background: "#ffffff",
              padding: "18px",
              marginTop: "15px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginBottom: "6px", color: "#0f172a" }}>
              {project.title}
            </h3>

            <p style={{ color: "#475569", marginBottom: "6px" }}>
              {project.description}
            </p>

            <small style={{ color: "#64748b" }}>
              {project.tech}
            </small>

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => alert("Applied successfully!")}
                style={{
                  marginRight: "10px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Apply
              </button>

              <button
                onClick={() => nav("/chat")}
                style={{
                  padding: "8px 12px",
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
            marginTop: "30px",
            padding: "20px",
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
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
            onClick={() => alert("Feature coming soon!")}
            style={{ padding: "10px 14px" }}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}

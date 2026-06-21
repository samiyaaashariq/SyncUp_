import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const user = auth.currentUser;

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

  const interests = [
    "AI",
    "Web Development",
    "Machine Learning",
    "Cybersecurity",
    "App Development",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#1f1f1f",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb, #60a5fa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
            }}
          >
            SU
          </div>

          <div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "800",
                color: "#0f172a",
                letterSpacing: "0.5px",
              }}
            >
              SyncUp
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                marginTop: "-2px",
              }}
            >
              Build • Collaborate • Grow
            </div>
          </div>
        </div>

        <p>
          Welcome, <b>{user?.email}</b>
        </p>

        <p>Build projects. Find teammates. Grow together.</p>

        <button
          onClick={() => nav("/chat")}
          style={{ marginTop: "10px", padding: "10px 15px" }}
        >
          Open AI Assistant
        </button>
      </div>

      {/* Featured Projects */}
      <h2>🔥 Featured Projects</h2>

      {projects.map((project, index) => (
        <div
          key={index}
          style={{
            background: "#fff",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <small>{project.tech}</small>

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => alert("Applied successfully!")}
              style={{ marginRight: "10px", padding: "8px 12px" }}
            >
              Apply
            </button>

            <button
              onClick={() => nav("/chat")}
              style={{ padding: "8px 12px" }}
            >
              Discuss
            </button>
          </div>
        </div>
      ))}

      {/* Interests */}
      <h2>🎯 Your Interests</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {interests.map((item, index) => (
          <span
            key={index}
            style={{
              background: "#e8f0fe",
              padding: "8px 12px",
              borderRadius: "20px",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

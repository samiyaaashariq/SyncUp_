import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const user = auth.currentUser || {};

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
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        color: "#1f1f1f",
      }}
    >
      {/* HEADER */}
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
            justifyContent: "center",
            gap: "14px",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "900",
              fontSize: "18px",
              boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)",
            }}
          >
            📊
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "#0f172a",
                letterSpacing: "1px",
              }}
            >
              SyncUp
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
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
          style={{
            marginTop: "10px",
            padding: "10px 15px",
            cursor: "pointer",
          }}
        >
          Open AI Assistant
        </button>
      </div>

      {/* FEATURED PROJECTS */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#0f172a",
            marginBottom: "20px",
          }}
        >
          🔥 Featured Projects
        </h2>
      </div>

      {projects.map((project, index) => (
        <div
          key={index}
          style={{
            background: "#ffffff",
            padding: "18px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 8px 20px rgba(0,0,0,0.08)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow =
              "0 1px 2px rgba(0,0,0,0.04)";
          }}
        >
          <h3 style={{ marginBottom: "6px", color: "#0f172a" }}>
            {project.title}
          </h3>

          <p style={{ color: "#475569", marginBottom: "8px" }}>
            {project.description}
          </p>

          <small style={{ color: "#64748b" }}>{project.tech}</small>

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

      {/* INTERESTS */}
      <h2
        style={{
          marginTop: "30px",
          color: "#0f172a",
        }}
      >
        🎯 Your Interests
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {interests.map((item, index) => (
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
        ))}
      </div>
    </div>
  );
}

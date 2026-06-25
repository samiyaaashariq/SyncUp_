import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a, #1a1a1a, #121212)",
      color: "#e0e0e0",
      fontFamily: "system-ui, sans-serif",
      padding: "40px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "3rem", color: "#ff00aa" }}>Welcome to SyncUp Dashboard</h1>
        <p style={{ color: "#aaa" }}>Your hub for projects, teammates, and collaboration</p>

        <div style={{ marginTop: "50px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" }}>
          {/* AI Copilot */}
          <div onClick={() => navigate("/ai-copilot")} style={{
            background: "#1f1f1f",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #ff00aa",
            cursor: "pointer"
          }}>
            <h3 style={{ color: "#ff00aa" }}>🚀 AI Project Copilot</h3>
            <p>Describe your idea → Get full project brief, tech stack, roadmap, and team roles.</p>
          </div>

          {/* AI Chat */}
          <div onClick={() => navigate("/chat")} style={{
            background: "#1f1f1f",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #00b8d4",
            cursor: "pointer"
          }}>
            <h3 style={{ color: "#00b8d4" }}>💬 AI Assistant</h3>
            <p>Ask anything or request visual architecture explanations.</p>
          </div>

          {/* My Projects */}
          <div style={{
            background: "#1f1f1f",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #80cbc4"
          }}>
            <h3 style={{ color: "#80cbc4" }}>📂 My Projects</h3>
            <p>View and manage your ongoing projects.</p>
            <button onClick={() => navigate("/project/1")} style={{ marginTop: "15px", padding: "10px 20px", background: "#80cbc4", color: "#000", border: "none", borderRadius: "8px" }}>
              View Projects
            </button>
          </div>

          {/* Team Chat */}
          <div onClick={() => navigate("/chat")} style={{
            background: "#1f1f1f",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #ff00aa",
            cursor: "pointer"
          }}>
            <h3 style={{ color: "#ff00aa" }}>💬 Team Chat</h3>
            <p>Real-time communication with your project team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

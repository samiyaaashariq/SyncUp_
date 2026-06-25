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
        <h1 style={{ fontSize: "3.2rem", color: "#ff00aa", marginBottom: "10px" }}>Welcome to SyncUp</h1>
        <p style={{ color: "#aaa", fontSize: "1.3rem" }}>Your hub for projects, teammates, and collaboration</p>

        <div style={{ marginTop: "50px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" }}>
          {/* AI Project Copilot */}
          <div onClick={() => navigate("/ai-copilot")} style={{
            background: "#1f1f1f",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #ff00aa",
            cursor: "pointer"
          }}>
            <h3 style={{ color: "#ff00aa" }}>🚀 AI Project Copilot</h3>
            <p>Describe your idea and get full project plan, tech stack, roadmap, and team roles.</p>
          </div>

          {/* AI Assistant */}
          <div onClick={() => navigate("/chat")} style={{
            background: "#1f1f1f",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #00b8d4",
            cursor: "pointer"
          }}>
            <h3 style={{ color: "#00b8d4" }}>💬 AI Assistant</h3>
            <p>Ask anything or request visual/AR architecture explanations.</p>
          </div>

          {/* My Projects */}
          <div onClick={() => navigate("/dashboard")} style={{
            background: "#1f1f1f",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #80cbc4",
            cursor: "pointer"
          }}>
            <h3 style={{ color: "#80cbc4" }}>📂 My Projects</h3>
            <p>View, manage, and track your ongoing projects.</p>
          </div>

          {/* Team Chat */}
          <div onClick={() => navigate("/chat")} style={{
            background: "#1f1f1f",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #ff00aa",
            cursor: "pointer"
          }}>
            <h3 style={{ color: "#ff00aa" }}>💬 Team Chat Room</h3>
            <p>Real-time communication with your project team.</p>
          </div>

          {/* Notifications */}
          <div onClick={() => navigate("/notifications")} style={{
            background: "#1f1f1f",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #ff69b4",
            cursor: "pointer"
          }}>
            <h3 style={{ color: "#ff69b4" }}>🔔 Notifications</h3>
            <p>Stay updated with project activity and matches.</p>
          </div>

          {/* Profile */}
          <div onClick={() => navigate("/profile")} style={{
            background: "#1f1f1f",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #80cbc4",
            cursor: "pointer"
          }}>
            <h3 style={{ color: "#80cbc4" }}>👤 Profile & Interests</h3>
            <p>Update your skills, interests, and portfolio.</p>
          </div>

          {/* AR/VR Visual Mode */}
          <div onClick={() => navigate("/chat")} style={{
            background: "#1f1f1f",
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #ff00aa",
            cursor: "pointer"
          }}>
            <h3 style={{ color: "#ff00aa" }}>🌌 AR/VR Visual Explorer</h3>
            <p>Visualize project architecture in AR/VR style.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

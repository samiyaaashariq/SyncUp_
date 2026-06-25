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
      display: "flex"
    }}>
      {/* Sidebar */}
      <div style={{
        width: "280px",
        background: "#1f1f1f",
        padding: "30px 20px",
        borderRight: "1px solid #333"
      }}>
        <div style={{ fontSize: "2.2rem", fontWeight: "900", color: "#ff00aa", marginBottom: "40px" }}>
          SyncUp
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div onClick={() => navigate("/dashboard")} style={{ padding: "12px 20px", background: "#ff00aa", color: "#000", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
            📊 Dashboard
          </div>
          <div onClick={() => navigate("/ai-copilot")} style={{ padding: "12px 20px", cursor: "pointer" }}>
            🚀 AI Project Copilot
          </div>
          <div onClick={() => navigate("/chat")} style={{ padding: "12px 20px", cursor: "pointer" }}>
            💬 Team Chat Room
          </div>
          <div onClick={() => navigate("/chat")} style={{ padding: "12px 20px", cursor: "pointer" }}>
            🌌 AR/VR Visual Explorer
          </div>
          <div onClick={() => navigate("/notifications")} style={{ padding: "12px 20px", cursor: "pointer" }}>
            🔔 Notifications
          </div>
          <div onClick={() => navigate("/profile")} style={{ padding: "12px 20px", cursor: "pointer" }}>
            👤 Profile & Interests
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px" }}>
        <h1 style={{ fontSize: "3rem", color: "#ff00aa" }}>Welcome to SyncUp</h1>
        <p style={{ color: "#aaa" }}>Your hub for projects, teammates, and collaboration</p>

        <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" }}>
          <div onClick={() => navigate("/ai-copilot")} style={{ background: "#1f1f1f", padding: "30px", borderRadius: "16px", border: "1px solid #ff00aa", cursor: "pointer" }}>
            <h3 style={{ color: "#ff00aa" }}>🚀 AI Project Copilot</h3>
            <p>Describe your idea and get full project plan, tech stack, roadmap, and team roles.</p>
          </div>

          <div onClick={() => navigate("/chat")} style={{ background: "#1f1f1f", padding: "30px", borderRadius: "16px", border: "1px solid #00b8d4", cursor: "pointer" }}>
            <h3 style={{ color: "#00b8d4" }}>💬 Team Chat Room</h3>
            <p>Real-time communication with your project team.</p>
          </div>

          <div onClick={() => navigate("/chat")} style={{ background: "#1f1f1f", padding: "30px", borderRadius: "16px", border: "1px solid #ff69b4", cursor: "pointer" }}>
            <h3 style={{ color: "#ff69b4" }}>🌌 AR/VR Visual Explorer</h3>
            <p>Visualize project architecture in AR/VR style.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

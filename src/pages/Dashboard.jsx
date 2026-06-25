import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a, #001a14, #002b24)",
      color: "#e0f2f1",
      padding: "40px",
      fontFamily: "Inter, sans-serif"
    }}>
      <h1 style={{ color: "#00ff9f" }}>Welcome to SyncUp Dashboard</h1>
      <p style={{ color: "#80cbc4" }}>Your hub for projects and collaboration</p>

      <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        <div onClick={() => navigate("/ai-copilot")} style={{
          background: "rgba(15, 23, 42, 0.95)",
          padding: "30px",
          borderRadius: "16px",
          border: "1px solid #00ff9f",
          cursor: "pointer"
        }}>
          <h3 style={{ color: "#00ff9f" }}>🚀 AI Project Copilot</h3>
          <p>Describe your idea and get full project plan</p>
        </div>

        <div onClick={() => navigate("/chat")} style={{
          background: "rgba(15, 23, 42, 0.95)",
          padding: "30px",
          borderRadius: "16px",
          border: "1px solid #00b8d4",
          cursor: "pointer"
        }}>
          <h3 style={{ color: "#00b8d4" }}>💬 AI Assistant</h3>
          <p>Talk to AI for architecture and ideas</p>
        </div>
      </div>
    </div>
  );
}

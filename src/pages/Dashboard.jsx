import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#e0e0e0",
      padding: "40px",
      fontFamily: "system-ui, sans-serif"
    }}>
      <h1>SyncUp Dashboard</h1>
      <p>This is your main dashboard.</p>

      <div style={{ marginTop: "40px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/chat")} style={{ padding: "15px 30px", background: "#ff00aa", color: "#000", border: "none", borderRadius: "8px" }}>
          Open AI Chat
        </button>
        <button onClick={() => navigate("/ai-copilot")} style={{ padding: "15px 30px", background: "#ff00aa", color: "#000", border: "none", borderRadius: "8px" }}>
          AI Copilot
        </button>
      </div>
    </div>
  );
}

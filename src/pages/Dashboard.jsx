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
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "3rem", color: "#ff00aa" }}>Welcome back, Samiya</h1>
            <p style={{ color: "#aaa" }}>Let's build something amazing today.</p>
          </div>
          <button onClick={() => navigate("/ai-copilot")} style={{ padding: "14px 36px", background: "#ff00aa", color: "#000", border: "none", borderRadius: "50px", fontWeight: "700" }}>
            + New Project with AI
          </button>
        </div>

        {/* Projects Section */}
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ color: "#ff00aa", marginBottom: "20px" }}>My Projects</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            <div style={{ background: "#1f1f1f", padding: "25px", borderRadius: "16px", border: "1px solid #ff00aa" }}>
              <h3>Northern Airlines Booking System</h3>
              <p style={{ color: "#aaa" }}>Real-time flight booking platform with AI recommendations.</p>
              <div style={{ marginTop: "15px" }}>
                <button onClick={() => navigate("/project/1")} style={{ padding: "8px 20px", background: "#ff00aa", color: "#000", border: "none", borderRadius: "8px" }}>View Project</button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Features */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
          <div onClick={() => navigate("/ai-copilot")} style={{ background: "#1f1f1f", padding: "30px", borderRadius: "16px", border: "1px solid #ff00aa", cursor: "pointer" }}>
            <h3 style={{ color: "#ff00aa" }}>🚀 AI Project Copilot</h3>
            <p>Generate full project plans instantly.</p>
          </div>

          <div onClick={() => navigate("/chat")} style={{ background: "#1f1f1f", padding: "30px", borderRadius: "16px", border: "1px solid #00b8d4", cursor: "pointer" }}>
            <h3 style={{ color: "#00b8d4" }}>💬 Team Chat Room</h3>
            <p>Real-time communication with your team.</p>
          </div>

          <div onClick={() => navigate("/notifications")} style={{ background: "#1f1f1f", padding: "30px", borderRadius: "16px", border: "1px solid #ff69b4", cursor: "pointer" }}>
            <h3 style={{ color: "#ff69b4" }}>🔔 Notifications Center</h3>
            <p>Stay updated with activity and matches.</p>
          </div>

          <div onClick={() => navigate("/profile")} style={{ background: "#1f1f1f", padding: "30px", borderRadius: "16px", border: "1px solid #80cbc4", cursor: "pointer" }}>
            <h3 style={{ color: "#80cbc4" }}>👤 Profile & Interests</h3>
            <p>Update your skills and interests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
            <h1 style={{ fontSize: "3.2rem", color: "#ff00aa" }}>SyncUp Dashboard</h1>
            <p style={{ color: "#aaa" }}>Your hub for projects, teammates, and collaboration</p>
          </div>
          <button onClick={() => navigate("/ai-copilot")} style={{ padding: "14px 36px", background: "#ff00aa", color: "#000", border: "none", borderRadius: "50px", fontWeight: "700" }}>
            + New Project with AI
          </button>
        </div>

        {/* Projects Table */}
        <div style={{ background: "#1f1f1f", borderRadius: "16px", padding: "30px", marginBottom: "40px" }}>
          <h2 style={{ color: "#ff00aa", marginBottom: "20px" }}>My Projects</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #333" }}>
                <th style={{ textAlign: "left", padding: "12px 0" }}>Project</th>
                <th style={{ textAlign: "left", padding: "12px 0" }}>Status</th>
                <th style={{ textAlign: "left", padding: "12px 0" }}>Team</th>
                <th style={{ textAlign: "left", padding: "12px 0" }}>Progress</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "16px 0" }}>Northern Airlines Booking System</td>
                <td><span style={{ color: "#4ade80" }}>Active</span></td>
                <td>4 members</td>
                <td>75%</td>
                <td><button onClick={() => navigate("/project/1")} style={{ padding: "8px 20px", background: "#ff00aa", color: "#000", border: "none", borderRadius: "8px" }}>View</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick Features */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
          <div onClick={() => navigate("/ai-copilot")} style={{ background: "#1f1f1f", padding: "30px", borderRadius: "16px", border: "1px solid #ff00aa", cursor: "pointer" }}>
            <h3 style={{ color: "#ff00aa" }}>🚀 AI Project Copilot</h3>
            <p>Generate full project plans, tech stack, and team roles.</p>
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

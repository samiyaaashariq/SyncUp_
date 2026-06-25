import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #001a14 50%, #002b24 100%)",
      color: "#e0f2f1",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      {/* Navbar */}
      <nav style={{
        padding: "20px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(0, 255, 159, 0.15)"
      }}>
        <div style={{ 
          fontSize: "2.2rem", 
          fontWeight: "900",
          background: "linear-gradient(90deg, #00ff9f, #00b8d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          SyncUp
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button 
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 24px",
              background: "transparent",
              color: "#e0f2f1",
              border: "2px solid #00ff9f",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Login
          </button>
          <button 
            onClick={() => navigate("/signup")}
            style={{
              padding: "10px 28px",
              background: "linear-gradient(90deg, #00ff9f, #00b8d4)",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "50px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ 
        maxWidth: "1100px", 
        margin: "0 auto", 
        padding: "140px 20px 100px",
        textAlign: "center" 
      }}>
        <h1 style={{
          fontSize: "4.5rem",
          lineHeight: "1.1",
          marginBottom: "20px",
          background: "linear-gradient(90deg, #00ff9f, #00e5d4, #00b8d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Find Projects.<br />
          Find Teammates.<br />
          Build Together.
        </h1>

        <p style={{ 
          fontSize: "1.35rem", 
          maxWidth: "700px", 
          margin: "0 auto 40px",
          color: "#b2dfdb"
        }}>
          The AI-powered platform where students turn ideas into real projects with the right teammates.
        </p>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          <button 
            onClick={() => navigate("/signup")}
            style={{
              padding: "18px 52px",
              fontSize: "1.25rem",
              background: "linear-gradient(90deg, #00ff9f, #00b8d4)",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "9999px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(0,255,159,0.25)"
            }}
          >
            Start Your Project
          </button>

          <button 
            onClick={() => navigate("/login")}
            style={{
              padding: "18px 40px",
              fontSize: "1.25rem",
              background: "transparent",
              color: "#e0f2f1",
              border: "2px solid #80cbc4",
              borderRadius: "9999px",
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ 
        background: "rgba(15, 23, 42, 0.7)", 
        padding: "80px 20px",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "2.6rem", marginBottom: "50px" }}>Why Students Choose SyncUp</h2>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "30px",
          maxWidth: "1100px",
          margin: "0 auto"
        }}>
          <div style={{ background: "rgba(0,255,159,0.08)", padding: "32px", borderRadius: "16px", border: "1px solid rgba(0,255,159,0.2)" }}>
            <h3 style={{ color: "#00ff9f" }}>🤖 AI Copilot</h3>
            <p>Turn your idea into a complete project plan instantly.</p>
          </div>
          <div style={{ background: "rgba(0,184,212,0.08)", padding: "32px", borderRadius: "16px", border: "1px solid rgba(0,184,212,0.2)" }}>
            <h3 style={{ color: "#00b8d4" }}>🤝 Smart Matching</h3>
            <p>Find teammates with matching skills and interests.</p>
          </div>
          <div style={{ background: "rgba(128,203,196,0.08)", padding: "32px", borderRadius: "16px", border: "1px solid rgba(128,203,196,0.2)" }}>
            <h3 style={{ color: "#80cbc4" }}>💬 Real-time Chat</h3>
            <p>Collaborate seamlessly with your team.</p>
          </div>
        </div>
      </div>

      <footer style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
        © 2026 SyncUp • Made for Student Builders
      </footer>
    </div>
  );
}

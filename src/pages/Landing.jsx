import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #121212 100%)",
      color: "#e0e0e0",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Navbar */}
      <nav style={{
        padding: "20px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #333"
      }}>
        <div style={{ 
          fontSize: "2.6rem", 
          fontWeight: "900",
          letterSpacing: "-2px",
          background: "linear-gradient(90deg, #ff00aa, #ff69b4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          SyncUp
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <button 
            onClick={() => navigate("/login")}
            style={{
              padding: "12px 28px",
              background: "transparent",
              color: "#e0e0e0",
              border: "2px solid #ff00aa",
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
              padding: "12px 32px",
              background: "linear-gradient(90deg, #ff00aa, #ff1493)",
              color: "#000",
              border: "none",
              borderRadius: "50px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ 
        maxWidth: "1000px", 
        margin: "140px auto 0", 
        textAlign: "center",
        padding: "0 20px"
      }}>
        <h1 style={{
          fontSize: "4.8rem",
          lineHeight: "1.05",
          fontWeight: "900",
          letterSpacing: "-3px",
          marginBottom: "24px"
        }}>
          Find Projects.<br />
          Find Teammates.<br />
          <span style={{ background: "linear-gradient(90deg, #ff00aa, #ff69b4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Build Together.
          </span>
        </h1>

        <p style={{ 
          fontSize: "1.45rem", 
          maxWidth: "680px", 
          margin: "0 auto 50px",
          color: "#aaaaaa"
        }}>
          The premium platform for ambitious students to discover projects, 
          match with talented teammates, and ship standout work.
        </p>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <button 
            onClick={() => navigate("/signup")}
            style={{
              padding: "18px 52px",
              fontSize: "1.3rem",
              background: "linear-gradient(90deg, #ff00aa, #ff1493)",
              color: "#000",
              border: "none",
              borderRadius: "9999px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 10px 40px rgba(255, 0, 170, 0.4)"
            }}
          >
            Start Your Journey
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ 
        background: "#111", 
        padding: "100px 20px",
        marginTop: "120px"
      }}>
        <h2 style={{ textAlign: "center", fontSize: "2.8rem", marginBottom: "60px" }}>Built for Builders</h2>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: "30px",
          maxWidth: "1100px",
          margin: "0 auto"
        }}>
          <div style={{ background: "#1a1a1a", padding: "32px", borderRadius: "16px" }}>
            <h3 style={{ color: "#ff00aa" }}>🤖 AI Copilot</h3>
            <p style={{ color: "#bbb" }}>Turn ideas into complete project plans instantly.</p>
          </div>
          <div style={{ background: "#1a1a1a", padding: "32px", borderRadius: "16px" }}>
            <h3 style={{ color: "#ff00aa" }}>🤝 Smart Matching</h3>
            <p style={{ color: "#bbb" }}>Find teammates who actually match your vision.</p>
          </div>
          <div style={{ background: "#1a1a1a", padding: "32px", borderRadius: "16px" }}>
            <h3 style={{ color: "#ff00aa" }}>💼 Portfolio Ready</h3>
            <p style={{ color: "#bbb" }}>Generate professional portfolio entries automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a1a, #0a0a0a, #121212)",
      color: "#ffffff",
      fontFamily: "system-ui, sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Accent */}
      <div style={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "radial-gradient(circle at 30% 20%, rgba(255,0,170,0.15), transparent 60%)",
        zIndex: "0"
      }} />

      {/* Navbar */}
      <nav style={{
        padding: "20px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        zIndex: "1"
      }}>
        <h1 style={{ 
          fontSize: "2.8rem", 
          fontWeight: "900",
          background: "linear-gradient(90deg, #ff00aa, #ff69b4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          SyncUp
        </h1>

        <div>
          <button 
            onClick={() => navigate("/login")}
            style={{ marginRight: "15px", padding: "12px 28px", background: "transparent", border: "2px solid #ff00aa", color: "#fff", borderRadius: "50px" }}
          >
            Login
          </button>
          <button 
            onClick={() => navigate("/signup")}
            style={{ padding: "12px 32px", background: "#ff00aa", color: "#000", border: "none", borderRadius: "50px", fontWeight: "bold" }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ 
        position: "relative",
        zIndex: "1",
        maxWidth: "1000px", 
        margin: "160px auto 0", 
        textAlign: "center",
        padding: "0 20px"
      }}>
        <h1 style={{
          fontSize: "4.8rem",
          lineHeight: "1.05",
          fontWeight: "900",
          marginBottom: "24px"
        }}>
          Find Projects.<br />
          Find Teammates.<br />
          Build Together.
        </h1>

        <p style={{ 
          fontSize: "1.45rem", 
          maxWidth: "680px", 
          margin: "0 auto 50px",
          color: "#bbbbbb"
        }}>
          The premium platform for students to discover exciting projects, connect with the right teammates, and create portfolio-worthy work with AI assistance.
        </p>

        <button 
          onClick={() => navigate("/signup")}
          style={{
            padding: "18px 52px",
            fontSize: "1.3rem",
            background: "linear-gradient(90deg, #ff00aa, #ff1493)",
            color: "#000",
            border: "none",
            borderRadius: "50px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 10px 40px rgba(255, 0, 170, 0.4)"
          }}
        >
          Start Your Project Now
        </button>
      </div>
    </div>
  );
}

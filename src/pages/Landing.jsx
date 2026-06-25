import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a, #001a14, #002b24)",
      color: "#e0f2f1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "20px"
    }}>
      <div style={{ maxWidth: "800px" }}>
        <h1 style={{
          fontSize: "4rem",
          background: "linear-gradient(90deg, #00ff9f, #00b8d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "20px"
        }}>
          SyncUp
        </h1>
        <p style={{ fontSize: "1.5rem", marginBottom: "40px" }}>
          Find projects.<br />Find teammates.<br />Build together.
        </p>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/signup")} style={{
            padding: "16px 40px",
            fontSize: "1.2rem",
            background: "linear-gradient(90deg, #00ff9f, #00b8d4)",
            color: "#0a0a0a",
            border: "none",
            borderRadius: "9999px",
            fontWeight: "700"
          }}>
            Get Started Free
          </button>

          <button onClick={() => navigate("/login")} style={{
            padding: "16px 40px",
            fontSize: "1.2rem",
            background: "transparent",
            color: "#e0f2f1",
            border: "2px solid #00ff9f",
            borderRadius: "9999px"
          }}>
            Login
          </button>
        </div>

        <p style={{ marginTop: "60px", color: "#80cbc4" }}>
          Trusted by student builders • AI-Powered Matching
        </p>
      </div>
    </div>
  );
}

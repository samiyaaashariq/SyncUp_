import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a, #1a1a1a, #121212)",
      color: "#e0e0e0",
      fontFamily: "system-ui, sans-serif"
    }}>
      <nav style={{ padding: "20px 5%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "2.8rem", fontWeight: "900", background: "linear-gradient(90deg, #ff00aa, #ff69b4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          SyncUp
        </h1>
        <div>
          <button onClick={() => navigate("/Login")} style={{ marginRight: "15px", padding: "12px 28px", background: "transparent", border: "2px solid #ff00aa", color: "#fff", borderRadius: "50px" }}>
            Login
          </button>
          <button onClick={() => navigate("/Signup")} style={{ padding: "12px 32px", background: "#ff00aa", color: "#000", border: "none", borderRadius: "50px", fontWeight: "bold" }}>
            Get Started
          </button>
        </div>
      </nav>

      <div style={{ textAlign: "center", marginTop: "180px" }}>
        <h1 style={{ fontSize: "4.5rem", marginBottom: "20px" }}>
          Find Projects.<br />
          Find Teammates.<br />
          Build Together.
        </h1>
        <p style={{ fontSize: "1.4rem", color: "#aaa", maxWidth: "700px", margin: "0 auto 40px" }}>
          The platform where students turn ideas into real projects with AI and the right teammates.
        </p>
        <button onClick={() => navigate("/Signup")} style={{ padding: "18px 50px", fontSize: "1.3rem", background: "#ff00aa", color: "#000", border: "none", borderRadius: "50px", fontWeight: "700" }}>
          Start Your Project
        </button>
      </div>
    </div>
  );
}

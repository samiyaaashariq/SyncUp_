import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>

      {/* background glow */}
      <div style={styles.glow} />

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>SyncUp</h1>

        <div style={{ display: "flex", gap: "12px" }}>
          <button style={styles.loginBtn} onClick={() => navigate("/login")}>
            Login
          </button>

          <button style={styles.signupBtn} onClick={() => navigate("/signup")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={styles.hero}>
        <h1 style={styles.title}>
          Find Projects.<br />
          Find Teammates.<br />
          Build Together.
        </h1>

        <p style={styles.subtitle}>
          A premium student collaboration platform to discover projects and build real-world products.
        </p>

        <button
          style={styles.heroBtn}
          onClick={() => navigate("/signup")}
        >
          Start Your Project Now
        </button>
      </div>

    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles = {
  container: {
    height: "100vh",
    minHeight: "100vh",
    width: "100vw",
    fontFamily: "system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
    color: "#fff",
    background: "linear-gradient(135deg, #0b1020 0%, #0f172a 45%, #050814 100%)",
    paddingBottom: "80px"
  },

  glow: {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at 20% 20%, rgba(79,140,255,0.25), transparent 55%),
      radial-gradient(circle at 80% 30%, rgba(236,72,153,0.18), transparent 60%)
    `,
    zIndex: 0
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 5%",
    position: "relative",
    zIndex: 2
  },

  logo: {
    fontSize: "2.2rem",
    fontWeight: "800",
    background: "linear-gradient(90deg, #ec4899, #4f8cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  loginBtn: {
    padding: "10px 20px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer"
  },

  signupBtn: {
    padding: "10px 24px",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg, #ec4899, #4f8cff)",
    color: "white",
    cursor: "pointer"
  },

  hero: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    maxWidth: "900px",
    margin: "140px auto 0",
    padding: "0 20px 80px"
  },

  title: {
    fontSize: "4rem",
    fontWeight: "900",
    lineHeight: "1.1"
  },

  subtitle: {
    marginTop: "20px",
    fontSize: "1.2rem",
    color: "#b7c0d1"
  },

  heroBtn: {
    marginTop: "40px",
    padding: "16px 40px",
    fontSize: "1.1rem",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "600",
    background: "linear-gradient(135deg, #ec4899, #4f8cff)"
  }
};

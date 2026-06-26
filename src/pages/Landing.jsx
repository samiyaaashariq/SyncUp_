import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.glow} />

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>SyncUp</div>
        <div style={{ display: "flex", gap: "16px" }}>
          <button style={styles.navBtn} onClick={() => navigate("/login")}>Login</button>
          <button style={styles.primaryBtn} onClick={() => navigate("/signup")}>Get Started Free</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.title}>
          Find Projects.<br />
          Find Teammates.<br />
          Build Together.
        </h1>
        <p style={styles.subtitle}>
          The premium platform where students and builders discover real projects, match with perfect teammates, and ship amazing products.
        </p>
        <div style={{ marginTop: "48px", display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          <button style={styles.primaryBtn} onClick={() => navigate("/signup")}>
            Start Your First Project
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate("/login")}>
            I already have an account
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Why builders choose SyncUp</h2>
        <div style={styles.featuresGrid}>
          {[
            { icon: "🚀", title: "Discover Real Projects", desc: "Browse live startup and hackathon ideas from students worldwide." },
            { icon: "🤝", title: "Smart Team Matching", desc: "AI-powered suggestions based on skills, interests, and availability." },
            { icon: "💬", title: "Seamless Collaboration", desc: "Chat, share code, tasks, and files in one place." },
            { icon: "📈", title: "Build Your Portfolio", desc: "Every project becomes a verified achievement." }
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div style={styles.finalCta}>
        <button style={styles.primaryBtn} onClick={() => navigate("/signup")}>
          Join the movement — Start building today →
        </button>
      </div>
    </div>
  );
}

/* ====================== STYLES ====================== */
const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    fontFamily: "Inter, system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(135deg, #0b1020 0%, #0f172a 45%, #050814 100%)",
    color: "#fff",
  },
  glow: {
    position: "absolute",
    inset: 0,
    background: `radial-gradient(circle at 20% 20%, rgba(236,72,153,0.2), transparent 60%), radial-gradient(circle at 80% 30%, rgba(79,140,255,0.18), transparent 70%)`,
    zIndex: 0,
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "32px 5%",
    position: "relative",
    zIndex: 2,
  },
  logo: {
    fontSize: "28px",
    fontWeight: 800,
    background: "linear-gradient(90deg, #ec4899, #4f8cff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  navBtn: {
    padding: "10px 24px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },
  primaryBtn: {
    padding: "14px 32px",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg, #ec4899, #4f8cff)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "15.5px",
  },
  secondaryBtn: {
    padding: "14px 28px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },
  hero: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    maxWidth: "860px",
    margin: "140px auto 120px",
    padding: "0 20px",
  },
  title: {
    fontSize: "3.8rem",
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: "24px",
  },
  subtitle: {
    fontSize: "1.35rem",
    color: "#b7c0d1",
    maxWidth: "620px",
    margin: "0 auto",
  },
  section: {
    position: "relative",
    zIndex: 2,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 5% 80px",
  },
  sectionTitle: {
    fontSize: "27px",
    textAlign: "center",
    marginBottom: "48px",
    color: "#fff",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "28px",
  },
  featureCard: {
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(79,140,255,0.25)",
    borderRadius: "20px",
    padding: "36px 28px",
    textAlign: "center",
  },
  featureTitle: {
    fontSize: "20px",
    marginBottom: "12px",
  },
  featureDesc: {
    color: "#b7c0d1",
    fontSize: "15px",
  },
  finalCta: {
    textAlign: "center",
    padding: "60px 20px 100px",
  },
};

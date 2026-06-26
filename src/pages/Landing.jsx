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
        <div style={{ display: "flex", gap: "14px" }}>
          <button style={styles.navBtn} onClick={() => navigate("/login")}>Login</button>
          <button style={styles.primaryBtn} onClick={() => navigate("/signup")}>Get Started Free</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.title}>
          Find Projects.<br />
          Find Teammates.<br />
          Build Together.
        </h1>
        <p style={styles.subtitle}>
          The premium platform for students and builders to discover real projects, 
          match with collaborators, and ship portfolio-worthy work.
        </p>
        <div style={{ marginTop: "40px", display: "flex", gap: "16px", justifyContent: "center" }}>
          <button style={styles.primaryBtn} onClick={() => navigate("/signup")}>
            Start Building Now
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>

      {/* Features Section - Organized & Spacious */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Why builders love SyncUp</h2>
        <div style={styles.featuresGrid}>
          {[
            { icon: "🚀", title: "Discover Real Projects", desc: "Browse live startup ideas from students across the world." },
            { icon: "🤝", title: "Smart Team Matching", desc: "Get AI-powered teammate suggestions based on skills & interests." },
            { icon: "💬", title: "Built-in Collaboration", desc: "Chat, share files, and manage tasks without leaving the platform." },
            { icon: "📈", title: "Build Your Portfolio", desc: "Every project you join becomes a verified achievement." }
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>How it works in 3 simple steps</h2>
        <div style={styles.stepsGrid}>
          {["Create or join a project", "Match with perfect teammates", "Build, chat & ship together"].map((step, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNumber}>{i + 1}</div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <button style={styles.primaryBtn} onClick={() => navigate("/signup")}>
          Join 1000+ builders today →
        </button>
      </div>
    </div>
  );
}

/* Styles object - full spacious & beautiful version */
const styles = {
  container: { minHeight: "100vh", width: "100%", fontFamily: "Inter, system-ui, sans-serif", position: "relative", overflow: "hidden", color: "#f3e8ff", background: "linear-gradient(135deg, #0f0519 0%, #1a0f2e 45%, #0c0a1f 100%)" },
  glow: { position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 20%, rgba(167,139,250,0.15), transparent 60%), radial-gradient(circle at 80% 30%, rgba(103,232,249,0.12), transparent 70%)", zIndex: 0 },
  navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 5%", position: "relative", zIndex: 2 },
  logo: { fontSize: "26px", fontWeight: 700, color: "#c4b5fd" },
  navBtn: { padding: "10px 22px", borderRadius: "999px", border: "1px solid rgba(167,139,250,0.4)", background: "transparent", color: "#ddd6fe", cursor: "pointer" },
  primaryBtn: { padding: "14px 32px", borderRadius: "999px", border: "none", background: "linear-gradient(135deg, #a78bfa, #f472b6)", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "15px" },
  secondaryBtn: { padding: "14px 28px", borderRadius: "999px", border: "1px solid rgba(167,139,250,0.5)", background: "transparent", color: "#ddd6fe", cursor: "pointer", fontSize: "15px" },
  hero: { position: "relative", zIndex: 2, textAlign: "center", maxWidth: "820px", margin: "120px auto 80px", padding: "0 20px" },
  title: { fontSize: "3.8rem", fontWeight: 800, lineHeight: 1.1, color: "#c4b5fd" },
  subtitle: { fontSize: "1.25rem", color: "#e0d0ff", maxWidth: "620px", margin: "24px auto 0" },
  section: { position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "0 5% 80px" },
  sectionTitle: { fontSize: "26px", color: "#c4b5fd", textAlign: "center", marginBottom: "40px" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" },
  featureCard: { background: "rgba(26,15,46,0.75)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: "20px", padding: "32px 28px", textAlign: "center" },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" },
  stepCard: { background: "rgba(15,10,35,0.9)", border: "1px solid rgba(103,232,249,0.2)", borderRadius: "18px", padding: "28px", textAlign: "center" },
  stepNumber: { width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, #67e8f9, #a78bfa)", color: "#0f0519", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, margin: "0 auto 16px", fontSize: "18px" }
};

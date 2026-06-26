import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      {/* background glow */}
      <div className="bg-glow" />

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">SyncUp</h1>

        <div className="nav-buttons">
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="signup-btn"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">

        <h1 className="hero-title">
          Find Projects.<br />
          Find Teammates.<br />
          Build Together.
        </h1>

        <p className="hero-subtitle">
          A premium student collaboration platform to discover projects,
          form teams, and build real-world products with clarity and speed.
        </p>

        <button
          className="hero-btn"
          onClick={() => navigate("/signup")}
        >
          Start Your Project Now
        </button>

      </div>

    </div>
  );
}
/* =========================
   GLOBAL BACKGROUND
========================= */

.landing-container {
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
  color: #ffffff;

  background: linear-gradient(135deg, #0b1020 0%, #0f172a 45%, #050814 100%);
}

/* =========================
   BACKGROUND GLOW (SUBTLE AURORA)
========================= */

.bg-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(79, 140, 255, 0.25), transparent 55%),
    radial-gradient(circle at 80% 30%, rgba(236, 72, 153, 0.18), transparent 60%),
    radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.12), transparent 60%);
  z-index: 0;
}

/* =========================
   NAVBAR
========================= */

.navbar {
  padding: 20px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;

  backdrop-filter: blur(10px);
}

.logo {
  font-size: 2.2rem;
  font-weight: 800;

  background: linear-gradient(90deg, #ec4899, #4f8cff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* =========================
   NAV BUTTONS
========================= */

.nav-buttons {
  display: flex;
  gap: 12px;
}

.login-btn {
  padding: 12px 26px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e5e7eb;
  border-radius: 999px;
  cursor: pointer;
  transition: 0.2s;
}

.login-btn:hover {
  border-color: #4f8cff;
  box-shadow: 0 0 12px rgba(79, 140, 255, 0.25);
  transform: translateY(-1px);
}

.signup-btn {
  padding: 12px 30px;
  border-radius: 999px;
  border: none;
  cursor: pointer;

  background: linear-gradient(135deg, #ec4899, #4f8cff);
  color: white;
  font-weight: 600;

  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.25);
  transition: 0.25s;
}

.signup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(79, 140, 255, 0.25);
}

/* =========================
   HERO SECTION
========================= */

.hero {
  position: relative;
  z-index: 2;
  max-width: 950px;
  margin: 150px auto 0;
  text-align: center;
  padding: 0 20px;
}

.hero-title {
  font-size: 4.2rem;
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -1px;
}

.hero-subtitle {
  margin-top: 22px;
  font-size: 1.2rem;
  color: #b7c0d1;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* =========================
   CTA BUTTON
========================= */

.hero-btn {
  margin-top: 45px;
  padding: 16px 46px;
  font-size: 1.1rem;

  border-radius: 999px;
  border: none;
  cursor: pointer;

  color: white;
  font-weight: 600;

  background: linear-gradient(135deg, #ec4899, #4f8cff);
  box-shadow: 0 15px 40px rgba(79, 140, 255, 0.25);

  transition: 0.25s ease;
}

.hero-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 50px rgba(236, 72, 153, 0.25);
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.8rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero {
    margin-top: 110px;
  }
}


import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          Sync<span>Up</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>

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
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-left">

          <h1>
            Find the perfect team.
            <br />
            Build your next
            <span> Startup.</span>
          </h1>

          <p>
            SyncUp connects students with projects, teammates,
            hackathons and innovative ideas.
            Build together. Learn together. Grow together.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/projects")}
            >
              Explore Projects
            </button>
          </div>

        </div>

        <div className="hero-right">

          <div className="glass-card">

            <h3>Campus Collaboration</h3>

            <div className="mini-card">
              <h4>AI Healthcare App</h4>
              <p>Looking for UI Designer</p>
            </div>

            <div className="mini-card">
              <h4>Smart Attendance</h4>
              <p>Need React Developer</p>
            </div>

            <div className="mini-card">
              <h4>Startup Pitch</h4>
              <p>Marketing Partner Required</p>
            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="features" id="features">

        <h2>Why SyncUp?</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <h3>🚀 Projects</h3>
            <p>
              Discover innovative college projects from students.
            </p>
          </div>

          <div className="feature-card">
            <h3>🤝 Team Matching</h3>
            <p>
              Find teammates based on interests and skills.
            </p>
          </div>

          <div className="feature-card">
            <h3>💬 Real-time Chat</h3>
            <p>
              Communicate instantly with project members.
            </p>
          </div>

          <div className="feature-card">
            <h3>🏆 Hackathons</h3>
            <p>
              Join exciting competitions and startup events.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

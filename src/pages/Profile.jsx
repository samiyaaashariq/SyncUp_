import React, { useState } from "react";
import { auth } from "../firebase";

export default function Profile() {
  const user = auth.currentUser;

  const [skills, setSkills] = useState([
    "React",
    "Firebase",
    "JavaScript",
    "Python",
    "AI",
    "Web Development",
    "UI/UX",
    "GitHub",
  ]);

  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (!newSkill.trim()) return;

    setSkills([...skills, newSkill]);
    setNewSkill("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Inter, sans-serif",
        background: "#0b1120",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#111827",
          padding: "30px",
          borderRadius: "20px",
          border: "1px solid #1e293b",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* PROFILE HEADER */}

        <h1
          style={{
            fontSize: "36px",
            fontWeight: "900",
            background: "linear-gradient(90deg, #22d3ee, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "10px",
          }}
        >
          👤 Samiya Shariq
        </h1>

        <h3
          style={{
            color: "#22d3ee",
            marginBottom: "10px",
          }}
        >
          🎓 B.Tech CSE Student
        </h3>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: "1.8",
            marginBottom: "15px",
          }}
        >
          💡 Passionate about AI, Web Development, Startups,
          Innovation, and Product Building.
        </p>

        <p
          style={{
            fontSize: "15px",
            color: "#94a3b8",
            marginBottom: "25px",
          }}
        >
          📧 {user?.email}
        </p>

        {/* ACTIVITY OVERVIEW */}

        <h2
          style={{
            marginBottom: "15px",
            fontWeight: "800",
            color: "#22d3ee",
          }}
        >
          Activity Overview
        </h2>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #22d3ee",
              padding: "20px",
              borderRadius: "14px",
              minWidth: "180px",
            }}
          >
            <h2 style={{ color: "#22d3ee" }}>5</h2>
            <p>🚀 Projects Created</p>
          </div>

          <div
            style={{
              background: "#0f172a",
              border: "1px solid #22d3ee",
              padding: "20px",
              borderRadius: "14px",
              minWidth: "180px",
            }}
          >
            <h2 style={{ color: "#22d3ee" }}>3</h2>
            <p>👥 Collaborations</p>
          </div>

          <div
            style={{
              background: "#0f172a",
              border: "1px solid #22d3ee",
              padding: "20px",
              borderRadius: "14px",
              minWidth: "180px",
            }}
          >
            <h2 style={{ color: "#22d3ee" }}>8</h2>
            <p>🛠 Skills</p>
          </div>

          <div
            style={{
              background: "#0f172a",
              border: "1px solid #22d3ee",
              padding: "20px",
              borderRadius: "14px",
              minWidth: "180px",
            }}
          >
            <h2 style={{ color: "#22d3ee" }}>4</h2>
            <p>🏆 Achievements</p>
          </div>
        </div>

        {/* SKILLS */}

        <h2
          style={{
            marginBottom: "15px",
            fontWeight: "800",
            color: "#22d3ee",
          }}
        >
          Skills
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {skills.map((skill, index) => (
            <span
              key={index}
              style={{
                background: "#164e63",
                color: "#22d3ee",
                padding: "8px 14px",
                borderRadius: "20px",
                fontWeight: "600",
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        <div style={{ marginTop: "15px" }}>
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add skill"
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#ffffff",
              marginRight: "10px",
            }}
          />

          <button
            onClick={addSkill}
            style={{
              padding: "10px 16px",
              background: "#22d3ee",
              color: "#0f172a",
              border: "none",
              borderRadius: "8px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Add Skill
          </button>
        </div>

        {/* PORTFOLIO */}

        <h2
          style={{
            marginTop: "30px",
            marginBottom: "15px",
            fontWeight: "800",
            color: "#22d3ee",
          }}
        >
          Portfolio
        </h2>

        <ul style={{ lineHeight: "2", color: "#cbd5e1" }}>
          <li>GitHub: github.com/your-profile</li>
          <li>LinkedIn: linkedin.com/in/your-profile</li>
          <li>Portfolio Website: Coming Soon</li>
        </ul>

        {/* CURRENT PROJECT */}

        <h2
          style={{
            marginTop: "30px",
            marginBottom: "15px",
            fontWeight: "800",
            color: "#22d3ee",
          }}
        >
          📌 Current Project
        </h2>

        <div
          style={{
            background: "#0f172a",
            border: "1px solid #22d3ee",
            padding: "20px",
            borderRadius: "14px",
          }}
        >
          <h3 style={{ color: "#22d3ee" }}>SyncUp</h3>

          <p style={{ color: "#cbd5e1" }}>
            A student collaboration platform that helps students
            find teammates, discover projects, and build real-world
            experience together.
          </p>
        </div>

        {/* ACHIEVEMENTS */}

        <h2
          style={{
            marginTop: "30px",
            marginBottom: "15px",
            fontWeight: "800",
            color: "#22d3ee",
          }}
        >
          Achievements
        </h2>

        <ul style={{ lineHeight: "2", color: "#cbd5e1" }}>
          <li>CodeAlpha Python Intern</li>
          <li>MLSA Community Member</li>
          <li>Building SyncUp Platform</li>
          <li>Open Source Learner</li>
        </ul>
      </div>
    </div>
  );
}

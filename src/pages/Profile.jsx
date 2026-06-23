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
        background: "linear-gradient(135deg,#ffe4ec,#ffffff,#fff0f5)",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* PROFILE HEADER */}

        <h1
          style={{
            fontSize: "36px",
            fontWeight: "900",
            marginBottom: "10px",
          }}
        >
          👤 Samiya Shariq
        </h1>

        <h3
          style={{
            color: "#0ea5e9",
            marginBottom: "10px",
          }}
        >
          🎓 B.Tech CSE Student
        </h3>

        <p
          style={{
            color: "#475569",
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
            color: "#64748b",
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
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "14px",
              minWidth: "180px",
            }}
          >
            <h2>5</h2>
            <p>🚀 Projects Created</p>
          </div>

          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "14px",
              minWidth: "180px",
            }}
          >
            <h2>3</h2>
            <p>👥 Collaborations</p>
          </div>

          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "14px",
              minWidth: "180px",
            }}
          >
            <h2>8</h2>
            <p>🛠 Skills</p>
          </div>

          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "14px",
              minWidth: "180px",
            }}
          >
            <h2>4</h2>
            <p>🏆 Achievements</p>
          </div>
        </div>

        {/* SKILLS */}

        <h2
          style={{
            marginBottom: "15px",
            fontWeight: "800",
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
                background: "#e0f2fe",
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
              border: "1px solid #d1d5db",
              marginRight: "10px",
            }}
          />

          <button
            onClick={addSkill}
            style={{
              padding: "10px 16px",
              background: "#0ea5e9",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
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
          }}
        >
          Portfolio
        </h2>

        <ul style={{ lineHeight: "2" }}>
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
          }}
        >
          📌 Current Project
        </h2>

        <div
          style={{
            background: "#f8fafc",
            padding: "20px",
            borderRadius: "14px",
          }}
        >
          <h3>SyncUp</h3>

          <p>
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
          }}
        >
          Achievements
        </h2>

        <ul style={{ lineHeight: "2" }}>
          <li>CodeAlpha Python Intern</li>
          <li>MLSA Community Member</li>
          <li>Building SyncUp Platform</li>
          <li>Open Source Learner</li>
        </ul>
      </div>
    </div>
  );
}
